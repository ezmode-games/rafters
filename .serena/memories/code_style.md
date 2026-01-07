# Code Style and Conventions

## TypeScript Configuration
- **Strict mode** - All strict checks enabled
- **ES2024 target** - Modern JavaScript features
- **No `any` types** - `noExplicitAny: error`
- **No implicit any in let** - `noImplicitAnyLet: error`
- **Unused variables/imports are errors**
- **Exhaustive switch cases required**
- **Explicit return types** - `noImplicitReturns: true`

## Biome Formatting
- **Indent:** 2 spaces
- **Line width:** 100 characters
- **Quotes:** Single quotes
- **Semicolons:** Always
- **Trailing commas:** All (except JSON)
- **Imports:** Auto-organized

## Biome Linting Rules
- `noExplicitAny: error`
- `noVar: error` - Use const/let
- `useConst: error` - Prefer const
- `noForEach: error` - Use for...of instead
- `noUnusedVariables: error`
- `noUnusedImports: error`
- `noNonNullAssertion: warn`
- `useExhaustiveDependencies: warn` - React hooks

## Naming Conventions
- **Files:** kebab-case (e.g., `color-utils.ts`, `token-registry.ts`)
- **Components:** PascalCase (e.g., `Button.tsx`, `TokenPreview.tsx`)
- **Functions/variables:** camelCase
- **Types/Interfaces:** PascalCase
- **Constants:** UPPER_SNAKE_CASE for true constants

## Component Standards
- Must include **cognitive load metadata**
- Must define **dependencies explicitly**
- Must include **accessibility requirements**
- Shadow DOM for component isolation

## No Emojis
Professional codebase - no emojis in code, comments, or commit messages.

## Testing Standards
- Minimum 80% coverage target
- Unit tests in `*.test.ts` files
- Component tests use Playwright
- E2E tests use Playwright

## Project-Specific Patterns

### Token Definitions
Tokens contain full intelligence with embedded decisions:
- Perceptual weight, atmospheric weight
- Harmonies, accessibility metadata
- States (hover, focus, active, disabled)
- Override reasons when designer changes values

### 5 Dependency Rule Types
```typescript
'state:hover(primary)'      // State transformations
'scale:600(spacing)'        // Scale extractions  
'contrast:auto(primary)'    // Automatic contrast
'invert(primary)'           // Dark mode inversion
'calc(spacing.md * 1.5)'    // Mathematical calculations
```

### React Components
- Use primitives from `packages/ui/src/primitives`
- Vanilla TypeScript base, framework-agnostic
- SSR-safe implementations
