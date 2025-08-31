/**
 * Simple integration tests for the 'rafters add' command
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ensureCLIBuilt, runCLI } from '../helpers/cliRunner';
import type { TestFixtureInfo } from '../helpers/testApp';
import { createTempTestApp } from '../helpers/testApp';

describe('rafters add', () => {
  let testApp: TestFixtureInfo;

  beforeEach(async () => {
    await ensureCLIBuilt();
    testApp = await createTempTestApp('empty-project');
  });

  afterEach(async () => {
    await testApp.cleanup();
  });

  it('should show help when no component specified', async () => {
    const result = await runCLI(['add'], testApp.path);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('error');
  });

  it('should fail when project not initialized', async () => {
    const result = await runCLI(['add', 'button'], testApp.path);
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('not initialized');
  });

  it('should show version', async () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    const result = await runCLI(['--version'], testApp.path);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(packageJson.version);
  });
});
