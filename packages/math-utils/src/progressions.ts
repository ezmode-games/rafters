/**
 * Progression Sequences
 *
 * Operations that produce numeric sequences from a base value. Three families:
 *   - Ratio-based: `progression`, `generateSequence`, `generateModularScale`,
 *     `generateFibonacciLike` -- take a `Ratio` instance.
 *   - Linear: `linearSequence` -- additive steps from base.
 *   - Exponential: `exponentialSequence` -- multiplicative steps with caller-supplied multiplier.
 *
 * No named-string lookups. Pass the `Ratio` you want; built-in and user-defined
 * are treated identically.
 */

import { type Ratio, ratioValue } from './ratios.js';

export interface SequenceOptions {
  /** Step offset for the first generated value (default 0). */
  startStep?: number;
  /** When true, replace the first generated value with 0. */
  includeZero?: boolean;
}

/** Compute a single value at `step` away from `base` using ratio `r`. */
export const progression = (r: Ratio, base: number, step: number): number =>
  base * ratioValue(r) ** step;

/** Generate `count` values from a ratio progression. */
export function generateSequence(
  r: Ratio,
  base: number,
  count: number,
  options: SequenceOptions = {},
): number[] {
  const { startStep = 0, includeZero = false } = options;
  const ratio = ratioValue(r);
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && includeZero) {
      result.push(0);
    } else {
      const step = startStep + (includeZero ? i - 1 : i);
      result.push(base * ratio ** step);
    }
  }
  return result;
}

/** Generate `count` values from a linear progression: base * (step + 1). */
export function linearSequence(
  base: number,
  count: number,
  options: SequenceOptions = {},
): number[] {
  const { startStep = 0, includeZero = false } = options;
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && includeZero) {
      result.push(0);
    } else {
      const step = startStep + (includeZero ? i - 1 : i);
      result.push(base * (step + 1));
    }
  }
  return result;
}

/** Generate `count` values from an exponential progression: base * multiplier^step. */
export function exponentialSequence(
  base: number,
  multiplier: number,
  count: number,
  options: SequenceOptions = {},
): number[] {
  const { startStep = 0, includeZero = false } = options;
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && includeZero) {
      result.push(0);
    } else {
      const step = startStep + (includeZero ? i - 1 : i);
      result.push(base * multiplier ** step);
    }
  }
  return result;
}

/**
 * Generate a modular scale (typography-style) from a ratio: returns
 * `steps` sizes smaller than `base` and `steps` sizes larger.
 */
export function generateModularScale(
  r: Ratio,
  base: number,
  steps: number = 5,
): { smaller: number[]; base: number; larger: number[] } {
  const ratio = ratioValue(r);
  const smaller: number[] = [];
  const larger: number[] = [];
  for (let i = 1; i <= steps; i++) {
    smaller.unshift(base / ratio ** i);
    larger.push(base * ratio ** i);
  }
  return { smaller, base, larger };
}

/**
 * Generate a Fibonacci-like sequence using a ratio:
 *   `next = prev * ratio + prevPrev`, seeded at `[1, 1]`.
 */
export function generateFibonacciLike(r: Ratio, length: number): number[] {
  if (length < 2) {
    throw new Error('Fibonacci sequence requires at least 2 terms');
  }
  const ratio = ratioValue(r);
  const sequence: number[] = [1, 1];
  for (let i = 2; i < length; i++) {
    const prev1 = sequence[i - 1];
    const prev2 = sequence[i - 2];
    if (prev1 === undefined || prev2 === undefined) {
      throw new Error('Invalid sequence state');
    }
    sequence.push(prev1 * ratio + prev2);
  }
  return sequence;
}
