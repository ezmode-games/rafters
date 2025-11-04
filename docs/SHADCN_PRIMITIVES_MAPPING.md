# shadcn/ui Primitives Mapping for Rafters

**Status:** Design Document
**Author:** Claude (AI Analysis)
**Date:** 2025-11-03
**Purpose:** Map shadcn/ui components to vanilla TypeScript primitives for Rafters

## Executive Summary

This document analyzes shadcn/ui's component architecture, identifies its Radix UI primitive dependencies, and designs vanilla TypeScript equivalents for Rafters. The goal is to create **drop-in replacements** for shadcn/ui components using stateless primitives that provide accessibility, keyboard navigation, and ARIA attributes without React dependencies.

## Core Principle: Stateless Primitives

Rafters primitives are **NOT React components**. They are:

1. **Vanilla TypeScript utilities** - Pure functions and classes
2. **Stateless** - No internal state management
3. **Framework-agnostic** - Work with React, Vue, Svelte, vanilla JS
4. **Accessibility-first** - ARIA, keyboard navigation, focus management
5. **Copy-paste distribution** - Delivered via registry like shadcn

**State lives in the framework layer**, not in primitives.

---

## Primitive Categories

### 1. Composition Primitives
Primitives that enable component composition patterns.

### 2. Interaction Primitives
Primitives that handle keyboard, mouse, and focus interactions.

### 3. Positioning Primitives
Primitives for portal rendering, positioning, and collision detection.

### 4. Accessibility Primitives
Primitives that manage ARIA attributes, roles, and announcements.

---

## Vanilla TypeScript Primitive APIs

### 1. Slot Primitive

**Purpose:** Enable the `asChild` pattern for component composition.

**Radix Pattern:**
```tsx
// Radix uses React's cloneElement to merge props
<Button asChild>
  <a href="/link">Click me</a>
</Button>
// Result: <a href="/link" class="button-styles" role="button">Click me</a>
```

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/slot.ts

export interface SlotOptions {
  mergeEventHandlers?: boolean;
  mergeClassNames?: boolean;
  mergeStyles?: boolean;
}

export class Slot {
  /**
   * Merge props from parent element onto child element.
   * Used to implement asChild pattern.
   */
  static mergeProps(
    parentProps: Record<string, unknown>,
    childElement: HTMLElement,
    options: SlotOptions = {}
  ): void {
    const {
      mergeEventHandlers = true,
      mergeClassNames = true,
      mergeStyles = true,
    } = options;

    // Merge data attributes
    Object.keys(parentProps).forEach((key) => {
      if (key.startsWith('data-') || key.startsWith('aria-')) {
        childElement.setAttribute(key, String(parentProps[key]));
      }
    });

    // Merge class names
    if (mergeClassNames && parentProps.className) {
      const existing = childElement.className || '';
      childElement.className = `${existing} ${parentProps.className}`.trim();
    }

    // Merge styles
    if (mergeStyles && parentProps.style) {
      Object.assign(childElement.style, parentProps.style);
    }

    // Merge event handlers
    if (mergeEventHandlers) {
      Object.keys(parentProps).forEach((key) => {
        if (key.startsWith('on') && typeof parentProps[key] === 'function') {
          const eventName = key.slice(2).toLowerCase();
          const parentHandler = parentProps[key] as EventListener;
          const childHandler = (childElement as any)[key];

          // Child handler takes precedence (executes first)
          childElement.addEventListener(eventName, (event) => {
            if (childHandler) childHandler.call(childElement, event);
            if (!event.defaultPrevented) parentHandler(event);
          });
        }
      });
    }
  }

  /**
   * Check if element should use slot composition.
   */
  static shouldUseSlot(asChild?: boolean): boolean {
    return asChild === true;
  }
}

