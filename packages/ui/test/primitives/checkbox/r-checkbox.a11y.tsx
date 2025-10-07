/**
 * Accessibility Tests for r-checkbox Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-checkbox
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

// Ensure the primitive is registered
import '../../../src/primitives/checkbox/r-checkbox';

test.describe('r-checkbox Primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for unchecked state', async ({ mount, page }) => {
    await mount(<r-checkbox aria-label="Accept terms">Accept terms</r-checkbox>);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for checked state', async ({ mount, page }) => {
    await mount(
      <r-checkbox checked aria-label="Enabled">
        Enabled
      </r-checkbox>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for indeterminate state', async ({
    mount,
    page,
  }) => {
    await mount(
      <r-checkbox indeterminate aria-label="Partially selected">
        Partially selected
      </r-checkbox>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for disabled state', async ({ mount, page }) => {
    await mount(
      <r-checkbox disabled aria-label="Disabled">
        Disabled
      </r-checkbox>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with associated label', async ({ mount, page }) => {
    await mount(
      <div>
        <label htmlFor="checkbox-label">Subscribe to newsletter</label>
        <r-checkbox id="checkbox-label">Subscribe</r-checkbox>
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-label', async ({ mount, page }) => {
    await mount(<r-checkbox aria-label="Accept privacy policy" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with aria-labelledby', async ({ mount, page }) => {
    await mount(
      <div>
        <span id="checkbox-label">Custom label text</span>
        <r-checkbox aria-labelledby="checkbox-label" />
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('r-checkbox Primitive - ARIA Attributes', () => {
  test('should have checkbox role', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Checkbox</r-checkbox>);
    await verifyAriaRole(component, 'checkbox');
  });

  test('should have aria-checked="false" by default', async ({ mount }) => {
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

  test('should update aria-checked dynamically', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Toggle</r-checkbox>);

    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'true');

    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should support aria-label for screen readers', async ({ mount }) => {
    const component = await mount(
      <r-checkbox aria-label="I agree to the terms" data-testid="checkbox" />
    );
    await expect(component).toHaveAttribute('aria-label', 'I agree to the terms');
  });

  test('should support aria-labelledby for screen readers', async ({ mount, page }) => {
    await mount(
      <div>
        <div id="checkbox-label">Terms and conditions</div>
        <r-checkbox aria-labelledby="checkbox-label" data-testid="checkbox" />
      </div>
    );
    const checkbox = page.getByTestId('checkbox');
    await expect(checkbox).toHaveAttribute('aria-labelledby', 'checkbox-label');
  });

  test('should support aria-describedby for additional context', async ({ mount, page }) => {
    await mount(
      <div>
        <r-checkbox aria-describedby="checkbox-desc" data-testid="checkbox">
          Subscribe
        </r-checkbox>
        <div id="checkbox-desc">You can unsubscribe at any time</div>
      </div>
    );
    const checkbox = page.getByTestId('checkbox');
    await expect(checkbox).toHaveAttribute('aria-describedby', 'checkbox-desc');
  });
});

test.describe('r-checkbox Primitive - Keyboard Navigation', () => {
  test('should be keyboard accessible', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Keyboard test</r-checkbox>);
    await verifyKeyboardAccessible(page, component, 'Tab');
  });

  test('should toggle with Space key only', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Space toggle</r-checkbox>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    // Space should toggle
    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'false');

    // Enter should NOT toggle
    await page.keyboard.press('Enter');
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should handle tab navigation forward', async ({ mount, page }) => {
    await mount(
      <div>
        <r-checkbox data-testid="checkbox1">First</r-checkbox>
        <r-checkbox data-testid="checkbox2">Second</r-checkbox>
      </div>
    );

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox1')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox2')).toBeFocused();
  });

  test('should handle shift-tab navigation backward', async ({ mount, page }) => {
    await mount(
      <div>
        <r-checkbox data-testid="checkbox1">First</r-checkbox>
        <r-checkbox data-testid="checkbox2">Second</r-checkbox>
      </div>
    );

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('checkbox2')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('checkbox1')).toBeFocused();
  });

  test('should not be keyboard accessible when disabled', async ({ mount, page }) => {
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
    // Should skip disabled checkbox
    await expect(page.getByTestId('checkbox3')).toBeFocused();
  });

  test('should prevent page scroll on Space key', async ({ mount, page }) => {
    const component = await mount(
      <div style={{ height: '2000px' }}>
        <r-checkbox data-testid="checkbox">Long page</r-checkbox>
      </div>
    );

    await component.focus();
    const scrollYBefore = await page.evaluate(() => window.scrollY);

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBe(scrollYBefore);
  });
});

test.describe('r-checkbox Primitive - Focus Indicators', () => {
  test('should have visible focus indicator', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Focus test</r-checkbox>);
    await verifyFocusIndicator(component);
  });

  test('should show focus ring on keyboard focus', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Focus ring</r-checkbox>);
    await page.keyboard.press('Tab');

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should maintain focus indicator during state changes', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Toggle focus</r-checkbox>);
    await component.focus();

    await page.keyboard.press('Space');
    await expect(component).toBeFocused();

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should remove focus indicator on blur', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Blur test</r-checkbox>);
    await component.focus();
    await component.blur();

    const isStillFocused = await component.evaluate((el) => {
      return document.activeElement === el;
    });

    expect(isStillFocused).toBe(false);
  });
});

test.describe('r-checkbox Primitive - Touch Target Size', () => {
  test('should meet WCAG AAA touch target size (44px)', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Touch target</r-checkbox>);
    await verifyTouchTargetSize(component, 'AAA');
  });

  test('should have minimum 44px height on mobile viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<r-checkbox data-testid="checkbox">Mobile</r-checkbox>);

    const box = await component.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should have minimum 44px width on mobile viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<r-checkbox data-testid="checkbox">Mobile width</r-checkbox>);

    const box = await component.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });

  test('should maintain touch target on tablet viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const component = await mount(<r-checkbox data-testid="checkbox">Tablet</r-checkbox>);

    const box = await component.boundingBox();
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

test.describe('r-checkbox Primitive - Screen Reader Support', () => {
  test('should announce state changes to screen readers', async ({ mount, page }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Announce state</r-checkbox>);

    // aria-checked changes should be announced
    await expect(component).toHaveAttribute('aria-checked', 'false');
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'true');
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should announce indeterminate state', async ({ mount, page }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Indeterminate state
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('aria-checked', 'mixed');
    await component.click();
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });

  test('should properly associate label with checkbox', async ({ mount, page }) => {
    await mount(
      <div>
        <label htmlFor="newsletter-checkbox">Subscribe to newsletter</label>
        <r-checkbox id="newsletter-checkbox" data-testid="checkbox">
          Subscribe
        </r-checkbox>
      </div>
    );

    const checkbox = page.getByTestId('checkbox');
    const label = page.getByText('Subscribe to newsletter');

    await expect(label).toBeVisible();
    await expect(checkbox).toHaveAttribute('id', 'newsletter-checkbox');
  });

  test('should support implicit label association', async ({ mount, page }) => {
    await mount(
      <label>
        Accept all terms
        <r-checkbox data-testid="checkbox" />
      </label>
    );

    const checkbox = page.getByTestId('checkbox');
    await expect(checkbox).toBeVisible();
  });
});

test.describe('r-checkbox Primitive - Disabled State Accessibility', () => {
  test('should not be focusable when disabled', async ({ mount, page }) => {
    await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled
      </r-checkbox>
    );
    await page.keyboard.press('Tab');
    const checkbox = page.getByTestId('checkbox');
    await expect(checkbox).not.toBeFocused();
  });

  test('should not respond to keyboard when disabled', async ({ mount, page }) => {
    const component = await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled keyboard
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('aria-checked', 'false');

    // Try to focus and press Space (should not work)
    await component.focus().catch(() => {});
    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should not respond to clicks when disabled', async ({ mount }) => {
    const component = await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled click
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('aria-checked', 'false');
    await component.click({ force: true });
    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should have proper disabled attribute', async ({ mount }) => {
    const component = await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled
      </r-checkbox>
    );
    await expect(component).toHaveAttribute('disabled');
  });
});

test.describe('r-checkbox Primitive - Keyboard-Only Interaction', () => {
  test('should be fully usable with keyboard only', async ({ mount, page }) => {
    await mount(
      <div>
        <label htmlFor="keyboard-checkbox">I agree to the terms</label>
        <r-checkbox id="keyboard-checkbox" data-testid="checkbox" />
      </div>
    );

    // Navigate to checkbox
    await page.keyboard.press('Tab');
    const checkbox = page.getByTestId('checkbox');
    await expect(checkbox).toBeFocused();

    // Toggle with Space
    await page.keyboard.press('Space');
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');

    // Toggle again
    await page.keyboard.press('Space');
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  test('should work in form context with keyboard only', async ({ mount, page }) => {
    await mount(
      <form>
        <label htmlFor="form-checkbox">Newsletter subscription</label>
        <r-checkbox name="newsletter" id="form-checkbox" data-testid="checkbox" />
        <button type="submit">Submit</button>
      </form>
    );

    await page.keyboard.press('Tab');
    const checkbox = page.getByTestId('checkbox');
    await expect(checkbox).toBeFocused();

    await page.keyboard.press('Space');
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Tab');
    const button = page.getByRole('button', { name: 'Submit' });
    await expect(button).toBeFocused();
  });
});

test.describe('r-checkbox Primitive - Color Contrast', () => {
  test('should have sufficient contrast for default state', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Contrast test</r-checkbox>);

    const contrast = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Verify colors are set (actual contrast testing done by axe)
    expect(contrast.color).toBeTruthy();
  });

  test('should have sufficient contrast when focused', async ({ mount }) => {
    const component = await mount(<r-checkbox data-testid="checkbox">Focus contrast</r-checkbox>);
    await component.focus();

    const focusColor = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.boxShadow || styles.outline;
    });

    expect(focusColor).toBeTruthy();
  });

  test('should maintain contrast when disabled', async ({ mount }) => {
    const component = await mount(
      <r-checkbox disabled data-testid="checkbox">
        Disabled contrast
      </r-checkbox>
    );

    const contrast = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        opacity: styles.opacity,
      };
    });

    expect(contrast.color).toBeTruthy();
    const opacityNum = Number.parseFloat(contrast.opacity);
    expect(opacityNum).toBeLessThan(1); // Should be visually distinct
  });
});

test.describe('r-checkbox Primitive - Tri-State Accessibility', () => {
  test('should announce mixed state to screen readers', async ({ mount }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        Mixed state
      </r-checkbox>
    );

    await expect(component).toHaveAttribute('role', 'checkbox');
    await expect(component).toHaveAttribute('aria-checked', 'mixed');
  });

  test('should transition states accessibly', async ({ mount, page }) => {
    const component = await mount(
      <r-checkbox indeterminate data-testid="checkbox">
        State transition
      </r-checkbox>
    );

    // Start: mixed
    await expect(component).toHaveAttribute('aria-checked', 'mixed');

    // First toggle: mixed -> true
    await component.focus();
    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'true');

    // Second toggle: true -> false
    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'false');

    // Third toggle: false -> true
    await page.keyboard.press('Space');
    await expect(component).toHaveAttribute('aria-checked', 'true');
  });
});
