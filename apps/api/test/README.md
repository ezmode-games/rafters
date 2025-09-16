# Color Intelligence API Test Suite

Comprehensive test coverage for the Rafters Color Intelligence API built with Hono and Cloudflare Workers.

## Test Architecture

### Unit Tests (.test.ts)
- **Environment**: Node.js with Vitest
- **Purpose**: Test individual functions in isolation with mocked dependencies
- **Command**: `pnpm test`

#### Files:
- `lib/color-intel/utils.test.ts` - Tests core color intelligence generation functions
- `routes/color-intel.test.ts` - Tests route-specific logic and mathematical functions

### Integration Tests (.spec.ts)
- **Environment**: Cloudflare Workers runtime with `@cloudflare/vitest-pool-workers`
- **Purpose**: Test complete API endpoints with real Workers environment
- **Command**: `pnpm test:integration`

#### Files:
- `api-integration.spec.ts` - Basic API functionality with Workers runtime
- `setup.ts` - Shared test setup for Workers environment

## Test Coverage

### Core Functionality Tests
- ✅ Color intelligence generation with Workers AI
- ✅ OKLCH validation and error handling
- ✅ Mathematical color data generation
- ✅ Vector dimension generation for Vectorize
- ✅ Response schema validation against ColorValue

### Integration Tests
- ✅ Complete API endpoint with POST requests
- ✅ CORS handling and preflight requests
- ✅ Error responses for invalid input
- ✅ Vectorize caching and retrieval
- ✅ AI service integration and fallbacks

### Error Handling
- ✅ Invalid OKLCH values (lightness, chroma, hue out of range)
- ✅ Missing required fields
- ✅ Malformed JSON requests
- ✅ Missing API keys
- ✅ AI service failures
- ✅ Vectorize operation failures

### Cache Testing
- ✅ Data storage in Vectorize on first request
- ✅ Cache retrieval on subsequent requests
- ✅ Expire flag functionality
- ✅ Graceful degradation when caching fails

## Key Test Patterns

### Workers AI Mocking
```typescript
const mockAI = {
  run: vi.fn().mockResolvedValue({
    response: JSON.stringify({
      suggestedName: 'Test Color',
      reasoning: 'Test reasoning',
      // ... other fields
    }),
  }),
};
(env as any).AI = mockAI;
```

### Vectorize Testing
- Tests use isolated KV namespaces via Miniflare
- Vectorize operations are tested with real Workers environment
- Graceful failure handling when Vectorize is unavailable

### Request/Response Testing
```typescript
const request = new Request('http://localhost/api/color-intel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ oklch: { l: 0.65, c: 0.12, h: 240 } }),
});

const response = await app.fetch(request, env, ctx);
await waitOnExecutionContext(ctx);
```

## Mathematical Function Testing

### Vector Generation
- Tests deterministic 384-dimension vector generation
- Validates mathematical relationships and consistency
- Ensures correct dimension distribution for Vectorize

### Color Theory Validation
- OKLCH value boundary testing
- Semantic dimension calculation (warm/cool, light/dark, high/low chroma)
- Trigonometric hue encoding validation

## Running Tests

### All Tests
```bash
pnpm test:preflight
```

### Unit Tests Only
```bash
pnpm test
```

### Integration Tests Only
```bash
pnpm test:integration
```

## Test Environment Requirements

### Dependencies
- `@cloudflare/vitest-pool-workers` for Workers runtime testing
- `@rafters/color-utils` for mathematical color functions
- `@rafters/shared` for TypeScript schemas
- Vitest with proper Workers configuration

### Environment Variables
- Tests use mocked API keys and service URLs
- Real Cloudflare bindings are available but mocked for safety
- Vectorize and KV operations use isolated test namespaces

## Best Practices

1. **Mock External Services**: All external API calls are mocked
2. **Isolated Tests**: Each test runs independently with clean state
3. **Comprehensive Error Testing**: Every error path is validated
4. **Schema Validation**: All responses are validated against TypeScript schemas
5. **Workers Runtime**: Integration tests use actual Workers environment
6. **Performance**: Unit tests focus on speed, integration tests on correctness

## Future Enhancements

- Visual regression testing for color harmonies
- Performance benchmarking for vector generation
- E2E tests with real AI services (optional)
- Cross-browser compatibility testing for color rendering