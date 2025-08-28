/**
 * Tabbed interface component with keyboard navigation and ARIA compliance
 *
 * @registry-name tabs
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Tabs.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 4/10 - Content organization with state management requires cognitive processing
 * @attention-economics Content organization: visible=current context, hidden=available contexts, active=user focus
 * @trust-building Persistent selection, clear active indication, predictable navigation patterns
 * @accessibility Arrow key navigation, tab focus management, panel association, screen reader support
 * @semantic-meaning Structure: tablist=navigation, tab=option, tabpanel=content, selected=current view
 *
 * @usage-patterns
 * DO: Use for related content showing different views of same data/context
 * DO: Provide clear, descriptive, scannable tab names (7±2 maximum)
 * DO: Make active state visually prominent and immediately clear
 * DO: Arrange tabs by frequency or logical workflow sequence
 * NEVER: More than 7 tabs, unrelated content sections, unclear active state
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-tabs
 *
 * @example
 * ```tsx
 * // Basic tabs with content panels
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">
 *     Overview content
 *   </TabsContent>
 *   <TabsContent value="details">
 *     Details content
 *   </TabsContent>
 * </Tabs>
 * ```
 */
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../lib/utils';

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  cognitiveLoad?: 'minimal' | 'standard' | 'complex';
  orientation?: 'horizontal' | 'vertical';
  wayfinding?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Root>>;
}

function Tabs({
  cognitiveLoad = 'standard',
  orientation = 'horizontal',
  wayfinding = false,
  ref,
  ...props
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      orientation={orientation}
      className={cn('w-full', wayfinding && 'tabs-wayfinding')}
      {...props}
    />
  );
}

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'default' | 'pills' | 'underline';
  density?: 'compact' | 'comfortable' | 'spacious';
  showIndicator?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.List>>;
}

function TabsList({
  className,
  variant = 'default',
  density = 'comfortable',
  showIndicator = true,
  ref,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center text-muted-foreground',

        // Variant styling
        {
          'rounded-md bg-muted p-1': variant === 'default',
          'bg-transparent gap-2': variant === 'pills',
          'bg-transparent border-b border-border': variant === 'underline',
        },

        // Density spacing
        {
          'h-8 gap-1': density === 'compact',
          'h-10 gap-2': density === 'comfortable',
          'h-12 gap-3': density === 'spacious',
        },

        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Trigger>>;
}

function TabsTrigger({
  className,
  badge,
  icon,
  children,
  disabled,
  ref,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all',
        'motion-hover',
        'easing-snappy',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-disabled',

        // Base styling that varies by parent list variant
        'rounded-sm px-3 py-1.5', // default
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        'hover:opacity-hover active:scale-active',

        // Enhanced touch targets for cognitive load reduction
        'min-h-[44px] min-w-[44px]',

        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {badge}
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  loading?: boolean;
  lazy?: boolean;
  ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Content>>;
}

function TabsContent({
  className,
  loading = false,
  lazy = false,
  children,
  ref,
  ...props
}: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

        // Loading state
        loading && 'opacity-50',

        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">Loading content...</div>
        </div>
      ) : (
        children
      )}
    </TabsPrimitive.Content>
  );
}

// Navigation helper component for wayfinding
interface TabsBreadcrumbProps {
  activeTab: string;
  tabs: Array<{ value: string; label: string }>;
}

const TabsBreadcrumb = ({ activeTab, tabs }: TabsBreadcrumbProps) => {
  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const activeTabLabel = tabs[activeIndex]?.label;

  return (
    <output className="text-xs text-muted-foreground mb-2" aria-live="polite">
      Tab {activeIndex + 1} of {tabs.length}: {activeTabLabel}
    </output>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBreadcrumb };
export type { TabsProps };
