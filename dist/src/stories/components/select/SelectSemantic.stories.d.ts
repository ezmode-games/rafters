import type { StoryObj } from "@storybook/react-vite";
/**
 * Semantic meaning creates understanding through context and purpose.
 * Each selection serves specific interaction patterns and user goals.
 */
declare const meta: {
	title: string;
	component: import("react").FC<import("@radix-ui/react-select").SelectProps>;
	parameters: {
		layout: string;
		docs: {
			description: {
				component: string;
			};
		};
	};
	tags: string[];
	args: {
		onValueChange: import("storybook/internal/test").Mock<
			(...args: any[]) => any
		>;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Status Selection
 *
 * Communicates state changes and workflow progression.
 * Clear options help users understand available transitions.
 */
export declare const StatusSelection: Story;
/**
 * Category Organization
 *
 * Hierarchical organization helps users navigate complex choices.
 * Clear categorization reduces cognitive load in selection.
 */
export declare const CategorySelection: Story;
/**
 * Priority and Urgency
 *
 * Priority selections communicate importance and urgency levels.
 * Clear hierarchy helps users make informed decisions.
 */
export declare const PrioritySelection: Story;
/**
 * Settings and Preferences
 *
 * Configuration selections for user preferences and system settings.
 * Clear options help users understand the impact of their choices.
 */
export declare const SettingsSelection: Story;
//# sourceMappingURL=SelectSemantic.stories.d.ts.map
