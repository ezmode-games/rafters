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
export type BadgeChipVariant = 'urgent' | 'new' | 'live' | 'beta' | 'premium' | 'count';
export type BadgeChipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

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

  // High visibility chip indicator
  chip?: BadgeChipVariant;
  chipPosition?: BadgeChipPosition;
  chipValue?: string | number; // For count badges or custom text
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

// High visibility chip intelligence with attention economics
const CHIP_INTELLIGENCE = {
  urgent: {
    color: 'bg-destructive',
    textColor: 'text-destructive-foreground',
    cognitiveLoad: 9,
    attentionWeight: 'maximum',
    psychology: 'immediate_action_required',
    ariaLabel: 'Urgent notification',
  },
  new: {
    color: 'bg-primary',
    textColor: 'text-primary-foreground',
    cognitiveLoad: 6,
    attentionWeight: 'high',
    psychology: 'discovery_excitement',
    ariaLabel: 'New feature or content',
  },
  live: {
    color: 'bg-success',
    textColor: 'text-success-foreground',
    cognitiveLoad: 7,
    attentionWeight: 'high',
    psychology: 'real_time_awareness',
    ariaLabel: 'Live status indicator',
  },
  beta: {
    color: 'bg-warning',
    textColor: 'text-warning-foreground',
    cognitiveLoad: 4,
    attentionWeight: 'medium',
    psychology: 'experimental_caution',
    ariaLabel: 'Beta feature indicator',
  },
  premium: {
    color: 'bg-accent',
    textColor: 'text-accent-foreground',
    cognitiveLoad: 5,
    attentionWeight: 'medium',
    psychology: 'value_proposition',
    ariaLabel: 'Premium feature indicator',
  },
  count: {
    color: 'bg-destructive',
    textColor: 'text-destructive-foreground',
    cognitiveLoad: 8,
    attentionWeight: 'high',
    psychology: 'quantified_urgency',
    ariaLabel: 'Notification count',
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
      chip,
      chipPosition = 'top-right',
      chipValue,
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

    // Chip rendering helper
    const renderChip = () => {
      if (!chip) return null;

      const chipInfo = CHIP_INTELLIGENCE[chip];
      const displayValue = chipValue || (chip === 'count' ? '1' : '');

      return (
        <span
          className={cn(
            // High visibility positioning that breaks badge boundaries
            'absolute z-10 rounded-full text-xs font-bold leading-none',
            'min-w-5 h-5 flex items-center justify-center',
            'border-2 border-background', // Creates separation from badge
            chipInfo.color,
            chipInfo.textColor,

            // Position-specific styles
            {
              '-top-2 -right-2': chipPosition === 'top-right',
              '-top-2 -left-2': chipPosition === 'top-left',
              '-bottom-2 -right-2': chipPosition === 'bottom-right',
              '-bottom-2 -left-2': chipPosition === 'bottom-left',
            },

            // Size responsive
            {
              'text-xs min-w-4 h-4': size === 'sm',
              'text-xs min-w-5 h-5': size === 'md',
              'text-sm min-w-6 h-6': size === 'lg',
            }
          )}
          aria-label={`${chipInfo.ariaLabel}${chipValue ? `: ${chipValue}` : ''}`}
          aria-hidden="false" // Important for screen readers to announce counts
        >
          {displayValue}
        </span>
      );
    };

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

    if (isInteractive && removable && onRemove) {
      // Single button solution with separated interaction zones (Sally's recommendation)
      return (
        <div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          // biome-ignore lint/a11y/useSemanticElements: div with role="group" is more appropriate than fieldset for badge interaction grouping
          role="group"
          aria-label={`${statusInfo.ariaLabel}${children ? `: ${children}` : ''} - clickable badge with remove option`}
          className={cn(
            'relative inline-flex items-center rounded-md text-xs font-medium select-none',
            'border transition-all duration-150',

            // Motion respect
            animate && 'motion-reduce:transition-none',

            // Size variants with attention hierarchy
            {
              'text-xs': size === 'sm' || size === 'md',
              'text-sm': size === 'lg',
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
          <button
            type="button"
            tabIndex={0}
            className={cn(
              'inline-flex items-center gap-1 w-full',
              // Enhanced touch targets for interactive badges (WCAG AAA)
              'min-h-11 min-w-11 touch-manipulation cursor-pointer',
              'hover:opacity-hover focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'active:scale-active rounded-md',

              // Loading state feedback
              loading && 'opacity-75 cursor-wait',

              // Size variants with attention hierarchy
              {
                'px-1.5 py-0.5': size === 'sm',
                'px-2 py-0.5': size === 'md',
                'px-2.5 py-1': size === 'lg',
              }
            )}
            onClick={(e) => {
              // Check if click was on remove zone
              const target = e.target as HTMLElement;
              const removeZone = target.closest('[data-remove-zone]');
              if (removeZone) {
                e.stopPropagation();
                onRemove();
              } else if (onClick) {
                onClick(e);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                onRemove();
              } else {
                handleKeyDown(e);
              }
            }}
            aria-label={`${statusInfo.ariaLabel}${children ? `: ${children}` : ''} - removable badge`}
            aria-busy={loading}
          >
            {/* Main content zone */}
            <span className="pointer-events-none inline-flex items-center gap-1 flex-1">
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
            </span>

            {/* Remove zone - visually separate but part of same button */}
            <span
              data-remove-zone="true"
              className={cn(
                'ml-2 pl-1 border-l border-current/20',
                'hover:bg-current/10 rounded-r-md cursor-pointer',
                'inline-flex items-center justify-center',
                {
                  'p-0.5': size === 'sm',
                  'p-1': size === 'md',
                  'p-1.5': size === 'lg',
                }
              )}
              aria-hidden="true"
            >
              <XCircle
                className={cn(
                  size === 'sm' && 'w-3 h-3',
                  size === 'md' && 'w-3 h-3',
                  size === 'lg' && 'w-4 h-4'
                )}
                aria-hidden="true"
              />
            </span>
          </button>
          {renderChip()}
        </div>
      );
    }

    if (isInteractive) {
      return (
        <div className="relative inline-block">
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
          </button>
          {renderChip()}
        </div>
      );
    }

    // Semantic element selection based on Sally's recommendations
    const getSemanticProps = () => {
      // Use status role for status communication variants
      if (['success', 'warning', 'error', 'info'].includes(variant)) {
        return {
          role: 'status',
          'aria-live': props['aria-live'] || (variant === 'error' ? 'assertive' : 'polite'),
          'aria-label':
            props['aria-label'] || `${statusInfo.ariaLabel}${children ? `: ${children}` : ''}`,
        };
      }

      // Use generic span for labels/categories
      return {
        'aria-label':
          props['aria-label'] || `${statusInfo.ariaLabel}${children ? `: ${children}` : ''}`,
        'aria-live': props['aria-live'],
      };
    };

    const semanticProps = getSemanticProps();

    return (
      <div className="relative inline-block">
        <span
          ref={ref as React.ForwardedRef<HTMLSpanElement>}
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
          {...semanticProps}
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
        </span>
        {renderChip()}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
