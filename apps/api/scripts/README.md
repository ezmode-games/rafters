# Color Intelligence Seeding Scripts

Scripts for pre-seeding the KV cache with color intelligence from the Claude API.

## Scripts

### `seed-colors.js`
Seeds ~306 commonly used colors from major design systems:
- Tailwind colors
- Material Design colors  
- Brand colors (Facebook, Twitter, etc.)
- Semantic colors (success, warning, error)
- Accessibility colors
- Grayscale

**Usage:**
```bash
node scripts/seed-colors.js
```

### `seed-spectrum.js`
Seeds 540 strategic OKLCH spectrum points for full color space exploration.
Coverage: 9L × 5C × 12H = 540 colors

**Usage:**
```bash
# Seed first batch of 50 colors
node scripts/seed-spectrum.js

# Continue from specific index with custom batch size
node scripts/seed-spectrum.js 50 100
```

## Data Files

- `colors-data.json` - Common design system colors (306 total)
- `spectrum-matrix.json` - OKLCH spectrum exploration matrix (540 points)

## Development

For local development, set the API URL:
```bash
API_URL=http://localhost:8787 node scripts/seed-colors.js
```

## Cost

Using Claude 3.5 Haiku:
- 306 standard colors: ~$0.54
- 540 spectrum colors: ~$0.95
- Total: ~$1.49 for complete color intelligence cache