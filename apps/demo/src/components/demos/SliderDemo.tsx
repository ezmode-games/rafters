import { Slider } from '@rafters/ui/components/ui/slider';

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

export function SliderDemo() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  );
}

export function SliderVariants() {
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
              <Slider variant={variant} defaultValue={[50]} max={100} step={1} />
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
              <Slider size={size} defaultValue={[50]} max={100} step={1} />
            </div>
          ))}
        </div>
      </section>

      {/* Range Selection */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Range Selection
        </h3>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground font-mono">defaultValue=[25, 75]</span>
          <Slider defaultValue={[25, 75]} max={100} step={1} />
        </div>
      </section>

      {/* Disabled */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Disabled State
        </h3>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground font-mono">disabled</span>
          <Slider defaultValue={[50]} max={100} step={1} disabled />
        </div>
      </section>
    </div>
  );
}
