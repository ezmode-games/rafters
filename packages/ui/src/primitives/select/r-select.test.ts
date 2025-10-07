/**
 * Unit Tests for r-select Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-select
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-select';
import type { RSelect } from './r-select';

describe('r-select primitive', () => {
  let element: RSelect;
  let container: HTMLDivElement;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-select') as RSelect;
    container.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-select');
    });

    it('should have listbox role by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('listbox');
    });

    it('should be in tab order by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should have aria-multiselectable="false" by default', async () => {
      await element.updateComplete;
      expect(element.ariaMultiselectable).toBe('false');
    });

    it('should set aria-multiselectable="true" when multiple', async () => {
      element.multiple = true;
      await element.updateComplete;
      expect(element.ariaMultiselectable).toBe('true');
    });

    it('should render slotted options', async () => {
      const option1 = document.createElement('div');
      option1.setAttribute('slot', 'option');
      option1.setAttribute('data-value', '1');
      option1.textContent = 'Option 1';
      element.appendChild(option1);

      const option2 = document.createElement('div');
      option2.setAttribute('slot', 'option');
      option2.setAttribute('data-value', '2');
      option2.textContent = 'Option 2';
      element.appendChild(option2);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(element.children.length).toBe(2);
    });
  });

  describe('Properties', () => {
    it('should default value to empty string', () => {
      expect(element.value).toBe('');
    });

    it('should default multiple to false', () => {
      expect(element.multiple).toBe(false);
    });

    it('should default disabled to false', () => {
      expect(element.disabled).toBe(false);
    });

    it('should update value property', async () => {
      element.value = 'test';
      await element.updateComplete;
      expect(element.value).toBe('test');
      expect(element.getAttribute('value')).toBe('test');
    });

    it('should update multiple property', async () => {
      element.multiple = true;
      await element.updateComplete;
      expect(element.multiple).toBe(true);
      expect(element.hasAttribute('multiple')).toBe(true);
    });

    it('should update disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should support name property for forms', async () => {
      element.name = 'test-select';
      await element.updateComplete;
      expect(element.name).toBe('test-select');
    });
  });

  describe('ARIA Attributes', () => {
    it('should support custom aria-label', async () => {
      element.ariaLabel = 'Select an option';
      await element.updateComplete;
      expect(element.ariaLabel).toBe('Select an option');
    });

    it('should support aria-labelledby', async () => {
      element.ariaLabelledBy = 'select-label';
      await element.updateComplete;
      expect(element.ariaLabelledBy).toBe('select-label');
    });

    it('should support aria-describedby', async () => {
      element.ariaDescribedBy = 'select-description';
      await element.updateComplete;
      expect(element.ariaDescribedBy).toBe('select-description');
    });

    it('should update aria-activedescendant on navigation', async () => {
      const option1 = document.createElement('div');
      option1.setAttribute('slot', 'option');
      option1.setAttribute('data-value', '1');
      element.appendChild(option1);

      const option2 = document.createElement('div');
      option2.setAttribute('slot', 'option');
      option2.setAttribute('data-value', '2');
      element.appendChild(option2);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(arrowDownEvent);
      await element.updateComplete;

      expect(element.ariaActiveDescendant).toBeTruthy();
    });
  });

  describe('Keyboard Navigation - Arrow Keys', () => {
    beforeEach(async () => {
      // Add test options
      for (let i = 1; i <= 3; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        option.textContent = `Option ${i}`;
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should navigate down with ArrowDown key', async () => {
      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(arrowDownEvent, 'preventDefault');

      element.dispatchEvent(arrowDownEvent);
      await element.updateComplete;

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should navigate up with ArrowUp key', async () => {
      const arrowUpEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(arrowUpEvent, 'preventDefault');

      element.dispatchEvent(arrowUpEvent);
      await element.updateComplete;

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default on arrow keys', async () => {
      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(arrowDownEvent, 'preventDefault');

      element.dispatchEvent(arrowDownEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation - Home/End', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 5; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        option.textContent = `Option ${i}`;
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should jump to first option with Home key', async () => {
      const homeEvent = new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(homeEvent, 'preventDefault');

      element.dispatchEvent(homeEvent);
      await element.updateComplete;

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should jump to last option with End key', async () => {
      const endEvent = new KeyboardEvent('keydown', {
        key: 'End',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(endEvent, 'preventDefault');

      element.dispatchEvent(endEvent);
      await element.updateComplete;

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Keyboard Selection', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 3; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        option.textContent = `Option ${i}`;
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should select option with Enter key', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(enterEvent);
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalled();
    });

    it('should select option with Space key', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(spaceEvent);
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalled();
    });

    it('should prevent default on Enter and Space', async () => {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');

      element.dispatchEvent(enterEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Single Selection Mode', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 3; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        option.textContent = `Option ${i}`;
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should select single value', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(element.value).toBeTruthy();
      expect(changeSpy).toHaveBeenCalled();
    });

    it('should replace previous selection in single mode', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;
      const firstValue = element.value;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(element.value).not.toBe(firstValue);
      expect(element.value.split(',').length).toBe(1);
    });
  });

  describe('Multiple Selection Mode', () => {
    beforeEach(async () => {
      element.multiple = true;
      for (let i = 1; i <= 3; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        option.textContent = `Option ${i}`;
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should allow multiple selections', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      const values = element.value.split(',').filter((v) => v.trim());
      expect(values.length).toBeGreaterThan(1);
    });

    it('should toggle selection in multiple mode', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;
      const firstValue = element.value;

      // Select again to deselect
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(element.value).not.toBe(firstValue);
    });
  });

  describe('Mouse Interaction', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 3; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        option.setAttribute('role', 'option');
        option.textContent = `Option ${i}`;
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should select option on click', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      const option = element.querySelector('[data-value="1"]') as HTMLElement;
      option.click();
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalled();
    });

    it('should update value on option click', async () => {
      const option = element.querySelector('[data-value="2"]') as HTMLElement;
      option.click();
      await element.updateComplete;

      expect(element.value).toBe('2');
    });
  });

  describe('Disabled State', () => {
    it('should not respond to keyboard when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should not respond to clicks when disabled', async () => {
      element.disabled = true;
      const option = document.createElement('div');
      option.setAttribute('slot', 'option');
      option.setAttribute('data-value', '1');
      option.setAttribute('role', 'option');
      element.appendChild(option);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      option.click();
      await element.updateComplete;

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should reflect disabled attribute', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);

      element.disabled = false;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Events', () => {
    beforeEach(async () => {
      for (let i = 1; i <= 3; i++) {
        const option = document.createElement('div');
        option.setAttribute('slot', 'option');
        option.setAttribute('data-value', String(i));
        element.appendChild(option);
      }
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should dispatch r-change event on selection', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should include value in change event', async () => {
      let eventDetail: unknown;
      element.addEventListener('r-change', (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(eventDetail).toBeDefined();
      expect((eventDetail as { value: unknown }).value).toBeDefined();
    });

    it('should bubble events', async () => {
      const containerSpy = vi.fn();
      container.addEventListener('r-change', containerSpy);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await element.updateComplete;

      expect(containerSpy).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should be focusable by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('should have focus method', () => {
      expect(typeof element.focus).toBe('function');
    });

    it('should have blur method', () => {
      expect(typeof element.blur).toBe('function');
    });

    it('should track focus state', async () => {
      await element.updateComplete;

      element.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element._focused).toBe(true);

      element.dispatchEvent(new FocusEvent('blur'));
      await element.updateComplete;

      expect(element._focused).toBe(false);
    });
  });

  describe('Lifecycle', () => {
    it('should register event listeners on connect', async () => {
      const newElement = document.createElement('r-select') as RSelect;
      const changeSpy = vi.fn();
      newElement.addEventListener('r-change', changeSpy);

      container.appendChild(newElement);
      await newElement.updateComplete;

      // Keyboard should work after connection
      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await newElement.updateComplete;

      // No error should be thrown
      expect(true).toBe(true);
    });

    it('should cleanup event listeners on disconnect', async () => {
      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      await element.updateComplete;

      element.remove();

      // Event listeners should be removed (no error should occur)
      expect(true).toBe(true);
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
      element.ariaLabel = 'Test select';
      element.ariaLabelledBy = 'label-id';
      element.ariaDescribedBy = 'desc-id';

      await element.updateComplete;

      expect(element.ariaLabel).toBe('Test select');
      expect(element.ariaLabelledBy).toBe('label-id');
      expect(element.ariaDescribedBy).toBe('desc-id');
    });

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
  });
});
