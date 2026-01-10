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

export function LabelDemo() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
      <Label htmlFor="email">Your email address</Label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
  );
}

export function LabelVariants() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col gap-1">
              <Label variant={variant}>{variant} label</Label>
              <span className="text-xs text-muted-foreground font-mono">variant="{variant}"</span>
            </div>
          ))}
        </div>
      </section>

      {/* With Inputs */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          With Input Association
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="default-input">Default Label</Label>
            <Input id="default-input" placeholder="Default input" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="success-input" variant="success">
              Success Label
            </Label>
            <Input id="success-input" variant="success" placeholder="Success input" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="destructive-input" variant="destructive">
              Error Label
            </Label>
            <Input id="destructive-input" variant="destructive" placeholder="Error input" />
          </div>
        </div>
      </section>

      {/* Required Field Pattern */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Required Field Pattern
        </h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="required-input">
            Required Field <span className="text-destructive">*</span>
          </Label>
          <Input id="required-input" placeholder="This field is required" />
        </div>
      </section>
    </div>
  );
}
