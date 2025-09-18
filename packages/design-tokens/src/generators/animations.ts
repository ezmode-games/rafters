/**
 * Animations Generator - Rafters-Enhanced Tokens
 *
 * Complete animation system replacing Tailwind v4's removed base animations
 * Provides keyframes + timing + easing in semantic, behavioral tokens
 */

import type { Token } from '../index';

// Type for animation keyframes
type AnimationKeyframes = Record<string, Record<string, string>>;

/**
 * Generate complete animation tokens with keyframes and intelligent defaults
 *
 * @param includeExperimental - Include experimental/playful animations (default: true)
 *
 * @returns Array of complete animation tokens with keyframes and behavioral intelligence
 *
 * @example
 * ```typescript
 * // Generate complete animation system
 * const animations = generateAnimations(true);
 * // Result: --animate-fade-in with keyframes, duration, and easing
 * // Powers: animate-fade-in utility class
 * ```
 */
export function generateAnimations(includeExperimental = true): Token[] {
  const tokens: Token[] = [];

  // Core animation definitions with keyframes
  const animations: Array<{
    name: string;
    keyframes: AnimationKeyframes;
    duration: string;
    easing: string;
    fillMode?: string;
    meaning: string;
    personality: string;
    usage: string[];
    cognitiveLoad: number;
    iterationCount?: string;
  }> = [
    {
      name: 'fade-in',
      keyframes: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      duration: 'var(--duration-engage)',
      easing: 'var(--ease-emerge)',
      fillMode: 'both',
      meaning: 'Element gracefully appears into view',
      personality: 'welcoming',
      usage: ['content-reveal', 'modal-open', 'tooltip-show'],
      cognitiveLoad: 2,
    },
    {
      name: 'fade-out',
      keyframes: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      duration: 'var(--duration-guide)',
      easing: 'var(--ease-retreat)',
      fillMode: 'both',
      meaning: 'Element gracefully disappears from view',
      personality: 'respectful',
      usage: ['content-hide', 'modal-close', 'tooltip-hide'],
      cognitiveLoad: 2,
    },
    {
      name: 'scale-in',
      keyframes: {
        '0%': { transform: 'scale(0)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
      duration: 'var(--duration-emphasize)',
      easing: 'var(--ease-spring)',
      fillMode: 'both',
      meaning: 'Element grows from nothing with spring energy',
      personality: 'emerging',
      usage: ['button-reveal', 'icon-appear', 'emphasis'],
      cognitiveLoad: 3,
    },
    {
      name: 'scale-out',
      keyframes: {
        '0%': { transform: 'scale(1)', opacity: '1' },
        '100%': { transform: 'scale(0)', opacity: '0' },
      },
      duration: 'var(--duration-engage)',
      easing: 'var(--ease-snap)',
      fillMode: 'both',
      meaning: 'Element shrinks to nothing decisively',
      personality: 'decisive',
      usage: ['button-hide', 'remove-items', 'collapse'],
      cognitiveLoad: 3,
    },
    {
      name: 'slide-up',
      keyframes: {
        '0%': { transform: 'translateY(100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      duration: 'var(--duration-flowing)',
      easing: 'var(--ease-flow)',
      fillMode: 'both',
      meaning: 'Element rises from below with fluid motion',
      personality: 'uplifting',
      usage: ['toast-notifications', 'bottom-sheet', 'mobile-drawer'],
      cognitiveLoad: 4,
    },
    {
      name: 'slide-down',
      keyframes: {
        '0%': { transform: 'translateY(-100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      duration: 'var(--duration-flowing)',
      easing: 'var(--ease-flow)',
      fillMode: 'both',
      meaning: 'Element descends from above with fluid motion',
      personality: 'descending',
      usage: ['dropdown-menu', 'notification-banner', 'top-drawer'],
      cognitiveLoad: 4,
    },
    {
      name: 'slide-left',
      keyframes: {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      duration: 'var(--duration-flowing)',
      easing: 'var(--ease-flow)',
      fillMode: 'both',
      meaning: 'Element slides in from the right',
      personality: 'approaching',
      usage: ['sidebar-reveal', 'page-transition', 'content-slide'],
      cognitiveLoad: 4,
    },
    {
      name: 'slide-right',
      keyframes: {
        '0%': { transform: 'translateX(-100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      duration: 'var(--duration-flowing)',
      easing: 'var(--ease-flow)',
      fillMode: 'both',
      meaning: 'Element slides in from the left',
      personality: 'approaching',
      usage: ['sidebar-reveal', 'page-transition', 'content-slide'],
      cognitiveLoad: 4,
    },
    {
      name: 'spin',
      keyframes: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      duration: 'var(--duration-thoughtful)',
      easing: 'linear',
      iterationCount: 'infinite',
      meaning: 'Continuous rotation for loading states',
      personality: 'persistent',
      usage: ['loading-spinner', 'processing', 'infinite-rotation'],
      cognitiveLoad: 3,
    },
    {
      name: 'pulse',
      keyframes: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.5' },
      },
      duration: 'var(--duration-thoughtful)',
      easing: 'var(--ease-breath)',
      iterationCount: 'infinite',
      meaning: 'Rhythmic opacity breathing for loading',
      personality: 'alive',
      usage: ['loading-pulse', 'waiting-indicator', 'heartbeat'],
      cognitiveLoad: 2,
    },
    {
      name: 'bounce',
      keyframes: {
        '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
        '40%, 43%': { transform: 'translateY(-15px)' },
        '70%': { transform: 'translateY(-7px)' },
        '90%': { transform: 'translateY(-3px)' },
      },
      duration: 'var(--duration-ceremonial)',
      easing: 'var(--ease-bounce)',
      fillMode: 'both',
      meaning: 'Playful bouncing motion with physics',
      personality: 'joyful',
      usage: ['success-celebration', 'achievement', 'playful-feedback'],
      cognitiveLoad: 5,
    },
    {
      name: 'wiggle',
      keyframes: {
        '0%, 100%': { transform: 'rotate(0deg)' },
        '25%': { transform: 'rotate(3deg)' },
        '75%': { transform: 'rotate(-3deg)' },
      },
      duration: 'var(--duration-snappy)',
      easing: 'var(--ease-snap)',
      iterationCount: '3',
      fillMode: 'both',
      meaning: 'Attention-getting wiggle motion',
      personality: 'playful',
      usage: ['error-feedback', 'attention-grab', 'invalid-input'],
      cognitiveLoad: 4,
    },
  ];

  // Add experimental/playful animations
  if (includeExperimental) {
    animations.push(
      {
        name: 'heartbeat',
        keyframes: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        duration: 'var(--duration-ceremonial)',
        easing: 'var(--ease-heartbeat)',
        iterationCount: 'infinite',
        meaning: 'Realistic heartbeat rhythm with dual pulse',
        personality: 'vital',
        usage: ['life-indicators', 'health-apps', 'vital-signs'],
        cognitiveLoad: 3,
      },
      {
        name: 'float',
        keyframes: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        duration: 'var(--duration-ceremonial)',
        easing: 'var(--ease-breath)',
        iterationCount: 'infinite',
        meaning: 'Gentle floating motion like breathing',
        personality: 'serene',
        usage: ['floating-elements', 'ambient-motion', 'zen-ui'],
        cognitiveLoad: 2,
      },
      {
        name: 'glow-pulse',
        keyframes: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        duration: 'var(--duration-thoughtful)',
        easing: 'var(--ease-breath)',
        iterationCount: 'infinite',
        meaning: 'Luminous pulsing glow effect',
        personality: 'radiant',
        usage: ['focus-emphasis', 'magical-effects', 'attention-glow'],
        cognitiveLoad: 4,
      },
      {
        name: 'typewriter',
        keyframes: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        duration: 'var(--duration-cinematic)',
        easing: 'steps(20, end)',
        fillMode: 'both',
        meaning: 'Typewriter text reveal effect',
        personality: 'revealing',
        usage: ['text-reveal', 'typing-effect', 'sequential-reveal'],
        cognitiveLoad: 3,
      }
    );
  }

  // Generate animation tokens
  animations.forEach((animation, index) => {
    // Main animation token with complete definition
    tokens.push({
      name: animation.name,
      value: JSON.stringify({
        keyframes: animation.keyframes,
        duration: animation.duration,
        timingFunction: animation.easing,
        fillMode: animation.fillMode || 'none',
        iterationCount: animation.iterationCount || '1',
      }),
      category: 'animation',
      namespace: 'animate',
      semanticMeaning: animation.meaning,
      scalePosition: index,
      // personality: animation.personality, // Not in Token schema
      generateUtilityClass: true,
      applicableComponents: ['all'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: animation.cognitiveLoad,
      trustLevel: animation.cognitiveLoad > 4 ? 'medium' : 'low',
      consequence: 'reversible',
      reducedMotionAware: true,
      usageContext: animation.usage,
      // animationKeyframes: animation.keyframes, // Not in Token schema
      // defaultDuration: animation.duration, // Not in Token schema
      // defaultEasing: animation.easing, // Not in Token schema
      // iterationCount: animation.iterationCount, // Not in Token schema
    });

    // Separate keyframes token for advanced usage
    tokens.push({
      name: `${animation.name}-keyframes`,
      value: JSON.stringify(animation.keyframes),
      category: 'keyframes',
      namespace: 'keyframes',
      semanticMeaning: `Keyframes definition for ${animation.name} animation`,
      scalePosition: index,
      generateUtilityClass: false,
      applicableComponents: ['all'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: 1,
      trustLevel: 'low',
      consequence: 'reversible',
      usageContext: ['custom-animations', 'advanced-composition'],
    });
  });

  return tokens;
}
