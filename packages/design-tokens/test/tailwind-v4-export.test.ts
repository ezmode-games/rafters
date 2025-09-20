/**
 * Tests for Tailwind v4 CSS exporter
 */

import { describe, expect, it } from 'vitest';
import { exportToTailwindV4Complete } from '../src/exporters/tailwind-v4.js';
import { generateAllTokens } from '../src/generators/index.js';
import { TokenRegistry } from '../src/registry.js';

describe('Tailwind v4 CSS Exporter', () => {
  it('should export complete Tailwind v4 CSS with all tokens', async () => {
    // Generate all tokens for testing
    const tokens = await generateAllTokens();
    const registry = new TokenRegistry(tokens);

    // Export to Tailwind v4 format
    const css = exportToTailwindV4Complete(registry);

    // Verify basic structure
    expect(css).toContain('@import "tailwindcss";');
    expect(css).toContain('@theme {');
    expect(css).toContain('@theme inline {');
    expect(css).toContain(':root {');
    expect(css).toContain('@media (prefers-color-scheme: dark) {');

    // Verify color tokens are present
    expect(css).toContain('--color-');
    expect(css).toContain('--rafters-');

    // Verify spacing tokens are present
    expect(css).toContain('--spacing-');

    // Verify typography tokens are present
    expect(css).toContain('--text-');
    expect(css).toContain('--font-');

    // Verify keyframe animations are present
    expect(css).toContain('@keyframes');
    expect(css).toContain('accordion-down');
    expect(css).toContain('fade-in');

    // Verify custom utility classes
    expect(css).toContain('.animate-');
    expect(css).toContain('container-query');

    // Verify semantic mappings are present
    expect(css).toContain('--background');
    expect(css).toContain('--foreground');
    expect(css).toContain('--primary');
  }, 70000);

  it('should handle empty registry gracefully', () => {
    const registry = new TokenRegistry([]);
    const css = exportToTailwindV4Complete(registry);

    // Should still have basic structure
    expect(css).toContain('@import "tailwindcss";');
    expect(css).toContain('@theme {');
    expect(css).toContain(':root {');
  });

  it('should generate valid CSS syntax', async () => {
    const tokens = await generateAllTokens();
    const registry = new TokenRegistry(tokens);
    const css = exportToTailwindV4Complete(registry);

    // Basic syntax checks
    expect(css).not.toContain('undefined');
    expect(css).not.toContain('null');

    // Check for proper CSS variable syntax
    const cssVarMatches = css.match(/--[\w-]+:\s*[^;]+;/g);
    expect(cssVarMatches).toBeTruthy();
    expect(cssVarMatches?.length).toBeGreaterThan(10);

    // Check for proper color format (OKLCH or other valid CSS colors)
    const colorMatches = css.match(/(oklch\([^)]+\)|rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-zA-Z]+)/g);
    expect(colorMatches).toBeTruthy();
    expect(colorMatches?.length).toBeGreaterThan(5);
  }, 70000);

  it('should include all token categories', async () => {
    const tokens = await generateAllTokens();
    const registry = new TokenRegistry(tokens);
    const css = exportToTailwindV4Complete(registry);

    // Check that major token categories are represented
    const expectedCategories = [
      'color',
      'spacing',
      'font-size',
      'font-weight',
      'border-radius',
      'opacity',
    ];

    for (const category of expectedCategories) {
      const hasCategory = tokens.some((token) => token.category === category);
      if (hasCategory) {
        // If we have tokens of this category, they should appear in the CSS
        expect(css).toMatch(new RegExp(`/\\* ${category} tokens`));
      }
    }
  }, 70000);

  it('should handle dark mode tokens correctly', async () => {
    const tokens = await generateAllTokens();
    const registry = new TokenRegistry(tokens);
    const css = exportToTailwindV4Complete(registry);

    // Check for dark mode structure
    expect(css).toContain('@media (prefers-color-scheme: dark)');

    // If there are dark tokens, they should be mapped correctly
    const darkTokens = tokens.filter((token) => token.name.endsWith('-dark'));
    if (darkTokens.length > 0) {
      expect(css).toContain('--rafters-');
    }
  }, 70000);
});
