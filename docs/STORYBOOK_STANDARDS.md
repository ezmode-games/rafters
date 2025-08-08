## Component Status Flag

Every main component story (`<Component>.stories.tsx`) MUST include a `status` field in the meta object:

```typescript
const meta = {
  ...
  status: 'published', // 'published', 'draft', or 'depreciated'
  ...
}
```

- Only components with `status: 'published'` are included in the registry and available for production use.
- Components with `status: 'draft'` or `status: 'depreciated'` are excluded from the registry build and not published.
- This flag is required for all main component stories and is used for automated registry publishing and release management.
# Storybook Standards for Rafters Design System

## Overview

This document establishes the standards for creating Storybook stories in the Rafters design system. Stories serve **dual purposes**: comprehensive documentation AND automatic test cases via Vitest integration.

**Critical Requirements:**
1. **Stories are Tests** - All stories run as tests via `@storybook/addon-vitest`
2. **Intelligence Integration** - Every component includes design intelligence patterns
3. **Semantic Token Usage** - All examples must use design system tokens, never arbitrary values
4. **Accessibility Focus** - WCAG AAA compliance demonstrated in stories

## Design System Dogfooding Standards

### Color Token Usage

**ALWAYS use semantic design tokens instead of arbitrary colors.** Our stories teach proper design system usage, so every color choice must demonstrate best practices.

#### ❌ Avoid Arbitrary Colors
```typescript
// DON'T - These teach bad habits and ignore our design system
className="text-green-600 bg-blue-500 border-red-400"
className="text-slate-700 bg-purple-50 border-amber-300"
```

#### ✅ Use Semantic Tokens
```typescript
// DO - These teach proper semantic meaning and system usage
className="text-success-foreground bg-info border-destructive"
className="text-muted-foreground bg-accent/10 border-warning"
```

### Semantic Color Guidelines

**Success States:** Use `text-success-foreground`, `bg-success`, `border-success`
- For positive outcomes, completed tasks, valid input states

**Warning States:** Use `text-warning-foreground`, `bg-warning`, `border-warning`  
- For caution, attention needed, non-critical issues

**Error States:** Use `text-destructive-foreground`, `bg-destructive`, `border-destructive`
- For errors, invalid states, dangerous actions

**Info States:** Use `text-info-foreground`, `bg-info`, `border-info`
- For neutral information, tips, helpful context

**Muted Content:** Use `text-muted-foreground`, `bg-muted`, `border-muted`
- For secondary information, subtle backgrounds

### Typography & Spacing

**Typography Scale:** Use design system scale classes (`text-xl`, `text-2xl`, etc.)
**Spacing Scale:** Use consistent spacing tokens (`p-4`, `m-6`, `gap-8`, etc.)
**Layout Classes:** Prefer semantic layout patterns over arbitrary measurements

### Example Transformation

```typescript
// ❌ BEFORE - Arbitrary colors that don't teach design system
<div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded">
  Success message with arbitrary green colors
</div>

// ✅ AFTER - Semantic tokens that teach proper usage  
<div className="bg-success/10 border border-success text-success-foreground p-4 rounded">
  Success message using semantic design tokens
</div>
```

This approach ensures our documentation teaches proper design system habits while providing consistent, meaningful color usage throughout all examples.

## Current File Structure

### Story Organization

Stories are organized by category with component-specific subdirectories:

```
src/stories/
├── foundation/                          # Design system foundations
│   ├── Colors.stories.tsx              # Color system documentation
│   ├── Typography.stories.tsx          # Typography scale & patterns
│   ├── LayoutSystem.stories.tsx        # Spacing & layout principles
│   └── Tokens.stories.tsx              # Design token reference
└── components/                          # Component documentation
    ├── button/
    │   ├── Button.stories.tsx           # Main component story
    │   ├── ButtonIntelligence.stories.tsx  # 🧠 Design intelligence patterns
    │   ├── ButtonVariants.stories.tsx   # Visual styling variants
    │   ├── ButtonProperties.stories.tsx # Interactive properties/states
    │   ├── ButtonSemantic.stories.tsx   # Semantic usage patterns
    │   └── ButtonAccessibility.stories.tsx # Accessibility demonstrations
    ├── select/
    │   ├── SelectIntelligence.stories.tsx
    │   ├── SelectVariants.stories.tsx
    │   └── ...
    └── ...
```

### Intelligence-First Architecture

Every component includes a dedicated **`ComponentIntelligence.stories.tsx`** file that demonstrates:
- Cognitive load principles
- Attention hierarchy patterns  
- Trust-building interactions
- Semantic meaning through design

