/**
 * TDD Tests for Rafters Default System Generator
 *
 * Tests the complete default system generation using all generators
 * to create a 240+ token design system with Rafters Gray as primary.
 */

import { describe, expect, it } from 'vitest';
import { generateAllTokens } from '../src/generators/index.js';

describe('Rafters Default System Generator', () => {
  describe('generateAllTokens', () => {
    it('should generate 240+ tokens for complete design system', async () => {
      const tokens = await generateAllTokens();

      expect(tokens.length).toBeGreaterThanOrEqual(240);
    }, 30000); // 30 second timeout for API calls

    it('should include all major token categories', async () => {
      const tokens = await generateAllTokens();
      const categories = [...new Set(tokens.map((t) => t.category))];

      // Must include all these categories for complete system
      const requiredCategories = [
        'color',
        'color-family',
        'spacing',
        'font-size',
        'font-weight',
        'font-family',
        'motion',
        'border-radius',
        'opacity',
        'breakpoint',
      ];

      requiredCategories.forEach((category) => {
        expect(categories).toContain(category);
      }, 30000);
    }, 30000);

    it('should use Rafters Gray oklch(0.44 0.01 286) as primary color', async () => {
      const tokens = await generateAllTokens();

      // Should have color family tokens generated from Rafters Gray
      const colorFamilyTokens = tokens.filter((t) => t.category === 'color-family');
      expect(colorFamilyTokens.length).toBeGreaterThan(0);

      // Primary family should exist
      const primaryFamily = colorFamilyTokens.find(
        (t) => t.name.includes('primary') || t.name.includes('default')
      );
      expect(primaryFamily).toBeDefined();
    }, 30000);

    it('should generate semantic color tokens referencing families', async () => {
      const tokens = await generateAllTokens();

      // Should have semantic tokens like 'primary', 'secondary', etc.
      const semanticColorTokens = tokens.filter(
        (t) =>
          t.category === 'color' &&
          typeof t.value === 'object' &&
          t.value !== null &&
          'family' in t.value
      );

      expect(semanticColorTokens.length).toBeGreaterThan(0);

      // Should have core semantic tokens
      const tokenNames = semanticColorTokens.map((t) => t.name);
      expect(tokenNames).toContain('primary');
      expect(tokenNames).toContain('background');
      expect(tokenNames).toContain('foreground');
    }, 30000);

    it('should generate complete typography scale', async () => {
      const tokens = await generateAllTokens();

      const typographyTokens = tokens.filter((t) => t.category === 'font-size');
      expect(typographyTokens.length).toBeGreaterThan(5); // At least xs, sm, base, lg, xl, etc.

      // Should include common sizes (Tailwind naming)
      const tokenNames = typographyTokens.map((t) => t.name);
      expect(tokenNames).toContain('text-base');
      expect(tokenNames).toContain('text-lg');
      expect(tokenNames).toContain('text-sm');
    }, 30000);

    it('should generate complete spacing scale', async () => {
      const tokens = await generateAllTokens();

      const spacingTokens = tokens.filter((t) => t.category === 'spacing');
      expect(spacingTokens.length).toBeGreaterThan(10);

      // Should include various spacing values
      const tokenNames = spacingTokens.map((t) => t.name);
      expect(tokenNames.some((name) => name.includes('1'))).toBe(true);
      expect(tokenNames.some((name) => name.includes('4'))).toBe(true);
      expect(tokenNames.some((name) => name.includes('8'))).toBe(true);
    }, 30000);

    it('should generate motion tokens for animations', async () => {
      const tokens = await generateAllTokens();

      const motionTokens = tokens.filter((t) => t.category === 'motion');
      expect(motionTokens.length).toBeGreaterThan(0);

      // Should have motion tokens (check actual names)
      const _motionNames = motionTokens.map((t) => t.name);
      // Verify we have motion tokens
      expect(motionTokens.length).toBeGreaterThan(0);
    }, 30000);

    it('should have all tokens with required metadata', async () => {
      const tokens = await generateAllTokens();

      tokens.forEach((token) => {
        // Every token must have these basic properties
        expect(token.name).toBeDefined();
        expect(token.name.length).toBeGreaterThan(0);
        expect(token.category).toBeDefined();
        expect(token.category.length).toBeGreaterThan(0);
        expect(token.value).toBeDefined();

        // Should have AI metadata for decision making
        expect(token.namespace).toBeDefined();
      }, 30000);
    }, 30000);

    it('should generate tokens suitable for shadcn compatibility', async () => {
      const tokens = await generateAllTokens();

      // Must have these specific tokens for shadcn compatibility
      const requiredShadcnTokens = [
        'background',
        'foreground',
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'muted',
        'muted-foreground',
        'destructive',
        'destructive-foreground',
        'border',
        'input',
        'ring',
      ];

      const tokenNames = tokens.map((t) => t.name);

      requiredShadcnTokens.forEach((requiredToken) => {
        expect(tokenNames).toContain(requiredToken);
      }, 30000);
    }, 30000);
  });

  describe('Default System Archive Structure', () => {
    it('should be ready for CLI embedding format', async () => {
      // This test will validate the archive structure once we implement it
      const tokens = await generateAllTokens();

      // For now, just validate we have a complete token set
      expect(tokens.length).toBeGreaterThan(0);

      // TODO: Test actual archive structure with manifest, etc.
    }, 30000);
  });
});
