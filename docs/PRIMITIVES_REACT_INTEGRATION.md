# Headless Primitives - React 19 Integration Patterns

**Status**: Integration Guide
**Version**: 1.0.0
**Last Updated**: 2025-11-03
**Prerequisite**: Read HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md first

---

## Table of Contents

1. [Overview](#overview)
2. [Integration Strategy](#integration-strategy)
3. [React 19 Hook Wrappers](#react-19-hook-wrappers)
4. [Server Component Considerations](#server-component-considerations)
5. [Type Safety in Framework Layer](#type-safety-in-framework-layer)

---

## Overview

This document shows how to integrate the 8 vanilla TypeScript headless primitives with React 19, following the patterns from the frontend-developer agent.

### Key Benefits of Framework Wrappers

Vanilla primitives have limitations that React 19 solves:

1. **Event Handler Merging**: React tracks handlers, can merge them properly
2. **Automatic Cleanup**: useEffect handles cleanup on unmount
3. **Reactive Updates**: Props/state changes automatically re-call primitives
4. **State Management**: Hooks provide state primitives don't have
5. **Type Inference**: Generic hooks infer types from usage

---

## Integration Strategy

### Layer Architecture

```
┌─────────────────────────────────────┐
│  React Components (Consumer)        │
│  - Uses hooks (useFocusTrap, etc.)  │
│  - Manages state (useState, etc.)   │
│  - Handles rendering                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  React Hooks (Framework Adapter)    │
│  - Wraps vanilla primitives         │
│  - Handles lifecycle (useEffect)    │
│  - Provides reactive updates        │
│  - Merges event handlers            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Vanilla Primitives (Core Logic)    │
│  - Pure TypeScript                  │
│  - Framework-agnostic               │
│  - Returns CleanupFunction          │
│  - SSR-safe                         │
└─────────────────────────────────────┘
```

### Package Organization

```
packages/
  primitives/              # Vanilla TypeScript primitives
    src/
      primitives/
        slot.ts
        modal.ts
        keyboard.ts
        escape-handler.ts
        aria.ts
        sr-manager.ts
        resize.ts
        focus.ts

  react-primitives/        # React 19 wrappers
    src/
      hooks/
        use-slot.ts
        use-modal.ts
        use-keyboard.ts
        use-escape-handler.ts
        use-aria.ts
        use-announcer.ts
        use-resize-observer.ts
        use-focus-trap.ts
        use-roving-focus.ts
```

---

## React 19 Hook Wrappers

### 1. useSlot Hook

**Vanilla Primitive Issue**: Cannot merge event handlers added via addEventListener.

**React Solution**: Track event handlers in props, merge them before passing to elements.

```typescript
// packages/react-primitives/src/hooks/use-slot.ts

import { useRef, useEffect, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { createSlot, type SlotOptions } from '@rafters/primitives';

interface UseSlotOptions extends Omit<SlotOptions, 'mergeEventHandlers'> {
  /**
   * Enable slot behavior.
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * React hook for slot primitive.
 *
 * Merges props from child to parent, INCLUDING event handlers.
 * This is only possible in React because we track handlers in props.
 *
 * @param options - Slot configuration
 * @returns Ref to attach to slot container
 *
 * @example
 * ```tsx
 * function Button({ asChild, children, onClick }: ButtonProps) {
 *   const slotRef = useSlot({ enabled: asChild });
 *
 *   if (asChild) {
 *     return (
 *       <div ref={slotRef} onClick={onClick}>
 *         {children}
 *       </div>
 *     );
 *   }
 *
 *   return <button onClick={onClick}>{children}</button>;
 * }
 *
 * // Usage with asChild
 * <Button asChild>
 *   <Link to="/home" aria-label="Go home">Home</Link>
 * </Button>
 * // Renders: <Link> with Button's onClick merged
 * ```
 */
export function useSlot(options: UseSlotOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const { enabled = true, ...slotOptions } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Get first child element
    const child = container.firstElementChild;

    const cleanup = createSlot(container, child, slotOptions);

    return cleanup;
  }, [enabled, slotOptions]);

  return containerRef;
}

/**
 * Slot component for asChild pattern.
 *
 * @example
 * ```tsx
 * <Slot>
 *   <Link to="/home">Home</Link>
 * </Slot>
 * ```
 */
interface SlotProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactElement;
}

export function Slot({ children, ...props }: SlotProps) {
  const slotRef = useSlot();

  return (
    <div ref={slotRef} {...props}>
      {children}
    </div>
  );
}
```

### 2. useModal Hook

**Vanilla Primitive**: Combines focus trap + escape handler + outside click detection.

**React Wrapper**: Manages open/closed state, handles onClose callback.

```typescript
// packages/react-primitives/src/hooks/use-modal.ts

import { useRef, useEffect } from 'react';
import { createModal, type ModalOptions } from '@rafters/primitives';

interface UseModalOptions extends Omit<ModalOptions, 'onClose'> {
  /**
   * Whether modal is open.
   */
  isOpen: boolean;

  /**
   * Called when modal should close.
   * Consumer updates isOpen state.
   */
  onClose: () => void;
}

/**
 * React hook for modal primitive.
 *
 * Automatically handles:
 * - Focus trap when open
 * - Escape key to close
 * - Outside click detection
 * - Focus restoration on close
 *
 * @param options - Modal configuration
 * @returns Ref to attach to modal container
 *
 * @example
 * ```tsx
 * function Dialog({ isOpen, onClose }: DialogProps) {
 *   const modalRef = useModal({ isOpen, onClose });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="title">
 *       <h2 id="title">Dialog Title</h2>
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModal({
  isOpen,
  onClose,
  ...options
}: UseModalOptions) {
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal || !isOpen) return;

    const cleanup = createModal(modal, {
      ...options,
      onClose,
    });

    return cleanup;
  }, [isOpen, onClose, options]);

  return modalRef;
}
```

### 3. useKeyboardHandler Hook

**Vanilla Primitive**: Type-safe keyboard event handling.

**React Wrapper**: Reactive updates when handler or keys change.

```typescript
// packages/react-primitives/src/hooks/use-keyboard.ts

import { useRef, useEffect, type RefObject } from 'react';
import { createKeyboardHandler, type KeyboardHandlerOptions } from '@rafters/primitives';

type UseKeyboardHandlerOptions = Omit<KeyboardHandlerOptions, 'handler'> & {
  /**
   * Handler function.
   * Wrapped in useCallback recommended for stability.
   */
  handler: (event: KeyboardEvent) => void;

  /**
   * Element ref to attach listener to.
   * If not provided, attaches to returned ref.
   */
  elementRef?: RefObject<HTMLElement>;
};

/**
 * React hook for keyboard handler primitive.
 *
 * @param options - Keyboard handler configuration
 * @returns Ref to attach to element (if elementRef not provided)
 *
 * @example
 * ```tsx
 * function SearchBox() {
 *   const inputRef = useKeyboardHandler({
 *     key: 'Enter',
 *     handler: useCallback(() => {
 *       performSearch();
 *     }, [])
 *   });
 *
 *   return <input ref={inputRef} type="search" />;
 * }
 *
 * // Or with external ref
 * function Component() {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *
 *   useKeyboardHandler({
 *     elementRef: buttonRef,
 *     key: ['Enter', 'Space'],
 *     handler: useCallback(() => {
 *       handleActivation();
 *     }, [])
 *   });
 *
 *   return <button ref={buttonRef}>Click me</button>;
 * }
 * ```
 */
export function useKeyboardHandler({
  handler,
  elementRef: externalRef,
  ...options
}: UseKeyboardHandlerOptions) {
  const internalRef = useRef<HTMLElement>(null);
  const elementRef = externalRef ?? internalRef;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = createKeyboardHandler(element, {
      ...options,
      handler,
    });

    return cleanup;
  }, [elementRef, handler, options]);

  return internalRef;
}
```

### 4. useEscapeHandler Hook

**Vanilla Primitive**: Escape key with layer coordination.

**React Wrapper**: Simple effect wrapper.

```typescript
// packages/react-primitives/src/hooks/use-escape-handler.ts

import { useRef, useEffect, type RefObject } from 'react';
import { createEscapeHandler, type EscapeHandlerOptions } from '@rafters/primitives';

interface UseEscapeHandlerOptions extends Omit<EscapeHandlerOptions, 'onEscape'> {
  /**
   * Handler called when Escape pressed.
   */
  onEscape: (event: KeyboardEvent) => void;

  /**
   * Element ref to attach listener to.
   */
  elementRef?: RefObject<HTMLElement>;
}

/**
 * React hook for escape handler primitive.
 *
 * @example
 * ```tsx
 * function Tooltip({ isOpen, onClose }: TooltipProps) {
 *   const tooltipRef = useEscapeHandler({
 *     onEscape: onClose,
 *     stopPropagation: false // Allow parent modals to also close
 *   });
 *
 *   if (!isOpen) return null;
 *
 *   return <div ref={tooltipRef} role="tooltip">Tooltip content</div>;
 * }
 * ```
 */
export function useEscapeHandler({
  onEscape,
  elementRef: externalRef,
  ...options
}: UseEscapeHandlerOptions) {
  const internalRef = useRef<HTMLElement>(null);
  const elementRef = externalRef ?? internalRef;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = createEscapeHandler(element, {
      ...options,
      onEscape,
    });

    return cleanup;
  }, [elementRef, onEscape, options]);

  return internalRef;
}
```

### 5. useAriaAttributes Hook

**Vanilla Primitive**: Type-safe ARIA attribute management.

**React Wrapper**: Reactive updates when ARIA values change.

```typescript
// packages/react-primitives/src/hooks/use-aria.ts

