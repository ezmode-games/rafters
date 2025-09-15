/**
 * Form label component with semantic variants and accessibility associations
 *
 * @registry-name label
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Label.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Provides clarity and reduces interpretation effort
 * @attention-economics Information hierarchy: field=required label, hint=helpful guidance, error=attention needed
 * @trust-building Clear requirement indication, helpful hints, non-punitive error messaging
 * @accessibility Form association, screen reader optimization, color-independent error indication
 * @semantic-meaning Variant meanings: field=input association, hint=guidance, error=validation feedback, success=confirmation
 *
 * @usage-patterns
 * DO: Always associate with input using htmlFor/id
 * DO: Use importance levels to guide user attention
 * DO: Provide visual and semantic marking for required fields
 * DO: Adapt styling based on form vs descriptive context
 * NEVER: Orphaned labels, unclear or ambiguous text, missing required indicators
 *
 * @design-guides
 * - Typography Intelligence: https://rafters.realhandy.tech/docs/llm/typography-intelligence
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-label
 *
 * @example
 * ```tsx
 * // Form label with required indication
 * <Label htmlFor="email" required>
 *   Email Address
 * </Label>
 * <Input id="email" type="email" />
 *
 * // Label with validation state
 * <Label variant="error" htmlFor="password">
 *   Password (required)
 * </Label>
 * ```
 */
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '../lib/utils';

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
