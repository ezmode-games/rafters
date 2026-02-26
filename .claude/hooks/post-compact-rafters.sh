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

PERSISTENT MEMORY:
Check your auto memory directory for project knowledge:
- what-rafters-is - Core identity and philosophy
- why-the-registry-exists - Choices not values
- studio-vision / studio-ai-limitations - Studio creative direction
- mcp-architecture - 5 MCP tools, cognitive load model
- component-intelligence-data - Ratings for 17 components

Read the relevant memory for your current task before proceeding.

=== END COMPACTION CONTEXT ===
CONTEXT

exit 0
