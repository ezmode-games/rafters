# Design Tokens Architecture

**Purpose:** Define the architecture for `@rafters/design-tokens` package, generators, persistence, and export system.

---

## Overview

The design token system generates, stores, and exports design tokens for use in Tailwind v4 projects. It follows the principle: **"Everything from API or math-utils, nothing hardcoded."**

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                            │
├─────────────────────────────────────────────────────────────────┤
│  Rafters Color API          │  @rafters/math-utils              │
│  ─────────────────          │  ────────────────────             │
│  GET /color/{l}-{c}-{h}     │  progressions (minor-third, etc)  │
│  GET /color/search?q=...    │  scales (spacing, typography)     │
│  Returns: ColorValue with   │  Returns: computed values         │
│  - 11-position scale        │                                   │
│  - AI intelligence          │                                   │
│  - harmonies                │                                   │
│  - accessibility data       │                                   │
│  - semantic suggestions     │                                   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         GENERATORS                              │
├─────────────────────────────────────────────────────────────────┤
│  Each generator:                                                │
│  1. Receives config (base units, ratios, API endpoint)          │
│  2. Fetches/computes values from data sources                   │
│  3. Returns GeneratorResult { namespace, tokens }               │
│                                                                 │
│  Generators:                                                    │
│  ├── color.ts      → Fetches from API                          │
│  ├── semantic.ts   → References color tokens + API suggestions  │
│  ├── spacing.ts    → math-utils progression                     │
│  ├── typography.ts → math-utils progression                     │
│  ├── radius.ts     → math-utils progression                     │
│  ├── shadow.ts     → math-utils progression                     │
│  ├── depth.ts      → semantic z-index mapping                   │
│  ├── elevation.ts  → combines depth + shadow                    │
│  ├── motion.ts     → math-utils progression + easing curves     │
│  ├── focus.ts      → derived from spacing/color                 │
│  └── breakpoint.ts → viewport width definitions                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         REGISTRY                                │
├─────────────────────────────────────────────────────────────────┤
│  TokenRegistry                                                  │
│  ─────────────                                                  │
│  - Stores Token objects in Map<string, Token>                   │
│  - Tracks dependencies via TokenDependencyGraph                 │
│  - Executes generation rules for derived tokens                 │
│  - Auto-regenerates dependents when base tokens change          │
│                                                                 │
│  PersistenceAdapter (interface)                                 │
│  ──────────────────                                             │
│  - loadNamespace(namespace): Promise<Token[]>                   │
│  - saveNamespace(namespace, tokens): Promise<void>              │
│  - listNamespaces(): Promise<string[]>                          │
│                                                                 │
│  Implementations:                                               │
│  - NodePersistenceAdapter (reads/writes .rafters/tokens/)       │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PERSISTENCE                             │
├─────────────────────────────────────────────────────────────────┤
│  .rafters/                                                      │
│    tokens/                    ← SOURCE OF TRUTH                 │
│      color.rafters.json                                         │
│      semantic.rafters.json                                      │
│      spacing.rafters.json                                       │
│      typography.rafters.json                                    │
│      radius.rafters.json                                        │
│      shadow.rafters.json                                        │
│      depth.rafters.json                                         │
│      elevation.rafters.json                                     │
│      motion.rafters.json                                        │
│      focus.rafters.json                                         │
│      breakpoint.rafters.json                                    │
│    config.rafters.json        ← System configuration            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                         EXPORTERS                               │
├─────────────────────────────────────────────────────────────────┤
│  registryToTailwind(registry)   → theme.css                     │
│  registryToDTCG(registry)       → tokens.json                   │
│  registryToTypeScript(registry) → tokens.ts                     │
│                                                                 │
│  Output to: .rafters/output/    ← DERIVED SNAPSHOTS             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Package Structure

