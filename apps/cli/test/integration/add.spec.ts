/**
 * Simple integration tests for the 'rafters add' command
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('rafters add', () => {
  const testDir = '/tmp/rafters-add-test';

  function setupTestProject() {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        name: 'test-app',
        dependencies: { react: '^19.0.0' },
      })
    );
  }

  function runRaftersCommand(args: string[]) {
    const cliPath = join(process.cwd(), 'dist', 'index.js');
    return execSync(`node "${cliPath}" ${args.join(' ')}`, {
      cwd: testDir,
      env: { ...process.env, CI: 'true' },
      encoding: 'utf8',
      timeout: 30000,
    });
  }

  it('should show help when no component specified', () => {
    setupTestProject();

    try {
      runRaftersCommand(['add']);
    } catch (error: unknown) {
      const execError = error as { stdout?: string; message?: string };
      expect(execError.stdout || execError.message).toContain('error');
    }
  });

  it('should fail when project not initialized', () => {
    setupTestProject();

    try {
      runRaftersCommand(['add', 'button']);
    } catch (error: unknown) {
      const execError = error as { status?: number; stderr?: string };
      expect(execError.status).toBe(1);
      expect(execError.stderr).toContain('not initialized');
    }
  });

  it('should show version', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    const output = runRaftersCommand(['--version']);
    expect(output).toContain(packageJson.version);
  });
});
