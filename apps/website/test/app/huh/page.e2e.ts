import { expect, test } from '@playwright/test';

test('huh page loads successfully', async ({ page }) => {
  await page.goto('/huh');

  // Check that the page loads without errors
  await expect(page).not.toHaveTitle(/404|Error/);

  // Check that the page has content
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
