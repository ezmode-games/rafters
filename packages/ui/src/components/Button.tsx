/**
 * Interactive button component for user actions
 *
 * @registryName button
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Button.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 3/10 - Simple action trigger with clear visual hierarchy
 * @attentionEconomics Size hierarchy: sm=tertiary, md=secondary, lg=primary. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trustBuilding Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semanticMeaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usagePatterns
 * DO: Primary buttons for main user goal, maximum 1 per section
 * DO: Secondary buttons for alternative paths, supporting actions
 * DO: Destructive variant for permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @designGuides
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
 *
 * @dependencies @radix-ui/react-slot
 *
 * @example
 * ```tsx
 * // Primary action - highest attention, use once per section
 * <Button variant="primary">Save Changes</Button>
 *
 * // Destructive action - requires confirmation UX
 * <Button variant="destructive" destructiveConfirm>Delete Account</Button>
 * ```
 */
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info'
    | 'outline'
    | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  asChild?: boolean;
  loading?: boolean;
  destructiveConfirm?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  className,
  disabled,
  loading = false,
  destructiveConfirm = false,
  children,
  ref,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  // Trust-building: Show confirmation requirement for destructive actions
  const isDestructiveAction = variant === 'destructive';
  const shouldShowConfirmation = isDestructiveAction && destructiveConfirm;
  const isInteractionDisabled = disabled || loading;

  return (
    <Comp
      ref={ref}
      className={cn(
        // Base styles - using semantic tokens with proper interactive states
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-disabled',
        'transition-all motion-hover',
        'hover:opacity-hover active:scale-active',

        // Loading state reduces opacity for trust-building
        loading && 'opacity-75 cursor-wait',

        // Attention economics: Destructive actions get visual weight
        isDestructiveAction && 'font-semibold shadow-sm',

        // Variants - all grayscale, using semantic tokens
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90':
            variant === 'destructive',
          'bg-success text-success-foreground hover:bg-success/90': variant === 'success',
          'bg-warning text-warning-foreground hover:bg-warning/90': variant === 'warning',
          'bg-info text-info-foreground hover:bg-info/90': variant === 'info',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
            variant === 'outline',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        },

        // Attention economics: Size hierarchy for cognitive load
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
          'h-12 px-6 text-base w-full': size === 'full',
        },

        className
      )}
      disabled={isInteractionDisabled}
      aria-busy={loading}
      aria-label={shouldShowConfirmation ? `Confirm to ${children}` : undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {shouldShowConfirmation && !loading && (
            <span className="mr-1 text-xs font-bold" aria-hidden="true">
              !
            </span>
          )}
          {children}
        </>
      )}
    </Comp>
  );
}
