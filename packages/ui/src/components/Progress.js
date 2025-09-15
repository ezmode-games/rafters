import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Button } from './Button';
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
const progressVariants = cva('relative h-2 w-full overflow-hidden rounded-full bg-background-subtle', {
    variants: {
        variant: {
            bar: 'h-2',
            thin: 'h-1',
            thick: 'h-3',
            circle: 'h-16 w-16 rounded-full',
            steps: 'h-auto bg-transparent',
        },
        pattern: {
            linear: '',
            accelerating: '[&>div]:transition-all [&>div]:motion-modal',
            decelerating: '[&>div]:transition-all [&>div]:motion-progress',
            pulsing: '[&>div]:motion-slow [&>div]:easing-smooth [&>div]:pulse-animation',
        },
        complexity: {
            simple: 'gap-1',
            detailed: 'gap-2',
        },
    },
    defaultVariants: {
        variant: 'bar',
        pattern: 'linear',
        complexity: 'simple',
    },
});
const progressIndicatorVariants = cva('h-full w-full flex-1 bg-primary transition-all', {
    variants: {
        pattern: {
            linear: 'transition-transform motion-progress',
            accelerating: 'transition-transform motion-modal',
            decelerating: 'transition-transform motion-progress',
            pulsing: 'motion-slow easing-smooth animate-pulse',
        },
        status: {
            default: 'bg-primary',
            success: 'bg-success',
            warning: 'bg-warning',
            error: 'bg-destructive',
        },
    },
    defaultVariants: {
        pattern: 'linear',
        status: 'default',
    },
});
export function Progress({ className, value = 0, variant = 'bar', pattern = 'linear', complexity = 'simple', status = 'default', showPercentage = false, showTime = false, showDescription = false, showSteps = false, estimatedTime, timeRemaining, completionMessage, nextAction, pausable = false, cancellable = false, currentStep, totalSteps, label, description, onPause, onCancel, onComplete, ref, ...props }) {
    const isComplete = value === 100;
    const isIndeterminate = value === undefined || value === null;
    const descriptionId = description
        ? `progress-desc-${Math.random().toString(36).substr(2, 9)}`
        : undefined;
    // Helper functions for time calculation and formatting
    const calculateRemainingMilliseconds = () => {
        if (timeRemaining)
            return timeRemaining;
        if (estimatedTime && value != null && value > 0) {
            return (estimatedTime * (100 - value)) / 100;
        }
        return null;
    };
    const formatTimeRemaining = (milliseconds) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        if (minutes > 0) {
            return `About ${minutes}m ${seconds}s remaining`;
        }
        return seconds > 0 ? `About ${seconds}s remaining` : 'Almost done...';
    };
    const getTimeDisplay = () => {
        if (!showTime)
            return null;
        if (isComplete)
            return null;
        if (isIndeterminate)
            return 'Calculating...';
        const remainingMs = calculateRemainingMilliseconds();
        return remainingMs ? formatTimeRemaining(remainingMs) : null;
    };
    const timeDisplay = getTimeDisplay();
    const percentageDisplay = showPercentage && !isIndeterminate ? `${Math.round(value)}%` : null;
    if (variant === 'steps' && showSteps) {
        return (_jsxs("div", { className: cn('space-y-2', className), children: [(label || percentageDisplay || timeDisplay) && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: label }), _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [currentStep && totalSteps && (_jsxs("span", { children: [currentStep, " of ", totalSteps] })), timeDisplay && _jsx("span", { children: timeDisplay })] })] })), _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex-1 space-y-1", children: [totalSteps && currentStep && (_jsx("ol", { "aria-label": `Progress steps: ${currentStep} of ${totalSteps}`, className: "flex items-center gap-2", children: Array.from({ length: totalSteps }, (_, i) => {
                                    const stepNumber = i + 1;
                                    const isCompleted = stepNumber < currentStep;
                                    const isCurrent = stepNumber === currentStep;
                                    return (_jsx("li", { "aria-label": `Step ${stepNumber} of ${totalSteps}: ${isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Not Started'}`, className: cn('h-2 flex-1 rounded-full transition-colors motion-progress', isCompleted && 'bg-primary', isCurrent && 'bg-primary/50', !isCompleted && !isCurrent && 'bg-background-subtle') }, `step-${stepNumber}`));
                                }) })), showDescription && description && (_jsx("p", { className: "text-sm text-muted-foreground", children: description }))] }) }), (pausable || cancellable) && (_jsxs("div", { className: "flex gap-2", children: [pausable && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onPause, className: "h-auto p-1 text-xs text-muted-foreground hover:text-foreground", children: "Pause" })), cancellable && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onCancel, className: "h-auto p-1 text-xs text-muted-foreground hover:text-foreground", children: "Cancel" }))] }))] }));
    }
    return (_jsxs("div", { className: cn('space-y-2', className), children: [(label || percentageDisplay || timeDisplay) && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: label }), _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [percentageDisplay && _jsx("span", { children: percentageDisplay }), timeDisplay && _jsx("span", { children: timeDisplay })] })] })), _jsx(ProgressPrimitive.Root, { ref: ref, className: cn(progressVariants({ variant, pattern, complexity }), isComplete && status === 'success' && 'bg-success/10'), value: isIndeterminate ? undefined : value, "aria-label": label || 'Progress indicator', "aria-describedby": descriptionId, ...props, children: _jsx(ProgressPrimitive.Indicator, { className: cn(progressIndicatorVariants({
                        pattern,
                        status: isComplete ? 'success' : status,
                    })), style: {
                        transform: isIndeterminate ? undefined : `translateX(-${100 - value}%)`,
                    } }) }), showDescription && description && (_jsx("p", { id: descriptionId, className: "text-sm text-muted-foreground", children: description })), isComplete && completionMessage && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-success", children: completionMessage }), nextAction && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onComplete, className: "h-auto p-1 text-primary hover:text-primary/80 underline underline-offset-4", children: nextAction }))] })), !isComplete && (pausable || cancellable) && (_jsxs("div", { className: "flex gap-2", children: [pausable && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onPause, className: "h-auto p-1 text-xs text-muted-foreground hover:text-foreground", children: "Pause" })), cancellable && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onCancel, className: "h-auto p-1 text-xs text-muted-foreground hover:text-foreground", children: "Cancel" }))] }))] }));
}
export function ProgressStep({ children, completed = false, current = false, className, ref, ...props }) {
    return (_jsxs("div", { ref: ref, className: cn('flex items-center gap-2 text-sm', current && 'font-medium text-primary', completed && 'text-muted-foreground', !completed && !current && 'text-muted-foreground/50', className), ...props, children: [_jsx("div", { className: cn('h-2 w-2 rounded-full', current && 'bg-primary', completed && 'bg-success', !completed && !current && 'bg-muted-foreground/20') }), children] }));
}
export { progressVariants };
//# sourceMappingURL=Progress.js.map