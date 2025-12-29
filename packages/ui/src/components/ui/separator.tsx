import type { HTMLAttributes } from 'react';
import classy from '../../primitives/classy';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation of the separator */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the separator is purely decorative */
  decorative?: boolean;
}

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps): JSX.Element {
  const orientationClasses = {
    horizontal: 'h-px w-full',
    vertical: 'h-full w-px',
  };

  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative ? orientation : undefined}
      className={classy(
        'shrink-0 bg-border',
        orientationClasses[orientation],
        className,
      )}
      {...props}
    />
  );
}