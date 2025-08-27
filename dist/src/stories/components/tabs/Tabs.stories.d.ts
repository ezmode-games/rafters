import type { StoryObj } from "@storybook/react-vite";
/**
 * Tabs organize content sections while respecting cognitive limits and enabling efficient
 * navigation. They provide clear visual hierarchy and semantic structure that builds
 * accurate mental models without overwhelming users with too many simultaneous choices.
 */
declare const meta: {
	title: string;
	component: import("react").ForwardRefExoticComponent<
		import("../../../components/Tabs").TabsProps &
			import("react").RefAttributes<HTMLDivElement>
	>;
	parameters: {
		layout: string;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Guidelines
 *
 * Limit to 5-7 tabs. Use semantic labels. Group logically.
 */
export declare const UsageGuidelines: Story;
/**
 * Overview
 *
 * Basic three-tab structure for content organization.
 */
export declare const Overview: Story;
/**
 * Content Sections
 *
 * Four-tab organization for related functionality.
 */
export declare const ContentSections: Story;
/**
 * Hierarchical
 *
 * Nested tabs for complex information architecture.
 */
export declare const Hierarchical: Story;
/**
 * State Management
 *
 * Disabled states and conditional content.
 */
export declare const WithDisabledTabs: Story;
//# sourceMappingURL=Tabs.stories.d.ts.map
