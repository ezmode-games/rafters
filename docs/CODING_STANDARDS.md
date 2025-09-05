# Rafters Coding Standards

## 🚨 MANDATORY PREFLIGHT CHECKS - READ FIRST 🚨

**BEFORE ANY COMMIT OR PR - AI AGENTS MUST RUN:**

```bash
pnpm preflight
```

This single command runs: format → lint → type-check → test → build in sequence.

**❌ NEVER COMMIT if preflight fails**
**❌ NEVER skip preflight to "save time"** 
**❌ NEVER expect CI to catch what you should fix locally**

**✅ Preflight must pass before commit - no exceptions**

See [Section 13: Mandatory Preflight Checks](#13-mandatory-preflight-checks-before-any-commit) for details.

---

## NEVER USE NPM NPX ##
This is a pnpm workspace monorepo. using these tools can create a mess of the managed builds.
NPX will run anything you suggest. It is a massive security risk to my computer.

## Core Principles

### 1. **Strict Type Safety**
- **NEVER use `any`** - use `unknown` if the type is truly unknown
- All functions must have explicit return types
- All parameters must be explicitly typed
- Use `strictNullChecks` and `noImplicitAny` 
- Prefer type guards over type assertions (`as`)

```typescript
// ❌ Bad
function processData(data: any): any {
  return data.someProperty
}

// ✅ Good  
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'someProperty' in data) {
    return String(data.someProperty)
  }
  throw new Error('Invalid data structure')
}
```

### 2. **Zod Everywhere**
- **All external data must be validated with Zod**
- API responses, file contents, user inputs, environment variables
- Define Zod schemas first, then derive TypeScript types
- Validate at system boundaries (never trust external data)

```typescript
// ❌ Bad
interface User {
  id: number
  name: string
}

// ✅ Good
const UserSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1).max(100)
})
type User = z.infer<typeof UserSchema>

// Validate external data
function parseApiResponse(data: unknown): User {
  return UserSchema.parse(data)
}
```

### 3. **Error Handling & Boundaries**
- Use Result types or explicit error throwing
- Never swallow errors silently
- Validate inputs before processing
- Provide meaningful error messages
- **Always use `await` - never use `.then()` chaining for async operations**
- **Implement error boundaries at logical system boundaries**
- **Use structured error types with proper categorization**
- **Implement graceful degradation and recovery strategies**

```typescript
// ✅ Good - Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

function safeParseJson<T>(json: string, schema: z.ZodSchema<T>): Result<T> {
  try {
    const parsed = JSON.parse(json)
    const validated = schema.parse(parsed)
    return { success: true, data: validated }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

// ✅ Good - Always use await for async operations
async function fetchAndProcessUser(id: number): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`)
    const data = await response.json()
    const user = UserSchema.parse(data)
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

// ❌ Bad - Never use .then() chaining
function fetchAndProcessUserBad(id: number): Promise<Result<User>> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => UserSchema.parse(data))
    .then(user => ({ success: true, data: user }))
    .catch(error => ({ success: false, error }))
}
```

## Code Organization

### 4. **File Structure**
- Group related functionality together
- Use index files to control exports
- Separate schemas, types, and utilities
- Keep files focused and small (< 200 lines)

```
src/
  schemas/
    index.ts      // Re-export all schemas
    user.ts       // UserSchema + related schemas
    config.ts     // ConfigSchema + related schemas
  types/
    index.ts      // Re-export all types
    api.ts        // API-related types
    internal.ts   // Internal types
  utils/
    index.ts      // Re-export utilities
    validation.ts // Validation utilities
    fs.ts         // File system utilities
```

### 5. **Naming Conventions**
- Use PascalCase for types, interfaces, classes, and Zod schemas
- Use camelCase for variables, functions, and properties
- Use SCREAMING_SNAKE_CASE for constants
- Use descriptive names that explain intent

```typescript
// ✅ Good
const UserRegistrationSchema = z.object({...})
type UserRegistration = z.infer<typeof UserRegistrationSchema>

const MAX_RETRY_ATTEMPTS = 3
const defaultUserPreferences = {...}

function validateUserRegistration(data: unknown): UserRegistration {
  return UserRegistrationSchema.parse(data)
}
```

## Functional Programming Patterns

### 6. **Prefer Pure Functions**
- Functions should not have side effects when possible
- Return new objects instead of mutating
- Use immutable data structures
- Make dependencies explicit through parameters

```typescript
// ❌ Bad - mutation and side effects
let config: Config
function updateConfig(newValues: Partial<Config>): void {
  config = { ...config, ...newValues }
  saveConfigToFile(config)
}

// ✅ Good - pure function
function mergeConfig(existing: Config, updates: Partial<Config>): Config {
  return { ...existing, ...updates }
}
```

### 7. **Use Functional Composition**
- Break complex operations into smaller functions
- Use Array methods (map, filter, reduce) over loops
- **Prefer `for...of` over `forEach`** for better performance and readability
- Compose functions to build complex behavior

```typescript
// ❌ Bad - traditional for loop
for (let i = 0; i < items.length; i++) {
  console.log(items[i])
}

// ❌ Avoid - forEach for simple iteration
items.forEach(item => {
  console.log(item)
})

// ✅ Good - for...of for simple iteration
for (const item of items) {
  console.log(item)
}

// ✅ Good - Array methods for transformations
const processComponents = (components: RawComponent[]) =>
  components
    .map(component => ComponentSchema.parse(component))
    .filter(component => component.enabled)
    .sort((a, b) => a.priority - b.priority)

