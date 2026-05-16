/**
 * Spacing and radius system inference (#1510).
 *
 * Spacing in Rafters is generated, not stored: `baseSpacingUnit` (px)
 * times either a named musical/mathematical ratio (`minor-third`,
 * `golden`, ...) or a linear progression (`base * (step+1)`, Tailwind's
 * style). When `rafters init` finds existing spacing variables in the
 * source CSS, it must INFER the underlying base + progression so the
 * generator can recreate the system -- not copy raw values as flat
 * tokens.
 *
 * Algorithm:
 *
 *   1. Filter the parsed CSS variables to spacing-related names.
 *   2. Convert each value to px (rem * 16, px stays, others skipped).
 *   3. Pick the smallest non-zero value as the candidate base.
 *   4. For each progression candidate -- the named ratios in
 *      DEFAULT_RATIOS plus the special `linear` case -- generate the
 *      expected sequence at that base and measure fit (sum of
 *      relative errors against actual values).
 *   5. The lowest-error progression wins. Confidence is
 *      `1 - clamp(mean_relative_error)`.
 *
 * Same algorithm for radius, with different name patterns and a
 * different config field on the output.
 */

import { DEFAULT_RATIOS, generateSequence, linearSequence, type Ratio } from '@rafters/math-utils';
import type { CSSVariable } from './css-parser.js';

/** Progression names supported on inferrer output. Aligns with PROGRESSION_SYSTEMS in @rafters/shared. */
export type ProgressionName = 'linear' | (typeof DEFAULT_RATIOS)[number]['name'];

export interface ScaleInference {
  /** Base unit in px. */
  base: number;
  /** Inferred progression: a name from DEFAULT_RATIOS or the literal 'linear'. */
  progressionRatio: ProgressionName;
  /** Mean relative error across matched positions; 0 = exact fit. */
  meanRelativeError: number;
  /** 1 - clamped(meanRelativeError); higher is better. */
  confidence: number;
  /** Number of sampled values that contributed to the fit. */
  samples: number;
}

const SPACING_NAME_PATTERN = /(^|-)(spacing|space|gap|margin|padding|inset)(-|$)/i;
const RADIUS_NAME_PATTERN = /(^|-)(radius|rounded|border-radius)(-|$)/i;

/**
 * Best-fit confidence below this floor surfaces a warning; the caller
 * may choose to fall back to defaults rather than apply the inference.
 */
export const LOW_CONFIDENCE_THRESHOLD = 0.7;

/**
 * Confidence below this floor means the inference is not trustworthy
 * at all (typically noise -- arbitrary unrelated values matching the
 * name pattern). Caller should default to system defaults.
 */
export const UNUSABLE_CONFIDENCE_THRESHOLD = 0.4;

/** Infer the spacing system from CSS variables. Returns null if no usable values. */
export function inferSpacingSystem(variables: readonly CSSVariable[]): ScaleInference | null {
  return inferScaleSystem(variables, SPACING_NAME_PATTERN);
}

/** Infer the radius system from CSS variables. Returns null if no usable values. */
export function inferRadiusSystem(variables: readonly CSSVariable[]): ScaleInference | null {
  return inferScaleSystem(variables, RADIUS_NAME_PATTERN);
}

function inferScaleSystem(
  variables: readonly CSSVariable[],
  namePattern: RegExp,
): ScaleInference | null {
  const matched = variables.filter((v) => namePattern.test(v.name));
  if (matched.length === 0) return null;

  // Convert each to px, drop unparseable
  const pxValues = matched
    .map((v) => toPx(v.value))
    .filter((px): px is number => px !== null && px >= 0);
  if (pxValues.length === 0) return null;

  const sorted = [...pxValues].sort((a, b) => a - b);
  // Smallest non-zero is the candidate base
  const base = sorted.find((v) => v > 0);
  if (base === undefined) return null;

  // Tail = sorted values strictly above 0; we fit positions to these.
  const tail = sorted.filter((v) => v > 0);
  if (tail.length === 0) return null;

  // Candidate progressions: all named ratios + linear
  type Candidate = { name: ProgressionName; predict: (step: number) => number };
  const candidates: Candidate[] = [
    {
      name: 'linear',
      predict: (step) => linearSequence(base, step + 1)[step] ?? base,
    },
    ...DEFAULT_RATIOS.map((r: Ratio) => ({
      name: r.name as ProgressionName,
      predict: (step: number) => generateSequence(r, base, step + 1)[step] ?? base,
    })),
  ];

  // For each candidate, compute fit. The fit aligns each actual value
  // to its closest predicted step (in [0, tail.length-1]); the error
  // is the relative diff against that step. This is order-agnostic --
  // some source CSS uses `--spacing-1, --spacing-2, ...`, others use
  // `--spacing-sm, --spacing-md, --spacing-lg` where the size order
  // matches sort order but the index isn't on the name.
  let best: ScaleInference | null = null;
  for (const candidate of candidates) {
    const predictions: number[] = [];
    for (let step = 0; step < tail.length; step += 1) {
      predictions.push(candidate.predict(step));
    }

    let totalRelError = 0;
    for (const actual of tail) {
      // Snap each actual to its closest prediction
      let closestErr = Number.POSITIVE_INFINITY;
      for (const pred of predictions) {
        const denom = Math.max(Math.abs(actual), Math.abs(pred), 0.001);
        const err = Math.abs(actual - pred) / denom;
        if (err < closestErr) closestErr = err;
      }
      totalRelError += closestErr;
    }
    const meanRelativeError = totalRelError / tail.length;
    const confidence = Math.max(0, 1 - Math.min(1, meanRelativeError * 4));

    if (!best || meanRelativeError < best.meanRelativeError) {
      best = {
        base,
        progressionRatio: candidate.name,
        meanRelativeError,
        confidence,
        samples: tail.length,
      };
    }
  }

  return best;
}

const PX_PER_REM = 16;

/**
 * Convert a CSS length value to px. Handles `px`, `rem`, `em`
 * (assumed root 16px), and bare numbers (treated as px). Returns null
 * for percentages, unitless ratios that look non-pixel, or
 * unparseable values.
 */
export function toPx(value: string): number | null {
  const trimmed = value.trim();
  // Reject calc(), var(), and other expressions for inference -- we
  // need a concrete leaf value.
  if (/^(calc|var|min|max|clamp)\b/.test(trimmed)) return null;

  const match = trimmed.match(/^(-?\d*\.?\d+)\s*(px|rem|em|%)?$/);
  if (!match || !match[1]) return null;
  const num = Number.parseFloat(match[1]);
  if (!Number.isFinite(num)) return null;

  const unit = match[2] ?? 'px';
  if (unit === '%') return null;
  if (unit === 'px') return num;
  if (unit === 'rem' || unit === 'em') return num * PX_PER_REM;
  return null;
}
