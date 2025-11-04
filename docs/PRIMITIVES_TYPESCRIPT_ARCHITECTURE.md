# Primitives TypeScript Architecture

**Status**: Architecture Design
**Version**: 1.0.0
**Last Updated**: 2025-11-03

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Module Structure](#module-structure)
4. [TypeScript Patterns](#typescript-patterns)
5. [Core Type System](#core-type-system)
6. [Primitive Examples](#primitive-examples)
7. [Testing Strategy](#testing-strategy)
8. [Framework Integration](#framework-integration)
9. [SSR Considerations](#ssr-considerations)
10. [Distribution via Registry](#distribution-via-registry)

---

## Overview

Rafters accessibility primitives are **vanilla TypeScript utilities** that provide low-level accessibility infrastructure for building UI components. They are:

- **Framework-agnostic**: Pure TypeScript, no React/Vue/Svelte
- **Zero dependencies**: No npm packages (not even utility libraries)
- **Stateless**: No internal state management (consumers handle state)
- **SSR-safe**: Work with Cloudflare Workers and server-side rendering
- **Registry-distributed**: Users copy source files, not npm install
- **Type-safe**: Full TypeScript coverage with strict mode

### Key Goals

1. **Provide infrastructure, not components**: Primitives handle keyboard navigation, ARIA attributes, focus management, and screen reader announcements
2. **Enable framework wrappers**: Primitives should be easily wrapped by React/Vue/Svelte components
3. **Maximize type safety**: Leverage TypeScript to prevent accessibility bugs at compile time
4. **Zero runtime cost**: No framework overhead, just pure DOM manipulation

---

## Design Principles

### 1. Stateless Design

Primitives **never manage state**. They accept current state as input and return cleanup functions.

```typescript
// BAD: Primitive manages state
function createToggle() {
  let isOpen = false; // Internal state - NO!
  return {
    toggle: () => { isOpen = !isOpen; },
    getState: () => isOpen
  };
}

// GOOD: Consumer manages state
function createToggle(isOpen: boolean) {
  // Primitive only applies ARIA and returns cleanup
  return applyToggleAccessibility(element, isOpen);
}
```

### 2. Cleanup Functions

All primitives return cleanup functions that remove event listeners and reset DOM state.

```typescript
type CleanupFunction = () => void;

function primitive(): CleanupFunction {
  // Setup
  element.addEventListener('click', handler);

  // Return cleanup
  return () => {
    element.removeEventListener('click', handler);
  };
}
```

### 3. SSR Safety

Primitives check for DOM availability before manipulating elements.

```typescript
function isDOMAvailable(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function primitive() {
  if (!isDOMAvailable()) {
    return () => {}; // No-op cleanup
  }

  // Safe to use DOM APIs
}
```

### 4. Type-Safe Options

All primitives accept strongly-typed options objects with sensible defaults.

```typescript
interface PrimitiveOptions {
  enabled?: boolean;
  onActivate?: (event: Event) => void;
}

const DEFAULT_OPTIONS: Required<PrimitiveOptions> = {
  enabled: true,
  onActivate: () => {},
};

function primitive(
  element: HTMLElement,
  options: PrimitiveOptions = {}
): CleanupFunction {
  const config = { ...DEFAULT_OPTIONS, ...options };
  // ...
}
```

---

## Module Structure

### File Organization

```
packages/primitives/
├── src/
│   ├── index.ts                    # Public API exports
│   ├── types.ts                    # Shared type definitions
│   ├── utils/
│   │   ├── dom.ts                  # DOM utilities (SSR-safe)
│   │   ├── aria.ts                 # ARIA attribute helpers
│   │   ├── keyboard.ts             # Keyboard event utilities
│   │   └── focus.ts                # Focus management utilities
│   ├── primitives/
│   │   ├── slot.ts                 # Slot primitive
│   │   ├── focus-trap.ts           # Focus trap primitive
│   │   ├── dismissable-layer.ts    # Dismissable layer primitive
│   │   ├── roving-focus.ts         # Roving focus primitive
│   │   ├── portal.ts               # Portal primitive
│   │   └── visually-hidden.ts      # Visually hidden primitive
│   └── internal/
│       ├── constants.ts            # Internal constants
│       └── element-registry.ts     # Element tracking (internal)
├── test/
│   ├── primitives/
│   │   ├── slot.test.ts
│   │   ├── focus-trap.test.ts
│   │   └── ...
│   └── utils/
│       ├── dom.test.ts
│       └── ...
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

### Export Strategy

#### Public API (`src/index.ts`)

```typescript
// Primitives (public API)
export { createSlot } from './primitives/slot.js';
export { createFocusTrap } from './primitives/focus-trap.js';
export { createDismissableLayer } from './primitives/dismissable-layer.js';
export { createRovingFocus } from './primitives/roving-focus.js';
export { createPortal } from './primitives/portal.js';
export { createVisuallyHidden } from './primitives/visually-hidden.js';

// Types (public API)
export type {
  CleanupFunction,
  SlotOptions,
  FocusTrapOptions,
  DismissableLayerOptions,
  RovingFocusOptions,
  PortalOptions,
  VisuallyHiddenOptions,
  KeyboardEventKey,
  AriaRole,
  AriaAttribute,
} from './types.js';

// Utilities (selective export - only high-value utils)
export { isDOMAvailable } from './utils/dom.js';
export { announceToScreenReader } from './utils/aria.js';
export { getFocusableElements } from './utils/focus.js';

// DO NOT export internal utilities or constants
```

#### Internal Utilities (`src/internal/`)

```typescript
// These are NOT exported from index.ts
// Only used internally by primitives

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), ...';

export const elementRegistry = new WeakMap<HTMLElement, unknown>();
```

---

## TypeScript Patterns

### 1. DOM Manipulation Safety

#### Type Guards for Element Types

```typescript
function isHTMLElement(element: unknown): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isHTMLInputElement(element: unknown): element is HTMLInputElement {
  return element instanceof HTMLInputElement;
}

function isHTMLButtonElement(element: unknown): element is HTMLButtonElement {
  return element instanceof HTMLButtonElement;
}

// Usage
function primitive(element: Element) {
  if (!isHTMLElement(element)) {
    throw new Error('Element must be HTMLElement');
  }

  // TypeScript knows element is HTMLElement here
  element.focus();
}
```

#### Null-Safe DOM Access

```typescript
function getElement(
  selector: string,
  root: Document | HTMLElement = document
): HTMLElement | undefined {
  if (!isDOMAvailable()) {
    return undefined;
  }

  const element = root.querySelector(selector);
  return isHTMLElement(element) ? element : undefined;
}

function requireElement(
  selector: string,
  root: Document | HTMLElement = document
): HTMLElement {
  const element = getElement(selector, root);

  if (element === undefined) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}
```

### 2. Event Handler Patterns

#### Type-Safe Event Handlers

```typescript
type EventHandler<T extends Event = Event> = (event: T) => void;

interface EventListenerConfig<T extends Event = Event> {
  element: HTMLElement;
  event: string;
  handler: EventHandler<T>;
  options?: AddEventListenerOptions;
}

function addEventListenerSafe<T extends Event>(
  config: EventListenerConfig<T>
): CleanupFunction {
  const { element, event, handler, options } = config;

  if (!isDOMAvailable()) {
    return () => {};
  }

  // TypeScript-safe event listener
  const safeHandler = (e: Event) => {
    handler(e as T);
  };

  element.addEventListener(event, safeHandler, options);

  return () => {
    element.removeEventListener(event, safeHandler, options);
  };
}

// Usage
const cleanup = addEventListenerSafe<KeyboardEvent>({
  element: button,
  event: 'keydown',
  handler: (event) => {
    // TypeScript knows event is KeyboardEvent
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
  },
});
```

#### Multi-Event Cleanup

```typescript
function createCleanupGroup(): {
  add: (cleanup: CleanupFunction) => void;
  cleanup: CleanupFunction;
} {
  const cleanups: CleanupFunction[] = [];

  return {
    add: (cleanup: CleanupFunction) => {
      cleanups.push(cleanup);
    },
    cleanup: () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
      cleanups.length = 0;
    },
  };
}

// Usage
function primitive(): CleanupFunction {
  const group = createCleanupGroup();

  group.add(addEventListenerSafe({ /* ... */ }));
  group.add(addEventListenerSafe({ /* ... */ }));
  group.add(addEventListenerSafe({ /* ... */ }));

  return group.cleanup;
}
```

### 3. Options Pattern

#### Discriminated Unions for Variants

```typescript
interface BaseOptions {
  enabled?: boolean;
}

interface AutoFocusOptions extends BaseOptions {
  autoFocus: true;
  initialFocusElement?: HTMLElement;
}

interface ManualFocusOptions extends BaseOptions {
  autoFocus: false;
}

type FocusTrapOptions = AutoFocusOptions | ManualFocusOptions;

function createFocusTrap(
  container: HTMLElement,
  options: FocusTrapOptions
): CleanupFunction {
  if (options.autoFocus) {
    // TypeScript knows initialFocusElement exists here
    const target = options.initialFocusElement ?? container;
    target.focus();
  }

  // ...
}
```

#### Branded Types for Semantic Constraints

```typescript
// Ensure IDs are unique across the application
type UniqueId = string & { __brand: 'UniqueId' };

function createUniqueId(prefix: string): UniqueId {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}` as UniqueId;
}

interface AriaOptions {
  id?: UniqueId;
  labelledBy?: UniqueId;
  describedBy?: UniqueId;
}

// Usage - TypeScript prevents passing random strings
const id = createUniqueId('dialog'); // UniqueId
const options: AriaOptions = {
  id,
  labelledBy: id, // OK
  // labelledBy: 'random-string' // TypeScript error!
};
```

### 4. SSR-Safe Initialization

#### Lazy DOM Access Pattern

```typescript
interface DOMRef<T extends HTMLElement = HTMLElement> {
  current: T | undefined;
}

function createDOMRef<T extends HTMLElement = HTMLElement>(): DOMRef<T> {
  return { current: undefined };
}

function primitive(): CleanupFunction {
  const containerRef = createDOMRef<HTMLDivElement>();

  // Only access DOM when needed
  function getContainer(): HTMLDivElement | undefined {
    if (!isDOMAvailable()) {
      return undefined;
    }

    if (containerRef.current === undefined) {
      containerRef.current = document.createElement('div');
      document.body.appendChild(containerRef.current);
    }

    return containerRef.current;
  }

  // Later...
  const container = getContainer();
  if (container !== undefined) {
    // Safe to use container
  }

  return () => {
    const container = containerRef.current;
    if (container !== undefined && container.parentElement !== null) {
      container.parentElement.removeChild(container);
    }
  };
}
```

---

## Core Type System

### Shared Types (`src/types.ts`)

```typescript
/**
 * Cleanup function returned by all primitives
 * Call this to remove event listeners and reset DOM state
 */
export type CleanupFunction = () => void;

/**
 * SSR-safe DOM availability check
 */
export type DOMEnvironment = 'browser' | 'server';

/**
 * Keyboard event keys (subset for accessibility)
 */
export type KeyboardEventKey =
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
 * ARIA roles (subset - add as needed)
 */
export type AriaRole =
  | 'button'
  | 'dialog'
  | 'menu'
  | 'menuitem'
  | 'menubar'
  | 'listbox'
  | 'option'
  | 'combobox'
  | 'tab'
  | 'tabpanel'
  | 'tablist'
  | 'tooltip'
  | 'alert'
  | 'alertdialog'
  | 'region'
  | 'navigation'
  | 'main'
  | 'search';

/**
 * ARIA attributes (strongly typed)
 */
export interface AriaAttributes {
  // Widget Attributes
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-hidden'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-label'?: string;
  'aria-level'?: number;
  'aria-modal'?: boolean;
  'aria-multiline'?: boolean;
  'aria-multiselectable'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-placeholder'?: string;
  'aria-pressed'?: boolean | 'mixed';
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  'aria-selected'?: boolean;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemax'?: number;
  'aria-valuemin'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;

  // Live Region Attributes
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';

  // Relationship Attributes
  'aria-activedescendant'?: string;
  'aria-controls'?: string;
  'aria-describedby'?: string;
  'aria-details'?: string;
  'aria-errormessage'?: string;
  'aria-flowto'?: string;
  'aria-labelledby'?: string;
  'aria-owns'?: string;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
}

/**
 * Focusable element types
 */
export type FocusableElement =
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLElement; // Elements with tabindex

/**
 * Focus trap options
 */
export interface FocusTrapOptions {
  enabled?: boolean;
  autoFocus?: boolean;
  initialFocusElement?: HTMLElement;
  returnFocusOnDeactivate?: boolean;
  allowOutsideClick?: boolean;
  escapeDeactivates?: boolean;
}

/**
 * Dismissable layer options
 */
export interface DismissableLayerOptions {
  enabled?: boolean;
  disableOutsidePointerEvents?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: Event) => void;
  onDismiss?: () => void;
}

/**
 * Roving focus options
 */
export interface RovingFocusOptions {
  enabled?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  dir?: 'ltr' | 'rtl';
  onNavigate?: (element: HTMLElement) => void;
}

/**
 * Slot options
 */
export interface SlotOptions {
  enabled?: boolean;
  mergeProps?: boolean;
}

/**
 * Portal options
 */
export interface PortalOptions {
  enabled?: boolean;
  container?: HTMLElement;
}

/**
 * Visually hidden options
 */
export interface VisuallyHiddenOptions {
  enabled?: boolean;
  focusable?: boolean;
}
```

---

## Primitive Examples

### Example 1: Slot Primitive

**Purpose**: Merge props from child element to parent, similar to Radix's Slot.

```typescript
// packages/primitives/src/primitives/slot.ts

import type { CleanupFunction, SlotOptions } from '../types.js';
import { isDOMAvailable } from '../utils/dom.js';
import { isHTMLElement } from '../utils/dom.js';

const DEFAULT_OPTIONS: Required<SlotOptions> = {
  enabled: true,
  mergeProps: true,
};

/**
 * Creates a slot that merges props from slotted child to container
 *
 * @example
 * ```ts
 * const container = document.querySelector('[data-slot]');
 * const child = container.firstElementChild;
 *
 * const cleanup = createSlot(container, child, {
 *   mergeProps: true
 * });
 *
 * // Container now has child's event listeners and ARIA attributes
 * ```
 */
export function createSlot(
  container: HTMLElement,
  slottedChild: Element | undefined,
  options: SlotOptions = {}
): CleanupFunction {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (!config.enabled || !isDOMAvailable()) {
    return () => {};
  }

  if (slottedChild === undefined || !isHTMLElement(slottedChild)) {
    return () => {};
  }

  // Store original attributes for cleanup
  const originalAttributes = new Map<string, string | null>();
  const mergedEventListeners = new Map<string, EventListener>();

  // Merge ARIA attributes
  if (config.mergeProps) {
    for (const attr of slottedChild.attributes) {
      if (attr.name.startsWith('aria-') || attr.name.startsWith('data-')) {
        originalAttributes.set(attr.name, container.getAttribute(attr.name));
        container.setAttribute(attr.name, attr.value);
      }
    }

    // Merge event listeners (simplified - in reality would need more work)
    const events = ['click', 'keydown', 'keyup', 'focus', 'blur'] as const;

    for (const eventName of events) {
      // Create a delegating handler
      const handler: EventListener = (event) => {
        const childEvent = new (event.constructor as EventConstructor)(event.type, event);
        slottedChild.dispatchEvent(childEvent);
      };

      container.addEventListener(eventName, handler);
      mergedEventListeners.set(eventName, handler);
    }
  }

  // Cleanup: restore original state
  return () => {
    // Remove merged attributes
    for (const [attrName, originalValue] of originalAttributes.entries()) {
      if (originalValue === null) {
        container.removeAttribute(attrName);
      } else {
        container.setAttribute(attrName, originalValue);
      }
    }

    // Remove event listeners
    for (const [eventName, handler] of mergedEventListeners.entries()) {
      container.removeEventListener(eventName, handler);
    }

    originalAttributes.clear();
    mergedEventListeners.clear();
  };
}

// Type for Event constructor
type EventConstructor = new (type: string, eventInitDict?: EventInit) => Event;
```

### Example 2: Focus Trap Primitive

**Purpose**: Trap keyboard focus within a container (for modals, dialogs).

```typescript
// packages/primitives/src/primitives/focus-trap.ts

import type { CleanupFunction, FocusTrapOptions } from '../types.js';
import { isDOMAvailable } from '../utils/dom.js';
import { getFocusableElements, getActiveElement } from '../utils/focus.js';
import { addEventListenerSafe, createCleanupGroup } from '../utils/events.js';

const DEFAULT_OPTIONS: Required<FocusTrapOptions> = {
  enabled: true,
  autoFocus: true,
  initialFocusElement: undefined as never, // Will be set to container
  returnFocusOnDeactivate: true,
  allowOutsideClick: false,
  escapeDeactivates: true,
};

/**
 * Creates a focus trap within the specified container
 *
 * Keyboard behavior:
 * - Tab: Move to next focusable element (wrap at end)
 * - Shift+Tab: Move to previous focusable element (wrap at start)
 * - Escape: Deactivate trap if escapeDeactivates is true
 *
 * @example
 * ```ts
 * const dialog = document.querySelector('[role="dialog"]');
 * const cleanup = createFocusTrap(dialog, {
 *   autoFocus: true,
 *   returnFocusOnDeactivate: true,
 *   escapeDeactivates: true
 * });
 *
 * // When done:
 * cleanup();
 * ```
 */
export function createFocusTrap(
  container: HTMLElement,
  options: FocusTrapOptions = {}
): CleanupFunction {
  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
    initialFocusElement: options.initialFocusElement ?? container,
  };

  if (!config.enabled || !isDOMAvailable()) {
    return () => {};
  }

  // Store the element that had focus before trap activated
  const previouslyFocusedElement = getActiveElement();

  // Auto-focus initial element
  if (config.autoFocus) {
    const focusableElements = getFocusableElements(container);
    const initialElement = focusableElements.includes(config.initialFocusElement)
      ? config.initialFocusElement
      : focusableElements[0];

    initialElement?.focus();
  }

  const cleanupGroup = createCleanupGroup();

  // Handle Tab key to trap focus
  cleanupGroup.add(
    addEventListenerSafe<KeyboardEvent>({
      element: container,
      event: 'keydown',
      handler: (event) => {
        if (event.key !== 'Tab') {
          return;
        }

        const focusableElements = getFocusableElements(container);

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = getActiveElement();

        // Shift+Tab on first element: go to last
        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
          return;
        }

        // Tab on last element: go to first
        if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
          return;
        }
      },
      options: { capture: true },
    })
  );

  // Handle Escape key to deactivate
  if (config.escapeDeactivates) {
    cleanupGroup.add(
      addEventListenerSafe<KeyboardEvent>({
        element: container,
        event: 'keydown',
        handler: (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            cleanup();
          }
        },
      })
    );
  }

  // Prevent focus from leaving container
  cleanupGroup.add(
    addEventListenerSafe<FocusEvent>({
      element: document,
      event: 'focusin',
      handler: (event) => {
        const target = event.target;

        if (
          target instanceof HTMLElement &&
          !container.contains(target) &&
          !config.allowOutsideClick
        ) {
          // Focus escaped - bring it back
          const focusableElements = getFocusableElements(container);
          focusableElements[0]?.focus();
        }
      },
      options: { capture: true },
    })
  );

  function cleanup() {
    cleanupGroup.cleanup();

    // Return focus to previously focused element
    if (
      config.returnFocusOnDeactivate &&
      previouslyFocusedElement instanceof HTMLElement
    ) {
      previouslyFocusedElement.focus();
    }
  }

  return cleanup;
}
```

### Example 3: Dismissable Layer Primitive

**Purpose**: Detect clicks/focus outside element and handle dismissal.

```typescript
// packages/primitives/src/primitives/dismissable-layer.ts

import type { CleanupFunction, DismissableLayerOptions } from '../types.js';
import { isDOMAvailable } from '../utils/dom.js';
import { addEventListenerSafe, createCleanupGroup } from '../utils/events.js';

const DEFAULT_OPTIONS: Required<DismissableLayerOptions> = {
  enabled: true,
  disableOutsidePointerEvents: true,
  onEscapeKeyDown: () => {},
  onPointerDownOutside: () => {},
  onFocusOutside: () => {},
  onInteractOutside: () => {},
  onDismiss: () => {},
};

/**
 * Creates a dismissable layer that handles outside interactions
 *
 * Features:
 * - Detects pointer events outside the layer
 * - Detects focus events outside the layer
 * - Handles Escape key to dismiss
 * - Optionally disables pointer events outside the layer
 *
 * @example
 * ```ts
 * const dropdown = document.querySelector('[role="menu"]');
 * const cleanup = createDismissableLayer(dropdown, {
 *   onPointerDownOutside: () => {
 *     dropdown.hidden = true;
 *   },
 *   onEscapeKeyDown: () => {
 *     dropdown.hidden = true;
 *   }
 * });
 * ```
 */
export function createDismissableLayer(
  layer: HTMLElement,
  options: DismissableLayerOptions = {}
): CleanupFunction {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (!config.enabled || !isDOMAvailable()) {
    return () => {};
  }

  const cleanupGroup = createCleanupGroup();

  // Disable pointer events outside layer
  if (config.disableOutsidePointerEvents) {
    const style = document.createElement('style');
    style.textContent = `
      body > *:not([data-dismissable-layer]) {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    layer.dataset.dismissableLayer = '';

    cleanupGroup.add(() => {
      document.head.removeChild(style);
      delete layer.dataset.dismissableLayer;
    });
  }

  // Handle pointer down outside
  cleanupGroup.add(
    addEventListenerSafe<PointerEvent>({
      element: document,
      event: 'pointerdown',
      handler: (event) => {
        const target = event.target;

        if (target instanceof Node && !layer.contains(target)) {
          config.onPointerDownOutside(event);
          config.onInteractOutside(event);
          config.onDismiss();
        }
      },
      options: { capture: true },
    })
  );

  // Handle focus outside
  cleanupGroup.add(
    addEventListenerSafe<FocusEvent>({
      element: document,
      event: 'focusin',
      handler: (event) => {
        const target = event.target;

        if (target instanceof Node && !layer.contains(target)) {
          config.onFocusOutside(event);
          config.onInteractOutside(event);
        }
      },
      options: { capture: true },
    })
  );

  // Handle Escape key
  cleanupGroup.add(
    addEventListenerSafe<KeyboardEvent>({
      element: document,
      event: 'keydown',
      handler: (event) => {
        if (event.key === 'Escape') {
          config.onEscapeKeyDown(event);
          config.onDismiss();
        }
      },
    })
  );

  return cleanupGroup.cleanup;
}
```

---

## Testing Strategy

### Test Environment Setup

```typescript
// packages/primitives/vitest.config.ts

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Use jsdom for DOM testing
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['test/**', '**/*.d.ts', '**/*.config.ts'],
    },
  },
});
```

```typescript
// packages/primitives/test/setup.ts

import { vi } from 'vitest';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

// Ensure clean DOM between tests
afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});
```

### Testing Patterns

#### 1. DOM Manipulation Tests

```typescript
// packages/primitives/test/primitives/slot.test.ts

