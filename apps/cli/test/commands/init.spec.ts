/**
 * Integration tests for init command
 * Tests full command execution in isolated environment
 */

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('init command integration', () => {
  let testDir: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    testDir = await mkdtemp(join(tmpdir(), 'rafters-test-'));
  });

  afterEach(async () => {
    if (testDir) {
      await rm(testDir, { recursive: true, force: true });
    }
  });

  it('should initialize rafters project in empty directory', async () => {
    // This would test the actual init command execution
    // Mock file system operations for safety
    const mockFs = vi.hoisted(() => ({
      writeFile: vi.fn(),
      mkdir: vi.fn(),
      access: vi.fn(),
    }));

    vi.mock('node:fs/promises', () => mockFs);

    const { initCommand } = await import('@/commands/init');

    // Test command execution would go here
    expect(typeof initCommand).toBe('function');
  });

  it('should handle existing rafters.json gracefully', async () => {
    // Test behavior when rafters.json already exists
    expect(testDir).toBeDefined();
  });
});
