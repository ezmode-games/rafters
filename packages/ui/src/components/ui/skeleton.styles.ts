/**
 * Shadow DOM style definitions for Skeleton web component
 *
 * Parallel to skeleton.classes.ts. Same semantic structure,
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

export type SkeletonVariant =
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
 * Base skeleton declarations shared across every variant.
 * Mirrors skeletonBaseClasses from skeleton.classes.ts:
 * rounded-md + animate-pulse. Consumers control size via inline styles
 * or CSS on the host element.
 */
export const skeletonBase: CSSProperties = {
  display: 'block',
  'border-radius': tokenVar('radius-md'),
  animation: `rafters-skeleton-pulse ${tokenVar('motion-duration-slower')} ${tokenVar('motion-ease-standard')} infinite`,
};

// ============================================================================
// Variant Styles
// ============================================================================

/**
 * Variant background per skeleton. Subtle backgrounds match
 * skeletonVariantClasses from skeleton.classes.ts. `default` and `muted`
 * both fall through to the muted token; other semantic variants use
 * their `-subtle` token pair.
 */
export const skeletonVariantStyles: Record<SkeletonVariant, CSSProperties> = {
  default: {
    'background-color': tokenVar('color-muted'),
  },
  primary: {
    'background-color': tokenVar('color-primary-subtle'),
  },
  secondary: {
    'background-color': tokenVar('color-secondary-subtle'),
  },
  destructive: {
    'background-color': tokenVar('color-destructive-subtle'),
  },
  success: {
    'background-color': tokenVar('color-success-subtle'),
  },
  warning: {
    'background-color': tokenVar('color-warning-subtle'),
  },
  info: {
    'background-color': tokenVar('color-info-subtle'),
  },
  muted: {
    'background-color': tokenVar('color-muted'),
  },
  accent: {
    'background-color': tokenVar('color-accent-subtle'),
  },
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

export interface SkeletonStylesheetOptions {
  variant?: SkeletonVariant | undefined;
}

/**
 * Build the complete skeleton stylesheet for a given configuration.
 *
 * Unknown variant keys fall back to 'default' via pick(). Never throws.
 * Emits:
 *   - `:host` display block
 *   - `.skeleton` base + variant rule
 *   - `@keyframes rafters-skeleton-pulse` for the pulse animation
 *   - `@media (prefers-reduced-motion: reduce)` block that neutralises
 *     the animation.
 */
export function skeletonStylesheet(options: SkeletonStylesheetOptions = {}): string {
  const { variant } = options;

  return stylesheet(
    styleRule(':host', { display: 'block' }),

    styleRule('.skeleton', skeletonBase, pick(skeletonVariantStyles, variant, 'default')),

    `@keyframes rafters-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}`,

    atRule(
      '@media (prefers-reduced-motion: reduce)',
      styleRule('.skeleton', { animation: 'none' }),
    ),
  );
}
