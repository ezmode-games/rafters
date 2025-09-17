/**
 * @rafters/shared
 *
 * Shared types, schemas, and utilities for the Rafters AI design intelligence system.
 * This package provides the foundational types that AI agents use to understand
 * and reason about design systems.
 */

// Export all types and schemas
export * from './types.js';

// Utility functions for AI intelligence
export const DEFAULT_COGNITIVE_LOADS = {
  simple: 1, // Basic elements like dividers, spacers
  moderate: 2, // Simple interactive elements like buttons
  complex: 3, // Form elements, basic patterns
  challenging: 4, // Complex patterns like modals, multi-step forms
  expert: 5, // Advanced patterns like data tables, complex workflows
} as const;

// Semantic token categories for AI understanding
export const SEMANTIC_CATEGORIES = {
  // Color semantics
  primary: 'Main brand color for primary actions',
  secondary: 'Supporting brand color for secondary actions',
  accent: 'Highlight color for emphasis and CTAs',
  success: 'Positive feedback and confirmation states',
  warning: 'Cautionary feedback and attention states',
  danger: 'Error states and destructive actions',
  info: 'Informational content and neutral states',

  // Typography semantics
  display: 'Hero headings and marketing content',
  heading: 'Page and section titles',
  body: 'Main content and reading text',
  caption: 'Supporting text and metadata',

  // Spacing semantics
  xs: 'Minimal spacing for tight layouts',
  sm: 'Compact spacing for dense interfaces',
  md: 'Standard spacing for balanced layouts',
  lg: 'Generous spacing for breathing room',
  xl: 'Maximum spacing for emphasis',
} as const;

// AI-readable component patterns
export const AI_COMPONENT_PATTERNS = {
  // Attention hierarchy
  PRIMARY_ACTION: 'Use for main user goals - single per page/section',
  SECONDARY_ACTION: 'Use for alternative actions - multiple allowed',
  TERTIARY_ACTION: 'Use for minor actions - unlimited',

  // Safety constraints
  DESTRUCTIVE_CONFIRMATION: 'Destructive actions require confirmation UX',
  PROGRESSIVE_DISCLOSURE: 'Complex forms need step-by-step revelation',
  ESCAPE_HATCH: 'Always provide way to cancel/go back',

  // Accessibility patterns
  MINIMUM_TOUCH_TARGET: '44px minimum for touch interfaces',
  COLOR_NOT_ONLY: 'Never rely on color alone for meaning',
  FOCUS_VISIBLE: 'Clear focus indicators for keyboard navigation',
} as const;

export const ASCII_LOGO = `
██████   █████  ███████ ████████ ███████ ██████  ███████
██   ██ ██   ██ ██         ██    ██      ██   ██ ██
██████  ███████ █████      ██    █████   ██████  ███████
██   ██ ██   ██ ██         ██    ██      ██   ██      ██
██   ██ ██   ██ ██         ██    ███████ ██   ██ ███████
`;

// Export React components from separate file
export * from './components';
