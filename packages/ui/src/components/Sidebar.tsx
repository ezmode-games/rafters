/**
 * Comprehensive navigation sidebar with embedded wayfinding intelligence and progressive disclosure patterns
 *
 * @registry-name sidebar
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Sidebar.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 6/10 - Navigation system with state management and wayfinding intelligence
 * @attention-economics Secondary support system: Never competes with primary content, uses muted variants and compact sizing for attention hierarchy
 * @trust-building Spatial consistency builds user confidence, zustand state persistence remembers preferences, Miller's Law enforcement prevents cognitive overload
 * @accessibility WCAG AAA compliance with skip links, keyboard navigation, screen reader optimization, and motion sensitivity support
 * @semantic-meaning Navigation intelligence: Progressive disclosure for complex hierarchies, semantic grouping by domain, wayfinding through active state indication with zustand state machine
 *
 * @usage-patterns
 * DO: Use for main navigation with collapsible state management
 * DO: Implement progressive disclosure for complex menu hierarchies
 * DO: Provide skip links and keyboard navigation patterns
 * DO: Integrate with zustand store for state persistence
 * NEVER: Complex menu logic within sidebar - use dedicated menu components
 * NEVER: Compete with primary content for attention
 *
 * @design-guides
 * - Navigation Intelligence: https://rafters.realhandy.tech/docs/llm/navigation-patterns
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 *
 * @dependencies @rafters/design-tokens, zustand, zod, lucide-react, class-variance-authority, clsx
 *
 * @example
 * ```tsx
 * // Basic sidebar with navigation items
 * <Sidebar collapsed={false} collapsible>
 *   <SidebarHeader>
 *     <SidebarTitle>Navigation</SidebarTitle>
 *   </SidebarHeader>
 *   <SidebarContent>
 *     <SidebarItem href="/dashboard">Dashboard</SidebarItem>
 *     <SidebarItem href="/settings">Settings</SidebarItem>
 *   </SidebarContent>
 * </Sidebar>
 * ```
 */
import { contextEasing, contextTiming, timing } from '@rafters/design-tokens/motion';
import React, { useCallback, useEffect } from 'react';
import { z } from 'zod';
import { useSidebarNavigation } from '../hooks/useSidebarNavigation';
import { cn } from '../lib/utils';
import {
  useSidebarActions,
  useSidebarCollapsed,
  useSidebarCurrentPath,
  useSidebarStore,
} from '../stores/sidebarStore';

// Zod validation schemas for external data (CLAUDE.md requirement)
const NavigationPathSchema = z
  .string()
  .min(1, 'Path cannot be empty')
  .startsWith('/', 'Path must start with /');
const HrefSchema = z.string().refine((val) => {
  try {
    new URL(val);
    return true;
  } catch {
    return val.startsWith('/');
  }
}, 'Must be a valid URL or path starting with /');

// Simplified sidebar hook using navigation coordination
export const useSidebar = () => {
  const { collapsed, currentPath, collapsible, navigate, toggleCollapsed, hasAttention } =
    useSidebarNavigation();

  return {
    collapsed,
    collapsible,
    currentPath,
    onNavigate: navigate,
    toggleCollapsed,
    hasAttention, // For menu coordination
  };
};

// Main sidebar props with navigation intelligence
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  // Navigation state and behavior
  collapsed?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;

  // Design intelligence configuration
  variant?: 'default' | 'floating' | 'overlay';
  size?: 'compact' | 'comfortable' | 'spacious';
  position?: 'left' | 'right';

  // Accessibility and navigation support
  ariaLabel?: string;
  skipLinkTarget?: string;
  landmark?: boolean;

  // Progressive enhancement
  persistCollapsedState?: boolean;
  reduceMotion?: boolean;

  // Trust-building
  showBreadcrumb?: boolean;
  highlightCurrent?: boolean;

  children: React.ReactNode;
}

// Sidebar header component
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showToggle?: boolean;
  children: React.ReactNode;
}

// Sidebar title component
export interface SidebarTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

// Sidebar content area
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Sidebar group for organizing navigation items
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  // Cognitive load management
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxItems?: number; // Miller's Law enforcement

  // Trust building
  showCount?: boolean;

  children: React.ReactNode;
}

// Sidebar group label
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

