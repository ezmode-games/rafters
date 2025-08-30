import { describe, expect, it } from 'vitest';
import { registryManifest } from '../../../src/lib/registry/registryData';

describe('registryManifest', () => {
  it('should have required registry structure', () => {
    expect(registryManifest).toHaveProperty('components');
    expect(registryManifest).toHaveProperty('total');
    expect(registryManifest).toHaveProperty('lastUpdated');
  });

  it('should have components array', () => {
    expect(Array.isArray(registryManifest.components)).toBe(true);
    expect(registryManifest.components.length).toBeGreaterThan(0);
  });

  it('should have valid component structure', () => {
    const component = registryManifest.components[0];

    if (component) {
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('type');
      expect(component).toHaveProperty('path');
      expect(component).toHaveProperty('content');
      expect(typeof component.name).toBe('string');
      expect(typeof component.type).toBe('string');
      expect(typeof component.path).toBe('string');
      expect(typeof component.content).toBe('string');
    }
  });

  it('should have total count matching components length', () => {
    expect(registryManifest.total).toBe(registryManifest.components.length);
  });

  it('should have valid lastUpdated timestamp', () => {
    expect(typeof registryManifest.lastUpdated).toBe('string');
    expect(new Date(registryManifest.lastUpdated)).toBeInstanceOf(Date);
  });
});
