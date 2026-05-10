/**
 * @rafters/math-utils
 *
 * Schemas: Ratio, Unit. Default registries: DEFAULT_RATIOS, DEFAULT_UNITS.
 * Operations on those schemas. Built-in and user-defined items are treated
 * identically; the library carries no canonical lists, only data.
 */

export * from './calculations.js';
export * from './progressions.js';
export * from './ratios.js';
export * from './units.js';
// expressions.ts is intentionally not barrel-exported. Its `evaluateExpression`
// strips CSS unit suffixes (used internally for early-rule evaluation); the
// public `evaluateExpression` in calculations.ts takes a richer options object.
// Import from `@rafters/math-utils/src/expressions.js` directly if the
// unit-stripping form is needed.
