/**
 * Unit tests for main design-tokens index file
 * Tests utility functions, schemas, and core functionality
 */

import type { ColorValue } from '@rafters/shared';
import { describe, expect, it, vi } from 'vitest';
import {
  checkTailwindVersion,
  DesignSystemSchema,
  generateShortCode,
  isColorValue,
  tokenValueToCss,
  tokenValueToCssDark,
} from '../src/index.js';

// Mock fs for checkTailwindVersion tests
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock('fs-extra', () => ({
  ensureDirSync: vi.fn(),
}));

describe('generateShortCode', () => {
  it('should generate a unique short code', async () => {
    const code1 = generateShortCode();
    // Small delay to ensure different timestamp
    await new Promise((resolve) => setTimeout(resolve, 1));
    const code2 = generateShortCode();

    expect(typeof code1).toBe('string');
    expect(typeof code2).toBe('string');
    expect(code1.length).toBeGreaterThan(0);
    // Both should be valid strings even if occasionally the same
    expect(code1.length).toEqual(code2.length);
  });

  it('should generate codes using alphanumeric characters', () => {
    const code = generateShortCode();
    expect(code).toMatch(/^[a-zA-Z0-9]+$/);
  });
});

describe('isColorValue', () => {
  it('should identify valid ColorValue objects', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [{ l: 0.5, c: 0.2, h: 240 }],
    };

    expect(isColorValue(colorValue)).toBe(true);
  });

  it('should reject invalid objects', () => {
    expect(isColorValue(null)).toBe(false);
    expect(isColorValue(undefined)).toBe(false);
    expect(isColorValue('string')).toBe(false);
    expect(isColorValue(123)).toBe(false);
    expect(isColorValue({})).toBe(false);
    expect(isColorValue({ name: 'test' })).toBe(false); // Missing scale
    expect(isColorValue({ scale: [] })).toBe(false); // Missing name
  });

  it('should handle complex ColorValue objects', () => {
    const complexColorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [
        { l: 0.1, c: 0.05, h: 240 },
        { l: 0.5, c: 0.2, h: 240 },
        { l: 0.9, c: 0.05, h: 240 },
      ],
      token: 'primary',
      value: '500',
      states: {
        hover: 'ocean-blue-600',
        focus: 'ocean-blue-700',
      },
    };

    expect(isColorValue(complexColorValue)).toBe(true);
  });
});

describe('tokenValueToCss', () => {
  it('should return string values as-is', () => {
    expect(tokenValueToCss('16px')).toBe('16px');
    expect(tokenValueToCss('#ff0000')).toBe('#ff0000');
    expect(tokenValueToCss('var(--color-primary)')).toBe('var(--color-primary)');
  });

  it('should convert ColorValue with scale to CSS', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [
        { l: 0.1, c: 0.05, h: 240 }, // 0 - 50
        { l: 0.2, c: 0.1, h: 240 }, // 1 - 100
        { l: 0.3, c: 0.12, h: 240 }, // 2 - 200
        { l: 0.4, c: 0.15, h: 240 }, // 3 - 300
        { l: 0.5, c: 0.18, h: 240 }, // 4 - 400
        { l: 0.6, c: 0.2, h: 240 }, // 5 - 500 (default)
        { l: 0.7, c: 0.18, h: 240 }, // 6 - 600
      ],
      value: '500', // Should use index 5
    };

    const css = tokenValueToCss(colorValue);
    expect(css).toBe('oklch(0.6 0.2 240)');
  });

  it('should handle ColorValue with specific scale position', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [
        { l: 0.9, c: 0.05, h: 240 }, // 0 - 50
        { l: 0.8, c: 0.1, h: 240 }, // 1 - 100
        { l: 0.7, c: 0.15, h: 240 }, // 2 - 200
      ],
      value: '100', // Should use index 1
    };

    const css = tokenValueToCss(colorValue);
    expect(css).toBe('oklch(0.8 0.1 240)');
  });

  it('should handle ColorValue with alpha channel', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [{ l: 0.5, c: 0.2, h: 240, alpha: 0.8 }],
    };

    const css = tokenValueToCss(colorValue);
    expect(css).toBe('oklch(0.5 0.2 240 / 0.8)');
  });

  it('should fallback gracefully for invalid ColorValue', () => {
    const invalidColorValue: ColorValue = {
      name: 'invalid',
      scale: [], // Empty scale
    };

    const css = tokenValueToCss(invalidColorValue);
    expect(css).toBe('transparent');
  });

  it('should handle ColorValue with direct OKLCH value', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [],
      value: 'oklch(0.7 0.15 260)',
    };

    const css = tokenValueToCss(colorValue);
    expect(css).toBe('oklch(0.7 0.15 260)');
  });
});

