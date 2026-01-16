/**
 * Motion Token Editor
 *
 * Visual editor for motion/animation tokens with timing preview.
 */

import { useEffect, useState } from 'react';
import type { Token } from '../api/token-loader';

interface MotionEditorProps {
  token: Token;
  onValueChange: (value: string) => void;
}

// Common duration presets
const DURATION_PRESETS = [
  { label: 'Instant', value: '0ms' },
  { label: 'Fast', value: '150ms' },
  { label: 'Normal', value: '300ms' },
  { label: 'Slow', value: '500ms' },
  { label: 'Very Slow', value: '1000ms' },
];

// Common easing presets
const EASING_PRESETS = [
  { label: 'Linear', value: 'linear' },
  { label: 'Ease', value: 'ease' },
  { label: 'Ease In', value: 'ease-in' },
  { label: 'Ease Out', value: 'ease-out' },
  { label: 'Ease In Out', value: 'ease-in-out' },
];

/**
 * Parse duration value to milliseconds
 */
function parseDuration(value: string): number | null {
  const match = String(value).match(/^([\d.]+)(ms|s)$/);
  if (!match) return null;
  const num = Number.parseFloat(match[1]);
  return match[2] === 's' ? num * 1000 : num;
}

/**
 * Detect if this is a duration or easing token
 */
function detectMotionType(token: Token): 'duration' | 'easing' {
  const value = String(token.value || '');
  if (value.includes('ms') || value.includes('s')) return 'duration';
  if (value === 'linear' || value.includes('ease') || value.startsWith('cubic-bezier')) {
    return 'easing';
  }
  // Default based on name
  if (token.name.toLowerCase().includes('duration')) return 'duration';
  return 'duration';
}

export function MotionEditor({ token, onValueChange }: MotionEditorProps) {
  const motionType = detectMotionType(token);
  const initialValue = typeof token.value === 'string' ? token.value : '300ms';
  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update when token changes
  useEffect(() => {
    const newValue = typeof token.value === 'string' ? token.value : '300ms';
    setValue(newValue);
  }, [token.value]);

  // Handle value change
  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  // Trigger animation preview
  const triggerAnimation = () => {
    setIsAnimating(false);
    // Force reflow
    setTimeout(() => setIsAnimating(true), 10);
  };

  if (motionType === 'duration') {
    return <DurationEditor value={value} onValueChange={handleValueChange} />;
  }

  return (
    <EasingEditor
      value={value}
      onValueChange={handleValueChange}
      isAnimating={isAnimating}
      onAnimate={triggerAnimation}
    />
  );
}

function DurationEditor({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  const ms = parseDuration(value) ?? 300;
  const isValid = parseDuration(inputValue) !== null;

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (parseDuration(newValue) !== null) {
      onValueChange(newValue);
    }
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMs = Number.parseInt(e.target.value, 10);
    const newValue = `${newMs}ms`;
    setInputValue(newValue);
    onValueChange(newValue);
  };

  // Trigger animation
  const triggerAnimation = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 10);
  };

  // Reset animation when it completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), ms + 100);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, ms]);

  return (
    <div className="space-y-4">
      {/* Animation preview */}
      <div className="rounded-md bg-neutral-50 p-4">
        <p className="mb-2 text-xs font-medium text-neutral-500">Preview</p>
        <div className="relative h-12 overflow-hidden rounded bg-neutral-200">
          <div
            className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-blue-500"
            style={{
              transform: isAnimating
                ? 'translateY(-50%) translateX(calc(100% - 32px))'
                : 'translateY(-50%) translateX(0)',
              transition: `transform ${value} ease-out`,
              width: '2rem',
            }}
          />
        </div>
        <button
          type="button"
          onClick={triggerAnimation}
          className="mt-2 w-full rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
        >
          Play Animation ({value})
        </button>
      </div>

      {/* Input */}
      <div>
        <label htmlFor="duration-input" className="mb-1 block text-sm font-medium text-neutral-700">
          Duration
        </label>
        <input
          id="duration-input"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 font-mono text-sm ${
            isValid
              ? 'border-neutral-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              : 'border-red-300 bg-red-50'
          }`}
          placeholder="e.g., 300ms, 0.5s"
        />
      </div>

      {/* Slider */}
      <div>
        <label
          htmlFor="duration-slider"
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Adjust ({ms}ms)
        </label>
        <input
          id="duration-slider"
          type="range"
          min="0"
          max="2000"
          step="50"
          value={ms}
          onChange={handleSliderChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200"
        />
      </div>

      {/* Presets */}
      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500">Presets</p>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setInputValue(preset.value);
                onValueChange(preset.value);
              }}
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

function EasingEditor({
  value,
  onValueChange,
  isAnimating,
  onAnimate,
}: {
  value: string;
  onValueChange: (value: string) => void;
  isAnimating: boolean;
  onAnimate: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Animation preview */}
      <div className="rounded-md bg-neutral-50 p-4">
        <p className="mb-2 text-xs font-medium text-neutral-500">Preview</p>
        <div className="relative h-12 overflow-hidden rounded bg-neutral-200">
          <div
            className="absolute left-0 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-blue-500"
            style={{
              transform: isAnimating
                ? 'translateY(-50%) translateX(calc(100% - 32px))'
                : 'translateY(-50%) translateX(0)',
              transition: `transform 500ms ${value}`,
              width: '2rem',
            }}
          />
        </div>
        <button
          type="button"
          onClick={onAnimate}
          className="mt-2 w-full rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
        >
          Play Animation
        </button>
      </div>

      {/* Current value */}
      <div className="rounded-md bg-neutral-50 p-3">
        <p className="text-xs font-medium text-neutral-500">Current Value</p>
        <p className="mt-1 font-mono text-sm">{value}</p>
      </div>

      {/* Presets */}
      <div>
        <p className="mb-2 text-xs font-medium text-neutral-500">Easing Presets</p>
        <div className="flex flex-wrap gap-2">
          {EASING_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onValueChange(preset.value)}
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
