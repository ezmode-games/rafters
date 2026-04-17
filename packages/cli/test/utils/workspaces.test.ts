import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  discoverWorkspaces,
  pickDefaultWorkspace,
  resolveWorkspace,
  type Workspace,
} from '../../src/utils/workspaces.js';

const SCRATCH = join(process.cwd(), '.scratch', 'workspaces-test');

function mkRafters(dir: string): void {
  mkdirSync(join(dir, '.rafters'), { recursive: true });
  writeFileSync(join(dir, '.rafters', 'config.rafters.json'), '{}');
}

beforeEach(() => {
  rmSync(SCRATCH, { recursive: true, force: true });
  mkdirSync(SCRATCH, { recursive: true });
});

afterEach(() => {
  rmSync(SCRATCH, { recursive: true, force: true });
});

describe('discoverWorkspaces - pnpm-workspace.yaml', () => {
  it('discovers workspaces under sites/* matching shingle layout', () => {
    writeFileSync(join(SCRATCH, 'pnpm-workspace.yaml'), 'packages:\n  - sites/*\n');
    mkdirSync(join(SCRATCH, 'sites', 'a'), { recursive: true });
    mkdirSync(join(SCRATCH, 'sites', 'b'), { recursive: true });
    mkdirSync(join(SCRATCH, 'sites', 'c'), { recursive: true });
    mkRafters(join(SCRATCH, 'sites', 'a'));
    mkRafters(join(SCRATCH, 'sites', 'b'));
    // c has no .rafters - should be excluded

    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result.map((w) => w.name).sort()).toEqual(['a', 'b']);
  });

  it('handles literal workspace patterns (packages/cli style)', () => {
    writeFileSync(
      join(SCRATCH, 'pnpm-workspace.yaml'),
      'packages:\n  - packages/cli\n  - packages/ui\n',
    );
    mkdirSync(join(SCRATCH, 'packages', 'cli'), { recursive: true });
    mkdirSync(join(SCRATCH, 'packages', 'ui'), { recursive: true });
    mkRafters(join(SCRATCH, 'packages', 'cli'));

    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result.map((w) => w.name)).toEqual(['cli']);
  });

  it('combines apps/* and packages/* with quoted patterns', () => {
    writeFileSync(
      join(SCRATCH, 'pnpm-workspace.yaml'),
      'packages:\n  - "apps/*"\n  - \'packages/*\'\n',
    );
    mkdirSync(join(SCRATCH, 'apps', 'web'), { recursive: true });
    mkdirSync(join(SCRATCH, 'packages', 'ui'), { recursive: true });
    mkRafters(join(SCRATCH, 'apps', 'web'));
    mkRafters(join(SCRATCH, 'packages', 'ui'));

    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result.map((w) => w.name).sort()).toEqual(['ui', 'web']);
  });

  it('includes the monorepo root when it has its own .rafters/', () => {
    writeFileSync(join(SCRATCH, 'pnpm-workspace.yaml'), 'packages:\n  - sites/*\n');
    mkdirSync(join(SCRATCH, 'sites', 'one'), { recursive: true });
    mkRafters(join(SCRATCH, 'sites', 'one'));
    mkRafters(SCRATCH);

    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    const names = result.map((w) => w.name);
    expect(names).toContain('one');
    expect(names).toContain('workspaces-test'); // basename of SCRATCH
  });
});

describe('discoverWorkspaces - package.json#workspaces', () => {
  it('reads the array form', () => {
    writeFileSync(
      join(SCRATCH, 'package.json'),
      JSON.stringify({ name: 'mono', workspaces: ['apps/*'] }),
    );
    mkdirSync(join(SCRATCH, 'apps', 'one'), { recursive: true });
    mkRafters(join(SCRATCH, 'apps', 'one'));

    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result.map((w) => w.name)).toEqual(['one']);
  });

  it('reads the { packages: [] } object form', () => {
    writeFileSync(
      join(SCRATCH, 'package.json'),
      JSON.stringify({ name: 'mono', workspaces: { packages: ['apps/*'] } }),
    );
    mkdirSync(join(SCRATCH, 'apps', 'two'), { recursive: true });
    mkRafters(join(SCRATCH, 'apps', 'two'));

    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result.map((w) => w.name)).toEqual(['two']);
  });
});

describe('discoverWorkspaces - single-root fallback', () => {
  it('returns one workspace when no monorepo manifest is present', () => {
    mkRafters(SCRATCH);
    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result).toEqual([{ name: 'workspaces-test', root: SCRATCH }]);
  });

  it('returns empty when neither monorepo nor .rafters/ is found', () => {
    const result = discoverWorkspaces(SCRATCH, { boundary: SCRATCH });
    expect(result).toEqual([]);
  });
});

describe('pickDefaultWorkspace', () => {
  const workspaces: Workspace[] = [
    { name: 'a', root: '/repo/sites/a' },
    { name: 'b', root: '/repo/sites/b' },
  ];

  it('returns the workspace containing cwd', () => {
    const picked = pickDefaultWorkspace(workspaces, '/repo/sites/a/src');
    expect(picked?.name).toBe('a');
  });

  it('returns null when cwd is the monorepo root and there are multiple workspaces', () => {
    expect(pickDefaultWorkspace(workspaces, '/repo')).toBeNull();
  });

  it('returns the only workspace when there is exactly one', () => {
    const single: Workspace[] = [{ name: 'solo', root: '/repo/solo' }];
    expect(pickDefaultWorkspace(single, '/repo')?.name).toBe('solo');
  });

  it('returns null for empty workspace list', () => {
    expect(pickDefaultWorkspace([], '/repo')).toBeNull();
  });
});

describe('resolveWorkspace', () => {
  const workspaces: Workspace[] = [
    { name: 'a', root: '/repo/sites/a' },
    { name: 'b', root: '/repo/sites/b' },
  ];
  const defaultWs = workspaces[0] ?? null;

  it('returns the named workspace when it exists', () => {
    expect(resolveWorkspace(workspaces, defaultWs, 'b')?.name).toBe('b');
  });

  it('returns null for an unknown workspace name', () => {
    expect(resolveWorkspace(workspaces, defaultWs, 'nope')).toBeNull();
  });

  it('returns the default when no name is given', () => {
    expect(resolveWorkspace(workspaces, defaultWs, undefined)?.name).toBe('a');
  });

  it('returns null when no name and no default', () => {
    expect(resolveWorkspace(workspaces, null, undefined)).toBeNull();
  });
});
