/**
 * Unit Tests for r-radio Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-radio
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-radio.ts';
import type { RRadio } from './r-radio.ts';

describe('r-radio primitive', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      const element = document.createElement('r-radio') as RRadio;
      container.appendChild(element);

      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-radio');
    });

    it('should have radio role by default', async () => {
      const element = document.createElement('r-radio') as RRadio;
      container.appendChild(element);
      await element.updateComplete;

      expect(element.getAttribute('role')).toBe('radio');
    });

    it('should have aria-checked="false" by default', async () => {
      const element = document.createElement('r-radio') as RRadio;
      container.appendChild(element);
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('false');
    });

    it('should require name and value attributes', () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);

      expect(element.name).toBe('test');
      expect(element.value).toBe('option1');
    });

    it('should render slotted content', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      const span = document.createElement('span');
      span.textContent = 'Option 1';
      element.appendChild(span);
      container.appendChild(element);

      await element.updateComplete;
      expect(element.textContent).toContain('Option 1');
    });
  });

  describe('Checked State', () => {
    it('should not be checked by default', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should set aria-checked when checked', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.checked = true;
      container.appendChild(element);
      await element.updateComplete;

      expect(element.getAttribute('aria-checked')).toBe('true');
    });

    it('should reflect checked attribute', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.checked = true;
      container.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute('checked')).toBe(true);

      element.checked = false;
      await element.updateComplete;

      expect(element.hasAttribute('checked')).toBe(false);
    });
  });

  describe('Radio Group Behavior', () => {
    it('should only allow one radio to be checked in a group', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'color';
      radio1.value = 'red';
      radio1.textContent = 'Red';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'color';
      radio2.value = 'blue';
      radio2.textContent = 'Blue';

      const radio3 = document.createElement('r-radio') as RRadio;
      radio3.name = 'color';
      radio3.value = 'green';
      radio3.textContent = 'Green';

      container.appendChild(radio1);
      container.appendChild(radio2);
      container.appendChild(radio3);

      await radio1.updateComplete;
      await radio2.updateComplete;
      await radio3.updateComplete;

      // Check first radio
      radio1.click();
      await radio1.updateComplete;

      expect(radio1.checked).toBe(true);
      expect(radio2.checked).toBe(false);
      expect(radio3.checked).toBe(false);

      // Check second radio
      radio2.click();
      await radio2.updateComplete;

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
      expect(radio3.checked).toBe(false);
    });

    it('should not affect radios in different groups', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'color';
      radio1.value = 'red';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'size';
      radio2.value = 'small';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      radio1.click();
      radio2.click();

      await radio1.updateComplete;
      await radio2.updateComplete;

      expect(radio1.checked).toBe(true);
      expect(radio2.checked).toBe(true);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should select radio with Space key', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);
      await element.updateComplete;

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(spaceEvent);
      await element.updateComplete;

      expect(element.checked).toBe(true);
    });

    it('should navigate to next radio with ArrowDown', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      radio1.checked = true;
      await radio1.updateComplete;

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      radio1.dispatchEvent(arrowDownEvent);
      await radio2.updateComplete;

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
    });

    it('should navigate to next radio with ArrowRight', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      radio1.checked = true;
      await radio1.updateComplete;

      const arrowRightEvent = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });
      radio1.dispatchEvent(arrowRightEvent);
      await radio2.updateComplete;

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(true);
    });

    it('should navigate to previous radio with ArrowUp', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      radio2.checked = true;
      await radio2.updateComplete;

      const arrowUpEvent = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        cancelable: true,
      });
      radio2.dispatchEvent(arrowUpEvent);
      await radio1.updateComplete;

      expect(radio2.checked).toBe(false);
      expect(radio1.checked).toBe(true);
    });

    it('should navigate to previous radio with ArrowLeft', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      radio2.checked = true;
      await radio2.updateComplete;

      const arrowLeftEvent = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true,
      });
      radio2.dispatchEvent(arrowLeftEvent);
      await radio1.updateComplete;

      expect(radio2.checked).toBe(false);
      expect(radio1.checked).toBe(true);
    });

    it('should wrap around when navigating past last radio', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      radio2.checked = true;
      await radio2.updateComplete;

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      radio2.dispatchEvent(arrowDownEvent);
      await radio1.updateComplete;

      expect(radio2.checked).toBe(false);
      expect(radio1.checked).toBe(true);
    });

    it('should skip disabled radios during keyboard navigation', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';
      radio2.disabled = true;

      const radio3 = document.createElement('r-radio') as RRadio;
      radio3.name = 'test';
      radio3.value = 'option3';

      container.appendChild(radio1);
      container.appendChild(radio2);
      container.appendChild(radio3);

      await radio1.updateComplete;
      await radio2.updateComplete;
      await radio3.updateComplete;

      radio1.checked = true;
      await radio1.updateComplete;

      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      radio1.dispatchEvent(arrowDownEvent);
      await radio3.updateComplete;

      expect(radio1.checked).toBe(false);
      expect(radio2.checked).toBe(false);
      expect(radio3.checked).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('should not respond to click when disabled', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.disabled = true;
      container.appendChild(element);
      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should not respond to Space key when disabled', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.disabled = true;
      container.appendChild(element);
      await element.updateComplete;

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      element.dispatchEvent(spaceEvent);
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should not respond to arrow keys when disabled', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.disabled = true;
      container.appendChild(element);
      await element.updateComplete;

      const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      element.dispatchEvent(arrowEvent);
      await element.updateComplete;

      expect(element.checked).toBe(false);
    });

    it('should reflect disabled attribute', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.disabled = true;
      container.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);

      element.disabled = false;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Event Handling', () => {
    it('should dispatch r-change event when selected', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);
      await element.updateComplete;

      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      element.click();
      await element.updateComplete;

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should include correct data in r-change event', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'color';
      element.value = 'red';
      container.appendChild(element);
      await element.updateComplete;

      let eventDetail: { value: { name: string; value: string; checked: boolean } } | null = null;
      element.addEventListener('r-change', ((e: CustomEvent) => {
        eventDetail = e.detail;
      }) as EventListener);

      element.click();
      await element.updateComplete;

      expect(eventDetail).toBeDefined();
      expect(eventDetail?.value.name).toBe('color');
      expect(eventDetail?.value.value).toBe('red');
      expect(eventDetail?.value.checked).toBe(true);
    });

    it('should not dispatch r-change when already checked', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.checked = true;
      container.appendChild(element);
      await element.updateComplete;

      const changeSpy = vi.fn();
      element.addEventListener('r-change', changeSpy);

      element.click();
      await element.updateComplete;

      expect(changeSpy).not.toHaveBeenCalled();
    });
  });

  describe('ARIA Attributes', () => {
    it('should support aria-label', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.ariaLabel = 'Select option 1';
      container.appendChild(element);
      await element.updateComplete;

      expect(element.ariaLabel).toBe('Select option 1');
    });

    it('should support aria-labelledby', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.ariaLabelledBy = 'label-id';
      container.appendChild(element);
      await element.updateComplete;

      expect(element.ariaLabelledBy).toBe('label-id');
    });

    it('should support aria-describedby', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      element.ariaDescribedBy = 'description-id';
      container.appendChild(element);
      await element.updateComplete;

      expect(element.ariaDescribedBy).toBe('description-id');
    });
  });

  describe('Roving Tabindex', () => {
    it('should make first radio tabbable by default', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      // Wait for setTimeout in connectedCallback
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(radio1.tabIndex).toBe(0);
      expect(radio2.tabIndex).toBe(-1);
    });

    it('should make checked radio tabbable', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';
      radio2.checked = true;

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      // Wait for setTimeout in connectedCallback
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(radio1.tabIndex).toBe(-1);
      expect(radio2.tabIndex).toBe(0);
    });

    it('should update tabindex when selection changes', async () => {
      const radio1 = document.createElement('r-radio') as RRadio;
      radio1.name = 'test';
      radio1.value = 'option1';
      radio1.checked = true;

      const radio2 = document.createElement('r-radio') as RRadio;
      radio2.name = 'test';
      radio2.value = 'option2';

      container.appendChild(radio1);
      container.appendChild(radio2);

      await radio1.updateComplete;
      await radio2.updateComplete;

      expect(radio1.tabIndex).toBe(0);
      expect(radio2.tabIndex).toBe(-1);

      radio2.click();
      await radio2.updateComplete;

      expect(radio1.tabIndex).toBe(-1);
      expect(radio2.tabIndex).toBe(0);
    });
  });

  describe('RPrimitiveBase Integration', () => {
    it('should inherit focus state tracking from base class', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);
      await element.updateComplete;

      expect(element._focused).toBe(false);

      element.dispatchEvent(new FocusEvent('focus'));
      await element.updateComplete;

      expect(element._focused).toBe(true);
    });

    it('should inherit hover state tracking from base class', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);
      await element.updateComplete;

      expect(element._hovered).toBe(false);

      element.dispatchEvent(new MouseEvent('mouseenter'));
      await element.updateComplete;

      expect(element._hovered).toBe(true);
    });

    it('should inherit disabled property from base class', async () => {
      const element = document.createElement('r-radio') as RRadio;
      element.name = 'test';
      element.value = 'option1';
      container.appendChild(element);

      expect(element.disabled).toBe(false);

      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });
  });
});
