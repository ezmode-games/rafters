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
import classy from '../../primitives/classy';

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
 * H1 - Primary page heading
 * Use once per page for the main title
 */
export const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'h1';
    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={classy(typographyClasses.h1, className)}
        {...props}
      />
    );
  },
);
H1.displayName = 'H1';

/**
 * H2 - Section heading
 * Use for major sections within the page
 */
export const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'h2';
    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={classy(typographyClasses.h2, className)}
        {...props}
      />
    );
  },
);
H2.displayName = 'H2';

/**
 * H3 - Subsection heading
 * Use for subsections within H2 sections
 */
export const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'h3';
    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={classy(typographyClasses.h3, className)}
        {...props}
      />
    );
  },
);
H3.displayName = 'H3';

/**
 * H4 - Minor heading
 * Use for smaller subsections or grouped content
 */
export const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ as, className, ...props }, ref) => {
    const Component = as ?? 'h4';
    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={classy(typographyClasses.h4, className)}
        {...props}
      />
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
