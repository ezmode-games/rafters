/**
 * Test setup for website package
 * Configures Node environment for API and utility testing
 */

import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  // Reset any global state between tests
  vi.clearAllMocks();

  // Mock console methods to reduce noise in test output
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Cloudflare environment for integration tests
declare global {
  interface CloudflareEnv {
    RAFTERS_INTEL: KVNamespace;
    RAFTERS_CACHE: KVNamespace;
    CLAUDE_API_KEY: string;
  }
}

// Export test utilities
export const createMockKV = (): KVNamespace =>
  ({
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    getWithMetadata: vi.fn(),
  }) as unknown as KVNamespace;

export const createMockEnv = (): CloudflareEnv => ({
  RAFTERS_INTEL: createMockKV(),
  RAFTERS_CACHE: createMockKV(),
  CLAUDE_API_KEY: 'test-api-key',
});
