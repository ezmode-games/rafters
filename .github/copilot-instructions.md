# Copilot Instructions for Rafters

This file provides GitHub Copilot with project-specific guidance for the Rafters design system monorepo.

## Critical Coding Standards - ZERO TOLERANCE

### 1. Package Manager
- **ONLY use `pnpm`** - Never `npm` or `npx`
- This is a pnpm workspace - mixing package managers breaks everything

### 2. No `any` Types
- **Build fails** if `any` types are used
- Use `unknown` and proper type validation with Zod
- Example: `function process(data: unknown): Result<ProcessedData>`

### 3. No Emoji Anywhere
- Code, comments, commit messages, documentation
- Use descriptive text only

### 4. Zod for All External Data
- **Always validate external data** with Zod schemas
- Example: `const data = DataSchema.parse(JSON.parse(response))`

### 5. No `.then()` Chains
- **Use async/await only**
- Example: `const response = await fetch('/api'); const data = await response.json();`

### 6. React 19 Purity
- No impure functions in components
- Use `useState(() => Math.random())` not `Math.random()` directly

### 7. No Console Logs for User Feedback
- Use proper UI components for feedback
- Example: `<Alert message="Action successful" type="success" />`

### 8. No Direct JSON Access for Tokens
- Always use `TokenRegistry` for design tokens
- Example: `const primaryColor = tokenRegistry.getToken('color.primary')`

### 9. Component Intelligence Metadata
- Every component must have JSDoc with cognitive load, attention economics, trust patterns
- Use camelCase tags: `@cognitiveLoad`, `@attentionEconomics`, `@trustBuilding`

### 10. No forEach Loops
- Use `map`, `filter`, `reduce` for functional programming. Use `for..of` for async iteration
- Example: `const squares = numbers.map(n => n * n)`


## Project Architecture

### Monorepo Structure
```
apps/
  cli/           - AI-first design intelligence CLI with MCP server
  website/       - Documentation and marketing site
  api/           - Hono backend for design system services

packages/
  design-tokens/ - Dependency-aware design token system
  ui/            - Component library with cognitive load intelligence
  shared/        - Shared math and color utilities and types
```

### Key Technologies
- **TypeScript**: Strict mode, exact version 5.9.2
- **React**: 19.0.0+ with strict purity requirements
- **Package Manager**: pnpm workspaces (NEVER npm/yarn)
- **Testing**: Vitest + Playwright
- **Linting**: Biome (enforces no `any`, no emoji)
- **Build**: Turbo for monorepo orchestration

## Design System Philosophy

### Intelligence-First Components
- Every component has embedded cognitive load ratings (0-10)
- Components include attention economics, trust patterns, accessibility
- JSDoc uses camelCase tags: `@cognitiveLoad`, `@attentionEconomics`, `@trustBuilding`

### Token System
- 240+ tokens generated from mathematical relationships
- Archive-based distribution (SQID system)
- Dependency graph with 5 transformation rule types
- Never access JSON files directly - always use TokenRegistry

## File Patterns

### Testing
```
src/component.ts
src/component.test.ts     # Unit tests
test/component.spec.ts    # Integration tests
test/component.e2e.ts     # E2E tests
```

### Import/Export
- Use explicit imports: `import { specific } from 'package'`
- Never use `export *` patterns
- Prefer named exports over default exports

### Error Handling
```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

## Common Commands

### Development
```bash
pnpm dev                    # Start all apps/packages
pnpm build                  # Build entire monorepo
pnpm test                   # Run complete test suite
pnpm preflight              # MANDATORY before commits
pnpm typecheck             # Type checking across workspace
```

### Package-Specific
```bash
pnpm --filter=@rafters/cli build
pnpm --filter=@rafters/design-tokens test
pnpm --filter=@rafters/ui test:component
```

## Design Intelligence Vocabulary

### Cognitive Load Scale (0-10)
- 0-2: Invisible/structural elements
- 3-5: Simple interactions with clear patterns
- 6-8: Complex interactions requiring attention
- 9-10: High-risk interactions needing maximum care

### Trust Levels
- **Low**: Routine actions, minimal friction
- **Medium**: Moderate consequences, balanced caution
- **High**: Significant impact, deliberate friction
- **Critical**: Permanent consequences, maximum safety

### Attention Economics
- **Primary**: Main user goals (max 1 per section)
- **Secondary**: Supporting actions, alternative paths
- **Tertiary**: Contextual/background information

## Component Development

### JSDoc Template (camelCase)
```typescript
/**
 * Component description
 *
 * @registryName component-name
 * @registryVersion 0.1.0
 * @registryStatus published
 * @registryPath components/ui/Component.tsx
 * @registryType registry:component
 *
 * @cognitiveLoad 3/10 - Description
 * @attentionEconomics Description
 * @trustBuilding Description
 * @accessibility WCAG AAA compliant
 * @semanticMeaning Description
 *
 * @usagePatterns
 * DO: Pattern description
 * NEVER: Anti-pattern description
 *
 * @designGuides
 * - Pattern Name: https://rafters.realhandy.tech/docs/foundation/pattern-name
 *
 * @dependencies package-name
 *
 * @example
 * ```tsx
 * // Example usage
 * <Component variant="primary">Content</Component>
 * ```
 */
```

### CSS and Styling
- Use semantic tokens: `bg-primary` not `bg-blue-500`
- Tailwind v4 with CSS variables
- Component props affect CSS classes based on intelligence

## What NOT to Do

- Use `npm` or `npx` commands (pnpm workspace only)
- Add `any` types (build will fail)
- Include emoji in any files
- Use console.log for user feedback
- Access token JSON files directly
- Create components without intelligence metadata
- Use .then() promise chains
- Create impure React components

## Specific to This Project

### MCP Integration
- CLI provides 7 tools for AI agent queries
- All component intelligence is queryable via MCP
- Registry serves as single source of truth

### Archive System
- Design systems distributed as ZIP archives (SQIDs)
- Default archive: shortcode '000000'
- Custom archives via Studio integration

### Real-time Updates
- Registry fires callbacks on token changes
- OSS: Local CSS file updates
- Rafters+: Queue-based distribution

## When in Doubt

1. Check existing patterns in similar files
2. Follow the JSDoc template exactly
3. Use Zod for all external data validation
4. Test with `pnpm preflight` before committing
5. Ensure React 19 purity requirements
6. Validate cognitive load and accessibility patterns

Remember: This is an AI-first design system. Every decision should serve both human developers and AI agents consuming the design intelligence.