import { useEffect, type RefObject } from 'react';
import { setAriaAttributes, type AriaAttributes } from '@rafters/primitives';

/**
 * React hook for ARIA attributes primitive.
 *
 * Automatically updates ARIA attributes when values change.
 *
 * @param elementRef - Ref to element
 * @param attributes - ARIA attributes to set
 *
 * @example
 * ```tsx
 * function Accordion({ isExpanded }: AccordionProps) {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *
 *   useAriaAttributes(buttonRef, {
 *     'aria-expanded': isExpanded,
 *     'aria-controls': 'panel-1'
 *   });
 *
 *   return (
 *     <button ref={buttonRef}>
 *       {isExpanded ? 'Collapse' : 'Expand'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useAriaAttributes(
  elementRef: RefObject<HTMLElement>,
  attributes: Partial<AriaAttributes>
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = setAriaAttributes(element, attributes);

    return cleanup;
  }, [elementRef, attributes]);
}
```

### 6. useAnnouncer Hook

**Vanilla Primitive**: Screen reader announcements.

**React Wrapper**: Manages announcer lifecycle, provides announce function.

```typescript
// packages/react-primitives/src/hooks/use-announcer.ts

import { useEffect, useRef, useCallback } from 'react';
import { createAnnouncer, type AnnouncerOptions, type LiveRegionPoliteness } from '@rafters/primitives';

/**
 * React hook for screen reader announcer.
 *
 * Creates announcer instance on mount, destroys on unmount.
 *
 * @param options - Announcer configuration
 * @returns announce function
 *
 * @example
 * ```tsx
 * function Form() {
 *   const announce = useAnnouncer({ politeness: 'polite' });
 *
 *   const handleSubmit = async () => {
 *     const result = await saveForm();
 *     if (result.success) {
 *       announce('Form saved successfully');
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useAnnouncer(options?: AnnouncerOptions) {
  const announcerRef = useRef<ReturnType<typeof createAnnouncer>>();

  useEffect(() => {
    announcerRef.current = createAnnouncer(options);

    return () => {
      announcerRef.current?.destroy();
    };
  }, [options]);

  const announce = useCallback((message: string) => {
    announcerRef.current?.announce(message);
  }, []);

  return announce;
}

/**
 * One-time announcement hook.
 * Announces when message changes.
 *
 * @example
 * ```tsx
 * function LoadingIndicator({ status }: { status: string }) {
 *   useAnnouncement(status, 'polite');
 *
 *   return <div role="status">{status}</div>;
 * }
 * ```
 */
