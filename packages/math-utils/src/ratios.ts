/**
 * Mathematical Ratios for Design System Progressions
 * Based on musical intervals and the golden ratio
 */

export const GOLDEN_RATIO = 1.618;
export const MAJOR_THIRD = 1.25; // 5:4
export const MINOR_THIRD = 1.2; // 6:5
export const PERFECT_FOURTH = 1.333; // 4:3
export const PERFECT_FIFTH = 1.5; // 3:2
export const AUGMENTED_FOURTH = Math.SQRT2; // √2 (tritone)
export const MAJOR_SECOND = 1.125; // 9:8
export const MINOR_SECOND = 1.067; // 16:15

/**
 * All available ratios for scale generation
 */
export const ALL_RATIOS = {
  golden: GOLDEN_RATIO,
  'major-third': MAJOR_THIRD,
  'minor-third': MINOR_THIRD,
  'perfect-fourth': PERFECT_FOURTH,
  'perfect-fifth': PERFECT_FIFTH,
  'augmented-fourth': AUGMENTED_FOURTH,
  'major-second': MAJOR_SECOND,
  'minor-second': MINOR_SECOND,
} as const;

import { z } from 'zod';

// Projection of ALL_RATIOS keys; the const is the generator and source of truth.
const RATIO_NAME_KEYS = Object.keys(ALL_RATIOS) as Array<keyof typeof ALL_RATIOS>;

export const RatioNameSchema = z.enum(
  RATIO_NAME_KEYS as unknown as [
    (typeof RATIO_NAME_KEYS)[number],
    ...Array<(typeof RATIO_NAME_KEYS)[number]>,
  ],
);
export type RatioName = z.infer<typeof RatioNameSchema>;
