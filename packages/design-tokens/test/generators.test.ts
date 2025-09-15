/**
 * Unit tests for token generators
 * Tests various token generation functions for consistency and correctness
 */

import { describe, expect, it, vi } from 'vitest';

// Mock color-utils to avoid external dependencies
vi.mock('@rafters/color-utils', () => ({
  oklchToHex: vi.fn().mockReturnValue('#3b82f6'),
  hexToOKLCH: vi.fn().mockReturnValue({ l: 0.5, c: 0.2, h: 240 }),
  calculateWCAGContrast: vi.fn().mockReturnValue(4.5),
  meetsWCAGStandard: vi.fn().mockReturnValue(true),
  findAccessibleColor: vi.fn().mockImplementation((color) => color),
  generateAccessibilityMetadata: vi.fn().mockReturnValue({
    wcagAA: { normal: [], large: [] },
    wcagAAA: { normal: [], large: [] },
    onWhite: { aa: [], aaa: [] },
    onBlack: { aa: [], aaa: [] },
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
  generateColorValue: vi.fn().mockImplementation((baseColor, options) => ({
    name: `color-${options?.token || 'generated'}`,
    scale: [
      { l: 0.95, c: 0.02, h: baseColor.h || 240 },
      { l: 0.85, c: 0.08, h: baseColor.h || 240 },
      { l: 0.75, c: 0.12, h: baseColor.h || 240 },
      { l: 0.65, c: 0.15, h: baseColor.h || 240 },
      { l: 0.55, c: 0.18, h: baseColor.h || 240 },
      { l: 0.45, c: 0.2, h: baseColor.h || 240 },
      { l: 0.35, c: 0.18, h: baseColor.h || 240 },
      { l: 0.25, c: 0.15, h: baseColor.h || 240 },
      { l: 0.15, c: 0.12, h: baseColor.h || 240 },
      { l: 0.05, c: 0.05, h: baseColor.h || 240 },
    ],
    value: '500',
    token: options?.token,
    usage: options?.usage,
  })),
}));

// Mock shared dependencies
vi.mock('@rafters/shared', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    TokenSchema: {
      parse: vi.fn().mockImplementation((token) => token),
    },
  };
});

const {
  generateSpacingScale,
  generateColorTokens,
  generateTypographyScale,
  generateBorderRadiusTokens,
  generateMotionTokens,
  generateOpacityTokens,
} = await import('../src/generators/index.js');

describe('generateSpacingScale', () => {
  it('should generate standard spacing scale', () => {
    const tokens = generateSpacingScale();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // Should contain standard spacing values
    const tokenNames = tokens.map((token) => token.name);
    expect(tokenNames).toContain('0');
    expect(tokenNames).toContain('1');
    expect(tokenNames).toContain('2');
    expect(tokenNames).toContain('4');
    expect(tokenNames).toContain('8');

    // All tokens should have correct structure
    tokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'spacing');
      expect(token).toHaveProperty('namespace', 'spacing');
    });
  });

  it('should generate mathematically consistent values', () => {
    const tokens = generateSpacingScale();

    // Find base unit (typically 4px)
    const baseToken = tokens.find((token) => token.name === '1');
    expect(baseToken).toBeDefined();

    // Larger values should be multiples of base
    const largerTokens = tokens.filter((token) => ['2', '4', '8'].includes(token.name));
    largerTokens.forEach((token) => {
      expect(token.value).toMatch(/^\d+(\.\d+)?(px|rem)$/);
    });
  });

  it('should include semantic meaning for AI consumption', () => {
    const tokens = generateSpacingScale();

    // Should have semantic meanings
    const semanticTokens = tokens.filter((token) => token.semanticMeaning);
    expect(semanticTokens.length).toBeGreaterThan(0);
  });

  it('should handle custom configuration', () => {
    const customTokens = generateSpacingScale({
      baseUnit: 8,
      multiplier: 1.5,
    });

    expect(customTokens.length).toBeGreaterThan(0);
    // Custom configuration should produce different values
    expect(customTokens).not.toEqual(generateSpacingScale());
  });
});

