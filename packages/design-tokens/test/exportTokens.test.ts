/**
 * Export Tokens TDD Tests
 *
 * Test-driven development for exportTokens function
 * Tests different export formats: Tailwind CSS, CSS custom properties, JSON
 */

import { describe, expect, it } from 'vitest';
import {
  type DesignSystem,
  type Token,
  exportTokens,
  generateSpacingScale,
  generateTypographyScale,
} from '../src/index.js';

describe('exportTokens function', () => {
  // Sample tokens for testing
  const sampleTokens: Token[] = [
    {
      name: 'primary',
      value: 'oklch(0.45 0.12 240)',
      darkValue: 'oklch(0.8 0.05 240)',
      category: 'color',
      namespace: 'color',
      semanticMeaning: 'Primary brand color for main actions',
      usageContext: ['buttons', 'links', 'focus-states'],
      trustLevel: 'high',
      cognitiveLoad: 3,
      accessibilityLevel: 'AAA',
      generateUtilityClass: true,
      tailwindOverride: true,
    },
    {
      name: '4',
      value: '1rem',
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: 'Base spacing unit',
      mathRelationship: '16px base unit',
      scalePosition: 1,
      generateUtilityClass: true,
      applicableComponents: ['all'],
      containerQueryAware: true,
      viewportAware: true,
    },
    {
      name: 'fast',
      value: '150ms',
      category: 'motion',
      namespace: 'duration',
      semanticMeaning: 'Fast animation duration for immediate feedback',
      reducedMotionAware: true,
      animationSafe: true,
      motionDuration: 150,
      generateUtilityClass: true,
    },
  ];

  const sampleDesignSystem: DesignSystem = {
    id: 'test-system',
    name: 'Test Design System',
    tokens: sampleTokens,
    accessibilityTarget: 'AAA',
    section508Compliant: true,
    cognitiveLoadBudget: 15,
    generateDarkTheme: true,
    enforceContrast: true,
    enforceMotionSafety: true,
    spacingSystem: 'linear',
    spacingMultiplier: 1.25,
    spacingBaseUnit: 16,
  };

  describe('Tailwind CSS export (tw)', () => {
    it('should export complete Tailwind v4 stylesheet with @theme directive', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('@import "tailwindcss";');
      expect(result).toContain('@theme {');
      expect(result).toContain('}');
      expect(typeof result).toBe('string');
    });

    it('should include all color tokens as CSS custom properties in Tailwind format', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('--color-primary: oklch(0.45 0.12 240);');
      expect(result).toContain('@theme {');
    });

    it('should include dark theme overrides in @media query', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('@media (prefers-color-scheme: dark)');
      expect(result).toContain('--color-primary: oklch(0.8 0.05 240);');
    });

    it('should include spacing tokens with proper namespace', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('--spacing-4: 1rem;');
    });

    it('should include motion tokens with proper namespace', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('--duration-fast: 150ms;');
    });

    it('should not include manual utility classes since Tailwind v4 generates them automatically', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      // Tailwind v4 automatically generates utilities from theme variables
      // No manual @utility declarations needed for standard tokens
      expect(result).not.toContain('@utility');
      expect(result).toContain('--spacing-4'); // The token exists
      // Utilities like .p-4, .m-4, .w-4 are automatically created from --spacing
    });

    it('should include reduced motion variants for motion tokens', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('@media (prefers-reduced-motion: reduce)');
      expect(result).toContain('--duration-fast: 0ms;') ||
        expect(result).toContain('motion-reduce');
    });

    it('should include container query support when tokens are container-aware', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('@container') || expect(result).toContain('container-query');
    });

    it('should include header comment with metadata', () => {
      const result = exportTokens(sampleDesignSystem, 'tw');

      expect(result).toContain('Generated Tailwind CSS');
      expect(result).toContain('Test Design System');
      expect(result).toContain('DO NOT EDIT MANUALLY');
    });
  });

  describe('CSS custom properties export (css)', () => {
    it('should export CSS custom properties with proper syntax', () => {
      const result = exportTokens(sampleDesignSystem, 'css');

      expect(result).toContain(':root {');
      expect(result).toContain('--color-primary: oklch(0.45 0.12 240);');
      expect(result).toContain('--spacing-4: 1rem;');
      expect(result).toContain('--duration-fast: 150ms;');
      expect(result).toContain('}');
    });

    it('should include dark theme tokens when available', () => {
      const result = exportTokens(sampleDesignSystem, 'css');

      expect(result).toContain('[data-theme="dark"]') ||
        expect(result).toContain('@media (prefers-color-scheme: dark)');
      expect(result).toContain('--color-primary: oklch(0.8 0.05 240);');
    });

    it('should format each token on a new line', () => {
      const result = exportTokens(sampleDesignSystem, 'css');

      const lines = result.split('\n');
      const tokenLines = lines.filter((line) => line.includes('--') && line.includes(':'));
      expect(tokenLines.length).toBeGreaterThan(0);

      // Each token should be on its own line
      for (const line of tokenLines) {
        expect(line.trim()).toMatch(/^--[\w-]+:\s*[^;]+;$/);
      }
    });
  });

  describe('JSON export (json)', () => {
    it('should export valid JSON with complete design system', () => {
      const result = exportTokens(sampleDesignSystem, 'json');

      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('id', 'test-system');
      expect(parsed).toHaveProperty('tokens');
      expect(Array.isArray(parsed.tokens)).toBe(true);
    });

    it('should be formatted with proper indentation', () => {
      const result = exportTokens(sampleDesignSystem, 'json');

      expect(result).toContain('  '); // Should have proper indentation
      expect(result).toContain('\n'); // Should have newlines
    });
  });

  describe('Edge cases and validation', () => {
    it('should handle empty token array gracefully', () => {
      const emptySystem: DesignSystem = {
        ...sampleDesignSystem,
        tokens: [],
      };

      expect(() => exportTokens(emptySystem, 'tw')).not.toThrow();
      expect(() => exportTokens(emptySystem, 'css')).not.toThrow();
      expect(() => exportTokens(emptySystem, 'json')).not.toThrow();
    });

    it('should handle tokens without optional properties', () => {
      const minimalToken: Token = {
        name: 'minimal',
        value: '#000000',
        category: 'color',
        namespace: 'color',
      };

      const minimalSystem: DesignSystem = {
        ...sampleDesignSystem,
        tokens: [minimalToken],
      };

      expect(() => exportTokens(minimalSystem, 'tw')).not.toThrow();
      expect(() => exportTokens(minimalSystem, 'css')).not.toThrow();
      expect(() => exportTokens(minimalSystem, 'json')).not.toThrow();
    });

    it('should escape special characters in CSS output', () => {
      const specialToken: Token = {
        name: 'special-chars',
        value: 'url("data:image/svg+xml;charset=utf-8,%3Csvg")',
        category: 'background',
        namespace: 'background',
        semanticMeaning: 'Background with special chars',
      };

      const specialSystem: DesignSystem = {
        ...sampleDesignSystem,
        tokens: [specialToken],
      };

      const cssResult = exportTokens(specialSystem, 'css');
      const twResult = exportTokens(specialSystem, 'tw');

      expect(cssResult).toContain('url(');
      expect(twResult).toContain('url(');
    });

    it('should handle very large token sets efficiently', () => {
      const largeTokens = generateSpacingScale('linear', 4, 1.25, 100, true).concat(
        generateTypographyScale('golden', 1, true)
      );

      const largeSystem: DesignSystem = {
        ...sampleDesignSystem,
        tokens: largeTokens,
      };

      const startTime = Date.now();
      const result = exportTokens(largeSystem, 'json');
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should validate all tokens against schema before export', () => {
      const invalidToken = {
        name: 'invalid',
        // Missing required 'value' property
        category: 'color',
        namespace: 'color',
      } as Token;

      const invalidSystem: DesignSystem = {
        ...sampleDesignSystem,
        tokens: [invalidToken],
      };

      expect(() => exportTokens(invalidSystem, 'json')).toThrow();
    });
  });

  describe('Integration with generated tokens', () => {
    it('should export mathematically generated spacing tokens correctly', () => {
      const spacingTokens = generateSpacingScale('golden', 4, 1.618, 5, false);
      const system: DesignSystem = {
        ...sampleDesignSystem,
        tokens: spacingTokens,
      };

      const twResult = exportTokens(system, 'tw');
      const cssResult = exportTokens(system, 'css');

      expect(twResult).toContain('--spacing-golden-1:');
      expect(cssResult).toContain('--spacing-golden-1:');
    });

    it('should export typography tokens with proper namespacing', () => {
      const typographyTokens = generateTypographyScale('major-third', 1, false);
      const system: DesignSystem = {
        ...sampleDesignSystem,
        tokens: typographyTokens,
      };

      const result = exportTokens(system, 'tw');

      expect(result).toContain('--font-size-');
      expect(result).toContain('--line-height-');
    });

    it('should maintain mathematical relationships in exported format', () => {
      const spacingTokens = generateSpacingScale('linear', 4, 1.25, 3, false);
      const system: DesignSystem = {
        ...sampleDesignSystem,
        tokens: spacingTokens,
      };

      const jsonResult = exportTokens(system, 'json');
      const parsed = JSON.parse(jsonResult);

      const token = parsed.tokens.find((t: Token) => t.name === '1');
      expect(token.mathRelationship).toContain('4 * 1');
    });
  });
});
