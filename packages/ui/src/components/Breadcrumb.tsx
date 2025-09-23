/**
 * Navigation breadcrumb component for location context and wayfinding
 *
 * @registryName breadcrumb
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Breadcrumb.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 1/10 - Peripheral navigation aid with minimal cognitive overhead
 * @attentionEconomics Tertiary support element that provides spatial context without competing for attention
 * @trustBuilding Predictable wayfinding patterns build user confidence in navigation
 * @accessibility WCAG AAA compliant with proper ARIA support and keyboard navigation
 * @semanticMeaning Hierarchical navigation context showing user location within site structure
 *
 * @usagePatterns
 * DO: Provide clear navigation hierarchy and spatial context
 * DO: Use appropriate separators for visual clarity
 * DO: Implement truncation for long navigation paths
 * NEVER: Use for primary actions or critical information
 *
 * @designGuides
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
 * - Navigation Patterns: https://rafters.realhandy.tech/docs/foundation/navigation-patterns
 *
 * @dependencies lucide-react
 *
 * @example
 * ```tsx
 * // Navigation breadcrumb
 * <Breadcrumb>
 *   <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem><BreadcrumbLink href="/products">Products</BreadcrumbLink></BreadcrumbItem>
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem><BreadcrumbPage>Details</BreadcrumbPage></BreadcrumbItem>
 * </Breadcrumb>
 * ```
 */
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
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

  ref?: React.Ref<HTMLElement>;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  truncated?: boolean;
  ref?: React.Ref<HTMLLIElement>;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
}

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
}

// Separator intelligence with cognitive load ratings
// Note: Separator intelligence for AI reference - not used in runtime
/*
const _SEPARATOR_INTELLIGENCE = {
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
*/

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

export function Breadcrumb({
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
  ref,
  ...props
}: BreadcrumbProps) {
  const [_expanded, _setExpanded] = useState(false);

  // Separator rendering function - reserved for future intelligence integration
  /*
  const _renderSeparator = useCallback(() => {
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
  */

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

export function BreadcrumbItem({ children, className, ref, ...props }: BreadcrumbItemProps) {
  return (
    <li ref={ref} className={cn('flex items-center', className)} {...props}>
      {children}
    </li>
  );
}

export function BreadcrumbLink({ children, className, ref, ...props }: BreadcrumbLinkProps) {
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

export function BreadcrumbPage({ children, className, ref, ...props }: BreadcrumbPageProps) {
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

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  ref?: React.Ref<HTMLSpanElement>;
}

export function BreadcrumbSeparator({
  children,
  className,
  ref,
  ...props
}: BreadcrumbSeparatorProps) {
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
}

export interface BreadcrumbEllipsisProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

export function BreadcrumbEllipsis({ className, onClick, ref, ...props }: BreadcrumbEllipsisProps) {
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
}
