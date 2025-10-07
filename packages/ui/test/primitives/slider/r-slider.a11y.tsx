/**
 * Accessibility Tests for r-slider Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-slider
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/test';
import {
  runAxeScan,
  verifyAriaRole,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
  WCAG_TOUCH_TARGET,
} from '../../a11y-utils';

test.describe('r-slider primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for default state', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for disabled state', async ({ page }) => {
    await page.setContent('<r-slider value="50" disabled></r-slider>');
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for vertical orientation', async ({ page }) => {
    await page.setContent('<r-slider value="50" orientation="vertical"></r-slider>');
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-label', async ({ page }) => {
    await page.setContent('<r-slider value="50" aria-label="Volume control"></r-slider>');
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-labelledby', async ({ page }) => {
    await page.setContent(`
      <div>
        <label id="volume-label">Volume</label>
        <r-slider value="50" aria-labelledby="volume-label"></r-slider>
      </div>
    `);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with min/max/step', async ({ page }) => {
    await page.setContent('<r-slider value="25" min="0" max="100" step="5"></r-slider>');
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('r-slider primitive - ARIA Attributes', () => {
  test('should have slider role', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');
    await verifyAriaRole(slider, 'slider');
  });

  test('should have aria-valuenow attribute', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaValueNow = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-valuenow');
    });

    expect(ariaValueNow).toBe('50');
  });

  test('should have aria-valuemin attribute', async ({ page }) => {
    await page.setContent('<r-slider min="10"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaValueMin = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-valuemin');
    });

    expect(ariaValueMin).toBe('10');
  });

  test('should have aria-valuemax attribute', async ({ page }) => {
    await page.setContent('<r-slider max="200"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaValueMax = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-valuemax');
    });

    expect(ariaValueMax).toBe('200');
  });

  test('should have aria-orientation attribute for horizontal', async ({ page }) => {
    await page.setContent('<r-slider orientation="horizontal"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaOrientation = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-orientation');
    });

    expect(ariaOrientation).toBe('horizontal');
  });

  test('should have aria-orientation attribute for vertical', async ({ page }) => {
    await page.setContent('<r-slider orientation="vertical"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaOrientation = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-orientation');
    });

    expect(ariaOrientation).toBe('vertical');
  });

  test('should update aria-valuenow when value changes', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    await page.waitForTimeout(100);

    const ariaValueNow = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-valuenow');
    });

    expect(ariaValueNow).toBe('51');
  });

  test('should support aria-label for accessibility', async ({ page }) => {
    await page.setContent('<r-slider aria-label="Volume control"></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('aria-label', 'Volume control');
  });

  test('should support aria-labelledby for accessibility', async ({ page }) => {
    await page.setContent(`
      <div>
        <label id="brightness-label">Brightness</label>
        <r-slider aria-labelledby="brightness-label"></r-slider>
      </div>
    `);
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('aria-labelledby', 'brightness-label');
  });
});

test.describe('r-slider primitive - Keyboard Navigation', () => {
  test('should be keyboard accessible with Tab', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');
    await verifyKeyboardAccessible(page, slider, 'Tab');
  });

  test('should support ArrowRight for increment', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await expect(slider).toBeFocused();

    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(51);
  });

  test('should support ArrowUp for increment', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowUp');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(51);
  });

  test('should support ArrowLeft for decrement', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowLeft');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(49);
  });

  test('should support ArrowDown for decrement', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowDown');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(49);
  });

  test('should support Home key to go to minimum', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('Home');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(0);
  });

  test('should support End key to go to maximum', async ({ page }) => {
    await page.setContent('<r-slider value="50" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('End');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(100);
  });

  test('should support PageUp for large increment', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('PageUp');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(60);
  });

  test('should support PageDown for large decrement', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('PageDown');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(40);
  });

  test('should handle continuous keyboard input', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(53);
  });

  test('should not respond to keyboard when disabled', async ({ page }) => {
    await page.setContent('<r-slider value="50" disabled></r-slider>');
    const slider = page.locator('r-slider');

    // Try to focus (should fail)
    await slider.focus();
    await expect(slider).not.toBeFocused();
  });
});

test.describe('r-slider primitive - Focus Indicators', () => {
  test('should have visible focus indicator', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');
    await verifyFocusIndicator(slider);
  });

  test('should show focus ring on keyboard focus', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');

    await page.keyboard.press('Tab');
    await expect(slider).toBeFocused();

    const hasFocusRing = await slider.evaluate((el: Element) => {
      const styles = window.getComputedStyle(el as HTMLElement);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should maintain focus indicator during keyboard interaction', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    await expect(slider).toBeFocused();

    const hasFocusRing = await slider.evaluate((el: Element) => {
      const styles = window.getComputedStyle(el as HTMLElement);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should remove focus indicator on blur', async ({ page }) => {
    await page.setContent(`
      <div>
        <r-slider></r-slider>
        <button>Next</button>
      </div>
    `);
    const slider = page.locator('r-slider');

    await slider.focus();
    await expect(slider).toBeFocused();

    await slider.blur();
    await page.waitForTimeout(100);

    const isStillFocused = await slider.evaluate((el: Element) => {
      return document.activeElement === el;
    });

    expect(isStillFocused).toBe(false);
  });
});

test.describe('r-slider primitive - Touch Target Size', () => {
  test('should meet WCAG AAA touch target size (44x44px)', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');
    await verifyTouchTargetSize(slider, 'AAA');
  });

  test('should have minimum 44px height on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');

    const box = await slider.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(WCAG_TOUCH_TARGET.AAA);
  });

  test('should maintain touch target on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');

    const box = await slider.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(WCAG_TOUCH_TARGET.AAA);
  });

  test('should be easily tappable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');

    await slider.tap();
    await expect(slider).toBeFocused();
  });
});

test.describe('r-slider primitive - Screen Reader Support', () => {
  test('should announce current value to screen readers', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaValueNow = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-valuenow');
    });

    expect(ariaValueNow).toBe('50');
  });

  test('should announce min and max to screen readers', async ({ page }) => {
    await page.setContent('<r-slider min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaValues = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return {
        min: input?.getAttribute('aria-valuemin'),
        max: input?.getAttribute('aria-valuemax'),
      };
    });

    expect(ariaValues.min).toBe('0');
    expect(ariaValues.max).toBe('100');
  });

  test('should properly announce orientation to screen readers', async ({ page }) => {
    await page.setContent('<r-slider orientation="vertical"></r-slider>');
    const slider = page.locator('r-slider');

    const ariaOrientation = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('aria-orientation');
    });

    expect(ariaOrientation).toBe('vertical');
  });

  test('should work with aria-label for screen readers', async ({ page }) => {
    await page.setContent('<r-slider aria-label="Volume control"></r-slider>');
    const slider = page.locator('r-slider');

    await expect(slider).toHaveAttribute('aria-label', 'Volume control');
  });

  test('should work with aria-labelledby for screen readers', async ({ page }) => {
    await page.setContent(`
      <div>
        <label id="slider-label">Temperature</label>
        <r-slider aria-labelledby="slider-label"></r-slider>
      </div>
    `);

    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('aria-labelledby', 'slider-label');

    const label = page.locator('#slider-label');
    await expect(label).toHaveText('Temperature');
  });
});

test.describe('r-slider primitive - Disabled State Accessibility', () => {
  test('should not be focusable when disabled', async ({ page }) => {
    await page.setContent('<r-slider disabled></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await expect(slider).not.toBeFocused();
  });

  test('should have proper disabled attribute', async ({ page }) => {
    await page.setContent('<r-slider disabled></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('disabled');
  });

  test('should have tabindex -1 when disabled', async ({ page }) => {
    await page.setContent('<r-slider disabled></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('tabindex', '-1');
  });

  test('should be skipped in tab order when disabled', async ({ page }) => {
    await page.setContent(`
      <div>
        <button id="before">Before</button>
        <r-slider disabled></r-slider>
        <button id="after">After</button>
      </div>
    `);

    await page.keyboard.press('Tab');
    await expect(page.locator('#before')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#after')).toBeFocused();
  });

  test('should not accept keyboard input when disabled', async ({ page }) => {
    await page.setContent('<r-slider value="50" disabled></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(50); // Value should not change
  });

  test('should pass axe-core scan when disabled', async ({ page }) => {
    await page.setContent('<r-slider disabled></r-slider>');
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('r-slider primitive - Shadow DOM Accessibility', () => {
  test('should be accessible through shadow DOM', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');

    const hasShadowRoot = await page.locator('r-slider').evaluate((el: Element) => {
      return !!(el as HTMLElement).shadowRoot;
    });

    expect(hasShadowRoot).toBe(true);
  });

  test('should have accessible input inside shadow DOM', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');

    const inputExists = await page.locator('r-slider').evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return !!input && input.type === 'range';
    });

    expect(inputExists).toBe(true);
  });

  test('should maintain ARIA attributes in shadow DOM', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');

    const ariaAttributes = await page.locator('r-slider').evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return {
        valuenow: input?.getAttribute('aria-valuenow'),
        valuemin: input?.getAttribute('aria-valuemin'),
        valuemax: input?.getAttribute('aria-valuemax'),
      };
    });

    expect(ariaAttributes.valuenow).toBe('50');
    expect(ariaAttributes.valuemin).toBe('0');
    expect(ariaAttributes.valuemax).toBe('100');
  });
});

test.describe('r-slider primitive - Keyboard-Only Interaction', () => {
  test('should be fully usable with keyboard only', async ({ page }) => {
    await page.setContent(`
      <div>
        <label id="volume-label">Volume</label>
        <r-slider aria-labelledby="volume-label" value="50"></r-slider>
      </div>
    `);

    await page.keyboard.press('Tab');
    const slider = page.locator('r-slider');
    await expect(slider).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(53);
  });

  test('should allow full range traversal with keyboard', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();

    // Go to minimum
    await page.keyboard.press('Home');
    let value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(0);

    // Go to maximum
    await page.keyboard.press('End');
    value = await slider.evaluate((el: Element) => (el as HTMLElement & { value: number }).value);
    expect(value).toBe(100);

    // Go to middle with PageDown
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');

    value = await slider.evaluate((el: Element) => (el as HTMLElement & { value: number }).value);
    expect(value).toBe(50);
  });
});
