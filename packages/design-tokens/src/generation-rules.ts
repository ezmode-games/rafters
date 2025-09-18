/**
 * Generation Rules Parser and Execution Engine
 *
 * Implements parser and execution engine for generation rules that automatically
 * update dependent tokens when their dependencies change, enabling intelligent
 * token relationships and cascading updates.
 */

import type { TokenRegistry } from './registry';

// Supported generation rule types
export type GenerationRule =
  | CalcRule // calc({token} * 2), calc({token} + 4px)
  | StateRule // state:hover, state:active, state:focus, state:disabled
  | ScaleRule // scale:600, scale:300 (use different scale position)
  | ContrastRule // contrast:auto (find best contrast pairing)
  | InvertRule; // invert (mathematical inversion for dark mode)

export interface CalcRule {
  type: 'calc';
  expression: string; // "{token} * 2", "{spacing-base} + 4px"
  tokens: string[]; // Extracted token dependencies
}

export interface StateRule {
  type: 'state';
  state: 'hover' | 'active' | 'focus' | 'disabled';
  baseToken: string; // Token to derive state from
}

export interface ScaleRule {
  type: 'scale';
  position: string; // "600", "300", etc.
  baseToken: string; // Token containing the ColorValue scale
}

export interface ContrastRule {
  type: 'contrast';
  mode: 'auto'; // Find best contrast pairing
  baseToken: string; // Token to find contrast for
}

export interface InvertRule {
  type: 'invert';
  baseToken: string; // Token to invert for dark mode
}

/**
 * Parser for generation rules
 */
export class GenerationRuleParser {
  parse(rule: string): GenerationRule {
    // calc({token} * 2) or calc({spacing-base} + 4px)
    if (rule.startsWith('calc(')) {
      return this.parseCalcRule(rule);
    }

    // state:hover
    if (rule.startsWith('state:')) {
      return this.parseStateRule(rule);
    }

    // scale:600
    if (rule.startsWith('scale:')) {
      return this.parseScaleRule(rule);
    }

    // contrast:auto
    if (rule.startsWith('contrast:')) {
      return this.parseContrastRule(rule);
    }

    // invert
    if (rule === 'invert') {
      return this.parseInvertRule(rule);
    }

    throw new Error(`Unknown rule type: ${rule}`);
  }

  private parseCalcRule(rule: string): CalcRule {
    // Extract: calc({spacing-base} * 2) -> expression: "{spacing-base} * 2"
    const match = rule.match(/^calc\((.+)\)$/);
    if (!match) throw new Error(`Invalid calc rule: ${rule}`);

    const expression = match[1];
    const tokens = this.extractTokens(expression); // Find all {token} references

    return { type: 'calc', expression, tokens };
  }

  private parseStateRule(rule: string): StateRule {
    // Extract: state:hover -> state: "hover"
    const match = rule.match(/^state:(\w+)$/);
    if (!match) throw new Error(`Invalid state rule: ${rule}`);

    const state = match[1] as 'hover' | 'active' | 'focus' | 'disabled';
    if (!['hover', 'active', 'focus', 'disabled'].includes(state)) {
      throw new Error(`Invalid state: ${state}. Must be hover, active, focus, or disabled`);
    }

    return {
      type: 'state',
      state,
      baseToken: '', // Will be inferred from token name
    };
  }

  private parseScaleRule(rule: string): ScaleRule {
    // Extract: scale:600 -> position: "600"
    const match = rule.match(/^scale:(\d+)$/);
    if (!match) throw new Error(`Invalid scale rule: ${rule}`);

    return {
      type: 'scale',
      position: match[1],
      baseToken: '', // Will be inferred from dependencies
    };
  }

  private parseContrastRule(rule: string): ContrastRule {
    // Extract: contrast:auto -> mode: "auto"
    const match = rule.match(/^contrast:(\w+)$/);
    if (!match) throw new Error(`Invalid contrast rule: ${rule}`);

    const mode = match[1];
    if (mode !== 'auto') {
      throw new Error(`Invalid contrast mode: ${mode}. Must be 'auto'`);
    }

    return {
      type: 'contrast',
      mode: 'auto',
      baseToken: '', // Will be inferred from dependencies
    };
  }

  private parseInvertRule(rule: string): InvertRule {
    if (rule !== 'invert') {
      throw new Error(`Invalid invert rule: ${rule}`);
    }

    return {
      type: 'invert',
      baseToken: '', // Will be inferred from dependencies
    };
  }

