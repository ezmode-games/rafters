/**
 * Typography primitives for consistent text styling and hierarchy
 *
 * @cognitive-load 2/10 - Familiar text patterns with clear visual hierarchy
 * @attention-economics Hierarchy guides reading: H1=page title (one per page), H2=sections, H3=subsections, body text flows naturally
 * @trust-building Consistent typography builds readability and professionalism
 * @accessibility Proper heading hierarchy for screen readers; sufficient contrast ratios
 * @semantic-meaning Element mapping: H1-H4=document structure, P=body content, Lead=introductions, Muted=secondary info, Code=technical content
 *
 * @usage-patterns
 * DO: Use H1 once per page for main title
 * DO: Follow heading hierarchy (H1 -> H2 -> H3, never skip)
 * DO: Use Lead for introductory paragraphs
 * DO: Use Muted for supplementary information
 * NEVER: Skip heading levels (H1 -> H3)
 * NEVER: Use headings for styling only (use CSS instead)
 * NEVER: Use multiple H1s on a single page
 *
 * @example
 * ```tsx
 * // Page structure
 * <H1>Page Title</H1>
 * <Lead>This is an introduction to the page content.</Lead>
 *
 * <H2>Section Title</H2>
 * <P>Body paragraph with standard styling.</P>
 *
 * <H3>Subsection</H3>
 * <P>More content here.</P>
 * <Muted>Last updated: Jan 2025</Muted>
 *
 * // Code example
 * <P>Use the <Code>useState</Code> hook for local state.</P>
 *
 * // Blockquote
 * <Blockquote>
 *   "Design is not just what it looks like. Design is how it works."
 * </Blockquote>
 * ```
 */
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import classy from '../../primitives/classy';
import type { InlineContent } from '../../primitives/types';

// ============================================================================
// Editable Typography Props (R-200)
// ============================================================================

/**
 * Shared editable props for typography components
 * Note: Types include `| undefined` explicitly for exactOptionalPropertyTypes compatibility
 */
export interface EditableTypographyProps {
  /** Enable contenteditable mode */
  editable?: boolean | undefined;
  /** Called when content changes */
  onChange?: ((content: string | InlineContent[]) => void) | undefined;
  /** Called when element gains focus */
  onFocus?: (() => void) | undefined;
  /** Called when element loses focus */
  onBlur?: (() => void) | undefined;
  /** Placeholder shown when empty */
  placeholder?: string | undefined;
  /** Called on key down (for custom handling) */
  onKeyDown?: ((event: React.KeyboardEvent) => void) | undefined;
  /** Called on Enter key (for custom handling) */
  onEnter?: (() => void) | undefined;
  /** Called on Backspace at start (for custom handling) */
  onBackspaceAtStart?: (() => void) | undefined;
}

// ============================================================================
// Typography Classes
// ============================================================================

// Typography variant classes using semantic design tokens
const typographyClasses = {
  h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-foreground',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight text-foreground',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-foreground',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-foreground',
  p: 'leading-7 text-foreground',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold text-foreground',
  small: 'text-sm font-medium leading-none text-foreground',
  muted: 'text-sm text-muted-foreground',
  code: 'rounded bg-muted px-1 py-0.5 font-mono text-sm text-foreground',
  blockquote: 'mt-6 border-l-2 border-border pl-6 italic text-foreground',
} as const;

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Override the default HTML element */
  as?: React.ElementType;
}

/**
 * Extended props for editable heading components (R-200a)
 * Omits conflicting event handlers from TypographyProps since EditableTypographyProps
 * provides simplified callback signatures for editor use.
 */
export interface EditableHeadingProps
  extends Omit<TypographyProps, 'onChange' | 'onBlur' | 'onFocus' | 'onKeyDown'>,
    EditableTypographyProps {
  /** Content as string for controlled editing */
  children?: React.ReactNode;
}

// ============================================================================
// Editable Heading Hook (R-200a)
// ============================================================================

/**
 * Hook for contenteditable heading behavior
 */
