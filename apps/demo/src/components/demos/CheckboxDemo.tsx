import { Checkbox } from '@rafters/ui/components/ui/checkbox';
import { Label } from '@rafters/ui/components/ui/label';

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

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="demo-terms" defaultChecked />
      <Label htmlFor="demo-terms">Accept terms and conditions</Label>
    </div>
  );
}

export function CheckboxVariants() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Semantic Variants - Unchecked */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants (Unchecked)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex items-center gap-2">
              <Checkbox id={`unchecked-${variant}`} variant={variant} />
              <Label htmlFor={`unchecked-${variant}`} className="font-mono text-xs">
                {variant}
              </Label>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Variants - Checked */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants (Checked)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex items-center gap-2">
              <Checkbox id={`checked-${variant}`} variant={variant} defaultChecked />
              <Label htmlFor={`checked-${variant}`} className="font-mono text-xs">
                {variant}
              </Label>
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
            <div key={size} className="flex items-center gap-2">
              <Checkbox id={`size-${size}`} size={size} defaultChecked />
              <Label htmlFor={`size-${size}`} className="font-mono text-xs">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </section>

      {/* Disabled States */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Disabled States
        </h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label htmlFor="disabled-unchecked" className="font-mono text-xs">
              disabled unchecked
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled-checked" disabled defaultChecked />
            <Label htmlFor="disabled-checked" className="font-mono text-xs">
              disabled checked
            </Label>
          </div>
        </div>
      </section>
    </div>
  );
}
