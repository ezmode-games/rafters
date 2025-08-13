/**
 * Focus Manager - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (transparent focus coordination)
 * TRUST BUILDING: Predictable focus behavior builds user confidence
 * ACCESSIBILITY: WCAG AAA focus trap and restoration management
 *
 * Coordinates focus across multiple menu types without conflicts
 * Ensures proper tab order and screen reader navigation
 *
 * Token knowledge: .rafters/tokens/registry.json
 */

import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useMenuCoordination } from './MenuProvider';

// Zod schemas for validation
const FocusElementSchema = z.object({
  element: z.any(), // HTMLElement - can't validate DOM elements with Zod
  menuId: z.string(),
  priority: z.number().min(1).max(10),
  trapFocus: z.boolean().default(false),
  restoreFocus: z.boolean().default(true),
});

const FocusStackEntrySchema = z.object({
  menuId: z.string(),
  previousElement: z.any().optional(), // HTMLElement | null
  trapBoundary: z.any().optional(), // HTMLElement | null
  restoreOnUnmount: z.boolean().default(true),
});

type FocusElement = z.infer<typeof FocusElementSchema>;
type FocusStackEntry = z.infer<typeof FocusStackEntrySchema>;

interface FocusManagerState {
  focusStack: FocusStackEntry[];
  trapActive: boolean;
  currentTrapBoundary: HTMLElement | null;
  announcements: string[];
}

interface FocusManagerContextValue {
  // Focus management
  registerFocusElement: (
    element: HTMLElement,
    menuId: string,
    options?: Partial<FocusElement>
  ) => void;
  unregisterFocusElement: (menuId: string) => void;

  // Focus traps
  createFocusTrap: (boundary: HTMLElement, menuId: string) => void;
  releaseFocusTrap: (menuId: string) => void;

  // Focus restoration
  captureFocus: (menuId: string) => void;
  restoreFocus: (menuId: string) => void;

  // Navigation helpers
  focusFirstTabbable: (container: HTMLElement) => boolean;
  focusLastTabbable: (container: HTMLElement) => boolean;
  getNextTabbable: (current: HTMLElement, container: HTMLElement) => HTMLElement | null;
  getPreviousTabbable: (current: HTMLElement, container: HTMLElement) => HTMLElement | null;

  // State queries
  isTrapActive: () => boolean;
  getCurrentTrapBoundary: () => HTMLElement | null;
  getFocusedMenuId: () => string | null;

  // Accessibility announcements
  announceFocusChange: (message: string, priority?: 'polite' | 'assertive') => void;
}

const FocusManagerContext = createContext<FocusManagerContextValue | null>(null);

// Focus trap utilities
const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const elements = container.querySelectorAll(FOCUSABLE_SELECTORS);
  return Array.from(elements).filter((el) => {
    const element = el as HTMLElement;
    return (
      !element.hasAttribute('disabled') && element.tabIndex !== -1 && isElementVisible(element)
    );
  }) as HTMLElement[];
};

const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetParent !== null;
};

export interface FocusManagerProps {
  children: React.ReactNode;
  onFocusChange?: (menuId: string | null, element: HTMLElement | null) => void;
  announceChanges?: boolean;
}

/**
 * FocusManager - Coordinates focus across all menu types
 * Provides focus traps, restoration, and keyboard navigation
 */
