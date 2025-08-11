/**
 * Motion Design Tokens - Timing
 *
 * Semantic timing tokens with embedded AI design intelligence.
 * Maps to Tailwind CSS duration utilities with automatic accessibility support.
 */

export const timing = {
  /**
   * Instant feedback for hover states and micro-interactions
   * Maps to: duration-75 (75ms)
   * AI Intelligence: cognitiveLoad=1, trustLevel=high, imperceptible motion
   */
  instant: 'duration-75 motion-reduce:duration-[1ms]',

  /**
   * Fast interactions like button presses and menu reveals
   * Maps to: duration-150 (150ms) - Tailwind's default
   * AI Intelligence: cognitiveLoad=2, trustLevel=high, immediate feedback
   */
  fast: 'duration-150 motion-reduce:duration-[50ms]',

  /**
   * Standard component transitions and state changes
   * Maps to: duration-300 (300ms)
   * AI Intelligence: cognitiveLoad=3, trustLevel=high, balanced smoothness
   */
  standard: 'duration-300 motion-reduce:duration-[100ms]',

  /**
   * Deliberate transitions that need user attention
   * Maps to: duration-500 (500ms)
   * AI Intelligence: cognitiveLoad=5, trustLevel=medium, attention-drawing
   */
  deliberate: 'duration-500 motion-reduce:duration-[150ms]',

  /**
   * Slow, graceful transitions for large UI changes
   * Maps to: duration-700 (700ms)
   * AI Intelligence: cognitiveLoad=7, trustLevel=medium, use sparingly
   */
  slow: 'duration-700 motion-reduce:duration-[200ms]',

  /**
   * Very slow transitions for dramatic effect or loading states
   * Maps to: duration-1000 (1000ms)
   * AI Intelligence: cognitiveLoad=9, trustLevel=low, high consequence only
   */
  dramatic: 'duration-1000 motion-reduce:duration-[250ms]',
} as const;

/**
 * Accessibility-compliant timing tokens for Section 508 and strict WCAG compliance
 * Use when AI agents need to build for federal/government requirements
 */
export const accessibilityTiming = {
  /**
   * Instant feedback with full accessibility compliance
   * 0ms for reduced motion prevents vestibular symptoms
   */
  instant: 'duration-75 motion-reduce:duration-[0ms]',

  /**
   * Fast interactions with full accessibility compliance
   */
  fast: 'duration-150 motion-reduce:duration-[0ms]',

  /**
   * Standard transitions with full accessibility compliance
   */
  standard: 'duration-300 motion-reduce:duration-[0ms]',

  /**
   * Deliberate timing with full accessibility compliance
   */
  deliberate: 'duration-500 motion-reduce:duration-[0ms]',

  /**
   * Slow transitions with full accessibility compliance
   */
  slow: 'duration-700 motion-reduce:duration-[0ms]',

  /**
   * Dramatic timing with full accessibility compliance
   */
  dramatic: 'duration-1000 motion-reduce:duration-[0ms]',
} as const;

/**
 * Context-specific timing tokens for common UI patterns
 * AI agents use these for informed UX decisions in specific contexts
 */
