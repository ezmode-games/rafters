import type { StoryObj } from "@storybook/react-vite";
declare const meta: {
	title: string;
	component: import("react").FC<import("@radix-ui/react-select").SelectProps>;
	parameters: {
		layout: string;
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
 * Standard Selection
 *
 * The default select provides balanced visual weight for most interface contexts.
 * Clean presentation focuses attention on available choices.
 */
export declare const Default: Story;
/**
 * Enhanced Touch Interface
 *
 * Large variant improves motor accessibility with enhanced touch targets.
 * Better usability for mobile interfaces and users with motor difficulties.
 */
export declare const Large: Story;
/**
 * Choice Architecture
 *
 * Item count display helps users understand the scope of available options.
 * Cognitive load reduction through clear expectation setting.
 */
export declare const WithCount: Story;
/**
 * Progressive Disclosure
 *
 * Search capability for managing large option sets effectively.
 * Reduces cognitive burden when dealing with numerous choices.
 */
export declare const Searchable: Story;
/**
 * Validation States
 *
 * Visual feedback for different validation states and user input scenarios.
 * Clear communication through semantic styling.
 */
export declare const ValidationStates: Story;
//# sourceMappingURL=SelectVariants.stories.d.ts.map
