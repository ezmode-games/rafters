# Rafters Monorepo Testing Implementation Guide
**Step-by-Step Testing Setup for All Package Types**

## Implementation Overview

This guide walks through implementing comprehensive testing across the entire Rafters monorepo - from pure TypeScript packages (shared, color-utils, design-tokens) to React components (ui), CLI tools, and Cloudflare Workers applications. Each package type requires specific testing approaches while maintaining consistent intelligence validation with camelCase JSDoc annotations.

## Phase 1: Monorepo Foundation Setup

### Step 1: Install Dependencies by Package Type

#### Root Monorepo Dependencies
```bash
# Core testing infrastructure
pnpm add -D -w vitest @cloudflare/vitest-pool-workers
pnpm add -D -w @cloudflare/workers-types wrangler
pnpm add -D -w turbo typescript
```

#### Pure TypeScript Packages (shared, color-utils, design-tokens)
```bash
# For packages/shared
cd packages/shared
pnpm add -D vitest zod

# For packages/color-utils
cd packages/color-utils
pnpm add -D vitest

# For packages/design-tokens
cd packages/design-tokens
pnpm add -D vitest
```

#### React Component Package (ui)
```bash
cd packages/ui
pnpm add -D @playwright/test @playwright/experimental-ct-react
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D comment-parser  # For JSDoc parsing
```

#### CLI Application
```bash
cd apps/cli
pnpm add -D vitest memfs  # Mock filesystem for testing
```

#### Cloudflare Workers Apps (website, api)
```bash
# For apps/website
cd apps/website
pnpm add -D @cloudflare/vitest-pool-workers playwright

# For apps/api
cd apps/api
pnpm add -D @cloudflare/vitest-pool-workers
```

### Step 2: Configure Test Infrastructure by Package Type

#### TypeScript Package Configuration
```typescript
// packages/shared/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts']
    }
  }
})
```

#### React Component Configuration
```typescript
// packages/ui/playwright.config.component.ts
import { defineConfig } from '@playwright/experimental-ct-react'

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.component.ts',
  use: {
    ctViteConfig: {
      resolve: {
        alias: {
          '@': './src',
          '@rafters/design-tokens': '../design-tokens/src'
        }
      }
    }
  }
})
```

#### Cloudflare Workers Configuration
```typescript
// apps/api/vitest.config.cloudflare.ts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
        bindings: {
          RAFTERS_INTEL: { type: 'kv' },
          CLAUDE_API_KEY: 'test-key'
        }
      }
    }
  }
})
```

### Step 3: Update Package Scripts Across Monorepo

#### TypeScript Packages Scripts
```json
// packages/shared/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:preflight": "vitest run"
  }
}
```

#### React Component Package Scripts
```json
// packages/ui/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:component": "playwright test --config playwright.config.component.ts",
    "test:preflight": "vitest run && playwright test --config playwright.config.component.ts"
  }
}
```

#### CLI Application Scripts
```json
// apps/cli/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:integration": "vitest run --config vitest.config.integration.ts",
    "test:preflight": "vitest run && vitest run --config vitest.config.integration.ts"
  }
}
```

#### Cloudflare Workers Apps Scripts
```json
// apps/website/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:integration": "vitest run --config vitest.config.cloudflare.ts",
    "test:e2e": "playwright test",
    "test:preflight": "vitest run && vitest run --config vitest.config.cloudflare.ts && playwright test"
  }
}
```

### Step 4: Test Across the Monorepo

```bash
# Test TypeScript packages
pnpm --filter @rafters/shared test
pnpm --filter @rafters/color-utils test
pnpm --filter @rafters/design-tokens test

# Test React components
pnpm --filter @rafters/ui test
pnpm --filter @rafters/ui test:component

# Test CLI
pnpm --filter @rafters/cli test
pnpm --filter @rafters/cli test:integration

# Test Cloudflare Workers apps
pnpm --filter @rafters/website test:preflight
pnpm --filter @rafters/api test:integration

# Run all tests across monorepo
pnpm test
pnpm preflight  # Must pass before commit
```

## Phase 2: Package-Specific Testing Implementation

### TypeScript Package Testing (shared, color-utils, design-tokens)

#### Zod Schema Testing (packages/shared)
```typescript
// test/schemas/color.test.ts
import { describe, test, expect } from 'vitest'
import { ColorSchema, validateColor } from '../../src/schemas/color'

describe('Color Schema Validation', () => {
  test('validates OKLCH color format', () => {
    const valid = { l: 0.5, c: 0.2, h: 120 }
    expect(ColorSchema.safeParse(valid).success).toBe(true)
  })

  test('rejects invalid color values', () => {
    const invalid = { l: 1.5, c: 0.2, h: 120 } // l > 1
    expect(ColorSchema.safeParse(invalid).success).toBe(false)
  })
})
```

