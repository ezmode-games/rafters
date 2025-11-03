# Rafters V2 Test Strategy - Executive Summary

## Quick Reference

### Test File Structure Pattern
```
packages/[package]/
├── src/
│   └── [module].ts
└── test/
    ├── [module].test.ts      # Unit tests (logic, pure functions)
    ├── [module].a11y.tsx     # Accessibility (MANDATORY for UI)
    ├── [module].spec.ts      # Integration tests
    └── fixtures.ts           # Zocker-generated test data
```

---

## Package Overview & Test Priorities

### 1. @rafters/shared (Foundation)
**What it is:** W3C DTCG schemas, shared types, Logo component

**Test Priority:**
1. Schema validation (zocker property-based)
2. Component rendering
3. **MANDATORY accessibility tests**

**Key Files:**
- `test/types.test.ts` - OKLCH, Token, ColorValue schemas
- `test/components.test.tsx` - Logo rendering
- `test/components.a11y.tsx` - Logo accessibility (MANDATORY)

**Start Here:** Schema tests first, they're the foundation for everything.

---

### 2. @rafters/math-utils (Pure Math)
**What it is:** Mathematical progressions, unit conversions, calculations

**Test Priority:**
1. Progression accuracy (property-based)
2. Unit conversions
3. Math operations

**Key Files:**
- `test/progressions.test.ts` - Golden ratio, musical ratios, modular scales
- `test/calculations.test.ts` - Clamp, normalize, interpolate
- `test/units.test.ts` - px/rem conversions

**Note:** 100% coverage achievable (pure functions).

---

### 3. @rafters/color-utils (Color Science)
**What it is:** OKLCH color manipulation, WCAG accessibility, harmonies

**Test Priority:**
1. **Conversion accuracy** (round-trip oklch ↔ hex)
2. **WCAG calculations** (critical path - AA/AAA compliance)
3. Color harmonies (complementary, triadic, etc.)
4. Scale generation

**Key Files:**
- `test/conversion.test.ts` - OKLCH ↔ Hex (property-based)
- `test/accessibility.test.ts` - Contrast ratios, WCAG validation
- `test/harmony.test.ts` - Color harmony algorithms
- `test/generator.test.ts` - Scale generation logic

**Critical:** WCAG tests must be bulletproof - this is user-facing accessibility.

---

### 4. @rafters/design-tokens (Complex)
**What it is:** TokenRegistry, dependency graph, rule execution engine

**Test Priority:**
1. **Registry CRUD** (add, update, remove tokens)
2. **Dependency tracking** (prevent circular dependencies)
3. **Rule execution** (calc, state, scale, contrast, invert)
4. **Integration tests** (end-to-end token system)

**Key Files:**
- `test/registry.test.ts` - Core registry operations
- `test/dependencies.test.ts` - Dependency graph (topological sort)
- `test/rules.test.ts` - Rule parsing and execution
- `test/integration.spec.ts` - End-to-end token flows

**Note:** Most complex package - use integration tests to validate behavior.

---

## Testing Approach Summary

### Property-Based Testing with Zocker

**Why:** Tests work with ANY valid data shape, auto-generates edge cases, schema changes propagate automatically.

```typescript
// Generate 100 random valid tokens
const tokens = zocker(z.array(TokenSchema).length(100)).generate();

// Test property: "For all valid tokens, schema parses successfully"
tokens.forEach(token => {
  expect(TokenSchema.parse(token)).toBeDefined();
});
```

### Real Fixtures Over Mocks

```typescript
// ✅ Good - Schema-generated data
const color = zocker(OKLCHSchema).generate();

// ❌ Bad - Brittle hardcoded mock
const color = { l: 0.5, c: 0.2, h: 240 }; // Will break if schema changes
```

### Accessibility Testing (MANDATORY)

Every UI component MUST have `.a11y.tsx` file:

```typescript
// test/components.a11y.tsx
import { axe } from 'vitest-axe';

describe('Component - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Testing Order (3-Week Plan)

### Week 1: Foundation
- [ ] @rafters/shared - Schema tests
- [ ] @rafters/shared - Logo tests + a11y
- [ ] @rafters/math-utils - All progression tests

### Week 2: Core Functionality
- [ ] @rafters/color-utils - Conversion tests
- [ ] @rafters/color-utils - WCAG accessibility tests
- [ ] @rafters/color-utils - Harmony + generation
- [ ] @rafters/design-tokens - Registry CRUD

### Week 3: Advanced Features
- [ ] @rafters/design-tokens - Dependency graph
- [ ] @rafters/design-tokens - Rule execution
- [ ] @rafters/design-tokens - Integration tests
- [ ] All packages - Coverage threshold verification

---

## Critical Test Cases by Priority

### Priority 1: MUST HAVE (Before any commits)
- [ ] Schema validation tests (@rafters/shared)
- [ ] OKLCH ↔ Hex round-trip (@rafters/color-utils)
- [ ] WCAG contrast calculations (@rafters/color-utils)
- [ ] Registry CRUD operations (@rafters/design-tokens)
- [ ] Dependency circular prevention (@rafters/design-tokens)

### Priority 2: SHOULD HAVE (Before refactoring complete)
- [ ] Logo accessibility tests (@rafters/shared)
- [ ] Mathematical progression accuracy (@rafters/math-utils)
- [ ] Color harmony algorithms (@rafters/color-utils)
- [ ] Rule execution engine (@rafters/design-tokens)
- [ ] Integration end-to-end tests (@rafters/design-tokens)

### Priority 3: NICE TO HAVE (After refactoring)
- [ ] Performance benchmarks
- [ ] Edge case coverage
- [ ] Plugin tests (all 5 rule types)
- [ ] Generator tests (20+ token types)

---

## Coverage Targets

| Package           | Target | Priority Components                    |
|-------------------|--------|----------------------------------------|
| @rafters/shared   | 95%    | Schemas (100%), Components (100%)      |
| @rafters/math-utils | 100% | Pure functions (100%)                  |
| @rafters/color-utils | 95% | WCAG (100%), Conversion (100%)         |
| @rafters/design-tokens | 90% | Registry (100%), Dependencies (100%) |

---

## Test Commands Quick Reference

```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter=@rafters/design-tokens test

# Watch mode
pnpm --filter=@rafters/color-utils test:watch

# Coverage
pnpm test:coverage

# Accessibility tests only
pnpm test:a11y
```

---

## Key Decisions Required

1. **Coverage thresholds** - 80-95% acceptable? Lower for complex integration code?
2. **Property-based testing scope** - How many random samples per test? (Current: 100)
3. **Integration test depth** - Full design system generation or targeted scenarios?
4. **Test data determinism** - Use fixed seeds for repeatable tests?
5. **Performance benchmarks** - Add regression tests for large token registries?

---

## Success Criteria

### Before Marking Package "Done"
- [ ] All Priority 1 tests passing
- [ ] Coverage threshold met
- [ ] MANDATORY accessibility tests present (UI components only)
- [ ] No skipped tests (without documentation)
- [ ] Integration tests validate critical paths

### Before Merging to Main
- [ ] All 4 packages test suites passing
- [ ] CI pipeline green
- [ ] Code coverage reports uploaded
- [ ] No circular dependency warnings
- [ ] Accessibility audit clean

---

## Common Patterns & Templates

### Property-Based Test Template
```typescript
import { zocker } from 'zocker';

it('PROPERTY: [description]', () => {
  const data = zocker(z.array(Schema).length(100)).generate();

  data.forEach(item => {
    // Test that property holds for ALL valid data
    expect(/* property */).toBe(/* expected */);
  });
});
```

### Integration Test Template
```typescript
it('end-to-end: [user flow]', async () => {
  // Arrange: Set up registry with tokens
  const registry = new TokenRegistry([/* tokens */]);

  // Act: Perform actions
  await registry.set('base', 'new-value');

  // Assert: Verify cascading effects
  expect(registry.get('derived')?.value).toBe('expected');
});
```

### Accessibility Test Template
```typescript
import { axe } from 'vitest-axe';

describe('[Component] - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Next Actions

1. **Review full strategy** - See `TEST_STRATEGY.md` for detailed test cases
2. **Set up infrastructure** - vitest.config.ts, test utilities, fixtures
3. **Start with @rafters/shared** - Foundation schemas first
4. **Iterate weekly** - Review progress, adjust priorities
5. **Document learnings** - Update strategy based on real refactoring challenges

---

**Quick Start:** Read this summary, then dive into `TEST_STRATEGY.md` for complete test implementation details.