  private extractTokens(expression: string): string[] {
    // Find all {token-name} references in expression
    const matches = expression.match(/\{([^}]+)\}/g) || [];
    return matches.map((match) => match.slice(1, -1)); // Remove { }
  }
}

/**
 * Execution engine for generation rules
 */
export class GenerationRuleExecutor {
  constructor(private registry: TokenRegistry) {}

  execute(rule: GenerationRule, tokenName: string): string {
    switch (rule.type) {
      case 'calc':
        return this.executeCalcRule(rule, tokenName);
      case 'state':
        return this.executeStateRule(rule, tokenName);
      case 'scale':
        return this.executeScaleRule(rule, tokenName);
      case 'contrast':
        return this.executeContrastRule(rule, tokenName);
      case 'invert':
        return this.executeInvertRule(rule, tokenName);
      default:
        throw new Error(`Unknown rule type: ${(rule as { type: string }).type}`);
    }
  }

  private executeCalcRule(rule: CalcRule, _tokenName: string): string {
    let expression = rule.expression;
    let detectedUnit = '';

    // Substitute all token references with their values
    for (const tokenRef of rule.tokens) {
      const token = this.registry.get(tokenRef);
      if (!token) {
        throw new Error(`Token ${tokenRef} not found for rule: ${rule.expression}`);
      }

      // Extract numeric value and unit from token
      const tokenValue = String(token.value);
      const numericValue = parseFloat(tokenValue);
      if (Number.isNaN(numericValue)) {
        throw new Error(`Token ${tokenRef} value "${tokenValue}" is not numeric`);
      }

      // Extract unit from first token that has one
      if (!detectedUnit) {
        const unitMatch = tokenValue.match(/([a-z%]+)$/i);
        if (unitMatch) {
          detectedUnit = unitMatch[1];
        }
      }

      expression = expression.replace(`{${tokenRef}}`, String(numericValue));
    }

    // Also extract units from literal values in the expression (like "8px")
    if (!detectedUnit) {
      const literalUnitMatch = expression.match(/\d+([a-z%]+)/i);
      if (literalUnitMatch) {
        detectedUnit = literalUnitMatch[1];
      }
    }

    // Strip units from all literal values in the expression for calculation
    expression = expression.replace(/(\d+(?:\.\d+)?)([a-z%]+)/gi, '$1');

    // Evaluate mathematical expression and add back the unit
    const result = this.evaluateExpression(expression);
    return detectedUnit ? `${result}${detectedUnit}` : result;
  }

  private executeStateRule(rule: StateRule, tokenName: string): string {
    // Infer base token from dependent token name
    // primary-hover -> primary, spacing-lg-hover -> spacing-lg
    const baseTokenName = tokenName.replace(/-(?:hover|active|focus|disabled)$/, '');
    const token = this.registry.get(baseTokenName);

    if (!token) {
      throw new Error(`Base token ${baseTokenName} not found for state rule`);
    }

    // Generate appropriate state variant
    return this.generateStateVariant(String(token.value), rule.state);
  }

  private executeScaleRule(rule: ScaleRule, tokenName: string): string {
    // For scale rules, we need to find the base token from dependencies
    const dependencies = this.registry.getDependencies(tokenName);
    if (dependencies.length === 0) {
      throw new Error(`No dependencies found for scale rule on token: ${tokenName}`);
    }

    const baseTokenName = dependencies[0]; // Use first dependency as base
    const baseToken = this.registry.get(baseTokenName);

    if (!baseToken || typeof baseToken.value !== 'object') {
      throw new Error(`ColorValue token ${baseTokenName} not found for scale rule`);
    }

    // Extract OKLCH from scale position
    const colorValue = baseToken.value as { scale: Array<{ l: number; c: number; h: number }> };
    const position = parseInt(rule.position, 10);
    const scaleIndex = Math.floor(position / 100); // 600 -> index 6

    if (!colorValue.scale?.[scaleIndex]) {
      throw new Error(`Scale position ${rule.position} not found in ${baseTokenName}`);
    }

    return this.oklchToString(colorValue.scale[scaleIndex]);
  }

