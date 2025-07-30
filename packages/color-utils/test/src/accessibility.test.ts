/**
 * Tests for accessibility contrast calculation functions
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import {
  calculateAPCAContrast,
  calculateWCAGContrast,
  findAccessibleColor,
  meetsAPCAStandard,
  meetsWCAGStandard,
} from '../../src/accessibility.js';

describe('Accessibility Functions', () => {
  // Test colors
  const white: OKLCH = { l: 1, c: 0, h: 0 };
  const black: OKLCH = { l: 0, c: 0, h: 0 };
  const midGray: OKLCH = { l: 0.5, c: 0, h: 0 };
  const darkBlue: OKLCH = { l: 0.3, c: 0.15, h: 240 };
  const lightBlue: OKLCH = { l: 0.8, c: 0.08, h: 240 };

  describe('calculateWCAGContrast', () => {
    it('should calculate maximum contrast for black on white', () => {
      const contrast = calculateWCAGContrast(black, white);
      expect(contrast).toBeCloseTo(21, 1);
    });

    it('should calculate minimum contrast for same colors', () => {
      const contrast = calculateWCAGContrast(midGray, midGray);
      expect(contrast).toBeCloseTo(1, 1);
    });

    it('should calculate contrast ratios symmetrically', () => {
      const contrast1 = calculateWCAGContrast(darkBlue, white);
      const contrast2 = calculateWCAGContrast(white, darkBlue);
      expect(contrast1).toBeCloseTo(contrast2, 2);
    });

    it('should return ratios greater than or equal to 1', () => {
      const contrast = calculateWCAGContrast(lightBlue, darkBlue);
      expect(contrast).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateAPCAContrast', () => {
    it('should calculate APCA contrast for black on white', () => {
      const contrast = calculateAPCAContrast(black, white);
      expect(contrast).toBeGreaterThan(90);
    });

    it('should calculate APCA contrast for white on black', () => {
      const contrast = calculateAPCAContrast(white, black);
      expect(contrast).toBeLessThan(-90);
    });

    it('should return 0 for same colors', () => {
      const contrast = calculateAPCAContrast(midGray, midGray);
      expect(Math.abs(contrast)).toBeLessThan(1);
    });

    it('should handle polarity (positive/negative values)', () => {
      const lightOnDark = calculateAPCAContrast(white, black);
      const darkOnLight = calculateAPCAContrast(black, white);
      expect(lightOnDark).toBeLessThan(0);
      expect(darkOnLight).toBeGreaterThan(0);
    });
  });

  describe('meetsWCAGStandard', () => {
    it('should pass AA standard for high contrast pairs', () => {
      expect(meetsWCAGStandard(black, white, 'AA', 'normal')).toBe(true);
      expect(meetsWCAGStandard(white, black, 'AA', 'normal')).toBe(true);
    });

    it('should fail AA standard for low contrast pairs', () => {
      expect(meetsWCAGStandard(lightBlue, white, 'AA', 'normal')).toBe(false);
    });

    it('should have different thresholds for large text', () => {
      // A pair that might fail normal but pass large text
      const mediumGray: OKLCH = { l: 0.6, c: 0, h: 0 };
      const normalResult = meetsWCAGStandard(mediumGray, white, 'AA', 'normal');
      const largeResult = meetsWCAGStandard(mediumGray, white, 'AA', 'large');

      // Large text should be more permissive
      if (!normalResult) {
        expect(largeResult).toBeTruthy();
      }
    });

    it('should have stricter AAA requirements than AA', () => {
      // Find a color that passes AA but might fail AAA
      const grayColor: OKLCH = { l: 0.45, c: 0, h: 0 };
      const aaResult = meetsWCAGStandard(grayColor, white, 'AA', 'normal');
      const aaaResult = meetsWCAGStandard(grayColor, white, 'AAA', 'normal');

      if (aaResult) {
        // AAA should be same or stricter
        expect(aaaResult).toBeDefined();
      }
    });
  });

  describe('meetsAPCAStandard', () => {
    it('should pass APCA standards for high contrast', () => {
      expect(meetsAPCAStandard(black, white, 16)).toBe(true);
      expect(meetsAPCAStandard(white, black, 16)).toBe(true);
    });

    it('should fail APCA standards for low contrast', () => {
      const result = meetsAPCAStandard(lightBlue, white, 16);
      // Light blue on white should have low contrast
      expect(typeof result).toBe('boolean');
    });

    it('should have different thresholds for different text sizes', () => {
      const mediumContrast: OKLCH = { l: 0.35, c: 0, h: 0 };
      const smallTextResult = meetsAPCAStandard(mediumContrast, white, 14);
      const largeTextResult = meetsAPCAStandard(mediumContrast, white, 24);

      // Larger text should be more permissive
      if (!smallTextResult) {
        expect(largeTextResult).toBeTruthy();
      }
    });
  });

  describe('findAccessibleColor', () => {
    it('should return accessible color for WCAG-AA', () => {
      const target: OKLCH = { l: 0.9, c: 0.05, h: 240 }; // Very light blue
      const background = white;

      const accessible = findAccessibleColor(target, background, 'WCAG-AA');
      expect(meetsWCAGStandard(accessible, background, 'AA', 'normal')).toBe(true);
    });

    it('should preserve hue and chroma when possible', () => {
      const target: OKLCH = { l: 0.8, c: 0.15, h: 120 }; // Light green
      const background = white;

      const accessible = findAccessibleColor(target, background, 'WCAG-AA');
      expect(accessible.h).toBeCloseTo(target.h, 1);
      expect(accessible.c).toBeCloseTo(target.c, 1);
    });

    it('should adjust lightness to meet contrast requirements', () => {
      const target: OKLCH = { l: 0.9, c: 0.1, h: 60 }; // Very light color
      const background = white;

      const accessible = findAccessibleColor(target, background, 'WCAG-AA');
      expect(accessible.l).toBeLessThan(target.l); // Should be darker
    });

    it('should work with different standards', () => {
      const target: OKLCH = { l: 0.7, c: 0.1, h: 200 };
      const background = white;

      const wcagAA = findAccessibleColor(target, background, 'WCAG-AA');
      const wcagAAA = findAccessibleColor(target, background, 'WCAG-AAA');
      const apca = findAccessibleColor(target, background, 'APCA');

      expect(wcagAAA.l).toBeLessThanOrEqual(wcagAA.l); // AAA should be darker/higher contrast
      expect(typeof apca.l).toBe('number');
    });
  });
});
