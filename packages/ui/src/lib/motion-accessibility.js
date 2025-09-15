/**
 * Motion Accessibility Utilities
 *
 * Comprehensive accessibility support for menu motion intelligence
 * Ensures WCAG AAA compliance and Section 508 requirements
 */
import { useEffect, useMemo, useState } from 'react';
/**
 * Hook for accessible motion handling in menu components
 * Automatically adapts to user preferences and accessibility needs
 */
export function useAccessibleMotion(config) {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [motionLevel, setMotionLevel] = useState('full');
    // Check for prefers-reduced-motion on mount and when it changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e) => {
            setPrefersReducedMotion(e.matches);
        };
        setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    // Determine motion level based on user preferences and content requirements
    const calculatedMotionLevel = useMemo(() => {
        // Critical interactions may require some motion even in reduced mode
        if (config.interactionType === 'essential' && config.trustLevel === 'critical') {
            return prefersReducedMotion ? 'reduced' : 'full';
        }
        // High cognitive load automatically reduces motion
        if (config.cognitiveLoad >= 8) {
            return prefersReducedMotion ? 'none' : 'reduced';
        }
        // User preference takes precedence for non-essential interactions
        if (prefersReducedMotion) {
            return config.interactionType === 'navigation' || config.interactionType === 'feedback'
                ? 'reduced'
                : 'none';
        }
        return 'full';
    }, [prefersReducedMotion, config]);
    useEffect(() => {
        setMotionLevel(calculatedMotionLevel);
    }, [calculatedMotionLevel]);
    /**
     * Generate appropriate motion class based on motion level and duration
     */
    const getMotionClass = (duration) => {
        switch (motionLevel) {
            case 'none':
                return 'duration-0 transition-opacity';
            case 'reduced':
                // Use minimal duration for essential feedback
                if (config.interactionType === 'essential') {
                    return 'duration-75 transition-all motion-reduce:duration-0';
                }
                return 'duration-150 transition-colors motion-reduce:duration-0';
            default:
                return `${duration} transition-all motion-reduce:duration-0`;
        }
    };
    /**
     * Announce motion changes to screen readers
     */
    const announceMotionChange = (message, priority = 'polite') => {
        // Only announce significant motion changes
        if (motionLevel === 'none' || config.interactionType === 'decoration') {
            return;
        }
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    const shouldAnimate = motionLevel !== 'none';
    return {
        motionLevel,
        getMotionClass,
        shouldAnimate,
        announceMotionChange,
    };
}
/**
 * Menu-specific motion accessibility configurations
 */
export const menuMotionConfigs = {
    dropdown: {
        cognitiveLoad: 4,
        trustLevel: 'medium',
        interactionType: 'navigation',
        respectsReducedMotion: true,
        fallbackMotion: true,
    },
    navigation: {
        cognitiveLoad: 5,
        trustLevel: 'high',
        interactionType: 'navigation',
        respectsReducedMotion: true,
        fallbackMotion: true,
    },
    context: {
        cognitiveLoad: 5,
        trustLevel: 'high',
        interactionType: 'essential',
        respectsReducedMotion: true,
        fallbackMotion: false, // Context menus need immediate feedback
    },
    breadcrumb: {
        cognitiveLoad: 1,
        trustLevel: 'high',
        interactionType: 'navigation',
        respectsReducedMotion: true,
        fallbackMotion: true,
    },
};
/**
 * Focus management for accessible menu motion
 * Ensures focus indicators appear instantly without animation
 */
export function getFocusMotionClass() {
    return 'focus-visible:duration-0 focus-visible:transition-none';
}
/**
 * Get safe motion classes that respect user preferences
 * Automatically handles prefers-reduced-motion fallbacks
 */
export function getSafeMotionClass(baseClass, options = {}) {
    const { reducedMotionClass = 'motion-reduce:duration-75', noMotionClass = 'motion-reduce:duration-0', cognitiveLoad = 3, } = options;
    // High cognitive load automatically gets reduced motion
    if (cognitiveLoad >= 8) {
        return `${baseClass} ${reducedMotionClass} ${noMotionClass}`;
    }
    return `${baseClass} ${noMotionClass}`;
}
/**
 * Vestibular disorder protection
 * Prevents problematic motion patterns that can trigger vestibular symptoms
 */
export function getVestibularSafeMotion(baseMotion) {
    // Remove transforms that can trigger vestibular issues
    const safeMotion = baseMotion
        .replace(/scale-\d+/g, '') // Remove scaling
        .replace(/rotate-\d+/g, '') // Remove rotation
        .replace(/translate-[xy]-\d+/g, '') // Remove translation
        .replace(/transform/g, 'opacity'); // Use opacity instead
    return `${safeMotion} motion-reduce:duration-0`;
}
/**
 * Performance-aware motion detection
 * Reduces motion complexity on low-performance devices
 */
