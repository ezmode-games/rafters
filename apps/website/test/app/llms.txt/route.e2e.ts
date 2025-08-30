import { expect, test } from '@playwright/test';

test('llms.txt route returns valid content', async ({ page }) => {
  const response = await page.goto('/llms.txt');

  // Check that the response is successful
  expect(response?.status()).toBe(200);

  // Check that it returns text/plain content type
  expect(response?.headers()['content-type']).toContain('text/plain');

  // Check that the content contains expected llms.txt format
  const content = await page.textContent('body');
  expect(content).toContain('Rafters');
  expect(content).toContain('Design Intelligence');
});