// ✅ Good - for...of with complex logic
for (const component of components) {
  if (component.enabled) {
    try {
      await processComponent(component)
    } catch (error) {
      logger.error(`Failed to process ${component.name}`, error)
    }
  }
}
```

## Zod Best Practices

### 8. **Schema Design**
- Use transformations to normalize data
- Add meaningful error messages
- Use refinements for complex validation
- Make schemas composable

```typescript
const EmailSchema = z.string()
  .email('Must be a valid email address')
  .transform(email => email.toLowerCase())

const UserSchema = z.object({
  id: z.number().positive('User ID must be positive'),
  email: EmailSchema,
  age: z.number().min(13, 'Must be at least 13 years old').max(120)
}).refine(
  user => user.email.includes('@company.com') || user.age >= 18,
  { message: 'Under 18 users must use company email' }
)
```

### 9. **Validation Boundaries**
- Validate at system entry points
- Parse environment variables with Zod
- Validate API request/response data
- Validate file contents before processing

```typescript
// Environment variables
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().min(1).max(65535),
  DATABASE_URL: z.string().url()
})

const env = EnvSchema.parse(process.env)

// API responses
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()
  return UserSchema.parse(data) // Validate API response
}
```

## Code Quality

### 10. **Documentation**
- Document complex business logic
- Use JSDoc for public APIs
- Include examples in documentation
- Document Zod schema intentions

```typescript
/**
 * Processes component registry data and validates it against our schema.
 * 
 * @param rawData - Unvalidated data from external registry
 * @returns Validated and normalized component data
 * @throws {ZodError} When data doesn't match expected schema
 * 
 * @example
 * ```typescript
 * const component = processRegistryData(apiResponse)
 * console.log(component.name) // Type-safe access
 * ```
 */
function processRegistryData(rawData: unknown): RegistryComponent {
  return RegistryComponentSchema.parse(rawData)
}
```

### 11. **Testing & Test-Driven Development**
- **Write tests first (TDD)** - red, green, refactor cycle
- **Unit test all logic** - any function with conditional logic, transformations, or calculations
- **Prefer spyOn** - in unit tests, prefer to spy and not mock. save mocks for whatif sitiuations
- Test all Zod schemas with valid and invalid data
- Test error cases explicitly
- Use type assertions in tests for type safety
- Mock external dependencies properly
- **Keep tests simple** - focus on logic, not deep functional testing
- **One assertion per test** when possible for clarity

```typescript
// ✅ TDD Example - Write test first
describe('EmailSchema', () => {
  it('should normalize email to lowercase', () => {
    const result = EmailSchema.parse('Test@Example.COM')
    expect(result).toBe('test@example.com')
  })

  it('should reject invalid email format', () => {
    expect(() => EmailSchema.parse('not-an-email')).toThrow()
  })
})

// Then implement the schema
const EmailSchema = z.string()
  .email('Must be a valid email address')
  .transform(email => email.toLowerCase())

// ✅ Unit test for logic functions
describe('mergeConfig', () => {
  it('should merge configurations without mutation', () => {
    const existing = { theme: 'dark', size: 'md' }
    const updates = { size: 'lg', newProp: 'value' }
    
    const result = mergeConfig(existing, updates)
    
    expect(result).toEqual({ theme: 'dark', size: 'lg', newProp: 'value' })
    expect(existing).toEqual({ theme: 'dark', size: 'md' }) // No mutation
  })
})

// ✅ Test error boundary logic
describe('CommandErrorBoundary', () => {
  it('should recover from recoverable errors', async () => {
    const mockOperation = vi.fn().mockRejectedValue(new Error('File not found'))
    const mockLogger = { error: vi.fn(), info: vi.fn() }
    
    const boundary = new CommandErrorBoundary(mockOperation, 'test', mockLogger)
    
    const result = await boundary.execute()
    
    expect(result.success).toBe(false)
    expect(mockLogger.error).toHaveBeenCalled()
  })
})

describe('UserSchema', () => {
  it('should parse valid user data', () => {
    const validData = { id: 1, email: 'test@example.com', age: 25 }
    const result = UserSchema.safeParse(validData)
    
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })

  it('should reject invalid email', () => {
    const invalidData = { id: 1, email: 'not-an-email', age: 25 }
    const result = UserSchema.safeParse(invalidData)
    
    expect(result.success).toBe(false)
  })
})

// ✅ Test utility functions with logic
describe('processComponents', () => {
  it('should filter enabled components and sort by priority', () => {
    const components = [
      { name: 'Button', enabled: true, priority: 2 },
      { name: 'Input', enabled: false, priority: 1 },
      { name: 'Card', enabled: true, priority: 1 }
    ]
    
    const result = processComponents(components)
    
    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Card') // Lower priority first
    expect(result[1].name).toBe('Button')
  })

  it('should handle empty array', () => {
    expect(processComponents([])).toEqual([])
  })
})
```

### **What to Test:**
- **All Zod schemas** - valid/invalid inputs, transformations
- **Pure functions** with conditional logic or calculations
- **Error boundaries** - recovery logic, fallback behavior
- **Utility functions** - array processing, object transformations
- **Configuration merging** - ensure no mutations
- **File system operations** - mocked, test error handling
- **Network operations** - mocked, test retry logic

### **What NOT to Test:**
- Simple getters/setters without logic
- Basic object property access
- Framework code (Vite, Commander.js internals)
- External library behavior
- Deep integration flows (save for E2E tests)

### 12. **Performance Considerations**
- Parse schemas once, reuse the result
- Use `safeParse` when errors are expected
- Cache compiled schemas for repeated use
- Consider lazy parsing for large objects

```typescript
// ✅ Good - cache parsed results
const memoizedParse = <T>(schema: z.ZodSchema<T>) => {
  const cache = new Map<string, T>()
  
  return (data: unknown): T => {
    const key = JSON.stringify(data)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = schema.parse(data)
    cache.set(key, result)
    return result
  }
}
```

## Forbidden Patterns

### ❌ Never Do These
```typescript
// Never use any
function process(data: any): any { }

