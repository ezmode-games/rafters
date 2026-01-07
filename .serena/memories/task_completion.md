# Task Completion Checklist

When a coding task is completed, run these checks:

## 1. Type Checking
```bash
pnpm typecheck
```
Ensure no TypeScript errors across all packages.

## 2. Linting
```bash
pnpm lint:fix
```
Fix any linting issues. Review and address any that can't be auto-fixed.

## 3. Unit Tests
```bash
pnpm test:unit
```
Ensure all unit tests pass. If you added new functionality, add tests.

## 4. Quick Validation (Recommended)
```bash
pnpm test:quick
```
Runs unit + component tests for faster feedback.

## 5. Full Preflight (Before Commit)
```bash
pnpm preflight
```
This runs: typecheck → lint → test:unit → test:a11y → build

## 6. For Component Changes
If you modified UI components:
```bash
pnpm test:component
pnpm test:a11y
```

## 7. For Major Changes
```bash
pnpm test:all
```
Runs full preflight + e2e tests.

## Git Hooks
The repository has automated hooks via Lefthook:
- **Pre-commit:** Auto-runs lint, typecheck, and unit tests for changed packages
- **Pre-push:** Auto-runs full `pnpm preflight`

These hooks will catch issues automatically, but running checks manually helps catch problems earlier.

## Minimum Requirements
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (or `lint:fix` applied)
- [ ] `pnpm test:unit` passes
- [ ] New code has test coverage (target: 80%+)
- [ ] Components include cognitive load metadata
- [ ] No emojis in code/comments
