# Color Intelligence API

## Endpoint: `/api/color-intel`

Generates AI-powered color intelligence for design systems using Claude 3.5 Haiku, with permanent Cloudflare KV caching.

## Purpose

Provides rich color reasoning and context that AI agents can understand and apply, making Rafters more than just a color picker - it's a design intelligence system.

## Implementation Path

```
apps/website/src/app/api/color-intel/route.ts
```

## Request

**Method**: `POST`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**:
```typescript
{
  oklch: {
    l: number,      // Lightness (0-1)
    c: number,      // Chroma (0+)
    h: number       // Hue (0-360)
  },
  token?: string,   // Optional semantic context ("primary", "danger", etc.)
  name?: string     // Optional color name ("ocean-blue", etc.)
}
```

**Example Request**:
```json
{
  "oklch": {
    "l": 0.6,
    "c": 0.12,
    "h": 240
  },
  "token": "primary",
  "name": "ocean-blue"
}
```

## Response

**Success (200)**:
```typescript
{
  intelligence: {
    reasoning: string,           // Why this color works for its purpose
    emotionalImpact: string,     // Psychological effects and user perception
    culturalContext: string,     // Cultural associations and considerations
    accessibilityNotes: string, // WCAG guidance and contrast recommendations
    usageGuidance: string        // When and how to use this color
  },
  harmonies: {
    complementary: OKLCH,        // Calculated complementary color
    triadic: OKLCH[],           // Array of triadic colors
    analogous: OKLCH[],         // Array of analogous colors
    tetradic: OKLCH[],          // Array of tetradic colors
    monochromatic: OKLCH[]      // Array of monochromatic variations
  },
  accessibility: {
    onWhite: {
      wcagAA: boolean,          // Meets AA standard on white
      wcagAAA: boolean,         // Meets AAA standard on white
      contrastRatio: number     // Exact contrast ratio
    },
    onBlack: {
      wcagAA: boolean,          // Meets AA standard on black
      wcagAAA: boolean,         // Meets AAA standard on black
      contrastRatio: number     // Exact contrast ratio
    }
  },
  analysis: {
    temperature: 'warm' | 'cool' | 'neutral',
    isLight: boolean,
    name: string                // Generated semantic name
  }
}
```

**Example Response**:
```json
{
  "intelligence": {
    "reasoning": "Ocean blue at moderate lightness conveys professional trust without appearing cold or distant",
    "emotionalImpact": "Calming yet authoritative, builds user confidence in interactions",
    "culturalContext": "Universally positive in business contexts, associated with stability and reliability",
    "accessibilityNotes": "Achieves AAA contrast on white backgrounds, use 600+ shades for dark mode compatibility",
    "usageGuidance": "Ideal for primary CTAs, navigation elements, and trust-building components. Avoid for warnings or errors."
  },
  "harmonies": {
    "complementary": { "l": 0.65, "c": 0.15, "h": 60 },
    "triadic": [
      { "l": 0.55, "c": 0.14, "h": 0 },
      { "l": 0.55, "c": 0.14, "h": 120 }
    ],
    "analogous": [
      { "l": 0.58, "c": 0.13, "h": 210 },
      { "l": 0.58, "c": 0.13, "h": 270 }
    ],
    "tetradic": [
      { "l": 0.6, "c": 0.12, "h": 150 },
      { "l": 0.6, "c": 0.12, "h": 60 },
      { "l": 0.6, "c": 0.12, "h": 330 }
    ],
    "monochromatic": [
      { "l": 0.8, "c": 0.08, "h": 240 },
      { "l": 0.7, "c": 0.10, "h": 240 },
      { "l": 0.5, "c": 0.14, "h": 240 },
      { "l": 0.4, "c": 0.16, "h": 240 }
    ]
  },
  "accessibility": {
    "onWhite": {
      "wcagAA": true,
      "wcagAAA": true,
      "contrastRatio": 8.59
    },
    "onBlack": {
      "wcagAA": false,
      "wcagAAA": false,
      "contrastRatio": 2.45
    }
  },
  "analysis": {
    "temperature": "cool",
    "isLight": true,
    "name": "ocean-blue"
  }
}
```

**Error (400)**:
```json
{
  "error": "Invalid OKLCH values",
  "message": "Lightness must be between 0 and 1"
}
```

**Error (500)**:
```json
{
  "error": "Intelligence generation failed",
  "message": "Unable to generate color intelligence at this time"
}
```

## Caching Strategy

### Cloudflare KV Cache
- **Key Format**: `color-intel:${l}-${c}-${h}` (rounded to 3 decimal places for consistency)
- **TTL**: Permanent (color properties are immutable)
- **Cache Hit Rate**: Expected 95%+ after initial usage period

