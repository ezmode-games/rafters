/**
 * Playwright Integration Tests for r-textarea Primitive
 * Tests visual rendering and interactive behavior in real browser
 *
 * @testType integration
 * @framework playwright
 * @primitive r-textarea
 */

import { expect, test } from '@playwright/experimental-ct-react';

test.describe('r-textarea Primitive - Visual Rendering', () => {
  test('should render with default properties', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    await expect(component).toBeVisible();

    const textarea = component.locator('textarea');
    await expect(textarea).toBeVisible();
  });

  test('should render with placeholder', async ({ mount }) => {
    const component = await mount(
      <r-textarea placeholder="Enter your comments" data-testid="textarea" />
    );
    const textarea = component.locator('textarea');
    await expect(textarea).toHaveAttribute('placeholder', 'Enter your comments');
  });

  test('should render with custom rows', async ({ mount }) => {
    const component = await mount(<r-textarea rows={5} data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const rows = await textarea.evaluate((el) => (el as HTMLTextAreaElement).rows);
    expect(rows).toBe(5);
  });

  test('should render with maxlength', async ({ mount }) => {
    const component = await mount(<r-textarea maxlength={100} data-testid="textarea" />);
    const textarea = component.locator('textarea');
    await expect(textarea).toHaveAttribute('maxlength', '100');
  });

  test('should render with initial value', async ({ mount }) => {
    const component = await mount(<r-textarea value="Initial text" data-testid="textarea" />);
    const textarea = component.locator('textarea');
    await expect(textarea).toHaveValue('Initial text');
  });
});

test.describe('r-textarea Primitive - Interactive Behavior', () => {
  test('should accept user input', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.fill('Hello World');
    await expect(textarea).toHaveValue('Hello World');
  });

  test('should accept multi-line input', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const multilineText = 'Line 1\nLine 2\nLine 3';
    await textarea.fill(multilineText);
    await expect(textarea).toHaveValue(multilineText);
  });

  test('should handle clearing textarea', async ({ mount }) => {
    const component = await mount(<r-textarea value="Initial text" data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.clear();
    await expect(textarea).toHaveValue('');
  });

  test('should respect maxlength limit', async ({ mount }) => {
    const component = await mount(<r-textarea maxlength={10} data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.fill('This is a very long text that exceeds the limit');

    const value = await textarea.inputValue();
    expect(value.length).toBeLessThanOrEqual(10);
  });
});

test.describe('r-textarea Primitive - States', () => {
  test('should render disabled state', async ({ mount }) => {
    const component = await mount(<r-textarea disabled data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await expect(textarea).toBeDisabled();
  });

  test('should not accept input when disabled', async ({ mount }) => {
    const component = await mount(<r-textarea disabled data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.click({ force: true });
    await textarea.type('test', { strict: false });
    await expect(textarea).toHaveValue('');
  });

  test('should render readonly state', async ({ mount }) => {
    const component = await mount(
      <r-textarea readonly value="Read only text" data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    const isReadonly = await textarea.evaluate((el) => (el as HTMLTextAreaElement).readOnly);
    expect(isReadonly).toBe(true);
  });

  test('should display value but not allow edits when readonly', async ({ mount }) => {
    const component = await mount(
      <r-textarea readonly value="Read only text" data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    await expect(textarea).toHaveValue('Read only text');
    await textarea.click();
    await textarea.type('new text', { strict: false });
    await expect(textarea).toHaveValue('Read only text');
  });
});

test.describe('r-textarea Primitive - Validation', () => {
  test('should set aria-invalid on error state', async ({ mount, page }) => {
    const component = await mount(<r-textarea required data-testid="textarea" />);

    const textarea = component.locator('textarea');
    await textarea.focus();
    await textarea.blur();

    await page.waitForTimeout(100);

    const ariaInvalid = await textarea.getAttribute('aria-invalid');
    expect(ariaInvalid).toBe('true');
  });

  test('should validate required field on blur', async ({ mount, page }) => {
    const component = await mount(<r-textarea required data-testid="textarea" />);

    const textarea = component.locator('textarea');
    await textarea.focus();
    await textarea.blur();

    await page.waitForTimeout(100);

    const validationState = await component.getAttribute('validationstate');
    expect(validationState).toBe('error');
  });

  test('should clear validation error when value is provided', async ({ mount, page }) => {
    const component = await mount(<r-textarea required data-testid="textarea" />);

    const textarea = component.locator('textarea');
    await textarea.fill('Valid text');
    await textarea.blur();

    await page.waitForTimeout(100);

    const validationState = await component.getAttribute('validationstate');
    expect(validationState).toBe('valid');
  });
});

test.describe('r-textarea Primitive - Events', () => {
  test('should dispatch r-input event on typing', async ({ mount, page }) => {
    let eventFired = false;

    await page.exposeFunction('handleRInput', () => {
      eventFired = true;
    });

    const component = await mount(<r-textarea data-testid="textarea" />);

    await component.evaluate((el) => {
      el.addEventListener('r-input', () => {
        window.handleRInput();
      });
    });

    const textarea = component.locator('textarea');
    await textarea.type('t');

    await page.waitForTimeout(100);
    expect(eventFired).toBe(true);
  });

  test('should dispatch r-blur event on blur', async ({ mount, page }) => {
    let eventFired = false;

    await page.exposeFunction('handleRBlur', () => {
      eventFired = true;
    });

    const component = await mount(<r-textarea data-testid="textarea" />);

    await component.evaluate((el) => {
      el.addEventListener('r-blur', () => {
        window.handleRBlur();
      });
    });

    const textarea = component.locator('textarea');
    await textarea.focus();
    await textarea.blur();

    await page.waitForTimeout(100);
    expect(eventFired).toBe(true);
  });
});

test.describe('r-textarea Primitive - Focus Management', () => {
  test('should be focusable', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.focus();
    await expect(textarea).toBeFocused();
  });

  test('should not be focusable when disabled', async ({ mount }) => {
    const component = await mount(<r-textarea disabled data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.focus({ strict: false });
    await expect(textarea).not.toBeFocused();
  });

  test('should maintain focus when typing', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.focus();
    await textarea.type('typing text');
    await expect(textarea).toBeFocused();
  });
});