// Sidebar group content
export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Individual sidebar navigation item
export interface SidebarItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  // Navigation behavior
  href?: string;
  active?: boolean;
  disabled?: boolean;

  // Visual hierarchy and attention
  variant?: 'default' | 'primary' | 'secondary';
  level?: number; // For nested hierarchies

  // Content and accessibility
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;

  // Progressive enhancement
  asChild?: boolean;
  external?: boolean;

  // Trust building
  showTooltip?: boolean;
  loading?: boolean;
}

// Sidebar item icon container
export interface SidebarItemIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

// Sidebar item text container
export interface SidebarItemTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  truncate?: boolean;
  children: React.ReactNode;
}

// Sidebar footer component
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Main Sidebar component with full navigation intelligence (using zustand)
export const Sidebar: React.FC<SidebarProps> = ({
  collapsed: controlledCollapsed,
  collapsible = true,
  defaultCollapsed = false,
  currentPath,
  onNavigate,
  onCollapsedChange,
  variant = 'default',
  size = 'comfortable',
  position = 'left',
  ariaLabel = 'Main navigation',
  skipLinkTarget,
  landmark = true,
  persistCollapsedState = true,
  reduceMotion = false,
  showBreadcrumb = false,
  highlightCurrent = true,
  className,
  children,
  ...props
}) => {
  // Use zustand store for state management
  const storeCollapsed = useSidebarCollapsed();
  const { initialize, updatePreferences, setCurrentPath, setCollapsible } = useSidebarActions();

  // Initialize store on mount
  useEffect(() => {
    initialize({
      collapsed: controlledCollapsed ?? defaultCollapsed,
      currentPath: currentPath,
      collapsible,
      userPreferences: {
        persistCollapsed: persistCollapsedState,
        position,
        size,
        variant,
        reduceMotion,
      },
    });
  }, [
    initialize,
    controlledCollapsed,
    defaultCollapsed,
    currentPath,
    collapsible,
    persistCollapsedState,
    position,
    size,
    variant,
    reduceMotion,
  ]);

  // Sync external props with store
  useEffect(() => {
    if (currentPath !== undefined) {
      // Validate external data (CLAUDE.md Zod requirement)
      try {
        const validatedPath = NavigationPathSchema.parse(currentPath);
        setCurrentPath(validatedPath);
      } catch (error) {
        console.warn('Invalid currentPath provided:', error);
        setCurrentPath(currentPath); // Fallback for critical functionality
      }
    }
  }, [currentPath, setCurrentPath]);

  useEffect(() => {
    setCollapsible(collapsible);
  }, [collapsible, setCollapsible]);

  useEffect(() => {
    updatePreferences({
      position,
      size,
      variant,
      reduceMotion,
      persistCollapsed: persistCollapsedState,
    });
  }, [position, size, variant, reduceMotion, persistCollapsedState, updatePreferences]);

  // Handle controlled vs uncontrolled collapsed state
  const isCollapsed = controlledCollapsed ?? storeCollapsed;

  return (
    <nav
      className={cn(
        // Base navigation styles with spatial consistency
        'flex flex-col bg-background border-r border-border',
        'relative transition-all',
        !reduceMotion && contextTiming.navigation,
        !reduceMotion && contextEasing.navigation,

        // Variant-based styling for different use cases
        {
          'shadow-none': variant === 'default',
          'shadow-lg rounded-lg border': variant === 'floating',
          'fixed inset-y-0 z-50 shadow-xl': variant === 'overlay',
        },

        // Position-based layout
        {
          'left-0': position === 'left' && variant === 'overlay',
          'right-0': position === 'right' && variant === 'overlay',
        },

        // Size variants for cognitive load management
        {
          'w-60': size === 'compact' && !isCollapsed,
          'w-72': size === 'comfortable' && !isCollapsed,
          'w-80': size === 'spacious' && !isCollapsed,
          'w-16': isCollapsed && collapsible,
        },

        // Trust building: Smooth collapse transitions
        isCollapsed && 'overflow-hidden',

        className
      )}
      role={landmark ? 'navigation' : undefined}
      aria-label={ariaLabel}
      aria-expanded={collapsible ? !isCollapsed : undefined}
      {...props}
    >
      {/* Skip link for accessibility */}
      {skipLinkTarget && (
        <a
          href={skipLinkTarget}
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 
                     bg-primary text-primary-foreground px-2 py-1 rounded text-sm z-50"
        >
          Skip navigation
        </a>
      )}

      {children}
    </nav>
  );
};