// Usage in React component:
export function Button({ asChild, children, ...props }) {
  const Component = asChild ? 'span' : 'button';

  useEffect(() => {
    if (asChild && ref.current) {
      const child = ref.current.firstElementChild as HTMLElement;
      if (child) {
        Slot.mergeProps(props, child);
      }
    }
  }, [asChild, props]);

  return <Component ref={ref} {...props}>{children}</Component>;
}
```

---

### 2. FocusTrap Primitive

**Purpose:** Trap focus within a container (dialogs, modals, popovers).

**Radix Pattern:**
- Dialog automatically traps focus when opened
- Tab cycles through focusable elements
- Shift+Tab cycles backward

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/focus-trap.ts

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | 'first' | 'last';
  returnFocusOnDeactivate?: boolean;
  escapeDeactivates?: boolean;
  allowOutsideClick?: boolean;
}

export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: Element | null = null;
  private focusableElements: HTMLElement[] = [];
  private isActive = false;

  constructor(container: HTMLElement, private options: FocusTrapOptions = {}) {
    this.container = container;
  }

  /**
   * Get all focusable elements within container.
   */
  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(',');

    return Array.from(
      this.container.querySelectorAll<HTMLElement>(selector)
    ).filter((el) => {
      return (
        el.offsetParent !== null && // visible
        !el.hasAttribute('inert') &&
        getComputedStyle(el).visibility !== 'hidden'
      );
    });
  }

  /**
   * Activate focus trap.
   */
  activate(): void {
    if (this.isActive) return;

    this.previousActiveElement = document.activeElement;
    this.focusableElements = this.getFocusableElements();

    // Set initial focus
    const { initialFocus } = this.options;
    if (initialFocus === 'first') {
      this.focusableElements[0]?.focus();
    } else if (initialFocus === 'last') {
      this.focusableElements[this.focusableElements.length - 1]?.focus();
    } else if (initialFocus instanceof HTMLElement) {
      initialFocus.focus();
    } else {
      this.focusableElements[0]?.focus();
    }

    // Add event listeners
    this.container.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('focusin', this.handleFocusIn);

    this.isActive = true;
  }

  /**
   * Deactivate focus trap.
   */
  deactivate(): void {
    if (!this.isActive) return;

    // Remove event listeners
    this.container.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('focusin', this.handleFocusIn);

    // Return focus
    if (
      this.options.returnFocusOnDeactivate &&
      this.previousActiveElement instanceof HTMLElement
    ) {
      this.previousActiveElement.focus();
    }

    this.isActive = false;
  }

  /**
   * Handle Tab key for focus cycling.
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    const { focusableElements } = this;
    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement
    );

    if (event.shiftKey) {
      // Shift+Tab: move backward
      const nextIndex =
        currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      focusableElements[nextIndex].focus();
    } else {
      // Tab: move forward
      const nextIndex =
        currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
      focusableElements[nextIndex].focus();
    }

    event.preventDefault();
  };

  /**
   * Prevent focus from leaving container.
   */
  private handleFocusIn = (event: FocusEvent): void => {
    if (
      event.target instanceof Node &&
      !this.container.contains(event.target) &&
      !this.options.allowOutsideClick
    ) {
      // Focus escaped, bring it back
      this.focusableElements[0]?.focus();
    }
  };
}

// Usage in React component:
function Dialog({ open, children }) {
  const ref = useRef<HTMLDivElement>(null);
  const trapRef = useRef<FocusTrap | null>(null);

  useEffect(() => {
    if (open && ref.current) {
      trapRef.current = new FocusTrap(ref.current, {
        initialFocus: 'first',
        returnFocusOnDeactivate: true,
      });
      trapRef.current.activate();
    }

    return () => {
      trapRef.current?.deactivate();
    };
  }, [open]);

  return <div ref={ref}>{children}</div>;
}
```

---

### 3. EscapeKey Primitive

**Purpose:** Handle Escape key to close overlays (dialogs, dropdowns, popovers).

**Radix Pattern:**
- Escape closes component automatically
- Captures event to prevent bubbling

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/escape-key.ts

export interface EscapeKeyOptions {
  enabled?: boolean;
  onEscape?: (event: KeyboardEvent) => void;
  stopPropagation?: boolean;
  preventDefault?: boolean;
}

export class EscapeKeyHandler {
  private element: HTMLElement;
  private isActive = false;

  constructor(element: HTMLElement, private options: EscapeKeyOptions = {}) {
    this.element = element;
  }

  /**
   * Start listening for Escape key.
   */
  activate(): void {
    if (this.isActive) return;
    document.addEventListener('keydown', this.handleKeyDown);
    this.isActive = true;
  }

  /**
   * Stop listening for Escape key.
   */
  deactivate(): void {
    if (!this.isActive) return;
    document.removeEventListener('keydown', this.handleKeyDown);
    this.isActive = false;
  }

