/**
 * Unit Tests for r-combobox Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-combobox
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-combobox.ts';
import type { RCombobox } from './r-combobox.ts';

describe('r-combobox primitive', () => {
  let element: RCombobox;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-combobox') as RCombobox;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-combobox');
    });

    it('should have combobox role by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('combobox');
    });

    it('should be in tab order by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should render input element', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input).toBeDefined();
      expect(input?.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-expanded="false" by default', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-haspopup="listbox"', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-haspopup')).toBe('listbox');
    });
  });

  describe('Properties', () => {
    it('should have default empty value', () => {
      expect(element.value).toBe('');
    });

    it('should update value property', async () => {
      element.value = 'Test Value';
      await element.updateComplete;
      expect(element.value).toBe('Test Value');
    });

    it('should have expanded=false by default', () => {
      expect(element.expanded).toBe(false);
    });

    it('should update expanded property', async () => {
      element.expanded = true;
      await element.updateComplete;
      expect(element.expanded).toBe(true);
      expect(element.getAttribute('expanded')).toBe('');
    });

    it('should support placeholder', async () => {
      element.placeholder = 'Select option';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('placeholder')).toBe('Select option');
    });

    it('should support name attribute', async () => {
      element.name = 'my-combobox';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('name')).toBe('my-combobox');
    });

    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Keyboard Interactions', () => {
    it('should open listbox on ArrowDown', async () => {
      await element.updateComplete;
      expect(element.expanded).toBe(false);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await element.updateComplete;

      expect(element.expanded).toBe(true);
    });

    it('should open listbox on ArrowUp', async () => {
      await element.updateComplete;
      expect(element.expanded).toBe(false);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await element.updateComplete;

      expect(element.expanded).toBe(true);
    });

    it('should close listbox on Escape', async () => {
      element.expanded = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await element.updateComplete;

      expect(element.expanded).toBe(false);
    });

    it('should prevent default on ArrowDown', async () => {
      await element.updateComplete;
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('should prevent default on ArrowUp', async () => {
      await element.updateComplete;
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('should prevent default on Enter', async () => {
      element.expanded = true;
      await element.updateComplete;
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('should not respond to keyboard when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await element.updateComplete;

      expect(element.expanded).toBe(false);
    });
  });

  describe('Click Interactions', () => {
    it('should toggle expanded on click', async () => {
      await element.updateComplete;
      expect(element.expanded).toBe(false);

      element.click();
      await element.updateComplete;
      expect(element.expanded).toBe(true);

      element.click();
      await element.updateComplete;
      expect(element.expanded).toBe(false);
    });

    it('should not toggle when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(element.expanded).toBe(false);
    });
  });

  describe('Input Events', () => {
    it('should update value on input', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.value = 'New value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe('New value');
    });

    it('should dispatch custom event on input', async () => {
      const spy = vi.fn();
      element.addEventListener('r-combobox-input', spy);
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'Test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await element.updateComplete;

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0].detail.value.value).toBe('Test');
    });

    it('should open listbox when typing', async () => {
      await element.updateComplete;
      expect(element.expanded).toBe(false);

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = 'a';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await element.updateComplete;

      expect(element.expanded).toBe(true);
    });
  });

  describe('Focus Management', () => {
    it('should have focus() method', () => {
      expect(typeof element.focus).toBe('function');
    });

    it('should have blur() method', () => {
      expect(typeof element.blur).toBe('function');
    });

    it('should focus input element when focus() is called', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      const focusSpy = vi.spyOn(input, 'focus');

      element.focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should blur input element when blur() is called', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      const blurSpy = vi.spyOn(input, 'blur');

      element.blur();

      expect(blurSpy).toHaveBeenCalled();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have aria-controls attribute', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('aria-controls')).toBe(true);
    });

    it('should update aria-expanded when expanded changes', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');

      expect(input?.getAttribute('aria-expanded')).toBe('false');

      element.expanded = true;
      await element.updateComplete;

      expect(input?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should support aria-label', async () => {
      element.ariaLabel = 'Select country';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-label')).toBe('Select country');
    });

    it('should support aria-labelledby', async () => {
      element.ariaLabelledBy = 'label-id';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-labelledby')).toBe('label-id');
    });

    it('should support aria-describedby', async () => {
      element.ariaDescribedBy = 'description-id';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-describedby')).toBe('description-id');
    });
  });

  describe('Lifecycle', () => {
    it('should register event listeners on connect', async () => {
      const newElement = document.createElement('r-combobox') as RCombobox;
      container.appendChild(newElement);
      await newElement.updateComplete;

      expect(newElement.expanded).toBe(false);
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await newElement.updateComplete;

      expect(newElement.expanded).toBe(true);
    });

    it('should cleanup event listeners on disconnect', async () => {
      await element.updateComplete;
      element.expanded = false;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await element.updateComplete;
      expect(element.expanded).toBe(true);

      element.remove();
      element.expanded = false;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await element.updateComplete;

      // Event listener removed, so expanded should still be false
      expect(element.expanded).toBe(false);
    });
  });

  describe('Autocomplete', () => {
    it('should have autocomplete="off" on input', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('autocomplete')).toBe('off');
    });
  });
});
