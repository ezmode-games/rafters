# @rafters/design-tokens

> Dependency-aware, rule-driven design token system used by Rafters.

The `design-tokens` package provides a token registry, dependency graph,
generation rule parser/executor, and a plugin system for deriving semantic
tokens (contrast, states, scales, etc.). It is intended to be the authoritative
programmatic surface for creating, validating, and regenerating design tokens
in Rafters. It integrates with `@rafters/color-utils` (OKLCH color intelligence)
and `@rafters/math-utils` (precision calculations) to produce predictable,
accessible token systems.

## Install

This package is a workspace package. From the monorepo root:

```bash
pnpm install
```

Import key types and classes:

```ts
import { TokenRegistry } from '@rafters/design-tokens';
import { generateOKLCHScale } from '@rafters/color-utils';
import { evaluateExpression } from '@rafters/math-utils';
```

## Core Concepts

- TokenRegistry: central store for tokens with O(1) get/set and metadata.
- TokenDependencyGraph: tracks token dependencies, supports topological sorting
  and bulk updates for efficient regeneration.
- Generation rules: declarative strings parsed by `GenerationRuleParser` and
  executed by `GenerationRuleExecutor` (supports `calc`, `scale`, `state`,
  `contrast`, `invert`).
- Plugins: rule plugins live under `src/plugins` (e.g., `contrast`, `scale`, `state`, `calc`).

## Public API (selected)

- `TokenRegistry` — class to create and manage tokens. Key methods:
  - `new TokenRegistry(initialTokens?: Token[])`
  - `add(token: Token): void`
  - `get(name: string): Token | undefined`
  - `set(name: string, value: string): Promise<void>` — updates token and regenerates dependents
  - `addDependencyWithRuleParsing(tokenName, rule, explicitDependsOn?)`
  - `getTopologicalOrder(): string[]`
  - `validateComplete()` — validates registry and all generation rules

- `GenerationRuleParser` / `GenerationRuleExecutor` — parse and run rules.

- `loadPlugins(raftersDir?)` and `createRuleContext(registry, raftersDir?)` — plugin discovery and rule execution context.

## Typical Workflows

1) Programmatic token creation and dependency wiring

```ts
import { TokenRegistry } from '@rafters/design-tokens';

const registry = new TokenRegistry();

registry.add({ name: 'brand-500', value: '#0ea5a4', category: 'color' });
registry.add({ name: 'brand-600', value: 'scale:1.2', category: 'color' });

// Declare that brand-600 depends on brand-500 via a scale rule
registry.addDependencyWithRuleParsing('brand-600', 'scale:1.2', ['brand-500']);

// Update base token and let the registry regenerate dependents
await registry.set('brand-500', '#0b8f8d');
```

2) Using generation rules with `calc` and numeric helpers

Generation rules that include arithmetic references (e.g. `calc({space-100} * 1.5)`) produce
`calc(...)` expressions. For numeric evaluation (if you need concrete numbers) you can
use `@rafters/math-utils` to evaluate expressions prior to emitting platform artifacts.

```ts
import { evaluateExpression } from '@rafters/math-utils';

const computed = evaluateExpression('16 * 1.25'); // => 20
```

3) Color-aware tokens and accessibility

The registry stores color families as structured `ColorValue` objects. Plugins such
as `contrast` use the family's accessibility metadata to pick accessible foregrounds.
You can generate an OKLCH scale via `@rafters/color-utils` and add accessibility metadata
back onto the color family for fast lookups by the `contrast` plugin.

```ts
import { generateOKLCHScale, generateAccessibilityMetadata, hexToOKLCH } from '@rafters/color-utils';

const baseOklch = hexToOKLCH('#0ea5a4');
const scale = generateOKLCHScale(baseOklch); // { '50': OKLCH, ..., '900': OKLCH }

// Compute accessibility metadata for the scale
const accessibility = generateAccessibilityMetadata(Object.values(scale));

// Persist into a ColorValue family token so plugins can access it
registry.add({
  name: 'brand',
  value: { family: 'brand', scale, accessibility },
  category: 'color',
});

// Now contrast plugin can choose appropriate foregrounds for semantic tokens
```

## How math-utils, color-utils, and design-tokens interact

- `math-utils` provides safe numeric evaluation and progression helpers used by
  `generation-rules` to compute numeric scales, ratios, and to evaluate complex
  `calc()` expressions when a concrete numeric value is required for a token.
- `color-utils` provides OKLCH conversions, perceptual analysis (contrast, APCA,
  perceptual interpolation), and scale/harmony generation. `design-tokens` uses
  `color-utils` in plugins (for example `contrast.ts` and scale generation) and
  to enrich `ColorValue` tokens with accessibility metadata.
- `design-tokens` orchestrates token storage, dependency tracking, and rule
  execution. It delegates perceptual/color math to `color-utils` and numeric
  calculations to `math-utils`, keeping the token engine focused on orchestration.

## Examples of integration patterns

- Precompute token values for build output:
  - Use `generateOKLCHScale` (color-utils) to produce a 50–950 scale.
  - Add accessibility metadata using `generateAccessibilityMetadata`.
  - Store family token in `TokenRegistry`.
  - Use `GenerationRuleExecutor` to resolve `contrast`/`state` tokens referencing the family.

- Runtime regeneration:
  - When a base token is edited in design tools, call `registry.set(name, value)`.
  - `TokenRegistry` topologically sorts and regenerates dependent tokens using the
    `GenerationRuleExecutor`, which may call plugins that use color-utils.

## Plugins

Built-in plugins live under `src/plugins` and include:
- `contrast` — picks accessible foregrounds using color intelligence and accessibility matrices.
- `scale` — creates scaled tokens from base tokens.
- `state` — derives hover/focus/active states.
- `invert` & `calc` — inversion and arithmetic helpers.

You can add custom plugins by placing them in a project-level `plugins` directory and
loading via `createRuleContext(registry, raftersDir)`.

## Testing

Run unit tests from the repo root:

```bash
pnpm -w test:unit
```

## Next steps / Recommendations

- Add CI checks for rule-parser grammar changes to avoid invalid generation rules.
- Add more concrete numeric evaluation flows where `calc` expressions must be
  resolved to numeric tokens (use `math-utils` carefully to avoid imprecise CSS calc outputs).
- Expand plugin test coverage, especially for `contrast` which depends on
  `color-utils` accessibility matrices.

---

Maintainers: Rafters core team
