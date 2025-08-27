import type { StoryObj } from "@storybook/react-vite";
declare const meta: {
	title: string;
	component: import("react").ForwardRefExoticComponent<
		import("../../../components").ButtonProps &
			import("react").RefAttributes<HTMLButtonElement>
	>;
	parameters: {
		layout: string;
	};
	tags: string[];
	args: {
		onClick: import("storybook/internal/test").Mock<(...args: any[]) => any>;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * The Primary Action
 *
 * The primary button commands attention and guides users toward the most important action.
 * Use sparingly—only one primary action should be visible per context.
 */
export declare const Primary: Story;
/**
 * Supporting Actions
 *
 * Secondary buttons provide clear alternatives without competing with primary actions.
 * They maintain importance while respecting visual hierarchy.
 */
export declare const Secondary: Story;
/**
 * Deliberate Friction
 *
 * Destructive actions require intentional consideration.
 * The visual treatment creates pause before irreversible actions.
 */
export declare const Destructive: Story;
/**
 * Defined Boundaries
 *
 * Outline buttons establish clear action areas while maintaining visual lightness.
 * They provide structure without overwhelming the interface.
 */
export declare const Outline: Story;
/**
 * Subtle Presence
 *
 * Ghost buttons blend naturally while remaining discoverable.
 * They provide functionality without disrupting visual flow.
 */
export declare const Ghost: Story;
/**
 * Variant Comparison
 *
 * Understanding the hierarchy and relationship between variants helps create
 * interfaces that guide users naturally toward their goals.
 */
export declare const VariantComparison: Story;
//# sourceMappingURL=ButtonVariants.stories.d.ts.map
