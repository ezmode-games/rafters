# @rafters/studio

Visual token editor for Rafters design system. Dev-only tool that runs alongside your project.

## Overview

Studio provides a visual interface for editing design tokens with:

- **Two-phase color selection**: Instant CSS feedback, then persist enriched ColorValue
- **Namespace-aware validation**: Each token type has specific validation rules
- **WebSocket HMR**: Real-time CSS updates without page reload
- **REST API**: Full CRUD operations on tokens

## Quick Start

```bash
# From your Rafters project
pnpm rafters studio

# Or standalone development
cd packages/studio
pnpm dev:standalone
```

Studio runs on `http://localhost:7777`

## API Reference

### Tokens

#### GET /api/tokens

List all tokens, optionally filtered by namespace.

```bash
# All tokens
curl http://localhost:7777/api/tokens

# Filter by namespace
curl http://localhost:7777/api/tokens?namespace=color
curl http://localhost:7777/api/tokens?namespace=semantic
curl http://localhost:7777/api/tokens?namespace=spacing
```

#### GET /api/tokens/:name

Get a specific token by name.

```bash
curl http://localhost:7777/api/tokens/primary-500
```

#### POST /api/tokens/:name

Update a token with namespace-specific validation.

```bash
# Color token - requires oklch() or ColorValue
curl -X POST http://localhost:7777/api/tokens/primary-500 \
  -H 'Content-Type: application/json' \
  -d '{"value": "oklch(0.6 0.2 250)"}'

# Semantic token - requires ColorReference
curl -X POST http://localhost:7777/api/tokens/primary \
  -H 'Content-Type: application/json' \
  -d '{"value": {"family": "blue", "position": "600"}, "trustLevel": "high"}'

# Depth token - requires numeric z-index
curl -X POST http://localhost:7777/api/tokens/depth-modal \
  -H 'Content-Type: application/json' \
  -d '{"value": "50", "elevationLevel": "modal"}'

# Spacing token - requires rem value
curl -X POST http://localhost:7777/api/tokens/spacing-4 \
  -H 'Content-Type: application/json' \
  -d '{"value": "1rem"}'
```

#### POST /api/tokens

Batch update multiple tokens (single persist operation).

```bash
curl -X POST http://localhost:7777/api/tokens \
  -H 'Content-Type: application/json' \
  -d '[
    {"name": "primary-50", "value": "oklch(0.98 0.02 250)", ...},
    {"name": "primary-100", "value": "oklch(0.95 0.04 250)", ...}
  ]'
```

### Color Intelligence

#### POST /api/color/build

Build complete ColorValue from OKLCH using `@rafters/color-utils`.

```bash
curl -X POST http://localhost:7777/api/color/build \
  -H 'Content-Type: application/json' \
  -d '{
    "oklch": {"l": 0.5, "c": 0.15, "h": 240},
    "options": {"token": "primary", "use": "Brand color"}
  }'
```

Returns:
- 11-position scale (50-950)
- Harmonies (complementary, triadic, analogous, tetradic)
- Accessibility (WCAG AA/AAA, APCA, contrast ratios)
- Analysis (temperature, lightness)
- Semantic suggestions

### WebSocket

#### rafters:set-token

Update token with optional persistence.

```typescript
import.meta.hot?.send('rafters:set-token', {
  name: 'primary-500',
  value: 'oklch(0.6 0.2 250)',
  persist: false  // instant feedback, no disk write
});
```

#### rafters:css-updated

Listen for CSS regeneration events.

```typescript
import.meta.hot?.on('rafters:css-updated', () => {
  // CSS has been regenerated
});
```

## Namespace Validation

Each namespace has specific validation rules:

| Namespace | Value Format | Optional Fields |
|-----------|--------------|-----------------|
| color | `oklch()` or ColorValue | scalePosition |
| semantic | ColorReference | trustLevel, consequence |
| spacing | rem string | scalePosition |
| depth | numeric z-index | elevationLevel |
| motion | ms or cubic-bezier() | motionIntent |
| radius | rem, "0", "9999px" | scalePosition |
| focus | string | accessibilityLevel |
| typography | string | lineHeight |
| breakpoint | px or rem | viewportAware |
| shadow | CSS shadow | shadowToken |
| elevation | string | elevationLevel |

## Two-Phase Color Selection

1. **Instant feedback** (`persist: false`)
   - User picks color
   - Token updated in memory
   - CSS regenerated via HMR
   - User sees changes immediately

2. **Complete save** (`persist: true`)
   - Call `/api/color/build` to get enriched ColorValue
   - Update token with full ColorValue
   - Persisted to disk

## Architecture

```
packages/studio/
  src/
    api/
      index.ts         # Client-side API (setToken, onCssUpdated)
      vite-plugin.ts   # Server-side handlers + WebSocket
  test/
    api/
      vite-plugin.test.ts  # 149 tests
```

**THIN UI Pattern**: Studio is just a UI layer. All intelligence lives in:
- `@rafters/color-utils` - Color calculations
- `@rafters/design-tokens` - TokenRegistry, persistence
- `@rafters/shared` - Zod schemas, types

## Development

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Environment Variables

- `RAFTERS_PROJECT_PATH` - Path to the Rafters project (set by CLI)
