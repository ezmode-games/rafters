import type { StoryObj } from "@storybook/react-vite";
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
 * Foundation Accessibility
 *
 * Tabs implement comprehensive keyboard navigation and screen reader support.
 * Enhanced touch targets accommodate users with different motor abilities.
 */
export declare const FoundationAccessibility: Story;
/**
 * Screen Reader Optimization
 *
 * Semantic markup and ARIA attributes create clear, navigable experiences
 * for screen reader users through proper role and state communication.
 */
export declare const ScreenReaderOptimization: Story;
//# sourceMappingURL=TabsAccessibility.stories.d.ts.map
