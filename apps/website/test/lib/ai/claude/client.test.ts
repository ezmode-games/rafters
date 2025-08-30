import Anthropic from '@anthropic-ai/sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClaudeClient, getClaudeClient } from '../../../../src/lib/ai/claude/client';

interface MockAnthropicInstance {
  messages: {
    create: ReturnType<typeof vi.fn>;
  };
}

class MockAnthropic {
  messages = {
    create: vi.fn(),
  };
}

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => new MockAnthropic({})),
}));

const MockedAnthropic = vi.mocked(Anthropic);

describe('ClaudeClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ClaudeClient class', () => {
    it('should initialize with API key', () => {
      const apiKey = 'test-api-key';
      new ClaudeClient({ apiKey });

      expect(MockedAnthropic).toHaveBeenCalledWith({
        apiKey: apiKey,
      });
    });

    it('should generate text successfully', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Generated response' }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      MockedAnthropic.mockImplementation(
        () =>
          ({
            messages: { create: mockCreate },
          }) as MockAnthropicInstance
      );

      const client = new ClaudeClient({ apiKey: 'test-api-key' });
      const result = await client.generateText({
        model: 'claude-3-5-haiku-20241022',
        maxTokens: 100,
        messages: [{ role: 'user', content: 'Test message' }],
      });

      expect(result).toBe('Generated response');
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Test message' }],
      });
    });

    it('should handle non-text response type', async () => {
      const mockResponse = {
        content: [{ type: 'image', data: 'base64data' }],
      };

      const mockCreate = vi.fn().mockResolvedValue(mockResponse);
      MockedAnthropic.mockImplementation(
        () =>
          ({
            messages: { create: mockCreate },
          }) as MockAnthropicInstance
      );

      const client = new ClaudeClient({ apiKey: 'test-api-key' });

      await expect(
        client.generateText({
          model: 'claude-3-5-haiku-20241022',
          maxTokens: 100,
          messages: [{ role: 'user', content: 'Test message' }],
        })
      ).rejects.toThrow('Unexpected response type from Claude API');
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API request failed');
      const mockCreate = vi.fn().mockRejectedValue(mockError);
      MockedAnthropic.mockImplementation(
        () =>
          ({
            messages: { create: mockCreate },
          }) as MockAnthropicInstance
      );

      const client = new ClaudeClient({ apiKey: 'test-api-key' });

      await expect(
        client.generateText({
          model: 'claude-3-5-haiku-20241022',
          maxTokens: 100,
          messages: [{ role: 'user', content: 'Test message' }],
        })
      ).rejects.toThrow('Claude API request failed: API request failed');
    });

    it('should handle unknown errors', async () => {
      const mockCreate = vi.fn().mockRejectedValue('string error');
      MockedAnthropic.mockImplementation(
        () =>
          ({
            messages: { create: mockCreate },
          }) as MockAnthropicInstance
      );

      const client = new ClaudeClient({ apiKey: 'test-api-key' });

      await expect(
        client.generateText({
          model: 'claude-3-5-haiku-20241022',
          maxTokens: 100,
          messages: [{ role: 'user', content: 'Test message' }],
        })
      ).rejects.toThrow('Claude API request failed: Unknown error');
    });
  });

  describe('getClaudeClient', () => {
    it('should create singleton instance', () => {
      const apiKey = 'test-api-key';
      const client1 = getClaudeClient(apiKey);
      const client2 = getClaudeClient(apiKey);

      expect(client1).toBe(client2);
    });

    it('should create different instances for different API keys', () => {
      // First call creates instance for key1
      const client1 = getClaudeClient('key1');
      // Second call creates different instance for key2
      const client2 = getClaudeClient('key2');

      expect(client1).not.toBe(client2); // Different instances for different keys
    });

    it('should reuse cached instance for same API key', () => {
      // First call creates instance for the key
      const client1 = getClaudeClient('same-key');
      // Second call reuses the cached instance
      const client2 = getClaudeClient('same-key');

      expect(client1).toBe(client2); // Same instance for same key
    });
  });
});