import { describe, expect, it } from 'vitest';
import { createSlot } from '../../src/primitives/slot.js';

describe('createSlot', () => {
  it('merges ARIA attributes from child to parent', () => {
    const parent = document.createElement('button');
    const child = document.createElement('span');
    child.setAttribute('aria-label', 'Click me');
    child.setAttribute('aria-pressed', 'true');
    parent.appendChild(child);

    const cleanup = createSlot(parent, child, { mergeProps: true });

    expect(parent.getAttribute('aria-label')).toBe('Click me');
    expect(parent.getAttribute('aria-pressed')).toBe('true');

    cleanup();

    // Cleanup should remove merged attributes
    expect(parent.getAttribute('aria-label')).toBeNull();
    expect(parent.getAttribute('aria-pressed')).toBeNull();
  });

  it('preserves original attributes on cleanup', () => {
    const parent = document.createElement('button');
    parent.setAttribute('aria-label', 'Original');

    const child = document.createElement('span');
    child.setAttribute('aria-label', 'New');
    parent.appendChild(child);

    const cleanup = createSlot(parent, child, { mergeProps: true });

    expect(parent.getAttribute('aria-label')).toBe('New');

    cleanup();

    expect(parent.getAttribute('aria-label')).toBe('Original');
  });

  it('returns no-op cleanup when disabled', () => {
    const parent = document.createElement('button');
    const child = document.createElement('span');
    child.setAttribute('aria-label', 'Test');

    const cleanup = createSlot(parent, child, { enabled: false });

    expect(parent.getAttribute('aria-label')).toBeNull();

    cleanup(); // Should not throw
  });
});
```

#### 2. Keyboard Navigation Tests

```typescript
// packages/primitives/test/primitives/focus-trap.test.ts

