import { describe, expect, it } from 'vitest';
import {
  getAllComponents,
  getComponent,
  getRegistryMetadata,
} from '../../../src/lib/registry/componentService';

describe('componentService', () => {
  describe('getAllComponents', () => {
    it('should return components array', () => {
      const components = getAllComponents();
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
    });

    it('should include shadcn-compatible schema', () => {
      const components = getAllComponents();
      const firstComponent = components[0];
      expect(firstComponent).toHaveProperty('name');
      expect(firstComponent).toHaveProperty('type');
      expect(firstComponent).toHaveProperty('files');
    });

    it('should include Rafters intelligence metadata', () => {
      const components = getAllComponents();
      const firstComponent = components[0];
      expect(firstComponent).toHaveProperty('meta.rafters.intelligence');
      expect(firstComponent.meta?.rafters?.intelligence).toHaveProperty('cognitiveLoad');
      expect(firstComponent.meta?.rafters?.intelligence).toHaveProperty('attentionEconomics');
    });
  });

  describe('getComponent', () => {
    it('should return container component by name', () => {
      const component = getComponent('container');
      expect(component).toBeTruthy();
      expect(component?.name).toBe('container');
      expect(component?.meta?.rafters?.intelligence?.cognitiveLoad).toBe(0);
    });

    it('should return grid component by name', () => {
      const component = getComponent('grid');
      expect(component).toBeTruthy();
      expect(component?.name).toBe('grid');
      expect(component?.meta?.rafters?.intelligence?.cognitiveLoad).toBe(4);
    });

    it('should return null for non-existent component', () => {
      const component = getComponent('non-existent');
      expect(component).toBeNull();
    });

    it('should be case insensitive', () => {
      const component = getComponent('CONTAINER');
      expect(component).toBeTruthy();
      expect(component?.name).toBe('container');
    });
  });

  describe('getRegistryMetadata', () => {
    it('should return registry metadata with schema', () => {
      const metadata = getRegistryMetadata();
      expect(metadata).toHaveProperty('$schema', 'https://rafters.dev/schemas/registry.json');
      expect(metadata).toHaveProperty('name', 'Rafters AI Design Intelligence Registry');
      expect(metadata).toHaveProperty('components');
    });

    it('should include component data', () => {
      const metadata = getRegistryMetadata();
      const containerComponent = metadata.components?.find((c) => c.name === 'container');
      expect(containerComponent).toBeTruthy();
      expect(containerComponent?.meta?.rafters?.intelligence?.cognitiveLoad).toBe(0);
    });

    it('should have components array', () => {
      const metadata = getRegistryMetadata();
      expect(metadata.components).toBeDefined();
      expect(Array.isArray(metadata.components)).toBe(true);
      expect(metadata.components?.length).toBeGreaterThan(0);
    });
  });
});