export function useAnnouncement(
  message: string,
  politeness?: LiveRegionPoliteness
) {
  const announce = useAnnouncer({ politeness });

  useEffect(() => {
    if (message) {
      announce(message);
    }
  }, [message, announce]);
}
```

### 7. useResizeObserver Hook

**Vanilla Primitive**: Element resize observation.

**React Wrapper**: Reactive callback when size changes.

```typescript
// packages/react-primitives/src/hooks/use-resize-observer.ts

import { useEffect, type RefObject } from 'react';
import { createResizeObserver, type ResizeObserverOptions } from '@rafters/primitives';

/**
 * React hook for resize observer primitive.
 *
 * @param elementRef - Ref to element to observe
 * @param options - Resize observer configuration
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const [width, setWidth] = useState(0);
 *
 *   useResizeObserver(containerRef, {
 *     onResize: useCallback((entry) => {
 *       setWidth(entry.contentRect.width);
 *     }, [])
 *   });
 *
 *   return (
 *     <div ref={containerRef}>
 *       Current width: {width}px
 *     </div>
 *   );
 * }
 * ```
 */
export function useResizeObserver(
  elementRef: RefObject<HTMLElement>,
  options: ResizeObserverOptions
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = createResizeObserver(element, options);

    return cleanup;
  }, [elementRef, options]);
}
```

### 8. useFocusTrap Hook

**Vanilla Primitive**: Focus trap for modals.

**React Wrapper**: Manages trap activation based on isActive prop.

```typescript
// packages/react-primitives/src/hooks/use-focus-trap.ts