// Never use non-null assertion without good reason
const value = possiblyNull!.property

// Never ignore promise rejections
fetchData() // Missing await or .catch()

// Never use .then() chaining - always use await
fetchData().then(data => processData(data)) // Bad!

// Never mutate props or external state directly
function updateUser(user: User) {
  user.lastUpdated = new Date() // Mutation!
}

// Never use function overloads when union types suffice
function getValue(x: string): string
function getValue(x: number): number
function getValue(x: string | number): string | number { }

// Never catch and ignore errors
try {
  riskyOperation()
} catch {
  // Silent failure
}
```

## Git Commit Standards & CI Requirements

### 13. **Mandatory Preflight Checks (BEFORE ANY COMMIT)**

**CRITICAL: CI will fail unless ALL preflight checks pass locally first.**

#### **Required Commands (Run in Order):**
```bash
# 1. MANDATORY - Format all code
pnpm biome format --write

# 2. MANDATORY - Lint and fix issues  
pnpm biome check --fix --unsafe

# 3. MANDATORY - Type check all packages
pnpm type-check

# 4. MANDATORY - Run all tests
pnpm test:preflight

# 5. MANDATORY - Build all packages
pnpm build
```

#### **AI Agent Requirements:**
**Every AI agent (Copilot, Claude, etc.) MUST:**
- ✅ **Run all 5 preflight commands** before committing
- ✅ **Fix ALL errors** that appear in any command
- ✅ **Never commit** if any preflight command fails
- ✅ **Never skip** preflight checks to "save time"
- ✅ **Never commit** with the expectation that CI will catch issues

#### **Lefthook Pre-commit Enforcement:**
The repository uses lefthook to block commits that don't pass basic checks:
```yaml
pre-commit:
  commands:
    biome:
      run: pnpm biome check --no-errors-on-unmatched
      stage_fixed: true
```

**If lefthook blocks your commit:**
1. **DO NOT override or skip** the pre-commit hook
2. **Fix the issues** reported by the failing command
3. **Re-run preflight checks** until all pass
4. **Then commit** - lefthook will allow it through

#### **Package-Specific Requirements:**

**UI Package (Component Testing):**
```bash
# UI package uses component tests with embedded intelligence
pnpm --filter @rafters/ui test              # Runs component tests
pnpm --filter @rafters/ui build             # Verify components build
```

**Other Packages (Unit Testing):**
```bash
# Other packages use traditional unit tests
pnpm --filter @rafters/cli test
pnpm --filter @rafters/color-utils test  
pnpm --filter @rafters/design-tokens test
```

#### **Common Preflight Failures & Fixes:**

**Biome Format/Lint Failures:**
```bash
# Fix: Run format and check with fixes
pnpm biome format --write .
pnpm biome check --fix .
```

**TypeScript Errors:**
```bash
# Check specific package
pnpm --filter @rafters/ui type-check
pnpm --filter @rafters/cli type-check

# Fix: Add explicit types, fix imports
```

**Test Failures:**
```bash
# UI package - fix broken components
pnpm --filter @rafters/ui test           # Debug component issues

# Other packages - fix unit tests
pnpm --filter @rafters/cli test -- --watch
```

**Build Failures:**
```bash
# Fix: Usually TypeScript or missing dependencies
pnpm --filter @rafters/ui build
pnpm --filter @rafters/cli build
```

### 14. **Commit Messages**
- Use conventional commits format
- Include scope when relevant
- Reference issues/PRs when applicable

```
feat(core): add user validation with Zod schemas
fix(cli): handle missing config file gracefully  
docs(readme): update installation instructions
test(schemas): add comprehensive validation tests
```

## Testing Requirements & TDD

### 14. **Test-Driven Development (TDD)**
- **Write tests BEFORE implementation** - Red, Green, Refactor cycle
- Every function with logic must have unit tests
- Tests are documentation - they show expected behavior
- No logic goes untested, no matter how simple
- Use descriptive test names that explain the behavior

```typescript
// ✅ Good - TDD approach
describe('ComponentNameValidator', () => {
  describe('validateComponentName', () => {
    it('should accept valid kebab-case component names', () => {
      const result = validateComponentName('my-button')
      expect(result.success).toBe(true)
    })

    it('should reject component names with uppercase letters', () => {
      const result = validateComponentName('MyButton')
      expect(result.success).toBe(false)
      expect(result.error?.message).toContain('must be kebab-case')
    })

    it('should reject component names starting with numbers', () => {
      const result = validateComponentName('1-button')
      expect(result.success).toBe(false)
    })

    it('should reject empty component names', () => {
      const result = validateComponentName('')
      expect(result.success).toBe(false)
    })
  })
})

