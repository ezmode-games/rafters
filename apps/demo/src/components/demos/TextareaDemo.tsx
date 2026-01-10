import { Label } from '@rafters/ui/components/ui/label';
import { Textarea } from '@rafters/ui/components/ui/textarea';

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

export function TextareaDemo() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  );
}

export function TextareaVariants() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* Semantic Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Semantic Variants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEMANTIC_VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-mono">variant="{variant}"</span>
              <Textarea variant={variant} placeholder={`${variant} textarea`} />
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
              <Textarea size={size} placeholder={`${size} size textarea`} />
            </div>
          ))}
        </div>
      </section>

      {/* Disabled State */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Disabled State
        </h3>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground font-mono">disabled</span>
          <Textarea placeholder="Disabled textarea" disabled />
        </div>
      </section>

      {/* With Label */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          With Label
        </h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="feedback">Feedback</Label>
          <Textarea id="feedback" placeholder="Tell us what you think..." />
        </div>
      </section>
    </div>
  );
}
