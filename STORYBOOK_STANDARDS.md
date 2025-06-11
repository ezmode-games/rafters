# Storybook Coding Standards for Rafters

## Overview

This document establishes the coding standards and rules for creating Storybook stories in the Rafters design system. We use a **multi-file story architecture** that separates concerns into focused, single-purpose story files for comprehensive component documentation.

**Critical Rule: Stories must dogfood our design system.** All documentation examples should demonstrate proper usage of our semantic color tokens, spacing scale, and typography system rather than arbitrary colors or outdated defaults.

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

## Story Architecture Pattern

### Multi-File Component Stories

Components with significant complexity use **five dedicated story files** to provide comprehensive documentation:

1. **`ComponentName.stories.tsx`** - Main story with core variants
2. **`ComponentNameVariants.stories.tsx`** - Visual styling variants  
3. **`ComponentNameProperties.stories.tsx`** - Interactive properties and states
4. **`ComponentNameSemantic.stories.tsx`** - Semantic usage patterns
5. **`ComponentNameAccessibility.stories.tsx`** - Accessibility demonstrations

### File Organization Structure
```
src/stories/
├── Button.stories.tsx              # Main button story
├── ButtonVariants.stories.tsx      # Visual variants (outline, ghost, etc)
├── ButtonProperties.stories.tsx    # Interactive properties (size, disabled, etc)
├── ButtonSemantic.stories.tsx      # Semantic variants (destructive, success, etc)
└── ButtonAccessibility.stories.tsx # Accessibility patterns
```

### Title Hierarchy Convention

All story files follow a consistent hierarchy pattern:

```typescript
// Main component story
title: '03 Components/Category/ComponentName'

// Variant story files  
title: '03 Components/Category/ComponentName/Visual Variants'
title: '03 Components/Category/ComponentName/Properties & States'
title: '03 Components/Category/ComponentName/Semantic Variants'
title: '03 Components/Category/ComponentName/Accessibility'
```

**Categories include:**
- `Action` - Interactive elements (Button, Link)
- `Input` - Form controls (Input, Select, Slider)
- `Display` - Content presentation (Card, Badge)
- `Layout` - Structural components (Container, Grid)

## File Structure & Naming

### File Extensions
- **Use `.tsx` extension** for all story files that contain JSX
- **Use `.ts` extension** only for stories without JSX content

### Import Standards
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentName } from '../components/ComponentName';
```

## Story Configuration

### Meta Configuration Template

#### Autodocs Warning

**IMPORTANT: Avoid using `tags: ['autodocs']` for Identity/Design System pages.** 

Autodocs automatically generates documentation content that duplicates the custom educational content in our stories, creating poor UX with repeated information. Our Identity pages (Colors, Typography, Layout System, etc.) use carefully crafted custom content that should be the only documentation presented.

```typescript
// ❌ DON'T USE - Creates duplicate content
const meta = {
  title: '01 Identity/Layout System',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'], // This duplicates story content
} satisfies Meta;

// ✅ CORRECT - Clean educational content only
const meta = {
  title: '01 Identity/Layout System', 
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
```

#### Main Component Story
```typescript
const meta = {
  title: '03 Components/Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The foundational description that establishes component purpose and design philosophy.',
      },
    },
  },
  argTypes: {
    // Define controls for all public props
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'link'],
      description: 'Visual styling variant of the component',
    },
    size: {
      control: 'select', 
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size variant for different contexts',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
  args: { onClick: fn() }, // For interactive props
} satisfies Meta<typeof ComponentName>;
```

#### Variant Story Files
```typescript
const meta = {
  title: '03 Components/Category/ComponentName/Visual Variants',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Focused description of the specific aspect covered by this story file.',
      },
    },
  },
  // Minimal argTypes - only relevant to this specific aspect
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'link'],
    },
  },
} satisfies Meta<typeof ComponentName>;
```

## Story Purpose & Content

### Main Component Story (`ComponentName.stories.tsx`)
**Purpose:** Primary documentation and core use cases
**Content:**
- Default/Primary story showcasing most common usage
- Key variants that represent different use cases
- Comprehensive argTypes for all component props
- Design philosophy and usage principles in JSDoc

**Example stories:** Default, Primary, Secondary, Large, Small

### Visual Variants (`ComponentNameVariants.stories.tsx`)
**Purpose:** Showcase all visual styling options
**Content:**
- All available `variant` prop values
- Visual styling demonstrations
- Style-focused argTypes only
- Minimal interactivity

**Example stories:** Default, Outline, Ghost, Link, AllVariants

### Properties & States (`ComponentNameProperties.stories.tsx`)
**Purpose:** Interactive properties and component states
**Content:**
- Size variations
- Disabled states
- Loading states
- Interactive demonstrations
- Property-focused argTypes

**Example stories:** Sizes, Disabled, Loading, WithIcon, Interactive

### Semantic Variants (`ComponentNameSemantic.stories.tsx`)
**Purpose:** Semantic meaning and context-aware usage
**Content:**
- Destructive actions
- Success states
- Warning states
- Contextual usage patterns
- Semantic token integration

**Example stories:** Destructive, Success, Warning, Info

### Accessibility (`ComponentNameAccessibility.stories.tsx`)
**Purpose:** Accessibility patterns and WCAG compliance
**Content:**
- ARIA properties demonstrations
- Keyboard navigation examples
- Screen reader considerations
- Color contrast verification
- Focus management

**Example stories:** AriaLabels, KeyboardNavigation, ScreenReader, ColorContrast

## Required Documentation
## Required Documentation

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

Before submitting a story, verify:

- [ ] Uses correct file extension (.tsx for JSX)
- [ ] Imports from correct component path
- [ ] Includes comprehensive JSDoc documentation
- [ ] Covers all variants and states
- [ ] Has descriptive story names and descriptions
- [ ] Uses semantic token language in descriptions
- [ ] Includes accessibility considerations and stories
- [ ] Documents ARIA properties in argTypes
- [ ] Includes AccessibilityBasics story
- [ ] Includes KeyboardNavigation story  
- [ ] Includes ColorContrastDemo story
- [ ] Compiles without errors
- [ ] Passes all tests
- [ ] Passes a11y checks
- [ ] Renders correctly in Storybook
- [ ] Follows naming conventions
- [ ] Uses `fn()` for interactive props
- [ ] Meets WCAG 2.1 AA contrast requirements
- [ ] Supports keyboard navigation
- [ ] Has visible focus indicators

## Next Steps

This Button story template establishes the foundation for all future component stories. When creating stories for Input, Select, Slider, Card, Label, and Tabs components, follow this exact pattern and structure.
