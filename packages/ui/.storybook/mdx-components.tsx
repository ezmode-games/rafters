/**
 * MDX Component Provider for Storybook Documentation
 *
 * DESIGN PHILOSOPHY:
 * - Centers content using mx-auto (following Container component philosophy)
 * - Uses padding for internal spacing, never margins for content spacing
 * - Provides semantic HTML elements with proper design system integration
 * - Ensures consistent typography and spacing across all documentation
 *
 * COGNITIVE LOAD: 0/10 (invisible structure that enhances readability)
 * TYPOGRAPHY INTELLIGENCE: Optimal line lengths and information hierarchy
 * NEGATIVE SPACE MASTERY: Proper breathing room and visual hierarchy
 */

import type React from 'react';
import { Container } from '../src/components/Container';
import { cn } from '../src/lib/utils';

/**
 * MDX Wrapper Component
 * Provides the outer container for all MDX content with proper centering and max-width
 */
export const MDXWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Container
      as="article"
      size="5xl"
      padding="8"
      className={cn('mdx-content', 'min-h-screen', className)}
    >
      {children}
    </Container>
  );
};

/**
 * MDX Section Component
 * For major content sections that need their own container context
 */
export const MDXSection = ({
  children,
  className,
  size = '4xl',
  padding = '6',
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: string;
}) => {
  return (
    <Container
      as="section"
      size={size}
      padding={padding as '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'}
      className={cn('my-[var(--spacing-phi-3)]', className)}
    >
      {children}
    </Container>
  );
};

/**
 * MDX Content Block Component
 * For content that needs specific max-width and centering
 */
export const MDXContent = ({
  children,
  className,
  center = true,
  maxWidth = '4xl',
}: {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  maxWidth?: 'prose' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}) => {
  const maxWidthClasses = {
    prose: 'max-w-prose',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className={cn(maxWidthClasses[maxWidth], center && 'mx-auto', className)}>{children}</div>
  );
};

/**
 * MDX Grid Component
 * For multi-column layouts with proper spacing
 */
export const MDXGrid = ({
  children,
  className,
  cols = 2,
  gap = 'md',
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-[var(--spacing-phi-1)]',
    md: 'gap-[var(--spacing-phi-2)]',
    lg: 'gap-[var(--spacing-phi-3)]',
    xl: 'gap-[var(--spacing-phi-4)]',
  };

  return (
    <div
      className={cn('grid', colClasses[cols], gapClasses[gap], 'max-w-7xl', 'mx-auto', className)}
    >
      {children}
    </div>
  );
};

/**
 * MDX Card Component
 * For highlighted content blocks with consistent styling
 */
export const MDXCard = ({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}) => {
  const variantClasses = {
    default: 'bg-card',
    outlined: 'bg-card border border-border',
    elevated: 'bg-card shadow-sm hover:shadow-md transition-shadow duration-200',
  };

  return (
    <div
      className={cn(variantClasses[variant], 'p-[var(--spacing-phi-2)]', 'rounded-xl', className)}
    >
      {children}
    </div>
  );
};

/**
 * MDX Hero Component
 * For documentation hero sections with logo and title
 */
export const MDXHero = ({
  children,
  className,
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        'w-full',
        'text-center',
        'py-[var(--spacing-phi-4)]',
        gradient && 'bg-gradient-to-b from-background to-muted/20',
        className
      )}
    >
      <MDXContent maxWidth="5xl" center>
        {children}
      </MDXContent>
    </div>
  );
};

/**
 * MDX Components Map
 * Maps HTML elements to our design system components
 */
