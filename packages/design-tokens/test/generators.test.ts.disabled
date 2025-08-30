/**
 * Comprehensive tests for token generators
 * Validates that generators produce format-agnostic, correct token objects
 */

import { describe, expect, it } from 'vitest';
import {
  type Token,
  generateBorderRadiusTokens,
  generateBreakpointTokens,
  generateColorTokens,
  generateDepthScale,
  generateFontWeightTokens,
  generateGridTokens,
  generateMotionTokens,
  generateOpacityTokens,
  generateSpacingScale,
  generateTypographyScale,
} from '../src/index.js';

describe('Token Generators', () => {
  describe('generateSpacingScale', () => {
    it('should generate linear spacing tokens with correct structure', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 12, false);

      expect(tokens).toHaveLength(13); // 0 through 12

      // Test first token (0)
      expect(tokens[0]).toMatchObject({
        name: '0',
        value: '0rem',
        category: 'spacing',
        namespace: 'spacing',
        semanticMeaning: expect.stringContaining('Spacing step 0'),
        mathRelationship: expect.stringContaining('4 * 0'),
        scalePosition: 0,
        generateUtilityClass: true,
        applicableComponents: ['all'],
      });

      // Test second token (1)
      expect(tokens[1]).toMatchObject({
        name: '1',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
        semanticMeaning: expect.stringContaining('Spacing step 1'),
        mathRelationship: expect.stringContaining('4 * 1'),
        scalePosition: 1,
      });

      // Verify no responsive variants are generated
      const responsiveTokens = tokens.filter((t) => t.name.includes('-') || t.name.includes('@'));
      expect(responsiveTokens).toHaveLength(0);
    });

    it('should generate golden ratio spacing with correct math', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 3, false);

      expect(tokens).toHaveLength(4); // 0 through 3
      expect(tokens[0].value).toBe('0rem');
      expect(tokens[1].mathRelationship).toContain('1.618'); // Should use golden ratio, not the multiplier
      expect(tokens[1].name).toBe('golden-1');
    });

    it('should not generate responsive variants when disabled', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 5, false);

      // Should only have base tokens
      expect(tokens.every((t) => !t.name.includes('sm-') && !t.name.includes('@'))).toBe(true);
      expect(tokens.every((t) => !t.viewportAware && !t.containerQueryAware)).toBe(true);
    });
  });

  describe('generateColorTokens', () => {
    it('should generate semantic color tokens with dark variants', () => {
      const tokens = generateColorTokens();

      expect(tokens.length).toBeGreaterThan(20);

      // Test primary color token
      const primaryToken = tokens.find((t) => t.name === 'primary');
      expect(primaryToken).toMatchObject({
        name: 'primary',
        value: expect.stringContaining('oklch'),
        darkValue: expect.stringContaining('oklch'),
        category: 'color',
        namespace: 'color',
        semanticMeaning: expect.stringContaining('Primary brand'),
        trustLevel: 'high',
        cognitiveLoad: 4,
      });

      // Test destructive color has critical trust level
      const destructiveToken = tokens.find((t) => t.name === 'destructive');
      expect(destructiveToken?.trustLevel).toBe('critical');
      expect(destructiveToken?.cognitiveLoad).toBe(8);

      // Verify all color tokens have OKLCH values
      const colorTokens = tokens.filter((t) => t.category === 'color');
      for (const token of colorTokens) {
        expect(token.value).toMatch(/oklch\([\d\.\s]+\)/);
        if (token.darkValue) {
          expect(token.darkValue).toMatch(/oklch\([\d\.\s]+\)/);
        }
      }
    });

    it('should assign appropriate trust levels and cognitive loads', () => {
      const tokens = generateColorTokens();

      const destructive = tokens.find((t) => t.name === 'destructive');
      const warning = tokens.find((t) => t.name === 'warning');
      const primary = tokens.find((t) => t.name === 'primary');
      const background = tokens.find((t) => t.name === 'background');

      expect(destructive?.trustLevel).toBe('critical');
      expect(warning?.trustLevel).toBe('medium');
      expect(primary?.trustLevel).toBe('high');
      expect(background?.trustLevel).toBe('low');

      expect(destructive?.cognitiveLoad).toBe(8);
      expect(warning?.cognitiveLoad).toBe(6);
      expect(primary?.cognitiveLoad).toBe(4);
      expect(background?.cognitiveLoad).toBe(2);
    });
  });

  describe('generateTypographyScale', () => {
    it('should generate typography tokens with line heights', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      const fontSizeTokens = tokens.filter((t) => t.category === 'font-size');
      const lineHeightTokens = tokens.filter((t) => t.category === 'line-height');

      expect(fontSizeTokens.length).toBeGreaterThan(10);
      expect(lineHeightTokens.length).toBeGreaterThan(10);

      // Test base font size
      const baseFont = fontSizeTokens.find((t) => t.name === 'base');
      expect(baseFont).toMatchObject({
        name: 'base',
        value: '1rem',
        lineHeight: '1.5',
        category: 'font-size',
        namespace: 'font-size',
        mathRelationship: expect.stringContaining('1.618033988749^0'),
      });

      // Test line height pairing
      const baseLeading = lineHeightTokens.find((t) => t.name === 'base');
      expect(baseLeading?.pairedWith).toContain('base');
    });

    it('should not generate responsive variants when disabled', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      const responsiveTokens = tokens.filter(
        (t) => t.name.includes('sm-') || t.name.includes('@') || t.viewportAware
      );
      expect(responsiveTokens).toHaveLength(0);
    });
  });

  describe('generateDepthScale', () => {
    it('should generate shadow and z-index tokens', () => {
      const tokens = generateDepthScale();

      const shadowTokens = tokens.filter((t) => t.category === 'shadow');
      const zTokens = tokens.filter((t) => t.category === 'z-index');

      expect(shadowTokens.length).toBeGreaterThan(5);
      expect(zTokens.length).toBeGreaterThan(5);

      // Test semantic z-index
      const modalZ = zTokens.find((t) => t.name === 'modal');
      expect(modalZ).toMatchObject({
        name: 'modal',
        value: '1000',
        category: 'z-index',
        namespace: 'z',
        semanticMeaning: expect.stringContaining('Modal dialogs'),
      });

      // Test shadow values
      const baseShadow = shadowTokens.find((t) => t.name === 'base');
      expect(baseShadow?.value).toContain('rgb(0 0 0');
    });
  });

  describe('generateMotionTokens', () => {
    it('should generate duration and easing tokens', () => {
      const tokens = generateMotionTokens();

      const durationTokens = tokens.filter((t) => t.category === 'motion');
      const easingTokens = tokens.filter((t) => t.category === 'easing');

      expect(durationTokens.length).toBeGreaterThan(3);
      expect(easingTokens.length).toBeGreaterThan(3);

      // Test duration token structure
      const standardDuration = durationTokens.find((t) => t.name === 'standard');
      expect(standardDuration).toMatchObject({
        name: 'standard',
        value: '300ms',
        category: 'motion',
        namespace: 'duration',
        reducedMotionAware: true,
        motionDuration: 300,
        cognitiveLoad: 3,
      });

      // Test easing token
      const smoothEasing = easingTokens.find((t) => t.name === 'smooth');
      expect(smoothEasing?.value).toBe('ease-in-out');
    });
  });

  describe('generateBorderRadiusTokens', () => {
    it('should generate radius tokens with semantic names', () => {
      const tokens = generateBorderRadiusTokens();

      expect(tokens.length).toBeGreaterThan(5);

      const baseRadius = tokens.find((t) => t.name === 'base');
      expect(baseRadius).toMatchObject({
        name: 'base',
        value: '0.25rem',
        category: 'border-radius',
        namespace: 'radius',
      });

      const fullRadius = tokens.find((t) => t.name === 'full');
      expect(fullRadius?.value).toBe('9999px');
    });
  });

  describe('Token Schema Validation', () => {
    it('should generate tokens that match the Token schema', () => {
      const spacingTokens = generateSpacingScale('linear', 4, 1.25, 3);
      const colorTokens = generateColorTokens().slice(0, 5); // Just test a few

      const allTokens = [...spacingTokens, ...colorTokens];

      for (const token of allTokens) {
        // Required fields
        expect(token.name).toBeDefined();
        expect(token.value).toBeDefined();
        expect(token.category).toBeDefined();
        expect(token.namespace).toBeDefined();

        // Optional fields should be consistent types when present
        if (token.scalePosition !== undefined) {
          expect(typeof token.scalePosition).toBe('number');
        }
        if (token.cognitiveLoad !== undefined) {
          expect(token.cognitiveLoad).toBeGreaterThanOrEqual(1);
          expect(token.cognitiveLoad).toBeLessThanOrEqual(10);
        }
        if (token.trustLevel !== undefined) {
          expect(['low', 'medium', 'high', 'critical']).toContain(token.trustLevel);
        }
      }
    });
  });

  describe('Cross-generator consistency', () => {
    it('should use consistent naming patterns across generators', () => {
      const spacing = generateSpacingScale('linear', 4, 1.25, 3);
      const colors = generateColorTokens();
      const typography = generateTypographyScale('golden', 1, false);

      // All tokens should have consistent structure
      const allTokens = [...spacing, ...colors.slice(0, 5), ...typography.slice(0, 5)];

      for (const token of allTokens) {
        expect(token.name).toMatch(/^[a-z0-9\-]+$/); // lowercase, numbers, hyphens only
        expect(token.namespace).toMatch(/^[a-z\-]+$/); // consistent namespace format
        expect(token.category).toMatch(/^[a-z\-]+$/); // consistent category format
      }
    });

    it('should generate reasonable token counts', () => {
      const spacing = generateSpacingScale('linear', 4, 1.25, 12);
      const colors = generateColorTokens();
      const typography = generateTypographyScale('golden', 1, false);

      // Spacing: 13 base tokens (0-12)
      expect(spacing).toHaveLength(13);

      // Colors: Should have semantic colors + foreground pairs
      expect(colors.length).toBeGreaterThan(20);
      expect(colors.length).toBeLessThan(50);

      // Typography: font-size + line-height for each size
      expect(typography.length).toBeGreaterThan(20); // 13 sizes × 2 categories
    });
  });
});
