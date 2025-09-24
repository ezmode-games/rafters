/**
 * @rafters/math-utils
 *
 * Mathematical utilities for design token generation
 * Provides musical ratios, golden ratio, and sophisticated progression systems
 */

// Calculation engine
export {
  calculateProgressionStep,
  evaluateExpression,
  findClosestProgressionStep,
  interpolate,
} from './calculations.js';
// Core constants and ratios
export {
  ALL_RATIOS,
  getRatio,
  isValidRatio,
  MATHEMATICAL_CONSTANTS,
  MUSICAL_RATIOS,
  type ProgressionType,
} from './constants.js';
// Mathematical progressions
export {
  generateFibonacciLike,
  generateModularScale,
  generateMusicalScale,
  generateProgression,
  type ProgressionOptions,
} from './progressions.js';

// Unit-aware operations
export {
  type CSSUnit,
  calculateWithUnits,
  convertUnit,
  evaluateWithUnits,
  formatUnit,
  parseUnit,
  type UnitValue,
} from './units.js';
