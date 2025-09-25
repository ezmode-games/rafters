/**
 * Integration tests for CLI commands
 */

import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ensureDirSync, existsSync, removeSync, writeJsonSync } from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CLI_PATH = resolve(__dirname, '../../dist/bin.js');

describe('CLI Integration', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    testDir = join(tmpdir(), `rafters-integration-test-${Date.now()}`);
    ensureDirSync(testDir);
    process.chdir(testDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    if (existsSync(testDir)) {
      removeSync(testDir);
    }
  });

  it('should show version when --version flag is used', () => {
    const output = execSync(`node "${CLI_PATH}" --version`, { encoding: 'utf-8' });
    expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should show help when --help flag is used', () => {
    const output = execSync(`node "${CLI_PATH}" --help`, { encoding: 'utf-8' });
    expect(output).toContain('rafters');
    expect(output).toContain('AI-first CLI for Rafters design system');
    expect(output).toContain('Commands:');
    expect(output).toContain('init');
    expect(output).toContain('add');
    expect(output).toContain('list');
    expect(output).toContain('clean');
  });

  it('should fail init without package.json', () => {
    expect(() => {
      execSync(`node "${CLI_PATH}" init --yes`, { encoding: 'utf-8', stdio: 'pipe' });
    }).toThrow();
  });

  it('should fail init without React dependency', () => {
    writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {},
    });

    expect(() => {
      execSync(`node "${CLI_PATH}" init --yes`, { encoding: 'utf-8', stdio: 'pipe' });
    }).toThrow();
  });

  it('should initialize successfully with valid React project', () => {
    writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {
        react: '^19.0.0',
      },
    });

    // This should not throw
    const output = execSync(`node "${CLI_PATH}" init --yes`, { encoding: 'utf-8', stdio: 'pipe' });

    // Verify output contains success indicators
    expect(output).toContain('Rafters initialized');

    // Verify files were created
    expect(existsSync(join(testDir, '.rafters'))).toBe(true);
    expect(existsSync(join(testDir, '.rafters/config.json'))).toBe(true);
    expect(existsSync(join(testDir, 'src/components/ui'))).toBe(true);
    expect(existsSync(join(testDir, 'src/lib/utils.ts'))).toBe(true);
  });

  // NOTE: Removed integration test for 'list' command as it hits external registry API
  // The functionality is covered by unit tests in test/commands/list.test.ts

  it('should clean up rafters configuration', () => {
    writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-project',
      dependencies: {
        react: '^19.0.0',
      },
    });

    // Initialize first
    execSync(`node "${CLI_PATH}" init --yes`, { encoding: 'utf-8', stdio: 'pipe' });
    expect(existsSync(join(testDir, '.rafters'))).toBe(true);

    // Then clean
    execSync(`node "${CLI_PATH}" clean --force`, { encoding: 'utf-8' });
    expect(existsSync(join(testDir, '.rafters'))).toBe(false);
  });
});
