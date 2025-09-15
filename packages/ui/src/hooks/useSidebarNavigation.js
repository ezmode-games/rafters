/**
 * Sidebar Navigation Hook - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (simple navigation abstraction)
 * TRUST BUILDING: Consistent navigation patterns
 *
 * Provides clean interface between Sidebar and menu components
 */
import { useCallback, useEffect } from 'react';
import { z } from 'zod';
import { useMenu } from '../providers/MenuProvider';
import { useSidebarActions, useSidebarStore } from '../stores/sidebarStore';
// Basic validation schema (complex function validation done with TypeScript types)
const _NavigationItemBaseSchema = z.object({
    id: z.string(),
    label: z.string(),
    href: z.string().optional(),
    icon: z.any().optional(),
    children: z.array(z.any()).optional(),
});
/**
 * Hook for Sidebar navigation with menu coordination
 * Simplifies integration between Sidebar and menu components
 */
export const useSidebarNavigation = (options = {}) => {
    const { menuId = 'sidebar-nav', cognitiveLoad = 6, onNavigate } = options;
    // Sidebar store state
    const collapsed = useSidebarStore((state) => state.collapsed);
    const currentPath = useSidebarStore((state) => state.currentPath);
    const collapsible = useSidebarStore((state) => state.collapsible);
    // Sidebar actions
    const { navigate, toggleCollapsed, setActiveItem } = useSidebarActions();
    // Menu coordination
    const menu = useMenu(menuId, 'sidebar', cognitiveLoad);
    // Enhanced navigation handler
    const handleNavigation = useCallback((path) => {
        try {
            // Request attention for navigation
            const hasAttention = menu.requestAttention();
            if (hasAttention) {
                // Perform navigation
                navigate(path, onNavigate);
                // Release attention after navigation
                setTimeout(() => {
                    menu.releaseAttention();
                }, 300);
            }
            else {
                // Fallback if can't get attention
                console.warn('Navigation blocked: unable to acquire attention');
            }
        }
        catch (error) {
            console.error('Navigation error:', error);
        }
    }, [menu, navigate, onNavigate]);
    // Handle item selection
    const handleItemSelect = useCallback((item) => {
        if (item.href) {
            handleNavigation(item.href);
        }
        else if (item.action) {
            item.action();
        }
        setActiveItem(item.id);
    }, [handleNavigation, setActiveItem]);
    // Check if item is active
    const isItemActive = useCallback((item) => {
        if (!currentPath)
            return false;
        if (item.href) {
            // Exact match or starts with (for nested routes)
            return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
        }
        // Check children for active state
        if (item.children) {
            return item.children.some((child) => child.href && (currentPath === child.href || currentPath.startsWith(`${child.href}/`)));
        }
        return false;
    }, [currentPath]);
    // Get navigation depth for cognitive load awareness
    const getNavigationDepth = useCallback((items, depth = 0) => {
        let maxDepth = depth;
        for (const item of items) {
            if (item.children && item.children.length > 0) {
                const childDepth = getNavigationDepth(item.children, depth + 1);
                maxDepth = Math.max(maxDepth, childDepth);
            }
        }
        return maxDepth;
    }, []);
    // Keyboard navigation handler
    const handleKeyboardNavigation = useCallback((event) => {
        // Only handle if sidebar has focus
        if (!menu.hasAttention)
            return;
        switch (event.key) {
            case 'ArrowLeft':
                if (collapsible && !collapsed) {
                    toggleCollapsed();
                }
                break;
            case 'ArrowRight':
                if (collapsible && collapsed) {
                    toggleCollapsed();
                }
                break;
            case 'Escape':
                if (!collapsed) {
                    toggleCollapsed();
                }
                break;
        }
    }, [menu.hasAttention, collapsible, collapsed, toggleCollapsed]);
    // Set up keyboard listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardNavigation);
        return () => window.removeEventListener('keydown', handleKeyboardNavigation);
    }, [handleKeyboardNavigation]);
    return {
        // State
        collapsed,
        currentPath,
        collapsible,
        // Actions
        navigate: handleNavigation,
        toggleCollapsed,
        selectItem: handleItemSelect,
        // Utilities
        isItemActive,
        getNavigationDepth,
        // Menu coordination
        hasAttention: menu.hasAttention,
        requestAttention: menu.requestAttention,
        releaseAttention: menu.releaseAttention,
    };
};
/**
 * Hook for sidebar item behavior
 * Simplifies individual item implementation
 */
export const useSidebarItem = (item) => {
    const { currentPath, selectItem, isItemActive } = useSidebarNavigation();
    const isActive = isItemActive(item);
    const isCurrent = item.href === currentPath;
    const handleClick = useCallback(() => {
        selectItem(item);
    }, [selectItem, item]);
    return {
        isActive,
        isCurrent,
        handleClick,
        ariaProps: {
            'aria-current': isCurrent ? 'page' : undefined,
            'aria-selected': isActive ? 'true' : undefined,
            role: 'menuitem',
        },
    };
};
//# sourceMappingURL=useSidebarNavigation.js.map