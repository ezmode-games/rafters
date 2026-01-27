/**
 * Studio Types
 *
 * Core type definitions for the visual decision recorder.
 */

/**
 * The 6 visual namespaces shown as sidebar circles.
 * These are the designer-facing categories.
 */
export type VisualNamespace = 'color' | 'spacing' | 'typography' | 'radius' | 'depth' | 'motion';

/**
 * All token namespace categories (includes system namespaces not in sidebar).
 */
export type TokenNamespace =
  | 'color'
  | 'spacing'
  | 'typography'
  | 'radius'
  | 'shadow'
  | 'motion'
  | 'breakpoint'
  | 'elevation'
  | 'semantic';

/**
 * The 6 sidebar circles with display metadata.
 */
export interface NamespaceCircle {
  id: VisualNamespace;
  label: string;
  icon: string;
}

export const SIDEBAR_NAMESPACES: NamespaceCircle[] = [
  { id: 'color', label: 'Color', icon: 'Palette' },
  { id: 'spacing', label: 'Spacing', icon: 'Space' },
  { id: 'typography', label: 'Typography', icon: 'Type' },
  { id: 'radius', label: 'Radius', icon: 'Circle' },
  { id: 'depth', label: 'Depth', icon: 'Layers' },
  { id: 'motion', label: 'Motion', icon: 'Zap' },
];

/**
 * Studio application phases.
 */
export type StudioPhase = 'loading' | 'first-run' | 'workspace';

/**
 * First-run sub-phases for the orchestrator state machine.
 */
export type FirstRunPhase =
  | 'snowstorm'
  | 'picking'
  | 'reasoning'
  | 'painting'
  | 'semantics'
  | 'complete';

/**
 * Semantic color intents that designers pick during first run.
 */
export const SEMANTIC_INTENTS = [
  'destructive',
  'success',
  'warning',
  'info',
  'secondary',
  'muted',
  'accent',
  'background',
  'foreground',
] as const;

export type SemanticIntent = (typeof SEMANTIC_INTENTS)[number];
