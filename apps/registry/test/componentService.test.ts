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
    expect(firstComponent.version).toBeDefined();
    expect(firstComponent.description).toBeDefined();
    expect(firstComponent.intelligence).toBeDefined();
    expect(firstComponent.files).toBeDefined();
    expect(firstComponent.dependencies).toBeDefined();
  });

  it('should return specific component by name', async () => {
    const component = await getComponent('Button');

    expect(component).not.toBeNull();
    expect(component?.name).toBe('Button');
    expect(component?.intelligence.cognitiveLoad).toBeGreaterThan(0);
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

    expect(component1?.name).toBe('Button');
    expect(component2?.name).toBe('Button');
    expect(component3?.name).toBe('Button');
  });

  it('should include all required intelligence fields', async () => {
    const registry = await getComponentRegistry();

    for (const component of registry.components) {
      expect(component.intelligence.cognitiveLoad).toBeTypeOf('number');
      expect(component.intelligence.cognitiveLoad).toBeGreaterThan(0);
      expect(component.intelligence.cognitiveLoad).toBeLessThanOrEqual(10);

      expect(component.intelligence.attentionEconomics).toBeTypeOf('string');
      expect(component.intelligence.accessibility).toBeTypeOf('string');
      expect(component.intelligence.trustBuilding).toBeTypeOf('string');
      expect(component.intelligence.semanticMeaning).toBeTypeOf('string');
    }
  });

  it('should include valid file structures', async () => {
    const registry = await getComponentRegistry();

    for (const component of registry.components) {
      expect(Array.isArray(component.files)).toBe(true);

      for (const file of component.files) {
        expect(file.name).toBeTypeOf('string');
        expect(file.type).toBeTypeOf('string');
        expect(file.content).toBeTypeOf('string');
      }
    }
  });
});
