import { Spinner } from '@rafters/ui/components/ui/spinner';

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
const SIZES = ['sm', 'default', 'lg'] as const;

export function SpinnerDemo() {
  return (
    <div className="flex gap-8 items-center justify-center">
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
    </div>
  );
}

export function SpinnerVariants() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="flex flex-wrap gap-6">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Spinner variant={variant} />
              <span className="text-xs text-muted-foreground font-mono">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-6 items-end">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Spinner size={size} />
              <span className="text-xs text-muted-foreground font-mono">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Variant + Size Combinations */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Variant + Size Combinations
        </h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="success" size="sm" />
            <span className="text-xs text-muted-foreground font-mono">success sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="warning" size="default" />
            <span className="text-xs text-muted-foreground font-mono">warning default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="destructive" size="lg" />
            <span className="text-xs text-muted-foreground font-mono">destructive lg</span>
          </div>
        </div>
      </section>
    </div>
  );
}
