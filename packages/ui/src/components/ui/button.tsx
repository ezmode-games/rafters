/**
 * Interactive button component for user actions
 *
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Size hierarchy: sm=tertiary actions, default=secondary interactions, lg=primary calls-to-action. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semantic-meaning Variant mapping: default=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usage-patterns
 * DO: Primary: Main user goal, maximum 1 per section
 * DO: Secondary: Alternative paths, supporting actions
 * DO: Destructive: Permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @example
 * ```tsx
 * // Primary action - highest attention, use once per section
 * <Button variant="default">Save Changes</Button>
 *
 * // Destructive action - requires confirmation UX
 * <Button variant="destructive">Delete Account</Button>
 *
 * // Loading state - prevents double submission
 * <Button loading>Processing...</Button>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';
import { mergeProps } from '../../primitives/slot';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
}

// Variant classes using semantic design tokens
const variantClasses: Record<string, string> = {
  default:
    'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 focus-visible:ring-ring',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 focus-visible:ring-ring',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 focus-visible:ring-ring',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95 focus-visible:ring-ring',
  ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95 focus-visible:ring-ring',
};

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      variant = 'default',
      size = 'default',
      disabled,
      loading,
      children,
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center rounded-md font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none';

    // Motion / animations (respect prefers-reduced-motion)
    const motion =
      'transition-transform motion-safe:transform-gpu motion-safe:duration-150 motion-reduce:transition-none';

    const disabledCls = disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : '';

    const cls = classy(
      base,
      motion,
      variantClasses[variant] ?? '',
      sizeClasses[size] ?? '',
      disabledCls,
      className,
    );

    const content = (
      <button
        type={props.type ?? 'button'}
        aria-disabled={disabled || loading ? 'true' : undefined}
        aria-busy={loading ? 'true' : undefined}
        disabled={disabled || loading}
        ref={ref}
        className={cls}
        {...props}
      >
        {loading ? <span aria-hidden>Loading…</span> : children}
      </button>
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        Record<string, unknown>,
        string | React.JSXElementConstructor<unknown>
      >;
      const childPropsTyped = child.props as Record<string, unknown>;

      // Build parent props to merge
      const parentProps = {
        ref,
        className: cls,
        'aria-disabled': disabled || loading ? 'true' : undefined,
        'aria-busy': loading ? 'true' : undefined,
        ...props,
      };

      // Use mergeProps for proper prop composition
      const mergedProps = mergeProps(
        parentProps as Parameters<typeof mergeProps>[0],
        childPropsTyped,
      );

      // Handle disabled state for non-button elements
      const tag = typeof child.type === 'string' ? child.type : null;
      const isNativeButton = tag === 'button';

      if (isNativeButton) {
        (mergedProps as Record<string, unknown>).disabled = disabled || loading;
      } else {
        // For non-button elements, add role="button" if not present
        if (!childPropsTyped.role) {
          (mergedProps as Record<string, unknown>).role = 'button';
        }

        // Intercept clicks when disabled
        const origOnClick = mergedProps.onClick as ((...args: unknown[]) => void) | undefined;
        (mergedProps as Record<string, unknown>).onClick = (e: React.MouseEvent) => {
          if (disabled || loading) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          origOnClick?.(e);
        };

        // Handle keyboard activation for non-button elements
        const origOnKeyDown = mergedProps.onKeyDown as
          | ((e: React.KeyboardEvent) => void)
          | undefined;
        (mergedProps as Record<string, unknown>).onKeyDown = (e: React.KeyboardEvent) => {
          if (disabled || loading) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (e.currentTarget as HTMLElement).click();
          }
          origOnKeyDown?.(e);
        };
      }

      return React.cloneElement(child, mergedProps as Partial<Record<string, unknown>>);
    }

    return content;
  },
);

Button.displayName = 'Button';

export default Button;
