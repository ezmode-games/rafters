/**
 * Generator Defaults
 *
 * All default values for token generators live here.
 * Generators are pure functions - they receive data, they don't embed it.
 *
 * This file contains:
 * - Default color scales (OKLCH values)
 * - Default breakpoint definitions
 * - Default depth (z-index) definitions
 * - Default shadow definitions
 * - Default elevation mappings
 * - Default motion definitions (easing curves, duration multipliers)
 * - Default focus ring configurations
 * - Default radius multipliers
 * - Default spacing multipliers
 * - Default typography definitions
 */

import type { OKLCH } from '@rafters/shared';

// =============================================================================
// COLOR DEFAULTS
// =============================================================================

/**
 * Neutral color scale in OKLCH
 * Based on shadcn zinc palette, converted to OKLCH for perceptual uniformity
 */
export const DEFAULT_NEUTRAL_SCALE: Record<string, OKLCH> = {
  '50': { l: 0.985, c: 0, h: 0, alpha: 1 },
  '100': { l: 0.967, c: 0, h: 0, alpha: 1 },
  '200': { l: 0.92, c: 0, h: 0, alpha: 1 },
  '300': { l: 0.869, c: 0, h: 0, alpha: 1 },
  // biome-ignore lint/suspicious/noApproximativeNumericConstant: OKLCH lightness value, not Math.SQRT1_2
  '400': { l: 0.707, c: 0, h: 0, alpha: 1 },
  '500': { l: 0.552, c: 0, h: 0, alpha: 1 },
  '600': { l: 0.442, c: 0, h: 0, alpha: 1 },
  '700': { l: 0.37, c: 0, h: 0, alpha: 1 },
  '800': { l: 0.269, c: 0, h: 0, alpha: 1 },
  '900': { l: 0.2, c: 0, h: 0, alpha: 1 },
  '950': { l: 0.141, c: 0, h: 0, alpha: 1 },
};

export interface ColorScaleInput {
  name: string;
  scale: Record<string, OKLCH>;
  description?: string;
}

export const DEFAULT_COLOR_SCALES: ColorScaleInput[] = [
  {
    name: 'neutral',
    scale: DEFAULT_NEUTRAL_SCALE,
    description: 'Foundation neutral palette for backgrounds, borders, text, and UI chrome.',
  },
];

// =============================================================================
// COLOR PALETTE BASES
// =============================================================================

/**
 * Base hue and chroma for color palette generation.
 * Full 11-position scales are computed mathematically via generateOKLCHScale().
 *
 * Rafters palette - color names from API cache (api.rafters.studio):
 * - neutral: zinc (achromatic, h:0, c:0) - defined above
 * - silver-true-glacier: teal/cyan (h:180, c:0.12) - cool, serene
 * - silver-bold-fire-truck: fire-truck red (h:0, c:0.20) - warm, energetic
 * - silver-true-honey: honey gold (h:60, c:0.12) - warm, inviting
 * - silver-true-citrine: citrine green (h:90, c:0.12) - fresh, natural
 * - silver-true-sky: sky blue (h:210, c:0.12) - calm, trustworthy
 * - silver-true-violet: violet/purple (h:270, c:0.12) - creative, luxurious
 */
export interface ColorPaletteBase {
  /** Hue in degrees (0-360) */
  hue: number;
  /** Chroma (0-0.4 typical range) */
  chroma: number;
  /** Description of the color */
  description: string;
}

export const DEFAULT_COLOR_PALETTE_BASES: Record<string, ColorPaletteBase> = {
  'silver-true-glacier': {
    hue: 180,
    chroma: 0.12,
    description: 'Cool cyan/teal palette - serene, balanced, calming.',
  },
  'silver-bold-fire-truck': {
    hue: 0,
    chroma: 0.2,
    description: 'Bold fire-truck red palette - warm, energetic, attention-grabbing.',
  },
  'silver-true-honey': {
    hue: 60,
    chroma: 0.12,
    description: 'Warm honey gold palette - inviting, refined, subtle warmth.',
  },
  'silver-true-citrine': {
    hue: 90,
    chroma: 0.12,
    description: 'Fresh citrine green palette - natural, growth, harmony.',
  },
  'silver-true-sky': {
    hue: 210,
    chroma: 0.12,
    description: 'Calm sky blue palette - trustworthy, serene, reliable.',
  },
  'silver-true-violet': {
    hue: 270,
    chroma: 0.12,
    description: 'Creative violet palette - luxurious, imaginative, refined.',
  },
};

