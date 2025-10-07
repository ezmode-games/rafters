/**
 * Playwright Component Tests for r-slider Primitive
 * Tests visual rendering and interactive behavior in real browser
 *
 * @testType integration
 * @framework playwright
 * @primitive r-slider
 */

import { expect, test } from '@playwright/test';

test.describe('r-slider primitive - Visual Rendering', () => {
  test('should render with default values', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toBeVisible();
  });

  test('should render with custom value', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('value', '50');
  });

  test('should render with custom min and max', async ({ page }) => {
    await page.setContent('<r-slider min="10" max="200"></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('min', '10');
    await expect(slider).toHaveAttribute('max', '200');
  });

  test('should render with custom step', async ({ page }) => {
    await page.setContent('<r-slider step="5"></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('step', '5');
  });

  test('should render in vertical orientation', async ({ page }) => {
    await page.setContent('<r-slider orientation="vertical"></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('orientation', 'vertical');
  });

  test('should render disabled state', async ({ page }) => {
    await page.setContent('<r-slider disabled></r-slider>');
    const slider = page.locator('r-slider');
    await expect(slider).toHaveAttribute('disabled');
  });
});

test.describe('r-slider primitive - Keyboard Navigation', () => {
  test('should increment value with ArrowRight', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(51);
  });

  test('should increment value with ArrowUp', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowUp');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(51);
  });

  test('should decrement value with ArrowLeft', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowLeft');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(49);
  });

  test('should decrement value with ArrowDown', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowDown');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(49);
  });

  test('should set to minimum value with Home key', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('Home');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(0);
  });

  test('should set to maximum value with End key', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('End');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(100);
  });

  test('should increment by large step with PageUp', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('PageUp');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(60); // 50 + (100-0)/10
  });

  test('should decrement by large step with PageDown', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('PageDown');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(40); // 50 - (100-0)/10
  });

  test('should respect step value', async ({ page }) => {
    await page.setContent('<r-slider value="50" step="5"></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(55);
  });

  test('should not respond to keyboard when disabled', async ({ page }) => {
    await page.setContent('<r-slider value="50" disabled></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(50);
  });
});

test.describe('r-slider primitive - Focus Management', () => {
  test('should be focusable by default', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await expect(slider).toBeFocused();
  });

  test('should not be focusable when disabled', async ({ page }) => {
    await page.setContent('<r-slider disabled></r-slider>');
    const slider = page.locator('r-slider');

    await slider.focus();
    await expect(slider).not.toBeFocused();
  });

  test('should be keyboard accessible with Tab', async ({ page }) => {
    await page.setContent(`
      <div>
        <button>Before</button>
        <r-slider></r-slider>
        <button>After</button>
      </div>
    `);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const slider = page.locator('r-slider');
    await expect(slider).toBeFocused();
  });

  test('should skip disabled slider in tab order', async ({ page }) => {
    await page.setContent(`
      <div>
        <button>Before</button>
        <r-slider disabled></r-slider>
        <button id="after">After</button>
      </div>
    `);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const afterButton = page.locator('#after');
    await expect(afterButton).toBeFocused();
  });
});

test.describe('r-slider primitive - Events', () => {
  test('should dispatch r-slider event on value change', async ({ page }) => {
    await page.setContent('<r-slider value="50"></r-slider>');
    const slider = page.locator('r-slider');

    const eventPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        const element = document.querySelector('r-slider');
        if (element) {
          element.addEventListener('r-slider', (e: Event) => {
            const customEvent = e as CustomEvent;
            resolve(customEvent.detail.value);
          });
        }
      });
    });

    await slider.focus();
    await page.keyboard.press('ArrowRight');

    const eventDetail = await eventPromise;
    expect(eventDetail).toEqual({
      value: 51,
      min: 0,
      max: 100,
    });
  });

  test('should bubble events to parent', async ({ page }) => {
    await page.setContent(`
      <div id="parent">
        <r-slider value="50"></r-slider>
      </div>
    `);

    const eventPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        const parent = document.querySelector('#parent');
        if (parent) {
          parent.addEventListener('r-slider', (e: Event) => {
            const customEvent = e as CustomEvent;
            resolve(customEvent.detail.value);
          });
        }
      });
    });

    const slider = page.locator('r-slider');
    await slider.focus();
    await page.keyboard.press('ArrowRight');

    const eventDetail = await eventPromise;
    expect(eventDetail).toEqual({
      value: 51,
      min: 0,
      max: 100,
    });
  });
});

test.describe('r-slider primitive - Form Integration', () => {
  test('should include name attribute when provided', async ({ page }) => {
    await page.setContent('<r-slider name="volume"></r-slider>');
    const slider = page.locator('r-slider');

    const name = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('name');
    });

    expect(name).toBe('volume');
  });

  test('should have empty name when not provided', async ({ page }) => {
    await page.setContent('<r-slider></r-slider>');
    const slider = page.locator('r-slider');

    const name = await slider.evaluate((el: Element) => {
      const input = (el as HTMLElement).shadowRoot?.querySelector('input');
      return input?.getAttribute('name');
    });

    expect(name).toBe('');
  });
});

test.describe('r-slider primitive - Mouse Interaction', () => {
  test('should update value on mouse interaction with native range input', async ({ page }) => {
    await page.setContent('<r-slider value="50" min="0" max="100"></r-slider>');
    const slider = page.locator('r-slider');

    // Get the input element from shadow DOM
    const input = await slider.evaluateHandle((el: Element) => {
      return (el as HTMLElement).shadowRoot?.querySelector('input');
    });

    // Simulate interaction
    await input.evaluate((el) => {
      if (el instanceof HTMLInputElement) {
        el.value = '75';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await page.waitForTimeout(100);

    const value = await slider.evaluate(
      (el: Element) => (el as HTMLElement & { value: number }).value
    );
    expect(value).toBe(75);
  });
});
