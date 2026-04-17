/**
 * Shadow DOM style definitions for Spinner web component
 *
 * Parallel to spinner.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 * Token values via var() from the shared token stylesheet.
 *
 * All token references go through tokenVar(); no raw var() literals.
 * Motion uses --motion-duration-* / --motion-ease-* only.
 */

import type { CSSProperties } from '../../primitives/classy-wc';
import { atRule, pick, styleRule, stylesheet, tokenVar } from '../../primitives/classy-wc';

// ============================================================================
// Public Types
// ============================================================================

export type SpinnerSize = 'sm' | 'default' | 'lg';

export type SpinnerVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'accent'
  | 'muted';

// ============================================================================
// Base Styles
// ============================================================================

/**
 * Base spinner declarations shared across every variant and size.
 * Mirrors spinnerBaseClasses from spinner.classes.ts:
 * inline-block + rounded-full + animate-spin. The visible ring comes from
 * a solid border with the right side transparent, so rotation produces the
 * familiar partial-circle sweep.
 */
export const spinnerBase: CSSProperties = {
  display: 'inline-block',
  'border-radius': '9999px',
  'border-style': 'solid',
  'border-right-color': 'transparent',
  animation: `rafters-spinner-spin ${tokenVar('motion-duration-slower')} ${tokenVar('motion-ease-standard')} infinite`,
};

// ============================================================================
// Variant Styles
// ============================================================================

/**
 * Variant border-color per spinner. The right border is forced transparent
 * by spinnerBase to produce the partial-ring sweep; the remaining three
 * borders carry the variant color.
 */
export const spinnerVariantStyles: Record<SpinnerVariant, CSSProperties> = {
  default: {
    'border-color': tokenVar('color-primary'),
  },
  primary: {
    'border-color': tokenVar('color-primary'),
  },
  secondary: {
    'border-color': tokenVar('color-secondary'),
  },
  destructive: {
    'border-color': tokenVar('color-destructive'),
  },
  success: {
    'border-color': tokenVar('color-success'),
  },
  warning: {
    'border-color': tokenVar('color-warning'),
  },
  info: {
    'border-color': tokenVar('color-info'),
  },
  accent: {
    'border-color': tokenVar('color-accent'),
  },
  muted: {
    'border-color': tokenVar('color-muted-foreground'),
  },
};

// ============================================================================
// Size Styles
// ============================================================================

/**
 * Size declarations map explicit heights, widths, and border widths.
 * Mirrors spinnerSizeClasses from spinner.classes.ts:
 * sm -> 1rem / 2px border, default -> 1.5rem / 2px, lg -> 2rem / 3px.
 */
export const spinnerSizeStyles: Record<SpinnerSize, CSSProperties> = {
  sm: {
    height: '1rem',
    width: '1rem',
    'border-width': '2px',
  },
  default: {
    height: '1.5rem',
    width: '1.5rem',
    'border-width': '2px',
  },
  lg: {
    height: '2rem',
    width: '2rem',
    'border-width': '3px',
  },
};

// ============================================================================
// Visually-Hidden Styles
// ============================================================================

/**
 * Standard visually-hidden-but-accessible declarations for .sr-only in the
 * shadow DOM. The shadow root has no global Tailwind classes, so these must
 * live inside the component stylesheet itself.
 */
export const srOnly: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  'white-space': 'nowrap',
  'border-width': '0',
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

export interface SpinnerStylesheetOptions {
  size?: SpinnerSize | undefined;
  variant?: SpinnerVariant | undefined;
}

/**
 * Build the complete spinner stylesheet for a given configuration.
 *
 * Unknown size/variant keys fall back to 'default' via pick(). Never throws.
 * Emits:
 *   - `:host` display inline-block
 *   - `.spinner` base + variant + size rule
 *   - `.sr-only` visually-hidden helper rule
 *   - `@keyframes rafters-spinner-spin` for rotation
 *   - `@media (prefers-reduced-motion: reduce)` block that neutralises
 *     the animation.
 */
export function spinnerStylesheet(options: SpinnerStylesheetOptions = {}): string {
  const { size, variant } = options;

  return stylesheet(
    styleRule(':host', { display: 'inline-block' }),

    styleRule(
      '.spinner',
      spinnerBase,
      pick(spinnerVariantStyles, variant, 'default'),
      pick(spinnerSizeStyles, size, 'default'),
      // Re-assert border-right-color after variant application so the
      // transparent edge survives the border-color shorthand.
      { 'border-right-color': 'transparent' },
    ),

    styleRule('.sr-only', srOnly),

    `@keyframes rafters-spinner-spin {
  to { transform: rotate(360deg); }
}`,

    atRule('@media (prefers-reduced-motion: reduce)', styleRule('.spinner', { animation: 'none' })),
  );
}
