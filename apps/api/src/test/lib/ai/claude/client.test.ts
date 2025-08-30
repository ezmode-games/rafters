import type { Mock } from 'vitest';
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
    const client = new ClaudeClient({ apiKey: 'test-key' });

    // Mock the Anthropic client's response
    const mockResponse = {
      content: [{ type: 'text', text: 'Generated response' }],
    };

    // Get the mocked Anthropic instance
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const mockAnthropicInstance = new Anthropic({ apiKey: 'test-key' });
    (mockAnthropicInstance.messages.create as Mock).mockResolvedValueOnce(mockResponse);

    // Override the client's internal client
    // @ts-expect-error - accessing private property for testing
    client.client = mockAnthropicInstance;

    const result = await client.generateText({
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 1000,
      messages: [{ role: 'user', content: 'Test prompt' }],
    });

    expect(result).toBe('Generated response');
  });

  it('should throw error on non-text response', async () => {
    const client = new ClaudeClient({ apiKey: 'test-key' });

    // Mock a non-text response
    const mockResponse = {
      content: [{ type: 'image', text: 'Not text' }],
    };

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const mockAnthropicInstance = new Anthropic({ apiKey: 'test-key' });
    (mockAnthropicInstance.messages.create as Mock).mockResolvedValueOnce(mockResponse);

    // @ts-expect-error - accessing private property for testing
    client.client = mockAnthropicInstance;

    await expect(
      client.generateText({
        model: 'claude-3-5-haiku-20241022',
        maxTokens: 1000,
        messages: [{ role: 'user', content: 'Test prompt' }],
      })
    ).rejects.toThrow('Unexpected response type from Claude API');
  });

  it('should handle API errors gracefully', async () => {
    const client = new ClaudeClient({ apiKey: 'test-key' });

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const mockAnthropicInstance = new Anthropic({ apiKey: 'test-key' });
    (mockAnthropicInstance.messages.create as Mock).mockRejectedValueOnce(new Error('API error'));

    // @ts-expect-error - accessing private property for testing
    client.client = mockAnthropicInstance;

    await expect(
      client.generateText({
        model: 'claude-3-5-haiku-20241022',
        maxTokens: 1000,
        messages: [{ role: 'user', content: 'Test prompt' }],
      })
    ).rejects.toThrow('Claude API request failed: API error');
  });
});
