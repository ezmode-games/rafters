# Rafters Color System Architecture

## Overview
The Rafters color system uses a three-layer architecture with normalized data structures to prevent duplication and maintain a single source of truth for all color values.

## Data Flow

```
User picks color → Color Family Generation → Semantic Assignment → CSS Layer Output
```

## Data Structures

### 1. ColorValue (Color Family)
Represents a complete color scale with all shades:

```typescript
{
  name: "ocean-blue",           // Color family name
  scale: [                       // OKLCH values for standard positions
    {l: 0.95, c: 0.02, h: 240}, // Position 0 = shade 50
    {l: 0.90, c: 0.04, h: 240}, // Position 1 = shade 100
    // ... positions 2-8 for shades 200-900
    {l: 0.20, c: 0.20, h: 240}, // Position 9 = shade 950
  ],
  token: "primary",              // Optional semantic assignment
  value: "500",                  // Which shade is the default
  use: "Main brand color",       // Human notes
  states: {                      // State mappings (only for semantic tokens)
    hover: "600",
    focus: "700",
    active: "800",
    disabled: "400"
  }
}
```

### 2. Token (Flat Storage)
Simple key-value pairs for CSS generation:

```typescript
// Color family tokens
{ name: "ocean-blue-50", value: "oklch(0.95 0.02 240)" }
{ name: "ocean-blue-500", value: "oklch(0.60 0.12 240)" }

// Semantic tokens (reference color family tokens)
{ name: "primary", value: "var(--color-ocean-blue-500)" }
{ name: "primary-hover", value: "var(--color-ocean-blue-600)" }
```

## CSS Layer Architecture

### Layer 1: Color Families (Source of Truth)
All color values are defined here as OKLCH values:

```css
/* Generated from ColorValue.scale */
--color-ocean-blue-50: oklch(0.95 0.02 240);
--color-ocean-blue-100: oklch(0.90 0.04 240);
--color-ocean-blue-200: oklch(0.85 0.06 240);
--color-ocean-blue-300: oklch(0.80 0.08 240);
--color-ocean-blue-400: oklch(0.70 0.10 240);
--color-ocean-blue-500: oklch(0.60 0.12 240);
--color-ocean-blue-600: oklch(0.50 0.14 240);
--color-ocean-blue-700: oklch(0.40 0.16 240);
--color-ocean-blue-800: oklch(0.30 0.18 240);
--color-ocean-blue-900: oklch(0.20 0.20 240);
--color-ocean-blue-950: oklch(0.10 0.20 240);
```

### Layer 2: Rafters Semantic Tokens
References Layer 1 variables, never hardcoded values:

```css
/* Semantic assignments reference color families */
--rafters-color-primary: var(--color-ocean-blue-500);
--rafters-color-primary-hover: var(--color-ocean-blue-600);
--rafters-color-primary-focus: var(--color-ocean-blue-700);
--rafters-color-primary-active: var(--color-ocean-blue-800);
--rafters-color-primary-disabled: var(--color-ocean-blue-400);

--rafters-color-secondary: var(--color-forest-green-500);
--rafters-color-accent: var(--color-sunset-orange-500);
```

### Layer 3: Theme Mapping
Final consumer-facing variables:

```css
/* Theme layer for Tailwind/components */
--color-primary: var(--rafters-color-primary);
--color-primary-hover: var(--rafters-color-primary-hover);
--color-secondary: var(--rafters-color-secondary);
```

## Studio Workflow

