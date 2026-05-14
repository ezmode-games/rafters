import { evaluateExpression } from '@rafters/math-utils';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';

const CalcInputSchema = z.object({
  expression: z.string(),
  tokens: z.array(z.string()),
});

type CalcInput = z.infer<typeof CalcInputSchema>;

export const calcPlugin = definePlugin<CalcInput, string>({
  name: 'calc',
  inputSchema: CalcInputSchema,
  outputSchema: z.string(),
  dependsOn: (input) => input.tokens,
  transform: (input, get) => {
    let expression = input.expression;
    let detectedUnit = '';

    for (const tokenName of input.tokens) {
      const tokenValue = get(tokenName);
      if (typeof tokenValue !== 'string') {
        throw new Error(`calc plugin: token "${tokenName}" value is not a string`);
      }
      const numericValue = Number.parseFloat(tokenValue);
      if (Number.isNaN(numericValue)) {
        throw new Error(`calc plugin: token "${tokenName}" value "${tokenValue}" is not numeric`);
      }
      if (!detectedUnit) {
        const unitMatch = tokenValue.match(/([a-z%]+)$/i);
        if (unitMatch?.[1]) detectedUnit = unitMatch[1];
      }
      expression = expression.replace(new RegExp(`\\{${tokenName}\\}`, 'g'), String(numericValue));
    }

    if (!detectedUnit) {
      const literalUnitMatch = expression.match(/\d+([a-z%]+)/i);
      if (literalUnitMatch?.[1]) detectedUnit = literalUnitMatch[1];
    }

    const result = evaluateExpression(expression);
    return detectedUnit ? `${result}${detectedUnit}` : String(result);
  },
});
