# MANDATORY REQUIREMENTS - READ FIRST

## NEVER USE EMOJIS - ABSOLUTE BAN:
**NO EMOJIS ANYWHERE - EVER**
- NO emojis in code, comments, documentation, commit messages, or GitHub issues
- NO visual symbols or decorative characters
- Use clear, descriptive text instead of visual decoration
- Emojis are uninformative and represent the exact problem this system solves
- Focus on semantic meaning through words, not visual symbols

## UI/UX WORK - MANDATORY SAMI CONSULTATION:
**BEFORE ANY UI/UX WORK - ALWAYS USE SAMI AGENT**
- Sami enforces systematic Rafters design intelligence consumption
- Prevents hardcoded values, ensures semantic token usage
- Validates component intelligence before implementation
- Acts as forcing function to apply embedded design reasoning

## BEFORE ANY CODE - RUN THIS COMMAND:
```bash
pnpm preflight
```

** NEVER commit if preflight fails**
** NEVER skip this step to "save time"**  
** NEVER expect CI to catch what you should fix locally**
** Preflight MUST pass before commit - NO EXCEPTIONS**

## CLOUDFLARE TESTING REQUIREMENTS - MANDATORY:
**ALL APPS RUN ON CLOUDFLARE - TEST ACCORDINGLY**

### Testing Infrastructure:
1. **Unit Tests** (`*.test.ts`): `pnpm test`
   - Use Vitest with Node environment for isolated unit testing
   - Mock external dependencies with `vi.mock()` and `vi.spyOn()`
   - Test individual functions in isolation
   - Pass API keys and config as parameters, not environment variables

2. **Integration Tests** (`*.spec.ts`): `pnpm test:integration`
   - Use `@cloudflare/vitest-pool-workers` for Cloudflare Workers runtime
   - Tests run inside actual Workers environment with Miniflare
   - Access to KV, R2, D1, and other Cloudflare bindings
   - Configure in `vitest.config.cloudflare.mts`:
   ```typescript
   export default defineWorkersConfig({
     test: {
       poolOptions: {
         workers: {
           wrangler: { configPath: './wrangler.jsonc' },
           bindings: {
             RAFTERS_INTEL: { type: 'kv' },
             CLAUDE_API_KEY: 'test-api-key',
           }
         }
       }
     }
   })
   ```

3. **E2E Tests** (`*.e2e.ts`): `pnpm test:e2e`
   - Use Playwright for full browser testing
   - Test complete user workflows

### Test File Organization:
```
apps/website/
├── src/                    # Source code
│   └── app/api/route.ts
└── test/                   # Mirror structure of src
    └── api/
        ├── route.test.ts   # Unit tests
        ├── route.spec.ts   # Integration tests (Cloudflare runtime)
        └── route.e2e.ts    # E2E tests (Playwright)
```

### Cloudflare Testing Patterns:
- Import from `cloudflare:test` for Workers test utilities
- Use `env` object for bindings, NOT `process.env`
- Mock Claude/external APIs at module level
- Each test runs in isolated KV namespace
- Tests have access to all Cloudflare APIs (KV, R2, D1, etc.)

## ACCESSIBILITY CONSULTATION - MANDATORY SALLY:
**BEFORE PREFLIGHT - ALWAYS CONSULT SALLY FOR ACCESSIBILITY REVIEW**
- Sally ensures WCAG AAA compliance and Section 508 requirements
- Validates keyboard navigation and screen reader support
- Reviews reduced motion and high contrast compatibility
- Required checkpoint before any code commitment

**IGNORING THESE REQUIREMENTS = REJECTED PR**

** NEVER USE FUCKING EMOJI FOR ANYTING **

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

**15 COMPONENTS NEED FORWARDREF → DIRECT REF MIGRATION**
## COMPONENT USAGE REQUIREMENTS - MANDATORY:

### 1. READ Component Intelligence BEFORE Using ANY Component
```tsx
/**
 * Dialog Intelligence: cognitiveLoad=7, trustLevel=critical
 * Use for: Account deletion, data loss, irreversible actions  
 * Requires: Progressive confirmation patterns, clear escape hatches
 * NEVER use for: Simple confirmations, low-stakes decisions
 */
```

