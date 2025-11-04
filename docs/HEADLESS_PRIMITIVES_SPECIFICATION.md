# Headless Primitives Specification

**Version**: 1.0.0
**Status**: Authoritative Specification
**Last Updated**: 2025-11-03
**Compliance**: WCAG 2.2 Level AA, Section 508 (2017), ARIA 1.2

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Primitive Specifications](#primitive-specifications)
4. [Cross-Primitive Integration](#cross-primitive-integration)
5. [Testing Requirements](#testing-requirements)
6. [Compliance Verification](#compliance-verification)

---

## Overview

This document defines the complete specification for 8 headless accessibility primitives. These primitives are:

- **Stateless**: No internal state management
- **Event-driven**: Return `CleanupFunction`, consumers manage state
- **ARIA-focused**: Handle accessibility attributes, keyboard events, focus management
- **Framework-agnostic**: Vanilla TypeScript, zero framework dependencies
- **SSR-safe**: Check DOM availability before manipulation

### The 8 Primitives

1. **slot** - Prop merging for composition patterns (asChild)
2. **modal** - Dialog ARIA attributes and management
3. **keyboard** - Type-safe keyboard event handling with arrow navigation
4. **escape-handler** - Escape key and outside interaction detection
5. **aria** - Type-safe ARIA attribute management
6. **sr-manager** - Screen reader announcements via live regions
7. **resize** - Element resize observation and overlay repositioning
8. **focus** - Focus management and :focus-visible behavior

### Core Type

```typescript
/**
 * Cleanup function returned by all primitives.
 * Calling this removes event listeners and restores original DOM state.
 */
export type CleanupFunction = () => void;

/**
 * DOM availability check (SSR safety).
 */
export function isDOMAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}
```

---

## Architecture Principles

### What Primitives Do

1. **ARIA Attributes**: Set/update/remove `aria-*` attributes based on consumer state
2. **Keyboard Events**: Listen for keyboard interactions, call provided callbacks
3. **Focus Management**: Move focus, track focus, manage focus indicators
4. **Event Detection**: Detect Escape key, outside clicks, resize events
5. **DOM Manipulation**: Required for accessibility (attributes, focus, events)

### What Primitives Do Not Do

1. **State Management**: Primitives are stateless, consumers pass state as parameters
2. **Visual Styling**: NO `className`, NO `style` in consumer API
3. **Component Composition**: Primitives are utilities, not components
4. **Event Handler Merging**: Impossible in vanilla JS (framework adapters handle this)

### Critical Limitations

**Event Handler Merging is IMPOSSIBLE in Vanilla JS**

There is no DOM API to enumerate existing event listeners. This means:

- The `slot` primitive can merge ARIA attributes and data attributes
- The `slot` primitive CANNOT merge event handlers added via `addEventListener`
- Framework adapters (React, Vue, Svelte) handle event merging via their prop systems

---

## Primitive Specifications

### 1. Slot (Composition Utility)

#### What It Does

Merges ARIA attributes and data attributes from a child element onto a parent element. Enables the `asChild` pattern for component composition while preserving accessibility relationships.

#### TypeScript API

```typescript
interface SlotOptions {
  /**
   * Enable or disable the primitive.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Merge props from slotted child to container.
 *
 * WARNING: Event handler merging is IMPOSSIBLE in vanilla JS.
 * Only ARIA and data attributes are merged.
 * Use framework adapters (React/Vue/Svelte) for event handler merging.
 *
 * @param container - Parent element receiving merged props
 * @param slottedChild - Child element providing props to merge
 * @param options - Configuration options
 * @returns Cleanup function that restores original state
 */
export function createSlot(
  container: HTMLElement,
  slottedChild: Element | null | undefined,
  options?: SlotOptions
): CleanupFunction;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **1.3.1 Info and Relationships** | A | Preserves `aria-labelledby`, `aria-describedby` relationships during merge |
| **4.1.2 Name, Role, Value** | A | Maintains accessible name and role during prop merging |

#### Integration Pattern (React)

```tsx
// React adapter handles event merging
function Slot({ asChild, onClick, children, ...props }: SlotProps) {
  const ref = useRef<HTMLElement>(null);

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props;

    // Framework-level event handler composition
    const mergedOnClick = composeEventHandlers(
      childProps.onClick,
      onClick
    );

    return React.cloneElement(children, {
      ...props,
      ...childProps,
      onClick: mergedOnClick, // Merged in React, not primitive
      ref,
    });
  }

  return <span ref={ref} onClick={onClick} {...props}>{children}</span>;
}
```

#### What It Does NOT Do

- Merge `className` (use `tailwind-merge` in framework adapter)
- Merge `style` attributes (visual styling is out of scope)
- Merge event handlers (impossible in vanilla JS, framework adapter responsibility)
- Manage component state (stateless utility)

---

### 2. Modal (ARIA Attributes)

#### What It Does

Applies ARIA attributes for modal dialog containers. Sets role, modal state, and associates labels/descriptions. Does NOT trap focus or handle Escape (use `focus` and `escape-handler` primitives).

#### TypeScript API

```typescript
interface ModalOptions {
  /**
   * Dialog role type.
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog' | 'status';

  /**
   * Whether dialog is modal (traps AT focus).
   * @default true
   */
  isModal?: boolean;

  /**
   * ID reference to dialog title element.
   */
  labelledBy?: string;

  /**
   * Fallback accessible name if no labelledBy.
   */
  label?: string;

  /**
   * ID reference to dialog description.
   */
  describedBy?: string;
}

/**
 * Apply ARIA attributes for modal dialogs.
 *
 * Sets role, aria-modal, aria-labelledby, aria-describedby.
 * Does NOT handle focus trap or Escape key (use focus and escape-handler primitives).
 *
 * @param element - Dialog container element
 * @param options - Modal configuration
 * @returns Cleanup function
 */
export function createModal(
  element: HTMLElement,
  options: ModalOptions
): CleanupFunction;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **1.3.1 Info and Relationships** | A | Sets `aria-labelledby` to associate title with dialog |
| **4.1.2 Name, Role, Value** | A | Sets `role="dialog"` or `role="alertdialog"`, `aria-modal="true"` |
| **4.1.3 Status Messages** | AA | Sets `role="status"` for non-modal status messages |

#### Integration Pattern (React)

```tsx
// Combine with focus and escape-handler primitives
function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;

    const cleanups: CleanupFunction[] = [];

    // 1. Set modal ARIA attributes
    cleanups.push(createModal(element, {
      role: 'dialog',
      isModal: true,
      labelledBy: 'dialog-title',
      describedBy: 'dialog-description'
    }));

    // 2. Handle Escape key and outside clicks
    cleanups.push(createEscapeHandler(element, {
      onEscapeKeyDown: () => onOpenChange(false),
      onPointerDownOutside: () => onOpenChange(false)
    }));

    // 3. Ensure focus indicators visible
    cleanups.push(createFocusTrap(element, {
      enabled: open,
      autoFocus: true,
      restoreFocus: true
    }));

    return () => cleanups.forEach(cleanup => cleanup());
  }, [open, onOpenChange]);

  return (
    <dialog ref={dialogRef} aria-modal="true">
      {children}
    </dialog>
  );
}
```

#### What It Does NOT Do

- Trap keyboard focus (use `createFocusTrap` from focus primitive)
- Handle Escape key (use `createEscapeHandler` primitive)
- Manage open/closed state (consumer's responsibility)
- Show/hide dialog visually (NO `display` or `visibility` changes)

---

### 3. Keyboard (Arrow Navigation)

#### What It Does

Implements arrow key navigation with roving tabindex for composite widgets (menus, radio groups, tabs, toolbars, listboxes). Manages `tabindex` attributes and calls navigation callbacks.

#### TypeScript API

```typescript
type KeyboardEventKey =
  | 'Enter' | 'Space' | 'Escape' | 'Tab'
  | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  | 'Home' | 'End' | 'PageUp' | 'PageDown';

interface KeyboardOptions {
  /**
   * Navigation orientation.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical' | 'both';

  /**
   * Wrap to first/last item at boundaries.
   * @default true
   */
  loop?: boolean;

  /**
   * Text direction for horizontal navigation.
   * @default 'ltr'
   */
  dir?: 'ltr' | 'rtl';

  /**
   * Index of currently focused item (0-based).
   */
  currentIndex: number;

  /**
   * Callback when focus moves to new item.
   */
  onNavigate: (newIndex: number) => void;
}

/**
 * Create arrow key navigation with roving tabindex.
 *
 * Manages tabindex attributes and keyboard event listeners.
 * Calls onNavigate when user presses arrow keys.
 *
 * @param container - Container element with role (menu, radiogroup, tablist)
 * @param items - Array of navigable items
 * @param options - Navigation configuration
 * @returns Cleanup function
 */
export function createKeyboardHandler(
  container: HTMLElement,
  items: HTMLElement[],
  options: KeyboardOptions
): CleanupFunction;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **2.1.1 Keyboard** | A | Arrow keys navigate between items, Tab moves out of group |
| **2.4.3 Focus Order** | A | Only one item in tab sequence (roving tabindex), logical arrow key order |
| **4.1.2 Name, Role, Value** | A | Updates `tabindex` to communicate current item to AT |

#### Integration Pattern (React)

```tsx
function Menu({ items }: MenuProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    return createKeyboardHandler(menu, itemRefs.current, {
      orientation: 'vertical',
      loop: true,
      currentIndex,
      onNavigate: (newIndex) => {
        setCurrentIndex(newIndex);
        itemRefs.current[newIndex].focus();
      }
    });
  }, [currentIndex]);

  return (
    <div ref={menuRef} role="menu">
      {items.map((item, index) => (
        <div
          key={index}
          ref={el => { if (el) itemRefs.current[index] = el; }}
          role="menuitem"
          tabIndex={index === currentIndex ? 0 : -1}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

#### What It Does NOT Do

- Set `role` attributes (consumer's responsibility)
- Set `aria-selected`, `aria-checked` (consumer manages state)
- Set `aria-posinset`, `aria-setsize` (consumer calculates position)
- Handle Enter/Space activation (use separate activation handler)
- Manage component state (which item is selected)

---

### 4. Escape Handler

#### What It Does

Detects Escape key presses and outside click/focus events for dismissable UI elements (dialogs, dropdowns, popovers, tooltips). Calls provided callbacks, does NOT close elements.

#### TypeScript API

```typescript
interface EscapeHandlerOptions {
  /**
   * Callback when Escape key pressed.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Callback when pointer down occurs outside element.
   */
  onPointerDownOutside?: (event: PointerEvent) => void;

  /**
   * Callback when focus moves outside element.
   */
  onFocusOutside?: (event: FocusEvent) => void;

  /**
   * Generic callback for any outside interaction.
   */
  onInteractOutside?: (event: Event) => void;

  /**
   * Elements to ignore for outside detection.
   */
  ignoreElements?: HTMLElement[];

  /**
   * Enable or disable the handler.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Detect Escape key and outside interactions.
 *
 * Listens for Escape key, pointer down outside, and focus outside.
 * Calls provided callbacks. Does NOT close/hide elements (consumer's responsibility).
 *
 * @param element - Element to monitor
 * @param options - Handler configuration
 * @returns Cleanup function
 */
export function createEscapeHandler(
  element: HTMLElement,
  options: EscapeHandlerOptions
): CleanupFunction;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **2.1.2 No Keyboard Trap** | A | Escape key always allows exiting focus traps |
| **3.2.1 On Focus** | A | Outside focus detection doesn't unexpectedly change context |
| **3.2.2 On Input** | A | Escape key handling is predictable |

#### Integration Pattern (React)

```tsx
function Popover({ open, onOpenChange, children }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = popoverRef.current;
    if (!element || !open) return;

    return createEscapeHandler(element, {
      onEscapeKeyDown: () => onOpenChange(false),
      onPointerDownOutside: () => onOpenChange(false),
      onFocusOutside: () => onOpenChange(false),
    });
  }, [open, onOpenChange]);

  return (
    <div ref={popoverRef} role="dialog">
      {children}
    </div>
  );
}
```

#### What It Does NOT Do

- Close/hide the element (consumer's responsibility)
- Announce dismissal to screen readers (use `sr-manager` primitive)
- Manage focus return (use focus-trap library or consumer logic)
- Block pointer events outside element (use CSS `pointer-events: none`)

---

### 5. ARIA (Dynamic Attributes)

#### What It Does

Safely sets, updates, and removes ARIA attributes with type safety and runtime validation. Ensures ARIA attribute values conform to the ARIA 1.2 specification.

#### TypeScript API

```typescript
/**
 * Strongly-typed ARIA attributes (subset shown, full list in implementation).
 */
interface AriaAttributes {
  // Widget Attributes
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-hidden'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-label'?: string;
  'aria-modal'?: boolean;
  'aria-pressed'?: boolean | 'mixed';
  'aria-required'?: boolean;
  'aria-selected'?: boolean;

  // Live Region Attributes
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;

  // Relationship Attributes
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-controls'?: string;
  'aria-owns'?: string;

  // Many more...
}

interface AriaOptions {
  /**
   * Validate attribute values against ARIA spec.
   * @default true in development, false in production
   */
  validate?: boolean;

  /**
   * Log warnings for invalid values.
   * @default true
   */
  warn?: boolean;
}

/**
 * Set ARIA attributes with type safety.
 *
 * Automatically converts:
 * - boolean → "true" | "false" string
 * - number → string
 * - undefined → removes attribute
 *
 * @param element - Element to set attributes on
 * @param attributes - ARIA attributes to set
 * @param options - Configuration options
 * @returns Cleanup function that restores original values
 */
export function setAriaAttributes(
  element: HTMLElement,
  attributes: Partial<AriaAttributes>,
  options?: AriaOptions
): CleanupFunction;

/**
 * Update single ARIA attribute.
 */
export function updateAriaAttribute<K extends keyof AriaAttributes>(
  element: HTMLElement,
  attribute: K,
  value: AriaAttributes[K]
): void;

/**
 * Get ARIA attribute value with type inference.
 */
export function getAriaAttribute<K extends keyof AriaAttributes>(
  element: HTMLElement,
  attribute: K
): AriaAttributes[K] | undefined;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **4.1.2 Name, Role, Value** | A | Ensures ARIA attributes use valid values per ARIA spec |
| **1.3.1 Info and Relationships** | A | Validates ID references for `aria-labelledby`, `aria-describedby` |

#### Integration Pattern (React)

```tsx
function Button({ pressed, expanded, children }: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;

    return setAriaAttributes(element, {
      'aria-pressed': pressed,
      'aria-expanded': expanded,
    });
  }, [pressed, expanded]);

  return (
    <button ref={buttonRef} type="button">
      {children}
    </button>
  );
}
```

#### What It Does NOT Do

- Set `role` attribute (separate concern, not ARIA state/property)
- Manage component state (stateless utility)
- Infer ARIA attributes (explicit only, no magic)
- Handle ARIA patterns (e.g., roving tabindex is `keyboard` primitive's job)

---

### 6. SR Manager (Screen Reader)

#### What It Does

Makes polite or assertive announcements to screen readers without visual changes. Uses ARIA live regions to communicate status messages, validation feedback, and dynamic updates.

#### TypeScript API

```typescript
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';
type LiveRegionRole = 'status' | 'alert' | 'log';

interface SRManagerOptions {
  /**
   * Politeness level for announcements.
   * @default 'polite'
   */
  politeness?: LiveRegionPoliteness;

  /**
   * ARIA role for live region container.
   * @default 'status' for polite, 'alert' for assertive
   */
  role?: LiveRegionRole;

  /**
   * Clear message after announcing.
   * @default true
   */
  clearAfterAnnounce?: boolean;

  /**
   * Delay before clearing message (milliseconds).
   * @default 1000
   */
  clearTimeout?: number;
}

interface Announcer {
  /**
   * Announce message to screen readers.
   */
  announce: (message: string) => void;

  /**
   * Clear current announcement.
   */
  clear: () => void;

  /**
   * Destroy announcer and remove live region.
   */
  destroy: CleanupFunction;
}

/**
 * Create screen reader announcer with ARIA live region.
 *
 * Creates a visually-hidden live region that announces messages
 * to screen readers without visual changes.
 *
 * @param options - Announcer configuration
 * @returns Announcer instance
 */
export function createAnnouncer(
  options?: SRManagerOptions
): Announcer;

/**
 * Convenience: One-time announcement.
 */
export function announceToScreenReader(
  message: string,
  politeness?: LiveRegionPoliteness
): void;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **4.1.3 Status Messages** | AA | Uses `role="status"` or `role="alert"` for live region announcements |
| **1.3.1 Info and Relationships** | A | Live region relationships conveyed programmatically |

#### Integration Pattern (React)

```tsx
function Form({ onSubmit }: FormProps) {
  const announcer = useRef<Announcer>();

  useEffect(() => {
    announcer.current = createAnnouncer({ politeness: 'polite' });
    return () => announcer.current?.destroy();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit();
      announcer.current?.announce('Form submitted successfully');
    } catch (error) {
      // Use assertive announcer for errors
      const errorAnnouncer = createAnnouncer({ politeness: 'assertive' });
      errorAnnouncer.announce('Error: Form submission failed');
      errorAnnouncer.destroy();
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### What It Does NOT Do

- Display visual alerts (use consumer's UI for visual feedback)
- Manage focus (use focus primitive)
- Handle keyboard events (use escape-handler or keyboard primitive)
- Store announcement history (stateless utility)

---

### 7. Resize (DOM Repositioning)

#### What It Does

Repositions overlay elements (tooltips, popovers, dropdowns) when window resizes or scrolls. Ensures overlays stay visually connected to their trigger elements and don't overflow viewport edges.

**EXCEPTION**: This is the ONLY primitive that manipulates visual styles (`style` attribute), because repositioning is inherently a visual concern that impacts accessibility (focus not obscured).

#### TypeScript API

```typescript
type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface ResizeOptions {
  /**
   * Preferred placement of overlay.
   * @default 'bottom'
   */
  placement?: Placement;

  /**
   * Pixels between trigger and overlay.
   * @default 8
   */
  offset?: number;

  /**
   * Flip placement on collision.
   * @default true
   */
  flip?: boolean;

  /**
   * Shift overlay to stay in viewport.
   * @default true
   */
  shift?: boolean;

  /**
   * Viewport edge padding.
   * @default 8
   */
  padding?: number;

  /**
   * Callback when position updates.
   */
  onPositionUpdate?: (position: { top: number; left: number; placement: Placement }) => void;
}

/**
 * Reposition overlay element relative to trigger.
 *
 * Updates style.top, style.left, style.transform for positioning.
 * Monitors window resize and scroll events.
 *
 * @param overlay - Overlay element to reposition
 * @param trigger - Trigger element (anchor)
 * @param options - Positioning configuration
 * @returns Cleanup function
 */
export function createResizeObserver(
  overlay: HTMLElement,
  trigger: HTMLElement,
  options?: ResizeOptions
): CleanupFunction;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **1.4.4 Resize Text** | AA | Overlays reposition when text size changes (triggers resize event) |
| **1.4.10 Reflow** | AA | Overlays reposition when viewport resizes to 320px width |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | Repositions overlays to prevent obscuring focused elements |

#### Integration Pattern (React)

```tsx
function Tooltip({ trigger, content, placement = 'top' }: TooltipProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const trigger = triggerRef.current;
    if (!overlay || !trigger) return;

    return createResizeObserver(overlay, trigger, {
      placement,
      offset: 8,
      flip: true,
      shift: true,
    });
  }, [placement]);

  return (
    <>
      <span ref={triggerRef}>{trigger}</span>
      <div ref={overlayRef} role="tooltip">
        {content}
      </div>
    </>
  );
}
```

#### What It Does NOT Do

- Set `role` or ARIA attributes (use `modal` or `aria` primitives)
- Show/hide overlays (consumer's responsibility)
- Manage focus (use focus primitive or focus-trap library)
- Handle keyboard events (use `escape-handler` primitive)
- Create portal elements (consumer uses `portal` utility or React Portal)

---

### 8. Focus (Indicator Management)

#### What It Does

Manages `:focus-visible` behavior to show keyboard focus indicators while hiding mouse focus indicators. Ensures WCAG 2.4.7 and 2.4.13 compliance by making focus visible for keyboard users.

Also provides utilities for focus trap (Tab wraps within container) and roving tabindex (arrow key navigation).

#### TypeScript API

```typescript
// Focus Visible Management
interface FocusOptions {
  /**
   * Enable or disable.
   * @default true
   */
  enabled?: boolean;

  /**
   * Add data-focus-visible polyfill.
   * @default true
   */
  polyfill?: boolean;
}

/**
 * Manage :focus-visible behavior for element.
 *
 * Sets data-focus-visible="true" for keyboard focus,
 * removes for mouse focus.
 *
 * @param element - Element to manage
 * @param options - Configuration
 * @returns Cleanup function
 */
export function createFocusManager(
  element: HTMLElement,
  options?: FocusOptions
): CleanupFunction;

/**
 * Global focus-visible tracker (attaches to document).
 */
export function createFocusVisibleManager(
  options?: FocusOptions
): CleanupFunction;

// Focus Trap
interface FocusTrapOptions {
  /**
   * Enable focus trap.
   * @default true
   */
  enabled?: boolean;

  /**
   * Auto-focus first focusable element.
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Specific element to focus initially.
   */
  initialFocusElement?: HTMLElement;

  /**
   * Return focus to trigger on deactivate.
   * @default true
   */
  restoreFocus?: boolean;

  /**
   * Allow clicks outside (focus still trapped).
   * @default false
   */
  allowOutsideClick?: boolean;
}

/**
 * Create focus trap (Tab wraps within container).
 *
 * @param container - Container element
 * @param options - Trap configuration
 * @returns Cleanup function
 */
export function createFocusTrap(
  container: HTMLElement,
  options?: FocusTrapOptions
): CleanupFunction;

// Utilities
/**
 * Get all focusable elements within container.
 */
export function getFocusableElements(
  container: HTMLElement
): HTMLElement[];

/**
 * Get currently focused element (SSR-safe).
 */
export function getActiveElement(): HTMLElement | undefined;

/**
 * Focus element with optional fallback.
 */
export function focusElement(
  element: HTMLElement | undefined,
  fallback?: HTMLElement
): void;
```

#### WCAG Criteria Addressed

| Criterion | Level | How |
|-----------|-------|-----|
| **2.4.7 Focus Visible** | AA | Keyboard focus indicator visible at all times during keyboard navigation |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | Works with `resize` primitive to ensure focus indicator not obscured |
| **2.4.12 Focus Not Obscured (Enhanced)** | AAA | No part of focus indicator hidden by overlays |
| **2.4.13 Focus Appearance** | AAA | Focus indicator meets minimum size (2px) and contrast (3:1) requirements |

#### Integration Pattern (React)

```tsx
// Global focus-visible management
function App() {
  useEffect(() => {
    return createFocusVisibleManager();
  }, []);

  return <Router>...</Router>;
}

// Focus trap for modal
function Modal({ open, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = modalRef.current;
    if (!element || !open) return;

    return createFocusTrap(element, {
      enabled: true,
      autoFocus: true,
      restoreFocus: true,
    });
  }, [open]);

  return (
    <div ref={modalRef} role="dialog">
      {children}
    </div>
  );
}
```

#### What It Does NOT Do

- Style focus indicators (use CSS, not inline styles)
- Manage roving tabindex (use `keyboard` primitive for arrow navigation)
- Handle keyboard navigation beyond Tab (use `keyboard` primitive)

---

## Cross-Primitive Integration

### Common Integration Patterns

#### Modal Dialog with Full Accessibility

Combines: `modal`, `escape-handler`, `focus`, `sr-manager`

```typescript
const cleanups: CleanupFunction[] = [];

// 1. Set modal ARIA attributes
cleanups.push(createModal(dialogElement, {
  role: 'dialog',
  isModal: true,
  labelledBy: 'dialog-title',
  describedBy: 'dialog-description'
}));

// 2. Handle Escape key and outside clicks
cleanups.push(createEscapeHandler(dialogElement, {
  onEscapeKeyDown: () => closeDialog(),
  onPointerDownOutside: () => closeDialog()
}));

// 3. Trap focus within dialog
cleanups.push(createFocusTrap(dialogElement, {
  enabled: true,
  autoFocus: true,
  restoreFocus: true
}));

// 4. Ensure focus indicators visible
cleanups.push(createFocusVisibleManager());

// 5. Announce dialog opening
const announcer = createAnnouncer({ politeness: 'polite' });
announcer.announce('Dialog opened');

// Cleanup
function cleanup() {
  cleanups.forEach(fn => fn());
  announcer.destroy();
}
```

#### Dropdown Menu with Arrow Navigation

Combines: `keyboard`, `escape-handler`, `resize`, `focus`

```typescript
const menuItems = Array.from(menuElement.querySelectorAll('[role="menuitem"]'));
const cleanups: CleanupFunction[] = [];

// 1. Arrow key navigation
cleanups.push(createKeyboardHandler(menuElement, menuItems, {
  orientation: 'vertical',
  loop: true,
  currentIndex: 0,
  onNavigate: (newIndex) => {
    menuItems[newIndex].focus();
  }
}));

// 2. Escape to close
cleanups.push(createEscapeHandler(menuElement, {
  onEscapeKeyDown: () => closeMenu(),
  onPointerDownOutside: () => closeMenu()
}));

// 3. Reposition on scroll/resize
cleanups.push(createResizeObserver(menuElement, triggerButton, {
  placement: 'bottom-start',
  offset: 4
}));

// 4. Focus indicators
cleanups.push(createFocusVisibleManager());

// Cleanup
function cleanup() {
  cleanups.forEach(fn => fn());
}
```

### Primitive Dependencies

```
Foundational (no dependencies):
├─ slot
├─ keyboard
├─ aria
└─ resize

Built on foundational:
├─ escape-handler (uses keyboard)
├─ sr-manager (uses aria)
└─ focus (uses keyboard, aria)

Composite:
└─ modal (uses aria, typically combined with focus + escape-handler)
```

---

## Testing Requirements

### Test File Organization

Each primitive requires **three test files**:

1. **Unit Tests**: `test/primitives/[name].test.ts`
   - DOM manipulation
   - Event handling
   - Cleanup behavior
   - SSR safety (no DOM available)

2. **Accessibility Tests**: `test/primitives/[name].a11y.tsx`
   - WCAG compliance verification
   - ARIA attribute correctness
   - Screen reader compatibility (manual with NVDA/JAWS/VoiceOver)
   - Keyboard navigation (automated with Playwright)

3. **Integration Tests**: `test/integration/[name].spec.ts`
   - Interaction with other primitives
   - Real-world usage scenarios
   - Framework wrapper compatibility (React, Vue)

### Coverage Requirements

- **Minimum Line Coverage**: 90%
- **Minimum Branch Coverage**: 85%
- **Critical Paths** (keyboard, ARIA): 100% coverage

### Manual Testing Checklist

**Screen Readers**:
- NVDA (Windows) - Latest version
- JAWS (Windows) - Latest version
- VoiceOver (macOS) - Latest macOS version
- VoiceOver (iOS) - Latest iOS version
- TalkBack (Android) - Latest Android version

**Browsers**:
- Chrome (Windows, macOS, Linux)
- Firefox (Windows, macOS, Linux)
- Safari (macOS, iOS)
- Edge (Windows)

**Keyboard Navigation**:
- Tab/Shift+Tab moves focus correctly
- Arrow keys navigate within components
- Enter/Space activate buttons
- Escape closes dialogs/menus
- Home/End move to first/last items

---

## Compliance Verification

### WCAG 2.2 Coverage

| Criterion | Level | Primitives |
|-----------|-------|------------|
| **1.3.1 Info and Relationships** | A | slot, modal, aria, sr-manager |
| **1.4.4 Resize Text** | AA | resize |
| **1.4.10 Reflow** | AA | resize |
| **2.1.1 Keyboard** | A | keyboard |
| **2.1.2 No Keyboard Trap** | A | escape-handler |
| **2.4.3 Focus Order** | A | keyboard |
| **2.4.7 Focus Visible** | AA | focus |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | resize, focus |
| **2.4.12 Focus Not Obscured (Enhanced)** | AAA | resize, focus |
| **2.4.13 Focus Appearance** | AAA | focus |
| **3.2.1 On Focus** | A | escape-handler |
| **3.2.2 On Input** | A | escape-handler |
| **4.1.2 Name, Role, Value** | A | slot, modal, keyboard, aria |
| **4.1.3 Status Messages** | AA | modal, sr-manager |

### Section 508 Coverage

| Requirement | Primitives |
|-------------|------------|
| **502.3.1 Object Information** | slot, modal, aria, sr-manager |
| **502.3.3 Modification of Focus Cursor** | keyboard, escape-handler, focus |
| **502.3.5 Modification of Values** | modal, aria |

### ARIA APG Pattern Compliance

| Pattern | Primitives Used | Required Attributes |
|---------|-----------------|---------------------|
| **Dialog (Modal)** | modal, escape-handler, focus | `role="dialog"`, `aria-modal`, `aria-labelledby` |
| **Alert Dialog** | modal, sr-manager | `role="alertdialog"`, `aria-labelledby`, `aria-describedby` |
| **Menu** | keyboard, escape-handler | `role="menu"`, `role="menuitem"`, `aria-orientation` |
| **Radio Group** | keyboard, aria | `role="radiogroup"`, `role="radio"`, `aria-checked` |
| **Tabs** | keyboard, aria | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` |
| **Tooltip** | resize, escape-handler | `role="tooltip"`, `aria-labelledby` or `aria-describedby` |

---

## Summary

### Primitive Responsibilities

1. **slot**: Merge ARIA/data attributes from child to parent (asChild pattern)
2. **modal**: Set dialog ARIA attributes (role, aria-modal, aria-labelledby)
3. **keyboard**: Arrow key navigation with roving tabindex
4. **escape-handler**: Detect Escape key and outside clicks
5. **aria**: Safely set/update/remove ARIA attributes with validation
6. **sr-manager**: Announce messages to screen readers via live regions
7. **resize**: Reposition overlays on window resize/scroll
8. **focus**: Manage :focus-visible behavior and focus trap

### Key Architectural Decisions

1. **Stateless Design**: All primitives accept current state, return cleanup functions
2. **Event Handler Merging IMPOSSIBLE**: Slot primitive cannot merge addEventListener handlers in vanilla JS
3. **Framework Adapters Handle Merging**: React/Vue/Svelte adapters merge event handlers via prop systems
4. **SSR Safety**: No DOM access at module load (runtime DOM required for ARIA/focus/keyboard)
5. **No Framework Code**: Pure TypeScript and DOM APIs only
6. **No Visual Props from Consumers**: className, style forbidden in primitive APIs (except resize for positioning)
7. **Type-Strict**: strict mode, no `any`, branded types for constraints

### Compliance By Design

By implementing these 8 primitives correctly, components automatically achieve:

- **WCAG 2.2 Level AA** compliance (all applicable criteria)
- **Section 508** compliance (revised 2017)
- **ARIA APG** pattern conformance
- **Cross-browser** accessibility (Chrome, Firefox, Safari, Edge)
- **Screen reader** compatibility (NVDA, JAWS, VoiceOver, TalkBack)

---

**Document Version**: 1.0.0
**Supersedes**: HEADLESS_PRIMITIVES_A11Y_REQUIREMENTS.md, HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md, HEADLESS_PRIMITIVES_INTEGRATION_PATTERNS.md
**Next Review**: After implementing first 3 primitives (slot, modal, keyboard)
