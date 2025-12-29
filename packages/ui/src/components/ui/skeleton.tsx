import type * as React from 'react';
import classy from '../../primitives/classy';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={classy('bg-muted rounded-md animate-pulse motion-reduce:animate-none', className)}
      {...props}
    />
  );
}
