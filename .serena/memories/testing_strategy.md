# Testing Strategy

Full details in `docs/TEST_STRATEGY.md` and `docs/TEST_STRATEGY_SUMMARY.md`.

## Testing Principles
- **Property-based testing** with zocker for schema-driven validation
- **Real fixtures** over brittle hardcoded mocks
- Test **behavior**, not implementation details
- **MANDATORY accessibility tests** for UI components
- Critical path coverage before edge cases

## Test File Structure
```
packages/[package]/
├── src/
│   └── [module].ts
└── test/
    ├── [module].test.ts      # Unit tests
    ├── [module].a11y.tsx     # Accessibility (MANDATORY for UI)
    ├── [module].spec.ts      # Integration tests
    └── fixtures.ts           # Zocker-generated test data
```

## Package Coverage Targets
| Package              | Target | Priority Areas                    |
|---------------------|--------|-----------------------------------|
| @rafters/shared     | 95%    | Schemas (100%), Components (100%) |
| @rafters/math-utils | 100%   | Pure functions                    |
| @rafters/color-utils| 95%    | WCAG (100%), Conversion (100%)    |
| @rafters/design-tokens| 90%  | Registry (100%), Dependencies     |

## Property-Based Testing with Zocker
```typescript
import { zocker } from 'zocker';

// Generate 100 random valid tokens, test property holds for ALL
const tokens = zocker(z.array(TokenSchema).length(100)).generate();
for (const token of tokens) {
  expect(TokenSchema.parse(token)).toBeDefined();
}
```

## Accessibility Tests (MANDATORY for UI)
Every UI component needs `.a11y.tsx`:
```typescript
import { axe } from 'vitest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Key Commands
```bash
pnpm test                              # All tests
pnpm --filter=@rafters/shared test     # Specific package
pnpm test:a11y                         # Accessibility only
pnpm test:coverage                     # Coverage report
```
