# Rafters Architecture
## Shadcn-Style Component Distribution with Design Intelligence

*Components as source code with embedded design reasoning*

---

## Core Approach

Rafters follows the shadcn model but adds design intelligence patterns:
- **Install components as source code** (not npm dependencies)
- **Embed design reasoning** in comments, manifest, and stories
- **Web configurator** generates design tokens
- **CLI tool** handles component installation

---

## Three-Layer Intelligence System

### 1. Component Comments (Essential Patterns)
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns  
 * Full patterns: .rafters/agent-instructions.md
 */
export const Button = ...
```

### 2. Component Manifest (Machine-Readable Fallback)
```json
{
  "components": {
    "Button": {
      "path": "components/ui/button.tsx",
      "story": "stories/button-intelligence.stories.tsx", 
      "intelligence": {
        "cognitiveLoad": 3,
        "attentionEconomics": "Size hierarchy: sm=tertiary, md=secondary, lg=primary",
        "accessibility": "44px touch targets, WCAG AAA contrast",
        "trustBuilding": "Destructive variant needs confirmation patterns",
        "semanticMeaning": "Primary=main action, Secondary=optional, Destructive=careful consideration"
      }
    }
  }
}
```

### 3. Intelligence Stories (Complete Education)
Full Storybook stories demonstrating design reasoning, accessibility patterns, and cognitive load optimization.

---

## System Components

### Web Configurator
- **Input**: Grayscale foundation components
- **Configuration**: Colors, spacing, typography, borders
- **Output**: Tailwind v4+ CSS custom properties
- **Features**: Real-time preview, export CSS

### CLI Tool
```bash
npx rafters init     # Setup project with token system
npx rafters add <component>  # Install component + intelligence
```

### Project Structure After Init
```
project/
├── .rafters/
│   ├── agent-instructions.md    # AI usage patterns
│   ├── config.json             # CLI configuration  
│   └── component-manifest.json # Intelligence fallback
├── src/
│   ├── components/ui/          # Installed components
│   ├── stories/               # Intelligence stories (if Storybook)
│   └── tokens.css             # Design system tokens
└── tailwind.css               # Includes tokens
```

---

## CLI Commands

### `npx rafters init`
**Purpose**: Initialize Rafters in project

**Flow**:
1. Detect package manager (pnpm/npm/yarn)
2. Check for existing Tailwind CSS installation
3. Ask: "Do you use Storybook? (y/N)"
4. If yes: "Stories path? (./src/stories)"
5. Create `.rafters/` directory structure
6. Install required dependencies (Radix primitives, clsx, tailwind-merge)
7. Generate initial config and agent instructions

**Creates**:
- `.rafters/config.json`
- `.rafters/agent-instructions.md`
- `.rafters/component-manifest.json`
- `src/components/ui/` directory

### `npx rafters add <component>`
**Purpose**: Install component with intelligence patterns

**Flow**:
1. Read `.rafters/config.json`
2. Download component source from registry
3. Write to `src/components/ui/<component>.tsx`
4. Add intelligence comment header
5. Update `.rafters/component-manifest.json`
6. If Storybook configured: add intelligence story
7. Install any missing Radix dependencies

**Example**:
```bash
npx rafters add button
✓ Installing Button component...
✓ Adding intelligence patterns...
✓ Updating component manifest...
✓ Adding Button story...
✓ Button installed with design intelligence
```

---

## Token System

### Web Configurator Output
```css
/* Generated from web configurator */
@import "tailwindcss";

@theme {
  /* Brand Colors (from configurator) */
  --color-primary: #your-brand-color;
  --color-primary-foreground: auto; /* calculated for accessibility */
  
  /* Spacing Scale (φ-based) */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.618rem;
  
  /* Typography Scale */
  --font-family-primary: "Your Font";
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  
  /* Border Radius */
  --radius-base: 8px;
  --radius-lg: 12px;
  
  /* Component-Specific Tokens */
  --button-padding-sm: var(--spacing-xs) var(--spacing-sm);
  --button-padding-md: var(--spacing-sm) var(--spacing-md);
  --button-padding-lg: var(--spacing-md) var(--spacing-lg);
}
```

### Component Usage
```tsx
export const Button = ({ size = 'md', variant = 'primary', ...props }) => {
  return (
    <button
      className={cn(
        // Base styles using semantic tokens
        'inline-flex items-center justify-center rounded-[var(--radius-base)]',
        'font-medium transition-colors focus-visible:outline-none',
        
        // Size variants using token system
        {
          'h-8 px-[var(--spacing-xs)] text-sm': size === 'sm',
          'h-10 px-[var(--spacing-md)]': size === 'md',
          'h-12 px-[var(--spacing-lg)] text-lg': size === 'lg',
        },
        
        // Color variants using semantic tokens
        {
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]': variant === 'primary',
          'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]': variant === 'secondary',
        }
      )}
      {...props}
    />
  )
}
```

---

## Intelligence Distribution

### Why This Approach Works for AI

**1. Source Code Ownership**
- AIs can read and understand complete implementation
- No black box dependencies to reverse-engineer
- Intelligence patterns embedded in readable code

**2. Layered Intelligence Access**
- **Comments**: Immediate essential patterns
- **Manifest**: Machine-readable intelligence data
- **Stories**: Complete design education

**3. Local MCP Integration**
- Components become part of local codebase context
- MCP server can analyze specific implementations
- Intelligence patterns inform local AI decisions

**4. Educational Value**
- Teams learn design intelligence by reading code
- Intelligence patterns transfer to new components
- Design reasoning becomes part of team knowledge

### Benefits Over Traditional Libraries

**Traditional Approach**:
```tsx
import { Button } from 'some-library'
// AI knows: "it's a button component"
```

**Rafters Approach**:
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, size=attention hierarchy
 * Destructive variant REQUIRES confirmation UX patterns
 */
export const Button = ({ variant, size, ...props }) => {
  // Full implementation with design reasoning
}
// AI knows: implementation + design intelligence + usage patterns
```

---

## Future Enhancements

### Version 1.0
- Web configurator for token generation
- CLI for component installation
- Core component library with intelligence patterns

### Version 2.0
- Component registry with community contributions
- Advanced intelligence patterns (animations, micro-interactions)
- MCP server integration for local AI assistance

### Version 3.0
- Design intelligence validation tools
- Automated accessibility testing
- Intelligence pattern evolution tracking

---

## Technical Constraints

### Requirements
- **Tailwind CSS v4+** (CSS-first configuration)
- **React 18+** 
- **Radix UI primitives** (accessibility foundation)

### Non-Requirements
- No config file syncing (CSS custom properties only)
- No version management (source code ownership)
- No customization preservation (manual maintenance)

### Philosophy
- **Simple overwrites** - delete and rewrite, no merging
- **Source code ownership** - your code, your responsibility
- **Intelligence preservation** - design reasoning travels with code
- **Non-invasive** - doesn't modify existing project files

This architecture provides the intelligent foundation (like rafters) while respecting that each project needs to own and evolve their components according to their specific needs.