export const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  onFocusChange,
  announceChanges = true,
}) => {
  const coordination = useMenuCoordination();
  const [state, setState] = useState<FocusManagerState>({
    focusStack: [],
    trapActive: false,
    currentTrapBoundary: null,
    announcements: [],
  });

  const focusElementsRef = useRef<Map<string, FocusElement>>(new Map());

  // Register a focusable element for a menu
  const registerFocusElement = useCallback(
    (element: HTMLElement, menuId: string, options: Partial<FocusElement> = {}) => {
      try {
        const focusElement: FocusElement = {
          element,
          menuId,
          priority: options.priority || 5,
          trapFocus: options.trapFocus || false,
          restoreFocus: options.restoreFocus !== false,
        };

        const validated = FocusElementSchema.parse(focusElement);
        focusElementsRef.current.set(menuId, validated);

        onFocusChange?.(menuId, element);
      } catch (error) {
        console.warn('Focus element registration failed:', error);
      }
    },
    [onFocusChange]
  );

  // Unregister focus element
  const unregisterFocusElement = useCallback((menuId: string) => {
    const focusElement = focusElementsRef.current.get(menuId);
    if (focusElement?.restoreFocus) {
      restoreFocus(menuId);
    }

    focusElementsRef.current.delete(menuId);

    // Clean up focus stack
    setState((prev) => ({
      ...prev,
      focusStack: prev.focusStack.filter((entry) => entry.menuId !== menuId),
    }));
  }, []);

  // Create focus trap for a menu
  const createFocusTrap = useCallback(
    (boundary: HTMLElement, menuId: string) => {
      // Only one trap can be active at a time
      if (state.trapActive && state.currentTrapBoundary) {
        return;
      }

      // Capture current focus
      const previousElement = document.activeElement as HTMLElement;

      const stackEntry: FocusStackEntry = {
        menuId,
        previousElement,
        trapBoundary: boundary,
        restoreOnUnmount: true,
      };

      try {
        const validated = FocusStackEntrySchema.parse(stackEntry);

        setState((prev) => ({
          ...prev,
          focusStack: [...prev.focusStack, validated],
          trapActive: true,
          currentTrapBoundary: boundary,
        }));

        // Focus first tabbable element in boundary
        focusFirstTabbable(boundary);

        if (announceChanges) {
          announceFocusChange(`Menu opened: ${menuId}`, 'polite');
        }
      } catch (error) {
        console.warn('Focus trap creation failed:', error);
      }
    },
    [state.trapActive, state.currentTrapBoundary, announceChanges]
  );

  // Release focus trap
  const releaseFocusTrap = useCallback(
    (menuId: string) => {
      const stackEntry = state.focusStack.find((entry) => entry.menuId === menuId);
      if (!stackEntry) return;

      setState((prev) => {
        const newStack = prev.focusStack.filter((entry) => entry.menuId !== menuId);
        const isLastTrap =
          prev.currentTrapBoundary &&
          prev.focusStack[prev.focusStack.length - 1]?.menuId === menuId;

        return {
          ...prev,
          focusStack: newStack,
          trapActive: newStack.length > 0,
          currentTrapBoundary:
            newStack.length > 0 ? newStack[newStack.length - 1].trapBoundary || null : null,
        };
      });

      // Restore focus if needed
      if (stackEntry.restoreOnUnmount && stackEntry.previousElement) {
        try {
          stackEntry.previousElement.focus();
        } catch {
          // Fallback to body if previous element is no longer focusable
          document.body.focus();
        }
      }

      if (announceChanges) {
        announceFocusChange(`Menu closed: ${menuId}`, 'polite');
      }
    },
    [state.focusStack, announceChanges]
  );

  // Capture focus for restoration later
  const captureFocus = useCallback((menuId: string) => {
    const currentElement = document.activeElement as HTMLElement;
    if (currentElement && currentElement !== document.body) {
      const stackEntry: FocusStackEntry = {
        menuId,
        previousElement: currentElement,
        restoreOnUnmount: true,
      };

      try {
        const validated = FocusStackEntrySchema.parse(stackEntry);
        setState((prev) => ({
          ...prev,
          focusStack: [...prev.focusStack, validated],
        }));
      } catch (error) {
        console.warn('Focus capture failed:', error);
      }
    }
  }, []);

  // Restore focus for a menu
  const restoreFocus = useCallback(
    (menuId: string) => {
      const stackEntry = state.focusStack.find((entry) => entry.menuId === menuId);
      if (stackEntry?.previousElement) {
        try {
          stackEntry.previousElement.focus();
        } catch {
          // Element might no longer be focusable
          document.body.focus();
        }
      }
    },
    [state.focusStack]
  );

  // Focus management utilities
  const focusFirstTabbable = useCallback((container: HTMLElement): boolean => {
    const focusables = getFocusableElements(container);
    if (focusables.length > 0) {
      focusables[0].focus();
      return true;
    }
    return false;
  }, []);

  const focusLastTabbable = useCallback((container: HTMLElement): boolean => {
    const focusables = getFocusableElements(container);
    if (focusables.length > 0) {
      focusables[focusables.length - 1].focus();
      return true;
    }
    return false;
  }, []);

  const getNextTabbable = useCallback(
    (current: HTMLElement, container: HTMLElement): HTMLElement | null => {
      const focusables = getFocusableElements(container);
      const currentIndex = focusables.indexOf(current);

      if (currentIndex === -1 || currentIndex === focusables.length - 1) {
        return focusables[0] || null; // Wrap to first
      }

      return focusables[currentIndex + 1] || null;
    },
    []
  );

  const getPreviousTabbable = useCallback(
    (current: HTMLElement, container: HTMLElement): HTMLElement | null => {
      const focusables = getFocusableElements(container);
      const currentIndex = focusables.indexOf(current);

      if (currentIndex === -1 || currentIndex === 0) {
        return focusables[focusables.length - 1] || null; // Wrap to last
      }

      return focusables[currentIndex - 1] || null;
    },
    []
  );

  // State queries
  const isTrapActive = useCallback(() => state.trapActive, [state.trapActive]);

  const getCurrentTrapBoundary = useCallback(
    () => state.currentTrapBoundary,
    [state.currentTrapBoundary]
  );

  const getFocusedMenuId = useCallback((): string | null => {
    const activeElement = document.activeElement;
    if (!activeElement) return null;

    // Find which menu contains the active element
    for (const [menuId, focusElement] of focusElementsRef.current.entries()) {
      if (focusElement.element.contains(activeElement)) {
        return menuId;
      }
    }

    return null;
  }, []);

  // Accessibility announcements
  const announceFocusChange = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!announceChanges) return;

      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only absolute -left-[10000px] w-px h-px overflow-hidden';
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // Remove after announcement
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);

      // Update state for debugging
      setState((prev) => ({
        ...prev,
        announcements: [...prev.announcements.slice(-4), message], // Keep last 5
      }));
    },
    [announceChanges]
  );

  // Handle global keyboard events for focus traps
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!state.trapActive || !state.currentTrapBoundary) return;

      const { key, shiftKey } = event;

      if (key === 'Tab') {
        const focusables = getFocusableElements(state.currentTrapBoundary);
        if (focusables.length === 0) return;

        const activeElement = document.activeElement as HTMLElement;
        const currentIndex = focusables.indexOf(activeElement);

        if (shiftKey) {
          // Shift+Tab - move backwards
          if (currentIndex <= 0) {
            event.preventDefault();
            focusables[focusables.length - 1].focus();
          }
        } else {
          // Tab - move forwards
          if (currentIndex >= focusables.length - 1) {
            event.preventDefault();
            focusables[0].focus();
          }
        }
      } else if (key === 'Escape') {
        // Find the current trapped menu and request its release
        const currentEntry = state.focusStack[state.focusStack.length - 1];
        if (currentEntry) {
          releaseFocusTrap(currentEntry.menuId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.trapActive, state.currentTrapBoundary, state.focusStack, releaseFocusTrap]);

  const contextValue: FocusManagerContextValue = {
    registerFocusElement,
    unregisterFocusElement,
    createFocusTrap,
    releaseFocusTrap,
    captureFocus,
    restoreFocus,
    focusFirstTabbable,
    focusLastTabbable,
    getNextTabbable,
    getPreviousTabbable,
    isTrapActive,
    getCurrentTrapBoundary,
    getFocusedMenuId,
    announceFocusChange,
  };

  return (
    <FocusManagerContext.Provider value={contextValue}>{children}</FocusManagerContext.Provider>
  );
};

