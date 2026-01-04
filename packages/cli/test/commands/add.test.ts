/**
 * Unit tests for rafters add command
 *
 * Following project test strategy:
 * - Property-based testing with zocker for schema-driven validation
 * - Real fixtures over brittle hardcoded mocks
 * - Test behavior, not implementation details
 */

import { describe, expect, it } from 'vitest';
import { zocker } from 'zocker';
import { z } from 'zod';
import { collectDependencies, transformFileContent } from '../../src/commands/add.js';
import { RegistryItemSchema } from '../../src/registry/types.js';
import { generateRandomItems, registryFixtures } from '../fixtures/registry.js';

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

  it('transforms ../lib/ imports to @/lib/', () => {
    const input = `import { cn } from '../lib/utils';`;
    const result = transformFileContent(input);
    expect(result).toBe(`import { cn } from '@/lib/utils';`);
  });

  it('transforms ../hooks/ imports to @/hooks/', () => {
    const input = `import { useMediaQuery } from '../hooks/use-media-query';`;
    const result = transformFileContent(input);
    expect(result).toBe(`import { useMediaQuery } from '@/hooks/use-media-query';`);
  });

  it('does not incorrectly transform ../lib/ as component import', () => {
    const input = `import { cn } from '../lib/utils';`;
    const result = transformFileContent(input);
    // Should NOT be @/components/ui/lib/utils
    expect(result).not.toContain('@/components/ui/lib');
    expect(result).toBe(`import { cn } from '@/lib/utils';`);
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

  // Property-based test: for all valid items, dependencies are extracted
  it('PROPERTY: always returns arrays for dependencies', () => {
    const items = generateRandomItems(20);

    const result = collectDependencies(items);

    expect(Array.isArray(result.dependencies)).toBe(true);
    expect(Array.isArray(result.devDependencies)).toBe(true);
  });
});

describe('RegistryItemSchema validation', () => {
  // Property-based test: zocker-generated data always validates
  it('PROPERTY: zocker-generated items always parse successfully', () => {
    const items = zocker(z.array(RegistryItemSchema).length(50)).generate();

    for (const item of items) {
      expect(() => RegistryItemSchema.parse(item)).not.toThrow();
    }
  });

  it('validates required fields', () => {
    expect(() =>
      RegistryItemSchema.parse({
        name: 'test',
        type: 'registry:ui',
        dependencies: [],
        files: [],
      }),
    ).not.toThrow();
  });

  it('rejects invalid type', () => {
    expect(() =>
      RegistryItemSchema.parse({
        name: 'test',
        type: 'invalid-type',
        dependencies: [],
        files: [],
      }),
    ).toThrow();
  });
});

describe('registry fixtures', () => {
  it('generates valid button component fixture', () => {
    const button = registryFixtures.buttonComponent();

    expect(button.name).toBe('button');
    expect(button.type).toBe('registry:ui');
    expect(button.files.length).toBeGreaterThan(0);
    expect(button.files[0].path).toBe('components/ui/button.tsx');
    expect(button.registryDependencies).toContain('classy');
  });

  it('generates valid classy primitive fixture', () => {
    const classy = registryFixtures.classyPrimitive();

    expect(classy.name).toBe('classy');
    expect(classy.type).toBe('registry:primitive');
    expect(classy.files.length).toBeGreaterThan(0);
    expect(classy.files[0].path).toBe('lib/primitives/classy.ts');
  });

  it('generates valid registry index fixture', () => {
    const index = registryFixtures.registryIndex();

    expect(index.name).toBe('rafters');
    expect(index.components).toContain('button');
    expect(index.primitives).toContain('classy');
  });

  // Property-based test: all fixtures validate against schema
  it('PROPERTY: all generated fixtures validate against schema', () => {
    const fixtures = [
      registryFixtures.buttonComponent(),
      registryFixtures.classyPrimitive(),
      registryFixtures.cardComponent(),
      registryFixtures.dialogComponent(),
    ];

    for (const fixture of fixtures) {
      expect(() => RegistryItemSchema.parse(fixture)).not.toThrow();
    }
  });
});
