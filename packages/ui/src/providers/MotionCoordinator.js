import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { globalMenuCoordinator, menuMotionConfigs, useAccessibleMotion, usePerformanceAwareMotion, } from '../lib/motion-accessibility';
import { useMenuCoordination } from './MenuProvider';
// Zod schemas for validation
const MotionPrioritySchema = z.number().min(1).max(10);
const MotionTypeSchema = z.enum(['enter', 'exit', 'move', 'scale', 'fade', 'slide', 'bounce']);
const MotionDurationSchema = z.enum(['instant', 'fast', 'standard', 'slow', 'custom']);
const AnimationRequestSchema = z.object({
    id: z.string(),
    menuId: z.string(),
    type: MotionTypeSchema,
    duration: MotionDurationSchema,
    customDuration: z.number().min(0).max(2000).optional(),
    priority: MotionPrioritySchema,
    cognitiveLoad: z.number().min(1).max(10),
    trustLevel: z.enum(['low', 'medium', 'high', 'critical']),
    canBeReduced: z.boolean().default(true),
    onStart: z.any().optional(), // Function
    onComplete: z.any().optional(), // Function
    timestamp: z.number(),
});
const MotionBudgetSchema = z.object({
    maxConcurrentAnimations: z.number().min(1).max(5).default(3),
    maxTotalCognitiveLoad: z.number().min(5).max(20).default(15),
    performanceBudget: z.number().min(8.33).max(33.33).default(16.67), // ms per frame (60fps = 16.67ms)
    enableGpuAcceleration: z.boolean().default(true),
    respectReducedMotion: z.boolean().default(true),
});
const MotionCoordinatorContext = createContext(null);
// Motion timing configurations
const MOTION_DURATIONS = {
    instant: 0,
    fast: 150,
    standard: 300,
    slow: 500,
};
// CSS classes for different motion types
const MOTION_CLASSES = {
    enter: {
        instant: 'duration-0',
        fast: 'duration-150 ease-out',
        standard: 'duration-300 ease-out',
        slow: 'duration-500 ease-out',
    },
    exit: {
        instant: 'duration-0',
        fast: 'duration-75 ease-in',
        standard: 'duration-200 ease-in',
        slow: 'duration-300 ease-in',
    },
    move: {
        instant: 'duration-0',
        fast: 'duration-150 ease-in-out',
        standard: 'duration-300 ease-in-out',
        slow: 'duration-500 ease-in-out',
    },
    scale: {
        instant: 'duration-0',
        fast: 'duration-150 ease-out transform-gpu',
        standard: 'duration-300 ease-out transform-gpu',
        slow: 'duration-500 ease-out transform-gpu',
    },
    fade: {
        instant: 'duration-0',
        fast: 'duration-150 transition-opacity',
        standard: 'duration-300 transition-opacity',
        slow: 'duration-500 transition-opacity',
    },
    slide: {
        instant: 'duration-0',
        fast: 'duration-150 ease-out transform-gpu',
        standard: 'duration-300 ease-out transform-gpu',
        slow: 'duration-500 ease-out transform-gpu',
    },
    bounce: {
        instant: 'duration-0',
        fast: 'duration-200 ease-bounce',
        standard: 'duration-400 ease-bounce',
        slow: 'duration-600 ease-bounce',
    },
};
// Utility functions
const generateAnimationId = () => `motion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const estimateAnimationDuration = (request) => {
    if (request.duration === 'custom' && request.customDuration) {
        return request.customDuration;
    }
    return MOTION_DURATIONS[request.duration] || MOTION_DURATIONS.standard;
};
const calculateCognitiveLoad = (type, duration, priority) => {
    let baseLoad = 2; // Base cognitive load for any motion
    // Motion type impacts
    const typeMultipliers = {
        fade: 1,
        slide: 1.5,
        move: 1.5,
        scale: 2,
        bounce: 3,
        enter: 1.2,
        exit: 1,
    };
    baseLoad *= typeMultipliers[type] || 1;
    // Duration impact (longer = more cognitive load)
    if (duration > 400)
        baseLoad += 2;
    else if (duration > 200)
        baseLoad += 1;
    // Priority impact (higher priority can handle more load)
    const priorityAdjustment = Math.max(0, 5 - priority);
    baseLoad += priorityAdjustment * 0.5;
    return Math.min(Math.round(baseLoad), 10);
};
/**
 * MotionCoordinator - Central animation coordination for all menu types
 * Manages motion priority, performance budgets, and accessibility compliance
 */
export const MotionCoordinator = ({ children, budget: initialBudget, onAnimationStart, onAnimationComplete, onBudgetExceeded, }) => {
    const coordination = useMenuCoordination();
    const { performanceLevel, getPerformanceMotionClass } = usePerformanceAwareMotion();
    const [state, setState] = useState(() => ({
        activeAnimations: new Map(),
        queue: [],
        budget: MotionBudgetSchema.parse(initialBudget || {}),
        currentLoad: 0,
        motionPriorityOwner: null,
        performanceMode: performanceLevel,
    }));
    const pausedRef = useRef(false);
    const coordinatorRef = useRef(globalMenuCoordinator);
    // Update performance mode when it changes
    useEffect(() => {
        setState((prev) => ({ ...prev, performanceMode: performanceLevel }));
    }, [performanceLevel]);
    // Request animation
    const requestAnimation = useCallback(async (request) => {
        if (pausedRef.current)
            return null;
        const animationRequest = {
            ...request,
            id: generateAnimationId(),
            timestamp: Date.now(),
        };
        try {
            const validated = AnimationRequestSchema.parse(animationRequest);
            const estimatedDuration = estimateAnimationDuration(validated);
            const calculatedCognitiveLoad = calculateCognitiveLoad(validated.type, estimatedDuration, validated.priority);
            // Check if we can accommodate this animation
            const newTotalLoad = state.currentLoad + calculatedCognitiveLoad;
            const activeCount = state.activeAnimations.size;
            // Check budget constraints
            if (newTotalLoad > state.budget.maxTotalCognitiveLoad ||
                activeCount >= state.budget.maxConcurrentAnimations) {
                // Try to reduce motion of lower priority animations
                let reducedLoad = 0;
                for (const [_id, animation] of state.activeAnimations) {
                    if (animation.request.priority > validated.priority && animation.request.canBeReduced) {
                        // This would require actual animation modification - simplified for now
                        reducedLoad += 1;
                    }
                }
                if (newTotalLoad - reducedLoad > state.budget.maxTotalCognitiveLoad) {
                    // Queue the animation
                    setState((prev) => ({
                        ...prev,
                        queue: [...prev.queue, validated],
                    }));
                    onBudgetExceeded?.(newTotalLoad, state.budget.maxTotalCognitiveLoad);
                    return validated.id;
                }
            }
            // Register with global coordinator
            const registered = coordinatorRef.current.registerMenu(validated.menuId, calculatedCognitiveLoad, validated.priority);
            if (!registered) {
                // Queue if coordinator rejects
                setState((prev) => ({
                    ...prev,
                    queue: [...prev.queue, validated],
                }));
                return validated.id;
            }
            // Create active animation
            const activeAnimation = {
                request: validated,
                startTime: Date.now(),
                estimatedEndTime: Date.now() + estimatedDuration,
            };
            setState((prev) => {
                const newAnimations = new Map(prev.activeAnimations);
                newAnimations.set(validated.id, activeAnimation);
                return {
                    ...prev,
                    activeAnimations: newAnimations,
                    currentLoad: prev.currentLoad + calculatedCognitiveLoad,
                };
            });
            // Start animation
            validated.onStart?.(validated);
            onAnimationStart?.(validated);
            // Schedule completion
            setTimeout(() => {
                setState((prev) => {
                    const animation = prev.activeAnimations.get(validated.id);
                    if (!animation)
                        return prev;
                    const newAnimations = new Map(prev.activeAnimations);
                    newAnimations.delete(validated.id);
                    // Process queue if space available
                    let newQueue = prev.queue;
                    if (newQueue.length > 0 && newAnimations.size < prev.budget.maxConcurrentAnimations) {
                        const nextRequest = newQueue[0];
                        // Recursively request the next animation
                        setTimeout(() => requestAnimation(nextRequest), 0);
                        newQueue = newQueue.slice(1);
                    }
                    return {
                        ...prev,
                        activeAnimations: newAnimations,
                        currentLoad: prev.currentLoad - calculatedCognitiveLoad,
                        queue: newQueue,
                    };
                });
                // Complete animation
                validated.onComplete?.(validated);
                onAnimationComplete?.(validated);
                // Unregister from global coordinator
                coordinatorRef.current.unregisterMenu(validated.menuId, calculatedCognitiveLoad);
            }, estimatedDuration);
            return validated.id;
        }
        catch (error) {
            console.warn('Animation request validation failed:', error);
            return null;
        }
    }, [
        state.currentLoad,
        state.activeAnimations,
        state.budget,
        onAnimationStart,
        onAnimationComplete,
        onBudgetExceeded,
    ]);
    // Cancel animation
    const cancelAnimation = useCallback((id) => {
        const animation = state.activeAnimations.get(id);
        if (!animation)
            return false;
        setState((prev) => {
            const newAnimations = new Map(prev.activeAnimations);
            newAnimations.delete(id);
            const cognitiveLoad = calculateCognitiveLoad(animation.request.type, estimateAnimationDuration(animation.request), animation.request.priority);
            return {
                ...prev,
                activeAnimations: newAnimations,
                currentLoad: prev.currentLoad - cognitiveLoad,
            };
        });
        // Cleanup
        animation.cleanup?.();
        coordinatorRef.current.unregisterMenu(animation.request.menuId, calculateCognitiveLoad(animation.request.type, estimateAnimationDuration(animation.request), animation.request.priority));
        return true;
    }, [state.activeAnimations]);
    // Cancel all animations for a menu
    const cancelAnimationsForMenu = useCallback((menuId) => {
        let canceledCount = 0;
        for (const [id, animation] of state.activeAnimations) {
            if (animation.request.menuId === menuId) {
                if (cancelAnimation(id)) {
                    canceledCount++;
                }
            }
        }
        // Remove from queue as well
        setState((prev) => ({
            ...prev,
            queue: prev.queue.filter((request) => request.menuId !== menuId),
        }));
        return canceledCount;
    }, [state.activeAnimations, cancelAnimation]);
    // Motion control
    const pauseMotion = useCallback(() => {
        pausedRef.current = true;
    }, []);
    const resumeMotion = useCallback(() => {
        pausedRef.current = false;
    }, []);
    const setMotionPriority = useCallback((menuId) => {
        if (!coordination.isMenuActive(menuId))
            return false;
        setState((prev) => ({ ...prev, motionPriorityOwner: menuId }));
        return true;
    }, [coordination]);
    const releaseMotionPriority = useCallback((menuId) => {
        setState((prev) => ({
            ...prev,
            motionPriorityOwner: prev.motionPriorityOwner === menuId ? null : prev.motionPriorityOwner,
        }));
    }, []);
    // Budget management
    const updateBudget = useCallback((newBudget) => {
        try {
            setState((prev) => ({
                ...prev,
                budget: MotionBudgetSchema.parse({ ...prev.budget, ...newBudget }),
            }));
        }
        catch (error) {
            console.warn('Budget update validation failed:', error);
        }
    }, []);
    const getBudgetStatus = useCallback(() => {
        return {
            available: state.budget.maxTotalCognitiveLoad - state.currentLoad,
            used: state.currentLoad,
            percentage: (state.currentLoad / state.budget.maxTotalCognitiveLoad) * 100,
        };
    }, [state.budget.maxTotalCognitiveLoad, state.currentLoad]);
    // Motion utilities
    const getMotionClass = useCallback((menuId, type, duration) => {
        let baseClass = MOTION_CLASSES[type]?.[duration] || MOTION_CLASSES[type]?.standard || '';
        // Apply performance considerations
        baseClass = getPerformanceMotionClass(baseClass);
        // Add GPU acceleration if enabled and beneficial
        if (state.budget.enableGpuAcceleration && ['scale', 'slide'].includes(type)) {
            baseClass += ' transform-gpu will-change-transform';
        }
        // Get coordinator-aware motion class
        return coordinatorRef.current.getMotionClassForMenu(menuId, baseClass);
    }, [state.budget.enableGpuAcceleration, getPerformanceMotionClass]);
    // Create accessibility motion config at component level
    const accessibilityMotionConfig = {
        cognitiveLoad: state.currentLoad,
        trustLevel: 'medium',
        interactionType: 'navigation',
        respectsReducedMotion: state.budget.respectReducedMotion,
    };
    const { getMotionClass: getAccessibleMotionClass } = useAccessibleMotion(accessibilityMotionConfig);
    const getReducedMotionClass = useCallback((baseClass, _menuId) => {
        return getAccessibleMotionClass(baseClass);
    }, [getAccessibleMotionClass]);
    const shouldAnimate = useCallback((menuId, _type) => {
        if (pausedRef.current)
            return false;
        // Check if we have budget
        const wouldExceedBudget = state.currentLoad >= state.budget.maxTotalCognitiveLoad;
        const wouldExceedCount = state.activeAnimations.size >= state.budget.maxConcurrentAnimations;
        if (wouldExceedBudget || wouldExceedCount) {
            // Only allow if this menu has priority
            return state.motionPriorityOwner === menuId;
        }
        return true;
    }, [state.currentLoad, state.budget, state.activeAnimations.size, state.motionPriorityOwner]);
    // State queries
    const getActiveAnimationCount = useCallback(() => state.activeAnimations.size, [state.activeAnimations.size]);
    const getQueueLength = useCallback(() => state.queue.length, [state.queue.length]);
    const isAnimating = useCallback((menuId) => {
        for (const animation of state.activeAnimations.values()) {
            if (animation.request.menuId === menuId)
                return true;
        }
        return false;
    }, [state.activeAnimations]);
    const getMotionLevel = useCallback(() => {
        if (state.currentLoad >= state.budget.maxTotalCognitiveLoad * 0.8)
            return 'reduced';
        if (state.performanceMode === 'low')
            return 'reduced';
        return 'full';
    }, [state.currentLoad, state.budget.maxTotalCognitiveLoad, state.performanceMode]);
    const hasMotionPriority = useCallback((menuId) => {
        return state.motionPriorityOwner === menuId;
    }, [state.motionPriorityOwner]);
    const contextValue = {
        requestAnimation,
        cancelAnimation,
        cancelAnimationsForMenu,
        pauseMotion,
        resumeMotion,
        setMotionPriority,
        releaseMotionPriority,
        updateBudget,
        getBudgetStatus,
        getMotionClass,
        getReducedMotionClass,
        shouldAnimate,
        getActiveAnimationCount,
        getQueueLength,
        isAnimating,
        getMotionLevel,
        hasMotionPriority,
    };
    return (_jsx(MotionCoordinatorContext.Provider, { value: contextValue, children: children }));
};
/**
 * Hook to access motion coordination context
 */
export const useMotionCoordinator = () => {
    const context = useContext(MotionCoordinatorContext);
    if (!context) {
        throw new Error('useMotionCoordinator must be used within MotionCoordinator');
    }
    return context;
};
/**
 * Hook for menu components to coordinate motion
 */
export const useMenuMotion = (menuId, menuType) => {
    const coordinator = useMotionCoordinator();
    const coordination = useMenuCoordination();
    const config = menuMotionConfigs[menuType];
    const { shouldAnimate } = useAccessibleMotion(config);
    // Auto-request motion priority for high-priority menus
    const { isMenuActive } = coordination;
    const { setMotionPriority, releaseMotionPriority, cancelAnimationsForMenu, requestAnimation, getMotionClass: getCoordinatorMotionClass, shouldAnimate: coordinatorShouldAnimate, isAnimating, hasMotionPriority, getMotionLevel, getBudgetStatus, } = coordinator;
    useEffect(() => {
        if (isMenuActive(menuId) && ['context', 'navigation'].includes(menuType)) {
            setMotionPriority(menuId);
            return () => {
                releaseMotionPriority(menuId);
            };
        }
    }, [menuId, menuType, isMenuActive, setMotionPriority, releaseMotionPriority]);
    // Cancel animations when menu unmounts
    useEffect(() => {
        return () => {
            if (!isMenuActive(menuId)) {
                cancelAnimationsForMenu(menuId);
            }
        };
    }, [menuId, isMenuActive, cancelAnimationsForMenu]);
    const animate = useCallback(async (type, duration = 'standard', options = {}) => {
        if (!shouldAnimate)
            return null;
        return requestAnimation({
            menuId,
            type,
            duration,
            priority: config.trustLevel === 'critical' ? 1 : config.trustLevel === 'high' ? 2 : 5,
            cognitiveLoad: config.cognitiveLoad,
            trustLevel: config.trustLevel,
            ...options,
        });
    }, [requestAnimation, menuId, config, shouldAnimate]);
    return {
        animate,
        getMotionClass: (type, duration) => getCoordinatorMotionClass(menuId, type, duration),
        shouldAnimate: coordinatorShouldAnimate(menuId, 'move'),
        isAnimating: isAnimating(menuId),
        hasMotionPriority: hasMotionPriority(menuId),
        cancelAll: () => cancelAnimationsForMenu(menuId),
        motionLevel: getMotionLevel(),
        budgetStatus: getBudgetStatus(),
    };
};
// Export motion configurations and types
export { MOTION_DURATIONS, MOTION_CLASSES };
// Display name for debugging
MotionCoordinator.displayName = 'MotionCoordinator';
//# sourceMappingURL=MotionCoordinator.js.map