export function usePerformanceAwareMotion() {
    const [performanceLevel, setPerformanceLevel] = useState('high');
    useEffect(() => {
        // Detect performance capabilities
        const detectPerformance = () => {
            // Check device memory (if available)
            const deviceMemory = navigator.deviceMemory;
            // Check CPU cores (if available)
            const hardwareConcurrency = navigator.hardwareConcurrency || 2;
            // Check connection speed (if available)
            const connection = navigator.connection;
            const effectiveType = connection?.effectiveType;
            // Simple performance scoring
            let score = 0;
            if (deviceMemory && deviceMemory >= 4)
                score += 2;
            else if (deviceMemory && deviceMemory >= 2)
                score += 1;
            if (hardwareConcurrency >= 4)
                score += 2;
            else if (hardwareConcurrency >= 2)
                score += 1;
            if (effectiveType === '4g')
                score += 2;
            else if (effectiveType === '3g')
                score += 1;
            if (score >= 4)
                setPerformanceLevel('high');
            else if (score >= 2)
                setPerformanceLevel('medium');
            else
                setPerformanceLevel('low');
        };
        detectPerformance();
    }, []);
    const getPerformanceMotionClass = (baseClass) => {
        switch (performanceLevel) {
            case 'low':
                return 'duration-150 transition-opacity'; // Minimal motion
            case 'medium':
                return `duration-200 transition-colors ${baseClass}`.replace(/duration-\d+/, 'duration-200');
            default:
                return baseClass;
        }
    };
    return {
        performanceLevel,
        getPerformanceMotionClass,
    };
}
/**
 * Menu motion coordination for accessibility
 * Manages cognitive load and prevents motion conflicts
 */
export class MenuMotionCoordinator {
    activeMenus = new Set();
    cognitiveLoadBudget = 15;
    currentLoad = 0;
    motionPriority = null;
    /**
     * Register a menu as active
     */
    registerMenu(menuId, cognitiveLoad, priority) {
        // Check if adding this menu would exceed budget
        if (this.currentLoad + cognitiveLoad > this.cognitiveLoadBudget) {
            // Try to reduce motion of other menus
            this.reduceSecondaryMenuMotion();
            // If still over budget, reject
            if (this.currentLoad + cognitiveLoad > this.cognitiveLoadBudget) {
                return false;
            }
        }
        this.activeMenus.add(menuId);
        this.currentLoad += cognitiveLoad;
        // Update motion priority if this menu has higher priority
        if (!this.motionPriority || priority < this.getPriorityFor(this.motionPriority)) {
            this.motionPriority = menuId;
        }
        return true;
    }
    /**
     * Unregister a menu
     */
    unregisterMenu(menuId, cognitiveLoad) {
        if (this.activeMenus.has(menuId)) {
            this.activeMenus.delete(menuId);
            this.currentLoad -= cognitiveLoad;
            // Update motion priority if this was the priority menu
            if (this.motionPriority === menuId) {
                this.motionPriority = this.findHighestPriorityMenu();
            }
        }
    }
    /**
     * Check if a menu has motion priority
     */
    hasMotionPriority(menuId) {
        return this.motionPriority === menuId;
    }
    /**
     * Get motion class for a menu based on its priority status
     */
    getMotionClassForMenu(menuId, baseClass) {
        if (this.hasMotionPriority(menuId)) {
            return baseClass; // Full motion for priority menu
        }
        if (this.activeMenus.has(menuId)) {
            return getSafeMotionClass(baseClass, {
                reducedMotionClass: 'duration-75',
                cognitiveLoad: 3, // Reduced load for secondary menus
            });
        }
        return 'duration-0'; // No motion for inactive menus
    }
    reduceSecondaryMenuMotion() {
        // Implementation would reduce motion complexity of non-priority menus
        // This is a simplified version - actual implementation would track
        // individual menu loads and reduce them systematically
        const reductionFactor = 0.5;
        this.currentLoad = Math.ceil(this.currentLoad * reductionFactor);
    }
    findHighestPriorityMenu() {
        // Find the active menu with highest priority (lowest number)
        // This would need to be implemented based on actual priority tracking
        return this.activeMenus.size > 0 ? Array.from(this.activeMenus)[0] : null;
    }
    getPriorityFor(_menuId) {
        // This would return the actual priority for the menu
        // For now, returning a default value
        return 5;
    }
}
// Global coordinator instance
export const globalMenuCoordinator = new MenuMotionCoordinator();
/**
 * Motion accessibility testing utilities
 */
export const motionAccessibilityTests = {
    /**
     * Test that all motion respects prefers-reduced-motion
     */
    testReducedMotionCompliance: (element) => {
        const computedStyle = window.getComputedStyle(element);
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            const duration = computedStyle.transitionDuration;
            return duration === '0s' || duration === '0ms';
        }
        return true; // If not in reduced motion mode, pass the test
    },
    /**
     * Test that focus indicators appear instantly
     */
    testFocusIndicatorTiming: (element) => {
        element.focus();
        const computedStyle = window.getComputedStyle(element, ':focus-visible');
        const duration = computedStyle.transitionDuration;
        return duration === '0s' || duration === '0ms';
    },
    /**
     * Test cognitive load budget compliance
     */
    testCognitiveLoadBudget: (elements) => {
        let totalLoad = 0;
        for (const element of elements) {
            const loadAttribute = element.getAttribute('data-cognitive-load');
            if (loadAttribute) {
                totalLoad += Number.parseInt(loadAttribute, 10);
            }
        }
        return totalLoad <= 15; // Maximum cognitive load budget
    },
};
export default {
    useAccessibleMotion,
    menuMotionConfigs,
    getFocusMotionClass,
    getSafeMotionClass,
    getVestibularSafeMotion,
    usePerformanceAwareMotion,
    MenuMotionCoordinator,
    globalMenuCoordinator,
    motionAccessibilityTests,
};
//# sourceMappingURL=motion-accessibility.js.map