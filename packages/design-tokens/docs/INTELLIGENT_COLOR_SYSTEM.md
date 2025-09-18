# Intelligent Color System Architecture

## Overview

Rafters generates complete design systems using AI-driven color intelligence from 9 base color families. Each family provides a full OKLCH scale with semantic meaning, accessibility validation, and mathematical relationships.

## Core Architecture

### 9 Base Color Families

Each family requires **1 API call** to `/api/color-intel` returning:
- Complete 11-step OKLCH scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
- Accessibility matrices for WCAG AA/AAA compliance
- Semantic analysis and usage guidance
- Perceptual weight and atmospheric analysis
- Color harmonies (stored for future Studio use)

**Base Families:**
1. **primary** - Brand identity, main actions
2. **secondary** - Supporting actions, secondary UI
3. **accent** - Highlights, emphasis, focus states
4. **destructive** - Errors, dangerous actions
5. **success** - Confirmations, positive feedback
6. **warning** - Caution, important information
7. **info** - Neutral information, notifications
8. **highlight** - Selection, search results
9. **neutral** - Backgrounds, borders, muted content

## Complete Token Mapping

### 9 Base Families → 200+ Derived Tokens

Each of the 9 base families generates a complete ecosystem of tokens:

## Core Semantic Families

### 1. Primary Family (Brand Identity)
**Base Tokens:**
```
primary (scale[500])                    → --primary
primary (accessibility calc)           → --primary-foreground
```
**State Variations:**
```
primary (scale[600])                    → --primary-hover
primary (accessibility calc)           → --primary-hover-foreground
primary (scale[700])                    → --primary-active
primary (accessibility calc)           → --primary-active-thforeground
primary (scale[400])                    → --primary-focus
primary (accessibility calc)           → --primary-focus-foreground
primary (scale[300] + desaturate)      → --primary-disabled
primary (accessibility calc)           → --primary-disabled-foreground
```

### 2. Secondary Family (Supporting Actions)
**Base Tokens:**
```
secondary (scale[100])                  → --secondary
secondary (scale[900])                  → --secondary-foreground
```
**State Variations:**
```
secondary (scale[200])                  → --secondary-hover
secondary (scale[800])                  → --secondary-hover-foreground
secondary (scale[300])                  → --secondary-active
secondary (scale[700])                  → --secondary-active-foreground
secondary (scale[150])                  → --secondary-focus
secondary (scale[850])                  → --secondary-focus-foreground
secondary (scale[50] + desaturate)     → --secondary-disabled
secondary (scale[600])                  → --secondary-disabled-foreground
```

### 3. Accent Family (Emphasis & Highlights)
**Base Tokens:**
```
accent (scale[100])                     → --accent
accent (scale[900])                     → --accent-foreground
```
**State Variations:**
```
accent (scale[200])                     → --accent-hover
accent (scale[800])                     → --accent-hover-foreground
accent (scale[300])                     → --accent-active
accent (scale[700])                     → --accent-active-foreground
accent (scale[150])                     → --accent-focus
accent (scale[850])                     → --accent-focus-foreground
accent (scale[50] + desaturate)        → --accent-disabled
accent (scale[600])                     → --accent-disabled-foreground
```

### 4. Destructive Family (Errors & Dangerous Actions)
**Base Tokens:**
```
destructive (scale[500])                → --destructive
destructive (accessibility calc)       → --destructive-foreground
```
**State Variations:**
```
destructive (scale[600])                → --destructive-hover
destructive (accessibility calc)       → --destructive-hover-foreground
destructive (scale[700])                → --destructive-active
destructive (accessibility calc)       → --destructive-active-foreground
destructive (scale[400])                → --destructive-focus
destructive (accessibility calc)       → --destructive-focus-foreground
destructive (scale[300] + desaturate)  → --destructive-disabled
destructive (accessibility calc)       → --destructive-disabled-foreground
```

### 5. Success Family (Confirmations & Positive Feedback)
**Base Tokens:**
```
success (scale[500])                    → --success
success (accessibility calc)           → --success-foreground
```
**State Variations:**
```
success (scale[600])                    → --success-hover
success (accessibility calc)           → --success-hover-foreground
success (scale[700])                    → --success-active
success (accessibility calc)           → --success-active-foreground
success (scale[400])                    → --success-focus
success (accessibility calc)           → --success-focus-foreground
success (scale[300] + desaturate)      → --success-disabled
success (accessibility calc)           → --success-disabled-foreground
```

