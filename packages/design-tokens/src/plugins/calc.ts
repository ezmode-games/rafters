/**
 * Calc Rule Plugin
 *
 * Executes sophisticated mathematical expressions that understand different progression systems:
 * - Linear progressions: calc({base} * 2)
 * - Musical intervals: calc({base} * minor-third)
 * - Golden ratio: calc({base} * golden)
 * - Custom multipliers: calc({base} * 1.618)
 */

import { ALL_RATIOS, evaluateExpression } from '@rafters/math-utils';
import type { Token } from '@rafters/shared';
import type { TokenRegistry } from '../registry';

export default function calc(
  registry: TokenRegistry,
  tokenName: string,
  dependencies: string[]
): string {
  // Extract calc expression from token metadata or infer from naming pattern
  const token = registry.get(tokenName);
  let expression = '';

  // Try to get expression from token metadata first
  if (token && typeof token === 'object' && 'mathRelationship' in token) {
    expression = (token as Token).mathRelationship || '';
  } else {
    // Infer expression from token name pattern
    // Examples: "spacing-2x", "size-golden", "margin-triple"
    expression = inferExpressionFromTokenName(tokenName);
  }

  if (!expression) {
    throw new Error(`No calc expression found for token: ${tokenName}`);
  }

  // Get all dependency tokens
  const tokenValues: Record<string, string> = {};

  for (const depName of dependencies) {
    const depToken = registry.get(depName);
    if (!depToken) {
      throw new Error(`Dependency token ${depName} not found for calc rule`);
    }

    // Extract the raw value as string
    const value =
      typeof depToken.value === 'object' ? JSON.stringify(depToken.value) : String(depToken.value);

    tokenValues[depName] = value;
  }

  // Evaluate the expression using math-utils
  return evaluateCalcExpression(expression, tokenValues);
}

/**
 * Infer calc expression from token naming patterns
 */
function inferExpressionFromTokenName(tokenName: string): string {
  // Pattern: base-token-multiplier
  // Examples: spacing-base-2x, size-base-golden, margin-base-minor-third

  const patterns = [
    // Musical intervals: spacing-base-minor-third
    /(.+)-(minor-second|major-second|minor-third|major-third|perfect-fourth|augmented-fourth|perfect-fifth)$/,
    // Golden ratio: spacing-base-golden
    /(.+)-(golden|golden-ratio)$/,
    // Numeric multipliers: spacing-base-2x, spacing-base-triple
    /(.+)-(2x|3x|4x|double|triple|quadruple)$/,
    // Simple addition: spacing-base-plus-4
    /(.+)-plus-(\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = tokenName.match(pattern);
    if (match) {
      const baseToken = match[1];
      const modifier = match[2];

      if (Object.keys(ALL_RATIOS).includes(modifier)) {
        return `{${baseToken}} * ${modifier}`;
      }

      switch (modifier) {
        case '2x':
        case 'double':
          return `{${baseToken}} * 2`;
        case '3x':
        case 'triple':
          return `{${baseToken}} * 3`;
        case '4x':
        case 'quadruple':
          return `{${baseToken}} * 4`;
        default:
          if (match[2] && /^\d+$/.test(match[2])) {
            return `{${baseToken}} + ${match[2]}`;
          }
      }
    }
  }

  // Fallback: assume simple multiplication if no pattern matched
  return `{${tokenName.split('-')[0]}} * 1`;
}

/**
 * Helper function to evaluate a calc expression with token substitution and units
 */
function evaluateCalcExpression(expression: string, tokenValues: Record<string, string>): string {
  let detectedUnit = '';

  // Convert tokenValues to numeric values and extract units
  const numericValues: Record<string, number> = {};

  for (const [tokenName, tokenValue] of Object.entries(tokenValues)) {
    const numericValue = parseFloat(tokenValue);
    if (Number.isNaN(numericValue)) {
      throw new Error(`Token ${tokenName} value "${tokenValue}" is not numeric`);
    }

    // Extract unit from first token that has one
    if (!detectedUnit) {
      const unitMatch = tokenValue.match(/([a-z%]+)$/i);
      if (unitMatch) {
        detectedUnit = unitMatch[1];
      }
    }

    numericValues[tokenName] = numericValue;
  }

  // Extract units from literal values in the expression
  if (!detectedUnit) {
    const literalUnitMatch = expression.match(/\d+([a-z%]+)/i);
    if (literalUnitMatch) {
      detectedUnit = literalUnitMatch[1];
    }
  }

  // Use math-utils to evaluate the expression
  const result = evaluateExpression(expression, numericValues);

  // Add back the unit if we detected one
  return detectedUnit ? `${result}${detectedUnit}` : String(result);
}
