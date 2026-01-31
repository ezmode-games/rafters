# 11 Rafters Color Families

From a single primary OKLCH, generate all 11 color families.

## Sources

```typescript
import { generateRaftersHarmony, buildColorValue } from '@rafters/color-utils';

const harmony = generateRaftersHarmony(primaryOklch);
const colorValue = buildColorValue(primaryOklch);
```

## The 11 Families

### From generateRaftersHarmony() (7)
| Family | Source | Choices |
|--------|--------|---------|
| primary | user's choice | 1 |
| secondary | splitComplementary1/2 | 2 |
| tertiary | triadic1/2 | 2 |
| accent | complementary | 1 |
| highlight | analogous1/2 | 2 |
| surface | desaturated base | 1 |
| neutral | calculated optimal gray | 1 |

### From colorValue.semanticSuggestions (4)
| Family | Source | Choices |
|--------|--------|---------|
| destructive | danger[0,1,2] | 3 |
| success | success[0,1,2] | 3 |
| warning | warning[0,1,2] | 3 |
| info | info[0,1,2] | 3 |

## Combined Map

```typescript
const allFamilies = {
  // From harmony
  primary: harmony.primary,
  secondary: harmony.secondary,      // or splitComplementary2
  tertiary: harmony.tertiary,        // or triadic2
  accent: harmony.accent,
  highlight: harmony.highlight,      // or analogous2
  surface: harmony.surface,
  neutral: harmony.neutral,
  
  // From semanticSuggestions
  destructive: colorValue.semanticSuggestions.danger[0],   // or [1], [2]
  success: colorValue.semanticSuggestions.success[0],
  warning: colorValue.semanticSuggestions.warning[0],
  info: colorValue.semanticSuggestions.info[0],
};
```

## Each Family Becomes a Scale

Each OKLCH base → `generateOKLCHScale()` → 11-position scale (50-950)

**11 families × 11 positions = 121 color tokens**
