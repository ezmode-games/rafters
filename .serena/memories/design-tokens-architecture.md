# @rafters/design-tokens Architecture

## Package Purpose
Dependency-aware design token system. **100% source-only workspace import - never published to npm.**

Source of truth for all token operations. Used directly by CLI and Studio via workspace imports (no API wrapper needed).

## Directory Structure
```
src/
├── index.ts              # Main exports
├── registry.ts           # TokenRegistry - runtime engine
├── dependencies.ts       # TokenDependencyGraph - DAG
├── generation-rules.ts   # Rule parser/executor
├── registry-factory.ts   # Factory (simplified)
├── generators/           # Token generators by namespace
│   ├── color.ts          # OKLCH 11-position scales
│   ├── spacing.ts        # minor-third (1.2) progression
│   ├── typography.ts     # Font scales
│   ├── semantic.ts       # primary, destructive, success, etc.
│   ├── defaults.ts       # All default values (240+ tokens)
│   └── [radius|shadow|depth|motion|breakpoint|elevation|focus].ts
├── exporters/
│   ├── tailwind.ts       # Tailwind v4 CSS (@theme, :root, dark mode)
│   ├── typescript.ts     # Type-safe constants
│   ├── dtcg.ts           # W3C Design Tokens format
│   └── style-dictionary.ts
├── persistence/
│   ├── node-adapter.ts   # .rafters/tokens/*.rafters.json
│   └── types.ts
└── plugins/              # Rule type implementations
    ├── calc.ts           # calc({base} * 2)
    ├── state.ts          # state:hover|focus|active|disabled
    ├── scale.ts          # scale:600
    ├── contrast.ts       # contrast:auto|high|medium|low
    └── invert.ts         # invert (dark mode)
```

## Core Classes

### TokenRegistry (registry.ts)
```typescript
class TokenRegistry {
  private tokens: Map<string, Token>;
  public dependencyGraph: TokenDependencyGraph;

  // Core operations
  get(name: string): Token | undefined
  add(token: Token): void
  has(name: string): boolean
  list(filter?: { category?, namespace? }): Token[]
  size(): number

  // Update with events
  updateToken(name: string, value: string): void  // fires token-changed
  updateMultipleTokens(updates: Array<{name, value}>): void  // fires tokens-batch-changed
  async set(name: string, value: string): Promise<void>  // updateToken + regenerateDependents

  // Event system (for Studio live CSS)
  setChangeCallback(callback: RegistryChangeCallback): void

  // Dependency graph
  addDependency(tokenName, dependsOn[], rule): void
  addDependencies(deps[]): void  // bulk
  getDependents(tokenName): string[]
  getDependencies(tokenName): string[]
  getDependencyInfo(tokenName): { dependsOn, rule } | null
  getTopologicalOrder(): string[]

  // Validation
  validate(): { isValid, errors[] }
  validateComplete(): { isValid, errors[], ruleErrors[] }
}
```

### TokenDependencyGraph (dependencies.ts)
- Bidirectional: `dependsOn[]` (parents) and `dependents[]` (children)
- `generationRule` stored per token
- Topological sort with caching (`_sortCache`)
- Cycle detection on add
- Bulk operations for performance

### Generation Rules (5 types)
1. `calc({token} * 2)` - math with token substitution
2. `state:hover|focus|active|disabled` - interaction variants
3. `scale:600` - extract scale position
4. `contrast:auto|high|medium|low` - WCAG contrast
5. `invert` - lightness inversion for dark mode

## Key Behaviors

### regenerateDependents() respects userOverride
```typescript
// In regenerateToken():
if (existingToken.userOverride) {
  // Update computedValue but preserve value (human's choice)
  this.tokens.set(tokenName, {
    ...existingToken,
    computedValue: newComputedValue,  // what rule would produce
    // value stays as-is
  });
} else {
  // No override - update actual value
  this.tokens.set(tokenName, {
    ...existingToken,
    value: newComputedValue,
    computedValue: newComputedValue,
  });
}
```

### COMPUTED Symbol - Override Clearing and Self-Repair

The `COMPUTED` symbol (from @rafters/shared) enables clearing overrides and triggering DAG self-repair:

```typescript
import { COMPUTED } from '@rafters/shared';

// Clear override and restore to computed/previous value
await registry.set('spacing-4', COMPUTED);
```

**Behavior depends on token type:**
- **Derived tokens** (have `generationRule`): Override removed, value regenerated from rule
- **Root tokens** (no rule): Override removed, value restored to `previousValue`

**Why a symbol?** Prevents accidental `null` clearing. `Symbol.for('rafters.computed')` is globally unique across packages.

**Self-repair cascade:** After clearing an override, all dependents automatically regenerate via `regenerateDependents()`.

```typescript
// Example: Clear override triggers cascade
registry.set('spacing-base', COMPUTED);
// -> spacing-base regenerates
// -> spacing-2, spacing-4, spacing-8, etc. all regenerate
```

### Event Types
```typescript
type TokenChangeEvent =
  | { type: 'token-changed', tokenName, oldValue?, newValue?, timestamp }
  | { type: 'tokens-batch-changed', changes[], timestamp }
  | { type: 'registry-initialized', tokenCount, timestamp }
```

