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
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useFocusManager } from './FocusManager';
import { useMenuCoordination } from './MenuProvider';

// Zod schemas for validation
const KeyboardActionSchema = z.enum([
  'open',
  'close',
  'toggle',
  'navigate-next',
  'navigate-previous',
  'navigate-up',
  'navigate-down',
  'navigate-left',
  'navigate-right',
  'select',
  'escape',
  'home',
  'end',
  'page-up',
  'page-down',
  'search',
  'expand',
  'collapse',
]);

const KeyConfigSchema = z.object({
  key: z.string(),
  modifiers: z
    .object({
      ctrl: z.boolean().default(false),
      shift: z.boolean().default(false),
      alt: z.boolean().default(false),
      meta: z.boolean().default(false),
    })
    .default({}),
  action: KeyboardActionSchema,
  preventDefault: z.boolean().default(true),
  stopPropagation: z.boolean().default(true),
});

const KeyboardHandlerSchema = z.object({
  menuId: z.string(),
  menuType: z.enum(['context', 'navigation', 'dropdown', 'breadcrumb', 'tree', 'sidebar']),
  priority: z.number().min(1).max(10),
  keyConfigs: z.array(KeyConfigSchema),
  onAction: z.any(), // Function - can't validate with Zod
  enabled: z.boolean().default(true),
});

type KeyboardAction = z.infer<typeof KeyboardActionSchema>;
type KeyConfig = z.infer<typeof KeyConfigSchema>;
type KeyboardHandler = z.infer<typeof KeyboardHandlerSchema>;

interface KeyboardNavigationState {
  handlers: Map<string, KeyboardHandler>;
  globalShortcuts: Map<string, KeyConfig>;
  searchMode: boolean;
  searchTerm: string;
  lastKeyTime: number;
}

interface KeyboardNavigationContextValue {
  // Handler registration
  registerKeyboardHandler: (handler: KeyboardHandler) => void;
  unregisterKeyboardHandler: (menuId: string) => void;

  // Global shortcuts
  setGlobalShortcut: (shortcut: string, config: KeyConfig) => void;
  removeGlobalShortcut: (shortcut: string) => void;

  // Navigation actions
  triggerAction: (menuId: string, action: KeyboardAction, event?: KeyboardEvent) => boolean;

  // Search functionality
  enableSearchMode: (menuId: string) => void;
  disableSearchMode: () => void;
  updateSearchTerm: (term: string) => void;

  // State queries
  isSearchActive: () => boolean;
  getSearchTerm: () => string;
  isHandlerEnabled: (menuId: string) => boolean;

