import { describe, expect, it } from 'vitest';
import { selectFilesForFramework } from '../../src/commands/add.js';
import type { RegistryFile } from '../../src/registry/types.js';

function makeFile(path: string): RegistryFile {
  return { path, content: '', dependencies: [], devDependencies: [] };
}

describe('selectFilesForFramework', () => {
  const buttonFiles: RegistryFile[] = [
    makeFile('components/ui/button.tsx'),
    makeFile('components/ui/button.astro'),
    makeFile('components/ui/button.classes.ts'),
  ];

  it('selects .tsx files for react target', () => {
    const result = selectFilesForFramework(buttonFiles, 'react');
    expect(result.fallback).toBe(false);
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.tsx' }),
    );
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.classes.ts' }),
    );
    expect(result.files).not.toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.astro' }),
    );
  });

  it('selects .astro files for astro target', () => {
    const result = selectFilesForFramework(buttonFiles, 'astro');
    expect(result.fallback).toBe(false);
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.astro' }),
    );
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.classes.ts' }),
    );
    expect(result.files).not.toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.tsx' }),
    );
  });

  it('falls back to .tsx when target extension not available', () => {
    const dialogFiles: RegistryFile[] = [makeFile('components/ui/dialog.tsx')];
    const result = selectFilesForFramework(dialogFiles, 'astro');
    expect(result.fallback).toBe(true);
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/dialog.tsx' }),
    );
  });

  it('does not set fallback when react target has .tsx', () => {
    const dialogFiles: RegistryFile[] = [makeFile('components/ui/dialog.tsx')];
    const result = selectFilesForFramework(dialogFiles, 'react');
    expect(result.fallback).toBe(false);
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/dialog.tsx' }),
    );
  });

  it('always includes shared .classes.ts files', () => {
    const result = selectFilesForFramework(buttonFiles, 'astro');
    const paths = result.files.map((f) => f.path);
    expect(paths).toContain('components/ui/button.classes.ts');
  });

  it('handles vue target with fallback', () => {
    const result = selectFilesForFramework(buttonFiles, 'vue');
    expect(result.fallback).toBe(true);
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.tsx' }),
    );
    expect(result.files).toContainEqual(
      expect.objectContaining({ path: 'components/ui/button.classes.ts' }),
    );
  });

  it('returns all files when nothing matches and target is react', () => {
    const oddFiles: RegistryFile[] = [makeFile('components/ui/widget.svelte')];
    const result = selectFilesForFramework(oddFiles, 'react');
    expect(result.fallback).toBe(false);
    expect(result.files).toEqual(oddFiles);
  });

  it('handles items with only shared files gracefully', () => {
    const sharedOnly: RegistryFile[] = [makeFile('components/ui/button.classes.ts')];
    const result = selectFilesForFramework(sharedOnly, 'react');
    expect(result.files).toHaveLength(1);
  });
});
