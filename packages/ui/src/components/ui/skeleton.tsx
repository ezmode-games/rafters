import type { HTMLAttributes } from 'react';
import classy from '../../primitives/classy';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return (
    <div
      className={classy(
        'bg-muted rounded-md animate-pulse motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}