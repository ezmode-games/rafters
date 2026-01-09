/**
 * Status message component for important user feedback
 *
 * @cognitive-load 3/10 - Simple message display with clear visual hierarchy
 * @attention-economics Variant hierarchy: destructive=immediate attention, warning=caution, success=confirmation, info=supplementary
 * @trust-building Clear, honest feedback builds confidence; destructive alerts require careful wording
 * @accessibility role="alert" for urgent messages; role="status" for informational; never color-only
 * @semantic-meaning Variant mapping: default=neutral, info=helpful context, success=positive confirmation, warning=proceed with caution, destructive=error or danger
 *
 * @usage-patterns
 * DO: Use destructive for errors that need user action
 * DO: Use success to confirm completed actions
 * DO: Use warning for potential issues before they happen
 * DO: Include icons to reinforce meaning beyond color
 * NEVER: Use alerts for transient feedback (use contextual feedback instead)
 * NEVER: Stack multiple alerts - prioritize the most important
 * NEVER: Use destructive for warnings or warnings for info
 *
 * @example
 * ```tsx
 * // Error alert
 * <Alert variant="destructive">
 *   <AlertCircle className="h-4 w-4" />
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>
 *     Your session has expired. Please log in again.
 *   </AlertDescription>
 * </Alert>
 *
 * // Success alert
 * <Alert variant="success">
 *   <CheckCircle className="h-4 w-4" />
 *   <AlertTitle>Success</AlertTitle>
 *   <AlertDescription>
 *     Your changes have been saved.
 *   </AlertDescription>
 * </Alert>
 *
 * // Informational alert
 * <Alert variant="info">
 *   <Info className="h-4 w-4" />
 *   <AlertTitle>Note</AlertTitle>
 *   <AlertDescription>
 *     This feature is in beta.
 *   </AlertDescription>
 * </Alert>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'muted' | 'accent';
}

// Variant classes per docs/COMPONENT_STYLING_REFERENCE.md - using -subtle for alert backgrounds
const variantClasses: Record<string, string> = {
  default: 'bg-primary-subtle text-primary-foreground border-primary-border',
  primary: 'bg-primary-subtle text-primary-foreground border-primary-border',
  secondary: 'bg-secondary-subtle text-secondary-foreground border-secondary-border',
  destructive: 'bg-destructive-subtle text-destructive-foreground border-destructive-border',
  success: 'bg-success-subtle text-success-foreground border-success-border',
  warning: 'bg-warning-subtle text-warning-foreground border-warning-border',
  info: 'bg-info-subtle text-info-foreground border-info-border',
  muted: 'bg-muted text-muted-foreground border-border',
  accent: 'bg-accent-subtle text-accent-foreground border-accent-border',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base =
      'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11';

    return (
      <div
        ref={ref}
        role="alert"
        className={classy(base, variantClasses[variant] ?? '', className)}
        {...props}
      />
    );
  },
);

Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={classy('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={classy('text-sm [&_p]:leading-relaxed', className)} {...props} />
));

AlertDescription.displayName = 'AlertDescription';

export default Alert;
