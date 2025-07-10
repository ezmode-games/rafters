import type { StoryObj } from '@storybook/react-vite';
/**
 * Properties shape behavior and interaction patterns.
 * Each property serves the interface's functional requirements.
 */
declare const meta: {
    title: string;
    component: import("react").ForwardRefExoticComponent<import("../../../components").ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
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
 * Compact Interfaces
 *
 * Small buttons fit naturally in dense layouts and toolbars.
 * They maintain functionality while conserving space.
 */
export declare const Small: Story;
/**
 * Balanced Presence
 *
 * Medium buttons provide the optimal balance of accessibility and space efficiency.
 * This is the default size for most interface contexts.
 */
export declare const Medium: Story;
/**
 * Prominent Actions
 *
 * Large buttons command attention and improve accessibility.
 * They excel in mobile interfaces and call-to-action contexts.
 */
export declare const Large: Story;
/**
 * Unavailable State
 *
 * Disabled buttons maintain layout while preventing interaction.
 * They communicate temporary unavailability clearly.
 */
export declare const Disabled: Story;
/**
 * Interactive Feedback
 *
 * Hover and focus states provide essential feedback for user interactions.
 * They confirm responsiveness and guide interaction patterns.
 */
export declare const InteractiveStates: Story;
/**
 * Composition Flexibility
 *
 * The asChild property enables composition patterns with Radix Slot.
 * This allows buttons to wrap other elements while maintaining semantics.
 */
export declare const AsChild: Story;
/**
 * Size Comparison
 *
 * Understanding the scale relationships helps choose appropriate sizes
 * for different interface contexts and user needs.
 */
export declare const SizeComparison: Story;
//# sourceMappingURL=ButtonProperties.stories.d.ts.map