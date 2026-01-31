# Studio Architecture - CRITICAL

## What Studio IS
Studio is a **THIN UI** on top of the TokenRegistry. Nothing more.

## What Studio is NOT
Studio does NOT generate tokens, build color values, or do any design system logic on the server.

## The Pattern
1. **All intelligence lives in packages**: `@rafters/design-tokens`, `@rafters/color-utils`, `@rafters/math-utils`, `@rafters/shared`
2. **Client-side builds tokens**: The React app imports from these packages and builds Token objects
3. **Server just persists**: The API endpoint validates against `TokenSchema` and saves to registry

## API Endpoints
- `GET /api/tokens` - Read tokens from registry
- `POST /api/tokens` - Accept Token objects (validated against TokenSchema), save to registry
- `PATCH /api/token/:ns/:name` - Update a single token value
- `GET /api/registry/log` - Activity log

## Flow for Primary Color Selection
1. User picks color in Snowstorm component
2. **CLIENT** calls `buildColorValue()` from `@rafters/color-utils`
3. **CLIENT** calls `generateColorTokens()` from `@rafters/design-tokens`
4. **CLIENT** POSTs the Token[] to `/api/tokens`
5. **SERVER** validates against TokenSchema, adds to registry, persists

## DO NOT
- Add `buildColorValue`, `generateOKLCHScale`, `generateColorTokens` to the server
- Create custom request schemas for specific flows
- Put any design system logic in vite-plugin.ts
- Use `registry.add()` for runtime operations - only use during `initRegistry()`

## add() vs set()
- `add(token)` - Initialization only (loading from disk into empty registry)
- `set(name, value)` - All runtime operations (fires changeCallback, cascades dependents)

The default design system is always loaded at startup. Even "first run" is an UPDATE to existing tokens, not creating new ones. See `registry-add-vs-set` memory for details.

## The server is DUMB
It only knows how to:
- Validate tokens against TokenSchema
- Add tokens to TokenRegistry (via `set()` for updates)
- Persist via NodePersistenceAdapter
- Return tokens grouped by namespace
- Proxy to Rafters API for color intelligence (`GET /api/tokens/color`)

## Two-Phase Color Selection Pattern

**Phase 1 - Instant (local math):**
```typescript
const colorValue = buildColorValue(oklch);  // @rafters/color-utils
const tokens = generateColorTokens(config, [{ name: 'primary', scale }]);
await fetch('/api/tokens', { method: 'POST', body: tokens });
```

**Phase 2 - Async (API intelligence):**
```typescript
// Fire and forget - don't block UI
fetchColorIntelligence(oklch).then(enriched => {
  if (enriched.intelligence) {
    // Update registry with AI reasoning, emotional impact, etc.
    await fetch('/api/tokens', { method: 'POST', body: [enrichedToken] });
  }
});
```

This gives instant feedback (math is local) while the AI intelligence arrives in the background.

## Semantic Color Flow
1. User picks primary → `buildColorValue()` returns `semanticSuggestions`
2. `semanticSuggestions.danger[0]` → destructive scale
3. `semanticSuggestions.success[0]` → success scale
4. Semantic tokens reference these families via `DEFAULT_SEMANTIC_COLOR_MAPPINGS`
