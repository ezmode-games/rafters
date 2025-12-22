/**
 * Motion Generator
 *
 * Generates motion tokens (duration, easing, delay) using mathematical progressions
 * from @rafters/math-utils. Uses minor-third (1.2) ratio by default for harmonious
 * timing that feels connected to the spacing system.
 *
 * This generator uses step-based progression: value = base * ratio^step
 * - step 0 = base value
 * - step 1 = base * ratio (slower)
 * - step -1 = base / ratio (faster)
 *
 * This generator is a pure function - it receives motion definitions as input.
 * Default motion values are provided by the orchestrator from defaults.ts.
 */

import { createProgression } from '@rafters/math-utils';
import type { Token } from '@rafters/shared';
import type { DelayDef, DurationDef, EasingDef } from './defaults.js';
import type { GeneratorResult, ResolvedSystemConfig } from './types.js';
import { EASING_CURVES, MOTION_DURATION_SCALE } from './types.js';

/**
 * Generate motion tokens from provided definitions
 */
export function generateMotionTokens(
  config: ResolvedSystemConfig,
  durationDefs: Record<string, DurationDef>,
  easingDefs: Record<string, EasingDef>,
  delayDefs: Record<string, DelayDef>,
): GeneratorResult {
  const tokens: Token[] = [];
  const timestamp = new Date().toISOString();
  const { baseTransitionDuration, progressionRatio } = config;

  // Create progression for computing values
  const progression = createProgression(progressionRatio as 'minor-third');

  // Base duration token
  tokens.push({
    name: 'motion-duration-base',
    value: `${baseTransitionDuration}ms`,
    category: 'motion',
    namespace: 'motion',
    semanticMeaning: 'Base transition duration - all motion timing derives from this',
    usageContext: ['calculation-reference'],
    progressionSystem: progressionRatio as 'minor-third',
    description: `Base duration (${baseTransitionDuration}ms). Motion uses ${progressionRatio} progression (ratio ${progression.ratio}).`,
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
    const def = durationDefs[scale];
    if (!def) continue;
    const scaleIndex = MOTION_DURATION_SCALE.indexOf(scale);

    let durationMs: number;
    let mathRelationship: string;

    if (def.step === 'instant') {
      durationMs = 0;
      mathRelationship = '0';
    } else {
      // Use progression.compute() for step-based calculation
      durationMs = Math.round(progression.compute(baseTransitionDuration, def.step));
      mathRelationship =
        def.step === 0
          ? `${baseTransitionDuration}ms (base)`
          : `${baseTransitionDuration} × ${progression.ratio}^${def.step}`;
    }

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
      mathRelationship,
      dependsOn: def.step === 'instant' ? [] : ['motion-duration-base'],
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
    const def = easingDefs[curve];
    if (!def) continue;

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
  for (const [name, def] of Object.entries(delayDefs)) {
    let delayMs: number;
    let mathRelationship: string;

    if (def.step === 'none') {
      delayMs = 0;
      mathRelationship = '0';
    } else {
      // Use progression.compute() for step-based calculation
      delayMs = Math.round(progression.compute(baseTransitionDuration, def.step));
      mathRelationship =
        def.step === 0
          ? `${baseTransitionDuration}ms (base)`
          : `${baseTransitionDuration} × ${progression.ratio}^${def.step}`;
    }

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
      mathRelationship,
      dependsOn: def.step === 'none' ? [] : ['motion-duration-base'],
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
    const durationDef = durationDefs[comp.duration];
    const easingDef = easingDefs[comp.easing];
    if (!durationDef || !easingDef) continue;

    let durationMs: number;
    if (durationDef.step === 'instant') {
      durationMs = 0;
    } else {
      durationMs = Math.round(progression.compute(baseTransitionDuration, durationDef.step));
    }

    tokens.push({
      name: comp.name,
      value: `${durationMs}ms ${easingDef.css}`,
      category: 'motion',
      namespace: 'motion',
      semanticMeaning: comp.meaning,
      usageContext: comp.contexts,
      motionDuration: durationMs,
      easingCurve: easingDef.curve,
      easingName: comp.easing as (typeof EASING_CURVES)[number],
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
      ratioValue: progression.ratio,
      baseDuration: baseTransitionDuration,
      note: 'Motion timing uses step-based progression (base * ratio^step) for unified feel',
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