// Then implement the function to make tests pass
function validateComponentName(name: string): Result<string> {
  if (!name) {
    return { success: false, error: new Error('Component name cannot be empty') }
  }
  
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return { success: false, error: new Error('Component name must be kebab-case') }
  }
  
  return { success: true, data: name }
}
```

### 15. **Unit Testing Requirements**
- **Every function with conditional logic must have tests**
- **Every Zod schema must have validation tests**
- **Every error case must be tested**
- **Every utility function must be tested**
- Test both happy path and error cases
- Use Jest or Vitest as the testing framework

```typescript
// ✅ Required tests for any logic function
describe('FilePathUtils', () => {
  describe('normalizeFilePath', () => {
    it('should convert backslashes to forward slashes', () => {
      expect(normalizeFilePath('src\\components\\Button.tsx')).toBe('src/components/Button.tsx')
    })

    it('should remove duplicate slashes', () => {
      expect(normalizeFilePath('src//components///Button.tsx')).toBe('src/components/Button.tsx')
    })

    it('should handle empty paths', () => {
      expect(normalizeFilePath('')).toBe('')
    })

    it('should handle paths that are already normalized', () => {
      expect(normalizeFilePath('src/components/Button.tsx')).toBe('src/components/Button.tsx')
    })
  })
})

// ✅ Required tests for Zod schemas
describe('RegistryItemSchema', () => {
  it('should parse valid registry item', () => {
    const validItem = {
      name: 'button',
      description: 'A reusable button component',
      files: ['button.tsx'],
      dependencies: ['react'],
      registryDependencies: []
    }
    
    const result = RegistryItemSchema.safeParse(validItem)
    expect(result.success).toBe(true)
  })

  it('should reject registry item without name', () => {
    const invalidItem = { description: 'A button' }
    const result = RegistryItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })

  it('should reject registry item with invalid file extensions', () => {
    const invalidItem = {
      name: 'button',
      files: ['button.exe'], // Invalid extension
      dependencies: []
    }
    const result = RegistryItemSchema.safeParse(invalidItem)
    expect(result.success).toBe(false)
  })
})

// ✅ Required tests for error handling
describe('ErrorBoundary', () => {
  it('should catch and transform errors', async () => {
    const failingOperation = () => Promise.reject(new Error('Network failed'))
    const boundary = new CommandErrorBoundary(failingOperation, 'test', mockLogger)
    
    const result = await boundary.execute()
    
    expect(result.success).toBe(false)
    expect(result.error.code).toBe('UNKNOWN_ERROR')
  })

  it('should attempt recovery for recoverable errors', async () => {
    const recoverableError: RaftersError = {
      code: 'FILE_NOT_FOUND',
      message: 'Config file not found',
      timestamp: new Date().toISOString(),
      recoverable: true
    }
    
    const boundary = new CommandErrorBoundary(() => Promise.reject(recoverableError), 'test', mockLogger)
    const recoveryResult = await boundary.recover(recoverableError)
    
    // Test that recovery was attempted
    expect(mockLogger.info).toHaveBeenCalledWith('Attempting to create missing file')
  })
})
```

### 16. **Test Organization**
- Mirror source structure in test files
- Use `describe` blocks to group related tests
- One test file per source file (e.g., `utils.test.ts` for `utils.ts`)
- Put unit tests in `test` directories or use `.test.ts` suffix
- Put behavor and intergration tests into the same place with `.spec.ts` suffix
- Put playwright component and e2e tests in the same place with `.e2e.ts` suffix

```
src/
  utils/
    validation.ts
    validation.test.ts
  schemas/
    registry.ts
    registry.test.ts
  test/
    lib/
      cli-commands.test.ts
      cli-commands.spec.ts
    src/
      index.test.ts
      routes/
        content/
          page.test.ts
          page.spec.ts
          page.e2e.ts
```

### 17. **Test Data & Mocking**
- Create test fixtures for complex data structures
- Mock external dependencies (file system, network calls)
- Use factories for generating test data
- Keep test data minimal but realistic

```typescript
// Test fixtures
const createValidRegistryItem = (overrides: Partial<RegistryItem> = {}): RegistryItem => ({
  name: 'button',
  description: 'Test button component',
  files: ['button.tsx'],
  dependencies: [],
  registryDependencies: [],
  ...overrides
})

// Mocking external dependencies
jest.mock('fs/promises')
const mockFs = fs as jest.Mocked<typeof fs>

describe('FileUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should read file contents when file exists', async () => {
    mockFs.readFile.mockResolvedValue('file contents')
    
    const result = await readConfigFile('/path/to/config.json')
    
    expect(result.success).toBe(true)
    expect(mockFs.readFile).toHaveBeenCalledWith('/path/to/config.json', 'utf-8')
  })
})
```

### 18. **Test Coverage Requirements**
- **100% coverage for utility functions**
- **100% coverage for schema validation logic**
- **100% coverage for error handling paths**
- **90%+ coverage for business logic**
- Use coverage reports to identify untested code paths

```bash
# Run tests with coverage
pnpm test -- --coverage

# Coverage thresholds in package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 95,
        "lines": 95,
        "statements": 95
      },
      "./src/utils/": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
```

### 19. **TDD Workflow**
1. **Red**: Write a failing test that describes desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Clean up code while keeping tests green
4. **Repeat**: Continue with next piece of functionality

```typescript
// Step 1: Red - Write failing test
describe('parsePackageJson', () => {
  it('should extract package name from valid package.json', () => {
    const packageJson = '{"name": "my-package", "version": "1.0.0"}'
    const result = parsePackageJson(packageJson)
    expect(result.success).toBe(true)
    expect(result.data.name).toBe('my-package')
  })
})

// Step 2: Green - Write minimal implementation
function parsePackageJson(content: string): Result<{name: string, version: string}> {
  const parsed = JSON.parse(content)
  return { success: true, data: { name: parsed.name, version: parsed.version } }
}

