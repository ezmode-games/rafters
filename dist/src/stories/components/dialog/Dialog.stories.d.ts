import type { StoryObj } from '@storybook/react-vite';
/**
 * Critical moments require trust. The dialog is where user confidence meets consequential decisions.
 * Our dialog system is built on progressive disclosure, clear escape hatches, and trust-building
 * patterns that reduce anxiety during important interactions.
 */
declare const meta: {
    title: string;
    component: import("react").FC<import("@radix-ui/react-dialog").DialogProps>;
    tags: string[];
    parameters: {
        layout: string;
        docs: {
            description: {
                component: string;
            };
        };
    };
    argTypes: {
        trustLevel: {
            control: string;
            options: string[];
            description: string;
        };
        destructive: {
            control: string;
            description: string;
        };
        size: {
            control: string;
            options: string[];
            description: string;
        };
        cognitiveComplexity: {
            control: string;
            options: string[];
            description: string;
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Basic confirmation dialog with trust-building patterns.
 * Uses medium trust level with clear action hierarchy.
 */
export declare const Basic: Story;
/**
 * High-trust dialog for sensitive operations.
 * Enhanced visual hierarchy and clear consequence explanation.
 */
export declare const HighTrust: Story;
/**
 * Critical trust dialog for destructive actions.
 * Maximum visual hierarchy and consequence explanation.
 */
export declare const Critical: Story;
/**
 * Size variants demonstrate content hierarchy and cognitive load management.
 * Different sizes handle different amounts of information appropriately.
 */
export declare const Sizes: Story;
//# sourceMappingURL=Dialog.stories.d.ts.map