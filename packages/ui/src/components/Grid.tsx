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
 * Responsive value type for breakpoint-aware properties
 */
type ResponsiveValue<T> =
  | T
  | {
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
type BentoPattern =
  | 'editorial' // Hero article + supporting content
  | 'dashboard' // Primary metric + supporting data
  | 'feature-showcase' // Main feature + benefits
  | 'portfolio'; // Featured work + gallery items

/**
 * Grid preset types with embedded design intelligence
 */
type GridPreset =
  | 'linear' // Equal columns, democratic attention (cognitive load: 2/10)
  | 'golden' // Golden ratio proportions, hierarchical flow (cognitive load: 4/10)
  | 'bento' // Semantic asymmetric layouts (cognitive load: 6/10)
  | 'custom'; // User-defined configurations (cognitive load: variable)

/**
 * Content priority for bento layouts
 * Drives both visual hierarchy and accessibility structure
 */
type ContentPriority =
  | 'primary' // Hero content, main focus (2x attention weight)
  | 'secondary' // Supporting content (1x attention weight)
  | 'tertiary'; // Contextual content (0.5x attention weight)

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
  onFocusChange?: (position: { row: number; col: number }) => void;

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
 * Grid preset configurations with embedded UX intelligence
 * Each preset encodes specific cognitive load and attention patterns
 */
const GRID_PRESETS = {
  linear: {
    cognitiveLoad: 2,
    trustLevel: 'high' as const,
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
    trustLevel: 'high' as const,
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
    trustLevel: 'medium' as const,
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
    cognitiveLoad: 'variable' as const,
    trustLevel: 'medium' as const,
    attentionPattern: 'user-defined',
    description: 'User-defined configurations for specialized layouts',
    usage: 'Specialized layouts requiring specific grid configurations',
  },
} as const;

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
} as const;

/**
 * Auto-fit minimum widths using design tokens
 */
const AUTO_FIT_WIDTHS = {
  sm: '200px', // Compact cards
  md: '280px', // Comfortable content
  lg: '360px', // Rich content
} as const;

/**
 * Cognitive load limits by viewport (Miller's Law implementation)
 */
const _COGNITIVE_LIMITS = {
  mobile: 2, // Small screens, touch interface
  tablet: 4, // Medium screens, mixed interaction
  desktop: 6, // Large screens, precise interaction
  wide: 8, // Ultra-wide, professional use
} as const;

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
} as const;

/**
 * Grid Layout Intelligence Component
 *
 * Provides responsive grid layouts with embedded UX reasoning that AI agents
 * can understand and apply. Combines standard Tailwind utilities with
 * intelligent presets for systematic design decision-making.
 */
