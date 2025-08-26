/**
 * Tests for component service layer
 */

import { describe, expect, it } from 'vitest';
import { getComponent, getComponentRegistry } from '../src/services/componentService';

describe('Component Service', () => {
  it('should return component registry with valid structure', async () => {
    const registry = await getComponentRegistry();

    expect(registry.components).toBeDefined();
    expect(Array.isArray(registry.components)).toBe(true);
    expect(registry.components.length).toBeGreaterThan(0);

    // Test first component structure
    const firstComponent = registry.components[0];
    expect(firstComponent.name).toBeDefined();
    expect(firstComponent.meta?.rafters?.version).toBeDefined();
    expect(firstComponent.description).toBeDefined();
    expect(firstComponent.meta?.rafters?.intelligence).toBeDefined();
    expect(firstComponent.files).toBeDefined();
    expect(firstComponent.dependencies).toBeDefined();
  });

  it('should return specific component by name', async () => {
    const component = await getComponent('button');

    expect(component).not.toBeNull();
    expect(component?.name).toBe('button');
    expect(component?.meta?.rafters?.intelligence.cognitiveLoad).toBeGreaterThan(0);
    expect(component?.files.length).toBeGreaterThan(0);
  });

  it('should return null for non-existent component', async () => {
    const component = await getComponent('NonExistentComponent');
    expect(component).toBeNull();
  });

  it('should handle case-insensitive component lookup', async () => {
    const component1 = await getComponent('button');
    const component2 = await getComponent('BUTTON');
    const component3 = await getComponent('Button');

    expect(component1?.name).toBe('button');
    expect(component2?.name).toBe('button');
    expect(component3?.name).toBe('button');
  });

  it('should include all required intelligence fields', async () => {
    const registry = await getComponentRegistry();

    for (const component of registry.components) {
      const intelligence = component.meta?.rafters?.intelligence;
      expect(intelligence).toBeDefined();
      expect(intelligence?.cognitiveLoad).toBeTypeOf('number');
      expect(intelligence?.cognitiveLoad).toBeGreaterThanOrEqual(0);
      expect(intelligence?.cognitiveLoad).toBeLessThanOrEqual(10);

      expect(intelligence?.attentionEconomics).toBeTypeOf('string');
      expect(intelligence?.accessibility).toBeTypeOf('string');
      expect(intelligence?.trustBuilding).toBeTypeOf('string');
      expect(intelligence?.semanticMeaning).toBeTypeOf('string');
    }
  });

  it('should include valid file structures', async () => {
    const registry = await getComponentRegistry();

    for (const component of registry.components) {
      expect(Array.isArray(component.files)).toBe(true);

      for (const file of component.files) {
        expect(file.path).toBeTypeOf('string');
        expect(file.type).toBeTypeOf('string');
        expect(file.content).toBeTypeOf('string');
      }
    }
  });
});