import { describe, expect, it } from 'vitest';
import { createFocusTrap } from '../../src/primitives/focus-trap.js';

describe('createFocusTrap', () => {
  it('traps focus within container', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    const button3 = document.createElement('button');

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, { autoFocus: true });

    // Should auto-focus first element
    expect(document.activeElement).toBe(button1);

    // Simulate Tab key on last element
    button3.focus();
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(tabEvent);

    // Should wrap to first element
    expect(document.activeElement).toBe(button1);

    cleanup();
  });

  it('handles Shift+Tab to move backwards', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');

    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, { autoFocus: true });

    button1.focus();

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(shiftTabEvent);

    // Should wrap to last element
    expect(document.activeElement).toBe(button2);

    cleanup();
  });

  it('returns focus to previously focused element on cleanup', () => {
    const externalButton = document.createElement('button');
    document.body.appendChild(externalButton);
    externalButton.focus();

    const container = document.createElement('div');
    const button = document.createElement('button');
    container.appendChild(button);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, {
      autoFocus: true,
      returnFocusOnDeactivate: true,
    });

    expect(document.activeElement).toBe(button);

    cleanup();

    expect(document.activeElement).toBe(externalButton);
  });

  it('deactivates on Escape key when enabled', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    container.appendChild(button);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, {
      autoFocus: true,
      escapeDeactivates: true,
    });

    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(escapeEvent);

    // Trap should be deactivated (we can verify by trying to focus outside)
    const outsideButton = document.createElement('button');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    expect(document.activeElement).toBe(outsideButton);

    cleanup();
  });
});
```

#### 3. SSR Safety Tests

```typescript
// packages/primitives/test/utils/dom.test.ts

