import type * as React from 'react';
import classy from '../../primitives/classy';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
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
}: SeparatorProps) {
  const orientationClasses = {
    horizontal: 'h-px w-full',
    vertical: 'h-full w-px',
  };

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-orientation is valid when role="separator"
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative ? orientation : undefined}
      className={classy('shrink-0 bg-border', orientationClasses[orientation], className)}
      {...props}
    />
  );
}
