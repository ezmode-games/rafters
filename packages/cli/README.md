# rafters

Design Intelligence CLI. Scaffold tokens, add components, and serve an MCP server so AI agents build UIs with designer-level judgment instead of guessing.

## Install

```bash
npx rafters init
```

Or install globally:

```bash
pnpm add -g rafters
```

## Commands

### `rafters init`

Initialize a project with design tokens. Detects your framework, scaffolds `.rafters/` with a complete token system, and generates output files.

```bash
rafters init              # Interactive setup
rafters init --force      # Regenerate output from existing config
rafters init --agent      # JSON output for CI/machine consumption
```

**Supported frameworks:** Next.js, Vite, Remix, React Router, Astro

**Export formats** (configured during init):

| Format | File | Default | Description |
|--------|------|---------|-------------|
| Tailwind CSS | `rafters.css` | Yes | CSS custom properties with `@theme` |
| TypeScript | `rafters.ts` | Yes | Type-safe constants with JSDoc intelligence |
| DTCG JSON | `rafters.json` | No | W3C Design Tokens standard format |
| Compiled CSS | `rafters.compiled.css` | No | Pre-processed, no build step needed |

Automatically detects and migrates existing shadcn/ui color values. Requires Tailwind v4.

### `rafters add [components...]`

Add components from the Rafters registry to your project.

```bash
rafters add button dialog    # Add specific components
rafters add --list           # List all available components
rafters add --overwrite      # Replace existing files
```

Components include embedded design intelligence: cognitive load ratings (1-7), accessibility requirements, do/never guidance, and trust-building patterns. Dependencies are resolved automatically.

### `rafters studio`

Launch Studio for visual token editing.

```bash
rafters studio
```

Opens a Vite-powered UI where you design by doing: pick a primary color, explain why, watch the system paint your scale. Every decision is recorded with reasoning so AI agents read intent instead of guessing.

### `rafters mcp`

Start the MCP server for AI agent access via stdio transport.

```bash
rafters mcp
```

## MCP Tools

Four tools give AI agents complete design system access:

### `rafters_vocabulary`

System overview. Colors, spacing, typography, components, cognitive loads, and available patterns. Call this first to orient.

### `rafters_pattern`

Deep guidance for specific UI scenarios. Returns which components to use, which tokens to apply, accessibility requirements, and do/never rules.

**Available patterns:** `destructive-action`, `form-validation`, `empty-state`, `loading-state`, `navigation-hierarchy`, `data-table`, `modal-dialog`, `tooltip-guidance`, `card-layout`, `dropdown-actions`

### `rafters_component`

Full intelligence for a specific component. Cognitive load rating, attention economics, accessibility requirements, trust-building patterns, variants, sizes, and primitives.

### `rafters_token`

Token dependency graph, derivation rules, and human override context. Returns how a token is computed, what it depends on, and whether a designer manually overrode it (with their reasoning).

**Derivation rules:** `calc()`, `state:hover`, `scale:600`, `contrast:auto`, `invert`

## How It Works

Rafters is a Design Intelligence Protocol. AI agents don't have taste - they guess at colors, spacing, hierarchy. Rafters encodes a designer's judgment into queryable data so AI reads decisions instead of guessing.

Three layers:

- **What** (Components) - 55 React components with embedded intelligence metadata
- **Where** (Tokens) - 240+ tokens with dependency graph and human override tracking
- **Why** (Decisions) - Do/never patterns, cognitive load scores, trust patterns, accessibility requirements

The token system uses OKLCH color space, modular scales based on musical ratios, and a dependency engine that automatically derives related values. When a designer overrides a computed value, the system records the reason so AI agents respect the intent.

## Project Structure

```
.rafters/
  config.rafters.json         # Framework paths and export settings
  tokens/
    color.rafters.json        # Color tokens with OKLCH values
    spacing.rafters.json      # Spacing scale
    typography.rafters.json   # Type scale
  output/
    rafters.css               # Tailwind CSS export
    rafters.ts                # TypeScript constants
```

## Requirements

- Node.js >= 24.12.0
- Tailwind CSS v4
- React >= 19.0.0

## License

MIT
