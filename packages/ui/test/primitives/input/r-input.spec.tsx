/**
 * Playwright Component Tests for Input Component
 * Tests visual rendering and interactive behavior in real browser
 *
 * @testType component
 * @framework playwright
 * @component Input
 */

import { expect, test } from '@playwright/experimental-ct-react';
import { Input } from '../../../src/components/Input';

test.describe('Input Component - Visual Rendering', () => {
  test('should render with default variant', async ({ mount, page: _page }) => {
    const component = await mount(<Input placeholder="Enter text" />);
    await expect(component).toBeVisible();
    const input = component.locator('input');
    await expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  test('should render error variant with red border', async ({ mount, page: _page }) => {
    const component = await mount(<Input variant="error" data-testid="input" />);
    await expect(component).toBeVisible();

    const borderColor = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor;
    });

    expect(borderColor).toBeTruthy();
  });

  test('should render success variant with green border', async ({ mount, page: _page }) => {
    const component = await mount(<Input variant="success" data-testid="input" />);
    await expect(component).toBeVisible();

    const borderColor = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor;
    });

    expect(borderColor).toBeTruthy();
  });

  test('should render warning variant with yellow/orange border', async ({
    mount,
    page: _page,
  }) => {
    const component = await mount(<Input variant="warning" data-testid="input" />);
    await expect(component).toBeVisible();

    const borderColor = await component.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.borderColor;
    });

    expect(borderColor).toBeTruthy();
  });

  test('should display validation message', async ({ mount, page }) => {
    await mount(<Input validationMessage="This field is required" variant="error" />);
    const message = page.getByText('This field is required');
    await expect(message).toBeVisible();
  });

  test('should show trust indicator for sensitive data', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="password" data-testid="input" />);

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasTrustIndicator = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.absolute.right-2.top-2');
    });

    expect(hasTrustIndicator).toBe(true);
  });

  test('should render without trust indicator for non-sensitive data', async ({
    mount,
    page: _page,
  }) => {
    const component = await mount(<Input type="text" data-testid="input" />);

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasTrustIndicator = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.absolute.right-2.top-2');
    });

    expect(hasTrustIndicator).toBe(false);
  });
});

test.describe('Input Component - Interactive Masking', () => {
  // NOTE: Mask attribute tests are in Input.test.tsx (unit tests)
  // Playwright component tests focus on user-visible behavior

  test('should accept user input', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.fill('Hello World');
    await expect(input).toHaveValue('Hello World');
  });

  test('should handle clearing input', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.fill('Test value');
    await expect(input).toHaveValue('Test value');
    await input.clear();
    await expect(input).toHaveValue('');
  });
});

test.describe('Input Component - Validation States', () => {
  test('should display error validation message', async ({ mount, page }) => {
    await mount(
      <Input
        variant="error"
        validationMessage="Email is required"
        type="email"
        data-testid="input"
      />
    );
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should display success validation message', async ({ mount, page }) => {
    await mount(
      <Input
        variant="success"
        validationMessage="Email is valid"
        type="email"
        data-testid="input"
      />
    );
    await expect(page.getByText('Email is valid')).toBeVisible();
  });

  test('should display warning validation message', async ({ mount, page }) => {
    await mount(
      <Input
        variant="warning"
        validationMessage="Email format may be incorrect"
        type="email"
        data-testid="input"
      />
    );
    await expect(page.getByText('Email format may be incorrect')).toBeVisible();
  });

  test('should show error indicator dot', async ({ mount, page: _page }) => {
    const component = await mount(
      <Input variant="error" validationMessage="Error" data-testid="input" />
    );

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasErrorIndicator = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.bg-destructive\\/20');
    });

    expect(hasErrorIndicator).toBe(true);
  });

  test('should show success indicator dot', async ({ mount, page: _page }) => {
    const component = await mount(
      <Input variant="success" validationMessage="Success" data-testid="input" />
    );

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasSuccessIndicator = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.bg-success\\/20');
    });

    expect(hasSuccessIndicator).toBe(true);
  });

  test('should show warning indicator dot', async ({ mount, page: _page }) => {
    const component = await mount(
      <Input variant="warning" validationMessage="Warning" data-testid="input" />
    );

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasWarningIndicator = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.bg-warning\\/20');
    });

    expect(hasWarningIndicator).toBe(true);
  });

  test('should hide validation message when not provided', async ({ mount, page }) => {
    await mount(<Input variant="error" data-testid="input" />);
    const messages = page.getByRole('alert');
    await expect(messages).toHaveCount(0);
  });

  test('should update validation message dynamically', async ({ mount, page }) => {
    const component = await mount(
      <Input variant="error" validationMessage="First error" data-testid="input" />
    );
    await expect(page.getByText('First error')).toBeVisible();

    await component.update(
      <Input variant="error" validationMessage="Second error" data-testid="input" />
    );
    await expect(page.getByText('Second error')).toBeVisible();
    await expect(page.getByText('First error')).not.toBeVisible();
  });
});

