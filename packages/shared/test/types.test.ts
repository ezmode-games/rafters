/**
 * Tests for Token Schema and ColorValue Schema
 */

import { describe, expect, it } from 'vitest';
import { type ColorValue, ColorValueSchema, type Token, TokenSchema } from '../src/types.js';

describe('ColorValueSchema', () => {
  it('should validate a valid color value structure', () => {
    const validColorValue = {
      scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      values: [
        'oklch(0.95 0.02 240)',
        'oklch(0.9 0.04 240)',
        'oklch(0.85 0.06 240)',
        'oklch(0.8 0.08 240)',
        'oklch(0.7 0.1 240)',
        'oklch(0.6 0.12 240)',
        'oklch(0.5 0.14 240)',
        'oklch(0.4 0.16 240)',
        'oklch(0.3 0.18 240)',
        'oklch(0.2 0.2 240)',
      ],
      baseColor: 'blue-800',
      states: {
        hover: 'blue-900',
        focus: 'blue-700',
        active: 'blue-950',
        disabled: 'blue-400',
      },
    };

    const result = ColorValueSchema.safeParse(validColorValue);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.scale).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);
      expect(result.data.values).toHaveLength(10);
      expect(result.data.baseColor).toBe('blue-800');
      expect(result.data.states?.hover).toBe('blue-900');
    }
  });

  it('should validate minimal color value (just scale and values)', () => {
    const minimalColorValue = {
      scale: [500],
      values: ['oklch(0.6 0.12 240)'],
    };

    const result = ColorValueSchema.safeParse(minimalColorValue);
    expect(result.success).toBe(true);
  });

  it('should reject invalid scale (non-numbers)', () => {
    const invalidColorValue = {
      scale: ['50', '100'], // strings instead of numbers
      values: ['oklch(0.95 0.02 240)', 'oklch(0.9 0.04 240)'],
    };

    const result = ColorValueSchema.safeParse(invalidColorValue);
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const invalidColorValue = {
      baseColor: 'blue-800', // missing scale and values
    };

    const result = ColorValueSchema.safeParse(invalidColorValue);
    expect(result.success).toBe(false);
  });
});

describe('TokenSchema with Union Types', () => {
  it('should validate simple string token', () => {
    const simpleToken = {
      name: 'spacing-md',
      value: '1rem',
      category: 'spacing',
      namespace: 'spacing',
    };

    const result = TokenSchema.safeParse(simpleToken);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.value).toBe('string');
      expect(result.data.value).toBe('1rem');
    }
  });

  it('should validate complex color token', () => {
    const colorToken = {
      name: 'primary',
      value: {
        scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        values: [
          'oklch(0.95 0.02 240)',
          'oklch(0.9 0.04 240)',
          'oklch(0.85 0.06 240)',
          'oklch(0.8 0.08 240)',
          'oklch(0.7 0.1 240)',
          'oklch(0.6 0.12 240)',
          'oklch(0.5 0.14 240)',
          'oklch(0.4 0.16 240)',
          'oklch(0.3 0.18 240)',
          'oklch(0.2 0.2 240)',
        ],
        baseColor: 'blue-600',
        states: {
          hover: 'blue-700',
          focus: 'blue-500',
        },
      },
      category: 'color',
      namespace: 'color',
      semanticMeaning: 'Primary brand color for main actions',
      cognitiveLoad: 3,
      trustLevel: 'high' as const,
    };

    const result = TokenSchema.safeParse(colorToken);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.value).toBe('object');
      expect(result.data.value).toHaveProperty('scale');
      expect(result.data.value).toHaveProperty('values');
      expect(result.data.value).toHaveProperty('baseColor');
      expect(result.data.value).toHaveProperty('states');
    }
  });

  it('should validate token with complex darkValue', () => {
    const tokenWithComplexDark = {
      name: 'background',
      value: 'oklch(1 0 0)', // light mode - white
      darkValue: {
        scale: [50, 100],
        values: ['oklch(0.1 0 0)', 'oklch(0.05 0 0)'],
        baseColor: 'gray-900',
      },
      category: 'color',
      namespace: 'color',
    };

    const result = TokenSchema.safeParse(tokenWithComplexDark);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.value).toBe('string');
      expect(typeof result.data.darkValue).toBe('object');
      expect(result.data.darkValue).toHaveProperty('scale');
      expect(result.data.darkValue).toHaveProperty('values');
    }
  });

  it('should validate mixed simple and complex values', () => {
    const mixedToken = {
      name: 'accent',
      value: 'oklch(0.65 0.15 300)', // simple light mode
      darkValue: {
        scale: [400, 500, 600],
        values: ['oklch(0.7 0.12 300)', 'oklch(0.65 0.15 300)', 'oklch(0.6 0.18 300)'],
        baseColor: 'purple-500',
      },
      category: 'color',
      namespace: 'color',
    };

    const result = TokenSchema.safeParse(mixedToken);
    expect(result.success).toBe(true);
  });

  it('should reject invalid union values', () => {
    const invalidToken = {
      name: 'invalid',
      value: 123, // number not allowed
      category: 'spacing',
      namespace: 'spacing',
    };

    const result = TokenSchema.safeParse(invalidToken);
    expect(result.success).toBe(false);
  });
});

describe('Type Inference', () => {
  it('should properly infer Token type with union values', () => {
    // This test verifies TypeScript compilation more than runtime behavior
    const stringToken: Token = {
      name: 'test',
      value: 'test-value',
      category: 'test',
      namespace: 'test',
    };

    const colorToken: Token = {
      name: 'test-color',
      value: {
        scale: [500],
        values: ['oklch(0.5 0.1 180)'],
      },
      category: 'color',
      namespace: 'color',
    };

    // These should compile without errors
    expect(stringToken.name).toBe('test');
    expect(colorToken.name).toBe('test-color');

    // Type guards would be needed to safely access union properties
    if (typeof colorToken.value === 'object') {
      expect(colorToken.value.scale).toEqual([500]);
    }
  });
});
