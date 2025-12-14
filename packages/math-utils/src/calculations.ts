/**
 * Mathematical Calculation Engine
 *
 * Expression evaluation with support for musical ratios, mathematical constants,
 * and unit-aware arithmetic. Powers the calc() rule system.
 */

import { ALL_RATIOS, getRatio, type ProgressionType } from './constants.js';

/**
 * Tokenize an expression into numbers and operators
 */
function tokenize(expr: string): Array<string | number> {
  const tokens: Array<string | number> = [];
  let current = '';

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (!char) continue;

    if (char === ' ') {
      continue;
    }

    if ('+-*/()'.includes(char)) {
      if (current) {
        const num = parseFloat(current);
        if (!Number.isNaN(num)) {
          tokens.push(num);
        }
        current = '';
      }
      tokens.push(char);
    } else if (char) {
      current += char;
    }
  }

  if (current) {
    const num = parseFloat(current);
    if (!Number.isNaN(num)) {
      tokens.push(num);
    }
  }

  return tokens;
}

/**
 * Recursive descent parser for mathematical expressions
 * Grammar:
 *   expression := term (('+' | '-') term)*
 *   term       := factor (('*' | '/') factor)*
 *   factor     := number | '(' expression ')' | '-' factor
 */
class ExpressionParser {
  private tokens: Array<string | number>;
  private position: number;

  constructor(tokens: Array<string | number>) {
    this.tokens = tokens;
    this.position = 0;
  }

  private current(): string | number | undefined {
    return this.tokens[this.position];
  }

  private consume(): string | number | undefined {
    return this.tokens[this.position++];
  }

  parse(): number {
    const result = this.expression();
    if (this.position < this.tokens.length) {
      throw new Error('Unexpected token after expression');
    }
    return result;
  }

  private expression(): number {
    let left = this.term();

    while (this.current() === '+' || this.current() === '-') {
      const op = this.consume();
      const right = this.term();

      if (op === '+') {
        left = left + right;
      } else {
        left = left - right;
      }
    }

    return left;
  }

  private term(): number {
    let left = this.factor();

    while (this.current() === '*' || this.current() === '/') {
      const op = this.consume();
      const right = this.factor();

      if (op === '*') {
        left = left * right;
      } else {
        if (right === 0) {
          throw new Error('Division by zero');
        }
        left = left / right;
      }
    }

    return left;
  }

  private factor(): number {
    const token = this.current();

    if (typeof token === 'number') {
      this.consume();
      return token;
    }

    if (token === '(') {
      this.consume(); // consume '('
      const result = this.expression();
      if (this.current() !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      this.consume(); // consume ')'
      return result;
    }

    if (token === '-') {
      this.consume(); // consume '-'
      return -this.factor();
    }

    throw new Error(`Unexpected token: ${token}`);
  }
}

/**
 * Safely evaluate mathematical expressions with ratio substitution
 *
 * @param expression - Mathematical expression (e.g., "16 * golden", "base * minor-third + 4")
 * @param variables - Variable substitutions (e.g., { base: 16, spacing: 8 })
 * @returns Calculated result as number
 *
 * @example
 * ```typescript
 * // Simple ratio calculation
 * evaluateExpression("16 * golden"); // 25.888
 *
 * // Complex expression with variables
 * evaluateExpression("base * minor-third + spacing", { base: 16, spacing: 4 }); // 23.2
 *
 * // Nested calculations
 * evaluateExpression("(base * golden) / perfect-fourth", { base: 12 }); // 14.616
 * ```
 */
export function evaluateExpression(
  expression: string,
  variables: Record<string, number> = {},
): number {
  let processedExpression = expression.trim();

  // First, substitute variables with braces (e.g., {spacing-base} -> 16)
  for (const [varName, varValue] of Object.entries(variables)) {
    const bracedVarRegex = new RegExp(`\\{${varName.replace('-', '\\-')}\\}`, 'g');
    processedExpression = processedExpression.replace(bracedVarRegex, String(varValue));
  }

  // Then substitute ratio names with their numeric values
  for (const [ratioName, ratioValue] of Object.entries(ALL_RATIOS)) {
    const ratioRegex = new RegExp(`\\b${ratioName.replace('-', '\\-')}\\b`, 'g');
    processedExpression = processedExpression.replace(ratioRegex, String(ratioValue));
  }

  // Also substitute variables without braces (for backward compatibility)
  for (const [varName, varValue] of Object.entries(variables)) {
    const varRegex = new RegExp(`\\b${varName.replace('-', '\\-')}\\b`, 'g');
    processedExpression = processedExpression.replace(varRegex, String(varValue));
  }

  // Safe expression evaluation using recursive descent parser
  // This eliminates the security vulnerability from using Function() constructor
  try {
    const tokens = tokenize(processedExpression);
    const parser = new ExpressionParser(tokens);
    const result = parser.parse();

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new Error(`Invalid calculation result: ${result}`);
    }

    return result;
  } catch (error) {
    throw new Error(`Cannot evaluate expression: ${expression} - ${error}`);
  }
}

