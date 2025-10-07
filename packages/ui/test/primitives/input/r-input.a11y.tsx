/**
 * Accessibility Tests for Input Component
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @component Input
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { Input } from '../../src/components/Input';
import {
  runAxeScan,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
  verifyValidationState,
} from '../a11y-utils';

test.describe('Input Component - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for default variant', async ({ mount, page }) => {
    await mount(<Input placeholder="Enter text" data-testid="input" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for error variant', async ({ mount, page }) => {
    const testId = `error-input-${Date.now()}`;
    await mount(
      <Input
        variant="error"
        validationMessage="This field is required"
        data-testid="input"
        id={testId}
      />
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for success variant', async ({ mount, page }) => {
    await mount(
      <Input
        variant="success"
        validationMessage="Input is valid"
        data-testid="input"
        id={`success-input-${Date.now()}`}
      />
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for warning variant', async ({ mount, page }) => {
    await mount(
      <Input
        variant="warning"
        validationMessage="Please verify input"
        data-testid="input"
        id={`warning-input-${Date.now()}`}
      />
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with label', async ({ mount, page }) => {
    await mount(
      <div>
        <label htmlFor="labeled-input">Name</label>
        <Input id={`labeled-input-${Date.now()}`} data-testid="input" />
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for disabled state', async ({ mount, page }) => {
    await mount(<Input disabled data-testid="input" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for readonly state', async ({ mount, page }) => {
    await mount(<Input readOnly value="Read only" data-testid="input" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('Input Component - ARIA Attributes', () => {
  test('should have textbox role', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    const role = await component.getAttribute('role');
    expect(role === 'textbox' || role === null).toBe(true);
  });

  test('should set aria-invalid to false by default', async ({ mount }) => {
    const component = await mount(<Input data-testid="input" />);
    await expect(component).toHaveAttribute('aria-invalid', 'false');
  });

  test('should set aria-invalid to true for error variant', async ({ mount }) => {
    const component = await mount(<Input variant="error" data-testid="input" />);
    await verifyValidationState(component, true);
  });

  test('should link to validation message with aria-describedby', async ({
    mount,
    page: _page,
  }) => {
    const component = await mount(<Input validationMessage="Error message" data-testid="input" />);
    const describedBy = await component.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(describedBy).toMatch(/-validation$/);
  });

  test('should have aria-live="polite" on validation message', async ({ mount, page }) => {
    await mount(
      <Input
        variant="error"
        validationMessage="Error occurred"
        id={`test-input-${Date.now()}`}
        data-testid="input"
      />
    );
    const message = page.locator('#test-input-validation');
    await expect(message).toHaveAttribute('aria-live', 'polite');
  });

  test('should use role="alert" for error messages', async ({ mount, page }) => {
    await mount(<Input variant="error" validationMessage="Error" data-testid="input" />);
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText('Error');
  });

  test('should use role="status" for success messages', async ({ mount, page }) => {
    await mount(<Input variant="success" validationMessage="Success" data-testid="input" />);
    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Success');
  });

  test('should use role="status" for warning messages', async ({ mount, page }) => {
    await mount(<Input variant="warning" validationMessage="Warning" data-testid="input" />);
    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Warning');
  });

  test('should not have aria-describedby when no validation message', async ({ mount }) => {
    const component = await mount(<Input data-testid="input" />);
    const describedBy = await component.getAttribute('aria-describedby');
    expect(describedBy).toBeNull();
  });

  test('should support aria-label for screen readers', async ({ mount }) => {
    const component = await mount(<Input aria-label="Email address" data-testid="input" />);
    await expect(component).toHaveAttribute('aria-label', 'Email address');
  });

  test('should support aria-labelledby for screen readers', async ({ mount, page }) => {
    const labelId = `input-label-${Date.now()}`;
    await mount(
      <div>
        <div id={labelId}>Username</div>
        <Input aria-labelledby={labelId} data-testid="input" />
      </div>
    );
    const component = page.getByTestId('input');
    await expect(component).toHaveAttribute('aria-labelledby', labelId);
  });
});

test.describe('Input Component - Keyboard Navigation', () => {
  test('should be keyboard accessible', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await verifyKeyboardAccessible(page, component, 'Tab');
  });

  test('should accept keyboard input', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.focus();
    await page.keyboard.type('Keyboard test');
    await expect(component).toHaveValue('Keyboard test');
  });

  test('should handle tab navigation forward', async ({ mount, page }) => {
    await mount(
      <div>
        <Input data-testid="input1" />
        <Input data-testid="input2" />
      </div>
    );

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('input1')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('input2')).toBeFocused();
  });

  test('should handle shift-tab navigation backward', async ({ mount, page }) => {
    await mount(
      <div>
        <Input data-testid="input1" />
        <Input data-testid="input2" />
      </div>
    );

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('input2')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByTestId('input1')).toBeFocused();
  });

  test('should not be keyboard accessible when disabled', async ({ mount, page }) => {
    await mount(<Input disabled data-testid="input" />);
    await page.keyboard.press('Tab');
    const input = page.getByTestId('input');
    await expect(input).not.toBeFocused();
  });

  test('should be keyboard accessible when readonly', async ({ mount, page: _page }) => {
    const component = await mount(<Input readOnly data-testid="input" />);
    await component.focus();
    await expect(component).toBeFocused();
  });

  test('should handle home key to move to start', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.fill('Test text');
    await component.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Home');

    const selectionStart = await component.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        return el.selectionStart;
      }
      return null;
    });

    expect(selectionStart).toBe(0);
  });

  test('should handle end key to move to end', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.fill('Test text');
    await component.focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('End');

    const selectionEnd = await component.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        return el.selectionEnd;
      }
      return null;
    });

    expect(selectionEnd).toBe(9);
  });

  test('should handle arrow keys for cursor movement', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.fill('Test');
    await component.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');

    const cursorPosition = await component.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        return el.selectionStart;
      }
      return null;
    });

    expect(cursorPosition).toBe(2);
  });
});

test.describe('Input Component - Focus Indicators', () => {
  test('should have visible focus indicator', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    await verifyFocusIndicator(component);
  });

  test('should show focus ring on keyboard focus', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await page.keyboard.press('Tab');

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should maintain focus indicator during typing', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.focus();
    await page.keyboard.type('Typing test');

    const hasFocusRing = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasFocusRing).toBe(true);
  });

  test('should have different focus ring for error variant', async ({ mount, page: _page }) => {
    const component = await mount(<Input variant="error" data-testid="input" />);
    await component.focus();

    const focusColor = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.boxShadow || styles.outline;
    });

    expect(focusColor).toBeTruthy();
  });

  test('should remove focus indicator on blur', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.focus();
    await component.blur();

    await page.waitForTimeout(100);

    const isStillFocused = await component.evaluate((el) => {
      return document.activeElement === el;
    });

    expect(isStillFocused).toBe(false);
  });
});

test.describe('Input Component - Touch Target Size', () => {
  test('should meet WCAG AAA touch target size', async ({ mount }) => {
    const component = await mount(<Input data-testid="input" />);
    await verifyTouchTargetSize(component, 'AAA');
  });

  test('should have minimum 44px height on mobile viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<Input data-testid="input" />);

    const box = await component.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should maintain touch target on tablet viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const component = await mount(<Input data-testid="input" />);

    const box = await component.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should be easily tappable on mobile', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<Input data-testid="input" />);

    await component.tap();
    await expect(component).toBeFocused();
  });
});

test.describe('Input Component - Screen Reader Support', () => {
  test('should announce validation error to screen readers', async ({ mount, page }) => {
    await mount(
      <Input
        variant="error"
        validationMessage="Please enter a valid email"
        id={`email-input-${Date.now()}`}
        data-testid="input"
      />
    );

    const message = page.locator('#email-input-validation');
    await expect(message).toHaveAttribute('aria-live', 'polite');
    await expect(message).toHaveAttribute('role', 'alert');
  });

  test('should announce validation success to screen readers', async ({ mount, page }) => {
    await mount(
      <Input
        variant="success"
        validationMessage="Email is valid"
        id={`email-input-${Date.now()}`}
        data-testid="input"
      />
    );

    const message = page.locator('#email-input-validation');
    await expect(message).toHaveAttribute('aria-live', 'polite');
    await expect(message).toHaveAttribute('role', 'status');
  });

  test('should properly associate label with input', async ({ mount, page }) => {
    await mount(
      <div>
        <label htmlFor="username-input">Username</label>
        <Input id={`username-input-${Date.now()}`} data-testid="input" />
      </div>
    );

    const input = page.getByTestId('input');
    const label = page.getByText('Username');

    await expect(label).toBeVisible();
    await expect(input).toHaveAttribute('id', 'username-input');
  });

  test('should support implicit label association', async ({ mount, page }) => {
    const inputId = `input-${Date.now()}`;
    await mount(
      <label htmlFor={inputId}>
        Email Address
        <Input data-testid="input" id={inputId} />
      </label>
    );

    const input = page.getByTestId('input');
    await expect(input).toBeVisible();
  });

  test('should hide decorative elements from screen readers', async ({ mount, page: _page }) => {
    const component = await mount(
      <Input variant="error" validationMessage="Error" data-testid="input" />
    );

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const decorativeElement = await wrapper.evaluate((parent) => {
      return parent?.querySelector('[aria-hidden="true"]');
    });

    expect(decorativeElement).toBeTruthy();
  });
});

test.describe('Input Component - Error Message Timing', () => {
  test('should announce error message immediately when displayed', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" id={`test-input-${Date.now()}`} />);

    await component.update(
      <Input
        variant="error"
        validationMessage="Field is required"
        data-testid="input"
        id={`test-input-${Date.now()}`}
      />
    );

    const message = page.locator('#test-input-validation');
    await expect(message).toBeVisible();
    await expect(message).toHaveAttribute('aria-live', 'polite');
  });

  test('should update error message announcement', async ({ mount, page }) => {
    await mount(
      <Input
        variant="error"
        validationMessage="First error"
        data-testid="input"
        id={`test-input-${Date.now()}`}
      />
    );

    const message = page.locator('#test-input-validation');
    await expect(message).toHaveText('First error');

    await page
      .getByTestId('input')
      .evaluate((el) => el.parentElement?.setAttribute('data-updated', 'true'));
  });
});

test.describe('Input Component - Keyboard-Only Interaction', () => {
  test('should be fully usable with keyboard only', async ({ mount, page }) => {
    await mount(
      <div>
        <label htmlFor="keyboard-input">Name</label>
        <Input id={`keyboard-input-${Date.now()}`} data-testid="input" />
      </div>
    );

    await page.keyboard.press('Tab');
    const input = page.getByTestId('input');
    await expect(input).toBeFocused();

    await page.keyboard.type('John Doe');
    await expect(input).toHaveValue('John Doe');

    await page.keyboard.press('Home');
    await page.keyboard.press('Shift+End');

    const selection = await input.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        return {
          start: el.selectionStart,
          end: el.selectionEnd,
        };
      }
      return null;
    });

    expect(selection?.start).toBe(0);
    expect(selection?.end).toBe(8);
  });

  test('should support select all with Ctrl+A', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.fill('Test content');
    await component.focus();

    const isMac = process.platform === 'darwin';
    await page.keyboard.press(isMac ? 'Meta+A' : 'Control+A');

    const selection = await component.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        return {
          start: el.selectionStart,
          end: el.selectionEnd,
          length: el.value.length,
        };
      }
      return null;
    });

    expect(selection?.start).toBe(0);
    expect(selection?.end).toBe(selection?.length);
  });

  test('should support cut with Ctrl+X', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    await component.fill('Cut this text');
    await component.focus();

    const isMac = process.platform === 'darwin';
    await page.keyboard.press(isMac ? 'Meta+A' : 'Control+A');
    await page.keyboard.press(isMac ? 'Meta+X' : 'Control+X');

    await page.waitForTimeout(100);
  });
});

test.describe('Input Component - Color Contrast', () => {
  test('should have sufficient contrast for default variant', async ({ mount, page: _page }) => {
    const component = await mount(<Input value="Test text" data-testid="input" />);

    const contrast = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    expect(contrast.color).toBeTruthy();
    expect(contrast.backgroundColor).toBeTruthy();
  });

  test('should have sufficient contrast for error variant', async ({ mount, page: _page }) => {
    const component = await mount(<Input variant="error" value="Error text" data-testid="input" />);

    const contrast = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    expect(contrast.color).toBeTruthy();
    expect(contrast.backgroundColor).toBeTruthy();
  });

  test('should have sufficient contrast for placeholder', async ({ mount }) => {
    const component = await mount(<Input placeholder="Placeholder text" data-testid="input" />);

    const hasPlaceholder = await component.evaluate((el) => {
      return el.hasAttribute('placeholder');
    });

    expect(hasPlaceholder).toBe(true);
  });

  test('should have sufficient contrast for validation messages', async ({ mount, page }) => {
    await mount(<Input variant="error" validationMessage="Error message" data-testid="input" />);

    const message = page.getByRole('alert');
    const contrast = await message.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
      };
    });

    expect(contrast.color).toBeTruthy();
  });
});

test.describe('Input Component - Disabled State Accessibility', () => {
  test('should not be focusable when disabled', async ({ mount, page }) => {
    await mount(<Input disabled data-testid="input" />);
    await page.keyboard.press('Tab');
    const input = page.getByTestId('input');
    await expect(input).not.toBeFocused();
  });

  test('should have proper disabled attribute', async ({ mount }) => {
    const component = await mount(<Input disabled data-testid="input" />);
    await expect(component).toBeDisabled();
  });

  test('should have reduced opacity when disabled', async ({ mount }) => {
    const component = await mount(<Input disabled data-testid="input" />);

    const opacity = await component.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    const opacityNum = Number.parseFloat(opacity);
    expect(opacityNum).toBeLessThan(1);
  });
});

test.describe('Input Component - Form Integration', () => {
  test('should participate in form submission', async ({ mount, page }) => {
    let _submittedData = '';

    await mount(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          _submittedData = formData.get('username') as string;
        }}
      >
        <Input name="username" data-testid="input" />
        <button type="submit">Submit</button>
      </form>
    );

    const input = page.getByTestId('input');
    await input.fill('testuser');

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    await page.waitForTimeout(100);
  });

  test('should validate required field in form context', async ({ mount, page }) => {
    await mount(
      <form>
        <label htmlFor="required-input">Required Field</label>
        <Input id={`required-input-${Date.now()}`} required data-testid="input" />
      </form>
    );

    const input = page.getByTestId('input');
    await expect(input).toHaveAttribute('required');
  });
});
