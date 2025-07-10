# Claude AI Assistant Instructions for Rafters

## Project Overview

Rafters is a React component library with **embedded design intelligence** built for AI development. We use a **shadcn-style approach** where components are installed as source code with three layers of intelligence:

1. **Component Comments** - Essential patterns in JSX comments
2. **Component Manifest** - Machine-readable intelligence data  
3. **Intelligence Stories** - Complete design education in Storybook

**Key Architecture**: Source code ownership, OKLCH color systems, accessibility-first design, and systematic constraints that prevent design violations.

## Critical Development Standards

### Code Quality Requirements

**You MUST follow these standards strictly:**

1. **Strict TypeScript** - Never use `any`, always explicit return types
2. **Zod Everywhere** - All external data validated with Zod schemas
3. **TDD Required** - Write tests first, then implementation
4. **Error Boundaries** - Structured error handling with recovery strategies
5. **No `.then()` Chaining** - Always use `await` for async operations

See [CODING_STANDARDS.md](./CODING_STANDARDS.md) for complete requirements.

### Testing Requirements with Vitest

**All Storybook stories are tested with Vitest** through `@storybook/addon-vitest`. This means:

- **Stories MUST be complete and functional** - they're not just documentation
- **Every story becomes a test case** automatically
- **Stories must render without errors** in browser environment
- **Interactive stories must work** with real event handlers

**Test commands:**
```bash
pnpm test              # Run all tests including stories
pnpm test-storybook    # Run story tests specifically  
pnpm vitest run        # CI test runner
```

**Story Testing Integration:**
```typescript
// Stories automatically become tests via Vitest addon
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    onClick: fn(), // REQUIRED for interactive components
  },
}
// This story runs as a test in browser environment
```

### Lefthook Pre-commit Constraints

**Lefthook will BLOCK commits unless these pass:**

1. **Biome Check** - `pnpm biome check` must pass
2. **Vitest Run** - `pnpm vitest run` must pass (includes story tests)

**Current lefthook.yml:**
```yaml
pre-commit:
  commands:
    biome:
      run: pnpm biome check --no-errors-on-unmatched --files-ignore-unknown=true --colors=off {staged_files}
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      stage_fixed: true
```

**This means:**
- All TypeScript must compile without errors
- All tests (including stories) must pass
- Code formatting must be consistent
- No linting violations allowed

## Storybook Standards

### Multi-File Story Architecture

**For complex components, use 5 dedicated story files:**

1. `ComponentName.stories.tsx` - Main story with core variants
2. `ComponentNameVariants.stories.tsx` - Visual styling variants
3. `ComponentNameProperties.stories.tsx` - Interactive properties/states
4. `ComponentNameSemantic.stories.tsx` - Semantic usage patterns
5. `ComponentNameAccessibility.stories.tsx` - Accessibility demonstrations

### Story Requirements

**Every story MUST:**
- Use `.tsx` extension (contains JSX)
- Import `fn()` for interactive props: `import { fn } from 'storybook/test'`
- Include comprehensive JSDoc documentation
- Use semantic design tokens (not arbitrary colors)
- Pass accessibility checks
- Render and function as actual tests

**Example story structure:**
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../components/ui/button'

/**
 * Button Intelligence: cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns
 */
const meta = {
  title: '03 Components/Action/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The foundational interactive element with embedded design intelligence.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost'],
      description: 'Visual variant with semantic meaning',
    },
    onClick: {
      description: 'Click handler - required for interactive testing',
    },
  },
  args: { onClick: fn() }, // CRITICAL for story testing
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Primary action button for main user interactions.
 * Uses semantic primary tokens for highest attention hierarchy.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
}
```

### Design System Dogfooding

**ALWAYS use semantic tokens in stories:**

❌ **Never use arbitrary colors:**
```typescript
className="text-green-600 bg-blue-500 border-red-400"
```

✅ **Always use semantic tokens:**
```typescript
className="text-success-foreground bg-primary border-destructive"
```

This teaches proper design system usage and ensures consistency.

## Design Intelligence Integration

### Three-Layer Intelligence System

**When working with components, understand the intelligence layers:**

1. **Comments in components:**
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns
 * Full patterns: .rafters/agent-instructions.md
 */
export const Button = ({ variant, size, ...props }) => {
  // Implementation with design reasoning
}
```

