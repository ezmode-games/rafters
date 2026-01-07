# Rafters Architecture

## System Overview

```
Registry (API + D1)          ←  Source of truth
        ↓
   ┌────┴────┬─────────┬──────────┐
   ↓         ↓         ↓          ↓
  CLI     Studio      MCP      llms.txt
   ↓         ↓         ↓          ↓
Project   Browser   AI Agents   Discovery
```

## Key Principle
**Registry is source of truth.** CLI always queries registry. Local `.rafters/` is cache/storage only.

## Apps

### API (apps/api)
- **Hono** + `@hono/zod-openapi` for OpenAPI-first routes
- **Scalar** for API reference at `/reference`
- **D1** for color cache (exact OKLCH lookups)
- **Vectorize** for semantic search
- **Workers AI** for color intelligence generation

Routes structure:
```
src/routes/{feature}/
├── {feature}.index.ts    # Router
├── {feature}.routes.ts   # OpenAPI route definitions
└── {feature}.handlers.ts # Handler implementations
```

### CLI (apps/cli)
Like shadcn CLI but multi-framework with intelligence:
```bash
npx rafters init       # Setup, detect framework
npx rafters add button # Fetch from registry, copy to project
npx rafters tokens     # Export tokens
npx rafters studio     # Launch customization UI
npx rafters mcp        # Start MCP server for AI agents
```

### Website (apps/website)
- **Astro** for static site generation
- **MDX** for documentation
- **Custom Shadow DOM preview system** - Replaces Storybook (~500 lines)

## Packages

### @rafters/shared
Consolidated types shared across all packages.

### @rafters/color-utils
OKLCH color intelligence:
- `generateOKLCHScale()` - 50-950 scales with contrast-based lightness
- `generateAccessibilityMetadata()` - Pre-computed WCAG pairs
- `generateHarmony()` - 11 harmonic relationships
- `calculateAtmosphericWeight()` - Depth perception
- `calculatePerceptualWeight()` - Visual heaviness (0-1)

### @rafters/math-utils
Mathematical foundations:
- `generateProgression()` - Musical ratios (minor-third, major-third, perfect-fourth)
- `generateModularScale()` - Typography scales
- `generateFibonacciLike()` - Custom ratio sequences
- Unit-aware CSS operations

### @rafters/design-tokens
Token engine with dependency graph:
- **TokenRegistry** - O(1) storage with dependency tracking
- **5 Rule Types:** calc(), state:hover, scale:600, contrast:auto, invert
- **Dependency Engine** - Topological sort, cycle detection
- **Event System** - Real-time change notifications

### @rafters/ui
React components with cognitive metadata:
- **Primitives** (vanilla TS, SSR-safe): slot, modal, keyboard, escape-handler, aria, sr-manager, focus
- **Components**: Badge, Button, Card, Dialog, Input, Label, Select, Slider, Toast, etc.
- Each component includes cognitive load ratings and accessibility requirements

## Token Format (Rafters Native JSON)
```typescript
{
  "primary": {
    "value": "oklch(0.65 0.28 250)",
    "scale": [/* 11 steps: 50-950 */],
    "perceptualWeight": { "weight": 0.65, "density": "medium" },
    "atmosphericWeight": { "distanceWeight": 0.7, "temperature": "cool" },
    "harmonies": { "complementary": [...], "triadic": [...] },
    "accessibility": { "wcagAA": [...], "wcagAAA": [...] },
    "states": { "hover": "...", "focus": "...", "active": "...", "disabled": "..." },
    "override": {
      "from": "oklch(0.60 0.22 240)",
      "reason": "Brand requires higher saturation",
      "decidedBy": "designer@company.com"
    }
  }
}
```

## Cross-Worker Communication
Use **Service Bindings** for worker-to-worker calls:
```jsonc
// wrangler.jsonc
{ "services": [{ "binding": "UNCERTAINTY_API", "service": "api-realhandy" }] }
```

## Export Formats (Lossy)
```bash
rafters export --format dtcg      # W3C Design Tokens
rafters export --format css       # CSS custom properties
rafters export --format tailwind  # theme.extend config
```
These strip intelligence for tool interop - Rafters format has 10x more data.
