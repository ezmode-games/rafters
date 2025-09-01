import type { OKLCH } from '@rafters/shared';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import {
  calculateColorData,
  generateCacheKey,
  generateColorIntelligence,
} from '../../../lib/color-intel/utils';

// Mock dependencies
vi.mock('../../../lib/ai/claude/client', () => ({
  getClaudeClient: vi.fn(() => ({
    generateText: vi.fn().mockResolvedValue(
      JSON.stringify({
        reasoning: 'Test reasoning',
        emotionalImpact: 'Test emotional impact',
        culturalContext: 'Test cultural context',
        accessibilityNotes: 'Test accessibility notes',
        usageGuidance: 'Test usage guidance',
      })
    ),
  })),
}));

vi.mock('@rafters/color-utils', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    calculateWCAGContrast: vi.fn(() => 4.5),
    generateColorName: vi.fn(() => 'Sky Blue'),
    generateHarmoniousPalette: vi.fn((color: OKLCH, _type: string, count?: number) => {
      const colors = [];
      for (let i = 0; i < (count || 1); i++) {
        colors.push({ ...color, h: (color.h + 180) % 360 });
      }
      return colors;
    }),
    getColorTemperature: vi.fn(() => 'cool'),
    isLightColor: vi.fn((color: OKLCH) => color.l > 0.5),
    meetsWCAGStandard: vi.fn(() => true),
  };
});

// Import validateOKLCH after mocks are set up
const { validateOKLCH } = await vi.importActual<{
  validateOKLCH: (oklch: unknown) => oklch is OKLCH;
}>('@rafters/color-utils');

describe('validateOKLCH', () => {
  it('should validate valid OKLCH color', () => {
    const validColor: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    expect(validateOKLCH(validColor)).toBe(true);
  });

  it('should reject invalid lightness values', () => {
    expect(validateOKLCH({ l: -0.1, c: 0.2, h: 180 })).toBe(false);
    expect(validateOKLCH({ l: 1.1, c: 0.2, h: 180 })).toBe(false);
    expect(validateOKLCH({ l: 'invalid', c: 0.2, h: 180 })).toBe(false);
  });

  it('should reject invalid chroma values', () => {
    expect(validateOKLCH({ l: 0.5, c: -0.1, h: 180 })).toBe(false);
    expect(validateOKLCH({ l: 0.5, c: 'invalid', h: 180 })).toBe(false);
  });

  it('should reject invalid hue values', () => {
    expect(validateOKLCH({ l: 0.5, c: 0.2, h: -10 })).toBe(false);
    expect(validateOKLCH({ l: 0.5, c: 0.2, h: 370 })).toBe(false);
    expect(validateOKLCH({ l: 0.5, c: 0.2, h: 'invalid' })).toBe(false);
  });

  it('should reject non-object values', () => {
    expect(validateOKLCH(null)).toBe(false);
    expect(validateOKLCH(undefined)).toBe(false);
    expect(validateOKLCH('string')).toBe(false);
    expect(validateOKLCH(123)).toBe(false);
  });
});

describe('generateCacheKey', () => {
  it('should generate consistent cache key', () => {
    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    const key = generateCacheKey(color);
    expect(key).toBe('color-intel:0.5-0.2-180');
  });

  it('should round values consistently', () => {
    const color1: OKLCH = { l: 0.5001, c: 0.2001, h: 180.01 };
    const color2: OKLCH = { l: 0.5004, c: 0.2004, h: 180.04 };
    expect(generateCacheKey(color1)).toBe(generateCacheKey(color2));
  });
});

describe('generateColorIntelligence', () => {
  it('should generate intelligence with context', async () => {
    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    const context = { token: 'primary', name: 'Sky Blue' };

    const intelligence = await generateColorIntelligence(color, context, 'test-key');

    expect(intelligence).toEqual({
      reasoning: 'Test reasoning',
      emotionalImpact: 'Test emotional impact',
      culturalContext: 'Test cultural context',
      accessibilityNotes: 'Test accessibility notes',
      usageGuidance: 'Test usage guidance',
    });
  });

  it('should handle missing context', async () => {
    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    const context = {};

    const intelligence = await generateColorIntelligence(color, context, 'test-key');

    expect(intelligence).toBeDefined();
  });

  it('should throw on invalid JSON response', async () => {
    const { getClaudeClient } = await import('../../../lib/ai/claude/client');
    vi.mocked(getClaudeClient).mockReturnValueOnce({
      generateText: vi.fn().mockResolvedValue('Invalid JSON'),
    } as ReturnType<typeof getClaudeClient>);

    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };

    await expect(generateColorIntelligence(color, {}, 'test-key')).rejects.toThrow(
      'Intelligence generation failed'
    );
  });

  it('should throw on incomplete intelligence response', async () => {
    const { getClaudeClient } = await import('../../../lib/ai/claude/client');
    vi.mocked(getClaudeClient).mockReturnValueOnce({
      generateText: vi.fn().mockResolvedValue(
        JSON.stringify({
          reasoning: 'Test reasoning',
          // Missing other required fields
        })
      ),
    } as ReturnType<typeof getClaudeClient>);

    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };

    await expect(generateColorIntelligence(color, {}, 'test-key')).rejects.toThrow(
      'Incomplete intelligence response from Claude API'
    );
  });
});

describe('calculateColorData', () => {
  it('should calculate harmonies', () => {
    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    const data = calculateColorData(color);

    expect(data.harmonies).toBeDefined();
    expect(data.harmonies.complementary).toBeDefined();
    expect(data.harmonies.triadic).toHaveLength(2);
    expect(data.harmonies.analogous).toHaveLength(2);
    expect(data.harmonies.tetradic).toHaveLength(3);
    expect(data.harmonies.monochromatic).toHaveLength(4);
  });

  it('should calculate accessibility', () => {
    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    const data = calculateColorData(color);

    expect(data.accessibility).toBeDefined();
    expect(data.accessibility.onWhite.wcagAA).toBe(true);
    expect(data.accessibility.onWhite.wcagAAA).toBe(true);
    expect(data.accessibility.onWhite.contrastRatio).toBe(4.5);
    expect(data.accessibility.onBlack.wcagAA).toBe(true);
    expect(data.accessibility.onBlack.wcagAAA).toBe(true);
    expect(data.accessibility.onBlack.contrastRatio).toBe(4.5);
  });

  it('should analyze color properties', () => {
    const color: OKLCH = { l: 0.5, c: 0.2, h: 180 };
    const data = calculateColorData(color);

    expect(data.analysis).toBeDefined();
    expect(data.analysis.temperature).toBe('cool');
    expect(data.analysis.isLight).toBe(false);
    expect(data.analysis.name).toBe('Sky Blue');
  });
});
