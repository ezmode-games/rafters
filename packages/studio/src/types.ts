/**
 * Token namespace categories
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
 * Namespace display metadata
 */
export interface NamespaceInfo {
  id: TokenNamespace;
  label: string;
  icon: string;
}

export const NAMESPACES: NamespaceInfo[] = [
  { id: 'color', label: 'Colors', icon: 'palette' },
  { id: 'spacing', label: 'Spacing', icon: 'ruler' },
  { id: 'typography', label: 'Typography', icon: 'type' },
  { id: 'radius', label: 'Radius', icon: 'circle' },
  { id: 'shadow', label: 'Shadows', icon: 'layers' },
  { id: 'motion', label: 'Motion', icon: 'zap' },
  { id: 'breakpoint', label: 'Breakpoints', icon: 'monitor' },
  { id: 'elevation', label: 'Elevation', icon: 'stack' },
  { id: 'semantic', label: 'Semantic', icon: 'tag' },
];
