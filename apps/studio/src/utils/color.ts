/**
 * Lightweight client-side color utilities for Rafters Studio
 * For instant feedback in the UI - heavy operations happen server-side
 */

export interface OKLCH {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0+)
  h: number; // Hue (0-360)
  alpha?: number; // Alpha (0-1)
}

/**
 * Quick and dirty hex to OKLCH conversion for real-time preview
 * This is simplified - the server has the accurate conversion
 */
export function hexToOKLCH(hex: string): OKLCH {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Convert hex to RGB
  const r = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;

  // Simplified RGB to OKLCH approximation for preview
  const l = (r + g + b) / 3; // Very basic lightness
  const c = Math.sqrt((r - g) ** 2 + (g - b) ** 2 + (b - r) ** 2) / Math.sqrt(3);
  const h = Math.atan2(g - r, b - r) * (180 / Math.PI);

  return {
    l: Math.max(0, Math.min(1, l)),
    c: Math.max(0, c),
    h: h < 0 ? h + 360 : h,
  };
}

/**
 * Format OKLCH for display
 */
export function formatOKLCH(oklch: OKLCH): string {
  return `OKLCH(${oklch.l.toFixed(3)}, ${oklch.c.toFixed(3)}, ${oklch.h.toFixed(1)})`;
}

/**
 * Generate a simple color scale from a base color (client-side preview)
 * This is simplified - the server will generate the proper perceptually uniform scale
 */
export function generateSimpleScale(baseHex: string): string[] {
  const baseRgb = hexToRgb(baseHex);
  const scale: string[] = [];

  // Generate 5 shades: 2 lighter, base, 2 darker
  const steps = [0.8, 0.4, 0, -0.4, -0.8]; // Lightness adjustments

  for (const step of steps) {
    const adjustedRgb = {
      r: Math.max(0, Math.min(255, baseRgb.r + step * 100)),
      g: Math.max(0, Math.min(255, baseRgb.g + step * 100)),
      b: Math.max(0, Math.min(255, baseRgb.b + step * 100)),
    };

    scale.push(rgbToHex(adjustedRgb));
  }

  return scale;
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  return {
    r: Number.parseInt(cleanHex.slice(0, 2), 16),
    g: Number.parseInt(cleanHex.slice(2, 4), 16),
    b: Number.parseInt(cleanHex.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((x) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join('')}`;
}
