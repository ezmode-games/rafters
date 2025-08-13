/**
 * Badge Component - AI Intelligence
 *
 * COGNITIVE LOAD: 2/10 (optimized for peripheral scanning)
 * ATTENTION HIERARCHY: Secondary/Tertiary - supports primary content without overwhelming
 * TRUST BUILDING: Low trust level - informational display with optional interaction
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Status Communication: rafters.realhandy.tech/llm/patterns/status-communication
 * - Attention Economics: rafters.realhandy.tech/llm/patterns/attention-economics
 * - Multi-Sensory Design: rafters.realhandy.tech/llm/patterns/accessibility-excellence
 *
 * USAGE PATTERNS:
 * ✅ Status indicators: success, warning, error, info, neutral with multi-sensory communication
 * ✅ Navigation badges: notification counts, status in sidebar contexts
 * ✅ Category labels: single words, semantic meaning over arbitrary colors
 * ✅ Interactive badges: removal, expansion with enhanced touch targets
 * ❌ Never: Primary actions, complex information, critical alerts
 *
 * Multi-sensory status: Color + Icon + Text + Pattern prevents single-point failure
 * Attention budget: Maximum 1 high-attention badge per section, unlimited subtle badges
 */
import { AlertTriangle, CheckCircle, Info, Minus, XCircle } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeEmphasis = 'subtle' | 'default' | 'prominent';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  // Core semantic variants for status communication
  variant?: BadgeVariant;

  // Size based on attention hierarchy
  size?: BadgeSize;

  // Visual emphasis level for attention economics
  emphasis?: BadgeEmphasis;

  // Interaction capabilities
  interactive?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: React.MouseEventHandler<HTMLElement>;

  // Content enhancement
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';

  // Enhanced accessibility
  'aria-live'?: 'polite' | 'assertive';

  // Context awareness
  animate?: boolean;
  loading?: boolean;
}

// Status indicators with multi-sensory communication
const STATUS_INDICATORS = {
  success: {
    icon: CheckCircle,
    ariaLabel: 'Success status',
    cognitiveLoad: 3,
    attentionWeight: 'low',
    psychology: 'confidence_building',
  },
  warning: {
    icon: AlertTriangle,
    ariaLabel: 'Warning status',
    cognitiveLoad: 6,
    attentionWeight: 'medium',
    psychology: 'awareness_needed',
  },
  error: {
    icon: XCircle,
    ariaLabel: 'Error status',
    cognitiveLoad: 8,
    attentionWeight: 'high',
    psychology: 'immediate_attention_required',
  },
  info: {
    icon: Info,
    ariaLabel: 'Information status',
    cognitiveLoad: 2,
    attentionWeight: 'minimal',
    psychology: 'helpful_context',
  },
  neutral: {
    icon: Minus,
    ariaLabel: 'Neutral status',
    cognitiveLoad: 1,
    attentionWeight: 'background',
    psychology: 'invisible_organization',
  },
} as const;

