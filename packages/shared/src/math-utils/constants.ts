/**
 * Mathematical Constants for Design Token Generation
 *
 * Central source of truth for all mathematical ratios used across the design system.
 * Based on musical intervals, mathematical constants, and harmonic proportions.
 */

/**
 * Musical Intervals - Mathematical ratios from music theory for harmonic design progression.
 *
 * These ratios form the mathematical foundation of Rafters' spacing and typography systems.
 * Based on the principle that mathematical relationships which create pleasing musical
 * harmony also create pleasing visual harmony.
 *
 * Music theory provides mathematically precise ratios that have been refined over
 * centuries to create pleasant auditory experiences. Applied to design, these same
 * ratios create visual systems with inherent harmony and balance.
 *
 * Each ratio represents the frequency relationship between two musical notes:
 * - Smaller ratios (minor-second) create subtle, tight progressions
 * - Larger ratios (perfect-fifth) create bold, dramatic progressions
 *
 * These are cornerstone values for generating spacing scales, typography scales,
 * and component sizing systems throughout Rafters.
 */
export const MUSICAL_RATIOS = {
  'minor-second': 1.067, // 16:15 ratio - tight, subtle progression
  'major-second': 1.125, // 9:8 ratio - gentle, natural progression
  'minor-third': 1.2, // 6:5 ratio - moderate, balanced progression
  'major-third': 1.25, // 5:4 ratio - strong, noticeable progression
  'perfect-fourth': 1.333, // 4:3 ratio - bold, architectural progression
  'augmented-fourth': Math.SQRT2, // √2 ratio (tritone) - dramatic, modern
  'perfect-fifth': 1.5, // 3:2 ratio - classical, powerful progression
} as const;

/**
 * Mathematical Constants
 */
export const MATHEMATICAL_CONSTANTS = {
  // Golden Ratio - appears in nature, art, and classical architecture
  golden: 1.618033988749, // φ (phi) - most pleasing proportion to human eye
  'golden-ratio': 1.618033988749, // Alternative name

  // Square Root Ratios
  sqrt2: Math.SQRT2, // √2 ≈ 1.414 - A4 paper ratio, diagonal harmony
  sqrt3: Math.sqrt(3), // √3 ≈ 1.732 - equilateral triangle ratio
  sqrt5: Math.sqrt(5), // √5 ≈ 2.236 - related to golden ratio

  // Mathematical Constants
  e: Math.E, // Euler's number ≈ 2.718 - natural exponential
  pi: Math.PI, // π ≈ 3.142 - circular proportions

  // Common Design Ratios
  silver: 1 + Math.SQRT2, // Silver ratio ≈ 2.414 - alternative to golden
} as const;

/**
 * Combined ratio lookup for easy access
 */
export const ALL_RATIOS = {
  ...MUSICAL_RATIOS,
  ...MATHEMATICAL_CONSTANTS,
} as const;

/**
 * Progression Types for different mathematical systems
 */
export type ProgressionType =
  | 'linear' // Simple arithmetic progression: 1, 2, 3, 4...
  | 'exponential' // Custom exponential: base^n
  | keyof typeof MUSICAL_RATIOS // Musical intervals
  | keyof typeof MATHEMATICAL_CONSTANTS; // Mathematical constants

// Pre-compute available ratios string to avoid repeated computation
const AVAILABLE_RATIOS_STRING = Object.keys(ALL_RATIOS).join(', ');

/**
 * Get ratio value by name with validation.
 *
 * Central accessor function for all mathematical ratios in the Rafters system.
 * Used throughout the design token generation process to ensure consistent
 * mathematical relationships across spacing, typography, and sizing systems.
 *
 * This function provides:
 * - Type-safe ratio access with runtime validation
 * - Detailed error messages for debugging
 * - Single source of truth for all ratio values
 * - Performance optimization through pre-computed lookup
 *
 * @param name - The ratio name (musical interval or mathematical constant)
 * @returns The precise mathematical ratio value
 * @throws Error with available options if ratio name is invalid
 *
 * @example
 * ```typescript
 * const golden = getRatio('golden'); // 1.618033988749
 * const fourth = getRatio('perfect-fourth'); // 1.333
 * ```
 */
export function getRatio(name: string): number {
  const ratio = ALL_RATIOS[name as keyof typeof ALL_RATIOS];
  if (ratio === undefined) {
    throw new Error(`Unknown ratio: ${name}. Available ratios: ${AVAILABLE_RATIOS_STRING}`);
  }
  return ratio;
}

/**
 * Check if a string is a valid ratio name.
 *
 * Type guard function for validating ratio names before using getRatio().
 * Essential for user input validation in Studio and CLI tools.
 *
 * @param name - String to validate as ratio name
 * @returns True if name corresponds to a defined ratio
 *
 * @example
 * ```typescript
 * if (isValidRatio('golden')) {
 *   const ratio = getRatio('golden'); // TypeScript knows this is safe
 * }
 * ```
 */
export function isValidRatio(name: string): name is keyof typeof ALL_RATIOS {
  return name in ALL_RATIOS;
}
