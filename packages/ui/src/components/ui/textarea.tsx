import * as React from 'react';
import classy from '../../primitives/classy';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disabled, ...props }, ref) => {
    const baseClasses =
      'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
      'ring-offset-background ' +
      'placeholder:text-muted-foreground ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
      'disabled:cursor-not-allowed disabled:opacity-50';

    const cls = classy(baseClasses, className);

    return (
      <textarea
        className={cls}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
