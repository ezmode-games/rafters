/**
 * Typography Scale Generator
 *
 * Musical harmony-based typography system with responsive variants
 * Uses mathematical ratios from music theory for pleasing proportions
 */
/**
 * Musical and mathematical ratios for typography generation
 */
const GOLDEN_RATIO = 1.618033988749;
const MAJOR_SECOND = 1.125;
const MINOR_THIRD = 1.2;
const MAJOR_THIRD = 1.25;
const PERFECT_FOURTH = 1.333;
const PERFECT_FIFTH = 1.5;
/**
 * Generate typography scale using golden ratio or musical intervals with responsive variants
 *
 * @param system - Musical interval or mathematical ratio for scaling
 * @param baseSize - Base font size in rem (default: 1rem = 16px)
 * @param generateResponsive - Generate viewport and container query variants (default: true)
 *
 * @returns Array of typography tokens with AI intelligence metadata and paired line heights
 *
 * @example
 * ```typescript
 * // Generate golden ratio typography for premium feel
 * const goldenType = generateTypographyScale('golden', 1, true);
 *
 * // Generate major third scale for balanced harmony
 * const harmonicType = generateTypographyScale('major-third', 1, true);
 *
 * // Generate perfect fifth for dramatic scaling
 * const dramaticType = generateTypographyScale('perfect-fifth', 1, true);
 * ```
 */
export function generateTypographyScale(system = 'golden', baseSize = 1 // rem
) {
    const tokens = [];
    const sizes = [
        'xs', // Small text, captions
        'sm', // Small paragraphs
        'base', // Body text (16px default)
        'lg', // Large text
        'xl', // Small headings
        '2xl', // H4-H5 headings
        '3xl', // H3 headings
        '4xl', // H2 headings
        '5xl', // H1 headings
        '6xl', // Display headings
        '7xl', // Large display
        '8xl', // Hero text
        '9xl', // Massive display
    ];
    let ratio;
    switch (system) {
        case 'golden':
            ratio = GOLDEN_RATIO;
            break;
        case 'major-second':
            ratio = MAJOR_SECOND;
            break;
        case 'minor-third':
            ratio = MINOR_THIRD;
            break;
        case 'major-third':
            ratio = MAJOR_THIRD;
            break;
        case 'perfect-fourth':
            ratio = PERFECT_FOURTH;
            break;
        case 'perfect-fifth':
            ratio = PERFECT_FIFTH;
            break;
    }
    // Start from base (index 2), go down for xs/sm, up for lg+
    for (let i = 0; i < sizes.length; i++) {
        const steps = i - 2; // -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        const value = baseSize * ratio ** steps;
        // Determine cognitive load and usage context based on size
        const isBodyText = i >= 1 && i <= 3;
        const isHeading = i >= 4;
        const isDisplay = i >= 9;
        // Base font size token
        tokens.push({
            name: `text-${sizes[i]}`,
            value: `${Math.round(value * 1000) / 1000}rem`,
            category: 'font-size',
            namespace: 'font-size',
            semanticMeaning: `Typography size ${sizes[i]} using ${system} ratio - ${isDisplay ? 'display/hero' : isHeading ? 'heading' : 'body/ui'} text`,
            mathRelationship: `${baseSize} * ${ratio}^${steps}`,
            scalePosition: i,
            generateUtilityClass: true,
            applicableComponents: ['text', 'heading', 'label', 'button'],
            accessibilityLevel: 'AAA',
            cognitiveLoad: isDisplay ? 8 : isHeading ? 5 : isBodyText ? 2 : 3,
            trustLevel: 'low',
            consequence: 'reversible',
            usageContext: [
                ...(i <= 1 ? ['captions', 'metadata', 'fine-print'] : []),
                ...(isBodyText ? ['body-text', 'paragraphs', 'ui-text'] : []),
                ...(isHeading ? ['headings', 'section-titles'] : []),
                ...(isDisplay ? ['hero', 'display', 'marketing'] : []),
            ],
        });
        // Base line height token - optimized for readability
        const fontSize = value;
        const lineHeight = fontSize < 1 ? 1.6 : fontSize > 2 ? 1.2 : 1.5;
        tokens.push({
            name: `leading-${sizes[i]}`,
            value: lineHeight.toString(),
            category: 'line-height',
            namespace: 'line-height',
            semanticMeaning: `Line height optimized for ${sizes[i]} text readability - ${lineHeight >= 1.5 ? 'comfortable' : 'tight'} spacing`,
            pairedWith: [`text-${sizes[i]}`],
            generateUtilityClass: true,
            applicableComponents: ['text', 'heading', 'paragraph'],
            accessibilityLevel: lineHeight >= 1.5 ? 'AAA' : 'AA',
            cognitiveLoad: 1, // Line height is foundational
            trustLevel: 'low',
            consequence: 'reversible',
            usageContext: ['readability', 'text-spacing', 'vertical-rhythm'],
        });
    }
    return tokens;
}
//# sourceMappingURL=typography.js.map