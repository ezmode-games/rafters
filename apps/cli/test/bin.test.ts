/**
 * Unit tests for CLI bin entry point
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CLI bin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export main CLI function', async () => {
    const { main } = await import('@/bin');
    expect(typeof main).toBe('function');
  });

  it('should handle empty arguments gracefully', async () => {
    const { main } = await import('@/bin');

    // Mock process.argv to simulate no arguments
    const originalArgv = process.argv;
    process.argv = ['node', 'rafters'];

    try {
      await expect(main()).resolves.not.toThrow();
    } finally {
      process.argv = originalArgv;
    }
  });
});