// Step 3: Refactor - Add proper error handling and validation
function parsePackageJson(content: string): Result<{name: string, version: string}> {
  try {
    const parsed = JSON.parse(content)
    const validated = PackageJsonSchema.parse(parsed)
    return { success: true, data: validated }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}
```

### 20. **Testing Anti-Patterns to Avoid**
```typescript
// ❌ Don't test implementation details
it('should call console.log with the right message', () => {
  const spy = jest.spyOn(console, 'log')
  greetUser('Alice')
  expect(spy).toHaveBeenCalledWith('Hello Alice')
})

// ✅ Test behavior and outcomes
it('should display greeting for user', () => {
  const output = captureOutput(() => greetUser('Alice'))
  expect(output).toContain('Hello Alice')
})

// ❌ Don't write tests that duplicate the implementation
it('should add two numbers', () => {
  expect(add(2, 3)).toBe(2 + 3) // This doesn't test anything useful
})

// ✅ Test specific expected results
it('should add two numbers correctly', () => {
  expect(add(2, 3)).toBe(5)
  expect(add(-1, 1)).toBe(0)
  expect(add(0, 0)).toBe(0)
})

// ❌ Don't write overly complex tests
it('should handle complex scenario', () => {
  // 50 lines of setup and assertions
})

// ✅ Break complex scenarios into focused tests
describe('complex scenario', () => {
  it('should handle first part correctly', () => { /* focused test */ })
  it('should handle second part correctly', () => { /* focused test */ })
  it('should integrate parts properly', () => { /* integration test */ })
})
```

## Error Handling System

### 14. **Structured Error Types**
- Define specific error classes for different failure modes
- Include context and recovery information
- Make errors serializable for logging and debugging
- Use Zod schemas to validate error structures

```typescript
// Base error schema and types
const BaseErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  timestamp: z.string().datetime(),
  context: z.record(z.unknown()).optional(),
  recoverable: z.boolean().default(false),
  retryable: z.boolean().default(false)
})

type BaseError = z.infer<typeof BaseErrorSchema>

// Specific error types
const ValidationErrorSchema = BaseErrorSchema.extend({
  code: z.literal('VALIDATION_ERROR'),
  field: z.string().optional(),
  expectedType: z.string().optional()
})

const FileSystemErrorSchema = BaseErrorSchema.extend({
  code: z.enum(['FILE_NOT_FOUND', 'PERMISSION_DENIED', 'DISK_FULL']),
  path: z.string(),
  operation: z.enum(['read', 'write', 'delete', 'create'])
})

const NetworkErrorSchema = BaseErrorSchema.extend({
  code: z.enum(['CONNECTION_TIMEOUT', 'DNS_RESOLUTION_FAILED', 'SERVER_ERROR']),
  url: z.string().url(),
  statusCode: z.number().optional(),
  retryable: z.literal(true) // Network errors are generally retryable
})

// Union type for all possible errors
const RaftersErrorSchema = z.discriminatedUnion('code', [
  ValidationErrorSchema,
  FileSystemErrorSchema,
  NetworkErrorSchema
])

type RaftersError = z.infer<typeof RaftersErrorSchema>
```

### 15. **Error Boundary Pattern**
- Implement error boundaries at logical system boundaries
- Provide recovery strategies and fallback behavior
- Log errors for debugging while maintaining user experience
- Transform internal errors into user-friendly messages

```typescript
// Error boundary interface
interface ErrorBoundary<T> {
  execute(): Promise<Result<T, RaftersError>>
  recover(error: RaftersError): Promise<Result<T, RaftersError>>
  fallback(): Promise<T>
}

// CLI Command Error Boundary
class CommandErrorBoundary<T> implements ErrorBoundary<T> {
  constructor(
    private operation: () => Promise<T>,
    private commandName: string,
    private logger: Logger
  ) {}

  async execute(): Promise<Result<T, RaftersError>> {
    try {
      const result = await this.operation()
      return { success: true, data: result }
    } catch (error) {
      const raftersError = this.transformError(error)
      this.logger.error(`Command ${this.commandName} failed`, raftersError)
      
      // Attempt recovery
      const recoveryResult = await this.recover(raftersError)
      if (recoveryResult.success) {
        return recoveryResult
      }
      
      return { success: false, error: raftersError }
    }
  }

  async recover(error: RaftersError): Promise<Result<T, RaftersError>> {
    if (!error.recoverable) {
      return { success: false, error }
    }

    // Implement specific recovery strategies
    switch (error.code) {
      case 'FILE_NOT_FOUND':
        this.logger.info('Attempting to create missing file')
        // Try to create default file
        break
      case 'CONNECTION_TIMEOUT':
        if (error.retryable) {
          this.logger.info('Retrying network operation')
          // Implement retry logic
        }
        break
    }

    return { success: false, error }
  }

  async fallback(): Promise<T> {
    // Provide safe fallback behavior
    throw new Error(`No fallback available for ${this.commandName}`)
  }

  private transformError(error: unknown): RaftersError {
    // Transform various error types into structured RaftersError
    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        recoverable: false,
        retryable: false
      } as RaftersError
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      timestamp: new Date().toISOString(),
      recoverable: false,
      retryable: false
    } as RaftersError
  }
}

