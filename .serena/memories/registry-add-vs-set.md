# TokenRegistry: add() vs set()

## The Rule

- **`add(token)`** - Initialization only (loading from disk)
- **`set(name, value)`** - All runtime operations (user edits)

## Why This Matters

Studio loads the default design system at startup. The registry is NEVER empty when the user interacts with it. Even "first run" (picking a primary color) is an UPDATE to existing tokens, not creating new ones.

### add() Behavior
```typescript
add(token: Token): void {
  this.tokens.set(token.name, token);  // silent overwrite, no cascade
}
```
- Stores token directly in Map
- No events fired
- No cascade through dependency graph
- Fast for bulk operations

### set() Behavior
```typescript
async set(tokenName: string, value: string): Promise<void> {
  this.updateToken(tokenName, value);        // update + fire changeCallback
  await this.regenerateDependents(tokenName); // cascade through graph
}
```
- Fires `changeCallback` (triggers CSS HMR)
- Regenerates all dependent tokens
- Respects `userOverride` on dependents
- Required for live editing

## When to Use Each

| Scenario | Method | Why |
|----------|--------|-----|
| `initRegistry()` loading from disk | `add()` | Bulk population, no cascade needed |
| POST /api/tokens (user action) | `set()` | Must cascade to dependents |
| PATCH /api/token/:ns/:name | `set()` | Must cascade to dependents |
| Loading default system | `add()` | Initial population |
| User picks primary color | `set()` | Updates existing, needs cascade |
| User adjusts semantic | `set()` | May have dependents |

## The Bug That Was Fixed

The POST handler was using `add()` for user-initiated token updates. This silently overwrote tokens without cascading changes through the dependency graph. Semantic tokens that depended on primary wouldn't regenerate.

Fixed in `packages/studio/src/api/vite-plugin.ts`:
```typescript
// Wrong - no cascade
for (const token of tokens) {
  reg.add(token);
}

// Correct - cascades dependents
for (const token of tokens) {
  await reg.set(token.name, value);
}
```

## Key Insight

The default design system means the registry is always populated. "First run" UI is about capturing designer intent, not bootstrapping an empty system. Every token operation after initialization is an update, not a creation.