### 2. ALWAYS Use Semantic Tokens - NEVER Arbitrary Values
```tsx
// CORRECT - Uses semantic meaning
<Button className="bg-primary text-primary-foreground">

// WRONG - Arbitrary color values  
<Button className="bg-blue-500 text-white">
```

### 3. FOLLOW JSDoc Intelligence Standards for New Components
**MANDATORY intelligence for every component:**
1. `@cognitive-load` - Mental effort rating (1-10 scale)
2. `@attention-economics` - Visual hierarchy and usage rules
3. `@trust-building` - Confidence patterns for different consequence levels
4. `@accessibility` - WCAG compliance and screen reader support
5. `@semantic-meaning` - Contextual usage and variant purposes
6. `@usage-patterns` - Clear DO/NEVER guidelines
7. `@design-guides` - Links to design reasoning documentation

### 4. RUN Tests Before Committing
```bash
pnpm test
```

** Broken components = Failed intelligence access for AI agents**

## CRITICAL DEVELOPMENT STANDARDS

### Code Quality Requirements - NON-NEGOTIABLE:
1. **Strict TypeScript** - NEVER use `any`, ALWAYS explicit return types
2. **Zod Everywhere** - ALL external data MUST be validated with Zod schemas
3. **TDD Required** - Write tests FIRST, then implementation
4. **Error Boundaries** - Structured error handling with recovery strategies
5. **No `.then()` Chaining** - ALWAYS use `await` for async operations
6. **No Array Index as Keys** - NEVER use array indices as React keys

### Lefthook Pre-commit Will BLOCK Commits Unless:
- `pnpm biome check` passes
- `pnpm vitest run` passes 
- All TypeScript compiles without errors
- No linting violations

## DESIGN INTELLIGENCE QUICK REFERENCE

**BEFORE implementing any interface, apply this framework:**

1. **Attention**: What deserves user focus? → Component `@attention-economics` annotations
2. **Cognition**: How much mental effort? → Component `@cognitive-load` ratings
3. **Space**: How does whitespace create hierarchy? → Token spacing relationships
4. **Typography**: How does text support information flow? → Typography token intelligence
5. **Enhancement**: What's core vs. enhanced? → Component accessibility patterns
6. **Trust**: What's the consequence level? → Component `@trust-building` patterns

---

# Claude AI Assistant Instructions for Rafters

## Human-AI Design Collaboration System

**Rafters is a design intelligence system for AI agents.** Components contain embedded human design reasoning that enables AI agents to make informed UX decisions and create exceptional user experiences.

**The Human-AI Design System Flow:**

**Humans Create Intent** → Use Rafters Studio to define design systems with embedded meaning, semantic tokens, and usage rules

**System Generates Intelligence** → Components and tokens carry human design reasoning in machine-readable formats

**AI Agents Access Intelligence** → Read component metadata, token semantics, and usage patterns to make informed UX decisions  

**End Users Benefit** → Get consistent, accessible, thoughtfully designed experiences

**Core Purpose**: Enable AI agents to understand and apply human design expertise systematically, creating better user experiences through embedded design intelligence rather than guesswork.

## How You Should Use Rafters

### **Read Component Intelligence Before Using**
Every component includes design reasoning you can access:

```tsx
/**
 * Dialog Intelligence: cognitiveLoad=7, trustLevel=critical
 * Use for: Account deletion, data loss, irreversible actions  
 * Requires: Progressive confirmation patterns, clear escape hatches
 * Never use for: Simple confirmations, low-stakes decisions
 */
```

### **Access Design Intelligence Through Components**
Read embedded intelligence from component JSDoc annotations:

- **Trust Building** - Read component `@trust-building` annotations for user confidence patterns
- **Attention Economics** - Read component `@attention-economics` for visual hierarchy guidance  
- **Cognitive Load** - Read component `@cognitive-load` ratings for mental complexity management
- **Accessibility** - Read component `@accessibility` annotations for WCAG compliance patterns
- **Usage Patterns** - Read component `@usage-patterns` for DO/NEVER guidelines
- **Semantic Meaning** - Read component `@semantic-meaning` for contextual usage rules

