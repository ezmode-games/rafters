import type { StoryObj } from '@storybook/react-vite';
/**
 * Colors communicate meaning before words are read. Our color system prioritizes
 * accessibility and semantic clarity over decorative appeal. Every color choice
 * serves purpose, conveys hierarchy, and respects user intent.
 */
declare const meta: {
    title: string;
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
 * Color System Architecture
 *
 * Rafters uses a four-tier token system inspired by modern design systems.
 * Unlike traditional hex-based palettes, we use OKLCH color space for perceptual
 * uniformity and better dark mode transitions.
 */
export declare const Overview: Story;
/**
 * Core Foundation Tokens
 *
 * Background and foreground tokens establish the fundamental contrast relationships
 * that all other colors build upon. These never change semantic meaning across themes.
 */
export declare const CoreTokens: Story;
/**
 * Interactive Tokens
 *
 * Colors that respond to user actions. These tokens include state variations
 * for hover, focus, and active interactions while maintaining accessibility.
 */
export declare const InteractiveTokens: Story;
/**
 * Semantic State Tokens
 *
 * Colors that communicate meaning and context. These tokens carry semantic weight
 * and help users understand system state and required actions.
 */
export declare const SemanticTokens: Story;
/**
 * Usage Guidelines
 *
 * Principles and best practices for implementing the Rafters color system.
 * Understanding context and accessibility ensures consistent, inclusive experiences.
 */
export declare const UsageGuidelines: Story;
//# sourceMappingURL=Colors.stories.d.ts.map