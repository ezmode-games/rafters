/**
 * Mathematical Calculation Engine
 *
 * Expression evaluation with ratio-name substitution and unit-aware arithmetic.
 * Powers the calc() rule system in design-tokens. All ratio operations take
 * `Ratio` instances; expression evaluation accepts a ratio registry whose
 * names are matched verbatim in the expression text.
 */

import { DEFAULT_RATIOS, type Ratio, ratioValue } from './ratios.js';

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
 * Recursive descent parser for mathematical expressions.
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
      this.consume();
      const result = this.expression();
      if (this.current() !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      this.consume();
      return result;
    }

    if (token === '-') {
      this.consume();
      return -this.factor();
    }

    throw new Error(`Unexpected token: ${token}`);
  }
}

export interface EvaluateExpressionOptions {
  /** Variable substitutions, e.g. `{ base: 16, spacing: 4 }`. */
  variables?: Record<string, number>;
  /** Ratio registry whose names are substituted. Defaults to DEFAULT_RATIOS. */
  ratios?: readonly Ratio[];
}

/**
 * Safely evaluate a mathematical expression. Substitutes named variables
 * (with or without `{...}` braces) and named ratios from the supplied
 * registry, then evaluates the resulting numeric expression.
 */
export function evaluateExpression(
  expression: string,
  options: EvaluateExpressionOptions = {},
): number {
  const { variables = {}, ratios = DEFAULT_RATIOS } = options;
  let processed = expression.trim();

  // Braced variables: {name} -> value
  for (const [name, value] of Object.entries(variables)) {
    const re = new RegExp(`\\{${name.replace('-', '\\-')}\\}`, 'g');
    processed = processed.replace(re, String(value));
  }

  // Named ratios: name -> a / b
  for (const r of ratios) {
    const re = new RegExp(`\\b${r.name.replace('-', '\\-')}\\b`, 'g');
    processed = processed.replace(re, String(ratioValue(r)));
  }

  // Bare variables (back-compat with calc plugin's pre-substitution flow).
  for (const [name, value] of Object.entries(variables)) {
    const re = new RegExp(`\\b${name.replace('-', '\\-')}\\b`, 'g');
    processed = processed.replace(re, String(value));
  }

  try {
    const tokens = tokenize(processed);
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
 * Compute the value of a ratio progression at the given step. Equivalent
 * to `progression(r, baseValue, step)` from progressions.ts; kept here
 * for ergonomic call-site grouping.
 */
export function calculateProgressionStep(baseValue: number, r: Ratio, step: number): number {
  return baseValue * ratioValue(r) ** step;
}

/**
 * Find the step in a ratio progression whose value is closest to `targetValue`.
 * Searches `0..maxSteps - 1` and returns the closest match.
 */
export function findClosestProgressionStep(
  targetValue: number,
  baseValue: number,
  r: Ratio,
  maxSteps: number = 20,
): { value: number; step: number; difference: number } {
  let closestValue = baseValue;
  let closestStep = 0;
  let closestDifference = Math.abs(targetValue - baseValue);

  for (let step = 0; step < maxSteps; step++) {
    const value = calculateProgressionStep(baseValue, r, step);
    const difference = Math.abs(targetValue - value);

    if (difference < closestDifference) {
      closestValue = value;
      closestStep = step;
      closestDifference = difference;
    }

    if (value > targetValue * 2) {
      break;
    }
  }

  return { value: closestValue, step: closestStep, difference: closestDifference };
}

/**
 * Interpolate between `start` and `end` at progress `p` (0..1). Linear by
 * default; pass a `Ratio` to use ratio-based easing.
 */
export function interpolate(start: number, end: number, progress: number, easing?: Ratio): number {
  if (progress < 0 || progress > 1) {
    throw new Error('Progress must be between 0 and 1');
  }
  if (!easing) {
    return start + (end - start) * progress;
  }
  const ratio = ratioValue(easing);
  const easedProgress = progress ** (Math.log(ratio) / Math.log(2));
  return start + (end - start) * easedProgress;
}
