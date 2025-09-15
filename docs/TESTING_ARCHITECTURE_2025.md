# Rafters Testing Architecture 2025

Modern monorepo testing setup optimized for Cloudflare Workers deployment and 2025 development standards.

## 🎯 Testing Philosophy

**Focus on OUR code, not external services**
- Test our business logic, not Claude/OpenAI API availability
- Mock external dependencies at module boundaries
- Prioritize fast, reliable tests that don't depend on network

**Progressive Testing Strategy**
1. **Unit Tests** (`.test.ts`) - Pure functions, isolated logic
2. **Integration Tests** (`.spec.ts`) - Cloudflare Workers runtime
3. **Component Tests** (`.component.test.ts`) - React components with Playwright
4. **E2E Tests** (`.e2e.ts`) - Full user workflows

## 🛠 Technology Stack

### Core Requirements (2025 Standards)
- **Node.js**: 22+ LTS (no older versions)
- **pnpm**: 10+ (latest package manager)
- **Vitest**: 3.2+ (modern test runner)
- **Cloudflare Workers**: Latest runtime compatibility

### Testing Tools
- **Unit Testing**: Vitest with Node environment
- **Integration Testing**: `@cloudflare/vitest-pool-workers`
- **Component Testing**: Playwright Component Testing
- **E2E Testing**: Playwright browser automation
- **Coverage**: Vitest v8 coverage provider

## 📁 Test File Organization

```
apps/website/
├── src/                    # Source code
│   └── app/api/route.ts
└── test/                   # Mirror structure of src
    └── api/
        ├── route.test.ts   # Unit tests (isolated functions)
        ├── route.spec.ts   # Integration tests (Workers runtime)
        └── route.e2e.ts    # E2E tests (full browser)

packages/ui/
├── src/components/Button.tsx
└── test/components/
    ├── Button.test.ts           # Unit logic tests
    ├── Button.component.test.ts # Playwright component tests
    └── Button.stories.ts        # Storybook (documentation + test cases)
```

## ⚙️ Configuration Files

### Root Configuration
- `vitest.config.ts` - Base configuration with monorepo aliases
- `vitest.workspace.ts` - Multi-project workspace orchestration
- `pnpm-workspace.yaml` - Dependency catalog for version consistency

### Cloudflare Integration
- `wrangler.jsonc` - Cloudflare Workers configuration (NOT .toml)
- `vitest.config.cloudflare.ts` - Workers runtime testing

### Key Configuration Patterns

```typescript
// vitest.workspace.ts - Integration testing
{
  test: {
    name: 'integration',
    include: ['**/*.spec.ts'],
    pool: '@cloudflare/vitest-pool-workers',
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' }, // Modern JSONC format
        bindings: {
          RAFTERS_INTEL: { type: 'kv' },
          NODE_ENV: 'test'
          // NO external API keys - we don't test external services
        }
      }
    }
  }
}
```

## 🚀 Test Commands

### Local Development
```bash
# Run all tests
pnpm test

# Watch mode for rapid development
pnpm test:watch

# Run specific test types
pnpm test:unit          # Fast unit tests only
pnpm test:integration   # Cloudflare Workers runtime
pnpm test:component     # Playwright component tests
pnpm test:e2e          # Full browser E2E tests

# Coverage analysis
pnpm test:coverage
```

### CI/CD Pipeline
```bash
# Full CI test suite
pnpm test:ci

# Sharded execution for large test suites
pnpm test:ci:sharded

# Performance benchmarking
pnpm test:benchmark
```

### Pre-commit Validation
```bash
# MANDATORY before every commit
pnpm preflight

# Includes: lint, typecheck, unit tests, integration tests
# Must pass 100% - no exceptions
```

## 🎭 Component Testing Strategy

**Playwright Component Testing as Primary UI Test Method**

```typescript
// Button.component.test.ts
import { test, expect } from '@playwright/experimental-ct-react'
import { Button } from './Button'

test('renders with correct variant styles', async ({ mount }) => {
  const component = await mount(<Button variant="primary">Click me</Button>)

  await expect(component).toBeVisible()
  await expect(component).toHaveClass(/bg-primary/)

  // Test interaction
  await component.click()
  await expect(component).toHaveFocus()
})
```

**Benefits over traditional unit testing:**
- Real browser rendering (catches CSS/layout issues)
- True user interaction simulation
- Built-in accessibility testing
- Visual regression capabilities
- Fast execution (faster than full E2E)

## 🔧 Cloudflare Workers Testing

**Integration tests run in actual Workers runtime:**

```typescript
// api.spec.ts
import { SELF } from 'cloudflare:test'

test('color intelligence API', async () => {
  const response = await SELF.fetch('/api/color-intel', {
    method: 'POST',
    body: JSON.stringify({ color: '#3b82f6' })
  })

  expect(response.status).toBe(200)
  const data = await response.json()
  expect(data.intelligence).toBeDefined()
})
```

**Key Features:**
- Access to KV, R2, D1 bindings
- Isolated test environment per test
- No external API dependencies
- Real Workers runtime behavior

## 🚨 What We DON'T Test

**External Services (It's up or it's down)**
- ❌ Claude API availability
- ❌ OpenAI API response times
- ❌ Third-party service endpoints
- ❌ Network connectivity issues

**Instead We Test:**
- ✅ Our error handling when external services fail
- ✅ Proper request formatting before sending to APIs
- ✅ Response parsing and data transformation
- ✅ Fallback behavior and graceful degradation

## 📊 CI/CD Configuration

### GitHub Actions (`.github/workflows/test-matrix.yml`)

**2025 Standards Applied:**
- Node 22 and 24 (current LTS versions)
- pnpm 10 (latest version)
- NO Turbo Team dependencies (local Turbo only)
- NO external API testing
- Parallel execution with intelligent sharding

**Test Matrix:**
- **Unit Tests**: Cross-platform (Ubuntu, macOS, Windows)
- **Integration Tests**: Ubuntu with Workers runtime
- **Component Tests**: Multi-browser (Chromium, Firefox, WebKit)
- **E2E Tests**: Production-like environment

## 🏗 Future-Ready Patterns

### AI-Powered Test Analysis
```bash
# Analyze test patterns and suggest improvements
pnpm test:ai-insights

# Smart test selection based on code changes
pnpm test:smart
```

### Distributed Testing
```bash
# Coordinate tests across multiple machines
pnpm test:distributed
```

### Performance Monitoring
```bash
# Track test performance over time
pnpm test:performance

# Memory usage analysis
pnpm test:memory
```

## 🎯 Key Principles for 2025

1. **Speed First**: Tests should run fast locally and in CI
2. **Reliability**: No flaky tests due to external dependencies
3. **Maintainability**: Test structure mirrors source structure
4. **Real Environments**: Use actual Cloudflare Workers runtime
5. **Progressive Enhancement**: Layer testing from unit → integration → E2E
6. **Developer Experience**: Fast feedback loops with watch modes

## 📈 Success Metrics

- **Unit Tests**: >90% coverage, <10s execution time
- **Integration Tests**: Real Workers behavior, <30s execution time
- **Component Tests**: Visual + behavioral validation, <60s execution time
- **E2E Tests**: Critical user paths, <5min total execution time
- **CI Pipeline**: <10min total time, reliable green builds

This architecture ensures robust testing while maintaining development velocity and focusing on what we actually control.