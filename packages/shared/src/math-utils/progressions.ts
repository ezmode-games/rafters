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
 * Generate a mathematical progression sequence.
 *
 * This is the cornerstone function for all design token generation in Rafters.
 * It creates mathematically harmonious sequences that form the basis for:
 * - Spacing systems (margins, padding, gaps)
 * - Typography scales (font sizes, line heights)
 * - Component sizing (buttons, inputs, containers)
 * - Animation timing (duration, delays)
 *
 * The mathematical foundation ensures that all design decisions have inherent
 * harmony and consistency, removing guesswork from design system creation.
 *
 * Three progression types are supported:
 * 1. **Linear**: Arithmetic progression (equal differences)
 * 2. **Exponential**: Custom exponential growth
 * 3. **Ratio-based**: Musical intervals and mathematical constants
 *
 * Ratio-based progressions are preferred because they create natural visual
 * hierarchies that feel harmonious to human perception.
 *
 * @param type - Type of progression (linear, exponential, or ratio name)
 * @param options - Configuration options for generation
 * @returns Array of numbers representing the mathematical progression
 *
 * @example
 * ```typescript
 * // Linear spacing: [0, 4, 8, 12, 16]
 * generateProgression('linear', { baseValue: 4, steps: 5, includeZero: true });
 *
 * // Golden ratio sizing: [1, 1.618, 2.618, 4.236]
 * generateProgression('golden', { baseValue: 1, steps: 4 });
 *
 * // Musical typography: [16, 19.2, 23.04, 27.65]
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
 * Generate a harmonious scale using musical intervals.
 *
 * Creates design scales based on musical theory, where visual progression
 * follows the same mathematical relationships that create pleasing musical harmony.
 *
 * Musical intervals provide proven ratios for creating visual hierarchies:
 * - Minor intervals: Subtle, refined progressions for close relationships
 * - Major intervals: Balanced, natural progressions for general use
 * - Perfect intervals: Strong, architectural progressions for bold hierarchies
 *
 * This function is specifically designed for typography scales where each
 * "octave" represents a complete range of sizes (like H1-H6 headings).
 *
 * @param interval - Musical interval name (e.g., 'perfect-fourth', 'major-third')
 * @param baseValue - Starting value (typically base font size)
 * @param octaves - Number of octaves (steps of 12 semitones each)
 * @returns Array of values following musical harmony principles
 *
 * @example
 * ```typescript
 * // Typography scale using perfect fourth: [16, 21.33, 28.44, 37.92]
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
 * Generate Fibonacci-like sequence using any ratio.
 *
 * Creates sequences that follow the Fibonacci pattern but with custom ratios
 * instead of the traditional golden ratio. Each term is the sum of the two
 * preceding terms multiplied by the ratio.
 *
 * This creates naturally accelerating progressions that are perfect for:
 * - Animation easing curves
 * - Progressive spacing increases
 * - Emphasis hierarchies
 * - Organic growth patterns
 *
 * The Fibonacci pattern appears throughout nature and creates inherently
 * pleasing visual progressions that feel organic rather than mechanical.
 *
 * @param ratio - Ratio name (musical/mathematical) or custom number
 * @param length - Number of terms to generate (minimum 2)
 * @returns Array representing Fibonacci-like sequence
 * @throws Error if length is less than 2
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
 * Generate modular scale (commonly used in typography).
 *
 * Creates a complete typographic scale with sizes both above and below a base size.
 * This is the standard approach for typography systems where you need a full
 * range of text sizes from small captions to large headings.
 *
 * The modular scale provides:
 * - Mathematical consistency across all text sizes
 * - Predictable visual hierarchy
 * - Scalable system that works at any base size
 * - Perfect ratios for readability and aesthetic appeal
 *
 * This function generates sizes in both directions from the base, creating
 * a complete palette of typographic options. Each size maintains the same
 * ratio relationship to its neighbors, ensuring visual harmony.
 *
 * Commonly used ratios:
 * - 'minor-third' (1.2): Conservative, readable
 * - 'major-third' (1.25): Balanced, versatile
 * - 'perfect-fourth' (1.333): Bold, architectural
 * - 'golden' (1.618): Classical, elegant
 *
 * @param ratio - Modular ratio (musical interval or mathematical constant)
 * @param baseSize - Base font size (typically 16px for web)
 * @param steps - Number of sizes to generate in each direction
 * @returns Object with smaller sizes, base size, and larger sizes
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
