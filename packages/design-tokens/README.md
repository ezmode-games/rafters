# @rafters/design-tokens

**AI-First Design Token System with Embedded Intelligence**

A mathematical design token generation system that creates tokens with embedded AI intelligence metadata for systematic UI decision-making. Each token carries semantic meaning, accessibility information, and usage context that AI agents can understand and apply.

## Architecture Overview

```
Design Tokens → CSS Custom Properties → Tailwind Utilities → Components
     ↓                    ↓                     ↓              ↓
AI Intelligence     @theme config        bg-primary      Button variants
Cognitive Load      --color-primary      text-destructive   Trust patterns
Trust Levels        oklch(0.45 0.12...)  hover:bg-primary/90  Usage rules
```

## ⚠️ CRITICAL ARCHITECTURAL PRINCIPLE ⚠️

**JSON FILES ARE THE SINGLE SOURCE OF TRUTH**

- **NO defaults in code** - generators create initial JSON files, then JSON files are the truth
- **NO hardcoded token values** - always read from `.rafters/tokens/*.json` files  
- **NO fallback token generation** - if JSON files don't exist, create them first, then read them
- **Studio modifies JSON files** - humans edit tokens through Studio interface
- **CLI only reads JSON files** - `createRegistry()` reads existing JSON, never creates tokens

**Correct Flow:**
1. **CLI init** → Generators create `.rafters/tokens/*.json` files → `createRegistry()` reads JSON files
2. **Studio usage** → Humans modify JSON files → `createRegistry()` reads updated JSON files  
3. **CLI operations** → Always `createRegistry()` reads JSON files

**NEVER:**
- ❌ `createDefaultRegistry()` with hardcoded values
- ❌ Bypassing JSON files with in-memory token generation
- ❌ Fallback to hardcoded tokens when JSON files exist

## Core Concept

**Every token is more than a value - it's embedded design reasoning.**

Traditional design tokens:
```typescript
{ name: 'red-500', value: '#ef4444' }
```

Rafters design tokens with AI intelligence:
```typescript
{
  name: 'destructive',
  value: 'oklch(0.4 0.15 20)',
  darkValue: 'oklch(0.6 0.15 20)',
  category: 'color',
  semanticMeaning: 'Destructive actions - permanent consequences, requires confirmation patterns',
  trustLevel: 'critical',
  cognitiveLoad: 7,
  usageContext: ['delete', 'destroy', 'permanent-action'],
  accessibilityLevel: 'AAA',
  consequence: 'irreversible'
}
```

## Token Generators (18 Total)

### Mathematical Systems
- **spacing.ts** - Linear/exponential spacing scales with cognitive load mapping
- **typography.ts** - Golden ratio, major second, perfect fourth typography scales
- **depth.ts** - Z-index layering with semantic stacking contexts
- **height.ts** - Vertical rhythm systems with line-height relationships

### Color Intelligence
- **color.ts** - Semantic OKLCH color system with trust-level mapping
- **opacity.ts** - Contextual transparency with accessibility compliance

### Motion & Interaction
- **motion.ts** - Animation timing with personality and reduced-motion awareness
- **border-radius.ts** - Corner radius system from sharp to organic
- **touch-target.ts** - WCAG AAA compliant touch targets with mobile optimization

### Typography System
- **font-family.ts** - Semantic font stacks with personality descriptions
- **font-weight.ts** - Weight system with attention hierarchy
- **letter-spacing.ts** - Tracking system for readability optimization

### Layout Intelligence
- **breakpoint.ts** - Container queries with cognitive complexity mapping
- **width.ts** - Responsive width system with content-appropriate sizing
- **grid.ts** - Grid token system with mathematical relationships

### Advanced Patterns
- **aspect-ratio.ts** - Including golden ratio (phi) proportions
- **transform.ts** - 3D transformations with interaction feedback
- **backdrop.ts** - Backdrop filter effects with accessibility considerations
- **border-width.ts** - Semantic border system with visual hierarchy

## Token Schema

Every token conforms to this TypeScript interface:

```typescript
interface Token {
  name: string                    // Semantic name (e.g., 'primary', 'primary-dark')
  value: string | ColorValue      // Simple string OR rich ColorValue object
  category: string                // Token category ('color', 'spacing', etc.)
  namespace: string               // Grouping namespace
  
  // AI Intelligence Metadata
  semanticMeaning: string         // What this token communicates
  cognitiveLoad: number          // Mental effort required (1-10)
  trustLevel: 'low' | 'medium' | 'high' | 'critical'
  usageContext: string[]         // When/where to use
  
  // Technical Metadata  
  scalePosition: number          // Position in mathematical scale
  generateUtilityClass: boolean  // Should generate Tailwind utility
  applicableComponents: string[] // Which components can use this
  
  // Accessibility
  accessibilityLevel: 'A' | 'AA' | 'AAA'
  reducedMotionAware?: boolean   // Respects prefers-reduced-motion
  contrastCompliant?: boolean    // Meets contrast requirements
}
```

