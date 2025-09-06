# Rafters  
## Design System Built for AI Agents First

**Rafters embeds human design decisions directly into tokens and components so AI agents understand design intent instead of pattern-matching from examples.**

---

## The Problem

AI agents are terrible at design because they guess from visual patterns without understanding **why** design decisions were made. They see red buttons and assume "red = danger" without understanding trust patterns, cognitive load, or appropriate usage context.

**Rafters solves this by embedding human design reasoning directly into the design system.**

---

## How Rafters Works

### 1. **Tokens with Embedded Human Decisions**
Every design token carries the human reasoning behind the design choice:

```typescript
{
  name: 'destructive',
  value: 'oklch(0.4 0.15 20)',
  category: 'color',
  
  // Human Design Decisions (embedded by designers)
  trustLevel: 'critical',        // → Requires confirmation patterns
  cognitiveLoad: 7,             // → High mental effort required
  usageContext: ['delete', 'destroy', 'account-deletion'],
  
  // Optional AI Enhancement (one-time enrichment when token created)
  colorIntelligence: {
    semanticMeaning: 'Destructive actions - permanent consequences',
    psychologicalImpact: 'High urgency, requires confirmation',
    accessibility: {
      onWhite: { wcagAA: true, wcagAAA: false, contrastRatio: 4.8 }
    }
  }
}
```

### 2. **Components with Design Intelligence** 
Components include embedded reasoning for AI agents through JSDoc comments:

```tsx
/**
 * @trustLevel critical - Destructive actions require confirmation patterns
 * @cognitiveLoad 7/10 - High-stakes decision needs careful consideration  
 * @usageContext ["delete", "destroy", "account-closure"]
 * @requiredPattern confirmation-dialog - Must be paired with confirmation UX
 */
<Button variant="destructive">Delete Account</Button>
```

### 3. **MCP Server for AI Agent Access** 
AI agents query embedded design decisions through 7 tools:

```typescript
// Query embedded human decisions
mcp.get_color_intelligence('destructive')
// Returns: Human-defined trust level, cognitive load, usage context + optional AI analysis

mcp.get_colors_by_trust_level('critical') 
// Returns: All colors marked by humans as requiring confirmation patterns

mcp.calculate_cognitive_load(['Dialog', 'Button-destructive', 'Form'])
// Returns: Sum of human-defined cognitive load values (15-point budget)
```

### 4. **TokenRegistry for Systematic Management**
Centralized registry manages tokens with embedded human decisions:

```typescript
const registry = new TokenRegistry();

// Set tokens with human design decisions
registry.set('destructive', 'oklch(0.4 0.15 20)', {
  trustLevel: 'critical',      // Human decision
  cognitiveLoad: 7,           // Human assessment
  usageContext: ['delete']    // Human-defined appropriate usage
});

// Optional AI enrichment (one-time, when token created)
await registry.enrichColorToken('destructive');
```
- **Touch Targets**: WCAG AAA compliance with motor impairment support
- **+13 more specialized generators**

### 4. **Studio for Human Taste & Override** *(Coming Soon)*
Visual interface where humans add aesthetic judgment and behavioral preferences:

- **Override mathematical defaults** with brand-specific choices
- **Define trust behaviors** for destructive actions
- **Set cognitive load budgets** for interface complexity
- **Customize accessibility levels** beyond WCAG minimums  
- **Export intelligence** to JSON files for AI consumption

---

## Architecture

Rafters embeds human design decisions into a structured system accessible by AI agents:

### Human-Decision Embedding (Core Principle)
Designers embed their reasoning directly into tokens and components:

```typescript
// TokenRegistry stores human decisions with optional AI enhancement
const registry = new TokenRegistry();

// Human decisions embedded in token metadata
registry.set('destructive', 'oklch(0.4 0.15 20)', {
  category: 'color',
  trustLevel: 'critical',           // Human decision: requires confirmation
  cognitiveLoad: 7,                // Human assessment: high mental effort
  usageContext: ['delete', 'destroy'], // Human-defined appropriate usage
  
  // Optional one-time AI enrichment (when token created)
  colorIntelligence: {
    semanticMeaning: 'Destructive actions - permanent consequences',
    accessibility: { /* WCAG compliance data */ }
  }
});
```
  
  // AI-generated color intelligence
  colorIntelligence: {
    semanticMeaning: 'Destructive actions - permanent consequences',
});
```

### MCP Server (AI Agent Access)
AI agents access embedded human decisions through 7 design intelligence tools:

```typescript
// Query human design decisions
mcp.get_color_intelligence('destructive')
// Returns: Human-defined trust level, usage context + optional AI analysis

