/**
 * Accessibility Tests for r-textarea Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-textarea
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/experimental-ct-react';
import {
  generateComprehensiveReport,
  runAxeScan,
  testPrimitiveAccessibility,
  verifyAriaLabel,
  verifyAriaRole,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
  verifyValidationState,
} from '../../a11y-utils';

test.describe('r-textarea Primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for default state', async ({ mount, page }) => {
    await mount(<r-textarea aria-label="Comments" data-testid="textarea" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for disabled state', async ({ mount, page }) => {
    await mount(<r-textarea disabled aria-label="Comments" data-testid="textarea" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan for readonly state', async ({ mount, page }) => {
    await mount(
      <r-textarea readonly value="Read only" aria-label="Comments" data-testid="textarea" />
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with error state', async ({ mount, page }) => {
    const component = await mount(
      <r-textarea required aria-label="Required comments" data-testid="textarea" />
    );

    const textarea = component.locator('textarea');
    await textarea.focus();
    await textarea.blur();

    await page.waitForTimeout(100);

    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with label', async ({ mount, page }) => {
    await mount(
      <div>
        {/* biome-ignore lint/correctness/useUniqueElementIds: test fixture needs static IDs */}
        <label htmlFor="labeled-textarea">Feedback</label>
        {/* biome-ignore lint/correctness/useUniqueElementIds: test fixture needs static IDs */}
        <r-textarea id="labeled-textarea" data-testid="textarea" />
      </div>
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass comprehensive accessibility test suite', async ({ mount, page }) => {
    const component = await mount(<r-textarea aria-label="Comments" data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const results = await testPrimitiveAccessibility(page, textarea, {
      role: 'textbox',
      level: 'AAA',
      requiresLabel: true,
      keyboardKeys: ['Tab'],
      supportsDisabled: true,
    });

    expect(results.passed).toBe(true);
  });
});

