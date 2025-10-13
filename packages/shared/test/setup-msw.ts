/**
 * MSW Test Setup
 * Configure Mock Service Worker for integration tests
 */

import { setupServer } from 'msw/node';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { handlers } from './msw-handlers.js';

/**
 * Create MSW server instance with default handlers
 */
export const server = setupServer(...handlers);

/**
 * Setup MSW for all integration tests
 * Import this file in test setup to enable MSW globally
 */
beforeAll(() => {
  // Start MSW server before tests begin
  server.listen({
    onUnhandledRequest: 'warn', // Warn about unhandled requests during development
  });
});

afterEach(() => {
  // Reset handlers after each test to ensure test isolation
  server.resetHandlers();
});

afterAll(() => {
  // Clean up and close server after all tests complete
  server.close();
});