/** @deprecated Use DEFAULT_COLOR_PALETTE_BASES instead */
export const DEFAULT_SEMANTIC_COLOR_BASES = DEFAULT_COLOR_PALETTE_BASES;
/** @deprecated Use ColorPaletteBase instead */
export type SemanticColorBase = ColorPaletteBase;

// =============================================================================
// BREAKPOINT DEFAULTS
// =============================================================================

export interface BreakpointDef {
  minWidth: number;
  meaning: string;
  devices: string[];
  contexts: string[];
}

export const DEFAULT_BREAKPOINTS: Record<string, BreakpointDef> = {
  sm: {
    minWidth: 640,
    meaning: 'Small screens - landscape phones, small tablets',
    devices: ['phone-landscape', 'small-tablet'],
    contexts: ['mobile-first', 'compact-layouts'],
  },
  md: {
    minWidth: 768,
    meaning: 'Medium screens - tablets, small laptops',
    devices: ['tablet-portrait', 'small-laptop'],
    contexts: ['tablet-layouts', 'sidebar-visible'],
  },
  lg: {
    minWidth: 1024,
    meaning: 'Large screens - laptops, small desktops',
    devices: ['tablet-landscape', 'laptop', 'small-desktop'],
    contexts: ['desktop-layouts', 'multi-column'],
  },
  xl: {
    minWidth: 1280,
    meaning: 'Extra large screens - desktops',
    devices: ['desktop', 'large-laptop'],
    contexts: ['wide-layouts', 'dashboard'],
  },
  '2xl': {
    minWidth: 1536,
    meaning: 'Extra extra large screens - large desktops, monitors',
    devices: ['large-desktop', 'external-monitor'],
    contexts: ['ultra-wide', 'data-dense'],
  },
};

export interface ContainerBreakpointDef {
  /** Width in rem (Tailwind v4 uses rem for container queries) */
  width: number;
  meaning: string;
}

/**
 * Container query breakpoints matching Tailwind v4 defaults.
 *
 * Tailwind v4 uses `--container-*` theme variables with rem values.
 * These create utilities like `@xs:`, `@sm:`, `@md:`, etc.
 *
 * @see https://tailwindcss.com/docs/responsive-design#container-queries
 */
export const DEFAULT_CONTAINER_BREAKPOINTS: Record<string, ContainerBreakpointDef> = {
  // Match Tailwind v4 defaults
  '3xs': { width: 16, meaning: 'Smallest container (256px) - icons, badges' },
  '2xs': { width: 18, meaning: 'Extra extra small (288px) - compact cards' },
  xs: { width: 20, meaning: 'Extra small (320px) - mobile-width cards' },
  sm: { width: 24, meaning: 'Small (384px) - standard cards' },
  md: { width: 28, meaning: 'Medium (448px) - wide cards, panels' },
  lg: { width: 32, meaning: 'Large (512px) - sidebars, dialog content' },
  xl: { width: 36, meaning: 'Extra large (576px) - main content panels' },
  '2xl': { width: 42, meaning: '2XL (672px) - wide content areas' },
  '3xl': { width: 48, meaning: '3XL (768px) - tablet-width containers' },
  '4xl': { width: 56, meaning: '4XL (896px) - wide panels' },
  '5xl': { width: 64, meaning: '5XL (1024px) - desktop content' },
  '6xl': { width: 72, meaning: '6XL (1152px) - wide desktop content' },
  '7xl': { width: 80, meaning: '7XL (1280px) - maximum content width' },
};

// =============================================================================
// DEPTH (Z-INDEX) DEFAULTS
// =============================================================================

export interface DepthDef {
  value: number;
  meaning: string;
  contexts: string[];
  stackingContext: boolean;
}