function useEditableHeading({
  editable,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  onKeyDown,
  onEnter,
  onBackspaceAtStart,
}: EditableTypographyProps) {
  const elementRef = useRef<HTMLElement>(null);
  const lastContentRef = useRef<string>('');

  // Handle input events
  const handleInput = useCallback(() => {
    if (!elementRef.current || !onChange) return;

    const content = elementRef.current.textContent ?? '';
    if (content !== lastContentRef.current) {
      lastContentRef.current = content;
      onChange(content);
    }
  }, [onChange]);

  // Handle key down events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'Enter') {
        // Prevent default line break in headings
        event.preventDefault();
        onEnter?.();
      } else if (event.key === 'Backspace') {
        const selection = window.getSelection();
        const element = elementRef.current;
        if (
          selection &&
          element &&
          selection.isCollapsed &&
          selection.anchorOffset === 0 &&
          selection.anchorNode === element.firstChild
        ) {
          // Cursor is at the start
          onBackspaceAtStart?.();
        }
      }
    },
    [onKeyDown, onEnter, onBackspaceAtStart],
  );

  // Handle focus
  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  // Handle paste - strip formatting for headings (plain text only)
  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    // Remove line breaks from pasted text
    const singleLine = text.replace(/[\r\n]+/g, ' ');
    document.execCommand('insertText', false, singleLine);
  }, []);

  // Sync content when children change (controlled mode)
  useEffect(() => {
    if (!editable || !elementRef.current) return;

    const element = elementRef.current;
    const currentContent = element.textContent ?? '';
    const expectedContent = lastContentRef.current;

    // Only update DOM if it differs (avoid cursor jumping)
    if (currentContent !== expectedContent && element !== document.activeElement) {
      element.textContent = expectedContent;
    }
  }, [editable]);

  // Build props for the editable element (ref handled separately)
  const editableProps = editable
    ? {
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: handleInput,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onPaste: handlePaste,
        'data-placeholder': placeholder,
        'aria-placeholder': placeholder,
      }
    : {};

  return { editableProps, elementRef };
}

/**
 * H1 - Primary page heading
 * Use once per page for the main title
 *
 * Supports editable mode (R-200a) with contenteditable for block editing.
 *
 * @example
 * ```tsx
 * // Static heading
 * <H1>Page Title</H1>
 *
 * // Editable heading
 * <H1
 *   editable
 *   onChange={(content) => setTitle(content)}
 *   placeholder="Enter title..."
 *   onEnter={() => createNextBlock()}
 * >
 *   {title}
 * </H1>
 * ```
 */
