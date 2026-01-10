import { Button } from '@rafters/ui/components/ui/button';

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
const STYLE_VARIANTS = ['outline', 'ghost'] as const;
const SIZES = ['sm', 'default', 'lg', 'icon'] as const;

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}

export function ButtonVariants() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Button variant={variant}>{variant}</Button>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STYLE_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Button variant={variant}>{variant}</Button>
              <span className="text-xs text-muted-foreground font-mono">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Disabled States */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Disabled State
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Button variant={variant} disabled>
                {variant}
              </Button>
              <span className="text-xs text-muted-foreground font-mono">{variant} disabled</span>
            </div>
          ))}
        </div>
      </section>

      {/* Loading States */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Loading State
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Button variant={variant} loading>
                {variant}
              </Button>
              <span className="text-xs text-muted-foreground font-mono">{variant} loading</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ButtonSizes() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* All Sizes */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-4 items-end justify-center">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Button size={size}>{size === 'icon' ? <PlusIcon /> : size}</Button>
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
                      <Button variant={variant} size={size}>
                        {size === 'icon' ? <PlusIcon /> : 'Btn'}
                      </Button>
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
