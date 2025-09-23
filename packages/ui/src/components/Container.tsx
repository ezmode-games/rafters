/**
 * Layout container component for content width control and semantic structure
 *
 * @registryName container
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Container.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 0/10 - Invisible structure that reduces visual complexity
 * @attentionEconomics Neutral structural element that controls content width and breathing room without competing for attention
 * @trustBuilding Predictable boundaries and consistent spacing patterns build familiarity
 * @accessibility Semantic HTML elements with proper landmark roles for screen readers
 * @semanticMeaning Content width control variants indicate content types and optimal reading experiences
 *
 * @usagePatterns
 * DO: Use semantic HTML elements for proper document structure
 * DO: Control content boundaries with responsive max-width utilities
 * DO: Apply appropriate padding for content breathing room
 * NEVER: Use margins for content spacing, unnecessarily nest containers
 *
 * @designGuides
 * - Negative Space: https://rafters.realhandy.tech/docs/foundation/negative-space
 * - Attention Economics: https://rafters.realhandy.tech/docs/foundation/attention-economics
 *
 * @dependencies None
 *
 * @example
 * ```tsx
 * // Semantic main content container
 * <Container as="main" size="5xl" padding="8">
 *   Main page content
 * </Container>
 * ```
 */
import { cn } from '../lib/utils';
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
  padding?:
    | '0'
    | 'px'
    | '0.5'
    | '1'
    | '1.5'
    | '2'
    | '2.5'
    | '3'
    | '3.5'
    | '4'
    | '5'
    | '6'
    | '8'
    | '10'
    | '12'
    | '16'
    | '20'
    | '24'
    | '32'
    | '40'
    | '48'
    | '56'
    | '64';

  /**
   * CSS Multi-column layout using Tailwind columns utilities
   * Automatically flows content into multiple columns for better readability
   */
  columns?:
    | 'auto'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
    | '3xs'
    | '2xs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';

  /**
   * Aspect ratio using Tailwind utilities and golden ratio
   * Standard ratios: square, video, etc.
   * Golden ratio: phi (1.618:1) and phi-inverse (1:1.618) for harmonious proportions
   */
  aspectRatio?:
    | 'auto'
    | 'square'
    | 'video'
    | '4/3'
    | '3/2'
    | '16/9'
    | '21/9'
    | 'phi'
    | 'phi-inverse';

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
  zIndex?:
    | 'auto'
    | 'behind'
    | 'base'
    | 'raised'
    | 'overlay'
    | 'modal'
    | 'notification'
    | 'menu'
    | 'tooltip'
    | 'top';

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
export function Container({
  size,
  padding,
  columns,
  aspectRatio,
  boxSizing,
  overflow,
  overflowX,
  overflowY,
  overscrollBehavior,
  overscrollBehaviorX,
  overscrollBehaviorY,
  zIndex,
  containerQuery,
  containerType = 'inline-size',
  as = 'div',
  className,
  children,
  ref,
  ...props
}: ContainerProps) {
  // Polymorphic component - render as specified element
  const Component = as;

  // Semantic defaults based on HTML element type
  const getSemanticDefaults = (element: string) => {
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

  return (
    <Component
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      className={cn(
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
        defaults.overflow && overflowVariants[defaults.overflow],
        overflowX && overflowXVariants[overflowX],
        overflowY && overflowYVariants[overflowY],

        // Overscroll behavior
        overscrollBehavior && overscrollBehaviorVariants[overscrollBehavior],
        overscrollBehaviorX && overscrollBehaviorXVariants[overscrollBehaviorX],
        overscrollBehaviorY && overscrollBehaviorYVariants[overscrollBehaviorY],

        // Z-index stacking layer (semantic defaults applied)
        defaults.zIndex && zIndexVariants[defaults.zIndex],

        // Container query context (Tailwind v4 native support)
        containerQuery && containerQueryVariants[containerType],

        // Article prose styling using design system tokens
        defaults.articleProse && 'article-prose',

        // Custom classes
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
