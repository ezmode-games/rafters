# Rafters API

**Color Intelligence API - Hono on Cloudflare Workers**

This API provides AI-powered color analysis and intelligence using Claude 3.5 Haiku, with Cloudflare KV caching for performance.

## What it does

The Color Intelligence API analyzes OKLCH colors and provides comprehensive design guidance:

- **Color Theory Analysis**: Detailed reasoning about why specific OKLCH combinations work
- **Emotional Impact**: Psychological responses and behavioral influences  
- **Cultural Context**: Cross-cultural color associations and sensitivities
- **Accessibility Guidance**: WCAG compliance recommendations and contrast ratios
- **Usage Patterns**: When and how to use colors in design systems

## Architecture

Built on Hono framework for Cloudflare Workers with:
- **KV Caching**: Results cached by OKLCH values for performance
- **AI Analysis**: Claude 3.5 Haiku for color intelligence generation
- **Mathematical Color Data**: Harmony generation and accessibility calculations
- **Rate Limiting**: 500-750ms delays for responsible API usage

## API Endpoints

### POST /color-intel
Analyze a color and get AI-powered design intelligence.

**Request:**
```json
{
  "oklch": { "l": 0.7, "c": 0.15, "h": 180 },
  "token": "primary",
  "name": "Ocean Blue"
}
```

**Response:**
```json
{
  "intelligence": {
    "reasoning": "This OKLCH combination creates a trustworthy, calming blue...",
    "emotionalImpact": "Users associate this color with reliability...",
    "culturalContext": "Universally positive, represents trust in Western cultures...",
    "accessibilityNotes": "Meets WCAG AAA on white backgrounds...",
    "usageGuidance": "Excellent for primary actions and trustworthy brands..."
  },
  "harmonies": {
    "complementary": { "l": 0.7, "c": 0.15, "h": 0 },
    "triadic": [...]
  },
  "accessibility": {
    "onWhite": { "wcagAA": true, "contrastRatio": 4.8 }
  },
  "analysis": {
    "temperature": "cool",
    "name": "Ocean Blue"
  }
}
```

## Development

### Setup
```bash
pnpm install
pnpm dev  # Start local development server
```

### Testing
```bash
pnpm test:preflight  # Run all tests including Workers runtime tests
```

### Deployment
```bash
pnpm deploy  # Deploy to Cloudflare Workers
```

### Type Generation
```bash
pnpm cf-typegen  # Generate types from Worker configuration
```

## Environment Variables

Required in `.dev.vars` (local) and Cloudflare Workers environment:
```
CLAUDE_API_KEY=your-anthropic-api-key
```

## KV Namespace

Requires `RAFTERS_INTEL` KV namespace bound in `wrangler.jsonc`:
```json
{
  "kv_namespaces": [
    {
      "binding": "RAFTERS_INTEL",
      "id": "your-kv-namespace-id"
    }
  ]
}
```

## Why Hono Instead of Next.js?

**KV Access Issue**: OpenNext (used for Next.js on Cloudflare) doesn't provide KV bindings via `process.env`. KV operations silently fail.

**Solution**: Hono provides proper access to Cloudflare bindings via `c.env.RAFTERS_INTEL`, enabling reliable KV caching.

## Testing Architecture

Uses `@cloudflare/vitest-pool-workers` for testing in actual Workers runtime:
- **Unit Tests**: Individual function testing
- **Integration Tests**: Full API endpoint testing with KV access
- **Runtime Tests**: Ensures compatibility with Workers environment

## Color Seeding

The API includes seeding scripts for pre-generating color intelligence:
- **Standard Colors**: 306 colors from Tailwind, Material Design, brands
- **Spectrum Matrix**: 540 strategic OKLCH points for full color space exploration
- **Cost Optimization**: Uses Claude 3.5 Haiku for cost-effective analysis

## Performance

- **KV Caching**: Results cached by OKLCH hash for instant retrieval
- **Edge Deployment**: Runs on Cloudflare's global network
- **Rate Limiting**: Built-in delays prevent API abuse
- **Efficient Prompting**: Optimized prompts for consistent, high-quality responses