/**
 * Spectrum Color Picker
 *
 * Full spectrum view using react-colorful.
 * Single click to pick color - no sliders, no LCH controls.
 */

import { HexColorPicker } from 'react-colorful';
import type { Token } from '../api/token-loader';
import { useColorPicker } from '../hooks/useColorPicker';
import {
  hexToOKLCH,
  isInGamut,
  type OKLCH,
  oklchToCSS,
  roundOKLCH,
} from '../utils/color-conversion';

interface SpectrumPickerProps {
  token: Token | null;
  onColorChange: (oklch: OKLCH) => void;
}

export function SpectrumPicker({ token, onColorChange }: SpectrumPickerProps) {
  const { hexColor, oklchColor, previewHex, setPreviewHex, confirmColor } = useColorPicker({
    token,
    onColorChange,
  });

  // Display color is preview (hover) or current
  const displayHex = previewHex || hexColor;
  const displayOklch = previewHex ? roundOKLCH(hexToOKLCH(previewHex)) : roundOKLCH(oklchColor);
  const displayInGamut = isInGamut(displayOklch);

  return (
    <div className="space-y-4">
      {/* Spectrum picker */}
      <div className="picker-container">
        <HexColorPicker
          color={displayHex}
          onChange={(hex) => {
            // Update preview as user drags/hovers
            setPreviewHex(hex);
          }}
        />
      </div>

      {/* Color info display */}
      <div className="space-y-3">
        {/* Current vs Preview indicator */}
        <div className="flex gap-2">
          <ColorSwatch
            hex={hexColor}
            label="Current"
            isActive={!previewHex}
            onClick={() => setPreviewHex(null)}
          />
          {previewHex && (
            <ColorSwatch
              hex={previewHex}
              label="Preview"
              isActive={true}
              onClick={() => confirmColor(previewHex)}
            />
          )}
        </div>

        {/* OKLCH values display */}
        <div className="rounded-md bg-neutral-50 p-3">
          <div className="grid grid-cols-4 gap-2 text-center">
            <OklchValue label="L" value={displayOklch.l.toFixed(3)} />
            <OklchValue label="C" value={displayOklch.c.toFixed(3)} />
            <OklchValue label="H" value={`${displayOklch.h}deg`} />
            <div>
              <span className="text-xs text-neutral-500">Gamut</span>
              <div
                className={`text-sm font-mono ${displayInGamut ? 'text-green-600' : 'text-amber-600'}`}
              >
                {displayInGamut ? 'sRGB' : 'Out'}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center font-mono text-xs text-neutral-500">
            {oklchToCSS(displayOklch)}
          </div>
        </div>

        {/* Apply button */}
        {previewHex && previewHex !== hexColor && (
          <button
            type="button"
            onClick={() => confirmColor(previewHex)}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Apply Color
          </button>
        )}
      </div>

      {/* Custom styles for react-colorful */}
      <style>{`
        .picker-container .react-colorful {
          width: 100%;
          height: 200px;
          border-radius: 8px;
        }
        .picker-container .react-colorful__saturation {
          border-radius: 8px 8px 0 0;
        }
        .picker-container .react-colorful__hue {
          height: 24px;
          border-radius: 0 0 8px 8px;
        }
        .picker-container .react-colorful__pointer {
          width: 20px;
          height: 20px;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

function ColorSwatch({
  hex,
  label,
  isActive,
  onClick,
}: {
  hex: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center gap-2 rounded-md border p-2 transition-colors ${
        isActive ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div
        className="h-8 w-8 shrink-0 rounded border border-neutral-200"
        style={{ backgroundColor: hex }}
      />
      <div className="text-left">
        <span className="block text-xs text-neutral-500">{label}</span>
        <span className="font-mono text-sm">{hex}</span>
      </div>
    </button>
  );
}

function OklchValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-neutral-500">{label}</span>
      <div className="font-mono text-sm">{value}</div>
    </div>
  );
}
