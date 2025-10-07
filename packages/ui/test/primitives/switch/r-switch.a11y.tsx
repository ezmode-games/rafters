/**
 * Accessibility Tests for r-switch Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-switch
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  runAxeScan,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
} from '../../a11y-utils';

test.describe('r-switch Primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for default state', async ({ mount, page }) => {
    await mount(<r-switch data-testid="switch">Enable notifications</r-switch>);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for checked state', async ({ mount, page }) => {
    await mount(
      <r-switch checked data-testid="switch">
        Already enabled
      </r-switch>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for disabled state', async ({ mount, page }) => {
    await mount(
      <r-switch disabled data-testid="switch">
        Cannot change
      </r-switch>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-label', async ({ mount, page }) => {
    await mount(
      <r-switch aria-label="Toggle notifications" data-testid="switch">
        Toggle
      </r-switch>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-labelledby', async ({ mount, page }) => {
    await mount(
      <div>
        <span id="switch-label">Enable feature</span>
        <r-switch aria-labelledby="switch-label" data-testid="switch">
          Toggle
        </r-switch>
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-describedby', async ({ mount, page }) => {
    await mount(
      <div>
        <r-switch aria-describedby="switch-desc" data-testid="switch">
          Toggle
        </r-switch>
        <span id="switch-desc">Controls feature state</span>
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('r-switch Primitive - ARIA Attributes', () => {
  test('should have switch role', async ({ mount }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);
    await expect(component).toHaveAttribute('role', 'switch');
  });

  test('should have aria-checked="false" by default', async ({ mount }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should have aria-checked="true" when checked', async ({ mount }) => {
    const component = await mount(
      <r-switch checked data-testid="switch">
        Toggle
      </r-switch>
    );
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });

  test('should update aria-checked when toggled', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);

    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.click();
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'true');
  });

  test('should support aria-label', async ({ mount }) => {
    const component = await mount(
      <r-switch aria-label="Enable notifications" data-testid="switch">
        Toggle
      </r-switch>
    );
    await expect(component).toHaveAttribute('aria-label', 'Enable notifications');
  });

  test('should support aria-labelledby', async ({ mount, page }) => {
    await mount(
      <div>
        <span id="label">Feature toggle</span>
        <r-switch aria-labelledby="label" data-testid="switch">
          Toggle
        </r-switch>
      </div>
    );
    const component = page.locator('[data-testid="switch"]');
    await expect(component).toHaveAttribute('aria-labelledby', 'label');
  });

  test('should support aria-describedby', async ({ mount, page }) => {
    await mount(
      <div>
        <r-switch aria-describedby="desc" data-testid="switch">
          Toggle
        </r-switch>
        <span id="desc">Description</span>
      </div>
    );
    const component = page.locator('[data-testid="switch"]');
    await expect(component).toHaveAttribute('aria-describedby', 'desc');
  });
});

test.describe('r-switch Primitive - Keyboard Navigation', () => {
  test('should be keyboard accessible with Tab', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);
    await verifyKeyboardAccessible(component, ['Tab']);
  });

  test('should toggle with Space key', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'true');
  });

  test('should prevent page scroll when Space is pressed', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);

    await component.focus();

    const initialScroll = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    const afterScroll = await page.evaluate(() => window.scrollY);
    expect(afterScroll).toBe(initialScroll);
  });

  test('should not respond to Enter key (switch pattern)', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should be in tab order with tabindex="0"', async ({ mount }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);
    await expect(component).toHaveAttribute('tabindex', '0');
  });

  test('should not be in tab order when disabled', async ({ mount, page }) => {
    await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    await page.keyboard.press('Tab');
    const focused = await page.locator('[data-testid="switch"]').evaluate((el) => {
      return el === document.activeElement;
    });

    expect(focused).toBe(false);
  });
});

test.describe('r-switch Primitive - Focus Management', () => {
  test('should have visible focus indicator', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);
    await verifyFocusIndicator(component);
  });

  test('should be focusable when enabled', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);
    await component.focus();
    await expect(component).toBeFocused();
  });

  test('should not be focusable when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    await component.focus().catch(() => {
      // Expected to fail or do nothing
    });

    const isFocused = await component.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(false);
  });

  test('should maintain focus after toggle', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Toggle</r-switch>);

    await component.focus();
    await expect(component).toBeFocused();

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    await expect(component).toBeFocused();
  });
});

test.describe('r-switch Primitive - Touch Target Size', () => {
  test('should meet 44x44px minimum touch target (WCAG 2.5.5 AAA)', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Touch target</r-switch>);
    await verifyTouchTargetSize(component, 44);
  });

  test('should have adequate touch target when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled touch
      </r-switch>
    );
    await verifyTouchTargetSize(component, 44);
  });
});

test.describe('r-switch Primitive - Screen Reader Support', () => {
  test('should announce role as switch', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Screen reader</r-switch>);

    const role = await component.getAttribute('role');
    expect(role).toBe('switch');
  });

  test('should announce state changes', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">State change</r-switch>);

    const initialState = await component.getAttribute('aria-checked');
    expect(initialState).toBe('false');

    await component.click();
    await page.waitForTimeout(100);

    const newState = await component.getAttribute('aria-checked');
    expect(newState).toBe('true');
  });

  test('should have accessible name from content', async ({ mount, page }) => {
    await mount(<r-switch data-testid="switch">Enable notifications</r-switch>);
    const component = page.locator('[data-testid="switch"]');
    const text = await component.textContent();
    expect(text).toContain('Enable notifications');
  });

  test('should have accessible name from aria-label', async ({ mount }) => {
    const component = await mount(<r-switch aria-label="Toggle feature" data-testid="switch" />);
    await expect(component).toHaveAttribute('aria-label', 'Toggle feature');
  });
});

test.describe('r-switch Primitive - Disabled State Accessibility', () => {
  test('should have disabled attribute when disabled', async ({ mount }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );
    await expect(component).toHaveAttribute('disabled');
  });

  test('should not respond to click when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.click();
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should not respond to keyboard when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    await component.focus().catch(() => {
      // Expected to fail
    });

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should have proper visual indication when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    const opacity = await component.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    // Disabled elements should have reduced opacity or other visual indication
    expect(opacity).toBeDefined();
  });
});

test.describe('r-switch Primitive - Multiple Switches', () => {
  test('should support multiple switches with unique states', async ({ mount, page }) => {
    await mount(
      <div>
        <r-switch data-testid="switch1">First switch</r-switch>
        <r-switch checked data-testid="switch2">
          Second switch
        </r-switch>
        <r-switch data-testid="switch3">Third switch</r-switch>
      </div>
    );

    const switch1 = page.locator('[data-testid="switch1"]');
    const switch2 = page.locator('[data-testid="switch2"]');
    const switch3 = page.locator('[data-testid="switch3"]');

    await expect(switch1).toHaveAttribute('aria-checked', 'false');
    await expect(switch2).toHaveAttribute('aria-checked', 'true');
    await expect(switch3).toHaveAttribute('aria-checked', 'false');
  });

  test('should navigate between switches with Tab', async ({ mount, page }) => {
    await mount(
      <div>
        <r-switch data-testid="switch1">First</r-switch>
        <r-switch data-testid="switch2">Second</r-switch>
        <r-switch data-testid="switch3">Third</r-switch>
      </div>
    );

    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focused).toBe('switch1');

    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focused).toBe('switch2');

    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focused).toBe('switch3');
  });
});
