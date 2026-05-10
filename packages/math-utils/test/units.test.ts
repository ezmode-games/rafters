/**
 * Unit tests for the Unit schema, default registry, and operations.
 */

import { describe, expect, it } from 'vitest';
import {
  calculateWithUnits,
  convertUnit,
  DEFAULT_UNITS,
  findUnit,
  formatUnit,
  parseUnitString,
  type Unit,
  UnitSchema,
} from '../src/units.js';

const need = (name: string): Unit => {
  const u = findUnit(DEFAULT_UNITS, name);
  if (!u) throw new Error(`missing unit ${name}`);
  return u;
};

describe('UnitSchema and DEFAULT_UNITS', () => {
  it('every default unit validates', () => {
    for (const u of DEFAULT_UNITS) {
      expect(UnitSchema.safeParse(u).success).toBe(true);
    }
  });

  it('contains common CSS units', () => {
    for (const name of ['px', 'rem', 'em', '%', 'vw', 'vh', 'ch', 'ex', 'cm', 'mm', 'in', 'pt']) {
      expect(findUnit(DEFAULT_UNITS, name)).toBeDefined();
    }
  });
});

describe('parseUnitString', () => {
  it('parses px', () => {
    const { value, unit } = parseUnitString('16px');
    expect(value).toBe(16);
    expect(unit.name).toBe('px');
  });

  it('parses rem and decimal', () => {
    expect(parseUnitString('1.5rem').value).toBe(1.5);
    expect(parseUnitString('1.5rem').unit.name).toBe('rem');
  });

  it('parses negative values', () => {
    expect(parseUnitString('-10px').value).toBe(-10);
  });

  it('parses unitless numbers', () => {
    expect(parseUnitString('16').value).toBe(16);
    expect(parseUnitString('16').unit.name).toBe('');
  });

  it('handles whitespace', () => {
    expect(parseUnitString('  16px  ').value).toBe(16);
  });

  it('throws on invalid input', () => {
    expect(() => parseUnitString('invalid')).toThrow('Invalid CSS value');
    expect(() => parseUnitString('16xyz')).toThrow('Unknown unit: xyz');
  });

  it('accepts a custom registry', () => {
    const registry: Unit[] = [{ name: 'twip', kind: 'length', toBase: 1 / 1440 }];
    expect(parseUnitString('100twip', registry).unit.name).toBe('twip');
    expect(() => parseUnitString('100px', registry)).toThrow('Unknown unit: px');
  });
});

describe('formatUnit', () => {
  it('renders value + unit name', () => {
    expect(formatUnit({ value: 16, unit: need('px') })).toBe('16px');
    expect(formatUnit({ value: 1.5, unit: need('rem') })).toBe('1.5rem');
    expect(formatUnit({ value: 100, unit: need('%') })).toBe('100%');
  });

  it('round-trips with parseUnitString', () => {
    for (const s of ['16px', '1.5rem', '100%', '50vw', '16']) {
      expect(formatUnit(parseUnitString(s))).toBe(s);
    }
  });
});

describe('calculateWithUnits', () => {
  const px = need('px');
  const rem = need('rem');
  const pct = need('%');

  it('multiplies by scalar', () => {
    expect(formatUnit(calculateWithUnits({ value: 16, unit: px }, '*', 2))).toBe('32px');
    expect(formatUnit(calculateWithUnits({ value: 1.5, unit: rem }, '*', 2))).toBe('3rem');
  });

  it('divides by scalar', () => {
    expect(formatUnit(calculateWithUnits({ value: 32, unit: px }, '/', 2))).toBe('16px');
    expect(formatUnit(calculateWithUnits({ value: 100, unit: pct }, '/', 2))).toBe('50%');
  });

  it('throws on division by zero', () => {
    expect(() => calculateWithUnits({ value: 16, unit: px }, '/', 0)).toThrow('Division by zero');
  });

  it('adds matching units', () => {
    expect(
      formatUnit(calculateWithUnits({ value: 16, unit: px }, '+', { value: 8, unit: px })),
    ).toBe('24px');
  });

  it('rejects mismatched additive units', () => {
    expect(() => calculateWithUnits({ value: 16, unit: px }, '+', { value: 1, unit: rem })).toThrow(
      'Cannot add different units',
    );
  });

  it('subtracts matching units', () => {
    expect(
      formatUnit(calculateWithUnits({ value: 20, unit: px }, '-', { value: 5, unit: px })),
    ).toBe('15px');
  });
});

describe('convertUnit', () => {
  const ctx = { baseFontSize: 16, viewportWidth: 1920, viewportHeight: 1080 };
  const px = need('px');
  const rem = need('rem');
  const vw = need('vw');
  const vh = need('vh');

  it('converts px to rem and back', () => {
    expect(convertUnit({ value: 16, unit: px }, rem, ctx).value).toBe(1);
    expect(convertUnit({ value: 24, unit: px }, rem, ctx).value).toBe(1.5);
    expect(convertUnit({ value: 1.5, unit: rem }, px, ctx).value).toBe(24);
  });

  it('converts px to vw', () => {
    const result = convertUnit({ value: 1920, unit: px }, vw, ctx);
    expect(result.value).toBeCloseTo(100, 1);
  });

  it('converts vh to px', () => {
    expect(convertUnit({ value: 100, unit: vh }, px, ctx).value).toBe(1080);
  });

  it('returns input unchanged when units match', () => {
    const v = { value: 16, unit: px };
    expect(convertUnit(v, px, ctx)).toBe(v);
  });

  it('honors a custom baseFontSize', () => {
    expect(convertUnit({ value: 1, unit: rem }, px, { baseFontSize: 20 }).value).toBe(20);
  });

  it('throws on percentage without context', () => {
    expect(() => convertUnit({ value: 50, unit: need('%') }, px, ctx)).toThrow(
      'Cannot convert percentage without parent context',
    );
  });
});
