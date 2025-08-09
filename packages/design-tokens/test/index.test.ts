/**
 * Tests for the main index exports
 */

import { describe, expect, it } from 'vitest';
import {
  DesignSystemSchema,
  SmartColorTokenSchema,
  TokenSchema,
  createColorDesignSystem,
  defaultGrayscaleSystem,
  designSystemsAPI,
  exportToTailwindTheme,
  generateShadowTokens,
  generateSpacingTokens,
  getDesignSystem,
} from '../src/index';

describe('index exports', () => {
  it('exports all required schemas', () => {
    expect(TokenSchema).toBeDefined();
    expect(DesignSystemSchema).toBeDefined();
    expect(SmartColorTokenSchema).toBeDefined();
  });

  it('exports design system functions', () => {
    expect(getDesignSystem).toBeDefined();
    expect(generateSpacingTokens).toBeDefined();
    expect(generateShadowTokens).toBeDefined();
    expect(exportToTailwindTheme).toBeDefined();
  });

  it('exports grayscale system', () => {
    expect(defaultGrayscaleSystem).toBeDefined();
    expect(defaultGrayscaleSystem.colors).toBeDefined();
    expect(defaultGrayscaleSystem.typography).toBeDefined();
    expect(defaultGrayscaleSystem.spacing).toBeDefined();
  });

  it('exports color tool functions', () => {
    expect(createColorDesignSystem).toBeDefined();
  });

  it('exports design systems API', () => {
    expect(designSystemsAPI).toBeDefined();
    expect(designSystemsAPI.get).toBeDefined();
    expect(designSystemsAPI.list).toBeDefined();
    expect(designSystemsAPI.create).toBeDefined();
    expect(designSystemsAPI.createFromColor).toBeDefined();
    expect(designSystemsAPI.update).toBeDefined();
    expect(designSystemsAPI.delete).toBeDefined();
    expect(designSystemsAPI.exportCSS).toBeDefined();
    expect(designSystemsAPI.exportTailwind).toBeDefined();
  });
});

describe('getDesignSystem', () => {
  it('returns default grayscale system for 000000', () => {
    const system = getDesignSystem('000000');
    expect(system).toBeDefined();
    expect(system.colors).toBeDefined();
    expect(system.meta).toBeDefined();
    expect(system.meta.name).toBe('Rafters Grayscale');
  });

  it('throws error for unknown system ID', () => {
    expect(() => getDesignSystem('unknown')).toThrow('Design system unknown not found');
  });
});

describe('generateSpacingTokens', () => {
  it('generates linear spacing tokens', () => {
    const tokens = generateSpacingTokens({ scale: 'linear' });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].category).toBe('spacing');
    expect(tokens.some((t) => t.name === '--spacing-0')).toBe(true);
    expect(tokens.some((t) => t.name === '--spacing-4')).toBe(true);
  });

  it('generates golden ratio spacing tokens', () => {
    const tokens = generateSpacingTokens({ scale: 'golden' });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.some((t) => t.semanticGroup === 'golden-ratio')).toBe(true);
  });
});

describe('generateShadowTokens', () => {
  it('generates shadow tokens', () => {
    const tokens = generateShadowTokens({ scale: 'linear' });
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].category).toBe('shadow');
    expect(tokens.some((t) => t.name === '--shadow')).toBe(true);
    expect(tokens.some((t) => t.name === '--shadow-lg')).toBe(true);
  });
});

describe('exportToTailwindTheme', () => {
  it('exports design system as Tailwind v4 theme', () => {
    const designSystem = {
      id: 'test',
      name: 'Test System',
      tokens: [
        {
          name: '--color-primary',
          value: 'oklch(0.5 0.2 220)',
          category: 'color' as const,
          type: 'static' as const,
        },
        {
          name: '--spacing-4',
          value: '1rem',
          category: 'spacing' as const,
          type: 'static' as const,
        },
      ],
    };

    const theme = exportToTailwindTheme(designSystem);
    expect(theme).toContain('@theme {');
    expect(theme).toContain('--color-primary: oklch(0.5 0.2 220)');
    expect(theme).toContain('--spacing-4: 1rem');
    expect(theme).toContain('/* Color tokens */');
    expect(theme).toContain('/* Spacing tokens */');
  });
});

describe('integration', () => {
  it('works end-to-end with API and color tool', () => {
    // Create a color system
    const primaryColor = { l: 0.5, c: 0.15, h: 240, alpha: 1 };
    const system = designSystemsAPI.createFromColor(primaryColor, 'Integration Test');

    expect(system.id).toBeDefined();
    expect(system.name).toBe('Integration Test');
    expect(system.colorTokens).toBeDefined();

    // Export to CSS
    const css = designSystemsAPI.exportCSS(system.id);
    expect(css).toContain('--color-primary-');
    expect(css).toContain('oklch(');

    // Export to Tailwind
    const tailwind = designSystemsAPI.exportTailwind(system.id);
    expect(tailwind).toContain('@theme {');

    // Clean up
    designSystemsAPI.delete(system.id);
  });
});
