import type { StoryObj } from "@storybook/react-vite";
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
 * Foundation Principles
 *
 * Accessible selects work for everyone, not just assistive technology users.
 * They provide clear context, proper semantics, and predictable behavior.
 */
export declare const AccessibilityBasics: Story;
/**
 * Screen Reader Support
 *
 * Proper ARIA attributes and semantic structure support assistive technology.
 * These patterns enhance understanding for all users.
 */
export declare const ScreenReaderSupport: Story;
/**
 * Error States
 *
 * Clear error communication helps users understand and resolve issues.
 * Visual and semantic indicators work together.
 */
export declare const ErrorStates: Story;
//# sourceMappingURL=SelectAccessibility.stories.d.ts.map
