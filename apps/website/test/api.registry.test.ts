import { describe, expect, it } from 'vitest';
import { getComponentRegistry, getRegistryMetadata } from '../app/lib/registry/componentService';

describe('Registry API', () => {
  describe('getRegistryMetadata', () => {
    it('should return registry metadata', async () => {
      const result = await getRegistryMetadata();

      expect(result).toHaveProperty('$schema');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('components');

      expect(result.name).toBe('Rafters AI Design Intelligence Registry');
      expect(Array.isArray(result.components)).toBe(true);
    });
  });

  describe('getComponentRegistry', () => {
    it('should return component registry with design intelligence', async () => {
      const result = await getComponentRegistry();

      expect(result).toHaveProperty('components');
      expect(Array.isArray(result.components)).toBe(true);

      // Check that components have AI intelligence metadata
      if (result.components && result.components.length > 0) {
        const component = result.components[0];
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('type');

        // Verify AI intelligence metadata exists
        if (component.meta?.rafters) {
          expect(component.meta.rafters).toHaveProperty('intelligence');
          expect(component.meta.rafters.intelligence).toHaveProperty('cognitiveLoad');
        }
      }
    });
  });
});
