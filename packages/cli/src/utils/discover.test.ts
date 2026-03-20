import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { discoverProjectRoot } from './discover.js';

const TEST_DIR = join(import.meta.dirname, '__test-discover__');
const PROJECT_DIR = join(TEST_DIR, 'my-project');
const NESTED_DIR = join(PROJECT_DIR, 'src', 'components', 'ui');
const RAFTERS_DIR = join(PROJECT_DIR, '.rafters');
const EMPTY_DIR = join(TEST_DIR, 'empty');

describe('discoverProjectRoot', () => {
  beforeAll(() => {
    // Create test directory structure
    mkdirSync(NESTED_DIR, { recursive: true });
    mkdirSync(RAFTERS_DIR, { recursive: true });
    mkdirSync(EMPTY_DIR, { recursive: true });
    writeFileSync(
      join(RAFTERS_DIR, 'config.rafters.json'),
      JSON.stringify({ framework: 'vite', installed: { components: [] } }),
    );
  });

  afterAll(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('finds project root from exact directory', () => {
    const root = discoverProjectRoot(PROJECT_DIR);
    expect(root).toBe(PROJECT_DIR);
  });

  it('walks up to find project root from nested directory', () => {
    const root = discoverProjectRoot(NESTED_DIR);
    expect(root).toBe(PROJECT_DIR);
  });

  it('returns null when no .rafters/ found', () => {
    const root = discoverProjectRoot(EMPTY_DIR);
    expect(root).toBeNull();
  });
});
