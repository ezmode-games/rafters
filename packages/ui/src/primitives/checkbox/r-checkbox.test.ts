/**
 * Unit Tests for r-checkbox Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-checkbox
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-checkbox.ts';
import type { RCheckbox } from './r-checkbox.ts';

describe('r-checkbox primitive', () => {
  let element: RCheckbox;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-checkbox') as RCheckbox;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-checkbox');
    });

    it('should have checkbox role by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('checkbox');
    });

    it('should be in tab order by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should have aria-checked="false" by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('false');
    });

    it('should render slotted content', async () => {
      const span = document.createElement('span');
      span.textContent = 'Accept terms';
      element.appendChild(span);

      await element.updateComplete;
      expect(element.textContent).toContain('Accept terms');
    });
  });

  describe('Checked Property', () => {
    it('should be unchecked by default', () => {
      expect(element.checked).toBe(false);
    });

    it('should set checked property', async () => {
      element.checked = true;
      await element.updateComplete;

      expect(element.checked).toBe(true);
      expect(element.getAttribute('aria-checked')).toBe('true');
    });

    it('should reflect checked to attribute', async () => {
      element.checked = true;
      await element.updateComplete;

      expect(element.hasAttribute('checked')).toBe(true);
    });

    it('should update aria-checked when checked changes', async () => {
      element.checked = false;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('false');

      element.checked = true;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('Indeterminate Property', () => {
    it('should be not indeterminate by default', () => {
      expect(element.indeterminate).toBe(false);
    });

    it('should set indeterminate property', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      expect(element.indeterminate).toBe(true);
      expect(element.getAttribute('aria-checked')).toBe('mixed');
    });

    it('should reflect indeterminate to attribute', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      expect(element.hasAttribute('indeterminate')).toBe(true);
    });

    it('should set aria-checked to "mixed" when indeterminate', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('mixed');
    });

    it('should take precedence over checked state', async () => {
      element.checked = true;
      element.indeterminate = true;
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('mixed');
    });
  });

  describe('Form Properties', () => {
    it('should set name property', () => {
      element.name = 'agree';
      expect(element.name).toBe('agree');
    });

    it('should set value property', () => {
      element.value = 'yes';
      expect(element.value).toBe('yes');
    });

    it('should have undefined name by default', () => {
      expect(element.name).toBeUndefined();
    });

    it('should have undefined value by default', () => {
      expect(element.value).toBeUndefined();
    });
  });

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      expect(element.disabled).toBe(false);
    });

    it('should set disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
    });

    it('should reflect disabled to attribute', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should not toggle when disabled and clicked', async () => {
      element.disabled = true;
      await element.updateComplete;

      const initialChecked = element.checked;
      element.click();
      await element.updateComplete;

      expect(element.checked).toBe(initialChecked);
    });

    it('should not toggle when disabled and Space pressed', async () => {
      element.disabled = true;
      await element.updateComplete;

      const initialChecked = element.checked;
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(element.checked).toBe(initialChecked);
    });
  });

  describe('Click Interactions', () => {
    it('should toggle checked on click', async () => {
      await element.updateComplete;
      expect(element.checked).toBe(false);

      element.click();
      await element.updateComplete;
      expect(element.checked).toBe(true);

      element.click();
      await element.updateComplete;
      expect(element.checked).toBe(false);
    });

    it('should dispatch change event on click', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-checkbox-change', changeSpy);

      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should include checkbox state in change event', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-checkbox-change', (e: Event) => {
        const customEvent = e as CustomEvent;
        changeSpy(customEvent.detail);
      });

      element.name = 'terms';
      element.value = 'accepted';
      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
      const callArgs = changeSpy.mock.calls[0][0];
      expect(callArgs.value).toEqual({
        checked: true,
        indeterminate: false,
        name: 'terms',
        value: 'accepted',
      });
      expect(callArgs.timestamp).toBeDefined();
    });

    it('should clear indeterminate and set checked on click', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      expect(element.indeterminate).toBe(true);
      expect(element.checked).toBe(false);

      element.click();
      await element.updateComplete;

      expect(element.indeterminate).toBe(false);
      expect(element.checked).toBe(true);
    });
  });

  describe('Keyboard Interactions', () => {
    it('should toggle checked on Space key', async () => {
      await element.updateComplete;
      expect(element.checked).toBe(false);

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(spaceEvent);
      await element.updateComplete;

      expect(element.checked).toBe(true);
    });

    it('should prevent default on Space key to avoid page scroll', async () => {
      await element.updateComplete;

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');

      element.dispatchEvent(spaceEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not trigger on Enter key', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-checkbox-change', changeSpy);

      await element.updateComplete;

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(enterEvent);
      await element.updateComplete;

      expect(changeSpy).not.toHaveBeenCalled();
      expect(element.checked).toBe(false);
    });

    it('should not trigger on other keys', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-checkbox-change', changeSpy);

      await element.updateComplete;

      const keys = ['a', 'Escape', 'Tab', 'ArrowUp', 'ArrowDown'];
      for (const key of keys) {
        const event = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(event);
      }

      await element.updateComplete;
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should dispatch change event on Space key', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-checkbox-change', changeSpy);

      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should clear indeterminate on Space key', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;

      expect(element.indeterminate).toBe(false);
      expect(element.checked).toBe(true);
    });
  });

  describe('Lifecycle Management', () => {
    it('should register keyboard listener on connect', async () => {
      const newElement = document.createElement('r-checkbox') as RCheckbox;
      const changeSpy = vi.fn();
      newElement.addEventListener('r-checkbox-change', changeSpy);

      // Element not yet connected
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(changeSpy).not.toHaveBeenCalled();

      // Connect to DOM
      container.appendChild(newElement);
      await newElement.updateComplete;

      // Now keyboard should work
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await newElement.updateComplete;
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should cleanup event listeners on disconnect', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-checkbox-change', changeSpy);

      await element.updateComplete;

      // Keyboard works while connected
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;
      expect(changeSpy).toHaveBeenCalledTimes(1);

      // Disconnect
      element.remove();

      // Keyboard listener should be removed
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await element.updateComplete;
      // Click count should still be 1 (keyboard listener removed)
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration with Utils', () => {
    it('should use preventDefaultForActionKeys from keyboard utils', async () => {
      await element.updateComplete;

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');

      element.dispatchEvent(spaceEvent);

      // preventDefaultForActionKeys prevents default on Space
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('RPrimitiveBase Integration', () => {
    it('should inherit focus state tracking from base class', async () => {
      await element.updateComplete;

      // _focused is from RPrimitiveBase
      expect(element._focused).toBe(false);

      element.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element._focused).toBe(true);
    });

    it('should inherit hover state tracking from base class', async () => {
      await element.updateComplete;

      // _hovered is from RPrimitiveBase
      expect(element._hovered).toBe(false);

      element.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element._hovered).toBe(true);
    });

    it('should inherit disabled property from base class', () => {
      expect(element).toHaveProperty('disabled');
      expect(element.disabled).toBe(false);

      element.disabled = true;
      expect(element.disabled).toBe(true);
    });

    it('should inherit ARIA properties from base class', async () => {
      element.ariaLabel = 'Accept terms';
      await element.updateComplete;

      expect(element.ariaLabel).toBe('Accept terms');
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper aria-checked values', async () => {
      // Unchecked
      element.checked = false;
      element.indeterminate = false;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('false');

      // Checked
      element.checked = true;
      element.indeterminate = false;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('true');

      // Indeterminate
      element.checked = false;
      element.indeterminate = true;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('mixed');
    });

    it('should update aria-checked on render', async () => {
      element.checked = true;
      await element.updateComplete;

      // Force re-render
      element.requestUpdate();
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('true');
    });
  });
});
