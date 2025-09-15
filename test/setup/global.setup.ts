/**
 * Global Test Setup Configuration
 *
 * Establishes shared testing infrastructure across the entire monorepo:
 * - Global mocks and polyfills
 * - Test environment validation
 * - Performance monitoring
 * - Future-ready extensibility hooks
 */

import { afterAll, beforeAll, vi } from 'vitest';

// ========================================
// GLOBAL TEST ENVIRONMENT SETUP
// ========================================

beforeAll(async () => {
  // Validate Node.js version for test compatibility
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

  if (majorVersion < 20) {
    throw new Error(`Node.js 20+ required for testing. Current: ${nodeVersion}`);
  }

  // Set up global test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TZ = 'UTC'; // Consistent timezone for all tests

  // Mock console methods in CI to reduce noise
  if (process.env.CI) {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  }

  // Performance monitoring setup
  global.__TEST_START_TIME__ = Date.now();
});

afterAll(async () => {
  // Performance reporting
  if (global.__TEST_START_TIME__) {
    const duration = Date.now() - global.__TEST_START_TIME__;
    console.log(`\n⚡ Total test execution time: ${duration}ms`);
  }

  // Clean up global mocks
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

// ========================================
// GLOBAL MOCKS
// ========================================

// Mock crypto.randomUUID for deterministic tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
  },
});

// Mock fetch for Node.js environments that don't have it
if (!global.fetch) {
  global.fetch = vi.fn();
}

// Mock performance API for consistent timing
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => 1000),
  },
});

// ========================================
// REACT 19 TEST COMPATIBILITY
// ========================================

// Mock React 19 concurrent features for older test environments
if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    port1 = { postMessage: vi.fn(), addEventListener: vi.fn() };
    port2 = { postMessage: vi.fn(), addEventListener: vi.fn() };
  };
}

// ========================================
// CLOUDFLARE WORKERS COMPATIBILITY
// ========================================

// Polyfill Workers-specific globals for unit tests
if (typeof global.btoa === 'undefined') {
  global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
}

if (typeof global.atob === 'undefined') {
  global.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
}

// Mock Cloudflare KV for unit tests
global.mockKV = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  list: vi.fn(),
};

// ========================================
// ANTHROPIC API MOCKING
// ========================================

// Global Anthropic API mock for consistent testing
global.mockAnthropic = {
  messages: {
    create: vi.fn().mockResolvedValue({
      content: [{ text: 'Mock AI response' }],
      usage: { input_tokens: 10, output_tokens: 20 },
    }),
  },
};

// ========================================
// ASSERTION EXTENSIONS
// ========================================

// Extend Vitest with custom matchers for our domain
interface CustomMatchers<R = unknown> {
  toBeValidRaftersToken(): R;
  toHaveValidColorSpace(): R;
  toMatchDesignSystemPattern(): R;
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

// ========================================
// FUTURE-READY PATTERNS
// ========================================

// AI-driven test generation hooks (for future implementation)
global.__AI_TEST_INSIGHTS__ = {
  recordTestPattern: (_pattern: string, _success: boolean) => {
    // Future: Send to AI service for test improvement insights
  },
  suggestTestCases: (_component: string) => {
    // Future: AI-generated test case suggestions
    return [];
  },
};

// Distributed testing coordination (for future scaling)
global.__DISTRIBUTED_TEST_COORDINATION__ = {
  reportTestResult: (_testId: string, _result: unknown) => {
    // Future: Report to central test coordination system
  },
  getTestShardingStrategy: () => {
    // Future: AI-optimized test sharding
    return { shardId: 1, totalShards: 1 };
  },
};

// Performance budget monitoring
global.__PERFORMANCE_BUDGETS__ = {
  testExecutionTime: 30000, // 30s max per test
  memoryUsage: 512 * 1024 * 1024, // 512MB max
  coverageThreshold: 80, // 80% minimum coverage
};
