/**
 * API Integration Test Setup for Cloudflare Workers
 *
 * This setup file configures the testing environment for Cloudflare Workers
 * runtime integration tests using @cloudflare/vitest-pool-workers
 */

import { afterEach, beforeAll, vi } from 'vitest';

beforeAll(() => {
  // Mock Claude API for testing
  vi.mock('@anthropic-ai/sdk', () => ({
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ text: 'Mock Claude response' }],
          usage: { input_tokens: 10, output_tokens: 20 },
        }),
      },
    })),
    Anthropic: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ text: 'Mock Claude response' }],
          usage: { input_tokens: 10, output_tokens: 20 },
        }),
      },
    })),
  }));

  // Mock environment variables
  process.env.CLAUDE_API_KEY = 'test-api-key';
  process.env.ENVIRONMENT = 'test';
});

afterEach(() => {
  vi.clearAllMocks();
});

console.log('🧪 API Integration Test Environment Initialized');
console.log('☁️ Cloudflare Workers runtime ready');
console.log('🤖 Claude API mocked for testing');
