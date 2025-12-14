import * as React from 'react';
import classy from '../../primitives/classy';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

// Use semantic token class names (token-first) following the pattern:
// `bg-<token>` and `text-<token>-foreground` (e.g. `bg-primary text-primary-foreground`).
// Concrete mapping to utility classes is provided by the design system at build time.
const variantClasses: Record<string, string> = {
  // Primary / brand
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover active:scale-95 focus-visible:ring-primary',

  // Secondary (distinct from surface)
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary-hover active:scale-95 focus-visible:ring-secondary',

  // Semantic variants
  info: 'bg-info text-info-foreground hover:bg-info-hover active:scale-95 focus-visible:ring-info',
  success:
    'bg-success text-success-foreground hover:bg-success-hover active:scale-95 focus-visible:ring-success',
  warning:
    'bg-warning text-warning-foreground hover:bg-warning-hover active:scale-95 focus-visible:ring-warning',
  alert:
    'bg-alert text-alert-foreground hover:bg-alert-hover active:scale-95 focus-visible:ring-alert',

  // Outline variant (transparent background, border)
  outline:
    'bg-transparent border border-input text-foreground hover:bg-surface hover:text-foreground active:scale-95 focus-visible:ring-surface',

  // Ghost and link remain
  ghost:
    'bg-transparent text-foreground hover:bg-surface-hover active:scale-95 focus-visible:ring-surface',
  link: 'bg-transparent underline text-primary hover:text-primary-hover active:underline',

  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive-hover active:scale-95 focus-visible:ring-destructive',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild, className, variant = 'primary', size = 'md', disabled, loading, children, ...props },
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

    const hasAriaName = Boolean(
      props['aria-label'] ||
        props['aria-labelledby'] ||
        (typeof children === 'string' && children.trim().length > 0),
    );

    if (!hasAriaName && !asChild) {
      // warn developer that button has no accessible name
      if (typeof console !== 'undefined' && console && console.warn) {
        console.warn('Button: missing accessible name — provide `aria-label` or children text');
      }
    }

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
      const childProps: Record<string, unknown> = {
        ref,
        className: classy((child.props as { className?: string })?.className, cls),
        ...props,
      };

      // If child is a non-button element (like <a>), don't pass `disabled` prop — use aria-disabled and intercept clicks
      const tag = typeof child.type === 'string' ? child.type : null;
      const isNativeButton = tag === 'button';

      if (isNativeButton) {
        (childProps as Record<string, unknown>).disabled = disabled || loading;
        (childProps as Record<string, unknown>)['aria-disabled'] =
          disabled || loading ? 'true' : undefined;
      } else {
        // for anchors or other elements
        (childProps as Record<string, unknown>)['aria-disabled'] =
          disabled || loading ? 'true' : undefined;

        // wrap onClick to prevent activation when disabled
        const origOnClick = (child.props as { onClick?: (...args: unknown[]) => unknown })?.onClick;
        (childProps as Record<string, unknown>).onClick = (e: Event) => {
          if (disabled || loading) {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            return;
          }
          return origOnClick?.(e as unknown);
        };

        // ensure keyboard activation for non-button elements with role button
        if (!(child.props as { role?: string })?.role) {
          (childProps as Record<string, unknown>).role = 'button';
        }
        const origOnKeyDown = (child.props as { onKeyDown?: (e: unknown) => unknown })?.onKeyDown;
        (childProps as Record<string, unknown>).onKeyDown = (e: React.KeyboardEvent) => {
          if (disabled || loading) return;
          if (e.key === 'Enter' || e.key === ' ') {
            const clickFn = (childProps as { onClick?: (ev: Event) => unknown }).onClick;
            clickFn?.({ preventDefault() {}, stopPropagation() {} } as unknown as Event);
            e.preventDefault();
          }
          return origOnKeyDown?.(e);
        };
      }

      // warn if no accessible name on asChild clone
      const childHasName = Boolean(
        (child.props as { 'aria-label'?: unknown })?.['aria-label'] ||
          (child.props as { 'aria-labelledby'?: unknown })?.['aria-labelledby'] ||
          (typeof (child.props as { children?: unknown })?.children === 'string' &&
            ((child.props as { children?: string })?.children as string).trim().length > 0),
      );
      if (!childHasName) {
        if (typeof console !== 'undefined' && console && console.warn) {
          console.warn(
            'Button(asChild): cloned child missing accessible name — provide `aria-label` or text content',
          );
        }
      }

      return React.cloneElement(child, childProps as unknown as Partial<Record<string, unknown>>);
    }

    return content;
  },
);

Button.displayName = 'Button';

export default Button;
