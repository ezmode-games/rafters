/**
 * TDD Tests for New Color Generator Architecture
 *
 * Tests the new approach where:
 * 1. Color families are stored as ColorValue objects (9 tokens)
 * 2. Semantic tokens reference families with ColorReference objects (50+ tokens)
 * 3. All intelligence is preserved in the ColorValue objects
 */

import type { ColorReference, ColorValue, Token } from '@rafters/shared';
import { ColorReferenceSchema, ColorValueSchema, TokenSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';

// Import the functions we'll implement
import {
  generateColorFamilyTokens,
  generateSemanticColorTokens,
  selectSemanticColorFromSuggestions,
} from '../../src/generators/color.js';

// Load fixture data
const primaryGrayscaleFixture = await import('../fixtures/api-response-primary-grayscale.json');
const validatedGrayscaleData = ColorValueSchema.parse(primaryGrayscaleFixture.default);

describe('Color Generator - TDD Architecture', () => {
  describe('generateColorFamilyTokens', () => {
    it('should generate 9 color family tokens with ColorValue objects', () => {
      const colorValues: Record<string, ColorValue> = {
        'default-primary': validatedGrayscaleData,
        'neutral-grayscale': { ...validatedGrayscaleData, name: 'Neutral Grayscale' },
        'secondary-complement': { ...validatedGrayscaleData, name: 'Secondary Complement' },
        'accent-triadic': { ...validatedGrayscaleData, name: 'Accent Triadic' },
        'highlight-tetradic': { ...validatedGrayscaleData, name: 'Highlight Tetradic' },
        'darkest-danger': { ...validatedGrayscaleData, name: 'Darkest Danger' },
        'brightest-success': { ...validatedGrayscaleData, name: 'Brightest Success' },
        'balanced-warning': { ...validatedGrayscaleData, name: 'Balanced Warning' },
        'quiet-info': { ...validatedGrayscaleData, name: 'Quiet Info' },
      };

      const familyTokens = generateColorFamilyTokens(colorValues);

      // Should generate exactly 9 family tokens
      expect(familyTokens).toHaveLength(9);

      // Each token should have category 'color-family'
      familyTokens.forEach((token) => {
        expect(token.category).toBe('color-family');
        expect(token.namespace).toBe('color');
      });

      // Each token value should be a ColorValue object
      familyTokens.forEach((token) => {
        expect(typeof token.value).toBe('object');
        expect('name' in token.value).toBe(true);
        expect('scale' in token.value).toBe(true);
        expect('intelligence' in token.value).toBe(true);

        // Validate it's a proper ColorValue
        expect(() => ColorValueSchema.parse(token.value)).not.toThrow();
      });

      // Should preserve ALL intelligence data
      const primaryToken = familyTokens.find((t) => t.name === 'default-primary');
      expect(primaryToken).toBeDefined();
      const primaryColorValue = primaryToken?.value as ColorValue;
      expect(primaryColorValue.intelligence).toBeDefined();
      expect(primaryColorValue.harmonies).toBeDefined();
      expect(primaryColorValue.accessibility).toBeDefined();
      expect(primaryColorValue.semanticSuggestions).toBeDefined();
    });

    it('should generate tokens with proper naming from ColorValue intelligence', () => {
      const colorValues: Record<string, ColorValue> = {
        'ocean-blue': {
          ...validatedGrayscaleData,
          intelligence: {
            ...(validatedGrayscaleData.intelligence ?? {}),
            suggestedName: 'Ocean Blue',
          },
        },
      };

      const familyTokens = generateColorFamilyTokens(colorValues);

      expect(familyTokens[0].name).toBe('ocean-blue');
      const colorValue = familyTokens[0].value as ColorValue;
      expect(colorValue.intelligence?.suggestedName).toBe('Ocean Blue');
    });

    it('should add AI metadata to family tokens', () => {
      const colorValues: Record<string, ColorValue> = {
        'test-family': validatedGrayscaleData,
      };

      const familyTokens = generateColorFamilyTokens(colorValues);
      const token = familyTokens[0];

      // Should have AI intelligence metadata
      expect(token.cognitiveLoad).toBeDefined();
      expect(token.trustLevel).toBeDefined();
      expect(token.accessibilityLevel).toBeDefined();
      expect(token.semanticMeaning).toBeDefined();
      expect(token.generateUtilityClass).toBe(false); // Families don't generate utilities directly
    });
  });

  describe('generateSemanticColorTokens', () => {
    const mockFamilyTokens: Token[] = [
      {
        name: 'ocean-blue',
        value: validatedGrayscaleData,
        category: 'color-family',
        namespace: 'color',
        semanticMeaning: 'Ocean blue color family',
      },
      {
        name: 'forest-green',
        value: { ...validatedGrayscaleData, name: 'Forest Green' },
        category: 'color-family',
        namespace: 'color',
        semanticMeaning: 'Forest green color family',
      },
    ];

    it('should generate semantic tokens with ColorReference values', () => {
      const semanticTokens = generateSemanticColorTokens(mockFamilyTokens, {
        primary: { family: 'ocean-blue', position: '600' },
        secondary: { family: 'forest-green', position: '500' },
      });

      expect(semanticTokens.length).toBeGreaterThan(0);

      // Find primary token
      const primaryToken = semanticTokens.find((t) => t.name === 'primary');
      expect(primaryToken).toBeDefined();

      // Should have ColorReference value
      expect(typeof primaryToken?.value).toBe('object');
      expect(primaryToken?.value && 'family' in primaryToken.value).toBe(true);
      expect(primaryToken?.value && 'position' in primaryToken.value).toBe(true);

      const colorRef = primaryToken?.value as ColorReference;
      expect(colorRef.family).toBe('ocean-blue');
      expect(colorRef.position).toBe('600');

      // Validate it's a proper ColorReference
      expect(() => ColorReferenceSchema.parse(primaryToken?.value)).not.toThrow();
    });

    it('should generate foreground tokens for each semantic color', () => {
      const semanticTokens = generateSemanticColorTokens(mockFamilyTokens, {
        primary: { family: 'ocean-blue', position: '600' },
      });

      const foregroundToken = semanticTokens.find((t) => t.name === 'primary-foreground');
      expect(foregroundToken).toBeDefined();

      const colorRef = foregroundToken?.value as ColorReference;
      expect(colorRef.family).toBeDefined(); // Should reference a neutral or contrasting family
      expect(colorRef.position).toBeDefined(); // Should be calculated for contrast
    });

    it('should generate state tokens (hover, active, focus, disabled)', () => {
      const semanticTokens = generateSemanticColorTokens(mockFamilyTokens, {
        primary: { family: 'ocean-blue', position: '600' },
      });

      const states = ['hover', 'active', 'focus', 'disabled'];

      states.forEach((state) => {
        const stateToken = semanticTokens.find((t) => t.name === `primary-${state}`);
        expect(stateToken).toBeDefined();

        const colorRef = stateToken?.value as ColorReference;
        expect(colorRef.family).toBe('ocean-blue');
        expect(colorRef.position).toBeDefined();
        expect(colorRef.position).not.toBe('600'); // Should be different from base
      });
    });

    it('should include proper AI metadata for semantic tokens', () => {
      const semanticTokens = generateSemanticColorTokens(mockFamilyTokens, {
        primary: { family: 'ocean-blue', position: '600' },
      });

      const primaryToken = semanticTokens.find((t) => t.name === 'primary');
      expect(primaryToken?.category).toBe('color');
      expect(primaryToken?.namespace).toBe('rafters');
      expect(primaryToken?.semanticMeaning).toBeDefined();
      expect(primaryToken?.applicableComponents).toBeDefined();
      expect(primaryToken?.trustLevel).toBe('critical'); // Primary should be critical
      expect(primaryToken?.generateUtilityClass).toBe(true);
    });

    it('should generate surface/UI tokens (background, foreground, border, etc.)', () => {
      const semanticTokens = generateSemanticColorTokens(mockFamilyTokens, {
        neutral: { family: 'ocean-blue', position: '600' },
      });

      const surfaceTokens = [
        'background',
        'foreground',
        'border',
        'input',
        'ring',
        'muted',
        'muted-foreground',
      ];

      surfaceTokens.forEach((tokenName) => {
        const token = semanticTokens.find((t) => t.name === tokenName);
        expect(token).toBeDefined();

        const colorRef = token?.value as ColorReference;
        expect(colorRef.family).toBeDefined();
        expect(colorRef.position).toBeDefined();
      });
    });
  });

  describe('selectSemanticColorFromSuggestions', () => {
    const mockColorValue: ColorValue = {
      ...validatedGrayscaleData,
      semanticSuggestions: {
        danger: [
          { l: 0.3, c: 0.15, h: 15, alpha: 1 }, // darkest
          { l: 0.5, c: 0.12, h: 15, alpha: 1 }, // middle
          { l: 0.7, c: 0.1, h: 15, alpha: 1 }, // lightest
        ],
        success: [
          { l: 0.4, c: 0.12, h: 135, alpha: 1 }, // darkest
          { l: 0.6, c: 0.14, h: 135, alpha: 1 }, // middle
          { l: 0.8, c: 0.1, h: 135, alpha: 1 }, // brightest
        ],
        warning: [
          { l: 0.5, c: 0.16, h: 45, alpha: 1 }, // middle
          { l: 0.7, c: 0.14, h: 45, alpha: 1 },
          { l: 0.3, c: 0.12, h: 45, alpha: 1 },
        ],
        info: [
          { l: 0.6, c: 0.05, h: 220, alpha: 1 }, // quietest
          { l: 0.5, c: 0.12, h: 220, alpha: 1 },
          { l: 0.4, c: 0.18, h: 220, alpha: 1 },
        ],
      },
    };

    it('should select darkest color for destructive', () => {
      const result = selectSemanticColorFromSuggestions(mockColorValue, 'destructive');

      // Should return the darkest danger color (lowest lightness)
      expect(result.l).toBe(0.3);
      expect(result.h).toBe(15); // Red hue
    });

    it('should select brightest color for success', () => {
      const result = selectSemanticColorFromSuggestions(mockColorValue, 'success');

      // Should return the brightest success color (highest lightness)
      expect(result.l).toBe(0.8);
      expect(result.h).toBe(135); // Green hue
    });

    it('should select middle lightness for warning', () => {
      const result = selectSemanticColorFromSuggestions(mockColorValue, 'warning');

      // Should return the color closest to 0.5 lightness
      expect(result.l).toBe(0.5);
      expect(result.h).toBe(45); // Yellow/orange hue
    });

    it('should select quietest (lowest chroma) for info', () => {
      const result = selectSemanticColorFromSuggestions(mockColorValue, 'info');

      // Should return the color with lowest chroma
      expect(result.c).toBe(0.05);
      expect(result.h).toBe(220); // Blue hue
    });

    it('should throw error for invalid semantic type', () => {
      expect(() => {
        selectSemanticColorFromSuggestions(mockColorValue, 'invalid' as 'destructive');
      }).toThrow('Invalid semantic type');
    });

    it('should throw error when no suggestions available', () => {
      const emptyColorValue: ColorValue = {
        ...validatedGrayscaleData,
        semanticSuggestions: {
          danger: [],
          success: [],
          warning: [],
          info: [],
        },
      };

      expect(() => {
        selectSemanticColorFromSuggestions(emptyColorValue, 'destructive');
      }).toThrow('No colors available');
    });
  });

  describe('Integration: Complete Color System Generation', () => {
    it('should generate complete system with families and semantic tokens', () => {
      // This test will verify the complete flow works together
      const colorValues: Record<string, ColorValue> = {
        'primary-family': validatedGrayscaleData,
        'neutral-family': { ...validatedGrayscaleData, name: 'Neutral' },
      };

      const familyTokens = generateColorFamilyTokens(colorValues);
      const semanticTokens = generateSemanticColorTokens(familyTokens, {
        primary: { family: 'primary-family', position: '600' },
        neutral: { family: 'neutral-family', position: '500' },
      });

      const allTokens = [...familyTokens, ...semanticTokens];

      // Should have both family and semantic tokens
      expect(familyTokens.length).toBe(2);
      expect(semanticTokens.length).toBeGreaterThan(10);

      // All tokens should validate against Token schema
      allTokens.forEach((token) => {
        expect(() => TokenSchema.parse(token)).not.toThrow();
      });

      // Family tokens should have ColorValue objects
      familyTokens.forEach((token) => {
        expect(() => ColorValueSchema.parse(token.value)).not.toThrow();
      });

      // Semantic tokens should have ColorReference objects
      const semanticColorTokens = semanticTokens.filter(
        (t) => typeof t.value === 'object' && 'family' in t.value
      );

      semanticColorTokens.forEach((token) => {
        expect(() => ColorReferenceSchema.parse(token.value)).not.toThrow();
      });
    });
  });
});
