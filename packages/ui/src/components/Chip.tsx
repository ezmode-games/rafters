/**
 * Notification chip component for status indicators and count overlays
 *
 * @registryName chip
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Chip.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 4/10 - High visibility overlay designed for immediate attention
 * @attentionEconomics Secondary overlay that maximizes visibility without overwhelming primary content
 * @trustBuilding Critical status and count information builds user awareness and system transparency
 * @accessibility WCAG AAA compliant with high contrast and screen reader support
 * @semanticMeaning Status communication variants for different notification types and urgency levels
 *
 * @usagePatterns
 * DO: Use for notification counts and status indicators
 * DO: Attach to buttons, avatars, and other interface elements
 * DO: Create urgent overlays that break component boundaries for visibility
 * NEVER: Use for primary actions or complex information display
 *
 * @designGuides
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
 *
 * @dependencies None
 *
 * @example
 * ```tsx
 * // Notification count overlay
 * <div className="relative">
 *   <Button>Messages</Button>
 *   <Chip variant="count" position="top-right" value={3} />
 * </div>
 * ```
 */
import { forwardRef } from 'react';
import { cn } from '../utils';

export type ChipVariant = 'urgent' | 'new' | 'live' | 'beta' | 'premium' | 'count';
export type ChipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps extends React.HTMLAttributes<HTMLOutputElement> {
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

export const Chip = forwardRef<HTMLOutputElement, ChipProps>(
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
      <output
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
      </output>
    );
  }
);

Chip.displayName = 'Chip';