1. **User picks a color** (e.g., #3b82f6)
2. **Studio generates color family**:
   - Converts to OKLCH
   - Uses `generateLightnessScale()` to create 50-950 scale
   - Names it based on color characteristics (ocean-blue)
3. **User assigns semantic meaning**:
   - Right-click any shade → "Set as Primary"
   - Studio records: `ocean-blue` + position `500` = `primary`
4. **Studio generates states**:
   - For semantic tokens only
   - Uses mathematical relationships (hover = +1 shade, focus = +2 shades)
5. **Export generates three CSS layers**:
   - All color families as base layer
   - Semantic assignments as middle layer
   - Theme mappings as top layer

## Key Principles

1. **Single Source of Truth**: Each color value is defined exactly once in Layer 1
2. **No Duplication**: Color families are unique, semantic tokens reference them
3. **States for Semantics Only**: Raw color families don't have states, only semantic tokens do
4. **Variable References**: Layer 2 references Layer 1, Layer 3 references Layer 2
5. **Human Override**: Users can reassign any color/shade to any semantic token

## Human Override Patterns

### Creative Freedom with State Overrides
Users can assign ANY color to ANY state, even across color families:

```typescript
{
  name: "ocean-blue",
  scale: [...], // ocean-blue-50 through ocean-blue-950
  token: "primary",
  value: "500", // primary = ocean-blue-500
  states: {
    hover: "amber-600",      // Different color family!
    focus: "purple-700",     // Another different family!
    active: "ocean-blue-800", // Same family, different shade
    disabled: "gray-400"     // Neutral color for disabled
  }
}
```

### CSS Output with Overrides
```css
/* Layer 1: ALL referenced color families must exist */
--color-ocean-blue-500: oklch(0.60 0.12 240);
--color-ocean-blue-800: oklch(0.30 0.18 240);
--color-amber-600: oklch(0.65 0.15 85);
--color-purple-700: oklch(0.45 0.18 300);
--color-gray-400: oklch(0.70 0.02 0);

/* Layer 2: Semantic tokens reference various families */
--rafters-color-primary: var(--color-ocean-blue-500);
--rafters-color-primary-hover: var(--color-amber-600);
--rafters-color-primary-focus: var(--color-purple-700);
--rafters-color-primary-active: var(--color-ocean-blue-800);
--rafters-color-primary-disabled: var(--color-gray-400);
```

## Studio Validation Requirements

### Real-time Accessibility Checks
When humans override states, Studio must validate:

1. **Text/Background Contrast**
   ```typescript
   checkContrast({
     "white on primary": ["white", "ocean-blue-500"],
     "white on primary-hover": ["white", "amber-600"],
     "primary on white": ["ocean-blue-500", "white"],
     "primary-hover on white": ["amber-600", "white"]
   })
   ```

2. **Adjacent Color Contrast**
   ```typescript
   // States might appear next to each other
   checkContrast({
     "primary vs primary-hover": ["ocean-blue-500", "amber-600"],
     "primary vs primary-focus": ["ocean-blue-500", "purple-700"]
   })
   ```

3. **State Visibility**
   ```typescript
   // Can users perceive the state change?
   checkStateTransition({
     from: "ocean-blue-500",
     to: "amber-600",
     minContrast: 3.0 // WCAG focus indicator requirement
   })
   ```

4. **Dark Mode Validation**
   ```typescript
   checkDarkModeContrast({
     "primary on dark-bg": ["ocean-blue-500", "gray-900"],
     "primary-hover on dark-bg": ["amber-600", "gray-900"]
   })
   ```

### Studio API Calls for Validation
```typescript
// When user assigns amber-600 as primary-hover
const validation = await validateStateOverride({
  semantic: "primary",
  baseValue: "ocean-blue-500",
  stateValue: "amber-600",
  stateType: "hover"
});

// Returns:
{
  valid: true,
  warnings: [
    {
      type: "contrast",
      message: "amber-600 and ocean-blue-500 have low contrast (1.2:1)",
      severity: "warning",
      suggestion: "Consider amber-700 for better distinction"
    }
  ],
  accessibility: {
    wcagAA: { text: true, largeText: true, adjacent: false },
    wcagAAA: { text: false, largeText: true, adjacent: false }
  }
}
```

### Validation Feedback UI
Studio provides immediate feedback:
- ✅ **Pass**: "ocean-blue-500 on white: 8.5:1 (AAA)"
- ⚠️ **Warning**: "Adjacent contrast 1.2:1 - May be hard to distinguish"
- ❌ **Fail**: "white on amber-600: 2.1:1 - Fails WCAG AA"
- 💡 **Suggestion**: "Try amber-700 for better contrast"

### Important Implications
1. **States are string references** to any color-family-position combination
2. **All color families must be generated** before semantic assignments
3. **Studio validates references exist** before allowing assignment
4. **Accessibility can break** with creative overrides
5. **Real-time feedback guides** users toward accessible choices
6. **Final export is pre-validated** - no accessibility surprises in production

## Token Decomposition

The TokenRegistry handles conversion between ColorValue objects and flat tokens:

```typescript
// ColorValue → Flat Tokens
decompose(colorValue) → [
  { name: "ocean-blue-50", value: "oklch(...)" },
  { name: "ocean-blue-100", value: "oklch(...)" },
  // ... all shades
  { name: "primary", value: "var(--color-ocean-blue-500)" },
  { name: "primary-hover", value: "var(--color-ocean-blue-600)" }
]

// Flat Tokens → ColorValue
recompose(tokens) → ColorValue object for Studio manipulation
```

## Accessibility Metadata Storage

### What We Have (in color-utils)
- `calculateWCAGContrast(fg, bg)` - Returns contrast ratio
- `calculateAPCAContrast(fg, bg)` - Returns APCA value  
- `meetsWCAGStandard(fg, bg, level, size)` - Boolean check
- `findAccessibleColor(target, bg, standard)` - Auto-adjust for compliance

### What We're Missing
- Color vision simulation (deuteranopia, protanopia, tritanopia)
- Bulk contrast matrix generation
- Accessible pair finding across scales

### Storage Strategy: Calculate On-Demand with Caching

Since color-utils has the calculation functions but not bulk operations, we'll:

1. **Calculate on first Studio load** when ColorValue is created
2. **Cache results** in ColorValue for performance
3. **Store minimal data** - only what changes behavior

```typescript
// Extended ColorValue with accessibility metadata
{
  name: "ocean-blue",
  scale: [...],
  token: "primary",
  value: "500",
  use: "Main brand color",
  states: { hover: "600", focus: "700" },
  
  // Accessibility metadata (calculated on-demand, cached)
  accessibility: {
    // Contrast pairs that meet standards (array of [from, to] indices)
    wcagAA: {
      normal: [[0, 5], [0, 6], [1, 7], ...], // 50 passes with 500, 600, etc.
      large: [[0, 4], [0, 5], [1, 5], ...]   // More pairs pass for large text
    },
    wcagAAA: {
      normal: [[0, 7], [0, 8], [0, 9], ...], // Fewer pairs meet AAA
      large: [[0, 6], [0, 7], [1, 7], ...]
    },
    
    // Pre-calculated for common backgrounds
    onWhite: {
      aa: [5, 6, 7, 8, 9],    // Shades that pass AA on white
      aaa: [7, 8, 9]          // Shades that pass AAA on white
    },
    onBlack: {
      aa: [0, 1, 2, 3, 4],    // Shades that pass AA on black
      aaa: [0, 1, 2]          // Shades that pass AAA on black
    },
    
    // TODO: Color vision simulation when implemented
    colorVision: {
      deuteranopia: { /* contrast adjustments */ },
      protanopia: { /* contrast adjustments */ },
      tritanopia: { /* contrast adjustments */ }
    }
  }
}
```

### Helper Functions Needed

```typescript
// Generate contrast matrix for a color scale
function generateAccessibilityMetadata(scale: OKLCH[]): AccessibilityMetadata {
  const wcagAA = { normal: [], large: [] };
  const wcagAAA = { normal: [], large: [] };
  
  // Check all pairs
  for (let i = 0; i < scale.length; i++) {
    for (let j = i + 1; j < scale.length; j++) {
      if (meetsWCAGStandard(scale[i], scale[j], 'AA', 'normal')) {
        wcagAA.normal.push([i, j]);
      }
      if (meetsWCAGStandard(scale[i], scale[j], 'AA', 'large')) {
        wcagAA.large.push([i, j]);
      }
      if (meetsWCAGStandard(scale[i], scale[j], 'AAA', 'normal')) {
        wcagAAA.normal.push([i, j]);
      }
      if (meetsWCAGStandard(scale[i], scale[j], 'AAA', 'large')) {
        wcagAAA.large.push([i, j]);
      }
    }
  }
  
  // Check against white/black
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  
  const onWhite = {
    aa: scale.map((c, i) => meetsWCAGStandard(c, white, 'AA', 'normal') ? i : null).filter(i => i !== null),
    aaa: scale.map((c, i) => meetsWCAGStandard(c, white, 'AAA', 'normal') ? i : null).filter(i => i !== null)
  };
  
  const onBlack = {
    aa: scale.map((c, i) => meetsWCAGStandard(c, black, 'AA', 'normal') ? i : null).filter(i => i !== null),
    aaa: scale.map((c, i) => meetsWCAGStandard(c, black, 'AAA', 'normal') ? i : null).filter(i => i !== null)
  };
  
  return { wcagAA, wcagAAA, onWhite, onBlack };
}
```

This approach:
- Minimizes storage (only indices, not full contrast values)
- Calculates once per color family
- Provides quick lookup for Studio UI
- Can be extended when color vision simulation is implemented