/**
 * Unit Tests for Color Intelligence Utils
 *
 * Tests core color intelligence generation functions in isolation
 * with mocked dependencies for fast, reliable unit testing.
 */

import type { ColorContext } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { generateCacheKey, generateColorIntelligence } from '@/lib/color-intel/utils';

// Mock color-utils roundOKLCH function
vi.mock('@rafters/color-utils', () => ({
  roundOKLCH: vi.fn((oklch: OKLCH) => ({
    l: Math.round(oklch.l * 100) / 100,
    c: Math.round(oklch.c * 100) / 100,
    h: Math.round(oklch.h * 10) / 10,
    alpha: oklch.alpha || 1,
  })),
}));

describe('Color Intelligence Utils - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateCacheKey', () => {
    test('generates consistent cache key from OKLCH values', () => {
      const oklch: OKLCH = { l: 0.65, c: 0.12, h: 240 };
      const key = generateCacheKey(oklch);

      expect(key).toBe('color-intel:0.65-0.12-240');
      expect(typeof key).toBe('string');
    });

    test('handles rounded values consistently', () => {
      const oklch1: OKLCH = { l: 0.6543, c: 0.1234, h: 240.567 };
      const oklch2: OKLCH = { l: 0.6543, c: 0.1234, h: 240.567 };

      const key1 = generateCacheKey(oklch1);
      const key2 = generateCacheKey(oklch2);

      expect(key1).toBe(key2);
      expect(key1).toBe('color-intel:0.65-0.12-240.6');
    });

    test('produces different keys for different colors', () => {
      const red: OKLCH = { l: 0.63, c: 0.22, h: 27 };
      const blue: OKLCH = { l: 0.65, c: 0.12, h: 240 };

      const redKey = generateCacheKey(red);
      const blueKey = generateCacheKey(blue);

      expect(redKey).not.toBe(blueKey);
      expect(redKey).toBe('color-intel:0.63-0.22-27');
      expect(blueKey).toBe('color-intel:0.65-0.12-240');
    });

    test('handles edge case values', () => {
      const edgeCase: OKLCH = { l: 0, c: 0, h: 0 };
      const key = generateCacheKey(edgeCase);

      expect(key).toBe('color-intel:0-0-0');
    });

    test('handles maximum values', () => {
      const maxCase: OKLCH = { l: 1, c: 0.5, h: 360 };
      const key = generateCacheKey(maxCase);

      expect(key).toBe('color-intel:1-0.5-360');
    });
  });

  describe('generateColorIntelligence', () => {
    const mockAI = {
      run: vi.fn(),
    } as unknown as Ai;

    const validOklch: OKLCH = { l: 0.65, c: 0.12, h: 240 };
    const context: ColorContext = { token: 'primary', name: 'ocean-blue' };
    const perceptualWeight = { weight: 0.75, density: 'medium' as const };

    beforeEach(() => {
      vi.mocked(mockAI.run).mockResolvedValue({
        response: JSON.stringify({
          suggestedName: 'Ocean Depth',
          reasoning:
            'This OKLCH combination creates a sophisticated blue that balances trust and professionalism.',
          emotionalImpact:
            'Evokes feelings of calm, trust, and reliability while maintaining professional authority.',
          culturalContext: 'Blue universally represents trust and stability across most cultures.',
          accessibilityNotes:
            'Provides good contrast on white backgrounds with minimum 4.5:1 ratio for WCAG AA compliance.',
          usageGuidance:
            'Ideal for primary actions, navigation elements, and trust-building interfaces.',
          balancingGuidance:
            'Use 25-30% coverage for balanced visual weight in medium density layouts.',
        }),
      });
    });

    test('successfully generates color intelligence with AI binding', async () => {
      const result = await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        perceptualWeight,
        mockAI
      );

      expect(result).toEqual({
        suggestedName: 'Ocean Depth',
        reasoning:
          'This OKLCH combination creates a sophisticated blue that balances trust and professionalism.',
        emotionalImpact:
          'Evokes feelings of calm, trust, and reliability while maintaining professional authority.',
        culturalContext: 'Blue universally represents trust and stability across most cultures.',
        accessibilityNotes:
          'Provides good contrast on white backgrounds with minimum 4.5:1 ratio for WCAG AA compliance.',
        usageGuidance:
          'Ideal for primary actions, navigation elements, and trust-building interfaces.',
        balancingGuidance:
          'Use 25-30% coverage for balanced visual weight in medium density layouts.',
      });
    });

    test('calls Workers AI with correct parameters', async () => {
      await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        perceptualWeight,
        mockAI
      );

      expect(mockAI.run).toHaveBeenCalledWith(
        '@cf/meta/llama-4-scout-17b-16e-instruct',
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('color theory expert'),
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('OKLCH(0.65, 0.12, 240)'),
            }),
          ]),
          max_tokens: 800,
          temperature: 0.7,
        }),
        expect.objectContaining({
          gateway: {
            id: 'colors',
            cacheTtl: 3600,
            collectLogs: false,
          },
        })
      );
    });

    test('includes semantic context in AI prompt', async () => {
      await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        perceptualWeight,
        mockAI
      );

      const aiCall = vi.mocked(mockAI.run).mock.calls[0];
      const userMessage = aiCall[1].messages[1].content;

      expect(userMessage).toContain('Semantic Role: primary');
      expect(userMessage).toContain('Color Name: ocean-blue');
      expect(userMessage).toContain('Perceptual Weight: 0.75 (medium)');
    });

    test('handles context without optional fields', async () => {
      const minimalContext: ColorContext = {};

      await generateColorIntelligence(
        validOklch,
        minimalContext,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        undefined,
        mockAI
      );

      const aiCall = vi.mocked(mockAI.run).mock.calls[0];
      const userMessage = aiCall[1].messages[1].content;

      expect(userMessage).not.toContain('Semantic Role:');
      expect(userMessage).not.toContain('Color Name:');
      expect(userMessage).not.toContain('Perceptual Weight:');
    });

    test('throws error when AI binding is missing', async () => {
      await expect(
        generateColorIntelligence(
          validOklch,
          context,
          'test-api-key',
          'https://gateway.example.com',
          'test-cf-token',
          perceptualWeight,
          undefined
        )
      ).rejects.toThrow('AI binding required for color intelligence generation');
    });

    test('handles malformed AI response gracefully', async () => {
      vi.mocked(mockAI.run).mockResolvedValue({
        response: 'Invalid JSON response',
      });

      await expect(
        generateColorIntelligence(
          validOklch,
          context,
          'test-api-key',
          'https://gateway.example.com',
          'test-cf-token',
          perceptualWeight,
          mockAI
        )
      ).rejects.toThrow('Invalid AI response format');
    });

    test('extracts JSON from mixed response content', async () => {
      vi.mocked(mockAI.run).mockResolvedValue({
        response: `Here is the analysis:

        {
          "suggestedName": "Deep Ocean",
          "reasoning": "Test reasoning",
          "emotionalImpact": "Test impact",
          "culturalContext": "Test context",
          "accessibilityNotes": "Test accessibility",
          "usageGuidance": "Test usage"
        }

        This completes the analysis.`,
      });

      const result = await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        perceptualWeight,
        mockAI
      );

      expect(result.suggestedName).toBe('Deep Ocean');
      expect(result.reasoning).toBe('Test reasoning');
    });

    test('provides fallback values for missing AI response fields', async () => {
      vi.mocked(mockAI.run).mockResolvedValue({
        response: JSON.stringify({
          suggestedName: 'Test Color',
          // Missing other required fields
        }),
      });

      const result = await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        perceptualWeight,
        mockAI
      );

      expect(result.suggestedName).toBe('Test Color');
      expect(result.reasoning).toBe('No reasoning provided');
      expect(result.emotionalImpact).toBe('No emotional impact analysis');
      expect(result.culturalContext).toBe('No cultural context provided');
      expect(result.accessibilityNotes).toBe('No accessibility notes');
      expect(result.usageGuidance).toBe('No usage guidance provided');
      expect(result.balancingGuidance).toBeUndefined();
    });

    test('handles AI errors gracefully', async () => {
      vi.mocked(mockAI.run).mockRejectedValue(new Error('AI service unavailable'));

      await expect(
        generateColorIntelligence(
          validOklch,
          context,
          'test-api-key',
          'https://gateway.example.com',
          'test-cf-token',
          perceptualWeight,
          mockAI
        )
      ).rejects.toThrow('AI service unavailable');
    });

    test('includes balancing guidance when perceptual weight provided', async () => {
      await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        perceptualWeight,
        mockAI
      );

      const aiCall = vi.mocked(mockAI.run).mock.calls[0];
      const userMessage = aiCall[1].messages[1].content;

      expect(userMessage).toContain('"balancingGuidance"');
      expect(userMessage).toContain('perceptual weight 0.75 (medium density)');
    });

    test('excludes balancing guidance when perceptual weight not provided', async () => {
      await generateColorIntelligence(
        validOklch,
        context,
        'test-api-key',
        'https://gateway.example.com',
        'test-cf-token',
        undefined,
        mockAI
      );

      const aiCall = vi.mocked(mockAI.run).mock.calls[0];
      const userMessage = aiCall[1].messages[1].content;

      expect(userMessage).not.toContain('"balancingGuidance"');
    });
  });
});
