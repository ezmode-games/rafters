/**
 * Unit tests for rafters add command
 *
 * Tests individual functions in isolation using zocker-generated fixtures.
 */

import { describe, expect, it } from 'vitest';
// Import the internal functions we want to unit test
import { collectDependencies, transformFileContent } from '../../src/commands/add.js';
import { registryFixtures } from '../fixtures/registry.js';

describe('transformFileContent', () => {
  it('transforms ../../primitives/ imports to @/lib/primitives/', () => {
    const input = `import classy from '../../primitives/classy';`;
    const result = transformFileContent(input);
    expect(result).toBe(`import classy from '@/lib/primitives/classy';`);
  });

  it('transforms ../primitives/ imports to @/lib/primitives/', () => {
    const input = `import { cn } from '../primitives/cn';`;
    const result = transformFileContent(input);
    expect(result).toBe(`import { cn } from '@/lib/primitives/cn';`);
  });

  it('transforms ./ component imports to @/components/ui/', () => {
    const input = `import { Button } from './button';`;
    const result = transformFileContent(input);
    expect(result).toBe(`import { Button } from '@/components/ui/button';`);
  });

  it('transforms ../ component imports to @/components/ui/', () => {
    const input = `import { Card } from '../card';`;
    const result = transformFileContent(input);
    expect(result).toBe(`import { Card } from '@/components/ui/card';`);
  });

  it('handles multiple imports in one file', () => {
    const input = `import classy from '../../primitives/classy';
import { Button } from './button';
import { Card } from '../card';`;

    const result = transformFileContent(input);

    expect(result).toContain(`from '@/lib/primitives/classy'`);
    expect(result).toContain(`from '@/components/ui/button'`);
    expect(result).toContain(`from '@/components/ui/card'`);
  });

  it('preserves non-relative imports', () => {
    const input = `import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';`;

    const result = transformFileContent(input);

    expect(result).toContain(`from 'react'`);
    expect(result).toContain(`from '@radix-ui/react-dialog'`);
  });

  it('handles double quotes', () => {
    const input = `import classy from "../../primitives/classy";`;
    const result = transformFileContent(input);
    expect(result).toBe(`import classy from '@/lib/primitives/classy';`);
  });
});

describe('collectDependencies', () => {
  it('collects npm dependencies from registry items', () => {
    const items = [registryFixtures.dialogComponent()];
    const { dependencies } = collectDependencies(items);

    expect(dependencies).toContain('@radix-ui/react-dialog');
  });

  it('excludes react from dependencies', () => {
    const items = [registryFixtures.buttonComponent()];
    const { dependencies } = collectDependencies(items);

    expect(dependencies).not.toContain('react');
  });

  it('deduplicates dependencies across items', () => {
    const items = [registryFixtures.buttonComponent(), registryFixtures.dialogComponent()];
    const { dependencies } = collectDependencies(items);

    // Should not have duplicates
    const uniqueDeps = [...new Set(dependencies)];
    expect(dependencies).toEqual(uniqueDeps);
  });

  it('returns sorted dependencies', () => {
    const items = [registryFixtures.dialogComponent()];
    const { dependencies } = collectDependencies(items);

    const sorted = [...dependencies].sort();
    expect(dependencies).toEqual(sorted);
  });
});

describe('registry fixtures', () => {
  it('generates valid button component fixture', () => {
    const button = registryFixtures.buttonComponent();

    expect(button.name).toBe('button');
    expect(button.type).toBe('registry:ui');
    expect(button.files).toHaveLength(1);
    expect(button.files[0].path).toBe('components/ui/button.tsx');
    expect(button.registryDependencies).toContain('classy');
  });

  it('generates valid classy primitive fixture', () => {
    const classy = registryFixtures.classyPrimitive();

    expect(classy.name).toBe('classy');
    expect(classy.type).toBe('registry:primitive');
    expect(classy.files).toHaveLength(1);
    expect(classy.files[0].path).toBe('lib/primitives/classy.ts');
  });

  it('generates valid registry index fixture', () => {
    const index = registryFixtures.registryIndex();

    expect(index.name).toBe('rafters');
    expect(index.components).toContain('button');
    expect(index.primitives).toContain('classy');
  });
});
