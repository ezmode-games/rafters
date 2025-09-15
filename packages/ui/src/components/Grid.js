import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Intelligent layout grid with 4 semantic presets and embedded design reasoning for AI agents
 *
 * @registry-name grid
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Grid.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 4/10 - Layout container with intelligent presets that respect Miller's Law
 * @attention-economics Preset hierarchy: linear=democratic attention, golden=hierarchical flow, bento=complex attention patterns, custom=user-defined
 * @trust-building Mathematical spacing (golden ratio), Miller's Law cognitive load limits, consistent preset behavior builds user confidence
 * @accessibility WCAG AAA compliance with keyboard navigation, screen reader patterns, and ARIA grid support for interactive layouts
 * @semantic-meaning Layout intelligence: linear=equal-priority content, golden=natural hierarchy, bento=content showcases with semantic asymmetry, custom=specialized layouts
 *
 * @usage-patterns
 * DO: Linear - Product catalogs, image galleries, equal-priority content
 * DO: Golden - Editorial layouts, feature showcases, natural hierarchy
 * DO: Bento - Editorial layouts, dashboards, content showcases (use sparingly)
 * DO: Custom - Specialized layouts requiring specific configurations
 * NEVER: Decorative asymmetry without semantic meaning
 * NEVER: Exceed cognitive load limits (8 items max on wide screens)
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Negative Space: https://rafters.realhandy.tech/docs/llm/negative-space
 * - Cognitive Load: https://rafters.realhandy.tech/docs/llm/cognitive-load
 *
 * @dependencies class-variance-authority, clsx
 *
 * @example
 * ```tsx
 * // Linear grid for equal-priority content
 * <Grid preset="linear" gap="comfortable">
 *   <GridItem>Content 1</GridItem>
 *   <GridItem>Content 2</GridItem>
 * </Grid>
 *
 * // Bento layout with primary content
 * <Grid preset="bento" bentoPattern="editorial">
 *   <GridItem priority="primary">Hero Article</GridItem>
 *   <GridItem priority="secondary">Supporting Content</GridItem>
 * </Grid>
 * ```
 */
import { cn } from '../lib/utils';
/**
 * Grid preset configurations with embedded UX intelligence
 * Each preset encodes specific cognitive load and attention patterns
 */
const GRID_PRESETS = {
    linear: {
        cognitiveLoad: 2,
        trustLevel: 'high',
        attentionPattern: 'democratic',
        description: 'Equal columns with predictable scanning patterns',
        responsive: {
            base: 'grid-cols-1',
            sm: 'sm:grid-cols-2',
            md: 'md:grid-cols-2',
            lg: 'lg:grid-cols-3',
            xl: 'xl:grid-cols-4',
        },
        usage: 'Product catalogs, image galleries, equal-priority content',
    },
    golden: {
        cognitiveLoad: 4,
        trustLevel: 'high',
        attentionPattern: 'hierarchical',
        description: 'Golden ratio proportions for natural visual hierarchy',
        responsive: {
            base: 'grid-cols-1',
            sm: 'sm:grid-cols-2',
            md: 'md:grid-cols-3',
            lg: 'lg:grid-cols-5', // Golden ratio relationship
            xl: 'xl:grid-cols-5',
        },
        usage: 'Editorial layouts, feature showcases, content with natural hierarchy',
    },
    bento: {
        cognitiveLoad: 6,
        trustLevel: 'medium',
        attentionPattern: 'complex',
        description: 'Semantic asymmetric layouts for content showcases',
        responsive: {
            base: 'grid-cols-1',
            sm: 'sm:grid-cols-2',
            md: 'md:grid-cols-3',
            lg: 'lg:grid-cols-3', // Never exceed 3 columns for bento
        },
        usage: 'Editorial layouts, dashboards, content showcases requiring careful attention hierarchy',
        patterns: {
            editorial: {
                template: 'lg:grid-cols-3 lg:grid-rows-2',
                primarySpan: 'lg:col-span-2 lg:row-span-2',
                secondarySpan: 'lg:col-span-1 lg:row-span-1',
            },
            dashboard: {
                template: 'lg:grid-cols-4 lg:grid-rows-2',
                primarySpan: 'lg:col-span-2 lg:row-span-1',
                secondarySpan: 'lg:col-span-1 lg:row-span-1',
            },
            'feature-showcase': {
                template: 'lg:grid-cols-3 lg:grid-rows-3',
                primarySpan: 'lg:col-span-2 lg:row-span-2',
                secondarySpan: 'lg:col-span-1 lg:row-span-1',
            },
            portfolio: {
                template: 'lg:grid-cols-4 lg:grid-rows-3',
                primarySpan: 'lg:col-span-2 lg:row-span-2',
                secondarySpan: 'lg:col-span-1 lg:row-span-1',
            },
        },
    },
    custom: {
        cognitiveLoad: 'variable',
        trustLevel: 'medium',
        attentionPattern: 'user-defined',
        description: 'User-defined configurations for specialized layouts',
        usage: 'Specialized layouts requiring specific grid configurations',
    },
};
/**
 * Gap spacing mapping to Tailwind utilities and semantic tokens
 */
