# Rafters Project Overview

## Purpose
Rafters is a **Design Intelligence Protocol for AI Agents**. It converts subjective design decisions into objective, queryable data structures that AI agents can use to build interfaces without guessing at colors, spacing, hierarchy, and balance.

**Core concept:** AI agents don't have taste. They need data. Rafters provides data that simulates taste through three interconnected registries:

1. **Token Registry** - What design values exist and why (OKLCH scales, musical progressions, perceptual weights)
2. **Component Registry** - What UI patterns exist and when to use them (cognitive load, semantic meaning)
   - 55 components (52 shadcn-compatible), 17 primitives, 72 total registry items
   - Schema uses `primitives` (not `registryDependencies`) with per-file versioned dependencies
3. **Designer Decisions Archive** - Why choices were made (embedded in tokens)

## Tech Stack

### Core
- **TypeScript** - Strict mode, ES2024 target
- **Node.js** >= 24.12.0
- **pnpm** >= 10.25.0 (required package manager)
- **Monorepo** - pnpm workspaces

### Frontend
- **Astro** - Website/docs (apps/website)
- **React** - UI components (packages/ui)
- **MDX** - Documentation

### Backend
- **Hono** - API framework with `@hono/zod-openapi`
- **Cloudflare Workers** - Runtime
- **D1** - Color cache database
- **Vectorize** - Semantic search
- **Workers AI** - Color intelligence generation

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E and component testing
- **Testing Library** - React component testing
- **Axe-core** - Accessibility testing

### Code Quality
- **Biome** - Linting and formatting
- **Lefthook** - Git hooks
- **TypeScript** - Strict type checking

## Monorepo Structure

```
rafters/
├── apps/
│   ├── api/          # Hono backend on Cloudflare Workers
│   ├── cli/          # AI-first CLI with embedded MCP server
│   └── website/      # Astro docs and Studio interface
├── packages/
│   ├── cli/          # CLI implementation
│   ├── color-utils/  # OKLCH color intelligence
│   ├── design-tokens/# Token engine with dependency graph
│   ├── math-utils/   # Mathematical progressions
│   ├── shared/       # Consolidated types and utilities
│   └── ui/           # React components with cognitive metadata
├── test/             # Shared test utilities
└── docs/             # Additional documentation
```

## Key Package Aliases
- `@rafters/shared` → `packages/shared/src/index.ts`
- `@rafters/color-utils` → `packages/color-utils/src/index.ts`
- `@rafters/math-utils` → `packages/math-utils/src/index.ts`
- `@rafters/design-tokens` → `packages/design-tokens/src/index.ts`

## Production Domain
`rafters.studio`