  /**
   * Handle Escape key press.
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    if (this.options.enabled === false) return;

    // Call user handler
    this.options.onEscape?.(event);

    // Control event propagation
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    if (this.options.preventDefault) {
      event.preventDefault();
    }
  };

  /**
   * Update options.
   */
  setOptions(options: Partial<EscapeKeyOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

// Usage in React component:
function Dialog({ open, onClose, children }) {
  const ref = useRef<HTMLDivElement>(null);
  const escapeRef = useRef<EscapeKeyHandler | null>(null);

  useEffect(() => {
    if (open && ref.current) {
      escapeRef.current = new EscapeKeyHandler(ref.current, {
        onEscape: onClose,
        stopPropagation: true,
      });
      escapeRef.current.activate();
    }

    return () => {
      escapeRef.current?.deactivate();
    };
  }, [open, onClose]);

  return <div ref={ref}>{children}</div>;
}
```

---

### 4. AriaDialog Primitive

**Purpose:** Manage ARIA attributes for accessible dialogs.

**Radix Pattern:**
- `role="dialog"` or `role="alertdialog"`
- `aria-labelledby` points to title
- `aria-describedby` points to description
- `aria-modal="true"` for modals

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/aria-dialog.ts

export interface AriaDialogOptions {
  role?: 'dialog' | 'alertdialog';
  modal?: boolean;
  titleId?: string;
  descriptionId?: string;
  labelledBy?: string;
  describedBy?: string;
}

export class AriaDialog {
  private element: HTMLElement;

  constructor(element: HTMLElement, private options: AriaDialogOptions = {}) {
    this.element = element;
  }

  /**
   * Apply ARIA attributes to dialog.
   */
  apply(): void {
    const { role = 'dialog', modal = true, titleId, descriptionId, labelledBy, describedBy } = this.options;

    // Set role
    this.element.setAttribute('role', role);

    // Set modal state
    if (modal) {
      this.element.setAttribute('aria-modal', 'true');
    }

    // Set labelledby (title)
    if (labelledBy || titleId) {
      this.element.setAttribute('aria-labelledby', labelledBy || titleId || '');
    }

    // Set describedby (description)
    if (describedBy || descriptionId) {
      this.element.setAttribute('aria-describedby', describedBy || descriptionId || '');
    }

    // Ensure element is in tab sequence
    if (!this.element.hasAttribute('tabindex')) {
      this.element.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Remove ARIA attributes.
   */
  remove(): void {
    this.element.removeAttribute('role');
    this.element.removeAttribute('aria-modal');
    this.element.removeAttribute('aria-labelledby');
    this.element.removeAttribute('aria-describedby');
  }

  /**
   * Update options.
   */
  setOptions(options: Partial<AriaDialogOptions>): void {
    this.options = { ...this.options, ...options };
    this.apply();
  }
}

// Usage in React component:
function Dialog({ open, title, description, children }) {
  const ref = useRef<HTMLDivElement>(null);
  const ariaRef = useRef<AriaDialog | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open && ref.current) {
      ariaRef.current = new AriaDialog(ref.current, {
        role: 'dialog',
        modal: true,
        titleId,
        descriptionId,
      });
      ariaRef.current.apply();
    }

    return () => {
      ariaRef.current?.remove();
    };
  }, [open, titleId, descriptionId]);

  return (
    <div ref={ref}>
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {children}
    </div>
  );
}
```

---

### 5. ArrowNav Primitive

**Purpose:** Handle arrow key navigation in menus and lists.

**Radix Pattern:**
- Arrow Down: next item
- Arrow Up: previous item
- Home: first item
- End: last item
- Roving tabindex pattern

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/arrow-nav.ts

export interface ArrowNavOptions {
  orientation?: 'vertical' | 'horizontal';
  loop?: boolean; // Wrap to beginning/end
  rovingTabindex?: boolean; // Use roving tabindex pattern
  selector?: string; // Selector for navigable items
  onNavigate?: (index: number, element: HTMLElement) => void;
}

export class ArrowNav {
  private container: HTMLElement;
  private items: HTMLElement[] = [];
  private currentIndex = 0;
  private isActive = false;

  constructor(container: HTMLElement, private options: ArrowNavOptions = {}) {
    this.container = container;
    this.options = {
      orientation: 'vertical',
      loop: true,
      rovingTabindex: true,
      selector: '[role="menuitem"], [role="option"]',
      ...options,
    };
  }

  /**
   * Get all navigable items.
   */
  private getItems(): HTMLElement[] {
    return Array.from(
      this.container.querySelectorAll<HTMLElement>(this.options.selector!)
    ).filter((el) => {
      return (
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('aria-disabled') &&
        el.offsetParent !== null // visible
      );
    });
  }

  /**
   * Update roving tabindex.
   */
  private updateTabindex(index: number): void {
    if (!this.options.rovingTabindex) return;

    this.items.forEach((item, i) => {
      item.setAttribute('tabindex', i === index ? '0' : '-1');
    });
  }

  /**
   * Navigate to item at index.
   */
  private navigateTo(index: number): void {
    const { loop } = this.options;

    // Handle looping
    if (loop) {
      if (index < 0) index = this.items.length - 1;
      if (index >= this.items.length) index = 0;
    } else {
      index = Math.max(0, Math.min(index, this.items.length - 1));
    }

    this.currentIndex = index;
    const item = this.items[index];

    // Update tabindex and focus
    this.updateTabindex(index);
    item.focus();

    // Call user handler
    this.options.onNavigate?.(index, item);
  }

  /**
   * Activate arrow navigation.
   */
  activate(): void {
    if (this.isActive) return;

    this.items = this.getItems();
    this.updateTabindex(this.currentIndex);
    this.container.addEventListener('keydown', this.handleKeyDown);

    this.isActive = true;
  }

  /**
   * Deactivate arrow navigation.
   */
  deactivate(): void {
    if (!this.isActive) return;
    this.container.removeEventListener('keydown', this.handleKeyDown);
    this.isActive = false;
  }

  /**
   * Handle arrow key navigation.
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';

    switch (event.key) {
      case isVertical ? 'ArrowDown' : 'ArrowRight':
        this.navigateTo(this.currentIndex + 1);
        event.preventDefault();
        break;
      case isVertical ? 'ArrowUp' : 'ArrowLeft':
        this.navigateTo(this.currentIndex - 1);
        event.preventDefault();
        break;
      case 'Home':
        this.navigateTo(0);
        event.preventDefault();
        break;
      case 'End':
        this.navigateTo(this.items.length - 1);
        event.preventDefault();
        break;
    }
  };

  /**
   * Refresh items (call after DOM changes).
   */
  refresh(): void {
    this.items = this.getItems();
    this.updateTabindex(this.currentIndex);
  }

  /**
   * Set current index.
   */
  setCurrentIndex(index: number): void {
    this.currentIndex = index;
    this.updateTabindex(index);
  }
}

// Usage in React component:
function DropdownMenu({ items, children }) {
  const ref = useRef<HTMLDivElement>(null);
  const navRef = useRef<ArrowNav | null>(null);

  useEffect(() => {
    if (ref.current) {
      navRef.current = new ArrowNav(ref.current, {
        orientation: 'vertical',
        loop: true,
        selector: '[role="menuitem"]',
      });
      navRef.current.activate();
    }

    return () => {
      navRef.current?.deactivate();
    };
  }, []);

  return (
    <div ref={ref} role="menu">
      {items.map((item) => (
        <div key={item.id} role="menuitem" tabIndex={-1}>
          {item.label}
        </div>
      ))}
    </div>
  );
}
```

---

### 6. Portal Primitive

**Purpose:** Render content in a React Portal at document body or custom container.

**Radix Pattern:**
- `<Dialog.Portal>` renders content at document.body
- Used for overlays to escape z-index stacking contexts

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/portal.ts

export interface PortalOptions {
  container?: HTMLElement | null;
  className?: string;
  id?: string;
}

export class Portal {
  private element: HTMLElement;
  private portalContainer: HTMLElement | null = null;

  constructor(element: HTMLElement, private options: PortalOptions = {}) {
    this.element = element;
  }

  /**
   * Mount element into portal container.
   */
  mount(): void {
    const { container = document.body, className, id } = this.options;

    if (!container) {
      console.warn('Portal container not found, using document.body');
      this.portalContainer = document.body;
    } else {
      this.portalContainer = container;
    }

    // Create wrapper if needed
    const wrapper = document.createElement('div');
    if (className) wrapper.className = className;
    if (id) wrapper.id = id;

    // Move element into wrapper
    wrapper.appendChild(this.element);

    // Append to container
    this.portalContainer.appendChild(wrapper);
  }

  /**
   * Unmount element from portal container.
   */
  unmount(): void {
    if (this.element.parentElement) {
      this.element.parentElement.remove();
    }
  }
}

// Usage in React component:
function DialogPortal({ children, container }) {
  const ref = useRef<HTMLDivElement>(null);
  const portalRef = useRef<Portal | null>(null);

  useEffect(() => {
    if (ref.current) {
      portalRef.current = new Portal(ref.current, { container });
      portalRef.current.mount();
    }

    return () => {
      portalRef.current?.unmount();
    };
  }, [container]);

  return <div ref={ref}>{children}</div>;
}
```

---

### 7. Collision Detection Primitive

**Purpose:** Position popovers/tooltips and handle viewport collision.

**Radix Pattern:**
- Auto-position content to avoid viewport edges
- Exposes `data-side` and `data-align` attributes
- Supports collision boundaries

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/collision.ts

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export interface CollisionOptions {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  collisionBoundary?: HTMLElement | null;
  collisionPadding?: number;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  avoidCollisions?: boolean;
}

export interface Position {
  x: number;
  y: number;
  side: Side;
  align: Align;
}

export class CollisionDetector {
  private anchor: HTMLElement;
  private floating: HTMLElement;

  constructor(
    anchor: HTMLElement,
    floating: HTMLElement,
    private options: CollisionOptions = {}
  ) {
    this.anchor = anchor;
    this.floating = floating;
    this.options = {
      side: 'bottom',
      align: 'center',
      sideOffset: 0,
      alignOffset: 0,
      collisionPadding: 10,
      arrowPadding: 0,
      avoidCollisions: true,
      ...options,
    };
  }

  /**
   * Calculate optimal position for floating element.
   */
  computePosition(): Position {
    const anchorRect = this.anchor.getBoundingClientRect();
    const floatingRect = this.floating.getBoundingClientRect();
    const viewport = this.getViewport();

    let { side = 'bottom', align = 'center' } = this.options;
    const { sideOffset = 0, alignOffset = 0, avoidCollisions = true } = this.options;

    // Calculate initial position
    let position = this.calculatePosition(
      anchorRect,
      floatingRect,
      side,
      align,
      sideOffset,
      alignOffset
    );

    // Check collisions and adjust if needed
    if (avoidCollisions) {
      const collision = this.detectCollision(position, floatingRect, viewport);
      if (collision) {
        const adjusted = this.adjustForCollision(
          anchorRect,
          floatingRect,
          side,
          align,
          collision
        );
        position = adjusted.position;
        side = adjusted.side;
        align = adjusted.align;
      }
    }

    return { ...position, side, align };
  }

  /**
   * Calculate position for given side and alignment.
   */
  private calculatePosition(
    anchorRect: DOMRect,
    floatingRect: DOMRect,
    side: Side,
    align: Align,
    sideOffset: number,
    alignOffset: number
  ): { x: number; y: number } {
    let x = 0;
    let y = 0;

    // Calculate primary axis (side)
    switch (side) {
      case 'top':
        y = anchorRect.top - floatingRect.height - sideOffset;
        break;
      case 'bottom':
        y = anchorRect.bottom + sideOffset;
        break;
      case 'left':
        x = anchorRect.left - floatingRect.width - sideOffset;
        break;
      case 'right':
        x = anchorRect.right + sideOffset;
        break;
    }

    // Calculate secondary axis (align)
    const isVertical = side === 'top' || side === 'bottom';
    if (isVertical) {
      switch (align) {
        case 'start':
          x = anchorRect.left + alignOffset;
          break;
        case 'center':
          x = anchorRect.left + anchorRect.width / 2 - floatingRect.width / 2 + alignOffset;
          break;
        case 'end':
          x = anchorRect.right - floatingRect.width + alignOffset;
          break;
      }
    } else {
      switch (align) {
        case 'start':
          y = anchorRect.top + alignOffset;
          break;
        case 'center':
          y = anchorRect.top + anchorRect.height / 2 - floatingRect.height / 2 + alignOffset;
          break;
        case 'end':
          y = anchorRect.bottom - floatingRect.height + alignOffset;
          break;
      }
    }

    return { x, y };
  }

  /**
   * Detect if position causes viewport collision.
   */
  private detectCollision(
    position: { x: number; y: number },
    floatingRect: DOMRect,
    viewport: DOMRect
  ): { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean } | null {
    const { collisionPadding = 10 } = this.options;

    const collision = {
      top: position.y < viewport.top + collisionPadding,
      right: position.x + floatingRect.width > viewport.right - collisionPadding,
      bottom: position.y + floatingRect.height > viewport.bottom - collisionPadding,
      left: position.x < viewport.left + collisionPadding,
    };

    return collision.top || collision.right || collision.bottom || collision.left
      ? collision
      : null;
  }

  /**
   * Adjust position to avoid collision.
   */
  private adjustForCollision(
    anchorRect: DOMRect,
    floatingRect: DOMRect,
    side: Side,
    align: Align,
    collision: { top?: boolean; right?: boolean; bottom?: boolean; left?: boolean }
  ): { position: { x: number; y: number }; side: Side; align: Align } {
    const { sideOffset = 0, alignOffset = 0 } = this.options;

    // Try opposite side
    const oppositeSide: Record<Side, Side> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };

    const newSide = oppositeSide[side];
    const position = this.calculatePosition(
      anchorRect,
      floatingRect,
      newSide,
      align,
      sideOffset,
      alignOffset
    );

    return { position, side: newSide, align };
  }

  /**
   * Get viewport boundaries.
   */
  private getViewport(): DOMRect {
    const { collisionBoundary } = this.options;

    if (collisionBoundary) {
      return collisionBoundary.getBoundingClientRect();
    }

    return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  }

  /**
   * Apply position to floating element.
   */
  apply(): void {
    const position = this.computePosition();

    this.floating.style.position = 'absolute';
    this.floating.style.left = `${position.x}px`;
    this.floating.style.top = `${position.y}px`;

    // Set data attributes for styling
    this.floating.setAttribute('data-side', position.side);
    this.floating.setAttribute('data-align', position.align);
  }
}

// Usage in React component:
function Popover({ anchor, children }) {
  const floatingRef = useRef<HTMLDivElement>(null);
  const collisionRef = useRef<CollisionDetector | null>(null);

  useEffect(() => {
    if (anchor && floatingRef.current) {
      collisionRef.current = new CollisionDetector(anchor, floatingRef.current, {
        side: 'bottom',
        align: 'center',
        avoidCollisions: true,
      });
      collisionRef.current.apply();
    }
  }, [anchor]);

  return <div ref={floatingRef}>{children}</div>;
}
```

---

### 8. Typeahead Primitive

**Purpose:** Enable typeahead search in menus and select components.

**Radix Pattern:**
- Type characters to jump to matching item
- Matches beginning of item text
- Clears search after 1 second

**Rafters Vanilla API:**
```typescript
// packages/primitives/src/typeahead.ts

export interface TypeaheadOptions {
  items: HTMLElement[];
  getItemText?: (item: HTMLElement) => string;
  timeout?: number; // Clear search after N ms
  onMatch?: (item: HTMLElement, index: number) => void;
}

export class Typeahead {
  private searchString = '';
  private searchTimeout: number | null = null;

