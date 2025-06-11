# Rafters

## A shared language between humans and computers for creating consistent digital experiences.

## The Human Side

- Principles: Why we make certain design decisions
- Tokens: The atomic building blocks (colors, spacing, typography)
- Components: Reusable UI patterns that solve real problems
- Guidelines: How to use these pieces together effectively

## The Computer Side

- Code: Components that actually work in production
- Documentation: Machine-readable specs for consistency
- Tooling: Systems that help humans apply the design system correctly
- Automation: Catching inconsistencies before they ship

## The Bridge
The magic happens where these two sides meet - when a designer's intent translates seamlessly into working code, and when developers can make design decisions that feel natural and consistent.

#### What makes a design system successful? 
It disappears. Teams stop thinking about "is this button the right size?" and start thinking about "does this solve the user's problem?"

---

## Rafters' Approach: Grayscale-First Design Systems

### The Problem with Existing Solutions

**Design Systems are either too rigid or too scattered:**
- **Pre-styled libraries** (like shadcn) feel constraining to designers who need creative freedom
- **Build-from-scratch** approaches lack systematic structure and completeness
- **Enterprise tools** are overkill for small teams and individual designers
- **AI assistants** have no context about your specific design decisions

### Our Solution: Complete Foundation + Designer Freedom

Rafters starts with a **complete, unstyled component library** and lets designers add their creative layer through an intuitive wizard. The result? A fully systematic design system that's uniquely yours, accessible to AI assistants.

## The Four-Layer Architecture

### Layer 1: Grayscale Foundation (Complete & Unstyled)
**Every component, every state, every variant - in simple gray**

**Core Components:**
- **Buttons**: primary, secondary, destructive, outline, ghost, link
- **Forms**: input, textarea, select, checkbox, radio, switch, slider
- **Navigation**: tabs, breadcrumbs, pagination, menu, sidebar
- **Feedback**: alert, toast, modal, tooltip, progress, skeleton
- **Data Display**: table, card, list, badge, avatar, calendar
- **Layout**: container, grid, stack, divider, separator

**Every State Included:**
- **Interactive**: default, hover, focus, active, disabled
- **Status**: loading, error, success, warning, info
- **Size**: small, medium, large, extra-large
- **Variants**: filled, outlined, ghost, minimal

**Built on Proven Foundations:**
- **Radix Primitives**: Rock-solid accessibility and interaction patterns
- **Modern CSS**: Container queries, CSS Grid, custom properties
- **TypeScript**: Full type safety and IntelliSense support
- **Zero Visual Opinions**: Pure functionality, maximum flexibility

### Layer 1.5: Opinionated Tech Stack (AI-Optimized Patterns)
**Consistent tooling choices eliminate decision paralysis for AI development**

**The problem:** AI assistants work best with predictable patterns. Too many choices lead to inconsistent implementations and decision fatigue - especially for non-technical users building with AI.

**The solution:** Rafters is strategically opinionated about the tech stack to optimize for AI development and non-technical user success.

**Core Technology Decisions:**
```typescript
// Validation: Always Zod (never Yup, Joi, or others)
import { z } from 'zod'
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

// State Management: Always Zustand (never Redux, XState, Jotai)
import { create } from 'zustand'
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

// Forms: Always React 19 built-in forms + Zod (native patterns)
import { useFormState, useFormStatus } from 'react'

// HTTP: Always fetch with custom hooks (no axios complexity)
const { data, loading, error } = useFetch('/api/users')

// Styling: Always Tailwind CSS (utility-first, predictable)
<button className="bg-primary text-primary-foreground px-4 py-2 rounded">

// Components: Always Radix + Rafters (accessibility + design system)
import { Button } from '@rafters/ui'
```

**Why These Specific Choices:**

**Zod over Yup/Joi:**
- Better TypeScript integration (types inferred automatically)
- More predictable API for AI to learn
- Composable schemas that work across client/server
- No runtime type confusion

**Zustand over Redux/XState:**
- Simpler mental model for non-technical users
- Less boilerplate for AI to generate
- Perfect for component-level state needs
- No complex state machines required in typical Rafters projects

**React 19 Forms over React Hook Form:**
- Native React patterns (no external dependencies)
- Built-in loading states with useFormStatus
- Server Actions for progressive enhancement
- Simpler mental model for non-technical users
- More predictable form patterns for AI implementation

**Custom fetch hooks over Axios:**
- Leverage native browser APIs
- Less dependency weight
- Simpler error handling patterns
- More predictable for AI implementation

**Benefits for AI Development:**
- **Zero Ambiguity**: AI knows exactly which tools to use
- **Consistent Patterns**: Every Rafters project feels familiar
- **Predictable Code**: AI can learn common patterns and apply them reliably
- **Non-Technical Friendly**: UX people don't need to learn multiple approaches
- **Better Training Data**: MCP server learns from consistent implementations

