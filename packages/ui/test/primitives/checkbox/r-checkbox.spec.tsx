/**
 * Playwright Integration Tests for r-checkbox Primitive
 * Tests visual rendering and interactive behavior in real browser
 *
 * @testType integration
 * @framework playwright
 * @primitive r-checkbox
 */

import { expect, test } from '@playwright/experimental-ct-react';
import type { RCheckbox } from '../../../src/primitives/checkbox/r-checkbox';

// Ensure the primitive is registered
import '../../../src/primitives/checkbox/r-checkbox';

test.describe('r-checkbox Primitive - Visual Rendering', () => {
  test('should render unchecked by default', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Accept terms</r-checkbox>);
    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('aria-checked', 'false');
    await expect(component).not.toHaveAttribute('checked');
  });

  test('should render checked state', async ({ mount }) => {
    const component = await mount(
      <r-checkbox checked data-testid="checkbox">
        Enabled
      </r-checkbox>
    );
    await expect(component).toHaveAttribute('aria-checked', 'true');
    await expect(component).toHaveAttribute('checked');
  });

  test('should render indeterminate state', async ({ mount }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Partially selected
      </r-checkbox>
    );
    await expect(component).toHaveAttribute('aria-checked', 'mixed');
    await expect(component).toHaveAttribute('indeterminate');
  });

  test('should render disabled state', async ({ mount }) => {
    const component = await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled
      </r-checkbox>
    );
    await expect(component).toHaveAttribute('disabled');
  });

  test('should display slotted content', async ({ mount }) => {
    const component = await mount(
      <r-checkbox data-testid="checkbox">Accept all terms and conditions</r-checkbox>
    );
    await expect(component).toContainText('Accept all terms and conditions');
  });
});

test.describe('r-checkbox Primitive - Click Interactions', () => {
  test('should toggle on click', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Click me</r-checkbox>);

    // Initially unchecked
    await expect(component).toHaveAttribute('aria-checked', 'false');

    // Click to check
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'true');

    // Click to uncheck
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should clear indeterminate on click', async ({ mount }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Partial
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('aria-checked', 'mixed');

    // Click should clear indeterminate and set checked
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'true');
    await expect(component).not.toHaveAttribute('indeterminate');
  });

  test('should not toggle when disabled', async ({ mount }) => {
    const component = await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.click({ force: true });
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });
});

test.describe('r-checkbox Primitive - Keyboard Navigation', () => {
  test('should be focusable via tab', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Focus me</r-checkbox>);

    await page.keyboard.press('Tab');
    await expect(component).toBeFocused();
  });

  test('should toggle on Space key', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Space toggle</r-checkbox>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should not toggle on Enter key', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Enter test</r-checkbox>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Enter');
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should not be focusable when disabled', async ({ mount, page }) => {
    await mount(
      <div>
        <r-checkbox data-testid="checkbox1">First</r-checkbox>
        <r-checkbox disabled data-testid="checkbox2">
          Disabled
        </r-checkbox>
        <r-checkbox data-testid="checkbox3">Third</r-checkbox>
      </div>
    );

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox1')).toBeFocused();

    await page.keyboard.press('Tab');
    // Should skip disabled and focus third
    await expect(page.getByTestId('checkbox3')).toBeFocused();
  });

  test('should navigate between multiple checkboxes with tab', async ({ mount, page }) => {
    await mount(
      <div>
        <r-checkbox data-testid="checkbox1">First</r-checkbox>
        <r-checkbox data-testid="checkbox2">Second</r-checkbox>
        <r-checkbox data-testid="checkbox3">Third</r-checkbox>
      </div>
    );

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox1')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox2')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox3')).toBeFocused();
  });
});

test.describe('r-checkbox Primitive - Focus Management', () => {
  test('should show focus indicator on keyboard focus', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Focus indicator</r-checkbox>);

    await page.keyboard.press('Tab');
    await expect(component).toBeFocused();

    // Check if there's a focus ring (outline or box-shadow)
    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should maintain focus during state changes', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Maintain focus</r-checkbox>);

    await component.focus();
    await expect(component).toBeFocused();

    await page.keyboard.press('Space');
    await expect(component).toBeFocused();

    await page.keyboard.press('Space');
    await expect(component).toBeFocused();
  });

  test('should blur on tab away', async ({ mount, page }) => {
    await mount(
      <div>
        <r-checkbox data-testid="checkbox1">First</r-checkbox>
        <r-checkbox data-testid="checkbox2">Second</r-checkbox>
      </div>
    );

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox1')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox1')).not.toBeFocused();
    await expect(page.getByTestId('checkbox2')).toBeFocused();
  });
});

