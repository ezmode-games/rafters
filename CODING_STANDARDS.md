# Coding Standards

## CRITICAL RULES - ZERO TOLERANCE

This is a pnpm workspace. npm and npx can destroy the build and cache. not mention make a mess with the workspace.
NEVER use npm or npx

### 1. PREFLIGHT IS MANDATORY

```bash
pnpm preflight
```

#### When preflight fails, disabling lefthook is not allowed.

**Build will fail if preflight was not run locally. No exceptions.**

### 2. NO `any` TYPES - BUILD FAILURE

```typescript
// ❌ FORBIDDEN - Causes build failure
function process(data: any): any { }

// ✅ REQUIRED
function process(data: unknown): Result<ProcessedData> {
  return ProcessedDataSchema.parse(data)
}
```

**Biome config enforces `noExplicitAny: error`**

### 3. NO EMOJI ANYWHERE

- Code, comments, commit messages, documentation
- Build fails if emoji detected
- Use descriptive text only

### 4. ZOD FOR ALL EXTERNAL DATA

```typescript
// ❌ FORBIDDEN
const data = JSON.parse(response)

// ✅ REQUIRED
const data = DataSchema.parse(JSON.parse(response))
```

### 5. NO `.then()` CHAINS

```typescript
// ❌ FORBIDDEN
fetch('/api').then(r => r.json())

// ✅ REQUIRED
const response = await fetch('/api')
const data = await response.json()
```

### 6. REACT 19 PURITY

```typescript
// ❌ FORBIDDEN - Impure
function Component() {
  const id = Math.random()
  return <div>{id}</div>
}

// ✅ REQUIRED - Pure
function Component() {
  const [id] = useState(() => Math.random())
  return <div>{id}</div>
}
```

## TEST REQUIREMENTS

### Test File Structure
```
src/component.ts
src/component.test.ts     # Unit tests
test/component.spec.ts    # Integration tests
test/component.e2e.ts     # E2E tests
```

### Mock Typing
```typescript
// ❌ FORBIDDEN
vi.mocked(func as any)

// ✅ REQUIRED
vi.mocked(func).mockReturnValue(validResult)
```

## ERROR HANDLING

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

## COMMIT REQUIREMENTS

```bash
# ✅ REQUIRED
feat(auth): add user validation with Zod schemas

# ❌ FORBIDDEN
feat: add user validation with emoji
```

## ENFORCEMENT

- **Pre-commit hooks** block violations
- **CI fails** if preflight not run
- **Build fails** on any violations
- **No biome-ignore** comments allowed