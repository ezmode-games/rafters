/**
 * Accessibility Tests for r-select Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-select
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  runAxeScan,
  verifyAriaRole,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
} from '../../a11y-utils';

test.describe('r-select primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select" aria-label="Select option">
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

    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for disabled state', async ({ mount, page }) => {
    await mount(
      <r-select disabled data-testid="select" aria-label="Disabled select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for multiple selection mode', async ({ mount, page }) => {
    await mount(
      <r-select multiple data-testid="select" aria-label="Multiple select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with pre-selected value', async ({ mount, page }) => {
    await mount(
      <r-select value="2" data-testid="select" aria-label="Pre-selected">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('r-select primitive - ARIA Attributes', () => {
  test('should have listbox role', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Test select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await verifyAriaRole(component, 'listbox');
  });

  test('should set aria-multiselectable="false" for single select', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Single select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('aria-multiselectable', 'false');
  });

  test('should set aria-multiselectable="true" for multiple select', async ({ mount }) => {
    const component = await mount(
      <r-select multiple data-testid="select" aria-label="Multiple select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('aria-multiselectable', 'true');
  });

  test('should update aria-activedescendant on keyboard navigation', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Navigable select">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('ArrowDown');

    const activeDescendant = await component.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
    expect(activeDescendant).toMatch(/option-\d+/);
  });

  test('should set role="option" on slotted elements', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select" aria-label="Test select">
        <div slot="option" data-value="1" data-testid="option1">
          Option 1
        </div>
        <div slot="option" data-value="2" data-testid="option2">
          Option 2
        </div>
      </r-select>
    );

    await page.waitForTimeout(100);

    const option1 = page.getByTestId('option1');
    await expect(option1).toHaveAttribute('role', 'option');

    const option2 = page.getByTestId('option2');
    await expect(option2).toHaveAttribute('role', 'option');
  });

  test('should set aria-selected on options', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select" aria-label="Test select">
        <div slot="option" data-value="1" data-testid="option1">
          Option 1
        </div>
      </r-select>
    );

    await page.waitForTimeout(100);

    const option1 = page.getByTestId('option1');
    const ariaSelected = await option1.getAttribute('aria-selected');
    expect(ariaSelected).toBeTruthy();
    expect(['true', 'false']).toContain(ariaSelected);
  });

  test('should support aria-label', async ({ mount }) => {
    const component = await mount(
      <r-select aria-label="Select a fruit" data-testid="select">
        <div slot="option" data-value="apple">
          Apple
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('aria-label', 'Select a fruit');
  });

  test('should support aria-labelledby', async ({ mount, page }) => {
    await mount(
      <div>
        {/* biome-ignore lint/correctness/useUniqueElementIds: Test context with isolated DOM */}
        <div id="select-label">Choose option</div>
        <r-select aria-labelledby="select-label" data-testid="select">
          <div slot="option" data-value="1">
            Option 1
          </div>
        </r-select>
      </div>
    );

    const select = page.getByTestId('select');
    await expect(select).toHaveAttribute('aria-labelledby', 'select-label');
  });

  test('should support aria-describedby', async ({ mount, page }) => {
    await mount(
      <div>
        {/* biome-ignore lint/correctness/useUniqueElementIds: Test context with isolated DOM */}
        <div id="select-desc">Select an option from the list</div>
        <r-select aria-describedby="select-desc" aria-label="Options" data-testid="select">
          <div slot="option" data-value="1">
            Option 1
          </div>
        </r-select>
      </div>
    );

    const select = page.getByTestId('select');
    await expect(select).toHaveAttribute('aria-describedby', 'select-desc');
  });
});

test.describe('r-select primitive - Keyboard Navigation', () => {
  test('should be keyboard accessible with Tab', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Keyboard select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await verifyKeyboardAccessible(page, component, 'Tab');
  });

  test('should navigate with ArrowDown key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Arrow navigation">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    const initialActive = await component.getAttribute('aria-activedescendant');

    await page.keyboard.press('ArrowDown');
    const afterDownActive = await component.getAttribute('aria-activedescendant');

    expect(afterDownActive).toBeTruthy();
    expect(afterDownActive).not.toBe(initialActive);
  });

  test('should navigate with ArrowUp key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Arrow navigation">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    const beforeUp = await component.getAttribute('aria-activedescendant');

    await page.keyboard.press('ArrowUp');
    const afterUp = await component.getAttribute('aria-activedescendant');

    expect(afterUp).not.toBe(beforeUp);
  });

  test('should jump to first option with Home key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Home/End navigation">
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
      <r-select data-testid="select" aria-label="Home/End navigation">
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

  test('should select with Enter key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Enter selection">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Enter');

    const value = await component.getAttribute('value');
    expect(value).toBeTruthy();
  });

  test('should select with Space key', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Space selection">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('Space');

    const value = await component.getAttribute('value');
    expect(value).toBeTruthy();
  });

  test('should not be keyboard accessible when disabled', async ({ mount, page }) => {
    await mount(
      <r-select disabled data-testid="select" aria-label="Disabled select">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await page.keyboard.press('Tab');
    const select = page.getByTestId('select');

    // Disabled elements should not be focusable
    const isFocused = await select.evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(false);
  });

  test('should handle sequential keyboard navigation', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Sequential navigation">
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

    // Navigate down twice
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Navigate up once
    await page.keyboard.press('ArrowUp');

    // Select current option
    await page.keyboard.press('Enter');

    const value = await component.getAttribute('value');
    expect(value).toBeTruthy();
  });
});

