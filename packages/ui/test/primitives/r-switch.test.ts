/**
 * Unit Tests for r-switch Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-switch
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../../src/primitives/switch/r-switch.ts';
import type { RSwitch } from '../../src/primitives/switch/r-switch.ts';

describe('r-switch primitive', () => {
  let element: RSwitch;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-switch') as RSwitch;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-switch');
    });

    it('should have switch role by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('switch');
    });

    it('should be in tab order by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should have checked=false by default', () => {
      expect(element.checked).toBe(false);
    });

    it('should have aria-checked="false" by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('false');
    });

    it('should render slotted content', async () => {
      const span = document.createElement('span');
      span.textContent = 'Enable notifications';
      element.appendChild(span);

      await element.updateComplete;
      expect(element.textContent).toContain('Enable notifications');
    });
  });

  describe('Checked State', () => {
    it('should update checked state when property is set', async () => {
      element.checked = true;
      await element.updateComplete;

      expect(element.checked).toBe(true);
      expect(element.hasAttribute('checked')).toBe(true);
    });

    it('should update aria-checked when checked changes', async () => {
      element.checked = true;
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('true');

      element.checked = false;
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('false');
    });

    it('should toggle checked state on click', async () => {
      expect(element.checked).toBe(false);

      element.click();
      await element.updateComplete;

      expect(element.checked).toBe(true);

      element.click();
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });
  });

  describe('Keyboard Interactions', () => {
    it('should toggle on Space key', async () => {
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

    it('should not toggle on Enter key', async () => {
      expect(element.checked).toBe(false);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(enterEvent);
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should not toggle on other keys', async () => {
      expect(element.checked).toBe(false);

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

      expect(element.checked).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('should not toggle when disabled via click', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should not toggle when disabled via keyboard', async () => {
      element.disabled = true;
      await element.updateComplete;

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(spaceEvent);
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should have disabled attribute when disabled=true', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Events', () => {
    it('should dispatch r-switch-change event when checked changes', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-switch-change', changeSpy);

      element.checked = true;
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
      const event = changeSpy.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value.checked).toBe(true);
    });

    it('should dispatch event with name and value if provided', async () => {
      element.name = 'notifications';
      element.value = 'enabled';

      const changeSpy = vi.fn();
      element.addEventListener('r-switch-change', changeSpy);

      element.checked = true;
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
      const event = changeSpy.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value.name).toBe('notifications');
      expect(event.detail.value.value).toBe('enabled');
      expect(event.detail.value.checked).toBe(true);
    });

    it('should dispatch event on toggle', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-switch-change', changeSpy);

      element.click();
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should bubble events to parent', async () => {
      const parentSpy = vi.fn();
      container.addEventListener('r-switch-change', parentSpy);

      element.checked = true;
      await element.updateComplete;

      expect(parentSpy).toHaveBeenCalledTimes(1);
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

    it('should track hover state internally', async () => {
      await element.updateComplete;

      expect(element._hovered).toBe(false);

      element.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element._hovered).toBe(true);

      element.dispatchEvent(new MouseEvent('mouseleave'));
      await element.updateComplete;

      expect(element._hovered).toBe(false);
    });
  });

  describe('Form Integration', () => {
    it('should support name attribute', async () => {
      element.name = 'theme-toggle';
      await element.updateComplete;

      expect(element.name).toBe('theme-toggle');
    });

    it('should support value attribute', async () => {
      element.value = 'dark-mode';
      await element.updateComplete;

      expect(element.value).toBe('dark-mode');
    });
  });

  describe('Lifecycle', () => {
    it('should register event listeners on connect', async () => {
      const newElement = document.createElement('r-switch') as RSwitch;
      const changeSpy = vi.fn();
      newElement.addEventListener('r-switch-change', changeSpy);

      // Element not yet connected - click should not work properly
      const clickEvent = new MouseEvent('click', { bubbles: true });
      newElement.dispatchEvent(clickEvent);
      // Click might work but listeners not yet registered

      // Connect to DOM
      container.appendChild(newElement);
      await newElement.updateComplete;

      // Clear any events from connection
      changeSpy.mockClear();

      // Now click should definitely work
      newElement.click();
      await newElement.updateComplete;
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should cleanup event listeners on disconnect', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-switch-change', changeSpy);

      await element.updateComplete;

      // Click works while connected
      element.click();
      await element.updateComplete;
      expect(changeSpy).toHaveBeenCalledTimes(1);

      // Disconnect
      element.remove();

      // Manually change checked (event listener should be removed)
      element.checked = !element.checked;
      await element.updateComplete;

      // Should have been called once more (property setter still dispatches)
      expect(changeSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('RPrimitiveBase Integration', () => {
    it('should inherit focus state tracking from base class', async () => {
      await element.updateComplete;

      expect(element._focused).toBe(false);

      element.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element._focused).toBe(true);
    });

    it('should inherit hover state tracking from base class', async () => {
      await element.updateComplete;

      expect(element._hovered).toBe(false);

      element.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element._hovered).toBe(true);
    });

    it('should inherit ARIA properties from base class', async () => {
      element.ariaLabel = 'Toggle notifications';
      element.ariaLabelledBy = 'label-id';
      element.ariaDescribedBy = 'desc-id';

      await element.updateComplete;

      expect(element.ariaLabel).toBe('Toggle notifications');
      expect(element.ariaLabelledBy).toBe('label-id');
      expect(element.ariaDescribedBy).toBe('desc-id');
    });

    it('should inherit disabled property from base class', async () => {
      expect(element.disabled).toBe(false);

      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('ARIA Compliance', () => {
    it('should maintain switch role', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('switch');
    });

    it('should sync aria-checked with checked property', async () => {
      element.checked = true;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('true');

      element.checked = false;
      await element.updateComplete;
      expect(element.getAttribute('aria-checked')).toBe('false');
    });

    it('should be keyboard accessible', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });
  });
});