import { useRef, useEffect } from 'react';
import { createFocusTrap, type FocusTrapOptions } from '@rafters/primitives';

interface UseFocusTrapOptions extends FocusTrapOptions {
  /**
   * Whether trap is active.
   * When false, trap is disabled.
   */
  isActive: boolean;
}

/**
 * React hook for focus trap primitive.
 *
 * @param options - Focus trap configuration
 * @returns Ref to attach to trap container
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }: ModalProps) {
 *   const trapRef = useFocusTrap({
 *     isActive: isOpen,
 *     returnFocusOnDeactivate: true
 *   });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={trapRef} role="dialog">
 *       <button onClick={onClose}>Close</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap({
  isActive,
  ...options
}: UseFocusTrapOptions) {
  const trapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = trapRef.current;
    if (!container || !isActive) return;

    const cleanup = createFocusTrap(container, options);

    return cleanup;
  }, [isActive, options]);

  return trapRef;
}
```

### 9. useRovingFocus Hook

**Vanilla Primitive**: Roving tabindex pattern.

**React Wrapper**: Manages items array, handles dynamic updates.

```typescript
// packages/react-primitives/src/hooks/use-roving-focus.ts

import { useRef, useEffect, useState } from 'react';
import { createRovingFocus, type RovingFocusOptions } from '@rafters/primitives';

interface UseRovingFocusOptions extends RovingFocusOptions {
  /**
   * Selector for items within container.
   *
   * @default '[role="menuitem"], [role="option"], [role="radio"]'
   */
  itemSelector?: string;
}

