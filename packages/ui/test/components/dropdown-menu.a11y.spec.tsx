/**
 * DropdownMenu Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../src/components/ui/dropdown-menu';
import { analyzeA11y } from '../a11y-utils';

test.describe('DropdownMenu - Accessibility @a11y', () => {
  test('has no accessibility violations when open', async ({ mount, page }) => {
    await mount(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('menu items have menuitem role', async ({ mount, page }) => {
    await mount(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const menuItems = page.getByRole('menuitem');
    await expect(menuItems).toHaveCount(2);
  });

  test('trigger has aria-haspopup', async ({ mount, page }) => {
    await mount(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = page.getByRole('button', { name: 'Open Menu' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  });

  test('separator is semantic hr element', async ({ mount, page }) => {
    await mount(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const separator = page.locator('hr');
    await expect(separator).toHaveCount(1);
  });
});