mcp.get_colors_by_trust_level('critical') 
// Returns: All colors marked by humans as requiring confirmation patterns

mcp.calculate_cognitive_load(['Dialog', 'Button-destructive'])
// Returns: Sum of human-defined cognitive load assessments
```

### Component Integration
Components consume tokens with embedded human design reasoning:

```tsx
/**
 * AI agents read embedded human decisions through JSDoc metadata
 * @trustLevel critical - Human decision: destructive actions need confirmation
 * @cognitiveLoad 7/10 - Human assessment: high mental effort required
 * @requiredPattern confirmation-dialog - Human-defined UX requirement
 */
<Button variant="destructive">Delete Account</Button>
```
const dependencies = registry.getDependencies('primary');

// Automatic dependency resolution prevents circular references
registry.wouldCreateCircularDependency('primary', ['primary-hover']); // false
```
```

### MCP Integration Layer  
AI agents query token intelligence through Model Context Protocol server:

- **Token Intelligence**: `mcp.get_color_intelligence('destructive')`  
- **Dependency Resolution**: `mcp.get_token_dependencies('primary')`
- **Cognitive Load Analysis**: `mcp.calculate_cognitive_load(['Dialog', 'Form'])`
- **Color Validation**: `mcp.validate_color_combination(['primary', 'destructive'])`
- **Trust Level Queries**: `mcp.get_colors_by_trust_level('critical')`
- **Component Metadata**: `mcp.get_component_metadata('Button')`
- **Design Recommendations**: `mcp.recommend_design_improvements(componentList)`

The MCP server runs on port 3001 and provides 7 design intelligence tools for AI agents.

### Component Integration
Components consume semantic tokens with embedded reasoning:

```tsx
/**
 * AI agents read this JSDoc intelligence for usage patterns
 * @cognitive-load 7/10 - Destructive actions require confirmation
 * @trust-building Critical consequences demand progressive confirmation  
 * @dependencies destructive, destructive-foreground, destructive-hover
 */
<Button variant="destructive">Delete Account</Button>
```

---

## Getting Started

### Installation
```bash
npx rafters init
```

This creates the TokenRegistry-based design intelligence foundation:
- TokenRegistry for centralized token management with AI intelligence
- MCP server integration for AI agent access (runs on port 3001)
- Component templates with embedded JSDoc intelligence  
- Tailwind CSS v4+ configuration with systematic tokens

### Start MCP Server
```bash
npx rafters mcp
```

Launches the Model Context Protocol server that provides 7 design intelligence tools:
- Color intelligence analysis
- Cognitive load calculation  
- Token dependency resolution
- Design validation and recommendations

### Add Components  
```bash
npx rafters add button
npx rafters add dialog  
npx rafters add form
```

Components install as **source code** with full design intelligence, not as dependencies.

### Token Management
Token management happens through the **TokenRegistry class** with automatic AI enrichment:

```typescript
// TokenRegistry manages all token operations
const registry = new TokenRegistry();

// Set tokens with automatic dependency detection and AI enrichment
registry.set('primary', 'oklch(0.6 0.15 240)', { category: 'color' });

// Color intelligence automatically added via API integration
await registry.enrichColorToken('primary');

// Dependencies tracked automatically
registry.addDependency('primary-hover', ['primary'], 'state:hover');
```

The CLI focuses on component installation and MCP server management, not direct token manipulation.

```typescript
// TokenRegistry automatically enriches tokens with AI intelligence
const registry = new TokenRegistry();

// Mathematical generators work through the registry
registry.addToken({ name: 'primary', value: 'oklch(0.6 0.15 240)', category: 'color' });
// → Automatically calls Color Intelligence API
// → Adds trust levels, cognitive load, accessibility data
// → Stores enriched token in .rafters/tokens/color.json