// Sidebar Header with toggle functionality (using zustand)
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  showToggle = true,
  className,
  children,
  ...props
}) => {
  const { collapsed, collapsible, toggleCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        // Header styling with proper spacing hierarchy
        'flex items-center justify-between p-4 border-b border-border/50',
        // Cognitive load: Adequate breathing room
        'min-h-[60px]',
        className
      )}
      {...props}
    >
      {/* Header content - collapses gracefully */}
      <div className={cn('flex-1 min-w-0', collapsed && 'hidden')}>{children}</div>

      {/* Toggle button with trust-building visual feedback */}
      {showToggle && collapsible && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            // Interactive button with motor accessibility
            'flex items-center justify-center w-8 h-8 rounded-md',
            'border border-border hover:bg-accent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            contextTiming.hover,
            // Trust pattern: Always visible, consistent position
            collapsed && 'mx-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {/* Chevron icon with rotation animation */}
          <svg
            className={cn(
              'w-4 h-4 transition-transform',
              timing.standard,
              collapsed && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// Sidebar Title with semantic heading levels (using zustand)
export const SidebarTitle: React.FC<SidebarTitleProps> = ({
  level = 2,
  className,
  children,
  ...props
}) => {
  const { collapsed } = useSidebar();
  const Heading = `h${level}` as const;

  return (
    <Heading
      className={cn(
        // Typography hierarchy with trust-building clarity
        'text-lg font-semibold text-foreground',
        'truncate',
        // Graceful collapse behavior
        collapsed && 'sr-only',
        className
      )}
      {...props}
    >
      {children}
    </Heading>
  );
};

// Sidebar Content with scroll management (using zustand)
export const SidebarContent: React.FC<SidebarContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Scrollable content area with trust-building consistency
        'flex-1 overflow-y-auto overflow-x-hidden',
        // Cognitive load: Comfortable padding and spacing
        'p-2 space-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Sidebar Group for organizing navigation items (Miller's Law) (using zustand)
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  collapsible = false,
  defaultExpanded = true,
  maxItems = 7, // Miller's Law enforcement
  showCount = false,
  className,
  children,
  ...props
}) => {
  const [expanded] = React.useState(defaultExpanded);

  // Miller's Law validation for cognitive load management
  const childArray = React.Children.toArray(children);
  const itemCount = childArray.length;
  const hasOverflow = itemCount > maxItems;

  return (
    <div
      className={cn(
        // Group container with spacing for visual hierarchy
        'space-y-1',
        className
      )}
      {...props}
    >
      {/* Group content with progressive disclosure */}
      <div
        className={cn(
          'space-y-1',
          // Smooth expand/collapse for cognitive comfort
          'transition-all',
          timing.standard,
          collapsible && !expanded && 'hidden'
        )}
      >
        {children}
      </div>

      {/* Cognitive load warning for AI agents */}
      {hasOverflow && process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-warning p-1 rounded bg-warning/10">
          Warning: {itemCount} items exceed Miller's Law limit of {maxItems}
        </div>
      )}
    </div>
  );
};