### **Make Informed UX Decisions**
Instead of guessing, read the embedded guidance:
- **Cognitive Load Ratings**: Choose components appropriate for user mental capacity
- **Trust Building Requirements**: Follow patterns that build user confidence  
- **Accessibility Intelligence**: Apply proper ARIA, contrast, and interaction patterns
- **Attention Economics**: Understand visual hierarchy and component priority
- **Spatial Relationships**: Use negative space to create hierarchy and breathing room
- **Information Architecture**: Apply typography intelligence for scannable content

### **Use Familiar Tailwind Classes with Intelligence**
Standard Tailwind syntax powered by semantic tokens:

```tsx
// You use familiar classes
<Button className="bg-primary text-primary-foreground">
  Primary Action  
</Button>

// But the tokens understand context:
// bg-primary = trust-building color, use for main actions, never destructive
// Components know their cognitive load and usage rules
```

### **Create Better User Experiences**  
Apply the embedded design knowledge to:
- Choose appropriate components for each user context
- Follow accessibility patterns automatically
- Build trust through systematic design consistency
- Reduce cognitive load through proper component combinations
- Create clear attention hierarchy and information flow
- Ensure progressive enhancement and universal access

## Testing Requirements with Vitest

**Component intelligence must function correctly for AI agent access:**

- **Components are AI guidance sources** - JSDoc intelligence must be accurate
- **Every component becomes a design resource** - ensuring embedded reasoning is accessible
- **Components must render without errors** - broken components prevent AI intelligence access
- **Intelligence annotations must be complete** - AI agents need comprehensive guidance

**Test commands:**
```bash
pnpm test              # Run all tests
pnpm vitest run        # CI test runner
```

## React 19 Hook Patterns - MANDATORY KNOWLEDGE:

### **useActionState for Forms** (replaces manual form state):
```tsx
// ✅ CORRECT - React 19 pattern
function ContactForm() {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    try {
      await submitForm(formData)
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  }, { success: false })
  
  return <form action={formAction}>...</form>
}
```

### **useOptimistic for Immediate UI Updates**:
```tsx
// ✅ CORRECT - Optimistic updates with auto-rollback
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (state, newTodo) => [...state, newTodo] // MUST be pure function
)

const addTodo = async (text) => {
  addOptimistic({ id: 'temp', text })
  try {
    const newTodo = await createTodo(text)
    setTodos(prev => [...prev, newTodo])
  } catch (error) {
    // Automatic rollback on failure!
  }
}
```

### **useTransition for Non-blocking Updates**:
```tsx
// ✅ CORRECT - Keep UI responsive during heavy work
const [isPending, startTransition] = useTransition()

const handleSearch = (query) => {
  setQuery(query) // Urgent: immediate
  
  startTransition(() => {
    // Non-urgent: can be interrupted for user input
    const results = heavySearchFunction(query)
    setResults(results)
  })
}
```

### **use() Hook for Promises and Context**:
```tsx
// ✅ CORRECT - Replaces useEffect for data fetching
function UserProfile({ userPromise }) {
  const user = use(userPromise) // Suspends until resolved
  return <div>{user.name}</div>
}

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <UserProfile userPromise={fetchUser(id)} />
</Suspense>
```

## ZOD + REACT 19 AUTO-FORM SYSTEM:

### **Schema-Driven Form Generation**:
```tsx
// Define schema once, get validation + types + UI
const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['user', 'admin'])
})

// Auto-generates form with validation
const UserForm = createFormFromSchema(UserSchema, async (data) => {
  return await api.createUser(data)
})

// Usage: <UserForm className="form" />
```

**FUTURE: This pattern will power Rafters+ Studio registry interface**

## COMPONENT MIGRATION CHECKLIST - MANDATORY:

