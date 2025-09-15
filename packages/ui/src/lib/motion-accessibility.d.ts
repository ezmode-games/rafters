/**
 * Motion Accessibility Utilities
 *
 * Comprehensive accessibility support for menu motion intelligence
 * Ensures WCAG AAA compliance and Section 508 requirements
 */
export type MotionLevel = 'none' | 'reduced' | 'full';
export type InteractionType = 'navigation' | 'feedback' | 'decoration' | 'essential';
export type TrustLevel = 'low' | 'medium' | 'high' | 'critical';
export interface AccessibleMotionConfig {
    cognitiveLoad: number;
    trustLevel: TrustLevel;
    interactionType: InteractionType;
    respectsReducedMotion?: boolean;
    fallbackMotion?: boolean;
}
export interface AccessibleMotionResult {
    motionLevel: MotionLevel;
    getMotionClass: (duration: string) => string;
    shouldAnimate: boolean;
    announceMotionChange: (message: string, priority?: 'polite' | 'assertive') => void;
}
/**
 * Hook for accessible motion handling in menu components
 * Automatically adapts to user preferences and accessibility needs
 */
export declare function useAccessibleMotion(config: AccessibleMotionConfig): AccessibleMotionResult;
/**
 * Menu-specific motion accessibility configurations
 */
export declare const menuMotionConfigs: {
    readonly dropdown: {
        readonly cognitiveLoad: 4;
        readonly trustLevel: TrustLevel;
        readonly interactionType: InteractionType;
        readonly respectsReducedMotion: true;
        readonly fallbackMotion: true;
    };
    readonly navigation: {
        readonly cognitiveLoad: 5;
        readonly trustLevel: TrustLevel;
        readonly interactionType: InteractionType;
        readonly respectsReducedMotion: true;
        readonly fallbackMotion: true;
    };
    readonly context: {
        readonly cognitiveLoad: 5;
        readonly trustLevel: TrustLevel;
        readonly interactionType: InteractionType;
        readonly respectsReducedMotion: true;
        readonly fallbackMotion: false;
    };
    readonly breadcrumb: {
        readonly cognitiveLoad: 1;
        readonly trustLevel: TrustLevel;
        readonly interactionType: InteractionType;
        readonly respectsReducedMotion: true;
        readonly fallbackMotion: true;
    };
};
/**
 * Focus management for accessible menu motion
 * Ensures focus indicators appear instantly without animation
 */
export declare function getFocusMotionClass(): string;
/**
 * Get safe motion classes that respect user preferences
 * Automatically handles prefers-reduced-motion fallbacks
 */
export declare function getSafeMotionClass(baseClass: string, options?: {
    reducedMotionClass?: string;
    noMotionClass?: string;
    cognitiveLoad?: number;
}): string;
/**
 * Vestibular disorder protection
 * Prevents problematic motion patterns that can trigger vestibular symptoms
 */
export declare function getVestibularSafeMotion(baseMotion: string): string;
/**
 * Performance-aware motion detection
 * Reduces motion complexity on low-performance devices
 */
export declare function usePerformanceAwareMotion(): {
    performanceLevel: "medium" | "low" | "high";
    getPerformanceMotionClass: (baseClass: string) => string;
};
/**
 * Menu motion coordination for accessibility
 * Manages cognitive load and prevents motion conflicts
 */
export declare class MenuMotionCoordinator {
    private activeMenus;
    private cognitiveLoadBudget;
    private currentLoad;
    private motionPriority;
    /**
     * Register a menu as active
     */
    registerMenu(menuId: string, cognitiveLoad: number, priority: number): boolean;
    /**
     * Unregister a menu
     */
    unregisterMenu(menuId: string, cognitiveLoad: number): void;
    /**
     * Check if a menu has motion priority
     */
    hasMotionPriority(menuId: string): boolean;
    /**
     * Get motion class for a menu based on its priority status
     */
    getMotionClassForMenu(menuId: string, baseClass: string): string;
    private reduceSecondaryMenuMotion;
    private findHighestPriorityMenu;
    private getPriorityFor;
}
export declare const globalMenuCoordinator: MenuMotionCoordinator;
/**
 * Motion accessibility testing utilities
 */
export declare const motionAccessibilityTests: {
    /**
     * Test that all motion respects prefers-reduced-motion
     */
    testReducedMotionCompliance: (element: HTMLElement) => boolean;
    /**
     * Test that focus indicators appear instantly
     */
    testFocusIndicatorTiming: (element: HTMLElement) => boolean;
    /**
     * Test cognitive load budget compliance
     */
    testCognitiveLoadBudget: (elements: HTMLElement[]) => boolean;
};
declare const _default: {
    useAccessibleMotion: typeof useAccessibleMotion;
    menuMotionConfigs: {
        readonly dropdown: {
            readonly cognitiveLoad: 4;
            readonly trustLevel: TrustLevel;
            readonly interactionType: InteractionType;
            readonly respectsReducedMotion: true;
            readonly fallbackMotion: true;
        };
        readonly navigation: {
            readonly cognitiveLoad: 5;
            readonly trustLevel: TrustLevel;
            readonly interactionType: InteractionType;
            readonly respectsReducedMotion: true;
            readonly fallbackMotion: true;
        };
        readonly context: {
            readonly cognitiveLoad: 5;
            readonly trustLevel: TrustLevel;
            readonly interactionType: InteractionType;
            readonly respectsReducedMotion: true;
            readonly fallbackMotion: false;
        };
        readonly breadcrumb: {
            readonly cognitiveLoad: 1;
            readonly trustLevel: TrustLevel;
            readonly interactionType: InteractionType;
            readonly respectsReducedMotion: true;
            readonly fallbackMotion: true;
        };
    };
    getFocusMotionClass: typeof getFocusMotionClass;
    getSafeMotionClass: typeof getSafeMotionClass;
    getVestibularSafeMotion: typeof getVestibularSafeMotion;
    usePerformanceAwareMotion: typeof usePerformanceAwareMotion;
    MenuMotionCoordinator: typeof MenuMotionCoordinator;
    globalMenuCoordinator: MenuMotionCoordinator;
    motionAccessibilityTests: {
        /**
         * Test that all motion respects prefers-reduced-motion
         */
        testReducedMotionCompliance: (element: HTMLElement) => boolean;
        /**
         * Test that focus indicators appear instantly
         */
        testFocusIndicatorTiming: (element: HTMLElement) => boolean;
        /**
         * Test cognitive load budget compliance
         */
        testCognitiveLoadBudget: (elements: HTMLElement[]) => boolean;
    };
};
export default _default;
//# sourceMappingURL=motion-accessibility.d.ts.map