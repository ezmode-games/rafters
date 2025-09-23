![logo](apps/website/public/logo.svg)

# Rafters: Design Intelligence Protocol for AI Agents

**Your designer encodes their taste. We turn it into data structures. AI agents build interfaces that don't suck.**

## The Problem We Actually Solved

We tried everything to teach AI good design. Built scrapers that collected the top 15,000 websites. Fed massive vector databases to AI models. Documented every design principle we could think of. Wrote prompts explaining color theory, typography, layout, and accessibility.

AI agents didn't care.

They would rush in, pattern match on surface-level similarities, and generate interfaces that looked technically correct but felt completely wrong. Bad spacing. Poor hierarchy. Accessibility violations. No sense of rhythm or proportion. By the time anyone realized the AI had made a mess, it was too late.

Traditional design systems? They just made things worse. They provide components without reasoning. AI agents cannot distinguish between appropriate and inappropriate usage contexts. More options, zero guidance.

## The Insight: Stop Teaching, Start Embedding

We realized we were solving the wrong problem. Instead of trying to teach AI aesthetic judgment (which may never work), we decided to embed human design intelligence directly into the system itself.

Rafters is a design intelligence protocol. Every design decision—from your brand's specific blue to why buttons need 44px touch targets—gets encoded into machine-readable data structures. When AI builds interfaces using Rafters, it doesn't guess. It reads.

## How It Works

### 1. Mathematical Foundation
Everything starts with math. Not because we're nerds (though we are), but because mathematics is the only universal language both humans and machines understand perfectly.

- **Color Science**: OKLCH perceptual color model with 10-step scales following musical ratios
- **Spacing Systems**: Golden ratio progressions (8, 13, 21, 34, 55, 89px)
- **Typography Scales**: Perfect fourth (1.333) and augmented fourth (1.414) ratios
- **Grid Systems**: 12/16/24 column layouts with mathematical relationships

Default grayscale. Zero opinions. Pure math.

### 2. Design Intelligence Encoding
Here's where it gets interesting. Every UI component includes embedded metadata that captures human reasoning:

```typescript
/**
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Primary variant commands highest attention - use sparingly
 * @trust-building Destructive actions require confirmation patterns
 * @accessibility WCAG AAA compliant with 44px minimum touch targets
 */
```

**Cognitive Load Budget**: Every page gets 15 points max. A Container costs 0 points (invisible structure), a Button costs 3 points (simple action), a Dialog costs 6 points (interrupts flow). AI agents calculate total load before adding components.

**Attention Economics**: Components declare their attention cost. Primary buttons demand focus—maximum one per section. Secondary buttons support. Ghost buttons recede. AI agents understand visual hierarchy through data.

**Trust Patterns**: Critical actions need trust signals. Payment forms require security badges. Destructive actions need confirmation. Data collection needs transparency. Encoded directly into component metadata.

### 3. Token Registry & Dependency Graph
The brain of the system. A sophisticated dependency engine that manages relationships between 240+ design tokens:

```typescript
// Five dependency rule types that cascade automatically
primary-hover: "state:hover(primary)"      // State transformations
spacing-lg: "scale:600(spacing)"          // Scale extractions
text-on-primary: "contrast:auto(primary)" // Automatic contrast
dark-primary: "invert(primary)"           // Dark mode inversion
button-padding: "calc(spacing.md * 1.5)"  // Mathematical calculations
```

Change your brand's primary color? The entire system recalculates. Hover states, contrast ratios, dark mode variants—all update automatically through the dependency graph.

### 4. Studio: Where Taste Meets Data
Designers use our Studio to override mathematical defaults with brand personality. Pick a blue that "needs more pop"? Studio captures not just the color value but the reasoning:

```json
{
  "primary": {
    "value": "oklch(0.65 0.28 250)",
    "override": {
      "reason": "Brand requires higher saturation for digital presence",
      "impact": "Increases cognitive load by 0.5 points",
      "tradeoff": "Sacrifices some accessibility for brand recognition"
    }
  }
}
```

Every override gets tracked in Git. AI agents understand your exceptions.

### 5. MCP Server: Intelligence API for AI Agents
Model Context Protocol server with 7 specialized tools:

- `get_color_intelligence`: Complete color analysis with emotional impact, cultural context
- `get_component_intelligence`: Cognitive load, trust patterns, accessibility requirements
- `calculate_cognitive_load`: Total mental burden for component combinations
- `validate_color_combination`: Check if colors work together
- `get_accessible_colors`: Find WCAG-compliant color pairs
- `get_tokens_by_trust_level`: Filter components by reliability requirements
- `get_token_by_category`: Organized access to color, spacing, motion tokens

AI agents query the server in real-time. No documentation reading. Direct intelligence access.

### 6. AI Intelligence Generation
When mathematical rules aren't enough, we generate contextual intelligence using Claude:

```json
{
  "emotionalImpact": "Creates urgency without panic through warm red hue",
  "culturalContext": "Western: danger/importance, Eastern: prosperity/joy",
  "psychologicalEffect": "Increases arousal, speeds decision-making",
  "usageGuidance": "Reserve for critical actions, never decorative"
}
```

This intelligence gets cached and versioned. Your design system learns.

## Architecture That Actually Scales

