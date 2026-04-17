/**
 * Shadow DOM style definitions for Textarea web component
 *
 * Parallel to textarea.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 *
 * All token references go through tokenVar() -- no raw CSS custom-property
 * function literals appear in this module.
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

export type TextareaVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'muted'
  | 'accent';

export type TextareaSize = 'sm' | 'default' | 'lg';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaStylesheetOptions {
  variant?: TextareaVariant | undefined;
  size?: TextareaSize | undefined;
  resize?: TextareaResize | undefined;
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
}

// ============================================================================
// Variant -> color token mapping
// ============================================================================

/**
 * Maps a variant name to the design-token color used for the textarea border.
 * `default` aliases to `color-primary`; `muted` aliases to `color-input`.
 */
export const textareaVariantBorderToken: Record<TextareaVariant, string> = {
  default: 'color-primary',
  primary: 'color-primary',
  secondary: 'color-secondary',
  destructive: 'color-destructive',
  success: 'color-success',
  warning: 'color-warning',
  info: 'color-info',
  muted: 'color-input',
  accent: 'color-accent',
};

/**
 * Maps a variant name to the design-token color used for the focus ring.
 * `default` aliases to `color-primary-ring`; `muted` aliases to `color-ring`.
 */
export const textareaVariantRingToken: Record<TextareaVariant, string> = {
  default: 'color-primary-ring',
  primary: 'color-primary-ring',
  secondary: 'color-secondary-ring',
  destructive: 'color-destructive-ring',
  success: 'color-success-ring',
  warning: 'color-warning-ring',
  info: 'color-info-ring',
  muted: 'color-ring',
  accent: 'color-accent-ring',
};

// ============================================================================
// Base Styles
// ============================================================================

export const textareaBase: CSSProperties = {
  display: 'block',
  width: '100%',
  'box-sizing': 'border-box',
  font: 'inherit',
  'border-width': '1px',
  'border-style': 'solid',
  'border-color': tokenVar('color-input'),
  'border-radius': tokenVar('radius-md'),
  'background-color': tokenVar('color-background'),
  color: tokenVar('color-foreground'),
  'padding-left': tokenVar('spacing-3'),
  'padding-right': tokenVar('spacing-3'),
  'padding-top': tokenVar('spacing-2'),
  'padding-bottom': tokenVar('spacing-2'),
  transition: transition(
    ['border-color', 'box-shadow'],
    tokenVar('motion-duration-fast'),
    tokenVar('motion-ease-standard'),
  ),
};

export const textareaPlaceholder: CSSProperties = {
  color: tokenVar('color-muted-foreground'),
  opacity: '1',
};

export const textareaFocusVisible: CSSProperties = {
  outline: 'none',
  'border-color': tokenVar('color-ring'),
  'box-shadow': `0 0 0 2px ${tokenVar('color-ring')}`,
};

export const textareaDisabled: CSSProperties = {
  cursor: 'not-allowed',
  opacity: '0.5',
};

export const textareaInvalid: CSSProperties = {
  'border-color': tokenVar('color-destructive'),
  'box-shadow': `0 0 0 2px ${tokenVar('color-destructive-ring', 'transparent')}`,
};

// ============================================================================
// Variant Styles
// ============================================================================

/**
 * Per-variant overrides applied to the base textarea rule.
 * Each variant overrides the border-color and sets the
 * --rafters-textarea-ring custom property used by the focus ring.
 */
export const textareaVariantStyles: Record<TextareaVariant, CSSProperties> = {
  default: {
    'border-color': tokenVar('color-primary'),
    '--rafters-textarea-ring': tokenVar('color-primary-ring'),
  },
  primary: {
    'border-color': tokenVar('color-primary'),
    '--rafters-textarea-ring': tokenVar('color-primary-ring'),
  },
  secondary: {
    'border-color': tokenVar('color-secondary'),
    '--rafters-textarea-ring': tokenVar('color-secondary-ring'),
  },
  destructive: {
    'border-color': tokenVar('color-destructive'),
    '--rafters-textarea-ring': tokenVar('color-destructive-ring'),
  },
  success: {
    'border-color': tokenVar('color-success'),
    '--rafters-textarea-ring': tokenVar('color-success-ring'),
  },
  warning: {
    'border-color': tokenVar('color-warning'),
    '--rafters-textarea-ring': tokenVar('color-warning-ring'),
  },
  info: {
    'border-color': tokenVar('color-info'),
    '--rafters-textarea-ring': tokenVar('color-info-ring'),
  },
  muted: {
    'border-color': tokenVar('color-input'),
    '--rafters-textarea-ring': tokenVar('color-ring'),
  },
  accent: {
    'border-color': tokenVar('color-accent'),
    '--rafters-textarea-ring': tokenVar('color-accent-ring'),
  },
};