```
packages/design-tokens/
  src/
    index.ts                    # Public exports

    # Core Registry
    registry.ts                 # TokenRegistry class
    dependencies.ts             # TokenDependencyGraph
    generation-rules.ts         # Rule parser + executor

    # Persistence
    persistence/
      index.ts
      types.ts                  # PersistenceAdapter interface
      node-adapter.ts           # Node.js filesystem adapter

    # Generators
    generators/
      index.ts                  # Orchestrator + exports
      types.ts                  # Generator types + config
      config.ts                 # Default configuration values

      # Individual generators
      color.ts                  # Fetches from Rafters API
      semantic.ts               # Semantic color assignments
      spacing.ts                # Spacing scale
      typography.ts             # Font sizes, weights, line-heights
      radius.ts                 # Border radius scale
      shadow.ts                 # Box shadow scale
      depth.ts                  # Z-index semantic layers
      elevation.ts              # Depth + shadow combinations
      motion.ts                 # Durations + easing curves
      focus.ts                  # Focus ring styles
      breakpoint.ts             # Responsive breakpoints

    # Exporters
    exporters/
      index.ts
      tailwind.ts               # → theme.css
      dtcg.ts                   # → tokens.json (W3C DTCG format)
      typescript.ts             # → tokens.ts
```

---

## Generator Architecture

### Generator Interface

```typescript
/**
 * Generator configuration passed to all generators
 */
interface GeneratorConfig {
  // Base values
  baseSpacingUnit: number;        // Default: 4 (px)
  progressionRatio: string;       // Default: 'minor-third' (1.2)

  // Typography
  fontFamily: string;
  monoFontFamily: string;
  baseFontSize: number;           // Derived: baseSpacingUnit * 4

  // Other derived values
  baseRadius: number;             // Derived: baseSpacingUnit * 1.5
  focusRingWidth: number;         // Derived: baseSpacingUnit / 2
  baseTransitionDuration: number; // Derived: baseSpacingUnit * 37.5

  // API configuration
  colorApiBaseUrl: string;        // Default: 'https://api.rafters.studio'
}

/**
 * Result returned by each generator
 */
interface GeneratorResult {
  namespace: string;
  tokens: Token[];
}

/**
 * Generator function signature
 */
type GeneratorFn = (config: GeneratorConfig) => Promise<GeneratorResult>;
```

### Generator: Color

**Source:** Rafters Color API

```typescript
// generators/color.ts

interface ColorGeneratorInput {
  config: GeneratorConfig;
  colors: Array<{
    name: string;           // e.g., 'ocean-blue', 'forest-green'
    oklch: {
      l: number;            // Lightness 0-1
      c: number;            // Chroma 0-0.4
      h: number;            // Hue 0-360
    };
  }>;
}

async function generateColorTokens(input: ColorGeneratorInput): Promise<GeneratorResult> {
  const tokens: Token[] = [];

  for (const color of input.colors) {
    // Fetch full ColorValue from API
    const { l, c, h } = color.oklch;
    const response = await fetch(
      `${input.config.colorApiBaseUrl}/color/${l.toFixed(3)}-${c.toFixed(3)}-${h}`
    );
    const colorValue: ColorValue = await response.json();

    // Create family token with full intelligence
    tokens.push({
      name: color.name,
      value: colorValue,
      category: 'color',
      namespace: 'color',
      semanticMeaning: colorValue.intelligence?.reasoning,
      // ... rest of Token fields from colorValue
    });

    // Create individual scale position tokens
    for (const [index, position] of COLOR_SCALE_POSITIONS.entries()) {
      const oklch = colorValue.scale[index];
      tokens.push({
        name: `${color.name}-${position}`,
        value: `oklch(${oklch.l} ${oklch.c} ${oklch.h})`,
        category: 'color',
        namespace: 'color',
        scalePosition: index,
        dependsOn: [color.name],
        generationRule: `scale:${position}`,
      });
    }
  }

  return { namespace: 'color', tokens };
}
```

### Generator: Semantic

**Source:** Color tokens + API semantic suggestions

