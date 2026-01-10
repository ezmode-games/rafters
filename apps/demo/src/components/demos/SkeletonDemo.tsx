import { Skeleton } from '@rafters/ui/components/ui/skeleton';

const SEMANTIC_VARIANTS = [
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'muted',
  'accent',
] as const;

export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function SkeletonVariants() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="flex flex-col gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-mono">variant="{variant}"</span>
              <Skeleton variant={variant} className="h-8 w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Common Patterns */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Common Patterns
        </h3>
        <div className="flex flex-col gap-6">
          {/* Text Block */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-mono">Text Block</span>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          {/* Avatar + Text */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-mono">Avatar + Text</span>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Card */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-mono">Card</span>
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>

          {/* Button */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-mono">Button</span>
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
