/**
 * Border Radius Generator
 *
 * Rounded corner system with semantic naming
 */
export function generateBorderRadiusTokens() {
    const tokens = [];
    const radiusScale = [
        { name: 'none', value: '0px', meaning: 'Sharp corners for technical/precise feel' },
        { name: 'sm', value: '2px', meaning: 'Subtle rounding for buttons and inputs' },
        { name: 'base', value: '4px', meaning: 'Standard rounding for most components' },
        { name: 'md', value: '6px', meaning: 'Medium rounding for cards and containers' },
        { name: 'lg', value: '8px', meaning: 'Large rounding for prominent elements' },
        { name: 'xl', value: '12px', meaning: 'Extra large for hero sections' },
        { name: '2xl', value: '16px', meaning: 'Very large for special components' },
        { name: 'full', value: '9999px', meaning: 'Fully rounded for pills and circles' },
    ];
    radiusScale.forEach((radius, index) => {
        tokens.push({
            name: radius.name,
            value: radius.value,
            category: 'border-radius',
            namespace: 'border-radius',
            semanticMeaning: radius.meaning,
            scalePosition: index,
            generateUtilityClass: true,
            applicableComponents: ['button', 'input', 'card', 'modal', 'image'],
            accessibilityLevel: 'AAA',
            cognitiveLoad: 1,
            trustLevel: 'low',
            consequence: 'reversible',
        });
    });
    return tokens;
}
//# sourceMappingURL=border-radius.js.map