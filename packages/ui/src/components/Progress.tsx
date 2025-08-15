import * as ProgressPrimitive from '@radix-ui/react-progress';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
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
 * @dependencies @radix-ui/react-progress, @rafters/design-tokens/motion, class-variance-authority
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

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-background-subtle',
  {
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
  }
);

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

export interface ProgressProps
  extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
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

export function Progress({
  className,
  value = 0,
  variant = 'bar',
  pattern = 'linear',
  complexity = 'simple',
  status = 'default',
  showPercentage = false,
  showTime = false,
  showDescription = false,
  showSteps = false,
  estimatedTime,
  timeRemaining,
  completionMessage,
  nextAction,
  pausable = false,
  cancellable = false,
  currentStep,
  totalSteps,
  label,
  description,
  onPause,
  onCancel,
  onComplete,
  ref,
  ...props
}: ProgressProps) {
  const isComplete = value === 100;
  const isIndeterminate = value === undefined || value === null;
  const descriptionId = description
    ? `progress-desc-${Math.random().toString(36).substr(2, 9)}`
    : undefined;

  // Helper functions for time calculation and formatting
  const calculateRemainingMilliseconds = (): number | null => {
    if (timeRemaining) return timeRemaining;
    if (estimatedTime && value != null && value > 0) {
      return (estimatedTime * (100 - value)) / 100;
    }
    return null;
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    if (minutes > 0) {
      return `About ${minutes}m ${seconds}s remaining`;
    }
    return seconds > 0 ? `About ${seconds}s remaining` : 'Almost done...';
  };

  const getTimeDisplay = (): string | null => {
    if (!showTime) return null;
    if (isComplete) return null;
    if (isIndeterminate) return 'Calculating...';

    const remainingMs = calculateRemainingMilliseconds();
    return remainingMs ? formatTimeRemaining(remainingMs) : null;
  };

  const timeDisplay = getTimeDisplay();
  const percentageDisplay = showPercentage && !isIndeterminate ? `${Math.round(value)}%` : null;

  if (variant === 'steps' && showSteps) {
    return (
      <div className={cn('space-y-2', className)}>
        {(label || percentageDisplay || timeDisplay) && (
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{label}</span>
            <div className="flex items-center gap-2 text-muted-foreground">
              {currentStep && totalSteps && (
                <span>
                  {currentStep} of {totalSteps}
                </span>
              )}
              {timeDisplay && <span>{timeDisplay}</span>}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1">
            {totalSteps && currentStep && (
              <ol
                aria-label={`Progress steps: ${currentStep} of ${totalSteps}`}
                className="flex items-center gap-2"
              >
                {Array.from({ length: totalSteps }, (_, i) => {
                  const stepNumber = i + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isCurrent = stepNumber === currentStep;
                  return (
                    <li
                      key={`step-${stepNumber}`}
                      aria-label={`Step ${stepNumber} of ${totalSteps}: ${
                        isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Not Started'
                      }`}
                      className={cn(
                        'h-2 flex-1 rounded-full transition-colors motion-progress',
                        isCompleted && 'bg-primary',
                        isCurrent && 'bg-primary/50',
                        !isCompleted && !isCurrent && 'bg-background-subtle'
                      )}
                    />
                  );
                })}
              </ol>
            )}
            {showDescription && description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {(pausable || cancellable) && (
          <div className="flex gap-2">
            {pausable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPause}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Pause
              </Button>
            )}
            {cancellable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header with label and time/percentage */}
      {(label || percentageDisplay || timeDisplay) && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <div className="flex items-center gap-2 text-muted-foreground">
            {percentageDisplay && <span>{percentageDisplay}</span>}
            {timeDisplay && <span>{timeDisplay}</span>}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          progressVariants({ variant, pattern, complexity }),
          isComplete && status === 'success' && 'bg-success/10'
        )}
        value={isIndeterminate ? undefined : value}
        aria-label={label || 'Progress indicator'}
        aria-describedby={descriptionId}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorVariants({
              pattern,
              status: isComplete ? 'success' : status,
            })
          )}
          style={{
            transform: isIndeterminate ? undefined : `translateX(-${100 - value}%)`,
          }}
        />
      </ProgressPrimitive.Root>

      {/* Description */}
      {showDescription && description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Completion message */}
      {isComplete && completionMessage && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-success">{completionMessage}</span>
          {nextAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onComplete}
              className="h-auto p-1 text-primary hover:text-primary/80 underline underline-offset-4"
            >
              {nextAction}
            </Button>
          )}
        </div>
      )}

      {/* Controls */}
      {!isComplete && (pausable || cancellable) && (
        <div className="flex gap-2">
          {pausable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPause}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Pause
            </Button>
          )}
          {cancellable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Additional helper components for step progress
export interface ProgressStepProps {
  children: React.ReactNode;
  completed?: boolean;
  current?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function ProgressStep({
  children,
  completed = false,
  current = false,
  className,
  ref,
  ...props
}: ProgressStepProps) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 text-sm',
        current && 'font-medium text-primary',
        completed && 'text-muted-foreground',
        !completed && !current && 'text-muted-foreground/50',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          current && 'bg-primary',
          completed && 'bg-success',
          !completed && !current && 'bg-muted-foreground/20'
        )}
      />
      {children}
    </div>
  );
}

export { progressVariants };
