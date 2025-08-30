import { expect, test } from '@playwright/test';

test('registry root returns valid JSON', async ({ page }) => {
  const response = await page.goto('/registry');

  // Check that the response is successful
  expect(response?.status()).toBe(200);

  // Check that it returns JSON content type
  expect(response?.headers()['content-type']).toContain('application/json');

  // Verify the response has the expected registry structure
  const body = await page.textContent('body');
  const data = JSON.parse(body || '{}');

  expect(data).toHaveProperty('$schema');
  expect(data).toHaveProperty('name');
  expect(data.name).toContain('Rafters');
});
