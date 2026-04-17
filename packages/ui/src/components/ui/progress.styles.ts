/**
 * Shadow DOM style definitions for Progress web component
 *
 * Parallel to progress.classes.ts. Same semantic structure,
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

export type ProgressVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'success'
  | 'warning'
  | 'info'
  | 'accent';

export type ProgressSize = 'sm' | 'default' | 'lg';

// ============================================================================
// Container (Track) Styles
// ============================================================================

/**
 * Base track declarations shared across every variant and size.
 * Mirrors progressContainerClasses from progress.classes.ts.
 */
export const progressContainerBase: CSSProperties = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  'border-radius': '9999px',
  'background-color': tokenVar('color-muted'),
};

/**
 * Size declarations map explicit track heights.
 * Mirrors progressSizeClasses from progress.classes.ts.
 */
export const progressSizeStyles: Record<ProgressSize, CSSProperties> = {
  sm: {
    height: '0.25rem',
  },
  default: {
    height: '0.5rem',
  },
  lg: {
    height: '0.75rem',
  },
};

// ============================================================================
// Indicator Styles
// ============================================================================

/**
 * Base indicator declarations shared across every variant.
 * Mirrors progressIndicatorBaseClasses from progress.classes.ts.
 * Width is set by the element via inline style when determinate.
 */
export const progressIndicatorBase: CSSProperties = {
  height: '100%',
  transition: transition(
    ['width'],
    tokenVar('motion-duration-normal'),
    tokenVar('motion-ease-standard'),
  ),
};

/**
 * Variant background color per indicator.
 * Semantic variants carry solid fills from their token pair.
 */
export const progressVariantStyles: Record<ProgressVariant, CSSProperties> = {
  default: {
    'background-color': tokenVar('color-primary'),
  },
  primary: {
    'background-color': tokenVar('color-primary'),
  },
  secondary: {
    'background-color': tokenVar('color-secondary'),
  },
  destructive: {
    'background-color': tokenVar('color-destructive'),
  },
  success: {
    'background-color': tokenVar('color-success'),
  },
  warning: {
    'background-color': tokenVar('color-warning'),
  },
  info: {
    'background-color': tokenVar('color-info'),
  },
  accent: {
    'background-color': tokenVar('color-accent'),
  },
};

/**
 * Indeterminate indicator declarations. When no numeric value is known
 * the indicator shrinks to a third of the track and animates horizontally
 * via the @keyframes defined below.
 */
export const progressIndeterminateStyles: CSSProperties = {
  width: '33%',
  animation: `rafters-progress-indeterminate ${tokenVar('motion-duration-slow')} ${tokenVar('motion-ease-standard')} infinite`,
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

export interface ProgressStylesheetOptions {
  variant?: ProgressVariant | undefined;
  size?: ProgressSize | undefined;
}

/**
 * Build the complete progress stylesheet for a given configuration.
 *
 * Unknown variant/size keys fall back to 'default' via pick(). Never throws.
 * Emits:
 *   - `:host` display block
 *   - `.progress` track rule (container base + size)
 *   - `.progress-indicator` base + variant rule
 *   - `.progress-indicator[data-indeterminate]` indeterminate animation rule
 *   - `@keyframes rafters-progress-indeterminate` for the slide animation
 *   - `@media (prefers-reduced-motion: reduce)` block that neutralises
 *     indicator transition and animation.
 */
export function progressStylesheet(options: ProgressStylesheetOptions = {}): string {
  const { variant, size } = options;

  return stylesheet(
    styleRule(':host', { display: 'block' }),

    styleRule('.progress', progressContainerBase, pick(progressSizeStyles, size, 'default')),

    styleRule(
      '.progress-indicator',
      progressIndicatorBase,
      pick(progressVariantStyles, variant, 'default'),
    ),

    styleRule('.progress-indicator[data-indeterminate]', progressIndeterminateStyles),

    `@keyframes rafters-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}`,

    atRule(
      '@media (prefers-reduced-motion: reduce)',
      styleRule('.progress-indicator', { transition: 'none', animation: 'none' }),
    ),
  );
}
