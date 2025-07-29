/**
 * AI Intelligence: Token knowledge in .rafters/tokens/registry.json
 */
import * as LabelPrimitive from '@radix-ui/react-label';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
  importance?: 'critical' | 'standard' | 'optional';
  context?: 'form' | 'descriptive' | 'action';
  validationState?: 'error' | 'warning' | 'success' | 'default';
  helpText?: string;
  semantic?: boolean;
}

export const Label = forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  (
    {
      className,
      required,
      importance = 'standard',
      context = 'form',
      validationState = 'default',
      helpText,
      semantic = true,
      children,
      ...props
    },
    ref
  ) => (
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
            aria-label="required field"
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
  )
);

Label.displayName = LabelPrimitive.Root.displayName;
