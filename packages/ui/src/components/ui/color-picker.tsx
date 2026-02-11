/**
 * OKLCH color picker with 2D lightness/chroma area, hue bar, numeric inputs, and preview
 *
 * @cognitive-load 5/10 - Multi-surface color selection with visual feedback
 * @attention-economics Spatial color: area for L/C, bar for hue, inputs for precision, preview for confirmation
 * @trust-building Immediate visual feedback, gamut tier indicator, precise numeric entry
 * @accessibility Full keyboard navigation, screen reader support, gamut tier announcements
 * @semantic-meaning Color selection: design tools, theming, customization
 *
 * @usage-patterns
 * DO: Show gamut tier to indicate color reproducibility
 * DO: Provide numeric inputs for precise color entry
 * DO: Give immediate visual feedback on color changes
 * DO: Support both pointer and keyboard interaction
 * NEVER: Hide the preview swatch, disable keyboard navigation, ignore gamut boundaries
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   defaultValue={{ l: 0.7, c: 0.15, h: 250 }}
 *   onValueChange={(color) => console.log(color)}
 * />
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';
import { createColorArea, updateColorArea } from '../../primitives/color-area';
import type { ColorInputField } from '../../primitives/color-input';
import { createColorInput, updateColorInput } from '../../primitives/color-input';
import { createSwatch, updateSwatch } from '../../primitives/color-swatch';
import { createHueBar, updateHueBar } from '../../primitives/hue-bar';
import { createInteractive } from '../../primitives/interactive';
import { inP3, inSrgb } from '../../primitives/oklch-gamut';
import type {
  CleanupFunction,
  Direction,
  GamutTier,
  MoveDelta,
  NormalizedPoint,
  OklchColor,
} from '../../primitives/types';

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Controlled OKLCH color value */
  value?: OklchColor;
  /** Default color for uncontrolled usage */
  defaultValue?: OklchColor;
  /** Called on every color change (pointer move, keyboard, input) */
  onValueChange?: (color: OklchColor) => void;
  /** Called when a change is committed (pointer up, input blur/Enter) */
  onValueCommit?: (color: OklchColor) => void;
  /** Maximum chroma for the area y-axis @default 0.4 */
  maxChroma?: number;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Text direction for RTL support */
  dir?: Direction;
}

const DEFAULT_COLOR: OklchColor = { l: 0.7, c: 0.15, h: 250 };
const DEFAULT_MAX_CHROMA = 0.4;

const INPUT_CLASS =
  'w-full min-w-0 rounded-md border border-border bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-ring';