### 6. Warning Family (Caution & Important Information)
**Base Tokens:**
```
warning (scale[500])                    → --warning
warning (accessibility calc)           → --warning-foreground
```
**State Variations:**
```
warning (scale[600])                    → --warning-hover
warning (accessibility calc)           → --warning-hover-foreground
warning (scale[700])                    → --warning-active
warning (accessibility calc)           → --warning-active-foreground
warning (scale[400])                    → --warning-focus
warning (accessibility calc)           → --warning-focus-foreground
warning (scale[300] + desaturate)      → --warning-disabled
warning (accessibility calc)           → --warning-disabled-foreground
```

### 7. Info Family (Neutral Information & Notifications)
**Base Tokens:**
```
info (scale[500])                       → --info
info (accessibility calc)              → --info-foreground
```
**State Variations:**
```
info (scale[600])                       → --info-hover
info (accessibility calc)              → --info-hover-foreground
info (scale[700])                       → --info-active
info (accessibility calc)              → --info-active-foreground
info (scale[400])                       → --info-focus
info (accessibility calc)              → --info-focus-foreground
info (scale[300] + desaturate)         → --info-disabled
info (accessibility calc)              → --info-disabled-foreground
```

### 8. Highlight Family (Selection & Search Results)
**Base Tokens:**
```
highlight (scale[200])                  → --highlight
highlight (scale[800])                  → --highlight-foreground
```
**State Variations:**
```
highlight (scale[300])                  → --highlight-hover
highlight (scale[700])                  → --highlight-hover-foreground
highlight (scale[400])                  → --highlight-active
highlight (scale[600])                  → --highlight-active-foreground
highlight (scale[250])                  → --highlight-focus
highlight (scale[750])                  → --highlight-focus-foreground
highlight (scale[100] + desaturate)    → --highlight-disabled
highlight (scale[500])                  → --highlight-disabled-foreground
```

### 9. Neutral Family (Foundation & Infrastructure)
**Base Tokens:**
```
neutral (scale[50])                     → --background
neutral (scale[900])                    → --foreground
neutral (scale[100])                    → --muted
neutral (scale[600])                    → --muted-foreground
neutral (scale[200])                    → --border
neutral (scale[200])                    → --input
neutral (scale[400])                    → --ring
```
**State Variations:**
```
neutral (scale[100])                    → --background-hover
neutral (scale[800])                    → --foreground-hover
neutral (scale[150])                    → --muted-hover
neutral (scale[550])                    → --muted-foreground-hover
neutral (scale[300])                    → --border-hover
neutral (scale[300])                    → --input-hover
neutral (scale[500])                    → --ring-hover
```

## Surface Components

### Card Surfaces
```
neutral (scale[50])                     → --card
neutral (scale[900])                    → --card-foreground
neutral (scale[100])                    → --card-hover
neutral (scale[800])                    → --card-hover-foreground
neutral (scale[150])                    → --card-active
neutral (scale[750])                    → --card-active-foreground
accent (scale[500])                     → --card-focus-ring
neutral (scale[200])                    → --card-border
```

### Popover Surfaces
```
neutral (scale[50])                     → --popover
neutral (scale[900])                    → --popover-foreground
neutral (scale[100])                    → --popover-hover
neutral (scale[800])                    → --popover-hover-foreground
neutral (scale[200])                    → --popover-border
accent (scale[500])                     → --popover-focus-ring
```

### Sidebar Navigation
```
neutral (scale[50])                     → --sidebar
neutral (scale[900])                    → --sidebar-foreground
primary (scale[500])                    → --sidebar-primary
primary (accessibility calc)           → --sidebar-primary-foreground
primary (scale[600])                    → --sidebar-primary-hover
primary (accessibility calc)           → --sidebar-primary-hover-foreground
accent (scale[100])                     → --sidebar-accent
accent (scale[900])                     → --sidebar-accent-foreground
accent (scale[200])                     → --sidebar-accent-hover
accent (scale[800])                     → --sidebar-accent-hover-foreground
neutral (scale[200])                    → --sidebar-border
neutral (scale[400])                    → --sidebar-ring
```

