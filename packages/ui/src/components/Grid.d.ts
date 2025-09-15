/**
 * Responsive value type for breakpoint-aware properties
 */
type ResponsiveValue<T> = T | {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
};
/**
 * Bento semantic patterns for content-driven asymmetric layouts
 * Each pattern encodes specific UX intelligence for AI decision-making
 */
type BentoPattern = 'editorial' | 'dashboard' | 'feature-showcase' | 'portfolio';
/**
 * Grid preset types with embedded design intelligence
 */
type GridPreset = 'linear' | 'golden' | 'bento' | 'custom';
/**
 * Content priority for bento layouts
 * Drives both visual hierarchy and accessibility structure
 */
type ContentPriority = 'primary' | 'secondary' | 'tertiary';
/**
 * Grid component props with layout intelligence
 */
export interface GridProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Intelligent preset system with embedded UX reasoning
     * - linear: Democratic attention, predictable scanning (cognitive load: 2/10)
     * - golden: Hierarchical attention, editorial flow (cognitive load: 4/10)
     * - bento: Complex attention, content showcases (cognitive load: 6/10)
     * - custom: User-defined layouts (cognitive load: variable)
     */
    preset?: GridPreset;
    /**
     * Semantic patterns for bento layouts
     * Only applies when preset="bento", drives layout intelligence
     */
    bentoPattern?: BentoPattern;
    /**
     * Column configuration - responsive or fixed
     * Overrides preset behavior when using custom preset
     */
    columns?: ResponsiveValue<number | 'auto-fit' | 'auto-fill'>;
    /**
     * Auto-sizing intelligence using design tokens
     * - 'sm': 200px minimum (compact cards)
     * - 'md': 280px minimum (comfortable content)
     * - 'lg': 360px minimum (rich content)
     * - Custom: pixel value for specific requirements
     */
    autoFit?: 'sm' | 'md' | 'lg' | string;
    /**
     * Gap spacing using existing design system tokens
     * Maps to Tailwind gap utilities and semantic spacing
     */
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'comfortable' | 'generous';
    /**
     * Cognitive load management (Miller's Law 7±2)
     * - number: Explicit limit
     * - 'auto': Viewport-appropriate defaults (2/4/6/8)
     */
    maxItems?: number | 'auto';
    /**
     * Accessibility configuration
     * - presentation: Layout-only grid (default)
     * - grid: Interactive grid with keyboard navigation
     * - none: No semantic role
     */
    role?: 'presentation' | 'grid' | 'none';
    /**
     * Accessible label for interactive grids
     * Required when role="grid"
     */
    ariaLabel?: string;
    /**
     * Label reference for interactive grids
     * Alternative to ariaLabel when using external heading
     */
    ariaLabelledBy?: string;
    /**
     * Semantic HTML element type
     * - div: Generic container (default)
     * - section: Thematic grouping
     * - main: Primary content landmark
     * - article: Standalone content
     */
    as?: 'div' | 'section' | 'main' | 'article';
    /**
     * Focus change handler for interactive grids
     * Enables keyboard navigation management
     */
    onFocusChange?: (position: {
        row: number;
        col: number;
    }) => void;
    ref?: React.Ref<HTMLElement>;
    children: React.ReactNode;
}
/**
 * GridItem component props with priority-based intelligence
 */
export interface GridItemProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Column span using standard Tailwind utilities
     * Can be responsive object for breakpoint-specific spanning
     */
    colSpan?: ResponsiveValue<number>;
    /**
     * Row span using standard Tailwind utilities
     * Can be responsive object for breakpoint-specific spanning
     */
    rowSpan?: ResponsiveValue<number>;
    /**
     * Content priority for bento layouts
     * Automatically calculates spanning based on priority level
     */
    priority?: ContentPriority;
    /**
     * Accessibility role for grid items
     * - gridcell: Interactive grid cell (requires parent role="grid")
     * - none: No semantic role (default for presentation grids)
     */
    role?: 'gridcell' | 'none';
    /**
     * Accessible label for grid cells
     * Helpful for complex content or interactive items
     */
    ariaLabel?: string;
    /**
     * Focus management for keyboard navigation
     * Only applies when parent grid has role="grid"
     */
    focusable?: boolean;
    /**
     * Semantic HTML element type
     * - div: Generic container (default)
     * - article: Standalone content
     * - section: Thematic grouping
     */
    as?: 'div' | 'article' | 'section';
    ref?: React.Ref<HTMLElement>;
    children: React.ReactNode;
}
/**
 * Grid Layout Intelligence Component
 *
 * Provides responsive grid layouts with embedded UX reasoning that AI agents
 * can understand and apply. Combines standard Tailwind utilities with
 * intelligent presets for systematic design decision-making.
 */
export declare function Grid({ preset, bentoPattern, columns, autoFit, gap, maxItems, role, ariaLabel, ariaLabelledBy, as, onFocusChange, className, children, ref, ...props }: GridProps): import("react/jsx-runtime").JSX.Element;
/**
 * GridItem companion component with priority-based intelligence
 *
 * Provides semantic grid items with automatic sizing based on content
 * priority and accessibility integration for screen readers.
 */
export declare function GridItem({ colSpan, rowSpan, priority, role, ariaLabel, focusable, as, className, children, ref, ...props }: GridItemProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Grid.d.ts.map