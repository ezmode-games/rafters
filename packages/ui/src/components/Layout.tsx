/**
 * AI Intelligence: Token knowledge in .rafters/tokens/registry.json
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