import { describe, expect, it, vi } from 'vitest';
import { isDOMAvailable } from '../../src/utils/dom.js';

describe('isDOMAvailable', () => {
  it('returns true in jsdom environment', () => {
    expect(isDOMAvailable()).toBe(true);
  });

  it('returns false when window is undefined', () => {
    const originalWindow = globalThis.window;

    // Simulate SSR environment
    vi.stubGlobal('window', undefined);

    expect(isDOMAvailable()).toBe(false);

    // Restore
    vi.stubGlobal('window', originalWindow);
  });

  it('returns false when document is undefined', () => {
    const originalDocument = globalThis.document;

    // Simulate SSR environment
    vi.stubGlobal('document', undefined);

    expect(isDOMAvailable()).toBe(false);

    // Restore
    vi.stubGlobal('document', originalDocument);
  });
});
```

#### 4. Accessibility Compliance Tests

```typescript
// packages/primitives/test/primitives/focus-trap.a11y.ts

import { describe, expect, it } from 'vitest';
import { createFocusTrap } from '../../src/primitives/focus-trap.js';

describe('Focus Trap Accessibility', () => {
  it('includes all focusable elements in tab sequence', () => {
    const container = document.createElement('div');

    // Various focusable elements
    const button = document.createElement('button');
    const input = document.createElement('input');
    const link = document.createElement('a');
    link.href = '#';
    const div = document.createElement('div');
    div.tabIndex = 0;

    container.appendChild(button);
    container.appendChild(input);
    container.appendChild(link);
    container.appendChild(div);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, { autoFocus: true });

    // All elements should be reachable
    expect(document.activeElement).toBe(button);

    // Simulate Tab through all elements
    button.focus();
    input.focus();
    link.focus();
    div.focus();

    cleanup();
  });

  it('skips disabled elements', () => {
    const container = document.createElement('div');

    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    button2.disabled = true;
    const button3 = document.createElement('button');

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, { autoFocus: true });

    // Should skip disabled button2
    button1.focus();
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(tabEvent);

    // Should move to button3, not button2
    expect(document.activeElement).not.toBe(button2);

    cleanup();
  });

  it('respects aria-hidden elements', () => {
    const container = document.createElement('div');

    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    button2.setAttribute('aria-hidden', 'true');
    const button3 = document.createElement('button');

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);
    document.body.appendChild(container);

    const cleanup = createFocusTrap(container, { autoFocus: true });

    // Should skip aria-hidden button2
    // (Implementation detail: getFocusableElements should filter these)

    cleanup();
  });
});
```

### Test Utilities

```typescript
// packages/primitives/test/utils/test-helpers.ts