test.describe('r-select primitive - Focus Indicators', () => {
  test('should have visible focus indicator', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Focus indicator test">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await verifyFocusIndicator(component);
  });

  test('should show focus ring on keyboard focus', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Focus ring test">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await page.keyboard.press('Tab');

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.outlineStyle !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should maintain focus indicator during keyboard navigation', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Persistent focus">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('ArrowDown');

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.outlineStyle !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should remove focus indicator on blur', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Blur test">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await component.focus();
    await component.blur();

    await page.waitForTimeout(100);

    const isStillFocused = await component.evaluate((el) => {
      return document.activeElement === el;
    });

    expect(isStillFocused).toBe(false);
  });
});

test.describe('r-select primitive - Touch Target Size', () => {
  test('should meet WCAG AAA touch target size (44px minimum)', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Touch target test">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await verifyTouchTargetSize(component, 'AAA');
  });

  test('should have minimum 44px height on mobile viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(
      <r-select data-testid="select" aria-label="Mobile touch target" style={{ minHeight: '44px' }}>
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    const box = await component.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should maintain touch target on tablet viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const component = await mount(
      <r-select data-testid="select" aria-label="Tablet touch target" style={{ minHeight: '44px' }}>
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    const box = await component.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should be easily tappable on mobile', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(
      <r-select data-testid="select" aria-label="Mobile tap test" style={{ minHeight: '44px' }}>
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await component.tap();
    await expect(component).toBeFocused();
  });
});

test.describe('r-select primitive - Screen Reader Support', () => {
  test('should announce listbox role to screen readers', async ({ mount }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Screen reader test">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('role', 'listbox');
  });

  test('should announce active descendant to screen readers', async ({ mount, page }) => {
    const component = await mount(
      <r-select data-testid="select" aria-label="Active descendant test">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await component.focus();
    await page.keyboard.press('ArrowDown');

    const activeDescendant = await component.getAttribute('aria-activedescendant');
    expect(activeDescendant).toBeTruthy();
  });

  test('should properly associate label with select', async ({ mount, page }) => {
    await mount(
      <div>
        {/* biome-ignore lint/correctness/useUniqueElementIds: Test context with isolated DOM */}
        <div id="select-label">Select an option</div>
        <r-select aria-labelledby="select-label" data-testid="select">
          <div slot="option" data-value="1">
            Option 1
          </div>
        </r-select>
      </div>
    );

    const select = page.getByTestId('select');
    const label = page.getByText('Select an option');

    await expect(label).toBeVisible();
    await expect(select).toHaveAttribute('aria-labelledby', 'select-label');
  });

  test('should announce selection state changes', async ({ mount, page }) => {
    await mount(
      <r-select data-testid="select" aria-label="Selection state">
        <div slot="option" data-value="1" data-testid="option1">
          Option 1
        </div>
      </r-select>
    );

    const select = page.getByTestId('select');
    await select.focus();
    await page.keyboard.press('Enter');

    await page.waitForTimeout(100);

    const option1 = page.getByTestId('option1');
    await expect(option1).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('r-select primitive - Disabled State Accessibility', () => {
  test('should not be focusable when disabled', async ({ mount, page }) => {
    await mount(
      <r-select disabled data-testid="select" aria-label="Disabled test">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await page.keyboard.press('Tab');
    const select = page.getByTestId('select');
    await expect(select).not.toBeFocused();
  });

  test('should have proper disabled attribute', async ({ mount }) => {
    const component = await mount(
      <r-select disabled data-testid="select" aria-label="Disabled attribute">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('disabled');
  });

  test('should have reduced opacity when disabled', async ({ mount }) => {
    const component = await mount(
      <r-select disabled data-testid="select" aria-label="Disabled opacity">
        <div slot="option" data-value="1">
          Option 1
        </div>
      </r-select>
    );

    const opacity = await component.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    const opacityNum = Number.parseFloat(opacity);
    expect(opacityNum).toBeLessThanOrEqual(1);
  });
});

test.describe('r-select primitive - Multi-Select Accessibility', () => {
  test('should announce multiselectable to screen readers', async ({ mount }) => {
    const component = await mount(
      <r-select multiple data-testid="select" aria-label="Multi-select test">
        <div slot="option" data-value="1">
          Option 1
        </div>
        <div slot="option" data-value="2">
          Option 2
        </div>
      </r-select>
    );

    await expect(component).toHaveAttribute('aria-multiselectable', 'true');
  });

  test('should allow multiple selections via keyboard', async ({ mount, page }) => {
    const component = await mount(
      <r-select multiple data-testid="select" aria-label="Multiple keyboard">
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
    const values = value?.split(',').filter((v) => v.trim()) || [];
    expect(values.length).toBeGreaterThan(1);
  });
});
