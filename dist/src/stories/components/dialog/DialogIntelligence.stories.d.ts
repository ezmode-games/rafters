import type { StoryObj } from "@storybook/react-vite";
declare const meta: {
	title: string;
	component: import("react").FC<import("@radix-ui/react-dialog").DialogProps>;
	parameters: {
		layout: string;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Progressive confirmation for destructive actions.
 * Step-by-step confirmation reduces accidental destructive actions while
 * building user confidence through clear process understanding.
 */
export declare const ProgressiveConfirmation: Story;
/**
 * Attention hierarchy demonstration shows proper visual priority.
 * Primary action gets highest attention, secondary gets medium, escape gets low.
 */
export declare const AttentionHierarchy: Story;
/**
 * Trust-building patterns reduce user anxiety during critical decisions.
 * Clear explanations, escape hatches, and familiar confirmation flows.
 */
export declare const TrustBuilding: Story;
/**
 * Cognitive load optimization through clear information hierarchy.
 * Complex information is organized to reduce mental overhead.
 */
export declare const CognitiveLoad: Story;
//# sourceMappingURL=DialogIntelligence.stories.d.ts.map
