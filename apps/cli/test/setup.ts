/**
 * Test setup for CLI package
 */

import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  // Reset any global state between tests
  // Mock console methods to reduce noise in test output
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
