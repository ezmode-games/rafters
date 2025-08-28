# Rafters+ Architecture Notes

**DELETE THIS FILE** when Rafters+ is implemented. This is temporary planning documentation.

## Functional Persistence Overloading

Rafters+ will use functional overloading to provide Cloudflare D1/KV persistence while maintaining identical DX to open source.

### Core Package (`@rafters/design-tokens`)
```typescript
// JSON file persistence (open source default)
export const createRegistry = (tokensDir: string): TokenRegistry => {
  const tokens = loadFromJSON(tokensDir)
  return new TokenRegistry(tokens)
}

export const saveRegistry = (registry: TokenRegistry, tokensDir: string): void => {
  saveToJSON(registry.list(), tokensDir)
}
```

### Rafters+ Package (`@rafters/design-tokens-plus`)
```typescript
// Cloudflare D1/KV persistence (same function signatures)
export const createRegistry = (d1Instance: D1Database): TokenRegistry => {
  const tokens = loadFromD1(d1Instance)
  return new TokenRegistry(tokens)
}

export const saveRegistry = (registry: TokenRegistry, d1Instance: D1Database): void => {
  saveToD1(registry.list(), d1Instance)
}

// KV variant
export const createRegistryKV = (kv: KVNamespace): TokenRegistry => {
  const tokens = loadFromKV(kv)
  return new TokenRegistry(tokens)
}
```

### Usage Examples

**Open Source Studio:**
```typescript
import { createRegistry, saveRegistry } from '@rafters/design-tokens'

// Load from JSON files
const registry = createRegistry('./.rafters/tokens')

// Modify tokens
registry.set('primary', 'oklch(0.5 0.2 240)')

// Save back to JSON files
saveRegistry(registry, './.rafters/tokens')
```

**Rafters+ Studio:**
```typescript
import { createRegistry, saveRegistry } from '@rafters/design-tokens-plus'

// Load from D1
const registry = createRegistry(env.DB)

// Same API, different persistence
registry.set('primary', 'oklch(0.5 0.2 240)')

// Save back to D1
saveRegistry(registry, env.DB)
```

## Key Benefits

1. **Identical DX** - Same function names, same patterns
2. **No OOP complexity** - Pure functional overloading
3. **Registry class unchanged** - Just Map operations, no persistence logic
4. **Easy migration** - Change import, pass different parameter
5. **MCP compatibility** - Same Registry interface for AI agents

## MCP Integration

Both packages expose identical Registry interface to MCP:

```typescript
// Works with either package
const registry = createRegistry(persistenceLayer)

// MCP tools query same interface
registry.get('primary') // Returns full token with intelligence metadata
registry.list() // Returns all tokens for AI decision-making
```

## Implementation Priority

1. **Phase 1**: Complete open source with JSON persistence
2. **Phase 2**: Create `@rafters/design-tokens-plus` package
3. **Phase 3**: Implement D1/KV persistence functions
4. **Phase 4**: Deploy Rafters+ Studio with cloud persistence
5. **Phase 5**: Delete this file

## Technical Notes

- Registry stays as simple Map wrapper
- Persistence logic moves to pure functions
- Same TokenRegistry class used by both packages  
- No adapter patterns or interfaces needed
- Function overloading handles persistence differences