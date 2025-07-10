import type { StoryObj } from '@storybook/react-vite';
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
 * Comprehensive ARIA labeling and descriptions.
 * Screen readers get full context about dialog purpose and actions.
 */
export declare const AriaLabeling: Story;
/**
 * Keyboard navigation patterns and focus management.
 * Proper tab order, escape handling, and focus trapping.
 */
export declare const KeyboardNavigation: Story;
/**
 * Screen reader compatibility with proper semantic markup.
 * Live regions, role attributes, and descriptive content.
 */
export declare const ScreenReader: Story;
/**
 * Color contrast verification and visual accessibility.
 * Meets WCAG AAA standards with enhanced contrast ratios.
 */
export declare const ColorContrast: Story;
/**
 * Motor accessibility with enhanced touch targets.
 * 44px minimum touch targets and generous spacing.
 */
export declare const MotorAccessibility: Story;
//# sourceMappingURL=DialogAccessibility.stories.d.ts.map