/**
 * Integration tests for project root discovery
 *
 * Tests the walk-up-directory logic that finds .rafters/config.rafters.json
 * from nested subdirectories.
 */

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupFixture } from '../fixtures/projects.js';
import { discoverProjectRoot } from '../../src/utils/discover.js';
import { createInitializedFixture, writeFixtureFile } from './helpers.js';

let fixturePath = '';

afterEach(async () => {
  if (fixturePath) {
    await cleanupFixture(fixturePath);
    fixturePath = '';
  }
});

describe('discoverProjectRoot', () => {
  it('finds project root from the root directory itself', async () => {
    fixturePath = await createInitializedFixture();

    const result = discoverProjectRoot(fixturePath);
    expect(result).toBe(fixturePath);
  }, 30000);

  it('finds project root from a nested subdirectory', async () => {
    fixturePath = await createInitializedFixture();

    // Create nested directory structure
    const nestedDir = join(fixturePath, 'src', 'components', 'ui');
    await mkdir(nestedDir, { recursive: true });

    const result = discoverProjectRoot(nestedDir);
    expect(result).toBe(fixturePath);
  }, 30000);

  it('finds project root from a deeply nested path', async () => {
    fixturePath = await createInitializedFixture();

    const deepDir = join(fixturePath, 'src', 'app', 'dashboard', 'settings', 'profile');
    await mkdir(deepDir, { recursive: true });

    const result = discoverProjectRoot(deepDir);
    expect(result).toBe(fixturePath);
  }, 30000);

  it('returns null when no project root exists', async () => {
    const { tmpdir } = await import('node:os');
    const { randomBytes } = await import('node:crypto');
    const nonProjectDir = join(tmpdir(), `no-rafters-${randomBytes(4).toString('hex')}`);
    await mkdir(nonProjectDir, { recursive: true });

    const result = discoverProjectRoot(nonProjectDir);
    expect(result).toBeNull();

    // Cleanup
    const { rm } = await import('node:fs/promises');
    await rm(nonProjectDir, { recursive: true, force: true });
  });

  it('does not traverse into sibling directories', async () => {
    fixturePath = await createInitializedFixture();

    // Create a sibling directory without .rafters
    const { tmpdir } = await import('node:os');
    const { randomBytes } = await import('node:crypto');
    const siblingDir = join(tmpdir(), `sibling-${randomBytes(4).toString('hex')}`);
    await mkdir(siblingDir, { recursive: true });

    const result = discoverProjectRoot(siblingDir);
    expect(result).toBeNull();

    const { rm } = await import('node:fs/promises');
    await rm(siblingDir, { recursive: true, force: true });
  });
});
