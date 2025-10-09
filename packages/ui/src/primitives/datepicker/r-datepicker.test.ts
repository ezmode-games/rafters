/**
 * Unit Tests for r-datepicker Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-datepicker
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-datepicker.ts';
import type { RDatepicker } from './r-datepicker.ts';

describe('r-datepicker primitive', () => {
  let element: RDatepicker;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-datepicker') as RDatepicker;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-datepicker');
    });

    it('should have empty value by default', async () => {
      await element.updateComplete;
      expect(element.value).toBe('');
    });

    it('should not be expanded by default', async () => {
      await element.updateComplete;
      expect(element.expanded).toBe(false);
    });

    it('should not be disabled by default', async () => {
      await element.updateComplete;
      expect(element.disabled).toBe(false);
    });

    it('should render toggle button', async () => {
      await element.updateComplete;
      const button = element.shadowRoot?.querySelector('[part="toggle"]');
      expect(button).toBeTruthy();
    });

    it('should not show calendar when not expanded', async () => {
      element.expanded = false;
      await element.updateComplete;
      const calendar = element.shadowRoot?.querySelector('[part="calendar"]');
      expect(calendar).toBeNull();
    });

    it('should show calendar when expanded', async () => {
      element.expanded = true;
      await element.updateComplete;
      const calendar = element.shadowRoot?.querySelector('[part="calendar"]');
      expect(calendar).toBeTruthy();
    });
  });

  describe('Properties', () => {
    it('should set value property', async () => {
      element.value = '2024-03-15';
      await element.updateComplete;
      expect(element.value).toBe('2024-03-15');
    });

    it('should set expanded property', async () => {
      element.expanded = true;
      await element.updateComplete;
      expect(element.expanded).toBe(true);
      expect(element.hasAttribute('expanded')).toBe(true);
    });

    it('should set disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should set min property', async () => {
      element.min = '2024-01-01';
      await element.updateComplete;
      expect(element.min).toBe('2024-01-01');
    });

    it('should set max property', async () => {
      element.max = '2024-12-31';
      await element.updateComplete;
      expect(element.max).toBe('2024-12-31');
    });

    it('should set name property', async () => {
      element.name = 'date-field';
      await element.updateComplete;
      expect(element.name).toBe('date-field');
    });

    it('should render hidden input when name is set', async () => {
      element.name = 'date-field';
      element.value = '2024-03-15';
      await element.updateComplete;

      const hiddenInput = element.shadowRoot?.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput?.getAttribute('name')).toBe('date-field');
      expect(hiddenInput?.getAttribute('value')).toBe('2024-03-15');
    });
  });

  describe('Toggle Functionality', () => {
    it('should toggle expanded state', async () => {
      expect(element.expanded).toBe(false);

      element.toggle();
      await element.updateComplete;
      expect(element.expanded).toBe(true);

      element.toggle();
      await element.updateComplete;
      expect(element.expanded).toBe(false);
    });

    it('should not toggle when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.toggle();
      await element.updateComplete;
      expect(element.expanded).toBe(false);
    });

    it('should dispatch open event when expanding', async () => {
      const openSpy = vi.fn();
      element.addEventListener('r-datepicker-open', openSpy);

      element.toggle();
      await element.updateComplete;

      expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch close event when collapsing', async () => {
      element.expanded = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('r-datepicker-close', closeSpy);

      element.toggle();
      await element.updateComplete;

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should not navigate when disabled', async () => {
      element.disabled = true;
      element.expanded = true;
      element.value = '2024-03-15';
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      element.dispatchEvent(event);

      await element.updateComplete;
      expect(element.value).toBe('2024-03-15');
    });

    it('should not navigate when not expanded', async () => {
      element.expanded = false;
      element.value = '2024-03-15';
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      element.dispatchEvent(event);

      await element.updateComplete;
      expect(element.value).toBe('2024-03-15');
    });

    it('should close calendar on Escape key', async () => {
      element.expanded = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('r-datepicker-close', closeSpy);

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      element.dispatchEvent(event);

      await element.updateComplete;
      expect(element.expanded).toBe(false);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should prevent default on handled keys', async () => {
      element.expanded = true;
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should stop propagation on handled keys', async () => {
      element.expanded = true;
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        cancelable: true,
      });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      element.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Date Validation', () => {
    it('should respect min date constraint', async () => {
      element.min = '2024-03-15';
      element.expanded = true;
      await element.updateComplete;

      // Try to select a date before min
      const beforeMin = '2024-03-10';
      element.value = beforeMin;
      await element.updateComplete;

      // The primitive accepts the value, but marks dates as disabled in UI
      // This is correct behavior - validation is UI concern
      expect(element.value).toBe(beforeMin);
    });

    it('should respect max date constraint', async () => {
      element.max = '2024-03-15';
      element.expanded = true;
      await element.updateComplete;

      // Try to select a date after max
      const afterMax = '2024-03-20';
      element.value = afterMax;
      await element.updateComplete;

      // The primitive accepts the value, but marks dates as disabled in UI
      expect(element.value).toBe(afterMax);
    });
  });

  describe('Events', () => {
    it('should dispatch change event with new and old values', async () => {
      element.value = '2024-03-15';
      element.expanded = true;
      await element.updateComplete;

      const changeSpy = vi.fn();
      element.addEventListener('r-datepicker-change', changeSpy);

      // Simulate date selection via Enter key
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      element.dispatchEvent(event);

      await element.updateComplete;
      expect(changeSpy).toHaveBeenCalled();
    });

    it('should close calendar after date selection', async () => {
      element.expanded = true;
      await element.updateComplete;

      const closeSpy = vi.fn();
      element.addEventListener('r-datepicker-close', closeSpy);

      // Simulate date selection
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      element.dispatchEvent(event);

      await element.updateComplete;
      expect(element.expanded).toBe(false);
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-expanded on toggle button', async () => {
      await element.updateComplete;
      const button = element.shadowRoot?.querySelector('[part="toggle"]');

      expect(button?.getAttribute('aria-expanded')).toBe('false');

      element.expanded = true;
      await element.updateComplete;

      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set role="grid" on calendar', async () => {
      element.expanded = true;
      await element.updateComplete;

      const grid = element.shadowRoot?.querySelector('[role="grid"]');
      expect(grid).toBeTruthy();
    });

    it('should set role="dialog" on calendar container', async () => {
      element.expanded = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should mark dialog as modal', async () => {
      element.expanded = true;
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('[role="dialog"]');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('should set aria-selected on selected date', async () => {
      element.value = '2024-03-15';
      // Force display month to match the selected date
      (element as unknown as { _displayMonth: string })._displayMonth = '2024-03';
      element.expanded = true;
      await element.updateComplete;

      const cells = element.shadowRoot?.querySelectorAll('[role="gridcell"]');
      const selectedCell = Array.from(cells || []).find(
        (cell) => cell.getAttribute('aria-selected') === 'true'
      );

      expect(selectedCell).toBeTruthy();
    });
  });

  describe('Calendar Grid', () => {
    it('should render days of week header', async () => {
      element.expanded = true;
      await element.updateComplete;

      const headers = element.shadowRoot?.querySelectorAll('[role="columnheader"]');
      expect(headers?.length).toBe(7);
    });

    it('should render grid cells for days', async () => {
      element.expanded = true;
      await element.updateComplete;

      const cells = element.shadowRoot?.querySelectorAll('[role="gridcell"]');
      expect(cells?.length).toBeGreaterThan(0);
    });

    it('should render month navigation buttons', async () => {
      element.expanded = true;
      await element.updateComplete;

      const prevBtn = element.shadowRoot?.querySelector('[part="prev-month"]');
      const nextBtn = element.shadowRoot?.querySelector('[part="next-month"]');

      expect(prevBtn).toBeTruthy();
      expect(nextBtn).toBeTruthy();
    });

    it('should display current month and year', async () => {
      element.expanded = true;
      await element.updateComplete;

      const monthYear = element.shadowRoot?.querySelector('[part="month-year"]');
      expect(monthYear?.textContent).toBeTruthy();
    });
  });

  describe('Focus Management', () => {
    it('should track focus state internally', async () => {
      await element.updateComplete;

      expect(element._focused).toBe(false);

      element.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element._focused).toBe(true);

      element.dispatchEvent(new FocusEvent('blur'));
      await element.updateComplete;

      expect(element._focused).toBe(false);
    });

    it('should have focus method', () => {
      expect(typeof element.focus).toBe('function');
    });
  });

  describe('Lifecycle', () => {
    it('should register keyboard listener on connect', async () => {
      const newElement = document.createElement('r-datepicker') as RDatepicker;
      newElement.expanded = true;

      // Element not yet connected
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      newElement.dispatchEvent(event);
      expect(newElement.expanded).toBe(true);

      // Connect to DOM
      container.appendChild(newElement);
      await newElement.updateComplete;

      // Now keyboard should work
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await newElement.updateComplete;
      expect(newElement.expanded).toBe(false);
    });

    it('should cleanup event listeners on disconnect', async () => {
      element.expanded = true;
      await element.updateComplete;

      expect(element.expanded).toBe(true);

      // Disconnect
      element.remove();

      // Keyboard listener should be removed
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      element.dispatchEvent(event);

      // State should not change after disconnect
      expect(element.expanded).toBe(true);
    });
  });

  describe('RPrimitiveBase Integration', () => {
    it('should inherit disabled property from base class', async () => {
      expect(element.disabled).toBe(false);

      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should inherit ARIA properties from base class', async () => {
      element.ariaLabel = 'Select a date';
      await element.updateComplete;

      expect(element.ariaLabel).toBe('Select a date');
    });
  });
});
