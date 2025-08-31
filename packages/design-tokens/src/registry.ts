/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 */

import type { ColorValue, Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies.js';

// Helper function to convert token values to CSS (simple inline implementation)
function tokenValueToCss(value: string | ColorValue): string {
  if (typeof value === 'string') {
    return value;
  }
  // For ColorValue objects, return the base value
  return value.value || 'inherit';
}

export class TokenRegistry {
  private tokens: Map<string, Token> = new Map();
  public dependencyGraph: TokenDependencyGraph = new TokenDependencyGraph();

  constructor(initialTokens?: Token[]) {
    if (initialTokens) {
      for (const token of initialTokens) {
        this.tokens.set(token.name, token);
      }
    }
  }

  get(tokenName: string): Token | undefined {
    return this.tokens.get(tokenName);
  }

  set(tokenName: string, value: string): void {
    const existingToken = this.tokens.get(tokenName);
    if (!existingToken) {
      throw new Error(`Token "${tokenName}" does not exist. Cannot update non-existent token.`);
    }

    // Update only the value field, preserve all metadata
    const updatedToken: Token = {
      ...existingToken,
      value,
    };

    this.tokens.set(tokenName, updatedToken);
  }

  has(tokenName: string): boolean {
    return this.tokens.has(tokenName);
  }

  list(): Token[] {
    return Array.from(this.tokens.values());
  }

  size(): number {
    return this.tokens.size;
  }

  /**
   * Get all tokens that depend on the specified token
   */
  getDependents(tokenName: string): string[] {
    return this.dependencyGraph.getDependents(tokenName);
  }

  /**
   * Get all tokens this token depends on
   */
  getDependencies(tokenName: string): string[] {
    return this.dependencyGraph.getDependencies(tokenName);
  }

  /**
   * Add dependency relationship with generation rule
   */
  addDependency(tokenName: string, dependsOn: string[], rule: string): void {
    this.dependencyGraph.addDependency(tokenName, dependsOn, rule);
  }

  /**
   * Decompose a complex color token into flat tokens with dependencies
   * Studio sends rich color object, registry stores as simple tokens
   */
  decomposeColor(colorToken: Token): void {
    if (
      typeof colorToken.value !== 'object' ||
      colorToken.value === null ||
      !('name' in colorToken.value)
    ) {
      // Simple token, just store as-is
      this.tokens.set(colorToken.name, colorToken);
      return;
    }

    const colorValue = colorToken.value as ColorValue;

    // Store base token with reference to value
    const baseToken: Token = {
      ...colorToken,
      value: (colorValue as ColorValue).value || `${colorToken.name}-base`,
      // Preserve darkValue from original token if it exists
      // darkValue no longer used - dark mode handled via separate -dark suffix tokens
    };
    this.tokens.set(colorToken.name, baseToken);

    // Generate state tokens if states are defined
    if ('states' in colorValue && colorValue.states) {
      for (const [state, stateValue] of Object.entries(colorValue.states)) {
        const stateTokenName = `${colorToken.name}-${state}`;
        const stateToken: Token = {
          name: stateTokenName,
          value: stateValue as string,
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
        const oklch = (colorValue as ColorValue).scale[i];
        if (!oklch) continue;
        const scaleValue = `oklch(${oklch.l} ${oklch.c} ${oklch.h}${oklch.alpha !== undefined && oklch.alpha !== 1 ? ` / ${oklch.alpha}` : ''})`;
        const scaleTokenName = `${colorToken.name}-${scaleNumber}`;

        const scaleToken: Token = {
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
  recomposeColor(tokenName: string): Token | undefined {
    const baseToken = this.tokens.get(tokenName);
    if (!baseToken) return undefined;

    // Get all dependent tokens
    const dependents = this.getDependents(tokenName);

    // Separate state tokens from scale tokens
    const stateTokens: Record<string, string> = {};
    const darkStateTokens: Record<string, string> = {};
    const scaleValues: string[] = [];
    const darkScaleValues: string[] = [];
    const standardScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    for (const dependentName of dependents) {
      const dependentToken = this.tokens.get(dependentName);
      if (!dependentToken) continue;

      const rule = this.dependencyGraph.getGenerationRule(dependentName);
      if (!rule) continue;

      if (rule.startsWith('state:')) {
        const stateName = rule.replace('state:', '');
        stateTokens[stateName] = dependentToken.value as string;
        // Check for corresponding dark state token
        const darkStateToken = this.tokens.get(`${dependentToken.name}-dark`);
        if (darkStateToken) {
          darkStateTokens[stateName] =
            typeof darkStateToken.value === 'string'
              ? darkStateToken.value
              : tokenValueToCss(darkStateToken.value);
        }
      } else if (rule.startsWith('scale:')) {
        const scaleNumber = Number.parseInt(rule.replace('scale:', ''));
        const scaleIndex = standardScale.indexOf(scaleNumber);
        if (scaleIndex !== -1) {
          // Ensure arrays are long enough
          while (scaleValues.length <= scaleIndex) {
            scaleValues.push('');
          }
          while (darkScaleValues.length <= scaleIndex) {
            darkScaleValues.push('');
          }
          scaleValues[scaleIndex] = dependentToken.value as string;
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
      const scale: Array<{ l: number; c: number; h: number; alpha?: number }> = [];
      if (scaleValues.length > 0) {
        for (const scaleValue of scaleValues) {
          if (scaleValue?.includes('oklch')) {
            // Parse OKLCH string back to object (simplified parsing)
            const match = scaleValue.match(
              /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)/
            );
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

      const colorValue: ColorValue = {
        name: baseToken.name,
        scale: scale,
        value: baseToken.name, // The semantic token name
        use: baseToken.semanticMeaning || baseToken.name,
        ...(Object.keys(stateTokens).length > 0 ? { states: stateTokens } : {}),
      };

      return {
        ...baseToken,
        value: baseToken.value as string, // Keep string value, not ColorValue object
      };
    }

    // Return simple token if no complex structure
    return baseToken;
  }
}