export const H1 = React.forwardRef<HTMLHeadingElement, EditableHeadingProps>(
  (
    {
      as,
      className,
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
      children,
      ...props
    },
    ref,
  ) => {
    const { editableProps, elementRef } = useEditableHeading({
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
    });

    const Component = as ?? 'h1';

    // Combine refs
    const combinedRef = (element: HTMLHeadingElement | null) => {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLHeadingElement | null>).current = element;
      }
    };

    return (
      <Component
        ref={combinedRef}
        className={classy(
          typographyClasses.h1,
          editable && 'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
          // Placeholder styling should be applied via CSS using [data-placeholder]:empty:before
          className,
        )}
        data-editable={editable || undefined}
        {...editableProps}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
H1.displayName = 'H1';

/**
 * H2 - Section heading
 * Use for major sections within the page
 *
 * Supports editable mode (R-200a) with contenteditable for block editing.
 */
export const H2 = React.forwardRef<HTMLHeadingElement, EditableHeadingProps>(
  (
    {
      as,
      className,
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
      children,
      ...props
    },
    ref,
  ) => {
    const { editableProps, elementRef } = useEditableHeading({
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
    });

    const Component = as ?? 'h2';

    const combinedRef = (element: HTMLHeadingElement | null) => {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLHeadingElement | null>).current = element;
      }
    };

    return (
      <Component
        ref={combinedRef}
        className={classy(
          typographyClasses.h2,
          editable && 'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
          // Placeholder styling should be applied via CSS using [data-placeholder]:empty:before
          className,
        )}
        data-editable={editable || undefined}
        {...editableProps}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
H2.displayName = 'H2';

/**
 * H3 - Subsection heading
 * Use for subsections within H2 sections
 *
 * Supports editable mode (R-200a) with contenteditable for block editing.
 */
export const H3 = React.forwardRef<HTMLHeadingElement, EditableHeadingProps>(
  (
    {
      as,
      className,
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
      children,
      ...props
    },
    ref,
  ) => {
    const { editableProps, elementRef } = useEditableHeading({
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
    });

    const Component = as ?? 'h3';

    const combinedRef = (element: HTMLHeadingElement | null) => {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLHeadingElement | null>).current = element;
      }
    };

    return (
      <Component
        ref={combinedRef}
        className={classy(
          typographyClasses.h3,
          editable && 'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
          // Placeholder styling should be applied via CSS using [data-placeholder]:empty:before
          className,
        )}
        data-editable={editable || undefined}
        {...editableProps}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
H3.displayName = 'H3';

/**
 * H4 - Minor heading
 * Use for smaller subsections or grouped content
 *
 * Supports editable mode (R-200a) with contenteditable for block editing.
 */
export const H4 = React.forwardRef<HTMLHeadingElement, EditableHeadingProps>(
  (
    {
      as,
      className,
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
      children,
      ...props
    },
    ref,
  ) => {
    const { editableProps, elementRef } = useEditableHeading({
      editable,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      onKeyDown,
      onEnter,
      onBackspaceAtStart,
    });

    const Component = as ?? 'h4';

    const combinedRef = (element: HTMLHeadingElement | null) => {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLHeadingElement | null>).current = element;
      }
    };

    return (
      <Component
        ref={combinedRef}
        className={classy(
          typographyClasses.h4,
          editable && 'outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded',
          // Placeholder styling should be applied via CSS using [data-placeholder]:empty:before
          className,
        )}
        data-editable={editable || undefined}
        {...editableProps}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
H4.displayName = 'H4';

/**
 * P - Body paragraph
 * Standard paragraph text with proper line height
 */
export const P = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'p';
    return (
      <Component
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={classy(typographyClasses.p, className)}
        {...props}
      />
    );
  },
);
P.displayName = 'P';

/**
 * Lead - Introductory paragraph
 * Larger, muted text for page or section introductions
 */
export const Lead = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'p';
    return (
      <Component
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={classy(typographyClasses.lead, className)}
        {...props}
      />
    );
  },
);
Lead.displayName = 'Lead';

/**
 * Large - Emphasized text
 * Larger, semibold text for emphasis
 */
export const Large = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'div';
    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
        className={classy(typographyClasses.large, className)}
        {...props}
      />
    );
  },
);
Large.displayName = 'Large';

/**
 * Small - Smaller text
 * For fine print, captions, or supporting text
 */
export const Small = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'small';
    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={classy(typographyClasses.small, className)}
        {...props}
      />
    );
  },
);
Small.displayName = 'Small';

/**
 * Muted - Secondary text
 * De-emphasized text for metadata or supplementary info
 */
export const Muted = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'p';
    return (
      <Component
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={classy(typographyClasses.muted, className)}
        {...props}
      />
    );
  },
);
Muted.displayName = 'Muted';

/**
 * Code - Inline code
 * Monospace text for code snippets, commands, or technical terms
 */
export const Code = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'code';
    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={classy(typographyClasses.code, className)}
        {...props}
      />
    );
  },
);
Code.displayName = 'Code';

/**
 * Blockquote - Block quotation
 * For quotations or callouts with left border emphasis
 */
export const Blockquote = React.forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'blockquote';
    return (
      <Component
        ref={ref as React.Ref<HTMLQuoteElement>}
        className={classy(typographyClasses.blockquote, className)}
        {...props}
      />
    );
  },
);
Blockquote.displayName = 'Blockquote';

// Export typography classes for direct use
export { typographyClasses };
