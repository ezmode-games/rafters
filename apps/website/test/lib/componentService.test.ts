import { describe, expect, it } from 'vitest';
import {
  extractDepsFromSource,
  extractSiblingImports,
  getRegistryIndex,
  listComponentNames,
  listPrimitiveNames,
  loadAllComponents,
  loadAllPrimitives,
  loadComponent,
  loadPrimitive,
  parseJSDocFromSource,
} from '../../src/lib/registry/componentService';

describe('componentService', () => {
  describe('listComponentNames', () => {
    it('returns an array of component names', () => {
      const names = listComponentNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
    });

    it('includes known components', () => {
      const names = listComponentNames();
      expect(names).toContain('button');
      expect(names).toContain('dialog');
      expect(names).toContain('input');
    });

    it('returns names without file extensions', () => {
      const names = listComponentNames();
      for (const name of names) {
        expect(name).not.toMatch(/\.tsx?$/);
      }
    });
  });

  describe('listPrimitiveNames', () => {
    it('returns an array of primitive names', () => {
      const names = listPrimitiveNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
    });

    it('includes known primitives', () => {
      const names = listPrimitiveNames();
      expect(names).toContain('slot');
      expect(names).toContain('focus-trap');
      expect(names).toContain('portal');
    });

    it('includes types.ts as a registry primitive', () => {
      const names = listPrimitiveNames();
      expect(names).toContain('types');
    });
  });

  describe('loadComponent', () => {
    it('loads a component by name', () => {
      const component = loadComponent('button');
      expect(component).not.toBeNull();
      expect(component?.name).toBe('button');
    });

    it('returns component with correct type', () => {
      const component = loadComponent('button');
      expect(component?.type).toBe('ui');
    });

    it('returns component with files array', () => {
      const component = loadComponent('button');
      expect(component?.files).toBeDefined();
      expect(component?.files.length).toBeGreaterThan(0);
      expect(component?.files[0].path).toBe('components/ui/button.tsx');
    });

    it('returns component with source content', () => {
      const component = loadComponent('button');
      expect(component?.files[0].content).toBeDefined();
      expect(component?.files[0].content.length).toBeGreaterThan(0);
    });

    it('extracts dependencies at file level', () => {
      const component = loadComponent('button');
      expect(component?.files[0].dependencies).toBeDefined();
      expect(Array.isArray(component?.files[0].dependencies)).toBe(true);
    });

    it('extracts primitive dependencies', () => {
      // Dialog uses slot primitive
      const component = loadComponent('dialog');
      expect(component?.primitives).toBeDefined();
      expect(component?.primitives).toContain('slot');
    });

    it('captures sibling ./component imports as internal deps', () => {
      // editor.tsx imports from primitives -- should be captured
      const component = loadComponent('editor');
      expect(component).not.toBeNull();
      expect(component?.primitives).toContain('document-editor');
    });

    it('returns null for non-existent component', () => {
      const component = loadComponent('nonexistent-component');
      expect(component).toBeNull();
    });
  });

  describe('loadPrimitive', () => {
    it('loads a primitive by name', () => {
      const primitive = loadPrimitive('slot');
      expect(primitive).not.toBeNull();
      expect(primitive?.name).toBe('slot');
    });

    it('returns primitive with correct type', () => {
      const primitive = loadPrimitive('slot');
      expect(primitive?.type).toBe('primitive');
    });

    it('returns primitive with files array', () => {
      const primitive = loadPrimitive('slot');
      expect(primitive?.files).toBeDefined();
      expect(primitive?.files.length).toBeGreaterThan(0);
      expect(primitive?.files[0].path).toBe('lib/primitives/slot.ts');
    });

    it('returns null for non-existent primitive', () => {
      const primitive = loadPrimitive('nonexistent-primitive');
      expect(primitive).toBeNull();
    });

    it('includes types.ts when a primitive imports from ./types', () => {
      // slot is a primitive that imports from ./types
      const primitive = loadPrimitive('slot');
      expect(primitive).not.toBeNull();
      const filePaths = primitive?.files.map((f) => f.path) ?? [];
      expect(filePaths).toContain('lib/primitives/types.ts');
    });

    it('does not duplicate types.ts in files array', () => {
      const primitive = loadPrimitive('slot');
      expect(primitive).not.toBeNull();
      const typeFiles = primitive?.files.filter((f) => f.path === 'lib/primitives/types.ts') ?? [];
      expect(typeFiles.length).toBeLessThanOrEqual(1);
    });
  });

  describe('extractSiblingImports', () => {
    it('extracts ./types as a sibling import', () => {
      const source = `import type { BlockType } from './types';`;
      const result = extractSiblingImports(source);
      expect(result).toContain('types');
    });

    it('extracts multiple sibling imports', () => {
      const source = `
        import type { BlockType } from './types';
        import { helper } from './utils';
      `;
      const result = extractSiblingImports(source);
      expect(result).toContain('types');
      expect(result).toContain('utils');
    });

    it('ignores nested path imports', () => {
      const source = `import { foo } from './sub/module';`;
      const result = extractSiblingImports(source);
      expect(result).toEqual([]);
    });

    it('ignores parent path imports', () => {
      const source = `import { foo } from '../bar';`;
      const result = extractSiblingImports(source);
      expect(result).toEqual([]);
    });

    it('ignores external package imports', () => {
      const source = `import React from 'react';`;
      const result = extractSiblingImports(source);
      expect(result).toEqual([]);
    });

    it('deduplicates sibling imports', () => {
      const source = `
        import type { A } from './types';
        import type { B } from './types';
      `;
      const result = extractSiblingImports(source);
      expect(result.filter((s) => s === 'types')).toHaveLength(1);
    });
  });

  describe('loadAllComponents', () => {
    it('returns all components', () => {
      const components = loadAllComponents();
      const names = listComponentNames();
      expect(components.length).toBe(names.length);
    });

    it('all components have required properties', () => {
      const components = loadAllComponents();
      for (const component of components) {
        expect(component.name).toBeDefined();
        expect(component.type).toBe('ui');
        expect(component.files).toBeDefined();
        expect(component.primitives).toBeDefined();
        expect(component.files[0].dependencies).toBeDefined();
      }
    });
  });

  describe('loadAllPrimitives', () => {
    it('returns all primitives', () => {
      const primitives = loadAllPrimitives();
      const names = listPrimitiveNames();
      expect(primitives.length).toBe(names.length);
    });

    it('all primitives have required properties', () => {
      const primitives = loadAllPrimitives();
      for (const primitive of primitives) {
        expect(primitive.name).toBeDefined();
        expect(primitive.type).toBe('primitive');
        expect(primitive.files).toBeDefined();
        expect(primitive.primitives).toBeDefined();
        expect(primitive.files[0].dependencies).toBeDefined();
      }
    });
  });

  describe('getRegistryIndex', () => {
    it('returns registry index with all fields', () => {
      const index = getRegistryIndex();
      expect(index.name).toBe('rafters');
      expect(index.homepage).toBe('https://rafters.studio');
      expect(index.components).toBeDefined();
      expect(index.primitives).toBeDefined();
    });

    it('lists all components', () => {
      const index = getRegistryIndex();
      const names = listComponentNames();
      expect(index.components).toEqual(names);
    });

    it('lists all primitives', () => {
      const index = getRegistryIndex();
      const names = listPrimitiveNames();
      expect(index.primitives).toEqual(names);
    });
  });

  describe('parseJSDocFromSource', () => {
    it('returns undefined for source without JSDoc', () => {
      const source = `
        export function myFunction() {
          return true;
        }
      `;
      expect(parseJSDocFromSource(source)).toBeUndefined();
    });

    it('returns undefined for JSDoc without intelligence tags', () => {
      const source = `
        /**
         * A simple function
         * @param x The input
         * @returns The output
         */
        export function myFunction(x: number) {
          return x * 2;
        }
      `;
      expect(parseJSDocFromSource(source)).toBeUndefined();
    });

    it('parses cognitiveLoad tag', () => {
      const source = `
        /**
         * A component
         * @cognitiveLoad 5
         */
        export function MyComponent() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel).toBeDefined();
      expect(intel?.cognitiveLoad).toBe(5);
    });

    it('validates cognitiveLoad is between 0-10', () => {
      const source = `
        /**
         * @cognitiveLoad 15
         */
        export function MyComponent() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel).toBeUndefined();
    });

    it('parses attentionEconomics tag', () => {
      const source = `
        /**
         * @attentionEconomics Primary action button, demands immediate attention
         */
        export function Button() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel?.attentionEconomics).toBe('Primary action button, demands immediate attention');
    });

    it('parses accessibility tag', () => {
      const source = `
        /**
         * @accessibility Requires aria-label for screen readers
         */
        export function IconButton() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel?.accessibility).toBe('Requires aria-label for screen readers');
    });

    it('parses trustBuilding tag', () => {
      const source = `
        /**
         * @trustBuilding Consistent placement reinforces user expectations
         */
        export function Navigation() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel?.trustBuilding).toBe('Consistent placement reinforces user expectations');
    });

    it('parses semanticMeaning tag', () => {
      const source = `
        /**
         * @semanticMeaning Represents destructive or irreversible action
         */
        export function DeleteButton() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel?.semanticMeaning).toBe('Represents destructive or irreversible action');
    });

    it('parses do tags into usagePatterns.dos', () => {
      const source = `
        /**
         * @do Use for primary calls to action
         * @do Place in consistent locations
         */
        export function Button() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel?.usagePatterns).toBeDefined();
      expect(intel?.usagePatterns?.dos).toHaveLength(2);
      expect(intel?.usagePatterns?.dos).toContain('Use for primary calls to action');
      expect(intel?.usagePatterns?.dos).toContain('Place in consistent locations');
    });

    it('parses never tags into usagePatterns.nevers', () => {
      const source = `
        /**
         * @never Use for destructive actions without confirmation
         * @never Place outside of visible viewport
         */
        export function Button() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel?.usagePatterns).toBeDefined();
      expect(intel?.usagePatterns?.nevers).toHaveLength(2);
      expect(intel?.usagePatterns?.nevers).toContain(
        'Use for destructive actions without confirmation',
      );
      expect(intel?.usagePatterns?.nevers).toContain('Place outside of visible viewport');
    });

    it('parses multiple intelligence tags from single JSDoc block', () => {
      const source = `
        /**
         * Primary button component
         * @cognitiveLoad 3
         * @attentionEconomics High visibility, primary action
         * @accessibility Use descriptive text, avoid icon-only
         * @trustBuilding Consistent styling across app
         * @semanticMeaning Primary action confirmation
         * @do Use sparingly for main actions
         * @never Use multiple primary buttons in one view
         */
        export function Button() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel).toBeDefined();
      expect(intel?.cognitiveLoad).toBe(3);
      expect(intel?.attentionEconomics).toBe('High visibility, primary action');
      expect(intel?.accessibility).toBe('Use descriptive text, avoid icon-only');
      expect(intel?.trustBuilding).toBe('Consistent styling across app');
      expect(intel?.semanticMeaning).toBe('Primary action confirmation');
      expect(intel?.usagePatterns?.dos).toContain('Use sparingly for main actions');
      expect(intel?.usagePatterns?.nevers).toContain('Use multiple primary buttons in one view');
    });

    // Issue #1213: hyphenated tag form is what every component in packages/ui actually uses
    it('parses hyphenated tag form (@cognitive-load, @attention-economics, etc)', () => {
      const source = `
        /**
         * @cognitive-load 3
         * @attention-economics Size hierarchy: sm=tertiary, default=secondary
         * @accessibility WCAG AAA compliant
         * @trust-building Destructive actions require confirmation
         * @semantic-meaning Variant mapping: default=main actions
         */
        export function Button() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel).toBeDefined();
      expect(intel?.cognitiveLoad).toBe(3);
      expect(intel?.attentionEconomics).toContain('Size hierarchy');
      expect(intel?.accessibility).toContain('WCAG AAA');
      expect(intel?.trustBuilding).toContain('Destructive');
      expect(intel?.semanticMeaning).toContain('Variant mapping');
    });

    it('parses @usage-patterns block with DO: and NEVER: lines', () => {
      const source = `
        /**
         * @usage-patterns
         * DO: Primary: Main user goal, maximum 1 per section
         * DO: Secondary: Alternative paths, supporting actions
         * NEVER: Mix more than 2-3 variants in one composition
         * NEVER: Use destructive without confirmation
         */
        export function Button() {}
      `;
      const intel = parseJSDocFromSource(source);
      expect(intel).toBeDefined();
      expect(intel?.usagePatterns?.dos).toHaveLength(2);
      expect(intel?.usagePatterns?.dos[0]).toContain('Primary: Main user goal');
      expect(intel?.usagePatterns?.dos[1]).toContain('Secondary: Alternative paths');
      expect(intel?.usagePatterns?.nevers).toHaveLength(2);
      expect(intel?.usagePatterns?.nevers[0]).toContain('Mix more than 2-3 variants');
      expect(intel?.usagePatterns?.nevers[1]).toContain('Use destructive without confirmation');
    });

    it('parses real button.tsx source -- all 6 intelligence fields populated', async () => {
      const fs = await import('node:fs/promises');
      const path = await import('node:path');
      const { fileURLToPath } = await import('node:url');
      const here = path.dirname(fileURLToPath(import.meta.url));
      const buttonPath = path.resolve(here, '../../../../packages/ui/src/components/ui/button.tsx');
      const source = await fs.readFile(buttonPath, 'utf-8');
      const intel = parseJSDocFromSource(source);
      expect(intel).toBeDefined();
      expect(intel?.cognitiveLoad).toBeDefined();
      expect(intel?.attentionEconomics).toBeDefined();
      expect(intel?.accessibility).toBeDefined();
      expect(intel?.trustBuilding).toBeDefined();
      expect(intel?.semanticMeaning).toBeDefined();
      expect(intel?.usagePatterns).toBeDefined();
      expect(intel?.usagePatterns?.dos.length).toBeGreaterThan(0);
      expect(intel?.usagePatterns?.nevers.length).toBeGreaterThan(0);
    });

    it('strict mode throws when no intelligence fields are found', () => {
      const source = 'export function Empty() {}';
      expect(() => parseJSDocFromSource(source, { strict: true, componentName: 'Empty' })).toThrow(
        /No JSDoc blocks found in Empty/,
      );
    });

    it('strict mode throws when JSDoc has no intelligence tags', () => {
      const source = `
        /**
         * Just a description, no intelligence tags
         * @param x The input
         */
        export function NoIntel(x: number) {}
      `;
      expect(() =>
        parseJSDocFromSource(source, { strict: true, componentName: 'NoIntel' }),
      ).toThrow(/No intelligence fields found in NoIntel/);
    });

    it('non-strict mode returns undefined silently when no intelligence tags', () => {
      const source = 'export function Empty() {}';
      expect(parseJSDocFromSource(source)).toBeUndefined();
    });
  });

  describe('extractDepsFromSource', () => {
    it('extracts a single dependency', () => {
      const source = `
        /**
         * @dependencies nanostores
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores']);
    });

    it('extracts multiple dependencies', () => {
      const source = `
        /**
         * @dependencies nanostores @nanostores/react zustand
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores', '@nanostores/react', 'zustand']);
    });

    it('returns empty arrays when no tags present', () => {
      const source = `
        /**
         * A plain function with no dependency tags
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual([]);
      expect(result.devDependencies).toEqual([]);
    });

    it('returns empty arrays for source with no JSDoc at all', () => {
      const source = `export function handler() { return true; }`;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual([]);
      expect(result.devDependencies).toEqual([]);
    });

    it('excludes @internal-dependencies from output', () => {
      const source = `
        /**
         * @internal-dependencies @rafters/shared some-internal-tool
         * @dependencies nanostores
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      // @internal-dependencies tag is not recognized as @dependencies
      // Only @dependencies tag is parsed
      expect(result.dependencies).toEqual(['nanostores']);
      expect(result.devDependencies).toEqual([]);
    });

    it('filters out @rafters/* packages from dependencies', () => {
      const source = `
        /**
         * @dependencies nanostores @rafters/shared @rafters/design-tokens lodash
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores', 'lodash']);
    });

    it('filters out @rafters/* packages from devDependencies', () => {
      const source = `
        /**
         * @devDependencies vitest @rafters/shared @testing-library/react
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.devDependencies).toEqual(['vitest', '@testing-library/react']);
    });

    it('populates devDependencies correctly', () => {
      const source = `
        /**
         * @dependencies nanostores
         * @devDependencies vitest @testing-library/react
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores']);
      expect(result.devDependencies).toEqual(['vitest', '@testing-library/react']);
    });

    it('handles empty @devDependencies tag as empty array', () => {
      const source = `
        /**
         * @dependencies nanostores
         * @devDependencies
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores']);
      expect(result.devDependencies).toEqual([]);
    });

    it('stops parsing at parenthetical descriptions', () => {
      const source = `
        /**
         * @dependencies primitives/history (via consumer-provided getHistory callback)
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['primitives/history']);
    });

    it('extracts multiple deps before parenthetical', () => {
      const source = `
        /**
         * @dependencies nanostores @nanostores/react (required for React bindings)
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores', '@nanostores/react']);
    });

    it('does not match @dependencies in string literals', () => {
      const source = `
        const help = "@dependencies are managed externally";
        /**
         * @dependencies nanostores@^0.11.0
         */
        export function handler() {}
      `;
      const result = extractDepsFromSource(source);
      expect(result.dependencies).toEqual(['nanostores@^0.11.0']);
    });
  });

  describe('registry build includes JSDoc deps', () => {
    it.each([
      ['components', loadAllComponents],
      ['primitives', loadAllPrimitives],
    ] as const)('all %s have devDependencies arrays', (_label, loader) => {
      for (const item of loader()) {
        for (const file of item.files) {
          expect(Array.isArray(file.devDependencies)).toBe(true);
        }
      }
    });
  });
});
