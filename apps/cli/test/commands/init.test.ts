/**
 * Test suite for init command
 */

import { realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureDirSync, existsSync, removeSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initCommand } from '../../src/commands/init.js';
import {
  REGISTRY_FIXTURES,
  validateAgentInstructions,
  validateUtilsTemplate,
} from '../fixtures/registry-responses.js';

// Mock external dependencies
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
  })),
}));

// Mock fetch with registry fixtures
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('init command', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-test-${Date.now()}`);
    ensureDirSync(testDir);
    testDir = realpathSync(testDir);

    // Mock console methods to avoid output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Setup fetch mocks with fixtures
    mockFetch.mockReset();
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/templates/agent-instructions')) {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(validateAgentInstructions(REGISTRY_FIXTURES.agentInstructions)),
        });
      }
      if (url.includes('/templates/utils')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(validateUtilsTemplate(REGISTRY_FIXTURES.utilsTemplate)),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    });

    // Change to test directory
    process.chdir(testDir);
  });

  afterEach(() => {
    // Restore original directory
    process.chdir(originalCwd);

    // Clean up test directory
    if (existsSync(testDir)) {
      removeSync(testDir);
    }

    vi.restoreAllMocks();
  });

  it('should require package.json to exist', async () => {
    // Test without package.json - should exit with error
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exit called');
    });

    await expect(initCommand()).rejects.toThrow('Process exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should require React dependency', async () => {
    // Create package.json without React
    const fs = await import('fs-extra');
    fs.writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {},
    });

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exit called');
    });

    await expect(initCommand()).rejects.toThrow('Process exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should detect existing rafters configuration', async () => {
    const fs = await import('fs-extra');

    // Create valid package.json with React
    fs.writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {
        react: '^19.0.0',
      },
    });

    // Create existing .rafters directory with config file
    fs.ensureDirSync(join(testDir, '.rafters'));
    fs.writeJsonSync(join(testDir, '.rafters/config.json'), {
      version: '1.0.0',
      componentsDir: './src/components/ui',
      packageManager: 'pnpm',
      registry: 'https://rafters.realhandy.tech/registry',
    });

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process exit called');
    });

    await expect(initCommand()).rejects.toThrow('Process exit called');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should initialize successfully with defaults in non-interactive mode', async () => {
    const fs = await import('fs-extra');

    // Create valid package.json with React
    fs.writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {
        react: '^19.0.0',
      },
    });

    // Run init with --yes flag
    await expect(initCommand({ yes: true })).resolves.not.toThrow();

    // Verify .rafters directory was created
    expect(existsSync(join(testDir, '.rafters'))).toBe(true);
    expect(existsSync(join(testDir, '.rafters/config.json'))).toBe(true);
    expect(existsSync(join(testDir, '.rafters/component-manifest.json'))).toBe(true);
    expect(existsSync(join(testDir, '.rafters/agent-instructions.md'))).toBe(true);
  }, 15000);

  it('should create necessary directories and files', async () => {
    const fs = await import('fs-extra');

    // Create valid package.json with React
    fs.writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {
        react: '^19.0.0',
      },
    });

    await initCommand({ yes: true });

    // Check directory structure
    expect(existsSync(join(testDir, '.rafters'))).toBe(true);
    expect(existsSync(join(testDir, 'src/components/ui'))).toBe(true);
    expect(existsSync(join(testDir, 'src/lib'))).toBe(true);
    expect(existsSync(join(testDir, 'src/lib/utils.ts'))).toBe(true);

    // Check config file
    const config = fs.readJsonSync(join(testDir, '.rafters/config.json'));
    expect(config).toHaveProperty('version');
    expect(config).toHaveProperty('componentsDir');
    expect(config).toHaveProperty('registry');
  }, 15000);
});
