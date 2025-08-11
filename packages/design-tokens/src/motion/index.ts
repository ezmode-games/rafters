/**
 * Motion Design Tokens - Main Export
 *
 * Complete motion design system with embedded AI intelligence for informed UX decisions.
 * Provides semantic timing, easing, and animation patterns for AI agents.
 */

// Export timing system
export * from './timing';

// Export easing system
export * from './easing';

// Export animation patterns
export * from './patterns';

// Re-export commonly used items for convenience
export {
  timing,
  contextTiming,
  accessibilityTiming,
  accessibilityContextTiming,
  timingIntelligence,
  type TimingToken,
  type ContextTimingToken,
  type AccessibilityTimingToken,
  type AccessibilityContextTimingToken,
  type AllTimingTokens,
  type TimingIntelligence,
} from './timing';

export {
  easing,
  contextEasing,
  motionEasing,
  easingIntelligence,
  type EasingToken,
  type ContextEasingToken,
  type MotionEasingToken,
  type AllEasingTokens,
  type EasingIntelligence,
} from './easing';

export {
  animationPatterns,
  animationUtils,
  generateAnimationClass,
  type AnimationPattern,
  type AnimationPatternName,
  type AnimationUtility,
} from './patterns';
