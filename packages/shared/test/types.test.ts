/**
 * Tests for Token Schema and ColorValue Schema
 */

import { describe, expect, it } from 'vitest';
import { type ColorValue, ColorValueSchema, type Token, TokenSchema } from '../src/types.js';

describe('ColorValueSchema', () => {
  it('should validate a valid color value structure', () => {
    const validColorValue = {
      name: 'Ocean Blue',
      scale: [
        { l: 0.95, c: 0.02, h: 240 }, // 50
        { l: 0.9, c: 0.04, h: 240 }, // 100
        { l: 0.85, c: 0.06, h: 240 }, // 200
        { l: 0.8, c: 0.08, h: 240 }, // 300
        { l: 0.7, c: 0.1, h: 240 }, // 400
        { l: 0.6, c: 0.12, h: 240 }, // 500
        { l: 0.5, c: 0.14, h: 240 }, // 600
        { l: 0.4, c: 0.16, h: 240 }, // 700
        { l: 0.3, c: 0.18, h: 240 }, // 800
        { l: 0.2, c: 0.2, h: 240 }, // 900
      ],
      token: 'primary',
      value: '500',
      states: {
        hover: 'ocean-blue-600',
        focus: 'ocean-blue-700',
        active: 'ocean-blue-800',
        disabled: 'ocean-blue-400',
      },
    };

    const result = ColorValueSchema.safeParse(validColorValue);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.scale).toHaveLength(10);
      expect(result.data.scale[0]).toEqual({ l: 0.95, c: 0.02, h: 240 }); // shade 50
      expect(result.data.scale[5]).toEqual({ l: 0.6, c: 0.12, h: 240 }); // shade 500
      expect(result.data.token).toBe('primary');
      expect(result.data.states?.hover).toBe('ocean-blue-600');
    }
  });

  it('should validate minimal color value (required fields only)', () => {
    const minimalColorValue = {
      name: 'Brand Blue',
      scale: [
        { l: 0.6, c: 0.12, h: 240 }, // Just one color in scale
      ],
    };

    const result = ColorValueSchema.safeParse(minimalColorValue);
    expect(result.success).toBe(true);
  });

  it('should reject invalid scale (non-OKLCH objects)', () => {
    const invalidColorValue = {
      name: 'Bad Blue',
      scale: ['50', '100'], // strings instead of OKLCH objects
    };

    const result = ColorValueSchema.safeParse(invalidColorValue);
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const invalidColorValue = {
      baseColor: 'blue-800',
      // missing name, value, and scale
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

  it('should validate simple color token', () => {
    const colorToken = {
      name: 'primary',
      value: 'oklch(0.6 0.12 240)', // Simple OKLCH string value
      category: 'color',
      namespace: 'color',
      semanticMeaning: 'Primary brand color for main actions',
      cognitiveLoad: 3,
      trustLevel: 'high' as const,
    };

    const result = TokenSchema.safeParse(colorToken);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.value).toBe('string');
      expect(result.data.value).toBe('oklch(0.6 0.12 240)');
      expect(result.data.semanticMeaning).toBe('Primary brand color for main actions');
      expect(result.data.cognitiveLoad).toBe(3);
    }
  });

  it('should validate light token (new pattern: no darkValue)', () => {
    const lightToken = {
      name: 'background',
      value: 'oklch(1 0 0)', // light mode - white
      category: 'color',
      namespace: 'color',
    };

    const result = TokenSchema.safeParse(lightToken);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.value).toBe('string');
      expect(result.data.value).toBe('oklch(1 0 0)');
      // darkValue no longer exists - dark mode handled via separate -dark tokens
      expect(result.data.darkValue).toBeUndefined();
    }
  });

  it('should validate simple string values only', () => {
    const simpleToken = {
      name: 'accent',
      value: 'oklch(0.65 0.15 300)', // simple light mode
      category: 'color',
      namespace: 'color',
    };

    const result = TokenSchema.safeParse(simpleToken);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(typeof result.data.value).toBe('string');
      // darkValue no longer exists - dark mode handled via separate -dark tokens
      expect(result.data.darkValue).toBeUndefined();
    }
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
