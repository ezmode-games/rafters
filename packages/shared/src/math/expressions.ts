/**
 * Expression Evaluation for calc() Rules
 * Evaluates mathematical expressions like "calc({base} * 2)" or "calc({base} + 4px)"
 *
 * Uses a safe recursive descent parser instead of eval() or Function() constructor
 * to prevent arbitrary code execution vulnerabilities.
 */

import { ALL_RATIOS } from './ratios.js';

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
 *   factor     := number | '(' expression ')'
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

  // Safe expression evaluation using recursive descent parser
  try {
    const tokens = tokenize(normalizedExpr.trim());
    const parser = new ExpressionParser(tokens);
    const result = parser.parse();
    return typeof result === 'number' && Number.isFinite(result) ? result : Number.NaN;
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
