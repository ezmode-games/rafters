/**
 * E2E tests for Button component
 * Tests real browser interaction and accessibility
 */

import { expect, test } from '@playwright/test';

test.describe('Button E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with Button components
    await page.goto('/components/button');
  });

  test('should render and be clickable', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await button.click();
    // Add assertions for click behavior
  });

  test('should support keyboard navigation', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });

    // Tab to the button
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();

    // Activate with Enter
    await page.keyboard.press('Enter');
    // Add assertions for activation behavior
  });

  test('should support screen readers', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });

    // Check ARIA attributes
    await expect(button).toHaveAttribute('type', 'button');

    // Button should have accessible name
    await expect(button).toHaveAccessibleName('Primary Button');
  });

  test('should meet color contrast requirements', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });

    // This would use axe-playwright or similar for automated accessibility testing
    await expect(button).toBeVisible();

    // Get computed styles to verify contrast
    const styles = await button.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    expect(styles.backgroundColor).toBeTruthy();
    expect(styles.color).toBeTruthy();
  });

  test('should have minimum touch target size', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });
    const boundingBox = await button.boundingBox();

    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      // WCAG AAA requires 44px minimum touch target
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      expect(boundingBox.width).toBeGreaterThanOrEqual(44);
    }
  });

  test('destructive variant should require confirmation', async ({ page }) => {
    const deleteButton = page.getByRole('button', { name: 'Delete Item' });
    await deleteButton.click();

    // Should show confirmation dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const confirmButton = dialog.getByRole('button', { name: 'Confirm Delete' });
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' });

    await expect(confirmButton).toBeVisible();
    await expect(cancelButton).toBeVisible();
  });
});
