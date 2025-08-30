import { expect, test } from '@playwright/test';

/**
 * Registry API Integration Tests
 * Tests actual HTTP endpoints against running server
 */

test.describe('Registry API', () => {
  test('should return registry metadata', async ({ request }) => {
    const response = await request.get('/registry');

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data).toHaveProperty('$schema');
    expect(data).toHaveProperty('name');
    expect(data.name).toContain('Rafters');
  });
});
