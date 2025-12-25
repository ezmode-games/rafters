/**
 * Tailwind v4 CSS Exporter
 *
 * Converts TokenRegistry contents to Tailwind v4 CSS format with:
 * - @theme block for raw color scales
 * - :root --rafters-* namespace tokens (light/dark mode)
 * - Semantic variables that switch via prefers-color-scheme
 * - @theme inline bridge pattern
 *
 * @see https://tailwindcss.com/docs/theme
 * @see https://ui.shadcn.com/docs/theming
 */

import type { ColorReference, ColorValue, Token } from '@rafters/shared';
import type { TokenRegistry } from '../registry.js';

/**
 * Options for Tailwind CSS export
 */
export interface TailwindExportOptions {
  /** Include comments with token metadata (default: false) */
  includeComments?: boolean;
  /** Include @import "tailwindcss" at top */
  includeImport?: boolean;
}

/**
 * Group tokens by their namespace
 */
interface GroupedTokens {
  semantic: Token[];
  color: Token[];
  spacing: Token[];
  typography: Token[];
  radius: Token[];
  shadow: Token[];
  depth: Token[];
  motion: Token[];
  breakpoint: Token[];
  elevation: Token[];
  focus: Token[];
  other: Token[];
}

/**
 * Comprehensive Semantic Color Mappings for the Rafters Design System
 *
 * This mapping provides a complete, accessible design system that is:
 * 1. Drop-in compatible with shadcn/ui components
 * 2. Section 508 / WCAG 2.2 AA compliant
 * 3. Fully themed with all interaction states
 *
 * Color family names from API cache (api.rafters.studio):
 * - silver-true-glacier: cyan/teal (h:180)
 * - silver-bold-fire-truck: red (h:0)
 * - silver-true-honey: amber/gold (h:60)
 * - silver-true-citrine: lime/green (h:90)
 * - silver-true-sky: blue (h:210)
 * - silver-true-violet: violet/purple (h:270)
 *
 * Token Naming Convention:
 * - {semantic}: base color (e.g., primary, destructive)
 * - {semantic}-foreground: text color on base
 * - {semantic}-hover: hover state background
 * - {semantic}-hover-foreground: text on hover state
 * - {semantic}-active: pressed/active state
 * - {semantic}-active-foreground: text on active state
 * - {semantic}-focus: focus state (usually same as base, ring handles visual)
 * - {semantic}-border: border color variant
 * - {semantic}-ring: focus ring color
 * - {semantic}-subtle: light tinted background for alerts/badges
 * - {semantic}-subtle-foreground: text on subtle background
 *
 * Contrast Requirements (WCAG 2.2 AA):
 * - Normal text: 4.5:1 minimum
 * - Large text (18px+ or 14px+ bold): 3:1 minimum
 * - UI components: 3:1 minimum
 * - Focus indicators: 3:1 minimum
 */
