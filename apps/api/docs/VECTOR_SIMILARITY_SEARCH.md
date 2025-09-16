# Vector Similarity Search for Colors

The Rafters Color Intelligence system uses Cloudflare Vectorize to enable powerful semantic search across color space. Each color is stored as a 384-dimensional vector that captures mathematical relationships, enabling you to find visually similar colors.

## Overview

When colors are processed through the queue system or color-intel API, they are automatically stored in Vectorize with:
- **384-dimensional vectors** - Mathematical encoding of color relationships
- **Complete metadata** - Full color intelligence data including AI-generated names
- **Semantic search capabilities** - Find similar colors based on perceptual relationships

## Using Vector Similarity Search

### Method 1: Command Line with Wrangler

Find colors similar to an existing color using its ID:

```bash
pnpm wrangler vectorize query rafters-color-intel \
  --vector-id oklch-0.50-0.15-200 \
  --top-k 8 \
  --return-metadata all
```

**Parameters:**
- `--vector-id` - Use an existing color ID from the vector store
- `--top-k` - Number of similar colors to return (default: 5)
- `--return-metadata all` - Include complete color intelligence data

### Method 2: Query by Vector Values

If you have the raw vector values, you can search directly:

```bash
pnpm wrangler vectorize query rafters-color-intel \
  --vector $(cat vector_values.json | jq -r '.[]' | xargs) \
  --top-k 5
```

### Method 3: API Integration (Recommended for MCP)

Create an API endpoint that wraps the vector search functionality:

```typescript
// Example API endpoint for similarity search
app.post('/api/color-intel/similar', async (c) => {
  const { colorId, limit = 5 } = await c.req.json();

  // Query Vectorize for similar colors
  const results = await c.env.VECTORIZE.query(colorId, {
    topK: limit,
    returnMetadata: true
  });

  return c.json({
    similar: results.matches.map(match => ({
      id: match.id,
      similarity: match.score,
      color: JSON.parse(match.metadata.complete_color_value)
    }))
  });
});
```

## Practical Use Cases

### 1. Finding Color Families

Search for colors in the same family (like steel blue variations):

```bash
# Find steel blue family
pnpm wrangler vectorize query rafters-color-intel \
  --vector-id oklch-0.50-0.15-200 \
  --top-k 8 \
  --return-metadata all
```

Results in names like:
- "Glacier Mist" (original)
- "teal-horizon" (lighter, more teal)
- "twilight-horizon" (more purple-blue)
- "midnight-nautical" (darker, saturated)

### 2. Semantic Color Exploration

The AI generates poetic, descriptive names that help understand color relationships:
- **Steel blues**: "Glacier Mist", "Arctic Horizon"
- **Extreme colors**: "Velvet Oblivion", "Radiant Fuchsia Blaze"
- **Natural tones**: "Glowing Emeralds' Gaze"

### 3. Design System Color Palette Generation

Use similarity search to build cohesive color palettes:

1. Start with a base color
2. Find similar colors with different lightness/chroma
3. Extract harmonious variations
4. Build complete design system palettes

## Vector Structure

Each color vector contains 384 dimensions:
- **Positions 0-3**: Core OKLCH values (L, C, H, Alpha)
- **Positions 4-8**: Semantic dimensions (warm/cool, light/dark, saturated)
- **Positions 9-383**: Mathematical functions encoding color relationships

## Integration with MCP

### Recommended MCP Functions

```typescript
// 1. Find similar colors
async function findSimilarColors(colorId: string, limit: number = 5) {
  // Query Vectorize for similar colors
  // Return array of similar colors with intelligence data
}

// 2. Color family exploration
async function exploreColorFamily(oklch: OKLCH, radius: number = 0.1) {
  // Generate color, find similar colors within perceptual radius
  // Return color family with AI-generated names
}

// 3. Palette generation
async function generatePalette(baseColor: string, style: 'monochromatic' | 'analogous' | 'complementary') {
  // Use similarity search + color theory to build palettes
  // Return complete palette with usage guidance
}
```

### Error Handling

Common issues and solutions:

```bash
# Error: "expected 384 dimensions, got 0"
# Solution: Use --vector-id instead of --vector for existing colors

# Error: Command line too long with vector values
# Solution: Use file input or API endpoint instead

# Error: Color not found
# Solution: Verify color exists with list-vectors command
```

## Queue System Integration

### Asynchronous Color Processing

The vector similarity search integrates with Cloudflare Queues for efficient batch processing:

```bash
# Queue colors for background processing
curl -H "X-API-Key: your-api-key" \
     -H "Content-Type: application/json" \
     -X POST https://rafters.realhandy.tech/api/seed-queue/spectrum \
     -d '{"lightnessSteps": 9, "chromaSteps": 5, "hueSteps": 12}'
```

**Queue Benefits:**
- **Bulk Processing**: Generate hundreds of colors without blocking HTTP requests
- **Rate Limiting**: Respects Cloudflare's 400 messages/second queue limit
- **Error Handling**: Automatic retry and dead letter queue for failed processing
- **Scalability**: Process large color datasets in the background

### Queue-Generated Vector Data

When colors are processed through the queue system:

1. **Queue Publishing** - Colors are batched and sent to Cloudflare Queue
2. **Consumer Processing** - Queue consumer calls `/api/color-intel` internally
3. **Vector Storage** - Each processed color generates a 384-dimensional vector
4. **Automatic Indexing** - Vectors are immediately searchable via similarity queries

**Monitoring Queue Processing:**

```bash
# Check queue status
curl -H "X-API-Key: your-api-key" \
     https://rafters.realhandy.tech/api/seed-queue/status

# List processed vectors
pnpm wrangler vectorize list-vectors rafters-color-intel --limit 10
```

## Advanced Features

### 1. Filtered Search

Search within specific color ranges:

```bash
pnpm wrangler vectorize query rafters-color-intel \
  --vector-id oklch-0.50-0.15-200 \
  --filter '{"analysis.temperature": "cool"}' \
  --top-k 5
```

### 2. Namespace Organization

Organize colors by project or theme:

```bash
pnpm wrangler vectorize query rafters-color-intel \
  --vector-id oklch-0.50-0.15-200 \
  --namespace "design-system-v2" \
  --top-k 5
```

### 3. Distance Thresholds

Control similarity sensitivity by examining scores:
- **0.99+**: Very similar colors (minor variations)
- **0.95-0.99**: Similar family (good for palettes)
- **0.90-0.95**: Related colors (broader exploration)
- **<0.90**: Different color families

## Performance Notes

- **Vector queries**: ~100-200ms response time
- **Index size**: Currently 369 colors, supports thousands
- **Concurrent queries**: Cloudflare handles auto-scaling
- **Cost**: Minimal - vector operations are very efficient

## Example Output

```json
{
  "count": 8,
  "matches": [
    {
      "id": "oklch-0.50-0.15-200",
      "score": 1.0,
      "metadata": {
        "complete_color_value": "{\"intelligence\":{\"suggestedName\":\"Glacier Mist\"}}"
      }
    },
    {
      "id": "oklch-0.60-0.12-180",
      "score": 0.9999971,
      "metadata": {
        "complete_color_value": "{\"intelligence\":{\"suggestedName\":\"teal-horizon\"}}"
      }
    }
  ]
}
```

This enables powerful color exploration and palette generation based on mathematical color relationships rather than simple hue/saturation rules.