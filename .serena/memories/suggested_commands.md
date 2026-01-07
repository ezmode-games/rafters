# Suggested Commands

## Package Manager
**MUST use pnpm** - npm/yarn will not work with this monorepo.

## Development
```bash
pnpm dev              # Start all apps in parallel dev mode
pnpm build            # Build all packages
```

## Testing
```bash
pnpm test             # Run all tests in all packages
pnpm test:unit        # Unit tests only
pnpm test:component   # Component tests only  
pnpm test:e2e         # End-to-end tests
pnpm test:a11y        # Accessibility tests (playwright with @a11y tag)
pnpm test:quick       # Unit + component tests (fast feedback)
pnpm test:all         # preflight + e2e (full CI)
pnpm test:watch       # Unit tests in watch mode
```

## Code Quality
```bash
pnpm typecheck        # TypeScript type checking across all packages
pnpm lint             # Biome linting
pnpm lint:fix         # Biome linting with auto-fix
pnpm format           # Biome formatting with auto-fix
```

## Pre-Commit/Pre-Push (Automated)
```bash
pnpm preflight        # Full validation: typecheck + lint + test:unit + test:a11y + build
pnpm ci               # CI command: preflight + test:e2e
```

## Cleanup
```bash
pnpm clean            # Remove node_modules and dist from all packages
```

## Git Hooks (Lefthook)
Pre-commit hooks run automatically:
- Biome lint (with auto-fix)
- TypeScript typecheck
- Unit tests for changed packages

Pre-push hooks run automatically:
- Full `pnpm preflight`

## System Utilities
- `git` - Version control
- `ls`, `cd`, `grep`, `find` - Standard Linux commands
- The project runs on Linux

## Package-Specific Commands
Run commands in specific packages:
```bash
pnpm --filter @rafters/ui test:unit       # Test specific package
pnpm --filter @rafters/cli build          # Build specific package
```