#### OKLCH Calculation Testing (packages/color-utils)
```typescript
// test/oklch/converter.test.ts
import { describe, test, expect } from 'vitest'
import { hexToOklch, oklchToHex } from '../../src/oklch/converter'

describe('OKLCH Color Conversions', () => {
  test('converts hex to OKLCH accurately', () => {
    const oklch = hexToOklch('#FF5733')
    expect(oklch.l).toBeCloseTo(0.627, 2)
    expect(oklch.c).toBeCloseTo(0.191, 2)
  })

  test('round-trip conversion maintains color', () => {
    const original = '#FF5733'
    const oklch = hexToOklch(original)
    const converted = oklchToHex(oklch)
    expect(converted).toBe(original)
  })
})
```

#### Token Generation Testing (packages/design-tokens)
```typescript
// test/generators/color-tokens.test.ts
import { describe, test, expect } from 'vitest'
import { generateColorTokens } from '../../src/generators/color-tokens'

describe('Color Token Generation', () => {
  test('generates semantic color tokens', () => {
    const tokens = generateColorTokens({ primary: '#0066CC' })
    expect(tokens).toHaveProperty('--color-primary')
    expect(tokens).toHaveProperty('--color-primary-foreground')
  })
})
```

### Component Migration

### Priority Component List
1. **High Priority (Week 2)**
   - Button (example implementation provided)
   - Input
   - Dialog

2. **Medium Priority (Week 3)**
   - Select
   - Tooltip
   - Badge

3. **Low Priority (Week 4)**
   - Card
   - Container
   - Progress

### Component Test Template

For each component, create three test files:

1. **Unit Tests** (`ComponentName.test.ts`)
```typescript
import { describe, test, expect } from 'vitest'
import { ComponentName } from '../../src/components/ComponentName'
import { validateComponentPurity } from '../utils/react19-helpers'

describe('ComponentName Unit Tests', () => {
  test('maintains purity for concurrent rendering', () => {
    const purityReport = validateComponentPurity(ComponentName)
    expect(purityReport.isPure).toBe(true)
  })

  // Add specific unit tests for component logic
})
```

2. **Component Tests** (`ComponentName.component.ts`) - PRIMARY METHOD
```typescript
import { test, expect } from '@playwright/experimental-ct-react'
import { ComponentName } from '../../src/components/ComponentName'

test.describe('ComponentName Component Tests', () => {
  test('validates design intelligence in browser', async ({ mount }) => {
    const component = await mount(<ComponentName />)
    await expect(component).toBeVisible()

    // Add component-specific behavior tests
  })
})
```

3. **Intelligence Tests** (`ComponentName.intelligence.test.ts`)
```typescript
import { describe, test, expect } from 'vitest'
import { ComponentName } from '../../src/components/ComponentName'
import { extractComponentIntelligence } from '../utils/intelligence-validators'

describe('ComponentName Intelligence Validation', () => {
  test('has AI-consumable intelligence', () => {
    expect(ComponentName.toString()).toHaveValidIntelligence()
    expect(ComponentName.toString()).toBeAIConsumable()
  })
})
```

### Migration Checklist for Each Component

- [ ] Add comprehensive JSDoc intelligence annotations (camelCase)
- [ ] Remove any impure code (Math.random(), Date.now(), console.log in render)
- [ ] Convert forwardRef patterns to direct ref props (React 19)
- [ ] Ensure semantic token usage (no arbitrary values)
- [ ] Create all three test files
- [ ] Validate tests pass: `pnpm test:preflight`

## Phase 3: React 19 Compatibility (Week 2-3)

### Component Purity Validation

For each component, run purity validation:

```typescript
import { validateComponentPurity } from '../utils/react19-helpers'

test('component purity check', () => {
  const purityReport = validateComponentPurity(ComponentName)

  if (!purityReport.isPure) {
    console.error('Purity issues:', purityReport.issues)
  }

  expect(purityReport.isPure).toBe(true)
})
```

### Common Purity Issues and Fixes

1. **Math.random() in render**
   ```typescript
   // ❌ Wrong
   function Component() {
     const id = Math.random()
     return <div id={id} />
   }

   // ✅ Correct
   function Component() {
     const [id] = useState(() => Math.random())
     return <div id={id} />
   }
   ```

2. **Side effects in render**
   ```typescript
   // ❌ Wrong
   function Component() {
     console.log('rendering')
     return <div />
   }

   // ✅ Correct
   function Component() {
     useEffect(() => {
       console.log('component mounted')
     }, [])
     return <div />
   }
   ```

3. **ForwardRef to direct ref**
   ```typescript
   // ❌ React 18 pattern
   const Component = forwardRef<HTMLDivElement, Props>((props, ref) => {
     return <div ref={ref} {...props} />
   })

   // ✅ React 19 pattern
   function Component({ ref, ...props }: Props & { ref?: React.Ref<HTMLDivElement> }) {
     return <div ref={ref} {...props} />
   }
   ```

## Phase 4: AI Intelligence Integration (Week 3)

### Intelligence Annotation Template (CamelCase JSDoc)

Add to every component with camelCase annotations:

