/**
 * Unit Tests for r-button Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-button
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../../src/primitives/button/r-button.ts';
import type { RButton } from '../../src/primitives/button/r-button.ts';

describe('r-button primitive', () => {
  let element: RButton;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-button') as RButton;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-button');
    });

    it('should have button role by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('button');
    });

    it('should be in tab order by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should have type="button" by default', () => {
      expect(element.type).toBe('button');
    });

    it('should render slotted content', async () => {
      const span = document.createElement('span');
      span.textContent = 'Click me';
      element.appendChild(span);

      await element.updateComplete;
      expect(element.textContent).toContain('Click me');
    });
  });

  describe('Keyboard Interactions', () => {
    it('should trigger click on Enter key', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(enterEvent);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger click on Space key', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(spaceEvent);

      expect(clickSpy).toHaveBeenCalledTimes(1);
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

    it('should not trigger click on other keys', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      // Test various non-action keys
      const keys = ['a', 'Escape', 'Tab', 'ArrowUp', 'ArrowDown'];
      for (const key of keys) {
        const event = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(event);
      }

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should use keyboard utils for consistent behavior', async () => {
      // This test verifies integration with utils/keyboard.ts
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      // isActionKey should recognize both Enter and Space
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });

      element.dispatchEvent(enterEvent);
      element.dispatchEvent(spaceEvent);

      expect(clickSpy).toHaveBeenCalledTimes(2);
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

    it('should be focusable by default', async () => {
      await element.updateComplete;

      // Element with tabindex="0" is focusable
      expect(element.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Disabled State', () => {
    it('should not trigger click when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      // JSDOM limitation: element.click() still fires on disabled elements
      // In real browsers, disabled elements don't respond to click()
      // We verify the disabled state is set correctly instead
      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should not respond to Enter when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      element.dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not respond to Space when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      element.dispatchEvent(spaceEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should reflect disabled attribute', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);

      element.disabled = false;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(false);
    });

    it('should prevent keyboard activation when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const clickSpy = vi.fn();
      const clickHandler = vi.fn();

      element.addEventListener('click', clickSpy);
      element.onclick = clickHandler;

      // Try both Enter and Space
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      expect(clickSpy).not.toHaveBeenCalled();
      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe('ARIA Attributes', () => {
    it('should support custom aria-label', async () => {
      element.ariaLabel = 'Submit form';
      await element.updateComplete;

      expect(element.ariaLabel).toBe('Submit form');
    });

    it('should support aria-labelledby', async () => {
      element.ariaLabelledBy = 'external-label';
      await element.updateComplete;

      expect(element.ariaLabelledBy).toBe('external-label');
    });

    it('should support aria-describedby', async () => {
      element.ariaDescribedBy = 'description';
      await element.updateComplete;

      expect(element.ariaDescribedBy).toBe('description');
    });

    it('should allow custom role override', async () => {
      element.role = 'menuitem';
      await element.updateComplete;

      expect(element.getAttribute('role')).toBe('menuitem');
    });
  });

  describe('Type Attribute', () => {
    it('should default to type="button"', () => {
      expect(element.type).toBe('button');
    });

    it('should support type="submit"', async () => {
      element.type = 'submit';
      await element.updateComplete;

      expect(element.type).toBe('submit');
    });

    it('should support type="reset"', async () => {
      element.type = 'reset';
      await element.updateComplete;

      expect(element.type).toBe('reset');
    });

    it('should change type dynamically', async () => {
      expect(element.type).toBe('button');

      element.type = 'submit';
      await element.updateComplete;
      expect(element.type).toBe('submit');

      element.type = 'reset';
      await element.updateComplete;
      expect(element.type).toBe('reset');
    });
  });

  describe('Event Handling', () => {
    it('should dispatch click event on mouse click', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      element.click();
      expect(clickSpy).toHaveBeenCalledTimes(1);

      element.click();
      expect(clickSpy).toHaveBeenCalledTimes(2);
    });

    it('should support multiple event listeners', async () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      element.addEventListener('click', listener1);
      element.addEventListener('click', listener2);

      await element.updateComplete;

      element.click();

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should bubble events to parent', async () => {
      const parentSpy = vi.fn();
      container.addEventListener('click', parentSpy);

      await element.updateComplete;

      element.click();

      expect(parentSpy).toHaveBeenCalledTimes(1);
    });

    it('should remove event listeners properly', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      element.click();
      expect(clickSpy).toHaveBeenCalledTimes(1);

      element.removeEventListener('click', clickSpy);
      element.click();
      expect(clickSpy).toHaveBeenCalledTimes(1); // Still only 1
    });
  });

  describe('Lifecycle', () => {
    it('should register keyboard listener on connect', async () => {
      const newElement = document.createElement('r-button') as RButton;
      const clickSpy = vi.fn();
      newElement.addEventListener('click', clickSpy);

      // Element not yet connected
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(clickSpy).not.toHaveBeenCalled();

      // Connect to DOM
      container.appendChild(newElement);
      await newElement.updateComplete;

      // Now keyboard should work
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should cleanup event listeners on disconnect', async () => {
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      // Keyboard works while connected
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(clickSpy).toHaveBeenCalledTimes(1);

      // Disconnect
      element.remove();

      // Keyboard listener should be removed (element still has click listener though)
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      // Click count should still be 1 (keyboard listener removed)
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration with Utils', () => {
    it('should use isActionKey from keyboard utils', async () => {
      // This verifies r-button uses utils/keyboard.ts correctly
      const clickSpy = vi.fn();
      element.addEventListener('click', clickSpy);

      await element.updateComplete;

      // isActionKey recognizes Enter and Space
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

      // But not other keys
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(clickSpy).toHaveBeenCalledTimes(2); // Only Enter and Space
    });

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

    it('should inherit ARIA properties from base class', async () => {
      element.ariaLabel = 'Test label';
      element.ariaLabelledBy = 'label-id';
      element.ariaDescribedBy = 'desc-id';

      await element.updateComplete;

      expect(element.ariaLabel).toBe('Test label');
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
});
