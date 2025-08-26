# Storybook Standards for Rafters Design System

## New 3-File Component Architecture

Every component in the Rafters design system follows a streamlined 3-file structure that balances comprehensive documentation with maintainability.

### Required Files for Each Component

#### 1. `ComponentName.mdx` - Design Philosophy & Usage
**Purpose**: Primary documentation entry point with design philosophy and usage guidelines

**Location**: `/src/stories/components/{component}/ComponentName.mdx`

**Required Sections**:
- Component philosophy statement (why it exists)
- Design intelligence metrics (cognitive load, trust building, attention economics)
- Usage guidelines with DOs and NEVERs
- Interactive Canvas examples from main stories
- Real-world implementation patterns

**Template**:
```mdx
import { Meta, Canvas } from '@storybook/addon-docs/blocks';
import * as Stories from './ComponentName.stories.tsx';

<Meta title="Components/ComponentName" of={Stories} name="Overview" />

# Component Name

[Philosophy statement - why this component exists and its core purpose]

<Canvas of={Stories.AllVariants} />

## Design Intelligence

**Cognitive Load**: X/10 - [Brief explanation]
**Trust Building**: [How component builds user confidence]
**Attention Economics**: [How component manages user attention]

## Usage Guidelines

[Clear guidance on when and how to use the component]

#### DOs
- **Category Name**
  - Specific positive pattern
  - Another positive pattern

#### NEVERs
- **Category Name**
  - Anti-pattern to avoid
  - Common mistake to prevent

## Implementation Examples

<Canvas of={Stories.RealWorldExample} />
```

#### 2. `ComponentName.stories.tsx` - Comprehensive Component Showcase
**Purpose**: Complete component demonstration with all variants, states, and patterns in ONE file

**Location**: `/src/stories/components/{component}/ComponentName.stories.tsx`

**Required Elements**:
```typescript
// @componentStatus published | draft | deprecated
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentName } from '../../../components/ComponentName';

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '[Component description with embedded intelligence]',
      },
    },
  },
  argTypes: {
    // Comprehensive argTypes for all props
  },
  args: { 
    onClick: fn(), // Required for interactive components
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// REQUIRED STORIES:

export const AllVariants: Story = {
  // Show all visual variants in one story
};

export const Sizes: Story = {
  // Show all size options
};

export const States: Story = {
  // Loading, disabled, error states
};

export const SemanticContexts: Story = {
  // Real-world usage patterns
};

export const InteractiveStates: Story = {
  // Hover, focus, active states
};
```

#### 3. `ComponentNameAccessibility.stories.tsx` - WCAG AAA Compliance
**Purpose**: Comprehensive accessibility testing and demonstration

**Location**: `/src/stories/components/{component}/ComponentNameAccessibility.stories.tsx`

**Required Stories**:
```typescript
// @componentStatus published
// @version 0.1.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComponentName } from '../../../components/ComponentName';

const meta = {
  title: 'Components/ComponentName/Accessibility',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessibility compliance testing.',
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardNavigation: Story = {
  // Tab, Enter, Space, Arrow key support
};

export const ScreenReaderSupport: Story = {
  // ARIA labels and announcements
};

export const HighContrast: Story = {
  // High contrast mode testing
};

export const FocusManagement: Story = {
  // Focus indicators and traps
};
```

## Migration from 7-File to 3-File Structure

### What Gets Consolidated

**Into Main Stories File** (`ComponentName.stories.tsx`):
- `ComponentNameVariants.stories.tsx` → `AllVariants` story
- `ComponentNameProperties.stories.tsx` → `Sizes` and `States` stories
- `ComponentNameSemantic.stories.tsx` → `SemanticContexts` story
- `ComponentNameIntelligence.stories.tsx` → Embedded in story descriptions

**Remains Separate**:
- `ComponentName.mdx` - Primary documentation
- `ComponentNameAccessibility.stories.tsx` - Accessibility focus

### Example Migration

**Before** (7 files):
```
button/
  ├── Button.mdx
  ├── Button.stories.tsx
  ├── ButtonVariants.stories.tsx
  ├── ButtonProperties.stories.tsx
  ├── ButtonSemantic.stories.tsx
  ├── ButtonIntelligence.stories.tsx
  └── ButtonAccessibility.stories.tsx
```

