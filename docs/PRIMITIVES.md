# Rafters Primitives

**Source:** `packages/ui/src/primitives/`
**Total:** 17 primitives

Low-level building blocks powering all Rafters components. Zero external dependencies, SSR-safe, framework-agnostic.

## Design Principles

1. **Stateless** - Accept state as input, return cleanup functions
2. **SSR-Safe** - Check `typeof window/document` before DOM access
3. **Framework-Agnostic** - Pure TypeScript, no React/Vue/Svelte deps
4. **Cleanup Pattern** - All return `CleanupFunction` for proper teardown
5. **WCAG Compliant** - Accessibility built-in, not bolted-on

---

## Quick Reference

| Primitive | Purpose | Used By |
|-----------|---------|---------|
| [aria-manager](#aria-manager) | Type-safe ARIA attributes | All components |
| [classy](#classy) | Tailwind class merging | All components |
| [collision-detector](#collision-detector) | Viewport positioning | float, popover, tooltip |
| [dialog-aria](#dialog-aria) | Dialog accessibility | dialog, alert-dialog, sheet |
| [dismissable-layer](#dismissable-layer) | Unified dismissal | dropdown-menu, popover |
| [escape-keydown](#escape-keydown) | Escape key handling | All overlays |
| [float](#float) | Floating positioning | popover, tooltip, select |
| [focus-trap](#focus-trap) | Focus management | dialog, alert-dialog |
| [hover-delay](#hover-delay) | Hover timing | tooltip, hover-card |
| [intelligence-integration](#intelligence-integration) | Cognitive load analysis | JSDoc system |
| [keyboard-handler](#keyboard-handler) | Keyboard events | All interactive |
| [outside-click](#outside-click) | Click outside detection | All overlays |
| [portal](#portal) | DOM portaling | All overlays |
| [roving-focus](#roving-focus) | Arrow navigation | menu, tabs, radio-group |
| [slot](#slot) | Prop merging (asChild) | All components |
| [sr-announcer](#sr-announcer) | Screen reader | toast, progress |
| [typeahead](#typeahead) | Type-to-search | select, combobox, menu |

---

## Primitives

### aria-manager

Type-safe ARIA attribute management with validation.

```typescript
import { setAriaAttributes } from '@rafters/ui/primitives/aria-manager';

const cleanup = setAriaAttributes(element, {
  'aria-expanded': true,
  'aria-controls': 'menu-1',
  role: 'button',
});
```

**WCAG:** 4.1.2 Name, Role, Value (Level A)

---

### classy

Tailwind-aware class builder with token resolution and arbitrary value blocking.

```typescript
import classy from '@rafters/ui/primitives/classy';

// Basic usage
const className = classy('flex items-center', isActive && 'bg-primary');

// With conditional objects
const className = classy({
  'flex items-center': true,
  'bg-primary': isActive,
  'opacity-50': disabled,
});

// Token refs (design system integration)
const className = classy('p-4', { $token: 'button.primary' });
```

**Features:**
- Deduplication and normalization
- Conditional class support
- Arbitrary value detection/blocking
- Token reference resolution

---

### collision-detector

Floating element positioning with viewport collision detection.

```typescript
import { computePosition } from '@rafters/ui/primitives/collision-detector';

const { x, y, side, align } = computePosition(anchor, floating, {
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  avoidCollisions: true,
  collisionPadding: 10,
});

floating.style.transform = `translate(${x}px, ${y}px)`;
```

**Options:**
- `side`: 'top' | 'right' | 'bottom' | 'left'
- `align`: 'start' | 'center' | 'end'
- `sideOffset`: Offset from anchor (px)
- `alignOffset`: Alignment offset (px)
- `avoidCollisions`: Flip on viewport collision
- `collisionPadding`: Viewport edge padding

---

### dialog-aria

Pure ARIA attribute functions for dialog accessibility.

```typescript
import { getDialogAriaProps, getTriggerAriaProps } from '@rafters/ui/primitives/dialog-aria';

const dialogProps = getDialogAriaProps({
  open: true,
  labelId: 'dialog-title',
  descriptionId: 'dialog-desc',
  modal: true,
});
// Returns: { role: 'dialog', 'aria-modal': 'true', ... }

const triggerProps = getTriggerAriaProps({
  open: false,
  controlsId: 'dialog-content',
});
// Returns: { 'aria-expanded': 'false', 'aria-controls': '...' }
```

---

### dismissable-layer

Unified dismissal combining outside click, escape key, and focus outside.

```typescript
import { createDismissableLayer } from '@rafters/ui/primitives/dismissable-layer';

const cleanup = createDismissableLayer(dropdownElement, {
  onDismiss: () => closeDropdown(),
  disableOutsidePointerEvents: true,
  onEscapeKeyDown: (e) => { /* optional override */ },
  onPointerDownOutside: (e) => { /* optional override */ },
  onFocusOutside: (e) => { /* optional override */ },
});
```

**WCAG:** 2.1.2 No Keyboard Trap, 3.2.1 On Focus

---

### escape-keydown

Simple escape key event handling.

```typescript
import { onEscapeKeyDown } from '@rafters/ui/primitives/escape-keydown';

const cleanup = onEscapeKeyDown((event) => {
  closeModal();
});
```

---

### float

Composable floating content positioning with portal, collision detection, and dismissal.

```typescript
import { Float } from '@rafters/ui/primitives/float';

<Float.Root open={open} onOpenChange={setOpen}>
  <Float.Anchor asChild>
    <button>Trigger</button>
  </Float.Anchor>
  <Float.Content side="bottom" align="center" sideOffset={4}>
    Floating content
  </Float.Content>
</Float.Root>
```

**Sub-components:**
- `Float.Root` - State management
- `Float.Anchor` - Positioning reference
- `Float.Content` - Floating element with portal
- `Float.Arrow` - Visual arrow
- `Float.Close` - Close trigger

---

### focus-trap

Focus management within a container element.

```typescript
import { createFocusTrap } from '@rafters/ui/primitives/focus-trap';

const cleanup = createFocusTrap(dialogElement);
// Focus trapped to dialogElement
// Tab cycles through focusable elements
// Cleanup restores previous focus
```

**Focusable elements:**
- `a[href]`
- `button:not([disabled])`
- `input:not([disabled])`
- `select:not([disabled])`
- `textarea:not([disabled])`
- `[tabindex]:not([tabindex="-1"])`

---

### hover-delay

Configurable show/hide delays for hover interactions.

```typescript
import { createHoverDelay } from '@rafters/ui/primitives/hover-delay';

const cleanup = createHoverDelay(triggerElement, {
  openDelay: 700,   // ms before showing
  closeDelay: 300,  // ms before hiding
  onOpen: () => showTooltip(),
  onClose: () => hideTooltip(),
});
```

---

### intelligence-integration

Cognitive load analysis for design intelligence.

```typescript
import { calculateDialogCognitiveLoad } from '@rafters/ui/primitives/intelligence-integration';

const { load, budget, withinBudget, recommendations } = calculateDialogCognitiveLoad({
  hasTitle: true,
  hasDescription: true,
  hasForm: true,
  formFieldCount: 3,
  hasMultipleActions: true,
});
// load: 9, budget: 15, withinBudget: true
```

---

### keyboard-handler

Type-safe keyboard event handling with modifier support.

```typescript
import { createKeyboardHandler } from '@rafters/ui/primitives/keyboard-handler';

const cleanup = createKeyboardHandler(element, {
  key: ['Enter', 'Space'],
  handler: (event) => activateButton(),
  preventDefault: true,
  modifiers: { ctrl: true }, // Ctrl+Enter, Ctrl+Space
});
```

**WCAG:** 2.1.1 Keyboard, 2.1.4 Character Key Shortcuts

**Supported keys:**
`Enter`, `Space`, `Escape`, `Tab`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`, `Backspace`, `Delete`

---

### outside-click

Click/pointer outside detection.

```typescript
import { onOutsideClick, onPointerDownOutside } from '@rafters/ui/primitives/outside-click';

// Mouse/touch click outside
const cleanup = onOutsideClick(element, (event) => {
  closePopover();
});

// Pointer down outside (includes mouse, touch, pen)
const cleanup = onPointerDownOutside(element, (event) => {
  closePopover();
});
```

---

### portal

SSR-safe portal container resolution.

```typescript
import { getPortalContainer, isPortalSupported } from '@rafters/ui/primitives/portal';

const container = getPortalContainer({
  container: customContainer, // optional
  enabled: true,
});

// SSR check
if (isPortalSupported()) {
  createPortal(content, container);
}
```

---

### roving-focus

Arrow key navigation for composite widgets.

```typescript
import { createRovingFocus } from '@rafters/ui/primitives/roving-focus';

const cleanup = createRovingFocus(menuElement, {
  orientation: 'vertical',    // 'horizontal' | 'vertical' | 'both'
  loop: true,                 // Wrap at ends
  dir: 'ltr',                 // RTL support
  currentIndex: 0,            // Initial focus
  onNavigate: (index, element) => {
    setActiveIndex(index);
  },
});
```

**WCAG:** 2.1.1 Keyboard, 2.4.3 Focus Order

---

### slot

Prop merging for `asChild` composition pattern.

```typescript
import { mergeSlotProps, Slottable } from '@rafters/ui/primitives/slot';

// Merge parent props onto child element
const cleanup = mergeSlotProps(buttonProps, anchorElement, {
  mergeAria: true,
  mergeData: true,
  mergeClassName: true,
  mergeStyle: true,
  mergeEventHandlers: true,
});
```

**WCAG:** 4.1.2 Name, Role, Value (preserves ARIA during merge)

---

### sr-announcer

Screen reader live region announcements.

```typescript
import { createAnnouncer } from '@rafters/ui/primitives/sr-announcer';

const announcer = createAnnouncer({
  politeness: 'polite',      // 'polite' | 'assertive' | 'off'
  clearAfterAnnounce: true,
  clearTimeout: 1000,
});

announcer.announce('3 items loaded');
announcer.announce('Form submitted', 'assertive');

// Cleanup
announcer.destroy();
```

**WCAG:** 4.1.3 Status Messages (Level AA)

---

### typeahead

Type-to-search navigation for lists.

```typescript
import { createTypeahead } from '@rafters/ui/primitives/typeahead';

const cleanup = createTypeahead(listElement, {
  getItems: () => listElement.querySelectorAll('[role="option"]'),
  getItemText: (item) => item.textContent || '',
  onMatch: (item, index) => item.focus(),
  onNoMatch: (searchString) => console.log('No match:', searchString),
  resetDelay: 1000,  // Reset search after 1s of inactivity
});
```

**WCAG:** 2.1.1 Keyboard

---

## Shared Types

```typescript
// All primitives return cleanup functions
type CleanupFunction = () => void;

// Positioning
type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

// Navigation
type Orientation = 'horizontal' | 'vertical' | 'both';
type Direction = 'ltr' | 'rtl';

// Keyboard
type KeyboardKey = 'Enter' | 'Space' | 'Escape' | 'Tab' |
                   'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' |
                   'Home' | 'End' | 'PageUp' | 'PageDown' |
                   'Backspace' | 'Delete';

// Screen reader
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';
type LiveRegionRole = 'status' | 'alert' | 'log';
```

---

## SSR Safety Pattern

All primitives follow this pattern:

```typescript
export function createPrimitive(element: HTMLElement): CleanupFunction {
  // SSR guard - no-op during server render
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Safe to use DOM APIs here
  // ...

  return () => {
    // Cleanup DOM listeners/mutations
  };
}
```

---

## Usage in Components

Components import primitives directly:

```typescript
// In a component file
import { Float, useFloatContext } from '../../primitives/float';
import { onEscapeKeyDown } from '../../primitives/escape-keydown';
import { getPortalContainer } from '../../primitives/portal';
import classy from '../../primitives/classy';
```

The registry serves primitives at `lib/primitives/[name].ts`.
