/**
 * Ratio Combobox
 *
 * Combobox for selecting a modular scale ratio.
 * Musical presets + custom decimal input.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface RatioOption {
  label: string;
  value: number;
}

const RATIO_PRESETS: RatioOption[] = [
  { label: 'Minor second', value: 1.067 },
  { label: 'Major second', value: 1.125 },
  { label: 'Minor third', value: 1.2 },
  { label: 'Major third', value: 1.25 },
  { label: 'Perfect fourth', value: 1.333 },
  // biome-ignore lint/suspicious/noApproximativeNumericConstant: musical ratio, not Math.SQRT2
  { label: 'Augmented fourth', value: 1.414 },
  { label: 'Perfect fifth', value: 1.5 },
  { label: 'Golden ratio', value: 1.618 },
];

interface RatioComboboxProps {
  value: number;
  onChange: (ratio: number) => void;
  onHover?: (ratio: number | null) => void;
}

export function RatioCombobox({ value, onChange, onHover }: RatioComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with external value
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = useCallback(
    (ratio: number) => {
      setInputValue(String(ratio));
      onChange(ratio);
      setOpen(false);
    },
    [onChange],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleInputBlur = useCallback(() => {
    const parsed = Number.parseFloat(inputValue);
    if (!Number.isNaN(parsed) && parsed > 1 && parsed < 3) {
      onChange(parsed);
    } else {
      setInputValue(String(value));
    }
  }, [inputValue, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleInputBlur();
        setOpen(false);
      } else if (e.key === 'Escape') {
        setInputValue(String(value));
        setOpen(false);
      }
    },
    [handleInputBlur, value],
  );

  const currentPreset = RATIO_PRESETS.find((p) => Math.abs(p.value - value) < 0.001);

  return (
    <div ref={containerRef} className="relative w-64">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={[
            'w-20 rounded-lg border border-neutral-200 px-3 py-2',
            'text-sm text-neutral-900',
            'focus:border-neutral-400 focus:outline-none',
          ].join(' ')}
        />
        {currentPreset && <span className="text-sm text-neutral-400">{currentPreset.label}</span>}
      </div>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {RATIO_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={[
                'flex w-full items-center justify-between px-3 py-2 text-left text-sm',
                Math.abs(preset.value - value) < 0.001
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50',
              ].join(' ')}
              onMouseDown={() => handleSelect(preset.value)}
              onMouseEnter={() => onHover?.(preset.value)}
              onMouseLeave={() => onHover?.(null)}
            >
              <span>{preset.label}</span>
              <span className="text-neutral-400">{preset.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
