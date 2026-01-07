/**
 * Semantic container component for layout structure and content boundaries
 *
 * @cognitive-load 0/10 - Invisible structure that reduces visual complexity
 * @attention-economics Neutral structural element: Controls content width and breathing room without competing for attention
 * @trust-building Predictable boundaries and consistent spacing patterns
 * @accessibility Semantic HTML elements with proper landmark roles for screen readers
 * @semantic-meaning Element-driven behavior: main=primary landmark, section=structural grouping, article=readable content with typography, aside=supplementary, div=no semantics
 *
 * @usage-patterns
 * DO: Use main for the primary content area (once per page)
 * DO: Use section for structural grouping within grids
 * DO: Use article for readable content - typography is automatic
 * DO: Use aside for supplementary content, add surface classes for depth
 * DO: Spacing happens inside (padding), not outside (no margins)
 * NEVER: Nest containers unnecessarily
 * NEVER: Use margins for spacing - let parent Grid handle gaps
 *
 * @example
 * ```tsx
 * <Container as="main" size="6xl" padding="6">
 *   <Container as="article">
 *     <h1>Title</h1>
 *     <p>Typography just works.</p>
 *   </Container>
 * </Container>
 * ```
 */
import * as React from 'react';
import classy from '../../primitives/classy';

type ContainerElement = 'div' | 'main' | 'section' | 'article' | 'aside';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic element - determines behavior and accessibility role */
  as?: ContainerElement;

  /**
   * Max-width constraint using Tailwind sizing
   * @default 'full' for main, undefined for others
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';

  /**
   * Internal padding using Tailwind spacing scale
   * Spacing happens inside containers, not via margins
   */
  padding?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24';

  /**
   * Enable container queries on this element
   * Children can use @container queries to respond to this container's size
   * @default true
   */
  query?: boolean;

  /**
   * Container query name for targeted queries
   * Use with @container/name in child styles
   */
  queryName?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'w-full',
};

const paddingClasses: Record<string, string> = {
  '0': 'p-0',
  '1': 'p-1',
  '2': 'p-2',
  '3': 'p-3',
  '4': 'p-4',
  '5': 'p-5',
  '6': 'p-6',
  '8': 'p-8',
  '10': 'p-10',
  '12': 'p-12',
  '16': 'p-16',
  '20': 'p-20',
  '24': 'p-24',
};

// Article typography - the magic for readable content
const articleTypography = [
  // Base prose styling
  '[&_p]:leading-relaxed',
  '[&_p]:mb-4',
  '[&_p:last-child]:mb-0',

  // Headings
  '[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mb-4 [&_h1]:mt-0',
  '[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:first:mt-0',
  '[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6',
  '[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-4',

  // Lists
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4',
  '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
  '[&_li]:mb-1',

  // Links
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80',

  // Blockquotes
  '[&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4',

  // Code
  '[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono',
  '[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',

  // Horizontal rules
  '[&_hr]:border-border [&_hr]:my-8',

  // Images
  '[&_img]:rounded-lg [&_img]:my-4',

  // Tables
  '[&_table]:w-full [&_table]:my-4',
  '[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold',
  '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2',

  // Optimal reading width
  'max-w-prose',
].join(' ');

export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  (
    {
      as: Element = 'div',
      size,
      padding,
      query = true,
      queryName,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isArticle = Element === 'article';

    const classes = classy(
      // Container queries
      query && '@container',

      // Size constraint
      size && sizeClasses[size],

      // Centering for sized containers
      size && size !== 'full' && 'mx-auto',

      // Padding
      padding && paddingClasses[padding],

      // Article gets typography
      isArticle && articleTypography,

      // User classes
      className,
    );

    // Container query name via style
    const containerStyle: React.CSSProperties = {
      ...style,
      ...(queryName && { containerName: queryName }),
    };

    return React.createElement(Element, {
      ref,
      className: classes || undefined,
      style: Object.keys(containerStyle).length > 0 ? containerStyle : undefined,
      ...props,
    });
  },
);

Container.displayName = 'Container';

export default Container;
