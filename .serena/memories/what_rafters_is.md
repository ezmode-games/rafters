# What Rafters Actually Is

Read this first. Every time.

## The Problem

AI agents don't have taste. When they build UI, they guess at colors, spacing, hierarchy, and balance. The results look like AI made them - generic, inconsistent, wrong.

## The Solution

Rafters encodes design judgment into data structures AI can query. A designer's decades of experience - what works, what doesn't, when to break rules, why - becomes machine-readable.

## The Three Layers

| Layer | What | Where |
|-------|------|-------|
| **What** | Components | `packages/ui` - 55 components with JSDoc intelligence |
| **Where** | Design tokens | `packages/design-tokens` - TokenRegistry with dependency graph |
| **Why** | Designer's notes | JSDoc tags, MCP tools, do/never patterns |

## The Token System

Tokens aren't just values. Each token knows:
- What it is (`value`)
- Where it comes from (`dependsOn`, `generationRule`)
- Why it exists (`semanticMeaning`, `usagePatterns`)
- When to use it (`usageContext`, `appliesWhen`)
- When a human overrode the system and why (`userOverride` with reason, context, who, when)

Five generation rule types derive tokens automatically:
- `calc()` - Mathematical calculations
- `state:hover` - Color state transformations
- `scale:600` - Scale position extraction
- `contrast:auto` - Automatic contrast generation
- `invert` - Lightness inversion for dark mode

When a human overrides a computed value, the system preserves both:
- `computedValue` - What the rule would produce
- `value` - What the human chose
- `userOverride.reason` - Why they chose it

The AI can see: "system says X, human chose Y because Z."

## The MCP Tools

Three tools, progressive disclosure:

1. **rafters_vocabulary** - "What do I have?"
   - Color palettes, spacing scale, type scale
   - Component list with cognitive loads
   - Pattern names

2. **rafters_pattern** - "How do I implement this scenario?"
   - 10 patterns: destructive-action, form-validation, empty-state, etc.
   - Components to use, tokens to apply
   - Cognitive load, accessibility, trust patterns
   - Do/never guidance with examples

3. **rafters_component** - "Tell me everything about this component"
   - Cognitive load score
   - Attention economics
   - Accessibility requirements
   - Trust building patterns
   - Do/never guidance
   - Variants, sizes, dependencies

The AI never guesses. It queries the designer's decisions.

## The Philosophy

See `docs/DESIGN_PHILOSOPHY.md` for the full document. Three balanced perspectives:

- **Craft (Jobs/Ive/Rams)** - Deep simplicity, every detail intentional
- **Experimentation (Joshua Davis)** - Structured chaos, room for delight
- **Usability (Jakob Nielsen)** - Empirical validation via 10 heuristics

The founder worked with Joshua Davis on Praystation and Dreamless, at Frog and IDEO. Physical devices in the 90s. Rebrands of Sun and SGI. This isn't academic - it's encoded experience.

## What Rafters Is NOT

- Not a component library with nice docs
- Not shadcn with extra features
- Not a design system you configure

It's a protocol for transferring design judgment to machines.

## The Docs

Docs are secondary. They exist for the 20% of humans who want them. The real value:
- MCP tools for AI agents (primary interface)
- llms.txt generated from docs (AI training data)

The docs should follow Storybook conventions (sidebar, preview, props, examples) because that's what users expect. The differentiation is the content, not the structure.

## Key Files

- `packages/shared/src/types.ts` - Token schema with full intelligence fields
- `packages/shared/src/component-intelligence.ts` - JSDoc parsing
- `packages/design-tokens/src/registry.ts` - TokenRegistry with dependency tracking
- `packages/design-tokens/src/dependencies.ts` - Dependency graph
- `packages/design-tokens/src/generation-rules.ts` - Rule parser and executor
- `packages/cli/src/mcp/tools.ts` - The three MCP tools
- `docs/DESIGN_PHILOSOPHY.md` - Jobs/Ive, Davis, Nielsen balance

## Remember

The AI learns **what** to do, **because of how** it works, **and why** it matters.

Not how to make decisions. What to do because the decisions are already made.
