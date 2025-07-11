import type { StoryObj } from '@storybook/react-vite';
/**
 * Properties shape behavior and interaction patterns.
 * Each property serves the interface's functional requirements.
 */
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
        onValueChange: import("storybook/internal/test").Mock<(...args: any[]) => any>;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Standard Size
 *
 * Default size provides balanced presence in most interface contexts.
 * Optimal for forms and standard selection scenarios.
 */
export declare const Default: Story;
/**
 * Enhanced Touch Targets
 *
 * Large size improves motor accessibility with enhanced touch targets.
 * Better usability for touch interfaces and users with motor difficulties.
 */
export declare const Large: Story;
/**
 * Choice Architecture
 *
 * Item count display helps users understand the scope of available choices.
 * Reduces cognitive load by setting clear expectations.
 */
export declare const WithItemCount: Story;
/**
 * Progressive Disclosure
 *
 * Search functionality for large option sets reduces cognitive burden.
 * Automatic search threshold helps manage complex choices.
 */
export declare const WithSearch: Story;
/**
 * Disabled State
 *
 * Disabled selects communicate unavailability while maintaining layout structure.
 * Clear visual indication prevents interaction attempts.
 */
export declare const Disabled: Story;
/**
 * Required Field
 *
 * Required state communicates necessity for form completion.
 * Clear indication helps users understand mandatory selections.
 */
export declare const Required: Story;
//# sourceMappingURL=SelectProperties.stories.d.ts.map