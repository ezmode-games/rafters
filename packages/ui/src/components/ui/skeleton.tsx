/**
 * Skeleton loading placeholder component for content that is loading
 *
 * @cognitive-load 1/10 - Passive placeholder, reduces uncertainty during loading
 * @attention-economics Loading indicator: maintains layout stability, reduces perceived wait time
 * @trust-building Visual feedback that content is loading, reduces uncertainty anxiety
 * @accessibility motion-reduce respects prefers-reduced-motion, aria-hidden since decorative
 * @semantic-meaning Loading state: represents content shape while data is being fetched
 *
 * @usage-patterns
 * DO: Match skeleton shape to expected content (text lines, images, cards)
 * DO: Use multiple skeletons to represent list items
 * DO: Maintain consistent sizing with actual content
 * DO: Respect prefers-reduced-motion for animation
 * NEVER: Use for interactive elements, use for indefinite loading states
 *
 * @example
 * ```tsx
 * // Text skeleton
 * <Skeleton className="h-4 w-48" />
 *
 * // Avatar skeleton
 * <Skeleton className="h-12 w-12 rounded-full" />
 * ```
 */
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