export const mdxComponents = {
  // Wrapper for all MDX content
  wrapper: MDXWrapper,

  // Typography elements with proper max-width and centering
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'heading-display',
        'mb-[var(--spacing-phi-2)]',
        'text-center',
        'max-w-5xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'heading-section',
        'mb-[var(--spacing-phi-2)]',
        'mt-[var(--spacing-phi-3)]',
        'text-center',
        'max-w-4xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'heading-section',
        'mb-[var(--spacing-phi-1)]',
        'mt-[var(--spacing-phi-2)]',
        'max-w-4xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        'heading-subsection',
        'mb-[var(--spacing-phi--1)]',
        'mt-[var(--spacing-phi-1)]',
        'max-w-4xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        'heading-component',
        'mb-[var(--spacing-phi--2)]',
        'mt-[var(--spacing-phi-0)]',
        'max-w-4xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        'heading-label',
        'mb-[var(--spacing-phi--2)]',
        'mt-[var(--spacing-phi--1)]',
        'max-w-4xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  // Paragraph with optimal reading width
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        'text-body',
        'mb-[var(--spacing-phi-1)]',
        'max-w-prose',
        'mx-auto',
        'leading-relaxed'
      )}
      {...props}
    />
  ),

  // Lists with proper spacing and max-width
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        'text-body',
        'mb-[var(--spacing-phi-1)]',
        'pl-[var(--spacing-phi-2)]',
        'list-disc',
        'max-w-prose',
        'mx-auto',
        'space-y-[var(--spacing-phi--1)]'
      )}
      {...props}
    />
  ),

  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        'text-body',
        'mb-[var(--spacing-phi-1)]',
        'pl-[var(--spacing-phi-2)]',
        'list-decimal',
        'max-w-prose',
        'mx-auto',
        'space-y-[var(--spacing-phi--1)]'
      )}
      {...props}
    />
  ),

  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('text-body', 'leading-relaxed')} {...props} />
  ),

  // Blockquote with visual emphasis
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'border-l-4',
        'border-primary',
        'pl-[var(--spacing-phi-1)]',
        'my-[var(--spacing-phi-2)]',
        'text-muted-foreground',
        'italic',
        'max-w-prose',
        'mx-auto'
      )}
      {...props}
    />
  ),

  // Code blocks with proper styling
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'font-mono',
        'text-sm',
        'bg-muted',
        'p-[var(--spacing-phi-1)]',
        'rounded-lg',
        'border',
        'border-border',
        'overflow-x-auto',
        'my-[var(--spacing-phi-2)]',
        'max-w-5xl',
        'mx-auto'
      )}
      {...props}
    />
  ),

  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Check if this is inline code (not inside a pre tag)
    const isInline = !props.className?.includes('language-');

    if (isInline) {
      return (
        <code
          className={cn('font-mono', 'text-sm', 'bg-muted', 'px-1', 'py-0.5', 'rounded')}
          {...props}
        />
      );
    }

    // Block code (inside pre tag)
    return <code {...props} />;
  },

  // Horizontal rule
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={cn('border-border', 'my-[var(--spacing-phi-3)]', 'max-w-4xl', 'mx-auto')}
      {...props}
    />
  ),

  // Links with design system styling
  a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        'text-primary',
        'hover:opacity-[var(--opacity-hover)]',
        'transition-opacity',
        'duration-200',
        'underline-offset-2',
        'hover:underline'
      )}
      {...props}
    />
  ),

  // Tables with proper alignment and spacing
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="max-w-5xl mx-auto my-[var(--spacing-phi-2)] overflow-x-auto">
      <table className={cn('w-full', 'border-collapse', 'border', 'border-border')} {...props} />
    </div>
  ),

  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('bg-muted/50', 'border-b', 'border-border')} {...props} />
  ),

  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn('text-left', 'p-[var(--spacing-phi-0)]', 'font-semibold', 'text-sm')}
      {...props}
    />
  ),

  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn('p-[var(--spacing-phi-0)]', 'border-t', 'border-border')} {...props} />
  ),

  // Image with responsive sizing - requires alt text for accessibility
  img: ({
    alt,
    className,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => (
    <img
      {...props}
      alt={alt}
      className={cn(
        'max-w-full',
        'h-auto',
        'rounded-lg',
        'my-[var(--spacing-phi-2)]',
        'mx-auto',
        className
      )}
    />
  ),

  // Strong emphasis
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props} />
  ),

  // Italic emphasis
  em: (props: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...props} />,

  // Export our custom components for use in MDX
  MDXSection,
  MDXContent,
  MDXGrid,
  MDXCard,
  MDXHero,
};

/**
 * Provider component that wraps MDX content with our components
 */
export const MDXProvider = ({ children }: { children: React.ReactNode }) => {
  return <MDXWrapper>{children}</MDXWrapper>;
};