/**
 * React hook for roving focus primitive.
 *
 * @param options - Roving focus configuration
 * @returns Ref to attach to container
 *
 * @example
 * ```tsx
 * function Menu({ items }: MenuProps) {
 *   const menuRef = useRovingFocus({
 *     orientation: 'vertical',
 *     loop: true
 *   });
 *
 *   return (
 *     <div ref={menuRef} role="menu">
 *       {items.map(item => (
 *         <button key={item.id} role="menuitem">
 *           {item.label}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRovingFocus({
  itemSelector = '[role="menuitem"], [role="option"], [role="radio"]',
  ...options
}: UseRovingFocusOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dynamic item getter - works with items added/removed
    const getItems = () => {
      return Array.from(
        container.querySelectorAll<HTMLElement>(itemSelector)
      );
    };

    const cleanup = createRovingFocus(container, getItems, options);

    return cleanup;
  }, [itemSelector, options]);

  return containerRef;
}
```

---

## Server Component Considerations

### SSR-Safe Primitives

All vanilla primitives are SSR-safe (check `isDOMAvailable()`), but React hooks only run on client.

**Server Component Pattern**:

```tsx
// app/components/Dialog.tsx (Server Component)
import { DialogClient } from './Dialog.client';

export function Dialog({ children }: DialogProps) {
  // Server component - no hooks
  return <DialogClient>{children}</DialogClient>;
}
```

```tsx
// app/components/Dialog.client.tsx (Client Component)
'use client';

import { useModal } from '@rafters/react-primitives';

export function DialogClient({ children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useModal({
    isOpen,
    onClose: () => setIsOpen(false),
  });

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

### React Router v7 Loaders

Primitives work with React Router loaders (server-side data fetching):

```tsx
// app/routes/products.$id.tsx

import { useLoaderData } from 'react-router';
import { useAnnouncer } from '@rafters/react-primitives';

export async function loader({ params }: LoaderFunctionArgs) {
  const product = await getProduct(params.id);
  return { product };
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();
  const announce = useAnnouncer();

  useEffect(() => {
    // Announce product name to screen readers
    announce(`Viewing ${product.name}`);
  }, [product.name, announce]);

  return <div>{/* ... */}</div>;
}
```

---

## Type Safety in Framework Layer

### Strict Hook Types

All hooks enforce strict types from vanilla primitives:

```typescript
// ✅ Type-safe: Correct ARIA value
useAriaAttributes(ref, {
  'aria-expanded': true, // boolean
});

// ❌ Type error: Invalid ARIA value
useAriaAttributes(ref, {
  'aria-expanded': 'yes', // Error: string not assignable to boolean
});

// ✅ Type-safe: Correct keyboard key
useKeyboardHandler({
  key: 'Enter',
  handler: (e) => {}, // e is KeyboardEvent
});

// ❌ Type error: Invalid key
useKeyboardHandler({
  key: 'InvalidKey', // Error: not assignable to KeyboardEventKey
  handler: (e) => {},
});
```

### Generic Hook Inference

Hooks infer types from usage:

```typescript
function Component() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ✅ Type inferred: elementRef is RefObject<HTMLButtonElement>
  useKeyboardHandler({
    elementRef: buttonRef,
    key: 'Enter',
    handler: (e) => {},
  });
}
```

### Ref Type Safety

All hooks return correctly typed refs:

```typescript
function Component() {
  // ✅ Type-safe: modalRef is RefObject<HTMLElement>
  const modalRef = useModal({ isOpen: true, onClose: () => {} });

  return (
    <div ref={modalRef}>
      {/* TypeScript knows this is HTMLElement */}
    </div>
  );
}
```

---

## Summary

### Integration Benefits

| Feature | Vanilla Primitive | React Hook Wrapper |
|---------|-------------------|---------------------|
| **Event Handler Merging** | ❌ Impossible | ✅ Tracks handlers in props |
| **Lifecycle Management** | Manual cleanup | ✅ Automatic via useEffect |
| **Reactive Updates** | Re-call manually | ✅ Automatic on prop change |
| **State Management** | External | ✅ useState, useReducer |
| **Type Inference** | Manual | ✅ Generic inference |

### Usage Recommendation

1. **Use vanilla primitives directly** when:
   - Building framework-agnostic libraries
   - Maximum portability needed
   - No React dependency allowed

2. **Use React hooks** when:
   - Building React 19 applications
   - Want automatic cleanup and reactivity
   - Need event handler merging

### File Paths Reference

**Architecture Documentation**:
- `/home/sean/projects/real-handy/rafters/docs/HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md` - Vanilla primitives architecture
- `/home/sean/projects/real-handy/rafters/docs/PRIMITIVES_REACT_INTEGRATION.md` - This file (React integration)
- `/home/sean/projects/real-handy/rafters/docs/PRIMITIVES_REQUIREMENTS.md` - Accessibility requirements
- `/home/sean/projects/real-handy/rafters/docs/PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md` - Original TypeScript patterns

---

**Document Version**: 1.0.0
**Next Steps**:
1. Implement vanilla primitives
2. Create React hook wrappers
3. Build example components using both approaches
4. Document Vue/Svelte integration patterns (future)

**Maintainer**: Frontend Architecture Team