**Benefits for Users:**
- **Faster Development**: No decision paralysis about tool choices
- **Consistent Codebases**: All Rafters projects have similar structure
- **Easier Handoffs**: Engineers joining later find familiar patterns
- **AI Confidence**: Assistants build with more certainty and fewer questions

### Layer 2: Designer Wizard (Your Creative Vision)
**Intuitive UI that transforms grayscale foundation into your design system**

**Visual Identity Setup:**
```
🎨 Brand Colors
   Primary color picker → Auto-generates accessible palette
   Secondary/accent colors → Systematic color relationships
   
🔄 Border Radius
   Sharp ◻ ————————————— Pill ◉
   
✨ Shadows & Depth
   Flat ▢ ————————————— Dramatic ▣
   
🏃 Motion & Animation
   None ⏸ ————————————— Playful 🎪
   
📏 Spacing Scale
   Tight 📏 ————————————— Airy 📐
   
✍️ Typography
   Font selection + automatic scale generation
```

**Real-time Token Generation:**
```css
/* Generated automatically from your choices */
@theme {
  --color-primary: #your-brand-color;
  --color-primary-foreground: auto; /* calculated for accessibility */
  --radius-base: 8px; /* from radius slider */
  --shadow-depth: 0.25; /* from shadow preference */
  --motion-duration: 200ms; /* from animation preference */
  --spacing-unit: 0.25rem; /* from spacing scale */
  --font-family-primary: "Your Font"; /* from font selection */
}
```

**Live Preview Integration:**
- Every adjustment updates all components instantly
- See your design system applied across everything
- No guessing - immediate visual feedback
- Iterate and refine in real-time

### Layer 3: Storybook Documentation (Interactive Showcase)
**Your design system comes alive with comprehensive documentation**

**Auto-Generated Stories:**
- Every component with all variants and states
- Interactive controls for testing edge cases
- Accessibility testing and validation
- Usage guidelines and best practices

**Design System Playground:**
- Tweak tokens and see live updates
- Copy/paste component code
- Export design system configuration
- Share with team members

**Documentation Standards:**
```mdx
# Button Component

## Purpose
Primary action triggers for user interactions

## Usage Guidelines
- Use primary buttons for main actions
- Limit to one primary button per page section
- Secondary buttons for alternative actions

## Accessibility
- Minimum 44px touch target
- Focus indicators meet WCAG 2.1 AA
- Screen reader friendly labels

## States & Variants
- Default, hover, focus, disabled, loading
- Primary, secondary, destructive, outline, ghost
```

### Layer 4: AI Accessibility (MCP Integration)
**Your design system becomes AI-readable and actionable**

**MCP Server Capabilities:**
- Reads your design tokens and component specifications
- Understands your specific design decisions and rationale
- Provides context about component usage patterns
- Suggests appropriate components for design problems

**AI Tools for Design Systems:**
```typescript
// MCP tools that understand YOUR design system
interface RaftersAITools {
  getComponentSuggestions(requirement: string): Component[]
  validateDesignConsistency(code: string): ValidationResult
  generateComponentVariant(base: Component, requirements: string): Component
  explainDesignDecision(token: string): DesignRationale
}
```

**AI-Assisted Development:**
- "Create a settings page using our design system"
- "Make this button match our error state patterns"
- "Suggest spacing that follows our scale"
- "Check if this layout meets our accessibility standards"

## Implementation Workflow

### Phase 1: Foundation Setup (Day 1)
1. **Install Rafters**: Complete component library in grayscale
2. **Run Setup Wizard**: Define your visual identity through UI
3. **Generate Tokens**: Automatic creation of systematic design tokens
4. **Preview in Storybook**: See your design system applied everywhere

### Phase 2: Customization (Week 1)
1. **Refine Choices**: Iterate on colors, spacing, typography
2. **Add Brand Assets**: Logos, custom icons, illustrations
3. **Document Patterns**: Usage guidelines and best practices
4. **Team Sharing**: Export/import configurations

### Phase 3: AI Integration (Week 2)
1. **Connect MCP Server**: Enable AI access to your design system
2. **Train AI Context**: Your specific patterns and preferences
3. **Development Workflow**: AI-assisted component creation
4. **Consistency Checking**: Automated design system validation

### Phase 4: Evolution (Ongoing)
1. **Component Extensions**: Add new components as needed
2. **Pattern Documentation**: Capture design decisions in Storybook
3. **AI Learning**: System gets smarter about your preferences
4. **Team Collaboration**: Shared design system knowledge

## Technical Architecture

### Core Technologies
- **Storybook**: Documentation and preview environment
- **Radix Primitives**: Accessibility and interaction foundation
- **Tailwind CSS**: Utility-first styling system
- **TypeScript**: Type safety and developer experience
- **MCP (Model Context Protocol)**: AI integration standard

### Token System Architecture

**The Three-Layer Token System:**
Components never reference base tokens directly. Instead, they use semantic tokens, which can be reassigned to different base tokens without touching component code.