// Usage in CLI commands
async function addComponentCommand(componentName: string): Promise<void> {
  const boundary = new CommandErrorBoundary(
    () => installComponent(componentName),
    'add',
    logger
  )

  const result = await boundary.execute()
  
  if (!result.success) {
    console.error(`❌ Failed to add component: ${result.error.message}`)
    
    // Provide user-friendly error messages and next steps
    switch (result.error.code) {
      case 'FILE_NOT_FOUND':
        console.log('💡 Try running `rafters init` first')
        break
      case 'CONNECTION_TIMEOUT':
        console.log('💡 Check your internet connection and try again')
        break
      default:
        console.log('💡 Run with --verbose for more details')
    }
    
    process.exit(1)
  }

  console.log(`✅ Successfully added ${componentName}`)
}
```

### 16. **Error Recovery Strategies**
- Implement specific recovery patterns for different error types
- Use circuit breaker pattern for unreliable operations
- Provide graceful degradation when services are unavailable
- Cache results to reduce dependency on external services

```typescript
// Circuit breaker for external API calls
class CircuitBreaker<T> {
  private failures = 0
  private readonly maxFailures = 3
  private readonly timeout = 60000 // 1 minute
  private lastFailureTime = 0

  constructor(
    private operation: () => Promise<T>,
    private fallback: () => Promise<T>
  ) {}

  async execute(): Promise<T> {
    if (this.isOpen()) {
      console.log('Circuit breaker open, using fallback')
      return await this.fallback()
    }

    try {
      const result = await this.operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private isOpen(): boolean {
    return this.failures >= this.maxFailures &&
           (Date.now() - this.lastFailureTime) < this.timeout
  }

  private onSuccess(): void {
    this.failures = 0
    this.lastFailureTime = 0
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()
  }
}

// Registry operations with fallback to local cache
async function fetchComponentWithFallback(name: string): Promise<RegistryItem> {
  const circuitBreaker = new CircuitBreaker(
    () => fetchFromRegistry(name),
    () => fetchFromLocalCache(name)
  )

  return await circuitBreaker.execute()
}
```

### 17. **Error Logging & Observability**
- Log structured error data for debugging
- Include correlation IDs for tracing
- Differentiate between user errors and system errors
- Provide actionable error messages

```typescript
interface Logger {
  error(message: string, error: RaftersError, correlationId?: string): void
  warn(message: string, context?: Record<string, unknown>): void
  info(message: string, context?: Record<string, unknown>): void
  debug(message: string, context?: Record<string, unknown>): void
}

class StructuredLogger implements Logger {
  error(message: string, error: RaftersError, correlationId?: string): void {
    const logEntry = {
      level: 'error',
      message,
      error: ErrorSchema.parse(error),
      correlationId,
      timestamp: new Date().toISOString()
    }
    
    console.error(JSON.stringify(logEntry, null, 2))
  }

  // ... other methods
}
```

## Design System Constraints

### **Elegant Minimalism Enforcement**

The design system must prevent violations through systematic constraints, not just rely on discipline.

#### ❌ **Forbidden Content**
```typescript
// These patterns will be caught by linting rules
const badExamples = [
  '✅', '❌', '🎉', '🚀', // Any emoji
  'Nice to have', 'Pretty cool', // Casual language
  '#ff0000', '#blue', // Arbitrary colors
  'margin: 20px', // Arbitrary spacing
  'font-size: 18px' // Arbitrary typography
]

// ✅ Required patterns
const goodExamples = [
  'Complete', 'Incomplete', // Clear status
  'Essential functionality', 'Core capability', // Precise language  
  'text-primary', 'bg-muted', // Semantic tokens
  'space-phi-2', 'gap-phi-1', // Mathematical spacing
  'text-body', 'heading-section' // Systematic typography
]
```

#### **Linting Rules (ESLint + Custom)**
```javascript
// .eslintrc.js - Custom rules to prevent design violations
module.exports = {
  rules: {
    // Prevent emoji usage in any context
    'no-emoji': 'error',
    
    // Prevent arbitrary color values
    'no-arbitrary-colors': 'error',
    
    // Prevent arbitrary spacing
    'no-arbitrary-spacing': 'error',
    
    // Require semantic tokens for styling
    'require-semantic-tokens': 'error',
    
    // Prevent casual language in documentation
    'professional-language-only': 'warn'
  }
}

// Custom ESLint rule definitions
const rules = {
  'no-emoji': {
    create(context) {
      return {
        Literal(node) {
          const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu
          if (typeof node.value === 'string' && emojiRegex.test(node.value)) {
            context.report({
              node,
              message: 'Emoji usage violates elegant minimalism principle. Use clear text instead.'
            })
          }
        }
      }
    }
  },
  
  'no-arbitrary-colors': {
    create(context) {
      return {
        Literal(node) {
          const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(|rgba\(|hsl\(|hsla\(/
          if (typeof node.value === 'string' && colorRegex.test(node.value)) {
            context.report({
              node,
              message: 'Use semantic color tokens instead of arbitrary values. Example: text-primary, bg-muted'
            })
          }
        }
      }
    }
  }
}
```

#### **CSS Constraints (PostCSS Plugin)**
```javascript
// postcss.config.js - Prevent arbitrary values in CSS
module.exports = {
  plugins: [
    // Custom plugin to prevent arbitrary spacing/colors
    function() {
      return {
        postcssPlugin: 'design-system-enforcer',
        Declaration(decl) {
          // Prevent arbitrary colors
          if (decl.prop.includes('color') && !decl.value.startsWith('var(--')) {
            throw new Error(`Arbitrary color "${decl.value}" not allowed. Use semantic tokens.`)
          }
          
          // Prevent arbitrary spacing
          if (['margin', 'padding', 'gap'].includes(decl.prop) && 
              !decl.value.startsWith('var(--spacing-phi)')) {
            throw new Error(`Arbitrary spacing "${decl.value}" not allowed. Use phi-based spacing.`)
          }
        }
      }
    }
  ]
}
```

#### **Documentation Constraints**
```typescript
// Schema for documentation content validation
const DocumentationSchema = z.object({
  content: z.string()
    .refine(text => !hasEmoji(text), 'Documentation cannot contain emoji')
    .refine(text => !hasCasualLanguage(text), 'Use professional language only')
    .refine(text => !hasArbitraryValues(text), 'Code examples must use semantic tokens'),
  
  examples: z.array(z.object({
    code: z.string()
      .refine(code => !hasArbitraryColors(code), 'Examples must use semantic color tokens')
      .refine(code => !hasArbitrarySpacing(code), 'Examples must use phi-based spacing')
  }))
})

// Validation functions
function hasEmoji(text: string): boolean {
  const emojiRegex = /[\u{1F600}-\u{1F64F}]/gu
  return emojiRegex.test(text)
}

function hasCasualLanguage(text: string): boolean {
  const casualPhrases = ['pretty cool', 'nice to have', 'awesome', 'sweet']
  return casualPhrases.some(phrase => text.toLowerCase().includes(phrase))
}

function hasArbitraryValues(text: string): boolean {
  return /#[0-9a-fA-F]{6}|margin:\s*\d+px/.test(text)
}
```

#### **Component JSDoc Intelligence Validation**
```typescript
// Validate all components have proper JSDoc intelligence annotations
const ComponentIntelligenceSchema = z.object({
  registryName: z.string(),
  cognitiveLoad: z.string().regex(/^\d+\/10/),
  attentionEconomics: z.string().min(10),
  trustBuilding: z.string().min(10),
  accessibility: z.string().min(10),
  semanticMeaning: z.string().min(10)
})

// Build-time validation for component intelligence
export function validateComponentIntelligence(componentsPath: string): void {
  const componentFiles = glob.sync(`${componentsPath}/**/*.{ts,tsx}`)
  
  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8')
    
    // Check for required JSDoc intelligence annotations
    if (!hasIntelligenceAnnotations(content)) {
      throw new Error(`Missing JSDoc intelligence in ${file}. Required: @cognitive-load, @attention-economics, @trust-building, @accessibility, @semantic-meaning`)
    }
    
    // Check for emoji in component content
    if (hasEmoji(content)) {
      throw new Error(`Emoji found in ${file}. Violates elegant minimalism principle.`)
    }
    
    // Check for arbitrary CSS values
    if (hasArbitraryValues(content)) {
      throw new Error(`Arbitrary CSS values found in ${file}. Use semantic tokens only.`)
    }
  })
}
```

#### **Component API Constraints**
```typescript
// Component props must only accept semantic tokens
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' // No arbitrary variants
  size?: 'sm' | 'md' | 'lg' // Systematic sizing only
  // ❌ This would be forbidden:
  // color?: string // Allows arbitrary colors
  // spacing?: number // Allows arbitrary spacing
}

// Use branded types to prevent arbitrary values
type SemanticColor = `text-${string}` | `bg-${string}` // Must start with semantic prefix
type PhiSpacing = `phi-${number}` | `phi--${number}` // Must use phi spacing

interface LayoutProps {
  className?: SemanticColor | PhiSpacing // Only semantic values allowed
}
```

#### **Build-Time Validation**
```typescript
// Vite plugin to validate design system compliance
export function designSystemValidationPlugin(): Plugin {
  return {
    name: 'design-system-validation',
    buildStart() {
      // Validate all component files
      validateComponentFiles('./src/components')
      
      // Validate component intelligence
      validateComponentIntelligence('./src/components')
      
      // Validate CSS for arbitrary values
      validateCSSFiles('./src')
    }
  }
}

// Add to vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    designSystemValidationPlugin() // Fails build if violations found
  ]
})
```

#### **AI Agent Guidelines**
```typescript
// Guidelines that AI must follow (enforced by system prompts)
const AgentConstraints = {
  content: {
    forbidden: ['emoji', 'casual language', 'arbitrary values'],
    required: ['semantic tokens', 'professional language', 'mathematical spacing']
  },
  
  validation: {
    beforeSubmit: [
      'checkForEmoji',
      'validateSemanticTokens', 
      'ensureProfessionalLanguage'
    ]
  },
  
  recovery: {
    onViolation: [
      'removeEmoji',
      'replaceArbitraryWithSemantic',
      'rephraseWithProfessionalLanguage'
    ]
  }
}

