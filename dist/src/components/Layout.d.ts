export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "reading" | "golden" | "wide" | "full";
}
export declare const Container: import("react").ForwardRefExoticComponent<
	ContainerProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const ReadingLayout: import("react").ForwardRefExoticComponent<
	LayoutProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const ActionLayout: import("react").ForwardRefExoticComponent<
	LayoutProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const ContentSidebar: import("react").ForwardRefExoticComponent<
	LayoutProps & import("react").RefAttributes<HTMLDivElement>
>;
export declare const AppLayout: import("react").ForwardRefExoticComponent<
	LayoutProps & import("react").RefAttributes<HTMLDivElement>
>;
export interface ContentStackProps
	extends React.HTMLAttributes<HTMLDivElement> {
	gap?: "phi-0" | "phi-1" | "phi-2" | "phi-3";
}
export declare const ContentStack: import("react").ForwardRefExoticComponent<
	ContentStackProps & import("react").RefAttributes<HTMLDivElement>
>;
//# sourceMappingURL=Layout.d.ts.map
