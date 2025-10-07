/**
 * TypeScript declarations for Rafters primitives custom elements
 * Allows using Web Components in JSX/TSX without type errors
 */

import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'r-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
      };
      'r-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        checked?: boolean;
        indeterminate?: boolean;
        disabled?: boolean;
        name?: string;
        value?: string;
      };
      'r-combobox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        expanded?: boolean;
        placeholder?: string;
        name?: string;
        disabled?: boolean;
        'listbox-id'?: string;
      };
      'r-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
        value?: string;
        placeholder?: string;
        required?: boolean;
        readonly?: boolean;
        disabled?: boolean;
        minlength?: number;
        maxlength?: number;
        pattern?: string;
        autocomplete?: string;
        name?: string;
      };
      'r-radio': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name: string;
        value: string;
        checked?: boolean;
        disabled?: boolean;
      };
    }
  }
}

export {};