### Title Hierarchy Convention

Stories follow a three-tier hierarchy pattern:

```typescript
// Foundation stories
title: '01 Identity/Colors'
title: '01 Identity/Typography'
title: '01 Identity/Layout System'

// Component main story  
title: '03 Components/Action/Button'
title: '03 Components/Input/Select'
title: '03 Components/Display/Card'

// Component substories
title: '03 Components/Action/Button/Intelligence'
title: '03 Components/Action/Button/Variants'
title: '03 Components/Action/Button/Properties'
title: '03 Components/Action/Button/Semantic'
title: '03 Components/Action/Button/Accessibility'
```

**Component Categories:**
- `Action` - Interactive elements (Button, Link)
- `Input` - Form controls (Input, Select, Slider)
- `Display` - Content presentation (Card, Badge)  
- `Layout` - Structural components (Container, Grid)
- `Navigation` - Navigation components (Tabs, Breadcrumb)

## File Structure & Naming

### File Extensions
- **Use `.tsx` extension** for all story files that contain JSX
- **Use `.ts` extension** only for stories without JSX content

### Import Standards
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../../../components/Button'
```

**Path Patterns:**
- Foundation stories: No component imports needed
- Component stories: Relative paths from story to component
- Test functions: Always import `fn` from `storybook/test` for interactive props

## Story Configuration

### Meta Configuration Template

#### Foundation Stories

Foundation stories document design system principles with custom educational content:

```typescript
/**
 * Colors communicate meaning before words are read. Our color system prioritizes
 * accessibility and semantic clarity over decorative appeal.
 */
const meta = {
  title: '01 Identity/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The foundational color system built on semantic tokens and accessibility-first principles.',
      },
    },
  },
} satisfies Meta
```

#### Component Stories

Main component stories include comprehensive documentation and testing setup:

```typescript
/**
 * Every interaction begins with intent. The button is where user intention meets interface response.
 * Our button system is built on the principle that clarity of purpose should be immediately apparent.
 */
const meta = {
  title: '03 Components/Action/Button',
  component: Button,
  tags: ['!autodocs', '!dev', 'test'], // Vitest integration
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
      description: 'Visual style variant using semantic tokens',
    },
    onClick: {
      description: 'Click handler - required for interactive testing',
    },
  },
  args: { onClick: fn() }, // CRITICAL for Vitest story testing
} satisfies Meta<typeof Button>
```

#### Substory Files

Intelligence, Variant, Properties, Semantic, and Accessibility stories use simplified meta:

```typescript
const meta = {
  title: '03 Components/Action/Button/Intelligence',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>
```

#### Critical Tags Configuration

**Required tags for component stories:**
- `['!autodocs', '!dev', 'test']` - Excludes autodocs, marks for Vitest testing

**Required args for interactive components:**
- `args: { onClick: fn() }` - Enables proper event testing in Vitest

## Story Types & Content

### Main Component Story (`Button.stories.tsx`)
**Purpose:** Core component documentation with all variants
**Content:**
- Philosophy JSDoc explaining design principles
- Comprehensive argTypes for all props
- Common variants demonstration
- Complete testing setup with `fn()` handlers

**Example stories:** `Common` - Shows all variants in one view

### Intelligence Story (`ButtonIntelligence.stories.tsx`) 🧠
**Purpose:** Design intelligence patterns and cognitive load principles
**Content:**
- Loading states with proper UX patterns
- Destructive confirmation patterns  
- Attention hierarchy demonstrations
- Trust-building interaction examples

**Example stories:** `LoadingState`, `DestructiveConfirm`, `AttentionHierarchy`

### Variants Story (`ButtonVariants.stories.tsx`)
**Purpose:** Visual styling variants and semantic meaning
**Content:**
- All `variant` prop values
- Visual hierarchy demonstration
- Semantic color token usage
- Style-focused examples

### Properties Story (`ButtonProperties.stories.tsx`)
**Purpose:** Interactive properties and component states
**Content:**
- Size variations (`sm`, `md`, `lg`)
- Disabled states
- Interactive property demonstrations
- State management examples

### Semantic Story (`ButtonSemantic.stories.tsx`) 
**Purpose:** Semantic variants and contextual usage
**Content:**
- Success, Warning, Info, Destructive states
- Context-appropriate usage examples
- Semantic token demonstrations
- Meaning-driven design patterns

### Accessibility Story (`ButtonAccessibility.stories.tsx`)
**Purpose:** WCAG AAA compliance and inclusive design
**Content:**
- ARIA properties and labels
- Keyboard navigation patterns
- Screen reader compatibility
- Focus management
- Color contrast demonstrations

## Testing Integration with Vitest

### Automatic Story Testing

**All stories are automatically tested** via `@storybook/addon-vitest`:

```bash
pnpm test              # Runs all tests including stories
pnpm test-storybook    # Runs story-specific tests
pnpm vitest run        # CI test runner
```

### Story Testing Requirements

**Stories must be functional, not just documentation:**

1. **Interactive props must work** - Use `fn()` for click handlers
2. **Stories must render without errors** in browser environment  
3. **No broken imports or missing dependencies**
4. **Valid JSX and TypeScript** - stories are compiled and executed

```typescript
// ✅ CORRECT - Testable story
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
    onClick: fn(), // Required for testing
  },
}