export const DEFAULT_DEPTH_DEFINITIONS: Record<string, DepthDef> = {
  base: {
    value: 0,
    meaning: 'Base layer - document flow elements',
    contexts: ['regular-content', 'in-flow-elements'],
    stackingContext: false,
  },
  dropdown: {
    value: 10,
    meaning: 'Dropdown menus and select options',
    contexts: ['dropdowns', 'select-menus', 'autocomplete'],
    stackingContext: true,
  },
  sticky: {
    value: 20,
    meaning: 'Sticky elements - headers, navigation',
    contexts: ['sticky-header', 'sticky-nav', 'floating-actions'],
    stackingContext: true,
  },
  fixed: {
    value: 30,
    meaning: 'Fixed elements - always visible',
    contexts: ['fixed-header', 'fixed-footer', 'fab-buttons'],
    stackingContext: true,
  },
  modal: {
    value: 40,
    meaning: 'Modal dialogs - blocking overlays',
    contexts: ['modals', 'dialogs', 'sheets'],
    stackingContext: true,
  },
  popover: {
    value: 50,
    meaning: 'Popovers above modals',
    contexts: ['popovers', 'nested-menus', 'command-palette'],
    stackingContext: true,
  },
  tooltip: {
    value: 60,
    meaning: 'Tooltips - highest common layer',
    contexts: ['tooltips', 'toast-notifications'],
    stackingContext: true,
  },
};

// =============================================================================
// SHADOW DEFAULTS
// =============================================================================

export interface ShadowDef {
  yOffset: number;
  blur: number;
  spread: number;
  opacity: number;
  innerShadow?: {
    yOffset: number;
    blur: number;
    spread: number;
    opacity: number;
  };
  meaning: string;
  contexts: string[];
}

export const DEFAULT_SHADOW_DEFINITIONS: Record<string, ShadowDef> = {
  none: {
    yOffset: 0,
    blur: 0,
    spread: 0,
    opacity: 0,
    meaning: 'No shadow - flat appearance',
    contexts: ['flat-elements', 'inline', 'disabled'],
  },
  xs: {
    yOffset: 0.25,
    blur: 0.5,
    spread: 0,
    opacity: 0.05,
    meaning: 'Extra small shadow - subtle depth hint',
    contexts: ['subtle-cards', 'list-items', 'hover-states'],
  },
  sm: {
    yOffset: 0.25,
    blur: 1,
    spread: 0,
    opacity: 0.06,
    innerShadow: {
      yOffset: 0.25,
      blur: 0.5,
      spread: 0,
      opacity: 0.1,
    },
    meaning: 'Small shadow - slight elevation',
    contexts: ['cards', 'buttons', 'inputs'],
  },
  DEFAULT: {
    yOffset: 0.5,
    blur: 1.5,
    spread: -0.25,
    opacity: 0.1,
    innerShadow: {
      yOffset: 0.25,
      blur: 0.5,
      spread: 0,
      opacity: 0.1,
    },
    meaning: 'Default shadow - standard elevation',
    contexts: ['cards', 'dropdowns', 'floating-elements'],
  },
  md: {
    yOffset: 1,
    blur: 2,
    spread: -0.5,
    opacity: 0.1,
    innerShadow: {
      yOffset: 0.5,
      blur: 1,
      spread: -0.25,
      opacity: 0.1,
    },
    meaning: 'Medium shadow - noticeable elevation',
    contexts: ['hovering-cards', 'active-elements', 'focus-states'],
  },
  lg: {
    yOffset: 2,
    blur: 4,
    spread: -0.75,
    opacity: 0.1,
    innerShadow: {
      yOffset: 1,
      blur: 2,
      spread: -0.5,
      opacity: 0.1,
    },
    meaning: 'Large shadow - significant elevation',
    contexts: ['modals', 'dialogs', 'floating-panels'],
  },
  xl: {
    yOffset: 5,
    blur: 6,
    spread: -1,
    opacity: 0.1,
    innerShadow: {
      yOffset: 2,
      blur: 4,
      spread: -0.75,
      opacity: 0.1,
    },
    meaning: 'Extra large shadow - high elevation',
    contexts: ['large-modals', 'sheet-dialogs', 'command-palettes'],
  },
  '2xl': {
    yOffset: 6,
    blur: 12,
    spread: -2,
    opacity: 0.25,
    meaning: 'Maximum shadow - highest elevation',
    contexts: ['critical-modals', 'overlays', 'drawer-panels'],
  },
};

// =============================================================================
// ELEVATION DEFAULTS
// =============================================================================

export interface ElevationDef {
  depth: string;
  shadow: string;
  meaning: string;
  contexts: string[];
  useCase: string;
}

