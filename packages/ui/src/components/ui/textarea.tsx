/**
 * Multi-line text input component for longer form content
 *
 * @cognitive-load 4/10 - Extended input requires sustained attention for composition
 * @attention-economics Expands to accommodate content, focus state indicates active editing
 * @trust-building Auto-resize feedback, character count guidance, draft persistence patterns
 * @accessibility Screen reader labels, keyboard navigation, proper focus states
 * @semantic-meaning Extended text input: comments, descriptions, messages, notes
 *
 * @usage-patterns
 * DO: Always pair with descriptive Label component
 * DO: Provide placeholder text showing expected content format
 * DO: Use appropriate min/max heights for expected content length
 * DO: Consider character limits with visible counter
 * NEVER: Use for single-line input, use without associated label
 *
 * @example
 * ```tsx
 * <Label htmlFor="message">Message</Label>
 * <Textarea id="message" placeholder="Type your message here..." />
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disabled, ...props }, ref) => {
    const baseClasses =
      'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
      'ring-offset-background ' +
      'placeholder:text-muted-foreground ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
      'disabled:cursor-not-allowed disabled:opacity-50';

    const cls = classy(baseClasses, className);

    return (
      <textarea
        className={cls}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : undefined}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
