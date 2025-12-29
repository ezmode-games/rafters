# Component Styling Reference

Concise reference for component variants and states. All tokens from `@rafters/design-tokens`.

## Semantic Variants

| Variant | Background | Foreground | Use For | Never |
|---------|------------|------------|---------|-------|
| `primary` | `bg-primary` | `text-primary-foreground` | Main CTA, primary links | Multiple competing primaries, destructive actions |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | Secondary actions, less prominent | Primary CTAs |
| `destructive` | `bg-destructive` | `text-destructive-foreground` | Delete, remove, critical warnings | Non-destructive actions, without confirmation |
| `success` | `bg-success` | `text-success-foreground` | Confirmations, completions, valid states | Neutral info, warnings |
| `warning` | `bg-warning` | `text-warning-foreground` | Caution, potential issues | Critical errors, success states |
| `info` | `bg-info` | `text-info-foreground` | Tips, help, neutral information | Warnings, errors |
| `muted` | `bg-muted` | `text-muted-foreground` | Subtle backgrounds, disabled areas | Interactive elements needing visibility |
| `accent` | `bg-accent` | `text-accent-foreground` | Hover states, selected items | Primary actions |
| `outline` | `bg-transparent border-input` | `text-foreground` | Secondary actions with border | When solid background needed |
| `ghost` | `bg-transparent` | `text-foreground` | Minimal visual weight, icon buttons | When button needs visibility |

## Interactive States

Each variant has state tokens following the pattern `{variant}-{state}`:

| State | Token Suffix | Example | Purpose |
|-------|--------------|---------|---------|
| Default | (none) | `bg-primary` | Resting state |
| Hover | `-hover` | `bg-primary-hover` | Mouse over |
| Active | `-active` | `bg-primary-active` | Pressed/clicked |
| Focus | `-focus` | `bg-primary-focus` | Keyboard focus background |
| Ring | `-ring` | `ring-primary-ring` | Focus ring color |
| Border | `-border` | `border-primary-border` | Border color |
| Subtle | `-subtle` | `bg-primary-subtle` | Low-emphasis background (badges, alerts) |

## State Pattern Examples

```tsx
// Button with full state handling
className={classy(
  // Base
  'bg-primary text-primary-foreground',
  // States
  'hover:bg-primary-hover',
  'active:bg-primary-active',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-ring focus-visible:ring-offset-2',
  // Disabled
  'disabled:pointer-events-none disabled:opacity-50'
)}
```

## Surface Tokens

For containers, cards, modals, popovers:

| Surface | Background | Foreground | Border | Use For |
|---------|------------|------------|--------|---------|
| `background` | `bg-background` | `text-foreground` | - | Page background |
| `card` | `bg-card` | `text-card-foreground` | `border-card-border` | Cards, modals, dialogs |
| `popover` | `bg-popover` | `text-popover-foreground` | `border-popover-border` | Dropdowns, tooltips, menus |
| `surface` | `bg-surface` | `text-surface-foreground` | `border-surface-border` | Generic elevated surfaces |

## Input Tokens

| Token | Class | Use For |
|-------|-------|---------|
| `input` | `bg-input border-input` | Input backgrounds and borders |
| `ring` | `ring-ring` | Default focus ring |
| `placeholder` | `placeholder:text-muted-foreground` | Placeholder text |

## Elevation

Combine depth and shadow tokens:

| Level | Depth | Shadow | Use For |
|-------|-------|--------|---------|
| `surface` | `z-depth-base` | `shadow-none` | In-flow content |
| `raised` | `z-depth-base` | `shadow-sm` | Cards, panels |
| `overlay` | `z-depth-dropdown` | `shadow` | Dropdowns, menus |
| `sticky` | `z-depth-sticky` | `shadow-md` | Sticky headers |
| `modal` | `z-depth-modal` | `shadow-lg` | Modals, dialogs |
| `popover` | `z-depth-popover` | `shadow-xl` | Popovers above modals |
| `tooltip` | `z-depth-tooltip` | `shadow-lg` | Tooltips, toasts |

## Motion

Use motion tokens with `prefers-reduced-motion` support:

```tsx
// Transition with reduced motion support
className="transition-colors duration-normal motion-reduce:transition-none"

// Animation
className="motion-safe:animate-fade-in motion-reduce:animate-none"
```

| Duration | Token | Use For |
|----------|-------|---------|
| `instant` | `duration-0` | No animation |
| `fast` | `duration-fast` | Micro-interactions, hover |
| `normal` | `duration-normal` | Standard transitions |
| `slow` | `duration-slow` | Enter/exit animations |

## Rules

1. **Never use arbitrary values** - No `bg-[#ff0000]` or `p-[13px]`
2. **Never use positioning** - No `absolute/relative/fixed` unless no alternative; use flexbox/grid
3. **Use container queries** - Prefer `@container` + `@md:` over viewport media queries
4. **Always pair background/foreground** - `bg-primary` requires `text-primary-foreground`
5. **Always include focus-visible** - Every interactive element needs visible focus state
6. **Support reduced motion** - Use `motion-safe:`/`motion-reduce:` utilities

## Quick Reference

```tsx
// Primary button
"bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active focus-visible:ring-2 focus-visible:ring-primary-ring"

// Secondary button
"bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-2 focus-visible:ring-secondary-ring"

// Destructive button
"bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active focus-visible:ring-2 focus-visible:ring-destructive-ring"

// Ghost button
"bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"

// Outline button
"border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"

// Card
"bg-card text-card-foreground border border-card-border rounded-lg shadow-sm"

// Dialog overlay
"bg-black/80 z-depth-modal"

// Dialog content
"bg-card text-card-foreground border border-card-border shadow-lg z-depth-modal"
```