// Dependency management through the registry
registry.addDependency('primary-hover', ['primary'], 'state:hover');
// → Creates mathematical relationship
// → Updates JSON storage with dependency graph
// → Enables automatic regeneration
```

The CLI focuses on component installation with embedded intelligence, while the TokenRegistry handles all token operations.

---

## Why This Transforms AI Agents

### From Pattern Matching to Understanding Human Intent

**Before Rafters (Pattern Matching):**
```tsx
// AI guesses based on visual patterns
<Button className="bg-red-500 text-white">Delete</Button>
// Result: Arbitrary red choice, no understanding of consequences
```

**After Rafters (Embedded Human Decisions):**
```tsx
// AI reads human design decisions via MCP server
const token = mcp.get_color_intelligence('destructive')
// Returns: Human-defined trustLevel='critical', cognitiveLoad=7

if (token.trustLevel === 'critical') {
  // AI follows human-embedded requirement for confirmation
  return <AlertDialog>Are you sure?</AlertDialog>
}

<Button variant="destructive">Delete Account</Button>
// Result: Human design intent preserved, proper confirmation flow
```

### MCP Query Examples
AI agents understand **embedded human reasoning**:

```typescript
// Access human design decisions
mcp.get_color_intelligence('destructive')
→ Returns: Human-defined trust level, usage context + optional AI enhancement

// Find colors requiring human-defined confirmation patterns
mcp.get_colors_by_trust_level('critical')
→ Returns: All colors marked by humans as needing confirmation UX

// Calculate cognitive load from human assessments
mcp.calculate_cognitive_load(['Dialog', 'Form', 'Button-destructive'])  
→ Returns: Sum of human-defined cognitive load values

// Access human-defined token relationships
mcp.get_token_dependencies('primary')
→ Returns: Dependencies defined by humans for systematic updates
```

---

## Packages

- **[@rafters/cli](./apps/cli)** - Component installation and MCP server with design intelligence tools
- **[@rafters/ui](./packages/ui)** - Components with embedded design intelligence
- **[@rafters/design-tokens](./packages/design-tokens)** - TokenRegistry class and dependency management system
- **[@rafters/color-utils](./packages/color-utils)** - Color theory and accessibility calculations
- **[@rafters/studio](./packages/studio)** - Visual design intelligence capture *(Coming Soon)*
- **[@rafters/shared](./packages/shared)** - Core types and validation

---

## Applications

- **[Website](./apps/website)** - Documentation and component showcase
- **[API](./apps/api)** - Color intelligence generation and token services

---

## Documentation

### Core Concepts
- **[Rafters Vision](./docs/RAFTERS_VISION.md)** - The philosophy and approach
- **[Architecture](./docs/ARCHITECTURE.md)** - Technical implementation and dual registry system
- **[Design Intelligence Primer](./docs/DESIGN_INTELLIGENCE_PRIMER.md)** - Understanding mathematical design foundations

### Implementation
- **[Component JSDoc Template](./docs/COMPONENT_JSDOC_TEMPLATE.md)** - Standards for embedding intelligence
- **[Color System](./docs/COLOR_SYSTEM.md)** - OKLCH, accessibility, and color theory
- **[Coding Standards](./docs/CODING_STANDARDS.md)** - Development practices and requirements

### Future
- **[Rafters Studio Plus](./docs/RAFTERS_STUDIO_PLUS.md)** - Advanced visual design intelligence platform
- **[MCP Dream List](./docs/MCP_DREAM_LIST.md)** - AI agent integration roadmap

---

## The Vision

**Rafters transforms AI agents from pattern-matching systems into systems that understand and preserve human design intent.**

Instead of guessing from visual patterns, AI agents access embedded human design decisions directly. Designers encode their reasoning - trust patterns, cognitive load assessments, usage contexts - into tokens and components. AI agents read and apply this human intelligence systematically.

**Core principle**: Every design decision should embed the human reasoning behind it, making that reasoning accessible to AI agents through structured queries, not pattern matching.

The result: AI that preserves and applies human design intent consistently, creating interfaces that reflect deliberate human design decisions rather than algorithmic guesses.

---

## Contributing

See [CLAUDE.md](./CLAUDE.md) for development practices and requirements.

## License

MIT