### Additional Surfaces
```
neutral (scale[50])                     → --tooltip
neutral (scale[900])                    → --tooltip-foreground
neutral (scale[50])                     → --modal
neutral (scale[900])                    → --modal-foreground
neutral (scale[50])                     → --dropdown
neutral (scale[900])                    → --dropdown-foreground
neutral (scale[50])                     → --drawer
neutral (scale[900])                    → --drawer-foreground
neutral (scale[50])                     → --sheet
neutral (scale[900])                    → --sheet-foreground
neutral (scale[50])                     → --dialog
neutral (scale[900])                    → --dialog-foreground
```

## Data Visualization Colors

### Chart Colors (Derived from Base Families)
```
primary (scale[500])                    → --chart-1
accent (scale[500])                     → --chart-2
success (scale[500])                    → --chart-3
warning (scale[500])                    → --chart-4
info (scale[500])                       → --chart-5
destructive (scale[500])                → --chart-6
highlight (scale[500])                  → --chart-7
secondary (scale[500])                  → --chart-8
```

## Dark Mode Variants

**All tokens above get dark mode variants using mathematical inversion:**
```
--primary-dark
--primary-foreground-dark
--primary-hover-dark
--primary-hover-foreground-dark
... (200+ dark variants)
```

## Complete Token Count

- **9 Base Families** × **8 variations each** = 72 base semantic tokens
- **Surface Components** = 40+ surface tokens
- **Chart Colors** = 8 data visualization tokens
- **Dark Mode** = 120+ dark variants
- **Total: 240+ intelligent tokens** from 9 API calls

## Analysis of Current shadcn Values

Looking at the provided shadcn tokens, we can see clear patterns:

### Grayscale Foundation
Most tokens use pure grayscale (c: 0, h: 0):
- `background: oklch(1 0 0)` - Pure white
- `foreground: oklch(0.145 0 0)` - Very dark gray
- `border: oklch(0.922 0 0)` - Light gray
- `ring: oklch(0.708 0 0)` - Medium gray

### Color Accents
Only destructive and charts use actual color:
- `destructive: oklch(0.577 0.245 27.325)` - Red/orange
- `chart-*` - Various colored data visualization colors

### Reuse Patterns
Heavy reuse confirms our approach:
- `card`, `popover`, `sidebar` all use background (white)
- `border` and `input` share the same value
- Many foregrounds reuse the same dark gray

## Three-Layer CSS Architecture

Following Rafters' established three-layer CSS system for maintainable, override-friendly token management:

### Layer 1: Color Families (Source of Truth)
All color values defined as OKLCH from the 9 API intelligence responses:

```css
/* Primary Family Scale (from API response) */
--color-ocean-blue-50: oklch(0.98 0.01 240);
--color-ocean-blue-100: oklch(0.95 0.01 240);
--color-ocean-blue-200: oklch(0.9 0.01 240);
--color-ocean-blue-300: oklch(0.8 0.01 240);
--color-ocean-blue-400: oklch(0.7 0.01 240);
--color-ocean-blue-500: oklch(0.44 0.01 240);   /* Base from API */
--color-ocean-blue-600: oklch(0.4 0.01 240);
--color-ocean-blue-700: oklch(0.25 0.01 240);
--color-ocean-blue-800: oklch(0.15 0.01 240);
--color-ocean-blue-900: oklch(0.08 0.01 240);
--color-ocean-blue-950: oklch(0.04 0.01 240);

/* Secondary Family Scale */
--color-dawn-mist-50: oklch(0.97 0.02 85);
--color-dawn-mist-100: oklch(0.94 0.03 85);
/* ... complete scale */

/* Neutral Family Scale */
--color-slate-calm-50: oklch(0.98 0.005 240);
--color-slate-calm-100: oklch(0.96 0.006 240);
/* ... complete scale */

/* All 9 families × 11 scale steps = 99 source color definitions */
```

### Layer 2: Rafters Semantic Tokens
References Layer 1 variables using intelligent scale position selection:

