import { type ColorReference, ColorReferenceSchema, type ColorValue } from '@rafters/shared';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';
import { findDarkCounterpartIndex, INDEX_TO_POSITION } from '../scale-positions.js';

const InvertInputSchema = z.object({
  familyName: z.string(),
  basePosition: z.number().int().min(0).max(10),
});

type InvertInput = z.infer<typeof InvertInputSchema>;

export const invertPlugin = definePlugin<InvertInput, ColorReference>({
  name: 'invert',
  inputSchema: InvertInputSchema,
  outputSchema: ColorReferenceSchema,
  dependsOn: (input) => [input.familyName],
  transform: (input, get) => {
    const family = get(input.familyName) as ColorValue | undefined;
    if (!family) {
      throw new Error(`invert plugin: family "${input.familyName}" not found in registry`);
    }
    const darkIndex = findDarkCounterpartIndex(input.basePosition, family);
    const darkPosition = INDEX_TO_POSITION[darkIndex];
    if (!darkPosition) {
      throw new Error(
        `invert plugin: invalid dark index ${darkIndex} for base position ${input.basePosition}`,
      );
    }
    return { family: input.familyName, position: darkPosition };
  },
});
