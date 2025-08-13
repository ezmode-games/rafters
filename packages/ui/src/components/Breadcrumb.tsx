/**
 * Breadcrumb Component - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (optimized for peripheral navigation aid)
 * ATTENTION HIERARCHY: Tertiary - supports primary content and navigation without overwhelming
 * TRUST BUILDING: Low trust level - routine navigation with predictable, reliable patterns
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Wayfinding Intelligence: rafters.realhandy.tech/llm/patterns/wayfinding-intelligence
 * - Attention Economics: rafters.realhandy.tech/llm/patterns/attention-economics
 * - Navigation Ecosystem: rafters.realhandy.tech/llm/patterns/navigation-integration
 *
 * USAGE PATTERNS:
 * ✅ Wayfinding system: spatial context and navigation hierarchy
 * ✅ Location awareness: clear current page indication with aria-current="page"
 * ✅ Truncation intelligence: smart strategies for long paths (Miller's Law)
 * ✅ Configurable separators: character or Lucide icon with accessibility
 * ❌ Never: Primary actions, complex information, critical alerts
 *
 * Separator intelligence: All separators MUST have aria-hidden="true" (purely decorative)
 * Context awareness: Adapts to sidebar visibility and responsive breakpoints
 */
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { createContext, forwardRef, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '../lib/utils';

export type BreadcrumbSeparator =
  | 'chevron-right' // ChevronRight icon (default)
  | 'slash' // / character
  | 'angle' // > character
  | 'arrow' // → character (U+2192)
  | 'pipe' // | character
  | 'dot' // · character (U+00B7)
  | React.ComponentType<{ className?: string; 'aria-hidden': true }>;

export type TruncationMode = 'smart' | 'end' | 'start';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  // Navigation intelligence
  maxItems?: number;
  truncationMode?: TruncationMode;

  // Separator intelligence
  separator?: BreadcrumbSeparator;
  separatorProps?: {
    className?: string;
    size?: number;
  };

  // Context optimization
  showHome?: boolean;
  homeIcon?: React.ComponentType<{ className?: string }>;
  homeLabel?: string;

  // Visual customization
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';

  // Progressive enhancement
  expandable?: boolean;
  responsive?: boolean;

  // Enhanced accessibility
  'aria-describedby'?: string;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  truncated?: boolean;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

// Separator intelligence with cognitive load ratings
const SEPARATOR_INTELLIGENCE = {
  'chevron-right': {
    cognitiveLoad: 2,
    contexts: ['general', 'admin', 'dashboard'],
    trustLevel: 'high',
    accessibility: 'excellent',
  },
  slash: {
    cognitiveLoad: 2,
    contexts: ['web', 'file-system', 'url-path'],
    trustLevel: 'high',
    accessibility: 'excellent',
  },
  angle: {
    cognitiveLoad: 2,
    contexts: ['command-line', 'technical', 'developer'],
    trustLevel: 'high',
    accessibility: 'excellent',
  },
  arrow: {
    cognitiveLoad: 3,
    contexts: ['editorial', 'storytelling', 'process-flow'],
    trustLevel: 'medium',
    accessibility: 'good',
  },
  pipe: {
    cognitiveLoad: 3,
    contexts: ['structured-data', 'admin', 'technical'],
    trustLevel: 'medium',
    accessibility: 'excellent',
  },
  dot: {
    cognitiveLoad: 2,
    contexts: ['minimal', 'mobile', 'compact'],
    trustLevel: 'medium',
    accessibility: 'excellent',
  },
} as const;

// Safe character separators with Unicode support
const SAFE_SEPARATORS = {
  slash: '/',
  angle: '>',
  arrow: '→', // U+2192
  pipe: '|',
  dot: '·', // U+00B7
} as const;

// Context for sharing separator configuration
const BreadcrumbContext = createContext<{
  separator: BreadcrumbSeparator;
  separatorProps?: { className?: string; size?: number };
}>({
  separator: 'chevron-right',
  separatorProps: undefined,
});

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      maxItems = 5,
      truncationMode = 'smart',
      separator = 'chevron-right',
      separatorProps,
      showHome = true,
      homeIcon: HomeIcon = Home,
      homeLabel = 'Home',
      size = 'md',
      variant = 'default',
      expandable = true,
      responsive = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(false);

    const renderSeparator = useCallback(() => {
      if (typeof separator === 'string') {
        const separatorMap = {
          'chevron-right': <ChevronRight className="w-4 h-4" aria-hidden="true" />,
          slash: SAFE_SEPARATORS.slash,
          angle: SAFE_SEPARATORS.angle,
          arrow: SAFE_SEPARATORS.arrow,
          pipe: SAFE_SEPARATORS.pipe,
          dot: SAFE_SEPARATORS.dot,
        };

        const separatorContent = separatorMap[separator];

        if (typeof separatorContent === 'string') {
          return (
            <span aria-hidden="true" className="select-none text-muted-foreground">
              {separatorContent}
            </span>
          );
        }

        return separatorContent;
      }

      // Custom Lucide icon
      const CustomIcon = separator;
      return (
        <CustomIcon
          aria-hidden={true}
          className="w-4 h-4 text-muted-foreground"
          {...separatorProps}
        />
      );
    }, [separator, separatorProps]);

    return (
      <BreadcrumbContext.Provider value={{ separator, separatorProps }}>
        <nav
          ref={ref}
          aria-label="Breadcrumb navigation"
          aria-describedby={props['aria-describedby']}
          className={cn(
            // Base styles with semantic tokens
            'flex items-center text-sm text-muted-foreground',

            // Size variants
            {
              'text-xs': size === 'sm',
              'text-sm': size === 'md',
              'text-base': size === 'lg',
            },

            // Variant styles
            {
              'opacity-100': variant === 'default',
              'opacity-75': variant === 'minimal',
            },

            className
          )}
          {...props}
        >
          <ol className="flex items-center space-x-2">{children}</ol>
        </nav>
      </BreadcrumbContext.Provider>
    );
  }
);

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn('flex items-center', className)} {...props}>
        {children}
      </li>
    );
  }
);

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          // Base interactive styles with semantic tokens
          'text-muted-foreground hover:text-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

          // Enhanced touch targets (WCAG AAA)
          'min-h-11 min-w-11 flex items-center justify-center rounded px-2 py-1',
          'touch-manipulation',

          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-current="page"
        className={cn('text-foreground font-medium', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

export const BreadcrumbSeparator = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, className, ...props }, ref) => {
  const { separator, separatorProps } = useContext(BreadcrumbContext);

  const renderSeparatorContent = () => {
    if (children) return children;

    if (typeof separator === 'string') {
      const separatorMap = {
        'chevron-right': <ChevronRight className="w-4 h-4" aria-hidden="true" />,
        slash: SAFE_SEPARATORS.slash,
        angle: SAFE_SEPARATORS.angle,
        arrow: SAFE_SEPARATORS.arrow,
        pipe: SAFE_SEPARATORS.pipe,
        dot: SAFE_SEPARATORS.dot,
      };

      const separatorContent = separatorMap[separator];

      if (typeof separatorContent === 'string') {
        return (
          <span
            className={cn('text-muted-foreground', separatorProps?.className)}
            aria-hidden="true"
          >
            {separatorContent}
          </span>
        );
      }

      return separatorContent;
    }

    // Custom separator component
    const CustomIcon = separator;
    return (
      <CustomIcon
        aria-hidden={true}
        className="w-4 h-4 text-muted-foreground"
        {...separatorProps}
      />
    );
  };

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('text-muted-foreground mx-2 select-none', className)}
      {...props}
    >
      {renderSeparatorContent()}
    </span>
  );
});

export const BreadcrumbEllipsis = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-md',
        'text-muted-foreground hover:text-foreground',
        'hover:bg-accent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label="Show more navigation levels"
      onClick={onClick}
      {...props}
    >
      <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
    </button>
  );
});

// Export display names for better debugging
Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbLink.displayName = 'BreadcrumbLink';
BreadcrumbPage.displayName = 'BreadcrumbPage';
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
