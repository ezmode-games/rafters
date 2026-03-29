# Depth

Interfaces have layers. A dropdown sits above the page. A modal sits above the dropdown. A toast sits above everything. If these layers collide, the user loses trust in the interface.

## The Stack

Every layer has a fixed position. No z-index wars. No `z-[9999]`.

| Layer | Token | What lives here |
|-------|-------|----------------|
| Base | 0 | Page content, cards, form controls |
| Navigation | `z-depth-navigation` | Sidebars, fixed headers |
| Dropdown | `z-depth-dropdown` | Select menus, dropdown menus, comboboxes |
| Popover | `z-depth-popover` | Popovers, hover cards, tooltips |
| Overlay | `z-depth-overlay` | Background dim behind modals |
| Modal | `z-depth-modal` | Dialogs, sheets, command palettes |
| Toast | `z-depth-toast` | Notifications that sit above everything |

These are not suggestions. A dropdown at `z-depth-modal` is a bug. A modal at `z-depth-dropdown` is invisible behind its own overlay.

<!-- VENEER: Exploded view. Show the depth stack as separated horizontal planes, like an architectural section drawing. Each plane labeled with what lives on it. The user sees the spatial model. -->

## Depth Comes With Shadow

Higher layers cast larger shadows. This is how the real world works -- a sheet of paper held close to a desk casts a tight shadow. Held high, the shadow spreads.

| Depth | Shadow |
|-------|--------|
| Base (cards, inputs) | `shadow-sm` -- tight, subtle |
| Dropdown, popover | `shadow-md` -- visible but grounded |
| Modal, sheet | `shadow-lg` -- clearly elevated |

The shadow tokens are in `@theme`. Tailwind's `shadow-sm`, `shadow-md`, `shadow-lg` read from the system. Change the shadow definition, every component at that depth updates.

<!-- VENEER: Three cards stacked at different depths. Each casts the corresponding shadow. The user sees depth through shadow, not through z-index numbers. -->

## Focus Trap

When a modal opens, keyboard focus is trapped inside it. Tab cycles through the modal's focusable elements. Escape closes it. Focus returns to the element that opened it.

This is not optional. Without focus trap, a keyboard user tabs behind the modal into invisible content. The overlay dims the page visually, but screen readers and keyboards don't see visual dimming.

<!-- VENEER: Animated sequence. Modal opens, focus ring moves through its elements, reaches the end, wraps to the beginning. Escape closes, focus returns to the trigger button. Show the focus ring path. -->
