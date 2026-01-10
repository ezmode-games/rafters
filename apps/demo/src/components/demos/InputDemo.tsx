import { Input } from '@rafters/ui/components/ui/input';
import { Label } from '@rafters/ui/components/ui/label';

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

export function InputDemo() {
  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <Label htmlFor="demo-email">Email</Label>
      <Input id="demo-email" type="email" placeholder="you@example.com" />
    </div>
  );
}

export function InputVariants() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* All Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="grid gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col gap-2">
              <Label className="font-mono text-xs">variant="{variant}"</Label>
              <Input variant={variant} placeholder={`${variant} input`} />
            </div>
          ))}
        </div>
      </section>

      {/* Disabled State */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Disabled State
        </h3>
        <div className="grid gap-4">
          {SEMANTIC_VARIANTS.slice(0, 4).map((variant) => (
            <div key={variant} className="flex flex-col gap-2">
              <Label className="font-mono text-xs">variant="{variant}" disabled</Label>
              <Input variant={variant} disabled placeholder={`${variant} disabled`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function InputSizes() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* All Sizes */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Sizes
        </h3>
        <div className="grid gap-4">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <Label className="font-mono text-xs">inputSize="{size}"</Label>
              <Input inputSize={size} placeholder={`${size} input`} />
            </div>
          ))}
        </div>
      </section>

      {/* Size x Variant Matrix */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Size x Variant Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs text-muted-foreground font-mono p-2 border-b border-border">
                  Size
                </th>
                {SEMANTIC_VARIANTS.slice(0, 4).map((variant) => (
                  <th
                    key={variant}
                    className="text-center text-xs text-muted-foreground font-mono p-2 border-b border-border"
                  >
                    {variant}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <td className="text-xs text-muted-foreground font-mono p-2 border-b border-border">
                    {size}
                  </td>
                  {SEMANTIC_VARIANTS.slice(0, 4).map((variant) => (
                    <td key={variant} className="p-2 border-b border-border">
                      <Input variant={variant} inputSize={size} placeholder={variant} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