// ❌ INCORRECT - Non-functional story
export const Broken: Story = {
  args: {
    variant: 'primary',
    onClick: undefined, // No handler - test will fail
  },
}
```

### Story Testing Benefits

- **Quality assurance** - Stories that don't work break tests
- **Regression prevention** - Component changes caught in story tests  
- **Documentation accuracy** - Examples must actually function
- **Accessibility verification** - A11y addon runs on all stories

## Documentation Standards

### JSDoc Standards
1. **Component-level JSDoc** with:
   - Design philosophy statement 
   - Core purpose and principles
   - Usage context and guidelines

```typescript
/**
 * Every interaction begins with intent. The button is where user intention meets interface response.
 * Our button system is built on the principle that clarity of purpose should be immediately apparent—
 * both visually and functionally.
 */
```

2. **Story-level JSDoc** with:
   - Specific usage context
   - When to use this variant
   - Implementation considerations

```typescript
/**
 * Primary Button
 * 
 * The primary action in any interface. Used for the most important action
 * on a page or in a section. Should appear only once per context.
 */
export const Primary: Story = {
  // story implementation
};
```

### Description Standards

#### Component Descriptions
Should establish design philosophy and foundational principles:
```typescript
parameters: {
  docs: {
    description: {
      component: 'The foundational interactive element. Every button communicates intent through carefully chosen visual hierarchy and semantic meaning.',
    },
  },
}
```

#### Story Descriptions  
Should explain specific usage context and guidelines:
```typescript
parameters: {
  docs: {
    description: {
      story: 'Primary action using semantic primary tokens. Most prominent call-to-action that should appear only once per context.',
    },
  },
}
```
   - Technology notes (Radix, semantic tokens, etc.)

2. **Story-level descriptions** for each variant explaining:
   - When to use this variant
   - Semantic meaning
   - Design rationale

## Story Organization

### Required Stories
Every component must include these story categories:

#### 1. Variants Stories
- Cover all visual variants (primary, secondary, destructive, etc.)
- Each variant gets its own named export
- Include semantic meaning in descriptions

#### 2. Size Stories  
- Cover all size variants (sm, md, lg)
- Show sizing hierarchy and use cases

#### 3. State Stories
- Disabled state
- Loading state (if applicable)
- Error state (if applicable)

#### 4. Interactive Stories
- Demonstrate hover/focus behaviors
- Test click handlers with `fn()` spies
- Show responsive interactions

#### 5. Composition Stories
- `asChild` usage (for Radix components)
- Integration examples
- Complex compositions

## Story Naming Conventions

### Export Names
- Use **PascalCase** for story exports
- Use **descriptive names** that explain the variant
- Examples: `Primary`, `Secondary`, `InteractiveStates`, `AsChild`

### Story Descriptions
- Start with action word ("Demonstrates", "Shows", "Uses")
- Explain when/why to use this variant
- Reference semantic tokens when relevant

## ArgTypes Configuration

### Control Types
- **select**: For enums and variants
- **boolean**: For flags and toggles  
- **text**: For string content
- **number**: For numeric values

### Required Properties
```typescript
argTypes: {
  propName: {
    control: 'controlType',
    options: [...], // for select controls
    description: 'Clear description of prop purpose',
  },
}
```

## Semantic Token Integration

### Documentation Requirements
- Always mention semantic token usage in descriptions
- Explain grayscale foundation approach
- Reference design system principles

### Example Pattern
```typescript
parameters: {
  docs: {
    description: {
      story: 'Primary action using semantic primary tokens. Most prominent call-to-action.',
    },
  },
}
```

## Testing Integration

### Vitest Addon
- All stories automatically generate tests via `@storybook/addon-vitest`
- Stories run in browser environment with Playwright
- Tests verify rendering, interactions, and accessibility

### Test Structure
```typescript
// Companion test file: ComponentName.test.ts
import { composeStories } from '@storybook/react-vite';
import * as stories from './ComponentName.stories';

