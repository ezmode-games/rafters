/**
 * Integration tests for design-tokens package
 * Tests interaction with shared types and color-utils for token generation
 */

import type { ColorValue, OKLCH, Token } from '@rafters/shared';
import { describe, expect, it, vi } from 'vitest';

// Mock color-utils functions for integration testing
vi.mock('@rafters/color-utils', () => ({
  oklchToHex: vi.fn().mockImplementation((oklch: OKLCH) => {
    // Simple mock that creates different colors based on hue
    const hue = Math.round(oklch.h / 60) % 6;
    const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
    return colors[hue] || '#808080';
  }),
  hexToOKLCH: vi.fn().mockReturnValue({ l: 0.5, c: 0.2, h: 240 }),
  calculateWCAGContrast: vi.fn().mockReturnValue(4.5),
  meetsWCAGStandard: vi.fn().mockReturnValue(true),
  findAccessibleColor: vi.fn().mockImplementation((color: OKLCH) => color),
  generateAccessibilityMetadata: vi.fn().mockReturnValue({
    wcagAA: {
      normal: [
        [0, 5],
        [1, 6],
      ],
      large: [
        [0, 4],
        [1, 5],
      ],
    },
    wcagAAA: { normal: [[0, 7]], large: [[0, 6]] },
    onWhite: { aa: [5, 6, 7, 8, 9], aaa: [7, 8, 9] },
    onBlack: { aa: [0, 1, 2], aaa: [0, 1] },
  }),
  generateOKLCHScale: vi.fn().mockReturnValue({
    50: { l: 0.95, c: 0.02, h: 240 },
    100: { l: 0.85, c: 0.08, h: 240 },
    200: { l: 0.75, c: 0.12, h: 240 },
    300: { l: 0.65, c: 0.15, h: 240 },
    400: { l: 0.55, c: 0.18, h: 240 },
    500: { l: 0.45, c: 0.2, h: 240 },
    600: { l: 0.35, c: 0.18, h: 240 },
    700: { l: 0.25, c: 0.15, h: 240 },
    800: { l: 0.15, c: 0.12, h: 240 },
    900: { l: 0.05, c: 0.05, h: 240 },
  }),
}));

// Mock fs operations for token file tests
vi.mock('node:fs', () => ({
  existsSync: vi.fn().mockReturnValue(false),
  readFileSync: vi.fn().mockReturnValue('{}'),
  writeFileSync: vi.fn(),
}));

vi.mock('fs-extra', () => ({
  ensureDirSync: vi.fn(),
}));

const {
  tokenValueToCss,
  tokenValueToCssDark,
  TokenRegistry,
  generateColorTokens,
  generateSpacingScale,
  DesignSystemSchema,
} = await import('../src/index.js');

describe('Token processing with shared types', () => {
  it('should process ColorValue objects into CSS', () => {
    const colorValue: ColorValue = {
      name: 'brand-primary',
      scale: [
        { l: 0.95, c: 0.02, h: 240 }, // 50
        { l: 0.85, c: 0.08, h: 240 }, // 100
        { l: 0.75, c: 0.12, h: 240 }, // 200
        { l: 0.65, c: 0.15, h: 240 }, // 300
        { l: 0.55, c: 0.18, h: 240 }, // 400
        { l: 0.45, c: 0.2, h: 240 }, // 500
        { l: 0.35, c: 0.18, h: 240 }, // 600
      ],
      value: '500', // Points to index 5
    };

    const css = tokenValueToCss(colorValue);
    expect(css).toBe('oklch(0.45 0.20 240)');
  });

  it('should handle ColorValue dark mode processing', () => {
    const colorValue: ColorValue = {
      name: 'brand-primary',
      scale: [{ l: 0.45, c: 0.2, h: 240 }],
      states: {
        hover: 'brand-primary-600',
        focus: 'brand-primary-700',
        dark: 'brand-primary-200',
      },
    };

    // Should use dark state when requested
    const darkCss = tokenValueToCssDark(colorValue, 'dark');
    expect(darkCss).toBe('brand-primary-200');

    // Should fallback to hover when no specific state
    const fallbackCss = tokenValueToCssDark(colorValue);
    expect(fallbackCss).toBe('brand-primary-600');
  });

  it('should convert Token objects with ColorValue to CSS', () => {
    const colorValue: ColorValue = {
      name: 'semantic-primary',
      scale: [
        { l: 0.9, c: 0.05, h: 240 },
        { l: 0.5, c: 0.2, h: 240 },
        { l: 0.1, c: 0.1, h: 240 },
      ],
      value: '100', // Middle color
    };

    const token: Token = {
      name: 'primary',
      value: colorValue,
      category: 'color',
      namespace: 'semantic',
      semanticMeaning: 'Primary brand color',
      trustLevel: 'high',
      cognitiveLoad: 2,
    };

    const css = tokenValueToCss(token.value);
    expect(css).toBe('oklch(0.5 0.2 240)');
  });
});

