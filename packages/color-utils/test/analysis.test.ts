/**
 * Unit tests for color analysis functions
 * Tests perceptual properties, temperature, and distance calculations
 */

import type { OKLCH } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { calculateColorDistance, getColorTemperature, isLightColor } from '../src/analysis.js';

describe('calculateColorDistance', () => {
  const red: OKLCH = { l: 0.5, c: 0.2, h: 0 };
  const blue: OKLCH = { l: 0.5, c: 0.2, h: 240 };
  const _green: OKLCH = { l: 0.5, c: 0.2, h: 120 };

  it('should calculate perceptual distance between colors', () => {
    const distance = calculateColorDistance(red, blue);

    expect(typeof distance).toBe('number');
    expect(distance).toBeGreaterThan(0);
  });

  it('should return 0 distance for identical colors', () => {
    const distance = calculateColorDistance(red, red);

    expect(distance).toBe(0);
  });

  it('should be symmetric (distance A→B equals B→A)', () => {
    const distance1 = calculateColorDistance(red, blue);
    const distance2 = calculateColorDistance(blue, red);

    expect(distance1).toBe(distance2);
  });

  it('should handle large hue differences correctly', () => {
    const redShifted: OKLCH = { l: 0.5, c: 0.2, h: 350 }; // Close to 0
    const distanceSmall = calculateColorDistance(red, redShifted);
    const distanceLarge = calculateColorDistance(red, blue);

    expect(distanceSmall).toBeLessThan(distanceLarge);
  });

  it('should consider lightness differences', () => {
    const darkRed: OKLCH = { l: 0.2, c: 0.2, h: 0 };
    const lightRed: OKLCH = { l: 0.8, c: 0.2, h: 0 };

    const lightnessDistance = calculateColorDistance(darkRed, lightRed);
    const hueDistance = calculateColorDistance(red, blue);

    expect(lightnessDistance).toBeGreaterThan(0);
    expect(hueDistance).toBeGreaterThan(0);
  });

  it('should consider chroma differences', () => {
    const grayRed: OKLCH = { l: 0.5, c: 0.05, h: 0 }; // Low chroma
    const vibrantRed: OKLCH = { l: 0.5, c: 0.4, h: 0 }; // High chroma

    const chromaDistance = calculateColorDistance(grayRed, vibrantRed);

    expect(chromaDistance).toBeGreaterThan(0);
  });

  it('should handle edge cases gracefully', () => {
    const black: OKLCH = { l: 0, c: 0, h: 0 };
    const white: OKLCH = { l: 1, c: 0, h: 0 };

    const extremeDistance = calculateColorDistance(black, white);

    expect(extremeDistance).toBeGreaterThan(50); // Should be large distance
  });
});

describe('getColorTemperature', () => {
  const warmColors: OKLCH[] = [
    { l: 0.5, c: 0.2, h: 0 }, // Red
    { l: 0.5, c: 0.2, h: 30 }, // Orange
    { l: 0.5, c: 0.2, h: 60 }, // Yellow
  ];

  const coolColors: OKLCH[] = [
    { l: 0.5, c: 0.2, h: 180 }, // Cyan
    { l: 0.5, c: 0.2, h: 240 }, // Blue
    { l: 0.5, c: 0.2, h: 270 }, // Purple-blue
  ];

  const neutralColors: OKLCH[] = [
    { l: 0.5, c: 0.2, h: 90 }, // Green (can be neutral)
    { l: 0.5, c: 0.2, h: 300 }, // Purple (can be neutral)
    { l: 0.5, c: 0.01, h: 180 }, // Low chroma (neutral)
  ];

  it('should identify warm colors correctly', () => {
    warmColors.forEach((color) => {
      const temperature = getColorTemperature(color);
      expect(temperature).toBe('warm');
    });
  });

  it('should identify cool colors correctly', () => {
    coolColors.forEach((color) => {
      const temperature = getColorTemperature(color);
      expect(temperature).toBe('cool');
    });
  });

  it('should handle neutral colors', () => {
    neutralColors.forEach((color) => {
      const temperature = getColorTemperature(color);
      expect(['neutral', 'warm', 'cool']).toContain(temperature);
    });
  });

  it('should handle achromatic colors as neutral', () => {
    const gray: OKLCH = { l: 0.5, c: 0, h: 0 };
    const temperature = getColorTemperature(gray);

    expect(temperature).toBe('neutral');
  });

  it('should handle edge hue values correctly', () => {
    const hue359: OKLCH = { l: 0.5, c: 0.2, h: 359 };
    const hue1: OKLCH = { l: 0.5, c: 0.2, h: 1 };

    const temp1 = getColorTemperature(hue359);
    const temp2 = getColorTemperature(hue1);

    expect(temp1).toBe('warm');
    expect(temp2).toBe('warm');
  });
});

describe('isLightColor', () => {
  it('should identify light colors correctly', () => {
    const lightColor: OKLCH = { l: 0.8, c: 0.2, h: 240 };
    expect(isLightColor(lightColor)).toBe(true);
  });

  it('should identify dark colors correctly', () => {
    const darkColor: OKLCH = { l: 0.2, c: 0.2, h: 240 };
    expect(isLightColor(darkColor)).toBe(false);
  });

  it('should handle threshold cases', () => {
    const thresholdColor: OKLCH = { l: 0.5, c: 0.2, h: 240 };
    const result = isLightColor(thresholdColor);

    expect(typeof result).toBe('boolean');
  });

  it('should handle different chroma values', () => {
    const lowChromaColor: OKLCH = { l: 0.6, c: 0.02, h: 240 }; // Very low chroma
    const highChromaColor: OKLCH = { l: 0.6, c: 0.3, h: 240 }; // High chroma

    // Low chroma uses simple threshold, high chroma adjusts threshold
    const lowChromaResult = isLightColor(lowChromaColor);
    const highChromaResult = isLightColor(highChromaColor);

    expect(typeof lowChromaResult).toBe('boolean');
    expect(typeof highChromaResult).toBe('boolean');
  });

  it('should handle edge lightness values', () => {
    const black: OKLCH = { l: 0, c: 0, h: 0 };
    const white: OKLCH = { l: 1, c: 0, h: 0 };

    expect(isLightColor(black)).toBe(false);
    expect(isLightColor(white)).toBe(true);
  });
});

// analyzeColorProperties and generateColorName functions not implemented yet
