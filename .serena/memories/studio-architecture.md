# Studio Architecture (Issue #443)

## Overview
`rafters studio` - Vite-based visual token editor. Single designer, local machine, git-backed.

## Key Design Decisions

### 1. No API layer
Studio directly imports `@rafters/design-tokens` (workspace dependency).
Vite middleware is ~80 lines of HTTP glue.

### 2. Split CSS for instant HMR
`@theme` blocks require Tailwind reprocessing. Pure CSS variables don't.

**Production (apps):**
```tsx
import '.rafters/output/rafters.css';  // combined @theme + values
```

**Studio (HMR):**
```tsx
import '.rafters/output/rafters.tailwind.css';  // static @theme inline, processed once
import '.rafters/output/rafters.vars.css';       // pure CSS vars, instant HMR
```
pnpx rafters@latest studio
         │
         ▼
    Vite dev server (packages/studio)
         │
    ┌────┴────┐
    │         │
    ▼         ▼
React UI   Vite middleware (~80 lines)
    │         │
    │         ▼
    │    @rafters/design-tokens (direct workspace import)
    │    ├── TokenRegistry.setChangeCallback() → CSS regen
    │    ├── registry.set() → auto-cascade dependents
    │    ├── NodePersistenceAdapter → filesystem
    │    └── registryToTailwind() → theme.css
    │         │
    └────►────┘
              │
              ▼
    .rafters/tokens/*.rafters.json + .rafters/output/theme.css
              │
              ▼
    Vite HMR (CSS hot reload) → React repaints
```

## File Outputs (all named rafters.*)

| File | When Generated | Purpose |
|------|----------------|---------|
| `rafters.css` | `init`, Studio save | Production - apps import this |
| `rafters.tailwind.css` | Studio startup | Static Tailwind config with `var()` refs |
| `rafters.vars.css` | Studio edit | Pure CSS variables - instant HMR |
| `rafters.ts` | `init`, Studio save | TypeScript token constants |
| `rafters.json` | `init`, Studio save | DTCG format |

## Exporter Functions (design-tokens, workspace-only)
```typescript
registryToTailwind(registry)       // Production combined
registryToTailwindStatic(registry) // Studio static @theme inline
registryToVars(registry)           // Studio dynamic CSS vars
```

## Constraints
1. **Edit only** - No add/delete (dependency graph too complex for UI)
2. **Write queue** - Simple promise chain prevents race conditions
3. **registry.set()** - Already handles cascade + userOverride respect
4. **Live vars only** - rafters.css/ts/json on explicit save, not realtime
5. **Override prompts** - UI shows conflicts before cascading

## Override Conflict Flow
When editing a token with dependents that have `userOverride`:
1. PATCH returns `{ requiresConfirmation: true, affectedTokens: [...] }`
2. UI shows dialog with affected tokens and override reasons
3. User picks: [Update all] [Skip overrides] [Cancel]
4. `cascadeMode` sent with retry PATCH

## File Structure
```
packages/
├── cli/src/commands/studio.ts    # CLI (spawns Vite)
└── studio/
    ├── vite.config.ts            # Vite + middleware plugin
    ├── src/
    │   ├── main.tsx              # imports theme.css for HMR
    │   ├── app.tsx
    │   └── components/
    │       ├── sidebar.tsx       # namespace list
    │       ├── token-list.tsx    # tokens + dependency info
    │       ├── token-editor.tsx  # color picker / text input
    │       └── cascade-dialog.tsx
    └── index.html
```

## Event-Driven Pattern
```typescript
// In Vite middleware setup:
registry.setChangeCallback(async (event) => {
  if (event.type === 'token-changed' || event.type === 'tokens-batch-changed') {
    const css = registryToTailwind(registry);
    await writeFile('.rafters/output/theme.css', css);
    // Vite HMR detects change, hot-reloads CSS
  }
});
```