# Accessibility Primitives Requirements

**Status**: Requirements Specification
**Version**: 1.0.0
**Last Updated**: 2025-11-03
**Compliance Target**: WCAG 2.2 Level AAA, Section 508 (revised 2017), EN 301 549

---

## Table of Contents

1. [Overview](#overview)
2. [Compliance Standards](#compliance-standards)
3. [Target Components](#target-components)
4. [Primitive Pattern Specifications](#primitive-pattern-specifications)
5. [Testing Requirements](#testing-requirements)
6. [GitHub Issue Templates](#github-issue-templates)

---

## Overview

This document specifies the accessibility primitives required to support shadcn-compatible components in the Rafters design system. Each primitive is a **stateless vanilla TypeScript function** that provides WCAG 2.2 AAA-compliant infrastructure for keyboard navigation, ARIA management, focus control, and screen reader support.

### Guiding Principles

1. **Zero State**: Primitives never manage state - consumers pass current state as input
2. **Standards First**: WCAG 2.2 AAA and Section 508 compliance is non-negotiable
3. **Pure Functions**: All primitives return cleanup functions, no side effects outside provided elements
4. **SSR Safe**: Check for DOM availability before any DOM manipulation
5. **Framework Agnostic**: Vanilla TypeScript, no React/Vue/Svelte dependencies
6. **Registry Distribution**: Delivered via `npx rafters add [primitive]`, not npm

---

## Compliance Standards

### WCAG 2.2 Level AAA

All primitives must meet **Level AAA** compliance for applicable success criteria:

#### Keyboard Accessibility (Guideline 2.1)
- **2.1.1 Keyboard (Level A)**: All functionality available from keyboard
- **2.1.2 No Keyboard Trap (Level A)**: Focus can be moved away using standard navigation
- **2.1.3 Keyboard (No Exception) (Level AAA)**: All functionality available from keyboard without exceptions
- **2.1.4 Character Key Shortcuts (Level A)**: Single character shortcuts can be turned off or remapped

#### Navigation (Guideline 2.4)
- **2.4.3 Focus Order (Level A)**: Logical focus order
- **2.4.7 Focus Visible (Level AA)**: Keyboard focus indicator visible
- **2.4.11 Focus Not Obscured (Minimum) (Level AA)**: Focused element not fully hidden by author-created content
- **2.4.12 Focus Not Obscured (Enhanced) (Level AAA)**: No part of focus indicator hidden by author-created content
- **2.4.13 Focus Appearance (Level AAA)**: Focus indicator meets minimum size and contrast requirements

#### Input Modalities (Guideline 2.5)
- **2.5.7 Dragging Movements (Level AA)**: Functionality that uses dragging can be achieved by single pointer
- **2.5.8 Target Size (Minimum) (Level AA)**: Target size at least 24×24 CSS pixels

#### ARIA and Semantics (Guideline 4.1)
- **4.1.2 Name, Role, Value (Level A)**: UI components have accessible name and role
- **4.1.3 Status Messages (Level AA)**: Status messages can be programmatically determined

### Section 508 (Revised 2017)

Section 508 updated in 2017 to align with WCAG 2.0 Level AA (and by extension, WCAG 2.1/2.2 Level AA). Key relevant requirements:

- **502.3.1 Object Information**: Accessible name and role for UI objects
- **502.3.3 Modification of Focus Cursor**: Focus can be programmatically determined
- **502.3.5 Modification of Values and Text**: Values can be set programmatically
- **503.4 User Controls**: Controls must have programmatically determinable identity

### W3C ARIA Authoring Practices Guide (APG)

All primitives must follow patterns from the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/):

- Dialog (Modal)
- Menu Button
- Combobox
- Accordion
- Tabs
- Radio Group
- Slider
- Tooltip
- Button

---

## Target Components

Primitives must support building these shadcn-compatible components:

1. **Button** - Including toggle buttons and icon buttons
2. **Dialog/Modal** - Modal and non-modal dialogs
3. **Dropdown Menu** - Context menus, menu bars
4. **Combobox** - Autocomplete, searchable select
5. **Accordion** - Collapsible content sections
6. **Tabs** - Tabbed interfaces
7. **Tooltip** - Contextual help popups
8. **Radio Group** - Mutually exclusive options
9. **Checkbox** - Single and grouped checkboxes
10. **Date Picker** - Date selection interfaces
11. **Slider** - Range and single-value sliders

---

## Primitive Pattern Specifications

### 1. Slot (Prop Merging)

#### Purpose
Enable the `asChild` pattern by merging props, event handlers, and ARIA attributes from a child element onto a parent container.

#### WCAG Compliance
- **4.1.2 Name, Role, Value (Level A)**: Preserve ARIA attributes during merge
- Must maintain accessible name and role from child

#### Keyboard Interactions
N/A - This primitive doesn't handle keyboard interactions directly

#### ARIA Management
- Merge all `aria-*` attributes from child to parent
- Preserve `role` attribute
- Handle `aria-labelledby` and `aria-describedby` references
- Merge `id` attributes (generate unique IDs if conflicts)

#### Screen Reader Support
- Merged element must announce with combined accessible name
- State changes from child must propagate to parent

#### API Design

```typescript
interface SlotOptions {
  enabled?: boolean;
  mergeProps?: boolean;
  mergeClassName?: boolean; // Use tailwind-merge for class merging
  mergeStyle?: boolean;
  mergeEventHandlers?: boolean;
}

function createSlot(
  container: HTMLElement,
  slottedChild: Element | undefined,
  options?: SlotOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Merges ARIA attributes correctly
- Preserves original attributes on cleanup
- Handles conflicting `id` attributes
- Merges event handlers without breaking delegation
- Combines className using tailwind-merge
- Merges inline styles correctly

**Accessibility Tests**:
- Screen reader announces merged accessible name
- Role is correctly communicated
- Relationships (labelledby, describedby) maintained

**SSR Tests**:
- Returns no-op cleanup when DOM unavailable
- No errors when called server-side

---

### 2. Focus Trap

#### Purpose
Trap keyboard focus within a container, preventing Tab/Shift+Tab from moving focus outside. Essential for modal dialogs.

#### WCAG Compliance
- **2.1.1 Keyboard (Level A)**: Tab/Shift+Tab work correctly
- **2.1.2 No Keyboard Trap (Level A)**: Escape key always allows exiting trap
- **2.4.3 Focus Order (Level A)**: Logical focus order maintained
- **2.4.7 Focus Visible (Level AA)**: Focus indicator visible at all times
- **2.4.11 Focus Not Obscured (Minimum) (Level AA)**: Focused element not fully hidden

#### Keyboard Interactions

| Key | Action |
|-----|--------|
| **Tab** | Move focus to next focusable element; wrap to first element when at last |
| **Shift+Tab** | Move focus to previous focusable element; wrap to last element when at first |
| **Escape** | Deactivate trap and restore focus (if `escapeDeactivates` enabled) |

#### ARIA Management
- Does not directly set ARIA attributes
- Works with consumer-provided `aria-modal="true"` on dialog containers

#### Screen Reader Support
- Focus changes must announce element name and role
- State changes within trap must be communicated
- No announcements required from primitive itself

#### Focus Management
- Move focus to specified initial element on activation
- Maintain focus within container at all times
- Return focus to previously focused element on deactivation
- Skip disabled elements (`:disabled`, `aria-disabled="true"`)
- Skip hidden elements (`display: none`, `visibility: hidden`, `aria-hidden="true"`)
- Include all focusable elements: `<a href>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `[tabindex]:not([tabindex="-1"])`

#### API Design

```typescript
interface FocusTrapOptions {
  enabled?: boolean;
  autoFocus?: boolean; // Auto-focus first element on activation
  initialFocusElement?: HTMLElement; // Specific element to focus initially
  returnFocusOnDeactivate?: boolean; // Return focus to triggering element
  allowOutsideClick?: boolean; // Allow clicking outside (focus stays trapped)
  escapeDeactivates?: boolean; // Escape key deactivates trap
  onActivate?: () => void;
  onDeactivate?: () => void;
}

function createFocusTrap(
  container: HTMLElement,
  options?: FocusTrapOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Tab wraps from last to first element
- Shift+Tab wraps from first to last element
- Skips disabled elements
- Skips aria-hidden elements
- Skips elements with display:none or visibility:hidden
- Auto-focuses initial element when enabled
- Returns focus on deactivation when enabled
- Escape key deactivates when enabled
- Prevents focus from leaving container

**Accessibility Tests**:
- All focusable elements reachable
- Focus order is logical (DOM order)
- Focus indicator visible at all times
- Works with screen reader virtual cursor (NVDA/JAWS browse mode)

**Performance Tests**:
- Handles containers with 100+ focusable elements
- Efficient focus queries (cache results when possible)

---

### 3. Dismissable Layer

#### Purpose
Detect interactions outside an element (clicks, focus, Escape key) and trigger dismissal callbacks. Essential for dropdowns, popovers, dialogs.

#### WCAG Compliance
- **2.1.2 No Keyboard Trap (Level A)**: Escape key dismisses layer
- **3.2.1 On Focus (Level A)**: Focus changes don't unexpectedly change context
- **3.2.2 On Input (Level A)**: Changing settings doesn't change context

#### Keyboard Interactions

| Key | Action |
|-----|--------|
| **Escape** | Dismiss layer and trigger `onEscapeKeyDown` callback |

#### ARIA Management
- Does not directly set ARIA attributes
- Works with consumer-provided ARIA attributes

#### Screen Reader Support
- Dismissal should not interrupt screen reader announcements
- Consumer responsible for announcing dismissal if needed

#### Outside Interaction Detection
- **Pointer Down**: Click outside element
- **Focus**: Focus moves outside element
- **Escape Key**: Escape key pressed
- **Pointer Events Blocking**: Optionally disable pointer events outside layer using CSS

#### API Design

```typescript
interface DismissableLayerOptions {
  enabled?: boolean;
  disableOutsidePointerEvents?: boolean; // Block clicks outside
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: Event) => void; // Generic outside interaction
  onDismiss?: () => void; // Generic dismissal handler
}

function createDismissableLayer(
  layer: HTMLElement,
  options?: DismissableLayerOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Detects clicks outside element
- Detects focus outside element
- Detects Escape key press
- Blocks pointer events when enabled
- Calls correct callbacks for each interaction type
- Removes event listeners on cleanup

**Accessibility Tests**:
- Escape key always works (even when pointer events disabled)
- Keyboard focus not blocked when pointer events disabled
- Screen reader can access content outside layer (if not modal)

---

### 4. Roving Focus (Roving Tabindex)

#### Purpose
Implement roving tabindex pattern for composite widgets where only one element is in tab sequence, but arrow keys navigate between items. Essential for menus, radio groups, toolbars, tree views.

#### WCAG Compliance
- **2.1.1 Keyboard (Level A)**: Arrow key navigation available
- **2.4.3 Focus Order (Level A)**: Logical focus order with Tab
- **4.1.2 Name, Role, Value (Level A)**: Current item communicated to AT

#### Keyboard Interactions

| Key | Action | Orientation |
|-----|--------|-------------|
| **Arrow Right** | Move focus to next item (wrap if `loop` enabled) | Horizontal, Both |
| **Arrow Left** | Move focus to previous item (wrap if `loop` enabled) | Horizontal, Both |
| **Arrow Down** | Move focus to next item (wrap if `loop` enabled) | Vertical, Both |
| **Arrow Up** | Move focus to previous item (wrap if `loop` enabled) | Vertical, Both |
| **Home** | Move focus to first item | All |
| **End** | Move focus to last item | All |
| **Tab** | Move focus out of group to next tabbable element | All |
| **Shift+Tab** | Move focus out of group to previous tabbable element | All |

#### ARIA Management
- Set `tabindex="0"` on current item
- Set `tabindex="-1"` on all other items
- Update `aria-activedescendant` on container if using that pattern (alternative approach)
- Consumer responsible for `role` attributes (menu, menuitem, radiogroup, radio, etc.)

#### Screen Reader Support
- Focus changes must announce item name and position (e.g., "Option 2 of 5")
- Selected state must be announced if applicable
- Container role must communicate group semantics

#### Focus Management
- Only one item in tab sequence at a time (roving tabindex pattern)
- Arrow keys move focus between items
- Focus wraps to first/last item if `loop` enabled
- Respects RTL text direction for horizontal navigation
- Supports both horizontal, vertical, and both orientations

#### API Design

```typescript
interface RovingFocusOptions {
  enabled?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean; // Wrap to first/last item
  dir?: 'ltr' | 'rtl'; // Text direction for horizontal navigation
  currentIndex?: number; // Index of currently focused item
  onNavigate?: (element: HTMLElement, index: number) => void;
}

function createRovingFocus(
  container: HTMLElement,
  items: HTMLElement[] | (() => HTMLElement[]), // Static array or getter for dynamic items
  options?: RovingFocusOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Arrow keys navigate correctly for each orientation
- Tab moves focus out of group
- Home/End move to first/last item
- Loop wrapping works when enabled
- Only one item has tabindex="0" at a time
- RTL direction reverses horizontal arrow key behavior

**Accessibility Tests**:
- Screen reader announces item position ("2 of 5")
- Screen reader announces selected state
- Container role communicates group semantics
- Tab sequence includes only current item

**Performance Tests**:
- Handles lists with 1000+ items efficiently
- Dynamic item lists update correctly

---

### 5. Portal

#### Purpose
Render content in a different part of the DOM tree (typically `document.body` or a specific portal container) while maintaining logical relationships. Essential for modals, tooltips, dropdowns that need to break out of overflow:hidden containers.

#### WCAG Compliance
- **1.3.2 Meaningful Sequence (Level A)**: Reading order remains logical
- **2.4.3 Focus Order (Level A)**: Focus order remains logical despite DOM repositioning
- **4.1.2 Name, Role, Value (Level A)**: Relationships maintained across DOM tree

#### Keyboard Interactions
N/A - This primitive doesn't handle keyboard interactions directly

#### ARIA Management
- Preserve `aria-labelledby` and `aria-describedby` relationships across DOM tree
- Maintain `aria-owns` relationship from original parent (if needed)
- Consumer responsible for setting appropriate `role`

#### Screen Reader Support
- Screen reader reading order should remain logical
- Relationships (labelledby, describedby) must work across DOM tree
- Live region announcements must work from portal content

#### DOM Management
- Move element to portal container on creation
- Return element to original position on cleanup
- Preserve element state (attributes, event listeners)
- Handle nested portals correctly

#### API Design

```typescript
interface PortalOptions {
  enabled?: boolean;
  container?: HTMLElement; // Default: document.body
  preserveTabOrder?: boolean; // Experimental: use inert to maintain tab order
}

function createPortal(
  element: HTMLElement,
  options?: PortalOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Moves element to portal container
- Returns element to original position on cleanup
- Preserves element attributes
- Handles nested portals
- Works when container doesn't exist yet

**Accessibility Tests**:
- Focus order remains logical
- Screen reader reading order logical
- aria-labelledby/describedby work across portal
- Live regions work from portal content

---

### 6. Keyboard Event Handler

#### Purpose
Provide type-safe, consistent keyboard event handling with common patterns (Enter/Space for activation, Arrow keys for navigation, Escape for dismissal).

#### WCAG Compliance
- **2.1.1 Keyboard (Level A)**: Correct keyboard event handling
- **2.1.4 Character Key Shortcuts (Level A)**: Don't interfere with AT shortcuts

#### Keyboard Interactions
Configurable based on component needs, common patterns:

| Key | Common Action |
|-----|---------------|
| **Enter** | Activate button/link, submit form, select item |
| **Space** | Activate button, toggle checkbox, select item |
| **Escape** | Close dialog, dismiss popup, cancel action |
| **Arrow Keys** | Navigate items, change values |
| **Home/End** | First/last item, min/max value |
| **Page Up/Down** | Large increment/decrement |

#### API Design

```typescript
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

interface KeyboardHandlerOptions {
  enabled?: boolean;
  preventDefault?: boolean; // Prevent default for all handled keys
  stopPropagation?: boolean;
  key: KeyboardEventKey | KeyboardEventKey[];
  handler: (event: KeyboardEvent) => void;
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
}

function createKeyboardHandler(
  element: HTMLElement,
  options: KeyboardHandlerOptions
): CleanupFunction;

// Convenience function for common patterns
function createActivationHandler(
  element: HTMLElement,
  onActivate: (event: KeyboardEvent) => void
): CleanupFunction; // Handles Enter and Space

function createDismissalHandler(
  element: HTMLElement,
  onDismiss: (event: KeyboardEvent) => void
): CleanupFunction; // Handles Escape
```

#### Testing Requirements

**Unit Tests**:
- Calls handler for correct key
- Respects modifier key requirements
- Prevents default when enabled
- Stops propagation when enabled
- Handles multiple keys in array

**Accessibility Tests**:
- Doesn't interfere with screen reader shortcuts
- Works in both browse and focus modes

---

### 7. ARIA Attribute Manager

#### Purpose
Safely set, update, and remove ARIA attributes with type safety and validation.

#### WCAG Compliance
- **4.1.2 Name, Role, Value (Level A)**: Correct ARIA usage
- Follows ARIA specification for valid attribute values

#### ARIA Attributes Supported

**Widget Attributes**:
- `aria-autocomplete`: 'none' | 'inline' | 'list' | 'both'
- `aria-checked`: boolean | 'mixed'
- `aria-disabled`: boolean
- `aria-expanded`: boolean
- `aria-haspopup`: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
- `aria-hidden`: boolean
- `aria-invalid`: boolean | 'grammar' | 'spelling'
- `aria-label`: string
- `aria-level`: number
- `aria-modal`: boolean
- `aria-multiline`: boolean
- `aria-multiselectable`: boolean
- `aria-orientation`: 'horizontal' | 'vertical'
- `aria-placeholder`: string
- `aria-pressed`: boolean | 'mixed'
- `aria-readonly`: boolean
- `aria-required`: boolean
- `aria-selected`: boolean
- `aria-sort`: 'none' | 'ascending' | 'descending' | 'other'
- `aria-valuemax`: number
- `aria-valuemin`: number
- `aria-valuenow`: number
- `aria-valuetext`: string

**Live Region Attributes**:
- `aria-atomic`: boolean
- `aria-busy`: boolean
- `aria-live`: 'off' | 'polite' | 'assertive'
- `aria-relevant`: 'additions' | 'removals' | 'text' | 'all'

**Relationship Attributes**:
- `aria-activedescendant`: string (ID reference)
- `aria-controls`: string (ID reference)
- `aria-describedby`: string (ID reference)
- `aria-details`: string (ID reference)
- `aria-errormessage`: string (ID reference)
- `aria-flowto`: string (ID reference)
- `aria-labelledby`: string (ID reference)
- `aria-owns`: string (ID reference)
- `aria-posinset`: number
- `aria-setsize`: number

#### API Design

```typescript
interface AriaAttributes {
  // Full type definition from PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md
}

interface AriaOptions {
  validate?: boolean; // Validate values against ARIA spec
  warn?: boolean; // Log warnings for invalid values
}

function setAriaAttributes(
  element: HTMLElement,
  attributes: Partial<AriaAttributes>,
  options?: AriaOptions
): CleanupFunction; // Cleanup restores original values

function updateAriaAttribute<K extends keyof AriaAttributes>(
  element: HTMLElement,
  attribute: K,
  value: AriaAttributes[K]
): void;

function removeAriaAttributes(
  element: HTMLElement,
  attributes: (keyof AriaAttributes)[]
): void;

function getAriaAttribute<K extends keyof AriaAttributes>(
  element: HTMLElement,
  attribute: K
): AriaAttributes[K] | undefined;
```

#### Testing Requirements

**Unit Tests**:
- Sets attributes with correct string values
- Converts boolean to "true"/"false" strings
- Converts number to string
- Validates attribute values when enabled
- Restores original values on cleanup
- Warns for invalid values

**Accessibility Tests**:
- Screen reader announces attributes correctly
- Invalid ARIA generates validation errors
- All ARIA 1.2 attributes supported

---

### 8. Screen Reader Announcer

#### Purpose
Make polite or assertive announcements to screen readers without visual changes. Essential for status messages, validation feedback, dynamic updates.

#### WCAG Compliance
- **4.1.3 Status Messages (Level AA)**: Status messages communicated to AT
- **1.3.1 Info and Relationships (Level A)**: Relationships conveyed programmatically

#### Live Region Types

| Type | ARIA Live | Use Cases |
|------|-----------|-----------|
| **Polite** | `polite` | Success messages, search results, loading indicators, non-urgent updates |
| **Assertive** | `assertive` | Error messages, time-sensitive alerts, security warnings, connection status |
| **Off** | `off` | No announcements (use for hiding live region) |

#### Screen Reader Support
- Must work with NVDA, JAWS, VoiceOver, TalkBack
- Announcements should not be duplicated
- Empty container on page load (only dynamic updates announced)
- Brief, concise messages

#### API Design

```typescript
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

interface AnnouncerOptions {
  politeness?: LiveRegionPoliteness;
  clearAfterAnnounce?: boolean; // Clear message after timeout (prevents re-announcement on page refresh)
  clearTimeout?: number; // Default: 1000ms
  role?: 'status' | 'alert' | 'log'; // ARIA role for live region
}

function createAnnouncer(
  options?: AnnouncerOptions
): {
  announce: (message: string) => void;
  clear: () => void;
  destroy: CleanupFunction;
};

// Convenience function
function announceToScreenReader(
  message: string,
  politeness?: LiveRegionPoliteness
): void;
```

#### Testing Requirements

**Unit Tests**:
- Creates live region in DOM
- Sets correct aria-live value
- Updates message content
- Clears message after timeout
- Removes live region on cleanup

**Accessibility Tests** (requires Playwright):
- NVDA announces polite messages when idle
- JAWS announces assertive messages immediately
- VoiceOver on iOS announces messages
- Messages not announced on page load
- No duplicate announcements

---

### 9. Focus Visible Manager

#### Purpose
Manage `:focus-visible` behavior and ensure keyboard focus is always visible while avoiding mouse focus indicators. Ensures WCAG 2.4.7 and 2.4.11-13 compliance.

#### WCAG Compliance
- **2.4.7 Focus Visible (Level AA)**: Keyboard focus indicator visible
- **2.4.11 Focus Not Obscured (Minimum) (Level AA)**: Focus not fully hidden
- **2.4.12 Focus Not Obscured (Enhanced) (Level AAA)**: No part of focus hidden
- **2.4.13 Focus Appearance (Level AAA)**: Focus meets size and contrast requirements

#### Focus Indicator Requirements (WCAG 2.4.13)
- **Minimum size**: Focus indicator change of color must have at least 2 CSS pixels thickness
- **Contrast**: 3:1 contrast ratio between focused and unfocused states
- **Visibility**: Must not be fully obscured by author-created content

#### Behavior
- Keyboard navigation: Show focus indicator
- Mouse clicks: Hide focus indicator (`:focus-visible` behavior)
- Programmatic focus: Show focus indicator by default

#### API Design

```typescript
interface FocusVisibleOptions {
  enabled?: boolean;
  polyfill?: boolean; // Add :focus-visible polyfill for older browsers
  className?: string; // Class to add when focus is visible (default: 'focus-visible')
}

function createFocusVisibleManager(
  options?: FocusVisibleOptions
): CleanupFunction;

// Convenience function for single element
function trackFocusVisible(
  element: HTMLElement,
  options?: FocusVisibleOptions
): CleanupFunction;
```

#### Testing Requirements

**Unit Tests**:
- Adds className on keyboard navigation
- Removes className on mouse click
- Works with Tab, Shift+Tab
- Works with programmatic focus

**Accessibility Tests**:
- Focus indicator visible for keyboard navigation
- Focus indicator hidden for mouse clicks
- Focus indicator meets 2.4.13 requirements (size, contrast)

---

### 10. ID Reference Manager

#### Purpose
Generate and manage unique IDs for ARIA relationships (`aria-labelledby`, `aria-describedby`, `aria-controls`, `aria-owns`). Prevent ID collisions in complex apps.

#### WCAG Compliance
- **4.1.2 Name, Role, Value (Level A)**: Correct ID references for relationships
- **1.3.1 Info and Relationships (Level A)**: Relationships conveyed programmatically

#### API Design

```typescript
type UniqueId = string & { __brand: 'UniqueId' };

function generateId(prefix?: string): UniqueId;

interface IdRefOptions {
  element: HTMLElement;
  labelledBy?: HTMLElement | HTMLElement[];
  describedBy?: HTMLElement | HTMLElement[];
  controls?: HTMLElement | HTMLElement[];
  owns?: HTMLElement | HTMLElement[];
}

function createIdReferences(
  options: IdRefOptions
): CleanupFunction; // Cleanup removes generated IDs

function ensureId(element: HTMLElement, prefix?: string): UniqueId;
```

#### Testing Requirements

**Unit Tests**:
- Generates unique IDs with prefix
- Sets aria-labelledby with single reference
- Sets aria-labelledby with multiple references (space-separated)
- Sets aria-describedby correctly
- Sets aria-controls correctly
- Removes IDs on cleanup
- Doesn't remove user-provided IDs

**Accessibility Tests**:
- Screen reader finds label via aria-labelledby
- Screen reader finds description via aria-describedby
- aria-controls relationship works

---

## Testing Requirements

### Test File Organization

Each primitive requires **three test files**:

1. **Unit Tests**: `test/primitives/[name].test.ts`
   - DOM manipulation
   - Event handling
   - Cleanup behavior
   - SSR safety

2. **Accessibility Tests**: `test/primitives/[name].a11y.ts`
   - WCAG compliance verification
   - ARIA attribute correctness
   - Screen reader compatibility
   - Keyboard navigation

3. **Integration Tests**: `test/integration/[name].spec.ts`
   - Interaction with other primitives
   - Real-world usage scenarios
   - Framework wrapper compatibility

### Test Coverage Requirements

- **Minimum Coverage**: 90% line coverage, 85% branch coverage
- **Critical Paths**: 100% coverage for keyboard handling and ARIA management
- **Edge Cases**: All error conditions tested
- **SSR**: All primitives tested in non-DOM environment

### Accessibility Testing Tools

**Automated**:
- **axe-core**: WCAG compliance checking via `@axe-core/playwright`
- **ARIA validator**: Custom validator for ARIA attribute correctness

**Manual** (documented test cases):
- **NVDA** (Windows): Screen reader announcements
- **JAWS** (Windows): Screen reader announcements
- **VoiceOver** (macOS/iOS): Screen reader announcements
- **TalkBack** (Android): Screen reader announcements

### Continuous Integration

All tests must pass in CI before merge:

```yaml
# .github/workflows/primitives-tests.yml
- pnpm --filter=primitives test:unit
- pnpm --filter=primitives test:a11y
- pnpm --filter=primitives test:integration
```

---

## GitHub Issue Templates

### Template 1: Slot Primitive

```markdown
# feat: implement Slot vanilla TS primitive

## Purpose
Enable the `asChild` pattern by merging props, event handlers, and ARIA attributes from a child element onto a parent container. This is foundational for shadcn-style component composition.

## Accessibility Standards
- **WCAG 4.1.2 Name, Role, Value (Level A)**: Preserve accessible name and role during prop merging
- **Section 508 502.3.1**: Maintain programmatically determinable object information

## Scope
Implement a stateless vanilla TypeScript function that:
- Merges ARIA attributes from child to parent
- Merges event handlers without breaking delegation
- Merges className using tailwind-merge
- Merges inline styles
- Returns cleanup function that restores original state
- Works in SSR environments

## API Design

```typescript
interface SlotOptions {
  enabled?: boolean;
  mergeProps?: boolean;
  mergeClassName?: boolean;
  mergeStyle?: boolean;
  mergeEventHandlers?: boolean;
}

function createSlot(
  container: HTMLElement,
  slottedChild: Element | undefined,
  options?: SlotOptions
): CleanupFunction;
```

## Implementation Requirements
1. Merge ARIA attributes (aria-*)
2. Merge data attributes (data-*)
3. Merge role attribute
4. Handle conflicting id attributes (generate unique IDs)
5. Merge event handlers for: click, keydown, keyup, focus, blur
6. Use tailwind-merge for className merging
7. Restore original state on cleanup
8. SSR-safe (check DOM availability)

## Testing Acceptance Criteria

### Unit Tests (`test/primitives/slot.test.ts`)
- [ ] Merges ARIA attributes from child to parent
- [ ] Preserves original attributes on cleanup
- [ ] Handles conflicting id attributes
- [ ] Merges event handlers correctly
- [ ] Combines className using tailwind-merge
- [ ] Merges inline styles
- [ ] Returns no-op cleanup when disabled
- [ ] Works in SSR environment (no DOM)

### Accessibility Tests (`test/primitives/slot.a11y.ts`)
- [ ] Screen reader announces merged accessible name
- [ ] Role is correctly communicated to AT
- [ ] aria-labelledby relationship maintained
- [ ] aria-describedby relationship maintained
- [ ] Event handlers work with keyboard navigation

### Integration Tests (`test/integration/slot.spec.ts`)
- [ ] Works with Button component
- [ ] Works with Link component
- [ ] Handles nested slots
- [ ] Compatible with React wrapper

## Documentation
- [ ] JSDoc comments with examples
- [ ] ARIA APG pattern reference (N/A for Slot)
- [ ] WCAG success criteria links
- [ ] Usage examples with vanilla JS, React, Vue

## Dependencies
- `tailwind-merge` for className merging (install as dependency)
- DOM type guards from `utils/dom.ts`

## Related Issues
Part of #[parent-issue] - Accessibility Primitives System

## Acceptance Checklist
- [ ] Implementation complete
- [ ] All tests passing (90%+ coverage)
- [ ] Documentation complete
- [ ] Reviewed by accessibility auditor
- [ ] Ready for registry distribution
```

---

### Template 2: Focus Trap Primitive

```markdown
# feat: implement Focus Trap vanilla TS primitive

## Purpose
Trap keyboard focus within a container, preventing Tab/Shift+Tab from moving focus outside. Essential for modal dialogs and meeting WCAG 2.1.2 No Keyboard Trap.

## Accessibility Standards
- **WCAG 2.1.1 Keyboard (Level A)**: Tab/Shift+Tab work correctly
- **WCAG 2.1.2 No Keyboard Trap (Level A)**: Escape key always allows exiting trap
- **WCAG 2.4.3 Focus Order (Level A)**: Logical focus order maintained
- **WCAG 2.4.7 Focus Visible (Level AA)**: Focus indicator visible at all times
- **WCAG 2.4.11 Focus Not Obscured (Minimum) (Level AA)**: Focused element not fully hidden
- **Section 508 502.3.3**: Focus can be programmatically determined
- **ARIA APG**: [Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Scope
Implement a stateless vanilla TypeScript function that:
- Traps Tab/Shift+Tab within container
- Auto-focuses initial element
- Wraps focus from last to first (and vice versa)
- Handles Escape to deactivate
- Returns focus to triggering element
- Skips disabled and hidden elements

## API Design

```typescript
interface FocusTrapOptions {
  enabled?: boolean;
  autoFocus?: boolean;
  initialFocusElement?: HTMLElement;
  returnFocusOnDeactivate?: boolean;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

function createFocusTrap(
  container: HTMLElement,
  options?: FocusTrapOptions
): CleanupFunction;
```

## Keyboard Interactions
| Key | Action |
|-----|--------|
| **Tab** | Move focus to next focusable element; wrap to first element when at last |
| **Shift+Tab** | Move focus to previous focusable element; wrap to last element when at first |
| **Escape** | Deactivate trap and restore focus (if escapeDeactivates enabled) |

## Implementation Requirements
1. Query focusable elements: `a[href]`, `button:not([disabled])`, `input:not([disabled])`, `select:not([disabled])`, `textarea:not([disabled])`, `[tabindex]:not([tabindex="-1"])`
2. Skip elements with `display: none`, `visibility: hidden`, `aria-hidden="true"`
3. Handle Tab key to move to next element, wrap at end
4. Handle Shift+Tab to move to previous element, wrap at start
5. Prevent focus from leaving container (focusin listener on document)
6. Auto-focus initial element on activation
7. Return focus to previously focused element on deactivation
8. Handle Escape key to deactivate (if enabled)
9. Efficient focus queries (cache focusable elements)

## Testing Acceptance Criteria

### Unit Tests (`test/primitives/focus-trap.test.ts`)
- [ ] Tab wraps from last to first element
- [ ] Shift+Tab wraps from first to last element
- [ ] Skips disabled elements
- [ ] Skips aria-hidden elements
- [ ] Skips elements with display:none
- [ ] Auto-focuses initial element when enabled
- [ ] Returns focus on deactivation when enabled
- [ ] Escape key deactivates when enabled
- [ ] Prevents focus from leaving container
- [ ] Works with 100+ focusable elements (performance)

### Accessibility Tests (`test/primitives/focus-trap.a11y.ts`)
- [ ] All focusable elements reachable via Tab
- [ ] Focus order is logical (DOM order)
- [ ] Focus indicator visible at all times
- [ ] Works with NVDA browse mode
- [ ] Works with JAWS virtual cursor
- [ ] Escape key always allows exiting (WCAG 2.1.2)
- [ ] No axe-core violations

### Integration Tests (`test/integration/focus-trap.spec.ts`)
- [ ] Works with Dialog component
- [ ] Works with dismissable layer primitive
- [ ] Compatible with React wrapper (useFocusTrap hook)
- [ ] Compatible with Vue directive

## Documentation
- [ ] JSDoc comments with examples
- [ ] Link to ARIA Dialog Modal pattern
- [ ] WCAG success criteria links (2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11)
- [ ] Usage examples with vanilla JS, React, Vue

## Dependencies
- Focus utilities from `utils/focus.ts` (getFocusableElements, getActiveElement)
- Event utilities from `utils/events.ts` (addEventListenerSafe, createCleanupGroup)
- DOM utilities from `utils/dom.ts` (isDOMAvailable)

## Related Issues
Part of #[parent-issue] - Accessibility Primitives System

## Acceptance Checklist
- [ ] Implementation complete
- [ ] All tests passing (90%+ coverage)
- [ ] Documentation complete
- [ ] Reviewed by accessibility auditor
- [ ] Tested with NVDA and VoiceOver
- [ ] Ready for registry distribution
```

---

### Template 3: Roving Focus Primitive

```markdown
# feat: implement Roving Focus vanilla TS primitive

## Purpose
Implement roving tabindex pattern where only one element is in tab sequence, but arrow keys navigate between items. Essential for menus, radio groups, toolbars, tree views.

## Accessibility Standards
- **WCAG 2.1.1 Keyboard (Level A)**: Arrow key navigation available
- **WCAG 2.4.3 Focus Order (Level A)**: Logical focus order with Tab
- **WCAG 4.1.2 Name, Role, Value (Level A)**: Current item communicated to AT
- **Section 508 502.3.3**: Focus can be programmatically determined
- **ARIA APG**: [Menubar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/), [Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), [Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

## Scope
Implement a stateless vanilla TypeScript function that:
- Maintains roving tabindex (only current item has tabindex="0")
- Handles arrow key navigation (respects orientation)
- Supports horizontal, vertical, and both orientations
- Wraps to first/last item when loop enabled
- Respects RTL text direction
- Handles Home/End keys

## API Design

```typescript
interface RovingFocusOptions {
  enabled?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  dir?: 'ltr' | 'rtl';
  currentIndex?: number;
  onNavigate?: (element: HTMLElement, index: number) => void;
}

function createRovingFocus(
  container: HTMLElement,
  items: HTMLElement[] | (() => HTMLElement[]),
  options?: RovingFocusOptions
): CleanupFunction;
```

## Keyboard Interactions
| Key | Action | Orientation |
|-----|--------|-------------|
| **Arrow Right** | Next item (wrap if loop) | Horizontal, Both |
| **Arrow Left** | Previous item (wrap if loop) | Horizontal, Both |
| **Arrow Down** | Next item (wrap if loop) | Vertical, Both |
| **Arrow Up** | Previous item (wrap if loop) | Vertical, Both |
| **Home** | First item | All |
| **End** | Last item | All |
| **Tab** | Out of group | All |

## Implementation Requirements
1. Set tabindex="0" on current item, tabindex="-1" on all others
2. Handle arrow keys based on orientation
3. Reverse Left/Right behavior for RTL
4. Wrap to first/last item when loop enabled
5. Handle Home/End keys
6. Allow Tab to move out of group
7. Support dynamic item lists (function getter)
8. Call onNavigate callback when focus moves

## Testing Acceptance Criteria

### Unit Tests (`test/primitives/roving-focus.test.ts`)
- [ ] Arrow keys navigate correctly for horizontal orientation
- [ ] Arrow keys navigate correctly for vertical orientation
- [ ] Arrow keys navigate correctly for both orientation
- [ ] Tab moves focus out of group
- [ ] Home/End move to first/last item
- [ ] Loop wrapping works when enabled
- [ ] Only one item has tabindex="0" at a time
- [ ] RTL direction reverses horizontal arrow keys
- [ ] Dynamic item lists update correctly
- [ ] onNavigate callback called with correct element and index

### Accessibility Tests (`test/primitives/roving-focus.a11y.ts`)
- [ ] Screen reader announces item position (aria-posinset/aria-setsize)
- [ ] Container role communicates group semantics
- [ ] Tab sequence includes only current item
- [ ] Works with NVDA in forms mode
- [ ] Works with JAWS in forms mode
- [ ] No axe-core violations

### Integration Tests (`test/integration/roving-focus.spec.ts`)
- [ ] Works with Menu component
- [ ] Works with RadioGroup component
- [ ] Works with Toolbar component
- [ ] Compatible with React wrapper
- [ ] Handles 1000+ item lists efficiently

## Documentation
- [ ] JSDoc comments with examples
- [ ] Link to ARIA Menubar, Radio Group, Toolbar patterns
- [ ] WCAG success criteria links (2.1.1, 2.4.3, 4.1.2)
- [ ] Usage examples with vanilla JS, React, Vue

## Dependencies
- Keyboard utilities from `utils/keyboard.ts`
- Event utilities from `utils/events.ts`
- DOM utilities from `utils/dom.ts`

## Related Issues
Part of #[parent-issue] - Accessibility Primitives System

## Acceptance Checklist
- [ ] Implementation complete
- [ ] All tests passing (90%+ coverage)
- [ ] Documentation complete
- [ ] Reviewed by accessibility auditor
- [ ] Tested with NVDA and JAWS
- [ ] Ready for registry distribution
```

---

### Template 4: Screen Reader Announcer Primitive

```markdown
# feat: implement Screen Reader Announcer vanilla TS primitive

## Purpose
Make polite or assertive announcements to screen readers without visual changes. Essential for status messages, validation feedback, dynamic updates to meet WCAG 4.1.3.

## Accessibility Standards
- **WCAG 4.1.3 Status Messages (Level AA)**: Status messages communicated to AT
- **WCAG 1.3.1 Info and Relationships (Level A)**: Relationships conveyed programmatically
- **Section 508 502.3.1**: Programmatically determinable status
- **ARIA**: [Live Region Roles](https://www.w3.org/TR/wai-aria-1.2/#live_region_roles)

## Scope
Implement a stateless vanilla TypeScript function that:
- Creates ARIA live regions (polite or assertive)
- Announces messages to screen readers
- Clears messages after timeout
- Works with NVDA, JAWS, VoiceOver, TalkBack
- Prevents duplicate announcements

## API Design

```typescript
type LiveRegionPoliteness = 'polite' | 'assertive' | 'off';

interface AnnouncerOptions {
  politeness?: LiveRegionPoliteness;
  clearAfterAnnounce?: boolean;
  clearTimeout?: number; // Default: 1000ms
  role?: 'status' | 'alert' | 'log';
}

function createAnnouncer(
  options?: AnnouncerOptions
): {
  announce: (message: string) => void;
  clear: () => void;
  destroy: CleanupFunction;
};

function announceToScreenReader(
  message: string,
  politeness?: LiveRegionPoliteness
): void;
```

## Live Region Behavior
| Politeness | ARIA Live | Use Cases |
|------------|-----------|-----------|
| **Polite** | `polite` | Success messages, search results, loading indicators |
| **Assertive** | `assertive` | Error messages, time-sensitive alerts, security warnings |
| **Off** | `off` | No announcements |

## Implementation Requirements
1. Create live region container in document.body
2. Set aria-live attribute based on politeness
3. Set appropriate role (status, alert, or log)
4. Keep container empty on page load (only dynamic updates announced)
5. Update text content to announce message
6. Clear message after timeout (prevents re-announcement on refresh)
7. Remove live region on destroy
8. Prevent duplicate live regions

## Testing Acceptance Criteria

### Unit Tests (`test/primitives/announcer.test.ts`)
- [ ] Creates live region in DOM
- [ ] Sets correct aria-live value
- [ ] Sets correct role attribute
- [ ] Updates message content
- [ ] Clears message after timeout
- [ ] Removes live region on destroy
- [ ] Prevents duplicate live regions

### Accessibility Tests (`test/primitives/announcer.a11y.ts`)
- [ ] NVDA announces polite messages when idle
- [ ] NVDA announces assertive messages immediately
- [ ] JAWS announces polite messages
- [ ] JAWS announces assertive messages
- [ ] VoiceOver on macOS announces messages
- [ ] VoiceOver on iOS announces messages
- [ ] Messages not announced on page load
- [ ] No duplicate announcements
- [ ] No axe-core violations

### Integration Tests (`test/integration/announcer.spec.ts`)
- [ ] Works with form validation feedback
- [ ] Works with loading states
- [ ] Works with search results updates
- [ ] Compatible with React wrapper

## Documentation
- [ ] JSDoc comments with examples
- [ ] Link to ARIA Live Region specification
- [ ] WCAG success criteria links (4.1.3, 1.3.1)
- [ ] Best practices for polite vs assertive
- [ ] Usage examples with vanilla JS, React, Vue

## Dependencies
- DOM utilities from `utils/dom.ts`

## Manual Testing Checklist
- [ ] Test with NVDA on Windows
- [ ] Test with JAWS on Windows
- [ ] Test with VoiceOver on macOS
- [ ] Test with VoiceOver on iOS
- [ ] Test with TalkBack on Android

## Related Issues
Part of #[parent-issue] - Accessibility Primitives System

## Acceptance Checklist
- [ ] Implementation complete
- [ ] All tests passing (90%+ coverage)
- [ ] Documentation complete
- [ ] Reviewed by accessibility auditor
- [ ] Manual testing complete (NVDA, JAWS, VoiceOver)
- [ ] Ready for registry distribution
```

---

## Summary

This requirements document provides comprehensive specifications for vanilla TypeScript accessibility primitives that enable WCAG 2.2 AAA-compliant, Section 508-compliant shadcn-style components in the Rafters design system.

### Primitive Priorities

**Phase 1 (Critical)**: Required for basic component compliance
1. Focus Trap (for dialogs)
2. Dismissable Layer (for dropdowns, popovers)
3. Keyboard Event Handler (for all interactive components)
4. ARIA Attribute Manager (for all components)

**Phase 2 (High Priority)**: Required for complex components
5. Roving Focus (for menus, radio groups)
6. Screen Reader Announcer (for status messages)
7. Slot (for asChild pattern)
8. ID Reference Manager (for ARIA relationships)

**Phase 3 (Medium Priority)**: Enhanced functionality
9. Portal (for modals, tooltips)
10. Focus Visible Manager (for enhanced focus indicators)

### Compliance Checklist

All primitives must:
- ✅ Meet WCAG 2.2 Level AAA where applicable
- ✅ Meet Section 508 revised 2017 requirements
- ✅ Follow W3C ARIA Authoring Practices Guide patterns
- ✅ Work with NVDA, JAWS, VoiceOver, TalkBack
- ✅ Pass axe-core automated tests
- ✅ Include comprehensive unit, accessibility, and integration tests
- ✅ Document WCAG success criteria and ARIA patterns
- ✅ Support SSR environments (Cloudflare Workers)

---

**Document Version**: 1.0.0
**Next Review**: After Phase 1 primitives implemented
**Maintainer**: Rafters Accessibility Team
