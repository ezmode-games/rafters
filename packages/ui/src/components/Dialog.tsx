/**
 * Dialog Component - AI Intelligence
 *
 * COGNITIVE LOAD: 7/10 (interrupts user flow, requires decision)
 * TRUST BUILDING: Friction must match consequence level (low/medium/high/critical)
 * ATTENTION FOCUS: Captures 100% attention - use judiciously
 *
 * DESIGN INTELLIGENCE GUIDES:
 * - Trust Building Patterns: rafters.realhandy.tech/llm/patterns/trust-building
 * - Cognitive Load Management: rafters.realhandy.tech/llm/patterns/cognitive-load
 * - Progressive Enhancement: rafters.realhandy.tech/llm/patterns/progressive-enhancement
 *
 * USAGE PATTERNS:
 * ✅ Low Trust: Quick confirmations, save draft (size=sm, minimal friction)
 * ✅ Medium Trust: Publish content, moderate consequences (clear context)
 * ✅ High Trust: Payments, significant impact (detailed explanation)
 * ✅ Critical Trust: Account deletion, permanent loss (progressive confirmation)
 * ❌ Never: Routine actions, non-essential interruptions
 *
 * Progressive confirmation REQUIRED for destructive actions
 * Trust-building patterns: clear consequences, escape hatches, familiar flows
 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface DialogProps {
  // Trust-building intelligence
  trustLevel?: 'low' | 'medium' | 'high' | 'critical';
  destructive?: boolean;
  requireConfirmation?: boolean;

  // Cognitive load optimization
  cognitiveComplexity?: 'simple' | 'moderate' | 'complex';

  // Size variants for content hierarchy
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    DialogProps {}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

// Root Dialog component
export const Dialog = DialogPrimitive.Root;

// Trigger component
export const DialogTrigger = DialogPrimitive.Trigger;

// Portal component for z-index management
export const DialogPortal = DialogPrimitive.Portal;

// Overlay with trust-building visual hierarchy
export const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Base overlay with trust-building opacity
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
      // Trust pattern: Smooth entrance reduces cognitive jarring
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Main Content component with intelligence patterns
export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      trustLevel = 'medium',
      destructive = false,
      size = 'md',
      cognitiveComplexity = 'moderate',
      ...props
    },
    ref
  ) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // Base styles with trust-building visual hierarchy
          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'bg-background border border-border rounded-lg shadow-lg',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',

          // Trust-building: Enhanced borders for high-trust operations
          trustLevel === 'critical' && 'border-2 border-primary/20 shadow-xl',
          trustLevel === 'high' && 'border-primary/10 shadow-lg',

          // Destructive actions get visual warning indicators
          destructive && 'border-destructive/20 shadow-destructive/10',

          // Size variants for cognitive load management
          {
            'w-full max-w-sm': size === 'sm',
            'w-full max-w-md': size === 'md',
            'w-full max-w-lg': size === 'lg',
            'w-full max-w-2xl': size === 'xl',
            'w-[95vw] max-w-none h-[95vh]': size === 'full',
          },

          // Cognitive complexity affects spacing
          {
            'p-4 gap-3': cognitiveComplexity === 'simple',
            'p-6 gap-4': cognitiveComplexity === 'moderate',
            'p-8 gap-6': cognitiveComplexity === 'complex',
          },

          // Trust pattern: Smooth animations reduce cognitive jarring
          'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
          'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',

          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Header with trust-building hierarchy
export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Cognitive load optimization: Clear visual hierarchy
        'flex flex-col space-y-2 text-center sm:text-left',
        // Trust pattern: Adequate spacing prevents rushed decisions
        'mb-4',
        className
      )}
      {...props}
    />
  )
);
DialogHeader.displayName = 'DialogHeader';

// Footer with action hierarchy and trust patterns
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Trust pattern: Actions flow from low to high commitment (left to right)
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        // Motor accessibility: Enhanced spacing for touch targets
        'space-y-2 sm:space-y-0 pt-4',
        // Cognitive load: Clear separation from content
        'border-t border-border/50 mt-6',
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = 'DialogFooter';

// Title with semantic hierarchy
export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Cognitive load: Clear title hierarchy
      'text-lg font-semibold leading-none tracking-tight',
      // Trust pattern: Titles establish context and confidence
      'text-foreground',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Description with trust-building clarity
export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // Trust pattern: Clear explanation reduces uncertainty
      'text-sm text-muted-foreground leading-relaxed',
      // Cognitive load: Comfortable reading line height
      'max-w-none',
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Close button with escape hatch accessibility
export const DialogClose = DialogPrimitive.Close;