**Base Tokens (Foundation):**
```css
/* Raw values - the design system's atomic units */
@layer base {
  /* Colors - Grayscale foundation + brand colors */
  --gray-50: #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;
  --gray-950: #09090b;
  
  /* Brand colors (from wizard) */
  --blue-500: #3b82f6;
  --red-500: #ef4444;
  --green-500: #22c55e;
  --yellow-500: #eab308;
  
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Radius scale */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}
```

**Semantic Tokens (Assignments):**
```css
/* Semantic meaning - these can be reassigned without touching components */
@layer semantic {
  /* Primary colors - can point to any base color */
  --color-primary: var(--blue-500);
  --color-primary-foreground: var(--gray-50);
  
  /* Surface colors */
  --color-background: var(--gray-50);
  --color-foreground: var(--gray-900);
  --color-muted: var(--gray-100);
  --color-muted-foreground: var(--gray-500);
  
  /* Interactive states */
  --color-destructive: var(--red-500);
  --color-destructive-foreground: var(--gray-50);
  
  /* Spacing assignments */
  --spacing-xs: var(--space-2);
  --spacing-sm: var(--space-3);
  --spacing-md: var(--space-4);
  --spacing-lg: var(--space-6);
  
  /* Radius assignments */
  --radius-button: var(--radius-md);
  --radius-input: var(--radius-md);
  --radius-card: var(--radius-lg);
}
```

**Component Tokens (Implementation):**
```css
/* How components actually use the tokens */
@layer component {
  /* Button variants use semantic tokens */
  --button-primary-bg: var(--color-primary);
  --button-primary-fg: var(--color-primary-foreground);
  --button-secondary-bg: var(--color-muted);
  --button-secondary-fg: var(--color-foreground);
  --button-destructive-bg: var(--color-destructive);
  --button-destructive-fg: var(--color-destructive-foreground);
  
  /* Button sizing uses semantic spacing */
  --button-padding-sm: var(--spacing-xs) var(--spacing-sm);
  --button-padding-md: var(--spacing-sm) var(--spacing-md);
  --button-padding-lg: var(--spacing-md) var(--spacing-lg);
  
  /* Button styling uses semantic radius */
  --button-radius: var(--radius-button);
}
```

**Token Reassignment Example:**
To change the primary color from blue to green across the entire system:
```css
/* Only change this one line */
--color-primary: var(--green-500); /* was var(--blue-500) */

/* All buttons, inputs, and components automatically update */
/* No component code changes needed */
```

**Benefits:**
- **Single Source of Truth**: Change semantic assignments to update entire system
- **Component Isolation**: Components never know about base tokens
- **Design System Evolution**: Rebrand by reassigning semantic tokens
- **Tailwind Integration**: Semantic tokens map to Tailwind utility classes

### Component Architecture

**Components use semantic tokens through Tailwind utility classes:**

```tsx
// Base component (unstyled functionality from Radix)
import * as RadixButton from '@radix-ui/react-primitive'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

// Styled with semantic tokens via Tailwind classes
export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <RadixButton.Root
      className={cn(
        // Base styles using semantic tokens
        'inline-flex items-center justify-center rounded-[var(--radius-button)]',
        'font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Variant styles using semantic tokens
        {
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)]/90': variant === 'primary',
          'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80': variant === 'secondary',
          'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:bg-[var(--color-destructive)]/90': variant === 'destructive',
          'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)]': variant === 'outline',
          'hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]': variant === 'ghost',
        },
        
        // Size styles using semantic spacing
        {
          'h-8 px-[var(--spacing-xs)] text-sm': size === 'sm',
          'h-10 px-[var(--spacing-md)]': size === 'md',
          'h-12 px-[var(--spacing-lg)] text-lg': size === 'lg',
        }
      )}
      {...props}
    />
  )
}
```

**Key Principles:**
- **Semantic Token Usage**: Components only reference semantic tokens like `--color-primary`, never base tokens like `--blue-500`
- **Tailwind Integration**: Use `bg-[var(--semantic-token)]` syntax for custom properties
- **Radix Foundation**: All interactive components built on Radix Primitives for accessibility
- **Variant-Driven**: Styling decisions controlled by props, not hardcoded classes

**Rebranding Example:**
```css
/* To switch from blue to green primary color */
--color-primary: var(--green-500); /* was var(--blue-500) */

/* All primary buttons, inputs, and branded elements automatically update */
/* No component code changes needed */
```

## Success Metrics

**For Designers:**
- Complete creative freedom with systematic structure
- Instant visual feedback on design decisions
- No fighting against pre-made design opinions
- Professional-quality design system in hours, not weeks

**For Developers:**
- AI that understands your specific design system
- Consistent component implementation
- Type-safe development experience
- Automatic accessibility best practices

**For Teams:**
- Shared design language that evolves with your product
- Documentation that stays current with code
- AI-assisted design system adherence
- Scalable foundation for product growth

**The ultimate goal:** Your design system becomes an intelligent creative partner that amplifies both human creativity and AI assistance.
