# Tailwind CSS v4 Design Token Mapping

**Purpose:** Map Tailwind v4 theme namespaces to tokens that generators create in the registry. Style Dictionary exports to various formats (CSS variables, DTCG JSON, etc.) - the registry is the source of truth.

---

## How It Works

1. **Generators** create root tokens and put them in the **Registry**
2. **Dependency Graph** tracks relationships between tokens
3. **Rule Engine** generates derived tokens (scales, states, semantic mappings)
4. **Style Dictionary** reads from registry, exports to `@theme` CSS for Tailwind v4

### Design Principles

- **Everything from math** - Spacing, motion, shadows all derive from the same progression system (minor-third by default). Creates cohesive feel.
- **Container queries by default** - `containerQueryAware: true` is the norm, not the exception
- **Composites at export** - Registry holds primitives (color, dimension, etc.). Style Dictionary composes `border`, `shadow`, `transition`, `typography` on export for DTCG compliance.
- **MCP embedded locally** - CLI includes MCP server, runs locally, no cloud API costs

---

## Part 1: Tailwind v4 Architecture

### The `@theme` Directive

Tailwind v4 uses CSS-first configuration. Theme variables defined in `@theme`:
- Create utility classes automatically (`--color-primary` → `bg-primary`, `text-primary`)
- Are exposed as CSS custom properties in `:root`
- Replace the JavaScript `tailwind.config.js` approach

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.72 0.11 221.19);
  --font-display: "Satoshi", sans-serif;
  --spacing: 0.25rem;
}
```

### Key v4 Changes

| Aspect | Tailwind v3 | Tailwind v4 |
|--------|-------------|-------------|
| Configuration | JavaScript | CSS (`@theme`) |
| Color Format | RGB/HSL | OKLCH (default) |
| CSS Variables | Optional | Automatic |
| Spacing | Object scale | Base unit with multiplier |

---

## Part 2: Namespace → Token Mapping

### Color Namespaces

| Tailwind Namespace | Registry Tokens | Generation |
|-------------------|-----------------|------------|
| `--color-*` | Color family tokens | Generator creates `ColorValue` with scale |
| `--color-{family}-{position}` | Scale positions | Rule: `scale:{position}` from family |
| `--color-{semantic}` | Semantic tokens | `ColorReference` pointing to family+position |
| `--color-{semantic}-hover` | State variants | Rule: `state:hover` from semantic |
| `--color-{semantic}-active` | State variants | Rule: `state:active` from semantic |
| `--color-{semantic}-focus` | State variants | Rule: `state:focus` from semantic |
| `--color-{semantic}-disabled` | State variants | Rule: `state:disabled` from semantic |
| `--color-{semantic}-foreground` | Foreground pairs | Contrast-calculated from semantic |

**Example token flow:**
```
Generator creates:
  ocean-blue (ColorValue with scale[50-950], intelligence, harmonies, accessibility)

Rules derive:
  ocean-blue-500 (scale:500 from ocean-blue)
  ocean-blue-600 (scale:600 from ocean-blue)
  primary (ColorReference → ocean-blue:500)
  primary-hover (state:hover from primary)
  primary-foreground (contrast from primary)