```typescript
// generators/semantic.ts

interface SemanticMapping {
  semantic: string;           // e.g., 'primary', 'danger'
  colorFamily: string;        // e.g., 'ocean-blue'
  position: string;           // e.g., '500'
  foregroundPosition: string; // e.g., '50' for light text on dark bg
}

async function generateSemanticTokens(
  config: GeneratorConfig,
  colorTokens: Token[],
  mappings: SemanticMapping[]
): Promise<GeneratorResult> {
  const tokens: Token[] = [];

  for (const mapping of mappings) {
    // Create semantic token
    tokens.push({
      name: mapping.semantic,
      value: `var(--color-${mapping.colorFamily}-${mapping.position})`,
      category: 'color',
      namespace: 'semantic',
      dependsOn: [`${mapping.colorFamily}-${mapping.position}`],
      generationRule: `reference:${mapping.colorFamily}-${mapping.position}`,
    });

    // Create foreground pair
    tokens.push({
      name: `${mapping.semantic}-foreground`,
      value: `var(--color-${mapping.colorFamily}-${mapping.foregroundPosition})`,
      category: 'color',
      namespace: 'semantic',
      dependsOn: [mapping.semantic],
      generationRule: `contrast:${mapping.semantic}`,
    });

    // Create state variants
    for (const state of ['hover', 'active', 'focus', 'disabled']) {
      tokens.push({
        name: `${mapping.semantic}-${state}`,
        value: computeStateVariant(mapping, state),
        category: 'color',
        namespace: 'semantic',
        dependsOn: [mapping.semantic],
        generationRule: `state:${state}`,
      });
    }
  }

  return { namespace: 'semantic', tokens };
}
```

### Generator: Spacing

**Source:** `@rafters/math-utils` progression

```typescript
// generators/spacing.ts

import { createProgression } from '@rafters/math-utils';

async function generateSpacingTokens(config: GeneratorConfig): Promise<GeneratorResult> {
  const tokens: Token[] = [];
  const progression = createProgression(config.progressionRatio);

  // Tailwind-compatible spacing scale
  const SPACING_SCALE = [
    { name: '0', multiplier: 0 },
    { name: '0.5', multiplier: 0.5 },
    { name: '1', multiplier: 1 },
    { name: '1.5', multiplier: 1.5 },
    { name: '2', multiplier: 2 },
    // ... through '96'
  ];

  for (const { name, multiplier } of SPACING_SCALE) {
    const value = config.baseSpacingUnit * multiplier;

    tokens.push({
      name: `spacing-${name}`,
      value: `${value / 16}rem`,
      category: 'spacing',
      namespace: 'spacing',
      semanticMeaning: getSpacingMeaning(multiplier),
      usageContext: getSpacingContext(multiplier),
      progressionSystem: config.progressionRatio,
    });
  }

  return { namespace: 'spacing', tokens };
}
```

### Generator: Typography

**Source:** `@rafters/math-utils` progression

```typescript
// generators/typography.ts

import { createProgression } from '@rafters/math-utils';

async function generateTypographyTokens(config: GeneratorConfig): Promise<GeneratorResult> {
  const tokens: Token[] = [];
  const progression = createProgression(config.progressionRatio);

  // Font sizes with companion line-heights
  const TYPE_SCALE = [
    { name: 'xs', step: -2, lineHeight: 1.5 },
    { name: 'sm', step: -1, lineHeight: 1.5 },
    { name: 'base', step: 0, lineHeight: 1.5 },
    { name: 'lg', step: 1, lineHeight: 1.5 },
    { name: 'xl', step: 2, lineHeight: 1.4 },
    { name: '2xl', step: 3, lineHeight: 1.35 },
    // ... through '9xl'
  ];

  for (const { name, step, lineHeight } of TYPE_SCALE) {
    const fontSize = progression.compute(config.baseFontSize, step);

    // Font size token
    tokens.push({
      name: `text-${name}`,
      value: `${fontSize / 16}rem`,
      category: 'typography',
      namespace: 'typography',
      progressionSystem: config.progressionRatio,
    });

    // Companion line-height (Tailwind v4 syntax)
    tokens.push({
      name: `text-${name}--line-height`,
      value: `${lineHeight}`,
      category: 'typography',
      namespace: 'typography',
      dependsOn: [`text-${name}`],
    });
  }

  // Font families
  tokens.push({
    name: 'font-sans',
    value: config.fontFamily,
    category: 'typography',
    namespace: 'typography',
  });

  tokens.push({
    name: 'font-mono',
    value: config.monoFontFamily,
    category: 'typography',
    namespace: 'typography',
  });

  return { namespace: 'typography', tokens };
}
```

---

## Persistence Layer

### PersistenceAdapter Interface