/**
 * Creates a mock focusable element
 */
export function createFocusableElement(
  tag: 'button' | 'input' | 'a' | 'div' = 'button',
  options: { disabled?: boolean; ariaHidden?: boolean } = {}
): HTMLElement {
  const element = document.createElement(tag);

  if (tag === 'a') {
    (element as HTMLAnchorElement).href = '#';
  }

  if (tag === 'div') {
    element.tabIndex = 0;
  }

  if (options.disabled && 'disabled' in element) {
    (element as HTMLButtonElement | HTMLInputElement).disabled = true;
  }

  if (options.ariaHidden) {
    element.setAttribute('aria-hidden', 'true');
  }

  return element;
}

/**
 * Simulates keyboard event
 */
export function simulateKeyboard(
  element: HTMLElement,
  key: string,
  options: { shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean } = {}
): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });

  element.dispatchEvent(event);
}

/**
 * Simulates pointer event
 */
export function simulatePointer(
  element: HTMLElement,
  type: 'pointerdown' | 'pointerup' | 'pointermove',
  options: { clientX?: number; clientY?: number } = {}
): void {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    ...options,
  });

  element.dispatchEvent(event);
}
```

---

## Framework Integration

### React Wrapper Example

```typescript
// Example: React wrapper for focus-trap primitive
// NOT part of primitives package - consumers build this

