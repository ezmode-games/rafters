import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Notification chip component for status indicators and count overlays
 *
 * @registry-name chip
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Chip.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 5/10 - High visibility overlay requiring immediate attention (varies by variant)
 * @attention-economics Secondary overlay with maximum visibility without overwhelming primary content
 * @trust-building Critical status and count information builds user awareness and system transparency
 * @accessibility High contrast indicators, screen reader announcements, keyboard navigation support
 * @semantic-meaning Status communication: count=quantity indication, status=state indication, badge=feature marking, dot=simple presence indicator
 *
 * @usage-patterns
 * DO: Use for notification counts (unread messages, alerts, status updates)
 * DO: Provide status indicators (live, new, beta, premium features)
 * DO: Create urgent overlays that break component boundaries for maximum visibility
 * DO: Attach universally to buttons, cards, avatars, badges, any component
 * NEVER: Use for primary actions, complex information, or standalone content
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Notification Intelligence: https://rafters.realhandy.tech/docs/llm/notification-intelligence
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 *
 * @dependencies class-variance-authority, clsx
 *
 * @example
 * ```tsx
 * // Notification count chip
 * <div className="relative">
 *   <Button>Messages</Button>
 *   <Chip variant="count" position="top-right">
 *     3
 *   </Chip>
 * </div>
 *
 * // Status indicator chip
 * <div className="relative">
 *   <Badge>Premium</Badge>
 *   <Chip variant="dot" position="top-right" color="success" />
 * </div>
 * ```
 */
import { forwardRef } from 'react';
import { cn } from '../lib/utils';
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
};
export const Chip = forwardRef(({ variant, position = 'top-right', value, size = 'md', className, 'aria-label': ariaLabel, ...props }, ref) => {
    const chipInfo = CHIP_INTELLIGENCE[variant];
    const displayValue = value || (variant === 'count' ? '1' : '');
    return (_jsx("output", { ref: ref, className: cn(
        // High visibility positioning that breaks parent boundaries
        'absolute z-10 rounded-full font-bold leading-none', 'min-w-5 h-5 flex items-center justify-center', 'border-2 border-background', // Creates separation from parent
        chipInfo.color, chipInfo.textColor, 
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
        }, className), "aria-label": ariaLabel || `${chipInfo.ariaLabel}${value ? `: ${value}` : ''}`, "aria-hidden": "false" // Important for screen readers to announce counts
        , ...props, children: displayValue }));
});
Chip.displayName = 'Chip';
//# sourceMappingURL=Chip.js.map