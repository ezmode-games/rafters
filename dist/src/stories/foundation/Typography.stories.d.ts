import type { StoryObj } from "@storybook/react-vite";
/**
 * Typography guidelines establish clear hierarchies and organize information
 * based on importance. When applied well, typography enables content to be
 * communicated clearly, effectively, and efficiently.
 */
declare const meta: {
	title: string;
	parameters: {
		layout: string;
	};
};
export default meta;
type Story = StoryObj<typeof meta>;
/**
 * Typography System Overview
 *
 * Rafters uses a systematic approach to typography that creates intuitive
 * hierarchies and maintains consistency across all digital experiences.
 * Our semantic typography system replaces verbose utility classes with
 * meaningful tokens based on golden ratio proportions.
 */
export declare const Overview: Story;
/**
 * Semantic Typography System
 *
 * Our golden ratio-based typography system with semantic heading classes
 * replaces verbose utility markup with meaningful, consistent tokens.
 * Font families are configurable via the onboarding wizard.
 */
export declare const SemanticTypography: Story;
/**
 * Body Typography Scale
 *
 * Golden ratio-based body text with semantic classes for consistent
 * content hierarchy and improved maintainability.
 */
export declare const BodyTypography: Story;
/**
 * Responsive Typography
 *
 * Golden ratio-based responsive scaling ensures optimal readability
 * across all devices using CSS custom properties and fluid scaling.
 */
export declare const ResponsiveTypography: Story;
/**
 * Typography Implementation Guide
 *
 * Best practices for implementing the semantic typography system
 * with accessibility standards and performance considerations.
 */
export declare const ImplementationGuide: Story;
//# sourceMappingURL=Typography.stories.d.ts.map
