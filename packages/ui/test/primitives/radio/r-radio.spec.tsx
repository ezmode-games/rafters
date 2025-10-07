/**
 * Playwright Component Tests for r-radio Primitive
 * Tests visual rendering and interactive behavior in real browser
 *
 * @testType component
 * @framework playwright
 * @primitive r-radio
 */

import { expect, test } from '@playwright/experimental-ct-react';
import '../../../src/primitives/radio/r-radio';

test.describe('r-radio Primitive - Visual Rendering', () => {
  test('should render radio button', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1">
          Option 1
        </r-radio>
      </div>
    );
    await expect(component.locator('r-radio')).toBeVisible();
    await expect(component.locator('r-radio')).toHaveAttribute('role', 'radio');
  });

  test('should render checked radio', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1" checked>
          Option 1
        </r-radio>
      </div>
    );
    const radio = component.locator('r-radio');
    await expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  test('should render disabled radio', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1" disabled>
          Option 1
        </r-radio>
      </div>
    );
    const radio = component.locator('r-radio');
    await expect(radio).toHaveAttribute('disabled');
  });
});

test.describe('r-radio Primitive - Group Behavior', () => {
  test('should only allow one radio to be checked in a group', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="color" value="red">
          Red
        </r-radio>
        <r-radio name="color" value="blue">
          Blue
        </r-radio>
        <r-radio name="color" value="green">
          Green
        </r-radio>
      </div>
    );

    const radio1 = component.locator('r-radio[value="red"]');
    const radio2 = component.locator('r-radio[value="blue"]');
    const radio3 = component.locator('r-radio[value="green"]');

    // Click first radio
    await radio1.click();
    await expect(radio1).toHaveAttribute('aria-checked', 'true');
    await expect(radio2).toHaveAttribute('aria-checked', 'false');
    await expect(radio3).toHaveAttribute('aria-checked', 'false');

    // Click second radio
    await radio2.click();
    await expect(radio1).toHaveAttribute('aria-checked', 'false');
    await expect(radio2).toHaveAttribute('aria-checked', 'true');
    await expect(radio3).toHaveAttribute('aria-checked', 'false');
  });

  test('should not affect radios in different groups', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="color" value="red">
          Red
        </r-radio>
        <r-radio name="size" value="small">
          Small
        </r-radio>
      </div>
    );

    const colorRadio = component.locator('r-radio[name="color"]');
    const sizeRadio = component.locator('r-radio[name="size"]');

    await colorRadio.click();
    await sizeRadio.click();

    await expect(colorRadio).toHaveAttribute('aria-checked', 'true');
    await expect(sizeRadio).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('r-radio Primitive - Keyboard Navigation', () => {
  test('should select radio with Space key', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1">
          Option 1
        </r-radio>
      </div>
    );

    const radio = component.locator('r-radio');
    await radio.focus();
    await radio.press('Space');

    await expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  test('should navigate with Arrow keys', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2">
          Option 2
        </r-radio>
        <r-radio name="test" value="option3">
          Option 3
        </r-radio>
      </div>
    );

    const radio1 = component.locator('r-radio[value="option1"]');
    const radio2 = component.locator('r-radio[value="option2"]');
    const radio3 = component.locator('r-radio[value="option3"]');

    // Focus first radio and select it
    await radio1.focus();
    await radio1.press('Space');
    await expect(radio1).toHaveAttribute('aria-checked', 'true');

    // Navigate to second radio with ArrowDown
    await radio1.press('ArrowDown');
    await expect(radio2).toHaveAttribute('aria-checked', 'true');
    await expect(radio1).toHaveAttribute('aria-checked', 'false');

    // Navigate to third radio with ArrowDown
    await radio2.press('ArrowDown');
    await expect(radio3).toHaveAttribute('aria-checked', 'true');
    await expect(radio2).toHaveAttribute('aria-checked', 'false');

    // Wrap around to first radio
    await radio3.press('ArrowDown');
    await expect(radio1).toHaveAttribute('aria-checked', 'true');
    await expect(radio3).toHaveAttribute('aria-checked', 'false');
  });

  test('should navigate with ArrowUp and ArrowLeft', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2">
          Option 2
        </r-radio>
      </div>
    );

    const radio1 = component.locator('r-radio[value="option1"]');
    const radio2 = component.locator('r-radio[value="option2"]');

    // Select second radio
    await radio2.click();
    await expect(radio2).toHaveAttribute('aria-checked', 'true');

    // Navigate to first radio with ArrowUp
    await radio2.press('ArrowUp');
    await expect(radio1).toHaveAttribute('aria-checked', 'true');
    await expect(radio2).toHaveAttribute('aria-checked', 'false');

    // Navigate back with ArrowLeft
    await radio1.press('ArrowDown');
    await radio2.press('ArrowLeft');
    await expect(radio1).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('r-radio Primitive - Disabled State', () => {
  test('should not respond to clicks when disabled', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1" disabled>
          Option 1
        </r-radio>
      </div>
    );

    const radio = component.locator('r-radio');
    await radio.click({ force: true });

    await expect(radio).toHaveAttribute('aria-checked', 'false');
  });

  test('should skip disabled radios during keyboard navigation', async ({ mount }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2" disabled>
          Option 2
        </r-radio>
        <r-radio name="test" value="option3">
          Option 3
        </r-radio>
      </div>
    );

    const radio1 = component.locator('r-radio[value="option1"]');
    const radio2 = component.locator('r-radio[value="option2"]');
    const radio3 = component.locator('r-radio[value="option3"]');

    // Select first radio
    await radio1.click();
    await expect(radio1).toHaveAttribute('aria-checked', 'true');

    // Navigate with ArrowDown - should skip disabled radio2
    await radio1.press('ArrowDown');
    await expect(radio3).toHaveAttribute('aria-checked', 'true');
    await expect(radio2).toHaveAttribute('aria-checked', 'false');
  });
});

test.describe('r-radio Primitive - Roving Tabindex', () => {
  test('should have only one radio tabbable at a time', async ({ mount, page }) => {
    const component = await mount(
      <div>
        <r-radio name="test" value="option1">
          Option 1
        </r-radio>
        <r-radio name="test" value="option2">
          Option 2
        </r-radio>
        <r-radio name="test" value="option3">
          Option 3
        </r-radio>
      </div>
    );

    // Wait for connectedCallback setTimeout
    await page.waitForTimeout(50);

    const radio1 = component.locator('r-radio[value="option1"]');
    const radio2 = component.locator('r-radio[value="option2"]');
    const radio3 = component.locator('r-radio[value="option3"]');

    // First radio should be tabbable by default
    await expect(radio1).toHaveAttribute('tabindex', '0');
    await expect(radio2).toHaveAttribute('tabindex', '-1');
    await expect(radio3).toHaveAttribute('tabindex', '-1');

    // After selecting second radio, it should become tabbable
    await radio2.click();
    await expect(radio1).toHaveAttribute('tabindex', '-1');
    await expect(radio2).toHaveAttribute('tabindex', '0');
    await expect(radio3).toHaveAttribute('tabindex', '-1');
  });
});