const RAFTERS_SEMANTIC_MAPPINGS: Record<string, { light: string; dark: string }> = {
  // ============================================================================
  // CORE SURFACE TOKENS (shadcn compatible)
  // ============================================================================
  background: { light: 'neutral-50', dark: 'neutral-950' },
  foreground: { light: 'neutral-950', dark: 'neutral-50' },

  // Card surfaces
  card: { light: 'neutral-50', dark: 'neutral-950' },
  'card-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'card-hover': { light: 'neutral-100', dark: 'neutral-900' },
  'card-border': { light: 'neutral-200', dark: 'neutral-800' },

  // Popover/dropdown surfaces
  popover: { light: 'neutral-50', dark: 'neutral-950' },
  'popover-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'popover-border': { light: 'neutral-200', dark: 'neutral-800' },

  // Generic surface (elevated elements)
  surface: { light: 'neutral-50', dark: 'neutral-900' },
  'surface-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'surface-hover': { light: 'neutral-100', dark: 'neutral-800' },
  'surface-active': { light: 'neutral-200', dark: 'neutral-700' },
  'surface-border': { light: 'neutral-200', dark: 'neutral-800' },

  // ============================================================================
  // PRIMARY - Main brand/action color (shadcn compatible + extended)
  // ============================================================================
  primary: { light: 'neutral-900', dark: 'neutral-50' },
  'primary-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  'primary-hover': { light: 'neutral-800', dark: 'neutral-200' },
  'primary-hover-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  'primary-active': { light: 'neutral-700', dark: 'neutral-300' },
  'primary-active-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  'primary-focus': { light: 'neutral-900', dark: 'neutral-50' },
  'primary-border': { light: 'neutral-900', dark: 'neutral-50' },
  'primary-ring': { light: 'neutral-900', dark: 'neutral-50' },
  // Subtle variant for badges, alerts with tinted background
  'primary-subtle': { light: 'neutral-100', dark: 'neutral-900' },
  'primary-subtle-foreground': { light: 'neutral-900', dark: 'neutral-100' },

  // ============================================================================
  // SECONDARY - Alternative action color (shadcn compatible + extended)
  // ============================================================================
  secondary: { light: 'neutral-100', dark: 'neutral-800' },
  'secondary-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'secondary-hover': { light: 'neutral-200', dark: 'neutral-700' },
  'secondary-hover-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'secondary-active': { light: 'neutral-300', dark: 'neutral-600' },
  'secondary-active-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'secondary-focus': { light: 'neutral-100', dark: 'neutral-800' },
  'secondary-border': { light: 'neutral-300', dark: 'neutral-700' },
  'secondary-ring': { light: 'neutral-400', dark: 'neutral-500' },

  // ============================================================================
  // MUTED - Subdued elements (shadcn compatible + extended)
  // ============================================================================
  muted: { light: 'neutral-100', dark: 'neutral-800' },
  'muted-foreground': { light: 'neutral-500', dark: 'neutral-400' },
  'muted-hover': { light: 'neutral-200', dark: 'neutral-700' },
  'muted-hover-foreground': { light: 'neutral-600', dark: 'neutral-300' },
  'muted-active': { light: 'neutral-300', dark: 'neutral-600' },
  'muted-border': { light: 'neutral-200', dark: 'neutral-700' },

  // ============================================================================
  // ACCENT - Highlight/emphasis color (shadcn compatible + extended)
  // Using cyan/teal for visual distinction
  // ============================================================================
  accent: { light: 'neutral-100', dark: 'neutral-800' },
  'accent-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'accent-hover': { light: 'neutral-200', dark: 'neutral-700' },
  'accent-hover-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'accent-active': { light: 'neutral-300', dark: 'neutral-600' },
  'accent-active-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'accent-border': { light: 'neutral-300', dark: 'neutral-700' },
  'accent-ring': { light: 'neutral-400', dark: 'neutral-500' },

  // ============================================================================
  // DESTRUCTIVE - Error/danger actions (shadcn compatible + extended)
  // ============================================================================
  destructive: { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-500' },
  'destructive-foreground': { light: 'neutral-50', dark: 'neutral-50' },
  'destructive-hover': { light: 'silver-bold-fire-truck-700', dark: 'silver-bold-fire-truck-400' },
  'destructive-hover-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'destructive-active': { light: 'silver-bold-fire-truck-800', dark: 'silver-bold-fire-truck-300' },
  'destructive-active-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'destructive-focus': { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-500' },
  'destructive-border': { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-500' },
  'destructive-ring': { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-400' },
  // Subtle variant for error alerts, validation messages
  'destructive-subtle': { light: 'silver-bold-fire-truck-50', dark: 'silver-bold-fire-truck-950' },
  'destructive-subtle-foreground': {
    light: 'silver-bold-fire-truck-700',
    dark: 'silver-bold-fire-truck-300',
  },

  // ============================================================================
  // SUCCESS - Positive/confirmation states
  // ============================================================================
  success: { light: 'silver-true-citrine-600', dark: 'silver-true-citrine-500' },
  'success-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'success-hover': { light: 'silver-true-citrine-700', dark: 'silver-true-citrine-400' },
  'success-hover-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'success-active': { light: 'silver-true-citrine-800', dark: 'silver-true-citrine-300' },
  'success-active-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'success-focus': { light: 'silver-true-citrine-600', dark: 'silver-true-citrine-500' },
  'success-border': { light: 'silver-true-citrine-600', dark: 'silver-true-citrine-500' },
  'success-ring': { light: 'silver-true-citrine-600', dark: 'silver-true-citrine-400' },
  // Subtle variant for success alerts, validation messages
  'success-subtle': { light: 'silver-true-citrine-50', dark: 'silver-true-citrine-950' },
  'success-subtle-foreground': {
    light: 'silver-true-citrine-700',
    dark: 'silver-true-citrine-300',
  },

  // ============================================================================
  // WARNING - Caution states
  // ============================================================================
  warning: { light: 'silver-true-honey-500', dark: 'silver-true-honey-500' },
  'warning-foreground': { light: 'neutral-950', dark: 'neutral-950' },
  'warning-hover': { light: 'silver-true-honey-600', dark: 'silver-true-honey-400' },
  'warning-hover-foreground': { light: 'neutral-950', dark: 'neutral-950' },
  'warning-active': { light: 'silver-true-honey-700', dark: 'silver-true-honey-300' },
  'warning-active-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'warning-focus': { light: 'silver-true-honey-500', dark: 'silver-true-honey-500' },
  'warning-border': { light: 'silver-true-honey-500', dark: 'silver-true-honey-500' },
  'warning-ring': { light: 'silver-true-honey-600', dark: 'silver-true-honey-400' },
  // Subtle variant for warning alerts
  'warning-subtle': { light: 'silver-true-honey-50', dark: 'silver-true-honey-950' },
  'warning-subtle-foreground': { light: 'silver-true-honey-800', dark: 'silver-true-honey-200' },

  // ============================================================================
  // INFO - Informational states
  // ============================================================================
  info: { light: 'silver-true-sky-600', dark: 'silver-true-sky-500' },
  'info-foreground': { light: 'neutral-50', dark: 'neutral-50' },
  'info-hover': { light: 'silver-true-sky-700', dark: 'silver-true-sky-400' },
  'info-hover-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'info-active': { light: 'silver-true-sky-800', dark: 'silver-true-sky-300' },
  'info-active-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'info-focus': { light: 'silver-true-sky-600', dark: 'silver-true-sky-500' },
  'info-border': { light: 'silver-true-sky-600', dark: 'silver-true-sky-500' },
  'info-ring': { light: 'silver-true-sky-600', dark: 'silver-true-sky-400' },
  // Subtle variant for info alerts
  'info-subtle': { light: 'silver-true-sky-50', dark: 'silver-true-sky-950' },
  'info-subtle-foreground': { light: 'silver-true-sky-700', dark: 'silver-true-sky-300' },

  // ============================================================================
  // ALERT - Critical alerts (semantic alias for destructive in alert context)
  // ============================================================================
  alert: { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-500' },
  'alert-foreground': { light: 'neutral-50', dark: 'neutral-50' },
  'alert-hover': { light: 'silver-bold-fire-truck-700', dark: 'silver-bold-fire-truck-400' },
  'alert-hover-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'alert-active': { light: 'silver-bold-fire-truck-800', dark: 'silver-bold-fire-truck-300' },
  'alert-active-foreground': { light: 'neutral-50', dark: 'neutral-950' },
  'alert-border': { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-500' },
  'alert-ring': { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-400' },
  'alert-subtle': { light: 'silver-bold-fire-truck-50', dark: 'silver-bold-fire-truck-950' },
  'alert-subtle-foreground': {
    light: 'silver-bold-fire-truck-700',
    dark: 'silver-bold-fire-truck-300',
  },

  // ============================================================================
  // HIGHLIGHT - Text selection and emphasis (violet)
  // ============================================================================
  highlight: { light: 'silver-true-violet-200', dark: 'silver-true-violet-800' },
  'highlight-foreground': { light: 'silver-true-violet-900', dark: 'silver-true-violet-50' },
  'highlight-hover': { light: 'silver-true-violet-300', dark: 'silver-true-violet-700' },
  'highlight-hover-foreground': { light: 'silver-true-violet-900', dark: 'silver-true-violet-50' },
  'highlight-active': { light: 'silver-true-violet-400', dark: 'silver-true-violet-600' },
  'highlight-active-foreground': { light: 'silver-true-violet-950', dark: 'silver-true-violet-50' },

  // ============================================================================
  // BORDER TOKENS (shadcn compatible + extended)
  // ============================================================================
  border: { light: 'neutral-200', dark: 'neutral-800' },
  'border-hover': { light: 'neutral-300', dark: 'neutral-700' },
  'border-focus': { light: 'neutral-400', dark: 'neutral-600' },
  'border-active': { light: 'neutral-500', dark: 'neutral-500' },

  // ============================================================================
  // INPUT TOKENS (shadcn compatible + extended for form states)
  // ============================================================================
  input: { light: 'neutral-200', dark: 'neutral-800' },
  'input-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'input-hover': { light: 'neutral-300', dark: 'neutral-700' },
  'input-focus': { light: 'neutral-400', dark: 'neutral-600' },
  'input-disabled': { light: 'neutral-100', dark: 'neutral-900' },
  'input-disabled-foreground': { light: 'neutral-400', dark: 'neutral-600' },
  // Placeholder text (needs sufficient contrast for a11y)
  'input-placeholder': { light: 'neutral-500', dark: 'neutral-400' },
  // Validation states for inputs
  'input-invalid': { light: 'silver-bold-fire-truck-500', dark: 'silver-bold-fire-truck-500' },
  'input-invalid-foreground': {
    light: 'silver-bold-fire-truck-700',
    dark: 'silver-bold-fire-truck-300',
  },
  'input-valid': { light: 'silver-true-citrine-500', dark: 'silver-true-citrine-500' },
  'input-valid-foreground': { light: 'silver-true-citrine-700', dark: 'silver-true-citrine-300' },

  // ============================================================================
  // RING/FOCUS TOKENS (shadcn compatible + extended for a11y)
  // Focus rings need 3:1 contrast against adjacent colors
  // ============================================================================
  ring: { light: 'neutral-950', dark: 'neutral-300' },
  'ring-offset': { light: 'neutral-50', dark: 'neutral-950' },
  // Semantic ring colors for different contexts
  'ring-primary': { light: 'neutral-900', dark: 'neutral-50' },
  'ring-destructive': { light: 'silver-bold-fire-truck-600', dark: 'silver-bold-fire-truck-400' },
  'ring-success': { light: 'silver-true-citrine-600', dark: 'silver-true-citrine-400' },
  'ring-warning': { light: 'silver-true-honey-600', dark: 'silver-true-honey-400' },
  'ring-info': { light: 'silver-true-sky-600', dark: 'silver-true-sky-400' },

  // ============================================================================
  // LINK TOKENS (for accessible link styling)
  // Links need to be distinguishable from surrounding text
  // ============================================================================
  link: { light: 'silver-true-sky-700', dark: 'silver-true-sky-400' },
  'link-hover': { light: 'silver-true-sky-800', dark: 'silver-true-sky-300' },
  'link-active': { light: 'silver-true-sky-900', dark: 'silver-true-sky-200' },
  'link-visited': { light: 'silver-true-violet-700', dark: 'silver-true-violet-400' },
  'link-focus': { light: 'silver-true-sky-700', dark: 'silver-true-sky-400' },

  // ============================================================================
  // SELECTION TOKENS (for text selection styling)
  // ============================================================================
  selection: { light: 'silver-true-sky-200', dark: 'silver-true-sky-800' },
  'selection-foreground': { light: 'neutral-950', dark: 'neutral-50' },

  // ============================================================================
  // SIDEBAR TOKENS (shadcn compatible + extended for full a11y)
  // ============================================================================
  sidebar: { light: 'neutral-50', dark: 'neutral-950' },
  'sidebar-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'sidebar-muted': { light: 'neutral-500', dark: 'neutral-400' },

  // Sidebar primary action
  'sidebar-primary': { light: 'neutral-900', dark: 'neutral-50' },
  'sidebar-primary-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  'sidebar-primary-hover': { light: 'neutral-800', dark: 'neutral-200' },
  'sidebar-primary-active': { light: 'neutral-700', dark: 'neutral-300' },

  // Sidebar accent (hover/selected items)
  'sidebar-accent': { light: 'neutral-100', dark: 'neutral-800' },
  'sidebar-accent-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'sidebar-accent-hover': { light: 'neutral-200', dark: 'neutral-700' },
  'sidebar-accent-active': { light: 'neutral-300', dark: 'neutral-600' },

  // Sidebar item states
  'sidebar-item': { light: 'neutral-50', dark: 'neutral-950' },
  'sidebar-item-foreground': { light: 'neutral-700', dark: 'neutral-300' },
  'sidebar-item-hover': { light: 'neutral-100', dark: 'neutral-900' },
  'sidebar-item-hover-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'sidebar-item-active': { light: 'neutral-200', dark: 'neutral-800' },
  'sidebar-item-active-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'sidebar-item-selected': { light: 'neutral-100', dark: 'neutral-800' },
  'sidebar-item-selected-foreground': { light: 'neutral-950', dark: 'neutral-50' },

  // Sidebar borders and focus
  'sidebar-border': { light: 'neutral-200', dark: 'neutral-800' },
  'sidebar-ring': { light: 'neutral-950', dark: 'neutral-300' },

  // ============================================================================
  // NAVIGATION TOKENS (for navbars, breadcrumbs, tabs)
  // ============================================================================
  nav: { light: 'neutral-50', dark: 'neutral-950' },
  'nav-foreground': { light: 'neutral-700', dark: 'neutral-300' },
  'nav-hover': { light: 'neutral-100', dark: 'neutral-900' },
  'nav-hover-foreground': { light: 'neutral-900', dark: 'neutral-50' },
  'nav-active': { light: 'neutral-200', dark: 'neutral-800' },
  'nav-active-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'nav-selected': { light: 'neutral-900', dark: 'neutral-50' },
  'nav-selected-foreground': { light: 'neutral-50', dark: 'neutral-900' },
  'nav-disabled': { light: 'neutral-200', dark: 'neutral-800' },
  'nav-disabled-foreground': { light: 'neutral-400', dark: 'neutral-600' },

  // ============================================================================
  // TABLE TOKENS (for data tables with row states)
  // ============================================================================
  table: { light: 'neutral-50', dark: 'neutral-950' },
  'table-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'table-header': { light: 'neutral-100', dark: 'neutral-900' },
  'table-header-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'table-row-hover': { light: 'neutral-50', dark: 'neutral-900' },
  'table-row-selected': { light: 'neutral-100', dark: 'neutral-800' },
  'table-row-selected-foreground': { light: 'neutral-950', dark: 'neutral-50' },
  'table-border': { light: 'neutral-200', dark: 'neutral-800' },

  // ============================================================================
  // TOOLTIP TOKENS
  // ============================================================================
  tooltip: { light: 'neutral-900', dark: 'neutral-50' },
  'tooltip-foreground': { light: 'neutral-50', dark: 'neutral-900' },

  // ============================================================================
  // OVERLAY TOKENS (for modals, dialogs, sheets)
  // ============================================================================
  overlay: { light: 'neutral-950', dark: 'neutral-950' },
  'overlay-foreground': { light: 'neutral-50', dark: 'neutral-50' },

  // ============================================================================
  // SKELETON/LOADING TOKENS
  // ============================================================================
  skeleton: { light: 'neutral-200', dark: 'neutral-800' },
  'skeleton-highlight': { light: 'neutral-300', dark: 'neutral-700' },

  // ============================================================================
  // CHART TOKENS (shadcn compatible - 5 chart colors)
  // ============================================================================
  'chart-1': { light: 'silver-true-glacier-500', dark: 'silver-true-glacier-400' },
  'chart-2': { light: 'silver-true-sky-500', dark: 'silver-true-sky-400' },
  'chart-3': { light: 'silver-true-citrine-500', dark: 'silver-true-citrine-400' },
  'chart-4': { light: 'silver-true-honey-500', dark: 'silver-true-honey-400' },
  'chart-5': { light: 'silver-true-violet-500', dark: 'silver-true-violet-400' },

  // ============================================================================
  // SCROLLBAR TOKENS (for custom scrollbar styling)
  // ============================================================================
  scrollbar: { light: 'neutral-300', dark: 'neutral-700' },
  'scrollbar-hover': { light: 'neutral-400', dark: 'neutral-600' },
  'scrollbar-track': { light: 'neutral-100', dark: 'neutral-900' },

  // ============================================================================
  // CODE/SYNTAX TOKENS (for code blocks, inline code)
  // ============================================================================
  code: { light: 'neutral-100', dark: 'neutral-900' },
  'code-foreground': { light: 'neutral-900', dark: 'neutral-100' },
  'code-border': { light: 'neutral-200', dark: 'neutral-800' },

  // ============================================================================
  // BADGE TOKENS (for status badges, labels)
  // ============================================================================
  badge: { light: 'neutral-100', dark: 'neutral-800' },
  'badge-foreground': { light: 'neutral-900', dark: 'neutral-100' },
  'badge-border': { light: 'neutral-200', dark: 'neutral-700' },

  // ============================================================================
  // AVATAR TOKENS
  // ============================================================================
  avatar: { light: 'neutral-200', dark: 'neutral-800' },
  'avatar-foreground': { light: 'neutral-600', dark: 'neutral-400' },
};

/**
 * Convert a token value to CSS string
 */
function tokenValueToCSS(token: Token): string {
  const { value } = token;

  // String values pass through
  if (typeof value === 'string') {
    return value;
  }

  // ColorValue - convert OKLCH to CSS
  if (typeof value === 'object' && value !== null) {
    if ('scale' in value) {
      const colorValue = value as ColorValue;
      // Return OKLCH string for the base color (position 500 = index 5)
      const baseColor = colorValue.scale[5];
      if (baseColor) {
        return `oklch(${formatNumber(baseColor.l)} ${formatNumber(baseColor.c)} ${formatNumber(baseColor.h)})`;
      }
    }
    // ColorReference - return as var() reference
    if ('family' in value && 'position' in value) {
      const ref = value as ColorReference;
      return `var(--color-${ref.family}-${ref.position})`;
    }
  }

  return String(value);
}

/**
 * Format a number for CSS output
 */
function formatNumber(value: number, decimals = 3): string {
  return Number(value.toFixed(decimals)).toString();
}

/**
 * Group tokens by namespace
 */
function groupTokens(tokens: Token[]): GroupedTokens {
  const groups: GroupedTokens = {
    semantic: [],
    color: [],
    spacing: [],
    typography: [],
    radius: [],
    shadow: [],
    depth: [],
    motion: [],
    breakpoint: [],
    elevation: [],
    focus: [],
    other: [],
  };

  for (const token of tokens) {
    switch (token.namespace) {
      case 'semantic':
        groups.semantic.push(token);
        break;
      case 'color':
        groups.color.push(token);
        break;
      case 'spacing':
        groups.spacing.push(token);
        break;
      case 'typography':
        groups.typography.push(token);
        break;
      case 'radius':
        groups.radius.push(token);
        break;
      case 'shadow':
        groups.shadow.push(token);
        break;
      case 'depth':
        groups.depth.push(token);
        break;
      case 'motion':
        groups.motion.push(token);
        break;
      case 'breakpoint':
        groups.breakpoint.push(token);
        break;
      case 'elevation':
        groups.elevation.push(token);
        break;
      case 'focus':
        groups.focus.push(token);
        break;
      default:
        groups.other.push(token);
    }
  }

  return groups;
}

/**
 * Generate :root block with --rafters-* namespace and dark mode via media query
 */
function generateRootBlock(): string {
  const lines: string[] = [];
  lines.push(':root {');

  // Light mode --rafters-* tokens
  for (const [name, mapping] of Object.entries(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --rafters-${name}: var(--color-${mapping.light});`);
  }

  lines.push('');

  // Dark mode --rafters-dark-* tokens
  for (const [name, mapping] of Object.entries(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --rafters-dark-${name}: var(--color-${mapping.dark});`);
  }

  lines.push('');

  // Semantic tokens default to light mode
  for (const name of Object.keys(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --${name}: var(--rafters-${name});`);
  }

  lines.push('');

  // Dark mode override via prefers-color-scheme
  lines.push('  @media (prefers-color-scheme: dark) {');
  for (const name of Object.keys(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`    --${name}: var(--rafters-dark-${name});`);
  }
  lines.push('  }');

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate @theme block with raw color scales and utility tokens
 */
function generateThemeBlock(groups: GroupedTokens): string {
  const lines: string[] = [];
  lines.push('@theme {');

  // Color scales with --color- prefix
  if (groups.color.length > 0) {
    for (const token of groups.color) {
      const value = tokenValueToCSS(token);
      lines.push(`  --color-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Semantic color bridges (reference :root variables)
  for (const name of Object.keys(RAFTERS_SEMANTIC_MAPPINGS)) {
    lines.push(`  --color-${name}: var(--${name});`);
  }
  lines.push('');

  // Spacing tokens
  if (groups.spacing.length > 0) {
    for (const token of groups.spacing) {
      const value = tokenValueToCSS(token);
      lines.push(`  --spacing-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Typography tokens
  if (groups.typography.length > 0) {
    for (const token of groups.typography) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
      if (token.lineHeight) {
        lines.push(`  --${token.name}--line-height: ${token.lineHeight};`);
      }
    }
    lines.push('');
  }

  // Radius tokens
  if (groups.radius.length > 0) {
    for (const token of groups.radius) {
      const value = tokenValueToCSS(token);
      lines.push(`  --radius-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Shadow tokens
  if (groups.shadow.length > 0) {
    for (const token of groups.shadow) {
      const value = tokenValueToCSS(token);
      lines.push(`  --shadow-${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Depth (z-index) tokens
  if (groups.depth.length > 0) {
    for (const token of groups.depth) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Motion tokens
  if (groups.motion.length > 0) {
    for (const token of groups.motion) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Breakpoint tokens
  if (groups.breakpoint.length > 0) {
    for (const token of groups.breakpoint) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Elevation tokens
  if (groups.elevation.length > 0) {
    for (const token of groups.elevation) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Focus tokens
  if (groups.focus.length > 0) {
    for (const token of groups.focus) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
    lines.push('');
  }

  // Other tokens
  if (groups.other.length > 0) {
    for (const token of groups.other) {
      const value = tokenValueToCSS(token);
      lines.push(`  --${token.name}: ${value};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Export tokens to Tailwind v4 CSS format
 *
 * @param tokens - Array of tokens to export
 * @param options - Export options
 * @returns Tailwind v4 compatible CSS string
 *
 * @example
 * ```typescript
 * import { generateBaseSystem } from '@rafters/design-tokens';
 * import { tokensToTailwind } from '@rafters/design-tokens/exporters';
 *
 * const result = generateBaseSystem();
 * const css = tokensToTailwind(result.allTokens);
 *
 * // Write to file
 * fs.writeFileSync('theme.css', css);
 * ```
 */
export function tokensToTailwind(tokens: Token[], options: TailwindExportOptions = {}): string {
  const { includeImport = true } = options;

  if (tokens.length === 0) {
    throw new Error('Registry is empty');
  }

  const groups = groupTokens(tokens);
  const sections: string[] = [];

  // Tailwind import
  if (includeImport) {
    sections.push('@import "tailwindcss";');
    sections.push('');
  }

  // @theme block with raw color scales and utility tokens
  const themeBlock = generateThemeBlock(groups);
  sections.push(themeBlock);
  sections.push('');

  // :root block with --rafters-* namespace and dark mode
  const rootBlock = generateRootBlock();
  sections.push(rootBlock);

  return sections.join('\n');
}

/**
 * Export registry tokens to Tailwind v4 CSS format
 *
 * This is the interface required by issue #392.
 *
 * @param registry - TokenRegistry containing tokens
 * @param options - Export options
 * @returns Tailwind v4 compatible CSS string
 *
 * @example
 * ```typescript
 * import { TokenRegistry } from '@rafters/design-tokens';
 * import { registryToTailwind } from '@rafters/design-tokens/exporters';
 *
 * const registry = new TokenRegistry(tokens);
 * const css = registryToTailwind(registry);
 *
 * await writeFile('.rafters/output/theme.css', css);
 * ```
 */
export function registryToTailwind(
  registry: TokenRegistry,
  options?: TailwindExportOptions,
): string {
  const tokens = registry.list();
  return tokensToTailwind(tokens, options);
}