  constructor(private options: TypeaheadOptions) {
    this.options = {
      timeout: 1000,
      getItemText: (item) => item.textContent || '',
      ...options,
    };
  }

  /**
   * Handle character input.
   */
  handleKeyPress(event: KeyboardEvent): void {
    // Ignore special keys
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key.length > 1) return; // Not a character

    // Add to search string
    this.searchString += event.key.toLowerCase();

    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Find matching item
    const match = this.findMatch();
    if (match) {
      this.options.onMatch?.(match.item, match.index);
    }

    // Set timeout to clear search
    this.searchTimeout = window.setTimeout(() => {
      this.searchString = '';
    }, this.options.timeout);
  }

  /**
   * Find item matching current search string.
   */
  private findMatch(): { item: HTMLElement; index: number } | null {
    const { items, getItemText } = this.options;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const text = getItemText!(item).toLowerCase();

      if (text.startsWith(this.searchString)) {
        return { item, index: i };
      }
    }

    return null;
  }

  /**
   * Reset search string.
   */
  reset(): void {
    this.searchString = '';
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }
}

// Usage in React component:
function Select({ items, children }) {
  const ref = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef<Typeahead | null>(null);

  useEffect(() => {
    if (ref.current) {
      const itemElements = Array.from(
        ref.current.querySelectorAll<HTMLElement>('[role="option"]')
      );

      typeaheadRef.current = new Typeahead({
        items: itemElements,
        onMatch: (item) => item.focus(),
      });

      const handleKeyPress = (e: KeyboardEvent) => {
        typeaheadRef.current?.handleKeyPress(e);
      };

      ref.current.addEventListener('keypress', handleKeyPress);

      return () => {
        ref.current?.removeEventListener('keypress', handleKeyPress);
        typeaheadRef.current?.reset();
      };
    }
  }, [items]);

  return (
    <div ref={ref} role="listbox">
      {items.map((item) => (
        <div key={item.id} role="option" tabIndex={-1}>
          {item.label}
        </div>
      ))}
    </div>
  );
}
```

---

## Component-to-Primitive Dependency Map

This section maps each shadcn/ui component to the Rafters primitives it requires.

### Tier 1: Simple Components (No Primitives Required)

These components don't need primitives, just styling:

- **Badge** - Pure styling
- **Separator** - Pure styling
- **Skeleton** - Pure styling
- **Spinner** - Pure styling (animation)
- **Kbd** - Pure styling
- **Typography** - Pure styling
- **Item** - Pure styling

### Tier 2: Button-like Components

**Button**
- Primitives: `Slot` (for asChild pattern)
- Features: Variants, sizes, icon support
- ARIA: None required (native button semantics)

**Toggle**
- Primitives: `Slot`
- Features: Pressed state
- ARIA: `aria-pressed`

**Toggle Group**
- Primitives: `Slot`, `ArrowNav` (for keyboard), `RovingTabindex`
- Features: Single/multiple selection
- ARIA: `role="group"`, `aria-pressed`

### Tier 3: Form Input Components

**Input**
- Primitives: None
- Features: Variants
- ARIA: Standard input attributes

**Textarea**
- Primitives: None
- Features: Auto-resize
- ARIA: Standard textarea attributes

**Label**
- Primitives: None
- Features: Associate with form controls
- ARIA: `for` attribute

**Checkbox**
- Primitives: `Slot`
- Features: Checked/indeterminate state
- ARIA: `role="checkbox"`, `aria-checked`

**Radio Group**
- Primitives: `ArrowNav`, `RovingTabindex`
- Features: Single selection
- ARIA: `role="radiogroup"`, `role="radio"`, `aria-checked`

**Switch**
- Primitives: `Slot`
- Features: On/off state
- ARIA: `role="switch"`, `aria-checked`

**Slider**
- Primitives: Custom slider logic (thumb drag, keyboard)
- Features: Single/range, step, min/max
- ARIA: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`

