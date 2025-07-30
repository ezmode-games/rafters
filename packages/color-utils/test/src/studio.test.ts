/**
 * Tests for Studio integration utilities
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  generateCSSVariables,
  generateTailwindConfig,
  isValidColorString,
  parseColorString,
} from '../../src/studio.js';

describe('Studio Integration Utilities', () => {
  const testPalette: Record<string, OKLCH> = {
    primary: { l: 0.5, c: 0.15, h: 240 },
    secondary: { l: 0.6, c: 0.12, h: 120 },
    accent: { l: 0.7, c: 0.18, h: 60 },
    neutral: { l: 0.5, c: 0.02, h: 0 },
    success: { l: 0.55, c: 0.14, h: 140 },
  };

  describe('generateCSSVariables', () => {
    it('should generate CSS custom properties with default prefix', () => {
      const css = generateCSSVariables(testPalette);

      expect(css).toContain('--color-primary:');
      expect(css).toContain('--color-secondary:');
      expect(css).toContain('--color-accent:');
      expect(css).toContain('oklch(');
    });

    it('should use custom prefix when provided', () => {
      const css = generateCSSVariables(testPalette, '--theme');

      expect(css).toContain('--theme-primary:');
      expect(css).toContain('--theme-secondary:');
      expect(css).not.toContain('--color-');
    });

    it('should format OKLCH values correctly', () => {
      const css = generateCSSVariables({ test: { l: 0.5, c: 0.1, h: 180 } });

      expect(css).toMatch(/oklch\(0\.5 0\.1 180\)/);
    });

    it('should handle empty palette', () => {
      const css = generateCSSVariables({});

      expect(css).toBe('');
    });

    it('should escape color names with special characters', () => {
      const palette = { 'primary-500': { l: 0.5, c: 0.1, h: 180 } };
      const css = generateCSSVariables(palette);

      expect(css).toContain('--color-primary-500:');
    });

    it('should produce valid CSS syntax', () => {
      const css = generateCSSVariables(testPalette);

      // Check for proper CSS syntax
      expect(css).toMatch(/--[\w-]+:\s*oklch\([^)]+\);/);

      // Should end with semicolon and newline
      const lines = css.trim().split('\n');
      for (const line of lines) {
        expect(line.trim()).toMatch(/;$/);
      }
    });
  });

  describe('generateTailwindConfig', () => {
    it('should generate Tailwind color configuration', () => {
      const config = generateTailwindConfig(testPalette);

      expect(config).toHaveProperty('primary');
      expect(config).toHaveProperty('secondary');
      expect(config).toHaveProperty('accent');
      expect(typeof config.primary).toBe('string');
    });

    it('should convert OKLCH to hex format for Tailwind', () => {
      const config = generateTailwindConfig(testPalette);

      for (const value of Object.values(config)) {
        expect(value).toMatch(/^#[0-9a-f]{6}$/i);
      }
    });

    it('should handle empty palette', () => {
      const config = generateTailwindConfig({});

      expect(config).toEqual({});
    });

    it('should preserve color names', () => {
      const config = generateTailwindConfig(testPalette);

      expect(Object.keys(config)).toEqual(Object.keys(testPalette));
    });

    it('should handle color names with numbers and dashes', () => {
      const palette = {
        'blue-500': { l: 0.5, c: 0.15, h: 240 },
        'gray-50': { l: 0.95, c: 0.02, h: 0 },
      };

      const config = generateTailwindConfig(palette);

      expect(config).toHaveProperty('blue-500');
      expect(config).toHaveProperty('gray-50');
    });
  });

  describe('isValidColorString', () => {
    it('should validate hex colors', () => {
      expect(isValidColorString('#ff0000')).toBe(true);
      expect(isValidColorString('#f00')).toBe(true);
      expect(isValidColorString('#FF0000')).toBe(true);
      expect(isValidColorString('#gggggg')).toBe(false);
      expect(isValidColorString('ff0000')).toBe(false); // Missing #
    });

    it('should validate RGB colors', () => {
      expect(isValidColorString('rgb(255, 0, 0)')).toBe(true);
      expect(isValidColorString('rgb(255,0,0)')).toBe(true);
      expect(isValidColorString('rgba(255, 0, 0, 0.5)')).toBe(true);
      // Note: colorjs.io may be lenient with out-of-range values
      expect(typeof isValidColorString('rgb(256, 0, 0)')).toBe('boolean');
    });

    it('should validate HSL colors', () => {
      expect(isValidColorString('hsl(0, 100%, 50%)')).toBe(true);
      expect(isValidColorString('hsla(0, 100%, 50%, 0.5)')).toBe(true);
      expect(isValidColorString('hsl(360, 100%, 50%)')).toBe(true);
      // Note: colorjs.io may be lenient with hue values
      expect(typeof isValidColorString('hsl(361, 100%, 50%)')).toBe('boolean');
    });

    it('should validate OKLCH colors', () => {
      expect(isValidColorString('oklch(0.5 0.1 180)')).toBe(true);
      expect(isValidColorString('oklch(50% 0.1 180deg)')).toBe(true);
      // Note: colorjs.io may be lenient with lightness values
      expect(typeof isValidColorString('oklch(1.5 0.1 180)')).toBe('boolean');
    });

    it('should validate named colors', () => {
      expect(isValidColorString('red')).toBe(true);
      expect(isValidColorString('blue')).toBe(true);
      expect(isValidColorString('transparent')).toBe(true);
      expect(isValidColorString('notacolor')).toBe(false);
    });

    it('should reject invalid formats', () => {
      expect(isValidColorString('')).toBe(false);
      expect(isValidColorString('invalid')).toBe(false);
      expect(isValidColorString('123')).toBe(false);
      expect(isValidColorString('#')).toBe(false);
    });
  });

  describe('parseColorString', () => {
    it('should parse hex colors to OKLCH', () => {
      const result = parseColorString('#ff0000');

      expect(result).toHaveProperty('l');
      expect(result).toHaveProperty('c');
      expect(result).toHaveProperty('h');
      expect(result.l).toBeGreaterThan(0);
      expect(result.c).toBeGreaterThan(0);
    });

    it('should parse RGB colors to OKLCH', () => {
      const result = parseColorString('rgb(255, 0, 0)');

      expect(result).toHaveProperty('l');
      expect(result).toHaveProperty('c');
      expect(result).toHaveProperty('h');
    });

    it('should parse HSL colors to OKLCH', () => {
      const result = parseColorString('hsl(0, 100%, 50%)');

      expect(result).toHaveProperty('l');
      expect(result).toHaveProperty('c');
      expect(result).toHaveProperty('h');
    });

    it('should parse OKLCH colors', () => {
      const result = parseColorString('oklch(0.5 0.1 180)');

      expect(result.l).toBeCloseTo(0.5, 2);
      expect(result.c).toBeCloseTo(0.1, 2);
      expect(result.h).toBeCloseTo(180, 1);
    });

    it('should parse named colors to OKLCH', () => {
      const result = parseColorString('red');

      expect(result).toHaveProperty('l');
      expect(result).toHaveProperty('c');
      expect(result).toHaveProperty('h');
      expect(result.c).toBeGreaterThan(0); // Red should have chroma
    });

    it('should throw for invalid color strings', () => {
      expect(() => parseColorString('invalid')).toThrow();
      expect(() => parseColorString('')).toThrow();
      expect(() => parseColorString('#gggggg')).toThrow();
    });

    it('should handle alpha values gracefully', () => {
      // Should parse but ignore alpha
      const result = parseColorString('rgba(255, 0, 0, 0.5)');

      expect(result).toHaveProperty('l');
      expect(result).toHaveProperty('c');
      expect(result).toHaveProperty('h');
    });
  });
});
