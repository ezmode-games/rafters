/**
 * Color Area primitive
 * Renders a 2D canvas showing Lightness (x-axis) vs Chroma (y-axis)
 * at a fixed hue. Each pixel is painted with its actual OKLCH color
 * if within sRGB or Display P3 gamut, or black if outside both.
 *
 * Framework-agnostic, SSR-safe. The caller provides the canvas element;
 * the primitive handles rendering and ARIA attributes.
 */

import { inP3, inSrgb } from './oklch-gamut';
import type { CleanupFunction } from './types';

export interface ColorAreaOptions {
  /** Fixed hue angle (0-360) for this area slice */
  hue: number;

  /**
   * Maximum chroma value for the y-axis scale.
   * @default 0.4
   */
  maxChroma?: number;

  /** Device pixel ratio override (default: window.devicePixelRatio) */
  dpr?: number;
}

/**
 * Render the Lightness x Chroma surface onto a canvas.
 * Gracefully handles getContext('2d') returning null (e.g. happy-dom).
 * SSR is guarded at the public API boundary (createColorArea/updateColorArea).
 */
function renderArea(canvas: HTMLCanvasElement, options: ColorAreaOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const { hue } = options;
  const maxChroma = options.maxChroma ?? 0.4;
  const dpr = options.dpr ?? window.devicePixelRatio;
  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round(canvas.clientHeight * dpr);

  canvas.width = width;
  canvas.height = height;

  const maxX = width > 1 ? width - 1 : 1;
  const maxY = height > 1 ? height - 1 : 1;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const l = x / maxX; // 0 (black) at left, 1 (white) at right
      const c = (1 - y / maxY) * maxChroma; // maxChroma at top, 0 (gray) at bottom

      if (inSrgb(l, c, hue) || inP3(l, c, hue)) {
        ctx.fillStyle = `oklch(${l} ${c} ${hue})`;
      } else {
        ctx.fillStyle = '#000';
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * Build the ARIA label for a color area at a given hue.
 */
function toAriaLabel(hue: number): string {
  return `Color area for hue ${hue} degrees`;
}

/**
 * Restore an attribute to its previous value, or remove it if it was absent.
 */
function restoreAttribute(element: HTMLElement, name: string, previous: string | null): void {
  if (previous === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, previous);
  }
}

/**
 * Create a color area on a canvas element.
 * Sets ARIA attributes and renders the Lightness x Chroma surface.
 * Returns a cleanup function that restores original state.
 */
export function createColorArea(
  canvas: HTMLCanvasElement,
  options: ColorAreaOptions,
): CleanupFunction {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const prevRole = canvas.getAttribute('role');
  const prevAriaLabel = canvas.getAttribute('aria-label');

  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', toAriaLabel(options.hue));

  renderArea(canvas, options);

  return () => {
    restoreAttribute(canvas, 'role', prevRole);
    restoreAttribute(canvas, 'aria-label', prevAriaLabel);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
}

/**
 * Update an existing color area without teardown/rebuild.
 * Updates ARIA label and re-renders the surface.
 */
export function updateColorArea(canvas: HTMLCanvasElement, options: ColorAreaOptions): void {
  if (typeof window === 'undefined') {
    return;
  }

  canvas.setAttribute('aria-label', toAriaLabel(options.hue));
  renderArea(canvas, options);
}
