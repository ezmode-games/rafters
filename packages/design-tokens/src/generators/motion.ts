/**
 * Motion Generator
 *
 * Generates motion tokens (duration, easing, delay) derived from the spacing progression.
 * Uses minor-third (1.2) ratio for harmonious timing that feels connected to the spacing.
 *
 * Motion timing follows spacing to create a unified feel:
 * - Small spacing = fast animations
 * - Large spacing = slower, more deliberate animations
 */

import type { Token } from '@rafters/shared';
import { getRatio } from '@rafters/math-utils';
import type { ResolvedSystemConfig, GeneratorResult } from './types.js';
import { MOTION_DURATION_SCALE, EASING_CURVES } from './types.js';

/**
 * Duration definitions
 * Base duration (150ms) scaled by minor-third progression
 */
interface DurationDef {
  multiplier: number;
  meaning: string;
  contexts: string[];
  motionIntent: 'enter' | 'exit' | 'emphasis' | 'transition';
}

const DURATION_DEFINITIONS: Record<string, DurationDef> = {
  instant: {
    multiplier: 0,
    meaning: 'Instant - no animation',
    contexts: ['disabled-motion', 'prefers-reduced-motion'],
    motionIntent: 'transition',
  },
  fast: {
    multiplier: 0.667, // ~100ms at base 150
    meaning: 'Fast - micro-interactions, hover states',
    contexts: ['hover', 'focus', 'active', 'micro-feedback'],
    motionIntent: 'transition',
  },
  normal: {
    multiplier: 1, // 150ms
    meaning: 'Normal - standard UI transitions',
    contexts: ['buttons', 'toggles', 'state-changes'],
    motionIntent: 'transition',
  },
  slow: {
    multiplier: 1.5, // ~225ms
    meaning: 'Slow - enter/exit animations',
    contexts: ['modals', 'dialogs', 'panels', 'enter-exit'],
    motionIntent: 'enter',
  },
  slower: {
    multiplier: 2, // 300ms
    meaning: 'Slower - emphasis, large element transitions',
    contexts: ['page-transitions', 'hero-animations', 'emphasis'],
    motionIntent: 'emphasis',
  },
};

/**
 * Easing curve definitions
 * CSS cubic-bezier values for different motion feels
 */
interface EasingDef {
  curve: [number, number, number, number];
  meaning: string;
  contexts: string[];
  css: string;
}

