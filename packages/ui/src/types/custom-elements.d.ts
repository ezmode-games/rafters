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
    }
  }
}

export {};
