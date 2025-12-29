# @rafters/ui

Lightweight UI primitives and framework adapters used by the Rafters design system.

This package contains a small, framework-agnostic primitives layer (SSR-safe) and thin React adapters that implement a shadcn-compatible API. It is intended for rapid development of accessible, testable UI components while keeping runtime code framework-agnostic.

## Layout

- `src/primitives/` — Pure TypeScript DOM primitives (no React). Each primitive is SSR-aware and returns cleanup functions where applicable.
- `src/components/` — React adapters and component exports (drop-in shadcn/Radix API compatible).
- `test/` — Vitest tests that mirror `src/` (preferred location for tests).

Files of interest
- `src/primitives/types.ts` — shared primitive types (`CleanupFunction`, etc.)
- `src/primitives/focus-trap.ts` — focus trap and body scroll helpers
- `src/primitives/outside-click.ts` — pointer/mouse outside detection
- `src/primitives/portal.ts` — portal container helpers
- `src/components/ui/dialog.tsx` — Dialog component built on primitives

## Quick Start (development)

Install workspace deps from repo root (pnpm workspace):

```bash
pnpm install
```

Run unit tests for this package:

```bash
pnpm -C packages/ui run test:unit
```

Run component tests (Playwright CT):

```bash
pnpm -C packages/ui run test:component
```

Typecheck:

```bash
pnpm -C packages/ui run typecheck
```

## Testing conventions

- Unit tests live in `test/` and mirror the shape of `src/` (e.g. `test/primitives/*` ↔ `src/primitives/*`).
- Keep tests deterministic and environment-safe (many primitives are SSR-aware).
- Use `vitest` and `happy-dom` for DOM tests; component CT uses Playwright.

## Primitive development notes

- Primitives must be framework-agnostic: avoid importing React/Vue.
- All primitives should guard against SSR (`typeof window === 'undefined'` or `typeof document === 'undefined'`) and return no-op cleanup on server.
- Export small, strongly-typed APIs and centralize shared types in `src/primitives/types.ts`.
- Write unit tests exercising DOM behavior and cleanup functions.

## Tailwind & Tokens Requirement

- This package's React adapters and example components require **Tailwind CSS v4** and the Rafters token system to be present.
- Use Rafters design tokens for spacing, color, typography, etc., rather than arbitrary inline values.
- Do **not** use Tailwind's arbitrary/bracket syntax (for example: `w-[10px]`, `bg-[#fff]`, `p-[var(--x)]`, or similar `-[...]` notations). Always prefer token keys or theme values (e.g. `p-4`, `text-primary`, `bg-surface`).
- The build/test tooling and accessibility/intelligence features assume token-driven values; inline arbitrary values may break CI checks, token lookups, and accessibility calculations.

If you need a new utility or token, add it to the Rafters token registry rather than using bracketed arbitrary Tailwind values.

## Why no tailwind-merge?

The `classy` utility intentionally does NOT resolve Tailwind utility conflicts. If you pass `p-4 p-8`, both classes stay in the output - making overrides explicit and debuggable in the DOM.

The design system should be the source of truth. If you're frequently fighting it with utility conflicts, that's a signal to fix the design system, not paper over it with merge logic.

## Exports

The package exposes primitives and components via the `exports` field in `package.json`. Consumers can import directly from paths like:

```ts
import { createFocusTrap } from '@rafters/ui/primitives/focus-trap';
import { Dialog } from '@rafters/ui/dialog';
```

If you modify exported paths, update `package.json` accordingly.

## Contributing

- Add new primitive under `src/primitives` with strict types and tests in `test/primitives`.
- Add a small React adapter under `src/components` if a framework API is needed.
- Run `pnpm -C packages/ui run test:unit` before opening a PR.

## Troubleshooting

- If `vitest` reports "No test suite found" for a file inside `src/`, ensure tests are actually present under `test/` and remove duplicate/placeholder test files from `src/`.
- For Playwright CT failures in CI, ensure browsers are installed on the runner and that `pnpm -C packages/ui run test:component` is invoked after Playwright installation.

---

If you want, I can also add a short `CONTRIBUTING.md` with the primitive checklist (SSR, tests, types) or wire this README into the package manifest. Which would you prefer next?
