/**
 * Backdrop Generator
 *
 * Backdrop filter system for overlays and modals
 */
/**
 * Generate backdrop filter tokens (maps to TW backdrop-blur utilities)
 *
 * @returns Array of backdrop filter tokens with AI intelligence metadata
 */
export function generateBackdropTokens() {
    const tokens = [];
    // Tailwind's actual backdrop-blur scale (mathematical progression)
    const backdropBlurScale = [
        {
            name: 'none',
            value: '0',
            meaning: 'No backdrop blur',
            cognitiveLoad: 1,
            trustLevel: 'low',
            usage: ['no-blur', 'clear-background', 'transparent'],
        },
        {
            name: 'sm',
            value: '4px',
            meaning: 'Small backdrop blur for overlays',
            cognitiveLoad: 2,
            trustLevel: 'low',
            usage: ['subtle-overlay', 'light-separation', 'minimal-blur'],
        },
        {
            name: 'DEFAULT',
            value: '8px',
            meaning: 'Default backdrop blur for modals',
            cognitiveLoad: 3,
            trustLevel: 'medium',
            usage: ['modal-backdrop', 'standard-overlay', 'focus-creation'],
        },
        {
            name: 'md',
            value: '12px',
            meaning: 'Medium backdrop blur for focus',
            cognitiveLoad: 4,
            trustLevel: 'medium',
            usage: ['dialog-backdrop', 'attention-focus', 'medium-separation'],
        },
        {
            name: 'lg',
            value: '16px',
            meaning: 'Large backdrop blur for separation',
            cognitiveLoad: 5,
            trustLevel: 'medium',
            usage: ['strong-focus', 'clear-separation', 'modal-emphasis'],
        },
        {
            name: 'xl',
            value: '24px',
            meaning: 'Extra large blur for drama',
            cognitiveLoad: 6,
            trustLevel: 'high',
            usage: ['dramatic-effect', 'strong-blur', 'artistic-backdrop'],
        },
        {
            name: '2xl',
            value: '40px',
            meaning: 'Maximum blur for strong effects',
            cognitiveLoad: 7,
            trustLevel: 'high',
            usage: ['maximum-blur', 'strong-effects', 'heavy-separation'],
        },
        {
            name: '3xl',
            value: '64px',
            meaning: 'Ultra blur for artistic effects',
            cognitiveLoad: 8,
            trustLevel: 'high',
            usage: ['ultra-blur', 'artistic-effects', 'extreme-separation'],
        },
    ];
    for (let index = 0; index < backdropBlurScale.length; index++) {
        const blur = backdropBlurScale[index];
        tokens.push({
            name: blur.name,
            value: blur.value,
            category: 'backdrop-blur',
            namespace: 'backdrop-blur',
            semanticMeaning: blur.meaning,
            scalePosition: index,
            mathRelationship: blur.value === '0' ? 'No blur' : `blur(${blur.value})`,
            generateUtilityClass: true,
            applicableComponents: ['modal', 'dialog', 'overlay', 'backdrop'],
            accessibilityLevel: 'AAA',
            cognitiveLoad: blur.cognitiveLoad,
            trustLevel: blur.trustLevel,
            consequence: blur.trustLevel === 'high' ? 'significant' : 'reversible',
            usageContext: blur.usage,
        });
    }
    return tokens;
}
//# sourceMappingURL=backdrop.js.map