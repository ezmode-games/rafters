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

  describe('Initialization', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-input');
    });

    it('should have default type "text"', () => {
      expect(element.type).toBe('text');
    });

    it('should have empty value by default', () => {
      expect(element.value).toBe('');
    });

    it('should not be required by default', () => {
      expect(element.required).toBe(false);
    });

    it('should not be readonly by default', () => {
      expect(element.readonly).toBe(false);
    });

    it('should not be disabled by default', () => {
      expect(element.disabled).toBe(false);
    });
  });

  describe('Properties', () => {
    it('should set and get type property', async () => {
      element.type = 'email';
      await element.updateComplete;
      expect(element.type).toBe('email');
    });

    it('should set and get value property', async () => {
      element.value = 'test value';
      await element.updateComplete;
      expect(element.value).toBe('test value');
    });

    it('should set and get placeholder property', async () => {
      element.placeholder = 'Enter text';
      await element.updateComplete;
      expect(element.placeholder).toBe('Enter text');
    });

    it('should set and reflect required property', async () => {
      element.required = true;
      await element.updateComplete;
      expect(element.required).toBe(true);
      expect(element.hasAttribute('required')).toBe(true);
    });

    it('should set and reflect readonly property', async () => {
      element.readonly = true;
      await element.updateComplete;
      expect(element.readonly).toBe(true);
      expect(element.hasAttribute('readonly')).toBe(true);
    });

    it('should set and reflect disabled property', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.disabled).toBe(true);
      expect(element.hasAttribute('disabled')).toBe(true);
    });

    it('should set validationState property', async () => {
      element.validationState = 'error';
      await element.updateComplete;
      expect(element.validationState).toBe('error');
      expect(element.getAttribute('validationstate')).toBe('error');
    });

    it('should set errorMessage property', async () => {
      element.errorMessage = 'Invalid input';
      await element.updateComplete;
      expect(element.errorMessage).toBe('Invalid input');
    });

    it('should set minlength property', async () => {
      element.minlength = 5;
      await element.updateComplete;
      expect(element.minlength).toBe(5);
    });

    it('should set maxlength property', async () => {
      element.maxlength = 10;
      await element.updateComplete;
      expect(element.maxlength).toBe(10);
    });

    it('should set pattern property', async () => {
      element.pattern = '[0-9]+';
      await element.updateComplete;
      expect(element.pattern).toBe('[0-9]+');
    });

    it('should set autocomplete property', async () => {
      element.autocomplete = 'email';
      await element.updateComplete;
      expect(element.autocomplete).toBe('email');
    });

    it('should set name property', async () => {
      element.name = 'test-input';
      await element.updateComplete;
      expect(element.name).toBe('test-input');
    });
  });

  describe('Input Types', () => {
    it('should support text type', async () => {
      element.type = 'text';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('text');
    });

    it('should support email type', async () => {
      element.type = 'email';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('email');
    });

    it('should support password type', async () => {
      element.type = 'password';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('password');
    });

    it('should support search type', async () => {
      element.type = 'search';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('search');
    });

    it('should support tel type', async () => {
      element.type = 'tel';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('tel');
    });

    it('should support url type', async () => {
      element.type = 'url';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('url');
    });

    it('should support number type', async () => {
      element.type = 'number';
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input?.type).toBe('number');
    });
  });

  describe('Event Handling', () => {
    it('should dispatch r-input event on input', async () => {
      const handler = vi.fn();
      element.addEventListener('r-input', handler);

      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        input.value = 'test';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value.value).toBe('test');
      expect(typeof event.detail.value.isValid).toBe('boolean');
      expect(typeof event.detail.timestamp).toBe('number');
    });

    it('should update value on input', async () => {
      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        input.value = 'new value';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await element.updateComplete;

      expect(element.value).toBe('new value');
    });

    it('should dispatch r-change event on change', async () => {
      const handler = vi.fn();
      element.addEventListener('r-change', handler);

      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        input.value = 'test';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
    });

    it('should dispatch r-blur event on blur', async () => {
      const handler = vi.fn();
      element.addEventListener('r-blur', handler);

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Validation - Required', () => {
    it('should show error when required field is empty on blur', async () => {
      element.required = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBe('error');
      expect(element.errorMessage).toBe('This field is required');
    });

    it('should not show error when required field has value', async () => {
      element.required = true;
      element.value = 'test';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        input.value = 'test';
        input.dispatchEvent(new Event('blur', { bubbles: true }));
      }
      await element.updateComplete;

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });
  });

  describe('Validation - Pattern', () => {
    it('should validate against pattern on blur', async () => {
      element.pattern = '^[0-9]+$';
      element.value = 'abc';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBe('error');
      expect(element.errorMessage).toBe('Invalid format');
    });

    it('should pass validation with valid pattern', async () => {
      element.pattern = '^[0-9]+$';
      element.value = '123';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });

    it('should validate email pattern', async () => {
      element.pattern = '^[^@]+@[^@]+\\.[^@]+$';
      element.value = 'test@example.com';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBe('valid');
    });

    it('should fail invalid email pattern', async () => {
      element.pattern = '^[^@]+@[^@]+\\.[^@]+$';
      element.value = 'invalid-email';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBe('error');
    });
  });

  describe('Validation - No Validation', () => {
    it('should set valid state for non-required field with value', async () => {
      element.value = 'test';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        input.value = 'test';
        input.dispatchEvent(new Event('blur', { bubbles: true }));
      }
      await element.updateComplete;

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });

    it('should not validate empty non-required field', async () => {
      element.value = '';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      input?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBeUndefined();
      expect(element.errorMessage).toBe('');
    });
  });

  describe('Focus Management', () => {
    it('should focus input when focus() called', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        const focusSpy = vi.spyOn(input, 'focus');
        element.focus();
        expect(focusSpy).toHaveBeenCalled();
      }
    });

    it('should blur input when blur() called', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        const blurSpy = vi.spyOn(input, 'blur');
        element.blur();
        expect(blurSpy).toHaveBeenCalled();
      }
    });

    it('should select input text when select() called', async () => {
      element.value = 'test value';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      if (input) {
        const selectSpy = vi.spyOn(input, 'select');
        element.select();
        expect(selectSpy).toHaveBeenCalled();
      }
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-invalid when validation fails', async () => {
      element.validationState = 'error';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid false when valid', async () => {
      element.validationState = 'valid';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).toBe('false');
    });

    it('should set aria-errormessage with error text', async () => {
      element.errorMessage = 'This is an error';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-errormessage')).toBe('This is an error');
    });
  });

  describe('Rendering', () => {
    it('should render input element', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input');
      expect(input).toBeTruthy();
    });

    it('should have input part for styling', async () => {
      await element.updateComplete;
      const input = element.shadowRoot?.querySelector('input[part="input"]');
      expect(input).toBeTruthy();
    });

    it('should render placeholder', async () => {
      element.placeholder = 'Test placeholder';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.placeholder).toBe('Test placeholder');
    });

    it('should render minlength attribute', async () => {
      element.minlength = 5;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('minlength')).toBe('5');
    });

    it('should render maxlength attribute', async () => {
      element.maxlength = 10;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('maxlength')).toBe('10');
    });

    it('should render pattern attribute', async () => {
      element.pattern = '[0-9]+';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('pattern')).toBe('[0-9]+');
    });

    it('should render autocomplete attribute', async () => {
      element.autocomplete = 'email';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('autocomplete')).toBe('email');
    });

    it('should render name attribute', async () => {
      element.name = 'test-input';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('name')).toBe('test-input');
    });
  });

  describe('Disabled State', () => {
    it('should disable input when disabled=true', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.disabled).toBe(true);
    });
  });

  describe('Readonly State', () => {
    it('should set input readonly when readonly=true', async () => {
      element.readonly = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.readOnly).toBe(true);
    });
  });

  describe('Live Directive', () => {
    it('should keep value in sync with property', async () => {
      element.value = 'initial';
      await element.updateComplete;

      let input = element.shadowRoot?.querySelector('input');
      expect(input?.value).toBe('initial');

      element.value = 'updated';
      await element.updateComplete;

      input = element.shadowRoot?.querySelector('input');
      expect(input?.value).toBe('updated');
    });
  });
});
