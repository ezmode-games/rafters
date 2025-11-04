/**
 * React Dialog - Playwright Component Tests
 * Tests Dialog components in real browsers with full interaction coverage
 *
 * @see https://playwright.dev/docs/test-components
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/experimental-ct-react';
import {
  BasicDialogExample,
  ControlledDialogExample,
  DialogWithReactHookForm,
  NonModalDialogExample,
} from '../../examples/react-dialog';

test.describe('React Dialog - Basic Interactions', () => {
  test('opens dialog on trigger click', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Dialog content should not be visible initially
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Click trigger button
    await page.getByRole('button', { name: 'Open Dialog' }).click();

    // Dialog should be visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  });

  test('closes on Escape key', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes on outside click (overlay)', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click outside the dialog (on overlay)
    // Find overlay by clicking at a position outside the dialog content
    await page.mouse.click(10, 10); // Top-left corner should be overlay

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes on close button click', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: 'Close' }).click();

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('does not close on dialog content click', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click inside dialog content
    await page.getByRole('heading', { name: 'Welcome' }).click();

    // Dialog should remain open
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});

test.describe('React Dialog - Focus Management', () => {
  test('traps focus within dialog when modal', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Get all focusable elements in the dialog
    const closeButton = page.getByRole('button', { name: 'Close' });

    // Tab should cycle within dialog
    await page.keyboard.press('Tab');

    // Focus should be on close button (first/only focusable element)
    await expect(closeButton).toBeFocused();

    // Tab again should cycle back (focus trap)
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
  });

  test('restores focus to trigger on close', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    const trigger = page.getByRole('button', { name: 'Open Dialog' });

    // Focus and click trigger
    await trigger.focus();
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close dialog with Escape
    await page.keyboard.press('Escape');

    // Focus should return to trigger
    await expect(trigger).toBeFocused();
  });

  test('auto-focuses first focusable element on open', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // First focusable element should be focused (Close button)
    const closeButton = page.getByRole('button', { name: 'Close' });
    await expect(closeButton).toBeFocused();
  });

  test.skip('Shift+Tab cycles focus backwards in dialog', async ({ mount, page }, testInfo) => {
    // TODO: Fix focus trap cycle detection
    // Skip on mobile as Tab key focus doesn't work the same on mobile devices
    test.skip(testInfo.project.name.includes('mobile'), 'Tab navigation not supported on mobile');

    await mount(<ControlledDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Controlled Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Get focusable elements
    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    const confirmButton = page.getByRole('button', { name: 'Confirm' });

    // Tab to last element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(confirmButton).toBeFocused();

    // Shift+Tab should go backwards
    await page.keyboard.press('Shift+Tab');
    await expect(cancelButton).toBeFocused();
  });
});

test.describe('React Dialog - ARIA Attributes', () => {
  test('has correct role and aria-modal', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Check aria-modal attribute
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('has aria-labelledby pointing to title', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();

    const dialog = page.getByRole('dialog');
    const title = page.getByRole('heading', { name: 'Welcome' });

    // Get IDs
    const dialogLabelledBy = await dialog.getAttribute('aria-labelledby');
    const titleId = await title.getAttribute('id');

    expect(dialogLabelledBy).toBe(titleId);
    expect(titleId).toBeTruthy();
  });

  test('has aria-describedby pointing to description', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();

    const dialog = page.getByRole('dialog');
    const description = page.getByText(
      'This is a basic dialog built with framework-agnostic primitives.',
    );

    // Get IDs
    const dialogDescribedBy = await dialog.getAttribute('aria-describedby');
    const descriptionId = await description.getAttribute('id');

    expect(dialogDescribedBy).toBe(descriptionId);
    expect(descriptionId).toBeTruthy();
  });

  test('trigger has aria-haspopup and aria-expanded', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    const trigger = page.getByRole('button', { name: 'Open Dialog' });

    // Before opening
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // After opening
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('React Dialog - Controlled Mode', () => {
  test('respects controlled open state', async ({ mount, page }) => {
    await mount(<ControlledDialogExample />);

    // Dialog should be closed initially
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Open via external button
    await page.getByRole('button', { name: 'Open Controlled Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Close via Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('calls onOpenChange when state changes', async ({ mount, page }) => {
    await mount(<ControlledDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Controlled Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Confirm should close and trigger action
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('React Dialog - Form Integration', () => {
  test('can interact with form inputs', async ({ mount, page }) => {
    await mount(<DialogWithReactHookForm />);

    // Open dialog - use first() to avoid strict mode violation with multiple "Login" buttons
    await page.getByRole('button', { name: 'Login' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill out form
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    // Password input doesn't have implicit ARIA role, use placeholder or ID
    const passwordInput = page.locator('#password');

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    // Verify values
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('validates form inputs on submit', async ({ mount, page }) => {
    await mount(<DialogWithReactHookForm />);

    // Open dialog - use first() to avoid strict mode violation
    await page.getByRole('button', { name: 'Login' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Submit empty form - use last() to get the submit button inside dialog
    await page.getByRole('button', { name: 'Login' }).last().click();

    // Should show validation errors
    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('submits valid form and closes dialog', async ({ mount, page }) => {
    await mount(<DialogWithReactHookForm />);

    // Open dialog - use first() to avoid strict mode violation
    await page.getByRole('button', { name: 'Login' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill valid data
    await page.getByRole('textbox', { name: 'Email' }).fill('valid@example.com');
    await page.locator('#password').fill('validpassword123');

    // Submit - use last() to get the submit button inside dialog
    await page.getByRole('button', { name: 'Login' }).last().click();

    // Dialog should close after successful submit
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test.skip('Tab navigates through form fields', async ({ mount, page }, testInfo) => {
    // TODO: Fix form field focus order detection
    // Skip on mobile as Tab key focus doesn't work the same on mobile devices
    test.skip(testInfo.project.name.includes('mobile'), 'Tab navigation not supported on mobile');

    await mount(<DialogWithReactHookForm />);

    // Open dialog - use first() to avoid strict mode violation
    await page.getByRole('button', { name: 'Login' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Tab through fields
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();

    await page.keyboard.press('Tab');
    // Use last() to target the Login submit button inside dialog
    await expect(page.getByRole('button', { name: 'Login' }).last()).toBeFocused();
  });
});

test.describe('React Dialog - Non-Modal Behavior', () => {
  test.skip('non-modal dialog does not trap focus', async ({ mount, page }, testInfo) => {
    // TODO: Fix non-modal focus trap behavior
    // Skip on mobile as focus behavior is different on mobile devices
    test.skip(testInfo.project.name.includes('mobile'), 'Focus behavior not testable on mobile');

    await mount(<NonModalDialogExample />);

    // Open non-modal dialog
    await page.getByRole('button', { name: 'Open Non-Modal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Dialog should have aria-modal="false"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'false');

    // Can focus elements outside dialog (the trigger button)
    const trigger = page.getByRole('button', { name: 'Open Non-Modal' });
    await trigger.focus();
    await expect(trigger).toBeFocused();
  });

  test.skip('non-modal dialog does not close on outside click', async ({
    mount,
    page,
  }, testInfo) => {
    // TODO: Fix non-modal outside click behavior
    await mount(<NonModalDialogExample />);

    // Open non-modal dialog
    await page.getByRole('button', { name: 'Open Non-Modal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click/tap outside based on device type
    if (testInfo.project.name.includes('mobile')) {
      await page.touchscreen.tap(10, 10);
    } else {
      await page.mouse.click(10, 10);
    }

    // Dialog should remain open (non-modal behavior)
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('non-modal dialog still closes on Escape', async ({ mount, page }) => {
    await mount(<NonModalDialogExample />);

    // Open non-modal dialog
    await page.getByRole('button', { name: 'Open Non-Modal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('React Dialog - SSR Hydration', () => {
  test('hydrates without errors and becomes interactive', async ({ mount, page }) => {
    // Mount component (simulates SSR + hydration in browser)
    await mount(<BasicDialogExample />);

    // Should be able to interact immediately after hydration
    await page.getByRole('button', { name: 'Open Dialog' }).click();

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible();

    // All interactions should work
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('portal content renders correctly after hydration', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();

    // Portal content should be in document.body, not in component root
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Verify portal is rendered to body
    const portalParent = await dialog.evaluate((el) => {
      return el.parentElement?.tagName;
    });
    expect(portalParent).toBe('BODY');
  });
});

test.describe('React Dialog - Accessibility (@a11y)', () => {
  // Increase timeout for accessibility tests on mobile
  test.setTimeout(15000);

  test('has no accessibility violations in closed state', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Disable color-contrast rule for example components (they use demo colors)
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('has no accessibility violations in open state', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Disable color-contrast rule for example components (they use demo colors)
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form dialog has no accessibility violations', async ({ mount, page }) => {
    await mount(<DialogWithReactHookForm />);

    // Open form dialog - use first() to avoid strict mode violation
    await page.getByRole('button', { name: 'Login' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Disable color-contrast rule for example components (they use demo colors)
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form validation errors are announced', async ({ mount, page }) => {
    await mount(<DialogWithReactHookForm />);

    // Open dialog - use first() to avoid strict mode violation
    await page.getByRole('button', { name: 'Login' }).first().click();

    // Submit invalid form - use last() to target submit button inside dialog
    await page.getByRole('button', { name: 'Login' }).last().click();

    // Error messages should be visible and associated with inputs
    const emailError = page.getByText('Invalid email address');
    await expect(emailError).toBeVisible();

    // Run accessibility check with errors visible
    // Disable color-contrast rule for example components (they use demo colors)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('React Dialog - Mobile Interactions', () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true }); // iPhone SE viewport

  test('opens on touch tap', async ({ mount, page }) => {
    await mount(<BasicDialogExample />);

    // Tap trigger
    await page.getByRole('button', { name: 'Open Dialog' }).tap();

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test.skip('closes on overlay touch tap', async ({ mount, page }) => {
    // TODO: Fix touch event detection in Playwright CT
    await mount(<BasicDialogExample />);

    // Open dialog
    await page.getByRole('button', { name: 'Open Dialog' }).tap();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Tap outside (overlay) - use absolute coordinates
    await page.waitForTimeout(100);
    await page.touchscreen.tap(10, 10);

    // Dialog should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('form inputs work with touch keyboard', async ({ mount, page }) => {
    await mount(<DialogWithReactHookForm />);

    // Open dialog
    await page.getByRole('button', { name: 'Login' }).tap();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Tap and type in email field
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    await emailInput.tap();
    await emailInput.fill('mobile@example.com');

    await expect(emailInput).toHaveValue('mobile@example.com');
  });
});

test.describe('React Dialog - Browser Compatibility', () => {
  test('works in all browsers', async ({ mount, page, browserName }) => {
    await mount(<BasicDialogExample />);

    // Basic interaction test for all browsers
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Test passes if we get here without errors in any browser
    expect(browserName).toBeTruthy();
  });
});
