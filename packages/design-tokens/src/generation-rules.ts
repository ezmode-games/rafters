/**
 * Generation Rule Parser and Executor
 *
 * Parses and executes token generation rules for automatic token transformation.
 * Supports calc, scale, scale-position, state, contrast, and invert rule types.
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import scalePlugin from './plugins/scale';
import type { TokenRegistry } from './registry';

export interface ParsedRule {
  type: string;
  tokens?: string[];
  expression?: string | undefined;
  operation?: string | undefined;
  baseToken?: string | undefined;
  stateType?: string | undefined;
  contrast?: 'high' | 'medium' | 'low' | 'auto' | undefined;
  ratio?: number | undefined;
  scalePosition?: number | undefined;
}

/**
 * Maps Tailwind-style scale positions to array indices.
 * Standard 11-position scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
const SCALE_POSITION_MAP: Record<number, number> = {
  50: 0,
  100: 1,
  200: 2,
  300: 3,
  400: 4,
  500: 5,
  600: 6,
  700: 7,
  800: 8,
  900: 9,
  950: 10,
};

const VALID_SCALE_POSITIONS = Object.keys(SCALE_POSITION_MAP).map(Number);

export class GenerationRuleParser {
  /**
   * Parse a generation rule string into a structured rule object
   */
  parse(rule: string): ParsedRule {
    const trimmed = rule.trim();

    // Parse calc rules: calc({token1} + {token2})
    if (trimmed.startsWith('calc(')) {
      return this.parseCalcRule(trimmed);
    }

    // Parse colon-based rules: type:value
    if (trimmed.includes(':')) {
      const [type, value] = trimmed.split(':', 2);
      if (!type || !value) {
        throw new Error(`Invalid rule format: ${rule}`);
      }
      return this.parseColonRule(type.trim(), value.trim());
    }

    // Parse single-word rules: invert
    if (trimmed === 'invert') {
      return { type: 'invert' };
    }

    // Parse function-style rules (legacy support)
    if (trimmed.startsWith('scale(')) {
      return this.parseScaleRule(trimmed);
    }
    if (trimmed.startsWith('state(')) {
      return this.parseStateRule(trimmed);
    }
    if (trimmed.startsWith('contrast(')) {
      return this.parseContrastRule(trimmed);
    }
    if (trimmed.startsWith('invert(')) {
      return this.parseInvertRule(trimmed);
    }

    throw new Error(`Unknown rule type: ${rule}`);
  }

  private parseColonRule(type: string, value: string): ParsedRule {
    switch (type) {
      case 'state': {
        // Validate state types
        const validStates = ['hover', 'focus', 'active', 'disabled'];
        if (!validStates.includes(value)) {
          throw new Error(`Invalid state type: ${value}`);
        }
        return {
          type: 'state',
          stateType: value,
        };
      }
      case 'scale': {
        // Strict validation: only accept clean integers or decimals
        // Reject trailing chars (500foo), scientific notation (1e2), etc.
        if (!/^\d+(\.\d+)?$/.test(value)) {
          throw new Error(`Invalid scale value: ${value}`);
        }

        const numValue = parseFloat(value);
        if (Number.isNaN(numValue) || numValue <= 0) {
          throw new Error(`Invalid scale value: ${value}`);
        }

        // Check if this is a Tailwind-style scale position (50, 100, 200, etc.)
        // Must be an integer for scale positions
        if (Number.isInteger(numValue) && VALID_SCALE_POSITIONS.includes(numValue)) {
          return {
            type: 'scale-position',
            scalePosition: SCALE_POSITION_MAP[numValue],
          };
        }

        // Otherwise treat as a ratio for numeric scaling
        return {
          type: 'scale',
          ratio: numValue,
        };
      }
      case 'contrast': {
        const validContrasts = ['high', 'medium', 'low', 'auto'];
        if (!validContrasts.includes(value)) {
          throw new Error(`Invalid contrast level: ${value}`);
        }
        return {
          type: 'contrast',
          contrast: value as 'high' | 'medium' | 'low' | 'auto',
        };
      }
      default:
        throw new Error(`Unknown rule type: ${type}`);
    }
  }

  private parseCalcRule(rule: string): ParsedRule {
    const match = rule.match(/^calc\((.+)\)$/);
    if (!match) {
      throw new Error(`Invalid calc rule: ${rule}`);
    }

    const expression = match[1];
    const tokens: string[] = [];

    // Check for unclosed brackets
    if (expression?.includes('{') && !expression.includes('}')) {
      throw new Error(`Unclosed bracket in calc expression: ${expression}`);
    }

    // Check for empty braces {} which are invalid
    if (expression?.includes('{}')) {
      throw new Error(`Empty token reference in calc expression: ${expression}`);
    }

    // Extract tokens wrapped in {}
    const tokenMatches = expression?.match(/\{([^}]+)\}/g);
    if (tokenMatches) {
      for (const tokenMatch of tokenMatches) {
        const tokenName = tokenMatch.slice(1, -1); // Remove { and }
        if (!tokenName.trim()) {
          throw new Error(`Empty token reference in calc expression: ${expression}`);
        }
        tokens.push(tokenName);
      }
    }

    // Check for incomplete expressions (ending with operator)
    if (expression?.trim().match(/[+\-*/]$/)) {
      throw new Error(`Incomplete calc expression: ${expression}`);
    }

    return {
      type: 'calc',
      expression,
      tokens,
    };
  }

  private parseScaleRule(rule: string): ParsedRule {
    const match = rule.match(/^scale\(([^,]+),?\s*([^)]*)\)$/);
    if (!match || !match[1]) {
      throw new Error(`Invalid scale rule: ${rule}`);
    }

    return {
      type: 'scale',
      baseToken: match[1].trim(),
      ratio: match[2] ? parseFloat(match[2].trim()) : 1.5,
    };
  }

  private parseStateRule(rule: string): ParsedRule {
    const match = rule.match(/^state\(([^,]+),?\s*([^)]*)\)$/);
    if (!match || !match[1]) {
      throw new Error(`Invalid state rule: ${rule}`);
    }

    return {
      type: 'state',
      baseToken: match[1].trim(),
      stateType: match[2] ? match[2].trim() : 'hover',
    };
  }

  private parseContrastRule(rule: string): ParsedRule {
    const match = rule.match(/^contrast\(([^,]+),?\s*([^)]*)\)$/);
    if (!match || !match[1]) {
      throw new Error(`Invalid contrast rule: ${rule}`);
    }

    const contrastLevel = match[2] ? match[2].trim() : 'high';
    if (!['high', 'medium', 'low'].includes(contrastLevel)) {
      throw new Error(`Invalid contrast level: ${contrastLevel}`);
    }

    return {
      type: 'contrast',
      baseToken: match[1].trim(),
      contrast: contrastLevel as 'high' | 'medium' | 'low',
    };
  }

  private parseInvertRule(rule: string): ParsedRule {
    const match = rule.match(/^invert\(([^)]+)\)$/);
    if (!match || !match[1]) {
      throw new Error(`Invalid invert rule: ${rule}`);
    }

    return {
      type: 'invert',
      baseToken: match[1].trim(),
    };
  }
}

