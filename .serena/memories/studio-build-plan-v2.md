# Studio Build Plan v2 (Post-Reset)

**Created**: 2025-01-28
**Status**: Architecture finalized

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

## Non-Negotiable Rules

1. **Import, don't reimplement** - Use existing packages
2. **Zod-first types** - `import type { Token } from '@rafters/shared'`
3. **Singleton registry** - One instance with `setChangeCallback`
4. **~50 lines middleware** - Just HTTP glue, no logic

## Vite Plugin (~50 lines)

```typescript
import { TokenRegistry, NodePersistenceAdapter, registryToVars, registryToTailwindStatic } from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';

let registry: TokenRegistry | null = null;
let adapter: NodePersistenceAdapter | null = null;

export function studioApiPlugin(): Plugin {
  return {
    name: 'studio-api',
    async configureServer(server) {
      const projectPath = process.env.RAFTERS_PROJECT_PATH;
      if (!projectPath) return;

      // Singleton registry
      adapter = new NodePersistenceAdapter(projectPath);
      const namespaces = await adapter.listNamespaces();
      const allTokens: Token[] = [];
      for (const ns of namespaces) {
        allTokens.push(...await adapter.loadNamespace(ns));
      }
      registry = new TokenRegistry(allTokens);

      // Event-driven CSS
      registry.setChangeCallback(async () => {
        await writeFile(`${projectPath}/.rafters/output/rafters.vars.css`, registryToVars(registry!));
      });
      await writeFile(`${projectPath}/.rafters/output/rafters.tailwind.css`, registryToTailwindStatic(registry));

      // GET /api/tokens
      server.middlewares.use('/api/tokens', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(registry!.list()));
      });

      // PATCH /api/token/:ns/:name
      server.middlewares.use('/api/token/', async (req, res) => {
        if (req.method !== 'PATCH') return;
        const [ns, name] = req.url!.slice(1).split('/');
        const { value, reason } = await parseBody(req);
        await registry!.set(name, value);
        await adapter!.saveNamespace(ns, registry!.list({ namespace: ns }));
        res.end(JSON.stringify({ ok: true }));
      });
    }
  };
}
```

## UI Components (the actual work)

All UI code imports from existing packages:

```typescript
// Types
import type { Token, OKLCH } from '@rafters/shared';

// Color operations
import { hexToOKLCH, oklchToHex, generateOKLCHScale, generateSemanticColorSuggestions } from '@rafters/color-utils';

// No manual color functions. No manual types.
```

### Sprint 1: First Run
- Snowstorm (color picker) - uses `hexToOKLCH`, `generateColorName`
- ScalePaint (scale display) - uses `generateOKLCHScale`
- SemanticChoices - uses `generateSemanticColorSuggestions`

### Sprint 2: Workspaces
- Sidebar - namespace list from `/api/tokens`
- ColorWorkspace - displays tokens with `oklchToHex`
- Context menus - L/C/H sliders, WhyGate

### Sprint 3: Polish
- Cascade preview - uses `registry.getDependents()`
- Override conflicts - shows `userOverride` data
- Save all - regenerate production files

## What Went Wrong in v1

| Wrong | Right |
|-------|-------|
| `utils/color-conversion.ts` | `import { hexToOKLCH } from '@rafters/color-utils'` |
| `interface Token {}` | `import type { Token } from '@rafters/shared'` |
| New registry per request | Singleton with `setChangeCallback` |
| 300+ lines middleware | ~50 lines HTTP glue |