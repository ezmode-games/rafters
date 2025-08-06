export { ColorScaleDisplay } from './ColorScaleDisplay';
export { PaletteDisplay } from './PaletteDisplay';
export { TypographyDisplay } from './TypographyDisplay';
export { SpacingDisplay } from './SpacingDisplay';
export { DepthDisplay } from './DepthDisplay';
export { ProgressiveSidebar } from './ProgressiveSidebar';
export { ErrorBoundary } from './ErrorBoundary';

export type { ColorScaleDisplayProps } from './ColorScaleDisplay';
export type { PaletteDisplayProps } from './PaletteDisplay';
export type { TypographyDisplayProps } from './TypographyDisplay';
export type { SpacingDisplayProps } from './SpacingDisplay';
export type { DepthDisplayProps } from './DepthDisplay';
export type { SidebarSection, ProgressiveSidebarProps } from './ProgressiveSidebar';

// Re-export Zod-inferred types from schemas
export type {
  ColorScale,
  TypographyScale,
  SpacingScale,
  DepthScale,
  PaletteScale,
} from '../schemas';
