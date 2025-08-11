/**
 * Motion Design Patterns
 *
 * Common animation patterns with embedded AI design intelligence.
 * Provides pre-configured motion combinations for AI agents to use.
 */

import { contextEasing, contextTiming } from './index';

/**
 * Animation pattern combining timing and easing with AI intelligence
 */
export type AnimationPattern = {
  timing: string;
  easing: string;
  transition: string;
  cognitiveLoad: number;
  trustLevel: 'high' | 'medium' | 'low';
  usagePattern: string;
  accessibilityNote?: string;
};

/**
 * Common animation patterns for AI agent decision-making
 */
export const animationPatterns = {
  /**
   * Fade In - Gentle appearance
   * AI Intelligence: Low cognitive load, high trust, universal pattern
   */
  fadeIn: {
    timing: contextTiming.modal,
    easing: contextEasing.modalEnter,
    transition: 'opacity',
    cognitiveLoad: 2,
    trustLevel: 'high' as const,
    usagePattern: 'Use for modals, tooltips, dropdowns appearing',
    accessibilityNote: 'Respects prefers-reduced-motion automatically',
  },

  /**
   * Fade Out - Graceful disappearance
   * AI Intelligence: Low cognitive load, high trust, gentle exit
   */
  fadeOut: {
    timing: contextTiming.modal,
    easing: contextEasing.modalExit,
    transition: 'opacity',
    cognitiveLoad: 2,
    trustLevel: 'high' as const,
    usagePattern: 'Use for modals, tooltips, dropdowns disappearing',
    accessibilityNote: 'Maintains spatial awareness during exit',
  },

  /**
   * Slide Up - Directional entrance
   * AI Intelligence: Medium cognitive load, high trust, spatial awareness
   */
  slideUp: {
    timing: contextTiming.modal,
    easing: contextEasing.modalEnter,
    transition: 'transform, opacity',
    cognitiveLoad: 4,
    trustLevel: 'high' as const,
    usagePattern: 'Use for bottom sheets, mobile menus, drawer components',
    accessibilityNote: 'Clear directional movement aids spatial understanding',
  },

  /**
   * Slide Down - Directional exit
   * AI Intelligence: Medium cognitive load, high trust, natural gravity
   */
  slideDown: {
    timing: contextTiming.modal,
    easing: contextEasing.modalExit,
    transition: 'transform, opacity',
    cognitiveLoad: 4,
    trustLevel: 'high' as const,
    usagePattern: 'Use for closing bottom sheets, mobile menus, drawer components',
    accessibilityNote: 'Follows natural gravity expectations',
  },

  /**
   * Scale In - Growing appearance
   * AI Intelligence: Medium cognitive load, high trust, attention-drawing
   */
  scaleIn: {
    timing: contextTiming.modal,
    easing: contextEasing.modalEnter,
    transition: 'transform, opacity',
    cognitiveLoad: 5,
    trustLevel: 'high' as const,
    usagePattern: 'Use for important notifications, success states, pop-overs',
    accessibilityNote: 'Growing motion draws appropriate attention',
  },

  /**
   * Scale Out - Shrinking disappearance
   * AI Intelligence: Medium cognitive load, high trust, graceful exit
   */
  scaleOut: {
    timing: contextTiming.modal,
    easing: contextEasing.modalExit,
    transition: 'transform, opacity',
    cognitiveLoad: 5,
    trustLevel: 'high' as const,
    usagePattern: 'Use for dismissing notifications, closing pop-overs',
    accessibilityNote: 'Shrinking motion indicates completion',
  },

  /**
   * Button Press - Immediate tactile feedback
   * AI Intelligence: Low cognitive load, high trust, instant response
   */
  buttonPress: {
    timing: contextTiming.hover,
    easing: contextEasing.hover,
    transition: 'transform',
    cognitiveLoad: 1,
    trustLevel: 'high' as const,
    usagePattern: 'Use for all button press states, builds confidence',
    accessibilityNote: 'Immediate feedback confirms interaction',
  },

  /**
   * Hover Lift - Subtle elevation
   * AI Intelligence: Low cognitive load, high trust, suggests interactivity
   */
  hoverLift: {
    timing: contextTiming.hover,
    easing: contextEasing.hover,
    transition: 'transform, box-shadow',
    cognitiveLoad: 2,
    trustLevel: 'high' as const,
    usagePattern: 'Use for cards, buttons, interactive elements',
    accessibilityNote: 'Subtle elevation indicates interactivity',
  },

  /**
   * Pulse - Rhythmic attention
   * AI Intelligence: Medium cognitive load, medium trust, use sparingly
   */
  pulse: {
    timing: contextTiming.skeleton,
    easing: contextEasing.loading,
    transition: 'opacity, transform',
    cognitiveLoad: 6,
    trustLevel: 'medium' as const,
    usagePattern: 'Use for loading states, notifications requiring attention',
    accessibilityNote: 'Rhythmic motion can be distracting, use carefully',
  },

  /**
   * Bounce Success - Celebratory feedback
   * AI Intelligence: High cognitive load, high trust, positive reinforcement
   */
  bounceSuccess: {
    timing: contextTiming.toast,
    easing: contextEasing.success,
    transition: 'transform',
    cognitiveLoad: 7,
    trustLevel: 'high' as const,
    usagePattern: 'Use for success confirmations, completed actions',
    accessibilityNote: 'Celebratory motion reinforces positive feedback',
  },

  /**
   * Shake Error - Alert without aggression
   * AI Intelligence: High cognitive load, medium trust, error communication
   */
  shakeError: {
    timing: contextTiming.toast,
    easing: contextEasing.focus,
    transition: 'transform',
    cognitiveLoad: 8,
    trustLevel: 'medium' as const,
    usagePattern: 'Use for form validation errors, input corrections',
    accessibilityNote: 'Brief shake communicates error without frustration',
  },

  /**
   * Progress Linear - Steady advancement
   * AI Intelligence: Low cognitive load, high trust, steady progress
   */
  progressLinear: {
    timing: contextTiming.progress,
    easing: contextEasing.progress,
    transition: 'transform',
    cognitiveLoad: 1,
    trustLevel: 'high' as const,
    usagePattern: 'Use for progress bars, loading indicators',
    accessibilityNote: 'Linear progress clearly shows advancement',
  },
} as const;

