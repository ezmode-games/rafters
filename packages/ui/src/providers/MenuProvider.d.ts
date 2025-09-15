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
import React from 'react';
import { z } from 'zod';
declare const MenuTypeSchema: z.ZodEnum<{
    navigation: "navigation";
    tree: "tree";
    dropdown: "dropdown";
    sidebar: "sidebar";
    context: "context";
    breadcrumb: "breadcrumb";
}>;
declare const MenuRegistrationSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        navigation: "navigation";
        tree: "tree";
        dropdown: "dropdown";
        sidebar: "sidebar";
        context: "context";
        breadcrumb: "breadcrumb";
    }>;
    priority: z.ZodNumber;
    cognitiveLoad: z.ZodNumber;
}, z.core.$strip>;
type MenuType = z.infer<typeof MenuTypeSchema>;
type MenuRegistration = z.infer<typeof MenuRegistrationSchema>;
interface MenuCoordinationContextValue {
    registerMenu: (registration: MenuRegistration) => boolean;
    unregisterMenu: (id: string) => void;
    requestAttention: (id: string) => boolean;
    releaseAttention: (id: string) => void;
    hasAttention: (id: string) => boolean;
    pushFocus: (id: string) => void;
    popFocus: () => string | undefined;
    getCurrentFocus: () => string | undefined;
    isMenuActive: (id: string) => boolean;
    getActiveMenuCount: () => number;
    getCognitiveLoad: () => number;
}
export interface MenuProviderProps {
    children: React.ReactNode;
    maxCognitiveLoad?: number;
    onLoadExceeded?: (current: number, max: number) => void;
}
/**
 * MenuProvider - Central coordination for all menu types
 * Manages attention hierarchy, focus coordination, and cognitive load budgeting
 */
export declare const MenuProvider: React.FC<MenuProviderProps>;
/**
 * Hook to access menu coordination context
 */
export declare const useMenuCoordination: () => MenuCoordinationContextValue;
/**
 * Hook for individual menu registration and lifecycle
 */
export declare const useMenu: (id: string, type: MenuType, cognitiveLoad?: number) => {
    requestAttention: () => boolean;
    releaseAttention: () => void;
    hasAttention: boolean;
    pushFocus: () => void;
    isActive: boolean;
};
export {};
//# sourceMappingURL=MenuProvider.d.ts.map