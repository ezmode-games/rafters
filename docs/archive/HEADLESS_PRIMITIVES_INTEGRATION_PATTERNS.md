# Headless Primitives Integration Patterns

**Status**: Architecture Design
**Version**: 1.0.0
**Last Updated**: 2025-11-03
**Target**: Framework adapters for 8 core accessibility primitives

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [The 8 Headless Primitives](#the-8-headless-primitives)
4. [Primitive Dependencies](#primitive-dependencies)
5. [Integration Patterns by Framework](#integration-patterns-by-framework)
6. [Event Handler Merging Strategy](#event-handler-merging-strategy)
7. [Framework Adapter Responsibilities](#framework-adapter-responsibilities)
8. [Common Mistakes and Anti-Patterns](#common-mistakes-and-anti-patterns)
9. [Concrete Examples](#concrete-examples)
10. [Testing Integration Patterns](#testing-integration-patterns)

---

## Overview

This document defines how vanilla TypeScript headless primitives integrate with framework-specific components (React, Vue, Svelte, vanilla JS). The goal is to provide **drop-in replacements** for shadcn/ui components while maintaining framework-agnostic primitives.

### Design Goals

1. **Primitives**: Vanilla TS, zero framework dependencies, stateless
2. **Adapters**: Framework-specific wrappers that handle state and lifecycle
3. **Components**: Shadcn-compatible React/Vue/Svelte components using adapters
4. **Registry delivery**: Users copy source files via `rafters add component`

### Critical Constraint: Event Handler Merging

**IMPOSSIBLE in vanilla JS**: There is no DOM API to enumerate existing event listeners on an element. This means:

- ✅ **React**: Can merge event handlers via props (`onClick={composeEventHandlers(childOnClick, parentOnClick)}`)
- ✅ **Vue**: Can merge event handlers via directives (`v-on:click="[childHandler, parentHandler]"`)
- ✅ **Svelte**: Can merge via component composition
- ❌ **Vanilla JS**: Cannot enumerate listeners, can only add new ones

**Solution**: Event handler merging happens **in framework adapters**, not in vanilla primitives.

---

## Core Principles

### 1. Primitives Are Stateless

Primitives never manage state. They accept current state as input and return cleanup functions.

```typescript
// BAD: Primitive manages state
function createModal(element: HTMLElement) {
  let isOpen = false; // ❌ Internal state
  return {
    open: () => { isOpen = true; },
    close: () => { isOpen = false; }
  };
}

// GOOD: Consumer manages state
function createModal(element: HTMLElement, isOpen: boolean) {
  // ✅ Primitive receives state as input
  if (isOpen) {
    element.showModal();
  } else {
    element.close();
  }
  return () => element.close(); // Cleanup
}
```

### 2. Primitives Return Cleanup Functions

All primitives return a cleanup function that removes event listeners and resets DOM state.

```typescript
type CleanupFunction = () => void;

function primitive(element: HTMLElement): CleanupFunction {
  const handler = (e: Event) => console.log(e);
  element.addEventListener('click', handler);

  return () => {
    element.removeEventListener('click', handler);
  };
}
```

### 3. Primitives Are SSR-Safe

Primitives check for DOM availability before manipulating elements.

```typescript
function isDOMAvailable(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function primitive(element: HTMLElement): CleanupFunction {
  if (!isDOMAvailable()) {
    return () => {}; // No-op cleanup
  }
  // Safe to use DOM APIs
}
```

### 4. Framework Adapters Handle Event Merging

Event handler merging is **impossible in vanilla JS** (no API to enumerate listeners), so adapters handle it:

- **React**: Compose event handlers in JSX props
- **Vue**: Use `v-on` with array of handlers
- **Svelte**: Use event forwarding and composition
- **Vanilla JS**: No merging, only sequential addition

---

## The 8 Headless Primitives

### 1. Slot (Prop Merging)

**Purpose**: Enable the `asChild` pattern by merging props from parent to child.

**API**:
```typescript
interface SlotOptions {
  mergeClassName?: boolean;
  mergeStyle?: boolean;
  mergeDataAttributes?: boolean;
  mergeAriaAttributes?: boolean;
}

function createSlot(
  container: HTMLElement,
  slottedChild: Element | undefined,
  options?: SlotOptions
): CleanupFunction;
```

**Key Features**:
- Merges `aria-*` and `data-*` attributes
- Merges `className` using `tailwind-merge`
- Merges inline styles
- **Does NOT merge event handlers** (adapter responsibility)
- Returns cleanup that restores original attributes

**Dependencies**: None (foundational primitive)

---

### 2. Modal (Dialog Management)

**Purpose**: Manage modal dialogs with focus trap, backdrop, and escape handling.

**API**:
```typescript
interface ModalOptions {
  open: boolean;
  modal?: boolean; // true = modal, false = non-modal
  trapFocus?: boolean;
  restoreFocus?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function createModal(
  element: HTMLDialogElement,
  options: ModalOptions
): CleanupFunction;
```

**Key Features**:
- Uses native `<dialog>` element
- Handles `showModal()` vs `show()` based on `modal` option
- Sets `aria-modal="true"` for modals
- Manages backdrop clicks
- Handles Escape key

**Dependencies**:
- `focus` (for focus trap)
- `escape-handler` (for Escape key)
- `keyboard` (for keyboard events)

---

### 3. Keyboard (Key Event Handler)

**Purpose**: Type-safe keyboard event handling with common patterns.

**API**:
```typescript
type KeyCode =
  | 'Enter' | 'Space' | 'Escape' | 'Tab'
  | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  | 'Home' | 'End' | 'PageUp' | 'PageDown';

interface KeyboardOptions {
  key: KeyCode | KeyCode[];
  modifiers?: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  preventDefault?: boolean;
  stopPropagation?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
}

function createKeyboardHandler(
  element: HTMLElement,
  options: KeyboardOptions
): CleanupFunction;

// Convenience functions
function onEnterOrSpace(
  element: HTMLElement,
  handler: (event: KeyboardEvent) => void
): CleanupFunction;

function onEscape(
  element: HTMLElement,
  handler: (event: KeyboardEvent) => void
): CleanupFunction;
```

**Key Features**:
- Type-safe key codes
- Modifier key support
- Automatic preventDefault/stopPropagation
- Convenience functions for common patterns

**Dependencies**: None (foundational primitive)

---

### 4. Escape Handler (Dismiss on Escape)

**Purpose**: Close overlays/menus when Escape is pressed.

**API**:
```typescript
interface EscapeOptions {
  enabled?: boolean;
  onEscape: (event: KeyboardEvent) => void;
}

function createEscapeHandler(
  element: HTMLElement,
  options: EscapeOptions
): CleanupFunction;
```

**Key Features**:
- Listens for Escape key globally
- Only triggers if element or descendant has focus
- Respects nested escape handlers (event delegation)

**Dependencies**:
- `keyboard` (uses keyboard handler internally)

---

### 5. ARIA (Attribute Manager)

**Purpose**: Type-safe ARIA attribute management.

**API**:
```typescript
interface AriaAttributes {
  // Widget Attributes
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-modal'?: boolean;
  'aria-pressed'?: boolean | 'mixed';
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';

  // Live Region Attributes
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';

  // Relationship Attributes
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-activedescendant'?: string;

  // Role
  'role'?: string;
}

function setAriaAttributes(
  element: HTMLElement,
  attributes: Partial<AriaAttributes>
): CleanupFunction; // Restores original values

function updateAriaAttribute<K extends keyof AriaAttributes>(
  element: HTMLElement,
  attribute: K,
  value: AriaAttributes[K]
): void;
```

**Key Features**:
- Type-safe attribute values
- Automatic boolean to string conversion (`true` → `"true"`)
- Cleanup restores original attributes
- Validates attribute values in development mode

**Dependencies**: None (foundational primitive)

---

### 6. Screen Reader Manager (Live Regions)

**Purpose**: Make announcements to screen readers without visual changes.

**API**:
```typescript
type Politeness = 'polite' | 'assertive' | 'off';

interface AnnouncerOptions {
  politeness?: Politeness;
  role?: 'status' | 'alert' | 'log';
  clearAfterAnnounce?: boolean;
  clearTimeout?: number; // ms
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
  politeness?: Politeness
): void;
```

**Key Features**:
- Creates ARIA live region in document.body
- Polite vs assertive announcements
- Auto-clear to prevent re-announcement on refresh
- Singleton pattern (one live region per politeness level)

**Dependencies**:
- `aria` (sets ARIA live attributes)

---

### 7. Resize (Element Resize Observer)

**Purpose**: Detect element size changes (for responsive components).

**API**:
```typescript
interface ResizeOptions {
  onResize: (entry: ResizeObserverEntry) => void;
  debounce?: number; // ms
}

function createResizeObserver(
  element: HTMLElement,
  options: ResizeOptions
): CleanupFunction;
```

**Key Features**:
- Uses native `ResizeObserver`
- Optional debouncing
- Polyfill detection for older browsers

**Dependencies**: None (foundational primitive)

---

### 8. Focus (Focus Management)

**Purpose**: Focus trap, roving tabindex, and focus utilities.

**API**:
```typescript
// Focus Trap
interface FocusTrapOptions {
  enabled?: boolean;
  autoFocus?: boolean;
  initialFocus?: HTMLElement | 'first' | 'last';
  restoreFocus?: boolean;
  allowOutsideClick?: boolean;
}

function createFocusTrap(
  container: HTMLElement,
  options?: FocusTrapOptions
): CleanupFunction;

// Roving Tabindex
interface RovingFocusOptions {
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

// Utilities
function getFocusableElements(container: HTMLElement): HTMLElement[];
function getActiveElement(): Element | undefined;
function focusElement(element: HTMLElement | undefined): void;
```

**Key Features**:
- Focus trap for modals (Tab wraps around)
- Roving tabindex for menus/lists (Arrow keys navigate)
- Respects `disabled`, `aria-disabled`, `aria-hidden`, `inert`
- Handles Home/End keys

**Dependencies**:
- `keyboard` (for Tab/Arrow key handling)
- `aria` (sets `tabindex` attributes)

---

## Primitive Dependencies

### Dependency Graph

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
└─ modal (uses focus, escape-handler, keyboard)
```

### Dependency Matrix

| Primitive | Dependencies |
|-----------|-------------|
| slot | None |
| keyboard | None |
| aria | None |
| resize | None |
| escape-handler | keyboard |
| sr-manager | aria |
| focus | keyboard, aria |
| modal | focus, escape-handler, keyboard |

### Import Order

When using multiple primitives, import in this order:

```typescript
// 1. Foundational
import { createSlot } from './primitives/slot';
import { createKeyboardHandler } from './primitives/keyboard';
import { setAriaAttributes } from './primitives/aria';
import { createResizeObserver } from './primitives/resize';

// 2. Built on foundational
import { createEscapeHandler } from './primitives/escape-handler';
import { createAnnouncer } from './primitives/sr-manager';
import { createFocusTrap, createRovingFocus } from './primitives/focus';

// 3. Composite
import { createModal } from './primitives/modal';
```

---

## Integration Patterns by Framework

### React Integration

React components use primitives via hooks and compose event handlers.

#### Pattern 1: Hook Wrapper

```tsx
// useModal.ts
import { useEffect, useRef } from 'react';
import { createModal } from '@rafters/primitives/modal';
import type { ModalOptions } from '@rafters/primitives/modal';

interface UseModalOptions extends Omit<ModalOptions, 'open'> {
  open: boolean;
}

export function useModal(options: UseModalOptions) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const cleanup = createModal(element, options);
    return cleanup;
  }, [options.open, options.modal, options.trapFocus]);

  return ref;
}

// Usage
function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useModal({
    open,
    modal: true,
    trapFocus: true,
    onOpenChange,
  });

  return (
    <dialog ref={dialogRef}>
      {children}
    </dialog>
  );
}
```

#### Pattern 2: Event Handler Composition

**Problem**: Slot primitive cannot merge event handlers in vanilla JS.

**Solution**: Compose handlers in React props using utility function.

```tsx
// composeEventHandlers.ts
type EventHandler<E extends Event = Event> = (event: E) => void;

export function composeEventHandlers<E extends Event>(
  ...handlers: (EventHandler<E> | undefined)[]
): EventHandler<E> {
  return (event: E) => {
    for (const handler of handlers) {
      if (handler) {
        handler(event);
        if (event.defaultPrevented) break;
      }
    }
  };
}

// Slot component with event merging
function Slot({ asChild, onClick, children, ...props }: SlotProps) {
  const ref = useRef<HTMLElement>(null);

  if (asChild && React.isValidElement(children)) {
    // Merge event handlers
    const childProps = children.props;
    const mergedOnClick = composeEventHandlers(
      childProps.onClick,
      onClick
    );

    return React.cloneElement(children, {
      ...props,
      ...childProps,
      onClick: mergedOnClick,
      ref,
    });
  }

  return <span ref={ref} onClick={onClick} {...props}>{children}</span>;
}
```

#### Pattern 3: Shadcn Compatibility

Rafters React components must match shadcn/ui API:

```tsx
// ✅ Shadcn-compatible API
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

// ❌ NOT shadcn-compatible
<Dialog isOpen={open} onClose={() => setOpen(false)}>
  <DialogButton>Open</DialogButton>
  <DialogPanel>
    <h2>Title</h2>
    <p>Description</p>
  </DialogPanel>
</Dialog>
```

---

### Vue Integration

Vue components use primitives via directives and composables.

#### Pattern 1: Composable Wrapper

```typescript
// useModal.ts
import { ref, watch, onUnmounted } from 'vue';
import { createModal } from '@rafters/primitives/modal';
import type { ModalOptions } from '@rafters/primitives/modal';

export function useModal(
  elementRef: Ref<HTMLDialogElement | null>,
  options: Ref<ModalOptions> | ModalOptions
) {
  const cleanup = ref<(() => void) | null>(null);

  watch(
    () => [elementRef.value, unref(options)],
    ([element, opts]) => {
      cleanup.value?.();

      if (element) {
        cleanup.value = createModal(element, opts as ModalOptions);
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    cleanup.value?.();
  });
}

// Usage
<script setup lang="ts">
import { ref } from 'vue';
import { useModal } from './useModal';

const open = ref(false);
const dialogRef = ref<HTMLDialogElement | null>(null);

useModal(dialogRef, {
  open: open.value,
  modal: true,
  onOpenChange: (value) => { open.value = value; }
});
</script>

<template>
  <dialog ref="dialogRef">
    <slot />
  </dialog>
</template>
```

#### Pattern 2: Directive

```typescript
// v-focus-trap.ts
import { createFocusTrap } from '@rafters/primitives/focus';
import type { Directive } from 'vue';
import type { FocusTrapOptions } from '@rafters/primitives/focus';

interface FocusTrapBinding {
  enabled: boolean;
  options?: Omit<FocusTrapOptions, 'enabled'>;
}

export const vFocusTrap: Directive<HTMLElement, FocusTrapBinding> = {
  mounted(el, binding) {
    if (binding.value.enabled) {
      const cleanup = createFocusTrap(el, {
        enabled: true,
        ...binding.value.options,
      });
      (el as any).__focusTrapCleanup = cleanup;
    }
  },

  updated(el, binding) {
    const cleanup = (el as any).__focusTrapCleanup;
    cleanup?.();

    if (binding.value.enabled) {
      const newCleanup = createFocusTrap(el, {
        enabled: true,
        ...binding.value.options,
      });
      (el as any).__focusTrapCleanup = newCleanup;
    }
  },

  unmounted(el) {
    const cleanup = (el as any).__focusTrapCleanup;
    cleanup?.();
  },
};

// Usage
<template>
  <div v-focus-trap="{ enabled: open, options: { autoFocus: true } }">
    <!-- Dialog content -->
  </div>
</template>
```

#### Pattern 3: Event Handler Merging

Vue can merge multiple handlers using array syntax:

```vue
<template>
  <!-- Vue can merge handlers natively -->
  <button
    @click="[handleChildClick, handleParentClick]"
  >
    Click me
  </button>
</template>

<script setup lang="ts">
const handleChildClick = (e: MouseEvent) => console.log('Child');
const handleParentClick = (e: MouseEvent) => console.log('Parent');
</script>
```

---

### Svelte Integration

Svelte components use primitives via actions and stores.

#### Pattern 1: Action

```typescript
// focusTrap.ts
import { createFocusTrap } from '@rafters/primitives/focus';
import type { FocusTrapOptions } from '@rafters/primitives/focus';

export function focusTrap(
  element: HTMLElement,
  options: FocusTrapOptions
) {
  const cleanup = createFocusTrap(element, options);

  return {
    update(newOptions: FocusTrapOptions) {
      cleanup();
      return createFocusTrap(element, newOptions);
    },
    destroy() {
      cleanup();
    }
  };
}

// Usage
<script lang="ts">
  import { focusTrap } from './focusTrap';

  let open = false;
</script>

<div use:focusTrap={{ enabled: open, autoFocus: true }}>
  <!-- Dialog content -->
</div>
```

#### Pattern 2: Event Handler Forwarding

Svelte uses event forwarding for composition:

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let asChild = false;

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
    dispatch('click', e);
  }
</script>

{#if asChild}
  <slot onClick={handleClick} />
{:else}
  <button on:click={handleClick}>
    <slot />
  </button>
{/if}
```

---

### Vanilla JS Integration

Vanilla JS uses primitives directly, but **cannot merge event handlers**.

#### Pattern 1: Direct Usage

```typescript
import { createModal } from '@rafters/primitives/modal';

const dialog = document.querySelector('dialog')!;
const openBtn = document.querySelector('#open')!;
const closeBtn = document.querySelector('#close')!;

let cleanup: (() => void) | null = null;

function openDialog() {
  cleanup = createModal(dialog, {
    open: true,
    modal: true,
    trapFocus: true,
    onOpenChange: (open) => {
      if (!open) closeDialog();
    }
  });
}

function closeDialog() {
  cleanup?.();
  cleanup = null;
}

openBtn.addEventListener('click', openDialog);
closeBtn.addEventListener('click', closeDialog);
```

#### Pattern 2: Event Handler Limitation

**Cannot merge handlers** - only add sequentially:

```typescript
// ❌ Cannot do this in vanilla JS (no way to enumerate listeners)
function mergeClickHandlers(element: HTMLElement, newHandler: (e: MouseEvent) => void) {
  const existingHandlers = ???; // No API for this!
  // ...
}

// ✅ Can only add handlers sequentially
const button = document.querySelector('button')!;

// Child handler
button.addEventListener('click', (e) => {
  console.log('Child handler');
});

// Parent handler
button.addEventListener('click', (e) => {
  console.log('Parent handler');
});

// Both will fire in order, but we can't compose them
```

**Solution**: Document this limitation and guide users to use framework adapters for composition.

---

## Event Handler Merging Strategy

### The Problem

The `asChild` pattern (from Radix/shadcn) requires merging event handlers from parent and child:

```tsx
<Button asChild onClick={parentHandler}>
  <a href="#" onClick={childHandler}>Click</a>
</Button>

// Result: Both handlers should run when link is clicked
```

**This is impossible in vanilla JS** because there's no DOM API to enumerate existing event listeners.

### Framework-Specific Solutions

#### React: Compose in Props

```tsx
function Slot({ asChild, onClick, children, ...props }) {
  if (asChild && React.isValidElement(children)) {
    const childOnClick = children.props.onClick;
    const composedOnClick = composeEventHandlers(childOnClick, onClick);

    return React.cloneElement(children, {
      ...props,
      ...children.props,
      onClick: composedOnClick,
    });
  }

  return <span onClick={onClick} {...props}>{children}</span>;
}
```

#### Vue: Array Syntax

```vue
<template>
  <component
    :is="asChild ? 'span' : 'button'"
    v-on:[eventName]="[childHandler, parentHandler]"
  >
    <slot />
  </component>
</template>
```

#### Svelte: Event Forwarding

```svelte
<script>
  export let asChild = false;

  function handleClick(e) {
    // Parent handler
    dispatch('click', e);
  }
</script>

{#if asChild}
  <slot on:click={handleClick} />
{:else}
  <button on:click={handleClick}>
    <slot />
  </button>
{/if}
```

#### Vanilla JS: Sequential Addition Only

```typescript
// ❌ Cannot merge
// ✅ Can only add handlers in sequence
const button = document.querySelector('button')!;

button.addEventListener('click', childHandler);
button.addEventListener('click', parentHandler);
// Both fire in order added
```

### Adapter Responsibility

**Framework adapters** (React hooks, Vue composables, Svelte actions) are responsible for:

1. ✅ Managing component state
2. ✅ Handling component lifecycle
3. ✅ **Merging event handlers** (React/Vue/Svelte only)
4. ✅ Providing framework-idiomatic API

**Primitives** are responsible for:

1. ✅ DOM manipulation
2. ✅ ARIA attribute management
3. ✅ Keyboard event handling
4. ✅ Focus management
5. ❌ NOT event handler merging (no DOM API)

---

## Framework Adapter Responsibilities

### What Adapters MUST Do

1. **State Management**: Manage open/closed, selected, focused state
2. **Lifecycle Integration**: Call primitive cleanup on unmount
3. **Event Handler Composition**: Merge parent and child handlers (React/Vue/Svelte)
4. **Type Safety**: Provide typed props that match primitive options
5. **SSR Safety**: Handle server-side rendering gracefully
6. **Accessibility**: Ensure ARIA attributes are set correctly

### What Primitives MUST Do

1. **DOM Manipulation**: Add/remove elements, attributes, classes
2. **ARIA Management**: Set/update/remove ARIA attributes
3. **Keyboard Handling**: Listen for keyboard events
4. **Focus Management**: Move focus, trap focus, manage tabindex
5. **Cleanup**: Return cleanup function that resets all changes
6. **SSR Safety**: Check for DOM availability before any DOM access

### Boundary Examples

| Concern | Primitive | Adapter |
|---------|-----------|---------|
| Open/closed state | ❌ | ✅ |
| `aria-expanded` attribute | ✅ | ❌ |
| Event handler merging | ❌ | ✅ |
| Keyboard event listening | ✅ | ❌ |
| Focus trap activation | ✅ | ❌ |
| `useEffect` lifecycle | ❌ | ✅ |
| `tabindex` management | ✅ | ❌ |
| Component props | ❌ | ✅ |

---

## Common Mistakes and Anti-Patterns

### ❌ Anti-Pattern 1: Primitives Managing State

```typescript
// ❌ BAD: Primitive has internal state
function createToggle(element: HTMLElement) {
  let isPressed = false; // Internal state

  element.addEventListener('click', () => {
    isPressed = !isPressed;
    element.setAttribute('aria-pressed', String(isPressed));
  });

  return () => { /* cleanup */ };
}

// ✅ GOOD: Consumer manages state
function createToggle(element: HTMLElement, isPressed: boolean) {
  element.setAttribute('aria-pressed', String(isPressed));

  return () => {
    element.removeAttribute('aria-pressed');
  };
}
```

**Why**: Primitives should be stateless so consumers can control behavior via props/refs.

---

### ❌ Anti-Pattern 2: Trying to Merge Handlers in Vanilla Primitive

```typescript
// ❌ BAD: Attempting to merge handlers in primitive
function createSlot(container: HTMLElement, child: Element) {
  // No DOM API to get existing listeners!
  const existingOnClick = ??? // Impossible!

  container.addEventListener('click', (e) => {
    existingOnClick?.(e);
    child.dispatchEvent(new MouseEvent('click'));
  });
}

// ✅ GOOD: Document that merging happens in adapter
function createSlot(container: HTMLElement, child: Element) {
  // Just merge attributes, NOT event handlers
  for (const attr of child.attributes) {
    if (attr.name.startsWith('aria-')) {
      container.setAttribute(attr.name, attr.value);
    }
  }

  return () => { /* restore attributes */ };
}
```

**Why**: Event handler merging is impossible in vanilla JS. Adapters handle it.

---

### ❌ Anti-Pattern 3: Not Providing Cleanup

```typescript
// ❌ BAD: No cleanup function
function createKeyboardHandler(element: HTMLElement, handler: (e: KeyboardEvent) => void) {
  element.addEventListener('keydown', handler);
  // No return value!
}

// ✅ GOOD: Return cleanup
function createKeyboardHandler(element: HTMLElement, handler: (e: KeyboardEvent) => void) {
  element.addEventListener('keydown', handler);

  return () => {
    element.removeEventListener('keydown', handler);
  };
}
```

**Why**: Cleanup prevents memory leaks and allows re-initialization.

---

### ❌ Anti-Pattern 4: Not Checking for DOM Availability

```typescript
// ❌ BAD: Assumes DOM is available
function createAnnouncer() {
  const liveRegion = document.createElement('div'); // Crashes in SSR!
  document.body.appendChild(liveRegion);
}

// ✅ GOOD: Check for DOM
function createAnnouncer() {
  if (!isDOMAvailable()) {
    return {
      announce: () => {},
      destroy: () => {},
    };
  }

  const liveRegion = document.createElement('div');
  document.body.appendChild(liveRegion);
  // ...
}
```

**Why**: Primitives must work in SSR environments (Cloudflare Workers, Next.js, etc).

---

### ❌ Anti-Pattern 5: Framework-Specific Code in Primitives

```typescript
// ❌ BAD: React-specific code
import { useEffect } from 'react';

function createModal(element: HTMLElement) {
  useEffect(() => { // React hook in primitive!
    // ...
  }, []);
}

// ✅ GOOD: Vanilla TS only
function createModal(element: HTMLElement, options: ModalOptions) {
  // Pure DOM manipulation, no framework code
  if (options.open) {
    element.showModal();
  }

  return () => element.close();
}
```

**Why**: Primitives must be framework-agnostic to work with React, Vue, Svelte, vanilla JS.

---

### ❌ Anti-Pattern 6: Mutating Options Object

```typescript
// ❌ BAD: Mutating options
function createFocusTrap(element: HTMLElement, options: FocusTrapOptions) {
  options.enabled = true; // Mutation!
}

// ✅ GOOD: Treat options as immutable
function createFocusTrap(element: HTMLElement, options: FocusTrapOptions) {
  const config = { ...DEFAULT_OPTIONS, ...options }; // Copy
  // Use config, never mutate options
}
```

**Why**: Options may be frozen objects or proxies in frameworks (Vue's reactive system).

---

### ❌ Anti-Pattern 7: Not Restoring Original State

```typescript
// ❌ BAD: Doesn't restore original attributes
function setAriaAttributes(element: HTMLElement, attrs: AriaAttributes) {
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  return () => {
    // Just removes, doesn't restore!
    Object.keys(attrs).forEach(key => {
      element.removeAttribute(key);
    });
  };
}

// ✅ GOOD: Restore original values
function setAriaAttributes(element: HTMLElement, attrs: AriaAttributes) {
  const originalValues = new Map<string, string | null>();

  Object.entries(attrs).forEach(([key, value]) => {
    originalValues.set(key, element.getAttribute(key));
    element.setAttribute(key, String(value));
  });

  return () => {
    originalValues.forEach((value, key) => {
      if (value === null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    });
  };
}
```

**Why**: Cleanup should restore element to its pre-primitive state.

---

### ❌ Anti-Pattern 8: Shadcn API Incompatibility

```tsx
// ❌ BAD: Different API from shadcn
<Dialog isOpen={open} onClose={handleClose}>
  <DialogButton>Open</DialogButton>
  <DialogPanel>
    <h2>Title</h2>
  </DialogPanel>
</Dialog>

// ✅ GOOD: Match shadcn API exactly
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

**Why**: Users expect drop-in shadcn replacement. Different API breaks this expectation.

---

## Concrete Examples

### Example 1: Dialog Component (Full Integration)

#### Primitive (Vanilla TS)

```typescript
// primitives/modal.ts
import { createFocusTrap } from './focus';
import { createEscapeHandler } from './escape-handler';
import type { CleanupFunction } from './types';

export interface ModalOptions {
  open: boolean;
  modal?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  closeOnEscape?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function createModal(
  element: HTMLDialogElement,
  options: ModalOptions
): CleanupFunction {
  if (!isDOMAvailable()) {
    return () => {};
  }

  const config = {
    modal: true,
    trapFocus: true,
    restoreFocus: true,
    closeOnEscape: true,
    ...options,
  };

  const cleanups: CleanupFunction[] = [];

  // Open/close dialog
  if (config.open && !element.open) {
    if (config.modal) {
      element.showModal();
    } else {
      element.show();
    }
  } else if (!config.open && element.open) {
    element.close();
  }

  // Set ARIA attributes
  if (config.modal) {
    element.setAttribute('aria-modal', 'true');
    cleanups.push(() => element.removeAttribute('aria-modal'));
  }

  // Focus trap
  if (config.open && config.trapFocus) {
    cleanups.push(createFocusTrap(element, {
      enabled: true,
      restoreFocus: config.restoreFocus,
    }));
  }

  // Escape handler
  if (config.open && config.closeOnEscape) {
    cleanups.push(createEscapeHandler(element, {
      onEscape: () => config.onOpenChange?.(false),
    }));
  }

  return () => {
    cleanups.forEach(cleanup => cleanup());
    if (element.open) element.close();
  };
}
```

#### React Adapter

```tsx
// react/useModal.ts
import { useEffect, useRef } from 'react';
import { createModal } from '@rafters/primitives/modal';
import type { ModalOptions } from '@rafters/primitives/modal';

export function useModal(options: ModalOptions) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const cleanup = createModal(element, options);
    return cleanup;
  }, [options.open, options.modal, options.trapFocus]);

  return ref;
}
```

#### React Component (Shadcn-Compatible)

```tsx
// react/Dialog.tsx
import * as React from 'react';
import { useModal } from './useModal';
import { cn } from '@/lib/utils';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogProvider open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogProvider>
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDialogElement>) {
  const { open, onOpenChange } = useDialogContext();
  const dialogRef = useModal({
    open: open ?? false,
    modal: true,
    trapFocus: true,
    onOpenChange,
  });

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'backdrop:bg-background/80 backdrop:backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </dialog>
  );
}

Dialog.Content = DialogContent;
Dialog.Trigger = DialogTrigger;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
```

#### Vue Adapter

```typescript
// vue/useModal.ts
import { ref, watch, onUnmounted, type Ref } from 'vue';
import { createModal } from '@rafters/primitives/modal';
import type { ModalOptions } from '@rafters/primitives/modal';

export function useModal(
  elementRef: Ref<HTMLDialogElement | null>,
  options: Ref<ModalOptions> | ModalOptions
) {
  const cleanup = ref<(() => void) | null>(null);

  watch(
    () => [elementRef.value, unref(options)] as const,
    ([element, opts]) => {
      cleanup.value?.();

      if (element) {
        cleanup.value = createModal(element, opts);
      }
    },
    { immediate: true }
  );

  onUnmounted(() => cleanup.value?.());
}
```

---

### Example 2: Button with Slot (asChild Pattern)

#### Primitive

```typescript
// primitives/slot.ts
import { twMerge } from 'tailwind-merge';
import type { CleanupFunction } from './types';

export interface SlotOptions {
  mergeClassName?: boolean;
  mergeStyle?: boolean;
  mergeDataAttributes?: boolean;
  mergeAriaAttributes?: boolean;
}

export function createSlot(
  container: HTMLElement,
  slottedChild: Element | undefined,
  options?: SlotOptions
): CleanupFunction {
  if (!isDOMAvailable() || !slottedChild) {
    return () => {};
  }

  const config = {
    mergeClassName: true,
    mergeStyle: true,
    mergeDataAttributes: true,
    mergeAriaAttributes: true,
    ...options,
  };

  const originalAttributes = new Map<string, string | null>();

  // Merge className
  if (config.mergeClassName) {
    const containerClass = container.className;
    const childClass = slottedChild.className;
    const mergedClass = twMerge(containerClass, childClass);

    if (slottedChild instanceof HTMLElement) {
      originalAttributes.set('class', slottedChild.className);
      slottedChild.className = mergedClass;
    }
  }

  // Merge ARIA attributes
  if (config.mergeAriaAttributes) {
    for (const attr of container.attributes) {
      if (attr.name.startsWith('aria-')) {
        originalAttributes.set(attr.name, slottedChild.getAttribute(attr.name));
        slottedChild.setAttribute(attr.name, attr.value);
      }
    }
  }

  // Merge data attributes
  if (config.mergeDataAttributes) {
    for (const attr of container.attributes) {
      if (attr.name.startsWith('data-')) {
        originalAttributes.set(attr.name, slottedChild.getAttribute(attr.name));
        slottedChild.setAttribute(attr.name, attr.value);
      }
    }
  }

  return () => {
    originalAttributes.forEach((value, key) => {
      if (value === null) {
        slottedChild.removeAttribute(key);
      } else {
        slottedChild.setAttribute(key, value);
      }
    });
  };
}
```

#### React Adapter

```tsx
// react/Slot.tsx
import * as React from 'react';
import { createSlot } from '@rafters/primitives/slot';
import { composeEventHandlers } from './composeEventHandlers';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function Slot({ asChild, children, ...props }: SlotProps) {
  const ref = useRef<HTMLElement>(null);

  // Handle event merging in React (not in primitive)
  if (asChild && React.isValidElement(children)) {
    const childProps = children.props;

    // Merge event handlers using composition
    const mergedProps = {
      ...props,
      ...childProps,
      onClick: composeEventHandlers(props.onClick, childProps.onClick),
      onKeyDown: composeEventHandlers(props.onKeyDown, childProps.onKeyDown),
      onFocus: composeEventHandlers(props.onFocus, childProps.onFocus),
      onBlur: composeEventHandlers(props.onBlur, childProps.onBlur),
    };

    return React.cloneElement(children, mergedProps);
  }

  return <span ref={ref} {...props}>{children}</span>;
}
```

---

## Testing Integration Patterns

### Testing Primitives (Vanilla TS)

```typescript
// primitives/modal.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createModal } from './modal';

describe('createModal', () => {
  let dialog: HTMLDialogElement;

  beforeEach(() => {
    dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
  });

  afterEach(() => {
    document.body.removeChild(dialog);
  });

  it('opens modal dialog when open=true', () => {
    const cleanup = createModal(dialog, { open: true, modal: true });

    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    cleanup();
  });

  it('closes dialog when open=false', () => {
    dialog.showModal();
    expect(dialog.open).toBe(true);

    const cleanup = createModal(dialog, { open: false });

    expect(dialog.open).toBe(false);

    cleanup();
  });

  it('calls onOpenChange when Escape is pressed', () => {
    const onOpenChange = vi.fn();
    const cleanup = createModal(dialog, {
      open: true,
      closeOnEscape: true,
      onOpenChange,
    });

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(onOpenChange).toHaveBeenCalledWith(false);

    cleanup();
  });

  it('cleans up focus trap on unmount', () => {
    const button = document.createElement('button');
    dialog.appendChild(button);

    const cleanup = createModal(dialog, {
      open: true,
      trapFocus: true,
    });

    cleanup();

    // Focus trap should be removed
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    dialog.dispatchEvent(event);

    // Should not prevent default (no focus trap)
    expect(event.defaultPrevented).toBe(false);
  });
});
```

### Testing React Adapters

```tsx
// react/Dialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dialog, DialogTrigger, DialogContent } from './Dialog';

describe('Dialog', () => {
  it('opens dialog when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Dialog content</DialogContent>
      </Dialog>
    );

    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);

    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('closes dialog when Escape is pressed', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>Dialog content</DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));

    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument();
  });

  it('traps focus within dialog', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <button>Button 1</button>
          <button>Button 2</button>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));

    const button1 = screen.getByText('Button 1');
    const button2 = screen.getByText('Button 2');

    button2.focus();
    fireEvent.keyDown(button2, { key: 'Tab' });

    // Should wrap to button 1
    expect(document.activeElement).toBe(button1);
  });
});
```

---

## Summary

### Key Takeaways

1. **Primitives are stateless** - State lives in framework adapters
2. **Event merging in adapters** - Vanilla JS can't enumerate listeners
3. **Cleanup is mandatory** - All primitives return cleanup functions
4. **SSR safety is required** - Check for DOM before any DOM access
5. **Shadcn compatibility** - React components must match shadcn API exactly
6. **Framework agnostic** - Primitives work with React, Vue, Svelte, vanilla JS

### Primitive Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Framework Components (React/Vue/Svelte)                     │
│ - State management                                           │
│ - Lifecycle hooks                                            │
│ - Event handler composition                                  │
│ - Shadcn-compatible API                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ Framework Adapters (Hooks/Composables/Actions)             │
│ - useModal, useSlot, useFocusTrap                           │
│ - Lifecycle integration                                      │
│ - Event handler merging                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ Vanilla TypeScript Primitives                               │
│ - createModal, createSlot, createFocusTrap                  │
│ - DOM manipulation                                           │
│ - ARIA management                                            │
│ - Keyboard handling                                          │
│ - Focus management                                           │
│ - Cleanup functions                                          │
│ - SSR-safe                                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ DOM APIs                                                     │
│ - addEventListener, setAttribute, focus(), etc.              │
└─────────────────────────────────────────────────────────────┘
```

### Next Steps

1. Implement 8 core primitives in vanilla TS
2. Create React adapters (hooks + components)
3. Create Vue adapters (composables + components)
4. Create Svelte adapters (actions + components)
5. Write comprehensive tests for all layers
6. Document shadcn migration path
7. Set up registry distribution

---

**Document Version**: 1.0.0
**Author**: Claude (with typescript-expert consultation)
**Review Status**: Initial Design
**Next Review**: After implementing first primitive (slot)
