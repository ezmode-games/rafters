/**
 * Expression Evaluation for calc() Rules
 *
 * Lightweight expression evaluator that substitutes ratio names from a
 * registry, strips trailing units, and evaluates via a safe recursive
 * descent parser. For full variable + ratio substitution use
 * `evaluateExpression` from `./calculations.js`.
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
 * Recursive descent parser for mathematical expressions
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

/**
 * Evaluate a mathematical expression with named-ratio substitution.
 * Strips trailing CSS-unit suffixes (px, rem, em, %) before evaluation
 * so an expression like `"16px * 1.5"` returns `24`. Returns `NaN` on
 * any parse failure.
 */
export function evaluateExpression(
  expression: string,
  ratios: readonly Ratio[] = DEFAULT_RATIOS,
): number {
  let normalized = expression;
  for (const r of ratios) {
    const re = new RegExp(`\\b${r.name.replace('-', '\\-')}\\b`, 'g');
    normalized = normalized.replace(re, String(ratioValue(r)));
  }

  // Strip simple unit suffixes for the calc() use case.
  normalized = normalized.replace(/(\d+(?:\.\d+)?)(px|rem|em|%)/g, '$1');

  try {
    const tokens = tokenize(normalized.trim());
    const parser = new ExpressionParser(tokens);
    const result = parser.parse();
    return typeof result === 'number' && Number.isFinite(result) ? result : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

/**
 * Check if an expression evaluates to a finite number.
 */
export function isValidExpression(
  expression: string,
  ratios: readonly Ratio[] = DEFAULT_RATIOS,
): boolean {
  return !Number.isNaN(evaluateExpression(expression, ratios));
}
