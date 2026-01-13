import { Toggle } from '@rafters/ui/components/ui/toggle';

const SEMANTIC_VARIANTS = [
  'primary',
  'secondary',
  'destructive',
  'success',
  'warning',
  'info',
  'accent',
] as const;
const STYLE_VARIANTS = ['outline', 'ghost'] as const;
const SIZES = ['sm', 'default', 'lg'] as const;

function BoldIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
      />
    </svg>
  );
}

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export function ToggleVariants() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Semantic Variants - Unpressed */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants (Unpressed)
        </h3>
        <div className="flex flex-wrap gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Toggle variant={variant} aria-label={variant}>
                <BoldIcon />
              </Toggle>
              <span className="text-xs text-muted-foreground font-mono">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Variants - Pressed */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants (Pressed)
        </h3>
        <div className="flex flex-wrap gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <Toggle variant={variant} defaultPressed aria-label={variant}>
                <BoldIcon />
              </Toggle>
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
              <Toggle variant={variant} defaultPressed aria-label={variant}>
                <BoldIcon />
              </Toggle>
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
              <Toggle size={size} defaultPressed aria-label={size}>
                <BoldIcon />
              </Toggle>
              <span className="text-xs text-muted-foreground font-mono">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Disabled */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Disabled States
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <Toggle disabled aria-label="disabled unpressed">
              <BoldIcon />
            </Toggle>
            <span className="text-xs text-muted-foreground font-mono">disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Toggle disabled defaultPressed aria-label="disabled pressed">
              <BoldIcon />
            </Toggle>
            <span className="text-xs text-muted-foreground font-mono">disabled pressed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
