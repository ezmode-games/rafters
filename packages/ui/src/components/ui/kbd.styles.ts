/**
 * Shadow DOM style definitions for Kbd web component
 *
 * Parallel to kbd.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 * Token values via var() from the shared token stylesheet.
 *
 * All token references go through tokenVar(); no raw var() literals.
 */

import type { CSSProperties } from '../../primitives/classy-wc';
import { styleRule, stylesheet, tokenVar } from '../../primitives/classy-wc';

// ============================================================================
// Base Styles
// ============================================================================

/**
 * Base kbd declarations mirror kbdBaseClasses from kbd.classes.ts:
 *  inline-flex items-center justify-center rounded border border-border
 *  bg-muted px-1.5 py-0.5 text-code-small text-muted-foreground shadow-sm
 */
export const kbdBase: CSSProperties = {
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  'border-radius': tokenVar('radius-sm'),
  'border-width': '1px',
  'border-style': 'solid',
  'border-color': tokenVar('color-border'),
  'background-color': tokenVar('color-muted'),
  'padding-left': '0.375rem',
  'padding-right': '0.375rem',
  'padding-top': '0.125rem',
  'padding-bottom': '0.125rem',
  'font-family': tokenVar('font-code-small-family'),
  'font-size': tokenVar('font-code-small-size'),
  'font-weight': tokenVar('font-code-small-weight'),
  'line-height': tokenVar('font-code-small-line-height'),
  'letter-spacing': tokenVar('font-code-small-letter-spacing'),
  color: tokenVar('color-muted-foreground'),
  'box-shadow': tokenVar('shadow-sm'),
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

/**
 * Build the complete kbd stylesheet.
 *
 * Kbd has no variants or sizes -- the React target has none either.
 * Emits two rules: a :host rule that makes the host inline-flex,
 * and a .kbd rule that applies the visual styling.
 */
export function kbdStylesheet(): string {
  return stylesheet(styleRule(':host', { display: 'inline-flex' }), styleRule('.kbd', kbdBase));
}
