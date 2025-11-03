/**
 * Expression Evaluation for calc() Rules
 * Evaluates mathematical expressions like "calc({base} * 2)" or "calc({base} + 4px)"
 */

import { ALL_RATIOS } from './ratios.js';

/**
 * Evaluate a mathematical expression with variable substitution
 * Supports: +, -, *, /, (), and named ratio constants
 *
 * @example
 * evaluateExpression("2 * 3 + 4") // 10
 * evaluateExpression("golden * 16") // 25.888 (1.618 * 16)
 * evaluateExpression("(10 + 5) * 2") // 30
 */
export function evaluateExpression(expression: string): number {
  // Replace named ratios with their numeric values
  let normalizedExpr = expression;
  for (const [name, value] of Object.entries(ALL_RATIOS)) {
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    normalizedExpr = normalizedExpr.replace(regex, String(value));
  }

  // Remove units (px, rem, em, etc) for calculation
  normalizedExpr = normalizedExpr.replace(/(\d+(?:\.\d+)?)(px|rem|em|%)/g, '$1');

  // Basic expression evaluation using Function constructor
  // Note: This is safe for trusted design system expressions
  // DO NOT use with untrusted user input
  try {
    const result = Function(`'use strict'; return (${normalizedExpr})`)();
    return typeof result === 'number' ? result : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

/**
 * Check if an expression is valid (can be evaluated without errors)
 */
export function isValidExpression(expression: string): boolean {
  return !Number.isNaN(evaluateExpression(expression));
}
