import { z } from 'zod';

/**
 * Motion Design System Schema
 *
 * AI Intelligence schema for motion tokens with embedded design reasoning.
 * Provides semantic motion vocabulary for AI agent decision-making.
 */

// Motion token schema matching the TokenSchema structure
const MotionTokenSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string().optional(),
  category: z.enum(['timing', 'easing']),
  type: z.enum(['static', 'dynamic']),
  semanticGroup: z.enum(['core', 'interactive', 'semantic-state']).optional(),
  aiIntelligence: z
    .object({
      cognitiveLoad: z.number().min(1).max(10).optional(),
      trustLevel: z.enum(['low', 'medium', 'high']).optional(),
      accessibilityLevel: z.enum(['aa', 'aaa']).optional(),
      consequence: z.enum(['reversible', 'significant', 'permanent', 'destructive']).optional(),
      motionSensitivity: z.enum(['safe', 'reduced', 'standard', 'enhanced']).optional(),
      usagePattern: z.string().optional(),
    })
    .optional(),
});

/**
 * Timing System Schema - Duration tokens for AI agents
 */
export const TimingSystemSchema = z.object({
  instant: MotionTokenSchema.default({
    name: 'instant',
    value: 'duration-75 motion-reduce:duration-[1ms]',
    description:
      'Instant feedback for hover states and micro-interactions. AI Intelligence: cognitiveLoad=1, trustLevel=high, imperceptible motion.',
    category: 'timing',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'safe',
      usagePattern: 'Use for all hover states, builds immediate confidence',
    },
  }),

  fast: MotionTokenSchema.default({
    name: 'fast',
    value: 'duration-150 motion-reduce:duration-[50ms]',
    description:
      'Fast interactions like button presses and menu reveals. AI Intelligence: cognitiveLoad=2, trustLevel=high, immediate feedback.',
    category: 'timing',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'reduced',
      usagePattern: 'Standard for interactive elements requiring immediate feedback',
    },
  }),

  standard: MotionTokenSchema.default({
    name: 'standard',
    value: 'duration-300 motion-reduce:duration-[100ms]',
    description:
      'Standard component transitions and state changes. AI Intelligence: cognitiveLoad=3, trustLevel=high, balanced smoothness.',
    category: 'timing',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'standard',
      usagePattern: 'Default choice for most component transitions',
    },
  }),

  deliberate: MotionTokenSchema.default({
    name: 'deliberate',
    value: 'duration-500 motion-reduce:duration-[150ms]',
    description:
      'Deliberate transitions that need user attention. AI Intelligence: cognitiveLoad=5, trustLevel=medium, attention-drawing.',
    category: 'timing',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'medium',
      accessibilityLevel: 'aaa',
      consequence: 'significant',
      motionSensitivity: 'enhanced',
      usagePattern: 'Use when transitions need to draw user attention or communicate importance',
    },
  }),

  slow: MotionTokenSchema.default({
    name: 'slow',
    value: 'duration-700 motion-reduce:duration-[200ms]',
    description:
      'Slow, graceful transitions for large UI changes. AI Intelligence: cognitiveLoad=7, trustLevel=medium, use sparingly.',
    category: 'timing',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 7,
      trustLevel: 'medium',
      accessibilityLevel: 'aa',
      consequence: 'significant',
      motionSensitivity: 'enhanced',
      usagePattern: 'Reserve for large UI changes or page transitions',
    },
  }),

  dramatic: MotionTokenSchema.default({
    name: 'dramatic',
    value: 'duration-1000 motion-reduce:duration-[250ms]',
    description:
      'Very slow transitions for dramatic effect or loading states. AI Intelligence: cognitiveLoad=9, trustLevel=low, high consequence only.',
    category: 'timing',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 9,
      trustLevel: 'low',
      accessibilityLevel: 'aa',
      consequence: 'significant',
      motionSensitivity: 'enhanced',
      usagePattern: 'Use only for high-stakes interactions requiring deliberate user attention',
    },
  }),
});

/**
 * Easing System Schema - Timing function tokens for AI agents
 */
export const EasingSystemSchema = z.object({
  linear: MotionTokenSchema.default({
    name: 'linear',
    value: 'ease-linear',
    description:
      'No easing - constant speed throughout. AI Intelligence: Use for progress bars, loading spinners, data visualization.',
    category: 'easing',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 1,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'safe',
      usagePattern: 'Use for progress indicators and continuous motion',
    },
  }),

  smooth: MotionTokenSchema.default({
    name: 'smooth',
    value: 'ease-in-out',
    description:
      'Natural motion that feels smooth and organic. AI Intelligence: Default choice, builds trust through natural movement.',
    category: 'easing',
    type: 'static',
    semanticGroup: 'core',
    aiIntelligence: {
      cognitiveLoad: 2,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'standard',
      usagePattern: 'Default easing for most transitions, feels natural and organic',
    },
  }),

  accelerating: MotionTokenSchema.default({
    name: 'accelerating',
    value: 'ease-out',
    description:
      'Starts slow, accelerates toward the end. AI Intelligence: Use for elements appearing, creates welcoming entry.',
    category: 'easing',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'standard',
      usagePattern: 'Use for elements entering view, modals appearing, expanding content',
    },
  }),

  decelerating: MotionTokenSchema.default({
    name: 'decelerating',
    value: 'ease-in',
    description:
      'Starts fast, decelerates toward the end. AI Intelligence: Use for elements disappearing, graceful exit.',
    category: 'easing',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'standard',
      usagePattern: 'Use for elements exiting view, modals closing, collapsing content',
    },
  }),

  bouncy: MotionTokenSchema.default({
    name: 'bouncy',
    value: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
    description:
      'Bouncy, playful motion with spring-like feel. AI Intelligence: Use for success states, celebration, positive feedback.',
    category: 'easing',
    type: 'static',
    semanticGroup: 'semantic-state',
    aiIntelligence: {
      cognitiveLoad: 5,
      trustLevel: 'high',
      accessibilityLevel: 'aa',
      consequence: 'reversible',
      motionSensitivity: 'enhanced',
      usagePattern: 'Use for success animations, positive feedback, celebratory moments',
    },
  }),

  snappy: MotionTokenSchema.default({
    name: 'snappy',
    value: 'ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
    description:
      'Sharp, snappy motion for immediate feedback. AI Intelligence: Use for button presses, toggles, interactive elements.',
    category: 'easing',
    type: 'static',
    semanticGroup: 'interactive',
    aiIntelligence: {
      cognitiveLoad: 3,
      trustLevel: 'high',
      accessibilityLevel: 'aaa',
      consequence: 'reversible',
      motionSensitivity: 'standard',
      usagePattern: 'Use for button presses, toggles, hover effects requiring immediate feedback',
    },
  }),
});

/**
 * Complete Motion System Schema
 */
export const MotionSystemSchema = z.object({
  timing: TimingSystemSchema,
  easing: EasingSystemSchema,
});

export type MotionSystem = z.infer<typeof MotionSystemSchema>;
export type TimingSystem = z.infer<typeof TimingSystemSchema>;
export type EasingSystem = z.infer<typeof EasingSystemSchema>;