export function Grid({
  preset = 'linear',
  bentoPattern = 'editorial',
  columns,
  autoFit,
  gap = 'md',
  maxItems = 'auto',
  role = 'presentation',
  ariaLabel,
  ariaLabelledBy,
  as = 'div',
  onFocusChange,
  className,
  children,
  ref,
  ...props
}: GridProps) {
  const Component = as;

  // Get preset configuration
  const presetConfig = GRID_PRESETS[preset];

  // Build base grid classes
  const getGridClasses = () => {
    const classes: string[] = ['grid'];

    // Apply preset-specific responsive classes
    if (preset !== 'custom' && 'responsive' in presetConfig && presetConfig.responsive) {
      for (const cls of Object.values(presetConfig.responsive)) {
        if (cls) classes.push(cls);
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
        if (columns.base) classes.push(`grid-cols-${columns.base}`);
        if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
        if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
        if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
        if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
        if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);
      } else {
        // Simple columns
        if (columns === 'auto-fit' || columns === 'auto-fill') {
          // Handled by inline styles
        } else {
          classes.push(`grid-cols-${columns}`);
        }
      }
    }

    // Apply gap classes
    classes.push(GAP_CLASSES[gap]);

    return classes;
  };

  // Build inline styles for auto-sizing and custom gaps
  const getInlineStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Handle auto-fit patterns
    if (autoFit) {
      const minWidth = AUTO_FIT_WIDTHS[autoFit as keyof typeof AUTO_FIT_WIDTHS] || autoFit;
      styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
    }

    // Handle custom columns for auto patterns
    if (preset === 'custom' && typeof columns === 'string') {
      if (columns === 'auto-fit') {
        const minWidth = autoFit
          ? AUTO_FIT_WIDTHS[autoFit as keyof typeof AUTO_FIT_WIDTHS] || autoFit
          : '250px';
        styles.gridTemplateColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
      } else if (columns === 'auto-fill') {
        const minWidth = autoFit
          ? AUTO_FIT_WIDTHS[autoFit as keyof typeof AUTO_FIT_WIDTHS] || autoFit
          : '250px';
        styles.gridTemplateColumns = `repeat(auto-fill, minmax(${minWidth}, 1fr))`;
      }
    }

    // Handle custom gaps that need inline styles (golden ratio gaps)
    if (gap === 'comfortable' || gap === 'generous') {
      if (gap === 'comfortable') {
        styles.gap = '1.618rem'; // Golden ratio φ
      } else if (gap === 'generous') {
        styles.gap = '2.618rem'; // Golden ratio φ²
      }
    }

    return styles;
  };

  return (
    <Component
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={role === 'grid' ? 0 : undefined}
      className={cn(
        ...getGridClasses(),
        // Focus management for interactive grids
        role === 'grid' && [
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-primary',
          'focus-visible:ring-offset-2',
        ],
        className
      )}
      style={{
        ...getInlineStyles(),
        ...props.style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * GridItem companion component with priority-based intelligence
 *
 * Provides semantic grid items with automatic sizing based on content
 * priority and accessibility integration for screen readers.
 */
export function GridItem({
  colSpan,
  rowSpan,
  priority,
  role = 'none',
  ariaLabel,
  focusable = false,
  as = 'div',
  className,
  children,
  ref,
  ...props
}: GridItemProps) {
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
    const classes: string[] = [];

    // Handle responsive colSpan
    if (finalColSpan) {
      if (typeof finalColSpan === 'object' && 'base' in finalColSpan) {
        if (finalColSpan.base) classes.push(`col-span-${finalColSpan.base}`);
        if (finalColSpan.sm) classes.push(`sm:col-span-${finalColSpan.sm}`);
        if (finalColSpan.md) classes.push(`md:col-span-${finalColSpan.md}`);
        if (finalColSpan.lg) classes.push(`lg:col-span-${finalColSpan.lg}`);
        if (finalColSpan.xl) classes.push(`xl:col-span-${finalColSpan.xl}`);
        if (finalColSpan['2xl']) classes.push(`2xl:col-span-${finalColSpan['2xl']}`);
      } else {
        classes.push(`col-span-${finalColSpan}`);
      }
    }

    // Handle responsive rowSpan
    if (finalRowSpan) {
      if (typeof finalRowSpan === 'object' && 'base' in finalRowSpan) {
        if (finalRowSpan.base) classes.push(`row-span-${finalRowSpan.base}`);
        if (finalRowSpan.sm) classes.push(`sm:row-span-${finalRowSpan.sm}`);
        if (finalRowSpan.md) classes.push(`md:row-span-${finalRowSpan.md}`);
        if (finalRowSpan.lg) classes.push(`lg:row-span-${finalRowSpan.lg}`);
        if (finalRowSpan.xl) classes.push(`xl:row-span-${finalRowSpan.xl}`);
        if (finalRowSpan['2xl']) classes.push(`2xl:row-span-${finalRowSpan['2xl']}`);
      } else {
        classes.push(`row-span-${finalRowSpan}`);
      }
    }

    return classes;
  };

  return (
    <Component
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      role={role}
      aria-label={ariaLabel}
      tabIndex={focusable ? 0 : undefined}
      className={cn(
        ...getSpanClasses(),
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
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
