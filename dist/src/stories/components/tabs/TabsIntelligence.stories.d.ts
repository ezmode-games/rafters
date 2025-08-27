import type { StoryObj } from "@storybook/react-vite";
declare const meta: {
	title: string;
	component: import("react").ForwardRefExoticComponent<
		import("../../../components/Tabs").TabsProps &
			import("react").RefAttributes<HTMLDivElement>
	>;
	parameters: {
		layout: string;
		docs: {
			description: {
				component: string;
			};
		};
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Cognitive Load Optimization
 *
 * Miller's 7±2 rule prevents decision paralysis through smart tab counting.
 * Visual hierarchy creates scannable navigation patterns.
 */
export declare const CognitiveLoadOptimization: Story;
/**
 * Wayfinding Intelligence
 *
 * Clear navigation context prevents user confusion through semantic structure
 * and consistent visual patterns without visual decoration.
 */
export declare const WayfindingIntelligence: Story;
/**
 * Mental Model Building
 *
 * Hierarchical organization creates logical mental models through progressive
 * disclosure and consistent information architecture patterns.
 */
export declare const MentalModelBuilding: Story;
/**
 * Motor Accessibility Focus
 *
 * Enhanced touch targets and keyboard navigation reduce interaction barriers
 * for users with different motor abilities and interaction preferences.
 */
export declare const MotorAccessibilityFocus: Story;
/**
 * Progressive Disclosure Intelligence
 *
 * Strategic information reveal reduces initial cognitive load while maintaining
 * access to comprehensive functionality when needed.
 */
export declare const ProgressiveDisclosureIntelligence: Story;
/**
 * Contextual Relationship Intelligence
 *
 * Visual and semantic cues establish clear relationships between tabs and their content,
 * building user understanding of system structure and data relationships.
 */
export declare const ContextualRelationshipIntelligence: Story;
/**
 * Trust Building Intelligence
 *
 * Transparent state communication and reliable interaction patterns build user confidence
 * in system behavior and data integrity.
 */
export declare const TrustBuildingIntelligence: Story;
/**
 * Cognitive Efficiency Intelligence
 *
 * Optimized information architecture and interaction patterns reduce mental effort
 * required to complete tasks and find information.
 */
export declare const CognitiveEfficiencyIntelligence: Story;
//# sourceMappingURL=TabsIntelligence.stories.d.ts.map