```typescript
// persistence/types.ts

import type { Token } from '@rafters/shared';

/**
 * Adapter for reading/writing token files
 * Only Node.js implementation needed (browser uses API)
 */
export interface PersistenceAdapter {
  /**
   * Load tokens for a namespace
   */
  loadNamespace(namespace: string): Promise<Token[]>;

  /**
   * Save tokens for a namespace
   */
  saveNamespace(namespace: string, tokens: Token[]): Promise<void>;

  /**
   * List available namespaces
   */
  listNamespaces(): Promise<string[]>;

  /**
   * Check if a namespace exists
   */
  namespaceExists(namespace: string): Promise<boolean>;
}
```

### Node.js Adapter

```typescript
// persistence/node-adapter.ts

import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import type { Token } from '@rafters/shared';
import type { PersistenceAdapter } from './types';

export class NodePersistenceAdapter implements PersistenceAdapter {
  private tokensDir: string;

  constructor(projectRoot: string) {
    this.tokensDir = join(projectRoot, '.rafters', 'tokens');
  }

  async loadNamespace(namespace: string): Promise<Token[]> {
    const filePath = join(this.tokensDir, `${namespace}.rafters.json`);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data.tokens;
  }

  async saveNamespace(namespace: string, tokens: Token[]): Promise<void> {
    await mkdir(this.tokensDir, { recursive: true });

    const filePath = join(this.tokensDir, `${namespace}.rafters.json`);
    const data = {
      $schema: 'https://rafters.studio/schemas/namespace-tokens.json',
      namespace,
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      tokens,
    };

    await writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async listNamespaces(): Promise<string[]> {
    try {
      const files = await readdir(this.tokensDir);
      return files
        .filter(f => f.endsWith('.rafters.json'))
        .map(f => f.replace('.rafters.json', ''));
    } catch {
      return [];
    }
  }

  async namespaceExists(namespace: string): Promise<boolean> {
    try {
      await access(join(this.tokensDir, `${namespace}.rafters.json`));
      return true;
    } catch {
      return false;
    }
  }
}
```

### File Format: `{namespace}.rafters.json`

```json
{
  "$schema": "https://rafters.studio/schemas/namespace-tokens.json",
  "namespace": "color",
  "version": "1.0.0",
  "generatedAt": "2024-01-15T10:30:00Z",
  "tokens": [
    {
      "name": "ocean-blue",
      "value": {
        "name": "ocean-blue",
        "scale": [
          { "l": 0.98, "c": 0.02, "h": 240, "alpha": 1 },
          { "l": 0.95, "c": 0.03, "h": 240, "alpha": 1 }
        ],
        "intelligence": {
          "reasoning": "...",
          "emotionalImpact": "...",
          "culturalContext": "...",
          "accessibilityNotes": "...",
          "usageGuidance": "..."
        },
        "harmonies": { },
        "accessibility": { }
      },
      "category": "color",
      "namespace": "color",
      "semanticMeaning": "Primary brand color evoking trust",
      "usagePatterns": {
        "do": ["Use for primary CTAs", "Headers"],
        "never": ["Body text", "Large backgrounds"]
      }
    }
  ]
}
```

---

## Exporters

### Tailwind v4 CSS

```typescript
// exporters/tailwind.ts

export function registryToTailwind(registry: TokenRegistry): string {
  const lines: string[] = [
    '/* Generated by Rafters - DO NOT EDIT */',
    '@import "tailwindcss";',
    '',
    '/* Semantic tokens in :root */',
    ':root {',
  ];

  // Semantic color variables
  for (const token of registry.list({ namespace: 'semantic' })) {
    lines.push(`  --${token.name}: ${token.value};`);
  }

  lines.push('}', '', '/* Bridge to Tailwind utilities */', '@theme inline {');

  // Color scale tokens
  for (const token of registry.list({ namespace: 'color' })) {
    if (typeof token.value === 'string') {
      lines.push(`  --color-${token.name}: ${token.value};`);
    }
  }

  // Spacing tokens
  for (const token of registry.list({ namespace: 'spacing' })) {
    lines.push(`  --spacing-${token.name.replace('spacing-', '')}: ${token.value};`);
  }

  // Typography tokens
  for (const token of registry.list({ namespace: 'typography' })) {
    if (token.name.startsWith('text-')) {
      lines.push(`  --${token.name}: ${token.value};`);
    }
  }

  lines.push('}');

  return lines.join('\n');
}
```