```css
/* Core Semantic Assignments (shadcn compatible) */
--rafters-primary: var(--color-ocean-blue-500);
--rafters-primary-foreground: var(--color-slate-calm-50);
--rafters-secondary: var(--color-dawn-mist-100);
--rafters-secondary-foreground: var(--color-slate-calm-900);
--rafters-accent: var(--color-purple-dream-100);
--rafters-accent-foreground: var(--color-slate-calm-900);

/* State Variations (intelligent scale relationships) */
--rafters-primary-hover: var(--color-ocean-blue-600);
--rafters-primary-hover-foreground: var(--color-slate-calm-50);
--rafters-primary-active: var(--color-ocean-blue-700);
--rafters-primary-active-foreground: var(--color-slate-calm-50);
--rafters-primary-focus: var(--color-ocean-blue-400);
--rafters-primary-focus-foreground: var(--color-slate-calm-900);
--rafters-primary-disabled: var(--color-ocean-blue-300);
--rafters-primary-disabled-foreground: var(--color-slate-calm-600);

/* Surface Components (reusing base families) */
--rafters-background: var(--color-slate-calm-50);
--rafters-foreground: var(--color-slate-calm-900);
--rafters-muted: var(--color-slate-calm-100);
--rafters-muted-foreground: var(--color-slate-calm-600);
--rafters-border: var(--color-slate-calm-200);
--rafters-input: var(--color-slate-calm-200);
--rafters-ring: var(--color-slate-calm-400);

/* Advanced Surface Components */
--rafters-card: var(--color-slate-calm-50);
--rafters-card-foreground: var(--color-slate-calm-900);
--rafters-popover: var(--color-slate-calm-50);
--rafters-popover-foreground: var(--color-slate-calm-900);
--rafters-sidebar: var(--color-slate-calm-50);
--rafters-sidebar-foreground: var(--color-slate-calm-900);
--rafters-sidebar-primary: var(--color-ocean-blue-500);
--rafters-sidebar-primary-foreground: var(--color-slate-calm-50);
```

### Layer 3: Theme Mapping (shadcn/Tailwind Compatible)
Final consumer-facing variables that match shadcn exactly:

```css
/* Direct shadcn mapping */
--background: var(--rafters-background);
--foreground: var(--rafters-foreground);
--primary: var(--rafters-primary);
--primary-foreground: var(--rafters-primary-foreground);
--secondary: var(--rafters-secondary);
--secondary-foreground: var(--rafters-secondary-foreground);
--muted: var(--rafters-muted);
--muted-foreground: var(--rafters-muted-foreground);
--accent: var(--rafters-accent);
--accent-foreground: var(--rafters-accent-foreground);
--destructive: var(--rafters-destructive);
--destructive-foreground: var(--rafters-destructive-foreground);
--border: var(--rafters-border);
--input: var(--rafters-input);
--ring: var(--rafters-ring);
--card: var(--rafters-card);
--card-foreground: var(--rafters-card-foreground);
--popover: var(--rafters-popover);
--popover-foreground: var(--rafters-popover-foreground);

/* State variations for interactive components */
--primary-hover: var(--rafters-primary-hover);
--primary-active: var(--rafters-primary-active);
--primary-focus: var(--rafters-primary-focus);
--primary-disabled: var(--rafters-primary-disabled);

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  --background: var(--rafters-background-dark);
  --foreground: var(--rafters-foreground-dark);
  --primary: var(--rafters-primary-dark);
  /* ... all tokens get dark variants */
}
```

## Implementation Strategy

### 1. Primary Color Harmonies
Start with primary color, use API harmonies to establish OKLCH values for the other 8 families.

### 2. Individual Intelligence
Call API for each of the 9 colors to get complete ColorValue objects with semantic analysis and accessibility data.

### 3. Three-Layer CSS Generation
Use the intelligent scales to populate all three layers:
- **Layer 1**: Direct OKLCH values from API scales
- **Layer 2**: Intelligent scale position selection using accessibility matrices
- **Layer 3**: shadcn-compatible final mapping

### 4. Mathematical State Generation
Use accessibility matrices and semantic data to:
- Select appropriate scale steps for each token
- Generate state variations following consistent patterns
- Ensure proper contrast ratios across all combinations

## State Variations

Each semantic color generates states using scale intelligence:

```typescript
// Example: Primary button states
primary-base     → primary.scale[500]  // Base interactive color
primary-hover    → primary.scale[600]  // Darker for hover
primary-active   → primary.scale[700]  // Darkest for active
primary-focus    → accent.scale[500]   // Accent color for focus ring
primary-disabled → primary.scale[300]  // Lighter + desaturated
```

## Benefits

