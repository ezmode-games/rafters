/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 * Automatically enriches color tokens with intelligence from Color Intelligence API
 */
import { TokenDependencyGraph } from './dependencies';
// Helper function to convert token values to CSS (simple inline implementation)
function tokenValueToCss(value) {
    if (typeof value === 'string') {
        return value;
    }
    // For ColorValue objects, return the base value
    return value.value || 'inherit';
}
// Generate a unique token ID for colors based on OKLCH values
function generateColorTokenId(oklch) {
    // Round to 2 decimal places for L and C, whole degrees for H
    // This gives us ~1.4M possible colors while maintaining perceptual uniqueness
    const l = (Math.round(oklch.l * 100) / 100).toFixed(2);
    const c = (Math.round(oklch.c * 100) / 100).toFixed(2);
    const h = Math.round(oklch.h).toString();
    return `color-${l}-${c}-${h}`;
}
// Extract OKLCH from ColorValue or Token
function extractOKLCH(value) {
    if (typeof value === 'string') {
        // Parse OKLCH string like "oklch(0.5 0.1 240)"
        const match = value.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)/);
        if (match) {
            return {
                l: Number.parseFloat(match[1]),
                c: Number.parseFloat(match[2]),
                h: Number.parseFloat(match[3]),
                alpha: match[4] ? Number.parseFloat(match[4]) : 1,
            };
        }
        return null;
    }
    // For ColorValue, use the specified value or middle of scale
    if (typeof value === 'object' && value.scale) {
        // Calculate index from value: "500" -> 500/100 = 5 -> index 5, default to 5 (500 position)
        const targetIndex = value.value ? Math.floor(Number.parseInt(value.value, 10) / 100) : 5;
        return value.scale[Math.min(targetIndex, value.scale.length - 1)] || value.scale[0];
    }
    return null;
}
// Fetch color intelligence from the API
async function fetchColorIntelligence(oklch, context) {
    try {
        const apiUrl = process.env.COLOR_INTEL_API_URL || 'https://rafters.realhandy.tech/api/color-intel';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oklch: {
                    l: oklch.l,
                    c: oklch.c,
                    h: oklch.h,
                },
                token: context?.token,
                name: context?.name,
            }),
        });
        if (!response.ok) {
            console.error(`Color Intelligence API error: ${response.status} ${response.statusText}`);
            return null;
        }
        const fullResponse = await response.json();
        // Transform API response to match our ColorIntelligence interface
        return {
            intelligence: fullResponse.intelligence,
            harmonies: fullResponse.harmonies,
            accessibility: fullResponse.accessibility,
            analysis: fullResponse.analysis,
        };
    }
    catch (error) {
        console.error('Failed to fetch color intelligence:', error);
        return null;
    }
}
export class TokenRegistry {
    tokens = new Map();
    dependencyGraph = new TokenDependencyGraph();
    constructor(initialTokens) {
        if (initialTokens) {
            // Process tokens synchronously; async enrichment is available via enrichColorToken and should be called after registry creation if needed
            for (const token of initialTokens) {
                this.addToken(token);
            }
        }
    }
    /**
     * Add a token to the registry, enriching color tokens with intelligence if needed
     */
    addToken(token) {
        // For now, store as-is. Async enrichment will be added via enrichColorToken method
        this.tokens.set(token.name, token);
    }
    /**
     * Enrich a color token with intelligence from the API
     * This is async and should be called after initial registry creation
     */
    async enrichColorToken(tokenName) {
        const token = this.tokens.get(tokenName);
        if (!token || token.category !== 'color') {
            return;
        }
        const colorValue = token.value;
        if (typeof colorValue === 'string') {
            // Simple string value, no enrichment needed for references
            return;
        }
        // Check if already has intelligence
        if (colorValue.intelligence) {
            return;
        }
        // Extract OKLCH for API call
        const oklch = extractOKLCH(colorValue);
        if (!oklch) {
            console.warn(`Could not extract OKLCH from token ${tokenName}`);
            return;
        }
        // Fetch from API (CF Gateway handles caching)
        const intelligence = await fetchColorIntelligence(oklch, {
            token: tokenName,
            name: colorValue.name,
        });
        if (intelligence) {
            // Use AI-generated name with fallbacks
            const aiGeneratedName = intelligence.intelligence.suggestedName ||
                intelligence.analysis.name ||
                colorValue.name ||
                `color-${oklch.l.toFixed(2)}-${oklch.c.toFixed(2)}-${oklch.h.toFixed(0)}`;
            // Ensure intelligence has required suggestedName
            const enrichedIntelligence = {
                ...intelligence.intelligence,
                suggestedName: intelligence.intelligence.suggestedName || aiGeneratedName,
            };
            // Enrich the ColorValue
            const enrichedValue = {
                ...colorValue,
                name: aiGeneratedName,
                intelligence: enrichedIntelligence,
                harmonies: intelligence.harmonies,
                accessibility: intelligence.accessibility,
                analysis: intelligence.analysis,
                token: generateColorTokenId(oklch), // Add the token ID for quick lookups
            };
            // Update the token with enriched value
            const enrichedToken = {
                ...token,
                value: enrichedValue,
            };
            this.tokens.set(tokenName, enrichedToken);
        }
    }
    /**
     * Enrich all color tokens in the registry
     * Should be called after initial loading to ensure all colors have intelligence
     */
    async enrichAllColorTokens() {
        const colorTokens = Array.from(this.tokens.entries()).filter(([_, token]) => token.category === 'color');
        // Process in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < colorTokens.length; i += batchSize) {
            const batch = colorTokens.slice(i, i + batchSize);
            await Promise.all(batch.map(([name]) => this.enrichColorToken(name)));
            // Small delay between batches
            if (i + batchSize < colorTokens.length) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }
    }
    get(tokenName) {
        return this.tokens.get(tokenName);
    }
    set(tokenName, value) {
        const existingToken = this.tokens.get(tokenName);
        if (!existingToken) {
            throw new Error(`Token "${tokenName}" does not exist. Cannot update non-existent token.`);
        }
        // Update only the value field, preserve all metadata
        const updatedToken = {
            ...existingToken,
            value,
        };
        this.tokens.set(tokenName, updatedToken);
    }
    has(tokenName) {
        return this.tokens.has(tokenName);
    }
    list() {
        return Array.from(this.tokens.values());
    }
    size() {
        return this.tokens.size;
    }
    /**
     * Get all tokens that depend on the specified token
     */
    getDependents(tokenName) {
        return this.dependencyGraph.getDependents(tokenName);
    }
    /**
     * Get all tokens this token depends on
     */
    getDependencies(tokenName) {
        return this.dependencyGraph.getDependencies(tokenName);
    }
    /**
     * Add dependency relationship with generation rule
     */
    addDependency(tokenName, dependsOn, rule) {
        this.dependencyGraph.addDependency(tokenName, dependsOn, rule);
    }
    /**
     * Decompose a complex color token into flat tokens with dependencies
     * Studio sends rich color object, registry stores as simple tokens
     */
    decomposeColor(colorToken) {
        if (typeof colorToken.value !== 'object' ||
            colorToken.value === null ||
            !('name' in colorToken.value)) {
            // Simple token, just store as-is
            this.tokens.set(colorToken.name, colorToken);
            return;
        }
        const colorValue = colorToken.value;
        // Store base token with reference to value
        const baseToken = {
            ...colorToken,
            value: colorValue.value || `${colorToken.name}-base`,
            // Preserve darkValue from original token if it exists
            // darkValue no longer used - dark mode handled via separate -dark suffix tokens
        };
        this.tokens.set(colorToken.name, baseToken);
        // Generate state tokens if states are defined
        if ('states' in colorValue && colorValue.states) {
            for (const [state, stateValue] of Object.entries(colorValue.states)) {
                const stateTokenName = `${colorToken.name}-${state}`;
                const stateToken = {
                    name: stateTokenName,
                    value: stateValue,
                    // Note: Dark states handled separately in new schema architecture
                    category: colorToken.category,
                    namespace: colorToken.namespace,
                    semanticMeaning: `${state} state for ${colorToken.name}`,
                    cognitiveLoad: colorToken.cognitiveLoad,
                    trustLevel: colorToken.trustLevel,
                };
                this.tokens.set(stateTokenName, stateToken);
                // Add dependency: state token depends on base token
                this.addDependency(stateTokenName, [colorToken.name], `state:${state}`);
            }
        }
        // Handle scale values if present (using new flat scale property)
        if ('scale' in colorValue && colorValue.scale && colorValue.scale.length > 0) {
            const standardScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
            for (let i = 0; i < Math.min(colorValue.scale.length, standardScale.length); i++) {
                const scaleNumber = standardScale[i];
                const oklch = colorValue.scale[i];
                if (!oklch)
                    continue;
                const scaleValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : ''})`;
                const scaleTokenName = `${colorToken.name}-${scaleNumber}`;
                const scaleToken = {
                    name: scaleTokenName,
                    value: scaleValue,
                    // Note: darkValues property doesn't exist in new schema, dark mode handled through darkStates
                    category: colorToken.category,
                    namespace: colorToken.namespace,
                    semanticMeaning: `${colorToken.name} shade ${scaleNumber}`,
                    cognitiveLoad: colorToken.cognitiveLoad,
                    trustLevel: colorToken.trustLevel,
                };
                this.tokens.set(scaleTokenName, scaleToken);
                // Add dependency: scale token depends on base token
                this.addDependency(scaleTokenName, [colorToken.name], `scale:${scaleNumber}`);
            }
        }
    }
    /**
     * Recompose flat tokens back into complex color structure
     * Registry reads simple tokens, Studio gets rich color object
     */
    recomposeColor(tokenName) {
        const baseToken = this.tokens.get(tokenName);
        if (!baseToken)
            return undefined;
        // Get all dependent tokens
        const dependents = this.getDependents(tokenName);
        // Separate state tokens from scale tokens
        const stateTokens = {};
        const darkStateTokens = {};
        const scaleValues = [];
        const darkScaleValues = [];
        const standardScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
        for (const dependentName of dependents) {
            const dependentToken = this.tokens.get(dependentName);
            if (!dependentToken)
                continue;
            const rule = this.dependencyGraph.getGenerationRule(dependentName);
            if (!rule)
                continue;
            if (rule.startsWith('state:')) {
                const stateName = rule.replace('state:', '');
                stateTokens[stateName] = dependentToken.value;
                // Check for corresponding dark state token
                const darkStateToken = this.tokens.get(`${dependentToken.name}-dark`);
                if (darkStateToken) {
                    darkStateTokens[stateName] =
                        typeof darkStateToken.value === 'string'
                            ? darkStateToken.value
                            : tokenValueToCss(darkStateToken.value);
                }
            }
            else if (rule.startsWith('scale:')) {
                const scaleNumber = Number.parseInt(rule.replace('scale:', ''), 10);
                const scaleIndex = standardScale.indexOf(scaleNumber);
                if (scaleIndex !== -1) {
                    // Ensure arrays are long enough
                    while (scaleValues.length <= scaleIndex) {
                        scaleValues.push('');
                    }
                    while (darkScaleValues.length <= scaleIndex) {
                        darkScaleValues.push('');
                    }
                    scaleValues[scaleIndex] = dependentToken.value;
                    // Check for corresponding dark scale token
                    const darkScaleToken = this.tokens.get(`${dependentToken.name}-dark`);
                    if (darkScaleToken) {
                        darkScaleValues[scaleIndex] =
                            typeof darkScaleToken.value === 'string'
                                ? darkScaleToken.value
                                : tokenValueToCss(darkScaleToken.value);
                    }
                }
            }
        }
        // Remove empty trailing values from both arrays
        while (scaleValues.length > 0 && scaleValues[scaleValues.length - 1] === '') {
            scaleValues.pop();
        }
        while (darkScaleValues.length > 0 && darkScaleValues[darkScaleValues.length - 1] === '') {
            darkScaleValues.pop();
        }
        // Build complex color object if we have states or scale data
        if (Object.keys(stateTokens).length > 0 || scaleValues.length > 0) {
            // Convert string values back to OKLCH scale format if needed
            const scale = [];
            if (scaleValues.length > 0) {
                for (const scaleValue of scaleValues) {
                    if (scaleValue?.includes('oklch')) {
                        // Parse OKLCH string back to object (simplified parsing)
                        const match = scaleValue.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)/);
                        if (match) {
                            const l = Number.parseFloat(match[1]);
                            const c = Number.parseFloat(match[2]);
                            const h = Number.parseFloat(match[3]);
                            const alpha = match[4] ? Number.parseFloat(match[4]) : 1;
                            scale.push({ l, c, h, alpha });
                        }
                    }
                }
            }
            const _colorValue = {
                name: baseToken.name,
                scale: scale,
                value: baseToken.name, // The semantic token name
                use: baseToken.semanticMeaning || baseToken.name,
                ...(Object.keys(stateTokens).length > 0 ? { states: stateTokens } : {}),
            };
            return {
                ...baseToken,
                value: baseToken.value, // Keep string value, not ColorValue object
            };
        }
        // Return simple token if no complex structure
        return baseToken;
    }
}
//# sourceMappingURL=registry.js.map