/**
 * Hook to access focus management context
 */
export const useFocusManager = () => {
  const context = useContext(FocusManagerContext);
  if (!context) {
    throw new Error('useFocusManager must be used within FocusManager');
  }
  return context;
};

/**
 * Hook for menu components to register focus management
 */
export const useMenuFocus = (menuId: string, containerRef: React.RefObject<HTMLElement>) => {
  const focusManager = useFocusManager();
  const coordination = useMenuCoordination();
  const { isMenuActive } = coordination;
  const { registerFocusElement, unregisterFocusElement } = focusManager;

  // Auto-register when container is available
  useEffect(() => {
    if (containerRef.current && isMenuActive(menuId)) {
      registerFocusElement(containerRef.current, menuId);

      return () => {
        unregisterFocusElement(menuId);
      };
    }
  }, [containerRef.current, menuId, isMenuActive, registerFocusElement, unregisterFocusElement]);

  // Create focus trap when menu requests attention
  const createTrap = useCallback(() => {
    if (containerRef.current) {
      focusManager.createFocusTrap(containerRef.current, menuId);
    }
  }, [containerRef.current, menuId, focusManager]);

  // Release focus trap
  const releaseTrap = useCallback(() => {
    focusManager.releaseFocusTrap(menuId);
  }, [menuId, focusManager]);

  return {
    createTrap,
    releaseTrap,
    captureFocus: () => focusManager.captureFocus(menuId),
    restoreFocus: () => focusManager.restoreFocus(menuId),
    focusFirst: () =>
      containerRef.current ? focusManager.focusFirstTabbable(containerRef.current) : false,
    focusLast: () =>
      containerRef.current ? focusManager.focusLastTabbable(containerRef.current) : false,
    isTrapActive: focusManager.isTrapActive(),
    getCurrentFocus: focusManager.getFocusedMenuId,
  };
};

// Display name for debugging
FocusManager.displayName = 'FocusManager';
