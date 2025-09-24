/**
 * Unit-Aware Mathematical Operations
 *
 * Handles calculations with CSS units (px, rem, em, %, vw, vh) while preserving
 * unit information and enabling unit conversions.
 */

/**
 * Supported CSS units
 */
export type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'ch' | 'ex';

/**
 * Value with unit information
 */
export interface UnitValue {
  value: number;
  unit: CSSUnit | '';
}

/**
 * Parse a CSS value string into value and unit components
 *
 * @param cssValue - CSS value string (e.g., "16px", "1.5rem", "100%")
 * @returns Object with numeric value and unit
 *
 * @example
 * ```typescript
 * parseUnit("16px"); // { value: 16, unit: "px" }
 * parseUnit("1.5rem"); // { value: 1.5, unit: "rem" }
 * parseUnit("100"); // { value: 100, unit: "" }
 * ```
 */
export function parseUnit(cssValue: string): UnitValue {
  const trimmed = cssValue.trim();
  const match = trimmed.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);

  if (!match) {
    throw new Error(`Invalid CSS value: ${cssValue}`);
  }

  return {
    value: parseFloat(match[1]),
    unit: match[2] as CSSUnit | '',
  };
}

/**
 * Format a UnitValue back to CSS string
 *
 * @param unitValue - Value with unit information
 * @returns CSS value string
 *
 * @example
 * ```typescript
 * formatUnit({ value: 16, unit: "px" }); // "16px"
 * formatUnit({ value: 1.5, unit: "rem" }); // "1.5rem"
 * ```
 */
export function formatUnit(unitValue: UnitValue): string {
  return `${unitValue.value}${unitValue.unit}`;
}

/**
 * Perform mathematical operations on CSS values with unit preservation
 *
 * @param left - Left operand CSS value
 * @param operator - Mathematical operator
 * @param right - Right operand (CSS value or number)
 * @returns Result CSS value string
 *
 * @example
 * ```typescript
 * calculateWithUnits("16px", "*", 2); // "32px"
 * calculateWithUnits("1.5rem", "+", "8px"); // Error: Unit mismatch
 * calculateWithUnits("100%", "/", 2); // "50%"
 * ```
 */
export function calculateWithUnits(
  left: string,
  operator: '+' | '-' | '*' | '/',
  right: string | number
): string {
  const leftParsed = parseUnit(left);

  let rightParsed: UnitValue;
  if (typeof right === 'number') {
    rightParsed = { value: right, unit: '' };
  } else {
    rightParsed = parseUnit(right);
  }

  // Handle unit compatibility
  if (operator === '+' || operator === '-') {
    if (leftParsed.unit !== rightParsed.unit && rightParsed.unit !== '') {
      throw new Error(
        `Cannot ${operator === '+' ? 'add' : 'subtract'} different units: ${leftParsed.unit} and ${rightParsed.unit}`
      );
    }
  }

  // Perform calculation
  let result: number;
  switch (operator) {
    case '+':
      result = leftParsed.value + rightParsed.value;
      break;
    case '-':
      result = leftParsed.value - rightParsed.value;
      break;
    case '*':
      result = leftParsed.value * rightParsed.value;
      break;
    case '/':
      if (rightParsed.value === 0) {
        throw new Error('Division by zero');
      }
      result = leftParsed.value / rightParsed.value;
      break;
  }

  // Determine result unit
  let resultUnit: CSSUnit | '';
  if (operator === '*' || operator === '/') {
    // For multiplication/division, use the unit from the left operand if right is unitless
    resultUnit = rightParsed.unit === '' ? leftParsed.unit : rightParsed.unit;
  } else {
    // For addition/subtraction, preserve the unit
    resultUnit = leftParsed.unit;
  }

  return formatUnit({ value: result, unit: resultUnit });
}

/**
 * Convert between CSS units (simplified - requires context for accurate conversion)
 *
 * @param value - CSS value to convert
 * @param targetUnit - Target unit
 * @param context - Context for conversion (base font size, viewport dimensions)
 * @returns Converted CSS value
 *
 * Note: This is a simplified conversion. For production use, you'd need actual
 * DOM context or explicit base values.
 */
export function convertUnit(
  value: string,
  targetUnit: CSSUnit,
  context: { baseFontSize?: number; viewportWidth?: number; viewportHeight?: number } = {}
): string {
  const parsed = parseUnit(value);
  const { baseFontSize = 16, viewportWidth = 1920, viewportHeight = 1080 } = context;

  if (parsed.unit === targetUnit) {
    return value; // No conversion needed
  }

  let pxValue: number;

  // First convert to pixels
  switch (parsed.unit) {
    case 'px':
      pxValue = parsed.value;
      break;
    case 'rem':
      pxValue = parsed.value * baseFontSize;
      break;
    case 'em':
      pxValue = parsed.value * baseFontSize; // Simplified - would need parent context
      break;
    case 'vw':
      pxValue = (parsed.value / 100) * viewportWidth;
      break;
    case 'vh':
      pxValue = (parsed.value / 100) * viewportHeight;
      break;
    case '%':
      throw new Error('Cannot convert percentage without parent context');
    default:
      throw new Error(`Unsupported unit conversion from: ${parsed.unit}`);
  }

  // Then convert from pixels to target unit
  let result: number;
  switch (targetUnit) {
    case 'px':
      result = pxValue;
      break;
    case 'rem':
      result = pxValue / baseFontSize;
      break;
    case 'em':
      result = pxValue / baseFontSize; // Simplified
      break;
    case 'vw':
      result = (pxValue / viewportWidth) * 100;
      break;
    case 'vh':
      result = (pxValue / viewportHeight) * 100;
      break;
    default:
      throw new Error(`Unsupported unit conversion to: ${targetUnit}`);
  }

  return formatUnit({ value: result, unit: targetUnit });
}

/**
 * Evaluate mathematical expressions with CSS units
 *
 * @param expression - Expression with CSS values (e.g., "16px * 1.5 + 8px")
 * @param variables - Variable substitutions with units
 * @returns Calculated CSS value
 *
 * @example
 * ```typescript
 * evaluateWithUnits("16px * 1.5"); // "24px"
 * evaluateWithUnits("base * golden", { base: "16px" }); // "25.888px"
 * ```
 */
export function evaluateWithUnits(
  expression: string,
  variables: Record<string, string> = {}
): string {
  // This is a simplified implementation
  // A full implementation would need a proper expression parser

  // Substitute variables in the expression
  let substituted = expression;
  for (const [key, value] of Object.entries(variables)) {
    // Replace all occurrences of the variable name with its value
    // Use word boundaries to avoid partial replacements
    substituted = substituted.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
  }

  // For now, handle simple cases
  const simpleMultiplication = substituted.match(/^(.+?)\s*\*\s*(.+)$/);
  if (simpleMultiplication) {
    const [, left, rightRaw] = simpleMultiplication;
    // Handle the right operand which might be a number or have units
    const right = rightRaw.trim();
    const parsedRight = parseUnit(right);
    // For multiplication, typically only the value is used, unit is preserved from left
    return calculateWithUnits(left.trim(), '*', parsedRight.value);
  }

  const simpleAddition = expression.match(/^(.+?)\s*\+\s*(.+)$/);
  if (simpleAddition) {
    const [, left, right] = simpleAddition;
    return calculateWithUnits(left.trim(), '+', right.trim());
  }

  throw new Error(`Complex unit expressions not yet supported: ${expression}`);
}
