import { SCALE_POSITIONS } from '@rafters/color-utils';
import { type ColorReference, ColorReferenceSchema, type ColorValue } from '@rafters/shared';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';

const StateTypeSchema = z.enum(['hover', 'active', 'focus', 'disabled']);

const StateInputSchema = z.object({
  familyName: z.string(),
  basePosition: z.number().int().min(0).max(10),
  stateType: StateTypeSchema,
});

type StateInput = z.infer<typeof StateInputSchema>;

type ColorValueWithStateRefs = ColorValue & {
  stateReferences?: Record<string, { family: string; position: string }>;
};

const STATE_OFFSETS: Record<z.infer<typeof StateTypeSchema>, number> = {
  hover: 1,
  active: 2,
  focus: 1,
  disabled: -2,
};

export const statePlugin = definePlugin<StateInput, ColorReference>({
  name: 'state',
  inputSchema: StateInputSchema,
  outputSchema: ColorReferenceSchema,
  dependsOn: (input) => [input.familyName],
  transform: (input, get) => {
    const family = get(input.familyName) as ColorValueWithStateRefs | undefined;
    if (!family) {
      throw new Error(`state plugin: family "${input.familyName}" not found in registry`);
    }

    const precomputed = family.stateReferences?.[input.stateType];
    if (precomputed) {
      return { family: precomputed.family, position: String(precomputed.position) };
    }

    const offset = STATE_OFFSETS[input.stateType];
    const adjustedIndex = Math.max(0, Math.min(10, input.basePosition + offset));
    const position = SCALE_POSITIONS[adjustedIndex];
    if (!position) {
      throw new Error(
        `state plugin: invalid scale index ${adjustedIndex} for base ${input.basePosition} + ${input.stateType}`,
      );
    }
    return { family: input.familyName, position };
  },
});
