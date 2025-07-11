import type { StoryObj } from '@storybook/react-vite';
declare const meta: {
    title: string;
    component: import("react").ForwardRefExoticComponent<import("../../../components/Tabs").TabsProps & import("react").RefAttributes<HTMLDivElement>>;
    parameters: {
        layout: string;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Standard Navigation
 *
 * Clean, semantic tabs for primary navigation and content organization.
 * Default styling balances functionality with visual clarity.
 */
export declare const StandardNavigation: Story;
/**
 * Compact Organization
 *
 * Space-efficient tabs for dense interfaces and secondary navigation.
 * Maintains accessibility while optimizing for information density.
 */
export declare const CompactOrganization: Story;
/**
 * Hierarchical Navigation
 *
 * Multi-level tabs for complex information architectures and nested content.
 * Progressive disclosure manages cognitive load while preserving depth access.
 */
export declare const HierarchicalNavigation: Story;
/**
 * State Indicators
 *
 * Visual and semantic state communication for dynamic content and workflows.
 * Context indicators enhance navigation without overwhelming users.
 */
export declare const StateIndicators: Story;
//# sourceMappingURL=TabsVariants.stories.d.ts.map