# Color Selection Flow

## Two-Phase Pattern

### Phase 1: Instant Math (local)
```typescript
const colorValue = buildColorValue(oklch);  // @rafters/color-utils
const harmony = generateRaftersHarmony(oklch);
```

Returns immediately:
- 11-position scale
- Harmonies with choices
- Semantic suggestions (danger/success/warning/info)
- Accessibility data (WCAG, APCA)
- Perceptual/atmospheric weights

### Phase 2: Async Intelligence (API)
```typescript
// Fire and forget - don't block UI
fetch(`https://api.rafters.studio/color/${l}-${c}-${h}?sync=true`)
  .then(res => res.json())
  .then(data => {
    // Update token with intelligence when it arrives
    token.value.intelligence = data.color.intelligence;
  });
```

Adds (when available):
- AI reasoning
- Emotional impact
- Cultural context
- Usage guidance

## WhyGate Rules

**NO explanation needed:**
- Picking from computed options (tertiary[0] vs tertiary[1])
- Math justifies the choice

**Explanation required:**
- Primary color (the seed - user's arbitrary choice)
- Custom override (deviating from ALL computed options)

```typescript
// No userOverride - picked from options
{ name: 'tertiary', value: harmony.triadic2 }

// userOverride required - custom value
{ 
  name: 'tertiary', 
  value: customOklch,
  userOverride: { 
    reason: "Client brand guidelines",
    overriddenAt: "2025-01-30T..."
  }
}
```

## Intelligence Fetch on Every Selection

When user picks ANY option (even from computed choices), fetch intelligence:

```typescript
// User picks tertiary[0]
const selected = harmony.triadic1;

// Fetch intelligence async (no WhyGate needed)
fetchColorIntelligence(selected).then(enriched => {
  token.value.intelligence = enriched.intelligence;
});
```

Every color token gets enriched with AI context.
