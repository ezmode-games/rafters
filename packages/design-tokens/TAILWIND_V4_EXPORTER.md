# Tailwind v4 Exporter Architecture

## Color System Architecture (From Generator Tests)

The color system follows a sophisticated two-tier architecture that separates color intelligence from semantic usage:

### Family Tokens (namespace: `color`, category: `color-family`)

**Purpose**: Store complete color intelligence and generate CSS color scales

**Structure**:
- **Count**: 9 tokens per design system
- **Names**: AI-generated family names (e.g., `'ocean-blue'`, `'forest-green'`, `'primary-family'`)
- **Value**: Complete `ColorValue` objects with rich intelligence
- **CSS Output**: Should generate `--color-{family}-{position}` scales

**ColorValue Schema** (incredibly rich):
```typescript
{
  name: string,                    // AI-generated fancy name
  scale: OKLCH[],                 // 11-color scale [50,100,200...950]
  value: string,                  // Position in scale (e.g., "600")
  intelligence: {                 // AI-generated insights
    suggestedName: string,
    reasoning: string,
    emotionalImpact: string,
    culturalContext: string,
    accessibilityNotes: string,
    usageGuidance: string
  },
  harmonies: {                    // Mathematical color relationships
    complementary: OKLCH,
    triadic: OKLCH[],
    analogous: OKLCH[],
    tetradic: OKLCH[],
    monochromatic: OKLCH[]
  },
  accessibility: {                // Pre-computed WCAG matrices
    wcagAA: { normal: number[][], large: number[][] },
    wcagAAA: { normal: number[][], large: number[][] },
    onWhite: { wcagAA: boolean, contrastRatio: number, aa: number[] },
    onBlack: { wcagAA: boolean, contrastRatio: number, aa: number[] }
  },
  analysis: {                     // Color science
    temperature: 'warm'|'cool'|'neutral',
    isLight: boolean,
    name: string
  },
  atmosphericWeight: {            // Spatial depth modeling
    distanceWeight: number,       // 0=background, 1=foreground
    atmosphericRole: 'background'|'midground'|'foreground'
  },
  perceptualWeight: {             // Visual balance
    weight: number,               // 0-1 visual weight
    density: 'light'|'medium'|'heavy',
    balancingRecommendation: string
  },
  semanticSuggestions: {          // Contextual recommendations
    danger: OKLCH[],
    success: OKLCH[],
    warning: OKLCH[],
    info: OKLCH[]
  }
}
```

**Token Properties**:
- `generateUtilityClass: false` - Families don't generate utilities directly
- `trustLevel: 'medium'` - Base color intelligence
- `cognitiveLoad: 3-5` - Moderate complexity

### Semantic Tokens (namespace: `rafters`, category: `color`)

**Purpose**: Provide semantic color assignments that reference family positions

**Structure**:
- **Count**: 50+ tokens per design system
- **Names**: Semantic names (e.g., `'primary'`, `'primary-hover'`, `'background'`, `'foreground'`)
- **Value**: `ColorReference` objects pointing to family positions
- **CSS Output**: Should generate `--rafters-{name}` variables

**ColorReference Schema**:
```typescript
{
  family: string,    // References a family token (e.g., 'ocean-blue')
  position: string   // Position in scale (e.g., '600', '50', '950')
}
```

**Token Categories**:
1. **Base Semantic**: `primary`, `secondary`, `accent`, `destructive`, `success`, `warning`, `info`, `neutral`
2. **State Variants**: `primary-hover`, `primary-active`, `primary-focus`, `primary-disabled`
3. **Foreground**: `primary-foreground`, `secondary-foreground` (contrast-calculated)
4. **Surface/UI**: `background`, `foreground`, `border`, `input`, `ring`, `muted`, `muted-foreground`

**Token Properties**:
- `generateUtilityClass: true` - Should create Tailwind utilities
- `trustLevel: 'critical'` for primary, `'high'` for states
- `cognitiveLoad: 1-3` - Low complexity for semantic usage

