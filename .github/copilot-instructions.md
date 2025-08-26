# Copilot Implementation Instructions

## MANDATORY REQUIREMENTS - READ FIRST

### BEFORE ANY CODE - RUN THIS COMMAND:
```bash
pnpm preflight
```

**NEVER commit if preflight fails**
**NEVER skip this step to "save time"**  
**NEVER expect CI to catch what you should fix locally**
**Preflight MUST pass before commit - NO EXCEPTIONS**

## REACT 19 PURITY REQUIREMENTS - MANDATORY:

**ALL COMPONENTS MUST BE PURE - NO EXCEPTIONS**
- NO `Math.random()`, `Date.now()`, or `console.log()` in render
- NO side effects during component execution
- NO mutations of props or external state
- ALL functions must be deterministic (same inputs → same outputs)
- Use `useState(() => value)` for one-time random/time values
- Use `useEffect()` for ALL side effects
- React 19 concurrent rendering WILL BREAK impure components

### React 19 Pattern Requirements:
```tsx
// ✅ CORRECT - Direct ref prop (React 19)
function Button({ ref, children, onClick }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return <button ref={ref} onClick={onClick}>{children}</button>
}

// ❌ WRONG - forwardRef pattern (React 18)  
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />
})
```

## TYPESCRIPT REQUIREMENTS - MANDATORY:

**STRICT TYPESCRIPT - NO EXCEPTIONS**
- NEVER use `any` type - EVER
- NEVER use `unknown` without proper type guards
- ALWAYS use explicit return types for functions
- ALWAYS validate external data with Zod schemas
- NO array indices as React keys - use stable IDs
- NO `.then()` chaining - ALWAYS use `await`

## ITERATION REQUIREMENTS - MANDATORY:

**NEVER USE .forEach() - CI WILL FAIL**
- Use `for...of` loops instead of `.forEach()`
- Use `for...in` for object iteration
- Use `.map()`, `.filter()`, `.reduce()` for functional transforms
- forEach violates our linting rules and breaks CI

```typescript
// ✅ CORRECT
for (const item of items) {
  processItem(item);
}

// ❌ WRONG - Will fail CI
items.forEach(item => processItem(item));
```

## COMPONENT & STORY REQUIREMENTS:

### 3-File Story Architecture (MANDATORY for new components):
1. `ComponentName.mdx` - Overview Documentation
2. `ComponentName.stories.tsx` - Consolidated stories with all variants
3. `ComponentNameAccessibility.stories.tsx` - Accessibility compliance

### Component Usage Requirements:
- ALWAYS use semantic design tokens - NEVER arbitrary values
- Follow component intelligence specifications in issues
- Use existing component patterns for consistency
- Apply proper ARIA attributes and keyboard navigation
- NO React Context or Zustand unless explicitly specified in issue requirements
- Components should be self-contained with props-based API
- Focus on single responsibility - what the component does, not global state

```tsx
// ✅ CORRECT - Semantic tokens
<Button className="bg-primary text-primary-foreground">

// ❌ WRONG - Arbitrary values
<Button className="bg-blue-500 text-white">
```

## DEVELOPMENT WORKFLOW:

### 1. Package Management
- ALWAYS use `pnpm` - never npm, yarn, or other managers
- Use `pnpm install`, `pnpm add`, `pnpm test`, `pnpm build`

### 2. Testing
- Write tests FIRST (TDD required)
- Use `vitest run` to see results (not watch mode)
- All tests must pass before committing

### 3. Code Quality
- Run `pnpm preflight` before every commit
- Fix ALL biome check violations
- Fix ALL TypeScript errors
- Ensure ALL tests pass

### 4. Error Handling
- Use structured error handling with recovery strategies
- Validate all external data with Zod schemas
- Provide clear, actionable error messages

## DESIGN SYSTEM INTEGRATION:

### Token Usage:
- Use semantic tokens from design system
- Never hardcode colors, spacing, or typography values
- Follow token naming conventions (bg-primary, text-card-foreground)
- Respect component intelligence metadata when specified in issues

### Accessibility:
- Implement requirements specified in GitHub issues
- Follow WCAG AAA compliance standards
- Include proper ARIA attributes and roles
- Test keyboard navigation patterns

## SIMPLICITY PRINCIPLES:

**ALWAYS prioritize simplicity over sophistication:**
- Immediate Need Only - Never implement anything that doesn't solve an immediate, concrete problem
- Simplest Form - Choose the most basic implementation that works
- No "Nice to Have" - Ruthlessly cut features that aren't essential
- Prefer Built-ins - Use standard library functions over custom utilities
- Avoid Premature Abstraction - Don't create patterns until you have 3+ concrete use cases
- Speed to Market - Working functionality is better than perfect code that's not done

### Red Flags to Avoid:
- Multiple implementations of the same thing
- Complex error handling patterns for simple operations
- Generic/abstract classes with single implementations
- Utilities that wrap built-in functionality without clear benefit
- Network/async code for local file operations

## COLLABORATION:

### When in Doubt, Ask
- If unsure about any aspect of the task, ask for clarification
- Do not make assumptions about requirements or implementation details
- This is a partnership - collaboration is essential

### Issue Implementation
- Follow GitHub issue specifications exactly
- Implement ONLY what's specified in the issue
- Do not add features beyond the issue scope
- Mark issues complete when ALL acceptance criteria are met

## NEVER USE EMOJIS
- NEVER use emojis in any code, comments, documentation, or responses
- Use clear, descriptive text instead of visual symbols
- Focus on semantic meaning through words, not visual decoration