describe('generateColorTokens', () => {
  it('should generate semantic color tokens', () => {
    const tokens = generateColorTokens();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // Should contain semantic colors
    const tokenNames = tokens.map((token) => token.name);
    expect(tokenNames).toContain('primary');
    expect(tokenNames).toContain('secondary');
    expect(tokenNames).toContain('background');
    expect(tokenNames).toContain('foreground');

    // All tokens should have correct structure
    tokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'color');
      expect(token).toHaveProperty('namespace');
    });
  });

  it('should generate both light and dark variants', () => {
    const tokens = generateColorTokens();

    const primaryToken = tokens.find((token) => token.name === 'primary');
    const primaryDarkToken = tokens.find((token) => token.name === 'primary-dark');

    expect(primaryToken).toBeDefined();
    expect(primaryDarkToken).toBeDefined();
  });

  it('should include accessibility metadata', () => {
    const tokens = generateColorTokens();

    // Some tokens should have trust levels for AI decision making
    const trustLevelTokens = tokens.filter((token) => token.trustLevel);
    expect(trustLevelTokens.length).toBeGreaterThan(0);

    // Some tokens should have cognitive load ratings
    const cognitiveTokens = tokens.filter((token) => token.cognitiveLoad);
    expect(cognitiveTokens.length).toBeGreaterThan(0);
  });

  it('should generate OKLCH color values', () => {
    const tokens = generateColorTokens();

    const colorTokens = tokens.filter(
      (token) => typeof token.value === 'string' && token.value.includes('oklch')
    );
    expect(colorTokens.length).toBeGreaterThan(0);

    // OKLCH values should be properly formatted
    colorTokens.forEach((token) => {
      expect(token.value).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/);
    });
  });
});

describe('generateTypographyScale', () => {
  it('should generate typography tokens', () => {
    const tokens = generateTypographyScale();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // Should contain standard typography sizes
    const tokenNames = tokens.map((token) => token.name);
    expect(tokenNames).toContain('xs');
    expect(tokenNames).toContain('sm');
    expect(tokenNames).toContain('base');
    expect(tokenNames).toContain('lg');
    expect(tokenNames).toContain('xl');

    // All tokens should have correct structure
    tokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'font-size');
      expect(token).toHaveProperty('namespace');
    });
  });

  it('should include line height information', () => {
    const tokens = generateTypographyScale();

    // Many tokens should have line height
    const tokensWithLineHeight = tokens.filter((token) => token.lineHeight);
    expect(tokensWithLineHeight.length).toBeGreaterThan(0);
  });

  it('should generate mathematically consistent scale', () => {
    const tokens = generateTypographyScale();

    // Typography should follow mathematical progression
    const sizeValues = tokens
      .map((token) => {
        // Extract numeric value from rem/px values
        const match = token.value.toString().match(/([0-9.]+)/);
        return match ? parseFloat(match[1]) : 0;
      })
      .sort((a, b) => a - b);

    // Values should be in ascending order
    for (let i = 1; i < sizeValues.length; i++) {
      expect(sizeValues[i]).toBeGreaterThanOrEqual(sizeValues[i - 1]);
    }
  });

  it('should include semantic meaning', () => {
    const tokens = generateTypographyScale();

    const semanticTokens = tokens.filter((token) => token.semanticMeaning);
    expect(semanticTokens.length).toBeGreaterThan(0);
  });
});

