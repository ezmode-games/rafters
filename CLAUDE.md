# Claude AI Assistant Instructions for Rafters

## AI-First Design Intelligence System

**Rafters is a design intelligence system for AI agents.** Components are the delivery mechanism for encoded human design reasoning. This system exists to make AI agents better at design decisions through systematic constraints and machine-readable design knowledge.

**This is NOT a human-facing component library.** This is an AI reasoning system that teaches design intelligence through:

1. **Component Comments** - Design reasoning embedded in JSX comments for AI parsing
2. **Component Manifest** - Machine-readable intelligence data for systematic decision-making  
3. **Intelligence Stories** - Comprehensive training scenarios for AI design education

**Core Purpose**: Prevent AI agents from making bad design choices by encoding human design judgment in consumable formats. Components use shadcn-style source code ownership with OKLCH color systems, accessibility-first design, and systematic constraints.

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

**All Storybook stories are tested with Vitest** through `@storybook/addon-vitest`. Stories are AI training data that must function correctly:

- **Stories are AI training scenarios** - not just documentation but behavior examples
- **Every story becomes a test case** - ensuring AI guidance actually works
- **Stories must render without errors** - broken training data corrupts AI learning
- **Interactive stories must work** - AI needs real behavior patterns to learn from

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

## Testing Recommendations

- **Prefer SpyOn over Mock in tests** - SpyOn provides more natural and transparent test behavior

## AI Training Standards (Storybook)

### Multi-File Training Architecture

**Complex components require 5 dedicated training files for comprehensive AI education:**

1. `ComponentName.stories.tsx` - Core behavioral patterns for AI learning
2. `ComponentNameVariants.stories.tsx` - Visual decision training scenarios
3. `ComponentNameProperties.stories.tsx` - Interactive state training examples
4. `ComponentNameSemantic.stories.tsx` - Contextual usage pattern training
5. `ComponentNameAccessibility.stories.tsx` - Accessibility constraint training

### AI Training Requirements

**Every training scenario (story) MUST:**
- Use `.tsx` extension for JSX parsing by AI agents
- Import `fn()` for interactive behavior training: `import { fn } from 'storybook/test'`
- Include comprehensive JSDoc for AI context understanding
- Use semantic design tokens exclusively (teaches proper token usage to AI)
- Pass accessibility checks (ensures AI learns accessible patterns)
- Function as executable tests (validates AI training data quality)

**Example AI training scenario:**
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../components/ui/button'

/**
 * AI Training: Button Intelligence
 * cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns
 * This trains AI agents on button hierarchy and safety patterns
 */
const meta = {
  title: '03 Components/Action/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'AI Training: Foundational interactive element with embedded design reasoning for systematic decision-making.',
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

[... rest of the existing content remains unchanged]