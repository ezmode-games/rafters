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
export interface TooltipProps {
    context?: 'help' | 'definition' | 'action' | 'status' | 'shortcut';
    complexity?: 'simple' | 'detailed';
    delayDuration?: number;
    essential?: boolean;
    expandable?: boolean;
}
export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, Pick<TooltipProps, 'context' | 'complexity' | 'essential' | 'expandable'> {
}
export type TooltipContext = 'help' | 'definition' | 'action' | 'status' | 'shortcut';
/**
 * TooltipProvider - Required wrapper for tooltip context
 * Provides intelligent defaults for timing and behavior
 */
export declare const TooltipProvider: import("react").FC<TooltipPrimitive.TooltipProviderProps>;
/**
 * Tooltip - Main tooltip component with contextual intelligence
 * Includes smart timing based on content complexity and context
 */
export declare const Tooltip: import("react").ForwardRefExoticComponent<TooltipPrimitive.TooltipProps & TooltipProps & import("react").RefAttributes<HTMLDivElement>>;
/**
 * TooltipTrigger - Element that triggers the tooltip
 */
export declare const TooltipTrigger: import("react").ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
/**
 * TooltipPortal - Portal for tooltip content
 */
export declare const TooltipPortal: import("react").FC<TooltipPrimitive.TooltipPortalProps>;
/**
 * TooltipContent - The actual tooltip content with contextual styling
 */
export declare const TooltipContent: import("react").ForwardRefExoticComponent<TooltipContentProps & import("react").RefAttributes<HTMLDivElement>>;
/**
 * TooltipTitle - For structured tooltip content
 */
export declare const TooltipTitle: import("react").ForwardRefExoticComponent<import("react").HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
/**
 * TooltipDescription - For detailed explanations
 */
export declare const TooltipDescription: import("react").ForwardRefExoticComponent<import("react").HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
/**
 * TooltipShortcut - For keyboard shortcuts
 */
export declare const TooltipShortcut: import("react").ForwardRefExoticComponent<import("react").HTMLAttributes<HTMLSpanElement> & import("react").RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=Tooltip.d.ts.map