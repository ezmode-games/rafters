import { describe, expect, it } from 'vitest';
import {
  getRegistryIndex,
  listComponentNames,
  listPrimitiveNames,
  loadAllComponents,
  loadAllPrimitives,
  loadComponent,
  loadPrimitive,
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

    it('excludes types.ts', () => {
      const names = listPrimitiveNames();
      expect(names).not.toContain('types');
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
      expect(component?.type).toBe('registry:ui');
    });

    it('returns component with files array', () => {
      const component = loadComponent('button');
      expect(component?.files).toBeDefined();
      expect(component?.files.length).toBeGreaterThan(0);
      expect(component?.files[0].path).toBe('components/ui/button.tsx');
      expect(component?.files[0].type).toBe('registry:ui');
    });

    it('returns component with source content', () => {
      const component = loadComponent('button');
      expect(component?.files[0].content).toBeDefined();
      expect(component?.files[0].content.length).toBeGreaterThan(0);
    });

    it('extracts dependencies', () => {
      const component = loadComponent('button');
      expect(component?.dependencies).toBeDefined();
      expect(Array.isArray(component?.dependencies)).toBe(true);
    });

    it('extracts registry dependencies for components with primitives', () => {
      // Dialog uses slot primitive
      const component = loadComponent('dialog');
      expect(component?.registryDependencies).toBeDefined();
      expect(component?.registryDependencies).toContain('slot');
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
      expect(primitive?.type).toBe('registry:primitive');
    });

    it('returns primitive with files array', () => {
      const primitive = loadPrimitive('slot');
      expect(primitive?.files).toBeDefined();
      expect(primitive?.files.length).toBeGreaterThan(0);
      expect(primitive?.files[0].path).toBe('lib/primitives/slot.ts');
      expect(primitive?.files[0].type).toBe('registry:primitive');
    });

    it('returns null for non-existent primitive', () => {
      const primitive = loadPrimitive('nonexistent-primitive');
      expect(primitive).toBeNull();
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
        expect(component.type).toBe('registry:ui');
        expect(component.files).toBeDefined();
        expect(component.dependencies).toBeDefined();
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
        expect(primitive.type).toBe('registry:primitive');
        expect(primitive.files).toBeDefined();
        expect(primitive.dependencies).toBeDefined();
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
});
