import type { StoryObj } from '@storybook/react-vite';
/**
 * Design tokens are the core building blocks of consistent, scalable design systems.
 * They encapsulate design decisions into reusable values that maintain coherence
 * across platforms, themes, and application states.
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
 * Design Token System Overview
 *
 * Design tokens bridge the gap between design and development, creating a shared
 * vocabulary for design decisions. Our token system enables theming, consistency,
 * and maintainability across all digital experiences.
 */
export declare const Overview: Story;
/**
 * Core Color Tokens
 *
 * Core tokens define the fundamental color values using OKLCH color space.
 * These tokens serve as the foundation for all semantic and component tokens.
 */
export declare const CoreTokens: Story;
/**
 * Semantic Tokens
 *
 * Semantic tokens convey meaning and purpose rather than appearance.
 * They provide consistent communication patterns across all interface states.
 */
export declare const SemanticTokens: Story;
/**
 * Component Tokens
 *
 * Component-specific tokens provide specialized styling for individual interface
 * elements while maintaining systematic relationships to core and semantic tokens.
 */
export declare const ComponentTokens: Story;
/**
 * Implementation Guide
 *
 * Practical guidelines for implementing design tokens in development workflows,
 * including naming conventions, theme management, and customization approaches.
 */
export declare const ImplementationGuide: Story;
//# sourceMappingURL=Tokens.stories.d.ts.map