# Design Token System Architecture

## Overview

The Rafters Design Token System uses a classic wagon wheel (hub-and-spoke) architecture from 1982, proven over decades for its simplicity, maintainability, and extensibility. All token operations flow through a central TokenRegistry hub, with adapters as spokes that never communicate directly with each other.

## Wagon Wheel Architecture

```
           Studio UI
               |
         MCP ──┼── Storage
            \  |  /
              HUB
          (TokenRegistry)
            /  |  \
    Exporters──┼── Future
               |
           Validators
```

### The Hub: TokenRegistry
- **Single source of truth** for all token operations at runtime
- **All business logic** lives here (validation, enrichment, dependencies)
- **In-memory storage** of ~500 tokens for instant access
- **Automatic cascade updates** when base tokens change
- **No spoke knows about other spokes** - complete isolation

### The Spokes: Adapters
- **Studio UI**: Visual token editing interface for humans
- **Storage**: JSON file persistence (dumb storage, no logic)
- **Exporters**: CSS/Tailwind generation from Registry data
- **MCP Tools**: AI agent access to token intelligence
- **Future**: Any new integration (versioning, sync, etc.)

### Why This Architecture Works
- **Add new spokes** without touching existing ones
- **Change storage format** without affecting other systems
- **Test each spoke** in complete isolation
- **Scale linearly** - complexity doesn't compound
- **40+ years proven** - same pattern as dBase/FoxPro systems

## Two-Tier Cache System

### Tier 1: Static Color Cache
**Pre-computed intelligence for instant access**

```typescript
// packages/design-tokens/static-color-cache.json
{
  "oklch-60-12-240": {
    "name": "midnight-horizon",
    "scale": [...],        // 11-step OKLCH scale
    "intelligence": {...}, // AI-enhanced understanding
    "accessibility": {...}, // Pre-computed contrast matrices
    "harmonies": {...}     // Mathematical relationships
  }
}
```

- **Ships with minimal set** - Grayscale system only
- **Grows organically** via API as colors are needed
- **Loaded into Registry** at startup if no project tokens exist
- **Never accessed directly** - only through Registry

### Tier 2: Project Token Files
**User customizations and overrides**

```
.rafters/tokens/
├── color.json          # Color tokens with user modifications
├── spacing.json        # Spacing scale
├── typography.json     # Type system
└── ... (18 categories)
```

- **Source of truth** for the project's design system
- **Managed by Registry** - all reads/writes go through hub
- **Version controlled** with the project
- **Human-editable** through Studio UI (never directly)

## TokenRegistry: The Central Hub

The TokenRegistry is the **only** way to interact with tokens at runtime. Think of it like an ORM for design tokens - you work with the Registry API, never with storage directly.

### Core Responsibilities
```typescript
class TokenRegistry {
  // Load all tokens at startup (~500 tokens, <100ms)
  async initialize(): Promise<void>

  // Get any token by name
  get(name: string): Token

  // Set token value (triggers cascade updates)
  set(name: string, value: TokenValue): void

  // Query tokens by category/properties
  query(filter: TokenFilter): Token[]

  // Automatic persistence to JSON
  private persist(): void
}
```

### Key Features
- **O(1) performance** for get/set operations
- **Automatic dependency cascades** via TokenDependencyGraph
- **Transparent persistence** - writes to JSON automatically
- **Rich querying** - filter by category, cognitive load, trust level
- **Intelligence enrichment** - integrates with Color Intelligence API

### What Registry Is NOT
- Not a database (just in-memory storage)
- Not accessible via CLI (no human needs)
- Not aware of rendering (that's the exporters' job)
- Not responsible for UI (that's Studio's job)

## TokenDependencyGraph: Cascade Intelligence

Tracks relationships between tokens to enable intelligent cascade updates.

```typescript
class TokenDependencyGraph {
  // Track that primary-hover depends on primary
  addDependency(
    tokenName: "primary-hover",
    dependsOn: ["primary"],
    rule: "darken(primary, 10%)"
  ): void

  // When primary changes, what needs updating?
  getDependents("primary"): string[]
  // Returns: ["primary-hover", "primary-focus", ...]

  // Regenerate all dependent tokens
  cascadeUpdate(tokenName: string): Token[]
}
```

### Dependency Examples
- **State variants**: `primary` → `primary-hover`, `primary-focus`
- **Semantic tokens**: `ocean-blue-500` → `primary`
- **Color families**: Base color → 11-step scale
- **Cross-references**: `destructive` → `error`, `danger`

### Performance Considerations
- **~2400 relationships** for 500 tokens (5:1 ratio)
- **Rebuilt on startup** from token analysis (<1 second)
- **Not persisted** - derived from token values
- **Topological sort** ensures correct update order

## Bootstrap Strategy

### Initial State: Minimal Grayscale
Ships with a single neutral grayscale system:
```typescript
// Generated mathematically, no API needed
const grayscale = generateSystemGrayscale(PRIMARY_TONE);
// Produces neutral-50 through neutral-950
```

