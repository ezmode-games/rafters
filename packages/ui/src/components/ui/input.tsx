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
