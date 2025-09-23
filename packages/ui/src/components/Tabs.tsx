/**
 * Tabbed interface component for organizing related content
 *
 * @registryName tabs
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Tabs.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 3/10 - Content organization with clear navigation patterns
 * @attentionEconomics Focused content display with clear active state indication
 * @trustBuilding Persistent selection and predictable navigation patterns
 * @accessibility WCAG AAA compliant with keyboard navigation and screen reader support
 * @semanticMeaning Organizes related content into distinct, navigable sections
 *
 * @usagePatterns
 * DO: Use for related content showing different views of the same context
 * DO: Limit to 7 or fewer tabs for optimal cognitive load
 * DO: Make active state visually prominent and clear
 * NEVER: Use for unrelated content sections or unclear navigation
 *
 * @designGuides
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
 * - Cognitive Load: https://rafters.realhandy.tech/docs/foundation/cognitive-load
 *
 * @dependencies @radix-ui/react-tabs
 *
 * @example
 * ```tsx
 * // Organized content tabs
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">Overview content</TabsContent>
 *   <TabsContent value="details">Details content</TabsContent>
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