## Main Entry Points

```typescript
// Generate full system with exports
const { system, registry, exports } = buildColorSystem({
  config: { colorPaletteBases: customColors },
  exports: { tailwind: true, dtcg: true, typescript: true }
});

// Create registry from tokens
const registry = new TokenRegistry(tokens);

// Export to Tailwind CSS
const css = registryToTailwind(registry, { includeImport: true });

// Node persistence (simple 2-method interface)
const adapter = new NodePersistenceAdapter(cwd);
const tokens = await adapter.load();   // All tokens from all namespace files
await adapter.save(tokens);            // Groups by namespace internally
```

## Persistence Architecture

The `PersistenceAdapter` interface is intentionally minimal:

```typescript
interface PersistenceAdapter {
  load(): Promise<Token[]>;
  save(tokens: Token[]): Promise<void>;
}
```

**Why so simple?** This contract enables any storage backend:
- `NodePersistenceAdapter` - .rafters/tokens/*.rafters.json (groups by namespace internally)
- Future: `CloudflareKVAdapter`, `D1Adapter`, `IndexedDBAdapter`

The adapter hides storage details. Callers don't know if tokens are in files, KV, or a database.

### Registry Integration

The registry owns persistence through dirty tracking:

```typescript
// Registry manages its own persistence
registry.setAdapter(adapter);

// set() marks namespace dirty and auto-persists
await registry.set('spacing-4', '2rem');  // Saves only affected namespaces
```

**Dirty tracking** ensures only changed namespaces are written, not the entire token set.

## Tailwind Exporters

Four functions for different use cases:

```typescript
// Production - combined @theme + values (apps import rafters.css)
registryToTailwind(registry): string

// Studio static - @theme inline with var() refs (processed once at startup)
registryToTailwindStatic(registry): string

// Studio dynamic - pure CSS variables (instant HMR, no Tailwind rebuild)
registryToVars(registry): string

// Standalone - fully compiled CSS via Tailwind CLI (no build step needed)
registryToCompiled(registry, options?): Promise<string>
```

The `registryToCompiled` function:
- Generates theme CSS with `registryToTailwind()`
- Runs it through `@tailwindcss/cli` (bundled dependency)
- Returns fully resolved CSS with all utilities
- Options: `{ minify?: boolean, includeImport?: boolean }`

## Tailwind Export Structure (rafters.css)
```css
@import "tailwindcss";

@theme {
  --color-neutral-50: oklch(...);
  --color-neutral-100: oklch(...);
  /* ... all color scales */
  --spacing-1: 0.25rem;
  /* ... all tokens by namespace */
}

@theme inline {
  --color-primary: var(--primary);
  --color-destructive: var(--destructive);
  /* semantic bridges */
}

:root {
  --rafters-primary: var(--color-neutral-900);
  --rafters-dark-primary: var(--color-neutral-50);
  --primary: var(--rafters-primary);
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root { --primary: var(--rafters-dark-primary); }
}

.dark { --primary: var(--rafters-dark-primary); }
```

## Token Schema (key fields)
```typescript
interface Token {
  name: string;
  value: string | ColorValue | ColorReference;
  category: string;
  namespace: string;

  // Dependencies
  dependsOn?: string[];
  generationRule?: string;  // "calc({base}*2)", "state:hover", etc.
  computedValue?: string;   // what rule would produce

  // Human override (CRITICAL for agent intelligence)
  userOverride?: {
    previousValue: string | ColorValue | ColorReference;  // enables undo/self-repair
    reason: string;           // WHY overridden (required)
    context?: string;         // optional additional context
  };

  // Designer intent
  usagePatterns?: { do: string[], never: string[] };
  semanticMeaning?: string;
  usageContext?: string[];
}
```

## Studio Integration Pattern

Studio imports directly from @rafters/design-tokens (workspace dependency).
Uses split CSS for instant HMR (no Tailwind rebuild needed).

```typescript
import {
  TokenRegistry,
  NodePersistenceAdapter,
  registryToTailwind,
  registryToTailwindStatic,
  registryToVars,
  registryToTypeScript,
  toDTCG
} from '@rafters/design-tokens';

// Load all tokens and create registry
const adapter = new NodePersistenceAdapter(cwd);
const allTokens = await adapter.load();
const registry = new TokenRegistry(allTokens);

// Connect adapter for auto-persistence
registry.setAdapter(adapter);

// Studio startup - write static Tailwind config (processed once)
await writeFile('.rafters/output/rafters.tailwind.css', registryToTailwindStatic(registry));

// Live CSS updates - only vars file (instant HMR, no Tailwind rebuild)
registry.setChangeCallback(async () => {
  await writeFile('.rafters/output/rafters.vars.css', registryToVars(registry));
});

// Edit (auto-cascades, respects overrides, auto-persists dirty namespaces)
await registry.set('primary', 'oklch(0.5 0.2 250)');
// No manual save needed - registry.set() persists automatically

// Explicit save - generate production files
await writeFile('.rafters/output/rafters.css', registryToTailwind(registry));
await writeFile('.rafters/output/rafters.ts', registryToTypeScript(registry));
await writeFile('.rafters/output/rafters.json', JSON.stringify(toDTCG(registry.list()), null, 2));
```
