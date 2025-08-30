import * as ColorUtils from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as ClaudeClient from '../../../src/lib/ai/claude/client';
import {
  calculateColorData,
  generateCacheKey,
  generateColorIntelligence,
  validateOKLCH,
} from '../../../src/lib/color-intel/utils';

// Mock color-utils since it's an ESM module
vi.mock('@rafters/color-utils', () => ({
  generateHarmoniousPalette: vi.fn(),
  meetsWCAGStandard: vi.fn(),
  calculateWCAGContrast: vi.fn(),
  getColorTemperature: vi.fn(),
  isLightColor: vi.fn(),
  generateColorName: vi.fn(),
}));

const mockedColorUtils = vi.mocked(ColorUtils);

describe('Color Intelligence API Units', () => {
  describe('validateOKLCH', () => {
    it('should validate correct OKLCH values', () => {
      const validOklch = { l: 0.5, c: 0.1, h: 180 };
      expect(validateOKLCH(validOklch)).toBe(true);
    });

    it('should reject invalid lightness values', () => {
      expect(validateOKLCH({ l: -0.1, c: 0.1, h: 180 })).toBe(false);
      expect(validateOKLCH({ l: 1.1, c: 0.1, h: 180 })).toBe(false);
      expect(validateOKLCH({ l: 'invalid', c: 0.1, h: 180 })).toBe(false);
    });

    it('should reject invalid chroma values', () => {
      expect(validateOKLCH({ l: 0.5, c: -0.1, h: 180 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 'invalid', h: 180 })).toBe(false);
    });

    it('should reject invalid hue values', () => {
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: -1 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 361 })).toBe(false);
      expect(validateOKLCH({ l: 0.5, c: 0.1, h: 'invalid' })).toBe(false);
    });

    it('should reject non-object values', () => {
      expect(validateOKLCH(null)).toBe(false);
      expect(validateOKLCH(undefined)).toBe(false);
      expect(validateOKLCH('string')).toBe(false);
      expect(validateOKLCH(123)).toBe(false);
    });
  });

  describe('generateCacheKey', () => {
    it('should generate consistent cache keys', () => {
      const oklch: OKLCH = { l: 0.5, c: 0.1, h: 180.0 };
      const key1 = generateCacheKey(oklch);
      const key2 = generateCacheKey(oklch);

      expect(key1).toBe(key2);
      expect(key1).toBe('color-intel:0.500-0.100-180.0');
    });

    it('should generate different keys for different colors', () => {
      const oklch1: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      const oklch2: OKLCH = { l: 0.6, c: 0.1, h: 180 };

      expect(generateCacheKey(oklch1)).not.toBe(generateCacheKey(oklch2));
    });

    it('should format values to correct precision', () => {
      const oklch: OKLCH = { l: 0.123456, c: 0.987654, h: 123.456789 };
      const key = generateCacheKey(oklch);

      expect(key).toBe('color-intel:0.123-0.988-123.5');
    });
  });

  describe('generateColorIntelligence', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call Claude client with correct parameters', async () => {
      const mockClient = {
        generateText: vi.fn().mockResolvedValue(
          JSON.stringify({
            reasoning: 'Test reasoning',
            emotionalImpact: 'Test impact',
            culturalContext: 'Test context',
            accessibilityNotes: 'Test accessibility',
            usageGuidance: 'Test guidance',
          })
        ),
      };

      vi.spyOn(ClaudeClient, 'getClaudeClient').mockReturnValue(
        mockClient as ClaudeClient.ClaudeClient
      );

      const oklch: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      await generateColorIntelligence(oklch, {}, 'test-api-key');

      expect(ClaudeClient.getClaudeClient).toHaveBeenCalledWith('test-api-key');
      expect(mockClient.generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-3-5-haiku-20241022',
          maxTokens: 1000,
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('OKLCH(0.5, 0.1, 180)'),
            }),
          ]),
        })
      );
    });

    it('should include context in prompt when provided', async () => {
      const mockClient = {
        generateText: vi.fn().mockResolvedValue(
          JSON.stringify({
            reasoning: 'Test reasoning',
            emotionalImpact: 'Test impact',
            culturalContext: 'Test context',
            accessibilityNotes: 'Test accessibility',
            usageGuidance: 'Test guidance',
          })
        ),
      };

      vi.spyOn(ClaudeClient, 'getClaudeClient').mockReturnValue(
        mockClient as ClaudeClient.ClaudeClient
      );

      const oklch: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      await generateColorIntelligence(
        oklch,
        { token: 'primary', name: 'Brand Blue' },
        'test-api-key'
      );

      expect(mockClient.generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringMatching(/Semantic Role: primary.*Color Name: Brand Blue/s),
            }),
          ]),
        })
      );
    });

    it('should throw error for incomplete response', async () => {
      const mockClient = {
        generateText: vi.fn().mockResolvedValue(
          JSON.stringify({
            reasoning: 'Test reasoning',
            // Missing required fields
          })
        ),
      };

      vi.spyOn(ClaudeClient, 'getClaudeClient').mockReturnValue(
        mockClient as ClaudeClient.ClaudeClient
      );

      const oklch: OKLCH = { l: 0.5, c: 0.1, h: 180 };

      await expect(generateColorIntelligence(oklch, {}, 'test-api-key')).rejects.toThrow(
        'Intelligence generation failed: Incomplete intelligence response'
      );
    });
  });

  describe('calculateColorData', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call color-utils functions with correct parameters', () => {
      mockedColorUtils.generateHarmoniousPalette.mockReturnValue([{ l: 0.5, c: 0.1, h: 0 }]);
      mockedColorUtils.meetsWCAGStandard.mockReturnValue(true);
      mockedColorUtils.calculateWCAGContrast.mockReturnValue(4.5);
      mockedColorUtils.getColorTemperature.mockReturnValue('cool');
      mockedColorUtils.isLightColor.mockReturnValue(false);
      mockedColorUtils.generateColorName.mockReturnValue('Medium Blue');

      const oklch: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      const result = calculateColorData(oklch);

      expect(ColorUtils.generateHarmoniousPalette).toHaveBeenCalledWith(oklch, 'complementary', 1);
      expect(ColorUtils.meetsWCAGStandard).toHaveBeenCalled();
      expect(ColorUtils.calculateWCAGContrast).toHaveBeenCalled();
      expect(ColorUtils.getColorTemperature).toHaveBeenCalledWith(oklch);
      expect(ColorUtils.isLightColor).toHaveBeenCalledWith(oklch);
      expect(ColorUtils.generateColorName).toHaveBeenCalledWith(oklch);

      expect(result).toHaveProperty('harmonies');
      expect(result).toHaveProperty('accessibility');
      expect(result).toHaveProperty('analysis');
    });

    it('should return structured color data', () => {
      mockedColorUtils.generateHarmoniousPalette.mockReturnValue([{ l: 0.5, c: 0.1, h: 0 }]);
      mockedColorUtils.meetsWCAGStandard.mockReturnValue(true);
      mockedColorUtils.calculateWCAGContrast.mockReturnValue(4.5);
      mockedColorUtils.getColorTemperature.mockReturnValue('cool');
      mockedColorUtils.isLightColor.mockReturnValue(false);
      mockedColorUtils.generateColorName.mockReturnValue('Medium Blue');

      const oklch: OKLCH = { l: 0.5, c: 0.1, h: 180 };
      const result = calculateColorData(oklch);

      expect(result.harmonies).toHaveProperty('complementary');
      expect(result.harmonies).toHaveProperty('triadic');
      expect(result.harmonies).toHaveProperty('analogous');
      expect(result.harmonies).toHaveProperty('tetradic');
      expect(result.harmonies).toHaveProperty('monochromatic');

      expect(result.accessibility).toHaveProperty('onWhite');
      expect(result.accessibility).toHaveProperty('onBlack');

      expect(result.analysis).toHaveProperty('temperature');
      expect(result.analysis).toHaveProperty('isLight');
      expect(result.analysis).toHaveProperty('name');
    });
  });
});
