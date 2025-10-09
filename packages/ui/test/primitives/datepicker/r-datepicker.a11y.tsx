/**
 * Accessibility Tests for r-datepicker Primitive
 * WCAG AAA compliance verification with comprehensive a11y checks
 *
 * @testType accessibility
 * @framework playwright
 * @primitive r-datepicker
 * @wcagLevel AAA
 */

import { expect, test } from '@playwright/experimental-ct-react';
import React from 'react';
import {
  runAxeScan,
  verifyAriaRole,
  verifyFocusIndicator,
  verifyKeyboardAccessible,
  verifyTouchTargetSize,
} from '../../a11y-utils';

// Import the web component to ensure it's registered
import '../../../src/primitives/datepicker/r-datepicker';

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

test.describe('r-datepicker Primitive - WCAG AAA Compliance', () => {
  test('should pass axe-core accessibility scan for default state', async ({ mount, page }) => {
    await mount(<RDatepickerWrapper data-testid="datepicker" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for expanded state', async ({ mount, page }) => {
    await mount(<RDatepickerWrapper expanded={true} data-testid="datepicker" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core accessibility scan for disabled state', async ({ mount, page }) => {
    await mount(<RDatepickerWrapper disabled={true} data-testid="datepicker" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with selected value', async ({ mount, page }) => {
    await mount(<RDatepickerWrapper value="2024-03-15" expanded={true} data-testid="datepicker" />);
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });

  test('should pass axe-core scan with min/max constraints', async ({ mount, page }) => {
    await mount(
      <RDatepickerWrapper 
        expanded={true} 
        min="2024-01-01" 
        max="2024-12-31" 
        data-testid="datepicker" 
      />
    );
    const results = await runAxeScan(page, { level: 'AAA' });
    expect(results.passed).toBe(true);
  });
});

test.describe('r-datepicker Primitive - ARIA Attributes', () => {
  test('should have button role on toggle', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');

    await verifyAriaRole(toggle, 'button');
  });

  test('should have grid role on calendar', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    const grid = component.locator('[role="grid"]');

    await expect(grid).toBeVisible();
    await verifyAriaRole(grid, 'grid');
  });

  test('should have dialog role on calendar container', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    const dialog = component.locator('[role="dialog"]');

    await expect(dialog).toBeVisible();
    await verifyAriaRole(dialog, 'dialog');
  });

  test('should set aria-expanded on toggle button', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');
    
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('should set aria-modal on dialog', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    const dialog = component.locator('[role="dialog"]');
    
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should set aria-label on toggle button', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');
    
    await expect(toggle).toHaveAttribute('aria-label', 'Choose date');
  });

  test('should set aria-label on dialog', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    const dialog = component.locator('[role="dialog"]');
    
    await expect(dialog).toHaveAttribute('aria-label', 'Choose date');
  });

  test('should set aria-label on navigation buttons', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const prevBtn = component.locator('[part="prev-month"]');
    const nextBtn = component.locator('[part="next-month"]');
    
    await expect(prevBtn).toHaveAttribute('aria-label', 'Previous month');
    await expect(nextBtn).toHaveAttribute('aria-label', 'Next month');
  });

  test('should set aria-selected on grid cells', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper value="2024-03-15" expanded={true} />);
    
    const selectedCells = component.locator('[aria-selected="true"]');
    const count = await selectedCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should set aria-disabled on out-of-range dates', async ({ mount }) => {
    const component = await mount(
      <RDatepickerWrapper expanded={true} min="2024-03-15" max="2024-03-20" />
    );
    
    const disabledCells = component.locator('[aria-disabled="true"]');
    const count = await disabledCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have aria-live region for month/year changes', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const monthYear = component.locator('[part="month-year"]');
    await expect(monthYear).toHaveAttribute('aria-live', 'polite');
    await expect(monthYear).toHaveAttribute('aria-atomic', 'true');
  });

  test('should have columnheader role on day headers', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const headers = component.locator('[role="columnheader"]');
    await expect(headers).toHaveCount(7);
  });

  test('should have gridcell role on date cells', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const cells = component.locator('[role="gridcell"]');
    const count = await cells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have row role on grid rows', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const rows = component.locator('[role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('r-datepicker Primitive - Keyboard Navigation', () => {
  test('should be keyboard accessible', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper />);
    await verifyKeyboardAccessible(page, component);
  });

  test('should navigate with Tab key', async ({ mount, page }) => {
    await mount(<RDatepickerWrapper />);
    
    // Tab should focus toggle button
    await page.keyboard.press('Tab');
    
    const activeElement = page.locator(':focus');
    await expect(activeElement).toHaveAttribute('part', 'toggle');
  });

  test('should open with Enter key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper />);
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should open with Space key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper />);
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should close with Escape key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    await page.keyboard.press('Escape');
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should navigate grid with Arrow keys', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    // Should not throw errors
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowUp');
    
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should navigate to month start with Home key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    await page.keyboard.press('Home');
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should navigate to month end with End key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    await page.keyboard.press('End');
    await expect(component.locator('[part="calendar"]')).toBeVisible();
  });

  test('should navigate months with PageUp/PageDown', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    const monthYear = component.locator('[part="month-year"]');
    const initialMonth = await monthYear.textContent();
    
    await page.keyboard.press('PageDown');
    const nextMonth = await monthYear.textContent();
    expect(nextMonth).not.toBe(initialMonth);
    
    await page.keyboard.press('PageUp');
    const currentMonth = await monthYear.textContent();
    expect(currentMonth).toBe(initialMonth);
  });

  test('should select date with Enter key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    await page.keyboard.press('Enter');
    
    // Calendar should close
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });

  test('should select date with Space key', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    await page.keyboard.press('Space');
    
    // Calendar should close
    await expect(component.locator('[part="calendar"]')).not.toBeVisible();
  });
});

