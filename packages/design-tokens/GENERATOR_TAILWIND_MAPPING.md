# Generator → Tailwind v4 Mapping

Analysis of the 18 token generators and their relationship to Tailwind v4. We generate **two types of tokens**: Tailwind-native tokens that map to existing utilities, and Rafters-enhanced tokens that add design intelligence.

## Current Generators Overview

| Generator | Namespace | Category | TW v4 CSS Variable | Generates Utilities |
|-----------|-----------|----------|-------------------|-------------------|
| **color.ts** | `color` | `color` | `--color-*` | `bg-*`, `text-*`, `border-*` |
| **spacing.ts** | `spacing` | `spacing` | `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| **typography.ts** | `font-size` | `font-size` | `--text-*` | `text-*` |
| **typography.ts** | N/A | `line-height` | `--leading-*` | `leading-*` |
| **motion.ts** | `duration` | `motion` | `--duration-*` | `duration-*` |
| **motion.ts** | `ease` | `easing` | `--ease-*` | `ease-*` |
| **depth.ts** | `shadow` | `shadow` | `--shadow-*` | `shadow-*` |
| **depth.ts** | `z` | `z-index` | `--z-*` | `z-*` |
| **border-radius.ts** | `border-radius` | `border-radius` | `--radius-*` | `rounded-*` |
| **border-width.ts** | `border` | `border-width` | `--border-*` | `border-*` |
| **opacity.ts** | `opacity` | `opacity` | `--opacity-*` | `opacity-*` |
| **font-family.ts** | `font` | `font-family` | `--font-*` | `font-*` |
| **font-weight.ts** | `font-weight` | `font-weight` | `--font-weight-*` | `font-*` |
| **letter-spacing.ts** | `tracking` | `letter-spacing` | `--tracking-*` | `tracking-*` |
| **breakpoint.ts** | `screen` | `breakpoint` | `--breakpoint-*` | Responsive variants |
| **breakpoint.ts** | `container` | `container` | `--container-*` | Container sizes |
| **aspect-ratio.ts** | `aspect` | `aspect-ratio` | `--aspect-*` | `aspect-*` |
| **grid.ts** | `grid-cols` | `grid-template-columns` | `--grid-cols-*` | `grid-cols-*` |
| **grid.ts** | `grid-rows` | `grid-template-rows` | `--grid-rows-*` | `grid-rows-*` |
| **width.ts** | `w` | `width` | `--width-*` | `w-*` |
| **height.ts** | `height` | `height` | `--height-*` | `h-*` |
| **transform.ts** | `scale` | `scale` | `--scale-*` | `scale-*` |
| **transform.ts** | `translate` | `translate` | `--translate-*` | `translate-*` |
| **transform.ts** | `rotate` | `rotate` | `--rotate-*` | `rotate-*` |
| **touch-target.ts** | `touch` | `touch-target` | `--touch-*` | Custom utilities |
| **backdrop.ts** | `backdrop-blur` | `backdrop-blur` | `--backdrop-blur-*` | `backdrop-blur-*` |

## Token Architecture: Two-Type System

### 1. Tailwind-Native Tokens
**Map directly to existing Tailwind utilities** - enhance what's already there:

| Generator | Maps To | Purpose |
|-----------|---------|---------|
| `spacing.ts` | `p-*`, `m-*`, `w-*`, `h-*` | Mathematical spacing scales |
| `typography.ts` | `text-*`, `leading-*` | Type scales with golden ratio |
| `color.ts` (base colors) | `bg-*`, `text-*`, `border-*` | OKLCH color families |
| `border-radius.ts` | `rounded-*` | Consistent radius system |
| `opacity.ts` | `opacity-*` | Mathematical opacity scales |

### 2. Rafters-Enhanced Tokens
**Add design intelligence** that Tailwind doesn't have:

| Generator | Creates | Intelligence Added |
|-----------|---------|-------------------|
| `depth.ts` | `z-modal`, `z-dropdown`, `z-tooltip` | **Semantic z-index** vs arbitrary numbers |
| `touch-target.ts` | `touch-minimum` (44px) | **WCAG compliance** vs manual sizing |
| `color.ts` (semantic) | `primary`, `destructive`, `success` | **Semantic meaning** vs color codes |
| `color.ts` (states) | `primary-hover`, `primary-focus` | **Proper contrast ratios** vs guesswork |
| `motion.ts` | `duration-smooth`, `ease-natural` | **Behavioral timing** vs arbitrary values |
| `font-weight.ts` | `font-readable`, `font-emphasis` | **Semantic weights** vs numeric values |

## How This Works Together

### Tailwind-Native Enhancement
```css
/* We enhance existing Tailwind utilities */
--spacing-4: 1rem;              /* Powers p-4, m-4, w-4, h-4 */
--text-lg: 1.125rem;            /* Powers text-lg */
--color-blue-500: oklch(...);   /* Powers bg-blue-500 */