### Color Tokens Are Special

While most tokens have simple string values (`"4px"`, `"300ms"`), **color tokens** use `ColorValue` objects with rich intelligence:

```typescript
interface ColorValue {
  name: string                    // Fancy name (e.g., 'ocean-blue')
  scale: OKLCH[]                  // Array of OKLCH values [50,100,200...900]
  token?: string                  // Semantic assignment (e.g., 'primary')
  value?: string                  // Scale position (e.g., '500')
  use?: string                    // Human reasoning for color choice
  states?: Record<string, string> // Interaction states {hover: '600', focus: '700'}
  
  // Intelligence from color-intel API (populated from cache)
  intelligence?: {
    reasoning: string             // Why this OKLCH combination works
    emotionalImpact: string       // Psychological responses
    culturalContext: string       // Cross-cultural meanings
    accessibilityNotes: string    // WCAG guidance
    usageGuidance: string         // When/how to use
  }
  harmonies?: { ... }            // Mathematical color relationships
  accessibility?: { ... }        // Contrast ratios and compliance
  analysis?: { ... }             // Temperature, lightness, etc.
}
```

### Dark Mode Pattern

Dark mode uses separate tokens with `-dark` suffix:
- Light: `{ name: 'primary', value: ColorValueObject }`
- Dark: `{ name: 'primary-dark', value: ColorValueObject }`

This keeps tokens self-contained and explicit. The CSS handles switching via media queries.

## Usage Patterns

### 1. Generate All Tokens
```typescript
import { generateAllTokens } from '@rafters/design-tokens'

const tokens = generateAllTokens()
// Returns 200+ tokens with full AI intelligence metadata
```

### 2. Generate Specific Categories
```typescript
import { generateColorTokens, generateMotionTokens } from '@rafters/design-tokens'

const colors = generateColorTokens()  // Semantic color system
const motion = generateMotionTokens() // Animation with personality
```

### 3. Export for Consumption
```typescript
import { exportTokens } from '@rafters/design-tokens'

// Export as CSS custom properties
const css = exportTokens(tokens, 'css')

// Export as Tailwind config
const tailwindConfig = exportTokens(tokens, 'tailwind')

// Export as Style Dictionary
const styleDict = exportTokens(tokens, 'style-dictionary')
```

## Component Integration

Components consume tokens through semantic Tailwind utilities:

```tsx
// Button.tsx - Uses semantic tokens with trust-building logic
<button className={cn(
  'bg-primary text-primary-foreground',      // Semantic colors
  'hover:bg-primary/90',                     // Interaction feedback  
  variant === 'destructive' && [
    'bg-destructive text-destructive-foreground',  // Critical trust level
    'font-semibold shadow-sm'                      // Enhanced visual weight
  ]
)}>
```

The tokens flow through this pipeline:
1. **Token Generator** creates `{ name: 'primary', value: 'oklch(0.45 0.12 240)' }`
2. **CSS Export** becomes `--color-primary: oklch(0.45 0.12 240)`
3. **Tailwind v4** generates `.bg-primary { background: var(--color-primary) }`
4. **Component** uses semantic class with embedded design reasoning

## Design Intelligence Examples

### Trust-Building Color System
```typescript
// color.ts
{
  name: 'destructive',
  trustLevel: 'critical',          // Requires confirmation patterns
  cognitiveLoad: 7,               // High mental effort
  consequence: 'irreversible',     // Permanent action
  usageContext: ['delete', 'destroy', 'account-deletion']
}
```

### Cognitive Load Motion System
```typescript
// motion.ts  
{
  name: 'dramatic',
  value: '1000ms',
  cognitiveLoad: 9,              // Very high attention
  trustLevel: 'high',            // Significant change
  usageContext: ['celebration', 'achievement', 'error-state']
}
```

### Accessibility-First Touch Targets
```typescript
// touch-target.ts
{
  name: 'minimum',
  value: '44px',                 // WCAG AAA compliance
  accessibilityLevel: 'AAA',     // Highest standard
  usageContext: ['mobile', 'accessibility', 'motor-impairment']
}
```

## Export System

### Export Functions (To Be Built)

```typescript
import { exportTokens } from '@rafters/design-tokens'

// Export as Tailwind v4 CSS
const css = exportTokens(tokens, 'tailwind-v4')
// Generates @theme { --color-primary: oklch(...); }

// Export for .rafters/ storage
const json = exportTokens(tokens, 'rafters-json')
// Generates structured JSON with AI metadata

// Export as Style Dictionary (future)
const styleDict = exportTokens(tokens, 'style-dictionary')
```

### `.rafters/` Integration

The design token system integrates with the CLI's `.rafters/` folder:

```
.rafters/
├── tokens/
│   ├── color.json          # Color tokens with overrides
│   ├── spacing.json        # Spacing tokens
│   ├── typography.json     # Typography tokens
│   └── ... (18 files)
```

