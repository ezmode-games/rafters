#!/bin/bash
# pre-edit-rafters.sh
# PreToolUse hook - routes to relevant context based on file being edited

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Always output core rules
cat << 'CORE'
=== RAFTERS PRE-EDIT ===

BEFORE WRITING: Did you read the file first?

ALWAYS:
- TypeScript strict (no `any`, narrow with type guards)
- React 19 pure (no side effects in render)
- pnpm only, no emoji, preflight before commit
- Check existing utilities before writing new ones

CORE

# Route based on file path (order matters - specific patterns first)
case "$FILE_PATH" in
  *.test.* | *.spec.* | *.a11y.*)
    cat << 'TESTING'
--- TESTING CONTEXT ---
You're editing tests. Read memory: testing_strategy

Stack:
- zocker for property-based testing from Zod schemas
- vitest-axe for accessibility (MANDATORY for UI)
- Playwright for component tests
- vi.mocked() not `as any`

File naming:
- .test.ts = unit tests
- .spec.ts = integration tests
- .a11y.tsx = accessibility tests (MANDATORY for UI components)

Pattern:
const fixtures = zocker(TokenSchema).generate();
expect(TokenSchema.parse(fixture)).toBeDefined();
TESTING
    ;;

  *color-utils*)
    cat << 'COLOR_UTILS'
--- COLOR-UTILS CONTEXT ---
You're editing @rafters/color-utils. Read memory: design-tokens-architecture

Key exports:
- buildColorValue(oklch) -> Full ColorValue with scale, harmonies, accessibility, semanticSuggestions
- generateRaftersHarmony(oklch) -> 7 families: primary, secondary, tertiary, accent, highlight, surface, neutral
- generateOKLCHScale(oklch) -> 11-position scale (50-950)
- oklchToHex, hexToOKLCH, clampToSRGB, clampToP3
- calculateWCAGContrast, calculateAPCAContrast, meetsWCAGStandard, meetsAPCAStandard

ColorValue structure:
- oklch, hex, rgb, hsl (conversions)
- scale[] (11 positions)
- harmonies (complementary, triadic, etc.)
- accessibility (wcagAA, wcagAAA, apca, cvd)
- semanticSuggestions (danger[], success[], warning[], info[])
- perceptualWeight, atmosphericWeight

OKLCH: { l: 0-1, c: 0-0.4, h: 0-360, alpha: 0-1 }
COLOR_UTILS
    ;;

  *design-tokens*)
    cat << 'DESIGN_TOKENS'
--- DESIGN-TOKENS CONTEXT ---
You're editing @rafters/design-tokens. Read memory: design-tokens-architecture

TokenRegistry:
- add(token) = Initialization ONLY (bulk load)
- set(name, value) = ALL runtime ops (cascades dependents, fires callback)
- userOverride preserved on regenerate: value stays, computedValue updates

Five dependency rule types:
- calc({base} * 2)
- state:hover|focus|active|disabled
- scale:600
- contrast:auto|high|medium|low
- invert

Three Tailwind exporters:
- registryToTailwind() - production combined
- registryToTailwindStatic() - Studio static (@theme with var refs)
- registryToVars() - Studio dynamic (HMR)

