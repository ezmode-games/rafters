/**
 * WhyGate - Reasoning Gate Component
 *
 * Forces user to provide a reason before proceeding with an action.
 * Central to Design Intelligence - every decision needs a "why".
 *
 * Uses GSAP for placeholder cycling animation.
 * Uses @rafters/ui components and classy for dogfooding.
 */

import { Button } from '@rafters/ui/components/ui/button';
import { Card, CardContent } from '@rafters/ui/components/ui/card';
import { Muted, P } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import gsap from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface WhyGateProps {
  /** Title displayed above the textarea */
  title: string;
  /** Placeholder text examples that cycle */
  placeholders: string[];
  /** Minimum character count required (default: 3) */
  minChars?: number;
  /** Submit button label */
  submitLabel: string;
  /** Called when user submits with valid reason */
  onSubmit: (reason: string) => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Additional content to render above the textarea */
  children?: React.ReactNode;
}

/**
 * WhyGate forces a reasoning step before any design decision.
 * Without this, AI would just record WHAT changed, not WHY.
 */
export function WhyGate({
  title,
  placeholders,
  minChars = 3,
  submitLabel,
  onSubmit,
  onCancel,
  children,
}: WhyGateProps) {
  const [reason, setReason] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);

  const isValid = reason.trim().length >= minChars;

  // Cycle through placeholders with GSAP animation
  useEffect(() => {
    if (placeholders.length <= 1) return;

    const interval = 4000; // 4 seconds per placeholder
    let timeoutId: ReturnType<typeof setTimeout>;

    const cycle = () => {
      if (placeholderRef.current) {
        // Fade out
        gsap.to(placeholderRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
            // Fade in
            if (placeholderRef.current) {
              gsap.to(placeholderRef.current, {
                opacity: 0.5,
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          },
        });
      }
      timeoutId = setTimeout(cycle, interval);
    };

    timeoutId = setTimeout(cycle, interval);

    return () => clearTimeout(timeoutId);
  }, [placeholders]);

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (isValid) {
      onSubmit(reason.trim());
    }
  }, [isValid, onSubmit, reason]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Cmd/Ctrl+Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValid) {
        e.preventDefault();
        handleSubmit();
      }
      // Escape to cancel
      if (e.key === 'Escape' && onCancel) {
        e.preventDefault();
        onCancel();
      }
    },
    [handleSubmit, isValid, onCancel],
  );

  return (
    <Card className={classy('w-72', 'shadow-lg')}>
      <CardContent className={classy('p-4')}>
        {/* Optional children (like color swatch) */}
        {children}

        {/* Title */}
        <P className={classy('mb-2', 'font-medium')}>{title}</P>

        {/* Textarea with cycling placeholder */}
        <div className={classy('relative', 'mb-3')}>
          <textarea
            ref={textareaRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={handleKeyDown}
            className={classy(
              'flex',
              'w-full',
              'rounded-md',
              'border',
              'border-input',
              'bg-background',
              'px-3',
              'py-2',
              'text-sm',
              'ring-offset-background',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-primary',
              'focus-visible:ring-offset-2',
              'min-h-20',
              'resize-none',
            )}
            aria-label={title}
          />
          {/* Custom cycling placeholder */}
          {!reason && (
            <span
              ref={placeholderRef}
              className={classy(
                'pointer-events-none',
                'absolute',
                'left-3',
                'top-2',
                'text-sm',
                'text-muted-foreground',
                'opacity-50',
              )}
            >
              {placeholders[placeholderIndex]}
            </span>
          )}
        </div>

        {/* Hint */}
        <Muted className={classy('mb-3', 'text-xs')}>
          {isValid
            ? 'Press Cmd+Enter to continue'
            : `${minChars - reason.trim().length} more chars needed`}
        </Muted>

        {/* Buttons */}
        <div className={classy('flex', 'gap-2')}>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={!isValid}
            className={classy('flex-1')}
          >
            {submitLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default WhyGate;
