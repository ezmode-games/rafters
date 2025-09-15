/**
 * Border Width Generator
 *
 * Border width system for component emphasis and structure
 */
/**
 * Generate border width tokens (maps to TW border-{width} utilities)
 *
 * @returns Array of border width tokens with AI intelligence metadata
 */
export function generateBorderWidthTokens() {
    const tokens = [];
    // Tailwind's actual border width scale (mathematical progression)
    const borderScale = [
        {
            name: '0',
            value: '0px',
            meaning: 'No border',
            cognitiveLoad: 1,
            trustLevel: 'low',
            usage: ['borderless', 'clean-design', 'minimal'],
        },
        {
            name: 'DEFAULT',
            value: '1px',
            meaning: 'Default border width',
            cognitiveLoad: 1,
            trustLevel: 'low',
            usage: ['standard-border', 'input-fields', 'cards', 'buttons'],
        },
        {
            name: '2',
            value: '2px',
            meaning: 'Medium border for emphasis',
            cognitiveLoad: 2,
            trustLevel: 'low',
            usage: ['emphasis', 'focus-states', 'highlighted-elements'],
        },
        {
            name: '4',
            value: '4px',
            meaning: 'Thick border for strong emphasis',
            cognitiveLoad: 3,
            trustLevel: 'medium',
            usage: ['strong-emphasis', 'call-to-action', 'important-sections'],
        },
        {
            name: '8',
            value: '8px',
            meaning: 'Extra thick decorative border',
            cognitiveLoad: 5,
            trustLevel: 'medium',
            usage: ['decorative', 'artistic', 'brand-elements', 'hero-sections'],
        },
    ];
    for (let index = 0; index < borderScale.length; index++) {
        const border = borderScale[index];
        tokens.push({
            name: border.name,
            value: border.value,
            category: 'border-width',
            namespace: 'border',
            semanticMeaning: border.meaning,
            scalePosition: index,
            mathRelationship: border.value === '0px'
                ? 'No border'
                : `${border.value} (${Number.parseInt(border.value, 10)}x pixel)`,
            generateUtilityClass: true,
            applicableComponents: Number.parseInt(border.value, 10) <= 2
                ? ['input', 'card', 'button']
                : ['decorative', 'emphasis'],
            accessibilityLevel: 'AAA',
            cognitiveLoad: border.cognitiveLoad,
            trustLevel: border.trustLevel,
            consequence: border.trustLevel === 'medium' ? 'significant' : 'reversible',
            usageContext: border.usage,
        });
    }
    return tokens;
}
//# sourceMappingURL=border-width.js.map