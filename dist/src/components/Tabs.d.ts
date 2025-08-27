import * as TabsPrimitive from "@radix-ui/react-tabs";
interface TabsProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
	cognitiveLoad?: "minimal" | "standard" | "complex";
	orientation?: "horizontal" | "vertical";
	wayfinding?: boolean;
}
declare const Tabs: import("react").ForwardRefExoticComponent<
	TabsProps & import("react").RefAttributes<HTMLDivElement>
>;
interface TabsListProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
	variant?: "default" | "pills" | "underline";
	density?: "compact" | "comfortable" | "spacious";
	showIndicator?: boolean;
}
declare const TabsList: import("react").ForwardRefExoticComponent<
	TabsListProps & import("react").RefAttributes<HTMLDivElement>
>;
interface TabsTriggerProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
	badge?: string | number;
	icon?: React.ReactNode;
	disabled?: boolean;
}
declare const TabsTrigger: import("react").ForwardRefExoticComponent<
	TabsTriggerProps & import("react").RefAttributes<HTMLButtonElement>
>;
interface TabsContentProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
	loading?: boolean;
	lazy?: boolean;
}
declare const TabsContent: import("react").ForwardRefExoticComponent<
	TabsContentProps & import("react").RefAttributes<HTMLDivElement>
>;
interface TabsBreadcrumbProps {
	activeTab: string;
	tabs: Array<{
		value: string;
		label: string;
	}>;
}
declare const TabsBreadcrumb: ({
	activeTab,
	tabs,
}: TabsBreadcrumbProps) => import("react/jsx-runtime").JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBreadcrumb };
export type { TabsProps };
//# sourceMappingURL=Tabs.d.ts.map