```

### Semantic Color Tokens (shadcn compatible)

#### Core Surfaces
| Token Name | Purpose | Paired With |
|------------|---------|-------------|
| `background` | Page background | `foreground` |
| `foreground` | Default text | `background` |
| `card` | Card surfaces | `card-foreground` |
| `popover` | Dropdown/popover surfaces | `popover-foreground` |

#### Actions
| Token Name | Purpose | Paired With |
|------------|---------|-------------|
| `primary` | Primary actions, main CTA | `primary-foreground` |
| `secondary` | Secondary/supporting actions | `secondary-foreground` |
| `accent` | Decorative emphasis, hover states | `accent-foreground` |

#### Status/Feedback
| Token Name | Purpose | Paired With |
|------------|---------|-------------|
| `destructive` | Errors, delete, danger | `destructive-foreground` |
| `success` | Confirmations, valid, completed | `success-foreground` |
| `warning` | Alerts, caution, attention needed | `warning-foreground` |
| `info` | Informational, tips, help | `info-foreground` |

#### Utility
| Token Name | Purpose | Paired With |
|------------|---------|-------------|
| `neutral` | Base grayscale family | `neutral-foreground` |
| `muted` | Subtle, de-emphasized elements | `muted-foreground` |
| `highlight` | Selections, search matches, attention | `highlight-foreground` |
| `border` | Default borders | - |
| `input` | Input borders | - |
| `ring` | Focus rings | - |
| `link` | Hyperlink color | - |

#### Sidebar (shadcn pattern)
| Token Name | Purpose | Paired With |
|------------|---------|-------------|
| `sidebar` | Sidebar background | `sidebar-foreground` |
| `sidebar-primary` | Sidebar primary actions | `sidebar-primary-foreground` |
| `sidebar-accent` | Sidebar hover/active states | `sidebar-accent-foreground` |
| `sidebar-border` | Sidebar borders | - |
| `sidebar-ring` | Sidebar focus rings | - |

#### Chart/Data Visualization
| Token Name | Purpose |
|------------|---------|
| `chart-1` | First chart color |
| `chart-2` | Second chart color |
| `chart-3` | Third chart color |
| `chart-4` | Fourth chart color |
| `chart-5` | Fifth chart color |

Each semantic token gets state variants: `-hover`, `-active`, `-focus`, `-disabled`

### Depth Namespace (Semantic Z-Index)

| Token Name | Purpose | Typical Value |
|------------|---------|---------------|
| `depth-base` | Default content | 0 |
| `depth-dropdown` | Dropdown menus | 10 |
| `depth-sticky` | Sticky headers | 20 |
| `depth-fixed` | Fixed elements | 30 |
| `depth-drawer` | Side drawers | 40 |
| `depth-modal` | Modal dialogs | 50 |
| `depth-popover` | Popovers/tooltips | 60 |
| `depth-toast` | Toast notifications | 70 |
| `depth-overlay` | Overlays/backdrops | 80 |
| `depth-max` | Above everything | 100 |

### Typography Namespaces

| Tailwind Namespace | Registry Tokens | Notes |
|-------------------|-----------------|-------|
| `--font-*` | `font-sans`, `font-serif`, `font-mono` | Font family tokens |
| `--text-*` | `text-xs` through `text-9xl` | Size with companion line-height |
| `--text-*--line-height` | Linked to text size | Tailwind v4 special syntax |
| `--text-*--letter-spacing` | Linked to text size | Tailwind v4 special syntax |
| `--font-weight-*` | `font-normal` through `font-black` | Weight values |
| `--tracking-*` | `tracking-tight`, `tracking-wide` | Letter spacing |
| `--leading-*` | `leading-tight`, `leading-loose` | Line height |

### Spacing Namespaces

| Tailwind Namespace | Registry Tokens | Notes |
|-------------------|-----------------|-------|
| `--spacing` | `spacing-base` | Base unit (0.25rem), enables multiplier |
| `--spacing-*` | `spacing-xs` through `spacing-3xl` | Named scale |
| `--margin-*`, `--padding-*`, `--gap-*` | Derived from spacing | Same values, different utilities |

### Border Namespaces

| Tailwind Namespace | Registry Tokens | Notes |
|-------------------|-----------------|-------|
| `--radius-*` | `radius-none` through `radius-full` | Border radius scale |
| `--radius` | `radius-default` | shadcn uses this as base |
| `--radius-sm/md/lg/xl` | Calc-derived | `calc(var(--radius) - 4px)` pattern |
| `--border-width-*` | `border-default`, `border-thick` | Border widths |
| `--ring-width-*` | `ring-default`, `ring-thick` | Focus ring widths |

### Shadow Namespaces

| Tailwind Namespace | Registry Tokens | Notes |
|-------------------|-----------------|-------|
| `--shadow-*` | `shadow-sm` through `shadow-2xl` | Derived from spacing progression |
| `--inset-shadow-*` | `shadow-inner` variants | Inset shadows |
| `--drop-shadow-*` | Filter-based shadows | For images/SVG |

Shadows derive from the same spacing progression as everything else - when spacing uses minor-third, shadows scale proportionally. Can pair with `elevationLevel` or use independently.

### Animation & Motion Namespaces

| Tailwind Namespace | Registry Tokens | Notes |
|-------------------|-----------------|-------|
| `--animate-*` | Named animations | With keyframes |
| `--ease-*` | `ease-productive`, `ease-expressive`, `ease-spring` | Timing functions |
| `--transition-duration-*` | `duration-instant`, `duration-fast`, `duration-normal`, `duration-slow` | Derived from spacing progression |

**Motion derives from spacing progression** - durations scale with the same mathematical ratio as spacing. This creates cohesive feel where everything "breathes" at the same rhythm.

**Motion token properties:**
- `motionIntent`: `enter`, `exit`, `emphasis`, `transition`
- `easingCurve`: cubicBezier `[x1, y1, x2, y2]`
- `easingName`: `productive` (efficient), `expressive` (delightful), `spring`
- `delayMs`: delay before animation
- `reducedMotionAware: true` for accessibility
- `animationSafe: true` for vestibular safety

### Focus Namespace (WCAG 2.2)

| Token Name | Purpose | Default |
|------------|---------|---------|
| `focus-ring-width` | Ring thickness | `2px` |
| `focus-ring-color` | Ring color | derives from `ring` |
| `focus-ring-offset` | Gap between element and ring | `2px` |
| `focus-ring-style` | Ring line style | `solid` |

Focus tokens derive from `ring` semantic color unless overridden. Required for WCAG 2.2 Focus Appearance compliance.

### Elevation Namespace

Pairs semantic depth (z-index) with shadow. Can be used together or independently.

| Token Name | Purpose | Z-Index | Shadow Pairing |
|------------|---------|---------|----------------|
| `elevation-surface` | Base content | 0 | `shadow-none` |
| `elevation-raised` | Cards, raised elements | 1 | `shadow-sm` |
| `elevation-sticky` | Sticky headers | 20 | `shadow-md` |
| `elevation-overlay` | Backdrops | 40 | `shadow-lg` |
| `elevation-modal` | Modal dialogs | 50 | `shadow-xl` |
| `elevation-popover` | Popovers/tooltips | 60 | `shadow-lg` |
| `elevation-toast` | Toast notifications | 70 | `shadow-xl` |

### Layout Namespaces

| Tailwind Namespace | Registry Tokens | Notes |
|-------------------|-----------------|-------|
| `--breakpoint-*` | `breakpoint-sm` through `breakpoint-2xl` | Responsive breakpoints |
| `--container-*` | Container max-widths | Content width limits |

### Localization Namespace (MVP+1)

| Token Property | Purpose | Values |
|----------------|---------|--------|
| `textDirection` | Text flow direction | `ltr`, `rtl`, `auto` |
| `localeAware` | Token varies by locale | `true`/`false` |

Basic RTL/LTR support and locale-aware spacing. Full i18n token system is future scope.

---

## Part 3: Token Schema Usage

### Root Tokens (Generator-Created)

```typescript
// Color family - full ColorValue with intelligence
{
  name: "ocean-blue",
  value: {
    name: "ocean-blue",
    scale: [/* 11 OKLCH values for 50-950 */],
    intelligence: { /* AI-generated */ },
    harmonies: { /* calculated */ },
    accessibility: { /* WCAG data */ },
  },
  category: "color",
  namespace: "color",
  semanticMeaning: "Primary brand color, evokes trust and professionalism",
  usagePatterns: {
    do: ["Use for primary actions", "Headers and key UI elements"],
    never: ["Body text", "Large background areas"],
  },
}