const GAMUT_LABELS: Record<GamutTier, string> = {
  gold: 'sRGB',
  silver: 'P3',
  fail: 'Out of gamut',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getGamutTier(l: number, c: number, h: number): GamutTier {
  if (inSrgb(l, c, h)) return 'gold';
  if (inP3(l, c, h)) return 'silver';
  return 'fail';
}

/** Resolve a keyboard delta to a clamped absolute value */
function resolveKeyDelta(current: number, delta: number, scale: number, max: number): number {
  if (Number.isFinite(delta)) {
    return clamp(current + delta * scale, 0, max);
  }
  return delta < 0 ? 0 : max;
}

function buildInputFields(
  lInput: HTMLInputElement,
  cInput: HTMLInputElement,
  hInput: HTMLInputElement,
): ColorInputField[] {
  return [
    { element: lInput, channel: 'l' },
    { element: cInput, channel: 'c' },
    { element: hInput, channel: 'h' },
  ];
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = DEFAULT_COLOR,
      onValueChange,
      onValueCommit,
      maxChroma = DEFAULT_MAX_CHROMA,
      disabled = false,
      dir,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const color = isControlled ? controlledValue : uncontrolled;
    const safeMaxChroma = Math.max(maxChroma, 1e-6);

    // Refs for DOM elements
    const areaCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const areaContainerRef = React.useRef<HTMLDivElement>(null);
    const hueCanvasRef = React.useRef<HTMLCanvasElement>(null);
    const hueContainerRef = React.useRef<HTMLDivElement>(null);
    const lInputRef = React.useRef<HTMLInputElement>(null);
    const cInputRef = React.useRef<HTMLInputElement>(null);
    const hInputRef = React.useRef<HTMLInputElement>(null);
    const areaThumbRef = React.useRef<HTMLDivElement>(null);
    const hueThumbRef = React.useRef<HTMLDivElement>(null);
    const previewRef = React.useRef<HTMLDivElement>(null);

    // Refs for latest callbacks to avoid stale closures in primitives
    const callbacksRef = React.useRef({ onValueChange, onValueCommit });
    callbacksRef.current = { onValueChange, onValueCommit };

    // Ref for latest color to avoid stale closures
    const colorRef = React.useRef(color);
    colorRef.current = color;

    // Ref for maxChroma
    const maxChromaRef = React.useRef(safeMaxChroma);
    maxChromaRef.current = safeMaxChroma;

    // Stable update function
    const updateColor = React.useCallback(
      (newColor: OklchColor) => {
        colorRef.current = newColor;
        if (!isControlled) {
          setUncontrolled(newColor);
        }
        callbacksRef.current.onValueChange?.(newColor);
      },
      [isControlled],
    );

    // -------------------------------------------------------------------------
    // Primitive lifecycle: mount/unmount
    // -------------------------------------------------------------------------
    React.useEffect(() => {
      const areaCanvas = areaCanvasRef.current;
      const areaContainer = areaContainerRef.current;
      const hueCanvas = hueCanvasRef.current;
      const hueContainer = hueContainerRef.current;
      const lInput = lInputRef.current;
      const cInput = cInputRef.current;
      const hInput = hInputRef.current;
      const areaThumb = areaThumbRef.current;
      const hueThumb = hueThumbRef.current;
      const preview = previewRef.current;

      if (
        !areaCanvas ||
        !areaContainer ||
        !hueCanvas ||
        !hueContainer ||
        !lInput ||
        !cInput ||
        !hInput ||
        !areaThumb ||
        !hueThumb ||
        !preview
      ) {
        return;
      }

      const cleanups: CleanupFunction[] = [];
      const dirOption = dir !== undefined ? { dir } : {};

      // Area interactive (2D)
      cleanups.push(
        createInteractive(areaContainer, {
          mode: '2d',
          disabled,
          ...dirOption,
          onMove: (point: NormalizedPoint) => {
            const mc = maxChromaRef.current;
            updateColor({ l: point.left, c: (1 - point.top) * mc, h: colorRef.current.h });
          },
          onKeyMove: (delta: MoveDelta) => {
            const cur = colorRef.current;
            const mc = maxChromaRef.current;
            const newL = resolveKeyDelta(cur.l, delta.dLeft, 1, 1);
            const newC = resolveKeyDelta(cur.c, -delta.dTop, mc, mc);
            updateColor({ l: newL, c: newC, h: cur.h });
          },
        }),
      );

      // Hue interactive (1D horizontal)
      cleanups.push(
        createInteractive(hueContainer, {
          mode: '1d-horizontal',
          disabled,
          ...dirOption,
          onMove: (point: NormalizedPoint) => {
            updateColor({ ...colorRef.current, h: point.left * 360 });
          },
          onKeyMove: (delta: MoveDelta) => {
            const cur = colorRef.current;
            const newH = resolveKeyDelta(cur.h, delta.dLeft, 360, 360);
            updateColor({ ...cur, h: newH });
          },
        }),
      );

      // ARIA attributes (set after createInteractive adds roles)
      hueContainer.setAttribute('aria-valuemin', '0');
      hueContainer.setAttribute('aria-valuemax', '360');
      hueContainer.setAttribute('aria-valuenow', String(Math.round(colorRef.current.h)));
      hueContainer.setAttribute('aria-label', 'Hue');
      areaContainer.setAttribute('aria-label', 'Lightness and chroma');

      // Color area canvas
      cleanups.push(
        createColorArea(areaCanvas, { hue: colorRef.current.h, maxChroma: maxChromaRef.current }),
      );

      // Hue bar canvas
      cleanups.push(
        createHueBar(hueCanvas, {
          lightness: colorRef.current.l,
          chroma: colorRef.current.c,
        }),
      );

      // Color inputs
      const fields = buildInputFields(lInput, cInput, hInput);
      cleanups.push(
        createColorInput(fields, {
          value: colorRef.current,
          onChange: (newColor) => updateColor(newColor),
          onCommit: (newColor) => {
            updateColor(newColor);
            queueMicrotask(() => {
              callbacksRef.current.onValueCommit?.(newColor);
            });
          },
        }),
      );

      // Swatches (area thumb, hue thumb, preview)
      const cur = colorRef.current;
      const tier = getGamutTier(cur.l, cur.c, cur.h);
      const swatchState = { l: cur.l, c: cur.c, h: cur.h, tier };
      for (const el of [areaThumb, hueThumb, preview]) {
        cleanups.push(createSwatch(el, swatchState));
      }

      // Pointer commit: attach document-level listeners on pointerdown so
      // drag-release outside the container still fires onValueCommit.
      const handleCommit = () => {
        callbacksRef.current.onValueCommit?.(colorRef.current);
        document.removeEventListener('mouseup', handleCommit);
        document.removeEventListener('touchend', handleCommit);
      };
      const handlePointerDown = () => {
        document.addEventListener('mouseup', handleCommit);
        document.addEventListener('touchend', handleCommit);
      };
      for (const container of [areaContainer, hueContainer]) {
        container.addEventListener('mousedown', handlePointerDown);
        container.addEventListener('touchstart', handlePointerDown);
      }
      cleanups.push(() => {
        for (const container of [areaContainer, hueContainer]) {
          container.removeEventListener('mousedown', handlePointerDown);
          container.removeEventListener('touchstart', handlePointerDown);
        }
        document.removeEventListener('mouseup', handleCommit);
        document.removeEventListener('touchend', handleCommit);
      });

      return () => {
        for (const cleanup of cleanups) {
          cleanup();
        }
      };
    }, [disabled, dir, updateColor]);

    // -------------------------------------------------------------------------
    // Primitive updates: area canvas only repaints when hue/maxChroma changes
    // -------------------------------------------------------------------------
    React.useEffect(() => {
      const areaCanvas = areaCanvasRef.current;
      if (areaCanvas) {
        updateColorArea(areaCanvas, { hue: color.h, maxChroma: safeMaxChroma });
      }
    }, [color.h, safeMaxChroma]);

    // -------------------------------------------------------------------------
    // Primitive updates: sync inputs, swatches, hue bar on any color change
    // -------------------------------------------------------------------------
    React.useEffect(() => {
      const hueCanvas = hueCanvasRef.current;
      const hueContainer = hueContainerRef.current;
      const lInput = lInputRef.current;
      const cInput = cInputRef.current;
      const hInput = hInputRef.current;
      const areaThumb = areaThumbRef.current;
      const hueThumb = hueThumbRef.current;
      const preview = previewRef.current;

      if (
        !hueCanvas ||
        !hueContainer ||
        !lInput ||
        !cInput ||
        !hInput ||
        !areaThumb ||
        !hueThumb ||
        !preview
      ) {
        return;
      }

      updateHueBar(hueCanvas, { lightness: color.l, chroma: color.c });

      const fields = buildInputFields(lInput, cInput, hInput);
      updateColorInput(fields, {
        value: { l: color.l, c: color.c, h: color.h },
        onChange: () => {},
      });

      const tier = getGamutTier(color.l, color.c, color.h);
      const swatchState = { l: color.l, c: color.c, h: color.h, tier };
      for (const el of [areaThumb, hueThumb, preview]) {
        updateSwatch(el, swatchState);
      }

      hueContainer.setAttribute('aria-valuenow', String(Math.round(color.h)));
    }, [color.l, color.c, color.h]);

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    const gamutTier = getGamutTier(color.l, color.c, color.h);

    const containerClasses = classy(
      'flex w-full flex-col',
      {
        'opacity-50 pointer-events-none': disabled,
      },
      className,
    );

    return (
      // biome-ignore lint/a11y/useSemanticElements: fieldset adds unwanted default styling; role="group" on div is standard for composite widgets
      <div
        ref={ref}
        role="group"
        aria-label="Color picker"
        aria-disabled={disabled || undefined}
        className={containerClasses}
        {...props}
      >
        {/* Color area (2D: lightness x chroma) */}
        <div
          ref={areaContainerRef}
          className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-lg"
        >
          <canvas ref={areaCanvasRef} className="absolute inset-0 h-full w-full" />
          <div
            ref={areaThumbRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
            style={{
              left: `${color.l * 100}%`,
              top: `${(1 - color.c / safeMaxChroma) * 100}%`,
            }}
          />
        </div>

        {/* Hue bar (1D: hue spectrum) */}
        <div
          ref={hueContainerRef}
          className="relative mt-3 h-4 w-full cursor-pointer overflow-hidden rounded-full"
        >
          <canvas ref={hueCanvasRef} className="absolute inset-0 h-full w-full" />
          <div
            ref={hueThumbRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
            style={{
              left: `${(color.h / 360) * 100}%`,
            }}
          />
        </div>

        {/* Numeric inputs */}
        <div className="mt-3 flex gap-2">
          <input ref={lInputRef} className={INPUT_CLASS} disabled={disabled} />
          <input ref={cInputRef} className={INPUT_CLASS} disabled={disabled} />
          <input ref={hInputRef} className={INPUT_CLASS} disabled={disabled} />
        </div>

        {/* Preview swatch */}
        <div className="mt-3 flex items-center gap-2">
          <div
            ref={previewRef}
            className="h-8 w-8 rounded-md border border-border"
            data-gamut-tier={gamutTier}
          />
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            {GAMUT_LABELS[gamutTier]}
          </span>
        </div>
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