**After** (3 files):
```
button/
  ├── Button.mdx                        # Philosophy & usage
  ├── Button.stories.tsx                # All variants, states, patterns
  └── ButtonAccessibility.stories.tsx   # Accessibility testing
```

## Component Status Annotations

Every main story file MUST include status comments:

```typescript
// @componentStatus published | draft | deprecated
// @version 0.1.0
```

**Status Values**:
- `published` - Ready for production, included in registry
- `draft` - In development, excluded from registry
- `deprecated` - Scheduled for removal

## Design Token Usage Requirements

### NEVER Use Arbitrary Values
```typescript
// ❌ WRONG - Teaches bad habits
className="text-green-600 bg-blue-500"
className="p-4 m-2"
```

### ALWAYS Use Semantic Tokens
```typescript
// ✅ CORRECT - Teaches proper system usage
className="text-success bg-primary"
className="p-md m-sm"
```

## Story Writing Principles

### 1. Consolidation Over Proliferation
- Combine related demonstrations into comprehensive stories
- Each story should showcase multiple related aspects
- Avoid separate files for minor variations

### 2. Real-World Focus
- Every story demonstrates practical usage patterns
- Include context for when to use each variant
- Show components in realistic combinations

### 3. Intelligence Embedding
- Include cognitive load ratings in descriptions
- Document trust-building patterns
- Explain attention hierarchy decisions

### 4. Interactive Requirements
- All interactive components must include `onClick: fn()`
- Stories serve as both documentation AND tests
- Broken stories corrupt AI training data

## Testing Requirements

All stories run as tests via `@storybook/addon-vitest`:

```bash
pnpm test              # Run all story tests
pnpm vitest run        # CI test runner
```

**Test Coverage Includes**:
- Component renders without errors
- Interactive handlers properly connected
- Props work as documented
- Accessibility requirements met

## Common Story Patterns

### Trust-Building Pattern
```typescript
export const TrustLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Button variant="outline">Low Trust Action</Button>
      <Button variant="primary">Medium Trust Action</Button>
      <Button variant="warning">High Trust Action</Button>
      <Button variant="destructive" destructiveConfirm>
        Critical Trust Action
      </Button>
    </div>
  ),
};
```

### Attention Hierarchy Pattern
```typescript
export const AttentionHierarchy: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="ghost">Low Attention</Button>
      <Button size="md" variant="secondary">Medium Attention</Button>
      <Button size="lg" variant="primary">High Attention</Button>
    </div>
  ),
};
```

### Loading States Pattern
```typescript
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Button loading>Processing...</Button>
      <Input loading placeholder="Loading..." />
      <Card loading>Loading content...</Card>
    </div>
  ),
};
```

## Quality Checklist

Before committing component stories:

- [ ] Status comment included (`// @componentStatus`)
- [ ] Version comment included (`// @version`)
- [ ] MDX file with philosophy and usage guidelines
- [ ] Main stories file with all variants consolidated
- [ ] Accessibility stories file with keyboard/screen reader tests
- [ ] All stories render without errors
- [ ] Interactive components have `fn()` handlers
- [ ] Only semantic tokens used (no arbitrary values)
- [ ] Real-world usage patterns demonstrated
- [ ] High contrast mode tested
- [ ] Cognitive load documented

## File Naming Conventions

- **MDX**: `ComponentName.mdx`
- **Main Stories**: `ComponentName.stories.tsx`
- **Accessibility**: `ComponentNameAccessibility.stories.tsx`
- **Titles**: `Components/ComponentName` (no subdirectories)

## Why This Structure?

### Benefits of 3-File System
1. **Maintainability**: Less duplication, easier updates
2. **Discoverability**: Clear purpose for each file
3. **Focus**: Accessibility never gets buried
4. **Efficiency**: Faster to create and review
5. **Testing**: Consolidated tests run faster

### What We Preserve
- Design philosophy documentation (MDX)
- Comprehensive variant showcase (Main stories)
- Accessibility focus (Dedicated file)
- Real-world patterns
- Intelligence embedding

### What We Eliminate
- File proliferation
- Duplicate content
- Maintenance overhead
- Navigation complexity
- Test fragmentation