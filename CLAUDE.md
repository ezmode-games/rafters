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

### AI Token Training

**Training scenarios MUST use semantic tokens to teach AI agents proper design system usage:**

❌ **Arbitrary colors corrupt AI training:**
```typescript
className="text-green-600 bg-blue-500 border-red-400" // AI learns wrong patterns
```

✅ **Semantic tokens train correct AI behavior:**
```typescript
className="text-success-foreground bg-primary border-destructive" // AI learns design system
```

Every training scenario using semantic tokens teaches AI agents systematic design decision-making.

## AI Intelligence Consumption

### Three-Layer AI Training System

**AI agents consume design intelligence through structured layers:**

1. **Component Intelligence Comments** - Direct AI parsing of design reasoning:
```tsx
/**
 * AI Intelligence: Button cognitiveLoad=3, attention hierarchy system
 * Destructive variant REQUIRES confirmation UX patterns - safety constraint
 * Size mapping: sm=tertiary actions, md=secondary, lg=primary calls-to-action
 * Full constraint patterns: .rafters/agent-instructions.md
 */
export const Button = ({ variant, size, ...props }) => {
  // Implementation follows AI-readable design constraints
}
```

2. **Machine-Readable Manifest** (`.rafters/component-manifest.json`) - Structured data for AI decision-making:
```json
{
  "Button": {
    "aiIntelligence": {
      "cognitiveLoad": 3,
      "attentionHierarchy": "Size maps to action importance: sm=tertiary, md=secondary, lg=primary",
      "safetyConstraints": "Destructive actions require confirmation patterns",
      "accessibilityRules": "44px minimum touch targets, WCAG AAA contrast ratios"
    }
  }
}
```

3. **Training Stories** - Complete behavioral examples for AI pattern learning

### AI-Enhanced Registry

**Shadcn registry extended with AI intelligence metadata for systematic component selection:**

```json
{
  "$schema": "https://ui.shadcn.com/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "files": [...],
  "meta": {
    "rafters": {
      "aiIntelligence": {
        "cognitiveLoad": 3,
        "decisionConstraints": "Size hierarchy: sm=tertiary, md=secondary, lg=primary",
        "safetyPatterns": "Destructive variant requires confirmation UX",
        "accessibilityRules": "WCAG AAA compliance, 44px touch targets",
        "usageContext": "Primary actions, form submissions, critical interactions"
      }
    }
  }
}
```

## AI Intelligence Development Workflow

### Creating AI-Trainable Components

1. **Study existing AI intelligence patterns** in `src/components/ui/`
2. **Follow TDD** - write tests that validate AI training data quality
3. **Use Radix primitives** - accessibility foundation for AI constraint learning
4. **Apply semantic tokens exclusively** - trains AI on design system usage
5. **Embed AI intelligence comments** - direct design reasoning for AI parsing
6. **Create comprehensive training suite** - 5 story files for complex component education
7. **Update component manifest** - structured intelligence data for AI consumption
8. **Validate AI training quality** - ensure all tests pass before committing

### Updating AI Training Data

1. **Analyze existing AI intelligence patterns** - comments, stories, and manifest data
2. **Maintain training consistency** - AI learns from systematic patterns
3. **Update training scenarios first** - TDD approach for AI education
4. **Update all training stories** - comprehensive AI pattern learning
5. **Update manifest intelligence** - structured data for AI decision-making
6. **Validate training integrity** - all stories must function as executable tests

## AI Intelligence System Architecture

```
rafters/                         # AI-First Design Intelligence System
├── .rafters/                    # AI agent configuration and intelligence data
│   ├── agent-instructions.md    # Complete AI usage patterns and constraints
│   ├── config.json             # AI system configuration
│   └── component-manifest.json # Structured intelligence data for AI consumption
├── src/
│   ├── components/ui/          # Components with embedded AI intelligence comments
│   ├── stories/               # AI training scenarios (executable via Vitest)
│   └── lib/                   # Utilities with AI-readable patterns
├── CODING_STANDARDS.md         # AI-compatible coding requirements
├── STORYBOOK_STANDARDS.md      # AI training scenario standards
├── ARCHITECTURE.md             # AI intelligence system architecture
├── CLI_PLAN.md                # Human configuration interface plan
├── WEB_CONFIGURATOR_SPEC.md   # Human web interface specification
└── lefthook.yml               # Quality gates for AI training data integrity
```

## AI Training Data Quality Gates

**Before any commit, validate AI training integrity:**

1. **All tests pass** - `pnpm vitest run` - validates AI training scenarios function correctly
2. **All training stories render** - `pnpm test-storybook` - ensures AI learning examples work
3. **Code quality check** - `pnpm biome check` - maintains consistent AI-readable patterns
4. **TypeScript validation** - `pnpm type-check` - ensures AI intelligence comments match types
5. **Semantic token usage** - no arbitrary colors in training scenarios (corrupts AI learning)
6. **AI intelligence documentation** - all components have comments + manifest entries
7. **Accessibility compliance** - WCAG AAA verified (teaches AI accessible patterns)

**Lefthook automatically enforces training data quality (items 1-3).**

## AI Intelligence System Tasks

### Creating AI-Trainable Components

1. Create component in `src/components/ui/ComponentName.tsx` with embedded AI intelligence
2. Add comprehensive AI intelligence comment headers for direct AI parsing
3. Write test suite validating AI training data quality (TDD)
4. Create primary training story: `ComponentName.stories.tsx`
5. Add comprehensive training scenarios for complex components (5 story files)
6. Update component manifest with structured AI intelligence data
7. Validate AI training integrity - all tests and stories must pass

### Updating AI Training Scenarios

1. Use `.tsx` extension - enables JSX parsing by AI agents
2. Import `fn()` for interactive behavior training scenarios
3. Use semantic tokens exclusively - trains AI on design system patterns
4. Include comprehensive JSDoc - provides AI context understanding
5. Test training scenario functionality with Vitest - validates AI learning data
6. Verify accessibility compliance - teaches AI accessible pattern recognition

### AI-Enhanced Registry Integration

1. Follow shadcn registry specification for compatibility
2. Extend with AI intelligence in `meta.rafters.aiIntelligence` field
3. Maintain backward compatibility with existing tooling
4. Document complete AI intelligence patterns for systematic consumption

## AI Intelligence System Success Criteria

**Every contribution should enhance AI design decision-making capability:**

- **AI-readable components** with embedded design reasoning that agents can parse and apply
- **Training scenarios (stories)** that function as executable AI education and validation tests
- **Clean, type-safe code** that passes quality gates and maintains AI training data integrity
- **Systematic semantic token usage** that trains AI agents on design system patterns
- **WCAG AAA accessible implementations** that teach AI agents accessible design constraints
- **Structured intelligence data** that enables AI agents to make systematic design decisions

**CRITICAL UNDERSTANDING**: This is an AI design intelligence system. Every component, story, and piece of documentation exists to make AI agents better at design decisions through systematic constraint learning and pattern recognition. Human usability is secondary to AI trainability.