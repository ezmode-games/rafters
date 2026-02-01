# Studio Registry Prototype Findings

## Core Pattern: Two-Phase Color Loading

### Phase 1: Instant (Local Math)
- `generateRaftersHarmony(baseOKLCH)` returns 7 semantic positions
- `generateOKLCHScale(baseOKLCH)` creates 11-position scale
- User sees immediate feedback while API loads

### Phase 2: Background (API Intelligence)
- Fetch `api.rafters.studio/color/{l}-{c}-{h}?adhoc=true`
- Returns complete `ColorValue` with:
  - `name`: Fancy color name (e.g., "balanced-bold-dynamic-ocean")
  - `scale`: 11 OKLCH positions
  - `harmonies`: complementary, triadic, analogous, tetradic, monochromatic
  - `semanticSuggestions`: danger[3], success[3], warning[3], info[3] options
  - `accessibility`: WCAG AA/AAA pairs, onWhite/onBlack positions

## 11 Color Families

### From Harmony (7)
1. **primary** - User's chosen color
2. **secondary** - From complementary
3. **tertiary** - From analogous[0]
4. **accent** - From triadic[0]
5. **highlight** - Bright version of primary (higher L, higher C)
6. **surface** - Desaturated (very low C)
7. **neutral** - True gray (C=0)

### From Semantic Suggestions (4)
8. **danger** - Red range (h~15)
9. **success** - Green range (h~135)
10. **warning** - Yellow/amber range (h~45)
11. **info** - Usually matches primary hue

## Registry Token Structure

### Family Token
```typescript
registry.add({
  name: 'color-family-primary',
  value: colorValue, // Full ColorValue object
  category: 'color',
  namespace: 'color',
});
```

### Scale Token
```typescript
registry.add({
  name: 'primary-500',
  value: oklchToCSS(colorValue.scale[5]),
  category: 'color',
  namespace: 'color',
  dependsOn: ['color-family-primary'],
  generationRule: 'scale:500',
});
registry.addDependency('primary-500', ['color-family-primary'], 'scale:500');
```

## Auto-Regeneration

When `registry.set('color-family-primary', newColorValue)` is called:
1. Registry updates family token
2. `regenerateDependents()` finds all tokens with `dependsOn: ['color-family-primary']`
3. For each dependent, executes `generationRule` (e.g., `scale:500`)
4. Scale plugin extracts position from token name (`primary-500` -> 500)
5. Executor resolves to CSS: `oklchToCSS(newColorValue.scale[5])`
6. `changeCallback` fires for each updated token

## CSS Export

- `registryToTailwind(registry)` exports to CSS variables
- ~97KB for full 11-family system
- ~800 color variables

## Studio UI Requirements

1. **Color Picker** - Let user pick OKLCH, show instant local preview
2. **API Loader** - Fetch full intelligence in background
3. **Harmony Choices** - Present options from `harmonies` for secondary/tertiary/accent
4. **Semantic Choices** - Present 3 options each for danger/success/warning/info
5. **Why Gate** - Capture user's reason for color choice
6. **Live CSS Preview** - Subscribe to `changeCallback`, update preview

## Key APIs

```typescript
// Load base system
const { allTokens } = generateBaseSystem();
const registry = new TokenRegistry(allTokens);

// Fetch color intelligence
const color = await fetch(`${API}/color/${l}-${c}-${h}?adhoc=true`).then(r => r.json());

// Add family and scales
registry.add({ name: 'color-family-X', value: colorValue, ... });
registry.addDependency('X-500', ['color-family-X'], 'scale:500');

// Update triggers regeneration
await registry.set('color-family-X', newColorValue);

// Subscribe to changes
registry.setChangeCallback((event) => {
  const css = registryToTailwind(registry);
  updatePreview(css);
});
```