  // Navigation helpers
  getNextNavigableItem: (container: HTMLElement, current: HTMLElement) => HTMLElement | null;
  getPreviousNavigableItem: (container: HTMLElement, current: HTMLElement) => HTMLElement | null;
  findItemsByText: (container: HTMLElement, searchText: string) => HTMLElement[];
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextValue | null>(null);

// Default keyboard configurations for each menu type
const DEFAULT_KEY_CONFIGS = {
  context: [
    {
      key: 'Escape',
      action: 'close' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowDown',
      action: 'navigate-next' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowUp',
      action: 'navigate-previous' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Enter',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: ' ',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Home',
      action: 'home' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'End',
      action: 'end' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
  ],
  navigation: [
    {
      key: 'Escape',
      action: 'close' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowRight',
      action: 'navigate-right' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowLeft',
      action: 'navigate-left' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowDown',
      action: 'navigate-down' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowUp',
      action: 'navigate-up' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Enter',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: ' ',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Home',
      action: 'home' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'End',
      action: 'end' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
  ],
  dropdown: [
    {
      key: 'Escape',
      action: 'close' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowDown',
      action: 'navigate-next' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowUp',
      action: 'navigate-previous' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Enter',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: ' ',
      action: 'toggle' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Home',
      action: 'home' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'End',
      action: 'end' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
  ],
  breadcrumb: [
    {
      key: 'ArrowRight',
      action: 'navigate-next' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowLeft',
      action: 'navigate-previous' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Home',
      action: 'home' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'End',
      action: 'end' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Enter',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
  ],
  tree: [
    {
      key: 'ArrowDown',
      action: 'navigate-next' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowUp',
      action: 'navigate-previous' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowRight',
      action: 'expand' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowLeft',
      action: 'collapse' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Enter',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: ' ',
      action: 'toggle' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Home',
      action: 'home' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'End',
      action: 'end' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: '*',
      action: 'expand' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    }, // Expand all
  ],
  sidebar: [
    {
      key: 'ArrowDown',
      action: 'navigate-next' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'ArrowUp',
      action: 'navigate-previous' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Enter',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: ' ',
      action: 'select' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'Home',
      action: 'home' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
    {
      key: 'End',
      action: 'end' as KeyboardAction,
      preventDefault: true,
      stopPropagation: true,
    },
  ],
} as const;

// Navigable selectors
const NAVIGABLE_SELECTORS = [
  '[role="menuitem"]',
  '[role="button"]',
  '[role="option"]',
  '[role="tab"]',
  '[role="treeitem"]',
  'button:not([disabled])',
  'a[href]',
  '[tabindex="0"]',
].join(',');

// Utility functions
const getNavigableElements = (container: HTMLElement): HTMLElement[] => {
  const elements = container.querySelectorAll(NAVIGABLE_SELECTORS);
  return Array.from(elements).filter((el) => {
    const element = el as HTMLElement;
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null
    );
  }) as HTMLElement[];
};

const matchesKeyConfig = (event: KeyboardEvent, config: KeyConfig): boolean => {
  if (event.key !== config.key) return false;

  const modifiers = config.modifiers || {};
  return (
    event.ctrlKey === (modifiers.ctrl || false) &&
    event.shiftKey === (modifiers.shift || false) &&
    event.altKey === (modifiers.alt || false) &&
    event.metaKey === (modifiers.meta || false)
  );
};

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
export const KeyboardNavigationProvider: React.FC<KeyboardNavigationProviderProps> = ({
  children,
  enableTypeAhead = true,
  typeAheadDelay = 1000,
  onGlobalKeyAction,
}) => {
  const _coordination = useMenuCoordination();
  const focusManager = useFocusManager();

  const [state, setState] = useState<KeyboardNavigationState>({
    handlers: new Map(),
    globalShortcuts: new Map(),
    searchMode: false,
    searchTerm: '',
    lastKeyTime: 0,
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Register keyboard handler for a menu
  const registerKeyboardHandler = useCallback((handler: KeyboardHandler) => {
    try {
      const validated = KeyboardHandlerSchema.parse(handler);
      setState((prev) => ({
        ...prev,
        handlers: new Map(prev.handlers).set(validated.menuId, validated),
      }));
    } catch (error) {
      console.warn('Keyboard handler registration failed:', error);
    }
  }, []);

  // Unregister keyboard handler
  const unregisterKeyboardHandler = useCallback((menuId: string) => {
    setState((prev) => {
      const newHandlers = new Map(prev.handlers);
      newHandlers.delete(menuId);
      return {
        ...prev,
        handlers: newHandlers,
      };
    });
  }, []);

  // Set global keyboard shortcut
  const setGlobalShortcut = useCallback((shortcut: string, config: KeyConfig) => {
    try {
      const validated = KeyConfigSchema.parse(config);
      setState((prev) => ({
        ...prev,
        globalShortcuts: new Map(prev.globalShortcuts).set(shortcut, validated),
      }));
    } catch (error) {
      console.warn('Global shortcut registration failed:', error);
    }
  }, []);

  // Remove global shortcut
  const removeGlobalShortcut = useCallback((shortcut: string) => {
    setState((prev) => {
      const newShortcuts = new Map(prev.globalShortcuts);
      newShortcuts.delete(shortcut);
      return {
        ...prev,
        globalShortcuts: newShortcuts,
      };
    });
  }, []);

  // Trigger keyboard action
  const triggerAction = useCallback(
    (menuId: string, action: KeyboardAction, event?: KeyboardEvent): boolean => {
      const handler = state.handlers.get(menuId);
      if (!handler || !handler.enabled) return false;

      try {
        handler.onAction?.(action, event);
        onGlobalKeyAction?.(action, menuId, event!);
        return true;
      } catch (error) {
        console.warn('Keyboard action failed:', error);
        return false;
      }
    },
    [state.handlers, onGlobalKeyAction]
  );

  // Search mode management
  const enableSearchMode = useCallback(
    (_menuId: string) => {
      setState((prev) => ({
        ...prev,
        searchMode: true,
        searchTerm: '',
        lastKeyTime: Date.now(),
      }));

      focusManager.announceFocusChange('Search mode activated', 'assertive');
    },
    [focusManager]
  );

  const disableSearchMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchMode: false,
      searchTerm: '',
    }));

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  const updateSearchTerm = useCallback(
    (term: string) => {
      setState((prev) => ({
        ...prev,
        searchTerm: term,
        lastKeyTime: Date.now(),
      }));

      // Auto-clear search term after delay
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        disableSearchMode();
      }, typeAheadDelay);
    },
    [typeAheadDelay, disableSearchMode]
  );

  // State queries
  const isSearchActive = useCallback(() => state.searchMode, [state.searchMode]);
  const getSearchTerm = useCallback(() => state.searchTerm, [state.searchTerm]);
  const isHandlerEnabled = useCallback(
    (menuId: string) => {
      const handler = state.handlers.get(menuId);
      return handler?.enabled ?? false;
    },
    [state.handlers]
  );

  // Navigation helpers
  const getNextNavigableItem = useCallback(
    (container: HTMLElement, current: HTMLElement): HTMLElement | null => {
      const items = getNavigableElements(container);
      const currentIndex = items.indexOf(current);

      if (currentIndex === -1) return items[0] || null;

      return items[currentIndex + 1] || items[0]; // Wrap to first
    },
    []
  );

  const getPreviousNavigableItem = useCallback(
    (container: HTMLElement, current: HTMLElement): HTMLElement | null => {
      const items = getNavigableElements(container);
      const currentIndex = items.indexOf(current);

      if (currentIndex === -1) return items[items.length - 1] || null;

      return items[currentIndex - 1] || items[items.length - 1]; // Wrap to last
    },
    []
  );

  const findItemsByText = useCallback(
    (container: HTMLElement, searchText: string): HTMLElement[] => {
      const items = getNavigableElements(container);
      const searchLower = searchText.toLowerCase();

      return items.filter((item) => {
        const text = item.textContent?.toLowerCase() || '';
        return text.includes(searchLower) || text.startsWith(searchLower);
      });
    },
    []
  );

  // Global keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentFocus = focusManager.getFocusedMenuId();

      // Handle global shortcuts first
      for (const [_shortcut, config] of state.globalShortcuts) {
        if (matchesKeyConfig(event, config)) {
          if (config.preventDefault) event.preventDefault();
          if (config.stopPropagation) event.stopPropagation();

          // Trigger action on focused menu if available
          if (currentFocus) {
            triggerAction(currentFocus, config.action, event);
          }
          return;
        }
      }

      // Handle type-ahead search
      if (enableTypeAhead && currentFocus && !state.searchMode) {
        const isNavigationKey = [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Home',
          'End',
          'PageUp',
          'PageDown',
          'Enter',
          'Escape',
          'Tab',
        ].includes(event.key);

        const hasModifiers = event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

        if (!isNavigationKey && !hasModifiers && event.key.length === 1) {
          // Start search mode
          enableSearchMode(currentFocus);
          updateSearchTerm(event.key);
          event.preventDefault();
          return;
        }
      }

      // Handle search mode input
      if (state.searchMode && currentFocus) {
        if (event.key === 'Escape') {
          disableSearchMode();
          event.preventDefault();
          return;
        }

        if (event.key === 'Backspace') {
          const newTerm = state.searchTerm.slice(0, -1);
          if (newTerm) {
            updateSearchTerm(newTerm);
          } else {
            disableSearchMode();
          }
          event.preventDefault();
          return;
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          updateSearchTerm(state.searchTerm + event.key);
          event.preventDefault();
          return;
        }
      }

      // Handle menu-specific keyboard navigation
      if (currentFocus) {
        const handler = state.handlers.get(currentFocus);
        if (handler?.enabled) {
          for (const config of handler.keyConfigs) {
            if (matchesKeyConfig(event, config)) {
              if (config.preventDefault) event.preventDefault();
              if (config.stopPropagation) event.stopPropagation();

              triggerAction(currentFocus, config.action, event);
              return;
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    state.globalShortcuts,
    state.handlers,
    state.searchMode,
    state.searchTerm,
    enableTypeAhead,
    focusManager,
    triggerAction,
    enableSearchMode,
    updateSearchTerm,
    disableSearchMode,
  ]);

  const contextValue: KeyboardNavigationContextValue = {
    registerKeyboardHandler,
    unregisterKeyboardHandler,
    setGlobalShortcut,
    removeGlobalShortcut,
    triggerAction,
    enableSearchMode,
    disableSearchMode,
    updateSearchTerm,
    isSearchActive,
    getSearchTerm,
    isHandlerEnabled,
    getNextNavigableItem,
    getPreviousNavigableItem,
    findItemsByText,
  };

  return (
    <KeyboardNavigationContext.Provider value={contextValue}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};

/**
 * Hook to access keyboard navigation context
 */
export const useKeyboardNavigation = () => {
  const context = useContext(KeyboardNavigationContext);
  if (!context) {
    throw new Error('useKeyboardNavigation must be used within KeyboardNavigationProvider');
  }
  return context;
};

/**
 * Hook for menu components to register keyboard navigation
 */
export const useMenuKeyboard = (
  menuId: string,
  menuType: KeyboardHandler['menuType'],
  onAction: (action: KeyboardAction, event?: KeyboardEvent) => void,
  customKeyConfigs?: KeyConfig[]
) => {
  const navigation = useKeyboardNavigation();
  const coordination = useMenuCoordination();
  const { isMenuActive } = coordination;
  const { registerKeyboardHandler, unregisterKeyboardHandler } = navigation;

  // Auto-register keyboard handler
  useEffect(() => {
    if (isMenuActive(menuId)) {
      const defaultConfigs = DEFAULT_KEY_CONFIGS[menuType] || [];
      const keyConfigs = customKeyConfigs || defaultConfigs;

      registerKeyboardHandler({
        menuId,
        menuType,
        priority: menuType === 'context' ? 1 : menuType === 'navigation' ? 2 : 5,
        keyConfigs: keyConfigs.map((config) => ({ modifiers: {}, ...config })),
        onAction,
        enabled: true,
      });

      return () => {
        unregisterKeyboardHandler(menuId);
      };
    }
  }, [
    menuId,
    menuType,
    onAction,
    customKeyConfigs,
    isMenuActive,
    registerKeyboardHandler,
    unregisterKeyboardHandler,
  ]);

  return {
    triggerAction: (action: KeyboardAction, event?: KeyboardEvent) =>
      navigation.triggerAction(menuId, action, event),
    isSearchActive: navigation.isSearchActive(),
    getSearchTerm: navigation.getSearchTerm(),
    enableSearch: () => navigation.enableSearchMode(menuId),
    disableSearch: navigation.disableSearchMode,
    findItemsByText: navigation.findItemsByText,
    getNextItem: navigation.getNextNavigableItem,
    getPreviousItem: navigation.getPreviousNavigableItem,
  };
};

// Export key configurations for customization
export { DEFAULT_KEY_CONFIGS, NAVIGABLE_SELECTORS };
export type { KeyboardAction, KeyConfig, KeyboardHandler };

// Display name for debugging
KeyboardNavigationProvider.displayName = 'KeyboardNavigationProvider';