  private executeContrastRule(_rule: ContrastRule, tokenName: string): string {
    // For contrast rules, find the base token from dependencies
    const dependencies = this.registry.getDependencies(tokenName);
    if (dependencies.length === 0) {
      throw new Error(`No dependencies found for contrast rule on token: ${tokenName}`);
    }

    const baseTokenName = dependencies[0];
    const baseToken = this.registry.get(baseTokenName);

    if (!baseToken) {
      throw new Error(`Base token ${baseTokenName} not found for contrast rule`);
    }

    // Find best contrast color (simplified implementation)
    return this.findBestContrast(String(baseToken.value));
  }

  private executeInvertRule(_rule: InvertRule, tokenName: string): string {
    // For invert rules, find the base token from dependencies
    const dependencies = this.registry.getDependencies(tokenName);
    if (dependencies.length === 0) {
      throw new Error(`No dependencies found for invert rule on token: ${tokenName}`);
    }

    const baseTokenName = dependencies[0];
    const baseToken = this.registry.get(baseTokenName);

    if (!baseToken) {
      throw new Error(`Base token ${baseTokenName} not found for invert rule`);
    }

    // Invert the color for dark mode
    return this.invertColor(String(baseToken.value));
  }

  /**
   * Safely evaluate mathematical expressions
   */
  private evaluateExpression(expression: string): string {
    // Remove whitespace
    const clean = expression.trim();

    // Validate expression contains only safe characters (allow decimals)
    if (!/^[\d+\-*/.() ]+$/.test(clean)) {
      throw new Error(`Unsafe expression: ${expression}`);
    }

    try {
      // Use Function constructor for safer evaluation than eval
      const result = new Function(`return ${clean}`)();

      if (typeof result !== 'number' || !Number.isFinite(result)) {
        throw new Error(`Invalid calculation result: ${result}`);
      }

      return String(result);
    } catch (error) {
      throw new Error(`Cannot evaluate expression: ${expression} - ${error}`);
    }
  }

  /**
   * Generate state variant of a color
   */
  private generateStateVariant(
    baseValue: string,
    state: 'hover' | 'active' | 'focus' | 'disabled'
  ): string {
    // Simple state generation - adjust lightness based on state
    if (baseValue.startsWith('oklch(')) {
      return this.adjustOklchLightness(baseValue, state);
    }

    // For other color formats, return as-is for now
    return baseValue;
  }

  /**
   * Adjust OKLCH lightness for state variants
   */
  private adjustOklchLightness(
    oklch: string,
    state: 'hover' | 'active' | 'focus' | 'disabled'
  ): string {
    // Extract OKLCH values: oklch(0.6 0.15 240)
    const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (!match) return oklch;

    let l = parseFloat(match[1]);
    const c = parseFloat(match[2]);
    const h = parseFloat(match[3]);

    // Adjust lightness based on state
    switch (state) {
      case 'hover':
        l = Math.max(0, Math.min(1, l + 0.05)); // Slightly lighter
        break;
      case 'active':
        l = Math.max(0, Math.min(1, l - 0.05)); // Slightly darker
        break;
      case 'focus':
        l = Math.max(0, Math.min(1, l + 0.03)); // Slightly lighter
        break;
      case 'disabled':
        l = Math.max(0, Math.min(1, l + 0.2)); // Much lighter
        break;
    }

    return `oklch(${l.toFixed(3)} ${c} ${h})`;
  }

  /**
   * Convert OKLCH object to string
   */
  private oklchToString(oklch: { l: number; c: number; h: number }): string {
    return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`;
  }

  /**
   * Find best contrast color (simplified)
   */
  private findBestContrast(baseValue: string): string {
    // Simplified: return white or black based on lightness
    if (baseValue.startsWith('oklch(')) {
      const match = baseValue.match(/oklch\(([\d.]+)/);
      if (match) {
        const lightness = parseFloat(match[1]);
        return lightness > 0.5 ? 'oklch(0 0 0)' : 'oklch(1 0 0)'; // black : white
      }
    }

    return 'oklch(0 0 0)'; // Default to black
  }

  /**
   * Invert color for dark mode (simplified)
   */
  private invertColor(baseValue: string): string {
    if (baseValue.startsWith('oklch(')) {
      const match = baseValue.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
      if (match) {
        const l = parseFloat(match[1]);
        const c = parseFloat(match[2]);
        const h = parseFloat(match[3]);

        // Invert lightness
        const invertedL = 1 - l;

        return `oklch(${invertedL.toFixed(3)} ${c} ${h})`;
      }
    }

    return baseValue; // Return unchanged if not OKLCH
  }
}
