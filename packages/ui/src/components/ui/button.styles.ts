/**
 * Shadow DOM style definitions for Button web component
 *
 * Parallel to button.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 * Token values via var() from the shared token stylesheet.
 *
 * All token references go through tokenVar(); no raw var() literals.
 * Motion uses --motion-duration-* / --motion-ease-* only.
 */

import type { CSSProperties } from '../../primitives/classy-wc';
import {
  atRule,
  mixin,
  pick,
  styleRule,
  stylesheet,
  tokenVar,
  transition,
  when,
} from '../../primitives/classy-wc';

// ============================================================================
// Public Types
// ============================================================================

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'muted'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'link';

export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

// ============================================================================
// Base Styles
// ============================================================================

/**
 * Base button declarations shared across every variant and size.
 * Mirrors buttonBaseClasses from button.classes.ts.
 */
export const buttonBase: CSSProperties = {
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  gap: '0.5rem',
  'border-radius': tokenVar('radius-md'),
  'font-weight': '500',
  cursor: 'pointer',
  'user-select': 'none',
  'white-space': 'nowrap',
  'border-width': '0',
  'border-style': 'solid',
  'border-color': 'transparent',
  'background-color': 'transparent',
  color: 'inherit',
  transition: transition(
    ['background-color', 'color', 'border-color', 'box-shadow', 'opacity'],
    tokenVar('motion-duration-fast'),
    tokenVar('motion-ease-standard'),
  ),
};

/**
 * Disabled-state declarations. Applied either via the host's `disabled`
 * attribute (composed into the base rule) or via `:disabled` on the inner
 * button for defensive coverage.
 */
export const buttonDisabled: CSSProperties = {
  opacity: '0.5',
  cursor: 'not-allowed',
  'pointer-events': 'none',
};

// ============================================================================
// Variant Styles
// ============================================================================

/**
 * Base background + foreground pair for every variant.
 * Semantic variants carry solid fills; outline/ghost/link use transparent base.
 */
export const buttonVariantStyles: Record<ButtonVariant, CSSProperties> = {
  default: {
    'background-color': tokenVar('color-primary'),
    color: tokenVar('color-primary-foreground'),
  },
  primary: {
    'background-color': tokenVar('color-primary'),
    color: tokenVar('color-primary-foreground'),
  },
  secondary: {
    'background-color': tokenVar('color-secondary'),
    color: tokenVar('color-secondary-foreground'),
  },
  destructive: {
    'background-color': tokenVar('color-destructive'),
    color: tokenVar('color-destructive-foreground'),
  },
  success: {
    'background-color': tokenVar('color-success'),
    color: tokenVar('color-success-foreground'),
  },
  warning: {
    'background-color': tokenVar('color-warning'),
    color: tokenVar('color-warning-foreground'),
  },
  info: {
    'background-color': tokenVar('color-info'),
    color: tokenVar('color-info-foreground'),
  },
  muted: {
    'background-color': tokenVar('color-muted'),
    color: tokenVar('color-muted-foreground'),
  },
  accent: {
    'background-color': tokenVar('color-accent'),
    color: tokenVar('color-accent-foreground'),
  },
  outline: {
    'background-color': 'transparent',
    'border-width': '1px',
    'border-style': 'solid',
    'border-color': tokenVar('color-input'),
    color: tokenVar('color-foreground'),
  },
  ghost: {
    'background-color': 'transparent',
    color: tokenVar('color-foreground'),
  },
  link: {
    'background-color': 'transparent',
    color: tokenVar('color-primary'),
    'text-underline-offset': '4px',
  },
};

/**
 * Hover-state background override per variant.
 * Semantic variants flip to their `-hover` token. outline/ghost hover to
 * the accent pair. link adds underline without changing background.
 */
export const buttonVariantHover: Record<ButtonVariant, CSSProperties> = {
  default: {
    'background-color': tokenVar('color-primary-hover'),
  },
  primary: {
    'background-color': tokenVar('color-primary-hover'),
  },
  secondary: {
    'background-color': tokenVar('color-secondary-hover'),
  },
  destructive: {
    'background-color': tokenVar('color-destructive-hover'),
  },
  success: {
    'background-color': tokenVar('color-success-hover'),
  },
  warning: {
    'background-color': tokenVar('color-warning-hover'),
  },
  info: {
    'background-color': tokenVar('color-info-hover'),
  },
  muted: {
    'background-color': tokenVar('color-muted-hover'),
  },
  accent: {
    'background-color': tokenVar('color-accent-hover'),
  },
  outline: {
    'background-color': tokenVar('color-accent'),
    color: tokenVar('color-accent-foreground'),
  },
  ghost: {
    'background-color': tokenVar('color-accent'),
    color: tokenVar('color-accent-foreground'),
  },
  link: {
    'text-decoration': 'underline',
  },
};

/**
 * Active-state (press) background override per variant.
 * Semantic variants flip to their `-active` token.
 * outline/ghost fall back to the accent pair; link is unchanged.
 */
