# shadcn/ui Compatibility Matrix

This document tracks Rafters UI component compatibility with shadcn/ui, ensuring drop-in replacement capability.

## Status Legend

- **DONE** - Fully compatible, all props/structure match
- **P0** - Critical priority, in progress
- **P1** - High priority
- **P2** - Medium priority
- **P3** - Lower priority
- **N/A** - Not applicable (Rafters-specific or not in shadcn)

## Compatibility Columns

- **Props Match**: All shadcn props present with compatible types
- **Structure Match**: Compound components named identically
- **Behavior Match**: Keyboard nav, focus, click behavior identical

---

## P0 - Critical Components

| Component | Props Match | Structure Match | Behavior Match | Status | Notes |
|-----------|-------------|-----------------|----------------|--------|-------|
| Button | YES | YES | YES | DONE | Added: link variant, xs/icon-* sizes |
| Input | YES+ | YES | YES | DONE | Extra: variant, size props |
| Dialog | YES | YES | YES | DONE | Auto-portal/overlay |
| Select | YES | YES | YES | DONE | All subcomponents present |
| Dropdown Menu | YES | YES | YES | DONE | All subcomponents present |
| Tabs | YES | YES | YES | DONE | List/Trigger/Content match |
| Card | YES | YES | YES | DONE | Added: size, CardAction |

## P1 - High Priority Components

| Component | Props Match | Structure Match | Behavior Match | Status | Notes |
|-----------|-------------|-----------------|----------------|--------|-------|
| Accordion | YES | YES | YES | DONE | All subcomponents present |
| Alert | YES | YES | YES | DONE | Added: AlertAction |
| Alert Dialog | YES | YES | YES | DONE | All subcomponents present |
| Badge | YES | YES | YES | DONE | Added: ghost, link variants |
| Checkbox | YES+ | YES | YES | DONE | Extra: variant, size props |
| Label | YES | YES | YES | DONE | Direct match |
| Popover | YES | YES | YES | DONE | All subcomponents present |
| Tooltip | YES | YES | YES | DONE | All subcomponents present |

## P2 - Medium Priority Components

| Component | Props Match | Structure Match | Behavior Match | Status | Notes |
|-----------|-------------|-----------------|----------------|--------|-------|
| Avatar | TBD | TBD | TBD | P2 | |
| Breadcrumb | TBD | TBD | TBD | P2 | |
| Calendar | TBD | TBD | TBD | P2 | |
| Carousel | TBD | TBD | TBD | P2 | |
| Command | TBD | TBD | TBD | P2 | |
| Context Menu | TBD | TBD | TBD | P2 | |
| Hover Card | TBD | TBD | TBD | P2 | |
| Input OTP | TBD | TBD | TBD | P2 | |
| Menubar | TBD | TBD | TBD | P2 | |
| Progress | TBD | TBD | TBD | P2 | |

## P3 - Lower Priority Components

| Component | Props Match | Structure Match | Behavior Match | Status | Notes |
|-----------|-------------|-----------------|----------------|--------|-------|
| Collapsible | TBD | TBD | TBD | P3 | |
| Navigation Menu | TBD | TBD | TBD | P3 | |
| Radio Group | TBD | TBD | TBD | P3 | |
| Resizable | TBD | TBD | TBD | P3 | |
| Scroll Area | TBD | TBD | TBD | P3 | |
| Sheet | TBD | TBD | TBD | P3 | |
| Sidebar | TBD | TBD | TBD | P3 | |
| Skeleton | TBD | TBD | TBD | P3 | |
| Slider | TBD | TBD | TBD | P3 | |
| Switch | TBD | TBD | TBD | P3 | |
| Table | TBD | TBD | TBD | P3 | |
| Textarea | TBD | TBD | TBD | P3 | |
| Toggle | TBD | TBD | TBD | P3 | |
| Toggle Group | TBD | TBD | TBD | P3 | |

---

## Intentional Rafters Additions

These additions do NOT break shadcn compatibility (additive only):

### Button
- Extra variants: `success`, `warning`, `info`, `muted`, `accent`, `primary`, `link`
- Extra sizes: `xs`, `icon-xs`, `icon-sm`, `icon-lg`
- Extra props: `loading`
- JSDoc intelligence metadata

### Input
- Extra variants: `primary`, `secondary`, `destructive`, `success`, `warning`, `info`, `muted`, `accent`
- Extra sizes: `sm`, `default`, `lg`
- JSDoc intelligence metadata

### Card
- Extra props: `as` (semantic element), `interactive`, `editable`, `size`
- Extra component: `CardAction`
- JSDoc intelligence metadata

### All Overlay Components
- Auto-Portal: Overlays auto-include Portal (shadcn requires explicit)

### Alert
- Extra component: `AlertAction`
- Extra variants: `primary`, `success`, `warning`, `info`, `muted`, `accent`
- JSDoc intelligence metadata

### Badge
- Extra variants: `primary`, `success`, `warning`, `info`, `muted`, `accent`
- Extra sizes: `sm`, `default`, `lg`
- JSDoc intelligence metadata

### Checkbox
- Extra variants: semantic color variants
- Extra sizes: `sm`, `default`, `lg`
- JSDoc intelligence metadata

### All Components
- JSDoc intelligence metadata (@cognitive-load, @trust-building, etc.)

---

## Audit Checklist

For each component audit:

1. [ ] Compare shadcn source props to Rafters props
2. [ ] Verify all shadcn variants/sizes exist
3. [ ] Check compound component names match exactly
4. [ ] Test keyboard navigation matches
5. [ ] Verify focus management identical
6. [ ] Update this matrix with findings
