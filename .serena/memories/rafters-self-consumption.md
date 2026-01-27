# Rafters Self-Consumption Pattern

## Core Insight
Every layer of Rafters uses the layers below it. This is not accidental - it's the architecture.

## The Chain
1. **Design tokens** - Mathematical relationships, dependency graph, OKLCH color science
2. **Tailwind integration** - Tokens become Tailwind utilities via `@theme` block in CSS
3. **Studio** - Edits tokens, styled BY those tokens via Tailwind classes. Designer changes primary color, Studio UI reflects it instantly.
4. **rafters-docs** - Documentation generated FROM the tokens and component intelligence metadata. Not a side project - same self-consumption pattern.
5. **MCP tools** - AI agents query the same token/component/pattern data that everything else uses.

## How Tokens Become Tailwind
- `@theme { --color-primary: var(--rafters-color-primary); }` - Tailwind processes this ONCE, generates utility classes
- `:root { --rafters-color-primary: oklch(0.65 0.2 250); }` - Actual values in CSS custom properties
- `bg-primary` in any component resolves through: utility class -> @theme var ref -> :root value
- Change the :root value, everything using `bg-primary` updates. No rebuild.

## Studio Split-CSS for HMR
- `rafters.tailwind.css` (static) - @theme block with var() refs, processed once at startup
- `rafters.vars.css` (dynamic) - Pure :root CSS variables, Vite HMR target
- Production uses `rafters.css` - combined, no indirection needed

## Why This Matters
- Studio dogfoods automatically - not a feature to build, a constraint on how we build
- Every Studio component MUST use Tailwind token classes, never hardcoded values
- The designer experiences their own changes in real time through the tool itself
- Same mechanism in dev (Studio) and prod (apps) - just different CSS file splits
- rafters-docs uses the same tokens/intelligence - another consumer of the same system

## Key File
`packages/design-tokens/src/exporters/tailwind.ts`
- `registryToTailwind()` - production combined
- `registryToTailwindStatic()` - Studio static (@theme with var refs)
- `registryToVars()` - Studio dynamic (pure CSS vars for HMR)
- `generateThemeBlockWithVarRefs()` - the indirection layer that makes it all work
