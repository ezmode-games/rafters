# Rafters Monorepo Testing Patterns

This document outlines comprehensive testing patterns for the entire Rafters monorepo - covering TypeScript packages (shared, color-utils, design-tokens), React components (ui), CLI applications, and Cloudflare Workers apps. Special emphasis on mocking strategies and camelCase JSDoc annotations for AI intelligence consumption.

## Monorepo Package Structure

```
packages/
├── shared/         # Zod schemas, validation logic
├── color-utils/    # OKLCH calculations, color space utilities
├── design-tokens/  # Token generation, CSS variables
└── ui/            # React 19 components with AI intelligence

apps/
├── cli/           # CLI commands, file operations
├── website/       # Next.js on Cloudflare Workers
└── api/          # Hono API on Workers runtime
```

## Core Testing Principles

### 1. Prefer `spyOn` for Unit Tests
Use `vi.spyOn()` when testing individual functions or classes in isolation while preserving the real module structure:

**Good for:**
- Testing individual functions with minimal dependencies
- Testing class methods where you need to isolate specific dependencies
- Maintaining the real module structure while controlling specific behaviors

**Example:**
```typescript
// Unit test for TokenRegistry class
beforeEach(() => {
  // Spy on specific methods of internal dependencies
  vi.spyOn(TokenDependencyGraph.prototype, 'addDependency').mockImplementation(vi.fn())
  vi.spyOn(TokenDependencyGraph.prototype, 'getDependencies').mockReturnValue([])
})
```

### 2. Use `vi.mock()` for Integration/Command Tests
Use `vi.mock()` when testing command-level functionality or when you need to prevent side effects:

**Good for:**
- Command-level testing that interacts with file system
- Testing that requires mocking entire external modules
- Preventing actual network calls or file operations

**Example:**
```typescript
// Command test that prevents file system operations
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}))

// Mock external packages to avoid complex logic in tests
vi.mock('@rafters/design-tokens', () => ({
  generateAllTokens: vi.fn().mockResolvedValue([]),
}))
```

## Testing Architecture by Package Type

### TypeScript Packages (shared, color-utils, design-tokens)

#### Unit Tests (`.test.ts`)
**Focus:** Pure functions, schemas, calculations

**Patterns:**
- Use Vitest with Node environment
- No DOM dependencies
- Test Zod schema validation
- Test OKLCH color calculations
- Test token generation logic

**Example - Zod Schema Testing:**
```typescript
// packages/shared/test/schemas/color.test.ts
import { describe, test, expect } from 'vitest'
import { ColorSchema } from '../../src/schemas/color'

describe('Color Schema', () => {
  test('validates OKLCH format', () => {
    const valid = { l: 0.5, c: 0.2, h: 120 }
    expect(ColorSchema.safeParse(valid).success).toBe(true)
  })
})
```

**Example - OKLCH Calculations:**
```typescript
// packages/color-utils/test/oklch.test.ts
import { describe, test, expect } from 'vitest'
import { hexToOklch, oklchToHex } from '../src/oklch'

describe('OKLCH Conversions', () => {
  test('converts hex to OKLCH', () => {
    const oklch = hexToOklch('#FF5733')
    expect(oklch.l).toBeCloseTo(0.627, 2)
  })
})
```

### React Component Package (ui)

#### Unit Tests (`.test.ts`)
**Focus:** Component logic, hooks, utilities

**Patterns:**
- Use `spyOn` for internal dependencies
- Mock external APIs at global level
- Test React 19 purity requirements
- Validate camelCase JSDoc intelligence

**Example Structure:**
```typescript
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MyClass } from '../src/MyClass.js'
import { InternalDependency } from '../src/InternalDependency.js'

// Mock external APIs
global.fetch = vi.fn()

describe('MyClass', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Spy on specific internal methods
    vi.spyOn(InternalDependency.prototype, 'method').mockReturnValue('controlled result')
  })

  it('should test specific behavior', () => {
    // Test implementation
  })
})
```

#### Component Tests (`.component.ts`) - PRIMARY METHOD
**Focus:** Real browser component behavior

