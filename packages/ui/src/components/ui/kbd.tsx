import type * as React from 'react';
import classy from '../../primitives/classy';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={classy(
        'inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-muted-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
