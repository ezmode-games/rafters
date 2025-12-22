/**
 * Mathematical Progression Systems
 *
 * Core functions for generating mathematical sequences using different progression types.
 * Supports linear, exponential, musical intervals, and mathematical constants.
 */

import { getRatio, type ProgressionType } from './constants.js';

/**
 * A progression object that can compute values at any step from a base value.
 * This is the preferred interface for generators to use as it allows computing
 * values on-demand without pre-generating entire sequences.
 */
export interface Progression {
  /** The ratio type used for this progression */
  readonly type: ProgressionType;
  /** The numeric ratio value */
  readonly ratio: number;

  /**
   * Compute a value at a given step from the base value
   *
   * @param base - The base value to scale from
   * @param step - Steps from base (0 = base, negative = smaller, positive = larger)
   * @returns The computed value at that step
   *
   * @example
   * ```typescript
   * const progression = createProgression('minor-third');
   * progression.compute(4, 0);  // 4 (base)
   * progression.compute(4, 1);  // 4.8 (4 * 1.2)
   * progression.compute(4, 2);  // 5.76 (4 * 1.2^2)
   * progression.compute(4, -1); // 3.333 (4 / 1.2)
   * ```
   */
  compute(base: number, step: number): number;

  /**
   * Generate an array of values from the progression
   *
   * @param base - The base value to scale from
   * @param steps - Number of steps to generate
   * @param options - Additional options
   * @returns Array of computed values
   */
  generateSequence(
    base: number,
    steps: number,
    options?: { includeZero?: boolean; startStep?: number },
  ): number[];
}

/**
 * Create a progression object for computing values using a mathematical ratio.
 *
 * This is the recommended way to use progressions in generators. Instead of
 * hardcoding multipliers like `[0.5, 1, 1.2, 1.44, 1.728]`, you can compute
 * values dynamically: `progression.compute(base, step)`.
 *
 * @param type - The progression type (musical ratio, mathematical constant, etc.)
 * @returns A Progression object with compute and generateSequence methods
 *
 * @example
 * ```typescript
 * // For radius tokens with minor-third progression
 * const progression = createProgression('minor-third');
 * const baseRadius = 4;
 *
 * // Generate scale values
 * const sm = progression.compute(baseRadius, -1); // 3.333
 * const md = progression.compute(baseRadius, 0);  // 4 (base)
 * const lg = progression.compute(baseRadius, 1);  // 4.8
 * const xl = progression.compute(baseRadius, 2);  // 5.76
 *
 * // Or generate a sequence
 * const scale = progression.generateSequence(baseRadius, 5, { startStep: -1 });
 * // [3.333, 4, 4.8, 5.76, 6.912]
 * ```
 */
export function createProgression(type: ProgressionType): Progression {
  // Handle special cases first
  if (type === 'linear') {
    return {
      type,
      ratio: 1,
      compute(base: number, step: number): number {
        return base * (step + 1);
      },
      generateSequence(
        base: number,
        steps: number,
        options: { includeZero?: boolean; startStep?: number } = {},
      ): number[] {
        const { includeZero = false, startStep = 0 } = options;
        const result: number[] = [];
        for (let i = 0; i < steps; i++) {
          const step = startStep + i;
          if (i === 0 && includeZero) {
            result.push(0);
          } else {
            result.push(base * (step + 1));
          }
        }
        return result;
      },
    };
  }

  if (type === 'exponential') {
    // For exponential, use a default multiplier (can't parameterize via createProgression)
    const defaultMultiplier = 1.25;
    return {
      type,
      ratio: defaultMultiplier,
      compute(base: number, step: number): number {
        return base * defaultMultiplier ** step;
      },
      generateSequence(
        base: number,
        steps: number,
        options: { includeZero?: boolean; startStep?: number } = {},
      ): number[] {
        const { includeZero = false, startStep = 0 } = options;
        const result: number[] = [];
        for (let i = 0; i < steps; i++) {
          const step = startStep + i;
          if (i === 0 && includeZero) {
            result.push(0);
          } else {
            result.push(base * defaultMultiplier ** step);
          }
        }
        return result;
      },
    };
  }

  // Musical ratios and mathematical constants
  const ratio = getRatio(type);

  return {
    type,
    ratio,
    compute(base: number, step: number): number {
      return base * ratio ** step;
    },
    generateSequence(
      base: number,
      steps: number,
      options: { includeZero?: boolean; startStep?: number } = {},
    ): number[] {
      const { includeZero = false, startStep = 0 } = options;
      const result: number[] = [];
      for (let i = 0; i < steps; i++) {
        const step = startStep + i;
        if (i === 0 && includeZero) {
          result.push(0);
        } else {
          result.push(base * ratio ** step);
        }
      }
      return result;
    },
  };
}

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
  octaves: number = 1,
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
    const prev1 = sequence[i - 1];
    const prev2 = sequence[i - 2];
    if (prev1 === undefined || prev2 === undefined) {
      throw new Error('Invalid sequence state');
    }
    const nextValue = prev1 * ratioValue + prev2;
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
  steps: number = 5,
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
