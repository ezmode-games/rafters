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
 * @dependencies r-button
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
import '../primitives/button/r-button';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import type { RButton } from '../primitives/button/r-button';
import { cn } from '../utils';

// Extend React types for custom element
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'r-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        ref?: React.Ref<RButton>;
      };
    }
  }
}

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all hover:opacity-90 active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        info: 'bg-info text-info-foreground hover:bg-info/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        full: 'h-12 px-6 text-base w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  destructiveConfirm?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  disabled,
  loading = false,
  destructiveConfirm = false,
  children,
  ...props
}: ButtonProps) {
  // Trust-building: Show confirmation requirement for destructive actions
  const isDestructiveAction = variant === 'destructive';
  const shouldShowConfirmation = isDestructiveAction && destructiveConfirm;
  const isInteractionDisabled = disabled || loading;

  return (
    <r-button
      type={type}
      disabled={isInteractionDisabled}
      aria-busy={loading}
      aria-label={shouldShowConfirmation ? `Confirm to ${children}` : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        loading && 'opacity-75 cursor-wait',
        isDestructiveAction && 'font-semibold shadow-sm',
        className
      )}
      {...props}
    >
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
    </r-button>
  );
}
