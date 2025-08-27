import type { StoryObj } from "@storybook/react-vite";
declare const meta: {
	title: string;
	component: import("react").ForwardRefExoticComponent<
		import("../../../components").LabelProps &
			import("react").RefAttributes<HTMLLabelElement>
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
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Semantic Hierarchy
 *
 * Labels communicate importance through visual weight and semantic meaning.
 * This reduces cognitive load by helping users prioritize their attention.
 */
export declare const SemanticHierarchy: Story;
/**
 * Form Guidance Intelligence
 *
 * Help text provides contextual guidance that reduces errors and builds confidence.
 * Smart validation states give immediate feedback.
 */
export declare const FormGuidance: Story;
/**
 * Context-Aware Labeling
 *
 * Different label contexts serve different purposes.
 * Each context has appropriate styling and behavior patterns.
 */
export declare const ContextAwareness: Story;
/**
 * Accessibility Excellence
 *
 * Labels provide comprehensive accessibility support through semantic markup,
 * proper ARIA attributes, and screen reader optimization.
 */
export declare const AccessibilityExcellence: Story;
//# sourceMappingURL=LabelIntelligence.stories.d.ts.map
