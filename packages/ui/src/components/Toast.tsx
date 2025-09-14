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

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const ToastProvider = ToastPrimitives.Provider;

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Viewport>>;
}

export function ToastViewport({ className, ref, ...props }: ToastViewportProps) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  cn(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg',
    'transition-all',
    'motion-toast',
    'easing-smooth',
    'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full'
  ),
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success:
          'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200',
        warning:
          'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        error:
          'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  urgency?: 'low' | 'medium' | 'high';
  interruption?: 'polite' | 'assertive' | 'demanding';
  persistent?: boolean;
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Root>>;
}

export function Toast({
  className,
  variant,
  urgency = 'medium',
  interruption = 'polite',
  persistent = false,
  ref,
  ...props
}: ToastProps) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      duration={
        persistent
          ? Number.POSITIVE_INFINITY
          : urgency === 'high'
            ? 8000
            : urgency === 'medium'
              ? 5000
              : 3000
      }
      {...props}
    />
  );
}

export interface ToastActionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Action>>;
}

export function ToastAction({ className, ref, ...props }: ToastActionProps) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
        className
      )}
      {...props}
    />
  );
}

export interface ToastCloseProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Close>>;
}

export function ToastClose({ className, ref, ...props }: ToastCloseProps) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        className
      )}
      toast-close=""
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Close toast"
      >
        <title>Close toast</title>
        <path d="m3 3 18 18" />
        <path d="m21 3-18 18" />
      </svg>
    </ToastPrimitives.Close>
  );
}

export interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Title>>;
}

export function ToastTitle({ className, ref, ...props }: ToastTitleProps) {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn('text-sm font-semibold', className)}
      {...props}
    />
  );
}

export interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {
  ref?: React.Ref<React.ElementRef<typeof ToastPrimitives.Description>>;
}

export function ToastDescription({ className, ref, ...props }: ToastDescriptionProps) {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  );
}

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export { type ToastActionElement, ToastProvider };