Persistence: NodePersistenceAdapter -> .rafters/tokens/*.rafters.json
DESIGN_TOKENS
    ;;

  *studio*)
    cat << 'STUDIO'
--- STUDIO CONTEXT ---
You're editing @rafters/studio. Read memory: studio-architecture

CRITICAL: Studio is a THIN UI on TokenRegistry.
- ALL logic lives in packages (color-utils, design-tokens)
- Client builds Token objects, POSTs to /api/tokens
- Server just validates (TokenSchema) and persists

ALWAYS use set(), NEVER add() - default system is pre-loaded.

Self-consumption: Studio styled BY its own tokens.
- Use Tailwind token classes (bg-primary, text-destructive)
- NEVER hardcode values
- Token change -> HMR updates UI instantly

Two-phase color selection:
1. Instant: buildColorValue() + generateColorTokens() locally
2. Async: fetch intelligence from api.rafters.studio (fire and forget)

11 color families:
- Harmony (7): generateRaftersHarmony()
- Semantic (4): buildColorValue().semanticSuggestions

WhyGate: Only primary needs userOverride.reason. Math-derived = no explanation.

API endpoints:
- GET/POST /api/tokens
- PATCH /api/token/:ns/:name
- GET /api/tokens/color (proxy to Rafters API)
STUDIO
    ;;

  *packages/ui*)
    cat << 'UI'
--- UI COMPONENTS CONTEXT ---
You're editing @rafters/ui. Read memory: jsdoc-intelligence-template

SHADCN COMPATIBILITY (critical):
- 52 of 55 components are shadcn-compatible drop-ins
- Users copy shadcn examples VERBATIM - API must match
- Overlay components (Dialog, Sheet, Drawer, Select, Tooltip, Popover, DropdownMenu)
  include Portal/Overlay INTERNALLY - no wrapper needed
- Difference: we ADD intelligence metadata, we don't CHANGE the API

NO RADIX - vanilla primitives only:
- We replaced ALL Radix with our own primitives (src/primitives/)
- This enables Rafters for ANY framework (React, Vue, Svelte, etc.)
- Primitives are vanilla TypeScript, SSR-safe, framework-agnostic
- React components are thin wrappers (~100-300 LOC) over primitives

Component structure:
- src/components/ui/[Component].tsx - React wrapper
- src/primitives/[primitive].ts - vanilla TS logic
- forwardRef for all components
- Compound components (Dialog.Trigger, Dialog.Content, etc.)

JSDoc Intelligence MANDATORY:
@cognitive-load X/10, @attention-economics, @trust-building,
@accessibility, @semantic-meaning, @usage-patterns (DO/NEVER)

17 primitives (src/primitives/):
slot, modal, keyboard, escape-handler, aria, sr-manager, focus, float, classy...

Tailwind v4:
- NEVER arbitrary values (-[400px])
- Use design tokens only
- Container queries (@container, @md:) over media queries
- Flexbox/grid over positioning

Testing MANDATORY:
- .test.tsx for unit
- .a11y.tsx for accessibility (vitest-axe)
- Playwright for component tests
UI
    ;;

  *apps/api*)
    cat << 'API'
--- API CONTEXT ---
You're editing apps/api. Read memory: architecture

Hono + @hono/zod-openapi stack:
- [route].index.ts - Router
- [route].routes.ts - OpenAPI definitions (createRoute, z schemas)
- [route].handlers.ts - Implementation (AppRouteHandler<Route>)

Bindings: D1, Vectorize, Workers AI, Queues
Service bindings for worker-to-worker (no HTTP auth).

Color endpoint patterns:
- Cache hit -> return full ColorValue
- Cache miss + adhoc=true -> math-only (buildColorValue)
- Cache miss + sync=true -> wait for AI generation
- Default -> return math-only, queue AI generation
API
    ;;

  *shared*)
    cat << 'SHARED'
--- SHARED CONTEXT ---
You're editing @rafters/shared.

Contains:
- Types: Token, ColorValue, OKLCH, ComponentIntelligence
- Schemas: TokenSchema, ColorValueSchema, OKLCHSchema (Zod)
- Test fixtures: zocker-generated

This is the source of truth for types across all packages.
Changes here cascade everywhere - be careful.
SHARED
    ;;

  *)
    cat << 'DEFAULT'
--- GENERAL CONTEXT ---
Check relevant Serena memories:
- what_rafters_is - Core concepts
- design-tokens-architecture - Token system
- studio-architecture - Studio patterns
- code_style - Conventions
- testing_strategy - Test patterns

Key packages to check before writing utilities:
- @rafters/shared (types, schemas)
- @rafters/color-utils (OKLCH math)
- @rafters/math-utils (progressions)
- @rafters/design-tokens (registry, generators)
DEFAULT
    ;;
esac

echo ""
echo "=== END PRE-EDIT ==="

exit 0
