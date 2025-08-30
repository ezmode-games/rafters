import { expect, test } from '@playwright/test';

test('registry components endpoint returns component list', async ({ page }) => {
  const response = await page.goto('/registry/components');

  // Check that the response is successful
  expect(response?.status()).toBe(200);

  // Check that it returns JSON content type
  expect(response?.headers()['content-type']).toContain('application/json');

  // Verify the response has components array
  const body = await page.textContent('body');
  const data = JSON.parse(body || '{}');

  expect(data).toHaveProperty('components');
  expect(Array.isArray(data.components)).toBe(true);
});
