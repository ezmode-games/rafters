/**
 * Intelligence metadata parsed from component JSDoc
 */
export interface ParsedIntelligence {
  cognitiveLoad: {
    score: number;
    description: string;
  };
  attentionEconomics: string;
  trustBuilding: string;
  accessibility: string;
  semanticMeaning: string;
  usagePatterns: {
    dos: string[];
    nevers: string[];
  };
  example: string;
}

/**
 * Complete component metadata including intelligence
 */
export interface ComponentMetadata {
  name: string;
  displayName: string;
  description: string;
  category: ComponentCategory;
  intelligence: ParsedIntelligence;
  variants: string[];
  sizes: string[];
  dependencies: string[];
  filePath: string;
}

/**
 * Component categories for organization
 */
export type ComponentCategory =
  | 'layout'
  | 'form'
  | 'feedback'
  | 'navigation'
  | 'overlay'
  | 'data-display'
  | 'utility';

/**
 * Category metadata for display
 */
export interface CategoryInfo {
  name: string;
  label: string;
  description: string;
  order: number;
}

/**
 * Categories with display info
 */
export const CATEGORIES: Record<ComponentCategory, CategoryInfo> = {
  layout: {
    name: 'layout',
    label: 'Layout',
    description: 'Components for structuring and organizing content',
    order: 1,
  },
  form: {
    name: 'form',
    label: 'Form',
    description: 'Input controls and form elements',
    order: 2,
  },
  feedback: {
    name: 'feedback',
    label: 'Feedback',
    description: 'Status indicators and user feedback',
    order: 3,
  },
  navigation: {
    name: 'navigation',
    label: 'Navigation',
    description: 'Wayfinding and navigation components',
    order: 4,
  },
  overlay: {
    name: 'overlay',
    label: 'Overlay',
    description: 'Modals, dialogs, and overlay components',
    order: 5,
  },
  'data-display': {
    name: 'data-display',
    label: 'Data Display',
    description: 'Components for displaying data and content',
    order: 6,
  },
  utility: {
    name: 'utility',
    label: 'Utility',
    description: 'Helper and utility components',
    order: 7,
  },
};

/**
 * Map component names to categories
 */
export const COMPONENT_CATEGORIES: Record<string, ComponentCategory> = {
  // Layout
  card: 'layout',
  'aspect-ratio': 'layout',
  separator: 'layout',
  'scroll-area': 'layout',
  sidebar: 'layout',
  container: 'layout',
  resizable: 'layout',

  // Form
  button: 'form',
  'button-group': 'form',
  input: 'form',
  'input-group': 'form',
  'input-otp': 'form',
  textarea: 'form',
  select: 'form',
  checkbox: 'form',
  'radio-group': 'form',
  switch: 'form',
  slider: 'form',
  toggle: 'form',
  'toggle-group': 'form',
  label: 'form',
  field: 'form',
  combobox: 'form',
  'date-picker': 'form',
  calendar: 'form',
  form: 'form',

  // Feedback
  alert: 'feedback',
  badge: 'feedback',
  progress: 'feedback',
  skeleton: 'feedback',
  spinner: 'feedback',
  toast: 'feedback',
  sonner: 'feedback',

  // Navigation
  tabs: 'navigation',
  breadcrumb: 'navigation',
  pagination: 'navigation',
  'navigation-menu': 'navigation',
  menubar: 'navigation',

  // Overlay
  dialog: 'overlay',
  'alert-dialog': 'overlay',
  sheet: 'overlay',
  drawer: 'overlay',
  popover: 'overlay',
  tooltip: 'overlay',
  'hover-card': 'overlay',
  'dropdown-menu': 'overlay',
  'context-menu': 'overlay',
  command: 'overlay',

  // Data Display
  table: 'data-display',
  avatar: 'data-display',
  accordion: 'data-display',
  collapsible: 'data-display',
  carousel: 'data-display',
  typography: 'data-display',
  item: 'data-display',
  empty: 'data-display',

  // Utility
  kbd: 'utility',
};
