/**
 * Menu Coordination System - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (transparent coordination layer)
 * TRUST BUILDING: Unified system creates predictable menu behavior
 * ACCESSIBILITY: WCAG AAA compliant with comprehensive coordination
 *
 * Master provider that combines all menu coordination providers
 * into a single unified system for consistent menu behavior
 *
 * Token knowledge: .rafters/tokens/registry.json
 */

import type React from 'react';
import { AnnouncementProvider, type AnnouncementProviderProps } from './AnnouncementProvider';
import { FocusManager, type FocusManagerProps } from './FocusManager';
import {
  KeyboardNavigationProvider,
  type KeyboardNavigationProviderProps,
} from './KeyboardNavigationProvider';
import { MenuProvider, type MenuProviderProps } from './MenuProvider';
import { MotionCoordinator, type MotionCoordinatorProps } from './MotionCoordinator';

export interface MenuCoordinationSystemProps {
  children: React.ReactNode;

  // Individual provider configurations
  menuProvider?: Omit<MenuProviderProps, 'children'>;
  focusManager?: Omit<FocusManagerProps, 'children'>;
  keyboardNavigation?: Omit<KeyboardNavigationProviderProps, 'children'>;
  announcements?: Omit<AnnouncementProviderProps, 'children'>;
  motionCoordinator?: Omit<MotionCoordinatorProps, 'children'>;

  // System-wide configuration
  enableDebugMode?: boolean;
  onSystemEvent?: (event: MenuCoordinationEvent) => void;
}

export interface MenuCoordinationEvent {
  type:
    | 'menu-registered'
    | 'menu-unregistered'
    | 'focus-changed'
    | 'motion-started'
    | 'announcement-made';
  menuId: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

/**
 * MenuCoordinationSystem - Master provider for all menu coordination
 *
 * Provides a single provider that wraps all menu coordination providers
 * in the correct order for proper functionality and dependency resolution.
 *
 * Provider order (inside to outside):
 * 1. MenuProvider - Core coordination and cognitive load management
 * 2. FocusManager - Focus traps and restoration
 * 3. KeyboardNavigationProvider - Unified keyboard shortcuts
 * 4. AnnouncementProvider - Screen reader coordination
 * 5. MotionCoordinator - Animation priority and performance
 */
export const MenuCoordinationSystem: React.FC<MenuCoordinationSystemProps> = ({
  children,
  menuProvider,
  focusManager,
  keyboardNavigation,
  announcements,
  motionCoordinator,
  enableDebugMode = false,
  onSystemEvent,
}) => {
  // System event handler
  const handleSystemEvent = (
    type: MenuCoordinationEvent['type'],
    menuId: string,
    details?: Record<string, unknown>
  ) => {
    const event: MenuCoordinationEvent = {
      type,
      menuId,
      timestamp: Date.now(),
      details,
    };

    if (enableDebugMode) {
      console.debug('MenuCoordinationSystem Event:', event);
    }

    onSystemEvent?.(event);
  };

  // Enhanced provider props with system event handling
  const enhancedMenuProvider: MenuProviderProps = {
    ...menuProvider,
    onLoadExceeded: (current, max) => {
      handleSystemEvent('menu-registered', 'system', { currentLoad: current, maxLoad: max });
      menuProvider?.onLoadExceeded?.(current, max);
    },
    children: <></>,
  };

  const enhancedFocusManager: FocusManagerProps = {
    ...focusManager,
    onFocusChange: (menuId, element) => {
      if (menuId) {
        handleSystemEvent('focus-changed', menuId, { element: element?.tagName });
      }
      focusManager?.onFocusChange?.(menuId, element);
    },
    children: <></>,
  };

  const enhancedKeyboardNavigation: KeyboardNavigationProviderProps = {
    ...keyboardNavigation,
    onGlobalKeyAction: (action, menuId, event) => {
      handleSystemEvent('focus-changed', menuId, { action, key: event.key });
      keyboardNavigation?.onGlobalKeyAction?.(action, menuId, event);
    },
    children: <></>,
  };

  const enhancedAnnouncements: AnnouncementProviderProps = {
    ...announcements,
    onAnnouncement: (announcement) => {
      handleSystemEvent('announcement-made', announcement.menuId || 'system', {
        type: announcement.type,
        priority: announcement.priority,
      });
      announcements?.onAnnouncement?.(announcement);
    },
    children: <></>,
  };

  const enhancedMotionCoordinator: MotionCoordinatorProps = {
    ...motionCoordinator,
    onAnimationStart: (request) => {
      handleSystemEvent('motion-started', request.menuId, {
        type: request.type,
        duration: request.duration,
      });
      motionCoordinator?.onAnimationStart?.(request);
    },
    onAnimationComplete: (request) => {
      handleSystemEvent('motion-started', request.menuId, {
        type: request.type,
        completed: true,
      });
      motionCoordinator?.onAnimationComplete?.(request);
    },
    children: <></>,
  };

  return (
    <MenuProvider {...enhancedMenuProvider}>
      <FocusManager {...enhancedFocusManager}>
        <KeyboardNavigationProvider {...enhancedKeyboardNavigation}>
          <AnnouncementProvider {...enhancedAnnouncements}>
            <MotionCoordinator {...enhancedMotionCoordinator}>{children}</MotionCoordinator>
          </AnnouncementProvider>
        </KeyboardNavigationProvider>
      </FocusManager>
    </MenuProvider>
  );
};

/**
 * Convenience hooks that combine multiple coordination providers
 */
export const useMenuCoordinationSystem = (menuId: string, menuType: string) => {
  // This would be implemented to combine all the individual hooks
  // For now, we'll export the individual hooks for direct use
  return {
    menuId,
    menuType,
    // Individual hooks should be used directly:
    // useMenu, useMenuFocus, useMenuKeyboard, useMenuAnnouncements, useMenuMotion
  };
};

/**
 * Debug utility for development
 */
export const MenuCoordinationDebugger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MenuCoordinationSystem
      enableDebugMode={true}
      onSystemEvent={(event) => {
        console.group(`🎛️ Menu Coordination: ${event.type}`);
        console.log('Menu ID:', event.menuId);
        console.log('Timestamp:', new Date(event.timestamp).toISOString());
        if (event.details) {
          console.log('Details:', event.details);
        }
        console.groupEnd();
      }}
    >
      {children}
    </MenuCoordinationSystem>
  );
};

// Export all coordination hooks for convenience
export {
  // Core coordination
  useMenuCoordination,
  useMenu,
} from './MenuProvider';

export {
  // Focus management
  useFocusManager,
  useMenuFocus,
} from './FocusManager';

export {
  // Keyboard navigation
  useKeyboardNavigation,
  useMenuKeyboard,
  DEFAULT_KEY_CONFIGS,
} from './KeyboardNavigationProvider';

export {
  // Announcements
  useAnnouncements,
  useMenuAnnouncements,
  MENU_MESSAGES,
} from './AnnouncementProvider';

export {
  // Motion coordination
  useMotionCoordinator,
  useMenuMotion,
  MOTION_DURATIONS,
  MOTION_CLASSES,
} from './MotionCoordinator';

// Export provider types for TypeScript
export type {
  MenuProviderProps,
  FocusManagerProps,
  KeyboardNavigationProviderProps,
  AnnouncementProviderProps,
  MotionCoordinatorProps,
};

// Display name for debugging
MenuCoordinationSystem.displayName = 'MenuCoordinationSystem';
