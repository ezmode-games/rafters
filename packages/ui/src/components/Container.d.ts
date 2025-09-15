import './article-prose.css';
/**
 * Container component props with layout intelligence
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Container size using standard Tailwind max-width utilities
     * sm: max-w-sm (24rem)
     * md: max-w-md (28rem)
     * lg: max-w-lg (32rem)
     * xl: max-w-xl (36rem)
     * 2xl: max-w-2xl (42rem)
     * 3xl: max-w-3xl (48rem)
     * 4xl: max-w-4xl (56rem)
     * 5xl: max-w-5xl (64rem)
     * 6xl: max-w-6xl (72rem)
     * 7xl: max-w-7xl (80rem)
     * full: w-full (100%)
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    /**
     * Spacing using Tailwind native spacing tokens from design system
     * Maps to --spacing-* tokens that integrate with Tailwind's spacing scale
     */
    padding?: '0' | 'px' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64';
    /**
     * CSS Multi-column layout using Tailwind columns utilities
     * Automatically flows content into multiple columns for better readability
     */
    columns?: 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
    /**
     * Aspect ratio using Tailwind utilities and golden ratio
     * Standard ratios: square, video, etc.
     * Golden ratio: phi (1.618:1) and phi-inverse (1:1.618) for harmonious proportions
     */
    aspectRatio?: 'auto' | 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9' | 'phi' | 'phi-inverse';
    /**
     * Box-sizing behavior for predictable layouts
     * border-box: padding and border included in element's total width/height (recommended default)
     * content-box: padding and border added to element's width/height
     */
    boxSizing?: 'border-box' | 'content-box';
    /**
     * Overflow behavior for content that exceeds container bounds
     * Controls how content is handled when it doesn't fit
     */
    overflow?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';
    /**
     * Overflow behavior for x-axis (horizontal)
     */
    overflowX?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';
    /**
     * Overflow behavior for y-axis (vertical)
     */
    overflowY?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';
    /**
     * Overscroll behavior - what happens when user scrolls past boundaries
     * auto: default browser behavior (bounce, glow effects)
     * contain: prevent scroll chaining to parent elements
     * none: disable overscroll effects entirely
     */
    overscrollBehavior?: 'auto' | 'contain' | 'none';
    /**
     * Overscroll behavior for x-axis (horizontal)
     */
    overscrollBehaviorX?: 'auto' | 'contain' | 'none';
    /**
     * Overscroll behavior for y-axis (vertical)
     */
    overscrollBehaviorY?: 'auto' | 'contain' | 'none';
    /**
     * Z-index with semantic AI-friendly values for predictable stacking
     * auto: default stacking context
     * behind: z-[-1] - behind normal flow
     * base: z-0 - base layer
     * raised: z-10 - slightly elevated (dropdowns, tooltips)
     * overlay: z-20 - overlays, popovers
     * modal: z-30 - modal dialogs
     * notification: z-40 - toasts, notifications
     * menu: z-50 - navigation menus, mobile menus
     * tooltip: z-[60] - tooltips that need to be above everything
     * top: z-[9999] - absolutely must be on top
     */
    zIndex?: 'auto' | 'behind' | 'base' | 'raised' | 'overlay' | 'modal' | 'notification' | 'menu' | 'tooltip' | 'top';
    /**
     * Container queries - native Tailwind v4 support
     * Makes this element a container query context for responsive child styling
     * Child elements can use @sm:, @md:, @lg: variants based on THIS container's size
     * containerType controls which dimensions to query: inline-size (width), block-size (height), or both
     */
    containerQuery?: boolean;
    containerType?: 'inline-size' | 'block-size' | 'size' | 'normal';
    /**
     * Semantic HTML element type for accessibility excellence
     * div: generic container (default)
     * main: primary content landmark
     * section: thematic grouping
     * article: standalone content
     */
    as?: 'div' | 'main' | 'section' | 'article';
    ref?: React.Ref<RefType>;
}
/**
 * Get the ref type for a given element
 */
type RefType = HTMLDivElement | HTMLElement;
/**
 * Container component with layout intelligence
 *
 * Provides responsive layout foundation using design system tokens:
 * - Uses design system container utilities (container-reading, container-golden)
 * - Phi-based spacing following golden ratio principles
 * - Semantic HTML support for accessibility
 * - Builds on existing Tailwind utilities and design tokens
 */
export declare function Container({ size, padding, columns, aspectRatio, boxSizing, overflow, overflowX, overflowY, overscrollBehavior, overscrollBehaviorX, overscrollBehaviorY, zIndex, containerQuery, containerType, as, className, children, ref, ...props }: ContainerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Container.d.ts.map