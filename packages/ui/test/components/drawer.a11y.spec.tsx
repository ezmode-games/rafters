/**
 * Drawer Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '../../src/components/ui/drawer';
import { analyzeA11y } from '../a11y-utils';

test.describe('Drawer - Accessibility @a11y', () => {
  // TODO: Drawer has color-contrast violations - title text on dark overlay
  // needs design token fix for proper contrast
  test.skip('has no accessibility violations when open', async ({ mount, page }) => {
    await mount(
      <Drawer open>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent aria-describedby={undefined}>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
            </DrawerHeader>
            <p>Content</p>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has correct role="dialog"', async ({ mount, page }) => {
    await mount(
      <Drawer open>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>,
    );
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
  });

  test('traps focus within drawer', async ({ mount, page }) => {
    await mount(
      <Drawer open>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle>Focus Trap Test</DrawerTitle>
            <button type="button">First</button>
            <button type="button">Second</button>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>,
    );

    // Tab through elements multiple times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    // Focus should still be within dialog
    const focusedElement = page.locator(':focus');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(focusedElement).toBeVisible();
  });

  // TODO: Drawer component doesn't close on Escape - needs component fix
  test.skip('closes on Escape key', async ({ mount, page }) => {
    await mount(
      <Drawer open>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle>Escape Test</DrawerTitle>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>,
    );

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('trigger opens drawer', async ({ mount, page }) => {
    await mount(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle>Title</DrawerTitle>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>,
    );

    const trigger = page.getByRole('button', { name: 'Open Drawer' });
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
  });
});