### **Before Migrating Any Component to React 19:**
- [ ] **Purity Audit**: Remove all `Math.random()`, `Date.now()`, `console.log()` from render
- [ ] **Side Effect Check**: Move all side effects to `useEffect()`
- [ ] **Deterministic Functions**: Ensure same inputs always produce same outputs
- [ ] **forwardRef Removal**: Convert to direct `ref` prop pattern
- [ ] **Hook Updates**: Replace manual patterns with React 19 hooks where applicable
- [ ] **Intelligence Updates**: Ensure all JSDoc annotations include React 19 patterns
- [ ] **Test Verification**: Confirm component works with concurrent rendering

### **Priority Migration List (15 Components)**:
1. Button, Input, Select - Core form components (HIGH PRIORITY)
2. Dialog, Modal - Complex interaction patterns (HIGH PRIORITY)  
3. Tooltip, Popover - Overlay components (MEDIUM PRIORITY)
4. Badge, Card, Container - Layout components (LOW PRIORITY)

### **Post-Migration Requirements:**
- All components MUST pass `pnpm preflight`
- All components MUST render without errors
- All components MUST work with `useTransition` and `useOptimistic`  
- TypeScript interfaces MUST include proper `ref` prop types

## Component Intelligence Standards

### JSDoc Intelligence Requirements (MANDATORY)

**Every component MUST include comprehensive JSDoc intelligence:**

```jsx
/**
 * Interactive button component for user actions
 *
 * @registry-name button
 * @registry-version 0.1.0
 * @registry-status published
 *
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Primary variant commands highest attention - use sparingly
 * @trust-building Destructive actions require confirmation patterns
 * @accessibility WCAG AAA compliant with 44px minimum touch targets
 * @semantic-meaning primary=main actions, destructive=irreversible actions
 *
 * @usage-patterns
 * DO: Primary buttons for main user goals, maximum 1 per section
 * NEVER: Multiple primary buttons competing for attention
 *
 * @design-guides
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 */
```

### Trust-Building Intelligence Framework

Components implement **4 trust levels** that match user psychology:

- **Low Trust** - Routine actions, minimal friction, reversible
- **Medium Trust** - Moderate consequences, balanced caution  
- **High Trust** - Significant impact, deliberate friction
- **Critical Trust** - Permanent consequences, maximum friction

## Design Intelligence Integration

See [docs/DESIGN_INTELLIGENCE_PRIMER.md](./docs/DESIGN_INTELLIGENCE_PRIMER.md) for comprehensive design mastery training.

### Semantic-First Design Thinking
**Process: Intent → Meaning → Form → Implementation**

Never ask "What color should this be?"
Always ask "What should this color communicate?"

### Negative Space (Whitespace) Mastery
- **Guides Attention**: Empty space directs the eye to what matters
- **Creates Hierarchy**: More space = more importance  
- **Reduces Cognitive Load**: Breathing room helps users process information
- **Mathematical Approaches**: Golden ratio, Fibonacci sequences, modular scales

### OKLCH Color Space
- **Perceptually Uniform**: Equal numeric changes = equal visual changes
- **Predictable Lightness**: L=50 always looks like 50% lightness
- **Better Dark Modes**: Maintains color relationships across themes
- **Accessibility**: Easier to predict contrast ratios

## Key Principles for AI Agents

### **Read Before You Code**
Always check component intelligence before using any component:
- Cognitive load ratings help you choose appropriate components
- Trust building requirements guide UX patterns
- Accessibility intelligence ensures inclusive design
- Usage rules prevent common mistakes

### **Follow Embedded Patterns**
Components include systematic guidance:
- Destructive actions require confirmation patterns
- Primary buttons should be limited (attention economics)
- Loading states need proper UX feedback
- Error states require clear recovery paths

### **Use Semantic Tokens**
Prefer design system tokens over arbitrary values:
- `bg-primary` over `bg-blue-500` (carries semantic meaning)
- `text-destructive-foreground` over `text-red-800` (contextual intent)
- `space-md` over `p-4` (systematic spacing relationships)

This system enables you to create better user experiences by understanding the human design reasoning embedded in every component.