test.describe('r-checkbox Primitive - ARIA Attributes', () => {
  test('should have checkbox role', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">ARIA role</r-checkbox>);
    await expect(component).toHaveAttribute('role', 'checkbox');
  });

  test('should have aria-checked="false" when unchecked', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Unchecked</r-checkbox>);
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should have aria-checked="true" when checked', async ({ mount }) => {
    const component = await mount(
      <r-checkbox checked data-testid="checkbox">
        Checked
      </r-checkbox>
    );
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });

  test('should have aria-checked="mixed" when indeterminate', async ({ mount }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Indeterminate
      </r-checkbox>
    );
    await expect(component).toHaveAttribute('aria-checked', 'mixed');
  });

  test('should update aria-checked on interaction', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Toggle ARIA</r-checkbox>);

    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.focus();
    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should support aria-label', async ({ mount }) => {
    const component = await mount(
      <r-checkbox aria-label="Accept privacy policy" data-testid="checkbox" />
    );
    await expect(component).toHaveAttribute('aria-label', 'Accept privacy policy');
  });

  test('should support aria-labelledby', async ({ mount }) => {
    await mount(
      <div>
        <span id="label-id">Custom label</span>
        <r-checkbox aria-labelledby="label-id" data-testid="checkbox" />
      </div>
    );
    const checkbox = await mount.page.getByTestId('checkbox');
    await expect(checkbox).toHaveAttribute('aria-labelledby', 'label-id');
  });
});

test.describe('r-checkbox Primitive - Form Integration', () => {
  test('should have name attribute', async ({ mount }) => {
    const component = await mount(
      <r-checkbox name="terms" data-testid="checkbox">
        Terms
      </r-checkbox>
    );
    const name = await component.evaluate((el: HTMLElement) => {
      return (el as RCheckbox).name;
    });
    expect(name).toBe('terms');
  });

  test('should have value attribute', async ({ mount }) => {
    const component = await mount(
      <r-checkbox value="accepted" data-testid="checkbox">
        Accept
      </r-checkbox>
    );
    const value = await component.evaluate((el: HTMLElement) => {
      return (el as RCheckbox).value;
    });
    expect(value).toBe('accepted');
  });

  test('should pass form data in change event', async ({ mount, page }) => {
    const component = await mount(
      <r-checkbox name="newsletter" value="yes" data-testid="checkbox">
        Subscribe
      </r-checkbox>
    );

    let eventDetail: unknown;
    await page.evaluate(() => {
      document.addEventListener('r-checkbox-change', (e: Event) => {
        const customEvent = e as CustomEvent;
        (window as any).lastEventDetail = customEvent.detail;
      });
    });

    await component.click();
    await page.waitForTimeout(100);

    eventDetail = await page.evaluate(() => (window as any).lastEventDetail);
    expect(eventDetail).toMatchObject({
      checked: true,
      indeterminate: false,
      name: 'newsletter',
      value: 'yes',
    });
  });
});

test.describe('r-checkbox Primitive - Tri-State Behavior', () => {
  test('should transition from indeterminate to checked on click', async ({ mount }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Tri-state
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('aria-checked', 'mixed');
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });

  test('should transition from checked to unchecked on second click', async ({ mount }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Tri-state
      </r-checkbox>
    );

    await component.click(); // indeterminate -> checked
    await expect(component).toHaveAttribute('aria-checked', 'true');

    await component.click(); // checked -> unchecked
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should maintain checked state without indeterminate', async ({ mount }) => {
    const component = await mount(
      <r-checkbox checked data-testid="checkbox">
        Regular checked
      </r-checkbox>
    );

    await component.click(); // checked -> unchecked
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.click(); // unchecked -> checked
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('r-checkbox Primitive - Touch Targets', () => {
  test('should meet minimum touch target size on mobile', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<r-checkbox data-testid="checkbox">Touch target</r-checkbox>);

    const box = await component.boundingBox();
    // WCAG AAA requires 44x44px minimum
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });

  test('should be easily tappable on mobile', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<r-checkbox data-testid="checkbox">Tap me</r-checkbox>);

    await expect(component).toHaveAttribute('aria-checked', 'false');
    await component.tap();
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('r-checkbox Primitive - Responsive Behavior', () => {
  test('should be visible on mobile viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<r-checkbox data-testid="checkbox">Mobile</r-checkbox>);
    await expect(component).toBeVisible();
  });

  test('should be visible on desktop viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const component = await mount(<r-checkbox data-testid="checkbox">Desktop</r-checkbox>);
    await expect(component).toBeVisible();
  });
});