import { useEffect, useRef } from 'react';
import { createFocusTrap } from '@rafters/primitives';
import type { FocusTrapOptions } from '@rafters/primitives';

interface UseFocusTrapOptions extends Omit<FocusTrapOptions, 'enabled'> {
  enabled: boolean;
}

export function useFocusTrap(options: UseFocusTrapOptions) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (element === null || !options.enabled) {
      return;
    }

    const cleanup = createFocusTrap(element, options);

    return cleanup;
  }, [options.enabled, options.autoFocus, options.escapeDeactivates]);

  return ref;
}

// Usage in React component
function Dialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialogRef = useFocusTrap({
    enabled: isOpen,
    autoFocus: true,
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
  });

  if (!isOpen) return null;

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true">
      <h2>Dialog Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Vue Wrapper Example

```typescript
// Example: Vue directive for focus-trap primitive
// NOT part of primitives package - consumers build this

import { createFocusTrap } from '@rafters/primitives';
import type { FocusTrapOptions, CleanupFunction } from '@rafters/primitives';
import type { Directive } from 'vue';

interface FocusTrapBinding {
  enabled: boolean;
  options?: FocusTrapOptions;
}

const vFocusTrap: Directive<HTMLElement, FocusTrapBinding> = {
  mounted(el, binding) {
    let cleanup: CleanupFunction | undefined;

    const update = () => {
      if (cleanup !== undefined) {
        cleanup();
        cleanup = undefined;
      }

      if (binding.value.enabled) {
        cleanup = createFocusTrap(el, binding.value.options);
      }
    };

    update();

    // Store cleanup for unmount
    (el as never)['__focusTrapCleanup'] = cleanup;
  },

  updated(el, binding) {
    // Re-run on updates
    const cleanup = (el as never)['__focusTrapCleanup'] as CleanupFunction | undefined;

    if (cleanup !== undefined) {
      cleanup();
    }

    if (binding.value.enabled) {
      const newCleanup = createFocusTrap(el, binding.value.options);
      (el as never)['__focusTrapCleanup'] = newCleanup;
    }
  },

  unmounted(el) {
    const cleanup = (el as never)['__focusTrapCleanup'] as CleanupFunction | undefined;

    if (cleanup !== undefined) {
      cleanup();
    }
  },
};

export default vFocusTrap;

// Usage in Vue component
/*
<template>
  <div
    v-focus-trap="{ enabled: isOpen, options: { autoFocus: true } }"
    role="dialog"
    aria-modal="true"
  >
    <h2>Dialog Title</h2>
    <button @click="close">Close</button>
  </div>
</template>
*/
```

