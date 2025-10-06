/**
 * Text input component for data collection
 *
 * @registryName input
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Input.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 2/10 - Simple data entry with clear expectations
 * @attentionEconomics Secondary priority - should not compete with primary actions
 * @trustBuilding Immediate validation feedback builds user confidence. Clear error states prevent confusion
 * @accessibility WCAG AAA compliant with proper labeling, keyboard navigation, and screen reader support
 * @semanticMeaning Variants indicate data type and validation requirements
 *
 * @usagePatterns
 * DO: Always pair with descriptive labels
 * DO: Provide helpful placeholder examples showing expected format
 * DO: Immediate validation feedback for user confidence
 * DO: Use schema prop with InputSchemas for automatic masking
 * NEVER: Label-less inputs or validation only on submit
 *
 * @designGuides
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/foundation/cognitive-load
 *
 * @dependencies masky-js
 *
 * @example
 * ```tsx
 * // Standard text input with proper labeling
 * <Input type="email" placeholder="user@example.com" />
 *
 * // Error state with validation feedback
 * <Input type="email" error="Please enter a valid email address" />
 *
 * // With automatic masking from schema
 * <Input schema={InputSchemas.phoneUS} placeholder="Enter phone number" />
 *
 * // With explicit mask pattern
 * <Input mask="(000) 000-0000" placeholder="Phone" />
 * ```
 */

import { type MaskPreset, MaskPresets } from '@rafters/shared';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { cn } from '../lib/utils';

/**
 * Infers mask pattern from Zod schema description.
 *
 * Only checks schema.description for preset hints to avoid brittle internal API usage.
 * For advanced inference, provide mask explicitly or encode it in schema description.
 *
 * @param schema - Zod schema to analyze
 * @returns Mask pattern string or null if no match found
 * @example
 * const schema = z.string().describe('phone-us');
 * inferMask(schema); // Returns '(000) 000-0000'
 */
function inferMask(schema?: z.ZodType): string | null {
  if (!schema) return null;

  // Check description for preset hint
  const desc = schema.description;
  if (desc && desc in MaskPresets) {
    return MaskPresets[desc as MaskPreset];
  }

  return null;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success' | 'warning';
  validationMode?: 'live' | 'onBlur' | 'onSubmit';
  sensitive?: boolean;
  showValidation?: boolean;
  validationMessage?: string;
  schema?: z.ZodType;
  mask?: MaskPreset | string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({
  variant = 'default',
  validationMode = 'onBlur',
  sensitive = false,
  showValidation = false,
  validationMessage,
  schema,
  mask,
  className,
  type,
  ref,
  ...props
}: InputProps) {
  // Mask logic: Determine which mask to apply
  const appliedMask = mask || inferMask(schema);
  const resolvedMask =
    appliedMask && appliedMask in MaskPresets
      ? MaskPresets[appliedMask as MaskPreset]
      : appliedMask;

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic import of masky-js when mask is present
  useEffect(() => {
    if (!resolvedMask || !inputRef.current) {
      return undefined;
    }

    let cleanup: (() => void) | undefined;

    import('masky-js')
      .then(() => {
        // Masky auto-initializes from data-mask attribute
        // Store cleanup function if needed
        cleanup = () => {
          // Masky cleanup happens automatically on element removal
        };
      })
      .catch(() => {
        // Silently fail if masky-js is not available
        // This allows graceful degradation in environments without the dependency
      });

    return () => {
      cleanup?.();
    };
  }, [resolvedMask]);

  // Trust-building: Visual indicators for sensitive data
  const isSensitiveData = sensitive || type === 'password' || type === 'email';

  // Validation intelligence: Choose appropriate feedback timing
  const needsImmediateFeedback = variant === 'error' && validationMode === 'live';
  // Intelligence reference - validation state detection
  // const _hasValidationState = variant !== 'default';

  return (
    <div className="relative">
      <input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }
        }}
        type={type}
        data-mask={resolvedMask || undefined}
        className={cn(
          // Base styles - using semantic tokens with motor accessibility
          'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-disabled',
          'transition-all motion-focus',
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
