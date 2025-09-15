/**
 * Motion Coordinator Provider - AI Intelligence
 *
 * COGNITIVE LOAD: 4/10 (manages complex animation coordination)
 * TRUST BUILDING: Consistent motion patterns build user confidence
 * ACCESSIBILITY: WCAG AAA motion compliance with vestibular safety
 *
 * Coordinates animations across all menu types with priority management
 * Prevents motion conflicts and enforces performance budgets
 *
 * Token knowledge: .rafters/tokens/registry.json
 */
import type React from 'react';
import { z } from 'zod';
import { type MotionLevel, menuMotionConfigs } from '../lib/motion-accessibility';
declare const MotionTypeSchema: z.ZodEnum<{
    scale: "scale";
    exit: "exit";
    enter: "enter";
    move: "move";
    fade: "fade";
    slide: "slide";
    bounce: "bounce";
}>;
declare const MotionDurationSchema: z.ZodEnum<{
    custom: "custom";
    standard: "standard";
    instant: "instant";
    fast: "fast";
    slow: "slow";
}>;
declare const AnimationRequestSchema: z.ZodObject<{
    id: z.ZodString;
    menuId: z.ZodString;
    type: z.ZodEnum<{
        scale: "scale";
        exit: "exit";
        enter: "enter";
        move: "move";
        fade: "fade";
        slide: "slide";
        bounce: "bounce";
    }>;
    duration: z.ZodEnum<{
        custom: "custom";
        standard: "standard";
        instant: "instant";
        fast: "fast";
        slow: "slow";
    }>;
    customDuration: z.ZodOptional<z.ZodNumber>;
    priority: z.ZodNumber;
    cognitiveLoad: z.ZodNumber;
    trustLevel: z.ZodEnum<{
        medium: "medium";
        low: "low";
        high: "high";
        critical: "critical";
    }>;
    canBeReduced: z.ZodDefault<z.ZodBoolean>;
    onStart: z.ZodOptional<z.ZodAny>;
    onComplete: z.ZodOptional<z.ZodAny>;
    timestamp: z.ZodNumber;
}, z.core.$strip>;
declare const MotionBudgetSchema: z.ZodObject<{
    maxConcurrentAnimations: z.ZodDefault<z.ZodNumber>;
    maxTotalCognitiveLoad: z.ZodDefault<z.ZodNumber>;
    performanceBudget: z.ZodDefault<z.ZodNumber>;
    enableGpuAcceleration: z.ZodDefault<z.ZodBoolean>;
    respectReducedMotion: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
type MotionType = z.infer<typeof MotionTypeSchema>;
type MotionDuration = z.infer<typeof MotionDurationSchema>;
type AnimationRequest = z.infer<typeof AnimationRequestSchema>;
type MotionBudget = z.infer<typeof MotionBudgetSchema>;
interface ActiveAnimation {
    request: AnimationRequest;
    startTime: number;
    estimatedEndTime: number;
    element?: HTMLElement;
    cleanup?: () => void;
}
interface MotionCoordinatorContextValue {
    requestAnimation: (request: Omit<AnimationRequest, 'id' | 'timestamp'>) => Promise<string | null>;
    cancelAnimation: (id: string) => boolean;
    cancelAnimationsForMenu: (menuId: string) => number;
    pauseMotion: () => void;
    resumeMotion: () => void;
    setMotionPriority: (menuId: string) => boolean;
    releaseMotionPriority: (menuId: string) => void;
    updateBudget: (budget: Partial<MotionBudget>) => void;
    getBudgetStatus: () => {
        available: number;
        used: number;
        percentage: number;
    };
    getMotionClass: (menuId: string, type: MotionType, duration: MotionDuration) => string;
    getReducedMotionClass: (baseClass: string, menuId: string) => string;
    shouldAnimate: (menuId: string, type: MotionType) => boolean;
    getActiveAnimationCount: () => number;
    getQueueLength: () => number;
    isAnimating: (menuId: string) => boolean;
    getMotionLevel: () => MotionLevel;
    hasMotionPriority: (menuId: string) => boolean;
}
declare const MOTION_DURATIONS: {
    readonly instant: 0;
    readonly fast: 150;
    readonly standard: 300;
    readonly slow: 500;
};
declare const MOTION_CLASSES: {
    readonly enter: {
        readonly instant: "duration-0";
        readonly fast: "duration-150 ease-out";
        readonly standard: "duration-300 ease-out";
        readonly slow: "duration-500 ease-out";
    };
    readonly exit: {
        readonly instant: "duration-0";
        readonly fast: "duration-75 ease-in";
        readonly standard: "duration-200 ease-in";
        readonly slow: "duration-300 ease-in";
    };
    readonly move: {
        readonly instant: "duration-0";
        readonly fast: "duration-150 ease-in-out";
        readonly standard: "duration-300 ease-in-out";
        readonly slow: "duration-500 ease-in-out";
    };
    readonly scale: {
        readonly instant: "duration-0";
        readonly fast: "duration-150 ease-out transform-gpu";
        readonly standard: "duration-300 ease-out transform-gpu";
        readonly slow: "duration-500 ease-out transform-gpu";
    };
    readonly fade: {
        readonly instant: "duration-0";
        readonly fast: "duration-150 transition-opacity";
        readonly standard: "duration-300 transition-opacity";
        readonly slow: "duration-500 transition-opacity";
    };
    readonly slide: {
        readonly instant: "duration-0";
        readonly fast: "duration-150 ease-out transform-gpu";
        readonly standard: "duration-300 ease-out transform-gpu";
        readonly slow: "duration-500 ease-out transform-gpu";
    };
    readonly bounce: {
        readonly instant: "duration-0";
        readonly fast: "duration-200 ease-bounce";
        readonly standard: "duration-400 ease-bounce";
        readonly slow: "duration-600 ease-bounce";
    };
};
export interface MotionCoordinatorProps {
    children: React.ReactNode;
    budget?: Partial<MotionBudget>;
    onAnimationStart?: (request: AnimationRequest) => void;
    onAnimationComplete?: (request: AnimationRequest) => void;
    onBudgetExceeded?: (currentLoad: number, maxLoad: number) => void;
}
/**
 * MotionCoordinator - Central animation coordination for all menu types
 * Manages motion priority, performance budgets, and accessibility compliance
 */
export declare const MotionCoordinator: React.FC<MotionCoordinatorProps>;
/**
 * Hook to access motion coordination context
 */
export declare const useMotionCoordinator: () => MotionCoordinatorContextValue;
/**
 * Hook for menu components to coordinate motion
 */
export declare const useMenuMotion: (menuId: string, menuType: keyof typeof menuMotionConfigs) => {
    animate: (type: MotionType, duration?: MotionDuration, options?: Partial<Omit<AnimationRequest, "id" | "timestamp" | "menuId" | "type" | "duration">>) => Promise<string | null>;
    getMotionClass: (type: MotionType, duration: MotionDuration) => string;
    shouldAnimate: boolean;
    isAnimating: boolean;
    hasMotionPriority: boolean;
    cancelAll: () => number;
    motionLevel: MotionLevel;
    budgetStatus: {
        available: number;
        used: number;
        percentage: number;
    };
};
export { MOTION_DURATIONS, MOTION_CLASSES };
export type { AnimationRequest, MotionType, MotionDuration, MotionBudget, ActiveAnimation };
//# sourceMappingURL=MotionCoordinator.d.ts.map