### Tier 4: Overlay Components

**Dialog**
- Primitives: `Portal`, `FocusTrap`, `EscapeKey`, `AriaDialog`, `Overlay` (backdrop)
- Features: Modal overlay, close on escape, focus trap
- ARIA: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`

**Alert Dialog**
- Primitives: `Portal`, `FocusTrap`, `EscapeKey`, `AriaDialog`, `Overlay`
- Features: Same as Dialog but with alert role
- ARIA: `role="alertdialog"`

**Sheet**
- Primitives: `Portal`, `FocusTrap`, `EscapeKey`, `AriaDialog`, `Overlay`
- Features: Slide-in panel (extends Dialog)
- ARIA: Same as Dialog

**Drawer**
- Primitives: `Portal`, `FocusTrap`, `EscapeKey`, `AriaDialog`, `Overlay`, `DragGesture`
- Features: Swipeable drawer
- ARIA: Same as Dialog

### Tier 5: Popover/Tooltip Components

**Popover**
- Primitives: `Portal`, `CollisionDetector`, `EscapeKey`, `ClickOutside`
- Features: Positioned floating content, auto-flip on collision
- ARIA: `role="dialog"` or none (depending on content)

**Tooltip**
- Primitives: `Portal`, `CollisionDetector`, `HoverDelay`
- Features: Show on hover, hide on blur
- ARIA: `role="tooltip"`, `aria-describedby`

**Hover Card**
- Primitives: `Portal`, `CollisionDetector`, `HoverDelay`
- Features: Rich preview on hover
- ARIA: Not accessible to keyboard users (by design)

### Tier 6: Menu Components

**Dropdown Menu**
- Primitives: `Portal`, `CollisionDetector`, `ArrowNav`, `Typeahead`, `EscapeKey`, `ClickOutside`, `RovingTabindex`
- Features: Menu with submenus, checkboxes, radio items
- ARIA: `role="menu"`, `role="menuitem"`, `role="menuitemcheckbox"`, `role="menuitemradio"`

**Context Menu**
- Primitives: Same as Dropdown Menu + `RightClick`
- Features: Right-click menu
- ARIA: Same as Dropdown Menu

**Menubar**
- Primitives: Same as Dropdown Menu + `ArrowNav` (horizontal)
- Features: Desktop-style menubar
- ARIA: `role="menubar"`

**Navigation Menu**
- Primitives: `CollisionDetector`, `ArrowNav`, `HoverDelay`
- Features: Website navigation with dropdowns
- ARIA: `role="navigation"`, `role="menuitem"`

**Command**
- Primitives: `Dialog` primitives + `FuzzySearch`, `ArrowNav`
- Features: Command palette (Cmd+K)
- ARIA: `role="dialog"`, `role="combobox"`, `role="listbox"`

### Tier 7: Selection Components

**Select**
- Primitives: `Portal`, `CollisionDetector`, `ArrowNav`, `Typeahead`, `EscapeKey`, `ClickOutside`
- Features: Custom select dropdown
- ARIA: `role="combobox"`, `role="listbox"`, `role="option"`, `aria-selected`

**Combobox**
- Primitives: Same as Select + `FuzzySearch`, `Input`
- Features: Searchable select
- ARIA: Same as Select + `aria-autocomplete`

**Native Select**
- Primitives: None (native `<select>`)
- Features: Styled native select
- ARIA: Native semantics

### Tier 8: Layout/Container Components

**Tabs**
- Primitives: `ArrowNav` (for tab list), `RovingTabindex`
- Features: Tab panels
- ARIA: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`

