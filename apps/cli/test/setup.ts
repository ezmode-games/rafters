/**
 * Test setup configuration for Rafters CLI
 */

import { beforeEach, vi } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.CI = 'true';

// Mock console methods during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Mock process.exit to prevent tests from actually exiting
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

beforeEach(() => {
  // Reset console mocks before each test
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;

  // Reset process.exit mock
  mockExit.mockClear();
});

// Make console methods available for tests that need them
export const mockConsole = {
  log: originalConsoleLog,
  error: originalConsoleError,
  warn: originalConsoleWarn,
};

export { mockExit };