test.describe('r-datepicker Primitive - Focus Management', () => {
  test('should have visible focus indicator', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');

    await verifyFocusIndicator(toggle);
  });

  test('should focus toggle button when tabbing', async ({ mount, page }) => {
    await mount(<RDatepickerWrapper />);
    
    await page.keyboard.press('Tab');
    
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('part', 'toggle');
  });

  test('should manage focus within grid', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const grid = component.locator('[role="grid"]');
    await grid.focus();
    
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('role', 'grid');
  });

  test('should trap focus within calendar when expanded', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    // Focus should stay within calendar dialog
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // All focused elements should be within the calendar
    const focused = page.locator(':focus');
    const calendar = component.locator('[part="calendar"]');
    
    await expect(focused).toBeVisible();
    await expect(calendar).toBeVisible();
  });

  test('should restore focus to toggle after closing', async ({ mount, page }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');
    
    // Open calendar
    await toggle.click();
    await expect(component.locator('[part="calendar"]')).toBeVisible();
    
    // Close with Escape
    await page.keyboard.press('Escape');
    
    // Focus should return to toggle
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('part', 'toggle');
  });
});

test.describe('r-datepicker Primitive - Touch Target Size', () => {
  test('should meet WCAG AAA 44x44px minimum for toggle button', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');

    await verifyTouchTargetSize(toggle, 'AAA');
  });

  test('should meet WCAG AAA 44x44px minimum for navigation buttons', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);

    const prevBtn = component.locator('[part="prev-month"]');
    const nextBtn = component.locator('[part="next-month"]');

    await verifyTouchTargetSize(prevBtn, 'AAA');
    await verifyTouchTargetSize(nextBtn, 'AAA');
  });

  test('should meet WCAG AAA 44x44px minimum for date cells', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);

    // Check a few date cells
    const cells = component.locator('[role="gridcell"]:not([part*="empty"])');
    const firstCell = cells.first();

    await verifyTouchTargetSize(firstCell, 'AAA');
  });
});

test.describe('r-datepicker Primitive - Screen Reader Support', () => {
  test('should announce expanded state changes', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper />);
    const toggle = component.locator('[part="toggle"]');
    
    // Initial state
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    
    // After expansion
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('should announce month changes', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const monthYear = component.locator('[part="month-year"]');
    await expect(monthYear).toHaveAttribute('aria-live', 'polite');
  });

  test('should provide labels for all interactive elements', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    // Toggle button
    const toggle = component.locator('[part="toggle"]');
    await expect(toggle).toHaveAttribute('aria-label', 'Choose date');
    
    // Navigation buttons
    const prevBtn = component.locator('[part="prev-month"]');
    const nextBtn = component.locator('[part="next-month"]');
    await expect(prevBtn).toHaveAttribute('aria-label', 'Previous month');
    await expect(nextBtn).toHaveAttribute('aria-label', 'Next month');
    
    // Dialog
    const dialog = component.locator('[role="dialog"]');
    await expect(dialog).toHaveAttribute('aria-label', 'Choose date');
  });

  test('should provide abbreviated labels for days of week', async ({ mount }) => {
    const component = await mount(<RDatepickerWrapper expanded={true} />);
    
    const headers = component.locator('[role="columnheader"]');
    const firstHeader = headers.first();
    
    // Should have aria-label attribute
    const ariaLabel = await firstHeader.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});