**Accordion**
- Primitives: `ArrowNav`, `Animation`
- Features: Collapsible sections, single/multiple open
- ARIA: `role="region"`, `aria-expanded`, `aria-controls`, `aria-labelledby`

**Collapsible**
- Primitives: `Animation`
- Features: Expand/collapse
- ARIA: `aria-expanded`, `aria-controls`

**Scroll Area**
- Primitives: Custom scrollbar styling
- Features: Custom scrollbars
- ARIA: Native scroll semantics

**Resizable**
- Primitives: `DragGesture`, `ArrowNav` (keyboard resize)
- Features: Resizable panels
- ARIA: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`

**Carousel**
- Primitives: `DragGesture`, `ArrowNav`, `Pagination`
- Features: Image carousel
- ARIA: `role="region"`, `aria-live` for announcements

### Tier 9: Data Display Components

**Table**
- Primitives: None
- Features: Styled table
- ARIA: Native table semantics

**Data Table**
- Primitives: `Sorting`, `Filtering`, `Pagination`, `ArrowNav`
- Features: Interactive data grid (TanStack Table)
- ARIA: `role="grid"`, `role="gridcell"`, `aria-sort`

**Card**
- Primitives: None
- Features: Container with header/footer
- ARIA: Optional `role="article"`

**Avatar**
- Primitives: `ImageFallback`
- Features: Image with fallback
- ARIA: `alt` text

**Progress**
- Primitives: None (styling only)
- Features: Progress bar
- ARIA: `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`

### Tier 10: Notification Components

**Toast**
- Primitives: `Portal`, `Animation`, `Timer`, `AriaLiveRegion`
- Features: Temporary notification
- ARIA: `role="status"` or `role="alert"`, `aria-live`

**Sonner**
- Primitives: Same as Toast
- Features: Opinionated toast library
- ARIA: Same as Toast

**Alert**
- Primitives: None
- Features: Static callout
- ARIA: `role="alert"` or `role="status"`

### Tier 11: Utility Components

**Aspect Ratio**
- Primitives: None (CSS only)
- Features: Maintain aspect ratio
- ARIA: None

**Form**
- Primitives: `FormValidation`, `FormState`
- Features: React Hook Form integration
- ARIA: Proper label/error associations

**Field**
- Primitives: None
- Features: Label + control + help text wrapper
- ARIA: Proper associations

**Input Group**
- Primitives: None
- Features: Input with prefix/suffix
- ARIA: None (decorative)

**Input OTP**
- Primitives: `ArrowNav`, `PasteHandler`, `AutoFocus`
- Features: One-time password input
- ARIA: `aria-label` for each input

**Breadcrumb**
- Primitives: None
- Features: Navigation breadcrumbs
- ARIA: `role="navigation"`, `aria-label="breadcrumb"`

**Pagination**
- Primitives: `ArrowNav`
- Features: Page navigation
- ARIA: `role="navigation"`, `aria-label="pagination"`

**Empty**
- Primitives: None
- Features: Empty state display
- ARIA: Optional `role="status"`

**Button Group**
- Primitives: `RovingTabindex`
- Features: Grouped buttons
- ARIA: `role="group"`

**Calendar**
- Primitives: `ArrowNav`, `DatePicker` logic, `RovingTabindex`
- Features: Date selection
- ARIA: `role="grid"`, `role="gridcell"`, `aria-selected`, `aria-label`

**Date Picker**
- Primitives: `Calendar` + `Popover` primitives + `Input`
- Features: Date input with calendar
- ARIA: `role="combobox"`, `aria-expanded`

**Chart**
- Primitives: None (Recharts)
- Features: Charts via Recharts
- ARIA: Recharts accessibility

**Sidebar**
- Primitives: `Collapsible`, `ArrowNav`
- Features: Collapsible sidebar
- ARIA: `role="navigation"`, `aria-expanded`

---

## Primitive Dependency Summary

Here's a frequency analysis of which primitives are used most:

### Core Primitives (Used by Many Components)
1. **Slot** - 15+ components (all components with asChild)
2. **ArrowNav** - 20+ components (all menus, lists, grids)
3. **Portal** - 15+ components (all overlays)
4. **EscapeKey** - 15+ components (all dismissible overlays)
5. **CollisionDetector** - 10+ components (all floating elements)
6. **RovingTabindex** - 10+ components (all keyboard-navigable groups)

### Specialized Primitives (Used by Few Components)
- **FocusTrap** - Dialogs, modals (5 components)
- **Typeahead** - Menus, selects (5 components)
- **ClickOutside** - Dropdowns, popovers (5 components)
- **HoverDelay** - Tooltips, hover cards (3 components)
- **DragGesture** - Drawer, resizable, carousel (3 components)
- **ImageFallback** - Avatar (1 component)
- **Timer** - Toast (1 component)
- **AriaLiveRegion** - Toast, alerts (2 components)

### Missing Primitives to Create
- **ClickOutside** - Close on outside click
- **HoverDelay** - Delay before showing/hiding
- **DragGesture** - Drag interactions
- **Animation** - Enter/exit animations
- **ImageFallback** - Image loading with fallback
- **Timer** - Auto-dismiss
- **AriaLiveRegion** - Screen reader announcements
- **FuzzySearch** - Command palette search
- **Overlay** - Modal backdrop
- **RovingTabindex** - Manage tabindex in groups
- **RightClick** - Context menu trigger
- **PasteHandler** - Handle paste events
- **AutoFocus** - Auto-focus element
- **FormValidation** - Form validation logic
- **FormState** - Form state management

---

## Implementation Guidelines

### 1. Primitive Distribution
- Copy-paste via registry (like shadcn CLI)
- Each primitive is self-contained
- No external dependencies except DOM APIs
- TypeScript with strict types

### 2. Framework Integration
React components import and use primitives:

```tsx
// packages/ui/src/dialog.tsx
import { FocusTrap, EscapeKey, AriaDialog, Portal } from '@rafters/primitives';