export const Badge = forwardRef<HTMLElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      emphasis = 'default',
      interactive = false,
      removable = false,
      onRemove,
      icon: CustomIcon,
      iconPosition = 'left',
      animate = false,
      loading = false,
      children,
      className,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const statusInfo = STATUS_INDICATORS[variant];
    const Icon = CustomIcon || statusInfo.icon;
    const isInteractive = interactive || removable || !!onClick;

    // Handle keyboard navigation for interactive badges
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if (!isInteractive) return;

      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (onClick) {
            // Directly call the onClick handler to avoid double firing
            onClick(event as unknown as React.MouseEvent<HTMLElement>);
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (removable && onRemove) {
            event.preventDefault();
            onRemove();
          }
          break;
        case 'Escape':
          // Allow parent components to handle escape
          break;
      }

      if (onKeyDown) {
        onKeyDown(event as React.KeyboardEvent<HTMLElement>);
      }
    };

    if (isInteractive) {
      return (
        <button
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
          type="button"
          tabIndex={0}
          aria-label={
            props['aria-label'] || `${statusInfo.ariaLabel}${children ? `: ${children}` : ''}`
          }
          aria-live={props['aria-live']}
          aria-busy={loading}
          className={cn(
            // Base styles with semantic tokens
            'inline-flex items-center gap-1 rounded-md text-xs font-medium select-none',
            'border transition-all duration-150',

            // Enhanced touch targets for interactive badges (WCAG AAA)
            'min-h-11 min-w-11 touch-manipulation cursor-pointer',
            'hover:opacity-hover focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'active:scale-active',

            // Loading state feedback
            loading && 'opacity-75 cursor-wait',

            // Motion respect
            animate && 'motion-reduce:transition-none',

            // Size variants with attention hierarchy
            {
              'px-1.5 py-0.5 text-xs': size === 'sm',
              'px-2 py-0.5 text-xs': size === 'md',
              'px-2.5 py-1 text-sm': size === 'lg',
            },

            // Emphasis levels for attention economics
            {
              'opacity-75 border-0': emphasis === 'subtle',
              'opacity-100 border': emphasis === 'default',
              'opacity-100 border-2 shadow-sm': emphasis === 'prominent',
            },

            // Variant styles with multi-sensory communication
            {
              // Success: Confidence building through subtle confirmation
              'bg-success/20 border-success/30 text-success': variant === 'success',

              // Warning: Balanced visibility for awareness
              'bg-warning/20 border-warning/30 text-warning': variant === 'warning',

              // Error: Strong contrast for immediate attention
              'bg-destructive/20 border-destructive/30 text-destructive': variant === 'error',

              // Info: Supportive context without competition
              'bg-info/20 border-info/30 text-info': variant === 'info',

              // Neutral: Invisible organization
              'bg-muted border-muted-foreground/20 text-muted-foreground': variant === 'neutral',
            },

            className
          )}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Icon for multi-sensory status communication */}
          {Icon && iconPosition === 'left' && (
            <Icon
              className={cn(
                'flex-shrink-0',
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          )}

          {/* Loading indicator */}
          {loading && (
            <div
              className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          )}

          {/* Content */}
          {children && <span className="truncate">{children}</span>}

          {/* Right-positioned icon */}
          {Icon && iconPosition === 'right' && (
            <Icon
              className={cn(
                'flex-shrink-0',
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          )}

          {/* Remove button for removable badges */}
          {removable && onRemove && (
            <button
              type="button"
              className={cn(
                'ml-1 flex-shrink-0 rounded-full p-0.5 hover:bg-current/20',
                'focus:outline-none focus:ring-1 focus:ring-current',
                'transition-colors duration-150'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label="Remove badge"
              tabIndex={-1} // Parent handles tab focus
            >
              <XCircle
                className={cn(
                  size === 'sm' && 'w-3 h-3',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                aria-hidden="true"
              />
            </button>
          )}
        </button>
      );
    }

    return (
      <output
        ref={ref as React.ForwardedRef<HTMLOutputElement>}
        aria-label={
          props['aria-label'] || `${statusInfo.ariaLabel}${children ? `: ${children}` : ''}`
        }
        aria-live={props['aria-live']}
        aria-busy={loading}
        className={cn(
          // Base styles with semantic tokens
          'inline-flex items-center gap-1 rounded-md text-xs font-medium select-none',
          'border transition-all duration-150',

          // Loading state feedback
          loading && 'opacity-75 cursor-wait',

          // Motion respect
          animate && 'motion-reduce:transition-none',

          // Size variants with attention hierarchy
          {
            'px-1.5 py-0.5 text-xs': size === 'sm',
            'px-2 py-0.5 text-xs': size === 'md',
            'px-2.5 py-1 text-sm': size === 'lg',
          },

          // Emphasis levels for attention economics
          {
            'opacity-75 border-0': emphasis === 'subtle',
            'opacity-100 border': emphasis === 'default',
            'opacity-100 border-2 shadow-sm': emphasis === 'prominent',
          },

          // Variant styles with multi-sensory communication
          {
            // Success: Confidence building through subtle confirmation
            'bg-success/20 border-success/30 text-success': variant === 'success',

            // Warning: Balanced visibility for awareness
            'bg-warning/20 border-warning/30 text-warning': variant === 'warning',

            // Error: Strong contrast for immediate attention
            'bg-destructive/20 border-destructive/30 text-destructive': variant === 'error',

            // Info: Supportive context without competition
            'bg-info/20 border-info/30 text-info': variant === 'info',

            // Neutral: Invisible organization
            'bg-muted border-muted-foreground/20 text-muted-foreground': variant === 'neutral',
          },

          className
        )}
        {...props}
      >
        {/* Icon for multi-sensory status communication */}
        {Icon && iconPosition === 'left' && (
          <Icon
            className={cn(
              'flex-shrink-0',
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}

        {/* Loading indicator */}
        {loading && (
          <div
            className={cn(
              'animate-spin rounded-full border-2 border-current border-t-transparent',
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}

        {/* Content */}
        {children && <span className="truncate">{children}</span>}

        {/* Right-positioned icon */}
        {Icon && iconPosition === 'right' && (
          <Icon
            className={cn(
              'flex-shrink-0',
              size === 'sm' && 'w-3 h-3',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            aria-hidden="true"
          />
        )}

        {/* Remove button for removable badges */}
        {removable && onRemove && (
          <button
            type="button"
            className={cn(
              'ml-1 flex-shrink-0 rounded-full p-0.5 hover:bg-current/20',
              'focus:outline-none focus:ring-1 focus:ring-current',
              'transition-colors duration-150'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove badge"
            tabIndex={-1} // Parent handles tab focus
          >
            <XCircle
              className={cn(
                size === 'sm' && 'w-3 h-3',
                size === 'md' && 'w-3 h-3',
                size === 'lg' && 'w-4 h-4'
              )}
              aria-hidden="true"
            />
          </button>
        )}
      </output>
    );
  }
);

Badge.displayName = 'Badge';
