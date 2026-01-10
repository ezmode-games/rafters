import { Progress } from '@rafters/ui/components/ui/progress';

const SEMANTIC_VARIANTS = [
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'accent',
] as const;
const SIZES = ['sm', 'default', 'lg'] as const;

export function ProgressDemo() {
  return (
    <div className="w-full max-w-md">
      <Progress value={66} />
    </div>
  );
}

export function ProgressVariants() {
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
              <Progress variant={variant} value={66} />
            </div>
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Sizes
        </h3>
        <div className="flex flex-col gap-4">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-mono">size="{size}"</span>
              <Progress size={size} value={66} />
            </div>
          ))}
        </div>
      </section>

      {/* Different Values */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Progress Values
        </h3>
        <div className="flex flex-col gap-4">
          {[0, 25, 50, 75, 100].map((value) => (
            <div key={value} className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-mono">value={value}</span>
              <Progress value={value} />
            </div>
          ))}
        </div>
      </section>

      {/* Indeterminate */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Indeterminate
        </h3>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            value=undefined (indeterminate)
          </span>
          <Progress />
        </div>
      </section>
    </div>
  );
}
