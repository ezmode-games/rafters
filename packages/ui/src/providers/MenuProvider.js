import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Menu Coordination Provider - AI Intelligence
 *
 * COGNITIVE LOAD: 3/10 (lightweight coordination layer)
 * ATTENTION HIERARCHY: Manages priority across menu types
 * TRUST BUILDING: Consistent coordination patterns across all menus
 *
 * Priority System:
 * 1. ContextMenu (highest - user-initiated)
 * 2. NavigationMenu (primary navigation)
 * 3. DropdownMenu (secondary actions)
 * 4. BreadcrumbMenu (background wayfinding)
 *
 * Token knowledge: .rafters/tokens/registry.json
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { z } from 'zod';
// Zod schemas for validation
const MenuTypeSchema = z.enum([
    'context',
    'navigation',
    'dropdown',
    'breadcrumb',
    'tree',
    'sidebar',
]);
const MenuPrioritySchema = z.number().min(1).max(10);
const MenuRegistrationSchema = z.object({
    id: z.string(),
    type: MenuTypeSchema,
    priority: MenuPrioritySchema,
    cognitiveLoad: z.number().min(1).max(10),
});
const MenuCoordinationContext = createContext(null);
// Priority map for menu types
const MENU_PRIORITIES = {
    context: 1, // Highest priority
    navigation: 2,
    dropdown: 3,
    tree: 4,
    sidebar: 5,
    breadcrumb: 10, // Lowest priority
};
// Cognitive load limits
const MAX_COGNITIVE_LOAD = 15; // Miller's Law inspired budget
/**
 * MenuProvider - Central coordination for all menu types
 * Manages attention hierarchy, focus coordination, and cognitive load budgeting
 */
export const MenuProvider = ({ children, maxCognitiveLoad = MAX_COGNITIVE_LOAD, onLoadExceeded, }) => {
    const [state, setState] = useState({
        activeMenus: new Map(),
        focusStack: [],
        attentionOwner: null,
        cognitiveLoadBudget: maxCognitiveLoad,
        currentLoad: 0,
    });
    // Register a menu with the coordination system
    const registerMenu = useCallback((registration) => {
        try {
            const validated = MenuRegistrationSchema.parse(registration);
            setState((prev) => {
                const newLoad = prev.currentLoad + validated.cognitiveLoad;
                // Check cognitive load budget
                if (newLoad > maxCognitiveLoad) {
                    onLoadExceeded?.(newLoad, maxCognitiveLoad);
                    return prev; // Registration denied
                }
                const newMenus = new Map(prev.activeMenus);
                newMenus.set(validated.id, validated);
                return {
                    ...prev,
                    activeMenus: newMenus,
                    currentLoad: newLoad,
                };
            });
            return true;
        }
        catch (error) {
            console.warn('Menu registration failed:', error);
            return false;
        }
    }, [maxCognitiveLoad, onLoadExceeded]);
    // Unregister a menu
    const unregisterMenu = useCallback((id) => {
        setState((prev) => {
            const menu = prev.activeMenus.get(id);
            if (!menu)
                return prev;
            const newMenus = new Map(prev.activeMenus);
            newMenus.delete(id);
            return {
                ...prev,
                activeMenus: newMenus,
                currentLoad: prev.currentLoad - menu.cognitiveLoad,
                attentionOwner: prev.attentionOwner === id ? null : prev.attentionOwner,
                focusStack: prev.focusStack.filter((focusId) => focusId !== id),
            };
        });
    }, []);
    // Request attention (based on priority)
    const requestAttention = useCallback((id) => {
        const menu = state.activeMenus.get(id);
        if (!menu)
            return false;
        // If no current owner, grant attention
        if (!state.attentionOwner) {
            setState((prev) => ({ ...prev, attentionOwner: id }));
            return true;
        }
        // Check priority against current owner
        const currentOwner = state.activeMenus.get(state.attentionOwner);
        if (!currentOwner) {
            setState((prev) => ({ ...prev, attentionOwner: id }));
            return true;
        }
        // Higher priority (lower number) wins
        if (menu.priority < currentOwner.priority) {
            setState((prev) => ({ ...prev, attentionOwner: id }));
            return true;
        }
        return false;
    }, [state.activeMenus, state.attentionOwner]);
    // Release attention
    const releaseAttention = useCallback((id) => {
        setState((prev) => ({
            ...prev,
            attentionOwner: prev.attentionOwner === id ? null : prev.attentionOwner,
        }));
    }, []);
    // Check if menu has attention
    const hasAttention = useCallback((id) => {
        return state.attentionOwner === id;
    }, [state.attentionOwner]);
    // Focus management
    const pushFocus = useCallback((id) => {
        setState((prev) => ({
            ...prev,
            focusStack: [...prev.focusStack, id],
        }));
    }, []);
    const popFocus = useCallback(() => {
        const lastFocus = state.focusStack[state.focusStack.length - 1];
        setState((prev) => ({
            ...prev,
            focusStack: prev.focusStack.slice(0, -1),
        }));
        return lastFocus;
    }, [state.focusStack]);
    const getCurrentFocus = useCallback(() => {
        return state.focusStack[state.focusStack.length - 1];
    }, [state.focusStack]);
    // State queries
    const isMenuActive = useCallback((id) => {
        return state.activeMenus.has(id);
    }, [state.activeMenus]);
    const getActiveMenuCount = useCallback(() => {
        return state.activeMenus.size;
    }, [state.activeMenus]);
    const getCognitiveLoad = useCallback(() => {
        return state.currentLoad;
    }, [state.currentLoad]);
    const contextValue = useMemo(() => ({
        registerMenu,
        unregisterMenu,
        requestAttention,
        releaseAttention,
        hasAttention,
        pushFocus,
        popFocus,
        getCurrentFocus,
        isMenuActive,
        getActiveMenuCount,
        getCognitiveLoad,
    }), [
        registerMenu,
        unregisterMenu,
        requestAttention,
        releaseAttention,
        hasAttention,
        pushFocus,
        popFocus,
        getCurrentFocus,
        isMenuActive,
        getActiveMenuCount,
        getCognitiveLoad,
    ]);
    return (_jsx(MenuCoordinationContext.Provider, { value: contextValue, children: children }));
};
/**
 * Hook to access menu coordination context
 */
export const useMenuCoordination = () => {
    const context = useContext(MenuCoordinationContext);
    if (!context) {
        throw new Error('useMenuCoordination must be used within MenuProvider');
    }
    return context;
};
/**
 * Hook for individual menu registration and lifecycle
 */
export const useMenu = (id, type, cognitiveLoad = 3) => {
    const coordination = useMenuCoordination();
    const registeredRef = useRef(false);
    // Register on mount
    React.useEffect(() => {
        if (!registeredRef.current) {
            const priority = MENU_PRIORITIES[type];
            const registered = coordination.registerMenu({
                id,
                type,
                priority,
                cognitiveLoad,
            });
            registeredRef.current = registered;
        }
        return () => {
            if (registeredRef.current) {
                coordination.unregisterMenu(id);
                registeredRef.current = false;
            }
        };
    }, [id, type, cognitiveLoad, coordination.registerMenu, coordination.unregisterMenu]);
    return {
        requestAttention: () => coordination.requestAttention(id),
        releaseAttention: () => coordination.releaseAttention(id),
        hasAttention: coordination.hasAttention(id),
        pushFocus: () => coordination.pushFocus(id),
        isActive: coordination.isMenuActive(id),
    };
};
// Display name for debugging
MenuProvider.displayName = 'MenuProvider';
//# sourceMappingURL=MenuProvider.js.map