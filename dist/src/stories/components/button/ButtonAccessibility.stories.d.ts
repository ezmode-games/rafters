import type { StoryObj } from "@storybook/react-vite";
/**
 * Accessibility is design quality, not compliance.
 * Every accessibility feature improves the experience for all users.
 */
declare const meta: {
	title: string;
	component: import("react").ForwardRefExoticComponent<
		import("../../../components").ButtonProps &
			import("react").RefAttributes<HTMLButtonElement>
	>;
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
		onClick: import("storybook/internal/test").Mock<(...args: any[]) => any>;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Foundation Principles
 *
 * Accessible buttons work for everyone, not just assistive technology users.
 * They provide clear context, proper semantics, and predictable behavior.
 */
export declare const AccessibilityBasics: Story;
/**
 * Natural Navigation
 *
 * Keyboard navigation should feel intuitive and predictable.
 * Focus management creates smooth, logical interaction flows.
 */
export declare const KeyboardNavigation: Story;
/**
 * Universal Design
 *
 * Color contrast and visual design serve functional purposes.
 * High contrast improves readability in all lighting conditions.
 */
export declare const ColorContrastDemo: Story;
/**
 * Screen Reader Optimization
 *
 * Screen readers need semantic structure and clear relationships.
 * Proper markup creates predictable, navigable experiences.
 */
export declare const ScreenReaderOptimization: Story;
//# sourceMappingURL=ButtonAccessibility.stories.d.ts.map
