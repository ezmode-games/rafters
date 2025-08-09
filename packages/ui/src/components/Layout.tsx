/**
 * Layout Component - AI Intelligence
 *
 * COGNITIVE LOAD: 0/10 (invisible structure, organizes complexity)
 * ATTENTION ECONOMICS: Creates scanning patterns (Z-pattern, F-pattern)
 * NEGATIVE SPACE MASTERY: Strategic placement of content and breathing room
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Attention Economics: rafters.realhandy.tech/llm/patterns/attention-economics
 * - Negative Space Mastery: rafters.realhandy.tech/llm/patterns/negative-space
 * - Cognitive Load Management: rafters.realhandy.tech/llm/patterns/cognitive-load
 *
 * USAGE PATTERNS:
 * ✅ Reading Layout: F-pattern for content-heavy interfaces
 * ✅ Landing Layout: Z-pattern for conversion-focused pages
 * ✅ Dashboard Layout: Grid-based for data and metrics
 * ✅ Responsive Structure: Adapts layout patterns to screen size
 * ❌ Never: Complex nested layouts, inconsistent spacing systems
 *
 * Token knowledge: .rafters/tokens/registry.json
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

// Base layout props interface
export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

// Reading layout for text-heavy content (F-pattern optimized)
export const ReadingLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('reading-layout', className)} {...props} />
  )
);
ReadingLayout.displayName = 'ReadingLayout';

// Action layout for conversion-focused content (Z-pattern optimized)
export const ActionLayout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('action-layout', className)} {...props} />
  )
);
ActionLayout.displayName = 'ActionLayout';

// Content sidebar layout for main content + complementary info
export const ContentSidebar = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('content-sidebar', className)} {...props} />
  )
);
ContentSidebar.displayName = 'ContentSidebar';

// Application layout for header + sidebar + main content
export const AppLayout = forwardRef<HTMLDivElement, LayoutProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('app-layout', className)} {...props} />
));
AppLayout.displayName = 'AppLayout';

// Content stack for vertical content flow with phi spacing
export interface ContentStackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'phi-0' | 'phi-1' | 'phi-2' | 'phi-3';
}

export const ContentStack = forwardRef<HTMLDivElement, ContentStackProps>(
  ({ gap = 'phi-1', className, ...props }, ref) => (
    <div ref={ref} className={cn('content-stack', `gap-${gap}`, className)} {...props} />
  )
);
ContentStack.displayName = 'ContentStack';
