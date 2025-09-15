# Rafters UI Testing Architecture 2025-2026
**Future-Ready Testing for AI-First Design Intelligence**

## Overview

This testing architecture is designed for 2025-2026 requirements, enabling AI agents to consume design intelligence, validating React 19 concurrent features, and ensuring edge-first Cloudflare Workers compatibility.

## Testing Strategy

### Three-Layer Testing Architecture

1. **Unit Tests** (`.test.ts`) - Vitest with Node environment
2. **Integration Tests** (`.spec.ts`) - Vitest with Cloudflare Workers runtime
3. **Component Tests** (`.component.ts`) - Playwright Component Testing (PRIMARY UI method)

## Test Commands

```bash
# Unit tests - Pure functions and logic
pnpm test

# Watch mode for development
pnpm test:watch

# Integration tests - Cloudflare Workers runtime
pnpm test:integration

# Component tests - Real browser testing (PRIMARY UI method)
pnpm test:component

# Full preflight - All tests must pass before commit
pnpm test:preflight
```

## File Structure

```
test/
├── setup.ts                           # Global test setup
├── setup.cloudflare.ts                # Workers test setup
├── utils/                             # Testing utilities
│   ├── intelligence-validators.ts     # AI intelligence testing
│   ├── react19-helpers.ts            # React 19 patterns
│   └── design-assertions.ts          # Design system testing
├── fixtures/                         # Reusable test data
├── integration/                      # Workers integration tests
│   └── design-intelligence-api.spec.ts
└── components/                       # Component tests
    ├── Button.test.ts               # Unit tests
    ├── Button.component.ts          # Component tests (PRIMARY)
    ├── Button.intelligence.test.ts  # AI intelligence validation
    └── Button.e2e.ts               # E2E integration tests
```

## Core Testing Principles

### 1. AI Intelligence Validation

Every component test validates:
- JSDoc intelligence is AI-consumable
- Design patterns are machine-readable
- Component guidance enables AI decision-making
- Semantic tokens are properly used

```tsx
test('validates AI consumability', () => {
  expect(Button.toString()).toHaveValidIntelligence()
  expect(Button.toString()).toBeAIConsumable()
})
```

### 2. React 19 Compatibility

All components must pass:
- Purity validation (no side effects in render)
- Concurrent rendering compatibility
- Modern hook pattern support
- Direct ref prop patterns

```tsx
test('React 19 compatibility', async () => {
  expect(Button).toBeReact19Compatible()
  expect(Button).toBePure()
  expect(Button).toHandleConcurrentRendering()
})
```

### 3. Design System Intelligence

Tests validate:
- Cognitive load correlates with complexity
- Attention economics match implementation
- Trust building patterns work correctly
- Accessibility compliance is accurate

```tsx
test('intelligence matches implementation', () => {
  const intelligence = extractComponentIntelligence(Button.toString())
  expect(intelligence.cognitiveLoad).toBe(3)
  expect(Button.toString()).toContain('destructiveConfirm')
})
```

## Component Testing (PRIMARY METHOD)

**Why Playwright Component Testing over jsdom:**
- React 19 concurrent features require real browser environment
- True browser rendering validates design intelligence
- Cross-browser consistency testing
- Real user interaction validation
- Visual regression testing capabilities

```tsx
// test/components/Button.component.ts
test('validates cognitive load through visual hierarchy', async ({ mount }) => {
  const component = await mount(<Button variant="primary">Save</Button>)

  // Test real browser behavior
  await expect(component).toBeVisible()
  await expect(component).toHaveAccessibleName('Save')

  // Validate design intelligence
  const styles = await component.evaluate(el => getComputedStyle(el))
  expect(parseInt(styles.fontWeight)).toBeGreaterThanOrEqual(500)
})
```

## AI Agent Testing

Mock AI agents test intelligence consumption:

```tsx
test('AI makes correct design decisions', async () => {
  const mockAI = new MockAIAgent()
  const intelligence = await mockAI.parseComponentIntelligence(Button.toString())

  const decision = await mockAI.makeDesignDecision(intelligence, {
    isDestructiveAction: true,
    consequenceLevel: 'high',
  })

  expect(decision.recommendation).toBe('require-confirmation')
  expect(decision.confidence).toBeGreaterThan(0.9)
})
```

## Cloudflare Workers Integration

Tests run in real Workers runtime:

```tsx
// test/integration/design-intelligence-api.spec.ts
test('retrieves component intelligence from KV', async () => {
  const intelligence = await getComponentIntelligence('button')

  expect(intelligence.cognitiveLoad).toBe(3)
  expect(intelligence.attentionEconomics).toContain('Primary variant')
})
```

## Custom Test Matchers

### Intelligence Validation
- `toHaveValidIntelligence()` - Component has required JSDoc intelligence
- `toBeAIConsumable()` - AI agents can parse and use intelligence
- `toMatchDesignPatterns()` - Component follows expected patterns

### React 19 Compatibility
- `toBeReact19Compatible()` - Full React 19 compatibility
- `toBePure()` - Component is pure for concurrent rendering
- `toHandleConcurrentRendering()` - Multiple renders work correctly

### Design System
- `toHaveValidDesignSystemIntelligence()` - System-wide intelligence validation
- `toMeetAccessibilityStandards()` - WCAG compliance validation
- `toUseSemanticTokensOnly()` - No arbitrary values used

## Configuration Files

### `vitest.config.ts` - Unit Testing
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
  }
})
```

### `vitest.config.cloudflare.ts` - Workers Integration
```typescript
export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
        bindings: {
          RAFTERS_INTEL: { type: 'kv' },
          DESIGN_TOKENS: { type: 'kv' },
        }
      }
    }
  }
})
```

### `playwright.config.component.ts` - Component Testing
```typescript
export default defineConfig({
  testDir: './test',
  testMatch: '**/*.component.ts',
  use: {
    ctViteConfig: {
      resolve: {
        alias: {
          '@': './src',
          '@rafters/design-tokens': '../design-tokens/src',
        }
      }
    }
  }
})
```

## Running Tests

### Development Workflow
```bash
# Start with unit tests
pnpm test

# Then component tests for UI validation
pnpm test:component

# Integration tests for Workers APIs
pnpm test:integration

# Full preflight before commit
pnpm test:preflight
```

### CI/CD Pipeline
```bash
# All tests must pass in CI
turbo run preflight
```

## Migration from Legacy Testing

### From jsdom to Playwright Component Testing
1. Move UI component tests to `.component.ts` files
2. Use `mount()` instead of `render()`
3. Add cross-browser test configurations
4. Include visual regression testing

### From Manual Intelligence Checks to Automated Validation
1. Add JSDoc intelligence to all components
2. Use `extractComponentIntelligence()` in tests
3. Validate AI consumability with custom matchers
4. Test design pattern implementation correlation

### From React 18 to React 19 Patterns
1. Validate component purity with `toBePure()`
2. Test concurrent rendering with `toHandleConcurrentRendering()`
3. Update ref patterns to direct props
4. Add modern hook pattern testing

## Future-Proofing

This architecture scales with:
- **AI Agent Evolution** - Testing framework adapts to new AI capabilities
- **React Ecosystem Changes** - Component testing remains browser-native
- **Cloudflare Platform Growth** - Workers testing scales with new features
- **Design System Maturation** - Intelligence validation grows with complexity

## Success Metrics

- **100%** of components have AI-consumable intelligence
- **All** components pass React 19 concurrent rendering tests
- **Zero** arbitrary values in component implementations
- **Full** WCAG AAA compliance across all components
- **Sub-10ms** average KV query performance in Workers tests

The goal is testing infrastructure that enables the 2025-2026 vision of AI agents consuming design intelligence to create exceptional user experiences systematically.