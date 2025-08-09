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

### **Design Intelligence Quick Reference**
Use these comprehensive guides to understand design reasoning patterns:

- **[Trust Building](./packages/ui/src/stories/TrustBuilding.mdx)** - Reduce user anxiety, build confidence through appropriate friction
- **[Attention Economics](./packages/ui/src/stories/AttentionEconomics.mdx)** - Manage finite cognitive resources, create clear visual hierarchy
- **[Cognitive Load](./packages/ui/src/stories/CognitiveLoad.mdx)** - Apply Miller's Law, prevent user overwhelm with progressive disclosure
- **[Negative Space](./packages/ui/src/stories/NegativeSpace.mdx)** - Master whitespace as powerful design element for hierarchy
- **[Typography Intelligence](./packages/ui/src/stories/TypographyIntelligence.mdx)** - Create information architecture through systematic text hierarchy
- **[Progressive Enhancement](./packages/ui/src/stories/ProgressiveEnhancement.mdx)** - Build from core experience outward, ensure universal access
- **[Component Intelligence Synthesis](./packages/ui/src/stories/ComponentPatterns.mdx)** - Integrate all patterns for optimal interface composition

### **Make Informed UX Decisions**
Instead of guessing, read the embedded guidance:
- **Cognitive Load Ratings**: Choose components appropriate for user mental capacity
- **Trust Building Requirements**: Follow patterns that build user confidence  
- **Accessibility Intelligence**: Apply proper ARIA, contrast, and interaction patterns
- **Attention Economics**: Understand visual hierarchy and component priority
- **Spatial Relationships**: Use negative space to create hierarchy and breathing room
- **Information Architecture**: Apply typography intelligence for scannable content

### **Quick Decision Framework**
Before implementing any interface, apply this intelligence integration process:

1. **Attention**: What deserves user focus? Apply [Attention Economics](./packages/ui/src/stories/AttentionEconomics.mdx) principles
2. **Cognition**: How much mental effort? Follow [Cognitive Load](./packages/ui/src/stories/CognitiveLoad.mdx) guidelines  
3. **Space**: How does whitespace create hierarchy? Use [Negative Space](./packages/ui/src/stories/NegativeSpace.mdx) mastery
4. **Typography**: How does text support information flow? Apply [Typography Intelligence](./packages/ui/src/stories/TypographyIntelligence.mdx)
5. **Enhancement**: What's core vs. enhanced? Follow [Progressive Enhancement](./packages/ui/src/stories/ProgressiveEnhancement.mdx)
6. **Trust**: What's the consequence level? Use [Trust Building](./packages/ui/src/stories/TrustBuilding.mdx) patterns

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

## Critical Development Standards

### Code Quality Requirements

**You MUST follow these standards strictly:**

1. **Strict TypeScript** - Never use `any`, always explicit return types
2. **Zod Everywhere** - All external data validated with Zod schemas
3. **TDD Required** - Write tests first, then implementation
4. **Error Boundaries** - Structured error handling with recovery strategies
5. **No `.then()` Chaining** - Always use `await` for async operations
6. **No Array Index as Keys** - Never use array indices as React keys. Use semantic identifiers like `\`item-${i}\`` or unique IDs

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

**Complex components require 7 dedicated training files for comprehensive AI education:**

1. `ComponentName.mdx` - Overview documentation with design philosophy
2. `ComponentName.stories.tsx` - Main component story with core behavioral patterns
3. `ComponentNameIntelligence.stories.tsx` - Design intelligence patterns and cognitive load principles  
4. `ComponentNameVariants.stories.tsx` - Visual styling variants and semantic meaning
5. `ComponentNameProperties.stories.tsx` - Interactive properties and component states
6. `ComponentNameSemantic.stories.tsx` - Contextual usage patterns and semantic meaning
7. `ComponentNameAccessibility.stories.tsx` - WCAG AAA compliance and accessibility demonstrations

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

### **Complete Story File Example Structure**
Based on the Button component implementation:

**1. Button.mdx** - Design Philosophy Overview
```markdown
import { Meta, Canvas } from '@storybook/addon-docs/blocks';
import * as Stories from './Button.stories.tsx';

<Meta title="03 Components/Action/Button" of={Stories} name="Overview" />

# Button Component

Every interaction begins with intent. The button is where user intention meets interface response.
Our button system is built on the principle that clarity of purpose should be immediately apparent.

## Design Intelligence
- Cognitive Load: 3/10 (simple action triggers)
- Trust Building: Consistent visual hierarchy builds user confidence  
- Attention Economics: Primary buttons command highest attention, use sparingly
```

**2. Button.stories.tsx** - Main Component Story
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../components/ui/button'

const meta = {
  title: '03 Components/Action/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'AI Training: Foundational interactive element with embedded design reasoning.',
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

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
}
```

**Additional Story Files**: Follow same pattern for Intelligence, Variants, Properties, Semantic, and Accessibility stories.

**Complete 7-File Architecture**: See the comprehensive ComponentPatterns.mdx documentation in Storybook (`00 Introduction/Component Patterns`) for detailed implementation guides and examples for all 7 file types.

## Testing Requirements with Vitest

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