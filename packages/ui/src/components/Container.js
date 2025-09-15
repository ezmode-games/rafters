import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Layout container component for content width control and semantic structure
 *
 * @registry-name container
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Container.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 0/10 - Invisible structure that reduces visual complexity
 * @attention-economics Neutral structural element: Controls content width and breathing room without competing for attention
 * @trust-building Predictable boundaries and consistent spacing patterns
 * @accessibility Semantic HTML elements with proper landmark roles for screen readers
 * @semantic-meaning Content width control and semantic structure: main=primary content, section=grouped content, article=standalone content
 *
 * @usage-patterns
 * DO: Use padding prop for internal breathing room
 * DO: Control content boundaries with max-w-* classes
 * DO: Apply semantic structure with as="main|section|article"
 * DO: Maintain predictable component boundaries
 * NEVER: Use margins for content spacing (use padding instead)
 * NEVER: Unnecessarily nest containers or use fixed widths
 *
 * @design-guides
 * - Negative Space: https://rafters.realhandy.tech/docs/llm/negative-space
 * - Typography Intelligence: https://rafters.realhandy.tech/docs/llm/typography-intelligence
 * - Progressive Enhancement: https://rafters.realhandy.tech/docs/llm/progressive-enhancement
 *
 * @dependencies none
 *
 * @example
 * ```tsx
 * // Basic container with semantic structure
 * <Container as="main" padding="comfortable">
 *   Main page content
 * </Container>
 *
 * // Article container with prose styling
 * <Container as="article" variant="prose">
 *   Long form content with optimal reading width
 * </Container>
 * ```
 */
import { cn } from '../lib/utils';
import './article-prose.css';
/**
 * Container component with layout intelligence
 *
 * Provides responsive layout foundation using design system tokens:
 * - Uses design system container utilities (container-reading, container-golden)
 * - Phi-based spacing following golden ratio principles
 * - Semantic HTML support for accessibility
 * - Builds on existing Tailwind utilities and design tokens
 */
