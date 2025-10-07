/**
 * Unit Tests for r-textarea Primitive
 * Tests the Web Component logic using Vitest/jsdom
 *
 * @testType unit
 * @framework vitest
 * @primitive r-textarea
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './r-textarea.ts';
import type { RTextarea } from './r-textarea.ts';

describe('r-textarea primitive', () => {
  let element: RTextarea;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    element = document.createElement('r-textarea') as RTextarea;
    container.appendChild(element);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Initialization', () => {
    it('should be defined and extend correct classes', () => {
      expect(element).toBeDefined();
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('r-textarea');
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

    it('should have default rows of 3', () => {
      expect(element.rows).toBe(3);
    });
  });

  describe('Properties', () => {
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

    it('should set rows property', async () => {
      element.rows = 5;
      await element.updateComplete;
      expect(element.rows).toBe(5);
    });

    it('should set maxlength property', async () => {
      element.maxlength = 500;
      await element.updateComplete;
      expect(element.maxlength).toBe(500);
    });

    it('should set name property', async () => {
      element.name = 'test-textarea';
      await element.updateComplete;
      expect(element.name).toBe('test-textarea');
    });
  });

  describe('Event Handling', () => {
    it('should dispatch r-input event on input', async () => {
      const handler = vi.fn();
      element.addEventListener('r-input', handler);

      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        textarea.value = 'test';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail.value.value).toBe('test');
      expect(typeof event.detail.value.isValid).toBe('boolean');
      expect(typeof event.detail.timestamp).toBe('number');
    });

    it('should update value on input', async () => {
      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        textarea.value = 'new value';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await element.updateComplete;

      expect(element.value).toBe('new value');
    });

    it('should dispatch r-change event on change', async () => {
      const handler = vi.fn();
      element.addEventListener('r-change', handler);

      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        textarea.value = 'test';
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
    });

    it('should dispatch r-blur event on blur', async () => {
      const handler = vi.fn();
      element.addEventListener('r-blur', handler);

      const textarea = element.shadowRoot?.querySelector('textarea');
      textarea?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Validation - Required', () => {
    it('should show error when required field is empty on blur', async () => {
      element.required = true;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      textarea?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBe('error');
      expect(element.errorMessage).toBe('This field is required');
    });

    it('should not show error when required field has value', async () => {
      element.required = true;
      element.value = 'test';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        textarea.value = 'test';
        textarea.dispatchEvent(new Event('blur', { bubbles: true }));
      }
      await element.updateComplete;

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });
  });

  describe('Validation - No Validation', () => {
    it('should set valid state for non-required field with value', async () => {
      element.value = 'test';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        textarea.value = 'test';
        textarea.dispatchEvent(new Event('blur', { bubbles: true }));
      }
      await element.updateComplete;

      expect(element.validationState).toBe('valid');
      expect(element.errorMessage).toBe('');
    });

    it('should not validate empty non-required field', async () => {
      element.value = '';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      textarea?.dispatchEvent(new Event('blur', { bubbles: true }));
      await element.updateComplete;

      expect(element.validationState).toBeUndefined();
      expect(element.errorMessage).toBe('');
    });
  });

  describe('Focus Management', () => {
    it('should focus textarea when focus() called', async () => {
      await element.updateComplete;
      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        const focusSpy = vi.spyOn(textarea, 'focus');
        element.focus();
        expect(focusSpy).toHaveBeenCalled();
      }
    });

    it('should blur textarea when blur() called', async () => {
      await element.updateComplete;
      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        const blurSpy = vi.spyOn(textarea, 'blur');
        element.blur();
        expect(blurSpy).toHaveBeenCalled();
      }
    });

    it('should select textarea text when select() called', async () => {
      element.value = 'test value';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      if (textarea) {
        const selectSpy = vi.spyOn(textarea, 'select');
        element.select();
        expect(selectSpy).toHaveBeenCalled();
      }
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-invalid when validation fails', async () => {
      element.validationState = 'error';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid false when valid', async () => {
      element.validationState = 'valid';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('false');
    });

    it('should set aria-errormessage with error text', async () => {
      element.errorMessage = 'This is an error';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('aria-errormessage')).toBe('This is an error');
    });

    it('should set aria-required when required', async () => {
      element.required = true;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('aria-required')).toBe('true');
    });
  });

  describe('Rendering', () => {
    it('should render textarea element', async () => {
      await element.updateComplete;
      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea).toBeTruthy();
    });

    it('should have textarea part for styling', async () => {
      await element.updateComplete;
      const textarea = element.shadowRoot?.querySelector('textarea[part="textarea"]');
      expect(textarea).toBeTruthy();
    });

    it('should render placeholder', async () => {
      element.placeholder = 'Test placeholder';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.placeholder).toBe('Test placeholder');
    });

    it('should render rows attribute', async () => {
      element.rows = 5;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.rows).toBe(5);
    });

    it('should render maxlength attribute', async () => {
      element.maxlength = 500;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('maxlength')).toBe('500');
    });

    it('should render name attribute', async () => {
      element.name = 'test-textarea';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.getAttribute('name')).toBe('test-textarea');
    });
  });

  describe('Disabled State', () => {
    it('should disable textarea when disabled=true', async () => {
      element.disabled = true;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.disabled).toBe(true);
    });
  });

  describe('Readonly State', () => {
    it('should set textarea readonly when readonly=true', async () => {
      element.readonly = true;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.readOnly).toBe(true);
    });
  });

  describe('Live Directive', () => {
    it('should keep value in sync with property', async () => {
      element.value = 'initial';
      await element.updateComplete;

      let textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.value).toBe('initial');

      element.value = 'updated';
      await element.updateComplete;

      textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.value).toBe('updated');
    });
  });

  describe('Multi-line Text', () => {
    it('should support multi-line text input', async () => {
      const multilineValue = 'Line 1\nLine 2\nLine 3';
      element.value = multilineValue;
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea?.value).toBe(multilineValue);
    });
  });
});