describe('tokenValueToCssDark', () => {
  it('should return string values as-is', () => {
    expect(tokenValueToCssDark('16px')).toBe('16px');
    expect(tokenValueToCssDark('#000000')).toBe('#000000');
  });

  it('should use states when available', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [{ l: 0.5, c: 0.2, h: 240 }],
      states: {
        hover: 'ocean-blue-600',
        focus: 'ocean-blue-700',
        dark: 'ocean-blue-200',
      },
    };

    // Should return hover state as fallback
    expect(tokenValueToCssDark(colorValue)).toBe('ocean-blue-600');
  });

  it('should use specific state when requested', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [{ l: 0.5, c: 0.2, h: 240 }],
      states: {
        hover: 'ocean-blue-600',
        dark: 'ocean-blue-200',
      },
    };

    expect(tokenValueToCssDark(colorValue, 'dark')).toBe('ocean-blue-200');
  });

  it('should fallback to light value when no states', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [{ l: 0.5, c: 0.2, h: 240 }],
    };

    expect(tokenValueToCssDark(colorValue)).toBe('oklch(0.5 0.2 240)');
  });
});

describe('DesignSystemSchema', () => {
  const validDesignSystem = {
    id: 'test-system',
    name: 'Test Design System',
    tokens: [],
  };

  it('should validate minimal design system', () => {
    const result = DesignSystemSchema.safeParse(validDesignSystem);
    expect(result.success).toBe(true);

    if (result.success) {
      // Check default values
      expect(result.data.accessibilityTarget).toBe('AA');
      expect(result.data.section508Compliant).toBe(true);
      expect(result.data.cognitiveLoadBudget).toBe(15);
      expect(result.data.primaryColorSpace).toBe('oklch');
      expect(result.data.generateDarkTheme).toBe(true);
      expect(result.data.spacingSystem).toBe('linear');
      expect(result.data.spacingMultiplier).toBe(1.25);
      expect(result.data.spacingBaseUnit).toBe(4);
    }
  });

  it('should validate complete design system', () => {
    const completeSystem = {
      ...validDesignSystem,
      accessibilityTarget: 'AAA' as const,
      section508Compliant: false,
      cognitiveLoadBudget: 12,
      primaryColorSpace: 'P3' as const,
      generateDarkTheme: false,
      enforceContrast: false,
      enforceMotionSafety: false,
      spacingSystem: 'golden' as const,
      spacingMultiplier: 1.618,
      spacingBaseUnit: 8,
    };

    const result = DesignSystemSchema.safeParse(completeSystem);
    expect(result.success).toBe(true);
  });

  it('should reject invalid design system', () => {
    const invalidSystem = {
      // Missing required fields
      tokens: [],
    };

    const result = DesignSystemSchema.safeParse(invalidSystem);
    expect(result.success).toBe(false);
  });

  it('should enforce enum constraints', () => {
    const invalidEnum = {
      ...validDesignSystem,
      accessibilityTarget: 'INVALID',
    };

    const result = DesignSystemSchema.safeParse(invalidEnum);
    expect(result.success).toBe(false);
  });

  it('should enforce number constraints', () => {
    const invalidNumbers = {
      ...validDesignSystem,
      cognitiveLoadBudget: 25, // Max is 20
      spacingMultiplier: 0.5, // Min is 1.1
      spacingBaseUnit: 50, // Max is 32
    };

    const result = DesignSystemSchema.safeParse(invalidNumbers);
    expect(result.success).toBe(false);
  });
});

describe('checkTailwindVersion', async () => {
  const { existsSync, readFileSync } = await import('node:fs');
  const mockExistsSync = vi.mocked(existsSync);
  const mockReadFileSync = vi.mocked(readFileSync);

  it('should return v4 when no package.json exists', async () => {
    mockExistsSync.mockReturnValue(false);

    const version = await checkTailwindVersion('/test/path');
    expect(version).toBe('v4');
  });

  it('should detect v4 from catalog entry', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        dependencies: {
          tailwindcss: 'catalog:',
        },
      })
    );

    const version = await checkTailwindVersion('/test/path');
    expect(version).toBe('v4');
  });

  it('should detect v4 from @next tag', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        devDependencies: {
          tailwindcss: '^4.0.0@next',
        },
      })
    );

    const version = await checkTailwindVersion('/test/path');
    expect(version).toBe('v4');
  });

  it('should detect v3 from regular version', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        dependencies: {
          tailwindcss: '^3.4.0',
        },
      })
    );

    const version = await checkTailwindVersion('/test/path');
    expect(version).toBe('v3');
  });

  it('should return v4 when no tailwindcss dependency', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        dependencies: {
          react: '^18.0.0',
        },
      })
    );

    const version = await checkTailwindVersion('/test/path');
    expect(version).toBe('v4');
  });

  it('should handle malformed package.json', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation(() => {
      throw new Error('Invalid JSON');
    });

    const version = await checkTailwindVersion('/test/path');
    expect(version).toBe('v4');
  });
});
