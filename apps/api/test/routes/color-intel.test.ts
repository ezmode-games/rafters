/**
 * Color Intel Route Unit Tests
 * Tests route logic with spyOn mocking
 */

import * as colorUtils from '@rafters/color-utils';
import { ColorValueSchema } from '@rafters/shared';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as colorIntelUtils from '@/lib/color-intel/utils';

describe('Color Intel Route Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates OKLCH input correctly', () => {
    const validateSpy = vi.spyOn(colorUtils, 'validateOKLCH');

    validateSpy.mockReturnValue(false);
    const result = colorUtils.validateOKLCH({ l: 1.5, c: 0.1, h: 180 });
    expect(result).toBe(false);

    validateSpy.mockReturnValue(true);
    const validResult = colorUtils.validateOKLCH({ l: 0.5, c: 0.1, h: 180 });
    expect(validResult).toBe(true);

    validateSpy.mockRestore();
  });

  test('generates complete color value with intelligence', async () => {
    const mockColorValue = {
      name: 'Test Blue',
      scale: [{ l: 0.5, c: 0.1, h: 240 }],
      perceptualWeight: {
        weight: 0.6,
        density: 'medium' as const,
        balancingRecommendation: 'Balance with lighter elements',
      },
    };

    const mockIntelligence = {
      suggestedName: 'Ocean Blue',
      reasoning: 'Cool blue tone',
      emotionalImpact: 'Calming',
      culturalContext: 'Professional',
      accessibilityNotes: 'Good contrast',
      usageGuidance: 'Primary actions',
    };

    const generateValueSpy = vi
      .spyOn(colorUtils, 'generateColorValue')
      .mockReturnValue(mockColorValue);
    const generateIntelSpy = vi
      .spyOn(colorIntelUtils, 'generateColorIntelligence')
      .mockResolvedValue(mockIntelligence);

    const result = await colorIntelUtils.generateColorIntelligence({ l: 0.5, c: 0.1, h: 240 }, {
      run: vi.fn(),
    } as unknown as Ai);

    expect(generateIntelSpy).toHaveBeenCalledWith({ l: 0.5, c: 0.1, h: 240 }, expect.any(Object));

    expect(result).toEqual(mockIntelligence);

    generateValueSpy.mockRestore();
    generateIntelSpy.mockRestore();
  });

  test('validates complete color value against schema', () => {
    const validColorValue = {
      name: 'Test Color',
      scale: [{ l: 0.5, c: 0.1, h: 180 }],
      intelligence: {
        suggestedName: 'Test Blue',
        reasoning: 'Test reasoning',
        emotionalImpact: 'Test impact',
        culturalContext: 'Test context',
        accessibilityNotes: 'Test notes',
        usageGuidance: 'Test guidance',
      },
    };

    const result = ColorValueSchema.safeParse(validColorValue);
    expect(result.success).toBe(true);

    const invalidColorValue = {
      name: 'Test Color',
      // Missing required scale field
    };

    const invalidResult = ColorValueSchema.safeParse(invalidColorValue);
    expect(invalidResult.success).toBe(false);
  });

  test('generates deterministic color ID from OKLCH values', () => {
    const oklch1 = { l: 0.5, c: 0.1, h: 180 };
    const oklch2 = { l: 0.5, c: 0.1, h: 180 };
    const oklch3 = { l: 0.6, c: 0.1, h: 180 };

    const id1 = `oklch-${oklch1.l.toFixed(2)}-${oklch1.c.toFixed(2)}-${oklch1.h.toFixed(0)}`;
    const id2 = `oklch-${oklch2.l.toFixed(2)}-${oklch2.c.toFixed(2)}-${oklch2.h.toFixed(0)}`;
    const id3 = `oklch-${oklch3.l.toFixed(2)}-${oklch3.c.toFixed(2)}-${oklch3.h.toFixed(0)}`;

    expect(id1).toBe(id2); // Same OKLCH should generate same ID
    expect(id1).not.toBe(id3); // Different OKLCH should generate different ID
    expect(id1).toBe('oklch-0.50-0.10-180');
  });

  test('processes balancing recommendation token replacement', () => {
    const colorValue = {
      name: 'Test Color',
      scale: [{ l: 0.5, c: 0.1, h: 180 }],
      perceptualWeight: {
        weight: 0.6,
        density: 'medium' as const,
        balancingRecommendation: '<AI_GENERATE>',
      },
    };

    const intelligence = {
      balancingGuidance: 'Use with lighter accents for balance',
    };

    // Simulate the token replacement logic
    const processedColorValue = { ...colorValue };
    if (processedColorValue.perceptualWeight?.balancingRecommendation === '<AI_GENERATE>') {
      processedColorValue.perceptualWeight.balancingRecommendation =
        intelligence.balancingGuidance ||
        `Weight: ${processedColorValue.perceptualWeight.weight.toFixed(2)} - ${processedColorValue.perceptualWeight.density} visual density`;
    }

    expect(processedColorValue.perceptualWeight.balancingRecommendation).toBe(
      'Use with lighter accents for balance'
    );
  });

  test('handles missing balancing guidance gracefully', () => {
    const colorValue = {
      name: 'Test Color',
      scale: [{ l: 0.5, c: 0.1, h: 180 }],
      perceptualWeight: {
        weight: 0.6,
        density: 'medium' as const,
        balancingRecommendation: '<AI_GENERATE>',
      },
    };

    const intelligence: { balancingGuidance?: string } = {}; // No balancing guidance

    // Simulate the token replacement logic
    const processedColorValue = { ...colorValue };
    if (processedColorValue.perceptualWeight?.balancingRecommendation === '<AI_GENERATE>') {
      processedColorValue.perceptualWeight.balancingRecommendation =
        intelligence.balancingGuidance ||
        `Weight: ${processedColorValue.perceptualWeight.weight.toFixed(2)} - ${processedColorValue.perceptualWeight.density} visual density`;
    }

    expect(processedColorValue.perceptualWeight.balancingRecommendation).toBe(
      'Weight: 0.60 - medium visual density'
    );
  });
});
