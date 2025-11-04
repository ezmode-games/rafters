# Headless Primitives TypeScript Architecture

**Status**: Architecture Specification
**Version**: 1.0.0
**Last Updated**: 2025-11-03
**Target**: 8 Core Vanilla TypeScript Primitives

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Constraints](#architectural-constraints)
3. [Shared Type Patterns](#shared-type-patterns)
4. [Primitive Specifications](#primitive-specifications)
5. [Critical Edge Cases](#critical-edge-cases)
6. [Type Safety Requirements](#type-safety-requirements)

---

## Overview

This document defines the TypeScript architecture for 8 core headless accessibility primitives that are:

- **Truly headless**: NO className, NO style props, NO visual concerns from consumers
- **DOM-manipulating**: YES ARIA attributes, focus(), keyboard events (accessibility requires DOM)
- **Vanilla TypeScript**: NO framework dependencies (React, Vue, Svelte)
- **Stateless**: NO internal state management
- **SSR-safe**: NO DOM access at module load time (runtime DOM access required for behavior)
- **Type-strict**: tsconfig strict mode, no `any` types

**Important**: "Headless" means no visual styling from consumers, NOT no DOM interaction. These primitives actively manipulate the DOM to provide accessible behavior through ARIA attributes, focus management, and keyboard handling.

### The 8 Core Primitives

1. **slot** - Prop merging for composition patterns
2. **modal** - Focus trap + dismissible layer for dialogs
3. **keyboard** - Type-safe keyboard event handling
4. **escape-handler** - Escape key dismissal coordination
5. **aria** - ARIA attribute management with type safety
6. **sr-manager** - Screen reader announcements via live regions
7. **resize** - Element resize observation
8. **focus** - Focus management utilities

---

## Architectural Constraints

### 1. Event Handler Merging is IMPOSSIBLE in Vanilla JS

**Critical Limitation**: You CANNOT enumerate existing DOM event listeners in vanilla JavaScript.

```typescript
// ❌ IMPOSSIBLE: Cannot detect what listeners already exist
const existingListeners = element.getEventListeners('click'); // Does not exist!

// ❌ IMPOSSIBLE: Cannot merge or chain unknown listeners
function mergeEventHandlers(element: HTMLElement, newHandler: EventListener) {
  const existing = element.onclick; // Only gets inline handler, not addEventListener
  // Missing all addEventListener handlers!
}
```

**Implication for Slot Primitive**:
- Can ONLY merge ARIA attributes, data attributes, and inline event handlers (`onclick`, `onkeydown`, etc.)
- CANNOT merge event listeners added via `addEventListener`
- Must clearly document this limitation
- Framework adapters (React, Vue) CAN merge because they track handlers

**TypeScript Enforcement**:

```typescript
interface SlotOptions {
  /**
   * Merge ARIA and data attributes.
   *
   * WARNING: Event listener merging is IMPOSSIBLE in vanilla JS.
   * Only inline handlers (onclick, onkeydown) are preserved.
   * Use framework adapters (React/Vue) for true event handler merging.
   */
  mergeProps?: boolean;

  /**
   * @deprecated Event handler merging not supported in vanilla JS
   * This option is ignored - use framework adapters instead
   */
  mergeEventHandlers?: never; // Type-level prevention
}
```

### 2. SSR Safety: No DOM at Module Load (But REQUIRED at Runtime)

**Critical Distinction**:
- ❌ **NO DOM access at module load time** (crashes during SSR/Workers)
- ✅ **DOM manipulation REQUIRED at runtime** (ARIA, focus, keyboard, events)

**What "Headless" Actually Means**:
- NO visual properties (`className`, `style`, CSS-in-JS) from consumers
- YES DOM manipulation for accessibility (ARIA attributes, focus, events, tabindex)

**The Real Constraint**: SSR Safety

```typescript
// ❌ BAD: Module-level DOM access
const body = document.body; // Crashes in Cloudflare Workers/SSR
const isTouch = 'ontouchstart' in window; // Crashes - no window during SSR

export function primitive() {
  body.appendChild(element); // Uses module-level variable
}

// ✅ GOOD: Lazy DOM access, active runtime manipulation
export function primitive(element: HTMLElement) {
  // SSR safety check
  if (!isDOMAvailable()) {
    return () => {}; // No-op cleanup for SSR
  }

  // ✅ REQUIRED: DOM manipulation at runtime for accessibility
  element.setAttribute('aria-expanded', 'false'); // ARIA attribute
  element.setAttribute('tabindex', '0'); // Keyboard accessibility
  element.focus(); // Focus management

  const handleClick = () => {
    element.setAttribute('aria-expanded', 'true'); // Update ARIA state
  };
  element.addEventListener('click', handleClick); // Event listener

  // Cleanup function
  return () => {
    element.removeEventListener('click', handleClick);
    element.removeAttribute('aria-expanded');
    element.removeAttribute('tabindex');
  };
}
```

**Why Primitives MUST Touch DOM**:

Headless primitives provide **behavior**, not **appearance**. Behavior requires DOM:

1. **ARIA Attributes**: `aria-label`, `aria-expanded`, `aria-controls`, `role`
2. **Keyboard Navigation**: `tabindex`, `focus()`, `blur()`, keyboard event listeners
3. **Event Handling**: `addEventListener` for click, keydown, mousedown, touchstart
4. **Focus Management**: `document.activeElement`, `element.contains()`, focus trapping
5. **Screen Reader Announcements**: Creating/updating live regions in DOM

**What Primitives DON'T Do**:

1. ❌ Accept `className` or `style` props from consumers
2. ❌ Apply visual styles (colors, spacing, layout)
3. ❌ Make assumptions about appearance
4. ❌ Access DOM at module load time (SSR crash)

**SSR Pattern for All Primitives**:

```typescript
export function primitive(element: HTMLElement): CleanupFunction {
  // FIRST: Check if DOM is available (SSR safety)
  if (!isDOMAvailable()) {
    return () => {}; // No-op for server-side rendering
  }

  // SECOND: DOM manipulation is now safe and REQUIRED
  // Set ARIA attributes
  element.setAttribute('role', 'button');
  element.setAttribute('aria-pressed', 'false');

  // Add keyboard handling
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      element.setAttribute('aria-pressed', 'true');
    }
  };
  element.addEventListener('keydown', handleKeydown);

  // Return cleanup
  return () => {
    element.removeEventListener('keydown', handleKeydown);
    element.removeAttribute('role');
    element.removeAttribute('aria-pressed');
  };
}
```

### 3. No Framework Code

**Strict Prohibition**: NO React hooks, Vue directives, Svelte stores, or ANY framework-specific APIs.

```typescript
// ❌ FORBIDDEN: Framework APIs
import { useEffect, useState } from 'react'; // NO
import { ref, computed } from 'vue'; // NO
import { writable } from 'svelte/store'; // NO

// ✅ ALLOWED: Pure TypeScript and DOM APIs
type CleanupFunction = () => void;

function primitive(element: HTMLElement): CleanupFunction {
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
}
```

### 4. No Visual Properties (But YES Behavioral DOM)

**Headless Constraint**: NO className, style, CSS-in-JS from consumer API.

**What This Means**:
- ❌ Primitives don't accept visual props from consumers
- ✅ Primitives DO manipulate DOM for behavior/accessibility
- ❌ No assumptions about appearance
- ✅ Full control over ARIA, focus, keyboard, events

```typescript
// ❌ FORBIDDEN: Visual properties in consumer API
interface Options {
  className?: string; // NO - consumers can't style via primitive
  style?: CSSProperties; // NO - consumers can't style via primitive
  color?: string; // NO - visual concern
  backgroundColor?: string; // NO - visual concern
}

// ✅ ALLOWED: Behavioral and accessibility properties
interface Options {
  enabled?: boolean; // YES - behavior toggle
  autoFocus?: boolean; // YES - focus behavior
  'aria-label'?: string; // YES - accessibility label
  'aria-expanded'?: boolean; // YES - ARIA state
  role?: string; // YES - ARIA role
  tabindex?: number; // YES - keyboard navigation
  onEscape?: () => void; // YES - event handler
}

// ✅ ALLOWED: Internal DOM manipulation for behavior
export function createPrimitive(element: HTMLElement): CleanupFunction {
  // Set ARIA attributes (behavioral, not visual)
  element.setAttribute('role', 'button');
  element.setAttribute('aria-pressed', 'false');
  element.setAttribute('tabindex', '0');

  // Add event listeners (behavioral)
  const handleClick = () => {
    element.setAttribute('aria-pressed', 'true');
  };
  element.addEventListener('click', handleClick);

  // Focus management (behavioral)
  if (options.autoFocus) {
    element.focus();
  }

  return () => {
    element.removeEventListener('click', handleClick);
    element.removeAttribute('role');
    element.removeAttribute('aria-pressed');
    element.removeAttribute('tabindex');
  };
}
```

**Exception: Internal Styles for Accessibility Only**

Primitives MAY use style internally ONLY for accessibility patterns (visually-hidden, screen reader only):

```typescript
// ✅ ALLOWED: Internal style for a11y (visually-hidden pattern)
function createVisuallyHidden(element: HTMLElement): CleanupFunction {
  const originalStyle = element.getAttribute('style');

  // Visually hidden pattern for screen readers
  // This is NOT visual styling - it's an accessibility technique
  element.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `;

  return () => {
    if (originalStyle) {
      element.setAttribute('style', originalStyle);
    } else {
      element.removeAttribute('style');
    }
  };
}

// ✅ ALLOWED: Internal positioning for modal backdrop
function createModalBackdrop(): CleanupFunction {
  const backdrop = document.createElement('div');
  backdrop.setAttribute('role', 'presentation');
  backdrop.setAttribute('aria-hidden', 'true');

  // Internal positioning for focus trap behavior
  backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: auto;
  `;

  document.body.appendChild(backdrop);

  return () => {
    backdrop.remove();
  };
}
```

**Key Principle**: Primitives control behavior (ARIA, focus, events), consumers control appearance (className, styles, colors).

---

## Shared Type Patterns

### Common Types Across ALL Primitives

```typescript
/**
 * Cleanup function returned by all primitives.
 * Calling this removes event listeners and restores original DOM state.
 */
export type CleanupFunction = () => void;

/**
 * Base options interface - all primitives extend this.
 */
interface BasePrimitiveOptions {
  /**
   * Enable or disable the primitive.
   * When false, primitive returns no-op cleanup immediately.
   *
   * @default true
   */
  enabled?: boolean;
}

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

/**
 * Type guard for HTMLElement.
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
  if (!isDOMAvailable()) {
    return false;
  }
  return element instanceof HTMLElement;
}
```

### Shared Generic Patterns

```typescript
/**
 * Generic event handler type.
 */
type EventHandler<T extends Event = Event> = (event: T) => void;

/**
 * Generic keyboard event keys (subset for accessibility).
 */
type KeyboardEventKey =
  | 'Enter'
  | 'Space'
  | 'Escape'
  | 'Tab'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown';

/**
 * Branded type for unique IDs (prevents passing arbitrary strings).
 */
type UniqueId = string & { readonly __brand: 'UniqueId' };

/**
 * Generate unique ID with optional prefix.
 */
export function generateId(prefix = 'primitive'): UniqueId {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}` as UniqueId;
}
```

---

## Primitive Specifications

### 1. Slot Primitive

**Purpose**: Merge props from child element to parent (composition pattern).

**Type Signature**:

```typescript
interface SlotOptions extends BasePrimitiveOptions {
  /**
   * Merge ARIA and data attributes from child to parent.
   *
   * ⚠️ LIMITATION: Cannot merge addEventListener handlers in vanilla JS.
   * Only inline handlers (onclick, onkeydown) are preserved.
   *
   * @default true
   */
  mergeProps?: boolean;
}

/**
 * Merge props from slotted child to container.
 *
 * ⚠️ EVENT HANDLER MERGING LIMITATION:
 * Vanilla JS cannot enumerate addEventListener listeners.
 * Only inline event handlers (onclick, onkeydown) can be detected.
 * For true event handler merging, use framework adapters.
 *
 * @param container - Parent element receiving merged props
 * @param slottedChild - Child element providing props to merge
 * @param options - Configuration options
 * @returns Cleanup function that restores original state
 *
 * @example
 * ```ts
 * const button = document.querySelector('button');
 * const child = button.querySelector('span');
 *
 * const cleanup = createSlot(button, child, { mergeProps: true });
 * // button now has child's ARIA attributes
 *
 * cleanup(); // Restores original attributes
 * ```
 */
export function createSlot(
  container: HTMLElement,
  slottedChild: Element | null | undefined,
  options?: SlotOptions
): CleanupFunction;
```

**Type Safety Constraints**:

```typescript
// ✅ Type-safe: Only accepts HTMLElement
createSlot(document.querySelector('button')!, child);

// ❌ Type error: Element must be HTMLElement
createSlot(document.querySelector('svg')!, child);
// Error: Argument of type 'SVGElement' not assignable to 'HTMLElement'

// ✅ Handles null/undefined safely
createSlot(container, null); // Returns no-op cleanup
createSlot(container, undefined); // Returns no-op cleanup
```

**Return Type**: `CleanupFunction` - Restores original attributes on call.

**Edge Cases**:

1. **Conflicting IDs**: Both container and child have `id` attribute
   - **Strategy**: Keep container's ID, don't merge child's ID
   - **Rationale**: Prevents ID collision in DOM

2. **Nested Slots**: Slot within a slot
   - **Strategy**: Not supported - document limitation
   - **Rationale**: Complexity and unclear semantics

3. **Dynamic Child**: Child element changes after createSlot called
   - **Strategy**: No automatic re-merge - consumer must re-call
   - **Rationale**: Stateless design - primitives don't observe changes

---

### 2. Modal Primitive

**Purpose**: Combine focus trap + dismissible layer for accessible modals.

**Type Signature**:

```typescript
interface ModalOptions extends BasePrimitiveOptions {
  /**
   * Auto-focus first focusable element when modal opens.
   *
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Specific element to focus initially.
   * If not provided, focuses first focusable element.
   */
  initialFocusElement?: HTMLElement;

  /**
   * Return focus to triggering element when modal closes.
   *
   * @default true
   */
  returnFocusOnClose?: boolean;

  /**
   * Allow Escape key to close modal.
   *
   * @default true
   */
  escapeCloses?: boolean;

  /**
   * Called when modal should close (Escape key or outside click).
   * Consumer is responsible for actually hiding/removing modal.
   */
  onClose?: () => void;

  /**
   * Allow clicks outside modal (focus still trapped).
   *
   * @default false
   */
  allowOutsideClick?: boolean;
}

/**
 * Create accessible modal with focus trap and dismissal handling.
 *
 * Combines:
 * - Focus trap (Tab/Shift+Tab wrap within modal)
 * - Escape key handling
 * - Outside click detection
 * - Focus restoration
 *
 * Consumer must:
 * - Set aria-modal="true" on container
 * - Set role="dialog" or role="alertdialog"
 * - Provide accessible name (aria-labelledby or aria-label)
 *
 * @param container - Modal container element
 * @param options - Configuration options
 * @returns Cleanup function
 *
 * @example
 * ```ts
 * const dialog = document.querySelector('[role="dialog"]');
 * dialog.setAttribute('aria-modal', 'true');
 * dialog.setAttribute('aria-labelledby', 'dialog-title');
 *
 * const cleanup = createModal(dialog, {
 *   onClose: () => dialog.hidden = true
 * });
 * ```
 */
export function createModal(
  container: HTMLElement,
  options?: ModalOptions
): CleanupFunction;
```

**Generic Parameters**: None (simple options interface).

**Return Type**: `CleanupFunction` - Removes focus trap and event listeners.

**Edge Cases**:

1. **No Focusable Elements**: Modal has no focusable children
   - **Strategy**: Focus the container itself (must have tabindex="-1")
   - **TypeScript**: Document in JSDoc that container needs tabindex

2. **Nested Modals**: Modal opened within another modal
   - **Strategy**: Stack management - inner modal takes precedence
   - **TypeScript**: No special types needed, works naturally

3. **Focus Restoration Target Removed**: Element that opened modal no longer exists
   - **Strategy**: Focus document.body as fallback
   - **TypeScript**: returnFocusOnClose is best-effort

---

### 3. Keyboard Primitive

**Purpose**: Type-safe keyboard event handling with common patterns.

**Type Signature**:

```typescript
interface KeyModifiers {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
}

interface KeyboardHandlerOptions extends BasePrimitiveOptions {
  /**
   * Key or keys to handle.
   */
  key: KeyboardEventKey | KeyboardEventKey[];

  /**
   * Handler function called when key matches.
   */
  handler: EventHandler<KeyboardEvent>;

  /**
   * Required modifier keys.
   * If specified, ALL modifiers must match.
   */
  modifiers?: KeyModifiers;

  /**
   * Prevent default browser behavior for matched keys.
   *
   * @default true
   */
  preventDefault?: boolean;

  /**
   * Stop event propagation for matched keys.
   *
   * @default false
   */
  stopPropagation?: boolean;
}

/**
 * Create type-safe keyboard event handler.
 *
 * @param element - Element to attach listener to
 * @param options - Handler configuration
 * @returns Cleanup function
 *
 * @example
 * ```ts
 * // Handle Enter and Space for button activation
 * const cleanup = createKeyboardHandler(button, {
 *   key: ['Enter', 'Space'],
 *   handler: (event) => {
 *     console.log('Activated!');
 *   }
 * });
 *
 * // Handle Ctrl+S for save
 * const cleanup2 = createKeyboardHandler(document.body, {
 *   key: 's',
 *   modifiers: { ctrl: true },
 *   handler: (event) => {
 *     saveDocument();
 *   }
 * });
 * ```
 */
export function createKeyboardHandler(
  element: HTMLElement,
  options: KeyboardHandlerOptions
): CleanupFunction;

/**
 * Convenience: Handle Enter and Space for activation.
 */
export function createActivationHandler(
  element: HTMLElement,
  handler: EventHandler<KeyboardEvent>
): CleanupFunction;

/**
 * Convenience: Handle Escape for dismissal.
 */
export function createDismissalHandler(
  element: HTMLElement,
  handler: EventHandler<KeyboardEvent>
): CleanupFunction;
```

**Generic Parameters**: None (uses EventHandler<KeyboardEvent>).

**Type Safety Constraints**:

```typescript
// ✅ Type-safe: Only accepts valid keys
createKeyboardHandler(element, {
  key: 'Enter', // Valid
  handler: (e) => {} // e is KeyboardEvent
});

// ❌ Type error: Invalid key
createKeyboardHandler(element, {
  key: 'InvalidKey', // Error: not assignable to KeyboardEventKey
  handler: (e) => {}
});

// ✅ Array of keys
createKeyboardHandler(element, {
  key: ['Enter', 'Space'], // Valid
  handler: (e) => {}
});
```

**Edge Cases**:

1. **Multiple Handlers Same Key**: Two handlers for same key on same element
   - **Strategy**: Allow it - both handlers will fire (normal DOM behavior)
   - **TypeScript**: No prevention needed

2. **Modifier Mismatch**: User presses Ctrl+Shift+S but handler only requires Ctrl+S
   - **Strategy**: STRICT matching - extra modifiers cause mismatch
   - **TypeScript**: Document that modifiers must match exactly

---

### 4. Escape Handler Primitive

**Purpose**: Coordinate Escape key handling across layers (nested modals, tooltips, etc.).

**Type Signature**:

```typescript
interface EscapeHandlerOptions extends BasePrimitiveOptions {
  /**
   * Handler called when Escape pressed.
   */
  onEscape: EventHandler<KeyboardEvent>;

  /**
   * Prevent event from bubbling to parent escape handlers.
   * Set true for modal dialogs to prevent closing parent modals.
   *
   * @default true
   */
  stopPropagation?: boolean;
}

/**
 * Create Escape key handler with layer coordination.
 *
 * Automatically handles:
 * - Escape key detection
 * - Event propagation (stopPropagation for nested layers)
 * - Priority (inner handlers fire before outer)
 *
 * @param element - Element to attach listener to
 * @param options - Handler configuration
 * @returns Cleanup function
 *
 * @example
 * ```ts
 * // Modal Escape handler
 * const cleanup = createEscapeHandler(dialog, {
 *   onEscape: () => {
 *     dialog.hidden = true;
 *   },
 *   stopPropagation: true // Don't close parent modal
 * });
 *
 * // Tooltip Escape handler (allows propagation)
 * const cleanup2 = createEscapeHandler(tooltip, {
 *   onEscape: () => {
 *     tooltip.remove();
 *   },
 *   stopPropagation: false // Allow other Escape handlers
 * });
 * ```
 */
export function createEscapeHandler(
  element: HTMLElement,
  options: EscapeHandlerOptions
): CleanupFunction;
```

**Return Type**: `CleanupFunction` - Removes event listener.

**Edge Cases**:

1. **Nested Escape Handlers**: Modal within modal, both have Escape handlers
   - **Strategy**: Inner handler fires first (bubbling), stopPropagation prevents outer
   - **TypeScript**: Document bubbling behavior

2. **Form Fields**: Escape pressed in input field
   - **Strategy**: Still fires (don't prevent) - consumer decides
   - **TypeScript**: onEscape receives full KeyboardEvent for context checking

---

### 5. ARIA Primitive

**Purpose**: Type-safe ARIA attribute management.

**Type Signature**:

```typescript
/**
 * Strongly-typed ARIA attributes (subset - full spec in implementation).
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

  // Add more as needed (see ARIA 1.2 spec)
}

interface AriaOptions {
  /**
   * Validate attribute values against ARIA spec.
   * Throws errors for invalid values in development.
   *
   * @default true in development, false in production
   */
  validate?: boolean;
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
 *
 * @example
 * ```ts
 * const cleanup = setAriaAttributes(button, {
 *   'aria-expanded': true,
 *   'aria-controls': 'menu-1',
 *   'aria-haspopup': 'menu'
 * });
 *
 * // button has aria-expanded="true", etc.
 *
 * cleanup(); // Restores original attributes
 * ```
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

**Generic Parameters**: `K extends keyof AriaAttributes` for type-safe attribute access.

**Type Safety Constraints**:

```typescript
// ✅ Type-safe: Valid attribute and value
setAriaAttributes(element, {
  'aria-expanded': true, // Valid: boolean
  'aria-haspopup': 'menu' // Valid: specific string literal
});

// ❌ Type error: Invalid value
setAriaAttributes(element, {
  'aria-expanded': 'yes' // Error: not assignable to boolean
});

// ❌ Type error: Invalid attribute
setAriaAttributes(element, {
  'aria-foo': true // Error: 'aria-foo' does not exist
});

// ✅ Type inference on get
const expanded = getAriaAttribute(element, 'aria-expanded');
// expanded is boolean | undefined
```

**Edge Cases**:

1. **Invalid Attribute Values**: Non-spec-compliant value (e.g., aria-live="loud")
   - **Strategy**: Validate in development, warn in production
   - **TypeScript**: Type system prevents most issues

2. **Conflicting Attributes**: Setting aria-labelledby when aria-label already exists
   - **Strategy**: Allow it (both can coexist, labelledby takes precedence)
   - **TypeScript**: No prevention needed

---

### 6. Screen Reader Manager Primitive

**Purpose**: Announce messages to screen readers via ARIA live regions.

**Type Signature**:

```typescript
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';
type LiveRegionRole = 'status' | 'alert' | 'log';

interface AnnouncerOptions {
  /**
   * Politeness level for announcements.
   *
   * - 'polite': Announce when screen reader is idle (success messages, search results)
   * - 'assertive': Announce immediately (errors, urgent alerts)
   * - 'off': No announcements
   *
   * @default 'polite'
   */
  politeness?: LiveRegionPoliteness;

  /**
   * ARIA role for live region container.
   *
   * - 'status': Non-urgent status updates
   * - 'alert': Important messages requiring immediate attention
   * - 'log': Sequential updates (chat messages, logs)
   *
   * @default 'status' for polite, 'alert' for assertive
   */
  role?: LiveRegionRole;

  /**
   * Clear message after announcing.
   * Prevents re-announcement on page refresh.
   *
   * @default true
   */
  clearAfterAnnounce?: boolean;

  /**
   * Delay before clearing message (milliseconds).
   *
   * @default 1000
   */
  clearTimeout?: number;
}

interface Announcer {
  /**
   * Announce message to screen readers.
   *
   * @param message - Text to announce
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
 *
 * @example
 * ```ts
 * const announcer = createAnnouncer({ politeness: 'polite' });
 *
 * // Success message
 * announcer.announce('Settings saved successfully');
 *
 * // Error message (use assertive announcer)
 * const errorAnnouncer = createAnnouncer({ politeness: 'assertive' });
 * errorAnnouncer.announce('Error: Connection lost');
 *
 * // Cleanup
 * announcer.destroy();
 * errorAnnouncer.destroy();
 * ```
 */
export function createAnnouncer(
  options?: AnnouncerOptions
): Announcer;

/**
 * Convenience: One-time announcement.
 * Creates announcer, announces, then destroys after clearTimeout.
 *
 * @param message - Message to announce
 * @param politeness - Politeness level
 */
export function announceToScreenReader(
  message: string,
  politeness?: LiveRegionPoliteness
): void;
```

**Return Type**: `Announcer` object with methods (not just CleanupFunction).

**Edge Cases**:

1. **Rapid Announcements**: Multiple announce() calls in quick succession
   - **Strategy**: Queue announcements with small delay between
   - **TypeScript**: announce() returns void (fire-and-forget)

2. **Empty Messages**: announce("") called
   - **Strategy**: Ignore empty strings (no announcement)
   - **TypeScript**: Could add `message: NonEmptyString` branded type

3. **Multiple Announcers**: Two announcers with same politeness
   - **Strategy**: Allow it (separate live regions)
   - **TypeScript**: No prevention needed

---

### 7. Resize Primitive

**Purpose**: Observe element size changes with ResizeObserver.

**Type Signature**:

```typescript
interface ResizeEntry {
  /**
   * Element being observed.
   */
  element: HTMLElement;

  /**
   * New content box size.
   */
  contentRect: DOMRectReadOnly;

  /**
   * New border box size.
   */
  borderBoxSize: ResizeObserverSize;

  /**
   * New content box size.
   */
  contentBoxSize: ResizeObserverSize;
}

interface ResizeObserverOptions extends BasePrimitiveOptions {
  /**
   * Callback when element resizes.
   */
  onResize: (entry: ResizeEntry) => void;

  /**
   * Box model to observe.
   *
   * - 'border-box': Include padding and border
   * - 'content-box': Content area only
   * - 'device-pixel-content-box': Device pixels (for high-DPI)
   *
   * @default 'border-box'
   */
  box?: ResizeObserverBoxOptions;
}

/**
 * Observe element size changes with ResizeObserver.
 *
 * Automatically:
 * - Creates ResizeObserver instance
 * - Handles browser compatibility
 * - Provides type-safe resize data
 * - Cleans up observer on destroy
 *
 * @param element - Element to observe
 * @param options - Observer configuration
 * @returns Cleanup function
 *
 * @example
 * ```ts
 * const cleanup = createResizeObserver(container, {
 *   onResize: (entry) => {
 *     console.log('New size:', entry.contentRect.width, entry.contentRect.height);
 *   }
 * });
 * ```
 */
export function createResizeObserver(
  element: HTMLElement,
  options: ResizeObserverOptions
): CleanupFunction;
```

**Return Type**: `CleanupFunction` - Disconnects observer.

**Type Safety Constraints**:

```typescript
// ✅ Type-safe callback
createResizeObserver(element, {
  onResize: (entry) => {
    // entry is ResizeEntry (typed)
    const width = entry.contentRect.width; // number
  }
});

// ❌ Type error: Missing required onResize
createResizeObserver(element, {
  // Error: Property 'onResize' is missing
});
```

**Edge Cases**:

1. **ResizeObserver Not Supported**: Older browsers without ResizeObserver
   - **Strategy**: Provide polyfill or no-op fallback
   - **TypeScript**: Document browser support requirements

2. **Resize Loop**: onResize callback triggers further resize
   - **Strategy**: ResizeObserver handles this automatically (limited iterations)
   - **TypeScript**: Document loop prevention

---

### 8. Focus Primitive

**Purpose**: Focus management utilities (focus trap, roving focus, etc.).

**Type Signature**:

```typescript
/**
 * Focusable element selector.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]'
].join(',');

/**
 * Get all focusable elements within container.
 *
 * Filters out:
 * - Elements with display: none
 * - Elements with visibility: hidden
 * - Elements with aria-hidden="true"
 * - Disabled elements
 *
 * @param container - Container to search within
 * @returns Array of focusable HTMLElements
 */
export function getFocusableElements(
  container: HTMLElement
): HTMLElement[];

/**
 * Get currently focused element (SSR-safe).
 *
 * @returns Active element or undefined if no focus
 */
export function getActiveElement(): HTMLElement | undefined;

/**
 * Check if element is focusable.
 *
 * @param element - Element to check
 * @returns True if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean;

/**
 * Focus element with optional fallback.
 *
 * @param element - Element to focus
 * @param fallback - Fallback element if primary can't receive focus
 */
export function focusElement(
  element: HTMLElement | undefined,
  fallback?: HTMLElement
): void;

interface FocusTrapOptions extends BasePrimitiveOptions {
  autoFocus?: boolean;
  initialFocusElement?: HTMLElement;
  returnFocusOnDeactivate?: boolean;
  escapeDeactivates?: boolean;
}

/**
 * Create focus trap (Tab wraps within container).
 *
 * See Modal primitive for full implementation.
 */
export function createFocusTrap(
  container: HTMLElement,
  options?: FocusTrapOptions
): CleanupFunction;

interface RovingFocusOptions extends BasePrimitiveOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  dir?: 'ltr' | 'rtl';
  onNavigate?: (element: HTMLElement, index: number) => void;
}

/**
 * Create roving focus (arrow key navigation, roving tabindex).
 *
 * @param container - Container element
 * @param items - Array of items or getter function
 * @param options - Configuration
 * @returns Cleanup function
 */
export function createRovingFocus(
  container: HTMLElement,
  items: HTMLElement[] | (() => HTMLElement[]),
  options?: RovingFocusOptions
): CleanupFunction;
```

**Generic Parameters**: None (utility functions).

**Type Safety Constraints**:

```typescript
// ✅ Type-safe: Returns HTMLElement[]
const focusable = getFocusableElements(container);
focusable.forEach(el => el.focus()); // el is HTMLElement

// ✅ Type-safe: Returns HTMLElement | undefined
const active = getActiveElement();
if (active) {
  active.focus(); // active is HTMLElement
}
```

---

## Critical Edge Cases

### 1. SSR Environment

**Scenario**: Primitive called during server-side rendering.

**Solution**:
```typescript
export function primitive(element: HTMLElement): CleanupFunction {
  if (!isDOMAvailable()) {
    return () => {}; // No-op cleanup
  }

  // Safe to use DOM here
}
```

**TypeScript Enforcement**: None needed - runtime check.

### 2. Element Removed from DOM

**Scenario**: Element passed to primitive is later removed from DOM.

**Solution**: Event listeners automatically cleaned up by browser. Cleanup function should be defensive:

```typescript
return () => {
  if (element.isConnected) {
    // Element still in DOM
    element.removeEventListener('click', handler);
  }
  // Safe either way - removeEventListener on disconnected element is no-op
};
```

### 3. Rapid Enable/Disable Toggling

**Scenario**: `enabled: false` then `enabled: true` rapidly.

**Solution**: Each call creates new primitive instance with cleanup. Consumers should cache cleanup functions:

```typescript
let cleanup: CleanupFunction | undefined;

function updatePrimitive(enabled: boolean) {
  cleanup?.(); // Clean up previous

  if (enabled) {
    cleanup = createPrimitive(element);
  }
}
```

### 4. Multiple Primitives on Same Element

**Scenario**: Two primitives attached to same element (e.g., keyboard + aria).

**Solution**: Allowed - each primitive manages independent concerns. No conflicts expected.

```typescript
const keyboardCleanup = createKeyboardHandler(button, { /* ... */ });
const ariaCleanup = setAriaAttributes(button, { /* ... */ });

// Both work independently
keyboardCleanup();
ariaCleanup();
```

### 5. Conflicting Event Handlers

**Scenario**: Two keyboard handlers for same key on same element.

**Solution**: Both fire (normal DOM event behavior). Use stopPropagation if needed.

```typescript
createKeyboardHandler(element, {
  key: 'Enter',
  handler: (e) => {
    console.log('First handler');
    e.stopPropagation(); // Prevents second handler if needed
  }
});

createKeyboardHandler(element, {
  key: 'Enter',
  handler: (e) => {
    console.log('Second handler'); // May not fire if stopPropagation used
  }
});
```

---

## Type Safety Requirements

### 1. Strict Mode Enabled

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. No `any` Types

**Enforcement**: ESLint rule `@typescript-eslint/no-explicit-any: error`

```typescript
// ❌ FORBIDDEN
function primitive(element: any) { } // NO

// ✅ REQUIRED
function primitive(element: HTMLElement) { } // YES
function primitive(element: unknown) { } // YES with type guard
```

### 3. Type Guards for Unknown Values

**Pattern**:
```typescript
function primitive(element: unknown): CleanupFunction {
  if (!isHTMLElement(element)) {
    throw new TypeError('Element must be HTMLElement');
  }

  // element is HTMLElement here
  return () => {};
}
```

### 4. Branded Types for Domain Constraints

**Pattern**:
```typescript
type UniqueId = string & { readonly __brand: 'UniqueId' };
type NonEmptyString = string & { readonly __brand: 'NonEmptyString' };

// Prevents accidental misuse
function setId(id: UniqueId) { } // Only accepts branded IDs

setId('random-string'); // Error: not assignable to UniqueId
setId(generateId()); // OK: returns UniqueId
```

### 5. Exhaustive Type Checking

**Pattern**:
```typescript
type Politeness = 'polite' | 'assertive' | 'off';

function handlePoliteness(level: Politeness) {
  switch (level) {
    case 'polite':
      return 'polite';
    case 'assertive':
      return 'assertive';
    case 'off':
      return 'off';
    default:
      // Exhaustive check - ensures all cases covered
      const _exhaustive: never = level;
      throw new Error(`Unhandled politeness: ${_exhaustive}`);
  }
}
```

---

## Summary

### Key Architectural Decisions

1. **Event Handler Merging IMPOSSIBLE**: Slot primitive cannot merge addEventListener handlers in vanilla JS
2. **Stateless Design**: All primitives accept current state, return cleanup functions
3. **SSR Safety**: No DOM access at module load (runtime DOM required for ARIA/focus/keyboard)
4. **No Framework Code**: Pure TypeScript and DOM APIs only
5. **No Visual Props from Consumers**: className, style forbidden in primitive APIs
6. **YES DOM Manipulation for Behavior**: ARIA attributes, focus(), keyboard events are REQUIRED
7. **Type-Strict**: strict mode, no `any`, branded types for constraints

**Critical Clarification**: "Headless" means primitives don't accept styling props and don't make visual assumptions. It does NOT mean primitives avoid the DOM. On the contrary, primitives actively manipulate the DOM to provide accessible behavior through ARIA attributes, focus management, keyboard handling, and event listeners. The only DOM restriction is: no module-level DOM access (SSR safety).

### Primitive Summary

| Primitive | Returns | Key Constraint |
|-----------|---------|----------------|
| **slot** | CleanupFunction | Cannot merge addEventListener handlers |
| **modal** | CleanupFunction | Combines focus trap + dismissal |
| **keyboard** | CleanupFunction | Type-safe key handling |
| **escape-handler** | CleanupFunction | Layer coordination via propagation |
| **aria** | CleanupFunction | Type-safe ARIA attributes |
| **sr-manager** | Announcer object | Live region management |
| **resize** | CleanupFunction | ResizeObserver wrapper |
| **focus** | Various utilities | Focus management helpers |

### What Framework Adapters Provide

Primitives are vanilla JS with limitations. Framework adapters (React, Vue, Svelte) can:

1. **Event Handler Merging**: Frameworks track handlers, can merge them
2. **Automatic Cleanup**: useEffect/onUnmounted handle cleanup automatically
3. **State Management**: Hooks/refs/stores provide state primitives don't have
4. **Re-rendering**: Automatically call primitives when props change

**Example React Wrapper**:
```typescript
function useFocusTrap(enabled: boolean, options?: FocusTrapOptions) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || !enabled) return;

    const cleanup = createFocusTrap(ref.current, options);
    return cleanup; // Automatic cleanup
  }, [enabled, options]); // Automatic re-call on change

  return ref;
}
```

---

**Document Version**: 1.0.0
**Next Steps**:
1. Review with frontend-developer agent
2. Implement primitives following this architecture
3. Create comprehensive test suite
4. Build React/Vue framework adapters

**Maintainer**: TypeScript Architecture Team
