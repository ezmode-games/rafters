/**
 * Unit tests for token export functionality
 */

import type { Token } from '@rafters/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { exportToCSSVariables, exportToTailwindCSS } from '../src/export.js';
import { TokenRegistry } from '../src/registry.js';

describe('Token Export Functions', () => {
  let registry: TokenRegistry;
  let sampleTokens: Token[];

  beforeEach(() => {
    sampleTokens = [
      {
        name: 'primary',
        value: 'oklch(0.5 0.1 240)',
        category: 'color',
        namespace: 'color',
        semanticMeaning: 'Primary brand color',
      },
      {
        name: '4',
        value: '1rem',
        category: 'spacing',
        namespace: 'spacing',
        semanticMeaning: 'Base spacing unit',
      },
    ];
    registry = new TokenRegistry(sampleTokens);
  });

  describe('exportToCSSVariables', () => {
    it('should export tokens as CSS custom properties', () => {
      const css = exportToCSSVariables(registry);

      expect(typeof css).toBe('string');
      expect(css).toContain('--color-primary');
      expect(css).toContain('oklch(0.5 0.1 240)');
      expect(css).toContain('--spacing-4');
      expect(css).toContain('1rem');
    });

    it('should generate valid CSS syntax', () => {
      const css = exportToCSSVariables(registry);

      // Should contain :root selector
      expect(css).toContain(':root');

      // Should contain proper CSS variable declarations
      expect(css).toMatch(/--[\w-]+:\s*[^;]+;/);
    });
  });

  describe('exportToTailwindCSS', () => {
    it('should export tokens as Tailwind CSS v4 format', () => {
      const css = exportToTailwindCSS(registry);

      expect(typeof css).toBe('string');
      expect(css).toContain('@theme');
      expect(css).toContain('--color-primary');
      expect(css).toContain('--spacing-4');
    });

    it('should include Tailwind v4 imports', () => {
      const css = exportToTailwindCSS(registry);

      expect(css).toContain('@import "tailwindcss"');
    });

    it('should generate valid CSS syntax', () => {
      const css = exportToTailwindCSS(registry);

      // Should contain @theme block
      expect(css).toContain('@theme {');

      // Should contain proper variable declarations
      expect(css).toMatch(/--[\w-]+:\s*[^;]+;/);
    });
  });

  describe('Empty registry handling', () => {
    it('should handle empty registry gracefully', () => {
      const emptyRegistry = new TokenRegistry();

      const cssVars = exportToCSSVariables(emptyRegistry);
      const tailwind = exportToTailwindCSS(emptyRegistry);

      expect(typeof cssVars).toBe('string');
      expect(typeof tailwind).toBe('string');

      // Should still contain basic structure
      expect(cssVars).toContain(':root');
      expect(tailwind).toContain('@theme');
    });
  });
});
