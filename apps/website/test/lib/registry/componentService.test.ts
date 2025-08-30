import { describe, expect, it } from 'vitest';
import { getComponent, getComponentRegistry } from '../../../src/lib/registry/componentService';

describe('componentService', () => {
  it('should return all components', async () => {
    const registry = await getComponentRegistry();
    expect(registry).toHaveProperty('components');
    expect(Array.isArray(registry.components)).toBe(true);
    expect(registry.components.length).toBeGreaterThan(0);
  });

  it('should return component by name when it exists', async () => {
    const registry = await getComponentRegistry();
    const firstComponent = registry.components[0];

    if (firstComponent) {
      const component = await getComponent(firstComponent.name);
      expect(component).toBeDefined();
      expect(component?.name).toBe(firstComponent.name);
    }
  });

  it('should return null for non-existent component', async () => {
    const component = await getComponent('non-existent-component');
    expect(component).toBeNull();
  });

  it('should validate component structure', async () => {
    const registry = await getComponentRegistry();
    const firstComponent = registry.components[0];

    if (firstComponent) {
      expect(firstComponent).toHaveProperty('name');
      expect(firstComponent).toHaveProperty('type');
      expect(firstComponent).toHaveProperty('files');
      expect(Array.isArray(firstComponent.files)).toBe(true);
    }
  });
});
