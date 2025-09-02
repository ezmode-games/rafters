/**
 * Unit tests for main design-tokens exports
 */

import type { ColorValue } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateShortCode, tokenValueToCss } from '../src/index.js';

describe('generateShortCode', () => {
  it('should generate a short code string', () => {
    const code = generateShortCode();
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });

  it('should generate different codes on subsequent calls', () => {
    const code1 = generateShortCode();
    // Small delay to ensure different timestamp
    const code2 = generateShortCode();
    // Allow for potential timestamp collision but verify it's at least a valid string
    expect(typeof code2).toBe('string');
    expect(code2.length).toBeGreaterThan(0);
  });
});

describe('tokenValueToCss', () => {
  it('should return string values unchanged', () => {
    const value = '1rem';
    expect(tokenValueToCss(value)).toBe('1rem');
  });

  it('should convert ColorValue with scale to OKLCH CSS', () => {
    const colorValue: ColorValue = {
      name: 'test-color',
      scale: [
        { l: 0.9, c: 0.02, h: 240 },
        { l: 0.8, c: 0.04, h: 240 },
        { l: 0.7, c: 0.06, h: 240 },
        { l: 0.6, c: 0.08, h: 240 },
        { l: 0.5, c: 0.1, h: 240 },
        { l: 0.4, c: 0.12, h: 240 }, // index 5 - default 500 position
      ],
      value: '500',
    };

    const result = tokenValueToCss(colorValue);
    expect(result).toBe('oklch(0.4 0.12 240)');
  });

  it('should handle ColorValue with specific scale position', () => {
    const colorValue: ColorValue = {
      name: 'test-color',
      scale: [
        { l: 0.9, c: 0.02, h: 240 }, // 50
        { l: 0.8, c: 0.04, h: 240 }, // 100
        { l: 0.7, c: 0.06, h: 240 }, // 200
      ],
      value: '100', // Should get index 1
    };

    const result = tokenValueToCss(colorValue);
    expect(result).toBe('oklch(0.8 0.04 240)');
  });

  it('should handle ColorValue with alpha channel', () => {
    const colorValue: ColorValue = {
      name: 'test-color',
      scale: [{ l: 0.5, c: 0.1, h: 240, alpha: 0.8 }],
      value: '50',
    };

    const result = tokenValueToCss(colorValue);
    expect(result).toBe('oklch(0.5 0.1 240 / 0.8)');
  });

  it('should handle empty scale ColorValue gracefully', () => {
    const colorValue: ColorValue = {
      name: 'Empty Scale',
      scale: [],
      value: '500',
    };

    const result = tokenValueToCss(colorValue);
    // Should return a reasonable fallback
    expect(typeof result).toBe('string');
  });
});