/* Result: Better mathematical relationships */
.p-4 { padding: var(--spacing-4); }     /* Golden ratio spacing */
.text-lg { font-size: var(--text-lg); } /* Perfect type scale */
```

### Rafters Intelligence Addition
```css
/* We add semantic intelligence */
--z-modal: 1000;                /* Semantic vs z-[1000] */
--touch-minimum: 44px;          /* WCAG vs w-11 */
--color-primary: oklch(...);    /* Semantic vs bg-blue-500 */
--duration-smooth: 300ms;       /* Behavioral vs duration-300 */

/* Result: Custom utilities with embedded intelligence */
.z-modal { z-index: var(--z-modal); }
.touch-minimum { min-width: var(--touch-minimum); min-height: var(--touch-minimum); }
.bg-primary { background: var(--color-primary); }
.transition-smooth { transition-duration: var(--duration-smooth); }
```

## ⚠️ NAMESPACE COORDINATION (Not Conflicts)

### 1. Spacing Powers Multiple Utilities
**How it works**: `spacing.ts` generates `--spacing-*` tokens that Tailwind v4 uses for ALL size-related utilities:

```css
/* From spacing.ts */
--spacing-0: 0rem;
--spacing-4: 1rem;

/* Tailwind v4 uses these for: */
.p-4 { padding: var(--spacing-4); }
.m-4 { margin: var(--spacing-4); }
.gap-4 { gap: var(--spacing-4); }
.w-4 { width: var(--spacing-4); }
.h-4 { height: var(--spacing-4); }
```

**Coordination**: We have separate `width.ts` and `height.ts` generators for **semantic sizing** that doesn't map to spacing scales:

```css
/* spacing.ts → Numeric scales */
--spacing-4: 1rem;               /* Used by w-4, h-4 */
--spacing-8: 2rem;               /* Used by w-8, h-8 */

/* width.ts → Semantic sizing */
--width-full: 100%;              /* Used by w-full */
--width-screen: 100vw;           /* Used by w-screen */
--width-prose: 65ch;             /* Used by w-prose */

/* height.ts → Semantic sizing */
--height-screen: 100vh;          /* Used by h-screen */
--height-full: 100%;             /* Used by h-full */
```

Both systems work together - spacing for mathematical relationships, semantic for contextual sizing.

### 2. Typography Intelligence System
**Coordination**: Typography is split across generators for different aspects of intelligent type systems:

```typescript
// typography.ts → --text-* (mathematical font sizes)
// font-family.ts → --font-* (semantic font families)
// font-weight.ts → --font-weight-* (semantic weights)
// letter-spacing.ts → --tracking-* (optical letter spacing)
```

**Result**: Instead of arbitrary typography, we get intelligent typography:

```css
/* Mathematical size relationships */
--text-lg: 1.125rem;             /* Golden ratio scale */
--text-xl: 1.25rem;              /* Perfect mathematical progression */