**Patterns:**
- Use Playwright Component Testing
- Test in real browser environments
- Validate AI intelligence consumption
- Test React 19 concurrent rendering

**Example:**
```typescript
// packages/ui/test/components/Button.component.ts
import { test, expect } from '@playwright/experimental-ct-react'
import { Button } from '../../src/components/Button'

test.describe('Button Component', () => {
  test('validates design intelligence', async ({ mount }) => {
    const component = await mount(<Button variant="primary">Save</Button>)
    await expect(component).toBeVisible()
    await expect(component).toHaveAccessibleName('Save')
  })
})
```

### CLI Application (apps/cli)

#### Integration Tests (`.spec.ts`)
**Focus:** Command execution and file operations

**Patterns:**
- Use `vi.mock()` for file system operations
- Mock external package dependencies
- Test command logic without side effects
- Use memfs for mock filesystem

### Cloudflare Workers Apps (website, api)

#### Integration Tests (`.spec.ts`)
**Focus:** Workers runtime with KV/R2/D1

**Patterns:**
- Use `@cloudflare/vitest-pool-workers`
- Test with real Workers runtime
- Mock external APIs at module level
- Access real KV/R2/D1 bindings

**Example:**
```typescript
// apps/api/test/routes/color.spec.ts
import { describe, test, expect } from 'vitest'
import { env, createExecutionContext } from 'cloudflare:test'

describe('Color API', () => {
  test('stores color in KV', async () => {
    const request = new Request('http://example.com/api/color')
    const ctx = createExecutionContext()
    const response = await fetch(request, { cf: { env, ctx } })
    expect(response.ok).toBe(true)
  })
})
```

### Command Tests
**Focus:** CLI commands and high-level functionality

**Patterns:**
- Mock file system operations completely
- Mock external package dependencies
- Test command logic without side effects
- Verify correct interactions with mocked dependencies

**Example:**
```typescript
// Mock entire modules for command testing
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@external/package', () => ({
  externalFunction: vi.fn().mockResolvedValue(mockData),
}))
```

## AI Intelligence Testing Patterns

### CamelCase JSDoc Annotations (MANDATORY)

All component intelligence MUST use camelCase for parser compatibility:

```typescript
/**
 * Button component with AI-consumable intelligence
 *
 * @registryName button
 * @registryVersion 1.0.0
 * @registryStatus published
 *
 * @cognitiveLoad 3/10 - Simple action trigger
 * @attentionEconomics Primary variant commands highest attention
 * @trustBuilding Destructive actions require confirmation
 * @accessibility WCAG AAA compliant with 44px touch targets
 * @semanticMeaning primary=main actions, destructive=irreversible
 *
 * @usagePatterns
 * DO: Primary buttons for main user goals
 * NEVER: Multiple primary buttons competing
 *
 * @designGuides
 * - https://rafters.realhandy.tech/docs/llm/trust-building
 */
```

### Intelligence Validation Testing

```typescript
// test/utils/intelligence-validators.ts
export function validateComponentIntelligence(Component: React.ComponentType) {
  const componentString = Component.toString()

  // Validate camelCase annotations
  expect(componentString).toContain('@cognitiveLoad')
  expect(componentString).toContain('@trustBuilding')
  expect(componentString).toContain('@attentionEconomics')
  expect(componentString).toContain('@semanticMeaning')
  expect(componentString).toContain('@usagePatterns')
}
```

## Best Practices

### 1. Clear Mock Intentions
Always document why you're using a particular mocking strategy:

```typescript
// Mock external fetch API to prevent actual network calls during unit tests
global.fetch = vi.fn()

// Spy on TokenDependencyGraph methods to isolate unit tests from complex dependency logic
// Using spyOn preserves the real class structure while controlling specific method behavior
vi.spyOn(TokenDependencyGraph.prototype, 'addDependency').mockImplementation(vi.fn())
```

### 2. Consistent beforeEach Setup
Establish consistent patterns for test setup:

```typescript
beforeEach(() => {
  vi.clearAllMocks()

  // Set up spies/mocks
  // Initialize test subjects
})
```

### 3. Avoid Overmocking
Only mock what you need to control:

