import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { frameworkToTarget, hasAstroReact, targetToExtension } from '../../src/utils/detect.js';

describe('frameworkToTarget', () => {
  it('maps astro to astro', () => {
    expect(frameworkToTarget('astro')).toBe('astro');
  });

  it('maps next to react', () => {
    expect(frameworkToTarget('next')).toBe('react');
  });

  it('maps vite to react', () => {
    expect(frameworkToTarget('vite')).toBe('react');
  });

  it('maps remix to react', () => {
    expect(frameworkToTarget('remix')).toBe('react');
  });

  it('maps react-router to react', () => {
    expect(frameworkToTarget('react-router')).toBe('react');
  });

  it('maps unknown to react', () => {
    expect(frameworkToTarget('unknown')).toBe('react');
  });
});

describe('targetToExtension', () => {
  it('react -> .tsx', () => {
    expect(targetToExtension('react')).toBe('.tsx');
  });

  it('astro -> .astro', () => {
    expect(targetToExtension('astro')).toBe('.astro');
  });

  it('vue -> .vue', () => {
    expect(targetToExtension('vue')).toBe('.vue');
  });

  it('svelte -> .svelte', () => {
    expect(targetToExtension('svelte')).toBe('.svelte');
  });
});

describe('hasAstroReact', () => {
  const testDir = join(tmpdir(), 'rafters-test-astro-react');

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('returns true when @astrojs/react is in dependencies', async () => {
    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify({
        dependencies: { astro: '^5.0.0', '@astrojs/react': '^4.0.0' },
      }),
    );
    expect(await hasAstroReact(testDir)).toBe(true);
  });

  it('returns true when @astrojs/react is in devDependencies', async () => {
    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify({
        dependencies: { astro: '^5.0.0' },
        devDependencies: { '@astrojs/react': '^4.0.0' },
      }),
    );
    expect(await hasAstroReact(testDir)).toBe(true);
  });

  it('returns false when @astrojs/react is not installed', async () => {
    await writeFile(
      join(testDir, 'package.json'),
      JSON.stringify({
        dependencies: { astro: '^5.0.0' },
      }),
    );
    expect(await hasAstroReact(testDir)).toBe(false);
  });

  it('returns false when package.json does not exist', async () => {
    expect(await hasAstroReact(testDir)).toBe(false);
  });
});
