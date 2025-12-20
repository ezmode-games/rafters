/**
 * Semantic Color Generator
 *
 * Generates semantic color tokens that reference the neutral color family.
 * Includes: primary, secondary, destructive, success, warning, info, highlight,
 * sidebar tokens, and chart colors.
 *
 * Uses ColorReference to point to color families + positions, allowing
 * the underlying colors to change while semantic meaning stays consistent.
 */

import type { ColorReference, Token } from '@rafters/shared';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';

/**
 * Semantic color definitions
 * Maps semantic names to their neutral scale positions for light mode
 *
 * These follow shadcn's default theme structure using the neutral scale
 */
interface SemanticColorDef {
  /** Reference to color family and position */
  ref: ColorReference;
  /** Semantic meaning for MCP */
  meaning: string;
  /** Usage contexts */
  contexts: string[];
  /** Do patterns */
  do: string[];
  /** Never patterns */
  never: string[];
  /** Trust level for this color */
  trustLevel?: 'low' | 'medium' | 'high' | 'critical';
  /** Consequence of actions using this color */
  consequence?: 'reversible' | 'significant' | 'permanent' | 'destructive';
}

/**
 * Core semantic color mappings based on shadcn defaults
 */
const SEMANTIC_COLORS: Record<string, SemanticColorDef> = {
  // Backgrounds and surfaces
  background: {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Primary page background color',
    contexts: ['page-bg', 'app-background'],
    do: ['Use for main page background'],
    never: ['Use for interactive elements'],
  },
  foreground: {
    ref: { family: 'neutral', position: '950' },
    meaning: 'Primary text color',
    contexts: ['body-text', 'headings', 'primary-content'],
    do: ['Use for main text content', 'Use for headings'],
    never: ['Use on dark backgrounds without checking contrast'],
  },

  // Card surfaces
  card: {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Card and contained surface background',
    contexts: ['cards', 'modals', 'dialogs', 'panels'],
    do: ['Use for elevated surfaces'],
    never: ['Use for page-level backgrounds'],
  },
  'card-foreground': {
    ref: { family: 'neutral', position: '950' },
    meaning: 'Text on card surfaces',
    contexts: ['card-text', 'modal-text'],
    do: ['Use for text within cards'],
    never: ['Use without card background'],
  },

  // Popover surfaces
  popover: {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Popover and dropdown background',
    contexts: ['dropdowns', 'tooltips', 'menus'],
    do: ['Use for floating elements'],
    never: ['Use for static content'],
  },
  'popover-foreground': {
    ref: { family: 'neutral', position: '950' },
    meaning: 'Text in popovers',
    contexts: ['dropdown-text', 'menu-text'],
    do: ['Use for popover content'],
    never: ['Use outside floating elements'],
  },

  // Primary action color (neutral-based for shadcn default)
  primary: {
    ref: { family: 'neutral', position: '900' },
    meaning: 'Primary interactive elements - buttons, links, focus states',
    contexts: ['primary-buttons', 'links', 'active-states'],
    do: ['Use for main CTA buttons', 'Use for primary links'],
    never: ['Use multiple primary buttons competing', 'Use for destructive actions'],
    trustLevel: 'high',
    consequence: 'reversible',
  },
  'primary-foreground': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Text on primary color backgrounds',
    contexts: ['button-text', 'primary-action-text'],
    do: ['Use for text on primary buttons'],
    never: ['Use without primary background'],
  },

  // Secondary action color
  secondary: {
    ref: { family: 'neutral', position: '100' },
    meaning: 'Secondary interactive elements - less prominent actions',
    contexts: ['secondary-buttons', 'alternative-actions'],
    do: ['Use for secondary actions', 'Use when primary is too strong'],
    never: ['Use for primary CTAs'],
    trustLevel: 'medium',
    consequence: 'reversible',
  },
  'secondary-foreground': {
    ref: { family: 'neutral', position: '900' },
    meaning: 'Text on secondary color backgrounds',
    contexts: ['secondary-button-text'],
    do: ['Use for text on secondary buttons'],
    never: ['Use without secondary background'],
  },

  // Muted/subtle elements
  muted: {
    ref: { family: 'neutral', position: '100' },
    meaning: 'Muted backgrounds for subtle emphasis',
    contexts: ['subtle-backgrounds', 'inactive-tabs', 'disabled-areas'],
    do: ['Use for subtle background differentiation'],
    never: ['Use for interactive elements needing visibility'],
  },
  'muted-foreground': {
    ref: { family: 'neutral', position: '500' },
    meaning: 'Muted text for secondary information',
    contexts: ['helper-text', 'placeholders', 'metadata'],
    do: ['Use for secondary text', 'Use for placeholders'],
    never: ['Use for primary content', 'Use for important information'],
  },

  // Accent color
  accent: {
    ref: { family: 'neutral', position: '100' },
    meaning: 'Accent for hover states and highlights',
    contexts: ['hover-states', 'selected-items', 'focus-backgrounds'],
    do: ['Use for hover backgrounds', 'Use for selected states'],
    never: ['Use for primary actions'],
  },
  'accent-foreground': {
    ref: { family: 'neutral', position: '900' },
    meaning: 'Text on accent backgrounds',
    contexts: ['hover-text', 'selected-text'],
    do: ['Use for text on accent backgrounds'],
    never: ['Use without accent background'],
  },

  // Destructive/danger
  destructive: {
    ref: { family: 'neutral', position: '900' }, // Will be overridden with red in actual themes
    meaning: 'Destructive actions - delete, remove, critical warnings',
    contexts: ['delete-buttons', 'error-states', 'critical-alerts'],
    do: ['Use for irreversible actions', 'Always require confirmation'],
    never: ['Use for non-destructive actions', 'Use without clear consequence communication'],
    trustLevel: 'critical',
    consequence: 'destructive',
  },
  'destructive-foreground': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Text on destructive backgrounds',
    contexts: ['delete-button-text', 'error-message-text'],
    do: ['Use for text on destructive buttons'],
    never: ['Use without destructive background'],
  },

  // Success state
  success: {
    ref: { family: 'neutral', position: '900' }, // Will be overridden with green in actual themes
    meaning: 'Success states - confirmations, completions, positive feedback',
    contexts: ['success-messages', 'completion-states', 'valid-inputs'],
    do: ['Use for positive feedback', 'Use for completion confirmation'],
    never: ['Use for neutral information', 'Use for warnings'],
    trustLevel: 'high',
    consequence: 'reversible',
  },
  'success-foreground': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Text on success backgrounds',
    contexts: ['success-message-text'],
    do: ['Use for text on success backgrounds'],
    never: ['Use without success background'],
  },

  // Warning state
  warning: {
    ref: { family: 'neutral', position: '900' }, // Will be overridden with amber/yellow in actual themes
    meaning: 'Warning states - caution, potential issues, important notices',
    contexts: ['warning-messages', 'caution-alerts', 'validation-warnings'],
    do: ['Use for cautionary information', 'Use for potential issues'],
    never: ['Use for critical errors', 'Use for success states'],
    trustLevel: 'medium',
    consequence: 'significant',
  },
  'warning-foreground': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Text on warning backgrounds',
    contexts: ['warning-message-text'],
    do: ['Use for text on warning backgrounds'],
    never: ['Use without warning background'],
  },

  // Info state
  info: {
    ref: { family: 'neutral', position: '900' }, // Will be overridden with blue in actual themes
    meaning: 'Informational states - tips, help, neutral information',
    contexts: ['info-messages', 'tooltips', 'help-text'],
    do: ['Use for helpful information', 'Use for tips and guidance'],
    never: ['Use for warnings or errors'],
    trustLevel: 'low',
    consequence: 'reversible',
  },
  'info-foreground': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Text on info backgrounds',
    contexts: ['info-message-text'],
    do: ['Use for text on info backgrounds'],
    never: ['Use without info background'],
  },

  // Highlight
  highlight: {
    ref: { family: 'neutral', position: '200' },
    meaning: 'Highlight for search results, selected text, emphasis',
    contexts: ['search-highlights', 'text-selection', 'emphasis'],
    do: ['Use for temporary highlights', 'Use for search result matches'],
    never: ['Use for permanent styling', 'Use for interactive elements'],
  },
  'highlight-foreground': {
    ref: { family: 'neutral', position: '900' },
    meaning: 'Text on highlight backgrounds',
    contexts: ['highlighted-text'],
    do: ['Use for text that is highlighted'],
    never: ['Use without highlight background'],
  },

  // Border and input
  border: {
    ref: { family: 'neutral', position: '200' },
    meaning: 'Default border color',
    contexts: ['dividers', 'separators', 'input-borders'],
    do: ['Use for subtle borders', 'Use for dividers'],
    never: ['Use for emphasized borders'],
  },
  input: {
    ref: { family: 'neutral', position: '200' },
    meaning: 'Input field border color',
    contexts: ['form-inputs', 'text-fields', 'selects'],
    do: ['Use for form field borders'],
    never: ['Use for buttons'],
  },
  ring: {
    ref: { family: 'neutral', position: '950' },
    meaning: 'Focus ring color',
    contexts: ['focus-states', 'keyboard-navigation'],
    do: ['Use for focus indicators', 'Ensure high contrast'],
    never: ['Use for decorative elements'],
  },

  // Sidebar tokens
  'sidebar-background': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Sidebar background color',
    contexts: ['navigation-sidebar', 'side-panels'],
    do: ['Use for sidebar backgrounds'],
    never: ['Use for main content areas'],
  },
  'sidebar-foreground': {
    ref: { family: 'neutral', position: '950' },
    meaning: 'Sidebar text color',
    contexts: ['sidebar-text', 'nav-items'],
    do: ['Use for sidebar content'],
    never: ['Use outside sidebar context'],
  },
  'sidebar-primary': {
    ref: { family: 'neutral', position: '900' },
    meaning: 'Sidebar primary accent',
    contexts: ['active-nav-item', 'selected-sidebar-item'],
    do: ['Use for active sidebar items'],
    never: ['Use for inactive items'],
  },
  'sidebar-primary-foreground': {
    ref: { family: 'neutral', position: '50' },
    meaning: 'Text on sidebar primary',
    contexts: ['active-nav-text'],
    do: ['Use for active nav item text'],
    never: ['Use without sidebar-primary background'],
  },
  'sidebar-accent': {
    ref: { family: 'neutral', position: '100' },
    meaning: 'Sidebar hover/accent state',
    contexts: ['sidebar-hover', 'sidebar-selected'],
    do: ['Use for sidebar hover states'],
    never: ['Use for active state'],
  },
  'sidebar-accent-foreground': {
    ref: { family: 'neutral', position: '900' },
    meaning: 'Text on sidebar accent',
    contexts: ['sidebar-hover-text'],
    do: ['Use for hovered sidebar text'],
    never: ['Use without sidebar-accent background'],
  },
  'sidebar-border': {
    ref: { family: 'neutral', position: '200' },
    meaning: 'Sidebar border/divider color',
    contexts: ['sidebar-dividers', 'nav-section-borders'],
    do: ['Use for sidebar dividers'],
    never: ['Use for main content borders'],
  },
  'sidebar-ring': {
    ref: { family: 'neutral', position: '950' },
    meaning: 'Sidebar focus ring',
    contexts: ['sidebar-focus-states'],
    do: ['Use for sidebar focus indicators'],
    never: ['Use outside sidebar'],
  },

  // Chart colors (using neutral positions, will be overridden with actual colors)
  'chart-1': {
    ref: { family: 'neutral', position: '700' },
    meaning: 'Primary chart color',
    contexts: ['charts', 'data-viz', 'primary-series'],
    do: ['Use for primary data series'],
    never: ['Use more than 5 chart colors'],
  },
  'chart-2': {
    ref: { family: 'neutral', position: '600' },
    meaning: 'Secondary chart color',
    contexts: ['charts', 'data-viz', 'secondary-series'],
    do: ['Use for secondary data series'],
    never: ['Use without chart-1'],
  },
  'chart-3': {
    ref: { family: 'neutral', position: '500' },
    meaning: 'Tertiary chart color',
    contexts: ['charts', 'data-viz', 'tertiary-series'],
    do: ['Use for tertiary data series'],
    never: ['Use as primary color'],
  },
  'chart-4': {
    ref: { family: 'neutral', position: '400' },
    meaning: 'Quaternary chart color',
    contexts: ['charts', 'data-viz', 'quaternary-series'],
    do: ['Use for quaternary data series'],
    never: ['Use without considering accessibility'],
  },
  'chart-5': {
    ref: { family: 'neutral', position: '300' },
    meaning: 'Quinary chart color',
    contexts: ['charts', 'data-viz', 'quinary-series'],
    do: ['Use for fifth data series'],
    never: ['Add more series without redesigning palette'],
  },
};

/**
 * Generate semantic color tokens
 */
export function generateSemanticTokens(_config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();

  for (const [name, def] of Object.entries(SEMANTIC_COLORS)) {
    tokens.push({
      name,
      value: def.ref,
      category: 'color',
      namespace: 'semantic',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      trustLevel: def.trustLevel,
      consequence: def.consequence,
      dependsOn: [`${def.ref.family}-${def.ref.position}`],
      description: `${def.meaning}. References ${def.ref.family}-${def.ref.position}.`,
      generatedAt: timestamp,
      containerQueryAware: true,
      usagePatterns: {
        do: def.do,
        never: def.never,
      },
      requiresConfirmation: def.consequence === 'destructive' || def.consequence === 'permanent',
    });
  }

  return {
    namespace: 'semantic',
    tokens,
  };
}
