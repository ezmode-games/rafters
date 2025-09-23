/**
 * Modal dialog component for important user interactions
 *
 * @registryName dialog
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Dialog.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 6/10 - Interrupts user flow and requires focused decision making
 * @attentionEconomics Captures full user attention and blocks interaction with underlying content
 * @trustBuilding Clear close mechanisms and confirmation patterns for important actions
 * @accessibility WCAG AAA compliant with focus trapping, keyboard navigation, and screen reader support
 * @semanticMeaning Modal interruption for important decisions, confirmations, and detailed interactions
 *
 * @usagePatterns
 * DO: Use for important confirmations and complex interactions
 * DO: Provide clear close mechanisms and escape patterns
 * DO: Size appropriately for content complexity
 * NEVER: Use for routine actions or non-essential interruptions
 *
 * @designGuides
 * - Trust Building: https://rafters.realhandy.tech/docs/foundation/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/foundation/cognitive-load
 *
 * @dependencies @radix-ui/react-dialog
 *
 * @example
 * ```tsx
 * // Confirmation dialog
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="destructive">Delete Item</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogTitle>Confirm Deletion</DialogTitle>
 *     <DialogDescription>This action cannot be undone.</DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
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

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>;
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    DialogProps {
  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>;
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>;
}

export interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>;
}

// Root Dialog component
export const Dialog = DialogPrimitive.Root;

// Trigger component
export const DialogTrigger = DialogPrimitive.Trigger;

// Portal component for z-index management
export const DialogPortal = DialogPrimitive.Portal;

// Overlay with trust-building visual hierarchy
export function DialogOverlay({ className, ref, ...props }: DialogOverlayProps) {
  return (
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
  );
}

// Main Content component with intelligence patterns
export function DialogContent({
  className,
  children,
  trustLevel = 'medium',
  destructive = false,
  size = 'md',
  cognitiveComplexity = 'moderate',
  ref,
  ...props
}: DialogContentProps) {
  return (
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
          'transition-all',
          'motion-modal',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
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
  );
}

// Header with trust-building hierarchy
export function DialogHeader({ className, ref, ...props }: DialogHeaderProps) {
  return (
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
  );
}

// Footer with action hierarchy and trust patterns
export function DialogFooter({ className, ref, ...props }: DialogFooterProps) {
  return (
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
  );
}

// Title with semantic hierarchy
export function DialogTitle({ className, ref, ...props }: DialogTitleProps) {
  return (
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
  );
}

// Description with trust-building clarity
export function DialogDescription({ className, ref, ...props }: DialogDescriptionProps) {
  return (
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
  );
}

// Close button with escape hatch accessibility
export const DialogClose = DialogPrimitive.Close;
