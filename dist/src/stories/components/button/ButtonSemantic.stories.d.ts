import type { StoryObj } from "@storybook/react-vite";
/**
 * Semantic variants communicate meaning through color and context.
 * They provide immediate understanding of action consequences.
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
 * Positive Outcomes
 *
 * Success buttons celebrate completion and positive actions.
 * They confirm when things go well and encourage desired behaviors.
 */
export declare const Success: Story;
/**
 * Important Cautions
 *
 * Warning buttons signal actions that require careful consideration.
 * They create awareness without blocking progress.
 */
export declare const Warning: Story;
/**
 * Neutral Information
 *
 * Info buttons provide helpful context without urgency.
 * They guide users toward additional information or optional actions.
 */
export declare const Info: Story;
/**
 * Critical Actions
 *
 * Destructive semantic buttons emphasize permanent consequences.
 * They create deliberate friction for actions that cannot be undone.
 */
export declare const DestructiveSemantic: Story;
/**
 * Semantic Context Examples
 *
 * Understanding how semantic variants work together helps create
 * interfaces that communicate meaning clearly and consistently.
 */
export declare const SemanticContexts: Story;
/**
 * Semantic Comparison
 *
 * Side-by-side comparison helps understand the semantic hierarchy
 * and appropriate usage patterns for each variant.
 */
export declare const SemanticComparison: Story;
//# sourceMappingURL=ButtonSemantic.stories.d.ts.map