/**
 * Animation utilities for AI agents
 */
export const animationUtils = {
  /**
   * Get pattern by cognitive load threshold
   * AI agents can use this to respect user attention limits
   */
  getPatternsByCognitiveLoad: (maxLoad: number) => {
    return Object.entries(animationPatterns)
      .filter(([_, pattern]) => pattern.cognitiveLoad <= maxLoad)
      .map(([name]) => name);
  },

  /**
   * Get patterns by trust level
   * AI agents can use this for high-stakes vs. casual interactions
   */
  getPatternsByTrustLevel: (level: 'high' | 'medium' | 'low') => {
    return Object.entries(animationPatterns)
      .filter(([_, pattern]) => pattern.trustLevel === level)
      .map(([name]) => name);
  },

  /**
   * Get accessibility-safe patterns
   * AI agents can use this to respect motion sensitivity
   */
  getAccessibilityFriendlyPatterns: () => {
    return Object.entries(animationPatterns)
      .filter(([_, pattern]) => pattern.cognitiveLoad <= 5 && pattern.trustLevel === 'high')
      .map(([name]) => name);
  },
} as const;

/**
 * Generate complete animation class string for Tailwind
 */
export const generateAnimationClass = (
  patternName: keyof typeof animationPatterns,
  customClasses?: string
): string => {
  const pattern = animationPatterns[patternName];
  const baseClasses = `${pattern.timing} ${pattern.easing} transition-[${pattern.transition}]`;

  return customClasses ? `${baseClasses} ${customClasses}` : baseClasses;
};

/**
 * Type definitions
 */
export type AnimationPatternName = keyof typeof animationPatterns;
export type AnimationUtility = typeof animationUtils;
