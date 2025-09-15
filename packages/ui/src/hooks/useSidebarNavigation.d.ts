/**
 * Sidebar Navigation Hook - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (simple navigation abstraction)
 * TRUST BUILDING: Consistent navigation patterns
 *
 * Provides clean interface between Sidebar and menu components
 */
interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    icon?: React.ReactNode;
    children?: NavigationItem[];
    action?: () => void;
}
interface UseSidebarNavigationOptions {
    menuId?: string;
    cognitiveLoad?: number;
    onNavigate?: (path: string) => void;
}
/**
 * Hook for Sidebar navigation with menu coordination
 * Simplifies integration between Sidebar and menu components
 */
export declare const useSidebarNavigation: (options?: UseSidebarNavigationOptions) => {
    collapsed: boolean;
    currentPath: string | undefined;
    collapsible: boolean;
    navigate: (path: string) => void;
    toggleCollapsed: () => void;
    selectItem: (item: NavigationItem) => void;
    isItemActive: (item: NavigationItem) => boolean;
    getNavigationDepth: (items: NavigationItem[], depth?: number) => number;
    hasAttention: boolean;
    requestAttention: () => boolean;
    releaseAttention: () => void;
};
/**
 * Hook for sidebar item behavior
 * Simplifies individual item implementation
 */
export declare const useSidebarItem: (item: NavigationItem) => {
    isActive: boolean;
    isCurrent: boolean;
    handleClick: () => void;
    ariaProps: {
        'aria-current': string | undefined;
        'aria-selected': string | undefined;
        role: string;
    };
};
export {};
//# sourceMappingURL=useSidebarNavigation.d.ts.map