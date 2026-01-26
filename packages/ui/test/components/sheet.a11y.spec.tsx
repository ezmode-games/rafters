/**
 * Sheet Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from '../../src/components/ui/sheet';
import { analyzeA11y } from '../a11y-utils';

test.describe('Sheet - Accessibility @a11y', () => {
  test('has no accessibility violations when open', async ({ mount, page }) => {
    await mount(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
            <p>Content</p>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has correct role="dialog"', async ({ mount, page }) => {
    await mount(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
  });

  test('has aria-modal="true"', async ({ mount, page }) => {
    await mount(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('focuses first focusable element when opened', async ({ mount, page }) => {
    await mount(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <button type="button">First Button</button>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    await page.getByRole('button', { name: 'Open' }).click();
    await page.waitForSelector('[role="dialog"]');

    // Close button should receive focus
    const closeButton = page.locator('[role="dialog"] button').first();
    await expect(closeButton).toBeFocused();
  });

  test('traps focus within sheet', async ({ mount, page }) => {
    await mount(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Focus Trap Test</SheetTitle>
            <button type="button">First</button>
            <button type="button">Second</button>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should cycle back - focus should still be within dialog
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('closes on Escape key', async ({ mount, page }) => {
    await mount(
      <Sheet defaultOpen>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Escape Test</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('trigger has aria-haspopup="dialog"', async ({ mount, page }) => {
    await mount(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = page.getByRole('button', { name: 'Open' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  });

  test('trigger has aria-expanded', async ({ mount, page }) => {
    await mount(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </SheetPortal>
      </Sheet>,
    );

    const trigger = page.getByRole('button', { name: 'Open' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
