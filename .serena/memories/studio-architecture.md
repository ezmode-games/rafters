# Studio Architecture

**STATUS: RE-ARCHITECTURE REQUIRED**

Previous implementation (2025-01) was removed due to systematic duplication of existing packages.
Must rebuild using correct package integration.

## Non-Negotiable Package Dependencies

Studio MUST use these packages - NO reimplementation allowed:

### @rafters/color-utils
```typescript
import { hexToOKLCH, oklchToHex, generateOKLCHScale, generateSemanticColorSuggestions, buildColorValue } from '@rafters/color-utils';
```

### @rafters/math-utils
```typescript
import { generateProgression, generateModularScale } from '@rafters/math-utils';
```

### @rafters/design-tokens
```typescript
import { TokenRegistry, NodePersistenceAdapter, registryToVars, registryToTailwindStatic } from '@rafters/design-tokens';

// SINGLETON pattern - ONE registry at startup
const registry = new TokenRegistry(allTokens);

// Event-driven CSS regeneration
registry.setChangeCallback(async (event) => {
  const css = registryToVars(registry);
  await writeFile('.rafters/output/rafters.vars.css', css);
});

// Update via registry (auto-cascades, respects overrides)
await registry.set('primary', 'oklch(0.5 0.2 250)');
```

### @rafters/shared (Zod-first types)
```typescript
import { TokenSchema, NamespaceFileSchema, ColorValueSchema, OKLCHSchema } from '@rafters/shared';
import type { Token, NamespaceFile, ColorValue, OKLCH } from '@rafters/shared';
// Types come from z.infer<typeof Schema> - NEVER define manually
```

### apps/api (AI Color Intelligence)
```typescript
// Vectorize endpoint for color intelligence
const response = await fetch(`https://api.rafters.studio/color/${l}-${c}-${h}?sync=true`);
const intelligence = await response.json();
```

## Architecture

Single-designer local tool. Vite middleware (~50 lines) + React UI.

```
Browser (React)
     │
     ▼
Vite Middleware (~50 lines)
     │
     ├── TokenRegistry (singleton)
     ├── NodePersistenceAdapter  
     └── setChangeCallback → write rafters.vars.css
     │
     ▼
Vite HMR (CSS hot reload)
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
    │    @rafters/design-tokens (workspace import)
    │    ├── TokenRegistry singleton + setChangeCallback()
    │    ├── registry.set() → auto-cascade dependents
    │    ├── NodePersistenceAdapter → filesystem
    │    └── registryToVars() → rafters.vars.css
    │         │
    └────►────┘
              │
              ▼
    .rafters/tokens/*.rafters.json + .rafters/output/rafters.vars.css
              │
              ▼
    Vite HMR (CSS hot reload) → React repaints
```

## Split CSS for Instant HMR

```tsx
// Studio main.tsx - split CSS imports
import '.rafters/output/rafters.tailwind.css';  // static @theme, processed once
import '.rafters/output/rafters.vars.css';       // pure CSS vars, instant HMR
```

| File | Generated | Purpose |
|------|-----------|---------|
| `rafters.css` | init, save | Production combined |
| `rafters.tailwind.css` | startup | Static Tailwind @theme |
| `rafters.vars.css` | edit | Pure CSS vars - instant HMR |

## Dogfooding Principle

Studio uses Tailwind token classes (bg-primary, text-foreground) for ALL styling.
When rafters.vars.css updates, Studio UI itself reflects changes via HMR.
No hardcoded colors. No separate self-consumption feature needed.

## Constraints

1. **Edit only** - No add/delete (dependency graph too complex)
2. **Singleton registry** - Created once with setChangeCallback, not per-request
3. **registry.set()** - Handles cascade + userOverride respect
4. **Zod-first** - All types from @rafters/shared schemas
5. **No duplication** - Use existing packages, never reimplement
