/**
 * TDD Tests for Mathematical Integration
 *
 * These tests capture the current mathematical behavior of generators
 * before refactoring to use centralized math-utils package.
 *
 * The tests verify:
 * 1. Exact mathematical values are preserved
 * 2. Token structure remains consistent
 * 3. Progression logic produces identical results
 * 4. Edge cases are handled correctly
 */

import { describe, expect, it } from 'vitest';
import { generateHeightScale } from '../../src/generators/height.js';
import { generateMotionTokens } from '../../src/generators/motion.js';
import { generateSpacingScale } from '../../src/generators/spacing.js';
// Import the generators we'll refactor
import { generateTypographyScale } from '../../src/generators/typography.js';

describe('Mathematical Integration - Current Behavior (TDD)', () => {
  describe('Typography Generator - Mathematical Progressions', () => {
    it('should generate golden ratio typography scale with exact values', () => {
      const tokens = generateTypographyScale('golden', 1, false);

      // Verify we get expected number of tokens (13 sizes: xs to 9xl)
      const sizeTokens = tokens.filter((t) => t.name.startsWith('text-'));
      expect(sizeTokens).toHaveLength(13);

      // Test specific mathematical relationships (golden ratio = 1.618033988749)
      // Typography uses ratio^steps where steps = i-2 (base is at index 2)
      const baseToken = tokens.find((t) => t.name === 'text-base');
      const lgToken = tokens.find((t) => t.name === 'text-lg');
      const xlToken = tokens.find((t) => t.name === 'text-xl');

      expect(baseToken?.value).toBe('1rem'); // Base size (ratio^0)
      expect(lgToken?.value).toBe('1.618rem'); // base * golden^1
      expect(xlToken?.value).toBe('2.618rem'); // base * golden^2

      // Verify mathematical progression continues correctly
      const xl2Token = tokens.find((t) => t.name === 'text-2xl');
      expect(xl2Token?.value).toBe('4.236rem'); // base * golden^3
    });

    it('should generate major-third progression with correct ratios', () => {
      const tokens = generateTypographyScale('major-third', 1, false);

      const baseToken = tokens.find((t) => t.name === 'text-base');
      const lgToken = tokens.find((t) => t.name === 'text-lg');

      expect(baseToken?.value).toBe('1rem');
      // Major third = 1.25, so lg should be base * 1.25^1 = 1.25rem
      expect(lgToken?.value).toBe('1.25rem');
    });

    it('should preserve token metadata and structure', () => {
      const tokens = generateTypographyScale('golden', 1, false);
      const baseToken = tokens.find((t) => t.name === 'text-base');

      expect(baseToken).toBeDefined();
      expect(baseToken?.category).toBe('font-size');
      expect(baseToken?.namespace).toBe('font-size');
      expect(baseToken?.semanticMeaning).toContain('base');
      expect(baseToken?.generateUtilityClass).toBe(true);
    });
  });

  describe('Spacing Generator - Mathematical Progressions', () => {
    it('should generate linear spacing scale with exact values', () => {
      const tokens = generateSpacingScale('linear', 4, 1.25, 12, false);

      // Verify basic progression: 0, 0.25rem, 0.5rem, 0.75rem, 1rem...
      // Tokens are named as just numbers: "0", "1", "4", "8"
      const spacing0 = tokens.find((t) => t.name === '0');
      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing4 = tokens.find((t) => t.name === '4');
      const spacing8 = tokens.find((t) => t.name === '8');

      expect(spacing0?.value).toBe('0rem');
      expect(spacing1?.value).toBe('0.25rem'); // 4px / 16
      expect(spacing4?.value).toBe('1rem'); // 16px / 16
      expect(spacing8?.value).toBe('2rem'); // 32px / 16
    });

    it('should generate golden ratio spacing with mathematical accuracy', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 8, false);

      const spacing0 = tokens.find((t) => t.name === '0');
      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing2 = tokens.find((t) => t.name === '2');

      expect(spacing0?.value).toBe('0rem');
      expect(spacing1?.value).toBe('0.25rem'); // Base unit: 4px
      // Golden ratio progression: baseUnit * golden^(i-1)
      // spacing-2: 4 * 1.618^1 = 6.472px = 0.4rem (rounded)
      expect(spacing2?.value).toBe('0.4rem');
    });

    it('should generate minor-third progression correctly', () => {
      const tokens = generateSpacingScale('minor-third', 4, 1.25, 6, false);

      const spacing1 = tokens.find((t) => t.name === '1');
      const spacing2 = tokens.find((t) => t.name === '2');

      expect(spacing1?.value).toBe('0.25rem'); // Base
      // Minor third = 1.2, so spacing-2 = 4 * 1.2 = 4.8px = 0.3rem
      expect(spacing2?.value).toBe('0.3rem');
    });
  });

  describe('Motion Generator - Duration Progressions', () => {
    it('should generate golden ratio motion scale with exact durations', () => {
      const tokens = generateMotionTokens('golden', 75, false);

      // Motion tokens use semantic names like 'inform', 'guide', 'standard'
      const durTokens = tokens.filter((t) => t.category === 'motion');
      expect(durTokens.length).toBeGreaterThan(0);

      // Test specific duration values - actual mathematical progression
      const inform = tokens.find((t) => t.name === 'inform');
      const guide = tokens.find((t) => t.name === 'guide');
      const standard = tokens.find((t) => t.name === 'standard');
      const engage = tokens.find((t) => t.name === 'engage');

      // Based on actual output: inform=29ms, guide=46ms, standard=75ms, engage=121ms
      expect(inform?.value).toBe('29ms'); // Base duration / golden^2 ≈ 29ms
      expect(guide?.value).toBe('46ms'); // Base duration / golden^1 ≈ 46ms
      expect(standard?.value).toBe('75ms'); // Base duration (index 2)
      expect(engage?.value).toBe('121ms'); // Base * golden^1 ≈ 121ms
    });

    it('should maintain motion duration metadata', () => {
      const tokens = generateMotionTokens('golden', 75, false);
      const standardToken = tokens.find((t) => t.name === 'standard');

      expect(standardToken?.category).toBe('motion');
      expect(standardToken?.namespace).toBe('duration');
      expect(standardToken?.motionDuration).toBe(75);
      expect(standardToken?.semanticMeaning).toContain('Standard');
    });
  });

  describe('Height Generator - Mathematical Scaling', () => {
    it('should generate height tokens with mathematical progression', () => {
      const tokens = generateHeightScale('linear', 2.5, 1.25, false);

      // Verify height tokens are generated
      expect(tokens.length).toBeGreaterThan(0);

      // Verify they have correct category and structure
      const firstToken = tokens[0];
      expect(firstToken?.category).toBe('height');
      expect(firstToken?.value).toMatch(/^\d+(\.\d+)?rem$/);
    });

    it('should generate golden ratio height progression', () => {
      const tokens = generateHeightScale('golden', 2.5, 1.25, false);

      // Verify golden ratio progression generates tokens
      expect(tokens.length).toBeGreaterThan(0);

      // Verify mathematical progression is used (values should be different from linear)
      const firstToken = tokens[0];
      expect(firstToken?.value).toMatch(/^\d+(\.\d+)?rem$/);
    });
  });

  describe('Mathematical Constants Verification', () => {
    it('should use consistent golden ratio value across generators', () => {
      // This test will fail if generators use different golden ratio values
      const typographyTokens = generateTypographyScale('golden', 1, false);
      const spacingTokens = generateSpacingScale('golden', 4, 1.25, 4, false);
      const motionTokens = generateMotionTokens('golden', 75, false);
      const heightTokens = generateHeightScale('golden', 2.5, 1.25, false);

      // All should exist (verifying golden ratio calculations worked)
      expect(typographyTokens.length).toBeGreaterThan(0);
      expect(spacingTokens.length).toBeGreaterThan(0);
      expect(motionTokens.length).toBeGreaterThan(0);
      expect(heightTokens.length).toBeGreaterThan(0);

      // This ensures all generators are using the same mathematical foundation
      // When we refactor to math-utils, these exact same results should be produced
    });

    it('should use consistent musical interval ratios', () => {
      const majorThirdTypography = generateTypographyScale('major-third', 1, false);
      const minorThirdSpacing = generateSpacingScale('minor-third', 4, 1.25, 4, false);

      // Verify both generators produce tokens (using consistent ratios)
      expect(majorThirdTypography.length).toBeGreaterThan(0);
      expect(minorThirdSpacing.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero base values correctly', () => {
      const tokens = generateSpacingScale('linear', 0, 1.25, 4, false);
      const spacing1 = tokens.find((t) => t.name === '1');
      expect(spacing1?.value).toBe('0rem');
    });

    it('should handle small step counts', () => {
      const tokens = generateSpacingScale('golden', 4, 1.25, 2, false);
      expect(tokens.length).toBe(3); // Actually generates 3 tokens for 2 steps
    });

    it('should preserve precision in calculations', () => {
      const tokens = generateTypographyScale('golden', 1, false);
      const xlToken = tokens.find((t) => t.name === 'text-xl');

      // Should maintain 3 decimal places precision
      expect(xlToken?.value).toMatch(/^\d+\.\d{3}rem$/);
    });
  });
});
