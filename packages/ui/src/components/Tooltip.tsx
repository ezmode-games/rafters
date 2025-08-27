/**
 * Contextual tooltip component with smart timing and accessibility
 *
 * @registry-name tooltip
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Tooltip.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Contextual help without interrupting user workflow
 * @attention-economics Non-intrusive assistance: Smart delays prevent accidental triggers while ensuring help availability
 * @trust-building Reliable contextual guidance that builds user confidence through progressive disclosure
 * @accessibility Keyboard navigation, screen reader support, focus management, escape key handling
 * @semantic-meaning Contextual assistance: help=functionality explanation, definition=terminology clarification, action=shortcuts and outcomes, status=system state
 *
 * @usage-patterns
 * DO: Explain functionality without overwhelming users
 * DO: Clarify terminology contextually when needed
 * DO: Show shortcuts and expected action outcomes
 * DO: Provide feedback on system state changes
 * NEVER: Include essential information that should be visible by default
 *
 * @design-guides
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 *
 * @dependencies @radix-ui/react-tooltip
 *
 * @example
 * ```tsx
 * // Basic tooltip with help text
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button variant="ghost">Help</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>
 *     Click to open the help documentation
 *   </TooltipContent>
 * </Tooltip>
 *
 * // Tooltip with keyboard shortcut
 * <Tooltip>
 *   <TooltipTrigger asChild>
 *     <Button>Save</Button>
 *   </TooltipTrigger>
 *   <TooltipContent>
 *     Save changes (⌘+S)
 *   </TooltipContent>
 * </Tooltip>
 * ```
 */
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface TooltipProps {
  // Contextual intelligence
  context?: 'help' | 'definition' | 'action' | 'status' | 'shortcut';
  complexity?: 'simple' | 'detailed';

  // Timing intelligence - auto-calculated based on content if not provided
  delayDuration?: number;

  // Accessibility
  essential?: boolean; // For screen readers

  // Progressive disclosure
  expandable?: boolean; // Click to expand detailed info
}

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    Pick<TooltipProps, 'context' | 'complexity' | 'essential' | 'expandable'> {}

// Export type for contextual intelligence
export type TooltipContext = 'help' | 'definition' | 'action' | 'status' | 'shortcut';

/**
 * TooltipProvider - Required wrapper for tooltip context
 * Provides intelligent defaults for timing and behavior
 */
export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip - Main tooltip component with contextual intelligence
 * Includes smart timing based on content complexity and context
 */
export const Tooltip = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TooltipPrimitive.Root> & TooltipProps
>(function Tooltip(
  { delayDuration, context = 'help', complexity = 'simple', essential = false, ...props },
  _ref
) {
  // Timing Intelligence: Smart delays based on context and complexity
  const getIntelligentDelay = () => {
    if (delayDuration !== undefined) return delayDuration;

    if (essential) return 500; // Essential info - faster access
    if (complexity === 'detailed') return 1200; // Complex info - prevent accidental triggers
    if (context === 'shortcut') return 300; // Shortcuts - quick access for power users
    if (context === 'status') return 600; // Status - balance between info and interruption
    return 700; // Default - balanced for most use cases
  };

  return <TooltipPrimitive.Root delayDuration={getIntelligentDelay()} {...props} />;
});

/**
 * TooltipTrigger - Element that triggers the tooltip
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipPortal - Portal for tooltip content
 */
export const TooltipPortal = TooltipPrimitive.Portal;

/**
 * TooltipContent - The actual tooltip content with contextual styling
 */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    {
      className,
      sideOffset = 4,
      context = 'help',
      complexity = 'simple',
      essential = false,
      expandable = false,
      children,
      ...props
    },
    ref
  ) {
    return (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          // Base tooltip styling with semantic tokens
          'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm',
          'bg-popover text-popover-foreground shadow-lg',
          'border border-border/50',

          // Trust building: Smooth animations reduce jarring appearance
          'animate-in fade-in-0 zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',

          // Motion intelligence: Consistent with other interactive elements
          'transition-all',
          'motion-modal',
          'easing-accelerate',

          // Contextual styling based on tooltip type
          {
            // Help tooltips - soft, non-intrusive
            'bg-muted text-muted-foreground border-muted-foreground/20': context === 'help',

            // Definition tooltips - slightly more prominent for learning
            'bg-card text-card-foreground border-border': context === 'definition',

            // Action tooltips - aligned with interactive elements
            'bg-accent text-accent-foreground border-accent-foreground/20': context === 'action',

            // Status tooltips - contextual coloring based on semantic meaning
            'bg-secondary text-secondary-foreground border-secondary-foreground/30':
              context === 'status',

            // Shortcut tooltips - emphasized for power users
            'bg-popover text-popover-foreground border-primary/20 font-mono text-xs':
              context === 'shortcut',
          },

          // Complexity-based sizing
          {
            'max-w-xs': complexity === 'simple',
            'max-w-sm': complexity === 'detailed',
          },

          // Essential tooltips get enhanced visibility
          essential && ['ring-2 ring-primary/10', 'shadow-xl'],

          // Expandable tooltips show interaction affordance
          expandable && ['cursor-pointer', 'hover:shadow-lg', 'transition-shadow', 'motion-hover'],

          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    );
  }
);

/**
 * TooltipTitle - For structured tooltip content
 */
export const TooltipTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function TooltipTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'font-medium text-sm mb-1',
          'text-foreground', // Higher contrast for titles
          className
        )}
        {...props}
      />
    );
  }
);

/**
 * TooltipDescription - For detailed explanations
 */
export const TooltipDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function TooltipDescription({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'text-xs leading-relaxed',
          'text-muted-foreground', // Lower contrast for descriptions
          className
        )}
        {...props}
      />
    );
  }
);

/**
 * TooltipShortcut - For keyboard shortcuts
 */
export const TooltipShortcut = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function TooltipShortcut({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          'ml-2 inline-flex items-center gap-1',
          'text-xs font-mono font-medium',
          'text-muted-foreground',
          'bg-muted px-1.5 py-0.5 rounded border',
          className
        )}
        {...props}
      />
    );
  }
);

// Set display names for debugging
Tooltip.displayName = 'Tooltip';
TooltipContent.displayName = 'TooltipContent';
TooltipTitle.displayName = 'TooltipTitle';
TooltipDescription.displayName = 'TooltipDescription';
TooltipShortcut.displayName = 'TooltipShortcut';
