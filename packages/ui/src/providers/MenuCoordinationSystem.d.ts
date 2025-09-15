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
import { type AnnouncementProviderProps } from './AnnouncementProvider';
import { type FocusManagerProps } from './FocusManager';
import { type KeyboardNavigationProviderProps } from './KeyboardNavigationProvider';
import { type MenuProviderProps } from './MenuProvider';
import { type MotionCoordinatorProps } from './MotionCoordinator';
export interface MenuCoordinationSystemProps {
    children: React.ReactNode;
    menuProvider?: Omit<MenuProviderProps, 'children'>;
    focusManager?: Omit<FocusManagerProps, 'children'>;
    keyboardNavigation?: Omit<KeyboardNavigationProviderProps, 'children'>;
    announcements?: Omit<AnnouncementProviderProps, 'children'>;
    motionCoordinator?: Omit<MotionCoordinatorProps, 'children'>;
    enableDebugMode?: boolean;
    onSystemEvent?: (event: MenuCoordinationEvent) => void;
}
export interface MenuCoordinationEvent {
    type: 'menu-registered' | 'menu-unregistered' | 'focus-changed' | 'motion-started' | 'announcement-made';
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
export declare const MenuCoordinationSystem: React.FC<MenuCoordinationSystemProps>;
/**
 * Convenience hooks that combine multiple coordination providers
 */
export declare const useMenuCoordinationSystem: (menuId: string, menuType: string) => {
    menuId: string;
    menuType: string;
};
/**
 * Debug utility for development
 */
export declare const MenuCoordinationDebugger: React.FC<{
    children: React.ReactNode;
}>;
export { MENU_MESSAGES, useAnnouncements, useMenuAnnouncements, } from './AnnouncementProvider';
export { useFocusManager, useMenuFocus, } from './FocusManager';
export { DEFAULT_KEY_CONFIGS, useKeyboardNavigation, useMenuKeyboard, } from './KeyboardNavigationProvider';
export { useMenu, useMenuCoordination, } from './MenuProvider';
export { MOTION_CLASSES, MOTION_DURATIONS, useMenuMotion, useMotionCoordinator, } from './MotionCoordinator';
export type { MenuProviderProps, FocusManagerProps, KeyboardNavigationProviderProps, AnnouncementProviderProps, MotionCoordinatorProps, };
//# sourceMappingURL=MenuCoordinationSystem.d.ts.map