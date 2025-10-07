/**
 * Accessibility Tests for r-radio Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-radio
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/experimental-ct-react';
import '../../../src/primitives/radio/r-radio';
import {
  runAxeScan,
  verifyAriaRole,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
} from '../../a11y-utils';

test.describe('r-radio Primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for default state', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for checked state', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" checked aria-label="Option 1">
          Option 1
        </r-radio>
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for disabled state', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" disabled aria-label="Option 1">
          Option 1
        </r-radio>
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for radio group', async ({ mount, page }) => {
    await mount(
      <fieldset>
        <legend>Choose a color</legend>
        <r-radio name="color" value="red" aria-label="Red">
          Red
        </r-radio>
        <r-radio name="color" value="blue" aria-label="Blue">
          Blue
        </r-radio>
        <r-radio name="color" value="green" aria-label="Green">
          Green
        </r-radio>
      </fieldset>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should have correct ARIA role', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
      </div>
    );
    const radio = page.locator('r-radio');
    const roleCheck = await verifyAriaRole(radio, 'radio');
    expect(roleCheck.passed).toBe(true);
  });

  test('should have aria-checked attribute', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2" checked aria-label="Option 2">
          Option 2
        </r-radio>
      </div>
    );

    const radio1 = page.locator('r-radio[value="option1"]');
    const radio2 = page.locator('r-radio[value="option2"]');

    await expect(radio1).toHaveAttribute('aria-checked', 'false');
    await expect(radio2).toHaveAttribute('aria-checked', 'true');
  });

  test('should meet minimum touch target size (44x44px)', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio
          name="test"
          value="option1"
          aria-label="Option 1"
          style={{ display: 'inline-block', minWidth: '44px', minHeight: '44px' }}
        >
          Option 1
        </r-radio>
      </div>
    );
    const radio = page.locator('r-radio');
    const sizeCheck = await verifyTouchTargetSize(radio, 44);
    expect(sizeCheck.passed).toBe(true);
  });

  test('should be keyboard accessible', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
      </div>
    );
    const radio = page.locator('r-radio');
    const keyboardCheck = await verifyKeyboardAccessible(radio);
    expect(keyboardCheck.passed).toBe(true);
  });

  test('should have visible focus indicator', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio
          name="test"
          value="option1"
          aria-label="Option 1"
          style={{ outline: '2px solid blue' }}
        >
          Option 1
        </r-radio>
      </div>
    );
    const radio = page.locator('r-radio');
    await radio.focus();
    const focusCheck = await verifyFocusIndicator(radio);
    expect(focusCheck.passed).toBe(true);
  });

  test('should update aria-checked when selection changes', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2" aria-label="Option 2">
          Option 2
        </r-radio>
      </div>
    );

    const radio1 = page.locator('r-radio[value="option1"]');
    const radio2 = page.locator('r-radio[value="option2"]');

    // Initially both unchecked
    await expect(radio1).toHaveAttribute('aria-checked', 'false');
    await expect(radio2).toHaveAttribute('aria-checked', 'false');

    // Click first radio
    await radio1.click();
    await expect(radio1).toHaveAttribute('aria-checked', 'true');
    await expect(radio2).toHaveAttribute('aria-checked', 'false');

    // Click second radio
    await radio2.click();
    await expect(radio1).toHaveAttribute('aria-checked', 'false');
    await expect(radio2).toHaveAttribute('aria-checked', 'true');
  });

  test('should support aria-label for accessibility', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Select option 1">
          1
        </r-radio>
      </div>
    );
    const radio = page.locator('r-radio');
    await expect(radio).toHaveAttribute('aria-label', 'Select option 1');
  });

  test('should support aria-labelledby', async ({ mount, page }) => {
    const labelId = `label-${Math.random().toString(36).substring(7)}`;
    await mount(
      <div>
        <span id={labelId}>Option 1</span>
        <r-radio name="test" value="option1" aria-labelledby={labelId}>
          Option 1
        </r-radio>
      </div>
    );
    const radio = page.locator('r-radio');
    await expect(radio).toHaveAttribute('aria-labelledby', labelId);
  });

  test('should support aria-describedby', async ({ mount, page }) => {
    const descId = `desc-${Math.random().toString(36).substring(7)}`;
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1" aria-describedby={descId}>
          Option 1
        </r-radio>
        <span id={descId}>This is the first option</span>
      </div>
    );
    const radio = page.locator('r-radio');
    await expect(radio).toHaveAttribute('aria-describedby', descId);
  });

  test('should handle keyboard navigation for accessibility', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2" aria-label="Option 2">
          Option 2
        </r-radio>
        <r-radio name="test" value="option3" aria-label="Option 3">
          Option 3
        </r-radio>
      </div>
    );

    const radio1 = page.locator('r-radio[value="option1"]');
    const radio2 = page.locator('r-radio[value="option2"]');
    const radio3 = page.locator('r-radio[value="option3"]');

    // Tab to first radio (wait for roving tabindex)
    await page.waitForTimeout(50);
    await page.keyboard.press('Tab');
    await expect(radio1).toBeFocused();

    // Use arrow keys to navigate
    await page.keyboard.press('ArrowDown');
    await expect(radio2).toBeFocused();
    await expect(radio2).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('ArrowDown');
    await expect(radio3).toBeFocused();
    await expect(radio3).toHaveAttribute('aria-checked', 'true');
  });

  test('should implement roving tabindex for efficient keyboard navigation', async ({
    mount,
    page,
  }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" aria-label="Option 1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2" aria-label="Option 2">
          Option 2
        </r-radio>
        <r-radio name="test" value="option3" aria-label="Option 3">
          Option 3
        </r-radio>
      </div>
    );

    // Wait for connectedCallback setTimeout
    await page.waitForTimeout(50);

    const radio1 = page.locator('r-radio[value="option1"]');
    const radio2 = page.locator('r-radio[value="option2"]');
    const radio3 = page.locator('r-radio[value="option3"]');

    // Only first radio should be tabbable initially
    await expect(radio1).toHaveAttribute('tabindex', '0');
    await expect(radio2).toHaveAttribute('tabindex', '-1');
    await expect(radio3).toHaveAttribute('tabindex', '-1');

    // After selecting second radio, only it should be tabbable
    await radio2.click();
    await expect(radio1).toHaveAttribute('tabindex', '-1');
    await expect(radio2).toHaveAttribute('tabindex', '0');
    await expect(radio3).toHaveAttribute('tabindex', '-1');
  });

  test('should handle disabled state properly for screen readers', async ({ mount, page }) => {
    await mount(
      <div>
        <r-radio name="test" value="option1" disabled aria-label="Option 1">
          Option 1
        </r-radio>
      </div>
    );

    const radio = page.locator('r-radio');
    await expect(radio).toHaveAttribute('disabled');
    await expect(radio).toHaveAttribute('aria-checked', 'false');

    // Disabled radios should not be clickable
    await radio.click({ force: true });
    await expect(radio).toHaveAttribute('aria-checked', 'false');
  });
});