// Pre-commit hook to validate changes
export function validateCommit(files: string[]): boolean {
  return files.every(file => {
    const content = fs.readFileSync(file, 'utf-8')
    return (
      !hasEmoji(content) &&
      !hasArbitraryValues(content) &&
      !hasCasualLanguage(content)
    )
  })
}
```

### **Systematic Prevention Strategy**

1. **Linting Rules**: Catch violations at development time
2. **Schema Validation**: Validate content structure and values
3. **Build Constraints**: Fail builds that contain violations
4. **Component APIs**: Make it impossible to pass arbitrary values
5. **Documentation Validation**: Ensure all docs follow principles
6. **Pre-commit Hooks**: Block commits with violations

**The goal**: Make it **harder to violate principles than to follow them**.

---

## Component Intelligence Standards (JSDoc)

### JSDoc Intelligence Requirements (MANDATORY)

**Every component MUST implement comprehensive JSDoc intelligence annotations** for AI agent access. This is non-negotiable for component completion:

#### 1. **Registry Metadata** (Required)
- `@registry-name` - Component identifier for registry system
- `@registry-version` - Semantic version for component tracking  
- `@registry-status` - published | draft | deprecated
- `@registry-path` - File path for component location
- `@registry-type` - Always `registry:component`

#### 2. **Design Intelligence** (Required)
- `@cognitive-load` - Mental effort rating (1-10 scale) with description
- `@attention-economics` - Visual hierarchy and attention management rules
- `@trust-building` - User confidence patterns and safety requirements
- `@accessibility` - WCAG compliance level and screen reader support
- `@semantic-meaning` - Variant purposes and contextual usage rules

#### 3. **Usage Documentation** (Required)
- `@usage-patterns` - DO/NEVER guidelines for proper usage
- `@design-guides` - Links to relevant design intelligence documentation
- `@dependencies` - Required external packages  
- `@example` - Code examples with contextual commentary

#### 4. **Trust Level Implementation** (Required for interactive components)
Components must implement trust levels based on consequence severity:
- **Low Trust** - Routine actions, minimal friction, reversible
- **Medium Trust** - Moderate consequences, balanced caution
- **High Trust** - Significant impact, deliberate friction  
- **Critical Trust** - Permanent consequences, maximum friction

### Trust-Building Intelligence Framework

Components implement **4 trust levels** that match user psychology:

- **Low Trust** - Routine actions, minimal friction, reversible
- **Medium Trust** - Moderate consequences, balanced caution  
- **High Trust** - Significant impact, deliberate friction
- **Critical Trust** - Permanent consequences, maximum friction

### JSDoc Implementation Example

```typescript
/**
 * Interactive button component for user actions
 *
 * @registry-name button
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Button.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Size hierarchy: sm=tertiary, md=secondary, lg=primary. Primary variant commands highest attention - use sparingly (maximum 1 per section)
 * @trust-building Destructive actions require confirmation patterns. Loading states prevent double-submission. Visual feedback reinforces user actions.
 * @accessibility WCAG AAA compliant with 44px minimum touch targets, high contrast ratios, and screen reader optimization
 * @semantic-meaning Variant mapping: primary=main actions, secondary=supporting actions, destructive=irreversible actions with safety patterns
 *
 * @usage-patterns
 * DO: Primary buttons for main user goal, maximum 1 per section
 * DO: Secondary buttons for alternative paths, supporting actions  
 * DO: Destructive variant for permanent actions, requires confirmation patterns
 * NEVER: Multiple primary buttons competing for attention
 *
 * @design-guides
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Trust Building: https://rafters.realhandy.tech/docs/llm/trust-building
 *
 * @dependencies @radix-ui/react-slot
 *
 * @example
 * ```tsx
 * // Primary action - highest attention, use once per section
 * <Button variant="primary">Save Changes</Button>
 *
 * // Destructive action - requires confirmation UX  
 * <Button variant="destructive" destructiveConfirm>Delete Account</Button>
 * ```
 */