export const DEFAULT_ELEVATION_DEFINITIONS: Record<string, ElevationDef> = {
  surface: {
    depth: 'depth-base',
    shadow: 'shadow-none',
    meaning: 'Surface level - flat, in-flow elements',
    contexts: ['page-content', 'inline-elements', 'flat-cards'],
    useCase: "Default level for content that doesn't need elevation",
  },
  raised: {
    depth: 'depth-base',
    shadow: 'shadow-sm',
    meaning: 'Slightly raised - subtle depth without z-index change',
    contexts: ['cards', 'panels', 'list-items'],
    useCase: 'Cards and containers that need subtle visual separation',
  },
  overlay: {
    depth: 'depth-dropdown',
    shadow: 'shadow',
    meaning: 'Overlay level - dropdowns and menus',
    contexts: ['dropdowns', 'select-menus', 'autocomplete', 'context-menus'],
    useCase: "Elements that appear over content but aren't blocking",
  },
  sticky: {
    depth: 'depth-sticky',
    shadow: 'shadow-md',
    meaning: 'Sticky level - persistent navigation',
    contexts: ['sticky-header', 'sticky-sidebar', 'floating-nav'],
    useCase: 'Elements that stick to viewport edges during scroll',
  },
  modal: {
    depth: 'depth-modal',
    shadow: 'shadow-lg',
    meaning: 'Modal level - blocking dialogs',
    contexts: ['modals', 'dialogs', 'sheets', 'drawers'],
    useCase: 'Elements that block interaction with content below',
  },
  popover: {
    depth: 'depth-popover',
    shadow: 'shadow-xl',
    meaning: 'Popover level - above modals',
    contexts: ['popovers', 'nested-dialogs', 'command-palette'],
    useCase: 'Elements that can appear above modals (rare)',
  },
  tooltip: {
    depth: 'depth-tooltip',
    shadow: 'shadow-lg',
    meaning: 'Tooltip level - highest common UI',
    contexts: ['tooltips', 'toast-notifications', 'snackbars'],
    useCase: 'Transient information that appears above everything',
  },
};

// =============================================================================
// MOTION DEFAULTS
// =============================================================================

export interface DurationDef {
  /** Steps from base using the progression ratio (0 = base, negative = faster, positive = slower) */
  step: number | 'instant';
  meaning: string;
  contexts: string[];
  motionIntent: 'enter' | 'exit' | 'emphasis' | 'transition';
}

/**
 * Duration scale using step-based progression.
 * Values are computed as: baseDuration * ratio^step
 * With minor-third (1.2) and baseDuration of 150ms:
 *   step -1 = 125ms, step 0 = 150ms, step 1 = 180ms, step 2 = 216ms, etc.
 */
export const DEFAULT_DURATION_DEFINITIONS: Record<string, DurationDef> = {
  instant: {
    step: 'instant',
    meaning: 'Instant - no animation',
    contexts: ['disabled-motion', 'prefers-reduced-motion'],
    motionIntent: 'transition',
  },
  fast: {
    step: -1,
    meaning: 'Fast - micro-interactions, hover states',
    contexts: ['hover', 'focus', 'active', 'micro-feedback'],
    motionIntent: 'transition',
  },
  normal: {
    step: 0,
    meaning: 'Normal - standard UI transitions',
    contexts: ['buttons', 'toggles', 'state-changes'],
    motionIntent: 'transition',
  },
  slow: {
    step: 1,
    meaning: 'Slow - enter/exit animations',
    contexts: ['modals', 'dialogs', 'panels', 'enter-exit'],
    motionIntent: 'enter',
  },
  slower: {
    step: 2,
    meaning: 'Slower - emphasis, large element transitions',
    contexts: ['page-transitions', 'hero-animations', 'emphasis'],
    motionIntent: 'emphasis',
  },
};

export interface EasingDef {
  curve: [number, number, number, number];
  meaning: string;
  contexts: string[];
  css: string;
}