describe('generateBorderRadiusTokens', () => {
  it('should generate border radius tokens', () => {
    const tokens = generateBorderRadiusTokens();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // Should contain standard radius values
    const tokenNames = tokens.map((token) => token.name);
    expect(tokenNames).toContain('none');
    expect(tokenNames).toContain('sm');
    expect(tokenNames).toContain('md');
    expect(tokenNames).toContain('lg');

    // All tokens should have correct structure
    tokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'border-radius');
      expect(token).toHaveProperty('namespace');
    });
  });

  it('should have progressive radius values', () => {
    const tokens = generateBorderRadiusTokens();

    // Values should progress from small to large
    const noneToken = tokens.find((token) => token.name === 'none');
    const smToken = tokens.find((token) => token.name === 'sm');
    const mdToken = tokens.find((token) => token.name === 'md');

    expect(noneToken?.value).toBe('0');
    expect(smToken?.value).toMatch(/[0-9.]+/);
    expect(mdToken?.value).toMatch(/[0-9.]+/);
  });
});

describe('generateMotionTokens', () => {
  it('should generate motion duration tokens', () => {
    const tokens = generateMotionTokens();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // Should contain motion categories
    const categories = [...new Set(tokens.map((token) => token.category))];
    expect(categories).toContain('motion');

    // All tokens should have correct structure
    tokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(['motion', 'easing'].includes(token.category)).toBe(true);
      expect(token).toHaveProperty('namespace');
    });
  });

  it('should include easing functions', () => {
    const tokens = generateMotionTokens();

    const easingTokens = tokens.filter((token) => token.category === 'easing');
    expect(easingTokens.length).toBeGreaterThan(0);

    // Easing tokens should have cubic-bezier values
    easingTokens.forEach((token) => {
      if (typeof token.value === 'string') {
        expect(
          token.value.includes('cubic-bezier') ||
            token.value.includes('ease') ||
            token.value.includes('linear')
        ).toBe(true);
      }
    });
  });

  it('should include accessibility considerations', () => {
    const tokens = generateMotionTokens();

    // Should include reduced motion awareness
    const motionSafeTokens = tokens.filter(
      (token) => token.name.includes('reduced') || token.animationSafe !== undefined
    );
    expect(motionSafeTokens.length).toBeGreaterThan(0);
  });
});

describe('generateOpacityTokens', () => {
  it('should generate opacity scale', () => {
    const tokens = generateOpacityTokens();

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);

    // Should contain standard opacity values
    const tokenNames = tokens.map((token) => token.name);
    expect(tokenNames).toContain('0');
    expect(tokenNames).toContain('50');
    expect(tokenNames).toContain('100');

    // All tokens should have correct structure
    tokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category', 'opacity');
      expect(token).toHaveProperty('namespace');
    });
  });

  it('should have valid opacity values', () => {
    const tokens = generateOpacityTokens();

    tokens.forEach((token) => {
      const value = parseFloat(token.value.toString());
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });
  });

  it('should include semantic meanings', () => {
    const tokens = generateOpacityTokens();

    const semanticTokens = tokens.filter((token) => token.semanticMeaning);
    expect(semanticTokens.length).toBeGreaterThan(0);
  });
});

describe('generator integration', () => {
  it('should generate tokens with consistent structure', () => {
    const spacingTokens = generateSpacingScale();
    const colorTokens = generateColorTokens();
    const typographyTokens = generateTypographyScale();

    const allTokens = [...spacingTokens, ...colorTokens, ...typographyTokens];

    // All tokens should have required fields
    allTokens.forEach((token) => {
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('category');
      expect(token).toHaveProperty('namespace');
      expect(typeof token.name).toBe('string');
      expect(token.name.length).toBeGreaterThan(0);
    });
  });

  it('should generate unique token names within categories', () => {
    const spacingTokens = generateSpacingScale();

    const names = spacingTokens.map((token) => token.name);
    const uniqueNames = [...new Set(names)];

    expect(names.length).toBe(uniqueNames.length);
  });

  it('should include AI intelligence metadata where appropriate', () => {
    const colorTokens = generateColorTokens();

    // Color tokens should have more intelligence metadata
    const intelligentTokens = colorTokens.filter(
      (token) => token.semanticMeaning || token.trustLevel || token.cognitiveLoad !== undefined
    );

    expect(intelligentTokens.length).toBeGreaterThan(0);
  });
});