```typescript
// Good: Only mock the specific methods you need
vi.spyOn(service, 'specificMethod').mockReturnValue(controlledValue)

// Avoid: Mocking entire modules when only specific methods matter
// (unless it's for command-level testing)
```

### 4. Test File Organization
Mirror the source structure in test directories:

```
src/
├── commands/
│   ├── generate.ts
│   └── validate.ts
└── lib/
    └── utility.ts

test/
├── commands/
│   ├── generate.test.ts    # Command-level tests (use vi.mock)
│   └── validate.test.ts    # Command-level tests (use vi.mock)
└── lib/
    └── utility.test.ts     # Unit tests (prefer spyOn)
```

## Package-Specific Testing Patterns

### TypeScript Package Patterns

#### Schema Validation Testing
```typescript
// packages/shared/test/schemas/*.test.ts
import { z } from 'zod'

const schema = z.object({
  value: z.number().min(0).max(1)
})

test('validates range constraints', () => {
  expect(schema.safeParse({ value: 0.5 }).success).toBe(true)
  expect(schema.safeParse({ value: 1.5 }).success).toBe(false)
})
```

#### Color Calculation Testing
```typescript
// packages/color-utils/test/*.test.ts
test('OKLCH accuracy', () => {
  const result = calculateOklch(input)
  expect(result.lightness).toBeCloseTo(expected, 3) // 3 decimal places
})
```

### React Component Patterns

#### Purity Validation
```typescript
test('component is pure for React 19', () => {
  const purityReport = validateComponentPurity(Component)
  expect(purityReport.hasSideEffects).toBe(false)
  expect(purityReport.isDeterministic).toBe(true)
})
```

### CLI Testing Patterns

#### Command Execution
```typescript
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn()
}))

test('generate command creates files', async () => {
  await command.execute()
  expect(fs.writeFile).toHaveBeenCalledWith(
    expect.stringContaining('.css'),
    expect.any(String)
  )
})
```

### Workers Testing Patterns

#### KV Storage Testing
```typescript
test('stores in KV', async () => {
  await env.RAFTERS_INTEL.put('key', 'value')
  const stored = await env.RAFTERS_INTEL.get('key')
  expect(stored).toBe('value')
})
```

## Common Patterns

### External API Mocking
```typescript
// Always mock external APIs to prevent network calls
global.fetch = vi.fn()

// Or for specific modules
vi.mock('external-api-package', () => ({
  apiMethod: vi.fn().mockResolvedValue(mockResponse)
}))
```

### File System Operations
```typescript
// For command tests - mock the entire fs module
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn().mockResolvedValue('{}'),
}))
```

### Console Output Control
```typescript
beforeEach(() => {
  // Spy on console methods to avoid test noise
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
```

### Internal Class Dependencies
```typescript
// Spy on prototype methods to control behavior while preserving structure
vi.spyOn(DependencyClass.prototype, 'method').mockReturnValue(controlledValue)
```

## Migration Guidelines

When refactoring existing tests:

1. **Identify the test level**: Unit, integration, or command?
2. **Evaluate current mocks**: Are entire modules mocked when only specific methods matter?
3. **Consider the dependencies**: Internal (prefer spyOn) vs external (vi.mock is fine)
4. **Preserve test intent**: Don't change what the test is validating, just how it's isolated

## Monorepo Testing Summary

### By Package Type:

**TypeScript Packages (shared, color-utils, design-tokens)**:
- Vitest with Node environment
- Pure function testing
- No DOM dependencies

**React Components (packages/ui)**:
- Playwright Component Testing (PRIMARY)
- Real browser validation
- CamelCase JSDoc intelligence
- React 19 purity requirements

**CLI Applications (apps/cli)**:
- Vitest for logic
- Mock filesystem operations
- Integration testing for commands

**Cloudflare Workers (apps/website, apps/api)**:
- Workers runtime testing
- Real KV/R2/D1 bindings
- Edge API validation

### Universal Requirements:
- **CamelCase JSDoc**: All annotations use camelCase
- **Intelligence Testing**: Validate AI consumption
- **Preflight**: All tests must pass before commit
- **Coverage**: Aim for comprehensive test coverage