# Headless Primitives Accessibility Requirements

**Status**: Requirements Specification
**Version**: 1.0.0
**Last Updated**: 2025-11-03
**Compliance Target**: WCAG 2.2 Level AA, Section 508 (revised 2017)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Primitive Specifications](#primitive-specifications)
   - [1. Slot](#1-slot-composition-utility)
   - [2. Modal](#2-modal-aria-attributes)
   - [3. Keyboard](#3-keyboard-arrow-navigation)
   - [4. Escape Handler](#4-escape-handler)
   - [5. ARIA](#5-aria-dynamic-attributes)
   - [6. SR Manager](#6-sr-manager-screen-reader)
   - [7. Resize](#7-resize-dom-repositioning)
   - [8. Focus](#8-focus-indicator-management)
4. [Cross-Primitive Integration](#cross-primitive-integration)
5. [Testing Requirements](#testing-requirements)
6. [Compliance Verification](#compliance-verification)

---

## Overview

This document specifies accessibility requirements for 8 **truly headless** primitives that form the foundation of rafters' WCAG 2.2 AA-compliant component system. These primitives are:

- **Stateless**: No internal state management
- **Event-driven**: Return `CleanupFunction`, framework adapters handle merging
- **ARIA-only**: NO `className`, NO `style`, NO visual rendering
- **Focused**: Each primitive handles ONE accessibility concern

### Why Headless?

Headless primitives separate **accessibility logic** from **visual presentation**. This allows:

1. **Compliance by default**: WCAG 2.2 AA compliance is in the primitive, not repeated in every component
2. **Framework flexibility**: Same primitive works with React, Vue, Svelte, vanilla JS
3. **Visual freedom**: Designers control all styling, primitives handle only ARIA/keyboard/focus
4. **Audit clarity**: Accessibility audits examine 8 primitives, not 50+ components

---

## Architecture Principles

### What Primitives MUST Handle

1. **ARIA Attributes**: Set/update/remove `aria-*` attributes based on state
2. **Keyboard Events**: Listen for keyboard interactions, call provided callbacks
3. **Focus Management**: Move focus, track focus, manage focus indicators
4. **Event Detection**: Detect Escape key, outside clicks, resize events

### What Primitives MUST NOT Handle

1. **State Management**: Primitives are stateless, consumers pass state as parameters
2. **Visual Styling**: NO `className`, NO `style` attribute manipulation
3. **Layout Calculation**: NO DOM repositioning (except `resize` primitive for overlays)
4. **Component Composition**: Primitives are utilities, not components

### Anti-Scope Examples

```typescript
// BAD: Primitive manages state
function modal(element) {
  let isOpen = false; // NO! State is consumer's responsibility
  element.setAttribute('aria-modal', isOpen);
}

// GOOD: Primitive applies ARIA based on consumer's state
function modal(element, isOpen: boolean) {
  element.setAttribute('aria-modal', String(isOpen));
  return () => element.removeAttribute('aria-modal');
}

// BAD: Primitive adds styling
function focus(element) {
  element.classList.add('focus-visible'); // NO! className is styling
}

// GOOD: Primitive manages :focus-visible behavior
function focus(element) {
  element.setAttribute('data-focus-visible', 'true'); // Data attribute only
  return () => element.removeAttribute('data-focus-visible');
}
```

---

## Primitive Specifications

### 1. Slot (Composition Utility)

#### Purpose
Merge ARIA attributes and data attributes from a child element onto a parent element. Enables the `asChild` pattern for component composition while preserving accessibility relationships.

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **1.3.1 Info and Relationships** | A | Preserves `aria-labelledby`, `aria-describedby` relationships during merge |
| **4.1.2 Name, Role, Value** | A | Maintains accessible name (`aria-label`, `aria-labelledby`) and role during prop merging |

#### Section 508 Requirements

- **502.3.1 Object Information**: Merged element retains programmatically determinable identity (accessible name + role)

#### ARIA Attributes Handled

**Merged Attributes** (from child to parent):
- `aria-label`
- `aria-labelledby`
- `aria-describedby`
- `aria-controls`
- `aria-owns`
- `aria-expanded`
- `aria-pressed`
- `aria-checked`
- `aria-selected`
- `aria-current`
- `role`
- All `data-*` attributes

**Merge Rules**:
1. If parent has no value, copy child's value
2. If parent has value, keep parent's value (parent wins)
3. For ID references (`aria-labelledby`, `aria-describedby`), ensure referenced elements exist
4. Generate unique IDs if conflicts detected

#### Keyboard Interactions

**None** - This primitive does not handle keyboard events.

#### Screen Reader Behavior

| Scenario | Expected Announcement |
|----------|----------------------|
| Button with slotted child | Announces merged `aria-label` or text content |
| Link with slotted icon | Announces link text, not icon's `aria-hidden="true"` |
| Merged role changes | Announces new role (e.g., "button" instead of "div") |

#### Event Merging

**Handled by framework adapters, NOT the primitive**. The primitive only merges ARIA/data attributes.

#### Anti-Scope: What Slot MUST NOT Do

- Merge `className` (use `tailwind-merge` in framework adapter)
- Merge `style` attributes (visual styling is out of scope)
- Merge event handlers (framework adapter responsibility)
- Manage component state (stateless utility)

#### API Signature

```typescript
interface SlotOptions {
  enabled?: boolean; // Default: true
}

function slot(
  parent: HTMLElement,
  child: Element | undefined,
  options?: SlotOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Merges `aria-label` from child to parent
- Merges `aria-labelledby` (ID reference)
- Preserves parent's attributes when child has same attribute
- Generates unique IDs when `id` conflicts exist
- Returns no-op cleanup when `enabled: false`
- Restores original attributes on cleanup

**Accessibility Tests**:
- Screen reader announces merged accessible name (NVDA, JAWS)
- Role attribute correctly communicated to AT
- `aria-labelledby` relationship maintained (label element found)
- `aria-describedby` relationship maintained (description element found)

---

### 2. Modal (ARIA Attributes)

#### Purpose
Apply ARIA attributes for modal dialog containers. Marks elements as modal, associates labels/descriptions, and manages accessible states for dialogs, alertdialogs, and popovers.

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **1.3.1 Info and Relationships** | A | Sets `aria-labelledby` to associate title with dialog |
| **4.1.2 Name, Role, Value** | A | Sets `role="dialog"` or `role="alertdialog"`, `aria-modal="true"` |
| **4.1.3 Status Messages** | AA | Sets `role="status"` or `role="alert"` for live region dialogs |

#### Section 508 Requirements

- **502.3.1 Object Information**: Dialog has accessible name via `aria-labelledby` or `aria-label`
- **502.3.5 Modification of Values**: `aria-modal` can be set programmatically

#### ARIA Attributes Handled

**Dialog Role**:
- `role="dialog"` (default)
- `role="alertdialog"` (for errors, warnings)
- `role="status"` (for non-modal status messages)

**Modal State**:
- `aria-modal="true"` (traps assistive technology focus)
- `aria-modal="false"` (non-modal dialog)

**Labeling**:
- `aria-labelledby` (ID reference to dialog title)
- `aria-label` (fallback if no title element)

**Description**:
- `aria-describedby` (ID reference to dialog description)

**Example Usage**:
```typescript
modal(dialogElement, {
  role: 'dialog',
  isModal: true,
  labelledBy: 'dialog-title',
  describedBy: 'dialog-description'
});

// Sets:
// - role="dialog"
// - aria-modal="true"
// - aria-labelledby="dialog-title"
// - aria-describedby="dialog-description"
```

#### Keyboard Interactions

**None** - This primitive only sets ARIA attributes. Keyboard handling (Escape to close) is handled by `escape-handler` primitive.

#### Screen Reader Behavior

| Scenario | Expected Announcement |
|----------|----------------------|
| Dialog opens | "Dialog, [title]" (NVDA), "[title] dialog" (JAWS) |
| Alert dialog opens | "Alert dialog, [title]" (immediate interruption) |
| Modal state | Virtual cursor restricted to dialog (aria-modal="true") |
| Non-modal dialog | Virtual cursor can access background content |

#### ARIA APG Pattern

- **Dialog (Modal)**: [https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- **Alert Dialog**: [https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)

#### Anti-Scope: What Modal MUST NOT Do

- Trap keyboard focus (use `focus-trap` library or focus primitive)
- Handle Escape key (use `escape-handler` primitive)
- Manage open/closed state (consumer's responsibility)
- Show/hide dialog visually (NO `display` or `visibility` changes)

#### API Signature

```typescript
interface ModalOptions {
  role?: 'dialog' | 'alertdialog' | 'status';
  isModal?: boolean; // Sets aria-modal
  labelledBy?: string; // ID reference
  label?: string; // Fallback accessible name
  describedBy?: string; // ID reference
}

function modal(
  element: HTMLElement,
  options: ModalOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Sets `role="dialog"` when role is 'dialog'
- Sets `role="alertdialog"` when role is 'alertdialog'
- Sets `aria-modal="true"` when isModal is true
- Sets `aria-modal="false"` when isModal is false
- Sets `aria-labelledby` with ID reference
- Sets `aria-label` when labelledBy not provided
- Sets `aria-describedBy` with ID reference
- Removes attributes on cleanup

**Accessibility Tests**:
- NVDA announces "Dialog" when opening
- JAWS announces dialog title
- Virtual cursor restricted to dialog when `aria-modal="true"`
- Alert dialog interrupts current announcement
- No axe-core violations

---

### 3. Keyboard (Arrow Navigation)

#### Purpose
Implement arrow key navigation with roving tabindex for composite widgets (menus, radio groups, tabs, toolbars, listboxes).

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **2.1.1 Keyboard** | A | Arrow keys navigate between items, Tab moves out of group |
| **2.4.3 Focus Order** | A | Only one item in tab sequence (roving tabindex), logical arrow key order |
| **4.1.2 Name, Role, Value** | A | Updates `tabindex` to communicate current item to AT |

#### Section 508 Requirements

- **502.3.3 Modification of Focus Cursor**: Focus can be moved programmatically via arrow keys

#### ARIA Attributes Handled

**Tabindex Management**:
- Sets `tabindex="0"` on current item
- Sets `tabindex="-1"` on all other items

**Optional (if using aria-activedescendant pattern)**:
- Sets `aria-activedescendant` on container (alternative to roving tabindex)

**Position Announcement** (consumer must set):
- `aria-posinset` (position in set, e.g., "2")
- `aria-setsize` (total set size, e.g., "5")

#### Keyboard Interactions

| Key | Action | Orientation |
|-----|--------|-------------|
| **ArrowRight** | Move focus to next item (wrap if `loop` enabled) | Horizontal, Both |
| **ArrowLeft** | Move focus to previous item (wrap if `loop` enabled) | Horizontal, Both |
| **ArrowDown** | Move focus to next item (wrap if `loop` enabled) | Vertical, Both |
| **ArrowUp** | Move focus to previous item (wrap if `loop` enabled) | Vertical, Both |
| **Home** | Move focus to first item | All |
| **End** | Move focus to last item | All |
| **Tab** | Move focus OUT of group to next tabbable element | All |
| **Shift+Tab** | Move focus OUT of group to previous tabbable element | All |

**Orientation Rules**:
- `horizontal`: Only Left/Right arrows work
- `vertical`: Only Up/Down arrows work
- `both`: All arrow keys work

**RTL Support**:
- When `dir="rtl"`, Left/Right arrow behavior reverses
- Right arrow moves to previous item (visual left)
- Left arrow moves to next item (visual right)

#### Screen Reader Behavior

| Scenario | Expected Announcement |
|----------|----------------------|
| Arrow key navigation | "Option 2 of 5" (announces new item + position) |
| First/last item (no loop) | No focus change, no announcement |
| First/last item (loop enabled) | Wraps to opposite end, announces new item |
| Tab key pressed | Focus leaves group, announces next tabbable element |

#### ARIA APG Patterns

- **Menubar**: [https://www.w3.org/WAI/ARIA/apg/patterns/menubar/](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- **Radio Group**: [https://www.w3.org/WAI/ARIA/apg/patterns/radio/](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- **Tabs**: [https://www.w3.org/WAI/ARIA/apg/patterns/tabs/](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- **Toolbar**: [https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

#### Anti-Scope: What Keyboard MUST NOT Do

- Set `role` attributes (consumer's responsibility)
- Set `aria-selected`, `aria-checked` (consumer manages state)
- Set `aria-posinset`, `aria-setsize` (consumer calculates position)
- Handle Enter/Space activation (use separate activation handler)
- Manage component state (which item is selected)

#### API Signature

```typescript
interface KeyboardOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'; // Default: 'vertical'
  loop?: boolean; // Wrap to first/last item. Default: true
  dir?: 'ltr' | 'rtl'; // Text direction. Default: 'ltr'
  currentIndex: number; // Index of currently focused item (0-based)
  onNavigate: (newIndex: number) => void; // Callback when focus moves
}

function keyboard(
  container: HTMLElement,
  items: HTMLElement[],
  options: KeyboardOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- ArrowRight moves to next item (horizontal orientation)
- ArrowLeft moves to previous item (horizontal orientation)
- ArrowDown moves to next item (vertical orientation)
- ArrowUp moves to previous item (vertical orientation)
- Home moves to first item
- End moves to last item
- Tab moves focus out of group
- Loop wrapping works when enabled
- No wrapping when loop disabled
- Only one item has `tabindex="0"` at a time
- RTL reverses Left/Right behavior

**Accessibility Tests**:
- NVDA announces item position "2 of 5"
- JAWS announces item name and position
- All items reachable via arrow keys
- Tab sequence includes only current item (roving tabindex)
- Works in NVDA browse mode (forms mode for interactive elements)

**Performance Tests**:
- Handles 1000+ items without lag
- Efficient event listener cleanup

---

### 4. Escape Handler

#### Purpose
Detect Escape key presses and outside click/focus events for dismissable UI elements (dialogs, dropdowns, popovers, tooltips).

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **2.1.2 No Keyboard Trap** | A | Escape key always allows exiting focus traps |
| **3.2.1 On Focus** | A | Outside focus detection doesn't unexpectedly change context |
| **3.2.2 On Input** | A | Escape key handling is predictable, doesn't unexpectedly change settings |

#### Section 508 Requirements

- **502.3.3 Modification of Focus Cursor**: Focus can be moved away from element via Escape key

#### ARIA Attributes Handled

**None** - This primitive does not set ARIA attributes. It only detects events and calls provided callbacks.

#### Keyboard Interactions

| Key | Action |
|-----|--------|
| **Escape** | Calls `onEscapeKeyDown` callback |

**Event Capture**:
- Uses `capture: true` to detect Escape before other handlers
- Prevents default behavior to stop browser actions (e.g., exiting fullscreen)

#### Outside Interaction Detection

**Pointer Events**:
- `pointerdown` outside element: Calls `onPointerDownOutside` callback
- Detects clicks, taps, pen inputs

**Focus Events**:
- `focusin` outside element: Calls `onFocusOutside` callback
- Detects keyboard Tab, programmatic focus

**Exclusions** (configurable):
- Ignore events on specific elements via `ignoreElements` option
- Ignore events within portal containers (e.g., nested dialogs)

#### Screen Reader Behavior

**No impact on screen reader announcements**. Primitive only detects events, consumer handles dismissal and announcements.

#### Anti-Scope: What Escape Handler MUST NOT Do

- Close/hide the element (consumer's responsibility)
- Announce dismissal to screen readers (use `sr-manager` primitive)
- Manage focus return (use focus-trap library or consumer logic)
- Block pointer events outside element (use CSS `pointer-events: none`)

#### API Signature

```typescript
interface EscapeHandlerOptions {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: Event) => void; // Generic callback for any outside event
  ignoreElements?: HTMLElement[]; // Don't trigger callbacks for events on these elements
  enabled?: boolean; // Default: true
}

function escapeHandler(
  element: HTMLElement,
  options: EscapeHandlerOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Calls `onEscapeKeyDown` when Escape pressed
- Calls `onPointerDownOutside` when clicking outside
- Calls `onFocusOutside` when tabbing outside
- Calls `onInteractOutside` for any outside interaction
- Ignores events on `ignoreElements`
- Does not call callbacks when inside element
- Removes event listeners on cleanup

**Accessibility Tests**:
- Escape key works with NVDA virtual cursor active
- Escape key works with JAWS forms mode
- Outside click detection doesn't interfere with screen reader navigation
- Works with VoiceOver rotor gestures

**Performance Tests**:
- Efficient event delegation (uses capture phase)
- Handles rapid Escape key presses
- No memory leaks on cleanup

---

### 5. ARIA (Dynamic Attributes)

#### Purpose
Safely set, update, and remove ARIA attributes with type safety and runtime validation. Ensures ARIA attribute values conform to the ARIA 1.2 specification.

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **4.1.2 Name, Role, Value** | A | Ensures ARIA attributes use valid values per ARIA spec |
| **1.3.1 Info and Relationships** | A | Validates ID references for `aria-labelledby`, `aria-describedby` |

#### Section 508 Requirements

- **502.3.1 Object Information**: ARIA attributes provide programmatically determinable identity
- **502.3.5 Modification of Values**: ARIA attributes can be set/updated programmatically

#### ARIA Attributes Handled

**Widget Attributes**:
- `aria-autocomplete`: `'none' | 'inline' | 'list' | 'both'`
- `aria-checked`: `boolean | 'mixed'`
- `aria-disabled`: `boolean`
- `aria-expanded`: `boolean`
- `aria-haspopup`: `boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'`
- `aria-hidden`: `boolean`
- `aria-invalid`: `boolean | 'grammar' | 'spelling'`
- `aria-label`: `string`
- `aria-level`: `number` (headings, tree items)
- `aria-modal`: `boolean`
- `aria-multiline`: `boolean`
- `aria-multiselectable`: `boolean`
- `aria-orientation`: `'horizontal' | 'vertical'`
- `aria-placeholder`: `string`
- `aria-pressed`: `boolean | 'mixed'`
- `aria-readonly`: `boolean`
- `aria-required`: `boolean`
- `aria-selected`: `boolean`
- `aria-sort`: `'none' | 'ascending' | 'descending' | 'other'`
- `aria-valuemax`: `number`
- `aria-valuemin`: `number`
- `aria-valuenow`: `number`
- `aria-valuetext`: `string`

**Live Region Attributes**:
- `aria-atomic`: `boolean`
- `aria-busy`: `boolean`
- `aria-live`: `'off' | 'polite' | 'assertive'`
- `aria-relevant`: `'additions' | 'removals' | 'text' | 'all'`

**Relationship Attributes** (ID references):
- `aria-activedescendant`: `string`
- `aria-controls`: `string`
- `aria-describedby`: `string`
- `aria-details`: `string`
- `aria-errormessage`: `string`
- `aria-flowto`: `string`
- `aria-labelledby`: `string`
- `aria-owns`: `string`

**Position Attributes**:
- `aria-posinset`: `number`
- `aria-setsize`: `number`

#### Type Conversions

**Boolean to String**:
```typescript
aria(element, { 'aria-checked': true });
// Sets: aria-checked="true"

aria(element, { 'aria-checked': false });
// Sets: aria-checked="false"
```

**Number to String**:
```typescript
aria(element, { 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 50 });
// Sets: aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
```

**ID Reference Validation**:
```typescript
aria(element, { 'aria-labelledby': 'non-existent-id' });
// Warns: "Referenced element 'non-existent-id' not found"
```

#### Runtime Validation

**Value Validation** (when `validate: true`):
- Ensures `aria-valuemin` < `aria-valuemax`
- Ensures `aria-valuenow` is between min and max
- Validates enum values (e.g., `aria-haspopup` must be valid token)
- Checks ID references exist in DOM

**Error Handling**:
- Invalid values log warnings (doesn't throw, to avoid breaking apps)
- Returns cleanup function that restores original values

#### Screen Reader Behavior

**No direct impact**. This primitive sets attributes; screen readers consume them based on their roles and patterns.

#### Anti-Scope: What ARIA MUST NOT Do

- Set `role` attribute (separate concern, not ARIA state/property)
- Manage component state (stateless utility)
- Infer ARIA attributes (explicit only, no magic)
- Handle ARIA patterns (e.g., roving tabindex is `keyboard` primitive's job)

#### API Signature

```typescript
interface AriaAttributes {
  // Full definition from PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  // ... (full list of 40+ ARIA attributes)
}

interface AriaOptions {
  validate?: boolean; // Validate values against ARIA spec. Default: true
  warn?: boolean; // Log warnings for invalid values. Default: true
}

function aria(
  element: HTMLElement,
  attributes: Partial<AriaAttributes>,
  options?: AriaOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Sets boolean attributes as "true"/"false" strings
- Converts numbers to strings
- Validates enum values (warns on invalid)
- Checks ID references exist (warns if missing)
- Removes attributes on cleanup
- Restores original attribute values on cleanup

**Accessibility Tests**:
- NVDA announces `aria-label` correctly
- JAWS finds `aria-labelledby` reference
- `aria-live` regions announce updates
- `aria-expanded` changes announced (e.g., "collapsed" to "expanded")

**Validation Tests**:
- Warns when `aria-valuemin` > `aria-valuemax`
- Warns when `aria-valuenow` out of range
- Warns when ID reference not found
- Warns when invalid enum value provided

---

### 6. SR Manager (Screen Reader)

#### Purpose
Make polite or assertive announcements to screen readers without visual changes. Uses ARIA live regions to communicate status messages, validation feedback, and dynamic updates.

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **4.1.3 Status Messages** | AA | Uses `role="status"` or `role="alert"` for live region announcements |
| **1.3.1 Info and Relationships** | A | Live region relationships conveyed programmatically |

#### Section 508 Requirements

- **502.3.1 Object Information**: Status messages have programmatically determinable content

#### ARIA Attributes Handled

**Live Region Role**:
- `role="status"` (polite announcements)
- `role="alert"` (assertive announcements)
- `role="log"` (sequential updates, e.g., chat messages)

**Live Region Attributes**:
- `aria-live="polite"` (announce when user is idle)
- `aria-live="assertive"` (interrupt current announcement)
- `aria-live="off"` (disable announcements)
- `aria-atomic="true"` (announce entire region content)
- `aria-relevant="additions text"` (announce text changes)

#### Live Region Types

| Type | ARIA Live | Role | Use Cases |
|------|-----------|------|-----------|
| **Polite** | `polite` | `status` | Success messages, search results, loading states, non-urgent updates |
| **Assertive** | `assertive` | `alert` | Error messages, time-sensitive alerts, security warnings, connection loss |
| **Off** | `off` | - | Disabled announcements |

#### Screen Reader Behavior

| Screen Reader | Polite Announcement | Assertive Announcement |
|---------------|---------------------|------------------------|
| **NVDA** | Announces when user stops typing/navigating | Interrupts current speech |
| **JAWS** | Announces after current action completes | Interrupts immediately |
| **VoiceOver (macOS)** | Announces after brief pause | Interrupts current speech |
| **VoiceOver (iOS)** | Announces after user action | Interrupts current speech |
| **TalkBack (Android)** | Announces after pause | Interrupts immediately |

#### Announcement Best Practices

**Message Length**:
- Keep messages concise (1-2 sentences max)
- Avoid verbose announcements (users can't skip)

**Timing**:
- Clear messages after 1-5 seconds to prevent re-announcement on page refresh
- Don't announce empty live regions on page load (only dynamic updates announced)

**Duplication Prevention**:
- Only one live region per politeness level (reuse same region for multiple announcements)
- Clear previous message before announcing new one

**Example Announcements**:
- "Item added to cart" (polite)
- "Error: Password is required" (assertive)
- "Loading..." (polite)
- "Connection lost. Please check your internet." (assertive)

#### Anti-Scope: What SR Manager MUST NOT Do

- Display visual alerts (use consumer's UI for visual feedback)
- Manage focus (use focus primitive)
- Handle keyboard events (use escape-handler or keyboard primitive)
- Store announcement history (stateless utility)

#### API Signature

```typescript
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

interface SRManagerOptions {
  politeness?: LiveRegionPoliteness; // Default: 'polite'
  role?: 'status' | 'alert' | 'log'; // Default: 'status' for polite, 'alert' for assertive
  clearAfterAnnounce?: boolean; // Clear message after timeout. Default: true
  clearTimeout?: number; // Milliseconds. Default: 1000
}

function srManager(
  options?: SRManagerOptions
): {
  announce: (message: string) => void;
  clear: () => void;
  destroy: CleanupFunction;
};

// Convenience function for one-time announcements
function announceToScreenReader(
  message: string,
  politeness?: LiveRegionPoliteness
): void;
```

#### Testing Requirements

**Unit Tests**:
- Creates live region in DOM
- Sets `aria-live="polite"` for polite announcements
- Sets `aria-live="assertive"` for assertive announcements
- Sets correct `role` attribute
- Updates message content on `announce()`
- Clears message after timeout
- Removes live region on `destroy()`

**Accessibility Tests** (manual with screen readers):
- NVDA announces polite messages when idle
- NVDA announces assertive messages immediately
- JAWS announces polite messages
- JAWS announces assertive messages immediately
- VoiceOver on macOS announces messages
- VoiceOver on iOS announces messages
- TalkBack on Android announces messages
- Messages not announced on page load (only dynamic updates)
- No duplicate announcements for same message

**Performance Tests**:
- Handles rapid announcements (debounces if needed)
- No memory leaks when creating/destroying multiple managers

---

### 7. Resize (DOM Repositioning)

#### Purpose
Reposition overlay elements (tooltips, popovers, dropdowns) when window resizes or scrolls. Ensures overlays stay visually connected to their trigger elements and don't overflow viewport edges.

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **1.4.4 Resize Text** | AA | Overlays reposition when text size changes (triggers resize event) |
| **1.4.10 Reflow** | AA | Overlays reposition when viewport resizes to 320px width |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | Repositions overlays to prevent obscuring focused elements |

#### Section 508 Requirements

- **502.3.3 Modification of Focus Cursor**: Overlays don't obscure keyboard focus indicators

#### ARIA Attributes Handled

**None** - This primitive does not set ARIA attributes. It only updates `style.top`, `style.left`, `style.transform` for positioning.

**EXCEPTION**: This is the ONLY primitive that manipulates visual styles (`style` attribute), because repositioning is inherently a visual concern that impacts accessibility (focus not obscured).

#### Resize/Scroll Events Monitored

**Window Events**:
- `resize`: Viewport dimensions change
- `scroll`: Page scrolls (overlay may need repositioning)

**Element Events**:
- `ResizeObserver`: Trigger element or overlay size changes (e.g., content updates)

#### Positioning Strategies

**Placement Options**:
- `top`, `top-start`, `top-end`
- `bottom`, `bottom-start`, `bottom-end`
- `left`, `left-start`, `left-end`
- `right`, `right-start`, `right-end`

**Collision Detection**:
- Flips placement when overlay would overflow viewport
- Example: `top` flips to `bottom` if not enough space above trigger
- Shifts overlay horizontally to stay within viewport (respects padding)

**Offset**:
- Configurable spacing between trigger and overlay (default: 8px)

#### Screen Reader Behavior

**No impact on announcements**. Repositioning is visual only. Screen readers rely on ARIA attributes (set by `modal` or `aria` primitives) to convey overlay relationships.

#### Anti-Scope: What Resize MUST NOT Do

- Set `role` or ARIA attributes (use `modal` or `aria` primitives)
- Show/hide overlays (consumer's responsibility)
- Manage focus (use focus primitive or focus-trap library)
- Handle keyboard events (use `escape-handler` primitive)
- Create portal elements (consumer uses `portal` utility or React Portal)

#### API Signature

```typescript
type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface ResizeOptions {
  placement?: Placement; // Default: 'bottom'
  offset?: number; // Pixels between trigger and overlay. Default: 8
  flip?: boolean; // Flip placement on collision. Default: true
  shift?: boolean; // Shift overlay to stay in viewport. Default: true
  padding?: number; // Viewport edge padding. Default: 8
  onPositionUpdate?: (position: { top: number; left: number; placement: Placement }) => void;
}

function resize(
  overlay: HTMLElement,
  trigger: HTMLElement,
  options?: ResizeOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Positions overlay below trigger when placement is 'bottom'
- Positions overlay above trigger when placement is 'top'
- Flips placement when overlay would overflow viewport
- Shifts overlay horizontally to stay in viewport
- Updates position on window resize
- Updates position on window scroll
- Removes event listeners on cleanup

**Accessibility Tests**:
- Overlay doesn't obscure focused elements (WCAG 2.4.11)
- Overlay repositions when text size increases (WCAG 1.4.4)
- Overlay repositions at 320px viewport width (WCAG 1.4.10)

**Performance Tests**:
- Throttles resize/scroll events (60fps max)
- Uses `ResizeObserver` efficiently
- No layout thrashing (read then write pattern)

---

### 8. Focus (Indicator Management)

#### Purpose
Manage `:focus-visible` behavior to show keyboard focus indicators while hiding mouse focus indicators. Ensures WCAG 2.4.7 and 2.4.13 compliance by making focus visible for keyboard users.

#### WCAG Success Criteria

| Criterion | Level | How Primitive Addresses It |
|-----------|-------|----------------------------|
| **2.4.7 Focus Visible** | AA | Keyboard focus indicator visible at all times during keyboard navigation |
| **2.4.11 Focus Not Obscured (Minimum)** | AA | Works with `resize` primitive to ensure focus indicator not obscured |
| **2.4.12 Focus Not Obscured (Enhanced)** | AAA | No part of focus indicator hidden by overlays |
| **2.4.13 Focus Appearance** | AAA | Focus indicator meets minimum size (2px) and contrast (3:1) requirements |

#### Section 508 Requirements

- **502.3.3 Modification of Focus Cursor**: Focus indicator can be programmatically determined and displayed

#### ARIA Attributes Handled

**None** - This primitive does not set ARIA attributes. It sets a `data-focus-visible` attribute that CSS selectors can target.

**Data Attribute**:
- `data-focus-visible="true"` when keyboard focus is visible
- `data-focus-visible="false"` (or removed) when mouse focus is hidden

#### Focus Indicator Rules (WCAG 2.4.13)

**Minimum Size**:
- Focus indicator change of color must have at least **2 CSS pixels** thickness
- Indicator should outline the entire focused element, or mark change area with 2px+ line

**Contrast Requirements**:
- **3:1 contrast ratio** between focused and unfocused states
- For outline/border focus indicators: 3:1 against adjacent colors

**Visibility**:
- Focus indicator must not be fully obscured by author-created content (WCAG 2.4.11)
- For enhanced compliance (WCAG 2.4.12), no part of indicator should be hidden

#### Focus Detection

**Keyboard-Triggered Focus** (show indicator):
- Tab key
- Shift+Tab key
- Arrow keys (when using roving focus)
- Programmatic focus from keyboard interaction

**Mouse-Triggered Focus** (hide indicator):
- Mouse click on element
- Touch tap on element
- Programmatic focus from pointer interaction

**Detection Method**:
- Tracks last interaction type (keyboard vs. pointer)
- Uses `pointerdown` event to detect mouse/touch interactions
- Uses `keydown` event to detect keyboard interactions

#### Browser Compatibility

**Native `:focus-visible`**:
- Modern browsers support `:focus-visible` pseudo-class
- This primitive provides polyfill for older browsers (via `data-focus-visible`)

**CSS Integration**:
```css
/* Modern browsers */
button:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* Polyfill for older browsers */
button[data-focus-visible="true"] {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

#### Anti-Scope: What Focus MUST NOT Do

- Style focus indicators (use CSS, not inline styles)
- Trap focus (use focus-trap library)
- Manage roving tabindex (use `keyboard` primitive)
- Handle keyboard navigation (use `keyboard` primitive)

#### API Signature

```typescript
interface FocusOptions {
  enabled?: boolean; // Default: true
  polyfill?: boolean; // Add data-focus-visible polyfill. Default: true
}

function focus(
  element: HTMLElement,
  options?: FocusOptions
): CleanupFunction;

// Global focus-visible tracker (attaches to document)
function focusVisibleManager(
  options?: FocusOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Sets `data-focus-visible="true"` on keyboard Tab
- Removes `data-focus-visible` on mouse click
- Works with programmatic focus after keyboard interaction
- Removes data attribute on cleanup

**Accessibility Tests**:
- Focus indicator visible when tabbing through elements
- Focus indicator hidden when clicking with mouse
- Focus indicator meets 2.4.13 size requirements (2px minimum)
- Focus indicator meets 3:1 contrast ratio (visual inspection)
- Focus indicator not obscured by overlays (works with `resize` primitive)

**Browser Compatibility Tests**:
- Works in Chrome, Firefox, Safari, Edge
- Polyfill works in older browsers without native `:focus-visible`

---

## Cross-Primitive Integration

### Common Integration Patterns

#### Modal Dialog with Full Accessibility

Combines: `modal`, `keyboard`, `escape-handler`, `focus`, `sr-manager`

```typescript
// 1. Set modal ARIA attributes
const modalCleanup = modal(dialogElement, {
  role: 'dialog',
  isModal: true,
  labelledBy: 'dialog-title',
  describedBy: 'dialog-description'
});

// 2. Handle Escape key and outside clicks
const escapeCleanup = escapeHandler(dialogElement, {
  onEscapeKeyDown: () => closeDialog(),
  onPointerDownOutside: () => closeDialog()
});

// 3. Ensure focus indicators visible
const focusCleanup = focusVisibleManager();

// 4. Announce dialog opening to screen readers
const { announce } = srManager({ politeness: 'polite' });
announce('Dialog opened');

// Cleanup
function cleanup() {
  modalCleanup();
  escapeCleanup();
  focusCleanup();
}
```

#### Dropdown Menu with Arrow Navigation

Combines: `keyboard`, `escape-handler`, `resize`, `focus`

```typescript
const menuItems = Array.from(menuElement.querySelectorAll('[role="menuitem"]'));

// 1. Arrow key navigation
const keyboardCleanup = keyboard(menuElement, menuItems, {
  orientation: 'vertical',
  loop: true,
  currentIndex: 0,
  onNavigate: (newIndex) => {
    menuItems[newIndex].focus();
  }
});

// 2. Escape to close
const escapeCleanup = escapeHandler(menuElement, {
  onEscapeKeyDown: () => closeMenu(),
  onPointerDownOutside: () => closeMenu()
});

// 3. Reposition on scroll/resize
const resizeCleanup = resize(menuElement, triggerButton, {
  placement: 'bottom-start',
  offset: 4
});

// 4. Focus indicators
const focusCleanup = focusVisibleManager();
```

### Primitive Compatibility Matrix

| Primitive | Combines Well With | Conflicts With |
|-----------|-------------------|----------------|
| **slot** | All primitives | None |
| **modal** | escape-handler, focus, sr-manager | None |
| **keyboard** | focus, sr-manager | None |
| **escape-handler** | modal, keyboard, resize | None |
| **aria** | All primitives | None |
| **sr-manager** | All primitives | None |
| **resize** | escape-handler, focus | None |
| **focus** | All primitives | None |

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

### Automated Testing Tools

**axe-core** (Playwright):
```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('modal primitive has no axe violations', async ({ page }) => {
  await page.goto('/test/modal.html');
  await injectAxe(page);
  await checkA11y(page, '[role="dialog"]', {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});
```

**ARIA Validator** (custom):
```typescript
function validateAriaAttributes(element: HTMLElement): string[] {
  const errors: string[] = [];

  // Check ID references exist
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy && !document.getElementById(labelledBy)) {
    errors.push(`aria-labelledby references non-existent ID: ${labelledBy}`);
  }

  // Check valid enum values
  const live = element.getAttribute('aria-live');
  if (live && !['off', 'polite', 'assertive'].includes(live)) {
    errors.push(`aria-live has invalid value: ${live}`);
  }

  return errors;
}
```

### Manual Testing Checklist

**Screen Readers**:
- [ ] NVDA (Windows) - Latest version
- [ ] JAWS (Windows) - Latest version
- [ ] VoiceOver (macOS) - Latest macOS version
- [ ] VoiceOver (iOS) - Latest iOS version
- [ ] TalkBack (Android) - Latest Android version

**Browsers**:
- [ ] Chrome (Windows, macOS, Linux)
- [ ] Firefox (Windows, macOS, Linux)
- [ ] Safari (macOS, iOS)
- [ ] Edge (Windows)

**Keyboard Navigation**:
- [ ] Tab/Shift+Tab moves focus correctly
- [ ] Arrow keys navigate within components
- [ ] Enter/Space activate buttons
- [ ] Escape closes dialogs/menus
- [ ] Home/End move to first/last items

### Coverage Requirements

- **Minimum Line Coverage**: 90%
- **Minimum Branch Coverage**: 85%
- **Critical Paths** (keyboard, ARIA): 100% coverage

---

## Compliance Verification

### WCAG 2.2 Checklist

Each primitive must document which WCAG success criteria it addresses:

| Criterion | Level | Primitives Addressing It |
|-----------|-------|--------------------------|
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

### Section 508 Checklist

| Requirement | Primitives Addressing It |
|-------------|--------------------------|
| **502.3.1 Object Information** | slot, modal, aria, sr-manager |
| **502.3.3 Modification of Focus Cursor** | keyboard, escape-handler, focus |
| **502.3.5 Modification of Values** | modal, aria |

### ARIA APG Pattern Compliance

| Pattern | Primitives Used | ARIA Attributes Required |
|---------|-----------------|--------------------------|
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
2. **modal**: Set dialog ARIA attributes (`role`, `aria-modal`, `aria-labelledby`)
3. **keyboard**: Arrow key navigation with roving tabindex
4. **escape-handler**: Detect Escape key and outside clicks
5. **aria**: Safely set/update/remove ARIA attributes with validation
6. **sr-manager**: Announce messages to screen readers via live regions
7. **resize**: Reposition overlays on window resize/scroll
8. **focus**: Manage `:focus-visible` behavior for keyboard vs. mouse focus

### Compliance By Design

By implementing these 8 primitives correctly, rafters components automatically achieve:

- **WCAG 2.2 Level AA** compliance (all applicable criteria)
- **Section 508** compliance (revised 2017)
- **ARIA APG** pattern conformance
- **Cross-browser** accessibility (Chrome, Firefox, Safari, Edge)
- **Screen reader** compatibility (NVDA, JAWS, VoiceOver, TalkBack)

### Next Steps

1. Implement primitives in priority order (see PRIMITIVES_REQUIREMENTS.md Phase 1-3)
2. Write comprehensive test suites (unit, a11y, integration)
3. Manual testing with screen readers (NVDA, JAWS, VoiceOver)
4. Audit components built with primitives for compliance
5. Document integration patterns for common use cases

---

**Document Version**: 1.0.0
**Author**: Rafters Accessibility Team
**Review Status**: Requirements Specification
**Next Review**: After implementing first 3 primitives (slot, modal, keyboard)