```
rafters/
├── apps/
│   ├── cli/          # AI-first CLI with embedded MCP server
│   ├── api/          # Hono backend for intelligence generation
│   └── website/      # Documentation and Studio interface
├── packages/
│   ├── design-tokens/    # Dependency-aware token engine
│   ├── ui/              # Components with cognitive metadata
│   ├── color-utils/     # OKLCH color intelligence
│   ├── math-utils/      # Mathematical foundations
│   └── shared/          # Type definitions
└── .rafters/            # Your design intelligence (Git-tracked)
    ├── tokens/          # Token registry with dependencies
    ├── registry/        # Component intelligence cache
    └── config.json      # System configuration
```

**Distribution Model**: Design systems ship as ZIP archives (SQIDs - System Quality Intelligence Distributions). One file contains your entire design intelligence. Version controlled. Cryptographically signed.

## Component Library

Rafters includes 18+ production-ready components spanning the full interface spectrum:

**Basic Elements**: Badge, Chip
**Forms**: Input, Label, Select, Slider
**Layout**: Container, Grid, Sidebar
**Navigation**: Breadcrumb, Tabs
**Feedback**: Toast, Progress, Tooltip
**Overlays**: Dialog
**Interactive**: Button, Card
**Branding**: RaftersLogo

Each component includes embedded cognitive load metadata, accessibility requirements, and trust-building patterns. AI agents understand not just what each component does, but when and how to use it appropriately.

## Getting Started

```bash
# Initialize Rafters in your project
npx rafters init

# Add your first component
npx rafters add button

# Start the MCP server for AI agents
npx rafters mcp

# Launch Studio to add your brand
npx rafters studio
```

That's it. You now have a mathematically-sound, AI-readable design system with 18+ components that work immediately with grayscale defaults. Run Studio later to add your brand personality.

## For AI Agents

Connect to our MCP server:

```json
{
  "mcpServers": {
    "rafters": {
      "command": "npx",
      "args": ["rafters", "mcp"]
    }
  }
}
```

Query design intelligence:

```typescript
// Get color with full intelligence
await mcp.call('get_color_intelligence', { tokenName: 'primary' })

// Calculate cognitive load for a page
await mcp.call('calculate_cognitive_load', {
  components: ['Header', 'Button', 'Button', 'Form', 'Dialog']
})

// Find accessible color combinations
await mcp.call('get_accessible_colors', {
  background: 'surface',
  level: 'AAA'
})
```

## The Rafters Difference

| Traditional Design Systems | Rafters |
|---------------------------|---------|
| Components without context | Components with embedded intelligence |
| Documentation for humans | Machine-readable design reasoning |
| Manual accessibility checks | Automatic WCAG AAA validation |
| Guess at cognitive load | Calculated cognitive budgets |
| Hope AI uses it right | Enforce correct usage through data |
| Design drift over time | Git-tracked design decisions |
| "Just use shadcn/ui" | Actually solve the AI interface problem |

## Contributing

We're building the infrastructure for AI-generated interfaces that don't suck. Here's how to help:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/realhandy/rafters.git
cd rafters

# Install dependencies (MUST use pnpm)
pnpm install

# Run the full test suite
pnpm test

# Start development
pnpm dev
```

### Code Standards

- **TypeScript**: Strict mode, no `any` types
- **Testing**: Minimum 80% coverage
- **Components**: Must include cognitive load metadata
- **Tokens**: Must define dependencies explicitly
- **No Emojis**: Professional codebase

### Areas We Need Help

1. **Component Intelligence**: Add cognitive load ratings to more components
2. **Cultural Context**: Expand color meanings for non-Western cultures
3. **Accessibility**: Push beyond WCAG AAA where possible
4. **Mathematical Models**: Improve spacing and typography scales
5. **MCP Tools**: Add more intelligence queries for AI agents

### Testing

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# Component tests
pnpm test:component

# E2E tests
pnpm test:e2e

# Before committing (enforced by git hooks)
pnpm preflight
```

## Technical Deep Dive

For complete technical documentation, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

Key concepts:
- Dependency graph resolution algorithm
- ColorValue object schema
- Cognitive load calculation methodology
- MCP server protocol implementation
- SQID archive format specification

## Why "Rafters"?

Rafters provide structural support in buildings—essential infrastructure that enables everything built above. Similarly, this design system provides foundational intelligence that supports AI interface generation without requiring explicit design knowledge.

## Philosophy

**Default safety through mathematics.** Start with formulas that can't be wrong.

**Intelligence on demand through metadata.** Embed human reasoning where math isn't enough.

**Graceful degradation.** Even minimal implementations maintain baseline usability.

**Git tracks everything.** Your design decisions become part of your codebase.

## The Future

AI agents are about to generate millions of interfaces. Most will be terrible. Rafters is our attempt to fix that before it becomes everyone's problem.

We're not trying to teach AI good taste. We're encoding taste into data structures AI already understands.

Your designer's expertise, systematized. Your brand's personality, parameterized. Your users' cognitive limits, respected.

Welcome to design intelligence as a protocol.

## License

MIT

## Support

- [Documentation](https://rafters.realhandy.tech)
- [GitHub Issues](https://github.com/realhandy/rafters/issues)
- [Discord](https://discord.gg/rafters)

---

Built by designers and engineers who were tired of AI-generated interfaces that looked like garbage.