### Growth: API-First Intelligence
When users need colors:
```
User picks color → API generates intelligence → Cache locally → Use forever
```

1. **User selects color** in Studio UI
2. **API generates** full ColorValue with intelligence (one-time, ~10s)
3. **Cache locally** in static-color-cache.json
4. **Registry loads** from cache on next startup
5. **Zero API calls** after initial generation

### Economics
- **Ship cost**: $0 (grayscale is mathematical)
- **Per-color cost**: ~$0.0001 (200 tokens with Haiku)
- **Project lifetime cost**: ~$0.01 (typical 20-30 custom colors)
- **Runtime cost**: $0 (everything cached locally)

## API-First Intelligence Generation

The Color Intelligence API is the brain that generates one-time intelligence for any color:

```typescript
// API generates complete intelligence
POST /api/color-intel
{
  "oklch": { "l": 0.6, "c": 0.12, "h": 240 }
}

// Returns rich ColorValue
{
  "name": "ocean-depth",
  "scale": [...],           // 11-step scale
  "intelligence": {...},    // AI understanding
  "harmonies": {...},      // Mathematical relationships
  "accessibility": {...}   // Contrast matrices
}
```

### Mathematical Foundation (Free)
- `generateOKLCHScale()` - Perceptually uniform scales
- `generateRaftersHarmony()` - UI-optimized color relationships
- `calculateAtmosphericWeight()` - Depth perception in UI
- `calculatePerceptualWeight()` - Visual hierarchy
- Pre-computed accessibility matrices

### AI Enhancement (Minimal)
Only for what math can't provide:
- Emotional associations (2-3 words)
- Cultural meanings (universal concerns)
- Critical warnings (if any)

## Storage Is Just Storage

### What JSON Files Are
- **Dumb persistence** - No logic, just data
- **Source of truth** - Canonical token values
- **Version controlled** - Part of the project
- **Implementation detail** - Users never know they exist

### What JSON Files Are NOT
- **Not an API** - Never accessed directly
- **Not intelligent** - Logic lives in Registry
- **Not aware of dependencies** - That's the graph's job
- **Not for humans** - Studio UI is the interface

### The Mental Model
Think of JSON like a database file:
```
1982: dBase III → C Program → User Interface
2025: JSON Files → TokenRegistry → Studio UI
```

You don't edit .dbf files directly, you don't edit token JSON directly.

## Data Flow Examples

### Example 1: Changing Primary Color
```
Studio UI: "Change primary to blue"
    ↓
TokenRegistry.set('primary', newBlue)
    ↓
TokenDependencyGraph.getDependents('primary')
    → ["primary-hover", "primary-focus", "button-primary", ...]
    ↓
Cascade updates using stored rules
    ↓
Persist all changes to JSON
    ↓
Exporters regenerate CSS
```

### Example 2: AI Agent Query
```
MCP Tool: "Find accessible colors for warnings"
    ↓
TokenRegistry.query({
  semanticMeaning: /warning/,
  accessibilityLevel: 'AAA'
})
    ↓
Returns matching tokens with full intelligence
```

### Example 3: Initial Setup
```
CLI: rafters init
    ↓
Generators create default tokens
    ↓
Write to .rafters/tokens/*.json
    ↓
TokenRegistry.initialize()
    ↓
Load JSON + Static Cache
    ↓
Ready for Studio/MCP/Exporters
```

## Future Considerations

### Tier 3: Vector Search (Future)
- Semantic search capabilities for AI agents
- "Find trustworthy blues" → Vector similarity search
- Indexed by intelligence text embeddings
- Complementary to Registry name-based lookup

### Versioning (Rafters+)
- Git for open source (current)
- Database + Git for Rafters+ (future)
- Rollback capabilities for cascade mistakes
- Team collaboration features

### Performance Optimizations
- Lazy loading for large design systems
- Incremental cascade updates
- Parallel export generation
- WebAssembly for mathematical functions

## Key Principles

1. **Registry is the hub** - All operations go through TokenRegistry
2. **Spokes don't talk** - Adapters never communicate directly
3. **Storage is dumb** - JSON has no logic, just data
4. **Intelligence is embedded** - Every token carries its reasoning
5. **Math first, AI second** - Generate mathematically, enhance minimally
6. **Cache locally** - Generate once, use forever
7. **Ship minimal** - Start with grayscale, grow as needed

## Summary

This architecture combines:
- **1982 wagon wheel pattern** - Proven hub-and-spoke design
- **Modern token intelligence** - AI-enhanced design reasoning
- **Mathematical generation** - Leonardo-inspired color science
- **API-first growth** - Generate intelligence as needed
- **Local-first performance** - Everything cached, instant access

The result: A design token system where AI agents can't exercise bad taste because the intelligence is embedded in every token, managed centrally by the Registry, and accessible to any adapter that needs it.