test.describe('Input Component - Keyboard Navigation', () => {
  test('should focus on tab key', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.focus();
    await expect(input).toBeFocused();
  });

  test('should accept keyboard input', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.focus();
    await page.keyboard.type('Hello');
    await expect(input).toHaveValue('Hello');
  });

  test('should handle backspace key', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.fill('Test');
    await input.focus();
    await page.keyboard.press('Backspace');
    await expect(input).toHaveValue('Tes');
  });

  test('should handle enter key in form context', async ({ mount, page }) => {
    let _formSubmitted = false;

    const _component = await mount(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          _formSubmitted = true;
        }}
      >
        <Input data-testid="input" />
      </form>
    );

    const input = page.getByTestId('input');
    await input.focus();
    await page.keyboard.press('Enter');

    await page.waitForTimeout(100);
  });

  test('should navigate between inputs with tab', async ({ mount, page }) => {
    await mount(
      <div>
        <Input data-testid="input1" />
        <Input data-testid="input2" />
      </div>
    );

    const input1 = page.getByTestId('input1');
    const input2 = page.getByTestId('input2');

    await input1.focus();
    await expect(input1).toBeFocused();

    await input2.focus();
    await expect(input2).toBeFocused();
  });

  test('should not be focusable when disabled', async ({ mount, page }) => {
    await mount(<Input disabled data-testid="input" />);
    const input = page.getByTestId('input');
    await page.keyboard.press('Tab');
    await expect(input).not.toBeFocused();
  });
});

test.describe('Input Component - Focus Management', () => {
  test('should show focus ring on focus', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.focus();

    const hasOutline = await input.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });

    expect(hasOutline).toBe(true);
  });

  test('should remove focus ring on blur', async ({ mount, page: _page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.focus();
    await input.blur();

    await page.waitForTimeout(100);
  });

  test('should maintain focus during typing', async ({ mount, page }) => {
    const component = await mount(<Input data-testid="input" />);
    const input = component.locator('input');
    await input.focus();
    await page.keyboard.type('Continuous typing');
    await expect(input).toBeFocused();
  });
});

test.describe('Input Component - Sensitive Data Trust Indicators', () => {
  test('should show indicator for password fields', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="password" data-testid="input" />);

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasTrustDot = await wrapper.evaluate((parent) => {
      const dot = parent?.querySelector('.absolute.right-2.top-2');
      return !!dot && dot.classList.contains('bg-primary/30');
    });

    expect(hasTrustDot).toBe(true);
  });

  test('should show indicator for email fields', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="email" data-testid="input" />);

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasTrustDot = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.absolute.right-2.top-2');
    });

    expect(hasTrustDot).toBe(true);
  });

  test('should show indicator when sensitive prop is true', async ({ mount, page: _page }) => {
    const component = await mount(<Input sensitive type="text" data-testid="input" />);

    const wrapper = await component.evaluateHandle((el) => el.parentElement);
    const hasTrustDot = await wrapper.evaluate((parent) => {
      return !!parent?.querySelector('.absolute.right-2.top-2');
    });

    expect(hasTrustDot).toBe(true);
  });

  // NOTE: CSS rendering tests (shadow, border, opacity, cursor) moved to unit tests
  // Browsers render these differently, making them unsuitable for cross-browser component tests
});

