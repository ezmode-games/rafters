/**
 * Opacity Generator
 *
 * Semantic opacity system for states and overlays
 */
/**
 * Generate opacity tokens for layering and states
 *
 * @returns Array of opacity tokens with AI intelligence metadata
 */
export function generateOpacityTokens() {
    const tokens = [];
    const opacityScale = [
        {
            name: 'disabled',
            value: '0.5',
            meaning: 'Disabled state opacity - clearly indicates non-interactive state',
            cognitiveLoad: 3,
            trustLevel: 'medium',
            usage: ['disabled-buttons', 'inactive-elements', 'unavailable'],
        },
        {
            name: 'loading',
            value: '0.7',
            meaning: 'Loading state opacity - indicates temporary unavailability',
            cognitiveLoad: 4,
            trustLevel: 'medium',
            usage: ['loading-states', 'processing', 'pending'],
        },
        {
            name: 'overlay',
            value: '0.8',
            meaning: 'Modal overlay background - creates focus without complete blocking',
            cognitiveLoad: 6,
            trustLevel: 'high',
            usage: ['modal-backdrop', 'dialog-overlay', 'focus-trap'],
        },
        {
            name: 'backdrop',
            value: '0.25',
            meaning: 'Subtle backdrop opacity - gentle layering effect',
            cognitiveLoad: 2,
            trustLevel: 'low',
            usage: ['subtle-overlay', 'image-overlay', 'text-backdrop'],
        },
        {
            name: 'hover',
            value: '0.9',
            meaning: 'Hover state opacity - subtle interaction feedback',
            cognitiveLoad: 2,
            trustLevel: 'low',
            usage: ['hover-effects', 'interactive-feedback', 'button-hover'],
        },
        {
            name: 'focus',
            value: '1',
            meaning: 'Focus state (full opacity) - maximum visibility for accessibility',
            cognitiveLoad: 1,
            trustLevel: 'low',
            usage: ['focus-states', 'active-elements', 'selected'],
        },
    ];
    for (let index = 0; index < opacityScale.length; index++) {
        const opacity = opacityScale[index];
        tokens.push({
            name: opacity.name,
            value: opacity.value,
            category: 'opacity',
            namespace: 'opacity',
            semanticMeaning: opacity.meaning,
            scalePosition: index,
            generateUtilityClass: true,
            applicableComponents: opacity.name.includes('disabled')
                ? ['button', 'input', 'text']
                : opacity.name.includes('overlay')
                    ? ['modal', 'dialog']
                    : ['all'],
            interactionType: opacity.name.includes('hover')
                ? 'hover'
                : opacity.name.includes('focus')
                    ? 'focus'
                    : opacity.name.includes('disabled')
                        ? 'disabled'
                        : opacity.name.includes('loading')
                            ? 'loading'
                            : undefined,
            accessibilityLevel: 'AAA',
            cognitiveLoad: opacity.cognitiveLoad,
            trustLevel: opacity.trustLevel,
            consequence: opacity.trustLevel === 'high' ? 'significant' : 'reversible',
            usageContext: opacity.usage,
        });
    }
    return tokens;
}
//# sourceMappingURL=opacity.js.map