// ============================================================================
// Size Styles
// ============================================================================

export const textareaSizeStyles: Record<TextareaSize, CSSProperties> = {
  sm: {
    'min-height': '4rem',
    'padding-left': tokenVar('spacing-2'),
    'padding-right': tokenVar('spacing-2'),
    'padding-top': tokenVar('spacing-1'),
    'padding-bottom': tokenVar('spacing-1'),
    'font-size': tokenVar('font-size-label-small'),
  },
  default: {
    'min-height': '5rem',
    'padding-left': tokenVar('spacing-3'),
    'padding-right': tokenVar('spacing-3'),
    'padding-top': tokenVar('spacing-2'),
    'padding-bottom': tokenVar('spacing-2'),
    'font-size': tokenVar('font-size-body-small'),
  },
  lg: {
    'min-height': '7rem',
    'padding-left': tokenVar('spacing-4'),
    'padding-right': tokenVar('spacing-4'),
    'padding-top': tokenVar('spacing-3'),
    'padding-bottom': tokenVar('spacing-3'),
    'font-size': tokenVar('font-size-body-medium'),
  },
};

// ============================================================================
// Resize Styles
// ============================================================================

export const textareaResizeStyles: Record<TextareaResize, CSSProperties> = {
  none: {
    resize: 'none',
  },
  vertical: {
    resize: 'vertical',
  },
  horizontal: {
    resize: 'horizontal',
  },
  both: {
    resize: 'both',
  },
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

/**
 * Build the complete textarea stylesheet for a given configuration.
 *
 * Composition:
 *   :host                                         -> display: block
 *   textarea                                      -> base + variant border + size + resize
 *   textarea::placeholder                         -> muted-foreground
 *   :host(:focus-within) textarea                 -> focus ring
 *   textarea:focus-visible                        -> focus ring
 *   :host([disabled]) textarea / textarea:disabled-> cursor + opacity
 *   :host([aria-invalid="true"]) textarea         -> destructive border + ring
 *   textarea[aria-invalid="true"]                 -> destructive border + ring
 *   @media reduced-motion                         -> transition: none on textarea
 *
 * Unknown variant, size, or resize values silently fall back to defaults
 * ('default', 'default', 'none') without throwing.
 */
export function textareaStylesheet(options: TextareaStylesheetOptions = {}): string {
  const { variant, size, resize } = options;

  const safeVariant: TextareaVariant =
    variant && variant in textareaVariantStyles ? variant : 'default';
  const safeSize: TextareaSize = size && size in textareaSizeStyles ? size : 'default';
  const safeResize: TextareaResize = resize && resize in textareaResizeStyles ? resize : 'none';

  return stylesheet(
    styleRule(':host', { display: 'block' }),

    // Base textarea rule -- declares all token-driven defaults including
    // border-color: var(--color-input). The variant rule below overrides
    // border-color via the cascade with the variant-specific token.
    styleRule(
      'textarea',
      textareaBase,
      pick(textareaSizeStyles, safeSize, 'default'),
      pick(textareaResizeStyles, safeResize, 'none'),
    ),

    // Variant border + ring-token override -- emitted as a separate rule so
    // that the base token (color-input) remains visible in the stylesheet
    // while the variant token takes effect at render time via cascade.
    styleRule('textarea', pick(textareaVariantStyles, safeVariant, 'default')),

    styleRule('textarea::placeholder', textareaPlaceholder),
    styleRule(':host(:focus-within) textarea', textareaFocusVisible),
    styleRule('textarea:focus-visible', textareaFocusVisible),
    styleRule(':host([disabled]) textarea', textareaDisabled),
    styleRule('textarea:disabled', textareaDisabled),
    styleRule(':host([aria-invalid="true"]) textarea', textareaInvalid),
    styleRule('textarea[aria-invalid="true"]', textareaInvalid),

    atRule(
      '@media (prefers-reduced-motion: reduce)',
      styleRule('textarea', { transition: 'none' }),
    ),
  );
}
