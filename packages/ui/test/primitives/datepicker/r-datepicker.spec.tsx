/**
 * Integration Tests for r-datepicker Primitive
 * Playwright tests for user interactions
 *
 * @testType integration
 * @framework playwright
 * @primitive r-datepicker
 */

import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';

// Simple React wrapper for the web component
const RDatepickerWrapper = ({ 
  value = '', 
  expanded = false, 
  disabled = false,
  min,
  max,
  name,
  'data-testid': testId = 'datepicker'
}: {
  value?: string;
  expanded?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  name?: string;
  'data-testid'?: string;
}) => {
  return React.createElement('r-datepicker', {
    value,
    expanded,
    disabled,
    min,
    max,
    name,
    'data-testid': testId,
  });
};

test.describe('r-datepicker Primitive - Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Register the custom element
    await page.addScriptTag({
      content: `
        import('/packages/ui/src/primitives/datepicker/r-datepicker.ts');
      `,
      type: 'module',
    });
  });

  test('should render toggle button', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    await expect(component.locator('[part="toggle"]')).toBeVisible();
  });

  test('should toggle calendar on button click', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');

    // Initially not expanded
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();

    // Click to expand
    await toggle.click();
    await expect(component.locator('[part="calendar"]')).toBeVisible();

    // Click to collapse
    await toggle.click();
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should display calendar when expanded prop is true', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should not toggle when disabled', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper disabled={true} />);
    const toggle = component.locator('[part="toggle"]');

    await toggle.click();
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should display selected date value', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper value="2024-03-15" />);
    const valueDisplay = component.locator('[part="value"]');

    await expect(valueDisplay).toHaveText('2024-03-15');
  });

  test('should display placeholder when no value', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const valueDisplay = component.locator('[part="value"]');

    await expect(valueDisplay).toHaveText('Select date');
  });

  test('should render calendar grid with days of week', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const headers = component.locator('[role="columnheader"]');
    await expect(headers).toHaveCount(7);
  });

  test('should render grid cells for calendar days', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const cells = component.locator('[role="gridcell"]');
    const count = await cells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render month navigation buttons', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    await expect(component.locator('[part="prev-month"]')).toBeVisible();
    await expect(component.locator('[part="next-month"]')).toBeVisible();
  });

  test('should display current month and year', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const monthYear = component.locator('[part="month-year"]');
    await expect(monthYear).toBeVisible();
    
    const text = await monthYear.textContent();
    expect(text).toMatch(/\w+ \d{4}/); // e.g., "March 2024"
  });

  test('should close calendar on Escape key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    await expect(component.locator('[part="calendar"]')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should navigate with arrow keys', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    // Focus on grid
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    // Press arrow keys - should not throw error
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
    
    // Calendar should still be visible
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should select date on Enter key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    await page.keyboard.press('Enter');
    
    // Calendar should close after selection
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should select date on click', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    // Click on a grid cell (not empty)
    const cells = component.locator('[role="gridcell"]:not([part*="empty"])');
    const firstCell = cells.first();
    await firstCell.click();
    
    // Calendar should close after selection
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should mark selected date in grid', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper value="2024-03-15" expanded={true} />);
    
    const selectedCells = component.locator('[aria-selected="true"]');
    const count = await selectedCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render hidden input when name is provided', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper name="date-field" value="2024-03-15" />);
    
    const hiddenInput = component.locator('input[type="hidden"]');
    await expect(hiddenInput).toHaveAttribute('name', 'date-field');
    await expect(hiddenInput).toHaveAttribute('value', '2024-03-15');
  });

  test('should navigate months with prev/next buttons', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const monthYear = component.locator('[part="month-year"]');
    const initialMonth = await monthYear.textContent();
    
    // Click next month
    await component.locator('[part="next-month"]').click();
    const nextMonth = await monthYear.textContent();
    expect(nextMonth).not.toBe(initialMonth);
    
    // Click prev month
    await component.locator('[part="prev-month"]').click();
    const prevMonth = await monthYear.textContent();
    expect(prevMonth).toBe(initialMonth);
  });

  test('should be keyboard accessible', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper />);
    
    // Tab to toggle button
    await page.keyboard.press('Tab');
    
    // Open with Enter
    await page.keyboard.press('Enter');
    await expect(component.locator('[part="calendar"]')).toBeVisible();
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should have proper touch target size for buttons', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const toggle = component.locator('[part="toggle"]');
    const box = await toggle.boundingBox();
    
    // WCAG AAA requires 44x44px minimum
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('should work with min date constraint', async ({ mount }) => {
    const component = await mount(
      <RDatepickerWrapper expanded={true} min="2024-03-15" />
    );
    
    // Component should render - constraint validation is visual
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should work with max date constraint', async ({ mount }) => {
    const component = await mount(
      <RDatepickerWrapper expanded={true} max="2024-03-31" />
    );
    
    // Component should render - constraint validation is visual
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });
});
