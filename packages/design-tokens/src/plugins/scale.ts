import { type ColorReference, ColorReferenceSchema, type ColorValue } from '@rafters/shared';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';
import { INDEX_TO_POSITION } from '../scale-positions.js';

const ScaleInputSchema = z.object({
  familyName: z.string(),
  scalePosition: z.number().int().min(0).max(10),
});

type ScaleInput = z.infer<typeof ScaleInputSchema>;

export const scalePlugin = definePlugin<ScaleInput, ColorReference>({
  name: 'scale',
  inputSchema: ScaleInputSchema,
  outputSchema: ColorReferenceSchema,
  dependsOn: (input) => [input.familyName],
  transform: (input, get) => {
    const family = get(input.familyName) as ColorValue | undefined;
    if (!family) {
      throw new Error(`scale plugin: family "${input.familyName}" not found in registry`);
    }
    const position = INDEX_TO_POSITION[input.scalePosition];
    if (position === undefined) {
      throw new Error(`scale plugin: invalid position index ${input.scalePosition}`);
    }
    return { family: input.familyName, position };
  },
});
