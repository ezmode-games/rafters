/**
 * Input Component - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (simple data entry, requires label context)
 * TRUST BUILDING: Immediate feedback builds user confidence
 * ACCESSIBILITY PRIORITY: Label association and error states must be clear
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Trust Building Patterns: rafters.realhandy.tech/llm/patterns/trust-building
 * - Typography Intelligence: rafters.realhandy.tech/llm/patterns/typography-intelligence
 * - Progressive Enhancement: rafters.realhandy.tech/llm/patterns/progressive-enhancement
 *
 * USAGE PATTERNS:
 * ✅ Clear Labels: Always pair with descriptive Label component
 * ✅ Helpful Placeholders: Show format examples, not instructions
 * ✅ Real-time Validation: Immediate feedback for user confidence
 * ✅ Sensitive Data: Use appropriate type and validation for security
 * ❌ Never: Label-less inputs, validation only on submit, unclear error messages
 *
 * Token knowledge: .rafters/tokens/registry.json
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success' | 'warning';
  validationMode?: 'live' | 'onBlur' | 'onSubmit';
  sensitive?: boolean;
  showValidation?: boolean;
  validationMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      validationMode = 'onBlur',
      sensitive = false,
      showValidation = false,
      validationMessage,
      className,
      type,
      ...props
    },
    ref
  ) => {
    // Trust-building: Visual indicators for sensitive data
    const isSensitiveData = sensitive || type === 'password' || type === 'email';

    // Validation intelligence: Choose appropriate feedback timing
    const needsImmediateFeedback = variant === 'error' && validationMode === 'live';
    const hasValidationState = variant !== 'default';

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={cn(
            // Base styles - using semantic tokens with motor accessibility
            'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-disabled',
            'transition-all duration-200',
            'hover:opacity-hover',

            // Motor accessibility: Enhanced touch targets on mobile
            'min-h-[44px] sm:min-h-[40px]',

            // Trust-building: Visual indicators for sensitive data
            isSensitiveData && 'shadow-sm border-2',

            // Validation intelligence: Semantic variants with clear meaning
            {
              'border-input bg-background focus-visible:ring-primary': variant === 'default',
              'border-destructive bg-destructive/10 focus-visible:ring-destructive text-destructive-foreground':
                variant === 'error',
              'border-success bg-success/10 focus-visible:ring-success text-success-foreground':
                variant === 'success',
              'border-warning bg-warning/10 focus-visible:ring-warning text-warning-foreground':
                variant === 'warning',
            },

            // Enhanced styling for immediate feedback mode
            needsImmediateFeedback && 'ring-2 ring-destructive/20',

            className
          )}
          aria-invalid={variant === 'error'}
          aria-describedby={
            showValidation && validationMessage ? `${props.id || 'input'}-validation` : undefined
          }
          {...props}
        />

        {/* Validation message with semantic meaning */}
        {showValidation && validationMessage && (
          <div
            id={`${props.id || 'input'}-validation`}
            className={cn('mt-1 text-xs flex items-center gap-1', {
              'text-destructive': variant === 'error',
              'text-success': variant === 'success',
              'text-warning': variant === 'warning',
            })}
            role={variant === 'error' ? 'alert' : 'status'}
            aria-live={needsImmediateFeedback ? 'assertive' : 'polite'}
          >
            {/* Visual indicator for validation state */}
            {variant === 'error' && (
              <span
                className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-1 h-1 rounded-full bg-destructive" />
              </span>
            )}
            {variant === 'success' && (
              <span
                className="w-3 h-3 rounded-full bg-success/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-1 h-1 rounded-full bg-success" />
              </span>
            )}
            {variant === 'warning' && (
              <span
                className="w-3 h-3 rounded-full bg-warning/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-1 h-1 rounded-full bg-warning" />
              </span>
            )}
            {validationMessage}
          </div>
        )}

        {/* Trust-building indicator for sensitive data */}
        {isSensitiveData && (
          <div
            className="absolute right-2 top-2 w-2 h-2 rounded-full bg-primary/30"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
