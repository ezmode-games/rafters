import { expect, test } from '@playwright/test';

test('page loads and displays logo', async ({ page }) => {
  await page.goto('/');

  // Check that the page loads successfully
  await expect(page).toHaveTitle(/Rafters/);

  // Look for the logo SVG (Logo component from @rafters/shared)
  const logo = page.locator('header svg').first();
  await expect(logo).toBeVisible();
});
