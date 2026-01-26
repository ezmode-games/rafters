/**
 * Pagination Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../src/components/ui/pagination';
import { analyzeA11y } from '../a11y-utils';

test.describe('Pagination - Accessibility @a11y', () => {
  test('has no accessibility violations', async ({ mount, page }) => {
    await mount(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('nav element has navigation role', async ({ mount, page }) => {
    await mount(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('active link has aria-current', async ({ mount, page }) => {
    await mount(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    const activeLink = page.getByRole('link', { name: '1' });
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  test('pagination links are keyboard navigable', async ({ mount, page }) => {
    await mount(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    await page.keyboard.press('Tab');
    const firstLink = page.getByRole('link', { name: '1' });
    await expect(firstLink).toBeFocused();

    await page.keyboard.press('Tab');
    const secondLink = page.getByRole('link', { name: '2' });
    await expect(secondLink).toBeFocused();
  });
});