export const buttonVariantActive: Record<ButtonVariant, CSSProperties> = {
  default: {
    'background-color': tokenVar('color-primary-active'),
  },
  primary: {
    'background-color': tokenVar('color-primary-active'),
  },
  secondary: {
    'background-color': tokenVar('color-secondary-active'),
  },
  destructive: {
    'background-color': tokenVar('color-destructive-active'),
  },
  success: {
    'background-color': tokenVar('color-success-active'),
  },
  warning: {
    'background-color': tokenVar('color-warning-active'),
  },
  info: {
    'background-color': tokenVar('color-info-active'),
  },
  muted: {
    'background-color': tokenVar('color-muted-active'),
  },
  accent: {
    'background-color': tokenVar('color-accent-active'),
  },
  outline: {
    'background-color': tokenVar('color-accent'),
    color: tokenVar('color-accent-foreground'),
  },
  ghost: {
    'background-color': tokenVar('color-accent'),
    color: tokenVar('color-accent-foreground'),
  },
  link: {
    'text-decoration': 'underline',
  },
};

/**
 * Focus-visible ring mixin factory. Double-ring (background offset + color-ring)
 * gives the ring space on any background.
 */
function focusRingFor(ringToken: string): CSSProperties {
  return mixin({
    outline: 'none',
    'box-shadow': `0 0 0 2px ${tokenVar('color-background')}, 0 0 0 4px ${tokenVar(ringToken)}`,
  });
}

/**
 * Focus-visible ring styles per variant. Semantic variants use their
 * `-ring` token. muted/outline/ghost/link share the neutral `color-ring`.
 */
export const buttonVariantFocusRing: Record<ButtonVariant, CSSProperties> = {
  default: focusRingFor('color-primary-ring'),
  primary: focusRingFor('color-primary-ring'),
  secondary: focusRingFor('color-secondary-ring'),
  destructive: focusRingFor('color-destructive-ring'),
  success: focusRingFor('color-success-ring'),
  warning: focusRingFor('color-warning-ring'),
  info: focusRingFor('color-info-ring'),
  muted: focusRingFor('color-ring'),
  accent: focusRingFor('color-accent-ring'),
  outline: focusRingFor('color-ring'),
  ghost: focusRingFor('color-ring'),
  link: focusRingFor('color-ring'),
};

// ============================================================================
// Size Styles
// ============================================================================

/**
 * Size declarations map explicit heights (with matching widths on icon sizes)
 * plus padding pairs and per-size label font-size tokens.
 */
export const buttonSizeStyles: Record<ButtonSize, CSSProperties> = {
  default: {
    height: '2.5rem',
    'padding-left': '1rem',
    'padding-right': '1rem',
    'padding-top': '0.5rem',
    'padding-bottom': '0.5rem',
    'font-size': tokenVar('font-size-label-medium'),
  },
  xs: {
    height: '1.5rem',
    'padding-left': '0.5rem',
    'padding-right': '0.5rem',
    'padding-top': '0',
    'padding-bottom': '0',
    'font-size': tokenVar('font-size-label-small'),
  },
  sm: {
    height: '2rem',
    'padding-left': '0.75rem',
    'padding-right': '0.75rem',
    'padding-top': '0',
    'padding-bottom': '0',
    'font-size': tokenVar('font-size-label-small'),
  },
  lg: {
    height: '3rem',
    'padding-left': '1.5rem',
    'padding-right': '1.5rem',
    'padding-top': '0.5rem',
    'padding-bottom': '0.5rem',
    'font-size': tokenVar('font-size-label-large'),
  },
  icon: {
    height: '2.5rem',
    width: '2.5rem',
    'padding-left': '0',
    'padding-right': '0',
    'padding-top': '0',
    'padding-bottom': '0',
    'font-size': tokenVar('font-size-label-medium'),
  },
  'icon-xs': {
    height: '1.5rem',
    width: '1.5rem',
    'padding-left': '0',
    'padding-right': '0',
    'padding-top': '0',
    'padding-bottom': '0',
    'font-size': tokenVar('font-size-label-small'),
  },
  'icon-sm': {
    height: '2rem',
    width: '2rem',
    'padding-left': '0',
    'padding-right': '0',
    'padding-top': '0',
    'padding-bottom': '0',
    'font-size': tokenVar('font-size-label-small'),
  },
  'icon-lg': {
    height: '3rem',
    width: '3rem',
    'padding-left': '0',
    'padding-right': '0',
    'padding-top': '0',
    'padding-bottom': '0',
    'font-size': tokenVar('font-size-label-large'),
  },
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

export interface ButtonStylesheetOptions {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  disabled?: boolean | undefined;
}

/**
 * Build the complete button stylesheet for a given configuration.
 *
 * Unknown variant/size keys fall back to 'default' via pick(). Never throws.
 * Emits hover/active rules scoped to `.button:hover:not(:disabled)` and
 * `.button:active:not(:disabled)`, a focus-visible ring, a :disabled rule,
 * and a prefers-reduced-motion block that neutralises the transition.
 */
export function buttonStylesheet(options: ButtonStylesheetOptions = {}): string {
  const { variant, size, disabled } = options;

  return stylesheet(
    styleRule(':host', { display: 'inline-flex' }),

    styleRule(
      '.button',
      buttonBase,
      pick(buttonVariantStyles, variant, 'default'),
      pick(buttonSizeStyles, size, 'default'),
      when(disabled, buttonDisabled),
    ),

    styleRule('.button:hover:not(:disabled)', pick(buttonVariantHover, variant, 'default')),

    styleRule('.button:active:not(:disabled)', pick(buttonVariantActive, variant, 'default')),

    styleRule('.button:focus-visible', pick(buttonVariantFocusRing, variant, 'default')),

    styleRule('.button:disabled', buttonDisabled),

    atRule('@media (prefers-reduced-motion: reduce)', styleRule('.button', { transition: 'none' })),
  );
}
