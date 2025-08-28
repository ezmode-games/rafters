/**
 * TokenRegistry - Core data structure for design token storage and retrieval
 *
 * Provides O(1) get/set operations with intelligent metadata preservation
 * Built for AI-first design token system with comprehensive intelligence metadata
 */

import type { ColorValue, Token } from '@rafters/shared';
import { TokenDependencyGraph } from './dependencies.js';

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
    if (typeof colorToken.value !== 'object') {
      // Simple token, just store as-is
      this.tokens.set(colorToken.name, colorToken);
      return;
    }

    const colorValue = colorToken.value;

    // Store base token with reference to base color if available
    const baseToken: Token = {
      ...colorToken,
      value: colorValue.baseColor || `${colorToken.name}-base`,
      // Preserve darkValue from original token if it exists
      ...(colorToken.darkValue && { darkValue: colorToken.darkValue }),
    };
    this.tokens.set(colorToken.name, baseToken);

    // Generate state tokens if states are defined
    if (colorValue.states) {
      for (const [state, stateValue] of Object.entries(colorValue.states)) {
        const stateTokenName = `${colorToken.name}-${state}`;
        const stateToken: Token = {
          name: stateTokenName,
          value: stateValue,
          // Add dark mode state value if darkStates exist
          ...(colorValue.darkStates?.[state] && { darkValue: colorValue.darkStates[state] }),
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

    // Handle scale values if present
    if (colorValue.values && colorValue.values.length > 0) {
      const standardScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

      for (let i = 0; i < Math.min(colorValue.values.length, standardScale.length); i++) {
        const scaleNumber = standardScale[i];
        const scaleValue = colorValue.values[i];
        const scaleTokenName = `${colorToken.name}-${scaleNumber}`;

        const scaleToken: Token = {
          name: scaleTokenName,
          value: scaleValue,
          // Add dark mode scale value if darkValues exist
          ...(colorValue.darkValues?.[i] && { darkValue: colorValue.darkValues[i] }),
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
        if (dependentToken.darkValue) {
          darkStateTokens[stateName] = dependentToken.darkValue as string;
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
          if (dependentToken.darkValue) {
            darkScaleValues[scaleIndex] = dependentToken.darkValue as string;
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
      const colorValue: ColorValue = {
        baseColor: baseToken.value as string,
        ...(scaleValues.length > 0 ? { values: scaleValues } : {}),
        ...(darkScaleValues.length > 0 ? { darkValues: darkScaleValues } : {}),
        ...(Object.keys(stateTokens).length > 0 ? { states: stateTokens } : {}),
        ...(Object.keys(darkStateTokens).length > 0 ? { darkStates: darkStateTokens } : {}),
      };

      return {
        ...baseToken,
        value: colorValue,
      };
    }

    // Return simple token if no complex structure
    return baseToken;
  }
}
