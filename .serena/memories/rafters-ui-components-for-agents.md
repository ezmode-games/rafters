# Rafters UI Components - Agent Guidelines

## Core Principle: Agents Don't Make Design Choices

The designer's decisions are encoded in:
1. **Tokens** - colors, spacing, typography values
2. **Components** - semantic structure with embedded intelligence

Agents compose these. They never pick values.

## Container Component

**Purpose**: Semantic structure, not layout

**Props**:
- `as`: 'div' | 'main' | 'section' | 'article' | 'aside' - semantic HTML element
- `size`: 'sm' | 'md' | 'lg' | ... | '7xl' | 'full' - max-width constraint
- `padding`: '0' | '1' | '2' | ... | '24' - internal spacing
- `query`: boolean - enable container queries (default true)
- `background`: 'none' | 'muted' | 'accent' | 'card'

**Behavior**:
- Renders semantic HTML element
- No layout imposed - children flow in normal document flow
- `article` gets automatic typography styling
- Container queries enabled by default

**Usage**:
```tsx
<Container as="main">
  <Container as="nav" />
  <Container as="aside" />
  <Container as="section" />
</Container>
```

## Grid Component

**Purpose**: Content layouts with semantic presets

**Presets**:
- `linear` - Equal-priority content (catalogs, galleries)
- `golden` - Hierarchical flow (2:1 ratio)
- `bento` - Complex attention patterns (dashboards)

**Bento Patterns**:
- `editorial` - Hero + supporting articles
- `dashboard` - Primary metric + supporting data
- `feature` - Main feature + benefits
- `portfolio` - Featured work + gallery

**NOT for app shell layout** - use for content within regions.

## Typography Components

**Use semantic meaning, not visual styling**:
- `H1` - Page title (one per page)
- `H2` - Section headings
- `H3` - Subsections
- `P` - Body paragraphs
- `Lead` - Introductory text
- `Muted` - Secondary/supplementary info
- `Code` - Technical terms
- `Small` - Fine print

All styling is pre-encoded. Agent picks semantic meaning, component applies the designer's style.

## App Shell Layout

Two approaches:

**1. Grid classes on Container**:
```tsx
<Container as="main" className="grid grid-cols-12 grid-rows-12 min-h-svh">
  <Container as="nav" className="col-span-12" />
  <Container as="aside" className="col-span-1 row-span-11" />
  <Container as="section" className="col-span-11 row-span-11" />
</Container>
```

**2. Grid component with Containers inside**:
```tsx
<Grid preset="linear" columns={2}>
  <Container as="aside">...</Container>
  <Container as="section">...</Container>
</Grid>
```

## classy() Primitive

Blocks arbitrary Tailwind values:
- `grid-cols-[auto_1fr]` - BLOCKED, warns in console
- `grid-cols-12` - OK, standard Tailwind

## Rules

1. **NO arbitrary values** - no `-[400px]`, `-[#ff0000]`, etc.
2. **NO design choices** - don't pick font sizes, spacing values, colors
3. **Use semantic tokens** - `bg-primary`, `text-muted-foreground`, `border-border`
4. **Use component props** - Container `padding`, `size`, `background`
5. **Structural layout is OK** - grid columns/rows for composition, not design

## Package Imports

Components are copied into projects via CLI (like shadcn). Within monorepo:

```tsx
import { Container } from '@rafters/ui/components/ui/container';
import { Muted } from '@rafters/ui/components/ui/typography';
import { Grid } from '@rafters/ui/components/ui/grid';
```

NOT: `import { Container } from '@rafters/ui'` (no "." export)
