/**
 * Integration Tests for r-select Primitive
 * Playwright component tests for real browser interactions
 *
 * @testType integration
 * @framework playwright
 * @primitive r-select
 */

import { expect, test } from '@playwright/experimental-ct-react';

test.describe('r-select primitive - Integration Tests', () => {
  test('should render with options', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
        <div slot="option" data-value="3">
          Option 3
        </div>
      </r-select>
    );

    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('role', 'listbox');
  });

  test('should be keyboard navigable', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    const select = page.getByTestId('select');
    await select.focus();
    await page.keyboard.press('ArrowDown');

    // Should update aria-activedescendant
    const activeDescendant = await select.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
  });

  test('should select option with Enter key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Enter');

    const value = await component.getAttribute('value');
    expect(value).toBeTruthy();
  });

  test('should select option with Space key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Space');

    const value = await component.getAttribute('value');
    expect(value).toBeTruthy();
  });

  test('should navigate with arrow keys', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
        <div slot="option" data-value="3">
          Option 3
        </div>
      </r-select>
    );

    await component.focus();

    await page.keyboard.press('ArrowDown');
    const activeAfterDown = await component.getAttribute('aria-activedescendant');

    await page.keyboard.press('ArrowUp');
    const activeAfterUp = await component.getAttribute('aria-activedescendant');

    expect(activeAfterDown).toBeTruthy();
    expect(activeAfterUp).toBeTruthy();
  });

  test('should jump to first option with Home key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
        <div slot="option" data-value="3">
          Option 3
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Home');

    const activeDescendant = await component.getAttribute('aria-activedescendant');
    expect(activeDescendant).toContain('option-0');
  });

  test('should jump to last option with End key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
        <div slot="option" data-value="3">
          Option 3
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('End');

    const activeDescendant = await component.getAttribute('aria-activedescendant');
    expect(activeDescendant).toContain('option-2');
  });

  test('should support single selection mode', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Enter');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const value = await component.getAttribute('value');
    expect(value?.split(',').length).toBe(1);
  });

  test('should support multiple selection mode', async ({ mount, page }) => {
    const component = await mount(
      <r-select multiple data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
        <div slot="option" data-value="3">
          Option 3
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const value = await component.getAttribute('value');
    const values = value?.split(',').filter((v) => v.trim()) || [];
    expect(values.length).toBeGreaterThan(1);
  });

  test('should handle click selection', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    const option = page.locator('[data-value="2"]');
    await option.click();

    const select = page.getByTestId('select');
    const value = await select.getAttribute('value');
    expect(value).toBe('2');
  });

  test('should not respond when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-select disabled data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Enter');

    const value = await component.getAttribute('value');
    expect(value).toBe('');
  });

  test('should support aria-label', async ({ mount }) => {
    const component = await mount(
      <r-select aria-label="Choose an option" data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('aria-label', 'Choose an option');
  });

  test('should set aria-multiselectable based on multiple prop', async ({ mount }) => {
    const singleSelect = await mount(
      <r-select data-testid="single">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    const multipleSelect = await mount(
      <r-select multiple data-testid="multiple">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await expect(singleSelect).toHaveAttribute('aria-multiselectable', 'false');
    await expect(multipleSelect).toHaveAttribute('aria-multiselectable', 'true');
  });

  test('should dispatch change event on selection', async ({ mount, page }) => {
    let eventFired = false;

    await mount(
      <r-select
        data-testid="select"
        {...({
          onRChange: () => {
            eventFired = true;
          },
        } as unknown as Record<string, unknown>)}
      >
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    const select = page.getByTestId('select');
    await select.focus();
    await page.keyboard.press('Enter');

    await page.waitForTimeout(100);
    expect(eventFired).toBe(true);
  });

  test('should be focusable with Tab key', async ({ mount, page }) => {
    const _component = await mount(
      <div>
        <r-select data-testid="select">
          <div slot="option" data-value="1">
            Option 1
          </div>
        </r-select>
      </div>
    );

    await page.keyboard.press('Tab');
    const select = page.getByTestId('select');
    await expect(select).toBeFocused();
  });

  test('should have visible focus indicator', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await component.focus();

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.outlineStyle !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should update aria-selected on options', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1" data-testid="option1">
          Option 1
        </div>
        <div slot="option" data-value="2" data-testid="option2">
          Option 2
        </div>
      </r-select>
    );

    const select = page.getByTestId('select');
    await select.focus();
    await page.keyboard.press('Enter');

    await page.waitForTimeout(100);

    const option1 = page.getByTestId('option1');
    const ariaSelected = await option1.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
  });

  test('should wrap navigation at boundaries', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();

    // Navigate to end
    await page.keyboard.press('End');
    const lastActive = await component.getAttribute('aria-activedescendant');

    // Arrow down should wrap to first
    await page.keyboard.press('ArrowDown');
    const wrappedActive = await component.getAttribute('aria-activedescendant');

    expect(lastActive).not.toBe(wrappedActive);
    expect(wrappedActive).toContain('option-0');
  });

  test('should maintain selection when navigating', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Enter');
    const selectedValue = await component.getAttribute('value');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');

    const currentValue = await component.getAttribute('value');
    expect(currentValue).toBe(selectedValue);
  });
});
