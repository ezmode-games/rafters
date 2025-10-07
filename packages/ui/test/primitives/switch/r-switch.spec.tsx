/**
 * Playwright Integration Tests for r-switch Primitive
 * Tests visual rendering and interactive behavior in real browser
 *
 * @testType integration
 * @framework playwright
 * @primitive r-switch
 */

import { expect, test } from '@playwright/experimental-ct-react';

test.describe('r-switch Primitive - Visual Rendering', () => {
  test('should render with default state (unchecked)', async ({ mount }) => {
    const component = await mount(<r-switch>Enable notifications</r-switch>);
    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('role', 'switch');
    await expect(component).toHaveAttribute('aria-checked', 'false');
    await expect(component).not.toHaveAttribute('checked');
  });

  test('should render in checked state', async ({ mount }) => {
    const component = await mount(<r-switch checked>Already enabled</r-switch>);
    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('aria-checked', 'true');
    await expect(component).toHaveAttribute('checked');
  });

  test('should render in disabled state', async ({ mount }) => {
    const component = await mount(<r-switch disabled>Cannot change</r-switch>);
    await expect(component).toBeVisible();
    await expect(component).toHaveAttribute('disabled');
  });

  test('should display slotted content', async ({ mount, page }) => {
    await mount(<r-switch>Toggle theme</r-switch>);
    const text = await page.locator('r-switch').textContent();
    expect(text).toContain('Toggle theme');
  });
});

test.describe('r-switch Primitive - Interactive Behavior', () => {
  test('should toggle on click', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Click me</r-switch>);

    await expect(component).toHaveAttribute('aria-checked', 'false');

    await component.click();
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'true');

    await component.click();
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should toggle on Space key press', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Press space</r-switch>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'true');

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should not toggle on Enter key', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Press enter</r-switch>);

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });

  test('should not toggle when disabled (click)', async ({ mount, page }) => {
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

  test('should not toggle when disabled (keyboard)', async ({ mount, page }) => {
    const component = await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    await component.focus();
    await expect(component).toHaveAttribute('aria-checked', 'false');

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    await expect(component).toHaveAttribute('aria-checked', 'false');
  });
});

test.describe('r-switch Primitive - Focus Management', () => {
  test('should be focusable by default', async ({ mount, page }) => {
    await mount(<r-switch data-testid="switch">Focus me</r-switch>);

    await page.keyboard.press('Tab');
    const focused = await page.locator('r-switch').evaluate((el) => el === document.activeElement);
    expect(focused).toBe(true);
  });

  test('should show focus state when focused', async ({ mount, page }) => {
    const component = await mount(<r-switch data-testid="switch">Focus me</r-switch>);

    await component.focus();
    await expect(component).toBeFocused();
  });

  test('should not be focusable when disabled', async ({ mount, page }) => {
    await mount(
      <r-switch disabled data-testid="switch">
        Disabled
      </r-switch>
    );

    await page.keyboard.press('Tab');
    const focused = await page.locator('r-switch').evaluate((el) => el === document.activeElement);
    expect(focused).toBe(false);
  });
});

test.describe('r-switch Primitive - Event Handling', () => {
  test('should dispatch change event when toggled', async ({ mount, page }) => {
    let eventFired = false;

    await mount(
      <r-switch
        data-testid="switch"
        ref={(el: HTMLElement | null) => {
          if (el) {
            el.addEventListener('r-switch-change', () => {
              eventFired = true;
            });
          }
        }}
      >
        Event test
      </r-switch>
    );

    const component = page.locator('r-switch');
    await component.click();
    await page.waitForTimeout(100);

    expect(eventFired).toBe(true);
  });

  test('should include checked state in event detail', async ({ mount, page }) => {
    let eventDetail: { checked: boolean; name?: string; value?: string } | null = null;

    await mount(
      <r-switch
        name="notifications"
        value="enabled"
        data-testid="switch"
        ref={(el: HTMLElement | null) => {
          if (el) {
            el.addEventListener('r-switch-change', (e: Event) => {
              const customEvent = e as CustomEvent;
              eventDetail = customEvent.detail.value;
            });
          }
        }}
      >
        Event detail test
      </r-switch>
    );

    const component = page.locator('r-switch');
    await component.click();
    await page.waitForTimeout(100);

    expect(eventDetail).not.toBeNull();
    expect(eventDetail?.checked).toBe(true);
    expect(eventDetail?.name).toBe('notifications');
    expect(eventDetail?.value).toBe('enabled');
  });
});

test.describe('r-switch Primitive - Form Integration', () => {
  test('should have name attribute', async ({ mount }) => {
    const component = await mount(<r-switch name="theme">Theme toggle</r-switch>);
    const name = await component.evaluate((el: HTMLElement & { name?: string }) => el.name);
    expect(name).toBe('theme');
  });

  test('should have value attribute', async ({ mount }) => {
    const component = await mount(<r-switch value="dark-mode">Dark mode</r-switch>);
    const value = await component.evaluate((el: HTMLElement & { value?: string }) => el.value);
    expect(value).toBe('dark-mode');
  });

  test('should support multiple switches in a form', async ({ mount, page }) => {
    await mount(
      <div>
        <r-switch name="notifications" value="enabled">
          Notifications
        </r-switch>
        <r-switch name="theme" value="dark">
          Dark theme
        </r-switch>
      </div>
    );

    const switches = await page.locator('r-switch').all();
    expect(switches).toHaveLength(2);
  });
});

test.describe('r-switch Primitive - Accessibility Attributes', () => {
  test('should have role="switch"', async ({ mount }) => {
    const component = await mount(<r-switch>Role test</r-switch>);
    await expect(component).toHaveAttribute('role', 'switch');
  });

  test('should have tabindex="0"', async ({ mount }) => {
    const component = await mount(<r-switch>Tabindex test</r-switch>);
    await expect(component).toHaveAttribute('tabindex', '0');
  });

  test('should support aria-label', async ({ mount }) => {
    const component = await mount(<r-switch aria-label="Toggle notifications">Toggle</r-switch>);
    await expect(component).toHaveAttribute('aria-label', 'Toggle notifications');
  });

  test('should support aria-labelledby', async ({ mount, page }) => {
    await mount(
      <div>
        <span id="switch-label">Enable feature</span>
        <r-switch aria-labelledby="switch-label">Toggle</r-switch>
      </div>
    );

    const component = page.locator('r-switch');
    await expect(component).toHaveAttribute('aria-labelledby', 'switch-label');
  });

  test('should support aria-describedby', async ({ mount, page }) => {
    await mount(
      <div>
        <r-switch aria-describedby="switch-desc">Toggle</r-switch>
        <span id="switch-desc">This controls the feature state</span>
      </div>
    );

    const component = page.locator('r-switch');
    await expect(component).toHaveAttribute('aria-describedby', 'switch-desc');
  });
});
