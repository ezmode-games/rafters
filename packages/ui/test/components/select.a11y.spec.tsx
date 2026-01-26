/**
 * Select Accessibility Tests (Playwright)
 * @tags @a11y
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../src/components/ui/select';
import { analyzeA11y } from '../a11y-utils';

test.describe('Select - Accessibility @a11y', () => {
  test('has no accessibility violations when closed', async ({ mount, page }) => {
    await mount(
      <Select>
        <SelectTrigger aria-label="Select option">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has no accessibility violations when open', async ({ mount, page }) => {
    await mount(
      <Select open>
        <SelectTrigger aria-label="Select option">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('has no accessibility violations with groups', async ({ mount, page }) => {
    await mount(
      <Select open>
        <SelectTrigger aria-label="Select fruit">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    const results = await analyzeA11y(page);
    expect(results.violations).toEqual([]);
  });

  test('trigger has combobox role', async ({ mount, page }) => {
    await mount(
      <Select>
        <SelectTrigger aria-label="Select option">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = page.getByRole('combobox');
    await expect(trigger).toBeVisible();
  });

  test('trigger has aria-expanded', async ({ mount, page }) => {
    await mount(
      <Select>
        <SelectTrigger aria-label="Select option">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = page.getByRole('combobox');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('options have option role', async ({ mount, page }) => {
    await mount(
      <Select open>
        <SelectTrigger aria-label="Select option">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>,
    );
    const options = page.getByRole('option');
    await expect(options).toHaveCount(2);
  });

  test('keyboard navigation works', async ({ mount, page }) => {
    await mount(
      <Select>
        <SelectTrigger aria-label="Select option">
          <SelectValue placeholder="Choose..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>,
    );

    // Focus and open with keyboard
    const trigger = page.getByRole('combobox');
    await trigger.focus();
    await page.keyboard.press('Enter');

    // Should open listbox
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
  });
});