// Spacing base
{
  name: "spacing-base",
  value: "0.25rem",
  category: "spacing",
  namespace: "spacing",
  semanticMeaning: "Foundation unit for all spacing calculations",
  progressionSystem: "linear",
}
```

### Derived Tokens (Rule-Generated)

```typescript
// Scale position (generated by scale rule)
{
  name: "ocean-blue-500",
  value: { family: "ocean-blue", position: "500" },
  category: "color",
  namespace: "color",
  dependsOn: ["ocean-blue"],
  generationRule: "scale:500",
  scalePosition: 5,
}

// Semantic reference
{
  name: "primary",
  value: { family: "ocean-blue", position: "500" },
  category: "color",
  namespace: "semantic",
  dependsOn: ["ocean-blue-500"],
  semanticMeaning: "Primary action color, highest visual priority",
  usagePatterns: {
    do: ["Main CTA buttons", "Key interactive elements"],
    never: ["More than one primary per section"],
  },
}

// State variant (generated by state rule)
{
  name: "primary-hover",
  value: { family: "ocean-blue", position: "600" },
  category: "color",
  namespace: "semantic",
  dependsOn: ["primary"],
  generationRule: "state:hover",
  interactionType: "hover",
}

// Foreground pair (generated by contrast rule)
{
  name: "primary-foreground",
  value: { family: "neutral", position: "50" },
  category: "color",
  namespace: "semantic",
  dependsOn: ["primary"],
  generationRule: "contrast:primary",
  accessibilityLevel: "AAA",
}
```

### Override Tokens (Designer-Modified)

```typescript
// Designer overrides secondary radius
{
  name: "card-radius",
  value: "1rem", // Was "0.25rem" from defaults
  category: "radius",
  namespace: "radius",

  // Designer intent - the WHY behind the override
  overrideReason: "Cards need visual anchoring in data-dense dashboard layouts",
  appliesWhen: ["data-heavy interfaces", "dashboard contexts"],
  usagePatterns: {
    do: ["Card containers", "Modal dialogs"],
    never: ["Inline elements", "Dense form layouts"],
  },

  // Git blame shows: what it was, when changed, who changed it
}
```

---

## Part 4: shadcn Integration

### Variable Structure

shadcn uses semantic pairs in `:root`, bridged to Tailwind via `@theme inline`:

```css
/* Semantic tokens (from registry) */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.65 0.15 250);
  --primary-foreground: oklch(0.98 0.01 250);
  /* ... */
  --radius: 0.625rem;
}

