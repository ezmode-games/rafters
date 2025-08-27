export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Cognitive load: Card density for information hierarchy */
	density?: "compact" | "comfortable" | "spacious";
	/** Cognitive load: Interaction affordance */
	interactive?: boolean;
	/** Scanability: Visual prominence for important cards */
	prominence?: "subtle" | "default" | "elevated";
}
export declare const Card: import("react").ForwardRefExoticComponent<
	CardProps & import("react").RefAttributes<HTMLDivElement>
>;
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Cognitive load: Header density for information hierarchy */
	density?: "compact" | "comfortable" | "spacious";
}
export declare const CardHeader: import("react").ForwardRefExoticComponent<
	CardHeaderProps & import("react").RefAttributes<HTMLDivElement>
>;
export interface CardTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	/** Information hierarchy: Semantic heading level */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Scanability: Visual weight for content hierarchy */
	weight?: "normal" | "medium" | "semibold";
}
export declare const CardTitle: import("react").ForwardRefExoticComponent<
	CardTitleProps & import("react").RefAttributes<HTMLHeadingElement>
>;
export interface CardDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	/** Cognitive load: Text length awareness for readability */
	truncate?: boolean;
	/** Information hierarchy: Subtle vs prominent descriptions */
	prominence?: "subtle" | "default";
}
export declare const CardDescription: import("react").ForwardRefExoticComponent<
	CardDescriptionProps & import("react").RefAttributes<HTMLParagraphElement>
>;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Cognitive load: Content density for information hierarchy */
	density?: "compact" | "comfortable" | "spacious";
	/** Scanability: Content organization patterns */
	layout?: "default" | "grid" | "list";
}
export declare const CardContent: import("react").ForwardRefExoticComponent<
	CardContentProps & import("react").RefAttributes<HTMLDivElement>
>;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Cognitive load: Footer density and action clarity */
	density?: "compact" | "comfortable" | "spacious";
	/** Scanability: Action hierarchy in footer */
	justify?: "start" | "center" | "end" | "between";
}
export declare const CardFooter: import("react").ForwardRefExoticComponent<
	CardFooterProps & import("react").RefAttributes<HTMLDivElement>
>;
//# sourceMappingURL=Card.d.ts.map
