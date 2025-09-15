/**
 * Studio integration utilities for CSS and framework integration
 */
import Color from 'colorjs.io';
import { oklchToCSS, oklchToHex } from './conversion';
/**
 * Generate CSS custom properties from color palette
 */
export function generateCSSVariables(palette, prefix = '--color') {
    if (Object.keys(palette).length === 0) {
        return '';
    }
    return Object.entries(palette)
        .map(([name, color]) => {
        const cssName = `${prefix}-${name}`;
        const cssValue = oklchToCSS(color);
        return `${cssName}: ${cssValue};`;
    })
        .join('\n');
}
/**
 * Generate Tailwind color configuration
 */
export function generateTailwindConfig(palette) {
    const config = {};
    for (const [name, color] of Object.entries(palette)) {
        config[name] = oklchToHex(color);
    }
    return config;
}
/**
 * Validate color string format (hex, rgb, hsl, oklch, named)
 */
export function isValidColorString(colorString) {
    if (!colorString || typeof colorString !== 'string') {
        return false;
    }
    try {
        // Use colorjs.io to validate - it will throw if invalid
        new Color(colorString);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Parse any color string format to OKLCH
 */
export function parseColorString(colorString) {
    if (!isValidColorString(colorString)) {
        throw new Error(`Invalid color string: ${colorString}`);
    }
    try {
        const color = new Color(colorString);
        const oklch = color.to('oklch');
        return {
            l: oklch.l,
            c: oklch.c,
            h: oklch.h || 0, // Handle undefined hue for achromatic colors
        };
    }
    catch (_error) {
        throw new Error(`Invalid color string: ${colorString}`);
    }
}
//# sourceMappingURL=studio.js.map