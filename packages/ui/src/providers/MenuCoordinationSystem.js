import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { AnnouncementProvider } from './AnnouncementProvider';
import { FocusManager } from './FocusManager';
import { KeyboardNavigationProvider, } from './KeyboardNavigationProvider';
import { MenuProvider } from './MenuProvider';
import { MotionCoordinator } from './MotionCoordinator';
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
export const MenuCoordinationSystem = ({ children, menuProvider, focusManager, keyboardNavigation, announcements, motionCoordinator, enableDebugMode = false, onSystemEvent, }) => {
    // System event handler
    const handleSystemEvent = (type, menuId, details) => {
        const event = {
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
    const enhancedMenuProvider = {
        ...menuProvider,
        onLoadExceeded: (current, max) => {
            handleSystemEvent('menu-registered', 'system', {
                currentLoad: current,
                maxLoad: max,
            });
            menuProvider?.onLoadExceeded?.(current, max);
        },
        children: _jsx(_Fragment, {}),
    };
    const enhancedFocusManager = {
        ...focusManager,
        onFocusChange: (menuId, element) => {
            if (menuId) {
                handleSystemEvent('focus-changed', menuId, {
                    element: element?.tagName,
                });
            }
            focusManager?.onFocusChange?.(menuId, element);
        },
        children: _jsx(_Fragment, {}),
    };
    const enhancedKeyboardNavigation = {
        ...keyboardNavigation,
        onGlobalKeyAction: (action, menuId, event) => {
            handleSystemEvent('focus-changed', menuId, { action, key: event.key });
            keyboardNavigation?.onGlobalKeyAction?.(action, menuId, event);
        },
        children: _jsx(_Fragment, {}),
    };
    const enhancedAnnouncements = {
        ...announcements,
        onAnnouncement: (announcement) => {
            handleSystemEvent('announcement-made', announcement.menuId || 'system', {
                type: announcement.type,
                priority: announcement.priority,
            });
            announcements?.onAnnouncement?.(announcement);
        },
        children: _jsx(_Fragment, {}),
    };
    const enhancedMotionCoordinator = {
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
        children: _jsx(_Fragment, {}),
    };
    return (_jsx(MenuProvider, { ...enhancedMenuProvider, children: _jsx(FocusManager, { ...enhancedFocusManager, children: _jsx(KeyboardNavigationProvider, { ...enhancedKeyboardNavigation, children: _jsx(AnnouncementProvider, { ...enhancedAnnouncements, children: _jsx(MotionCoordinator, { ...enhancedMotionCoordinator, children: children }) }) }) }) }));
};
/**
 * Convenience hooks that combine multiple coordination providers
 */
export const useMenuCoordinationSystem = (menuId, menuType) => {
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
export const MenuCoordinationDebugger = ({ children }) => {
    return (_jsx(MenuCoordinationSystem, { enableDebugMode: true, onSystemEvent: (event) => {
            console.group(`🎛️ Menu Coordination: ${event.type}`);
            console.log('Menu ID:', event.menuId);
            console.log('Timestamp:', new Date(event.timestamp).toISOString());
            if (event.details) {
                console.log('Details:', event.details);
            }
            console.groupEnd();
        }, children: children }));
};
export { MENU_MESSAGES, 
// Announcements
useAnnouncements, useMenuAnnouncements, } from './AnnouncementProvider';
export { 
// Focus management
useFocusManager, useMenuFocus, } from './FocusManager';
export { DEFAULT_KEY_CONFIGS, 
// Keyboard navigation
useKeyboardNavigation, useMenuKeyboard, } from './KeyboardNavigationProvider';
// Export all coordination hooks for convenience
export { useMenu, 
// Core coordination
useMenuCoordination, } from './MenuProvider';
export { MOTION_CLASSES, MOTION_DURATIONS, useMenuMotion, 
// Motion coordination
useMotionCoordinator, } from './MotionCoordinator';
// Display name for debugging
MenuCoordinationSystem.displayName = 'MenuCoordinationSystem';
//# sourceMappingURL=MenuCoordinationSystem.js.map