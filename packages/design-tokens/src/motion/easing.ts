/**
 * Motion Design Tokens - Easing
 *
 * Semantic easing tokens with embedded AI design intelligence.
 * Maps to Tailwind CSS timing function utilities for informed motion decisions.
 */

export const easing = {
  /**
   * No easing - constant speed throughout
   * Maps to: ease-linear
   * AI Intelligence: Use for progress bars, loading spinners, data visualization
   */
  linear: 'ease-linear',

  /**
   * Natural motion that feels smooth and organic
   * Maps to: ease-in-out (cubic-bezier(0.4, 0, 0.2, 1))
   * AI Intelligence: Default choice, builds trust through natural movement
   */
  smooth: 'ease-in-out',

  /**
   * Starts slow, accelerates toward the end
   * Maps to: ease-out (cubic-bezier(0, 0, 0.2, 1))
   * AI Intelligence: Use for elements appearing, creates welcoming entry
   */
  accelerating: 'ease-out',

  /**
   * Starts fast, decelerates toward the end
   * Maps to: ease-in (cubic-bezier(0.4, 0, 1, 1))
   * AI Intelligence: Use for elements disappearing, graceful exit
   */
  decelerating: 'ease-in',

  /**
   * Bouncy, playful motion with spring-like feel
   * Maps to: cubic-bezier(0.175, 0.885, 0.32, 1.275) - UX optimized
   * AI Intelligence: Use for success states, celebration, positive feedback
   */
  bouncy: 'ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',

  /**
   * Sharp, snappy motion for immediate feedback
   * Maps to: cubic-bezier(0.25, 0.46, 0.45, 0.94)
   * AI Intelligence: Use for button presses, toggles, interactive elements
   */
  snappy: 'ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
} as const;

/**
 * Context-specific easing tokens for common UI patterns
 * AI agents use these for informed motion decisions in specific contexts
 */
export const contextEasing = {
  /**
   * Hover effects - quick and responsive
   * AI Intelligence: Snappy feedback builds interactive confidence
   */
  hover: easing.snappy,

  /**
   * Modal and dialog appearances - smooth entrance
   * AI Intelligence: Welcoming appearance reduces anxiety
   */
  modalEnter: easing.accelerating,

  /**
   * Modal and dialog disappearances - smooth exit
   * AI Intelligence: Graceful exit maintains trust
   */
  modalExit: easing.decelerating,

  /**
   * Toast notifications - gentle appearance
   * AI Intelligence: Non-intrusive, natural movement
   */
  toast: easing.smooth,

  /**
   * Progress indicators - constant motion
   * AI Intelligence: Linear progress communicates steady advancement
   */
  progress: easing.linear,

  /**
   * Success animations - celebratory
   * AI Intelligence: Bouncy motion reinforces positive feedback
   */
  success: easing.bouncy,

  /**
   * Loading states - smooth and calming
   * AI Intelligence: Smooth motion reduces perceived wait time
   */
  loading: easing.smooth,

  /**
   * Navigation transitions - natural flow
   * AI Intelligence: Smooth transitions maintain spatial continuity
   */
  navigation: easing.smooth,

  /**
   * Focus indicators - immediate feedback
   * AI Intelligence: Snappy response critical for accessibility
   */
  focus: easing.snappy,
} as const;

/**
 * Animation-specific easing for different motion types
 */
export const motionEasing = {
  /**
   * Fade animations - smooth opacity changes
   */
  fade: easing.smooth,

  /**
   * Scale animations - natural size changes
   */
  scale: easing.accelerating,

  /**
   * Slide animations - directional movement
   */
  slide: easing.smooth,

  /**
   * Rotate animations - spinning motion
   */
  rotate: easing.linear,

  /**
   * Pulse animations - rhythmic scaling
   */
  pulse: easing.smooth,
} as const;

/**
 * Type definitions for easing tokens
 */
export type EasingToken = (typeof easing)[keyof typeof easing];
export type ContextEasingToken = (typeof contextEasing)[keyof typeof contextEasing];
export type MotionEasingToken = (typeof motionEasing)[keyof typeof motionEasing];

/**
 * Union type for all easing tokens - AI agents can use this for type safety
 */
export type AllEasingTokens = EasingToken | ContextEasingToken | MotionEasingToken;

/**
 * Motion easing intelligence for AI decision-making
 */
export type EasingIntelligence = {
  naturalness: 'mechanical' | 'organic' | 'playful';
  energyLevel: 'calm' | 'neutral' | 'energetic';
  trustBuilding: 'high' | 'medium' | 'low';
  usagePattern: string;
};

/**
 * Easing metadata for AI agents
 */
export const easingIntelligence: Record<keyof typeof easing, EasingIntelligence> = {
  linear: {
    naturalness: 'mechanical',
    energyLevel: 'neutral',
    trustBuilding: 'high',
    usagePattern: 'Use for progress indicators and continuous motion',
  },
  smooth: {
    naturalness: 'organic',
    energyLevel: 'calm',
    trustBuilding: 'high',
    usagePattern: 'Default easing for most transitions, feels natural and organic',
  },
  accelerating: {
    naturalness: 'organic',
    energyLevel: 'neutral',
    trustBuilding: 'high',
    usagePattern: 'Use for elements entering view, modals appearing, expanding content',
  },
  decelerating: {
    naturalness: 'organic',
    energyLevel: 'calm',
    trustBuilding: 'high',
    usagePattern: 'Use for elements exiting view, modals closing, collapsing content',
  },
  bouncy: {
    naturalness: 'playful',
    energyLevel: 'energetic',
    trustBuilding: 'high',
    usagePattern: 'Use for success animations, positive feedback, celebratory moments',
  },
  snappy: {
    naturalness: 'mechanical',
    energyLevel: 'energetic',
    trustBuilding: 'high',
    usagePattern: 'Use for button presses, toggles, hover effects requiring immediate feedback',
  },
};
