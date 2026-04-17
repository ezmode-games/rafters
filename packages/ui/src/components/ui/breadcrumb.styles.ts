/**
 * Shadow DOM style definitions for Breadcrumb web component
 *
 * Parallel to breadcrumb.classes.ts. Same semantic structure,
 * CSS property maps instead of Tailwind class strings.
 *
 * Scope: styles the outer `<nav class="breadcrumb">` container plus the
 * list/item/link/page/separator/ellipsis descendant selectors so future
 * child components (or light-DOM composition via ::slotted) inherit the
 * correct visual rhythm.
 *
 * Token references go exclusively through tokenVar(). Motion tokens are
 * the --motion-duration-* / --motion-ease-* namespace only.
 */

import type { CSSProperties } from '../../primitives/classy-wc';
import { atRule, styleRule, stylesheet, tokenVar, transition } from '../../primitives/classy-wc';

// ============================================================================
// Base Styles
// ============================================================================

/**
 * Outer <nav class="breadcrumb"> container. Semantic wrapper only.
 */
export const breadcrumbBase: CSSProperties = {
  display: 'block',
  color: tokenVar('color-muted-foreground'),
};

/**
 * <ol class="breadcrumb-list"> -- horizontal list of breadcrumb items.
 * Mirrors breadcrumbListClasses from breadcrumb.classes.ts.
 */
export const breadcrumbList: CSSProperties = {
  display: 'flex',
  'flex-wrap': 'wrap',
  'align-items': 'center',
  gap: '0.375rem',
  'word-break': 'break-word',
  'font-size': tokenVar('font-size-label-medium'),
  color: tokenVar('color-muted-foreground'),
  'list-style': 'none',
  margin: '0',
  padding: '0',
};

/**
 * <li class="breadcrumb-item"> -- individual trail entry.
 */
export const breadcrumbItem: CSSProperties = {
  display: 'inline-flex',
  'align-items': 'center',
  gap: '0.375rem',
};

/**
 * <a class="breadcrumb-link"> -- navigable ancestor link.
 * Hover flips color to foreground; focus-visible paints a double ring.
 */
export const breadcrumbLink: CSSProperties = {
  color: 'inherit',
  'text-decoration': 'none',
  transition: transition(
    ['color'],
    tokenVar('motion-duration-fast'),
    tokenVar('motion-ease-standard'),
  ),
};

export const breadcrumbLinkHover: CSSProperties = {
  color: tokenVar('color-foreground'),
};

export const breadcrumbLinkFocusVisible: CSSProperties = {
  outline: 'none',
  'box-shadow': `0 0 0 2px ${tokenVar('color-background')}, 0 0 0 4px ${tokenVar('color-ring')}`,
};

/**
 * <span class="breadcrumb-page"> -- non-interactive current page token.
 */
export const breadcrumbPage: CSSProperties = {
  color: tokenVar('color-foreground'),
  'font-weight': '400',
};

/**
 * <li class="breadcrumb-separator"> -- visual divider between trail items.
 * Svg sizing matches the React target (size-3.5).
 */
export const breadcrumbSeparator: CSSProperties = {
  display: 'inline-flex',
  'align-items': 'center',
  'pointer-events': 'none',
};

export const breadcrumbSeparatorSvg: CSSProperties = {
  width: '0.875rem',
  height: '0.875rem',
};

/**
 * <span class="breadcrumb-ellipsis"> -- collapsed-segment affordance.
 */
export const breadcrumbEllipsis: CSSProperties = {
  display: 'inline-flex',
  'align-items': 'center',
  'justify-content': 'center',
  width: '2.25rem',
  height: '2.25rem',
};

// ============================================================================
// Assembled Stylesheet
// ============================================================================

/**
 * Build the complete breadcrumb stylesheet.
 *
 * The outer container has no variants, so this is a zero-arg factory.
 * Emits base rules for the nav plus every documented descendant selector
 * so slotted children or future child Web Components inherit consistent
 * visual rhythm under the host shadow root.
 */
export function breadcrumbStylesheet(): string {
  return stylesheet(
    styleRule(':host', { display: 'block' }),

    styleRule('.breadcrumb', breadcrumbBase),

    styleRule('.breadcrumb-list', breadcrumbList),

    styleRule('.breadcrumb-item', breadcrumbItem),

    styleRule('.breadcrumb-link', breadcrumbLink),
    styleRule('.breadcrumb-link:hover', breadcrumbLinkHover),
    styleRule('.breadcrumb-link:focus-visible', breadcrumbLinkFocusVisible),

    styleRule('.breadcrumb-page', breadcrumbPage),

    styleRule('.breadcrumb-separator', breadcrumbSeparator),
    styleRule('.breadcrumb-separator > svg', breadcrumbSeparatorSvg),

    styleRule('.breadcrumb-ellipsis', breadcrumbEllipsis),

    atRule(
      '@media (prefers-reduced-motion: reduce)',
      styleRule('.breadcrumb-link', { transition: 'none' }),
    ),
  );
}