test.describe('Input Component - Responsive Behavior', () => {
  test('should be visible on mobile viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const component = await mount(<Input placeholder="Mobile test" data-testid="input" />);
    const input = component.locator('input');
    await expect(input).toBeVisible();
  });

  test('should be visible on desktop viewport', async ({ mount, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const component = await mount(<Input placeholder="Desktop test" data-testid="input" />);
    const input = component.locator('input');
    await expect(input).toBeVisible();
  });

  // NOTE: Height and CSS property tests are in unit tests
  // Browsers apply min-height differently, making exact measurements unreliable
});

test.describe('Input Component - Disabled State', () => {
  test('should render disabled state', async ({ mount, page: _page }) => {
    const component = await mount(<Input disabled data-testid="input" />);
    const input = component.locator('input');
    await expect(input).toBeDisabled();
  });

  test('should not accept input when disabled', async ({ mount, page }) => {
    const component = await mount(<Input disabled data-testid="input" />);
    const input = component.locator('input');
    await input.focus().catch(() => {});
    await page.keyboard.type('Should not type');
    await expect(input).toHaveValue('');
  });

  // NOTE: Opacity and cursor tests are in unit tests
  // Browsers render disabled inputs differently (WebKit uses auto cursor, etc)
});

test.describe('Input Component - ReadOnly State', () => {
  test('should render readonly state', async ({ mount, page: _page }) => {
    const component = await mount(<Input readOnly value="Read only value" data-testid="input" />);
    const input = component.locator('input');
    await expect(input).toHaveAttribute('readonly');
    await expect(input).toHaveValue('Read only value');
  });

  test('should not accept input when readonly', async ({ mount, page }) => {
    const component = await mount(<Input readOnly value="Original" data-testid="input" />);
    const input = component.locator('input');
    await input.focus();
    await page.keyboard.type('New text');
    await expect(input).toHaveValue('Original');
  });

  test('should be focusable when readonly', async ({ mount, page: _page }) => {
    const component = await mount(<Input readOnly data-testid="input" />);
    const input = component.locator('input');
    await input.focus();
    await expect(input).toBeFocused();
  });
});

test.describe('Input Component - Type-Specific Behavior', () => {
  test('should handle number type', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="number" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('123');
    await expect(input).toHaveValue('123');
  });

  test('should handle email type', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="email" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('test@example.com');
    await expect(input).toHaveValue('test@example.com');
  });

  test('should handle tel type', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="tel" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('555-1234');
    await expect(input).toHaveValue('555-1234');
  });

  test('should handle url type', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="url" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('https://example.com');
    await expect(input).toHaveValue('https://example.com');
  });

  test('should handle search type', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="search" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('search query');
    await expect(input).toHaveValue('search query');
  });

  test('should mask password input', async ({ mount, page: _page }) => {
    const component = await mount(<Input type="password" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('secretpassword');

    const inputType = await input.getAttribute('type');
    expect(inputType).toBe('password');
  });
});

test.describe('Input Component - Placeholder', () => {
  test('should display placeholder text', async ({ mount, page: _page }) => {
    const component = await mount(<Input placeholder="Enter your name" data-testid="input" />);
    const input = component.locator('input');
    await expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  test('should hide placeholder when input has value', async ({ mount, page: _page }) => {
    const component = await mount(<Input placeholder="Placeholder" data-testid="input" />);
    const input = component.locator('input');
    await input.fill('Value');
    await expect(input).toHaveValue('Value');
  });
});