export function Dialog({ open, onClose, children }) {
  // Use primitives in React component
}
```

Vue/Svelte components do the same:
```vue
<script setup lang="ts">
import { FocusTrap, EscapeKey } from '@rafters/primitives';
// Use primitives in Vue component
</script>
```

### 3. Testing Primitives
Test primitives in isolation:

```typescript
// packages/primitives/src/focus-trap.test.ts
import { describe, it, expect } from 'vitest';
import { FocusTrap } from './focus-trap';

describe('FocusTrap', () => {
  it('traps focus within container', () => {
    const container = document.createElement('div');
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    container.append(button1, button2);

    const trap = new FocusTrap(container);
    trap.activate();

    button2.focus();
    // Tab should cycle to button1
    // Test implementation...
  });
});
```

### 4. Documentation
Each primitive has:
- Purpose and use case
- API reference
- Code examples
- Accessibility notes
- Browser compatibility

---

## Next Steps

### Phase 1: Core Primitives
Implement the most-used primitives first:
1. Slot
2. ArrowNav
3. Portal
4. EscapeKey
5. CollisionDetector

### Phase 2: Accessibility Primitives
6. FocusTrap
7. AriaDialog
8. RovingTabindex
9. AriaLiveRegion

### Phase 3: Interaction Primitives
10. ClickOutside
11. HoverDelay
12. DragGesture
13. Typeahead

### Phase 4: Specialized Primitives
14. Animation
15. ImageFallback
16. Timer
17. FuzzySearch
18. Overlay

### Phase 5: React Components
Build React components using primitives:
1. Button (uses Slot)
2. Dialog (uses Portal, FocusTrap, EscapeKey, AriaDialog)
3. Dropdown Menu (uses Portal, ArrowNav, Typeahead, EscapeKey)
4. Select (uses Portal, ArrowNav, Typeahead, CollisionDetector)
5. Tabs (uses ArrowNav, RovingTabindex)

---

## Conclusion

This mapping provides a clear path to building shadcn-compatible components with vanilla TypeScript primitives. The primitives are:

- **Stateless** - No internal state management
- **Framework-agnostic** - Work with React, Vue, Svelte
- **Accessible** - ARIA, keyboard, focus management built-in
- **Copy-paste** - Distributed via registry
- **Type-safe** - Strict TypeScript

By implementing these primitives, Rafters can offer the same developer experience as shadcn/ui while providing more flexibility in framework choice and maintaining the cognitive load intelligence that makes Rafters unique.
