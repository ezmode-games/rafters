# Testing Utilities

This directory contains shared testing utilities for the Rafters monorepo.

## ⚠️ Known Limitations

**zod-schema-faker** does not support:
- `.refine()` - Custom validation rules
- `.superRefine()` - Advanced validation logic

If you need fixtures for schemas with these features, you'll need to create manual fixtures using faker directly or remove the refinements for testing purposes.

## Quick Start

```typescript
import { createComponentManifestFixture } from '@rafters/shared/test/fixtures';
import { handlers } from '@rafters/shared/test/msw-handlers';
import { setupServer } from 'msw/node';

// Generate test fixtures
const manifest = createComponentManifestFixture();

// Setup MSW for integration tests
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Available Generators

### Basic Types

```typescript
// OKLCH Color
const color = createOKLCHFixture({
  overrides: { h: 250, l: 0.7 },
  seed: 42, // Deterministic generation
});

// Color Value with Scale
const colorValue = createColorValueFixture({
  overrides: {
    name: 'ocean-blue',
    token: 'primary',
  },
});
```

### Design Tokens

```typescript
// Semantic Token
const token = createTokenFixture({
  overrides: {
    name: 'color-primary-500',
    category: 'color',
    cognitiveLoad: 3,
  },
});
```

### Component Metadata

```typescript
// CVA Intelligence
const cva = createCVAIntelligenceFixture({
  overrides: {
    baseClasses: ['btn', 'rounded'],
  },
});

// Full Intelligence
const intelligence = createIntelligenceFixture({
  overrides: {
    cognitiveLoad: 2,
    cva: createCVAIntelligenceFixture(),
  },
});
```

### Component Previews

```typescript
// Preview
const preview = createPreviewFixture({
  overrides: {
    framework: 'react',
    variant: 'default',
  },
});
```

### Component Manifests

```typescript
// Full Manifest
const manifest = createComponentManifestFixture({
  overrides: {
    name: 'button',
    description: 'A button component',
  },
});
```

## Bulk Generation

```typescript
import { createFixtures } from '@rafters/shared/test/fixtures';

// Generate multiple fixtures
const tokens = createFixtures(createTokenFixture, 10, {
  seed: 100, // All will be deterministic
});

// Generate with unique data
const manifests = createFixtures(createComponentManifestFixture, 5);
```

## MSW Integration

```typescript
import { setupServer } from 'msw/node';
import { handlers } from '@rafters/shared/test/msw-handlers';

const server = setupServer(...handlers);

// In test setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override handler for specific test
import { http, HttpResponse } from 'msw';
import { createComponentManifestFixture } from '@rafters/shared/test/fixtures';

it('should handle custom response', async () => {
  server.use(
    http.get('/api/registry/custom', () => {
      return HttpResponse.json(
        createComponentManifestFixture({ overrides: { name: 'custom' } })
      );
    })
  );

  // Test with overridden handler
});
```

## Available Handlers

### Component Registry
- `GET /api/registry/:name` - Get component manifest
- `GET /api/registry` - List all components
- `POST /api/registry` - Create component

### Color Intelligence
- `POST /api/color-intel` - Get AI color analysis
- `POST /api/color-intel/batch` - Batch color analysis

### Design Tokens
- `GET /api/tokens/:system` - Get tokens for design system
- `POST /api/tokens/validate` - Validate token structure

### Error Simulation
- `GET /api/registry/nonexistent` - 404 Not Found
- `POST /api/registry/protected` - 401 Unauthorized
- `GET /api/error` - 500 Server Error
- `GET /api/slow` - Network timeout simulation

## Best Practices

### 1. Use Seeds for Deterministic Tests

```typescript
it('should generate consistent data', () => {
  const fixture1 = createTokenFixture({ seed: 42 });
  const fixture2 = createTokenFixture({ seed: 42 });
  expect(fixture1).toEqual(fixture2); // ✓ Pass
});
```

### 2. Override Only What's Necessary

```typescript
// Good - only override what matters for the test
const manifest = createComponentManifestFixture({
  overrides: { name: 'button' },
});

// Bad - overriding too much defeats purpose of fixtures
const manifest = createComponentManifestFixture({
  overrides: {
    name: 'button',
    type: 'registry:component',
    dependencies: ['react'],
    // ... 50 more lines
  },
});
```

### 3. Use Realistic Defaults

```typescript
// Fixtures provide realistic defaults
const token = createTokenFixture();

// No need to specify everything
expect(token.name).toBeDefined();
expect(token.category).toBeDefined();
expect(token.namespace).toBeDefined();
```

### 4. Validate with Schemas

```typescript
import { ComponentManifestSchema } from '@rafters/shared/types';

it('should generate valid manifest', () => {
  const manifest = createComponentManifestFixture();

  // Always valid
  expect(ComponentManifestSchema.safeParse(manifest).success).toBe(true);
});
```

### 5. Test Edge Cases Explicitly

```typescript
it('should handle optional fields', () => {
  const token = createTokenFixture({
    overrides: {
      deprecated: true,
      description: undefined,
    },
  });

  expect(token.deprecated).toBe(true);
  expect(token.description).toBeUndefined();
});
```

## TypeScript Support

All fixtures are fully typed:

```typescript
import type { ComponentManifest, Token } from '@rafters/shared/types';

const manifest: ComponentManifest = createComponentManifestFixture();
const token: Token = createTokenFixture();

// Type-safe overrides
const customManifest = createComponentManifestFixture({
  overrides: {
    name: 'button', // ✓ Type-safe
    // @ts-expect-error - invalid field
    invalidField: 'value', // ✗ Compile error
  },
});
```

## Performance

Fixture generation is fast:
- Single fixture: ~0.5ms
- Bulk generation (10): ~5ms
- MSW response: ~1-5ms

Safe to use in test suites without performance concerns.

## Examples

See test files for complete examples:
- `fixtures.test.ts` - Unit test examples (21 tests)
- `integration-example.test.ts` - Integration test examples (7 tests)
- `msw-handlers.ts` - Handler implementations

## Troubleshooting

### Issue: Fixtures generate random data each time

**Solution:** Use seeds for deterministic generation:
```typescript
const fixture = createTokenFixture({ seed: 42 });
```

### Issue: Need custom generator for specific type

**Solution:** Use overrides with explicit values:
```typescript
const fixture = createTokenFixture({
  overrides: {
    value: myCustomValue,
  },
});
```

### Issue: MSW handler not being called

**Solution:** Check handler URL matches fetch URL exactly:
```typescript
// Handler
http.get('https://api.rafters.dev/api/registry/:name', ...)

// Fetch
fetch('https://api.rafters.dev/api/registry/button')
```

### Issue: Zod validation fails on generated fixture

**Solution:** Check schema definitions match between generator and usage:
```typescript
// Should not happen - fixtures always generate valid data
// If it does, file a bug report with reproduction
```

## Contributing

When adding new schemas:

1. Add generator to `fixtures.ts`
2. Add tests to `fixtures.test.ts`
3. Add MSW handler if needed in `msw-handlers.ts`
4. Update this README with usage example

## References

- [zod-schema-faker](https://github.com/soc221b/zod-schema-faker)
- [MSW Documentation](https://mswjs.io/)
- [Vitest Testing Guide](https://vitest.dev/)