export const DEFAULT_EASING_DEFINITIONS: Record<string, EasingDef> = {
  linear: {
    curve: [0, 0, 1, 1],
    meaning: 'Linear - constant speed, mechanical feel',
    contexts: ['progress-bars', 'loading-spinners', 'opacity-fades'],
    css: 'linear',
  },
  'ease-in': {
    curve: [0.42, 0, 1, 1],
    meaning: 'Ease in - starts slow, accelerates (exiting)',
    contexts: ['exit-animations', 'elements-leaving'],
    css: 'cubic-bezier(0.42, 0, 1, 1)',
  },
  'ease-out': {
    curve: [0, 0, 0.58, 1],
    meaning: 'Ease out - starts fast, decelerates (entering)',
    contexts: ['enter-animations', 'elements-appearing'],
    css: 'cubic-bezier(0, 0, 0.58, 1)',
  },
  'ease-in-out': {
    curve: [0.42, 0, 0.58, 1],
    meaning: 'Ease in-out - symmetric acceleration/deceleration',
    contexts: ['state-changes', 'transforms', 'general-purpose'],
    css: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  productive: {
    curve: [0.2, 0, 0.38, 0.9],
    meaning: 'Productive - quick, efficient, minimal overshoot',
    contexts: ['work-ui', 'data-displays', 'business-apps'],
    css: 'cubic-bezier(0.2, 0, 0.38, 0.9)',
  },
  expressive: {
    curve: [0.4, 0.14, 0.3, 1],
    meaning: 'Expressive - dramatic, attention-grabbing',
    contexts: ['marketing', 'onboarding', 'celebrations', 'emphasis'],
    css: 'cubic-bezier(0.4, 0.14, 0.3, 1)',
  },
  spring: {
    curve: [0.175, 0.885, 0.32, 1.275],
    meaning: 'Spring - bouncy overshoot for playful feel',
    contexts: ['buttons', 'icons', 'playful-ui', 'celebrations'],
    css: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

export interface DelayDef {
  /** Steps from base using the progression ratio (0 = base, negative = shorter, positive = longer) */
  step: number | 'none';
}

/**
 * Delay scale using step-based progression.
 * Values are computed as: baseDuration * ratio^step
 * With minor-third (1.2) and baseDuration of 150ms:
 *   step -1 = 125ms, step 0 = 150ms, step 1 = 180ms, step 2 = 216ms, etc.
 */
export const DEFAULT_DELAY_DEFINITIONS: Record<string, DelayDef> = {
  none: { step: 'none' },
  short: { step: -1 },
  medium: { step: 0 },
  long: { step: 1 },
};

// =============================================================================
// FOCUS DEFAULTS
// =============================================================================

export interface FocusConfig {
  width: number;
  offset: number;
  style: 'solid' | 'dashed' | 'double';
  meaning: string;
  contexts: string[];
}

export const DEFAULT_FOCUS_CONFIGS: Record<string, FocusConfig> = {
  default: {
    width: 2,
    offset: 2,
    style: 'solid',
    meaning: 'Default focus ring - suitable for most interactive elements',
    contexts: ['buttons', 'links', 'inputs', 'selects'],
  },
  inset: {
    width: 2,
    offset: -2,
    style: 'solid',
    meaning: 'Inset focus ring - for elements where external ring would be cut off',
    contexts: ['cards', 'containers', 'overflow-hidden'],
  },
  thick: {
    width: 3,
    offset: 2,
    style: 'solid',
    meaning: 'Thick focus ring - for high-visibility needs',
    contexts: ['critical-actions', 'primary-cta', 'accessibility-mode'],
  },
  subtle: {
    width: 1,
    offset: 2,
    style: 'solid',
    meaning: 'Subtle focus ring - for dense UIs with many focusable elements',
    contexts: ['table-cells', 'list-items', 'dense-ui'],
  },
};

// =============================================================================
// RADIUS DEFAULTS
// =============================================================================

export interface RadiusDef {
  /** Steps from base using the progression ratio (0 = base, negative = smaller, positive = larger) */
  step: number | 'full' | 'none';
  meaning: string;
  contexts: string[];
}

/**
 * Radius scale using step-based progression.
 * Values are computed as: baseRadius * ratio^step
 * With minor-third (1.2) and baseRadius of 4px:
 *   step -1 = 3.33px, step 0 = 4px, step 1 = 4.8px, step 2 = 5.76px, etc.
 */
export const DEFAULT_RADIUS_DEFINITIONS: Record<string, RadiusDef> = {
  none: {
    step: 'none',
    meaning: 'No border radius - sharp corners',
    contexts: ['sharp-corners', 'table-cells', 'inline-elements'],
  },
  sm: {
    step: -1,
    meaning: 'Small radius for subtle rounding',
    contexts: ['badges', 'tags', 'small-elements', 'inline-blocks'],
  },
  DEFAULT: {
    step: 0,
    meaning: 'Default radius - primary UI elements',
    contexts: ['buttons', 'inputs', 'cards', 'dropdowns'],
  },
  md: {
    step: 1,
    meaning: 'Medium radius for containers',
    contexts: ['cards', 'panels', 'dialogs'],
  },
  lg: {
    step: 2,
    meaning: 'Large radius for prominent containers',
    contexts: ['modals', 'large-cards', 'feature-panels'],
  },
  xl: {
    step: 3,
    meaning: 'Extra large radius for emphasized elements',
    contexts: ['hero-cards', 'featured-sections'],
  },
  '2xl': {
    step: 4,
    meaning: 'Maximum meaningful radius',
    contexts: ['pills', 'large-avatars', 'emphasized-buttons'],
  },
  '3xl': {
    step: 5,
    meaning: 'Very large radius for special cases',
    contexts: ['stadium-shapes', 'special-emphasis'],
  },
  full: {
    step: 'full',
    meaning: 'Fully rounded - circles and pills',
    contexts: ['avatars', 'pill-buttons', 'circular-elements'],
  },
};

// =============================================================================
// SPACING DEFAULTS
// =============================================================================

/**
 * Spacing scale multipliers for Tailwind-compatible output
 * Maps scale names to their multiplier of the base unit
 */
export const DEFAULT_SPACING_MULTIPLIERS: Record<string, number> = {
  '0': 0,
  '0.5': 0.5,
  '1': 1,
  '1.5': 1.5,
  '2': 2,
  '2.5': 2.5,
  '3': 3,
  '3.5': 3.5,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
  '14': 14,
  '16': 16,
  '20': 20,
  '24': 24,
  '28': 28,
  '32': 32,
  '36': 36,
  '40': 40,
  '44': 44,
  '48': 48,
  '52': 52,
  '56': 56,
  '60': 60,
  '64': 64,
  '72': 72,
  '80': 80,
  '96': 96,
};

// =============================================================================
// TYPOGRAPHY DEFAULTS
// =============================================================================

export interface TypographyScaleDef {
  /** Steps from base (negative = smaller, positive = larger) */
  step: number;
  lineHeight: number;
  letterSpacing: string;
}

export const DEFAULT_TYPOGRAPHY_SCALE: Record<string, TypographyScaleDef> = {
  xs: { step: -2, lineHeight: 1.5, letterSpacing: '0.025em' },
  sm: { step: -1, lineHeight: 1.5, letterSpacing: '0.015em' },
  base: { step: 0, lineHeight: 1.5, letterSpacing: '0' },
  lg: { step: 1, lineHeight: 1.5, letterSpacing: '-0.01em' },
  xl: { step: 2, lineHeight: 1.4, letterSpacing: '-0.015em' },
  '2xl': { step: 3, lineHeight: 1.35, letterSpacing: '-0.02em' },
  '3xl': { step: 4, lineHeight: 1.3, letterSpacing: '-0.025em' },
  '4xl': { step: 5, lineHeight: 1.25, letterSpacing: '-0.03em' },
  '5xl': { step: 6, lineHeight: 1.2, letterSpacing: '-0.035em' },
  '6xl': { step: 7, lineHeight: 1.15, letterSpacing: '-0.04em' },
  '7xl': { step: 8, lineHeight: 1.1, letterSpacing: '-0.045em' },
  '8xl': { step: 9, lineHeight: 1.1, letterSpacing: '-0.05em' },
  '9xl': { step: 10, lineHeight: 1.1, letterSpacing: '-0.05em' },
};

export interface FontWeightDef {
  value: number;
  meaning: string;
  contexts: string[];
}

export const DEFAULT_FONT_WEIGHTS: Record<string, FontWeightDef> = {
  thin: { value: 100, meaning: 'Thin weight', contexts: ['display', 'decorative'] },
  extralight: { value: 200, meaning: 'Extra light weight', contexts: ['large-display'] },
  light: { value: 300, meaning: 'Light weight', contexts: ['body-large', 'display'] },
  normal: { value: 400, meaning: 'Normal weight', contexts: ['body-text', 'default'] },
  medium: { value: 500, meaning: 'Medium weight', contexts: ['emphasis', 'labels'] },
  semibold: { value: 600, meaning: 'Semibold weight', contexts: ['headings', 'buttons'] },
  bold: { value: 700, meaning: 'Bold weight', contexts: ['strong-emphasis', 'headings'] },
  extrabold: { value: 800, meaning: 'Extra bold weight', contexts: ['display', 'hero'] },
  black: { value: 900, meaning: 'Black weight', contexts: ['display', 'impact'] },
};

export const DEFAULT_LINE_HEIGHTS: Record<string, number> = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};