2. **Manifest data** (`.rafters/component-manifest.json`):
```json
{
  "Button": {
    "intelligence": {
      "cognitiveLoad": 3,
      "attentionEconomics": "Size hierarchy: sm=tertiary, md=secondary, lg=primary",
      "accessibility": "44px touch targets, WCAG AAA contrast"
    }
  }
}
```

3. **Intelligence stories** - Storybook documentation explaining design reasoning

### Registry Compatibility

**We extend shadcn's registry spec** with intelligence metadata in the `meta` field:

```json
{
  "$schema": "https://ui.shadcn.com/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "files": [...],
  "meta": {
    "rafters": {
      "cognitiveLoad": 3,
      "attentionEconomics": "Size hierarchy patterns",
      "accessibility": "WCAG AAA compliance details"
    }
  }
}
```

## Component Development Workflow

### When Creating New Components

1. **Read existing component patterns** in `src/components/ui/`
2. **Follow TDD** - write tests first
3. **Use Radix primitives** for accessibility foundation
4. **Apply semantic tokens** for styling
5. **Add intelligence comments** to component
6. **Create complete story suite** (5 files if complex)
7. **Update component manifest** with intelligence data
8. **Ensure tests pass** before committing

### When Modifying Existing Components

1. **Understand existing intelligence patterns** from comments and stories
2. **Maintain design system consistency** 
3. **Update tests first** (TDD)
4. **Update stories** to reflect changes
5. **Update manifest data** if intelligence changes
6. **Verify all tests pass** including stories

## File Structure Context

```
rafters/
├── .rafters/                    # Hidden CLI config (future)
│   ├── agent-instructions.md    # AI usage patterns
│   ├── config.json             # CLI configuration
│   └── component-manifest.json # Intelligence fallback
├── src/
│   ├── components/ui/          # Component source code
│   ├── stories/               # Storybook stories (tested with Vitest)
│   └── lib/                   # Utilities
├── CODING_STANDARDS.md         # Complete coding requirements
├── STORYBOOK_STANDARDS.md      # Story creation guidelines
├── ARCHITECTURE.md             # Shadcn-style system architecture
├── CLI_PLAN.md                # CLI implementation plan
├── WEB_CONFIGURATOR_SPEC.md   # Web app specification
└── lefthook.yml               # Pre-commit constraints
```

## Quality Gates

**Before any commit, ensure:**

1. **All tests pass** - `pnpm vitest run`
2. **All stories render** - `pnpm test-storybook`
3. **Biome check passes** - `pnpm biome check`
4. **TypeScript compiles** - `pnpm type-check`
5. **Stories use semantic tokens** - no arbitrary colors
6. **Intelligence patterns documented** - comments + manifest
7. **Accessibility verified** - WCAG AAA compliance

**Lefthook will enforce the first 3 automatically.**

## Common Tasks

### Adding a New Component

1. Create component in `src/components/ui/ComponentName.tsx`
2. Add intelligence comment header
3. Write comprehensive test suite (TDD)
4. Create main story: `ComponentName.stories.tsx`
5. Add variant stories if complex
6. Update component manifest
7. Verify all tests pass

### Updating Stories

1. Ensure `.tsx` extension for JSX content
2. Import `fn()` for interactive props
3. Use semantic tokens in examples
4. Include comprehensive JSDoc
5. Test story functionality with Vitest
6. Verify accessibility compliance

### Registry Integration

1. Follow shadcn registry spec
2. Add intelligence in `meta.rafters` field
3. Maintain backward compatibility
4. Document component intelligence

## Success Criteria

**Your work should result in:**

- Components that teach design intelligence to AI agents
- Stories that function as both documentation and tests
- Clean, type-safe code that passes all quality gates
- Consistent use of semantic design tokens
- WCAG AAA accessible implementations
- Systematic approach to component development

**Remember**: This design system is built for AI development. Every component should help AI agents understand and apply design intelligence, not just provide functionality.