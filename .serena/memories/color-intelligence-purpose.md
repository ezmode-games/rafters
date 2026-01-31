# Color Intelligence: Two Audiences

The same color data serves two different purposes.

## For Humans: Education

The prose helps designers understand:
- "This color evokes creativity and luxury"
- "Warm tones create urgency"
- "Cultural associations in Western markets"

Helps them make informed decisions and learn color theory.

## For AI Agents: Decision Data

AI doesn't care about poetry. It reads structured properties:

```typescript
{
  role: 'secondary',
  temperature: 'warm',              // from atmosphericWeight
  atmosphericRole: 'background',    // advancing/receding
  perceptualWeight: 'light',        // visual density
  relationship: 'split-complementary',
  
  // Actionable accessibility
  onWhite: { wcagAA: false },
  onBlack: { wcagAA: true },
  minFontSize: 24
}
```

## What AI Uses

| Property | Use |
|----------|-----|
| `role` | Which family this belongs to |
| `temperature` | Warm/cool for visual balance |
| `atmosphericRole` | Background vs foreground decisions |
| `perceptualWeight` | Balance heavy/light elements |
| `accessibility.onWhite/onBlack` | Contrast pairing decisions |
| `harmonicRelationship` | Understand why colors work together |

## The Core Philosophy

**AI doesn't have taste.** It doesn't guess at colors.

It reads:
1. Designer's recorded decisions (which option they picked)
2. Structured properties (temperature, weight, role)
3. Mathematical relationships (complementary, triadic, etc.)

The intelligence prose educates designers.
The structured data informs agents.