### Cache Behavior
1. **Cache Check**: Always check KV first for existing intelligence
2. **Cache Miss**: Generate via Claude 3.5 Haiku + store in KV
3. **Cache Hit**: Return cached response (no AI cost)
4. **Shared Cache**: All users benefit from previously generated intelligence

### Example Implementation
```typescript
// apps/website/src/app/api/color-intel/route.ts
export async function POST(request: Request) {
  const { oklch, token, name } = await request.json();
  
  // Validate OKLCH values
  if (!isValidOKLCH(oklch)) {
    return NextResponse.json(
      { error: "Invalid OKLCH values" },
      { status: 400 }
    );
  }
  
  // Generate consistent cache key
  const cacheKey = `color-intel:${oklch.l.toFixed(3)}-${oklch.c.toFixed(3)}-${oklch.h.toFixed(1)}`;
  
  // Check Cloudflare KV cache
  const cached = await env.COLOR_INTEL_KV.get(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return NextResponse.json(JSON.parse(cached));
  }
  
  // Generate intelligence via Claude 3.5 Haiku
  console.log(`Generating intelligence: ${cacheKey}`);
  try {
    const intelligence = await generateColorIntelligence(oklch, { token, name });
    
    // Cache permanently in KV
    await env.COLOR_INTEL_KV.put(cacheKey, JSON.stringify(intelligence));
    
    return NextResponse.json(intelligence);
  } catch (error) {
    return NextResponse.json(
      { error: "Intelligence generation failed", message: error.message },
      { status: 500 }
    );
  }
}
```

## Claude Prompt Strategy

### Optimized for Haiku
- **Concise prompts**: Minimize token usage
- **Structured output**: Consistent JSON format
- **Context-aware**: Use token/name for better responses
- **Deterministic**: Same OKLCH should produce similar intelligence

### Complete Color Intelligence Architecture

The API generates comprehensive color data in a single call combining:
1. **AI Intelligence** (Claude 3.5) - Contextual reasoning and guidance
2. **Mathematical Harmonies** (color-utils) - Proven color theory calculations
3. **Accessibility Analysis** (color-utils) - WCAG compliance validation
4. **Color Analysis** (color-utils) - Temperature, naming, properties

### Claude 3.5 Production Prompt (Intelligence Only)
```
You are a color theory expert and design system consultant. Analyze the provided OKLCH color and generate comprehensive design intelligence for AI agents and human designers.

Color: OKLCH(${oklch.l}, ${oklch.c}, ${oklch.h})${token ? `\nSemantic Role: ${token}` : ''}${name ? `\nColor Name: ${name}` : ''}

Provide exhaustive analysis in this exact JSON structure:

{
  "reasoning": "Detailed explanation of why this specific OKLCH combination works psychologically and visually. Include lightness perception, chroma intensity effects, and hue associations. 2-3 sentences.",
  "emotionalImpact": "Complete psychological response this color evokes in users. Cover emotional associations, cognitive effects, and behavioral influences. Include cultural universals and variations. 2-3 sentences.", 
  "culturalContext": "Cross-cultural color associations and meanings. Address Western, Eastern, and global contexts. Mention any cultural sensitivities or positive associations. 2-3 sentences.",
  "accessibilityNotes": "Comprehensive WCAG guidance including specific contrast ratios, recommended text colors, dark mode considerations, and color vision deficiency compatibility. Include specific shade recommendations. 2-3 sentences.",
  "usageGuidance": "Detailed use cases where this color excels, contexts to avoid, and interaction patterns. Cover UI components, brand applications, and design system roles. Include anti-patterns and warnings. 3-4 sentences."
}

Important guidelines:
- Be specific about OKLCH values and their perceptual effects
- Reference actual contrast ratios when possible
- Provide actionable recommendations, not generic advice
- Consider the semantic role context if provided
- Focus on design system and digital interface applications
- Do NOT generate harmonies - these are calculated mathematically

Return only valid JSON, no additional text.
```

### Mathematical Calculations (color-utils)
```typescript
// Harmonies calculated with proven algorithms
const harmonies = {
  complementary: generateHarmoniousPalette(oklch, 'complementary', 1)[0],
  triadic: generateHarmoniousPalette(oklch, 'triadic', 3),
  analogous: generateHarmoniousPalette(oklch, 'analogous', 3),
  tetradic: generateHarmoniousPalette(oklch, 'tetradic', 4),
  monochromatic: generateHarmoniousPalette(oklch, 'monochromatic', 5)
};

// Accessibility analysis
const accessibility = {
  onWhite: {
    wcagAA: meetsWCAGStandard(oklch, {l:1, c:0, h:0}, 'AA', 'normal'),
    wcagAAA: meetsWCAGStandard(oklch, {l:1, c:0, h:0}, 'AAA', 'normal'),
    contrastRatio: calculateWCAGContrast(oklch, {l:1, c:0, h:0})
  },
  onBlack: {
    wcagAA: meetsWCAGStandard(oklch, {l:0, c:0, h:0}, 'AA', 'normal'),
    wcagAAA: meetsWCAGStandard(oklch, {l:0, c:0, h:0}, 'AAA', 'normal'),
    contrastRatio: calculateWCAGContrast(oklch, {l:0, c:0, h:0})
  }
};

// Color properties analysis
const analysis = {
  temperature: getColorTemperature(oklch),
  isLight: isLightColor(oklch),
  name: generateColorName(oklch)
};
```

