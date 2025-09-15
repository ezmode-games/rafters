/**
 * Unit tests for init command
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock type for Commander.js Command
interface MockCommand {
  name: ReturnType<typeof vi.fn>;
  description: ReturnType<typeof vi.fn>;
  option: ReturnType<typeof vi.fn>;
  action: ReturnType<typeof vi.fn>;
}

describe('init command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export init command function', async () => {
    const { initCommand } = await import('@/commands/init');
    expect(typeof initCommand).toBe('function');
  });

  it('should have proper command configuration', async () => {
    const { initCommand } = await import('@/commands/init');

    // Mock commander.js Command
    const mockCommand: MockCommand = {
      name: vi.fn().mockReturnThis(),
      description: vi.fn().mockReturnThis(),
      option: vi.fn().mockReturnThis(),
      action: vi.fn().mockReturnThis(),
    };

    initCommand(mockCommand);

    expect(mockCommand.name).toHaveBeenCalledWith('init');
    expect(mockCommand.description).toHaveBeenCalled();
  });
});
