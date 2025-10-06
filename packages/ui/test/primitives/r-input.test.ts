/**
 * Unit Tests for r-input Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-input
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../../src/primitives/input/r-input.ts';
import type { RInput } from '../../src/primitives/input/r-input.ts';

describe('r-input primitive', () => {
  let element: RInput;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-input') as RInput;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Rendering and Structure', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-input');
    });

    it('should have textbox role by default', async () => {
      await element.updateComplete;
      expect(element.getAttribute('role')).toBe('textbox');
    });

    it('should have type="text" by default', () => {
      expect(element.type).toBe('text');
    });

    it('should render native input element', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input).toBeDefined();
      expect(input?.tagName.toLowerCase()).toBe('input');
    });

    it('should expose input via part attribute for styling', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('part')).toBe('input');
    });
  });

  describe('Properties and Attributes', () => {
    it('should accept different input types', async () => {
      const types = ['text', 'email', 'password', 'search', 'tel', 'url', 'number'] as const;

      for (const type of types) {
        element.type = type;
        await element.updateComplete;
        expect(element.type).toBe(type);

        const input = element.shadowRoot?.querySelector('input');
        expect(input?.type).toBe(type);
      }
    });

    it('should handle value property', async () => {
      element.value = 'test value';
      await element.updateComplete;

      expect(element.value).toBe('test value');
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input?.value).toBe('test value');
    });

    it('should handle placeholder property', async () => {
      element.placeholder = 'Enter text';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('placeholder')).toBe('Enter text');
    });

    it('should handle required property', async () => {
      element.required = true;
      await element.updateComplete;

      expect(element.hasAttribute('required')).toBe(true);
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('required')).toBe(true);
    });

    it('should handle readonly property', async () => {
      element.readonly = true;
      await element.updateComplete;

      expect(element.hasAttribute('readonly')).toBe(true);
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('readonly')).toBe(true);
    });

    it('should handle disabled property from base class', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.hasAttribute('disabled')).toBe(true);
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('disabled')).toBe(true);
    });

    it('should handle minlength property', async () => {
      element.minlength = 5;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('minlength')).toBe('5');
    });

    it('should handle maxlength property', async () => {
      element.maxlength = 10;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('maxlength')).toBe('10');
    });

    it('should handle pattern property', async () => {
      element.pattern = '[0-9]+';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('pattern')).toBe('[0-9]+');
    });

    it('should handle autocomplete property', async () => {
      element.autocomplete = 'email';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('autocomplete')).toBe('email');
    });

    it('should handle name property', async () => {
      element.name = 'username';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('name')).toBe('username');
    });
  });

  describe('Events', () => {
    it('should dispatch r-input event on input', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('r-input', eventSpy);

      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(element.value).toBe('new value');
    });

    it('should dispatch r-change event on change', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('r-change', eventSpy);

      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.value = 'changed value';
      element.value = 'changed value';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      expect(eventSpy).toHaveBeenCalledTimes(1);
    });

    it('should dispatch r-blur event on blur', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('r-blur', eventSpy);

      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(eventSpy).toHaveBeenCalledTimes(1);
    });

    it('should include validation state in event detail', async () => {
      let eventDetail: unknown = null;
      element.addEventListener('r-input', ((e: CustomEvent) => {
        eventDetail = e.detail;
      }) as EventListener);

      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventDetail).toMatchObject({
        value: expect.objectContaining({
          value: 'test',
          isValid: expect.any(Boolean),
        }),
        timestamp: expect.any(Number),
      });
    });
  });

  describe('Validation', () => {
    it('should validate required field on blur', async () => {
      element.required = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(element.validationState).toBe('error');
      expect(element.errorMessage).toBe('This field is required');
    });

    it('should set valid state when required field has value', async () => {
      element.required = true;
      element.value = 'test';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });

    it('should validate pattern on blur', async () => {
      element.pattern = '[0-9]+';
      element.value = 'abc';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(element.validationState).toBe('error');
      expect(element.errorMessage).toBe('Invalid format');
    });

    it('should set valid state when pattern matches', async () => {
      element.pattern = '[0-9]+';
      element.value = '123';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });

    it('should set aria-invalid when validation fails', async () => {
      element.required = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('should clear aria-invalid when validation passes', async () => {
      element.value = 'test';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(input.getAttribute('aria-invalid')).toBe('false');
    });
  });

  describe('Public Methods', () => {
    it('should provide focus() method', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      const focusSpy = vi.spyOn(input, 'focus');

      element.focus();

      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    it('should provide blur() method', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      const blurSpy = vi.spyOn(input, 'blur');

      element.blur();

      expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    it('should provide select() method', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      const selectSpy = vi.spyOn(input, 'select');

      element.select();

      expect(selectSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should inherit ARIA properties from base class', async () => {
      element.ariaLabel = 'Username';
      element.ariaLabelledBy = 'label-id';
      element.ariaDescribedBy = 'desc-id';

      await element.updateComplete;

      expect(element.ariaLabel).toBe('Username');
      expect(element.ariaLabelledBy).toBe('label-id');
      expect(element.ariaDescribedBy).toBe('desc-id');
    });

    it('should set aria-errormessage when validation fails', async () => {
      element.required = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(input.getAttribute('aria-errormessage')).toBe('This field is required');
    });

    it('should clear aria-errormessage when validation passes', async () => {
      element.value = 'test';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(input.getAttribute('aria-errormessage')).toBe('');
    });
  });

  describe('Integration with Base Class', () => {
    it('should inherit disabled property from base class', async () => {
      expect(element.disabled).toBe(false);

      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should use dispatchPrimitiveEvent from base class', async () => {
      const eventSpy = vi.fn();
      element.addEventListener('r-input', eventSpy);

      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toHaveProperty('value');
      expect(event.detail).toHaveProperty('timestamp');
    });
  });

  describe('Live Directive', () => {
    it('should use live directive for proper value binding', async () => {
      element.value = 'initial';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('initial');

      element.value = 'updated';
      await element.updateComplete;
      expect(input.value).toBe('updated');
    });

    it('should sync value from user input', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      input.value = 'user typed';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(element.value).toBe('user typed');
    });
  });
});
