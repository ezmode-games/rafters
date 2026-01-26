/**
 * ContextMenu Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../src/components/ui/context-menu';
import { analyzeA11y } from '../a11y-utils';

test.describe('ContextMenu - Accessibility @a11y', () => {
  test('has no accessibility violations when open', async ({ mount, page }) => {
    await mount(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Edit</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    // Right-click to open
    const trigger = page.getByText('Right click me');
    await trigger.click({ button: 'right' });

    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('menu items have menuitem role', async ({ mount, page }) => {
    await mount(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Edit</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const trigger = page.getByText('Right click me');
    await trigger.click({ button: 'right' });

    const menuItems = page.getByRole('menuitem');
    await expect(menuItems).toHaveCount(2);
  });

  test('separator is semantic hr element', async ({ mount, page }) => {
    await mount(
      <ContextMenu>
        <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Edit</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    const trigger = page.getByText('Right click me');
    await trigger.click({ button: 'right' });

    const separator = page.locator('hr');
    await expect(separator).toHaveCount(1);
  });
});
