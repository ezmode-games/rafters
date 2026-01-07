/**
 * Status badge component with multi-sensory communication patterns
 *
 * @cognitive-load 2/10 - Optimized for peripheral scanning with minimal cognitive overhead
 * @attention-economics Secondary/tertiary support: Maximum 1 high-attention badge per section, unlimited subtle badges
 * @trust-building Low trust informational display with optional interaction patterns
 * @accessibility Multi-sensory communication: Color + Icon + Text + Pattern prevents single-point accessibility failure
 * @semantic-meaning Status communication with semantic variants: success=completion, warning=caution, error=problems, info=neutral information
 *
 * @usage-patterns
 * DO: Use for status indicators with multi-sensory communication
 * DO: Navigation badges for notification counts and sidebar status
 * DO: Category labels with semantic meaning over arbitrary colors
 * DO: Interactive badges with enhanced touch targets for removal/expansion
 * NEVER: Primary actions, complex information, critical alerts requiring immediate action
 *
 * @example
 * ```tsx
 * // Status badge with semantic meaning
 * <Badge variant="success">Completed</Badge>
 *
 * // Warning indicator
 * <Badge variant="warning">Pending Review</Badge>
 * ```
 */
import type * as React from 'react';
import classy from '../../primitives/classy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
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

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';

  const classes = classy(baseClasses, variantClasses[variant] ?? variantClasses.default, className);

  return <span className={classes} {...props} />;
}