### DTCG JSON

```typescript
// exporters/dtcg.ts

export function registryToDTCG(registry: TokenRegistry): object {
  const output: Record<string, unknown> = {};

  for (const token of registry.list()) {
    const path = token.name.split('-');
    let current = output;

    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = current[path[i]] || {};
      current = current[path[i]] as Record<string, unknown>;
    }

    current[path[path.length - 1]] = {
      $type: mapCategoryToDTCGType(token.category),
      $value: token.value,
      $description: token.semanticMeaning,
    };
  }

  return output;
}
```

### TypeScript

```typescript
// exporters/typescript.ts

export function registryToTypeScript(registry: TokenRegistry): string {
  const lines: string[] = [
    '/* Generated by Rafters - DO NOT EDIT */',
    '',
    'export const tokens = {',
  ];

  const byNamespace = new Map<string, Token[]>();
  for (const token of registry.list()) {
    const tokens = byNamespace.get(token.namespace) || [];
    tokens.push(token);
    byNamespace.set(token.namespace, tokens);
  }

  for (const [namespace, tokens] of byNamespace) {
    lines.push(`  ${namespace}: {`);
    for (const token of tokens) {
      const value = typeof token.value === 'string'
        ? `'${token.value}'`
        : JSON.stringify(token.value);
      lines.push(`    '${token.name}': ${value},`);
    }
    lines.push('  },');
  }

  lines.push('} as const;', '', 'export type TokenName = keyof typeof tokens;');

  return lines.join('\n');
}
```

---

## Configuration

### `config.rafters.json`

```json
{
  "$schema": "https://rafters.studio/schemas/config.json",
  "version": "1.0.0",

  "base": {
    "spacingUnit": 4,
    "progressionRatio": "minor-third"
  },

  "typography": {
    "fontFamily": "'Noto Sans Variable', sans-serif",
    "monoFontFamily": "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
  },

  "api": {
    "colorApiBaseUrl": "https://api.rafters.studio"
  },

  "colors": [
    {
      "name": "neutral",
      "oklch": { "l": 0.5, "c": 0, "h": 0 }
    }
  ],

  "semanticMappings": {
    "primary": { "color": "neutral", "position": "900" },
    "secondary": { "color": "neutral", "position": "100" },
    "background": { "color": "neutral", "position": "50" },
    "foreground": { "color": "neutral", "position": "950" }
  }
}
```

---

## Changes from Current Implementation

### Files to Modify

| File | Change |
|------|--------|
| `generators/color.ts` | Replace static OKLCH with API fetch |
| `generators/semantic.ts` | Add state variants, use API suggestions |
| `generators/defaults.ts` | Remove hardcoded values, keep only scale names |
| `generators/types.ts` | Add `colorApiBaseUrl` to config |
| `generators/spacing.ts` | Use math-utils instead of static multipliers |
| `generators/typography.ts` | Use math-utils for size progression |

### Files to Add

| File | Purpose |
|------|---------|
| `persistence/types.ts` | PersistenceAdapter interface |
| `persistence/node-adapter.ts` | Filesystem read/write |
| `persistence/index.ts` | Exports |
| `exporters/tailwind.ts` | Generate theme.css |
| `exporters/dtcg.ts` | Generate tokens.json |
| `exporters/typescript.ts` | Generate tokens.ts |
| `exporters/index.ts` | Exports |
| `generators/config.ts` | Default configuration values |

### Files to Delete

| File | Reason |
|------|--------|
| `generators/defaults.ts` | Replaced by `config.ts` with no hardcoded values |

---

## Dependencies

### Required

- `@rafters/shared` - Token types, Zod schemas
- `@rafters/math-utils` - Progression calculations

### Optional (for CLI)

- `node:fs/promises` - File operations
- `node:path` - Path manipulation

---

## Next Steps

1. **Update `@rafters/math-utils`** - Ensure progression functions are exported
2. **Implement persistence layer** - NodePersistenceAdapter
3. **Update generators** - Switch from static to API/math-utils
4. **Implement exporters** - Tailwind, DTCG, TypeScript
5. **Create CLI package** - `rafters init`, `rafters generate`, etc.
