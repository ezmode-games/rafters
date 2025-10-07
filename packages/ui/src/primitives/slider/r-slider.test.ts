/**
 * Unit Tests for r-slider Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-slider
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-slider.ts';
import type { RSlider } from './r-slider.ts';

describe('r-slider primitive', () => {
  let element: RSlider;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-slider') as RSlider;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Initialization', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-slider');
    });

    it('should have default value of 0', () => {
      expect(element.value).toBe(0);
    });

    it('should have default min of 0', () => {
      expect(element.min).toBe(0);
    });

    it('should have default max of 100', () => {
      expect(element.max).toBe(100);
    });

    it('should have default step of 1', () => {
      expect(element.step).toBe(1);
    });

    it('should have default orientation of horizontal', () => {
      expect(element.orientation).toBe('horizontal');
    });

    it('should not be disabled by default', () => {
      expect(element.disabled).toBe(false);
    });
  });

  describe('Properties', () => {
    it('should set and get value', async () => {
      element.value = 50;
      await element.updateComplete;
      expect(element.value).toBe(50);
    });

    it('should set and get min', async () => {
      element.min = 10;
      await element.updateComplete;
      expect(element.min).toBe(10);
    });

    it('should set and get max', async () => {
      element.max = 200;
      await element.updateComplete;
      expect(element.max).toBe(200);
    });

    it('should set and get step', async () => {
      element.step = 5;
      await element.updateComplete;
      expect(element.step).toBe(5);
    });

    it('should set and get orientation', async () => {
      element.orientation = 'vertical';
      await element.updateComplete;
      expect(element.orientation).toBe('vertical');
    });

    it('should set and get name', async () => {
      element.name = 'volume';
      await element.updateComplete;
      expect(element.name).toBe('volume');
    });

    it('should set and get disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.disabled).toBe(true);
    });
  });

  describe('ARIA Attributes', () => {
    it('should have slider role', async () => {
      await element.updateComplete;
      expect(element.role).toBe('slider');
    });

    it('should have aria-valuenow attribute', async () => {
      element.value = 50;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('should have aria-valuemin attribute', async () => {
      element.min = 0;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('should have aria-valuemax attribute', async () => {
      element.max = 100;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have aria-orientation attribute for horizontal', async () => {
      element.orientation = 'horizontal';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should have aria-orientation attribute for vertical', async () => {
      element.orientation = 'vertical';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should increment value on ArrowRight', async () => {
      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(51);
    });

    it('should increment value on ArrowUp', async () => {
      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(51);
    });

    it('should decrement value on ArrowLeft', async () => {
      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(49);
    });

    it('should decrement value on ArrowDown', async () => {
      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(49);
    });

    it('should set value to min on Home key', async () => {
      element.value = 50;
      element.min = 0;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(0);
    });

    it('should set value to max on End key', async () => {
      element.value = 50;
      element.max = 100;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(100);
    });

    it('should handle PageUp for large increment', async () => {
      element.value = 50;
      element.min = 0;
      element.max = 100;
      await element.updateComplete;

      const initialValue = element.value;
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBeGreaterThan(initialValue);
      expect(element.value).toBe(60); // 50 + (100-0)/10
    });

    it('should handle PageDown for large decrement', async () => {
      element.value = 50;
      element.min = 0;
      element.max = 100;
      await element.updateComplete;

      const initialValue = element.value;
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBeLessThan(initialValue);
      expect(element.value).toBe(40); // 50 - (100-0)/10
    });

    it('should not exceed max value', async () => {
      element.value = 99;
      element.max = 100;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(100);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(100);
    });

    it('should not go below min value', async () => {
      element.value = 1;
      element.min = 0;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(0);

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(0);
    });

    it('should respect step value', async () => {
      element.value = 50;
      element.step = 5;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(55);
    });

    it('should not respond to keyboard when disabled', async () => {
      element.value = 50;
      element.disabled = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe(50);
    });

    it('should prevent default for handled keys', async () => {
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);
      await element.updateComplete;

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not prevent default for non-handled keys', async () => {
      await element.updateComplete;

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      element.dispatchEvent(event);
      await element.updateComplete;

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('should dispatch r-slider event on value change', async () => {
      const handler = vi.fn();
      element.addEventListener('r-slider', handler);

      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value.value).toBe(51);
      expect(event.detail.value.min).toBe(0);
      expect(event.detail.value.max).toBe(100);
    });

    it('should bubble events', async () => {
      const handler = vi.fn();
      container.addEventListener('r-slider', handler);

      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
    });

    it('should dispatch event with timestamp', async () => {
      const handler = vi.fn();
      element.addEventListener('r-slider', handler);

      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.timestamp).toBeTypeOf('number');
    });
  });

  describe('Form Association', () => {
    it('should include name attribute when provided', async () => {
      element.name = 'volume';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('name')).toBe('volume');
    });

    it('should not include name attribute when not provided', async () => {
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('name')).toBe('');
    });
  });

  describe('Lifecycle', () => {
    it('should register keyboard listener on connect', async () => {
      const newElement = document.createElement('r-slider') as RSlider;
      newElement.value = 50;

      container.appendChild(newElement);
      await newElement.updateComplete;

      newElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await newElement.updateComplete;

      expect(newElement.value).toBe(51);
    });

    it('should cleanup event listeners on disconnect', async () => {
      element.value = 50;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;
      expect(element.value).toBe(51);

      element.remove();

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await element.updateComplete;

      // Value should not change after disconnect
      expect(element.value).toBe(51);
    });

    it('should update tabIndex when disabled changes', async () => {
      expect(element.tabIndex).toBe(0);

      element.disabled = true;
      await element.updateComplete;

      expect(element.tabIndex).toBe(-1);

      element.disabled = false;
      await element.updateComplete;

      expect(element.tabIndex).toBe(0);
    });
  });

  describe('Shadow DOM', () => {
    it('should render input element', async () => {
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input).toBeTruthy();
    });

    it('should render input with type range', async () => {
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('range');
    });

    it('should have slider part for styling', async () => {
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('[part="slider"]');
      expect(input).toBeTruthy();
    });
  });

  describe('Input Element Synchronization', () => {
    it('should sync value to input element', async () => {
      element.value = 75;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.value).toBe('75');
    });

    it('should sync min to input element', async () => {
      element.min = 10;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.min).toBe('10');
    });

    it('should sync max to input element', async () => {
      element.max = 200;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.max).toBe('200');
    });

    it('should sync step to input element', async () => {
      element.step = 5;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.step).toBe('5');
    });

    it('should sync disabled to input element', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.disabled).toBe(true);
    });
  });
});