## Integration with Studio

### Studio Workflow
1. User picks color in Studio UI
2. Studio generates scale + accessibility data locally
3. Studio calls `/api/color-intel` for intelligence
4. Response populates ColorValue.intelligence field
5. User can edit intelligence if needed

### Error Handling
- **Network failures**: Return "Service temporarily unavailable" 
- **Rate limiting**: Return "Rate limit exceeded - try again later"
- **Invalid responses**: Studio logs errors but doesn't block workflow

## Cost Optimization

### Token Economics
- **Claude 3.5 Haiku**: ~$0.25 per 1M input tokens
- **Average prompt**: ~50 tokens input, ~200 tokens output
- **Cost per call**: ~$0.000625 (under 1¢)
- **Cache benefits**: 95% cache hit rate = 95% cost reduction

### Monitoring
- Track cache hit rates via Cloudflare Analytics
- Monitor Claude API costs via Anthropic usage dashboard  
- Alert if costs exceed $10/month budget
- **Color Popularity Analytics**: Track request counts per OKLCH to rank most popular colors

## Color Cache Preload Strategy

### 1024 Most Common Design Colors
Pre-populate the cache with essential design system colors to achieve 95%+ cache hit rate immediately:

**Preload Categories:**
- **Tailwind CSS defaults** (~200 colors) - All standard Tailwind palette colors
- **Material Design palette** (~100 colors) - Google's Material Design colors
- **Popular brand colors** (~50 colors) - Facebook blue, Google blue, GitHub black, etc.
- **Semantic standards** (~100 colors) - Success greens, danger reds, warning oranges, info blues
- **Accessibility-optimized** (~200 colors) - Guaranteed WCAG AA/AAA compliant pairs
- **Grayscale spectrum** (~50 colors) - Every 10% lightness step with various chromas
- **Common harmonies** (~324 colors) - Popular base colors with their calculated harmonies

### Preload Economics
- **Total colors**: 1024 unique OKLCH values
- **Cost per color**: ~$0.0007 (800 tokens @ Claude 3.5 Haiku rates)
- **Total preload cost**: ~$0.72
- **ROI**: 95% cache hit rate means 95% cost reduction for users
- **Budget impact**: $0.72 of $10 budget = 92% remaining for edge cases

### Preload Script
```bash
# Run during deployment
pnpm preload:colors

# Output:
# ✓ Cached 200 Tailwind colors
# ✓ Cached 100 Material colors  
# ✓ Cached 50 brand colors
# ✓ Cached 100 semantic colors
# ✓ Cached 200 accessible colors
# ✓ Cached 50 grayscale colors
# ✓ Cached 324 harmony colors
# 
# Preload complete! 1024/1024 colors cached.
# Total cost: $0.72
# Expected cache hit rate: 95%+
```

### Cache Key Strategy
```typescript
// Consistent cache keys for preload and runtime
const cacheKey = `color-complete:${oklch.l.toFixed(3)}-${oklch.c.toFixed(3)}-${oklch.h.toFixed(1)}`;

// Examples:
// color-complete:0.600-0.120-240  (ocean blue)
// color-complete:0.500-0.000-0    (neutral gray)
// color-complete:0.550-0.140-140  (success green)
```

## Security

### Rate Limiting
- **Per IP**: 60 requests per minute
- **Global**: 10,000 requests per minute
- **Cloudflare**: Built-in DDoS protection

### Input Validation
- Validate OKLCH ranges before processing
- Sanitize optional string inputs (token, name)
- Reject malformed JSON requests

### API Key Management
- Store Claude API key in Cloudflare environment variables
- Rotate keys regularly
- Monitor for unauthorized usage

## Future Enhancements

### Batch Processing
```typescript
POST /api/color-intel/batch
{
  colors: [
    { oklch: {...}, token: "primary" },
    { oklch: {...}, token: "secondary" }
  ]
}
```

### Custom Intelligence
- Allow users to override generated intelligence
- Store custom overrides separately from cache
- Merge custom + generated intelligence

### Analytics
- Track most requested colors
- Identify intelligence quality issues
- Optimize prompts based on usage patterns