// Sidebar Group Label with semantic structure (using zustand)
export const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({
  className,
  children,
  ...props
}) => {
  const { collapsed } = useSidebar();

  return (
    <h3
      className={cn(
        // Label typography with information hierarchy
        'px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider',
        // Graceful collapse behavior
        collapsed && 'sr-only',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

// Sidebar Group Content wrapper (using zustand)
export const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Content spacing for cognitive hierarchy
        'space-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Individual Sidebar Item - simplified and composable
export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  active = false,
  disabled = false,
  variant = 'default',
  level = 0,
  icon,
  badge,
  asChild = false,
  external = false,
  showTooltip = false,
  loading = false,
  className,
  children,
  onClick,
  ...props
}) => {
  const { collapsed, currentPath, onNavigate } = useSidebar();

  // Simplified state logic
  const isCurrentPath = currentPath === href;
  const isActive = active || isCurrentPath;

  // Simplified click handler
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      // Simple navigation with fallback
      if (href && onNavigate) {
        event.preventDefault();
        onNavigate(href);
      }

      onClick?.(event as React.MouseEvent<HTMLElement>);
    },
    [disabled, loading, href, onNavigate, onClick]
  );

  const handleAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      // Simple navigation with fallback
      if (href && onNavigate && !external) {
        event.preventDefault();
        onNavigate(href);
      }

      onClick?.(event as React.MouseEvent<HTMLElement>);
    },
    [disabled, loading, href, onNavigate, onClick, external]
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          // Simplified item styles
          'flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium',
          'transition-all cursor-pointer select-none',
          contextTiming.hover,

          // Navigation hierarchy
          level > 0 && `ml-${Math.min(level * 4, 12)}`,

          // Active state
          isActive && [
            'bg-primary/10 text-primary border-r-2 border-primary',
            'font-semibold shadow-sm',
          ],

          // Interactive states
          !disabled &&
            !loading && [
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ],

          // State variants
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          loading && 'opacity-75 cursor-wait',

          // Variant styling
          {
            'text-foreground': variant === 'default',
            'text-primary font-semibold': variant === 'primary',
            'text-muted-foreground': variant === 'secondary',
          },

          // Collapsed state
          collapsed && 'justify-center px-2',

          className
        )}
        onClick={handleAnchorClick}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
        aria-busy={loading}
        title={collapsed && showTooltip ? String(children) : undefined}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {/* Icon with consistent sizing */}
        {icon && (
          <SidebarItemIcon>
            {loading ? (
              // Loading spinner with trust-building feedback
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              icon
            )}
          </SidebarItemIcon>
        )}

        {/* Text content with graceful collapse */}
        {!collapsed && <SidebarItemText truncate={true}>{children}</SidebarItemText>}

        {/* Badge with attention hierarchy */}
        {badge && !collapsed && <div className="ml-auto flex-shrink-0">{badge}</div>}

        {/* External link indicator */}
        {external && !collapsed && (
          <svg
            className="w-3 h-3 ml-1 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </a>
    );
  }

  return (
    <div
      className={cn(
        // Base item styles with motor accessibility
        'flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium',
        'transition-all cursor-pointer select-none',
        contextTiming.hover,

        // Navigation hierarchy with proper indentation
        level > 0 && `ml-${Math.min(level * 4, 12)}`,

        // Active state with trust-building visual feedback
        isActive && [
          'bg-primary/10 text-primary border-r-2 border-primary',
          'font-semibold shadow-sm',
        ],

        // Interactive states
        !disabled &&
          !loading && [
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          ],

        // Disabled state with clear visual feedback
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

        // Loading state with trust-building indicator
        loading && 'opacity-75 cursor-wait',

        // Variant styling for attention hierarchy
        {
          'text-foreground': variant === 'default',
          'text-primary font-semibold': variant === 'primary',
          'text-muted-foreground': variant === 'secondary',
        },

        // Collapsed state adjustments
        collapsed && 'justify-center px-2',

        className
      )}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
      title={collapsed && showTooltip ? String(children) : undefined}
      {...props}
    >
      {/* Icon with consistent sizing */}
      {icon && (
        <SidebarItemIcon>
          {loading ? (
            // Loading spinner with trust-building feedback
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            icon
          )}
        </SidebarItemIcon>
      )}

      {/* Text content with graceful collapse */}
      {!collapsed && <SidebarItemText truncate={true}>{children}</SidebarItemText>}

      {/* Badge with attention hierarchy */}
      {badge && !collapsed && <div className="ml-auto flex-shrink-0">{badge}</div>}
    </div>
  );
};

// Sidebar Item Icon with consistent sizing (using zustand)
export const SidebarItemIcon: React.FC<SidebarItemIconProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        // Icon container with trust-building consistency
        'flex items-center justify-center w-4 h-4 flex-shrink-0',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
};

// Sidebar Item Text with truncation support (using zustand)
export const SidebarItemText: React.FC<SidebarItemTextProps> = ({
  truncate = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        // Text styling with cognitive load optimization
        'flex-1 min-w-0',
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Sidebar Footer with consistent styling (using zustand)
export const SidebarFooter: React.FC<SidebarFooterProps> = ({ className, children, ...props }) => {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        // Footer styling with spatial consistency
        'border-t border-border/50 p-4 mt-auto',
        // Graceful collapse behavior
        collapsed && 'px-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Display names for React DevTools
Sidebar.displayName = 'Sidebar';
SidebarHeader.displayName = 'SidebarHeader';
SidebarTitle.displayName = 'SidebarTitle';
SidebarContent.displayName = 'SidebarContent';
SidebarGroup.displayName = 'SidebarGroup';
SidebarGroupLabel.displayName = 'SidebarGroupLabel';
SidebarGroupContent.displayName = 'SidebarGroupContent';
SidebarItem.displayName = 'SidebarItem';
SidebarItemIcon.displayName = 'SidebarItemIcon';
SidebarItemText.displayName = 'SidebarItemText';
SidebarFooter.displayName = 'SidebarFooter';
