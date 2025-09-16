/**
 * Color Intelligence Utils Unit Tests
 * Tests individual functions with spyOn mocking
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as colorIntelUtils from '@/lib/color-intel/utils';

describe('Color Intelligence Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('generateColorIntelligence returns proper structure', async () => {
    const mockAi = {
      run: vi.fn().mockResolvedValue({
        response: JSON.stringify({
          suggestedName: 'Ocean Blue',
          reasoning: 'Cool blue with medium saturation',
          emotionalImpact: 'Calming and trustworthy',
          culturalContext: 'Associated with water and sky',
          accessibilityNotes: 'Good contrast on light backgrounds',
          usageGuidance: 'Excellent for primary actions',
        }),
      }),
    } as unknown as Ai;

    const result = await colorIntelUtils.generateColorIntelligence(
      { l: 0.5, c: 0.1, h: 240 },
      { token: 'primary' },
      'test-api-key',
      'https://gateway.example.com',
      'cf-token',
      { weight: 0.6, density: 'medium' },
      mockAi
    );

    expect(result.suggestedName).toBe('Ocean Blue');
    expect(result.reasoning).toBe('Cool blue with medium saturation');
    expect(result.emotionalImpact).toBe('Calming and trustworthy');
    expect(mockAi.run).toHaveBeenCalledWith(
      '@cf/meta/llama-4-scout-17b-16e-instruct',
      expect.objectContaining({
        messages: expect.any(Array),
        max_tokens: 800,
        temperature: 0.7,
      }),
      expect.any(Object)
    );
  });

  test('generateColorIntelligence throws on AI binding errors', async () => {
    const mockAi = {
      run: vi.fn().mockRejectedValue(new Error('AI binding failed')),
    } as unknown as Ai;

    await expect(
      colorIntelUtils.generateColorIntelligence(
        { l: 0.5, c: 0.1, h: 240 },
        { token: 'primary' },
        'test-api-key',
        'https://gateway.example.com',
        'cf-token',
        { weight: 0.6, density: 'medium' },
        mockAi
      )
    ).rejects.toThrow('AI binding failed');
  });

  test('generateColorIntelligence throws on invalid JSON response', async () => {
    const mockAi = {
      run: vi.fn().mockResolvedValue({
        response: 'invalid json response',
      }),
    } as unknown as Ai;

    await expect(
      colorIntelUtils.generateColorIntelligence(
        { l: 0.8, c: 0.05, h: 60 },
        {},
        'test-api-key',
        'https://gateway.example.com',
        'cf-token',
        { weight: 0.3, density: 'light' },
        mockAi
      )
    ).rejects.toThrow('Invalid AI response format');
  });
});