### Vanilla JS Usage

```typescript
// Direct usage with vanilla JavaScript

import { createFocusTrap, createDismissableLayer } from '@rafters/primitives';

const dialog = document.querySelector('#dialog') as HTMLElement;
const openButton = document.querySelector('#open-dialog') as HTMLButtonElement;
const closeButton = dialog.querySelector('#close-dialog') as HTMLButtonElement;

let focusTrapCleanup: (() => void) | undefined;
let dismissableCleanup: (() => void) | undefined;

function openDialog() {
  dialog.hidden = false;

  // Activate focus trap
  focusTrapCleanup = createFocusTrap(dialog, {
    autoFocus: true,
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
  });

  // Make dismissable
  dismissableCleanup = createDismissableLayer(dialog, {
    onDismiss: closeDialog,
    disableOutsidePointerEvents: true,
  });
}

function closeDialog() {
  dialog.hidden = true;

  // Clean up primitives
  focusTrapCleanup?.();
  dismissableCleanup?.();

  focusTrapCleanup = undefined;
  dismissableCleanup = undefined;
}

openButton.addEventListener('click', openDialog);
closeButton.addEventListener('click', closeDialog);
```

---

## SSR Considerations

### Server-Safe Initialization

All primitives check for DOM availability before executing:

```typescript
// packages/primitives/src/utils/dom.ts

/**
 * Checks if DOM APIs are available (browser vs server)
 */
export function isDOMAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

/**
 * Gets the active element safely (works in SSR)
 */
export function getActiveElement(): Element | undefined {
  if (!isDOMAvailable()) {
    return undefined;
  }

  return document.activeElement ?? undefined;
}

/**
 * Type guard for HTMLElement
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
  if (!isDOMAvailable()) {
    return false;
  }

  return element instanceof HTMLElement;
}
```

