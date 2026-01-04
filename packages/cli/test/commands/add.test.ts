/**
 * Tests for rafters add command
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { add, fetchComponent, installComponent } from '../../src/commands/add.js';
import type { RegistryItem } from '../../src/registry/types.js';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Test fixtures
const mockButtonComponent: RegistryItem = {
  name: 'button',
  type: 'registry:ui',
  dependencies: ['react'],
  registryDependencies: ['classy'],
  files: [
    {
      path: 'components/ui/button.tsx',
      content: `import classy from '../../primitives/classy';
export const Button = () => <button>Click me</button>;`,
      type: 'registry:ui',
    },
  ],
};

const mockClassyPrimitive: RegistryItem = {
  name: 'classy',
  type: 'registry:primitive',
  dependencies: [],
  files: [
    {
      path: 'lib/primitives/classy.ts',
      content: `export default function classy(...classes: string[]) { return classes.filter(Boolean).join(' '); }`,
      type: 'registry:primitive',
    },
  ],
};

const mockCardComponent: RegistryItem = {
  name: 'card',
  type: 'registry:ui',
  dependencies: ['react'],
  files: [
    {
      path: 'components/ui/card.tsx',
      content: `export const Card = () => <div>Card</div>;`,
      type: 'registry:ui',
    },
  ],
};

const mockDialogComponent: RegistryItem = {
  name: 'dialog',
  type: 'registry:ui',
  dependencies: ['react', '@radix-ui/react-dialog'],
  registryDependencies: ['classy'],
  files: [
    {
      path: 'components/ui/dialog.tsx',
      content: `import * as DialogPrimitive from '@radix-ui/react-dialog';
export const Dialog = DialogPrimitive.Root;`,
      type: 'registry:ui',
    },
  ],
};

describe('fetchComponent', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches a component from registry', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockButtonComponent,
    });

    const component = await fetchComponent('button', 'https://test.registry');
    expect(component.name).toBe('button');
    expect(component.files).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith('https://test.registry/registry/components/button.json');
  });

  it('throws for unknown component', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    await expect(fetchComponent('nonexistent', 'https://test.registry')).rejects.toThrow(
      'Component "nonexistent" not found',
    );
  });
});

describe('installComponent', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = join(tmpdir(), `rafters-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  it('installs component files to target directory', async () => {
    await installComponent(mockButtonComponent, testDir);

    const buttonPath = join(testDir, 'components/ui/button.tsx');
    expect(existsSync(buttonPath)).toBe(true);

    const content = await readFile(buttonPath, 'utf-8');
    expect(content).toContain("from '@/lib/primitives/classy'");
  });

  it('transforms relative imports to absolute imports', async () => {
    await installComponent(mockButtonComponent, testDir);

    const buttonPath = join(testDir, 'components/ui/button.tsx');
    const content = await readFile(buttonPath, 'utf-8');

    // Should transform ../../primitives/classy to @/lib/primitives/classy
    expect(content).toContain("from '@/lib/primitives/classy'");
    expect(content).not.toContain('../../primitives/');
  });

  it('throws when component exists and overwrite is false', async () => {
    // Create existing file
    const buttonDir = join(testDir, 'components/ui');
    await mkdir(buttonDir, { recursive: true });
    await writeFile(join(buttonDir, 'button.tsx'), 'existing content');

    await expect(
      installComponent(mockButtonComponent, testDir, { overwrite: false }),
    ).rejects.toThrow('Component "button" already exists. Use --overwrite to replace.');
  });

  it('overwrites when overwrite option is true', async () => {
    // Create existing file
    const buttonDir = join(testDir, 'components/ui');
    await mkdir(buttonDir, { recursive: true });
    await writeFile(join(buttonDir, 'button.tsx'), 'existing content');

    await installComponent(mockButtonComponent, testDir, { overwrite: true });

    const content = await readFile(join(buttonDir, 'button.tsx'), 'utf-8');
    expect(content).not.toBe('existing content');
    expect(content).toContain('Button');
  });
});

describe('add', () => {
  let testDir: string;
  let originalCwd: string;
  let originalExitCode: number | undefined;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = join(tmpdir(), `rafters-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(testDir, { recursive: true });

    // Create .rafters directory to simulate initialized project
    await mkdir(join(testDir, '.rafters'), { recursive: true });

    // Mock process.cwd to return our test directory
    originalCwd = process.cwd();
    vi.spyOn(process, 'cwd').mockReturnValue(testDir);

    // Save original exitCode
    originalExitCode = process.exitCode;

    // Reset fetch mock
    mockFetch.mockReset();
  });

  afterEach(async () => {
    // Restore process.cwd
    vi.spyOn(process, 'cwd').mockReturnValue(originalCwd);
    vi.restoreAllMocks();

    // Restore exitCode
    process.exitCode = originalExitCode;

    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  it('requires initialized project', async () => {
    // Remove .rafters directory
    await rm(join(testDir, '.rafters'), { recursive: true, force: true });

    await add(['button'], { registryUrl: 'https://test.registry' });

    expect(process.exitCode).toBe(1);
  });

  it('requires at least one component', async () => {
    await add([], { registryUrl: 'https://test.registry' });

    expect(process.exitCode).toBe(1);
  });

  it('adds single component', async () => {
    // Mock fetch responses for button and its dependency
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockButtonComponent,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockClassyPrimitive,
      });

    await add(['button'], { registryUrl: 'https://test.registry' });

    expect(existsSync(join(testDir, 'components/ui/button.tsx'))).toBe(true);
    expect(existsSync(join(testDir, 'lib/primitives/classy.ts'))).toBe(true);
  });

  it('adds multiple components', async () => {
    // Mock fetch responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCardComponent,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockDialogComponent,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockClassyPrimitive,
      });

    await add(['card', 'dialog'], { registryUrl: 'https://test.registry' });

    expect(existsSync(join(testDir, 'components/ui/card.tsx'))).toBe(true);
    expect(existsSync(join(testDir, 'components/ui/dialog.tsx'))).toBe(true);
  });

  it('handles unknown component error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    await add(['nonexistent'], { registryUrl: 'https://test.registry' });

    expect(process.exitCode).toBe(1);
  });

  it('overwrites existing with --overwrite flag', async () => {
    // Create existing file
    const buttonDir = join(testDir, 'components/ui');
    await mkdir(buttonDir, { recursive: true });
    await writeFile(join(buttonDir, 'button.tsx'), 'existing content');

    // Mock fetch responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockButtonComponent,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockClassyPrimitive,
      });

    await add(['button'], { overwrite: true, registryUrl: 'https://test.registry' });

    const content = await readFile(join(buttonDir, 'button.tsx'), 'utf-8');
    expect(content).not.toBe('existing content');
  });
});