describe('Token generation integration', () => {
  it('should generate color tokens with shared type compatibility', () => {
    const colorTokens = generateColorTokens();

    expect(Array.isArray(colorTokens)).toBe(true);
    expect(colorTokens.length).toBeGreaterThan(0);

    // All tokens should be valid Token types from shared
    colorTokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'color');
      expect(token).toHaveProperty('namespace');

      expect(typeof token.name).toBe('string');
      expect(token.name.length).toBeGreaterThan(0);
    });

    // Should contain standard semantic colors
    const tokenNames = colorTokens.map((token) => token.name);
    expect(tokenNames).toContain('primary');
    expect(tokenNames).toContain('background');
    expect(tokenNames).toContain('foreground');
  });

  it('should generate spacing tokens with mathematical relationships', () => {
    const spacingTokens = generateSpacingScale();

    expect(Array.isArray(spacingTokens)).toBe(true);
    expect(spacingTokens.length).toBeGreaterThan(0);

    // All tokens should be valid Token types
    spacingTokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'spacing');
      expect(token).toHaveProperty('namespace', 'spacing');
    });

    // Should include mathematical relationships for AI
    const tokensWithMath = spacingTokens.filter((token) => token.mathRelationship);
    expect(tokensWithMath.length).toBeGreaterThan(0);
  });
});

describe('TokenRegistry integration', () => {
  it('should store and retrieve tokens with shared types', () => {
    const registry = new TokenRegistry();

    const colorValue: ColorValue = {
      name: 'integration-blue',
      scale: [
        { l: 0.8, c: 0.1, h: 240 },
        { l: 0.6, c: 0.15, h: 240 },
        { l: 0.4, c: 0.2, h: 240 },
      ],
      value: '100',
    };

    const token: Token = {
      name: 'integration-primary',
      value: colorValue,
      category: 'color',
      namespace: 'test',
      semanticMeaning: 'Integration test color',
    };

    // Should accept tokens with ColorValue
    expect(() => registry.add(token)).not.toThrow();

    // Should retrieve the same structure
    const retrieved = registry.get('integration-primary');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('integration-primary');
    expect(typeof retrieved?.value).toBe('object');

    if (typeof retrieved?.value === 'object') {
      expect(retrieved.value.name).toBe('integration-blue');
      expect(retrieved.value.scale).toHaveLength(3);
    }
  });

  it('should filter tokens by shared type properties', () => {
    const registry = new TokenRegistry();

    const tokens: Token[] = [
      {
        name: 'color-1',
        value: 'oklch(0.5 0.2 0)',
        category: 'color',
        namespace: 'semantic',
        trustLevel: 'high',
      },
      {
        name: 'color-2',
        value: 'oklch(0.5 0.2 120)',
        category: 'color',
        namespace: 'semantic',
        trustLevel: 'medium',
      },
      {
        name: 'space-1',
        value: '1rem',
        category: 'spacing',
        namespace: 'size',
      },
    ];

    for (const token of tokens) {
      registry.add(token);
    }

    // Should filter by trust level (AI intelligence property)
    const highTrustTokens = registry
      .list({ category: 'color' })
      .filter((token) => token.trustLevel === 'high');
    expect(highTrustTokens).toHaveLength(1);
    expect(highTrustTokens[0].name).toBe('color-1');

    // Should filter by category and namespace
    const colorTokens = registry.list({ category: 'color', namespace: 'semantic' });
    expect(colorTokens).toHaveLength(2);

    const spacingTokens = registry.list({ category: 'spacing' });
    expect(spacingTokens).toHaveLength(1);
  });
});

