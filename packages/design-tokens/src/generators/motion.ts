/**
 * Motion Tokens Generator - Rafters-Enhanced Tokens
 *
 * Advanced behavioral motion system with semantic timing patterns
 * Provides intelligent durations and easing curves based on user research and interaction psychology
 */

import type { Token } from '../index';

/**
 * Mathematical constants for timing relationships
 */
const GOLDEN_RATIO = 1.618033988749;
// const _FIBONACCI_SEQUENCE = [50, 75, 125, 200, 325, 525, 850]; // Unused

/**
 * Generate motion tokens with typography-aligned expressiveness scale
 *
 * @param system - Mathematical progression matching typography: 'golden', 'major-third', etc.
 * @param baseSpeed - Base duration in ms (default: 75ms for micro-interactions)
 * @param includeAdvancedEasing - Include advanced cubic-bezier curves (default: true)
 *
 * @returns Array of motion tokens with expressiveness scale matching typography curve
 *
 * @example
 * ```typescript
 * // Generate motion scale matching typography golden ratio
 * const motionTokens = generateMotionTokens('golden', 75, true);
 * // Duration tokens: --duration-inform (75ms), --duration-expressive (1200ms)
 * // Follows same mathematical progression as text-xs to text-9xl
 * ```
 */
export function generateMotionTokens(
  system: 'golden' | 'major-third' | 'perfect-fourth' | 'perfect-fifth' = 'golden',
  baseSpeed = 75,
  includeAdvancedEasing = true
): Token[] {
  const tokens: Token[] = [];

  // Motion scale matching typography expressiveness levels
  const expressivenesses = [
    'inform', // Subtle, informational (like text-xs)
    'guide', // Guidance, navigation (like text-sm)
    'standard', // Standard interactions (like text-base)
    'engage', // Engaging, interactive (like text-lg)
    'emphasize', // Emphasized content (like text-xl)
    'focus', // Draw focus/attention (like text-2xl)
    'announce', // Announce changes (like text-3xl)
    'celebrate', // Celebrate success (like text-4xl)
    'hero', // Hero moments (like text-5xl)
    'dramatic', // Dramatic emphasis (like text-6xl)
    'spectacle', // Spectacle/wow moments (like text-7xl)
    'cinematic', // Cinematic experiences (like text-8xl)
    'expressive', // Maximum expressiveness (like text-9xl)
  ];

  // Get the ratio based on system (matching typography)
  let ratio: number;
  switch (system) {
    case 'golden':
      ratio = GOLDEN_RATIO; // 1.618
      break;
    case 'major-third':
      ratio = 1.25; // 5:4 ratio
      break;
    case 'perfect-fourth':
      ratio = 1.333; // 4:3 ratio
      break;
    case 'perfect-fifth':
      ratio = 1.5; // 3:2 ratio
      break;
  }

  // Generate motion durations using same mathematical progression as typography
  for (let i = 0; i < expressivenesses.length; i++) {
    const expressiveness = expressivenesses[i];
    const steps = i - 2; // Start from 'standard' as base (index 2), like typography

    // Use same progression as typography: baseSpeed * ratio^steps
    const value = baseSpeed * ratio ** steps;

    // Determine cognitive load and usage context based on expressiveness level
    const isSubtle = i <= 2; // inform, guide, standard
    const isEngaging = i >= 3 && i <= 5; // engage, emphasize, focus
    const isImpactful = i >= 6 && i <= 8; // announce, celebrate, hero
    const isCinematic = i >= 9; // dramatic, spectacle, cinematic, expressive

    const cognitiveLoad = isSubtle ? 1 : isEngaging ? 3 : isImpactful ? 6 : 9;
    const trustLevel = isCinematic
      ? ('high' as const)
      : isImpactful
        ? ('medium' as const)
        : ('low' as const);

    tokens.push({
      name: expressiveness,
      value: `${Math.round(value)}ms`,
      category: 'motion',
      namespace: 'duration',
      semanticMeaning: `${expressiveness.charAt(0).toUpperCase() + expressiveness.slice(1)} motion timing using ${system} ratio - ${isSubtle ? 'subtle' : isEngaging ? 'engaging' : isImpactful ? 'impactful' : 'cinematic'} expressiveness`,
      scalePosition: i,
      // expressiveness: expressiveness, // Not in Token schema
      cognitiveLoad: cognitiveLoad,
      trustLevel: trustLevel,
      reducedMotionAware: true,
      motionDuration: Math.round(value),
      generateUtilityClass: true,
      applicableComponents: ['all'],
      accessibilityLevel: 'AAA',
      consequence: isCinematic ? 'significant' : 'reversible',
      usageContext: [
        ...(isSubtle ? ['micro-interactions', 'feedback', 'subtle-changes'] : []),
        ...(isEngaging ? ['navigation', 'interactions', 'state-changes'] : []),
        ...(isImpactful ? ['announcements', 'celebrations', 'hero-moments'] : []),
        ...(isCinematic ? ['dramatic-effects', 'cinematic-transitions', 'wow-moments'] : []),
      ],
    });
  }

  // Original easing curves with soul and character
  const easings = [
    {
      name: 'linear',
      value: 'linear',
      meaning: 'Mechanical precision - consistent pace for progress and data',
      personality: 'methodical',
      emotionalTone: 'steady',
      usage: ['progress', 'loading', 'data-viz', 'technical', 'measurement'],
    },
    {
      name: 'breath',
      value: 'ease',
      meaning: 'Natural breathing rhythm - gentle inhale and exhale',
      personality: 'organic',
      emotionalTone: 'calming',
      usage: ['ambient-animations', 'background-motion', 'subtle-pulse'],
    },
    {
      name: 'flow',
      value: 'ease-in-out',
      meaning: 'Water-like flow - smooth acceleration into graceful deceleration',
      personality: 'fluid',
      emotionalTone: 'harmonious',
      usage: ['page-transitions', 'modal-flow', 'content-shifts'],
    },
    {
      name: 'emerge',
      value: 'ease-out',
      meaning: 'Sunrise emergence - elements naturally appearing into view',
      personality: 'welcoming',
      emotionalTone: 'hopeful',
      usage: ['fade-in', 'reveal', 'dropdown-open', 'content-appear'],
    },
    {
      name: 'retreat',
      value: 'ease-in',
      meaning: 'Gentle retreat - elements gracefully withdrawing from view',
      personality: 'respectful',
      emotionalTone: 'peaceful',
      usage: ['fade-out', 'hide', 'dropdown-close', 'content-dismiss'],
    },
    {
      name: 'heartbeat',
      value: 'cubic-bezier(0.4, 0.14, 0.3, 1)',
      meaning: 'Rhythmic pulse - like a heartbeat with natural variation',
      personality: 'alive',
      emotionalTone: 'vital',
      usage: ['notifications', 'alerts', 'pulse-effects', 'life-indicators'],
    },
    {
      name: 'dance',
      value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      meaning: 'Playful dance - joyful overshoot with settling grace',
      personality: 'spirited',
      emotionalTone: 'joyful',
      usage: ['success-celebrations', 'achievements', 'delightful-feedback'],
    },
    {
      name: 'snap',
      value: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
      meaning: 'Crisp snap - immediate response with confident landing',
      personality: 'decisive',
      emotionalTone: 'confident',
      usage: ['button-feedback', 'selections', 'toggle-states'],
    },
  ];

  // Add advanced character-driven easing curves
  if (includeAdvancedEasing) {
    easings.push(
      {
        name: 'bounce',
        value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        meaning: 'Rubber ball bounce - energetic rebound with settling',
        personality: 'playful',
        emotionalTone: 'energetic',
        usage: ['game-interactions', 'fun-feedback', 'child-friendly-ui'],
      },
      {
        name: 'spring',
        value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        meaning: 'Coiled spring release - tension release with oscillation',
        personality: 'dynamic',
        emotionalTone: 'lively',
        usage: ['drawer-open', 'elastic-reveal', 'physics-based'],
      },
      {
        name: 'thunder',
        value: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        meaning: 'Lightning strike - slow buildup to explosive release',
        personality: 'powerful',
        emotionalTone: 'dramatic',
        usage: ['hero-reveals', 'dramatic-entrances', 'impact-moments'],
      },
      {
        name: 'whisper',
        value: 'cubic-bezier(0.16, 1, 0.3, 1)',
        meaning: 'Gentle whisper - soft approach with delicate settling',
        personality: 'subtle',
        emotionalTone: 'intimate',
        usage: ['tooltip-appear', 'hover-hints', 'gentle-reveals'],
      },
      {
        name: 'wind',
        value: 'cubic-bezier(0.23, 1, 0.32, 1)',
        meaning: 'Wind gust - natural acceleration with organic deceleration',
        personality: 'flowing',
        emotionalTone: 'natural',
        usage: ['page-turns', 'card-flips', 'organic-transitions'],
      }
    );
  }

  easings.forEach((easing, index) => {
    tokens.push({
      name: easing.name,
      value: easing.value,
      category: 'easing',
      namespace: 'ease',
      semanticMeaning: easing.meaning,
      scalePosition: index,
      // personality: easing.personality, // Not in Token schema
      // emotionalTone: easing.emotionalTone, // Not in Token schema
      generateUtilityClass: true,
      applicableComponents: ['all'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: easing.name.includes('bounce') || easing.name.includes('elastic') ? 4 : 2,
      trustLevel:
        easing.emotionalTone === 'impactful' || easing.emotionalTone === 'joyful'
          ? 'medium'
          : 'low',
      consequence: 'reversible',
      reducedMotionAware: true,
      usageContext: easing.usage,
    });
  });

  // Behavioral animation tokens - combining duration + easing + transform patterns
  const behaviors = [
    {
      name: 'fade-in',
      properties: { opacity: '0 → 1' },
      defaultDuration: 'engage',
      defaultEasing: 'emerge',
      meaning: 'Element gracefully appears into view',
      personality: 'welcoming',
      usage: ['content-reveal', 'modal-open', 'tooltip-show'],
    },
    {
      name: 'fade-out',
      properties: { opacity: '1 → 0' },
      defaultDuration: 'guide',
      defaultEasing: 'retreat',
      meaning: 'Element gracefully disappears from view',
      personality: 'respectful',
      usage: ['content-hide', 'modal-close', 'tooltip-hide'],
    },
    {
      name: 'grow',
      properties: { transform: 'scale(0) → scale(1)' },
      defaultDuration: 'emphasize',
      defaultEasing: 'spring',
      meaning: 'Element expands from nothing to full size',
      personality: 'emerging',
      usage: ['button-reveal', 'icon-appear', 'emphasis'],
    },
    {
      name: 'shrink',
      properties: { transform: 'scale(1) → scale(0)' },
      defaultDuration: 'engage',
      defaultEasing: 'snap',
      meaning: 'Element contracts to nothing',
      personality: 'decisive',
      usage: ['button-hide', 'remove-items', 'collapse'],
    },
    {
      name: 'rise',
      properties: { transform: 'translateY(100%) → translateY(0)' },
      defaultDuration: 'flowing',
      defaultEasing: 'flow',
      meaning: 'Element rises from below into position',
      personality: 'uplifting',
      usage: ['toast-notifications', 'bottom-sheet', 'mobile-drawer'],
    },
    {
      name: 'fall',
      properties: { transform: 'translateY(-100%) → translateY(0)' },
      defaultDuration: 'flowing',
      defaultEasing: 'flow',
      meaning: 'Element falls from above into position',
      personality: 'descending',
      usage: ['dropdown-menu', 'notification-banner', 'top-drawer'],
    },
    {
      name: 'lift',
      properties: { transform: 'translateY(0) → translateY(-100%)' },
      defaultDuration: 'standard',
      defaultEasing: 'emerge',
      meaning: 'Element lifts upward out of view',
      personality: 'ascending',
      usage: ['page-exit-up', 'floating-elements', 'elevation'],
    },
    {
      name: 'drop',
      properties: { transform: 'translateY(0) → translateY(100%)' },
      defaultDuration: 'standard',
      defaultEasing: 'retreat',
      meaning: 'Element drops downward out of view',
      personality: 'grounding',
      usage: ['page-exit-down', 'dismissed-items', 'gravity'],
    },
    {
      name: 'pop',
      properties: { transform: 'scale(0) → scale(1.1) → scale(1)' },
      defaultDuration: 'focus',
      defaultEasing: 'bounce',
      meaning: 'Element pops into view with playful overshoot',
      personality: 'energetic',
      usage: ['success-feedback', 'achievements', 'fun-reveals'],
    },
    {
      name: 'color-shift',
      properties: { backgroundColor: 'currentColor → targetColor' },
      defaultDuration: 'emphasize',
      defaultEasing: 'flow',
      meaning: 'Element smoothly transitions between colors',
      personality: 'transformative',
      usage: ['theme-changes', 'state-indicators', 'mood-shifts'],
    },
    {
      name: 'glow',
      properties: { boxShadow: 'none → 0 0 20px currentColor' },
      defaultDuration: 'heartbeat',
      defaultEasing: 'breath',
      meaning: 'Element gains luminous emphasis',
      personality: 'radiant',
      usage: ['focus-states', 'active-elements', 'attention-drawing'],
    },
    {
      name: 'pulse',
      properties: { transform: 'scale(1) → scale(1.05) → scale(1)' },
      defaultDuration: 'heartbeat',
      defaultEasing: 'heartbeat',
      meaning: 'Element rhythmically expands and contracts',
      personality: 'alive',
      usage: ['loading-states', 'waiting-indicators', 'life-signs'],
    },
  ];

  behaviors.forEach((behavior, index) => {
    tokens.push({
      name: behavior.name,
      value: JSON.stringify({
        properties: behavior.properties,
        duration: `var(--duration-${behavior.defaultDuration})`,
        easing: `var(--ease-${behavior.defaultEasing})`,
      }),
      category: 'behavior',
      namespace: 'animate',
      semanticMeaning: behavior.meaning,
      scalePosition: index,
      // personality: behavior.personality, // Not in Token schema
      // defaultDuration: behavior.defaultDuration, // Not in Token schema
      // defaultEasing: behavior.defaultEasing, // Not in Token schema
      // animationProperties: behavior.properties, // Not in Token schema
      generateUtilityClass: true,
      applicableComponents: ['all'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: behavior.name.includes('pop') || behavior.name.includes('bounce') ? 4 : 2,
      trustLevel: 'low',
      consequence: 'reversible',
      reducedMotionAware: true,
      usageContext: behavior.usage,
    });
  });

  return tokens;
}