/* Semantic font families */
--font-heading: "Inter", sans-serif;     /* Optimized for headings */
--font-body: "Inter", sans-serif;        /* Optimized for body text */
--font-code: "Fira Code", monospace;     /* Optimized for code */

/* Semantic font weights */
--font-weight-readable: 400;     /* Optimal for body text */
--font-weight-emphasis: 600;     /* Optimal for emphasis */
--font-weight-heading: 700;      /* Optimal for headings */

/* Optical letter spacing */
--tracking-tight: -0.025em;      /* For large headings */
--tracking-normal: 0em;          /* For body text */
--tracking-wide: 0.025em;        /* For small text */
```

**Fix Needed**: Change `font-weight.ts` namespace from `font-weight` to `font` to match Tailwind expectations.

### 3. Transform Intelligence System
**Coordination**: Transforms are split for semantic transformation behaviors:

```css
/* Semantic scaling */
--scale-sm: 0.95;                /* Subtle hover feedback */
--scale-lg: 1.05;                /* Emphasis scaling */
--scale-hover: 1.02;             /* Perfect hover interaction */

/* Semantic translation */
--translate-dropdown: 0.5rem;    /* Perfect dropdown offset */
--translate-tooltip: 0.25rem;    /* Optimal tooltip positioning */

/* Semantic rotation */
--rotate-icon: 90deg;            /* Perfect icon rotation */
--rotate-loading: 360deg;        /* Complete loading rotation */
```

This provides **meaningful transforms** vs arbitrary `scale-110` or `rotate-45`.

## Detailed Analysis

### Spacing System Overlap

**Current Generators:**
- `spacing.ts` → Creates `0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24`
- `width.ts` → Creates `min, max, fit, full, screen, prose` (semantic widths)
- `height.ts` → Creates `auto, full, screen, min, max` (semantic heights)

**Tailwind v4 Expectation:**
```css
/* Spacing powers most utilities */
--spacing-4: 1rem;

/* Used by: */
.w-4 { width: var(--spacing-4); }      /* Conflicts with width.ts */
.h-4 { height: var(--spacing-4); }     /* Conflicts with height.ts */
.p-4 { padding: var(--spacing-4); }
.m-4 { margin: var(--spacing-4); }
```

**Resolution**:
- Keep `spacing.ts` for numeric scales
- Keep `width.ts` and `height.ts` for semantic values (`full`, `screen`, etc.)
- Exporter needs to handle both systems

### Font Weight Namespace Issue

**Current:**
```typescript
// font-weight.ts → namespace: 'font-weight'
// Generates: --font-weight-thin, --font-weight-bold
```

**Tailwind v4 Expects:**
```css
--font-thin: 100;
--font-bold: 700;

.font-bold { font-weight: var(--font-bold); }
```

**Fix**: Change `font-weight.ts` namespace from `font-weight` to `font`

### Generators That May Be Redundant

**1. Touch Target Generator**
```typescript
// touch-target.ts → namespace: 'touch'
// Creates: --touch-minimum (44px)
```
This might be better as a spacing token or custom utility rather than core design tokens.

**2. Height Generator**
The comment in `generators/index.ts` says:
```typescript
// Height tokens removed - spacing scale generates h-* utilities automatically
```

But `height.ts` still exists and is imported. This suggests height tokens might be redundant.

## Tailwind v4 CSS Variable Expectations

Based on the exporter, Tailwind v4 expects these variable patterns:

```css
/* Colors */
--color-{family}-{shade}: oklch(...);
--color-{semantic}: var(--color-{family}-{shade});

/* Spacing (powers multiple utilities) */
--spacing-{number}: {rem};

/* Typography */
--text-{size}: {rem};
--leading-{size}: {number};
--tracking-{size}: {em};
--font-{family}: {stack};
--font-{weight}: {number};  /* NOT --font-weight-{weight} */

