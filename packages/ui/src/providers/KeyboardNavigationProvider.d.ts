/**
 * Keyboard Navigation Provider - AI Intelligence
 *
 * COGNITIVE LOAD: 3/10 (unified keyboard shortcuts reduce learning burden)
 * TRUST BUILDING: Consistent keyboard behavior across all menu types
 * ACCESSIBILITY: WCAG AAA keyboard navigation patterns
 *
 * Provides unified keyboard shortcuts and navigation patterns
 * across DropdownMenu, NavigationMenu, ContextMenu, BreadcrumbMenu, and TreeMenu
 *
 * Token knowledge: .rafters/tokens/registry.json
 */
import type React from 'react';
import { z } from 'zod';
declare const KeyboardActionSchema: z.ZodEnum<{
    search: "search";
    end: "end";
    collapse: "collapse";
    select: "select";
    expand: "expand";
    toggle: "toggle";
    close: "close";
    open: "open";
    home: "home";
    "navigate-next": "navigate-next";
    "navigate-previous": "navigate-previous";
    "navigate-up": "navigate-up";
    "navigate-down": "navigate-down";
    "navigate-left": "navigate-left";
    "navigate-right": "navigate-right";
    escape: "escape";
    "page-up": "page-up";
    "page-down": "page-down";
}>;
declare const KeyConfigSchema: z.ZodObject<{
    key: z.ZodString;
    modifiers: z.ZodDefault<z.ZodObject<{
        ctrl: z.ZodDefault<z.ZodBoolean>;
        shift: z.ZodDefault<z.ZodBoolean>;
        alt: z.ZodDefault<z.ZodBoolean>;
        meta: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    action: z.ZodEnum<{
        search: "search";
        end: "end";
        collapse: "collapse";
        select: "select";
        expand: "expand";
        toggle: "toggle";
        close: "close";
        open: "open";
        home: "home";
        "navigate-next": "navigate-next";
        "navigate-previous": "navigate-previous";
        "navigate-up": "navigate-up";
        "navigate-down": "navigate-down";
        "navigate-left": "navigate-left";
        "navigate-right": "navigate-right";
        escape: "escape";
        "page-up": "page-up";
        "page-down": "page-down";
    }>;
    preventDefault: z.ZodDefault<z.ZodBoolean>;
    stopPropagation: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const KeyboardHandlerSchema: z.ZodObject<{
    menuId: z.ZodString;
    menuType: z.ZodEnum<{
        navigation: "navigation";
        tree: "tree";
        dropdown: "dropdown";
        sidebar: "sidebar";
        context: "context";
        breadcrumb: "breadcrumb";
    }>;
    priority: z.ZodNumber;
    keyConfigs: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        modifiers: z.ZodDefault<z.ZodObject<{
            ctrl: z.ZodDefault<z.ZodBoolean>;
            shift: z.ZodDefault<z.ZodBoolean>;
            alt: z.ZodDefault<z.ZodBoolean>;
            meta: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
        action: z.ZodEnum<{
            search: "search";
            end: "end";
            collapse: "collapse";
            select: "select";
            expand: "expand";
            toggle: "toggle";
            close: "close";
            open: "open";
            home: "home";
            "navigate-next": "navigate-next";
            "navigate-previous": "navigate-previous";
            "navigate-up": "navigate-up";
            "navigate-down": "navigate-down";
            "navigate-left": "navigate-left";
            "navigate-right": "navigate-right";
            escape: "escape";
            "page-up": "page-up";
            "page-down": "page-down";
        }>;
        preventDefault: z.ZodDefault<z.ZodBoolean>;
        stopPropagation: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    onAction: z.ZodAny;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type KeyboardAction = z.infer<typeof KeyboardActionSchema>;
type KeyConfig = z.infer<typeof KeyConfigSchema>;
type KeyboardHandler = z.infer<typeof KeyboardHandlerSchema>;
interface KeyboardNavigationContextValue {
    registerKeyboardHandler: (handler: KeyboardHandler) => void;
    unregisterKeyboardHandler: (menuId: string) => void;
    setGlobalShortcut: (shortcut: string, config: KeyConfig) => void;
    removeGlobalShortcut: (shortcut: string) => void;
    triggerAction: (menuId: string, action: KeyboardAction, event?: KeyboardEvent) => boolean;
    enableSearchMode: (menuId: string) => void;
    disableSearchMode: () => void;
    updateSearchTerm: (term: string) => void;
    isSearchActive: () => boolean;
    getSearchTerm: () => string;
    isHandlerEnabled: (menuId: string) => boolean;
    getNextNavigableItem: (container: HTMLElement, current: HTMLElement) => HTMLElement | null;
    getPreviousNavigableItem: (container: HTMLElement, current: HTMLElement) => HTMLElement | null;
    findItemsByText: (container: HTMLElement, searchText: string) => HTMLElement[];
}
declare const DEFAULT_KEY_CONFIGS: {
    readonly context: readonly [{
        readonly key: "Escape";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowDown";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowUp";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Enter";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: " ";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Home";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "End";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }];
    readonly navigation: readonly [{
        readonly key: "Escape";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowRight";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowLeft";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowDown";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowUp";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Enter";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: " ";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Home";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "End";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }];
    readonly dropdown: readonly [{
        readonly key: "Escape";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowDown";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowUp";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Enter";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: " ";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Home";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "End";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }];
    readonly breadcrumb: readonly [{
        readonly key: "ArrowRight";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowLeft";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Home";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "End";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Enter";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }];
    readonly tree: readonly [{
        readonly key: "ArrowDown";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowUp";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowRight";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowLeft";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Enter";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: " ";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Home";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "End";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "*";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }];
    readonly sidebar: readonly [{
        readonly key: "ArrowDown";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "ArrowUp";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Enter";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: " ";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "Home";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }, {
        readonly key: "End";
        readonly action: KeyboardAction;
        readonly preventDefault: true;
        readonly stopPropagation: true;
    }];
};
declare const NAVIGABLE_SELECTORS: string;
export interface KeyboardNavigationProviderProps {
    children: React.ReactNode;
    enableTypeAhead?: boolean;
    typeAheadDelay?: number;
    onGlobalKeyAction?: (action: KeyboardAction, menuId: string, event: KeyboardEvent) => void;
}
/**
 * KeyboardNavigationProvider - Unified keyboard navigation for all menu types
 * Provides consistent keyboard shortcuts and search functionality
 */
export declare const KeyboardNavigationProvider: React.FC<KeyboardNavigationProviderProps>;
/**
 * Hook to access keyboard navigation context
 */
export declare const useKeyboardNavigation: () => KeyboardNavigationContextValue;
/**
 * Hook for menu components to register keyboard navigation
 */
export declare const useMenuKeyboard: (menuId: string, menuType: KeyboardHandler["menuType"], onAction: (action: KeyboardAction, event?: KeyboardEvent) => void, customKeyConfigs?: KeyConfig[]) => {
    triggerAction: (action: KeyboardAction, event?: KeyboardEvent) => boolean;
    isSearchActive: boolean;
    getSearchTerm: string;
    enableSearch: () => void;
    disableSearch: () => void;
    findItemsByText: (container: HTMLElement, searchText: string) => HTMLElement[];
    getNextItem: (container: HTMLElement, current: HTMLElement) => HTMLElement | null;
    getPreviousItem: (container: HTMLElement, current: HTMLElement) => HTMLElement | null;
};
export { DEFAULT_KEY_CONFIGS, NAVIGABLE_SELECTORS };
export type { KeyboardAction, KeyConfig, KeyboardHandler };
//# sourceMappingURL=KeyboardNavigationProvider.d.ts.map