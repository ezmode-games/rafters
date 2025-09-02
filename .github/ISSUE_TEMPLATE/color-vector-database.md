---
name: Implementation Task
about: SOLID implementation task for AI agents
title: "Implement Cloudflare Vector Database for Color Intelligence Caching"
labels: enhancement
assignees: ''
---

## Goal

**Replace expensive per-request AI color intelligence API calls with a pre-computed Cloudflare Vector database that provides instant color intelligence matching via semantic similarity.**

## Exact Implementation Requirements

### Required Interface/Class Structure
```typescript
// Color vector database client
export class ColorVectorDatabase {
  constructor(private vectorizeIndex: VectorizeIndex);
  
  // Find semantically similar color intelligence
  findSimilarColors(oklch: OklchColor, limit?: number): Promise<ColorIntelligenceMatch[]>;
  
  // Batch upsert pre-computed color intelligence
  upsertColorIntelligence(colors: ColorIntelligenceVector[]): Promise<void>;
  
  // Get exact match or nearest neighbor
  getColorIntelligence(oklch: OklchColor): Promise<ColorIntelligence | null>;
}

export interface ColorIntelligenceVector {
  id: string; // OKLCH string as ID
  values: number[]; // 5-dimensional embedding [L, C, H, semantic, temperature]
  metadata: {
    oklch: OklchColor;
    intelligence: ColorIntelligence;
    generatedAt: string;
  };
}

export interface ColorIntelligenceMatch {
  score: number; // Similarity score 0-1
  intelligence: ColorIntelligence;
  distance: number; // Perceptual distance in OKLCH space
}
```

### Behavior Requirements
- Generate 540 strategic OKLCH color points (9L × 5C × 12H) with pre-computed AI intelligence
- Create 5-dimensional embeddings: [L, C, H, semantic_category, temperature_weight] 
- Achieve <100ms response times for color intelligence queries
- Support batch operations for seeding the database
- Fall back to API calls only for colors with no similar matches (>0.1 perceptual distance)

### Error Handling
- Throw `VectorDatabaseError` with specific error codes for connection failures
- Return `null` for `getColorIntelligence` when no similar colors found within threshold
- Log API fallback usage for monitoring pre-computation coverage
- Gracefully handle Vectorize service limits and retry with exponential backoff

## Acceptance Criteria

### Functional Tests Required
```typescript
describe('ColorVectorDatabase', () => {
  it('should find semantically similar colors within threshold', async () => {
    const result = await colorVectorDb.findSimilarColors({ l: 0.5, c: 0.1, h: 240 });
    expect(result).toHaveLength(3);
    expect(result[0].score).toBeGreaterThan(0.8);
    expect(result[0].intelligence.primaryMood).toBe('trustworthy');
  });

  it('should return exact match for pre-computed colors', async () => {
    const intelligence = await colorVectorDb.getColorIntelligence({ l: 0.5, c: 0.12, h: 240 });
    expect(intelligence).toBeDefined();
    expect(intelligence.suggestedName).toBe('Ocean Blue');
  });

  it('should batch upsert 540 pre-computed colors', async () => {
    const vectors = generateColorSpectrum(); // 540 colors
    await expect(colorVectorDb.upsertColorIntelligence(vectors)).resolves.toBeUndefined();
  });
});
```

### Performance Requirements  
- Query response time: <100ms for single color lookups
- Batch upsert: Handle 540 colors in <30 seconds
- Memory usage: <50MB for embedding generation
- Vector similarity search: <50ms within Cloudflare Vectorize

### TypeScript Requirements
- All vector operations must be strongly typed with proper OklchColor interfaces
- Generic constraints for vector dimensions (exactly 5 dimensions)
- Strict metadata typing with ColorIntelligence schema validation
- No `any` types - use proper union types for error states

## What NOT to Include

- Real-time AI color analysis (separate from this caching system)
- Color palette generation (different feature entirely)
- Migration of existing KV-based color intelligence (future task)

## File Locations

- Implementation: `packages/color-utils/src/vector-database.ts`
- Tests: `packages/color-utils/test/vector-database.test.ts`
- Types: `packages/shared/src/types/color-intelligence.ts` (extend existing)
- Export from: `packages/color-utils/src/index.ts`
- Seeding script: `scripts/seed-color-vectors.ts`

## Integration Requirements

### Dependencies
- `@cloudflare/workers-types` for Vectorize bindings
- Existing `@rafters/shared` types for ColorIntelligence
- Existing color-utils OKLCH conversion functions
- Claude API integration for initial intelligence generation

### Usage Examples
```typescript
// Initialize in Cloudflare Worker
const colorVectorDb = new ColorVectorDatabase(env.RAFTERS_COLOR_VECTORS);

// Get instant color intelligence
const userColor = { l: 0.45, c: 0.15, h: 210 };
const intelligence = await colorVectorDb.getColorIntelligence(userColor);

// Fall back to API only if no match
if (!intelligence) {
  intelligence = await claudeColorAnalysis(userColor);
  // Cache result for future queries
}
```

## Success Criteria

- [ ] All functional tests pass with real Cloudflare Vectorize integration
- [ ] TypeScript compiles without errors (strict mode)
- [ ] Performance benchmarks meet <100ms query requirements
- [ ] 540 strategic colors successfully seeded with AI intelligence
- [ ] Integration tests demonstrate 10x cost reduction vs direct API calls
- [ ] Vector similarity matching achieves >90% relevance for color queries

**This issue is complete when:** The color intelligence API can serve responses in <100ms by querying pre-computed vectors, with <10% API fallback rate for the strategic 540-color spectrum.

## Context & References

- Related issues: Color intelligence hanging in tests, API cost optimization
- Cost analysis: $0.54 for 306 colors using Claude Haiku (one-time cost vs per-request)
- Cloudflare Vectorize docs: https://developers.cloudflare.com/vectorize/
- OKLCH perceptual uniformity: Enables accurate similarity matching in color space
- Strategic color spectrum: 9 lightness × 5 chroma × 12 hue = 540 comprehensive coverage points