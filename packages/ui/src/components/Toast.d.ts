/**
 * Toast notification component for temporary user feedback
 *
 * @registry-name toast
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Toast.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Non-blocking notification requiring brief attention
 * @attention-economics Temporary interruption: Must be dismissible and time-appropriate for message urgency
 * @trust-building Immediate feedback for user actions builds confidence and confirms system responsiveness
 * @accessibility Screen reader announcements, keyboard dismissal, high contrast variants
 * @semantic-meaning Notification types: success=confirmation, error=failure with recovery, warning=caution, info=neutral updates
 *
 * @usage-patterns
 * DO: Confirm successful operations (save, delete, send)
 * DO: Provide error recovery with clear next steps for failures
 * DO: Auto-dismiss info toasts (4-6 seconds), require user dismiss for errors
 * DO: Use semantic variants with appropriate colors and icons
 * NEVER: Critical information that shouldn't disappear, multiple simultaneous toasts
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-toast, lucide-react
 *
 * @example
 * ```tsx
 * // Success toast with auto-dismiss
 * toast({
 *   title: "Changes saved",
 *   description: "Your settings have been updated successfully.",
 *   variant: "success",
 *   duration: 4000
 * })
 *
 * // Error toast requiring user action
 * toast({
 *   title: "Upload failed",
 *   description: "Please check your connection and try again.",
 *   variant: "destructive",
 *   duration: null // Manual dismiss only
 * })
 * ```
 */
import * as ToastPrimitives from '@radix-ui/react-toast';
import { type VariantProps } from 'class-variance-authority';
declare const ToastProvider: import("react").FC<ToastPrimitives.ToastProviderProps>;
export interface ToastViewportProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
    ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Viewport>>;
}
export declare function ToastViewport({ className, ref, ...props }: ToastViewportProps): import("react/jsx-runtime").JSX.Element;
declare const toastVariants: (props?: ({
    variant?: "error" | "warning" | "success" | "default" | "destructive" | null | undefined;
} & import("class-variance-authority/dist/types").ClassProp) | undefined) => string;
export interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>, VariantProps<typeof toastVariants> {
    urgency?: 'low' | 'medium' | 'high';
    interruption?: 'polite' | 'assertive' | 'demanding';
    persistent?: boolean;
    ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Root>>;
}
export declare function Toast({ className, variant, urgency, interruption, persistent, ref, ...props }: ToastProps): import("react/jsx-runtime").JSX.Element;
export interface ToastActionProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {
    ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Action>>;
}
export declare function ToastAction({ className, ref, ...props }: ToastActionProps): import("react/jsx-runtime").JSX.Element;
export interface ToastCloseProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> {
    ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Close>>;
}
export declare function ToastClose({ className, ref, ...props }: ToastCloseProps): import("react/jsx-runtime").JSX.Element;
export interface ToastTitleProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {
    ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Title>>;
}
export declare function ToastTitle({ className, ref, ...props }: ToastTitleProps): import("react/jsx-runtime").JSX.Element;
export interface ToastDescriptionProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {
    ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Description>>;
}
export declare function ToastDescription({ className, ref, ...props }: ToastDescriptionProps): import("react/jsx-runtime").JSX.Element;
type ToastActionElement = React.ReactElement<typeof ToastAction>;
export { type ToastActionElement, ToastProvider };
//# sourceMappingURL=Toast.d.ts.map