/**
 * Shadow DOM style definitions for Avatar web component
 *
 * Parallel to avatar.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 * Token values via var() from the shared token stylesheet.
 *
 * All token references resolve through tokenVar(); no raw var() literals
 * appear in this module.
 * Motion uses --motion-duration-* / --motion-ease-* only.
 */

import type { CSSProperties } from '../../primitives/classy-wc';
import { pick, styleRule, stylesheet, tokenVar } from '../../primitives/classy-wc';

// ============================================================================
// Public Types
// ============================================================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ============================================================================
// Allowed Value Sets (for validation / fallback)
// ============================================================================

export const AVATAR_SIZES: ReadonlyArray<AvatarSize> = ['xs', 'sm', 'md', 'lg', 'xl'];

export function isAvatarSize(value: unknown): value is AvatarSize {
  return typeof value === 'string' && (AVATAR_SIZES as ReadonlyArray<string>).includes(value);
}

// ============================================================================
// Base Styles
// ============================================================================

/**
 * Base avatar declarations shared across every size.
 * Mirrors avatarBaseClasses from avatar.classes.ts: relative flex shrink-0
 * overflow-hidden rounded-full.
 */
export const avatarBase: CSSProperties = {
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  'flex-shrink': '0',
  overflow: 'hidden',
  'border-radius': '9999px',
  'background-color': tokenVar('color-muted'),
  color: tokenVar('color-muted-foreground'),
};

// ============================================================================
// Size Styles
// ============================================================================

/**
 * Size declarations map explicit square dimensions (height === width) plus
 * per-size font-size tokens. Mirrors avatarSizeClasses from avatar.classes.ts.
 *
 *   xs: h-6 w-6 text-xs    -> spacing-6  + font-size-label-small
 *   sm: h-8 w-8 text-sm    -> spacing-8  + font-size-label-small
 *   md: h-10 w-10 text-base -> spacing-10 + font-size-label-medium
 *   lg: h-12 w-12 text-lg   -> spacing-12 + font-size-label-large
 *   xl: h-16 w-16 text-xl   -> spacing-16 + font-size-title-medium
 */
export const avatarSizeStyles: Record<AvatarSize, CSSProperties> = {
  xs: {
    height: tokenVar('spacing-6'),
    width: tokenVar('spacing-6'),
    'font-size': tokenVar('font-size-label-small'),
  },
  sm: {
    height: tokenVar('spacing-8'),
    width: tokenVar('spacing-8'),
    'font-size': tokenVar('font-size-label-small'),
  },
  md: {
    height: tokenVar('spacing-10'),
    width: tokenVar('spacing-10'),
    'font-size': tokenVar('font-size-label-medium'),
  },
  lg: {
    height: tokenVar('spacing-12'),
    width: tokenVar('spacing-12'),
    'font-size': tokenVar('font-size-label-large'),
  },
  xl: {
    height: tokenVar('spacing-16'),
    width: tokenVar('spacing-16'),
    'font-size': tokenVar('font-size-title-medium'),
  },
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

export interface AvatarStylesheetOptions {
  size?: AvatarSize | undefined;
}

/**
 * Build the complete avatar stylesheet for a given configuration.
 *
 * Unknown size keys fall back to 'md' via pick(). Never throws.
 */
export function avatarStylesheet(options: AvatarStylesheetOptions = {}): string {
  const { size } = options;

  return stylesheet(
    styleRule(':host', { display: 'inline-flex' }),

    styleRule('.avatar', avatarBase, pick(avatarSizeStyles, size, 'md')),
  );
}
