/**
 * Spacing Token Editor
 *
 * Visual editor for spacing tokens with live size preview.
 */

import { useEffect, useState } from 'react';
import type { Token } from '../api/token-loader';

interface SpacingEditorProps {
  token: Token;
  onValueChange: (value: string) => void;
}

// Common spacing presets for quick selection
const SPACING_PRESETS = [
  { label: 'xs', value: '0.25rem' },
  { label: 'sm', value: '0.5rem' },
  { label: 'md', value: '1rem' },
  { label: 'lg', value: '1.5rem' },
  { label: 'xl', value: '2rem' },
  { label: '2xl', value: '3rem' },
];

/**
 * Parse a spacing value to get numeric value and unit
 */
function parseSpacing(value: string): { num: number; unit: string } | null {
  const match = String(value).match(/^(-?[\d.]+)(rem|px|em|%)$/);
  if (!match) return null;
  return { num: Number.parseFloat(match[1]), unit: match[2] };
}

/**
 * Convert to pixels for visual preview (assuming 16px base)
 */
function toPixels(value: string): number {
  const parsed = parseSpacing(value);
  if (!parsed) return 0;

  switch (parsed.unit) {
    case 'rem':
    case 'em':
      return parsed.num * 16;
    case 'px':
      return parsed.num;
    case '%':
      return (parsed.num / 100) * 100; // Preview as percentage of 100px
    default:
      return 0;
  }
}

export function SpacingEditor({ token, onValueChange }: SpacingEditorProps) {
  // Get initial value from token
  const initialValue = typeof token.value === 'string' ? token.value : '1rem';
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);

  // Parse for display
  const parsed = parseSpacing(value);
  const pixels = toPixels(value);
  const isValid = parsed !== null;

  // Update when token changes
  useEffect(() => {
    const newValue = typeof token.value === 'string' ? token.value : '1rem';
    setValue(newValue);
    setInputValue(newValue);
  }, [token.value]);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);

    // Only update if valid
    if (parseSpacing(newValue)) {
      setValue(newValue);
      onValueChange(newValue);
    }
  };

  // Handle preset click
  const handlePresetClick = (presetValue: string) => {
    setValue(presetValue);
    setInputValue(presetValue);
    onValueChange(presetValue);
  };

  // Handle slider change (for rem values)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseFloat(e.target.value);
    const newValue = `${num}rem`;
    setValue(newValue);
    setInputValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Visual preview */}
      <div className="rounded-md bg-neutral-50 p-4">
        <p className="mb-2 text-xs font-medium text-neutral-500">Preview</p>
        <div className="flex items-center gap-4">
          {/* Horizontal spacing preview */}
          <div className="flex-1">
            <div className="relative h-8 rounded bg-neutral-200">
              <div
                className="absolute left-0 top-0 h-full rounded bg-blue-500 transition-all"
                style={{ width: Math.min(pixels, 200) }}
              />
            </div>
          </div>
          {/* Box preview */}
          <div
            className="rounded border-2 border-dashed border-blue-300 bg-blue-100"
            style={{
              width: Math.min(pixels, 100) + 40,
              height: Math.min(pixels, 100) + 40,
              padding: Math.min(pixels / 2, 50),
            }}
          >
            <div className="h-full w-full rounded bg-blue-500" />
          </div>
        </div>
        <p className="mt-2 text-center font-mono text-sm text-neutral-600">
          {value} = {pixels.toFixed(0)}px
        </p>
      </div>

      {/* Input with unit */}
      <div>
        <label htmlFor="spacing-input" className="mb-1 block text-sm font-medium text-neutral-700">
          Value
        </label>
        <input
          id="spacing-input"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 font-mono text-sm ${
            isValid
              ? 'border-neutral-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              : 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          }`}
          placeholder="e.g., 1rem, 16px"
        />
        {!isValid && (
          <p className="mt-1 text-xs text-red-600">
            Enter a valid spacing value (e.g., 1rem, 16px)
          </p>
        )}
      </div>

      {/* Slider for rem values */}
      {parsed?.unit === 'rem' && (
        <div>
          <label
            htmlFor="spacing-slider"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Adjust ({parsed.num.toFixed(2)}rem)
          </label>
          <input
            id="spacing-slider"
            type="range"
            min="0"
            max="4"
            step="0.125"
            value={parsed.num}
            onChange={handleSliderChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200"
          />
        </div>
      )}

      {/* Quick presets */}
      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500">Quick Select</p>
        <div className="flex flex-wrap gap-2">
          {SPACING_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                value === preset.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
