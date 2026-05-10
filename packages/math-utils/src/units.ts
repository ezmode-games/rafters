/**
 * Unit-Aware Mathematical Operations
 *
 * A `Unit` is a name + dimensional kind (+ optional `toBase` scale relative to
 * the kind's base unit). Operations take `Unit` instances and `{ value, unit }`
 * tuples; the library ships a default registry of common CSS units. Built-in
 * and user-defined units are structurally identical.
 */

import { z } from 'zod';

export const UnitSchema = z.object({
  name: z.string(),
  kind: z.enum(['length', 'angle', 'time', 'percentage', 'viewport-relative']),
  toBase: z.number().positive().optional(),
});
export type Unit = z.infer<typeof UnitSchema>;

export interface UnitValue {
  value: number;
  unit: Unit;
}

/**
 * Default unit registry. Starter data, not authoritative -- pass your own
 * `Unit[]` registry into `parseUnitString` to override or extend.
 *
 * Length units carry `toBase` relative to px (the base of the length kind).
 * Other kinds don't have a meaningful single-base scale (% needs parent
 * context, viewport-relative needs viewport dimensions).
 */
export const DEFAULT_UNITS: Unit[] = [
  { name: 'px', kind: 'length', toBase: 1 },
  { name: 'rem', kind: 'length', toBase: 16 },
  { name: 'em', kind: 'length', toBase: 16 },
  { name: 'cm', kind: 'length', toBase: 37.7952755906 },
  { name: 'mm', kind: 'length', toBase: 3.77952755906 },
  { name: 'in', kind: 'length', toBase: 96 },
  { name: 'pt', kind: 'length', toBase: 1.3333333333 },
  { name: 'pc', kind: 'length', toBase: 16 },
  { name: 'ch', kind: 'length', toBase: 8 },
  { name: 'ex', kind: 'length', toBase: 8 },
  { name: '%', kind: 'percentage' },
  { name: 'vw', kind: 'viewport-relative' },
  { name: 'vh', kind: 'viewport-relative' },
  { name: 'vmin', kind: 'viewport-relative' },
  { name: 'vmax', kind: 'viewport-relative' },
];

/** A pseudo-unit representing a unitless number, used as the right-hand side of * and / operations. */
const UNITLESS: Unit = { name: '', kind: 'length' };

/** Look up a unit by name in a registry. Returns undefined if not found. */
export const findUnit = (registry: readonly Unit[], name: string): Unit | undefined =>
  registry.find((u) => u.name === name);

/**
 * Parse a CSS value string like "16px" or "1.5rem" into a value and `Unit`.
 * Throws if the suffix isn't found in the registry. A bare number returns
 * UNITLESS.
 */
export function parseUnitString(
  cssValue: string,
  registry: readonly Unit[] = DEFAULT_UNITS,
): UnitValue {
  const trimmed = cssValue.trim();
  const match = trimmed.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
  if (!match || match[1] === undefined) {
    throw new Error(`Invalid CSS value: ${cssValue}`);
  }
  const value = parseFloat(match[1]);
  const suffix = match[2] ?? '';
  if (suffix === '') {
    return { value, unit: UNITLESS };
  }
  const unit = findUnit(registry, suffix);
  if (!unit) {
    throw new Error(`Unknown unit: ${suffix}`);
  }
  return { value, unit };
}

/** Format a `UnitValue` back to a CSS string. */
export const formatUnit = (uv: UnitValue): string => `${uv.value}${uv.unit.name}`;

/**
 * Mathematical operations on unit values. Addition/subtraction require
 * matching units; multiplication/division accept a unitless right operand.
 */
export function calculateWithUnits(
  left: UnitValue,
  operator: '+' | '-' | '*' | '/',
  right: UnitValue | number,
): UnitValue {
  const rightValue: UnitValue =
    typeof right === 'number' ? { value: right, unit: UNITLESS } : right;

  if (operator === '+' || operator === '-') {
    if (left.unit.name !== rightValue.unit.name && rightValue.unit.name !== '') {
      throw new Error(
        `Cannot ${operator === '+' ? 'add' : 'subtract'} different units: ${left.unit.name} and ${rightValue.unit.name}`,
      );
    }
  }

  let result: number;
  switch (operator) {
    case '+':
      result = left.value + rightValue.value;
      break;
    case '-':
      result = left.value - rightValue.value;
      break;
    case '*':
      result = left.value * rightValue.value;
      break;
    case '/':
      if (rightValue.value === 0) {
        throw new Error('Division by zero');
      }
      result = left.value / rightValue.value;
      break;
  }

  const resultUnit: Unit =
    operator === '*' || operator === '/'
      ? rightValue.unit.name === ''
        ? left.unit
        : rightValue.unit
      : left.unit;

  return { value: result, unit: resultUnit };
}

/**
 * Convert a length-kind unit value to a different unit. Both source and
 * target must be `kind: 'length'` with `toBase` defined. Other kinds are
 * not convertible without external context.
 */
export function convertUnit(
  source: UnitValue,
  target: Unit,
  ctx: { baseFontSize?: number; viewportWidth?: number; viewportHeight?: number } = {},
): UnitValue {
  if (source.unit.name === target.name) {
    return source;
  }

  // Length conversion via toBase scale (px is the base).
  if (source.unit.kind === 'length' && target.kind === 'length') {
    const sourceToBase = source.unit.toBase;
    const targetToBase = target.toBase;
    if (sourceToBase === undefined || targetToBase === undefined) {
      throw new Error(
        `Cannot convert length unit without toBase: ${source.unit.name} -> ${target.name}`,
      );
    }

    // Apply ctx baseFontSize override for rem/em if provided.
    const baseFont = ctx.baseFontSize ?? 16;
    const adjust = (u: Unit, v: number): number => {
      if (u.name === 'rem' || u.name === 'em') return v * (baseFont / 16);
      return v;
    };

    const pxValue = adjust(source.unit, source.value * sourceToBase);
    const targetPxScale = adjust(target, targetToBase);
    return { value: pxValue / targetPxScale, unit: target };
  }

  // Viewport-relative conversion to/from length.
  if (source.unit.kind === 'viewport-relative' && target.kind === 'length' && target.toBase) {
    const { viewportWidth = 1920, viewportHeight = 1080 } = ctx;
    const dim =
      source.unit.name === 'vw'
        ? viewportWidth
        : source.unit.name === 'vh'
          ? viewportHeight
          : source.unit.name === 'vmin'
            ? Math.min(viewportWidth, viewportHeight)
            : Math.max(viewportWidth, viewportHeight);
    const pxValue = (source.value / 100) * dim;
    return { value: pxValue / target.toBase, unit: target };
  }
  if (source.unit.kind === 'length' && target.kind === 'viewport-relative' && source.unit.toBase) {
    const { viewportWidth = 1920, viewportHeight = 1080 } = ctx;
    const dim =
      target.name === 'vw'
        ? viewportWidth
        : target.name === 'vh'
          ? viewportHeight
          : target.name === 'vmin'
            ? Math.min(viewportWidth, viewportHeight)
            : Math.max(viewportWidth, viewportHeight);
    const pxValue = source.value * source.unit.toBase;
    return { value: (pxValue / dim) * 100, unit: target };
  }

  if (source.unit.kind === 'percentage' || target.kind === 'percentage') {
    throw new Error('Cannot convert percentage without parent context');
  }
  throw new Error(`Unsupported unit conversion: ${source.unit.name} -> ${target.name}`);
}