Each JSON file structure:
```json
{
  "generator": "color",
  "version": "1.0.0",
  "tokens": [
    {
      "name": "primary",
      "value": "oklch(0.45 0 0)",           // Stock grayscale
      "modifiedValue": "oklch(0.45 0.15 260)", // Studio override
      "designerReasoning": "Brand blue from logo",
      // ... all AI metadata preserved
    }
  ]
}
```

### CSS Generation Flow

1. **CLI init** → Runs generators → Writes to `.rafters/tokens/`
2. **Read tokens** → Load all JSON files from `.rafters/tokens/`
3. **Apply overrides** → Use `modifiedValue` if exists, else `value`
4. **Generate CSS** → Create Tailwind v4 `@theme` block
5. **Inject** → Add to project's `app.css` or `globals.css`

### Generated CSS Example (Current Implementation)

```css
/* biome-ignore-all: Tailwind v4 syntax not supported yet */
/* Generated by Rafters Design System */
/* Test Design System - 150+ tokens with AI intelligence */

@import "tailwindcss";
@custom-variant dark (@media (prefers-color-scheme: dark));

@theme {
    /* OKLCH Color Palette */
    --color-primary: oklch(0.45 0.15 260);
    --color-primary-dark: oklch(0.65 0.15 260);
    --color-destructive: oklch(0.55 0.15 27);
    --color-destructive-dark: oklch(0.62 0.16 27);
    
    /* Mathematical Spacing Scale (linear) */
    --spacing-0: 0rem;
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-4: 1rem;
    
    /* Typography Scale */
    --text-base: 1rem;
    --text-base--line-height: 1.5;
    --text-lg: 1.125rem;
    
    /* Motion & Animation */
    --duration-standard: 300ms;
    --ease-smooth: ease-in-out;
}

/* Dark mode using token references only */
:root {
    --primary: var(--color-primary);
    
    @media (prefers-color-scheme: dark) {
        --primary: var(--color-primary-dark);
        color-scheme: dark;
    }
}

/* Custom utilities not in standard Tailwind */
@layer utilities {
    .z-modal { z-index: var(--z-modal); }
    .transition-standard { transition: all var(--duration-standard) var(--ease-smooth); }
    
    @keyframes rafters-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-rafters-spin { animation: rafters-spin 1s linear infinite; }
}
```

## Current Status & Next Steps

### Complete
- 18 token generators with AI intelligence metadata
- Token schema and validation with Zod  
- Export system architecture defined
- Component integration patterns documented
- Comprehensive test suite (218 tests passing)
- CLI README with complete flow

### Recently Completed (v0.1.2+)
- **Export Functions**: `exportTokens()` with CSS, Tailwind v4, and JSON support
- **CSS Generator**: Full Tailwind v4 `@theme` block generation
- **Comprehensive Testing**: 39 visual regression tests + 13 generator tests
- **Dark Mode Architecture**: Proper token references (no hardcoded values)
- **Namespace Compliance**: Correct `--spacing-X`, `--color-X` format for TW v4

### Next Priorities
- **JSON Writer**: Save tokens to `.rafters/tokens/` directory structure
- **Studio Integration**: Read/write modified tokens with `modifiedValue`
- **CLI Integration**: Seamless token injection into user projects

### Implementation Order
1. **Write tokens to JSON** - Save generator output to `.rafters/tokens/`
2. **Read and merge** - Load JSONs, apply `modifiedValue` overrides
3. **Generate CSS** - Create Tailwind v4 `@theme` configuration
4. **Inject into project** - Update user's CSS file

## File Structure

```
src/
├── index.ts                 # Main exports and Token interface
├── registry.ts              # Token registry and validation  
├── dependencies.ts          # Token dependency system
└── generators/              # 18 token generators
    ├── index.ts            # All generator exports + generateAllTokens()
    ├── color.ts            # Semantic OKLCH color system
    ├── spacing.ts          # Mathematical spacing scales
    ├── typography.ts       # Golden ratio typography
    ├── motion.ts           # Animation with personality
    └── ...                 # 14 more specialized generators
```

## Testing

All generators are thoroughly tested:
```bash
pnpm test                    # Run all 218 tests
pnpm test generators/        # Test specific generators
```

Tests validate:
- Token schema compliance
- Mathematical relationships  
- AI intelligence metadata
- Export format correctness
- Integration patterns

## AI Agent Usage

This system enables AI agents to make informed UX decisions:

```typescript
// AI can read token intelligence
const destructiveToken = tokens.find(t => t.name === 'destructive')

if (destructiveToken.trustLevel === 'critical') {
  // AI knows this requires confirmation UX
  implementConfirmationPattern()
}

if (destructiveToken.cognitiveLoad > 6) {  
  // AI knows this needs extra attention
  addVisualWeight()
}
```

**The goal: AI agents that understand design reasoning, not just apply arbitrary styles.**