1. **9 API calls** instead of 300+ individual color requests
2. **Mathematical consistency** across all derived colors
3. **AI intelligence** embedded in every token
4. **100% shadcn compatibility** for seamless migration
5. **Accessibility guaranteed** through WCAG validation
6. **Semantic meaning** attached to every color choice

## Implementation Strategy Refinements

### Token Generation Logic

Each family's scale position is determined by:
1. **Accessibility matrices** from API response - which scale combinations meet WCAG standards
2. **Semantic analysis** - usage guidance for appropriate lightness levels
3. **Perceptual weight** - ensuring visual hierarchy is maintained
4. **Mathematical relationships** - consistent lightness progressions for states

### Scale Position Selection Examples
```typescript
// Primary family base token
primary_base = primary.scale[500]  // Medium lightness for maximum contrast options

// State variations follow consistent patterns
primary_hover = primary.scale[600]     // +100 lightness units darker
primary_active = primary.scale[700]    // +200 lightness units darker
primary_focus = primary.scale[400]     // -100 lightness units lighter
primary_disabled = primary.scale[300]  // -200 + desaturate

// Foregrounds calculated from accessibility matrices
primary_foreground = findContrastColor(primary_base, 'WCAG-AAA')
```

### Rule Generation Patterns

The 240+ tokens follow predictable generation rules:

**Base Semantic Pattern:**
- `{family}` → `{family}.scale[500]` (or appropriate base position)
- `{family}-foreground` → Accessibility calculation from base

**State Pattern:**
- `{family}-hover` → `{family}.scale[base_position + 100]`
- `{family}-active` → `{family}.scale[base_position + 200]`
- `{family}-focus` → `{family}.scale[base_position - 100]` OR `accent.scale[500]`
- `{family}-disabled` → `{family}.scale[base_position - 200]` + desaturate

**Surface Pattern:**
- Most surfaces → `neutral.scale[50]` (background)
- Most surface foregrounds → `neutral.scale[900]` (foreground)
- Surface accents → Inherit from semantic families

**Dark Mode Pattern:**
- Mathematical inversion: `l_dark = 1 - l_light`
- Preserve chroma and hue relationships
- Validate contrast ratios post-inversion

### Registry Integration

The registry would need to support:
1. **Family-based organization** - tokens grouped by semantic family
2. **Dependency tracking** - when `primary` changes, update all `primary-*` variants
3. **Rule execution** - generation rules that reference scale positions and calculations
4. **Override handling** - user customizations that break dependency chains
5. **Dark mode sync** - automatic dark variant generation

### Optimization Strategies

**Lazy Loading:**
- Only generate tokens that are actually used in the design system
- API calls triggered on-demand for specific families

**Intelligent Caching:**
- Cache API responses by OKLCH values (not semantic names)
- Reuse intelligence across multiple design systems with same base colors

**Batch Operations:**
- When user overrides a base family, batch-regenerate all dependents
- Use dependency graph for optimal regeneration order

## Critical Implementation Questions

1. **Chart Color Strategy**: Derive from the 9 families or generate separately?
   - **Option A**: Use the 8 semantic families (excluding neutral) for charts
   - **Option B**: Generate separate chart-optimized colors with distinct hues
   - **Recommendation**: Option A for system consistency

2. **Scale Position Intelligence**: How do we determine optimal scale positions?
   - Use accessibility matrices to find positions that work with most backgrounds
   - Consider perceptual weight for maintaining visual hierarchy
   - Allow semantic analysis to influence lightness choices

3. **User Override Cascading**: When user overrides `primary`, what happens?
   - **Conservative**: Only update `primary-foreground` (contrast dependency)
   - **Aggressive**: Regenerate entire `primary-*` family
   - **Smart**: Ask user with preview of changes

4. **Dark Mode Validation**: After mathematical inversion, how do we ensure quality?
   - Validate all contrast ratios still meet WCAG standards
   - Check that visual hierarchy is preserved
   - Ensure no tokens become visually identical

5. **Performance Optimization**: How do we handle 240+ token generation efficiently?
   - Lazy generation based on actual usage
   - Precompute common patterns
   - Cache intermediate calculations

6. **Error Handling**: What happens when API calls fail?
   - Graceful fallbacks to mathematical generation
   - Partial intelligence with cached data
   - Clear error states for users