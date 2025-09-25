# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Primary Development Commands
```bash
# Start development across all apps/packages
pnpm dev

# Build entire monorepo
pnpm build

# Run complete test suite
pnpm test

# CRITICAL: Run before any commit (enforced by lefthook)
pnpm preflight

# Type checking across workspace
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm format
```

### Testing Commands
```bash
# Unit tests only
pnpm test:unit

# Integration tests only
pnpm test:integration

# Component tests (Playwright)
pnpm test:component

# E2E tests
pnpm test:e2e

# Watch mode for development
pnpm test:watch

# With coverage reporting
pnpm test:coverage
```

### Package-Specific Commands
```bash
# Run command in specific package
pnpm --filter=@rafters/cli build
pnpm --filter=@rafters/design-tokens test
pnpm --filter=@rafters/ui test:component

# Test specific package
pnpm --filter=shared test
```

## Project Architecture

### Monorepo Structure
- **Apps**: 3 main applications (CLI, Website, API)
  - `apps/cli/` - AI-first design intelligence CLI with MCP server
  - `apps/website/` - Documentation and marketing site
  - `apps/api/` - Hono backend for design system services

- **Packages**: 3 core packages
  - `packages/design-tokens/` - Revolutionary dependency-aware design token system
  - `packages/ui/` - Rafters component library with cognitive load intelligence
  - `packages/shared/` - Consolidated utilities: OKLCH color manipulation, mathematical foundations, types and schemas

### Design Token System Architecture
The `@rafters/design-tokens` package implements a sophisticated dependency graph system:

- **Archive-Based Distribution**: Design systems distributed as ZIP archives (SQIDs)
- **Dependency Engine**: 5 rule types for automatic token transformations
  - `calc()` - Mathematical calculations
  - `state:hover` - Color state transformations
  - `scale:600` - Scale position extraction
  - `contrast:auto` - Automatic contrast generation
  - `invert` - Lightness inversion for dark mode
- **TokenRegistry**: Runtime intelligence engine managing 240+ tokens
- **ColorValue Objects**: AI-powered color analysis with complete OKLCH scales

### Tech Stack
- **Package Manager**: pnpm workspaces (NEVER use npm/npx)
- **TypeScript**: Strict configuration, no `any` types allowed
- **Testing**: Vitest + Playwright for comprehensive coverage
- **Linting**: Biome (enforces no explicit any, no emoji)
- **Build**: Turbo for monorepo orchestration
- **Pre-commit**: Lefthook enforces code quality

## Critical Rules

### ZERO TOLERANCE POLICIES
1. **ALWAYS run `pnpm preflight` before commits** - Build WILL fail otherwise
2. **NEVER use `npm` or `npx`** - Only pnpm in this workspace
3. **NO `any` types** - Biome config causes build failure
4. **NO emoji anywhere** - Code, comments, commits, documentation
5. **Use Zod for all external data** - Required for type safety
6. **NO `.then()` chains** - Use async/await only
7. **React 19 purity** - No impure functions in components

### Development Workflow
1. Make changes
2. Run tests: `pnpm test`
3. Run preflight: `pnpm preflight` (MANDATORY)
4. Commit changes
5. Lefthook automatically runs pre-commit checks

### Testing Requirements
- Unit tests: `src/component.test.ts`
- Integration tests: `test/component.spec.ts`
- E2E tests: `test/component.e2e.ts`
- Mock typing: Use `vi.mocked(func).mockReturnValue()`, never `as any`

## Monorepo Operations

### Working with Dependencies
```bash
# Add dependency to specific package
pnpm --filter=@rafters/ui add lucide-react

# Add dev dependency to root
pnpm add -D typescript

# Update all dependencies
pnpm update -r
```

### Building & Publishing
```bash
# Build specific package
pnpm --filter=@rafters/design-tokens build

# Version with changesets
pnpm changeset
pnpm version

# Publish (after build + preflight)
pnpm release
```

### Key Architecture Decisions

#### Design Token System
- Uses sophisticated dependency graphs with 5 transformation rule types
- 240+ tokens generated from mathematical relationships
- Archive-based distribution with SQID identifiers
- AI-powered color intelligence with OKLCH color space
- TokenRegistry manages runtime token relationships and transformations

#### CLI Architecture
- AI-first design intelligence with MCP server integration
- Component library with embedded cognitive load ratings
- Supports Next.js, Vite, Remix, CRA frameworks
- Always use `npx rafters` (no installation required)

#### Component System
- React 19 with strict purity requirements
- Cognitive load intelligence embedded in component metadata
- Tailwind v4 integration with CSS variables
- Playwright component testing as primary UI testing method

### Environment Requirements
- Node.js >= 22.0.0
- pnpm >= 10.0.0
- React >= 19.0.0
- TypeScript 5.9.2 (exact version)

## Common Tasks

### Running Single Tests
```bash
# Test specific file
pnpm --filter=design-tokens test dependencies.test.ts

# Test pattern
pnpm test --run "dependency graph"

# Component test specific file
pnpm --filter=ui test:component button.spec.ts
```

### Adding New Packages
1. Create package directory under `packages/` or `apps/`
2. Add to `pnpm-workspace.yaml` (should auto-discover)
3. Set up package.json with proper naming: `@rafters/package-name`
4. Add turbo configuration to `turbo.json`
5. Run `pnpm install` to link workspace dependencies

### Design Token Development
```bash
# Generate complete token system
pnpm --filter=design-tokens test default-system

# Test dependency graph
pnpm --filter=design-tokens test dependencies

# Test individual generators
pnpm --filter=design-tokens test generators
```

The architecture emphasizes intelligent automation, mathematical precision, and AI integration throughout the design system pipeline.