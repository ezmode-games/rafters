# Rafters Registry Status

**Last Updated:** January 2026
**Source:** Registry reads from `packages/ui/src/`
**Total Items:** 72 (55 components + 17 primitives)

## shadcn Drop-in Compatible Components (44)

These components work with shadcn markup verbatim:

### Overlay Components (11) - All Fixed
| Component | Status | Notes |
|-----------|--------|-------|
| `select` | DROP-IN | Trigger includes chevron, Content portals internally |
| `dropdown-menu` | DROP-IN | Content portals internally |
| `dialog` | DROP-IN | Content includes Portal + Overlay + Close button |
| `alert-dialog` | DROP-IN | Content includes Portal + Overlay (no close button by design) |
| `sheet` | DROP-IN | Content includes Portal + Overlay + Close button, `side` prop |
| `drawer` | DROP-IN | Content includes Portal + Overlay + Close button |
| `popover` | DROP-IN | Uses Float primitive, already correct |
| `tooltip` | DROP-IN | Content portals internally |
| `hover-card` | DROP-IN | Content portals internally |
| `context-menu` | DROP-IN | Content portals internally |
| `menubar` | DROP-IN | Content portals internally |

### Form Components (12)
| Component | Status | Notes |
|-----------|--------|-------|
| `button` | DROP-IN | Standard button with variants |
| `input` | DROP-IN | Standard input |
| `textarea` | DROP-IN | Standard textarea |
| `checkbox` | DROP-IN | Controlled/uncontrolled |
| `radio-group` | DROP-IN | Radio button group |
| `switch` | DROP-IN | Toggle switch |
| `slider` | DROP-IN | Range slider |
| `label` | DROP-IN | Form label |
| `input-otp` | DROP-IN | OTP input fields |
| `toggle` | DROP-IN | Toggle button |
| `toggle-group` | DROP-IN | Grouped toggles |
| `calendar` | DROP-IN | Date calendar |

### Display Components (11)
| Component | Status | Notes |
|-----------|--------|-------|
| `card` | DROP-IN | Card container |
| `badge` | DROP-IN | Status badge |
| `alert` | DROP-IN | Alert message |
| `avatar` | DROP-IN | User avatar |
| `separator` | DROP-IN | Visual separator |
| `skeleton` | DROP-IN | Loading skeleton |
| `progress` | DROP-IN | Progress bar |
| `table` | DROP-IN | Data table |
| `tabs` | DROP-IN | Tab navigation |
| `accordion` | DROP-IN | Collapsible sections |
| `collapsible` | DROP-IN | Collapsible content |

### Navigation Components (5)
| Component | Status | Notes |
|-----------|--------|-------|
| `breadcrumb` | DROP-IN | Breadcrumb navigation |
| `pagination` | DROP-IN | Page navigation |
| `navigation-menu` | DROP-IN | Site navigation |
| `sidebar` | DROP-IN | Sidebar navigation |
| `command` | DROP-IN | Command palette (cmdk-style) |

### Utility Components (5)
| Component | Status | Notes |
|-----------|--------|-------|
| `aspect-ratio` | DROP-IN | Aspect ratio container |
| `scroll-area` | DROP-IN | Custom scrollbar |
| `resizable` | DROP-IN | Resizable panels |
| `carousel` | DROP-IN | Image/content carousel |
| `date-picker` | DROP-IN | Date input with calendar |

## Extended Components (8)

Components that extend shadcn patterns or fill gaps:

| Component | Status | Notes |
|-----------|--------|-------|
| `combobox` | DROP-IN | Searchable select (shadcn uses Command+Popover pattern) |
| `button-group` | DROP-IN | Grouped buttons with connected styling |
| `field` | DROP-IN | Form field wrapper with label/description/error |
| `input-group` | DROP-IN | Input with addons (icons, text, buttons) |
| `item` | DROP-IN | Generic list item for menus and selection |
| `empty` | DROP-IN | Empty state display |
| `spinner` | DROP-IN | Loading spinner |
| `typography` | DROP-IN | Text styling utilities |

## Rafters-Only Components (3)

Additional utility components unique to Rafters:

| Component | Notes |
|-----------|-------|
| `container` | Layout container with max-width constraints |
| `grid` | CSS grid helper with responsive columns |
| `kbd` | Keyboard shortcut display |

## Primitives (17)

Low-level building blocks used by components. See **[PRIMITIVES.md](./PRIMITIVES.md)** for full documentation.

| Primitive | Notes |
|-----------|-------|
| `aria-manager` | ARIA attribute management |
| `classy` | Class name merging utility |
| `collision-detector` | Viewport collision detection for positioning |
| `dialog-aria` | Dialog accessibility helpers |
| `dismissable-layer` | Click-outside and escape key dismissal |
| `escape-keydown` | Escape key event handling |
| `float` | Floating content positioning (popovers, tooltips, etc.) |
| `focus-trap` | Focus management within containers |
| `hover-delay` | Hover intent with configurable delays |
| `intelligence-integration` | JSDoc intelligence metadata integration |
| `keyboard-handler` | Keyboard navigation utilities |
| `outside-click` | Click outside detection |
| `portal` | Portal rendering to document.body |
| `roving-focus` | Arrow key navigation for lists |
| `slot` | Slot composition pattern |
| `sr-announcer` | Screen reader announcements |
| `typeahead` | Type-ahead search for lists |

## Summary

### Components (55)
- **44 shadcn drop-in compatible** - Users can copy shadcn code verbatim
- **8 extended components** - shadcn-compatible patterns with enhancements
- **3 Rafters-only** - Additional utility components

**Total shadcn-compatible: 52 components**

### Primitives (17)
- Low-level building blocks powering all components
- No external dependencies (no Radix, no headless-ui)
- SSR-compatible, multi-framework ready

### Registry Total: 72 items

All overlay components include Portal/Overlay internally, matching shadcn's API exactly.

## Registry Sources

- **Components:** `packages/ui/src/components/ui/*.tsx`
- **Primitives:** `packages/ui/src/primitives/*.{ts,tsx}` (excludes types.ts)

The registry dynamically reads from these directories. Any file added becomes a registry item.