## Testing Recommendations

- **Prefer SpyOn over Mock in tests** - SpyOn provides more natural and transparent test behavior
- look for /llms.txt files for software, services, etc

# TECHNICAL INSIGHTS FROM DEVELOPMENT

## Critical Issues and Solutions

### KV Cache Issue with OpenNext
**Problem**: OpenNext doesn't provide Cloudflare KV bindings via `process.env` - KV operations silently fail
**Solution**: Migrate APIs requiring KV to Hono where KV works properly via `c.env.RAFTERS_INTEL`
**Impact**: Color intelligence API had to move from Next.js to dedicated Hono app

### Test Structure Architecture
**Pattern**: Mirror app structure in test directory
```
test/
├── app/           # E2E tests (.e2e.ts) - mirror src/app/
├── lib/           # Unit tests (.test.ts) 
├── integration/   # Integration tests (.spec.ts)
└── setup.ts
```
**Website Testing**: Requires three test types:
- Unit: `vitest run`  
- Integration: `vitest run --config vitest.config.cloudflare.mts`
- E2E: `playwright test`

### TypeScript Standards Enforcement
**Never use `any` types** - Biome will fail the build
**Proper patterns**:
```typescript
// Good: Proper typing
vi.mocked(mockFunction).mockReturnValue(...)
(mockInstance.method as Mock).mockResolvedValue(...)

// Good: Documented type assertion
// @ts-expect-error - accessing private property for testing
client.privateProperty = mockValue

// Bad: Any type
(client as any).privateProperty = mockValue
```

### Color Intelligence System
**Standard Colors**: 306 colors across Tailwind, Material, brands, semantic, accessibility, grayscale
**Spectrum Matrix**: 540 strategic OKLCH points (9L × 5C × 12H) for complete color space exploration
**Cost**: $0.54 for 306 standard colors using Claude 3.5 Haiku
**Strategy**: Encourage users to explore unique colors rather than preset palettes

### Test Preflight Commands
**Purpose**: Comprehensive testing for each package/app
**Implementation**: Added `test:preflight` to all packages
- Most packages: `vitest run`
- Website: `vitest run && vitest run --config vitest.config.cloudflare.mts && playwright test`
- Color-utils/shared: Removed `--passWithNoTests` to enforce real tests

### Biome Configuration Standards
**File naming**: Integration tests must use `.spec.ts` not `.test.ts`
**Import ordering**: Type imports first, then regular imports
**No missing newlines**: All files must end with newline

## Architecture Decisions

### Registry Strategy
**Decision**: Keep registry in Next.js at `/registry` (not `/api/registry`)  
**Reasoning**: Registry is 99% static content, changes infrequently
**API Separation**: Move dynamic APIs (color-intel) to Hono for proper KV access

### Color API Architecture
**Hono App**: Dedicated API at `apps/api/` for color intelligence
**KV Caching**: Works properly in Hono via `c.env.RAFTERS_INTEL`
**Testing**: Uses `@cloudflare/vitest-pool-workers` for Workers runtime testing

### Component Intelligence Strategy
**Embedded Reasoning**: Components carry design intelligence in JSDoc comments
**AI Training**: Storybook stories function as both documentation AND test cases
**Systematic Usage**: Semantic tokens over arbitrary values for AI decision-making

## Development Workflow Insights

### Session Pattern Recognition
1. **Discovery Phase**: 20+ minutes understanding what Rafters actually does
2. **Implementation Phase**: Building features with embedded intelligence
3. **Testing Phase**: Comprehensive test coverage across environments
4. **Integration Phase**: Ensuring all systems work together

### Common Pitfalls
- Assuming KV works in OpenNext (it doesn't)
- Using `any` types (breaks build)
- Wrong test file naming conventions
- Missing newlines (biome fails)
- Incomplete test coverage patterns

### Success Patterns  
- Always run `pnpm preflight` before commit
- Use proper TypeScript typing throughout
- Follow test structure mirroring app structure
- Separate concerns: static content (Next.js) vs dynamic APIs (Hono)