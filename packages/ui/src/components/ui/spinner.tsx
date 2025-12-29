import type * as React from 'react';
import classy from '../../primitives/classy';

export interface SpinnerProps extends React.HTMLAttributes<HTMLOutputElement> {
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'h-4 w-4 border-2',
  default: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  const baseClasses =
    'inline-block rounded-full border-current border-r-transparent animate-spin motion-reduce:animate-none';

  const classes = classy(baseClasses, sizeClasses[size] ?? sizeClasses.default, className);

  return (
    <output aria-label="Loading" className={classes} {...props}>
      <span className="sr-only">Loading</span>
    </output>
  );
}
