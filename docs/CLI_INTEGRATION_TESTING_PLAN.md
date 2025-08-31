# CLI Integration Testing Infrastructure Plan

## Problem Statement
Currently, the Rafters CLI only has unit tests with mocked dependencies. We need **real integration tests** that run against actual project structures to catch:

- File system mutations (`rafters init` creating `.rafters/` directory)
- Token file generation (actual JSON content validation)
- Component installation (real file copying/modifications)
- Registry HTTP requests (network integration)
- Framework-specific integrations (Next.js, React Router 7, etc.)

## Solution: Dummy App Pattern (Rails RSpec Style)

Following Rails' proven pattern of dummy apps in `spec/dummy/`, we'll create real test applications using the **exact same generators users actually run**.

## Test Fixture Strategy

### 1. Real-World Generators
- **Next.js**: `npx create-next-app@latest` (TypeScript + Tailwind)
- **React Router 7**: `npx create-react-router@latest` (TypeScript)
- **Vite + React**: `npm create vite@latest` (react-ts template)
- **Empty Project**: Just package.json (edge cases)

### 2. Test Structure
```
apps/cli/
├── scripts/
│   └── create-test-fixtures.js    # Generate fresh test apps
├── test/
│   ├── fixtures/                  # Generated test apps (gitignored)
│   │   ├── nextjs-app/           # Fresh Next.js install
│   │   ├── rr7-app/              # React Router 7 app
│   │   ├── vite-react/           # Vite + React app
│   │   └── empty-project/        # Minimal package.json
│   └── integration/              # Integration test suites
│       ├── init.spec.ts          # Test `rafters init`
│       ├── add.spec.ts           # Test `rafters add button`
│       ├── tokens.spec.ts        # Test token commands
│       └── mcp.spec.ts           # Test MCP server
```

### 3. Test Patterns
```typescript
// Instead of mocking everything
vi.mock('fs', () => ({ existsSync: vi.fn() }))

// Test against real filesystem
const testApp = await createTempTestApp('nextjs-app')
await runCLI(['init'], { cwd: testApp })

expect(existsSync(`${testApp}/.rafters/tokens`)).toBe(true)
const tokens = JSON.parse(readFileSync(`${testApp}/.rafters/tokens/color.json`))
expect(tokens.tokens).toHaveLength(12)
expect(tokens.tokens[0].name).toBe('primary')
```

## What We'll Test That We Currently Can't

### `rafters init` Command
- Creates `.rafters/` directory structure
- Generates proper `rafters.json` config  
- Creates token files with correct JSON schema
- Handles different framework detection (Next.js vs Vite vs RR7)
- Proper error handling for existing installations

### `rafters add` Command  
- HTTP requests to actual registry
- File copying to correct locations (`src/components/ui/`)
- Import statement modifications
- Dependency installation prompts
- Framework-specific file paths

### `rafters tokens` Commands
- Reading actual token files from `.rafters/tokens/`
- JSON schema validation
- ColorValue vs string handling
- Registry integration with real data

### `rafters mcp` Server
- Socket/stdio communication
- Real token registry access
- Component metadata fetching
- Error handling with actual file system

## Implementation Plan

1. **Create Fixture Generator** (Done)
2. **Add Package.json Scripts** for test management
3. **Integration Test Suite** with real CLI execution
4. **CI Integration** (GitHub Actions)
5. **Documentation** for contributors

## Benefits

- **Catch Real Bugs**: File permission issues, HTTP timeouts, framework incompatibilities
- **Confidence**: Tests run against what users actually see
- **Regression Prevention**: Changes that break real-world usage get caught
- **Framework Support**: Easy to add new framework fixtures
- **Contributor Onboarding**: Clear examples of expected CLI behavior

## Next Steps

1. Switch back to main branch
2. Commit and PR the MCP server work
3. Deploy MCP functionality  
4. Return to this branch and implement full integration testing

This follows the battle-tested Rails pattern and will make Rafters CLI production-ready.