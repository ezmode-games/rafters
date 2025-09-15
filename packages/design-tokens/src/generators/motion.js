/**
 * Motion Tokens Generator
 *
 * Animation timing and easing system with cognitive load awareness
 * Respects user motion preferences and provides semantic timing
 */
/**
 * Generate motion tokens (duration and easing) with accessibility awareness
 *
 * @returns Array of motion tokens with AI intelligence metadata and reduced motion support
 *
 * @example
 * ```typescript
 * const motionTokens = generateMotionTokens();
 * // Generates duration tokens: instant (75ms) → dramatic (1000ms)
 * // and easing tokens: linear → bouncy with semantic meanings
 * ```
 */
export function generateMotionTokens() {
    const tokens = [];
    // Duration tokens with cognitive load mapping
    const durations = [
        {
            name: 'instant',
            value: '75ms',
            meaning: 'Instant feedback for immediate response - hover states, button presses',
            cognitive: 1,
            trustLevel: 'low',
            usage: ['hover', 'focus', 'active', 'immediate-feedback'],
        },
        {
            name: 'fast',
            value: '150ms',
            meaning: 'Fast animations for interactive elements - dropdowns, tooltips',
            cognitive: 2,
            trustLevel: 'low',
            usage: ['dropdown', 'tooltip', 'menu', 'quick-reveal'],
        },
        {
            name: 'standard',
            value: '300ms',
            meaning: 'Standard duration for most transitions - page changes, modal open',
            cognitive: 3,
            trustLevel: 'medium',
            usage: ['page-transition', 'modal', 'tab-switch', 'accordion'],
        },
        {
            name: 'deliberate',
            value: '500ms',
            meaning: 'Deliberate timing for important changes - form submission, loading',
            cognitive: 5,
            trustLevel: 'medium',
            usage: ['form-submit', 'loading', 'important-change', 'confirmation'],
        },
        {
            name: 'slow',
            value: '700ms',
            meaning: 'Slow transitions for large changes - layout shifts, major updates',
            cognitive: 7,
            trustLevel: 'high',
            usage: ['layout-change', 'major-update', 'onboarding', 'tutorial'],
        },
        {
            name: 'dramatic',
            value: '1000ms',
            meaning: 'Dramatic timing for emphasis - celebrations, achievements, errors',
            cognitive: 9,
            trustLevel: 'high',
            usage: ['celebration', 'achievement', 'error-state', 'hero-entrance'],
        },
    ];
    durations.forEach((duration, index) => {
        tokens.push({
            name: duration.name,
            value: duration.value,
            category: 'motion',
            namespace: 'duration',
            semanticMeaning: duration.meaning,
            scalePosition: index,
            cognitiveLoad: duration.cognitive,
            trustLevel: duration.trustLevel,
            reducedMotionAware: true,
            motionDuration: Number.parseInt(duration.value, 10),
            generateUtilityClass: true,
            applicableComponents: ['all'],
            accessibilityLevel: 'AAA',
            consequence: 'reversible',
            usageContext: duration.usage,
        });
    });
    // Easing tokens with personality and usage context
    const easings = [
        {
            name: 'linear',
            value: 'linear',
            meaning: 'Linear timing for mechanical movement - progress bars, loading',
            personality: 'mechanical',
            usage: ['progress', 'loading', 'data-viz', 'technical'],
        },
        {
            name: 'smooth',
            value: 'ease-in-out',
            meaning: 'Smooth natural movement - standard transitions, page changes',
            personality: 'natural',
            usage: ['page-transition', 'modal', 'drawer', 'standard'],
        },
        {
            name: 'accelerating',
            value: 'ease-out',
            meaning: 'Welcoming entrance animation - elements appearing, reveals',
            personality: 'welcoming',
            usage: ['entrance', 'reveal', 'expand', 'welcome'],
        },
        {
            name: 'decelerating',
            value: 'ease-in',
            meaning: 'Graceful exit animation - elements disappearing, collapses',
            personality: 'graceful',
            usage: ['exit', 'hide', 'collapse', 'dismiss'],
        },
        {
            name: 'bouncy',
            value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            meaning: 'Playful bounce for celebrations - success states, achievements',
            personality: 'playful',
            usage: ['celebration', 'success', 'achievement', 'fun'],
        },
        {
            name: 'snappy',
            value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            meaning: 'Sharp responsive feedback - button presses, selections',
            personality: 'responsive',
            usage: ['button-press', 'selection', 'toggle', 'click-feedback'],
        },
    ];
    easings.forEach((easing, index) => {
        tokens.push({
            name: easing.name,
            value: easing.value,
            category: 'easing',
            namespace: 'ease',
            semanticMeaning: easing.meaning,
            scalePosition: index,
            generateUtilityClass: true,
            applicableComponents: ['all'],
            accessibilityLevel: 'AAA',
            cognitiveLoad: 2, // Easing affects perception but is subtle
            trustLevel: 'low',
            consequence: 'reversible',
            reducedMotionAware: true,
            usageContext: easing.usage,
        });
    });
    return tokens;
}
//# sourceMappingURL=motion.js.map