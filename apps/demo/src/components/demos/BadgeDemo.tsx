import { Badge } from '@rafters/ui/components/ui/badge';

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
const STYLE_VARIANTS = ['outline'] as const;
const SIZES = ['sm', 'default', 'lg'] as const;

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  );
}

export function BadgeVariants() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="flex flex-wrap gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Badge variant={variant}>{variant}</Badge>
              <span className="text-xs text-muted-foreground font-mono">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Style Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Style Variants
        </h3>
        <div className="flex flex-wrap gap-4">
          {STYLE_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Badge variant={variant}>{variant}</Badge>
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
        <div className="flex flex-wrap gap-4 items-end">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Badge size={size}>{size}</Badge>
              <span className="text-xs text-muted-foreground font-mono">{size}</span>
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
                {SEMANTIC_VARIANTS.map((variant) => (
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
                  {SEMANTIC_VARIANTS.map((variant) => (
                    <td key={variant} className="text-center p-2 border-b border-border">
                      <Badge variant={variant} size={size}>
                        Badge
                      </Badge>
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
