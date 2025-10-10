/**
 * Text label component for form fields and descriptions
 *
 * @registryName label
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Label.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 1/10 - Simple text labels provide clear context with minimal mental effort
 * @attentionEconomics Supportive element - provides context without competing for primary attention
 * @trustBuilding Clear requirement indication and helpful guidance build user confidence
 * @accessibility WCAG AAA compliant with proper form associations and screen reader support
 * @semanticMeaning Required indicators and validation states communicate form field requirements
 *
 * @usagePatterns
 * DO: Always associate with inputs using htmlFor/id attributes
 * DO: Clearly indicate required fields with visual markers
 * DO: Use appropriate importance levels for information hierarchy
 * NEVER: Orphaned labels without form associations or unclear text
 *
 * @designGuides
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/foundation/cognitive-load
 *
 * @dependencies @radix-ui/react-label
 *
 * @example
 * ```tsx
 * // Required field with clear association
 * <Label htmlFor="email" required>
 *   Email Address
 * </Label>
 * <Input id="email" type="email" />
 * ```
 */
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../utils';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
  importance?: 'critical' | 'standard' | 'optional';
  context?: 'form' | 'descriptive' | 'action';
  validationState?: 'error' | 'warning' | 'success' | 'default';
  helpText?: string;
  semantic?: boolean;
  ref?: React.Ref<React.ElementRef<typeof LabelPrimitive.Root>>;
}

export function Label({
  className,
  required,
  importance = 'standard',
  context = 'form',
  validationState = 'default',
  helpText,
  semantic = true,
  children,
  ref,
  ...props
}: LabelProps) {
  return (
    <div className={cn('space-y-1', semantic && 'semantic-label-container')}>
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          // Base label styling
          'text-sm leading-none text-foreground',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-disabled',

          // Importance-based visual hierarchy
          {
            'font-semibold': importance === 'critical',
            'font-medium': importance === 'standard',
            'font-normal opacity-75': importance === 'optional',
          },

          // Context-specific styling
          {
            'cursor-pointer': context === 'form',
            'cursor-default': context === 'descriptive',
            'cursor-pointer hover:text-accent-foreground': context === 'action',
          },

          // Validation state colors
          {
            'text-destructive': validationState === 'error',
            'text-warning': validationState === 'warning',
            'text-success': validationState === 'success',
          },

          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span
            className={cn(
              'ml-1',
              validationState === 'error' ? 'text-destructive' : 'text-destructive'
            )}
            aria-hidden="true"
          >
            *
          </span>
        )}
        {importance === 'optional' && !required && (
          <span className="ml-1 text-muted-foreground text-xs font-normal">(optional)</span>
        )}
      </LabelPrimitive.Root>

      {helpText && (
        <p
          className={cn('text-xs text-muted-foreground', {
            'text-destructive': validationState === 'error',
            'text-warning': validationState === 'warning',
            'text-success': validationState === 'success',
          })}
          role={validationState === 'error' ? 'alert' : 'status'}
          aria-live={validationState === 'error' ? 'assertive' : 'polite'}
        >
          {helpText}
        </p>
      )}
    </div>
  );
}