## Expected CSS Output Structure

### @theme Block (Tailwind v4 Format)

```css
@theme {
  /* Color family scales - from family tokens (namespace: color) */
  --color-ocean-blue-50: oklch(0.98 0.05 240);
  --color-ocean-blue-100: oklch(0.95 0.08 240);
  --color-ocean-blue-200: oklch(0.90 0.12 240);
  --color-ocean-blue-300: oklch(0.82 0.15 240);
  --color-ocean-blue-400: oklch(0.72 0.18 240);
  --color-ocean-blue-500: oklch(0.61 0.20 240);
  --color-ocean-blue-600: oklch(0.50 0.22 240);
  --color-ocean-blue-700: oklch(0.40 0.20 240);
  --color-ocean-blue-800: oklch(0.30 0.18 240);
  --color-ocean-blue-900: oklch(0.20 0.15 240);
  --color-ocean-blue-950: oklch(0.12 0.10 240);

  /* Semantic assignments - from semantic tokens (namespace: rafters) */
  --rafters-primary: var(--color-ocean-blue-600);
  --rafters-primary-hover: var(--color-ocean-blue-700);
  --rafters-primary-active: var(--color-ocean-blue-800);
  --rafters-primary-foreground: var(--color-neutral-50);
  --rafters-background: var(--color-neutral-50);
  --rafters-foreground: var(--color-neutral-900);
}
```

### @theme inline Block (Tailwind Class Mappings)

```css
@theme inline {
  /* Map Tailwind classes to rafters semantics */
  --color-primary: var(--rafters-primary);
  --color-primary-foreground: var(--rafters-primary-foreground);
  --color-background: var(--rafters-background);
  --color-foreground: var(--rafters-foreground);
}
```

### :root Block (shadcn/ui Compatibility)

```css
:root {
  --primary: var(--rafters-primary);
  --primary-foreground: var(--rafters-primary-foreground);
  --background: var(--rafters-background);
  --foreground: var(--rafters-foreground);
}
```

## Exporter Implementation Requirements

### 1. Namespace-Based Processing

```typescript
// Process family tokens (namespace: 'color')
const familyTokens = allTokens.filter(t =>
  t.namespace === 'color' && t.category === 'color-family'
);

// Process semantic tokens (namespace: 'rafters')
const semanticTokens = allTokens.filter(t =>
  t.namespace === 'rafters' && t.category === 'color'
);
```

### 2. Family Token → CSS Scale Generation

```typescript
for (const familyToken of familyTokens) {
  const colorValue = familyToken.value as ColorValue;
  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  colorValue.scale.forEach((oklch, index) => {
    const position = positions[index];
    const css = `--color-${familyToken.name}-${position}: oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
  });
}
```

### 3. Semantic Token → CSS Variable Generation

```typescript
for (const semanticToken of semanticTokens) {
  if (semanticToken.value && 'family' in semanticToken.value) {
    const colorRef = semanticToken.value as ColorReference;
    const css = `--rafters-${semanticToken.name}: var(--color-${colorRef.family}-${colorRef.position})`;
  }
}
```

## Key Principles

1. **Trust the Generator**: Never modify or regenerate the ColorValue data - it contains expensive AI intelligence
2. **Respect Namespaces**: `color` → CSS scales, `rafters` → semantic variables
3. **Preserve Intelligence**: The ColorValue objects contain more data than will ever be needed
4. **Follow Standards**: Generate proper Tailwind v4 CSS structure
5. **Maintain Compatibility**: Support both Tailwind utilities and shadcn/ui variables

## Error Patterns to Avoid

1. **Don't regenerate colors** - Use the generator's ColorValue scales exactly
2. **Don't ignore namespaces** - They determine CSS variable prefixes
3. **Don't simplify the schema** - The richness is intentional and valuable
4. **Don't break ColorReference chains** - Semantic tokens must reference family positions correctly