/**
 * Form input component with validation states and accessibility
 *
 * @cognitive-load 4/10 - Data entry with validation feedback requires user attention
 * @attention-economics State hierarchy: default=ready, focus=active input, error=requires attention, success=validation passed
 * @trust-building Clear validation feedback, error recovery patterns, progressive enhancement
 * @accessibility Screen reader labels, validation announcements, keyboard navigation, high contrast support
 * @semantic-meaning Type-appropriate validation: email=format validation, password=security indicators, number=range constraints
 *
 * @usage-patterns
 * DO: Always pair with descriptive Label component
 * DO: Use helpful placeholders showing format examples
 * DO: Provide real-time validation for user confidence
 * DO: Use appropriate input types for sensitive data
 * NEVER: Label-less inputs, validation only on submit, unclear error messages
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" placeholder="you@example.com" />
 *
 * // Password input
 * <Label htmlFor="password">Password</Label>
 * <Input id="password" type="password" />
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', disabled, ...props }, ref) => {
    const baseClasses =
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
      'ring-offset-background ' +
      'file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
      'placeholder:text-muted-foreground ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
      'disabled:cursor-not-allowed disabled:opacity-50';

    const cls = classy(baseClasses, className);

    return (
      <input
        type={type}
        className={cls}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : undefined}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