export class GenerationRuleExecutor {
  constructor(private registry: TokenRegistry) {}

  /**
   * Execute a parsed rule and return the computed value
   */
  execute(rule: ParsedRule, tokenName: string): string {
    switch (rule.type) {
      case 'calc':
        return this.executeCalcRule(rule);
      case 'scale':
        return this.executeScaleRule(rule);
      case 'scale-position':
        return this.executeScalePositionRule(rule, tokenName);
      case 'state':
        return this.executeStateRule(rule);
      case 'contrast':
        return this.executeContrastRule(rule);
      case 'invert':
        return this.executeInvertRule(rule);
      default:
        throw new Error(`Unknown rule type: ${rule.type}`);
    }
  }

  private executeCalcRule(rule: ParsedRule): string {
    if (!rule.expression) {
      throw new Error('Calc rule missing expression');
    }

    let expression = rule.expression;

    // Replace token references with actual values
    if (rule.tokens) {
      for (const tokenName of rule.tokens) {
        const token = this.registry.get(tokenName);
        if (!token) {
          throw new Error(`Token not found: ${tokenName}`);
        }

        const tokenValue = String(token.value);
        expression = expression.replace(new RegExp(`\\{${tokenName}\\}`, 'g'), tokenValue);
      }
    }

    // Return the CSS calc expression
    return `calc(${expression})`;
  }

