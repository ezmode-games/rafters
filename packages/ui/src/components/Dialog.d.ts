/**
 * Modal dialog component with focus management and escape patterns
 *
 * @registry-name dialog
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Dialog.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 6/10 - Interrupts user flow, requires decision making
 * @attention-economics Attention capture: modal=full attention, drawer=partial attention, popover=contextual attention
 * @trust-building Clear close mechanisms, confirmation for destructive actions, non-blocking for informational content
 * @accessibility Focus trapping, escape key handling, backdrop dismissal, screen reader announcements
 * @semantic-meaning Usage patterns: modal=blocking workflow, drawer=supplementary, alert=urgent information
 *
 * @usage-patterns
 * DO: Low trust - Quick confirmations, save draft (size=sm, minimal friction)
 * DO: Medium trust - Publish content, moderate consequences (clear context)
 * DO: High trust - Payments, significant impact (detailed explanation)
 * DO: Critical trust - Account deletion, permanent loss (progressive confirmation)
 * NEVER: Routine actions, non-essential interruptions
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies @radix-ui/react-dialog
 *
 * @example
 * ```tsx
 * // Critical trust dialog with confirmation
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button variant="destructive">Delete Account</Button>
 *   </DialogTrigger>
 *   <DialogContent trustLevel="critical" destructive>
 *     <DialogTitle>Delete Account</DialogTitle>
 *     <DialogDescription>This action cannot be undone.</DialogDescription>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
import * as DialogPrimitive from '@radix-ui/react-dialog';
export interface DialogProps {
    trustLevel?: 'low' | 'medium' | 'high' | 'critical';
    destructive?: boolean;
    requireConfirmation?: boolean;
    cognitiveComplexity?: 'simple' | 'moderate' | 'complex';
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}
export interface DialogOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
    ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>;
}
export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, DialogProps {
    ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>;
}
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>;
}
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>;
}
export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
    ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>;
}
export interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
    ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>;
}
export declare const Dialog: import("react").FC<DialogPrimitive.DialogProps>;
export declare const DialogTrigger: import("react").ForwardRefExoticComponent<DialogPrimitive.DialogTriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
export declare const DialogPortal: import("react").FC<DialogPrimitive.DialogPortalProps>;
export declare function DialogOverlay({ className, ref, ...props }: DialogOverlayProps): import("react/jsx-runtime").JSX.Element;
export declare function DialogContent({ className, children, trustLevel, destructive, size, cognitiveComplexity, ref, ...props }: DialogContentProps): import("react/jsx-runtime").JSX.Element;
export declare function DialogHeader({ className, ref, ...props }: DialogHeaderProps): import("react/jsx-runtime").JSX.Element;
export declare function DialogFooter({ className, ref, ...props }: DialogFooterProps): import("react/jsx-runtime").JSX.Element;
export declare function DialogTitle({ className, ref, ...props }: DialogTitleProps): import("react/jsx-runtime").JSX.Element;
export declare function DialogDescription({ className, ref, ...props }: DialogDescriptionProps): import("react/jsx-runtime").JSX.Element;
export declare const DialogClose: import("react").ForwardRefExoticComponent<DialogPrimitive.DialogCloseProps & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=Dialog.d.ts.map