const GAP_CLASSES = {
    xs: 'gap-2', // 8px
    sm: 'gap-3', // 12px
    md: 'gap-4', // 16px
    lg: 'gap-6', // 24px
    xl: 'gap-8', // 32px
    comfortable: 'gap-[1.618rem]', // Golden ratio φ
    generous: 'gap-[2.618rem]', // Golden ratio φ²
};
/**
 * Auto-fit minimum widths using design tokens
 */
const AUTO_FIT_WIDTHS = {
    sm: '200px', // Compact cards
    md: '280px', // Comfortable content
    lg: '360px', // Rich content
};
/**
 * Cognitive load limits by viewport (Miller's Law implementation)
 */
const _COGNITIVE_LIMITS = {
    mobile: 2, // Small screens, touch interface
    tablet: 4, // Medium screens, mixed interaction
    desktop: 6, // Large screens, precise interaction
    wide: 8, // Ultra-wide, professional use
};
/**
 * Priority-based spanning for bento layouts
 * Automatically calculates grid item sizes based on content importance
 */
const PRIORITY_SPANS = {
    primary: {
        colSpan: 2,
        rowSpan: 2,
        cognitiveWeight: 8,
        attentionValue: 'highest',
    },
    secondary: {
        colSpan: 1,
        rowSpan: 1,
        cognitiveWeight: 4,
        attentionValue: 'medium',
    },
    tertiary: {
        colSpan: 1,
        rowSpan: 1,
        cognitiveWeight: 2,
        attentionValue: 'supporting',
    },
};
/**
 * Grid Layout Intelligence Component
 *
 * Provides responsive grid layouts with embedded UX reasoning that AI agents
 * can understand and apply. Combines standard Tailwind utilities with
 * intelligent presets for systematic design decision-making.
 */
export function Grid({ preset = 'linear', bentoPattern = 'editorial', columns, autoFit, gap = 'md', maxItems = 'auto', role = 'presentation', ariaLabel, ariaLabelledBy, as = 'div', onFocusChange, className, children, ref, ...props }) {
    const Component = as;
    // Get preset configuration
    const presetConfig = GRID_PRESETS[preset];
    // Build base grid classes
    const getGridClasses = () => {
        const classes = ['grid'];
        // Apply preset-specific responsive classes
        if (preset !== 'custom' && 'responsive' in presetConfig && presetConfig.responsive) {
            for (const cls of Object.values(presetConfig.responsive)) {
                if (cls)
                    classes.push(cls);
            }
        }
        // Apply bento pattern classes
        if (preset === 'bento' && 'patterns' in presetConfig && presetConfig.patterns) {
            const pattern = presetConfig.patterns[bentoPattern];
            if (pattern) {
                classes.push(pattern.template);
            }
        }
        // Apply custom columns if specified
        if (preset === 'custom' && columns) {
            if (typeof columns === 'object' && 'base' in columns) {
                // Responsive columns
                if (columns.base)
                    classes.push(`grid-cols-${columns.base}`);
                if (columns.sm)
                    classes.push(`sm:grid-cols-${columns.sm}`);
                if (columns.md)
                    classes.push(`md:grid-cols-${columns.md}`);
                if (columns.lg)
                    classes.push(`lg:grid-cols-${columns.lg}`);
                if (columns.xl)
                    classes.push(`xl:grid-cols-${columns.xl}`);
                if (columns['2xl'])
                    classes.push(`2xl:grid-cols-${columns['2xl']}`);
            }
            else {
                // Simple columns
                if (columns === 'auto-fit' || columns === 'auto-fill') {
                    // Handled by inline styles
                }
                else {
                    classes.push(`grid-cols-${columns}`);
                }
            }
        }
        // Apply gap classes
        classes.push(GAP_CLASSES[gap]);
        return classes;
    };
    // Build inline styles for auto-sizing and custom gaps
    const getInlineStyles = () => {
        const styles = {};
        // Handle auto-fit patterns
        if (autoFit) {
            const minWidth = AUTO_FIT_WIDTHS[autoFit] || autoFit;
            styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
        }
        // Handle custom columns for auto patterns
        if (preset === 'custom' && typeof columns === 'string') {
            if (columns === 'auto-fit') {
                const minWidth = autoFit
                    ? AUTO_FIT_WIDTHS[autoFit] || autoFit
                    : '250px';
                styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
            }
            else if (columns === 'auto-fill') {
                const minWidth = autoFit
                    ? AUTO_FIT_WIDTHS[autoFit] || autoFit
                    : '250px';
                styles.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;
            }
        }
        // Handle custom gaps that need inline styles (golden ratio gaps)
        if (gap === 'comfortable' || gap === 'generous') {
            if (gap === 'comfortable') {
                styles.gap = '1.618rem'; // Golden ratio φ
            }
            else if (gap === 'generous') {
                styles.gap = '2.618rem'; // Golden ratio φ²
            }
        }
        return styles;
    };
    return (_jsx(Component, { ref: ref, role: role, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, tabIndex: role === 'grid' ? 0 : undefined, className: cn(...getGridClasses(), 
        // Focus management for interactive grids
        role === 'grid' && [
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-2',
        ], className), style: {
            ...getInlineStyles(),
            ...props.style,
        }, ...props, children: children }));
}
/**
 * GridItem companion component with priority-based intelligence
 *
 * Provides semantic grid items with automatic sizing based on content
 * priority and accessibility integration for screen readers.
 */
