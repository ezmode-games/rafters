/**
 * Tests for registry metadata endpoints
 */

import { describe, expect, it } from 'vitest';
import app from '../src/index';

describe('Registry Metadata API', () => {
  it('should return complete registry metadata', async () => {
    const res = await app.request('/registry');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.$schema).toBe('https://rafters.dev/schemas/registry.json');
    expect(data.name).toBe('Rafters AI Design Intelligence Registry');
    expect(data.components).toBeDefined();
    expect(Array.isArray(data.components)).toBe(true);
    expect(data.totalComponents).toBeGreaterThan(0);
    expect(data.lastUpdated).toBeDefined();
  });

  it('should return registry statistics', async () => {
    const res = await app.request('/registry/stats');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.totalComponents).toBeGreaterThan(0);
    expect(data.categories).toBeDefined();
    expect(data.averageCognitiveLoad).toBeGreaterThan(0);
    expect(data.dependencyCount).toBeGreaterThanOrEqual(0);
  });

  it('should include cognitive load in component summaries', async () => {
    const res = await app.request('/registry');
    expect(res.status).toBe(200);

    const data = await res.json();
    const firstComponent = data.components[0];

    expect(firstComponent.cognitiveLoad).toBeTypeOf('number');
    expect(firstComponent.cognitiveLoad).toBeGreaterThan(0);
    expect(firstComponent.cognitiveLoad).toBeLessThanOrEqual(10);
  });

  it('should categorize components properly', async () => {
    const res = await app.request('/registry/stats');
    expect(res.status).toBe(200);

    const data = await res.json();
    const categories = Object.keys(data.categories);

    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('registry:component'); // All components should be this type

    // Verify category counts add up to total
    const totalFromCategories = Object.values(data.categories).reduce(
      (sum: number, count) => sum + (count as number),
      0
    );
    expect(totalFromCategories).toBe(data.totalComponents);
  });
});
