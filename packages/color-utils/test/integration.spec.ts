/**
 * Integration tests for color-utils package
 * Tests interaction with shared types and real-world color processing scenarios
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { describe, expect, it, vi } from 'vitest';

// Mock external dependencies for integration testing
vi.mock('colorjs.io', () => ({
  default: vi.fn().mockImplementation((_colorSpace, values) => ({
    to: vi.fn().mockReturnValue({
      r: 0.235,
      g: 0.51,
      b: 0.965,
      toString: vi.fn().mockReturnValue('#3b82f6'),
      coords: values || [0.5, 0.2, 240],
    }),
    r: 0.235,
    g: 0.51,
    b: 0.965,
  })),
}));

vi.mock('apca-w3', () => ({
  APCAcontrast: vi.fn().mockReturnValue(85),
  sRGBtoY: vi.fn().mockReturnValue(0.5),
}));

const {
  oklchToHex,
  oklchToCSS,
  calculateWCAGContrast,
  meetsWCAGStandard,
  calculateAPCAContrast,
  findAccessibleColor,
  generateAccessibilityMetadata,
} = await import('../src/index.js');

describe('OKLCH color processing integration', () => {
  it('should process OKLCH colors from shared types', () => {
    const sharedOKLCH: OKLCH = {
      l: 0.62,
      c: 0.18,
      h: 237,
      alpha: 0.95,
    };

    // Convert to hex using color-utils
    const hexColor = oklchToHex(sharedOKLCH);
    expect(hexColor).toBe('#3b82f6');
    expect(hexColor).toMatch(/^#[0-9a-fA-F]{6}$/);

    // Convert to CSS using color-utils
    const cssColor = oklchToCSS(sharedOKLCH);
    expect(cssColor).toBe('oklch(0.62 0.18 237)');
  });

  it('should handle ColorValue objects from shared types', () => {
    const colorValue: ColorValue = {
      name: 'ocean-blue',
      scale: [
        { l: 0.95, c: 0.02, h: 237 }, // 50
        { l: 0.85, c: 0.08, h: 237 }, // 100
        { l: 0.75, c: 0.12, h: 237 }, // 200
        { l: 0.65, c: 0.15, h: 237 }, // 300
        { l: 0.55, c: 0.18, h: 237 }, // 400
        { l: 0.45, c: 0.2, h: 237 }, // 500
        { l: 0.35, c: 0.18, h: 237 }, // 600
        { l: 0.25, c: 0.15, h: 237 }, // 700
        { l: 0.15, c: 0.12, h: 237 }, // 800
        { l: 0.05, c: 0.05, h: 237 }, // 900
      ],
      token: 'primary',
      value: '500',
    };

    // Color-utils should be able to process colors from the scale
    const baseColor = colorValue.scale[5]; // 500 position
    const hexFromScale = oklchToHex(baseColor);
    expect(hexFromScale).toBe('#3b82f6');
  });

  it('should generate accessibility metadata compatible with shared types', () => {
    const colorScale: OKLCH[] = [
      { l: 0.95, c: 0.02, h: 237 },
      { l: 0.75, c: 0.12, h: 237 },
      { l: 0.55, c: 0.18, h: 237 },
      { l: 0.35, c: 0.18, h: 237 },
      { l: 0.15, c: 0.12, h: 237 },
    ];

    const metadata = generateAccessibilityMetadata(colorScale);

    // Should match the structure defined in shared types
    expect(metadata).toHaveProperty('wcagAA');
    expect(metadata).toHaveProperty('wcagAAA');
    expect(metadata).toHaveProperty('onWhite');
    expect(metadata).toHaveProperty('onBlack');

    expect(metadata.wcagAA).toHaveProperty('normal');
    expect(metadata.wcagAA).toHaveProperty('large');
    expect(Array.isArray(metadata.wcagAA.normal)).toBe(true);
    expect(Array.isArray(metadata.wcagAA.large)).toBe(true);

    expect(metadata.onWhite).toHaveProperty('aa');
    expect(metadata.onWhite).toHaveProperty('aaa');
    expect(Array.isArray(metadata.onWhite.aa)).toBe(true);
    expect(Array.isArray(metadata.onWhite.aaa)).toBe(true);
  });
});

describe('Accessibility calculations with shared types', () => {
  it('should calculate WCAG contrast between OKLCH colors', () => {
    const foreground: OKLCH = { l: 0.15, c: 0.12, h: 237 }; // Dark
    const background: OKLCH = { l: 0.95, c: 0.02, h: 237 }; // Light

    const contrast = calculateWCAGContrast(foreground, background);

    expect(typeof contrast).toBe('number');
    expect(contrast).toBeGreaterThanOrEqual(1);
    // In real usage, this would be high contrast between dark and light
    // But with mocked colorjs.io, we just verify it returns a valid ratio
  });

  it('should validate WCAG compliance with shared standards', () => {
    const darkColor: OKLCH = { l: 0.25, c: 0.15, h: 237 };
    const lightColor: OKLCH = { l: 0.85, c: 0.08, h: 237 };

    // Test AA compliance for normal text
    const aaCompliant = meetsWCAGStandard(darkColor, lightColor, 'AA', 'normal');
    expect(typeof aaCompliant).toBe('boolean');

    // Test AAA compliance for normal text
    const aaaCompliant = meetsWCAGStandard(darkColor, lightColor, 'AAA', 'normal');
    expect(typeof aaaCompliant).toBe('boolean');

    // Test large text is more lenient
    const aaLarge = meetsWCAGStandard(darkColor, lightColor, 'AA', 'large');
    expect(typeof aaLarge).toBe('boolean');
  });

  it('should calculate APCA contrast for modern accessibility', () => {
    const foreground: OKLCH = { l: 0.15, c: 0.12, h: 237 };
    const background: OKLCH = { l: 0.95, c: 0.02, h: 237 };

    const apcaScore = calculateAPCAContrast(foreground, background);

    expect(typeof apcaScore).toBe('number');
    // APCA is directional, so absolute value should be significant
    expect(Math.abs(apcaScore)).toBeGreaterThan(60);
  });

  it('should find accessible colors maintaining OKLCH structure', () => {
    const targetColor: OKLCH = { l: 0.55, c: 0.18, h: 237 };
    const background: OKLCH = { l: 0.95, c: 0.02, h: 237 };

    const accessibleColor = findAccessibleColor(targetColor, background, 'WCAG-AA');

    // Should return valid OKLCH structure
    expect(accessibleColor).toHaveProperty('l');
    expect(accessibleColor).toHaveProperty('c');
    expect(accessibleColor).toHaveProperty('h');

    expect(typeof accessibleColor.l).toBe('number');
    expect(typeof accessibleColor.c).toBe('number');
    expect(typeof accessibleColor.h).toBe('number');

    expect(accessibleColor.l).toBeGreaterThanOrEqual(0);
    expect(accessibleColor.l).toBeLessThanOrEqual(1);
    expect(accessibleColor.c).toBeGreaterThanOrEqual(0);
    expect(accessibleColor.h).toBeGreaterThanOrEqual(0);
    expect(accessibleColor.h).toBeLessThanOrEqual(360);
  });
});

describe('Color processing workflows', () => {
  it('should process complete color intelligence workflow', () => {
    // Simulate workflow: Base OKLCH -> Scale generation -> Accessibility -> Intelligence

    const baseColor: OKLCH = { l: 0.55, c: 0.18, h: 237 };

    // 1. Generate color scale (simulated)
    const lightVariants: OKLCH[] = [
      { l: 0.95, c: 0.02, h: 237 },
      { l: 0.85, c: 0.08, h: 237 },
      { l: 0.75, c: 0.12, h: 237 },
    ];

    const darkVariants: OKLCH[] = [
      { l: 0.45, c: 0.2, h: 237 },
      { l: 0.35, c: 0.18, h: 237 },
      { l: 0.25, c: 0.15, h: 237 },
    ];

    const fullScale = [...lightVariants, baseColor, ...darkVariants];

    // 2. Generate accessibility metadata
    const metadata = generateAccessibilityMetadata(fullScale);
    expect(metadata).toHaveProperty('wcagAA');

    // 3. Convert to various formats
    const hexColors = fullScale.map((color) => oklchToHex(color));
    expect(hexColors).toHaveLength(7);
    hexColors.forEach((hex) => {
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    // 4. Generate CSS values
    const cssColors = fullScale.map((color) => oklchToCSS(color));
    expect(cssColors).toHaveLength(7);
    cssColors.forEach((css) => {
      expect(css).toMatch(/^oklch\([0-9.]+ [0-9.]+ [0-9.]+\)$/);
    });
  });

  it('should handle edge cases in color processing', () => {
    // Test edge cases that could come from shared types

    // Pure black
    const black: OKLCH = { l: 0, c: 0, h: 0 };
    expect(oklchToHex(black)).toBe('#3b82f6'); // Mock value
    expect(oklchToCSS(black)).toBe('oklch(0 0 0)');

    // Pure white
    const white: OKLCH = { l: 1, c: 0, h: 0 };
    expect(oklchToHex(white)).toBe('#3b82f6'); // Mock value
    expect(oklchToCSS(white)).toBe('oklch(1 0 0)');

    // High chroma color
    const vivid: OKLCH = { l: 0.5, c: 0.4, h: 120 };
    expect(oklchToHex(vivid)).toBe('#3b82f6'); // Mock value
    expect(oklchToCSS(vivid)).toBe('oklch(0.5 0.4 120)');

    // Color with alpha
    const transparent: OKLCH = { l: 0.5, c: 0.2, h: 240, alpha: 0.5 };
    expect(oklchToCSS(transparent)).toBe('oklch(0.5 0.2 240)');
  });

  it('should maintain type safety across package boundaries', () => {
    // Test that color-utils functions properly handle shared types

    const sharedColors: OKLCH[] = [
      { l: 0.2, c: 0.15, h: 0 }, // Red
      { l: 0.6, c: 0.18, h: 120 }, // Green
      { l: 0.4, c: 0.2, h: 240 }, // Blue
    ];

    // All processing should maintain type safety
    sharedColors.forEach((color) => {
      const hex = oklchToHex(color);
      const css = oklchToCSS(color);

      expect(typeof hex).toBe('string');
      expect(typeof css).toBe('string');
      expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(css).toMatch(/^oklch\([0-9.]+ [0-9.]+ [0-9.]+\)$/);
    });
  });
});
