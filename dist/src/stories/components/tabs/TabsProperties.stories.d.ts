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
	tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Default Configuration
 *
 * Standard tabs with optimal cognitive load and clear visual hierarchy.
 * Default configuration balances functionality with simplicity.
 */
export declare const Default: Story;
/**
 * Cognitive Load Variations
 *
 * Different configurations optimize for various cognitive complexity levels.
 * Minimal load for simple choices, standard for balanced use, complex for power users.
 */
export declare const CognitiveLoadLevels: Story;
/**
 * Orientation Options
 *
 * Tabs support both horizontal and vertical orientations for different
 * layout contexts and content organization patterns.
 */
export declare const Orientation: Story;
/**
 * Disabled States
 *
 * Disabled tabs maintain layout structure while clearly communicating
 * unavailability through visual and semantic indicators.
 */
export declare const DisabledStates: Story;
/**
 * Wayfinding Enhancement
 *
 * Wayfinding features help users understand their location in complex
 * navigation hierarchies through contextual indicators.
 */
export declare const WayfindingFeatures: Story;
//# sourceMappingURL=TabsProperties.stories.d.ts.map