test.describe('r-textarea Primitive - ARIA Attributes', () => {
  test('should have textbox role implicitly', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await verifyAriaRole(textarea, 'textbox');
  });

  test('should set aria-invalid to false by default', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const ariaInvalid = await textarea.getAttribute('aria-invalid');
    expect(ariaInvalid).toBe('false');
  });

  test('should set aria-invalid to true on error', async ({ mount, page }) => {
    const component = await mount(<r-textarea required data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.focus();
    await textarea.blur();
    await page.waitForTimeout(100);

    await verifyValidationState(textarea, true);
  });

  test('should set aria-required when required', async ({ mount }) => {
    const component = await mount(<r-textarea required data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const ariaRequired = await textarea.getAttribute('aria-required');
    expect(ariaRequired).toBe('true');
  });

  test('should set aria-label when provided', async ({ mount }) => {
    const component = await mount(<r-textarea aria-label="Comments" data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await verifyAriaLabel(textarea);
    const ariaLabel = await textarea.getAttribute('aria-label');
    expect(ariaLabel).toBe('Comments');
  });

  test('should set aria-labelledby when provided', async ({ mount }) => {
    await mount(
      <div>
        {/* biome-ignore lint/correctness/useUniqueElementIds: test fixture needs static IDs */}
        <span id="textarea-label">Feedback</span>
        <r-textarea aria-labelledby="textarea-label" data-testid="textarea" />
      </div>
    );

    const textarea = await mount(<r-textarea data-testid="textarea" />).then((c) =>
      c.locator('textarea')
    );
    const ariaLabelledby = await textarea.getAttribute('aria-labelledby');
    expect(ariaLabelledby).toBeTruthy();
  });

  test('should set aria-describedby when provided', async ({ mount }) => {
    await mount(
      <div>
        <r-textarea aria-describedby="help-text" data-testid="textarea" />
        {/* biome-ignore lint/correctness/useUniqueElementIds: test fixture needs static IDs */}
        <span id="help-text">Enter your feedback here</span>
      </div>
    );

    const textarea = await mount(<r-textarea data-testid="textarea" />).then((c) =>
      c.locator('textarea')
    );
    const ariaDescribedby = await textarea.getAttribute('aria-describedby');
    expect(ariaDescribedby).toBeTruthy();
  });
});

test.describe('r-textarea Primitive - Keyboard Navigation', () => {
  test('should be accessible via Tab key', async ({ mount, page }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await verifyKeyboardAccessible(page, textarea, 'Tab');
  });

  test('should allow text selection via keyboard', async ({ mount }) => {
    const component = await mount(
      <r-textarea value="Test text for selection" data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    await textarea.focus();
    await textarea.press('Control+A');

    const selectedText = await textarea.evaluate((el) => {
      const element = el as HTMLTextAreaElement;
      return element.value.substring(element.selectionStart, element.selectionEnd);
    });

    expect(selectedText).toBe('Test text for selection');
  });

  test('should navigate within text via arrow keys', async ({ mount }) => {
    const component = await mount(<r-textarea value="Line 1\nLine 2" data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.focus();
    await textarea.press('ArrowDown');

    const cursorPosition = await textarea.evaluate((el) => {
      return (el as HTMLTextAreaElement).selectionStart;
    });

    expect(cursorPosition).toBeGreaterThan(0);
  });
});

test.describe('r-textarea Primitive - Focus Management', () => {
  test('should have visible focus indicator', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await verifyFocusIndicator(textarea);
  });

  test('should not be focusable when disabled', async ({ mount }) => {
    const component = await mount(<r-textarea disabled data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const tabindex = await textarea.getAttribute('tabindex');
    const isDisabled = await textarea.isDisabled();

    expect(isDisabled).toBe(true);
    expect(tabindex === '-1' || tabindex === null).toBe(true);
  });

  test('should maintain focus during typing', async ({ mount }) => {
    const component = await mount(<r-textarea data-testid="textarea" />);
    const textarea = component.locator('textarea');

    await textarea.focus();
    await textarea.type('typing...');

    await expect(textarea).toBeFocused();
  });
});

test.describe('r-textarea Primitive - Touch Target Size', () => {
  test('should meet WCAG AAA touch target minimum (44x44px)', async ({ mount }) => {
    const component = await mount(
      <r-textarea style={{ minHeight: '44px', minWidth: '44px' }} data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    await verifyTouchTargetSize(textarea, 'AAA');
  });

  test('should meet touch target size with custom rows', async ({ mount }) => {
    const component = await mount(
      <r-textarea rows={3} style={{ minWidth: '44px' }} data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    const box = await textarea.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('r-textarea Primitive - Validation States', () => {
  test('should announce validation errors to screen readers', async ({ mount, page }) => {
    const component = await mount(
      <r-textarea required aria-label="Comments" data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    await textarea.focus();
    await textarea.blur();
    await page.waitForTimeout(100);

    const ariaInvalid = await textarea.getAttribute('aria-invalid');
    const ariaErrorMessage = await textarea.getAttribute('aria-errormessage');

    expect(ariaInvalid).toBe('true');
    expect(ariaErrorMessage).toBeTruthy();
  });

  test('should clear validation state when valid', async ({ mount, page }) => {
    const component = await mount(
      <r-textarea required aria-label="Comments" data-testid="textarea" />
    );
    const textarea = component.locator('textarea');

    await textarea.fill('Valid text');
    await textarea.blur();
    await page.waitForTimeout(100);

    await verifyValidationState(textarea, false);
  });
});

test.describe('r-textarea Primitive - Comprehensive Report', () => {
  test('should generate comprehensive accessibility report', async ({ mount, page }) => {
    const component = await mount(<r-textarea aria-label="Comments" data-testid="textarea" />);
    const textarea = component.locator('textarea');

    const report = await generateComprehensiveReport('r-textarea', page, textarea, {
      role: 'textbox',
      level: 'AAA',
      requiresLabel: true,
      keyboardKeys: ['Tab'],
      supportsDisabled: true,
    });

    expect(report.primitive).toBe('r-textarea');
    expect(report.wcagLevel).toBe('AAA');
    expect(report.tests.axeScan).toBe(true);
    expect(report.tests.ariaAttributes).toBe(true);
    expect(report.tests.keyboardNavigation).toBe(true);
    expect(report.tests.touchTargets).toBe(true);
    expect(report.tests.focusManagement).toBe(true);
  });
});
