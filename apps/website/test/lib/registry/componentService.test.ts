import { describe, expect, it } from 'vitest';
import {
  getComponentByName,
  getComponentRegistry,
  getRegistryMetadata,
} from '../../../src/lib/registry/componentService';

describe('componentService', () => {
  describe('getComponentRegistry', () => {
    it('should return components array', async () => {
      const registry = await getComponentRegistry();
      expect(registry).toHaveProperty('components');
      expect(Array.isArray(registry.components)).toBe(true);
      expect(registry.components.length).toBeGreaterThan(0);
    });

    it('should include shadcn-compatible schema', async () => {
      const registry = await getComponentRegistry();
      const firstComponent = registry.components[0];
      expect(firstComponent).toHaveProperty(
        '$schema',
        'https://ui.shadcn.com/schema/registry-item.json'
      );
      expect(firstComponent).toHaveProperty('name');
      expect(firstComponent).toHaveProperty('type');
    });

    it('should include Rafters intelligence metadata', async () => {
      const registry = await getComponentRegistry();
      const firstComponent = registry.components[0];
      expect(firstComponent).toHaveProperty('meta.rafters.intelligence');
      expect(firstComponent.meta?.rafters?.intelligence).toHaveProperty('cognitiveLoad');
      expect(firstComponent.meta?.rafters?.intelligence).toHaveProperty('attentionEconomics');
    });
  });

  describe('getComponentByName', () => {
    it('should return container component by name', async () => {
      const component = await getComponentByName('container');
      expect(component).toBeTruthy();
      expect(component?.name).toBe('container');
      expect(component?.meta?.rafters?.intelligence?.cognitiveLoad).toBe(0);
    });

    it('should return grid component by name', async () => {
      const component = await getComponentByName('grid');
      expect(component).toBeTruthy();
      expect(component?.name).toBe('grid');
      expect(component?.meta?.rafters?.intelligence?.cognitiveLoad).toBe(4);
    });

    it('should return null for non-existent component', async () => {
      const component = await getComponentByName('non-existent');
      expect(component).toBeNull();
    });

    it('should be case insensitive', async () => {
      const component = await getComponentByName('CONTAINER');
      expect(component).toBeTruthy();
      expect(component?.name).toBe('container');
    });
  });

  describe('getRegistryMetadata', () => {
    it('should return registry metadata with schema', async () => {
      const metadata = await getRegistryMetadata();
      expect(metadata).toHaveProperty('$schema', 'https://rafters.dev/schemas/registry.json');
      expect(metadata).toHaveProperty('name', 'Rafters AI Design Intelligence Registry');
      expect(metadata).toHaveProperty('components');
    });

    it('should include component cognitive load data', async () => {
      const metadata = await getRegistryMetadata();
      const containerComponent = metadata.components.find((c) => c.name === 'container');
      expect(containerComponent).toBeTruthy();
      expect(containerComponent?.cognitiveLoad).toBe(0);
    });

    it('should have totalComponents count', async () => {
      const metadata = await getRegistryMetadata();
      expect(metadata).toHaveProperty('totalComponents');
      expect(metadata.totalComponents).toBeGreaterThan(0);
      expect(metadata.components).toHaveLength(metadata.totalComponents);
    });
  });
});