  private executeScaleRule(rule: ParsedRule): string {
    if (!rule.baseToken) {
      throw new Error('Scale rule missing base token');
    }

    const baseToken = this.registry.get(rule.baseToken);
    if (!baseToken) {
      throw new Error(`Base token not found: ${rule.baseToken}`);
    }

    const baseValue = String(baseToken.value);
    const ratio = rule.ratio || 1.5;

    // For numeric values, multiply by ratio
    const numericMatch = baseValue.match(/^([0-9.]+)(.*)$/);
    if (numericMatch?.[1]) {
      const value = parseFloat(numericMatch[1]);
      const unit = numericMatch[2] || '';
      return `${value * ratio}${unit}`;
    }

    // For non-numeric values, return calc expression
    return `calc(${baseValue} * ${ratio})`;
  }

  /**
   * Execute a scale-position rule to extract a value from a ColorValue's scale array.
   * Delegates to the scale plugin for lazy reference, then resolves to CSS.
   */
  private executeScalePositionRule(_rule: ParsedRule, tokenName: string): string {
    // Get the token's dependencies
    const dependencies = this.registry.getDependencies(tokenName);

    // Use the scale plugin to get the reference
    const reference = scalePlugin(this.registry, tokenName, dependencies);

    // Resolve the reference to a CSS value
    return this.resolveColorReference(reference);
  }

  /**
   * Resolve a color reference {family, position} to a CSS value.
   * This is the bridge between lazy plugin references and immediate CSS values.
   */
  resolveColorReference(reference: { family: string; position: string | number }): string {
    const familyToken = this.registry.get(reference.family);
    if (!familyToken) {
      throw new Error(`Family token not found: ${reference.family}`);
    }

    const colorValue = familyToken.value as ColorValue;
    if (!colorValue || !Array.isArray(colorValue.scale)) {
      throw new Error(`Token ${reference.family} is not a ColorValue with a scale array`);
    }

    // Convert position to array index
    const positionNum =
      typeof reference.position === 'string'
        ? parseInt(reference.position, 10)
        : reference.position;

    const index = SCALE_POSITION_MAP[positionNum];
    if (index === undefined) {
      throw new Error(`Invalid scale position: ${reference.position}`);
    }

    if (index < 0 || index >= colorValue.scale.length) {
      throw new Error(
        `Scale position ${reference.position} out of bounds (0-${colorValue.scale.length - 1})`,
      );
    }

    const oklch = colorValue.scale[index];
    if (!oklch) {
      throw new Error(`No color value at scale position ${reference.position}`);
    }

    return this.oklchToCSS(oklch);
  }

  /**
   * Convert an OKLCH color to CSS string format
   */
  private oklchToCSS(oklch: OKLCH): string {
    const l = oklch.l.toFixed(3);
    const c = oklch.c.toFixed(3);
    const h = Math.round(oklch.h);
    const alpha = oklch.alpha ?? 1;

    if (alpha < 1) {
      return `oklch(${l} ${c} ${h} / ${alpha.toFixed(2)})`;
    }
    return `oklch(${l} ${c} ${h})`;
  }

  private executeStateRule(rule: ParsedRule): string {
    if (!rule.baseToken) {
      throw new Error('State rule missing base token');
    }

    const baseToken = this.registry.get(rule.baseToken);
    if (!baseToken) {
      throw new Error(`Base token not found: ${rule.baseToken}`);
    }

    const baseValue = String(baseToken.value);
    const stateType = rule.stateType || 'hover';

    // Simple state transformation - could be enhanced based on state type
    switch (stateType) {
      case 'hover':
        return `${baseValue}:hover`;
      case 'focus':
        return `${baseValue}:focus`;
      case 'active':
        return `${baseValue}:active`;
      default:
        return `${baseValue}:${stateType}`;
    }
  }

  private executeContrastRule(rule: ParsedRule): string {
    if (!rule.baseToken) {
      throw new Error('Contrast rule missing base token');
    }

    const baseToken = this.registry.get(rule.baseToken);
    if (!baseToken) {
      throw new Error(`Base token not found: ${rule.baseToken}`);
    }

    const baseValue = String(baseToken.value);
    const contrast = rule.contrast || 'high';

    // Simple contrast transformation - could be enhanced with actual color contrast calculations
    return `contrast(${baseValue}, ${contrast})`;
  }

  private executeInvertRule(rule: ParsedRule): string {
    if (!rule.baseToken) {
      throw new Error('Invert rule missing base token');
    }

    const baseToken = this.registry.get(rule.baseToken);
    if (!baseToken) {
      throw new Error(`Base token not found: ${rule.baseToken}`);
    }

    const baseValue = String(baseToken.value);

    // Simple invert transformation - could be enhanced with actual color inversion
    return `invert(${baseValue})`;
  }
}
