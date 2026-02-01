# @rafters/color-utils Architecture

## Package Purpose
OKLCH color manipulation and intelligence. Pure functions, no state. Used by design-tokens for color generation and by MCP tools for color analysis.

## Directory Structure
```
src/
├── index.ts              # All exports
├── builder.ts            # buildColorValue() - creates ColorValue objects
├── harmony.ts            # Color theory harmonies and semantic suggestions
├── accessibility.ts      # WCAG/APCA contrast calculations
├── analysis.ts           # Temperature, lightness detection
├── conversion.ts         # OKLCH ↔ hex ↔ CSS
├── manipulation.ts       # Adjustments, blending, surface/neutral generation
├── validation-alerts.ts  # Semantic mapping validation
└── naming/               # Deterministic color naming system
    ├── hue-hubs.ts       # 18 hue hubs × temperature variants
    ├── word-banks.ts     # Material, intensity, luminosity words
    ├── quantize.ts       # L/C/H bucketing
    └── generator.ts      # Name generation algorithm
```

## Core Functions

### buildColorValue(oklch, options?) → ColorValue
The main entry point. Creates a complete ColorValue with:
- `name` - Deterministic human-readable name
- `scale` - 11-position lightness scale (50-950)
- `harmonies` - complementary, triadic, analogous, tetradic, monochromatic
- `accessibility` - WCAG AA/AAA, APCA, contrast ratios
- `analysis` - temperature (warm/cool/neutral), isLight
- `atmosphericWeight` - spatial/depth perception
- `perceptualWeight` - visual density
- `semanticSuggestions` - danger[], success[], warning[], info[]

### generateRaftersHarmony(oklch) → 7 colors
Color theory harmonies mapped to semantic roles:
| Role | Source | Theory |
|------|--------|--------|
| primary | base | User's choice |
| secondary | splitComplementary1 | Sophisticated contrast |
| tertiary | triadic1 | Visual interest |
| accent | complementary | Maximum attention |
| highlight | analogous1 | Subtle emphasis |
| surface | desaturated base | Backgrounds |
| neutral | calculated gray | Text, borders |

### generateSemanticColorSuggestions(oklch) → 4×3 colors
Status colors derived from base, maintaining harmony:
| Semantic | Hue Range | Choices |
|----------|-----------|---------|
| danger | Red 0-30° | 3 variants |
| success | Green 120-150° | 3 variants |
| warning | Orange/Yellow 30-70° | 3 variants |
| info | Blue 200-240° | 3 variants |

Each suggestion adapts lightness/chroma relative to the base color.

## 11 Families Algorithm

From a single primary OKLCH:
1. `generateRaftersHarmony()` → 7 families (primary, secondary, tertiary, accent, highlight, surface, neutral)
2. `buildColorValue().semanticSuggestions` → 4 families (destructive, success, warning, info)
3. Each family → `generateOKLCHScale()` → 11 positions (50-950)

**11 families × 11 positions = 121 color tokens**

## Color Naming System

Deterministic names from OKLCH coordinates using hub/spoke architecture:

### Structure
- **18 hue hubs** (20° each, covering 360°)
- **5 lightness bands** (veryDark, dark, mid, light, veryLight)
- **4 chroma bands** (muted, moderate, saturated, vivid)
- **3 temperature variants** (warm, cool, neutral)

### Algorithm
```
OKLCH → bucketize(L,C,H) → hueHub[temperature][lightnessBand][chromaBand] → word[]
```
Sub-index selection uses fractional position within bucket for deterministic synonym choice.

### Name Format
```
{prefix}-{material}-{hue}
```
Examples: "silver-bold-fire-truck", "dark-deep-glacier", "bright-soft-honey"

## Accessibility Functions

```typescript
// WCAG 2.1 contrast ratio
calculateWCAGContrast(fg: OKLCH, bg: OKLCH): number

// APCA (Advanced Perceptual Contrast Algorithm)
calculateAPCAContrast(fg: OKLCH, bg: OKLCH): number

// Find accessible color by adjusting lightness
findAccessibleColor(color: OKLCH, background: OKLCH, targetContrast: number): OKLCH
```

## Key Types

```typescript
interface OKLCH {
  l: number;  // Lightness 0-1
  c: number;  // Chroma 0-0.4
  h: number;  // Hue 0-360
  alpha?: number;
}

interface ColorValue {
  name: string;
  scale: OKLCH[];
  harmonies: { complementary, triadic[], analogous[], tetradic[], monochromatic[] };
  accessibility: { wcagAA, wcagAAA, onWhite, onBlack, apca };
  analysis: { temperature, isLight, name };
  atmosphericWeight: { atmosphericRole, distanceWeight, temperature };
  perceptualWeight: { weight, density, balancingRecommendation };
  semanticSuggestions: { danger[], success[], warning[], info[] };
}
```

## Usage Patterns

```typescript
import {
  buildColorValue,
  generateRaftersHarmony,
  generateOKLCHScale,
  hexToOKLCH,
  oklchToCSS,
  generateColorName,
} from '@rafters/color-utils';

// From hex to full ColorValue
const oklch = hexToOKLCH('#3B82F6');
const colorValue = buildColorValue(oklch);

// Get harmonies for design system
const harmony = generateRaftersHarmony(oklch);

// Generate scale for a family
const scale = generateOKLCHScale(harmony.primary);

// Get deterministic name
const name = generateColorName(oklch);  // e.g., "silver-true-sky"

// Convert to CSS
const css = oklchToCSS(oklch);  // "oklch(0.623 0.214 255)"
```
