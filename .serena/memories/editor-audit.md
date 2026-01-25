# Editor Components Audit

## Overview
The editor components in `packages/ui/src/components/editor/` have accumulated technical debt that violates project standards. This audit tracks issues to be fixed.

## React 19 Purity Violations

### useEffect Usage (should be eliminated or converted to useLayoutEffect for DOM)

| File | Line | Status | Notes |
|------|------|--------|-------|
| BlockCanvas.tsx | 261 | TODO | |
| BlockCanvas.tsx | 402 | TODO | |
| CommandPaletteUI.tsx | 179 | TODO | |
| CommandPaletteUI.tsx | 266 | TODO | |
| CommandPaletteUI.tsx | 274 | TODO | |
| PropertyEditor.tsx | 316 | TODO | |
| InlineToolbar.tsx | - | FIXED | Refactored to useLayoutEffect + derived state |

### Patterns to Watch For
- `useEffect` for derived state (should compute in render)
- `useEffect` for DOM measurements (should use `useLayoutEffect`)
- `useEffect` for syncing with props (should use refs + render-time logic)
- `useEffect` for focus management (should use `onOpenAutoFocus` or similar callbacks)

## Other Issues to Check

- [ ] Arbitrary Tailwind values (no `-[400px]` etc.)
- [ ] CSS positioning usage (prefer flexbox/grid)
- [ ] Any `any` types
- [ ] Missing accessibility attributes
- [ ] Impure render functions

## Files to Audit

- [ ] BlockCanvas.tsx
- [ ] BlockSidebar.tsx
- [ ] BlockWrapper.tsx
- [ ] CommandPaletteUI.tsx
- [x] InlineToolbar.tsx (DONE)
- [ ] PropertyEditor.tsx

## A11y Test Failures (31 tests across 14 files)

Pre-existing bugs exposed when *.a11y.tsx was added to vitest include. These need fixing:

| Component | Failing Tests |
|-----------|---------------|
| Select | 3 - violations when closed/open/with groups |
| Menubar | 1 - separator role |
| NavigationMenu | 1 - multiple triggers |
| DropdownMenu | 1 - separator role |
| ContextMenu | 1 - separator role |
| Drawer | 2 - focus trap, shift+tab |
| Pagination | 1 - nav aria-label |
| HoverCard | 2 - tab nav, escape key |
| Sheet | 4 - focus, trap, shift+tab, side variants |
| Empty | 2 - list context, main landmark |
| Item | 1 - menu context |
| Progress | 4 - aria-label, labelledby, multiple, descriptive |
| AspectRatio | 1 - video content |
| Slider | 7 - aria-label, custom value, range, disabled, labelledby, describedby, vertical |

**Note**: typography-a11y.test.tsx passes and is included in test runs.

## Completed Fixes

### 2026-01-24
- InlineToolbar.tsx: Removed 3 useEffects, replaced with useLayoutEffect for DOM measurements, derived state pattern for popover reset, onOpenAutoFocus for input focus
