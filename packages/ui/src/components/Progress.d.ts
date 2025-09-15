import * as ProgressPrimitive from '@radix-ui/react-progress';
import { type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
/**
 * Progress indicator component with time estimation and completion intelligence
 *
 * @registry-name progress
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Progress.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 4/10 - Moderate attention required for progress monitoring
 * @attention-economics Temporal attention: Holds user attention during wait states with clear progress indication
 * @trust-building Accurate progress builds user confidence, clear completion states and next steps
 * @accessibility Screen reader announcements, keyboard navigation, high contrast support
 * @semantic-meaning Progress communication: determinate=known duration, indeterminate=unknown duration, completed=finished state
 *
 * @usage-patterns
 * DO: Provide accurate progress indication with time estimation
 * DO: Use visual patterns that match task characteristics
 * DO: Show clear completion states and next steps
 * DO: Optimize information density based on cognitive load
 * NEVER: Inaccurate progress bars, missing completion feedback, unclear time estimates
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-progress, class-variance-authority
 *
 * @example
 * ```tsx
 * // Determinate progress with percentage
 * <Progress value={65} max={100} />
 *
 * // Progress with time estimation
 * <Progress
 *   value={30}
 *   max={100}
 *   showTimeRemaining
 *   estimatedTimeRemaining="2 minutes"
 * />
 * ```
 */
declare const progressVariants: (props?: ({
    variant?: "thin" | "circle" | "thick" | "bar" | "steps" | null | undefined;
    pattern?: "linear" | "accelerating" | "decelerating" | "pulsing" | null | undefined;
    complexity?: "simple" | "detailed" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, VariantProps<typeof progressVariants> {
    /**
     * Visual variant of the progress indicator
     */
    variant?: 'bar' | 'thin' | 'thick' | 'circle' | 'steps';
    /**
     * Progress pattern affecting visual behavior
     */
    pattern?: 'linear' | 'accelerating' | 'decelerating' | 'pulsing';
    /**
     * Information complexity level
     */
    complexity?: 'simple' | 'detailed';
    /**
     * Progress status affecting color
     */
    status?: 'default' | 'success' | 'warning' | 'error';
    /**
     * Whether to show percentage
     */
    showPercentage?: boolean;
    /**
     * Whether to show time estimation
     */
    showTime?: boolean;
    /**
     * Whether to show descriptive text
     */
    showDescription?: boolean;
    /**
     * Whether to show step indicators
     */
    showSteps?: boolean;
    /**
     * Estimated total time in milliseconds
     */
    estimatedTime?: number;
    /**
     * Calculated or provided time remaining in milliseconds
     */
    timeRemaining?: number;
    /**
     * Message shown on completion
     */
    completionMessage?: string;
    /**
     * Next action available on completion
     */
    nextAction?: string;
    /**
     * Whether progress can be paused
     */
    pausable?: boolean;
    /**
     * Whether progress can be cancelled
     */
    cancellable?: boolean;
    /**
     * Current step (for step variant)
     */
    currentStep?: number;
    /**
     * Total steps (for step variant)
     */
    totalSteps?: number;
    /**
     * Label describing the progress
     */
    label?: string;
    /**
     * Detailed description of current progress
     */
    description?: string;
    /**
     * Pause handler
     */
    onPause?: () => void;
    /**
     * Cancel handler
     */
    onCancel?: () => void;
    /**
     * Complete handler
     */
    onComplete?: () => void;
    ref?: React.Ref<ElementRef<typeof ProgressPrimitive.Root>>;
}
export declare function Progress({ className, value, variant, pattern, complexity, status, showPercentage, showTime, showDescription, showSteps, estimatedTime, timeRemaining, completionMessage, nextAction, pausable, cancellable, currentStep, totalSteps, label, description, onPause, onCancel, onComplete, ref, ...props }: ProgressProps): import("react/jsx-runtime").JSX.Element;
export interface ProgressStepProps {
    children: React.ReactNode;
    completed?: boolean;
    current?: boolean;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
}
export declare function ProgressStep({ children, completed, current, className, ref, ...props }: ProgressStepProps): import("react/jsx-runtime").JSX.Element;
export { progressVariants };
//# sourceMappingURL=Progress.d.ts.map