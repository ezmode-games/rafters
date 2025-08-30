# Rafters

**AI-First Design Intelligence System for Systematic UI Generation**

Rafters is a design system that embeds human design reasoning directly into components, enabling AI agents to make informed UX decisions and create exceptional user experiences without guesswork.

## What is Rafters?

Rafters solves a fundamental problem: AI agents can generate UI components, but they lack the design reasoning to know *when* and *how* to use them appropriately. Traditional design systems provide components without the embedded intelligence about their proper usage.

Rafters changes this by embedding design intelligence directly into components:

- **Trust Building**: Components know when to add friction for high-consequence actions
- **Cognitive Load Management**: Components understand their mental complexity and appropriate contexts
- **Attention Economics**: Components know their place in visual hierarchy
- **Accessibility Intelligence**: Components have built-in WCAG AAA compliance patterns
- **Semantic Tokens**: Colors, spacing, and typography carry meaning, not just aesthetics

## Human-AI Design Collaboration Flow

```
Humans Define Intent → System Generates Intelligence → AI Agents Access Intelligence → Users Get Better UX
```

1. **Humans Create Intent**: Use Rafters Studio to define design systems with embedded meaning
2. **System Generates Intelligence**: Components and tokens carry human design reasoning in machine-readable formats
3. **AI Agents Access Intelligence**: Read component metadata and usage patterns to make informed decisions
4. **End Users Benefit**: Get consistent, accessible, thoughtfully designed experiences

## Core Principles

### Design Intelligence Over Visual Style
Instead of asking "What color should this be?", Rafters asks "What should this color communicate?"

### Systematic Decision Making
AI agents read embedded design reasoning rather than guessing:
```tsx
/**
 * Dialog Intelligence: cognitiveLoad=7, trustLevel=critical
 * Use for: Account deletion, data loss, irreversible actions
 * Requires: Progressive confirmation patterns, clear escape hatches
 */
```

### Accessibility by Design
Every component includes WCAG AAA compliance patterns and screen reader intelligence.

## Architecture

```
apps/
├── cli/           # rafters CLI for component installation
├── api/           # Color intelligence API (Hono on Cloudflare Workers)
└── website/       # Component registry and documentation

packages/
├── ui/            # React components with embedded design intelligence
├── design-tokens/ # Semantic tokens with OKLCH color space
├── color-utils/   # Color accessibility and harmony calculations
├── shared/        # Types and schemas
└── studio/        # Design palette generator (future Rafters+ Studio)
```

## Key Features

### 🎨 OKLCH Color Intelligence
- Perceptually uniform color space for predictable design systems
- AI-powered color analysis using Claude 3.5 Haiku
- 306 standard colors + 540-point spectrum matrix for exploration
- Automatic accessibility compliance checking

### 🧠 Embedded Design Reasoning
- Components carry cognitive load ratings (1-10 scale)
- Trust building patterns for different consequence levels
- Usage context guidelines and anti-patterns
- Progressive disclosure and attention management

### ♿ Accessibility First
- WCAG AAA compliance built into every component
- Keyboard navigation and screen reader support
- Color contrast validation and high contrast mode
- Focus management and ARIA properties

### 🤖 AI Agent Friendly
- Machine-readable component intelligence
- Semantic token meanings for systematic color choices
- Usage rules and context-appropriate component selection
- Design pattern guidance for consistent UX

## Quick Start

### Install the CLI
```bash
npm install -g rafters
```

### Initialize in your project
```bash
rafters init
```

### Add components
```bash
rafters add button
rafters add dialog
```

### Use with intelligence
```tsx
import { Button, Dialog } from '@/components/ui'

// AI agents can read the embedded intelligence:
// Button: cognitiveLoad=3, attention=primary (use sparingly)
// Dialog: trustLevel=critical (requires confirmation patterns)

<Dialog>
  <Button variant="destructive">Delete Account</Button>
</Dialog>
```

## Development

### Prerequisites
- Node.js 20+
- pnpm 9+

### Setup
```bash
pnpm install
pnpm build
```

### Testing
```bash
pnpm test:preflight  # Runs all tests across packages
```

### Development
```bash
pnpm dev  # Start all development servers
```

## Registry

Rafters provides a shadcn-compatible component registry at `https://rafters.realhandy.tech/registry`

Components include:
- Embedded design intelligence
- Storybook documentation with AI training scenarios
- Accessibility compliance demonstrations
- Usage context examples

## Color Intelligence API

The color intelligence API at `https://api.rafters.realhandy.tech/color-intel` provides AI-powered color analysis:

```json
{
  "reasoning": "Detailed color theory explanation",
  "emotionalImpact": "Psychological user response",
  "culturalContext": "Cross-cultural color associations",
  "accessibilityNotes": "WCAG compliance guidance",
  "usageGuidance": "When and how to use this color"
}
```

## Documentation

- [Design Intelligence Primer](./docs/DESIGN_INTELLIGENCE_PRIMER.md)
- [Component Architecture](./docs/ARCHITECTURE.md)
- [Color System](./docs/COLOR_SYSTEM_ARCHITECTURE.md)
- [CLI Usage](./apps/cli/README.md)

## Philosophy

Rafters believes that great design systems should encode human design expertise in ways that both humans and AI can understand. Instead of providing components without context, we provide components with embedded reasoning that enables systematic, intelligent UI generation.

The result: AI agents that can create thoughtful, accessible, and contextually appropriate user interfaces without requiring deep design knowledge.

## License

MIT