export function Container({ size, padding, columns, aspectRatio, boxSizing, overflow, overflowX, overflowY, overscrollBehavior, overscrollBehaviorX, overscrollBehaviorY, zIndex, containerQuery, containerType = 'inline-size', as = 'div', className, children, ref, ...props }) {
    // Polymorphic component - render as specified element
    const Component = as;
    // Semantic defaults based on HTML element type
    const getSemanticDefaults = (element) => {
        switch (element) {
            case 'main':
                return {
                    size: size ?? 'full', // Main content takes full width
                    padding: padding ?? '8', // Comfortable breathing room
                    overflow: overflow ?? 'auto', // Handle long content gracefully
                    boxSizing: boxSizing ?? 'border-box',
                    zIndex: zIndex ?? 'base', // Standard document flow
                    containerQuery: containerQuery ?? true, // Enable container queries for responsive children
                    containerType: containerType ?? 'inline-size',
                };
            case 'article':
                return {
                    size: size ?? '4xl', // Optimal reading width ~65 characters
                    padding: padding ?? '6', // Article breathing room
                    overflow: overflow ?? 'visible', // Let content flow naturally
                    boxSizing: boxSizing ?? 'border-box',
                    zIndex: zIndex ?? 'base', // Standard document flow
                    articleProse: true, // Enable automatic prose styling
                    containerQuery: containerQuery ?? true, // Enable container queries for responsive children
                    containerType: containerType ?? 'inline-size',
                };
            case 'section':
                return {
                    size: size ?? '5xl', // Section container width
                    padding: padding ?? '4', // Moderate section spacing
                    overflow: overflow ?? 'visible', // Sections don't typically scroll
                    boxSizing: boxSizing ?? 'border-box',
                    zIndex: zIndex ?? 'base', // Standard document flow
                    containerQuery: containerQuery ?? true, // Enable container queries for responsive children
                    containerType: containerType ?? 'inline-size',
                };
            default: // div
                return {
                    size: size ?? '4xl', // Generic container default
                    padding: padding ?? '4', // Standard padding
                    overflow: overflow, // No overflow default for divs
                    boxSizing: boxSizing ?? 'border-box',
                    zIndex: zIndex, // No z-index default for divs
                    containerQuery: containerQuery ?? true, // Enable container queries for responsive children
                    containerType: containerType ?? 'inline-size',
                };
        }
    };
    const defaults = getSemanticDefaults(as);
    // Container sizes using standard Tailwind max-width utilities
    const sizeVariants = {
        sm: 'max-w-sm mx-auto', // 24rem
        md: 'max-w-md mx-auto', // 28rem
        lg: 'max-w-lg mx-auto', // 32rem
        xl: 'max-w-xl mx-auto', // 36rem
        '2xl': 'max-w-2xl mx-auto', // 42rem
        '3xl': 'max-w-3xl mx-auto', // 48rem
        '4xl': 'max-w-4xl mx-auto', // 56rem
        '5xl': 'max-w-5xl mx-auto', // 64rem
        '6xl': 'max-w-6xl mx-auto', // 72rem
        '7xl': 'max-w-7xl mx-auto', // 80rem
        full: 'w-full', // 100%
    };
    // Spacing variants using Tailwind native spacing tokens from design system
    const paddingVariants = {
        '0': 'p-0', // --spacing-0
        px: 'p-px', // --spacing-px
        '0.5': 'p-0.5', // --spacing-0.5
        '1': 'p-1', // --spacing-1
        '1.5': 'p-1.5', // --spacing-1.5
        '2': 'p-2', // --spacing-2
        '2.5': 'p-2.5', // --spacing-2.5
        '3': 'p-3', // --spacing-3
        '3.5': 'p-3.5', // --spacing-3.5
        '4': 'p-4', // --spacing-4 (default)
        '5': 'p-5', // --spacing-5
        '6': 'p-6', // --spacing-6
        '8': 'p-8', // --spacing-8
        '10': 'p-10', // --spacing-10
        '12': 'p-12', // --spacing-12
        '16': 'p-16', // --spacing-16
        '20': 'p-20', // --spacing-20
        '24': 'p-24', // --spacing-24
        '32': 'p-32', // --spacing-32
        '40': 'p-40', // --spacing-40
        '48': 'p-48', // --spacing-48
        '56': 'p-56', // --spacing-56
        '64': 'p-64', // --spacing-64
    };
    // Column variants using Tailwind columns utilities
    const columnVariants = {
        auto: 'columns-auto',
        '1': 'columns-1',
        '2': 'columns-2',
        '3': 'columns-3',
        '4': 'columns-4',
        '5': 'columns-5',
        '6': 'columns-6',
        '7': 'columns-7',
        '8': 'columns-8',
        '9': 'columns-9',
        '10': 'columns-10',
        '11': 'columns-11',
        '12': 'columns-12',
        '3xs': 'columns-3xs',
        '2xs': 'columns-2xs',
        xs: 'columns-xs',
        sm: 'columns-sm',
        md: 'columns-md',
        lg: 'columns-lg',
        xl: 'columns-xl',
        '2xl': 'columns-2xl',
        '3xl': 'columns-3xl',
        '4xl': 'columns-4xl',
        '5xl': 'columns-5xl',
        '6xl': 'columns-6xl',
        '7xl': 'columns-7xl',
    };
    // Aspect ratio variants using Tailwind utilities and golden ratio
    const aspectRatioVariants = {
        auto: 'aspect-auto',
        square: 'aspect-square',
        video: 'aspect-video',
        '4/3': 'aspect-[4/3]',
        '3/2': 'aspect-[3/2]',
        '16/9': 'aspect-[16/9]',
        '21/9': 'aspect-[21/9]',
        phi: 'aspect-[1.618/1]', // Golden ratio: φ:1 (landscape)
        'phi-inverse': 'aspect-[1/1.618]', // Golden ratio inverse: 1:φ (portrait)
    };
    // Box-sizing variants for predictable layout behavior
    const boxSizingVariants = {
        'border-box': 'box-border', // padding/border included in width/height
        'content-box': 'box-content', // padding/border added to width/height
    };
    // Overflow variants for content handling
    const overflowVariants = {
        visible: 'overflow-visible',
        hidden: 'overflow-hidden',
        clip: 'overflow-clip',
        scroll: 'overflow-scroll',
        auto: 'overflow-auto',
    };
    const overflowXVariants = {
        visible: 'overflow-x-visible',
        hidden: 'overflow-x-hidden',
        clip: 'overflow-x-clip',
        scroll: 'overflow-x-scroll',
        auto: 'overflow-x-auto',
    };
    const overflowYVariants = {
        visible: 'overflow-y-visible',
        hidden: 'overflow-y-hidden',
        clip: 'overflow-y-clip',
        scroll: 'overflow-y-scroll',
        auto: 'overflow-y-auto',
    };
    // Overscroll behavior variants for scroll boundary handling
    const overscrollBehaviorVariants = {
        auto: 'overscroll-auto',
        contain: 'overscroll-contain',
        none: 'overscroll-none',
    };
    const overscrollBehaviorXVariants = {
        auto: 'overscroll-x-auto',
        contain: 'overscroll-x-contain',
        none: 'overscroll-x-none',
    };
    const overscrollBehaviorYVariants = {
        auto: 'overscroll-y-auto',
        contain: 'overscroll-y-contain',
        none: 'overscroll-y-none',
    };
    // Z-index variants with semantic AI-friendly stacking layers
    const zIndexVariants = {
        auto: 'z-auto', // Default stacking context
        behind: 'z-[-1]', // Behind normal flow
        base: 'z-0', // Base layer
        raised: 'z-10', // Slightly elevated (dropdowns, tooltips)
        overlay: 'z-20', // Overlays, popovers
        modal: 'z-30', // Modal dialogs
        notification: 'z-40', // Toasts, notifications
        menu: 'z-50', // Navigation menus, mobile menus
        tooltip: 'z-[60]', // Tooltips above everything
        top: 'z-[9999]', // Emergency top layer
    };
    // Container query variants for Tailwind v4 native support
    const containerQueryVariants = {
        'inline-size': '@container/inline-size', // Query based on width
        'block-size': '@container/block-size', // Query based on height
        size: '@container', // Query based on both dimensions (default)
        normal: '@container/normal', // Normal container context
    };
    return (_jsx(Component, { ref: ref, className: cn(
        // Box-sizing for predictable layout behavior (semantic defaults applied)
        boxSizingVariants[defaults.boxSizing], 
        // Container size using Tailwind max-width utilities (semantic defaults)
        sizeVariants[defaults.size], 
        // Tailwind native spacing using design system --spacing-* tokens (semantic defaults)
        paddingVariants[defaults.padding], 
        // Multi-column layout if specified
        columns && columnVariants[columns], 
        // Aspect ratio if specified
        aspectRatio && aspectRatioVariants[aspectRatio], 
        // Overflow behavior (semantic defaults applied)
        defaults.overflow && overflowVariants[defaults.overflow], overflowX && overflowXVariants[overflowX], overflowY && overflowYVariants[overflowY], 
        // Overscroll behavior
        overscrollBehavior && overscrollBehaviorVariants[overscrollBehavior], overscrollBehaviorX && overscrollBehaviorXVariants[overscrollBehaviorX], overscrollBehaviorY && overscrollBehaviorYVariants[overscrollBehaviorY], 
        // Z-index stacking layer (semantic defaults applied)
        defaults.zIndex && zIndexVariants[defaults.zIndex], 
        // Container query context (Tailwind v4 native support)
        containerQuery && containerQueryVariants[containerType], 
        // Article prose styling using design system tokens
        defaults.articleProse && 'article-prose', 
        // Custom classes
        className), ...props, children: children }));
}
//# sourceMappingURL=Container.js.map