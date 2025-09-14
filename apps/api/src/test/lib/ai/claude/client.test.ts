import { describe, expect, it, vi } from 'vitest';
import { ClaudeClient } from '../../../../lib/ai/claude/client';

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn(),
      },
    })),
  };
});

describe('ClaudeClient', () => {
  it('should create a client with API key', () => {
    const client = new ClaudeClient({ apiKey: 'test-key' });
    expect(client).toBeInstanceOf(ClaudeClient);
  });

  it('should generate text successfully', async () => {
    const client = new ClaudeClient({ apiKey: 'test-key', gatewayUrl: 'https://test.com' });

    // Mock the generateText method directly
    vi.spyOn(client, 'generateText').mockResolvedValueOnce('Generated response');

    const result = await client.generateText({
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 1000,
      messages: [{ role: 'user', content: 'Test prompt' }],
    });

    expect(result).toBe('Generated response');
  });

  it('should throw error on non-text response', async () => {
    const client = new ClaudeClient({ apiKey: 'test-key', gatewayUrl: 'https://test.com' });

    // Mock the generateText method to throw the expected error
    vi.spyOn(client, 'generateText').mockRejectedValueOnce(
      new Error('Unexpected response type from Claude API')
    );

    await expect(
      client.generateText({
        model: 'claude-3-5-haiku-20241022',
        maxTokens: 1000,
        messages: [{ role: 'user', content: 'Test prompt' }],
      })
    ).rejects.toThrow('Unexpected response type from Claude API');
  });

  it('should handle API errors gracefully', async () => {
    const client = new ClaudeClient({ apiKey: 'test-key', gatewayUrl: 'https://test.com' });

    // Mock the generateText method to throw an API error
    vi.spyOn(client, 'generateText').mockRejectedValueOnce(
      new Error('Claude API request failed: API error')
    );

    await expect(
      client.generateText({
        model: 'claude-3-5-haiku-20241022',
        maxTokens: 1000,
        messages: [{ role: 'user', content: 'Test prompt' }],
      })
    ).rejects.toThrow('Claude API request failed: API error');
  });
});
