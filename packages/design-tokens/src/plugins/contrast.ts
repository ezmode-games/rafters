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

function partnerForBase(
  pairs: readonly (readonly number[])[] | undefined,
  basePosition: number,
): number | undefined {
  if (!pairs) return undefined;
  for (const [p1, p2] of pairs) {
    if (p1 === basePosition) return p2;
    if (p2 === basePosition) return p1;
  }
  return undefined;
}

function requireScalePosition(index: number, label: string): string {
  const position = SCALE_POSITIONS[index];
  if (!position) {
    throw new Error(`contrast plugin: invalid scale index ${index} (${label})`);
  }
  return position;
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
      const partner =
        partnerForBase(family.accessibility.wcagAAA?.normal, input.basePosition) ??
        partnerForBase(family.accessibility.wcagAA?.normal, input.basePosition);
      if (partner !== undefined) {
        return {
          family: input.familyName,
          position: requireScalePosition(partner, `${input.familyName} pair`),
        };
      }
    }

    if (input.neutralFamilyName) {
      const neutral = get(input.neutralFamilyName) as ColorValue | undefined;
      const aaaBest = neutral?.accessibility?.onWhite?.aaa?.[0];
      if (aaaBest !== undefined) {
        return {
          family: input.neutralFamilyName,
          position: requireScalePosition(aaaBest, `${input.neutralFamilyName} onWhite.aaa`),
        };
      }
      const aaBest = neutral?.accessibility?.onWhite?.aa?.[0];
      if (aaBest !== undefined) {
        return {
          family: input.neutralFamilyName,
          position: requireScalePosition(aaBest, `${input.neutralFamilyName} onWhite.aa`),
        };
      }
      throw new Error(
        `contrast plugin: neutral family "${input.neutralFamilyName}" has no accessibility.onWhite data; cannot derive contrast partner`,
      );
    }

    throw new Error(
      `contrast plugin: family "${input.familyName}" has no foregroundReferences and no accessibility WCAG pairs; supply one or pass neutralFamilyName`,
    );
  },
});
