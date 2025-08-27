/**
 * Dialog Intelligence: cognitiveLoad=7, trustLevel=critical
 * Progressive confirmation REQUIRED for destructive actions
 * Trust-building patterns: clear consequences, escape hatches, familiar confirmation flows
 * Full patterns: .rafters/agent-instructions.md
 */
import * as DialogPrimitive from "@radix-ui/react-dialog";
export interface DialogProps {
	trustLevel?: "low" | "medium" | "high" | "critical";
	destructive?: boolean;
	requireConfirmation?: boolean;
	cognitiveComplexity?: "simple" | "moderate" | "complex";
	size?: "sm" | "md" | "lg" | "xl" | "full";
}
export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
		DialogProps {}
export interface DialogHeaderProps
	extends React.HTMLAttributes<HTMLDivElement> {}
export interface DialogFooterProps
	extends React.HTMLAttributes<HTMLDivElement> {}
export interface DialogTitleProps
	extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}
export interface DialogDescriptionProps
	extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}
export declare const Dialog: import("react").FC<DialogPrimitive.DialogProps>;
export declare const DialogTrigger: import("react").ForwardRefExoticComponent<
	DialogPrimitive.DialogTriggerProps &
		import("react").RefAttributes<HTMLButtonElement>
>;
export declare const DialogPortal: import("react").FC<DialogPrimitive.DialogPortalProps>;
export declare const DialogOverlay: import("react").ForwardRefExoticComponent<
	Omit<
		DialogPrimitive.DialogOverlayProps &
			import("react").RefAttributes<HTMLDivElement>,
		"ref"
	> &
		import("react").RefAttributes<HTMLDivElement>
>;
export declare const DialogContent: import("react").ForwardRefExoticComponent<
	DialogContentProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const DialogHeader: import("react").ForwardRefExoticComponent<
	DialogHeaderProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const DialogFooter: import("react").ForwardRefExoticComponent<
	DialogFooterProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const DialogTitle: import("react").ForwardRefExoticComponent<
	DialogTitleProps & import("react").RefAttributes<HTMLHeadingElement>
>;
export declare const DialogDescription: import("react").ForwardRefExoticComponent<
	DialogDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>
>;
export declare const DialogClose: import("react").ForwardRefExoticComponent<
	DialogPrimitive.DialogCloseProps &
		import("react").RefAttributes<HTMLButtonElement>
>;
//# sourceMappingURL=Dialog.d.ts.map
