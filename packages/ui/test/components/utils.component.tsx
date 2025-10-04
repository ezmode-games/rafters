/**
 * Playwright Component Tests for Utility Functions
 * These tests require real browser APIs that jsdom doesn't support
 */

import { expect, test } from '@playwright/experimental-ct-react';

test.describe('Accessibility utilities (browser-only)', () => {
  test('should check touch target size', async ({ mount, page }) => {
    await mount(
      <div>
        {/* biome-ignore lint/a11y/useButtonType: test fixture */}
        {/* biome-ignore lint/correctness/useUniqueElementIds: test fixture needs static IDs */}
        <button id="large" style={{ width: '44px', height: '44px' }}>
          Large
        </button>
        {/* biome-ignore lint/a11y/useButtonType: test fixture */}
        {/* biome-ignore lint/correctness/useUniqueElementIds: test fixture needs static IDs */}
        <button id="small" style={{ width: '20px', height: '20px' }}>
          Small
        </button>
      </div>
    );

    const largeButton = page.locator('#large');
    const smallButton = page.locator('#small');

    const largeMeetsSizeRequirement = await largeButton.evaluate((el) => {
      return window.meetsTouchTargetSize(el);
    });

    const smallMeetsSizeRequirement = await smallButton.evaluate((el) => {
      return window.meetsTouchTargetSize(el);
    });

    expect(largeMeetsSizeRequirement).toBe(true);
    expect(smallMeetsSizeRequirement).toBe(false);
  });

  test('should get focusable elements', async ({ mount, page }) => {
    await mount(
      <div data-testid="container">
        <button>Button</button>
        <a href="https://example.com">Link</a>
        <input type="text" />
        <div>Non-focusable div</div>
        <button disabled>Disabled</button>
      </div>
    );

    const focusableCount = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="container"]');
      const focusable = window.getFocusableElements(container);
      return focusable.length;
    });

    expect(focusableCount).toBe(3);
  });

  test('should trap focus', async ({ mount, page }) => {
    await mount(
      <div data-testid="container">
        <button data-testid="first" type="button">
          First
        </button>
        <button data-testid="second" type="button">
          Second
        </button>
        <button data-testid="last" type="button">
          Last
        </button>
      </div>
    );

    const lastButton = page.locator('[data-testid="last"]');
    await lastButton.focus();

    const trapped = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="container"]');
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      return window.trapFocus(container, event);
    });

    expect(trapped).toBe(true);
  });

  test('should focus first element', async ({ mount, page }) => {
    await mount(
      <div data-testid="container">
        <button data-testid="first" type="button">
          First
        </button>
        <button data-testid="second" type="button">
          Second
        </button>
      </div>
    );

    const success = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="container"]');
      return window.focusFirst(container);
    });

    // Wait for focus to settle in webkit
    await page.waitForTimeout(150);

    const activeElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));

    expect(success).toBe(true);
    expect(activeElement).toBe('first');
  });
});

test.describe('Focus utilities (browser-only)', () => {
  test('should check element visibility', async ({ mount, page }) => {
    await mount(
      <div>
        <div data-testid="visible" style={{ width: '100px', height: '100px' }}>
          Visible
        </div>
        <div data-testid="hidden" style={{ display: 'none' }}>
          Hidden
        </div>
      </div>
    );

    const visibleElement = page.locator('[data-testid="visible"]');
    const hiddenElement = page.locator('[data-testid="hidden"]');

    const isVisibleElementVisible = await visibleElement.evaluate((el) => {
      return window.isElementVisible(el);
    });

    const isHiddenElementVisible = await hiddenElement.evaluate((el) => {
      return window.isElementVisible(el);
    });

    expect(isVisibleElementVisible).toBe(true);
    expect(isHiddenElementVisible).toBe(false);
  });

  test('should move focus to visible element', async ({ mount, page }) => {
    await mount(
      <div>
        <button data-testid="target" type="button" style={{ width: '100px', height: '100px' }}>
          Focus Target
        </button>
      </div>
    );

    const targetButton = page.locator('[data-testid="target"]');
    await targetButton.waitFor({ state: 'attached' });

    const success = await targetButton.evaluate((el) => {
      return window.moveFocusTo(el as HTMLElement);
    });

    const activeElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));

    expect(success).toBe(true);
    expect(activeElement).toBe('target');
  });
});
