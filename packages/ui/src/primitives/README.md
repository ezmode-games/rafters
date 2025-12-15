# Primitives — API Reference (Proof of Concept)

This folder contains small, framework-agnostic primitives used by `@rafters/ui` components.

Each primitive is SSR-safe and returns cleanup functions where applicable.

Quick reference

- `createFocusTrap(element: HTMLElement): CleanupFunction`
  - Traps focus inside `element`. Restores previous focus when cleaned up.

- `preventBodyScroll(): CleanupFunction`
  - Locks body scroll and preserves scrollbar width; returns cleanup.

- `getPortalContainer(options?: PortalOptions): HTMLElement | null`
  - Returns portal container (or `null` in SSR). Use `isPortalSupported()` to guard.

- `onOutsideClick(element, handler): CleanupFunction`
  - Calls `handler` when a click/touch occurs outside `element`.

- `onPointerDownOutside(element, handler): CleanupFunction`
  - Pointer-aware outside-down handler with touch fallback.

- `onEscapeKeyDown(handler): CleanupFunction`
  - Calls `handler` for `Escape` key presses.

Notes

- All primitives check `typeof window`/`typeof document` and are no-ops during SSR.
- Prefer `onPointerDownOutside` in modern browsers; `onOutsideClick` is preserved for compatibility and simpler tests.
- Types are exported from `./types.ts` for consistency (`CleanupFunction`, etc.).

Examples

```ts
import { createFocusTrap, preventBodyScroll } from './focus-trap';

const cleanup = createFocusTrap(dialogElement);
// later
cleanup();
```

Class helper

This package also provides a small, opinionated class builder, `classy`, which
combines deterministic `cn`-like merging with optional token resolution.

- `classy(...inputs)` — default instance (no tokenMap, arbitrary classes blocked)
- `classy.create({ tokenMap, allowArbitrary, warn })` — create instance with token resolver
- `classy.token(key)` — helper to mark token references for resolution

Use `classy` to build classes consistently across React, Vue, and Web Components.
