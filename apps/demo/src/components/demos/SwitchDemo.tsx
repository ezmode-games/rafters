import { Label } from '@rafters/ui/components/ui/label';
import { Switch } from '@rafters/ui/components/ui/switch';

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

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="demo-notifications" defaultChecked />
      <Label htmlFor="demo-notifications">Enable notifications</Label>
    </div>
  );
}

export function SwitchVariants() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Semantic Variants - Off */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants (Off)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex items-center gap-2">
              <Switch id={`off-${variant}`} variant={variant} />
              <Label htmlFor={`off-${variant}`} className="font-mono text-xs">
                {variant}
              </Label>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Variants - On */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants (On)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex items-center gap-2">
              <Switch id={`on-${variant}`} variant={variant} defaultChecked />
              <Label htmlFor={`on-${variant}`} className="font-mono text-xs">
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
        <div className="flex flex-wrap gap-6 items-center">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Switch id={`size-${size}`} size={size} defaultChecked />
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
            <Switch id="disabled-off" disabled />
            <Label htmlFor="disabled-off" className="font-mono text-xs">
              disabled off
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="disabled-on" disabled defaultChecked />
            <Label htmlFor="disabled-on" className="font-mono text-xs">
              disabled on
            </Label>
          </div>
        </div>
      </section>
    </div>
  );
}
