import { SCALE_POSITIONS } from '@rafters/color-utils';
import { type ColorReference, ColorReferenceSchema, type ColorValue } from '@rafters/shared';
import { z } from 'zod';
import { definePlugin } from '../plugin.js';

const ContrastInputSchema = z.object({
  familyName: z.string(),
  basePosition: z.number().int().min(0).max(10),
  neutralFamilyName: z.string().optional(),
});

type ContrastInput = z.infer<typeof ContrastInputSchema>;

type ColorValueWithForegroundRefs = ColorValue & {
  foregroundReferences?: { auto?: { family: string; position: string } };
};

function findPartnerInPairs(
  pairs: readonly (readonly number[])[],
  basePosition: number,
): number | undefined {
  for (const [p1, p2] of pairs) {
    if (p1 === basePosition) return p2;
    if (p2 === basePosition) return p1;
  }
  return undefined;
}

export const contrastPlugin = definePlugin<ContrastInput, ColorReference>({
  name: 'contrast',
  inputSchema: ContrastInputSchema,
  outputSchema: ColorReferenceSchema,
  dependsOn: (input) =>
    input.neutralFamilyName ? [input.familyName, input.neutralFamilyName] : [input.familyName],
  transform: (input, get) => {
    const family = get(input.familyName) as ColorValueWithForegroundRefs | undefined;
    if (!family) {
      throw new Error(`contrast plugin: family "${input.familyName}" not found in registry`);
    }

    if (family.foregroundReferences?.auto) {
      const ref = family.foregroundReferences.auto;
      return { family: ref.family, position: ref.position };
    }

    if (family.accessibility) {
      const wcagAAA = family.accessibility.wcagAAA?.normal ?? [];
      const wcagAA = family.accessibility.wcagAA?.normal ?? [];
      const contrastPosition =
        findPartnerInPairs(wcagAAA, input.basePosition) ??
        findPartnerInPairs(wcagAA, input.basePosition);
      if (contrastPosition !== undefined) {
        return {
          family: input.familyName,
          position: SCALE_POSITIONS[contrastPosition] ?? '500',
        };
      }
    }

    if (input.neutralFamilyName) {
      const neutral = get(input.neutralFamilyName) as ColorValue | undefined;
      if (neutral?.accessibility?.onWhite?.aaa && neutral.accessibility.onWhite.aaa.length > 0) {
        const best = neutral.accessibility.onWhite.aaa[0];
        if (best !== undefined) {
          return {
            family: input.neutralFamilyName,
            position: SCALE_POSITIONS[best] ?? '500',
          };
        }
      }
      if (neutral?.accessibility?.onWhite?.aa && neutral.accessibility.onWhite.aa.length > 0) {
        const best = neutral.accessibility.onWhite.aa[0];
        if (best !== undefined) {
          return {
            family: input.neutralFamilyName,
            position: SCALE_POSITIONS[best] ?? '500',
          };
        }
      }
      return {
        family: input.neutralFamilyName,
        position: input.basePosition <= 5 ? '900' : '100',
      };
    }

    return {
      family: input.familyName,
      position: input.basePosition <= 5 ? '900' : '100',
    };
  },
});
