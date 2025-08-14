/**
 * Chip Component - AI Intelligence
 *
 * COGNITIVE LOAD: 3-9/10 (varies by variant - see CHIP_INTELLIGENCE)
 * ATTENTION HIERARCHY: Secondary overlay - high visibility without overwhelming primary content
 * TRUST BUILDING: Medium-High trust level - provides critical status/count information
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Attention Economics: rafters.realhandy.tech/llm/patterns/attention-economics
 * - Notification Patterns: rafters.realhandy.tech/llm/patterns/notification-intelligence
 * - Trust Building: rafters.realhandy.tech/llm/patterns/trust-building
 *
 * USAGE PATTERNS:
 * ✅ Notification counts: unread messages, alerts, status updates
 * ✅ Status indicators: live, new, beta, premium features
 * ✅ Urgent overlays: breaking badge/component boundaries for maximum visibility
 * ✅ Universal attachment: works with buttons, cards, avatars, badges, any component
 * ❌ Never: Primary actions, complex information, standalone content
 *
 * Position intelligence: All positions break parent boundaries (-2px) for maximum attention
 * Accessibility: Full WCAG AAA compliance with screen reader count announcements
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export type ChipVariant = 'urgent' | 'new' | 'live' | 'beta' | 'premium' | 'count';
export type ChipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Core variant for semantic meaning
  variant: ChipVariant;

  // Positioning relative to parent component
  position?: ChipPosition;

  // Custom display value (numbers, text, icons)
  value?: string | number;

  // Size adaptation for parent component context
  size?: ChipSize;

  // Enhanced accessibility
  'aria-label'?: string;
}

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

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant,
      position = 'top-right',
      value,
      size = 'md',
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const chipInfo = CHIP_INTELLIGENCE[variant];
    const displayValue = value || (variant === 'count' ? '1' : '');

    return (
      <span
        ref={ref}
        className={cn(
          // High visibility positioning that breaks parent boundaries
          'absolute z-10 rounded-full font-bold leading-none',
          'min-w-5 h-5 flex items-center justify-center',
          'border-2 border-background', // Creates separation from parent
          chipInfo.color,
          chipInfo.textColor,

          // Position-specific styles (ALL break boundaries with -2px)
          {
            '-top-2 -right-2': position === 'top-right',
            '-top-2 -left-2': position === 'top-left',
            '-bottom-2 -right-2': position === 'bottom-right',
            '-bottom-2 -left-2': position === 'bottom-left',
          },

          // Size responsive
          {
            'text-xs min-w-4 h-4': size === 'sm',
            'text-xs min-w-5 h-5': size === 'md',
            'text-sm min-w-6 h-6': size === 'lg',
          },

          className
        )}
        aria-label={ariaLabel || `${chipInfo.ariaLabel}${value ? `: ${value}` : ''}`}
        aria-hidden="false" // Important for screen readers to announce counts
        {...props}
      >
        {displayValue}
      </span>
    );
  }
);

Chip.displayName = 'Chip';
