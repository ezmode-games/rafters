/**
 * Comprehensive navigation sidebar with embedded wayfinding intelligence and progressive disclosure patterns
 *
 * @registry-name sidebar
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Sidebar.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 6/10 - Navigation system with state management and wayfinding intelligence
 * @attention-economics Secondary support system: Never competes with primary content, uses muted variants and compact sizing for attention hierarchy
 * @trust-building Spatial consistency builds user confidence, zustand state persistence remembers preferences, Miller's Law enforcement prevents cognitive overload
 * @accessibility WCAG AAA compliance with skip links, keyboard navigation, screen reader optimization, and motion sensitivity support
 * @semantic-meaning Navigation intelligence: Progressive disclosure for complex hierarchies, semantic grouping by domain, wayfinding through active state indication with zustand state machine
 *
 * @usage-patterns
 * DO: Use for main navigation with collapsible state management
 * DO: Implement progressive disclosure for complex menu hierarchies
 * DO: Provide skip links and keyboard navigation patterns
 * DO: Integrate with zustand store for state persistence
 * NEVER: Complex menu logic within sidebar - use dedicated menu components
 * NEVER: Compete with primary content for attention
 *
 * @design-guides
 * - Navigation Intelligence: https://rafters.realhandy.tech/docs/llm/navigation-patterns
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 *
 * @dependencies @rafters/design-tokens, zustand, zod, lucide-react, class-variance-authority, clsx
 *
 * @example
 * ```tsx
 * // Basic sidebar with navigation items
 * <Sidebar collapsed={false} collapsible>
 *   <SidebarHeader>
 *     <SidebarTitle>Navigation</SidebarTitle>
 *   </SidebarHeader>
 *   <SidebarContent>
 *     <SidebarItem href="/dashboard">Dashboard</SidebarItem>
 *     <SidebarItem href="/settings">Settings</SidebarItem>
 *   </SidebarContent>
 * </Sidebar>
 * ```
 */
import React from 'react';
export declare const useSidebar: () => {
    collapsed: boolean;
    collapsible: boolean;
    currentPath: string | undefined;
    onNavigate: (path: string) => void;
    toggleCollapsed: () => void;
    hasAttention: boolean;
};
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
    collapsed?: boolean;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    currentPath?: string;
    onNavigate?: (path: string) => void;
    onCollapsedChange?: (collapsed: boolean) => void;
    variant?: 'default' | 'floating' | 'overlay';
    size?: 'compact' | 'comfortable' | 'spacious';
    position?: 'left' | 'right';
    ariaLabel?: string;
    skipLinkTarget?: string;
    landmark?: boolean;
    persistCollapsedState?: boolean;
    reduceMotion?: boolean;
    showBreadcrumb?: boolean;
    highlightCurrent?: boolean;
    children: React.ReactNode;
}
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    showToggle?: boolean;
    children: React.ReactNode;
}
export interface SidebarTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
}
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    collapsible?: boolean;
    defaultExpanded?: boolean;
    maxItems?: number;
    showCount?: boolean;
    children: React.ReactNode;
}
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export interface SidebarItemProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    href?: string;
    active?: boolean;
    disabled?: boolean;
    variant?: 'default' | 'primary' | 'secondary';
    level?: number;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children: React.ReactNode;
    asChild?: boolean;
    external?: boolean;
    showTooltip?: boolean;
    loading?: boolean;
}
export interface SidebarItemIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
}
export interface SidebarItemTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    truncate?: boolean;
    children: React.ReactNode;
}
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare const Sidebar: React.FC<SidebarProps>;
export declare const SidebarHeader: React.FC<SidebarHeaderProps>;
export declare const SidebarTitle: React.FC<SidebarTitleProps>;
export declare const SidebarContent: React.FC<SidebarContentProps>;
export declare const SidebarGroup: React.FC<SidebarGroupProps>;
export declare const SidebarGroupLabel: React.FC<SidebarGroupLabelProps>;
export declare const SidebarGroupContent: React.FC<SidebarGroupContentProps>;
export declare const SidebarItem: React.FC<SidebarItemProps>;
export declare const SidebarItemIcon: React.FC<SidebarItemIconProps>;
export declare const SidebarItemText: React.FC<SidebarItemTextProps>;
export declare const SidebarFooter: React.FC<SidebarFooterProps>;
//# sourceMappingURL=Sidebar.d.ts.map