describe('Design system integration', () => {
  it('should validate design system with generated tokens', () => {
    const colorTokens = generateColorTokens().slice(0, 5); // Limit for test
    const spacingTokens = generateSpacingScale().slice(0, 5);

    const designSystem = {
      id: 'integration-test-system',
      name: 'Integration Test Design System',
      tokens: [...colorTokens, ...spacingTokens],
      accessibilityTarget: 'AAA' as const,
      primaryColorSpace: 'oklch' as const,
      spacingSystem: 'linear' as const,
    };

    const result = DesignSystemSchema.safeParse(designSystem);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.tokens).toHaveLength(10);
      expect(result.data.accessibilityTarget).toBe('AAA');
      expect(result.data.primaryColorSpace).toBe('oklch');
    }
  });

  it('should handle complex token relationships', () => {
    // Create tokens that reference each other (like semantic colors)
    const baseColor: ColorValue = {
      name: 'base-blue',
      scale: [
        { l: 0.9, c: 0.05, h: 240 },
        { l: 0.5, c: 0.2, h: 240 },
        { l: 0.1, c: 0.1, h: 240 },
      ],
    };

    const primaryToken: Token = {
      name: 'primary',
      value: baseColor,
      category: 'color',
      namespace: 'semantic',
      pairedWith: ['primary-foreground', 'primary-border'],
      requiredForComponents: ['primary-button'],
    };

    const foregroundToken: Token = {
      name: 'primary-foreground',
      value: 'oklch(1 0 0)', // White
      category: 'color',
      namespace: 'semantic',
      pairedWith: ['primary'],
      semanticMeaning: 'Text color on primary background',
    };

    const registry = new TokenRegistry();
    registry.add(primaryToken);
    registry.add(foregroundToken);

    // Should maintain relationships
    const primary = registry.get('primary');
    const foreground = registry.get('primary-foreground');

    expect(primary?.pairedWith).toContain('primary-foreground');
    expect(foreground?.pairedWith).toContain('primary');
    expect(primary?.requiredForComponents).toContain('primary-button');
  });
});

describe('Cross-package workflow simulation', () => {
  it('should simulate complete design token workflow', () => {
    // 1. Start with base OKLCH colors (would come from color picker or API)
    const baseColors: OKLCH[] = [
      { l: 0.5, c: 0.2, h: 240 }, // Blue
      { l: 0.6, c: 0.18, h: 120 }, // Green
      { l: 0.4, c: 0.22, h: 0 }, // Red
    ];

    // 2. Generate ColorValue objects (color-utils would do this)
    const colorValues: ColorValue[] = baseColors.map((color, index) => ({
      name: `color-${index}`,
      scale: [
        { ...color, l: Math.min(color.l + 0.3, 0.95) },
        color,
        { ...color, l: Math.max(color.l - 0.3, 0.05) },
      ],
      value: '100', // Middle value
    }));

    // 3. Create tokens with AI intelligence (design-tokens would do this)
    const tokens: Token[] = colorValues.map((colorValue, index) => ({
      name: `semantic-${index}`,
      value: colorValue,
      category: 'color',
      namespace: 'semantic',
      semanticMeaning: `Semantic color ${index}`,
      cognitiveLoad: 2 + index,
      trustLevel: ['low', 'medium', 'high'][index] as const,
    }));

    // 4. Process tokens through registry
    const registry = new TokenRegistry();
    for (const token of tokens) {
      registry.add(token);
    }

    // 5. Generate CSS output
    const cssValues = tokens.map((token) => tokenValueToCss(token.value));

    // Validate the complete workflow
    expect(baseColors).toHaveLength(3);
    expect(colorValues).toHaveLength(3);
    expect(tokens).toHaveLength(3);
    expect(cssValues).toHaveLength(3);

    // All tokens should be properly stored and retrievable
    expect(registry.list()).toHaveLength(3);

    // CSS values should be valid
    cssValues.forEach((css) => {
      expect(typeof css).toBe('string');
      expect(css.includes('oklch')).toBe(true);
    });

    // Tokens should have AI intelligence metadata
    tokens.forEach((token) => {
      expect(token.cognitiveLoad).toBeGreaterThanOrEqual(2);
      expect(['low', 'medium', 'high']).toContain(token.trustLevel);
    });
  });
});
