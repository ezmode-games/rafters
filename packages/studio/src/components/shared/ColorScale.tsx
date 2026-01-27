/**
 * Color Scale
 *
 * Row of 48px boxes showing a color's generated scale (50-950).
 * No labels by default. Hover shows scale position as tooltip.
 */

import { type OKLCH, oklchToHex } from '../../utils/color-conversion';

interface ColorScaleProps {
  scale: OKLCH[];
  size?: number;
  labels?: string[];
}

const DEFAULT_LABELS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

export function ColorScale({ scale, size = 48, labels = DEFAULT_LABELS }: ColorScaleProps) {
  return (
    <div className="flex items-center gap-0.5">
      {scale.map((color, i) => {
        let hex: string;
        try {
          hex = oklchToHex(color);
        } catch {
          hex = '#808080';
        }
        return (
          <div
            key={labels[i] ?? `scale-${i}`}
            className="group/swatch relative rounded-md transition-transform hover:scale-110"
            style={{
              width: size,
              height: size,
              backgroundColor: hex,
            }}
          >
            {labels[i] && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover/swatch:opacity-100">
                {labels[i]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
