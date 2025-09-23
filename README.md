![logo](apps/website/public/logo.svg)

# Rafters: Design Intelligence Protocol for AI Agents

**Your designer encodes their taste. We turn it into data structures. AI agents build interfaces that don't suck.**

## The Real Problem with AI-Generated Interfaces

AI agents rush in and generate interfaces that look technically correct but feel completely wrong. Bad spacing. Poor hierarchy. Accessibility violations. No sense of rhythm or proportion. They pattern match on surface similarities without understanding the reasoning behind design decisions.

Traditional design systems made it worse. Components without reasoning. Zero guidance on when to use what. AI agents can't distinguish between appropriate and inappropriate usage contexts. More options, worse outcomes.

## The Insight: Encode Taste as Queryable Data

Stop trying to teach AI aesthetic judgment through prompts and documentation. That doesn't scale. Instead, encode human design intelligence directly into machine-readable data structures that AI agents can query in real-time.

Rafters is a design intelligence protocol. Every design decision—from your brand's specific blue to why buttons need 44px touch targets—gets encoded as queryable intelligence. When AI builds interfaces using Rafters, it doesn't guess. It reads the embedded reasoning and applies it systematically.

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

### 5. Registry System with llms.txt Discovery
Complete registry API that follows the llmstxt.org specification for AI agent discovery:

- **llms.txt endpoint** (`/llms.txt`) - Standard AI discovery endpoint providing complete system overview, component intelligence, and usage patterns
- **Registry APIs** - Structured JSON endpoints for real-time component and token intelligence
- **Component metadata** - Cognitive load, attention economics, trust patterns, accessibility requirements embedded in each component

AI agents discover Rafters through the standard llms.txt endpoint, then access structured intelligence through registry APIs.

### 6. MCP Server for Real-Time Queries
Model Context Protocol server enables AI agents to query design intelligence in real-time through specialized tools for token discovery, cognitive load calculation, accessibility validation, and component intelligence access. Direct API integration means agents don't read documentation—they query live intelligence.

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

### Custom Shadow DOM Component Preview System

Unlike traditional documentation tools like Storybook, Rafters showcases component intelligence through a custom preview system built in ~500 lines:

- **Shadow DOM isolation**: Perfect style encapsulation with zero conflicts
- **Intelligence metadata display**: Shows cognitive load, attention economics, and trust building patterns directly in the preview
- **Registry integration**: Automatically pulls component intelligence without manual story writing
- **Dynamic prop handling**: JSON-based prop manipulation with live updates
- **MDX seamless integration**: Works natively with documentation workflow
- **Purpose-built for intelligence**: Designed specifically for showcasing embedded design intelligence, not just visual appearance

This transforms component documentation from static visual demos into interactive design intelligence that shows AI agents exactly how each component affects user cognition and attention.

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

Discover Rafters through the standard llms.txt endpoint:
```
https://rafters.realhandy.tech/llms.txt
```

This provides complete system overview, component intelligence, and usage patterns following the llmstxt.org specification. Use the MCP server for real-time design token intelligence querying and component validation during implementation.

## The Rafters Difference

| Traditional Design Systems | Rafters |
|---------------------------|---------|
| Components without context | Components with embedded intelligence |
| Documentation for humans | Machine-readable design reasoning |
| Storybook for visual demos | Custom Shadow DOM preview with intelligence metadata |
| Manual accessibility checks | Automatic WCAG AAA validation |
| Guess at cognitive load | Calculated cognitive budgets with real-time validation |
| Hope AI uses it right | Enforce correct usage through queryable data structures |
| Design drift over time | Git-tracked design decisions with embedded reasoning |
| Static documentation | Interactive intelligence showcases |
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

For complete technical documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

Key concepts covered in detail:
- Custom Shadow DOM component preview system architecture (~500 lines replacing Storybook)
- Dependency graph resolution algorithm with topological sorting
- ColorValue intelligence object schema with AI-generated insights
- Cognitive load calculation methodology and budget enforcement
- MCP server protocol implementation with 7 specialized tools
- SQID archive format specification and distribution model
- llms.txt endpoint implementation following llmstxt.org standards
- Registry API architecture for structured component intelligence

## Why "Rafters"?

Rafters provide structural support in buildings—essential infrastructure that enables everything built above. Similarly, this design system provides foundational intelligence that supports AI interface generation without requiring explicit design knowledge.

## Philosophy

**Design intelligence as queryable data.** Stop hoping AI agents will learn good taste. Encode human design reasoning into machine-readable structures they can query systematically.

**Mathematical foundations with human overrides.** Start with mathematical relationships that can't be wrong, then layer on human design taste where math isn't sufficient.

**Real-time intelligence access.** AI agents don't read documentation—they query live intelligence through structured APIs and MCP protocols.

**Cognitive load as a first-class concern.** Every design decision explicitly accounts for human mental processing limits and attention economics.

## The Future of AI-Generated Interfaces

AI agents are generating millions of interfaces. Most are terrible because they lack design reasoning.

Rafters solves this by encoding your designer's expertise as queryable data structures. Your brand's personality becomes parameterized intelligence. Your users' cognitive limits get systematically respected.

This isn't about teaching AI good taste—it's about making human design intelligence accessible to AI systems that already understand data structures perfectly.

Welcome to design intelligence as a protocol.

## License

MIT

## Support

- [Documentation](https://rafters.realhandy.tech)
- [GitHub Issues](https://github.com/realhandy/rafters/issues)
- [Discord](https://discord.gg/rafters)

---

Built by designers and engineers who were tired of AI-generated interfaces that looked like garbage.