/* Layout */
--radius-{size}: {rem};
--shadow-{size}: {value};
--z-{layer}: {number};

/* Motion */
--duration-{speed}: {ms};
--ease-{curve}: {function};

/* Grid */
--grid-cols-{count}: {value};
--grid-rows-{count}: {value};

/* Transforms */
--scale-{amount}: {number};
--translate-{amount}: {value};
--rotate-{amount}: {deg};
```

## Recommended Actions

### 1. Fix Font Weight Namespace
```typescript
// font-weight.ts
// CHANGE: namespace: 'font-weight'
// TO: namespace: 'font'
```

### 2. Clarify Height Generator
- Remove `height.ts` if spacing handles h-* utilities
- OR keep it for semantic heights (`screen`, `full`) that spacing doesn't cover

### 3. Document Spacing Overlap
- `spacing.ts` → Numeric scales (0-24)
- `width.ts` → Semantic widths (`full`, `screen`, `prose`)
- `height.ts` → Semantic heights (`screen`, `full`, `min`, `max`)

### 4. Review Touch Target Utility
- Consider moving touch target tokens to a different category
- Or integrate with spacing system

### 5. Validate Transform Split
- Confirm Tailwind v4 expects separate `--scale-*`, `--translate-*`, `--rotate-*`
- OR if it expects combined transform utilities

## The Intelligence Advantage

### What We're Really Building

**Traditional Tailwind:**
```html
<!-- Arbitrary values, no reasoning -->
<div class="p-4 text-lg bg-blue-500 z-[1000] duration-300">
```

**Rafters-Enhanced Tailwind:**
```html
<!-- Semantic intelligence embedded -->
<div class="p-4 text-readable bg-primary z-modal duration-smooth">
```

### AI Agent Benefits

When an AI agent builds interfaces with Rafters tokens:

```typescript
// AI can read token intelligence
const modalToken = tokens.find(t => t.name === 'z-modal')

// AI knows this is for modal dialogs (semanticMeaning)
// AI knows it's high cognitive load (cognitiveLoad: 7)
// AI knows it requires careful UX (trustLevel: 'high')

// Result: AI builds proper modal UX, not just z-index
```

### Bootstrap Impact

When we run the bootstrap to generate the entire design system:

**What We'll Get:**
- **~500 total tokens** across 18 categories
- **Two-type architecture**: Tailwind-native + Rafters-enhanced
- **Mathematical relationships**: Golden ratio, OKLCH, accessibility
- **Semantic intelligence**: Meaningful names with embedded reasoning
- **Behavioral guidance**: Timing, states, interactions

**How They Work Together:**
```css
/* Tailwind-native tokens (enhance existing utilities) */
--spacing-4: 1rem;              /* Mathematical spacing */
--text-lg: 1.125rem;            /* Golden ratio typography */
--color-blue-500: oklch(...);   /* Perceptual color space */

/* Rafters-enhanced tokens (add intelligence) */
--z-modal: 1000;                /* Semantic layering */
--touch-minimum: 44px;          /* WCAG compliance */
--color-primary: oklch(...);    /* Brand semantics */
--duration-smooth: 300ms;       /* Behavioral timing */

/* Result: Intelligent CSS */
.modal {
  z-index: var(--z-modal);          /* Semantic layering */
  padding: var(--spacing-4);        /* Mathematical spacing */
  background: var(--color-primary); /* Brand semantics */
  transition-duration: var(--duration-smooth); /* Behavioral timing */
  min-width: var(--touch-minimum);  /* Accessibility compliance */
}
```

**What We Ensure:**
- **No conflicts** - Two-type system works harmoniously
- **Intelligence preservation** - All tokens carry embedded reasoning
- **Dependency management** - TokenRegistry handles relationships
- **AI queryability** - MCP tools can search by semantic meaning

The bootstrap creates a **complete intelligent design system**, not just tokens - it's a system that teaches AI agents how to design properly.