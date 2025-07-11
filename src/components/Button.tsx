import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
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
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      asChild = false,
      className,
      disabled,
      loading = false,
      destructiveConfirm = false,
      children,
      ...props
    },
    ref
  ) => {
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
          'transition-all duration-200',
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
);

Button.displayName = 'Button';