const EASING_DEFINITIONS: Record<string, EasingDef> = {
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

/**
 * Delay scale (derived from duration)
 */
const DELAY_MULTIPLIERS = {
  none: 0,
  short: 0.5,
  medium: 1,
  long: 2,
};

/**
 * Generate motion tokens
 */
export function generateMotionTokens(config: ResolvedSystemConfig): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { baseTransitionDuration, progressionRatio } = config;
  const ratioValue = getRatio(progressionRatio);

  // Base duration token
  tokens.push({
    name: 'motion-duration-base',
    value: `${baseTransitionDuration}ms`,
    category: 'motion',
    namespace: 'motion',
    semanticMeaning: 'Base transition duration - all motion timing derives from this',
    usageContext: ['calculation-reference'],
    progressionSystem: progressionRatio as 'minor-third',
    description: `Base duration (${baseTransitionDuration}ms). Motion uses ${progressionRatio} ratio (${ratioValue}).`,
    generatedAt: timestamp,
    containerQueryAware: false,
    reducedMotionAware: true,
    usagePatterns: {
      do: ['Reference as the calculation base'],
      never: ['Change without understanding full motion scale impact'],
    },
  });

  // Generate duration tokens
  for (const scale of MOTION_DURATION_SCALE) {
    const def = DURATION_DEFINITIONS[scale]!;
    const scaleIndex = MOTION_DURATION_SCALE.indexOf(scale);
    const durationMs = Math.round(baseTransitionDuration * def.multiplier);

    tokens.push({
      name: `motion-duration-${scale}`,
      value: durationMs === 0 ? '0ms' : `${durationMs}ms`,
      category: 'motion',
      namespace: 'motion',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      scalePosition: scaleIndex,
      progressionSystem: progressionRatio as 'minor-third',
      motionIntent: def.motionIntent,
      motionDuration: durationMs,
      mathRelationship: `${baseTransitionDuration}ms × ${def.multiplier}`,
      dependsOn: scale === 'instant' ? [] : ['motion-duration-base'],
      description: `Duration ${scale}: ${durationMs}ms. ${def.meaning}`,
      generatedAt: timestamp,
      containerQueryAware: false,
      reducedMotionAware: true,
      usagePatterns: {
        do:
          scale === 'instant'
            ? ['Use for prefers-reduced-motion', 'Use for disabled animations']
            : scale === 'fast'
              ? ['Use for hover/focus states', 'Use for micro-interactions']
              : scale === 'normal'
                ? ['Use for most UI transitions', 'Use for state changes']
                : ['Use for enter/exit animations', 'Use for emphasis'],
        never: ['Ignore prefers-reduced-motion', 'Use slow animations for frequent actions'],
      },
    });
  }

  // Generate easing tokens
  for (const curve of EASING_CURVES) {
    const def = EASING_DEFINITIONS[curve]!;

    tokens.push({
      name: `motion-easing-${curve}`,
      value: def.css,
      category: 'motion',
      namespace: 'motion',
      semanticMeaning: def.meaning,
      usageContext: def.contexts,
      easingCurve: def.curve,
      easingName: curve,
      description: `Easing ${curve}: ${def.css}. ${def.meaning}`,
      generatedAt: timestamp,
      containerQueryAware: false,
      reducedMotionAware: true,
      usagePatterns: {
        do:
          curve === 'linear'
            ? ['Use for opacity fades', 'Use for progress indicators']
            : curve === 'ease-out'
              ? ['Use for entering elements', 'Use for appearing content']
              : curve === 'ease-in'
                ? ['Use for exiting elements', 'Use for disappearing content']
                : ['Use for general transitions', 'Match context to curve feel'],
        never: [
          'Use ease-in for entering (feels sluggish)',
          'Use ease-out for exiting (feels abrupt)',
        ],
      },
    });
  }

  // Generate delay tokens
  for (const [name, multiplier] of Object.entries(DELAY_MULTIPLIERS)) {
    const delayMs = Math.round(baseTransitionDuration * multiplier);

    tokens.push({
      name: `motion-delay-${name}`,
      value: delayMs === 0 ? '0ms' : `${delayMs}ms`,
      category: 'motion',
      namespace: 'motion',
      semanticMeaning: `${name.charAt(0).toUpperCase() + name.slice(1)} animation delay`,
      usageContext:
        name === 'none'
          ? ['immediate-response']
          : name === 'short'
            ? ['staggered-lists', 'sequential-elements']
            : name === 'medium'
              ? ['modal-content', 'after-transition']
              : ['emphasis', 'dramatic-reveals'],
      delayMs,
      mathRelationship: `${baseTransitionDuration}ms × ${multiplier}`,
      dependsOn: name === 'none' ? [] : ['motion-duration-base'],
      description: `Delay ${name}: ${delayMs}ms. Based on duration progression.`,
      generatedAt: timestamp,
      containerQueryAware: false,
      reducedMotionAware: true,
    });
  }

  // Composite animation tokens for common patterns
  const composites = [
    {
      name: 'motion-fade-in',
      duration: 'fast',
      easing: 'ease-out',
      meaning: 'Fade in animation preset',
      contexts: ['fade-in', 'appear'],
    },
    {
      name: 'motion-fade-out',
      duration: 'fast',
      easing: 'ease-in',
      meaning: 'Fade out animation preset',
      contexts: ['fade-out', 'disappear'],
    },
    {
      name: 'motion-slide-in',
      duration: 'normal',
      easing: 'ease-out',
      meaning: 'Slide in animation preset',
      contexts: ['slide-in', 'panel-enter', 'modal-enter'],
    },
    {
      name: 'motion-slide-out',
      duration: 'fast',
      easing: 'ease-in',
      meaning: 'Slide out animation preset',
      contexts: ['slide-out', 'panel-exit', 'modal-exit'],
    },
    {
      name: 'motion-scale-in',
      duration: 'normal',
      easing: 'spring',
      meaning: 'Scale in with spring animation',
      contexts: ['pop-in', 'button-press', 'emphasis'],
    },
  ];

  for (const comp of composites) {
    const durationDef = DURATION_DEFINITIONS[comp.duration]!;
    const durationMs = Math.round(baseTransitionDuration * durationDef.multiplier);
    const easingDef = EASING_DEFINITIONS[comp.easing]!;

    tokens.push({
      name: comp.name,
      value: `${durationMs}ms ${easingDef.css}`,
      category: 'motion',
      namespace: 'motion',
      semanticMeaning: comp.meaning,
      usageContext: comp.contexts,
      motionDuration: durationMs,
      easingCurve: easingDef.curve,
      easingName: comp.easing as typeof EASING_CURVES[number],
      dependsOn: [`motion-duration-${comp.duration}`, `motion-easing-${comp.easing}`],
      description: `${comp.meaning}. Combines ${comp.duration} duration with ${comp.easing} easing.`,
      generatedAt: timestamp,
      containerQueryAware: false,
      reducedMotionAware: true,
    });
  }

  // Motion progression metadata
  tokens.push({
    name: 'motion-progression',
    value: JSON.stringify({
      ratio: progressionRatio,
      ratioValue,
      baseDuration: baseTransitionDuration,
      note: 'Motion timing derived from spacing progression for unified feel',
    }),
    category: 'motion',
    namespace: 'motion',
    semanticMeaning: 'Metadata about the motion progression system',
    description: `Motion uses ${progressionRatio} progression from ${baseTransitionDuration}ms base.`,
    generatedAt: timestamp,
    containerQueryAware: false,
  });

  return {
    namespace: 'motion',
    tokens,
  };
}