### Cloudflare Workers Compatibility

Primitives work with Cloudflare Workers SSR by:

1. **No DOM access during module load**: All DOM access is deferred until primitive functions are called
2. **Feature detection**: Check for DOM APIs before use
3. **No-op returns**: Return empty cleanup functions in non-DOM environments

```typescript
// Safe for Workers environment
import { createFocusTrap } from '@rafters/primitives';

// This import is safe - no side effects
// Calling the function checks for DOM availability

export async function handler(request: Request): Promise<Response> {
  // Server-side: primitives do nothing
  const cleanup = createFocusTrap(null as never); // Returns no-op cleanup

  return new Response(html);
}
```

---

## Distribution via Registry

Primitives are distributed via the Rafters registry (not npm). Users copy source files directly into their projects.

### Registry Structure

```
registry/
├── primitives/
│   ├── slot.ts
│   ├── focus-trap.ts
│   ├── dismissable-layer.ts
│   ├── roving-focus.ts
│   ├── portal.ts
│   └── visually-hidden.ts
└── utils/
    ├── dom.ts
    ├── aria.ts
    ├── focus.ts
    ├── keyboard.ts
    └── events.ts
```

### CLI Installation

```bash
# Install a primitive via Rafters CLI
npx rafters add focus-trap

# Installs:
# - src/primitives/focus-trap.ts
# - src/utils/dom.ts
# - src/utils/focus.ts
# - src/utils/events.ts
```

### Benefits of Registry Distribution

1. **No dependency bloat**: Users only install what they need
2. **Full source visibility**: Users can read and modify code
3. **Type safety**: TypeScript sources, not compiled .d.ts files
4. **Version control**: Code is committed to user's repo
5. **Tree-shaking friendly**: Only used code is bundled

### Registry Metadata

Each primitive includes metadata for CLI:

```typescript
// packages/primitives/src/primitives/focus-trap.ts

/**
 * @primitive focus-trap
 * @category accessibility
 * @dependencies dom, focus, events
 * @description Trap keyboard focus within a container
 * @wcag 2.1.2 (Level A) - No Keyboard Trap
 * @aria https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
export function createFocusTrap(/* ... */) {
  // ...
}
```

The CLI parses these JSDoc annotations to:

- Show descriptions in `npx rafters search`
- Install dependencies automatically
- Link to WCAG criteria and ARIA patterns
- Generate usage documentation

---

## Summary

### Key Architectural Decisions

1. **Vanilla TypeScript**: No framework dependencies, maximum reusability
2. **Stateless Primitives**: Consumers manage state, primitives handle infrastructure
3. **Cleanup Pattern**: All primitives return cleanup functions for proper resource management
4. **SSR Safety**: Check for DOM availability before any DOM access
5. **Type-Safe Options**: Strongly-typed configuration objects with sensible defaults
6. **Registry Distribution**: Copy source files instead of npm packages
7. **Testing with jsdom**: Comprehensive tests in simulated DOM environment

### What Primitives Provide

- Keyboard navigation patterns (Tab, Arrow keys, Home/End)
- ARIA attribute management
- Focus management (traps, roving focus)
- Screen reader announcements
- Outside click/focus detection
- DOM manipulation utilities

### What Primitives Do NOT Provide

- Visual styles (consumers handle CSS)
- State management (consumers handle state)
- Component implementations (primitives are building blocks)
- Framework-specific integrations (consumers build wrappers)

### Next Steps

1. Implement core primitives: Slot, FocusTrap, DismissableLayer, RovingFocus
2. Build comprehensive test suite with jsdom
3. Create framework wrapper examples (React, Vue, Svelte)
4. Set up registry distribution in Rafters CLI
5. Write accessibility compliance documentation linking to WCAG criteria

---

**Document Version**: 1.0.0
**Author**: Claude (Rafters TypeScript Architecture Specialist)
**Review Status**: Initial Design
**Next Review**: After implementing first 3 primitives
