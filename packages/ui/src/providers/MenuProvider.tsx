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

type MenuType = z.infer<typeof MenuTypeSchema>;
type MenuRegistration = z.infer<typeof MenuRegistrationSchema>;

// Menu coordination state
interface MenuCoordinationState {
  activeMenus: Map<string, MenuRegistration>;
  focusStack: string[];
  attentionOwner: string | null;
  cognitiveLoadBudget: number;
  currentLoad: number;
}

// Menu coordination context
interface MenuCoordinationContextValue {
  // Registration
  registerMenu: (registration: MenuRegistration) => boolean;
  unregisterMenu: (id: string) => void;

  // Attention management
  requestAttention: (id: string) => boolean;
  releaseAttention: (id: string) => void;
  hasAttention: (id: string) => boolean;

  // Focus coordination
  pushFocus: (id: string) => void;
  popFocus: () => string | undefined;
  getCurrentFocus: () => string | undefined;

  // State queries
  isMenuActive: (id: string) => boolean;
  getActiveMenuCount: () => number;
  getCognitiveLoad: () => number;
}

const MenuCoordinationContext = createContext<MenuCoordinationContextValue | null>(null);

// Priority map for menu types
const MENU_PRIORITIES: Record<MenuType, number> = {
  context: 1, // Highest priority
  navigation: 2,
  dropdown: 3,
  tree: 4,
  sidebar: 5,
  breadcrumb: 10, // Lowest priority
};

// Cognitive load limits
const MAX_COGNITIVE_LOAD = 15; // Miller's Law inspired budget

export interface MenuProviderProps {
  children: React.ReactNode;
  maxCognitiveLoad?: number;
  onLoadExceeded?: (current: number, max: number) => void;
}

/**
 * MenuProvider - Central coordination for all menu types
 * Manages attention hierarchy, focus coordination, and cognitive load budgeting
 */
export const MenuProvider: React.FC<MenuProviderProps> = ({
  children,
  maxCognitiveLoad = MAX_COGNITIVE_LOAD,
  onLoadExceeded,
}) => {
  const [state, setState] = useState<MenuCoordinationState>({
    activeMenus: new Map(),
    focusStack: [],
    attentionOwner: null,
    cognitiveLoadBudget: maxCognitiveLoad,
    currentLoad: 0,
  });

  // Register a menu with the coordination system
  const registerMenu = useCallback(
    (registration: MenuRegistration): boolean => {
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
      } catch (error) {
        console.warn('Menu registration failed:', error);
        return false;
      }
    },
    [maxCognitiveLoad, onLoadExceeded]
  );

  // Unregister a menu
  const unregisterMenu = useCallback((id: string) => {
    setState((prev) => {
      const menu = prev.activeMenus.get(id);
      if (!menu) return prev;

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
  const requestAttention = useCallback(
    (id: string): boolean => {
      const menu = state.activeMenus.get(id);
      if (!menu) return false;

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
    },
    [state.activeMenus, state.attentionOwner]
  );

  // Release attention
  const releaseAttention = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      attentionOwner: prev.attentionOwner === id ? null : prev.attentionOwner,
    }));
  }, []);

  // Check if menu has attention
  const hasAttention = useCallback(
    (id: string): boolean => {
      return state.attentionOwner === id;
    },
    [state.attentionOwner]
  );

  // Focus management
  const pushFocus = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      focusStack: [...prev.focusStack, id],
    }));
  }, []);

  const popFocus = useCallback((): string | undefined => {
    const lastFocus = state.focusStack[state.focusStack.length - 1];
    setState((prev) => ({
      ...prev,
      focusStack: prev.focusStack.slice(0, -1),
    }));
    return lastFocus;
  }, [state.focusStack]);

  const getCurrentFocus = useCallback((): string | undefined => {
    return state.focusStack[state.focusStack.length - 1];
  }, [state.focusStack]);

  // State queries
  const isMenuActive = useCallback(
    (id: string): boolean => {
      return state.activeMenus.has(id);
    },
    [state.activeMenus]
  );

  const getActiveMenuCount = useCallback((): number => {
    return state.activeMenus.size;
  }, [state.activeMenus]);

  const getCognitiveLoad = useCallback((): number => {
    return state.currentLoad;
  }, [state.currentLoad]);

  const contextValue: MenuCoordinationContextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <MenuCoordinationContext.Provider value={contextValue}>
      {children}
    </MenuCoordinationContext.Provider>
  );
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
export const useMenu = (id: string, type: MenuType, cognitiveLoad = 3) => {
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