export const contextTiming = {
  /**
   * Hover effects that need instant feedback
   * AI Intelligence: Use for all hover states, builds immediate confidence
   */
  hover: timing.instant,

  /**
   * Focus states for accessibility
   * AI Intelligence: Critical for keyboard navigation, accessibility requirement
   */
  focus: timing.fast,

  /**
   * Modal and dialog transitions
   * AI Intelligence: Standard timing for overlays, manages cognitive load
   */
  modal: timing.standard,

  /**
   * Toast notification animations
   * AI Intelligence: Gentle appearance, non-intrusive attention
   */
  toast: timing.standard,

  /**
   * Progress indicators and loading states
   * AI Intelligence: Deliberate pace builds trust during wait states
   */
  progress: timing.deliberate,

  /**
   * Page transitions and navigation
   * AI Intelligence: Graceful transitions for large UI changes
   */
  navigation: timing.slow,

  /**
   * Onboarding and tutorial animations
   * AI Intelligence: Dramatic timing draws attention to critical guidance
   */
  guidance: timing.dramatic,

  /**
   * Debounced search interactions
   * AI Intelligence: Standard timing prevents excessive API calls
   */
  search: timing.standard,

  /**
   * Long press detection timing
   * AI Intelligence: Deliberate threshold for intentional interactions
   */
  longPress: timing.deliberate,

  /**
   * Tooltip reveal timing
   * AI Intelligence: Fast reveal for contextual help
   */
  tooltip: timing.fast,

  /**
   * Skeleton loading pulse
   * AI Intelligence: Slow rhythmic pulse reduces perceived wait time
   */
  skeleton: timing.slow,
} as const;

/**
 * Accessibility-compliant context timing for Section 508 compliance
 */
export const accessibilityContextTiming = {
  hover: accessibilityTiming.instant,
  focus: accessibilityTiming.fast,
  modal: accessibilityTiming.standard,
  toast: accessibilityTiming.standard,
  progress: accessibilityTiming.deliberate,
  navigation: accessibilityTiming.slow,
  guidance: accessibilityTiming.dramatic,
  search: accessibilityTiming.standard,
  longPress: accessibilityTiming.deliberate,
  tooltip: accessibilityTiming.fast,
  skeleton: accessibilityTiming.slow,
} as const;

/**
 * Type definitions for timing tokens
 */
export type TimingToken = (typeof timing)[keyof typeof timing];
export type ContextTimingToken = (typeof contextTiming)[keyof typeof contextTiming];
export type AccessibilityTimingToken =
  (typeof accessibilityTiming)[keyof typeof accessibilityTiming];
export type AccessibilityContextTimingToken =
  (typeof accessibilityContextTiming)[keyof typeof accessibilityContextTiming];

/**
 * Union type for all timing tokens - AI agents can use this for type safety
 */
export type AllTimingTokens =
  | TimingToken
  | ContextTimingToken
  | AccessibilityTimingToken
  | AccessibilityContextTimingToken;

/**
 * Motion timing intelligence for AI decision-making
 */
export type TimingIntelligence = {
  cognitiveLoad: 1 | 2 | 3 | 5 | 7 | 9;
  trustLevel: 'high' | 'medium' | 'low';
  motionSensitivity: 'safe' | 'reduced' | 'standard' | 'enhanced';
  usagePattern: string;
};

/**
 * Timing metadata for AI agents
 */
export const timingIntelligence: Record<keyof typeof timing, TimingIntelligence> = {
  instant: {
    cognitiveLoad: 1,
    trustLevel: 'high',
    motionSensitivity: 'safe',
    usagePattern: 'Use for all hover states, builds immediate confidence',
  },
  fast: {
    cognitiveLoad: 2,
    trustLevel: 'high',
    motionSensitivity: 'reduced',
    usagePattern: 'Standard for interactive elements requiring immediate feedback',
  },
  standard: {
    cognitiveLoad: 3,
    trustLevel: 'high',
    motionSensitivity: 'standard',
    usagePattern: 'Default choice for most component transitions',
  },
  deliberate: {
    cognitiveLoad: 5,
    trustLevel: 'medium',
    motionSensitivity: 'enhanced',
    usagePattern: 'Use when transitions need to draw user attention or communicate importance',
  },
  slow: {
    cognitiveLoad: 7,
    trustLevel: 'medium',
    motionSensitivity: 'enhanced',
    usagePattern: 'Reserve for large UI changes or page transitions',
  },
  dramatic: {
    cognitiveLoad: 9,
    trustLevel: 'low',
    motionSensitivity: 'enhanced',
    usagePattern: 'Use only for high-stakes interactions requiring deliberate user attention',
  },
};