/* Bridge to Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

### Dark Mode

Tokens support theme variants. Generator creates both light and dark semantic mappings:

```typescript
// Light mode
{ name: "background", value: { family: "neutral", position: "50" }, ... }

// Dark mode (same token name, different resolution context)
{ name: "background", value: { family: "neutral", position: "950" }, themeVariant: "dark", ... }
```

---

## Part 5: Generator Requirements

### What Generators Must Create

1. **Color Families** - Full `ColorValue` with:
   - 11-position scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
   - Intelligence (AI-generated name, emotional impact, usage guidance)
   - Harmonies (complementary, triadic, analogous, etc.)
   - Accessibility (WCAG contrast matrices, CVD simulations)

2. **Semantic Color Mappings** - `ColorReference` tokens:
   - All shadcn semantics (background, foreground, primary, etc.)
   - All state variants (-hover, -active, -focus, -disabled)
   - All foreground pairs (-foreground)

3. **Depth Scale** - Semantic z-index:
   - Named layers (base, dropdown, modal, toast, etc.)
   - Semantic meanings for each layer

4. **Typography** - Font families, sizes, weights:
   - With line-height companions
   - With letter-spacing where appropriate

5. **Spacing** - Base unit and named scale:
   - Using configured progression system (minor-third for shadcn compatibility)

6. **Radius** - Border radius scale:
   - With shadcn calc-based variants

7. **Shadows** - Elevation scale:
   - Multiple shadow layers for depth

8. **Motion** - Durations and easings:
   - With reduced-motion awareness

### Default Design System

Generator creates a grayscale default using proper mathematical progression.

**Progression:** Minor-third (1.2 ratio) computed via `@rafters/math-utils`

**Default Neutral Scale:**
- Hue: ~286° (slight purple-blue tint, like shadcn zinc)
- Chroma: Near 0 (grayscale), slight increase in midtones
- Lightness: Computed from minor-third progression, anchored at L=0.5 for 500

The generator computes the full 11-position scale (50-950) mathematically. shadcn's hand-tuned values serve as reference for expected output:

| Position | shadcn Reference L | Usage |
|----------|-------------------|-------|
| 50 | ~0.985 | Near white |
| 100 | ~0.967 | Light backgrounds |
| 200 | ~0.920 | Borders |
| 500 | ~0.705 | Middle gray |
| 700 | ~0.552 | Muted text |
| 900 | ~0.210 | Dark text/bg |
| 950 | ~0.141 | Near black |

**Default Typography:**
- Font family: `'Noto Sans Variable', sans-serif`
- Sizes: Computed from minor-third progression

**Default Semantic Mappings (Light Mode):**

| Semantic | Family | Position |
|----------|--------|----------|
| background | neutral | 50 (white) |
| foreground | neutral | 950 |
| card | neutral | 50 (white) |
| card-foreground | neutral | 950 |
| primary | neutral | 900 |
| primary-foreground | neutral | 50 |
| secondary | neutral | 100 |
| secondary-foreground | neutral | 900 |
| muted | neutral | 100 |
| muted-foreground | neutral | 700 |
| accent | neutral | 900 |
| accent-foreground | neutral | 50 |
| border | neutral | 200 |
| input | neutral | 200 |
| ring | neutral | 500 |

**Default Semantic Mappings (Dark Mode):**

| Semantic | Family | Position |
|----------|--------|----------|
| background | neutral | 950 |
| foreground | neutral | 50 |
| card | neutral | 900 |
| card-foreground | neutral | 50 |
| primary | neutral | 200 |
| primary-foreground | neutral | 900 |
| secondary | neutral | 800 |
| secondary-foreground | neutral | 50 |
| muted | neutral | 800 |
| muted-foreground | neutral | 500 |
| accent | neutral | 200 |
| accent-foreground | neutral | 900 |

**Default Radius:** `0.625rem` (10px) - maps to `radius-lg`

**Radius Scale (calc-based from base):**

| Token | Calculation | Value |
|-------|-------------|-------|
| radius-sm | base - 4px | 0.375rem (6px) |
| radius-md | base - 2px | 0.5rem (8px) |
| radius-lg | base | 0.625rem (10px) |
| radius-xl | base + 4px | 0.875rem (14px) |
| radius-2xl | base + 8px | 1.125rem (18px) |

**Destructive Color (separate family):**

| Mode | OKLCH Value | Notes |
|------|-------------|-------|
| Light | oklch(0.577 0.245 27.325) | Vivid red-orange |
| Dark | oklch(0.704 0.191 22.216) | Lighter for dark bg |

**Chart Colors (5-color palette for data viz):**

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| chart-1 | oklch(0.646 0.222 41) | oklch(0.488 0.243 264) |
| chart-2 | oklch(0.600 0.118 185) | oklch(0.696 0.170 162) |
| chart-3 | oklch(0.398 0.070 227) | oklch(0.769 0.188 70) |
| chart-4 | oklch(0.828 0.189 84) | oklch(0.627 0.265 304) |
| chart-5 | oklch(0.769 0.188 70) | oklch(0.645 0.246 16) |

---

## Part 6: Style Dictionary Export

Style Dictionary reads the registry and outputs:

### Tailwind v4 CSS

```css
@theme {
  /* Color scales */
  --color-neutral-50: oklch(0.98 0 0);
  --color-neutral-100: oklch(0.96 0 0);
  /* ... */

  /* Semantic colors */
  --color-background: var(--neutral-50);
  --color-primary: var(--neutral-900);

  /* State variants */
  --color-primary-hover: var(--neutral-800);

  /* Depth */
  --z-index-modal: 50;
  --z-index-toast: 70;

  /* Typography */
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --text-base: 1rem;
  --text-base--line-height: 1.5rem;

  /* Spacing */
  --spacing: 0.25rem;

  /* Radius */
  --radius-lg: 0.625rem;
}
```

### DTCG JSON (for interop)

```json
{
  "color": {
    "$type": "color",
    "neutral": {
      "50": { "$value": { "colorSpace": "oklch", "channels": [0.98, 0, 0] } }
    }
  }
}
```

---

## Sources

- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
