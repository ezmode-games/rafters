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
interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
    cognitiveLoad?: 'minimal' | 'standard' | 'complex';
    orientation?: 'horizontal' | 'vertical';
    wayfinding?: boolean;
    ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Root>>;
}
declare function Tabs({ cognitiveLoad, orientation, wayfinding, ref, ...props }: TabsProps): import("react/jsx-runtime").JSX.Element;
interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
    variant?: 'default' | 'pills' | 'underline';
    density?: 'compact' | 'comfortable' | 'spacious';
    showIndicator?: boolean;
    ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.List>>;
}
declare function TabsList({ className, variant, density, showIndicator, ref, ...props }: TabsListProps): import("react/jsx-runtime").JSX.Element;
interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    badge?: string | number;
    icon?: React.ReactNode;
    disabled?: boolean;
    ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Trigger>>;
}
declare function TabsTrigger({ className, badge, icon, children, disabled, ref, ...props }: TabsTriggerProps): import("react/jsx-runtime").JSX.Element;
interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
    loading?: boolean;
    lazy?: boolean;
    ref?: React.Ref<React.ElementRef<typeof TabsPrimitive.Content>>;
}
declare function TabsContent({ className, loading, lazy, children, ref, ...props }: TabsContentProps): import("react/jsx-runtime").JSX.Element;
interface TabsBreadcrumbProps {
    activeTab: string;
    tabs: Array<{
        value: string;
        label: string;
    }>;
}
declare const TabsBreadcrumb: ({ activeTab, tabs }: TabsBreadcrumbProps) => import("react/jsx-runtime").JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBreadcrumb };
export type { TabsProps };
//# sourceMappingURL=Tabs.d.ts.map