/**
 * Calculate value using a specific mathematical progression step
 *
 * @param baseValue - Starting value
 * @param progressionType - Type of mathematical progression
 * @param step - Step number in the progression (0-based)
 * @param multiplier - Custom multiplier for exponential progressions
 * @returns Calculated value at the specified step
 *
 * @example
 * ```typescript
 * // Get 3rd step of golden ratio progression from base 16
 * calculateProgressionStep(16, 'golden', 2); // 41.887
 *
 * // Get 5th step of linear progression
 * calculateProgressionStep(4, 'linear', 4); // 20
 * ```
 */
export function calculateProgressionStep(
  baseValue: number,
  progressionType: ProgressionType,
  step: number,
  multiplier: number = 1.25,
): number {
  if (step < 0) {
    throw new Error('Step must be non-negative');
  }

  switch (progressionType) {
    case 'linear':
      return baseValue * (step + 1);

    case 'exponential':
      return baseValue * multiplier ** step;

    default:
      // Musical ratios or mathematical constants
      try {
        const ratio = getRatio(progressionType);
        return baseValue * ratio ** step;
      } catch (_error) {
        throw new Error(`Invalid progression type: ${progressionType}`);
      }
  }
}

/**
 * Find the closest value in a progression to a target value
 *
 * @param targetValue - Value to match
 * @param baseValue - Base value of the progression
 * @param progressionType - Type of progression to search
 * @param maxSteps - Maximum steps to search (default: 20)
 * @returns Object with closest value, step, and difference
 *
 * @example
 * ```typescript
 * // Find closest golden ratio step to 25
 * findClosestProgressionStep(25, 16, 'golden', 10);
 * // Result: { value: 25.888, step: 1, difference: 0.888 }
 * ```
 */
export function findClosestProgressionStep(
  targetValue: number,
  baseValue: number,
  progressionType: ProgressionType,
  maxSteps: number = 20,
): { value: number; step: number; difference: number } {
  let closestValue = baseValue;
  let closestStep = 0;
  let closestDifference = Math.abs(targetValue - baseValue);

  for (let step = 0; step < maxSteps; step++) {
    const value = calculateProgressionStep(baseValue, progressionType, step);
    const difference = Math.abs(targetValue - value);

    if (difference < closestDifference) {
      closestValue = value;
      closestStep = step;
      closestDifference = difference;
    }

    // Stop if we've gone past the target by a significant amount
    if (value > targetValue * 2) {
      break;
    }
  }

  return {
    value: closestValue,
    step: closestStep,
    difference: closestDifference,
  };
}

/**
 * Interpolate between two values using a mathematical progression
 *
 * @param start - Starting value
 * @param end - Ending value
 * @param progress - Progress between 0 and 1
 * @param easing - Easing function type
 * @returns Interpolated value
 *
 * @example
 * ```typescript
 * // Linear interpolation
 * interpolate(10, 20, 0.5, 'linear'); // 15
 *
 * // Ease using golden ratio
 * interpolate(10, 20, 0.5, 'golden'); // ~12.36
 * ```
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easing: ProgressionType = 'linear',
): number {
  if (progress < 0 || progress > 1) {
    throw new Error('Progress must be between 0 and 1');
  }

  if (easing === 'linear') {
    return start + (end - start) * progress;
  }

  // Apply easing using the specified ratio
  const ratio = getRatio(easing);
  const easedProgress = progress ** (Math.log(ratio) / Math.log(2));

  return start + (end - start) * easedProgress;
}
