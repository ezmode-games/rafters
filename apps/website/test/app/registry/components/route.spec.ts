import { expect, test } from '@playwright/test';

/**
 * Registry Components API Integration Tests
 * Tests actual HTTP endpoints against running server
 */

test.describe('Registry Components API', () => {
  test('should return all components', async ({ request }) => {
    const response = await request.get('/registry/components');

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty('components');
    expect(Array.isArray(data.components)).toBe(true);
    expect(data.components.length).toBeGreaterThan(0);
  });

  test('should return individual component', async ({ request }) => {
    // First get all components to find a valid name
    const listResponse = await request.get('/registry/components');
    const { components } = await listResponse.json();

    if (components.length > 0) {
      const firstComponent = components[0];
      const response = await request.get(`/registry/components/${firstComponent.name}`);

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('name', firstComponent.name);
      expect(data).toHaveProperty('type');
      expect(data).toHaveProperty('files');
    }
  });

  test('should return 404 for non-existent component', async ({ request }) => {
    const response = await request.get('/registry/components/non-existent-component');
    expect(response.status()).toBe(404);
  });
});
