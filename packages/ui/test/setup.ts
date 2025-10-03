/**
 * Vitest test setup for @rafters/ui
 * Configures jsdom environment for Web Components testing
 */

import { vi } from 'vitest';

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};
