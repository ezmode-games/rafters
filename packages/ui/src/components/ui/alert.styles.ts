/**
 * Shadow DOM style definitions for Alert web component
 *
 * Parallel to alert.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 * Token values via var() from the shared token stylesheet.
 *
 * All token references go through tokenVar(); no raw var() literals.
 * Motion uses --motion-duration-* / --motion-ease-* only.
 */

import type { CSSProperties } from '../../primitives/classy-wc';
import {
  atRule,
  pick,
  styleRule,
  stylesheet,
  tokenVar,
  transition,
} from '../../primitives/classy-wc';

// ============================================================================
// Public Types
// ============================================================================

export type AlertVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'muted'
  | 'accent';

// ============================================================================
// Base Styles
// ============================================================================

/**
 * Base alert declarations shared across every variant.
 * Mirrors alertBaseClasses from alert.classes.ts:
 *   relative w-full rounded-lg border p-4
 * Omits the Tailwind `[&>svg]` adjacency selectors -- consumers compose
 * slotted content themselves in the shadow DOM target.
 */
export const alertBase: CSSProperties = {
  position: 'relative',
  width: '100%',
  'border-radius': tokenVar('radius-lg'),
  'border-width': '1px',
  'border-style': 'solid',
  'border-color': 'transparent',
  padding: '1rem',
  transition: transition(
    ['background-color', 'color', 'border-color'],
    tokenVar('motion-duration-fast'),
    tokenVar('motion-ease-standard'),
  ),
};

// ============================================================================
// Variant Styles
// ============================================================================

/**
 * Per-variant background/foreground/border triple, mirroring
 * alertVariantClasses from alert.classes.ts. Semantic variants use
 * their `-subtle` / `-foreground` / `-border` token trio. muted uses
 * the flat muted pair with the neutral border token.
 */
export const alertVariantStyles: Record<AlertVariant, CSSProperties> = {
  default: {
    'background-color': tokenVar('color-primary-subtle'),
    color: tokenVar('color-primary-foreground'),
    'border-color': tokenVar('color-primary-border'),
  },
  primary: {
    'background-color': tokenVar('color-primary-subtle'),
    color: tokenVar('color-primary-foreground'),
    'border-color': tokenVar('color-primary-border'),
  },
  secondary: {
    'background-color': tokenVar('color-secondary-subtle'),
    color: tokenVar('color-secondary-foreground'),
    'border-color': tokenVar('color-secondary-border'),
  },
  destructive: {
    'background-color': tokenVar('color-destructive-subtle'),
    color: tokenVar('color-destructive-foreground'),
    'border-color': tokenVar('color-destructive-border'),
  },
  success: {
    'background-color': tokenVar('color-success-subtle'),
    color: tokenVar('color-success-foreground'),
    'border-color': tokenVar('color-success-border'),
  },
  warning: {
    'background-color': tokenVar('color-warning-subtle'),
    color: tokenVar('color-warning-foreground'),
    'border-color': tokenVar('color-warning-border'),
  },
  info: {
    'background-color': tokenVar('color-info-subtle'),
    color: tokenVar('color-info-foreground'),
    'border-color': tokenVar('color-info-border'),
  },
  muted: {
    'background-color': tokenVar('color-muted'),
    color: tokenVar('color-muted-foreground'),
    'border-color': tokenVar('color-border'),
  },
  accent: {
    'background-color': tokenVar('color-accent-subtle'),
    color: tokenVar('color-accent-foreground'),
    'border-color': tokenVar('color-accent-border'),
  },
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

export interface AlertStylesheetOptions {
  variant?: AlertVariant | undefined;
}

/**
 * Build the complete alert stylesheet for a given configuration.
 *
 * Unknown variant keys fall back to 'default' via pick(). Never throws.
 * Emits the base `.alert` rule plus a prefers-reduced-motion block that
 * neutralises the transition.
 */
export function alertStylesheet(options: AlertStylesheetOptions = {}): string {
  const { variant } = options;

  return stylesheet(
    styleRule(':host', { display: 'block' }),

    styleRule('.alert', alertBase, pick(alertVariantStyles, variant, 'default')),

    atRule('@media (prefers-reduced-motion: reduce)', styleRule('.alert', { transition: 'none' })),
  );
}
