#!/bin/bash
# post-compact-rafters.sh
# SessionStart hook (matcher: compact) - re-orients after compaction

cat << 'CONTEXT'
=== RAFTERS POST-COMPACTION ===

Context was compacted. Core orientation:

WHAT RAFTERS IS:
Design Intelligence Protocol - encodes designer judgment into queryable data.
AI agents don't have taste. Rafters gives them decisions, not guesses.

THREE LAYERS:
- What (packages/ui) - 55 components with JSDoc intelligence
- Where (packages/design-tokens) - TokenRegistry with dependency graph
- Why - userOverride.reason, do/never patterns, MCP tools

FOUR MCP TOOLS (primary interface):
- rafters_vocabulary - What's available
- rafters_pattern - How to implement scenarios
- rafters_component - Full component intelligence
- rafters_token - Dependency graph, derivation, overrides

PACKAGES:
@rafters/shared       - Types, Zod schemas, fixtures
@rafters/color-utils  - buildColorValue(), generateRaftersHarmony(), OKLCH math
@rafters/math-utils   - Progressions, scales
@rafters/design-tokens - TokenRegistry, generators, exporters
@rafters/ui           - Components, primitives
@rafters/studio       - THIN UI (logic in packages, client builds tokens)
@rafters/cli          - MCP server

STRICT RULES:
- TypeScript strict (no `any`)
- React 19 pure
- Tailwind v4 (no arbitrary values)
- pnpm only, no emoji
- preflight before commit

KEY MEMORIES TO READ:
- what_rafters_is - Full concept explanation
- studio-architecture - Studio patterns (THIN UI, set() not add())
- design-tokens-architecture - Registry, dependencies, exporters
- color-families-11 - 11 families from harmony + semanticSuggestions
- testing_strategy - zocker, vitest-axe, Playwright

Read the relevant memory for your current task before proceeding.

=== END COMPACTION CONTEXT ===
CONTEXT

exit 0