export function GridItem({ colSpan, rowSpan, priority, role = 'none', ariaLabel, focusable = false, as = 'div', className, children, ref, ...props }) {
    const Component = as;
    // Get priority-based spans for bento layouts
    const getPrioritySpans = () => {
        if (priority && PRIORITY_SPANS[priority]) {
            const spans = PRIORITY_SPANS[priority];
            return {
                colSpan: spans.colSpan,
                rowSpan: spans.rowSpan,
            };
        }
        return { colSpan, rowSpan };
    };
    const { colSpan: finalColSpan, rowSpan: finalRowSpan } = getPrioritySpans();
    // Build span classes
    const getSpanClasses = () => {
        const classes = [];
        // Handle responsive colSpan
        if (finalColSpan) {
            if (typeof finalColSpan === 'object' && 'base' in finalColSpan) {
                if (finalColSpan.base)
                    classes.push(`col-span-${finalColSpan.base}`);
                if (finalColSpan.sm)
                    classes.push(`sm:col-span-${finalColSpan.sm}`);
                if (finalColSpan.md)
                    classes.push(`md:col-span-${finalColSpan.md}`);
                if (finalColSpan.lg)
                    classes.push(`lg:col-span-${finalColSpan.lg}`);
                if (finalColSpan.xl)
                    classes.push(`xl:col-span-${finalColSpan.xl}`);
                if (finalColSpan['2xl'])
                    classes.push(`2xl:col-span-${finalColSpan['2xl']}`);
            }
            else {
                classes.push(`col-span-${finalColSpan}`);
            }
        }
        // Handle responsive rowSpan
        if (finalRowSpan) {
            if (typeof finalRowSpan === 'object' && 'base' in finalRowSpan) {
                if (finalRowSpan.base)
                    classes.push(`row-span-${finalRowSpan.base}`);
                if (finalRowSpan.sm)
                    classes.push(`sm:row-span-${finalRowSpan.sm}`);
                if (finalRowSpan.md)
                    classes.push(`md:row-span-${finalRowSpan.md}`);
                if (finalRowSpan.lg)
                    classes.push(`lg:row-span-${finalRowSpan.lg}`);
                if (finalRowSpan.xl)
                    classes.push(`xl:row-span-${finalRowSpan.xl}`);
                if (finalRowSpan['2xl'])
                    classes.push(`2xl:row-span-${finalRowSpan['2xl']}`);
            }
            else {
                classes.push(`row-span-${finalRowSpan}`);
            }
        }
        return classes;
    };
    return (_jsx(Component, { ref: ref, role: role, "aria-label": ariaLabel, tabIndex: focusable ? 0 : undefined, className: cn(...getSpanClasses(), 
        // Focus management for interactive grid items
        focusable && [
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-1',
        ], 
        // Touch target compliance for interactive items
        role === 'gridcell' && [
            'min-h-[44px]', // WCAG AAA minimum
            'min-w-[44px]',
        ], className), ...props, children: children }));
}
//# sourceMappingURL=Grid.js.map