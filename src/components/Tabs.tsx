import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  cognitiveLoad?: 'minimal' | 'standard' | 'complex';
  orientation?: 'horizontal' | 'vertical';
  wayfinding?: boolean;
}

const Tabs = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ cognitiveLoad = 'standard', orientation = 'horizontal', wayfinding = false, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      'w-full',
      wayfinding && 'tabs-wayfinding'
    )}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'default' | 'pills' | 'underline';
  density?: 'compact' | 'comfortable' | 'spacious';
  showIndicator?: boolean;
}

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', density = 'comfortable', showIndicator = true, ...props }, ref) => (
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
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, badge, icon, children, disabled, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    disabled={disabled}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all',
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
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  loading?: boolean;
  lazy?: boolean;
}

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, loading = false, lazy = false, children, ...props }, ref) => (
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
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Navigation helper component for wayfinding
interface TabsBreadcrumbProps {
  activeTab: string;
  tabs: Array<{ value: string; label: string }>;
}

const TabsBreadcrumb = ({ activeTab, tabs }: TabsBreadcrumbProps) => {
  const activeIndex = tabs.findIndex(tab => tab.value === activeTab);
  const activeTabLabel = tabs[activeIndex]?.label;
  
  return (
    <output className="text-xs text-muted-foreground mb-2" aria-live="polite">
      Tab {activeIndex + 1} of {tabs.length}: {activeTabLabel}
    </output>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBreadcrumb };
export type { TabsProps };
