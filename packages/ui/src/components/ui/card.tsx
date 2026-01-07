/**
 * Flexible container component for grouping related content with semantic structure
 *
 * @cognitive-load 2/10 - Simple container with clear boundaries and minimal cognitive overhead
 * @attention-economics Neutral container: Content drives attention, elevation hierarchy for interactive states
 * @trust-building Consistent spacing, predictable interaction patterns, clear content boundaries
 * @accessibility Proper heading structure, landmark roles, keyboard navigation for interactive cards
 * @semantic-meaning Structural roles: article=standalone content, section=grouped content, aside=supplementary information
 *
 * @usage-patterns
 * DO: Group related information with clear visual boundaries
 * DO: Create interactive cards with hover states and focus management
 * DO: Establish information hierarchy with header, content, actions
 * DO: Implement responsive scaling with consistent proportions
 * NEVER: Use decorative containers without semantic purpose
 * NEVER: Nest cards within cards
 * NEVER: Use Card for layout (use Grid/Container instead)
 *
 * @example
 * ```tsx
 * // Standalone content - use article
 * <Card as="article">
 *   <CardHeader>
 *     <CardTitle>Blog Post Title</CardTitle>
 *     <CardDescription>Published Jan 2025</CardDescription>
 *   </CardHeader>
 *   <CardContent>Post excerpt...</CardContent>
 * </Card>
 *
 * // Interactive card - product listing
 * <Card interactive>
 *   <CardHeader>
 *     <CardTitle>Product Name</CardTitle>
 *   </CardHeader>
 *   <CardContent>$99.00</CardContent>
 *   <CardFooter>
 *     <Button>Add to Cart</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Supplementary content - use aside
 * <Card as="aside">
 *   <CardHeader>
 *     <CardTitle>Related Links</CardTitle>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 * </Card>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section' | 'aside';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ as: Component = 'div', interactive, className, ...props }, ref) => {
    const base = 'bg-card text-card-foreground border border-card-border rounded-lg shadow-sm';

    const interactiveStyles = interactive
      ? 'hover:bg-card-hover hover:shadow-md transition-shadow duration-normal motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      : '';

    const cls = classy(base, interactiveStyles, className);

    return <Component ref={ref} className={cls} tabIndex={interactive ? 0 : undefined} {...props} />;
  },
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    const cls = classy('flex flex-col gap-1.5 p-6', className);
    return <div ref={ref} className={cls} {...props} />;
  },
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = 'h3', className, ...props }, ref) => {
    const cls = classy('text-2xl font-semibold leading-none tracking-tight', className);
    return <Component ref={ref} className={cls} {...props} />;
  },
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    const cls = classy('text-sm text-muted-foreground', className);
    return <p ref={ref} className={cls} {...props} />;
  },
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const cls = classy('p-6 pt-0', className);
    return <div ref={ref} className={cls} {...props} />;
  },
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    const cls = classy('flex items-center p-6 pt-0', className);
    return <div ref={ref} className={cls} {...props} />;
  },
);

CardFooter.displayName = 'CardFooter';

export default Card;
