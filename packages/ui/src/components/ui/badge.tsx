import type { HTMLAttributes } from 'react';
import classy from '../../primitives/classy';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline';
}

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  outline: 'bg-transparent border border-input text-foreground',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps): JSX.Element {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  
  return (
    <span
      className={classy(
        baseClasses,
        variantClasses[variant] ?? variantClasses.default,
        className
      )}
      {...props}
    />
  );
}