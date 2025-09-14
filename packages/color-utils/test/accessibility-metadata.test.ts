/**
 * Tests for pre-computed accessibility metadata generation
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { generateAccessibilityMetadata, meetsWCAGStandard } from '../src/accessibility.js';

describe('generateAccessibilityMetadata', () => {
  it('should generate contrast matrices for color scale', () => {
    // Create a test scale from light to dark
    const scale: OKLCH[] = [
      { l: 0.95, c: 0.02, h: 240 }, // Very light
      { l: 0.8, c: 0.05, h: 240 }, // Light
      { l: 0.65, c: 0.08, h: 240 }, // Medium-light
      { l: 0.5, c: 0.12, h: 240 }, // Medium
      { l: 0.35, c: 0.12, h: 240 }, // Medium-dark
      { l: 0.2, c: 0.1, h: 240 }, // Dark
      { l: 0.1, c: 0.05, h: 240 }, // Very dark
    ];

    const metadata = generateAccessibilityMetadata(scale);

    expect(metadata.wcagAA.normal).toBeInstanceOf(Array);
    expect(metadata.wcagAA.large).toBeInstanceOf(Array);
    expect(metadata.wcagAAA.normal).toBeInstanceOf(Array);
    expect(metadata.wcagAAA.large).toBeInstanceOf(Array);
    expect(metadata.onWhite.aa).toBeInstanceOf(Array);
    expect(metadata.onWhite.aaa).toBeInstanceOf(Array);
    expect(metadata.onBlack.aa).toBeInstanceOf(Array);
    expect(metadata.onBlack.aaa).toBeInstanceOf(Array);

    // Should have some accessible pairs
    expect(metadata.wcagAA.normal.length).toBeGreaterThan(0);

    // Verify indices are valid
    for (const [i, j] of metadata.wcagAA.normal) {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(scale.length);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThan(scale.length);
      expect(i).not.toBe(j); // Should not include same-color pairs
    }
  });

  it('should identify accessible pairs correctly', () => {
    const scale: OKLCH[] = [
      { l: 0.95, c: 0.02, h: 240 }, // Very light - index 0
      { l: 0.2, c: 0.15, h: 240 }, // Very dark - index 1
    ];

    const metadata = generateAccessibilityMetadata(scale);

    // Light/dark pair should have good contrast for both directions
    const hasLightToDark = metadata.wcagAA.normal.some(([i, j]) => i === 0 && j === 1);
    const hasDarkToLight = metadata.wcagAA.normal.some(([i, j]) => i === 1 && j === 0);

    expect(hasLightToDark || hasDarkToLight).toBe(true);
  });

  it('should handle empty or invalid color scales gracefully', () => {
    const emptyMetadata = generateAccessibilityMetadata([]);

    expect(emptyMetadata.wcagAA.normal).toEqual([]);
    expect(emptyMetadata.wcagAAA.normal).toEqual([]);
    expect(emptyMetadata.onWhite.aa).toEqual([]);
    expect(emptyMetadata.onBlack.aa).toEqual([]);
  });

  it('should skip invalid OKLCH values in scale', () => {
    type InvalidOKLCH = {
      l: number;
      c: number;
      h: number;
    };

    const scaleWithInvalid: (OKLCH | InvalidOKLCH)[] = [
      { l: 0.95, c: 0.02, h: 240 }, // Valid
      { l: Number.NaN, c: 0.05, h: 240 }, // Invalid - properly typed
      { l: 0.2, c: 0.15, h: 240 }, // Valid
    ];

    const metadata = generateAccessibilityMetadata(scaleWithInvalid);

    // Should still process valid colors and not crash
    expect(metadata.wcagAA.normal).toBeInstanceOf(Array);
    expect(metadata.onWhite.aa).toBeInstanceOf(Array);
  });

  it('should generate white/black background compatibility correctly', () => {
    const scale: OKLCH[] = [
      { l: 0.95, c: 0.02, h: 240 }, // Light - good on black
      { l: 0.5, c: 0.12, h: 240 }, // Medium
      { l: 0.2, c: 0.15, h: 240 }, // Dark - good on white
    ];

    const metadata = generateAccessibilityMetadata(scale);

    // Dark colors (index 2) should be accessible on white
    expect(metadata.onWhite.aa).toContain(2);

    // Light colors (index 0) should be accessible on black
    expect(metadata.onBlack.aa).toContain(0);
  });

  it('should have more AA pairs than AAA pairs', () => {
    const scale: OKLCH[] = [
      { l: 0.95, c: 0.02, h: 240 },
      { l: 0.8, c: 0.05, h: 240 },
      { l: 0.65, c: 0.08, h: 240 },
      { l: 0.5, c: 0.12, h: 240 },
      { l: 0.35, c: 0.12, h: 240 },
      { l: 0.2, c: 0.1, h: 240 },
      { l: 0.1, c: 0.05, h: 240 },
    ];

    const metadata = generateAccessibilityMetadata(scale);

    // AAA has stricter requirements (7:1) vs AA (4.5:1)
    // So there should be fewer AAA compliant pairs
    expect(metadata.wcagAAA.normal.length).toBeLessThanOrEqual(metadata.wcagAA.normal.length);
  });

  it('should generate large text pairs with more permissive standards', () => {
    const scale: OKLCH[] = [
      { l: 0.85, c: 0.05, h: 240 },
      { l: 0.6, c: 0.1, h: 240 },
      { l: 0.3, c: 0.12, h: 240 },
    ];

    const metadata = generateAccessibilityMetadata(scale);

    // Large text has more permissive requirements (3:1 for AA vs 4.5:1 for normal)
    // So there should be more large text pairs than normal text pairs
    expect(metadata.wcagAA.large.length).toBeGreaterThanOrEqual(metadata.wcagAA.normal.length);
  });

  it('should validate all generated pairs meet their claimed standards', () => {
    const scale: OKLCH[] = [
      { l: 0.9, c: 0.03, h: 240 },
      { l: 0.7, c: 0.08, h: 240 },
      { l: 0.5, c: 0.12, h: 240 },
      { l: 0.3, c: 0.12, h: 240 },
      { l: 0.15, c: 0.08, h: 240 },
    ];

    const metadata = generateAccessibilityMetadata(scale);

    // Verify all AA normal pairs actually meet AA standards
    for (const [i, j] of metadata.wcagAA.normal) {
      const color1 = scale[i];
      const color2 = scale[j];
      expect(meetsWCAGStandard(color1, color2, 'AA', 'normal')).toBe(true);
    }

    // Verify all AAA normal pairs actually meet AAA standards
    for (const [i, j] of metadata.wcagAAA.normal) {
      const color1 = scale[i];
      const color2 = scale[j];
      expect(meetsWCAGStandard(color1, color2, 'AAA', 'normal')).toBe(true);
    }
  });

  it('should have consistent metadata structure', () => {
    const scale: OKLCH[] = [
      { l: 0.8, c: 0.05, h: 180 },
      { l: 0.4, c: 0.12, h: 180 },
    ];

    const metadata = generateAccessibilityMetadata(scale);

    // Verify structure matches AccessibilityMetadata interface
    expect(metadata).toHaveProperty('wcagAA');
    expect(metadata.wcagAA).toHaveProperty('normal');
    expect(metadata.wcagAA).toHaveProperty('large');
    expect(metadata).toHaveProperty('wcagAAA');
    expect(metadata.wcagAAA).toHaveProperty('normal');
    expect(metadata.wcagAAA).toHaveProperty('large');
    expect(metadata).toHaveProperty('onWhite');
    expect(metadata.onWhite).toHaveProperty('aa');
    expect(metadata.onWhite).toHaveProperty('aaa');
    expect(metadata).toHaveProperty('onBlack');
    expect(metadata.onBlack).toHaveProperty('aa');
    expect(metadata.onBlack).toHaveProperty('aaa');
  });
});