export function Button({ variant = 'primary', ...props }: ButtonProps) {
  // Component implementation with embedded intelligence
  return (
    <button
      className={cn(
        // Base styles using semantic tokens
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        // Trust-building visual feedback
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        // Attention economics through variant hierarchy
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
        }
      )}
      {...props}
    />
  )
}
```

### Component Testing Standards

#### Component Intelligence Validation
**Every component MUST include comprehensive intelligence for AI agent access:**

```typescript
// Component intelligence validation
function validateComponentIntelligence(component: React.ComponentType): boolean {
  const jsdoc = extractJSDocFromComponent(component)
  
  return (
    jsdoc.includes('@cognitive-load') &&
    jsdoc.includes('@attention-economics') &&
    jsdoc.includes('@trust-building') &&
    jsdoc.includes('@accessibility') &&
    jsdoc.includes('@semantic-meaning')
  )
}
```

#### Testing Strategy (UI Package)
**Component testing focuses on intelligence accessibility and functionality:**
- Components must render without errors
- JSDoc intelligence must be parseable by AI agents  
- Interactive elements must handle state changes properly
- Accessibility patterns must be verifiable
- Semantic tokens must be used exclusively

### Quality Checklist

**Component is NOT complete until:**
- ✅ Comprehensive JSDoc intelligence annotations implemented
- ✅ Trust levels properly mapped and implemented in component logic
- ✅ Progressive confirmation patterns for destructive actions
- ✅ WCAG AAA accessibility compliance in component implementation
- ✅ Components render without errors in tests
- ✅ All required intelligence annotations present and complete
- ✅ AI intelligence embedded in component JSDoc
- ✅ Real-world usage examples in @example annotations

**Reference Implementation:**
See `packages/ui/src/components/Button.tsx` for complete JSDoc intelligence example.

### Testing Commands (UI Package)

**UI Package component testing:**
```bash
# UI Package testing  
pnpm --filter @rafters/ui test              # Runs component tests
pnpm --filter @rafters/ui build             # Verify component builds
pnpm --filter @rafters/ui lint              # Lint component intelligence

# Other packages use traditional unit testing  
pnpm --filter @rafters/cli test            # Unit tests with .test.ts files
pnpm --filter @rafters/color-utils test    # Unit tests with .test.ts files
```

**Component intelligence is embedded in JSDoc** - AI agents access design reasoning through ComponentRegistry and MCP integration, not separate test files.

**For detailed examples and patterns, see:**
- `docs/COMPONENT_JSDOC_TEMPLATE.md` - Complete JSDoc intelligence template
- `packages/ui/src/components/Button.tsx` - Reference implementation with full intelligence
- `packages/design-tokens/` - TokenRegistry for implementation values
