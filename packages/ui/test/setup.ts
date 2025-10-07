/**
 * Vitest test setup for @rafters/ui
 * Configures jsdom environment for Web Components testing
 */

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};