const { Primary, Secondary, ... } = composeStories(stories);
```

## Accessibility Standards

### A11y Addon Integration
- All stories run through `@storybook/addon-a11y`
- Test level set to 'todo' for development feedback
- Focus states must be clearly documented
- Color contrast verification required

### Required Accessibility Stories
Every component should include these accessibility-focused stories:

#### 1. AccessibilityBasics
- ARIA labels and descriptions
- Loading states
- Proper button semantics
- Screen reader considerations

#### 2. KeyboardNavigation  
- Tab order verification
- Focus management
- Keyboard activation (Enter/Space)
- Focus indicators

#### 3. ColorContrastDemo
- WCAG 2.1 AA compliance verification
- Various background contexts
- Disabled state contrast
- Size-based readability

### A11y Story Configuration
```typescript
export const AccessibilityExample: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard',
            enabled: true,
          },
        ],
      },
    },
  },
};
```

### Accessibility ArgTypes
Include ARIA properties in argTypes:
```typescript
argTypes: {
  'aria-label': {
    control: 'text',
    description: 'Accessible label when button text is not descriptive enough',
  },
  'aria-describedby': {
    control: 'text', 
    description: 'ID of element that describes the button',
  },
  'aria-pressed': {
    control: 'boolean',
    description: 'For toggle buttons, indicates pressed state',
  },
}
```

### Focus Management
```typescript
// Document focus behavior in stories
argTypes: {
  // Focus-related props should explain keyboard navigation
}
```

## CSS & Styling

### Tailwind CSS Integration
- Storybook configured with `@tailwindcss/vite` plugin
- Main CSS file imported in `.storybook/preview.ts`
- All semantic tokens available in stories

### Style Dependencies
```typescript
// .storybook/preview.ts
import '../src/style.css' // Required for design tokens
```

## Error Handling

### Common Issues
1. **JSX in .ts files**: Use `.tsx` extension
2. **Missing imports**: Always import from correct paths
3. **Invalid hrefs**: Use real URLs, not `#` placeholders
4. **Missing fn()**: Interactive props need spy functions

### Validation
- All stories must compile without errors
- All stories must pass a11y checks
- All stories must render in tests

## File Templates

### Basic Story Template
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentName } from '../components/ComponentName';

/**
 * Component description and features
 */
const meta = {
  title: 'Rafters/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define all props
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

## Quality Checklist

Before committing story changes, verify:

### File Structure & Imports
- [ ] Uses `.tsx` extension for JSX content
- [ ] Correct relative import paths (`../../../components/Button`)
- [ ] Imports `fn` from `storybook/test` for interactive props
- [ ] Follows proper title hierarchy (`03 Components/Action/Button`)

### Story Content & Testing
- [ ] Includes comprehensive JSDoc with design philosophy
- [ ] Uses semantic tokens (never arbitrary colors)
- [ ] Interactive stories include `onClick: fn()` in args
- [ ] Stories render without errors in Vitest
- [ ] Covers intelligence patterns specific to component
- [ ] Documents accessibility features and ARIA properties

### Design System Compliance
- [ ] Examples use semantic color tokens (`text-primary`, not `text-blue-500`)
- [ ] Stories demonstrate proper semantic meaning
- [ ] Accessibility patterns follow WCAG AAA standards
- [ ] Intelligence stories show cognitive load considerations

### Technical Requirements
- [ ] Compiles without TypeScript errors
- [ ] Passes Vitest story tests (`pnpm test-storybook`)
- [ ] Passes accessibility addon checks
- [ ] Uses proper component categories and naming conventions
- [ ] Main story includes `tags: ['!autodocs', '!dev', 'test']`

## Story Development Summary

**Our Storybook serves dual purposes:**
1. **Documentation** - Teaching design intelligence and proper component usage
2. **Testing** - Automated quality assurance via Vitest integration

**Key Principles:**
- **Intelligence-First** - Every component includes dedicated intelligence patterns
- **Semantic Tokens Only** - No arbitrary colors or values in examples
- **Functional Stories** - All stories must work as tests, not just documentation
- **Accessibility Focus** - WCAG AAA compliance demonstrated in dedicated stories

**File Organization:**
- Foundation stories document design system principles
- Component stories organized by category and type
- Intelligence stories show cognitive load and attention hierarchy
- All stories contribute to the component's educational value for AI agents
