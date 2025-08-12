# MANDATORY REQUIREMENTS - READ FIRST

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

## ACCESSIBILITY CONSULTATION - MANDATORY SALLY:
**BEFORE PREFLIGHT - ALWAYS CONSULT SALLY FOR ACCESSIBILITY REVIEW**
- Sally ensures WCAG AAA compliance and Section 508 requirements
- Validates keyboard navigation and screen reader support
- Reviews reduced motion and high contrast compatibility
- Required checkpoint before any code commitment

**IGNORING THESE REQUIREMENTS = REJECTED PR**

** NEVER USE FUCKING EMOJI FOR ANYTING **
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

### 3. FOLLOW 7-File Story Architecture for New Components
**MANDATORY files for every component:**
1. `ComponentName.mdx` - Overview Documentation
2. `ComponentName.stories.tsx` - Primary Story (with `onClick: fn()`)
3. `ComponentNameIntelligence.stories.tsx` - Design Intelligence
4. `ComponentNameVariants.stories.tsx` - Visual Variants
5. `ComponentNameProperties.stories.tsx` - Interactive Properties  
6. `ComponentNameSemantic.stories.tsx` - Semantic Usage
7. `ComponentNameAccessibility.stories.tsx` - Accessibility Compliance

### 4. RUN Tests Before Committing
```bash
pnpm test
```

** Broken stories = Corrupted AI training data**

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
- `pnpm vitest run` passes (includes story tests)
- All TypeScript compiles without errors
- No linting violations

## DESIGN INTELLIGENCE QUICK REFERENCE

**BEFORE implementing any interface, apply this framework:**

1. **Attention**: What deserves user focus? → [Attention Economics](./packages/ui/src/stories/AttentionEconomics.mdx)
2. **Cognition**: How much mental effort? → [Cognitive Load](./packages/ui/src/stories/CognitiveLoad.mdx)  
3. **Space**: How does whitespace create hierarchy? → [Negative Space](./packages/ui/src/stories/NegativeSpace.mdx)
4. **Typography**: How does text support information flow? → [Typography Intelligence](./packages/ui/src/stories/TypographyIntelligence.mdx)
5. **Enhancement**: What's core vs. enhanced? → [Progressive Enhancement](./packages/ui/src/stories/ProgressiveEnhancement.mdx)
6. **Trust**: What's the consequence level? → [Trust Building](./packages/ui/src/stories/TrustBuilding.mdx)

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

**All Storybook stories are tested with Vitest** through `@storybook/addon-vitest`. Stories are AI training data that must function correctly:

- **Stories are AI training scenarios** - not just documentation but behavior examples
- **Every story becomes a test case** - ensuring AI guidance actually works
- **Stories must render without errors** - broken training data corrupts AI learning
- **Interactive stories must work** - AI needs real behavior patterns to learn from

**Test commands:**
```bash
pnpm test              # Run all tests including stories
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

## AI Training Standards (Storybook)

See [docs/STORYBOOK_STANDARDS.md](./docs/STORYBOOK_STANDARDS.md) for complete standards.

### 7-File Story Architecture (MANDATORY)

**Every component MUST implement exactly 7 story files** for comprehensive AI training:

#### 1. **Overview Documentation** (`ComponentName.mdx`)
- Component purpose and basic usage
- Simple usage guidelines with DOs/DONTs  
- Import from main `.stories.tsx` file only
- Single Canvas example showing common usage

#### 2. **Primary Story** (`ComponentName.stories.tsx`)
- **Status comment REQUIRED** at top of file:
  ```typescript
  // @componentStatus published | draft | depreciated
  // @version 0.1.0
  ```
- Single "Common" story showcasing all major variants
- Complete argTypes for all component props
- Interactive controls for rapid prototyping
- Must include `onClick: fn()` for interactive components

#### 3. **Design Intelligence** (`ComponentNameIntelligence.stories.tsx`)
- Trust-building patterns and progressive confirmation
- Attention hierarchy demonstrations
- Cognitive load optimization examples
- Context-aware adaptations
- Loading states and feedback patterns

#### 4. **Visual Variants** (`ComponentNameVariants.stories.tsx`)
- All visual styling variants (primary, secondary, etc.)
- Visual hierarchy demonstrations
- Semantic color token usage exclusively
- Style-focused examples with semantic meaning

#### 5. **Interactive Properties** (`ComponentNameProperties.stories.tsx`)
- Size variations and scaling relationships
- State demonstrations (disabled, loading, error)
- Interactive feedback patterns
- Property combinations and behaviors

#### 6. **Semantic Usage** (`ComponentNameSemantic.stories.tsx`)
- Contextual usage examples in real scenarios
- Semantic variants (success, warning, error, info)
- Trust level implementations
- Consequence-appropriate styling

#### 7. **Accessibility Compliance** (`ComponentNameAccessibility.stories.tsx`)
- WCAG AAA compliance demonstrations
- Keyboard navigation patterns
- Screen reader compatibility
- Focus management and ARIA properties
- Color contrast demonstrations

### Trust-Building Intelligence Framework

Components implement **4 trust levels** that match user psychology:

- **Low Trust** - Routine actions, minimal friction, reversible
- **Medium Trust** - Moderate consequences, balanced caution  
- **High Trust** - Significant impact, deliberate friction
- **Critical Trust** - Permanent consequences, maximum friction

### AI Training Requirements

**Every training scenario (story) MUST:**
- Use `.tsx` extension for JSX parsing by AI agents
- Import `fn()` for interactive behavior training: `import { fn } from 'storybook/test'`
- Include comprehensive JSDoc for AI context understanding
- Use semantic design tokens exclusively (teaches proper token usage to AI)
- Pass accessibility checks (ensures AI learns accessible patterns)
- Function as executable tests (validates AI training data quality)
- Follow title hierarchy: `03 Components/Category/ComponentName/StoryType`

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

### Component Intelligence Comments
**MANDATORY** in every component:
```jsx
/**
 * AI Intelligence: Component knowledge embedded for systematic decision-making
 * Trust Level: {level} - {explanation}
 * Cognitive Load: {1-10} - {complexity reasoning}
 * Safety Constraints: {required patterns}
 * Usage Context: {when/where to use}
 */
```

### Story Testing Integration (UI Package ONLY)
**IMPORTANT: The UI package uses stories AS tests - NOT separate unit tests like other packages.**

**All stories are automatically tested** via `@storybook/addon-vitest`:
- Stories function as AI training scenarios AND test cases simultaneously
- **No additional `.test.ts` files needed** - stories provide complete test coverage
- Broken stories corrupt AI learning - they MUST render without errors
- Interactive stories require `onClick: fn()` for proper test execution
- Use `pnpm test` to verify story integrity

**This is DIFFERENT from other monorepo packages** which use traditional unit testing.

**Complete 7-File Architecture**: See [docs/STORYBOOK_STANDARDS.md](./docs/STORYBOOK_STANDARDS.md) for detailed implementation guides and examples for all 7 file types.

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