```typescript
/**
 * Component description
 *
 * @registryName component-name
 * @registryVersion 1.0.0
 * @registryStatus published
 *
 * @cognitiveLoad X/10 - Description of mental effort
 * @attentionEconomics Visual hierarchy and usage rules
 * @trustBuilding Confidence patterns for different contexts
 * @accessibility WCAG compliance and screen reader support
 * @semanticMeaning Contextual usage and variant purposes
 *
 * @usagePatterns
 * DO: Clear guidelines for proper usage
 * NEVER: Anti-patterns and misuse cases
 *
 * @designGuides
 * - Link to design documentation
 * - Link to usage patterns
 *
 * @example
 * ```tsx
 * <Component variant="primary">Example usage</Component>
 * ```
 */
```

### Intelligence Validation Workflow

1. **Extract Intelligence**
   ```typescript
   const intelligence = extractComponentIntelligence(Component.toString())
   ```

2. **Validate AI Consumability**
   ```typescript
   const consumability = validateAIConsumability(Component.toString())
   expect(consumability.canMakeDesignDecisions).toBe(true)
   ```

3. **Test AI Decision Making**
   ```typescript
   const mockAI = new MockAIAgent()
   const decision = await mockAI.makeDesignDecision(intelligence, context)
   expect(decision.recommendation).toBe('expected-recommendation')
   ```

## Phase 5: Cloudflare Workers Integration (Week 3-4)

### Set Up KV Intelligence Storage

1. **Create Intelligence Storage Functions**
   ```typescript
   // test/utils/workers-helpers.ts
   export async function storeComponentIntelligence(name: string, intelligence: any) {
     await env.RAFTERS_INTEL.put(
       `component:${name}`,
       JSON.stringify(intelligence),
       { metadata: { version: '1.0.0', type: 'component-intelligence' } }
     )
   }
   ```

2. **Test Intelligence Retrieval**
   ```typescript
   test('retrieves component intelligence', async () => {
     const intelligence = await env.RAFTERS_INTEL.get('component:button', 'json')
     expect(intelligence.cognitiveLoad).toBeDefined()
   })
   ```

### Edge Performance Testing

```typescript
test('validates edge performance', async () => {
  const start = performance.now()

  const results = await Promise.all([
    getComponentIntelligence('button'),
    getComponentIntelligence('dialog'),
    getDesignTokens(),
  ])

  const totalTime = performance.now() - start
  expect(totalTime).toBeLessThan(100) // < 100ms for edge queries
})
```

## Phase 6: Advanced Features (Week 4)

### Visual Regression Testing

```typescript
test('maintains visual consistency', async ({ mount }) => {
  const component = await mount(<Component variant="primary" />)
  await expect(component).toHaveScreenshot('component-primary.png')
})
```

### Cross-Browser Testing

Component tests automatically run across browsers:
- Chromium
- Firefox
- WebKit
- Mobile Chrome
- Mobile Safari

### Accessibility Validation

```typescript
test('meets accessibility standards', async ({ mount }) => {
  const component = await mount(<Component />)

  // Test keyboard navigation
  await component.focus()
  await component.press('Tab')

  // Test screen reader attributes
  await expect(component).toHaveAccessibleName()

  // Test WCAG compliance
  const intelligence = extractComponentIntelligence(Component.toString())
  expect(intelligence.accessibility).toContain('WCAG AAA')
})
```

## Validation and Success Metrics

### Weekly Progress Checks

**Week 1: Foundation**
- [ ] All test configurations working
- [ ] Example Button tests passing
- [ ] Turbo/CI integration complete

**Week 2: Core Components**
- [ ] Button, Input, Dialog migrated
- [ ] All components pass purity tests
- [ ] React 19 compatibility validated

**Week 3: Intelligence System**
- [ ] AI intelligence annotations complete
- [ ] Workers integration tests passing
- [ ] Mock AI decision making working

**Week 4: Advanced Features**
- [ ] Visual regression testing active
- [ ] Cross-browser validation complete
- [ ] Accessibility compliance verified

### Success Criteria

- **100%** component intelligence coverage
- **Zero** purity violations in React 19 tests
- **Sub-10ms** average Workers KV queries
- **Full** cross-browser component consistency
- **WCAG AAA** compliance across all components

## Troubleshooting

### Common Issues

1. **Playwright Component Tests Failing**
   ```bash
   # Install Playwright browsers
   pnpx playwright install

   # Check Vite config in playwright.config.component.ts
   # Ensure proper alias resolution
   ```

2. **Workers Tests Not Finding KV**
   ```bash
   # Check wrangler.toml configuration
   # Verify binding names match test setup
   # Ensure miniflare KV namespaces configured
   ```

3. **React 19 Purity Failures**
   ```bash
   # Run purity validator on component
   # Check for side effects in render
   # Remove non-deterministic operations
   ```

4. **Intelligence Extraction Errors**
   ```bash
   # Verify JSDoc format is correct
   # Check comment-parser can parse annotations
   # Ensure all required fields present
   ```

This implementation guide provides the complete roadmap for establishing the future-ready testing architecture. Follow the phases sequentially, validate at each step, and use the troubleshooting section to resolve common issues.