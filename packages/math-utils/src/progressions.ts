/**
 * Mathematical Progression Systems
 *
 * Core functions for generating mathematical sequences using different progression types.
 * Supports linear, exponential, musical intervals, and mathematical constants.
 */

import { getRatio, type ProgressionType } from './constants.js';

/**
 * Options for generating mathematical progressions
 */
export interface ProgressionOptions {
  /** Starting value for the progression */
  baseValue: number;
  /** Number of steps to generate */
  steps: number;
  /** Custom multiplier for exponential progressions */
  multiplier?: number;
  /** Whether to include zero as first step */
  includeZero?: boolean;
}

/**
 * Generate a mathematical progression sequence
 *
 * @param type - Type of progression (linear, exponential, or ratio name)
 * @param options - Configuration options
 * @returns Array of numbers representing the progression
 *
 * @example
 * ```typescript
 * // Linear progression: [0, 4, 8, 12, 16]
 * generateProgression('linear', { baseValue: 4, steps: 5, includeZero: true });
 *
 * // Golden ratio progression: [1, 1.618, 2.618, 4.236]
 * generateProgression('golden', { baseValue: 1, steps: 4 });
 *
 * // Minor third musical progression: [16, 19.2, 23.04, 27.65]
 * generateProgression('minor-third', { baseValue: 16, steps: 4 });
 * ```
 */
export function generateProgression(type: ProgressionType, options: ProgressionOptions): number[] {
  const { baseValue, steps, multiplier = 1.25, includeZero = false } = options;
  const result: number[] = [];
  let cachedRatio: number | undefined;

  for (let i = 0; i < steps; i++) {
    let value: number;

    switch (type) {
      case 'linear':
        value = i === 0 && includeZero ? 0 : baseValue * (includeZero ? i : i + 1);
        break;

      case 'exponential':
        value = i === 0 && includeZero ? 0 : baseValue * multiplier ** (includeZero ? i - 1 : i);
        break;

      default:
        // Musical ratios or mathematical constants
        try {
          // Get ratio once and reuse it
          if (!cachedRatio) {
            cachedRatio = getRatio(type);
          }
          value = i === 0 && includeZero ? 0 : baseValue * cachedRatio ** (includeZero ? i - 1 : i);
        } catch (error) {
          throw new Error(`Invalid progression type: ${type}`, { cause: error });
        }
    }

    result.push(value);
  }

  return result;
}

/**
 * Generate a harmonious scale using musical intervals
 *
 * @param interval - Musical interval name
 * @param baseValue - Starting value
 * @param octaves - Number of octaves (steps of 12)
 * @returns Array of values following musical harmony
 *
 * @example
 * ```typescript
 * // Generate perfect fourth scale: [16, 21.33, 28.44, 37.92]
 * generateMusicalScale('perfect-fourth', 16, 1);
 * ```
 */
export function generateMusicalScale(
  interval: keyof typeof import('./constants.js').MUSICAL_RATIOS,
  baseValue: number,
  octaves: number = 1
): number[] {
  const steps = octaves * 12; // 12 semitones per octave
  return generateProgression(interval, { baseValue, steps, includeZero: false });
}

/**
 * Generate Fibonacci-like sequence using any ratio
 *
 * @param ratio - Ratio name or custom number
 * @param length - Number of terms to generate
 * @returns Array representing Fibonacci-like sequence
 *
 * @example
 * ```typescript
 * // Golden Fibonacci: [1, 1, 2, 3, 5, 8, 13...]
 * generateFibonacciLike('golden', 7);
 *
 * // Custom ratio Fibonacci: [1, 1, 2.5, 3.5, 6, 9.5...]
 * generateFibonacciLike(1.5, 6);
 * ```
 */
export function generateFibonacciLike(ratio: ProgressionType | number, length: number): number[] {
  if (length < 2) {
    throw new Error('Fibonacci sequence requires at least 2 terms');
  }

  const ratioValue = typeof ratio === 'number' ? ratio : getRatio(ratio);
  const sequence = [1, 1];

  for (let i = 2; i < length; i++) {
    const nextValue = sequence[i - 1] * ratioValue + sequence[i - 2];
    sequence.push(nextValue);
  }

  return sequence;
}

/**
 * Generate modular scale (commonly used in typography)
 *
 * @param ratio - Modular ratio
 * @param baseSize - Base font size
 * @param steps - Number of sizes to generate (both up and down)
 * @returns Object with smaller and larger sizes
 *
 * @example
 * ```typescript
 * // Generate modular typography scale
 * const scale = generateModularScale('major-third', 16, 5);
 * // Result: { smaller: [10.24, 12.8, 16], larger: [20, 25, 31.25, 39.06, 48.83] }
 * ```
 */
export function generateModularScale(
  ratio: ProgressionType,
  baseSize: number,
  steps: number = 5
): { smaller: number[]; base: number; larger: number[] } {
  const ratioValue = typeof ratio === 'number' ? ratio : getRatio(ratio);

  const smaller: number[] = [];
  const larger: number[] = [];

  // Generate smaller sizes (going down)
  for (let i = 1; i <= steps; i++) {
    smaller.unshift(baseSize / ratioValue ** i);
  }

  // Generate larger sizes (going up)
  for (let i = 1; i <= steps; i++) {
    larger.push(baseSize * ratioValue ** i);
  }

  return {
    smaller,
    base: baseSize,
    larger,
  };
}
