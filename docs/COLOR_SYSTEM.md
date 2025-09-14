# Rafters Color System

**OKLCH-based color intelligence system with offline-first architecture and embedded accessibility intelligence.**

## Overview

The Rafters color system uses a three-layer CSS architecture with normalized data structures to prevent duplication and maintain a single source of truth. Built on OKLCH color space for perceptual uniformity and predictable design systems.

### Core Architecture

```
OKLCH Input → Pre-computed Cache → Complete ColorValue → Three-Layer CSS Export
```

## Data Structures

### ColorValue (Complete Color Intelligence)
Represents a complete color family with embedded design intelligence:

```typescript
interface ColorValue {
  name: string,                    // "ocean-blue" 
  scale: OKLCH[],                 // 11-step scale [50-950]
  token?: string,                 // "primary" 
  value?: string,                 // "500"
  use?: string,                   // "Main brand color"
  states?: {                      // State mappings (only for semantic tokens)
    hover: string,                // "600" or "amber-600" (cross-family allowed)
    focus: string,                // "700"  
    active: string,               // "800"
    disabled: string              // "400"
  },

  // Mathematical intelligence (from color-utils)
  harmonies: {
    complementary: OKLCH,
    triadic: OKLCH[],
    analogous: OKLCH[],
    tetradic: OKLCH[],
    monochromatic: OKLCH[]
  },
  
  accessibility: {
    // Pre-computed contrast matrices (indices into scale array) - YOUR BRILLIANT SYSTEM
    wcagAA: {
      normal: [[0, 5], [0, 6], [1, 7], ...], // Pairs that meet AA
      large: [[0, 4], [0, 5], [1, 5], ...]   // More pairs for large text
    },
    wcagAAA: {
      normal: [[0, 7], [0, 8], [0, 9], ...], // Fewer pairs meet AAA
      large: [[0, 6], [0, 7], [1, 7], ...]
    },
    
    // Pre-calculated for common backgrounds
    onWhite: {
      aa: [5, 6, 7, 8, 9],    // Shades that pass AA on white
      aaa: [7, 8, 9]          // Shades that pass AAA on white
    },
    onBlack: {
      aa: [0, 1, 2, 3, 4],    // Shades that pass AA on black
      aaa: [0, 1, 2]          // Shades that pass AAA on black
    }
  },

  analysis: {
    temperature: 'warm' | 'cool' | 'neutral',
    isLight: boolean,
    name: string             // Generated color identifier
  },

  // Leonardo-inspired intelligence (from generateSemanticColors)
  semanticIntelligence?: {
    atmosphericWeight: {
      distanceWeight: number,  // 0=background, 1=foreground
      temperature: 'warm' | 'neutral' | 'cool',
      atmosphericRole: 'background' | 'midground' | 'foreground'
    },
    perceptualWeight: {
      weight: number,          // 0-1 visual weight
      density: 'light' | 'medium' | 'heavy',
      balancingRecommendation: string
    },
    contextualRecommendations: string[], // Usage guidance
    harmonicTension?: number   // Aesthetic tension level
  },

  // AI Intelligence (optional enhancement from Claude)
  intelligence?: {
    reasoning: string,       // Color theory explanation
    emotionalImpact: string, // Psychological responses
    culturalContext: string, // Cross-cultural meanings  
    accessibilityNotes: string, // WCAG guidance
    usageGuidance: string    // When/how to use
  }
}
```

### Token (Flat CSS Export)
Simple key-value pairs for CSS generation:

```typescript
// Color family tokens
{ name: "ocean-blue-50", value: "oklch(0.95 0.02 240)" }
{ name: "ocean-blue-500", value: "oklch(0.60 0.12 240)" }

// Semantic tokens (reference color family tokens)
{ name: "primary", value: "var(--color-ocean-blue-500)" }
{ name: "primary-hover", value: "var(--color-ocean-blue-600)" }
```

## Three-Layer CSS Architecture

### Layer 1: Color Families (Source of Truth)
All color values defined as OKLCH:

```css
/* Generated from ColorValue.scale */
--color-ocean-blue-50: oklch(0.95 0.02 240);
--color-ocean-blue-100: oklch(0.90 0.04 240);
--color-ocean-blue-500: oklch(0.60 0.12 240);
--color-ocean-blue-600: oklch(0.50 0.14 240);
--color-ocean-blue-950: oklch(0.10 0.20 240);
```

### Layer 2: Rafters Semantic Tokens
References Layer 1 variables, never hardcoded values:

```css
/* Semantic assignments reference color families */
--rafters-color-primary: var(--color-ocean-blue-500);
--rafters-color-primary-hover: var(--color-ocean-blue-600);
--rafters-color-primary-focus: var(--color-ocean-blue-700);
--rafters-color-primary-active: var(--color-ocean-blue-800);
--rafters-color-primary-disabled: var(--color-ocean-blue-400);
```

### Layer 3: Theme Mapping
Final consumer-facing variables:

```css
/* Theme layer for Tailwind/components */
--color-primary: var(--rafters-color-primary);
--color-primary-hover: var(--rafters-color-primary-hover);
--color-secondary: var(--rafters-color-secondary);
```

## Two-Tier Architecture

### Bootstrap Process (Data Generation)
**Distributed KV color queue** generates the data used by the two-tier system:

- **846+ strategic colors** processing via distributed queue system
- **Strategic matrix**: 9L × 5C × 12H OKLCH grid (540 colors) + design system standards (306 colors)
- **14-hour bootstrap process** generating complete ColorValue objects with AI intelligence
- **Output**: Comprehensive color intelligence cache for the two-tier system

**Future Matrix Expansions** (potential monthly growth):
- **Higher chroma precision**: 5C → 8C for more saturated design systems
- **Finer lightness steps**: 9L → 15L for better tonal relationships
- **Extended hue coverage**: 12H → 24H for nuanced color harmony
- **Specialized matrices**: Dark mode optimized, accessibility-focused, brand-specific
- **Queue system enables** distributed processing of expanded matrices over time

### Tier 1: Static Color Cache (Comprehensive Intelligence)
**Pre-computed JSON file** shipped with Rafters for instant access:

**Location**: `packages/design-tokens/static-color-cache.json`

**Cache Structure**:
```json
{
  "oklch-60-12-240": {
    "name": "midnight-horizon",
    "scale": [...],
    "intelligence": {
      "suggestedName": "midnight-horizon",
      "reasoning": "Ocean blue at moderate lightness conveys professional trust...",
      "emotionalImpact": "Calming yet authoritative, builds user confidence...",
      "culturalContext": "Universally positive in business contexts...",
      "accessibilityNotes": "Achieves AAA contrast on white backgrounds...",
      "usageGuidance": "Ideal for primary CTAs, navigation elements..."
    },
    "accessibility": {
      "wcagAA": { "normal": [[0, 5], [0, 6], [1, 7]] },
      "onWhite": { "aa": [5, 6, 7, 8, 9] }
    },
    "harmonies": {...},
    "analysis": {...}
  }
}
```

### Tier 2: Project Token Files (User Customization)
**Version-controlled project settings** in `.rafters/tokens/`:

- **TokenRegistry manages** all read/write operations
- **Human-editable** through UI that saves to JSON files  
- **Dependency graph system** for semantic token relationships
- **No enrichment** - colors arrive fully-formed with intelligence from Tier 1 cache

### Performance Flow
```
Request → Static Cache Hit → Response (instant)
Request → Static Cache Miss → API Fallback → Generate & Cache → Response (~10s, one-time)
```

**Performance Targets**:
- **95%+ cache hit rate** for strategic color matrix  
- **Zero runtime costs** for cached colors
- **Instant offline access** to comprehensive color intelligence

## Color Intelligence System

### Mathematical Intelligence Generation (Primary)
**Powered by color-utils color theory functions**:

```typescript
// Step 1: Generate base ColorValue with mathematical intelligence
const colorValue = generateColorValue(baseColor, { 
  token: "primary", 
  generateStates: true 
});

// Step 2: Apply color theory semantic intelligence
const semanticSuggestions = generateSemanticColorSuggestions(baseColor);
const semanticIntelligence = generateSemanticColors(baseColor, semanticSuggestions);

// Result: Complete color intelligence without AI calls
const enhancedColorValue = {
  ...colorValue,
  semanticIntelligence: {
    atmosphericWeight: calculateAtmosphericWeight(baseColor),
    perceptualWeight: calculatePerceptualWeight(baseColor),
    contextualRecommendations: semanticIntelligence.contextualRecommendations
  }
};
```

**Core Mathematical Functions**:
- **`generateColorValue()`** - Single source of truth for complete ColorValue objects
- **`generateHarmony()`** - Traditional color theory relationships (complementary, triadic, etc.)
- **`generateOKLCHScale()`** - Perceptually uniform 50-950 scales with proper chroma adjustments
- **`calculateWCAGContrast()`** & **`calculateAPCAContrast()`** - Professional accessibility analysis
- **`getColorTemperature()`** & **`isLightColor()`** - Perceptual analysis with Helmholtz-Kohlrausch effect

**Advanced Leonardo-Inspired Intelligence** (Currently Underutilized):
- **`generateSemanticColors()`** - **THE BIG ONE** - Combines atmospheric perspective, simultaneous contrast, and perceptual weight
- **`calculateAtmosphericWeight()`** - Warm colors advance, cool colors recede (perfect for UI depth hierarchy)
- **`calculatePerceptualWeight()`** - Visual weight: Red > Orange > Yellow > Green > Blue > Purple
- **`calculateSimultaneousContrast()`** - Colors optimized for their visual context
- **`generateRaftersHarmony()`** - Maps traditional color theory to UI semantic roles using color theory
- **`generateOptimalGray()`** - Perceptually-weighted gray generation from palette colors

**Studio-Specific Functions**:
- **`generateColorCombinations()`** - Analyzes contrast ratios, suggests optimal background/foreground pairings
- **`generateSemanticColorSystem()`** - Complete semantic system with accessibility analysis
- **`validateSemanticMappings()`** - Mathematical validation of user assignments with auto-fix suggestions

### AI Enhancement Generation (Optional)
**Minimal AI for what math can't provide - emotional/cultural context only**:

```bash
# Generate AI enhancements for mathematical base intelligence
node scripts/enhance-with-ai.js
```

**Ultra-Compact Claude Prompt (200 tokens max)**:
```
OKLCH(${l}, ${c}, ${h}) = ${colorName}
Return JSON only:
{
  "emotional": "2-3 words user feeling",
  "cultural": "universal meaning or concern",
  "warning": "any critical usage warning or null"
}
```

**Example Response**:
```json
{
  "emotional": "calm, trustworthy, professional",
  "cultural": "globally positive for business",
  "warning": null
}
```

**What We DON'T Need from AI**:
- ❌ Color theory (we have Color Theroymath)
- ❌ Harmonies (we have `generateHarmony()`)
- ❌ Accessibility (we have WCAG/APCA functions)
- ❌ Perceptual analysis (we have atmospheric/perceptual weight)
- ❌ Semantic suggestions (we have `generateSemanticColors()`)
- ❌ Contrast recommendations (we have `validateSemanticMappings()`)

**What AI Uniquely Provides**:
- ✅ Emotional associations humans feel
- ✅ Cultural meanings across societies
- ✅ Critical warnings (e.g., "death in Eastern cultures")

**Economics**:
- **Mathematical base**: $0 runtime cost (instant generation)
- **AI enhancement**: ~$0.01 per 100 colors (200 tokens vs 20K)
- **Cost reduction**: 99% cheaper with focused prompts
- **Performance**: Instant mathematical intelligence + minimal AI enhancement

### Studio Workflow (User-Driven Color Creation)
**Studio generates comprehensive intelligence instantly using mathematical functions**:

**When User Picks Color in Studio**:
```typescript
// User clicks on any color
const userColor = { l: 0.6, c: 0.12, h: 240 };

// Instant mathematical intelligence generation
const colorValue = generateColorValue(userColor, { 
  name: "ocean-depth",
  token: "primary", 
  generateStates: true 
});

// Apply Leonardo-inspired intelligence
const raftersHarmony = generateRaftersHarmony(userColor);
const semanticColors = generateSemanticColors(userColor, generateSemanticColorSuggestions(userColor));

// Studio shows complete intelligence immediately
```

**Rafters Harmony for UI Roles** (from `generateRaftersHarmony()`):
- **Primary**: Base color (user's choice)  
- **Secondary**: Split-complementary (sophisticated contrast without clash)
- **Tertiary**: Triadic (visual interest while maintaining harmony)
- **Accent**: Complementary (maximum contrast and attention)  
- **Highlight**: Analogous (subtle emphasis and cohesion)
- **Surface**: Desaturated base (backgrounds)
- **Neutral**: Optimal gray calculated from all harmonies
- **Success**: semantic suggestion 1, success
- **Info**: semantic suggestion 2, info
- **Alert**: semantic suggestion 3, alert
- **destructive**: semantic suggestion 1, destructive

each family shall also have as noted above, complete tier 2 sematic state tokens based on the wcag contrast pairs. 

### Bootstrap Process (Populate Cache & Vector)
**One-time generation of strategic color matrix**:

**Step 1: Mathematical Bootstrap (Instant & Free)**:
```typescript
// scripts/generate-mathematical-cache.ts
const strategicColors = generateOKLCHGrid(9, 5, 12); // 540 colors

for (const color of strategicColors) {
  // Instant mathematical generation
  const colorValue = generateColorValue(color, { generateStates: true });
  const raftersHarmony = generateRaftersHarmony(color);
  const semanticIntel = generateSemanticColors(color, suggestions);
  
  // Complete intelligence without AI
  const fullIntelligence = {
    ...colorValue,
    harmonies: raftersHarmony,
    semanticIntelligence: {
      atmosphericWeight: calculateAtmosphericWeight(color),
      perceptualWeight: calculatePerceptualWeight(color),
      contextualRecommendations: semanticIntel.contextualRecommendations
    }
  };
  
  cache.set(generateColorCacheKey(color), fullIntelligence);
}
```

**Step 2: Minimal AI Enhancement (Optional, Ultra-Cheap)**:
```typescript
// scripts/enhance-with-minimal-ai.ts
for (const [key, colorValue] of cache.entries()) {
  // 200-token prompt for emotional/cultural only
  const prompt = `OKLCH(${colorValue.scale[5]}) = ${colorValue.name}
Return JSON only: emotional/cultural/warning`;
  
  const aiEnhancement = await claude.complete(prompt); // ~200 tokens total
  colorValue.intelligence = {
    ...colorValue.semanticIntelligence, // Keep all math intelligence
    ...aiEnhancement // Just add emotional/cultural
  };
}

// Total cost for 540 colors:
// 540 × 200 tokens = 108,000 tokens
// Cost: ~$0.027 with Haiku (vs $270 with 20K token prompts!)
```

### Intelligence API (Fallback Only)
**Endpoint**: `POST /api/color-intel`

**Usage**: Only for truly unique colors not in cache/vector

**Response Generation**:
```typescript
// API generates mathematical intelligence first (instant)
const colorValue = generateColorValue(oklch, { token, name });
const semanticIntel = generateSemanticColors(oklch, suggestions);
const raftersHarmony = generateRaftersHarmony(oklch);

// Only if needed, add minimal AI enhancement (200 tokens)
if (requiresCulturalContext) {
  const aiPrompt = `OKLCH(${l}, ${c}, ${h})
Return JSON: emotional/cultural/warning`;
  
  const minimal = await claude.complete(aiPrompt);
  colorValue.intelligence = {
    emotional: minimal.emotional,
    cultural: minimal.cultural,
    warning: minimal.warning
  };
}

// Return complete intelligence
return {
  ...colorValue,
  harmonies: raftersHarmony,
  semanticIntelligence,
  // Mathematical intelligence handles 95% of needs
  // AI only adds 3 fields when absolutely necessary
};
```
## MCP Integration (AI Agent Access)

### Current MCP Status
- **7 token intelligence tools** already implemented
- **Complete color reasoning** functionality exists
- **TokenRegistry integration** already working
- **Component intelligence** already integrated

### MCP Data Flow
```
AI Agent Query → MCP Tool → TokenRegistry → Rich ColorValue Response
```

**Example MCP Usage**:
```typescript
// AI agent queries semantic color intelligence
const trustworthyBlues = await mcp.searchColors({
  mood: "trustworthy",
  temperature: "cool",
  accessibility: "wcagAAA"
});

// Returns complete ColorValue objects with full intelligence
```

### Semantic Search Capabilities
- **"trustworthy blues"** - finds colors with trust-building psychological properties
- **"warm accent colors"** - discovers colors suitable for accent usage with warm temperature
- **"accessible primaries"** - locates primary colors meeting WCAG AAA standards
- **Contextual queries** - AI agents can search by intended usage, not just color properties

## Human Override Patterns

### Creative Freedom with State Overrides
Users can assign ANY color to ANY state, even across color families:

```typescript
{
  name: "ocean-blue",
  scale: [...], // ocean-blue-50 through ocean-blue-950
  token: "primary",
  value: "500", // primary = ocean-blue-500
  states: {
    hover: "amber-600",      // Different color family!
    focus: "purple-700",     // Another different family!
    active: "ocean-blue-800", // Same family, different shade
    disabled: "gray-400"     // Neutral color for disabled
  }
}
```

### CSS Output with Overrides
```css
/* Layer 1: ALL referenced color families must exist */
--color-ocean-blue-500: oklch(0.60 0.12 240);
--color-ocean-blue-800: oklch(0.30 0.18 240);
--color-amber-600: oklch(0.65 0.15 85);
--color-purple-700: oklch(0.45 0.18 300);
--color-gray-400: oklch(0.70 0.02 0);

/* Layer 2: Semantic tokens reference various families */
--rafters-color-primary: var(--color-ocean-blue-500);
--rafters-color-primary-hover: var(--color-amber-600);
--rafters-color-primary-focus: var(--color-purple-700);
--rafters-color-primary-active: var(--color-ocean-blue-800);
--rafters-color-primary-disabled: var(--color-gray-400);
```

## Accessibility Intelligence System

### Pre-computed Contrast Matrices
**Instead of calculating on-demand**, pre-compute all valid color pair combinations:

```typescript
// Helper function for building accessibility metadata
function generateAccessibilityMetadata(scale: OKLCH[]): AccessibilityMetadata {
  const wcagAA = { normal: [], large: [] };
  const wcagAAA = { normal: [], large: [] };
  
  // Check all pairs within the scale
  for (let i = 0; i < scale.length; i++) {
    for (let j = i + 1; j < scale.length; j++) {
      if (meetsWCAGStandard(scale[i], scale[j], 'AA', 'normal')) {
        wcagAA.normal.push([i, j]);
      }
      if (meetsWCAGStandard(scale[i], scale[j], 'AAA', 'normal')) {
        wcagAAA.normal.push([i, j]);
      }
    }
  }
  
  // Check against white/black backgrounds
  const white = { l: 1, c: 0, h: 0 };
  const black = { l: 0, c: 0, h: 0 };
  
  const onWhite = {
    aa: scale.map((c, i) => meetsWCAGStandard(c, white, 'AA', 'normal') ? i : null).filter(i => i !== null),
    aaa: scale.map((c, i) => meetsWCAGStandard(c, white, 'AAA', 'normal') ? i : null).filter(i => i !== null)
  };
  
  return { wcagAA, wcagAAA, onWhite, onBlack };
}
```

### Real-time Accessibility Validation
When humans override states, validate accessibility:

```typescript
// Validate state overrides for accessibility
const validation = await validateStateOverride({
  semantic: "primary",
  baseValue: "ocean-blue-500",
  stateValue: "amber-600",
  stateType: "hover"
});

// Returns:
{
  valid: true,
  warnings: [{
    type: "contrast",
    message: "amber-600 and ocean-blue-500 have low contrast (1.2:1)",
    severity: "warning",
    suggestion: "Consider amber-700 for better distinction"
  }],
  accessibility: {
    wcagAA: { text: true, largeText: true, adjacent: false },
    wcagAAA: { text: false, largeText: true, adjacent: false }
  }
}
```

## Implementation Phases

### Phase 1: Bootstrap Script (One-time)
- [ ] Create `scripts/bootstrap-colors.ts` 
- [ ] Run expensive AI generation for ~20 default colors
- [ ] Hardcode results into color.ts generator
- [ ] Create local JSON cache file
- [ ] Populate Vectorize with initial color intelligence

### Phase 2: Generator Update
- [ ] Replace current color generator with pre-computed data
- [ ] Remove enrichment logic from TokenRegistry
- [ ] Ensure dependency graph works with full ColorValue objects
- [ ] Test complete token generation flow

### Phase 3: Vector Integration (Future)
- [ ] Implement Vectorize semantic search for AI agents
- [ ] Add fallback chain: local cache → vector → API
- [ ] Semantic search capabilities for MCP tools
- [ ] Vector storage for custom colors

## Implementation Files

### Current System
- `packages/shared/src/types/color.ts` - Core OKLCH and ColorValue types
- `packages/color-utils/src/generator.ts` - ColorValue generation with harmonies
- `packages/design-tokens/src/generators/color.ts` - CSS token export
- `packages/design-tokens/src/TokenRegistry.ts` - Token management and persistence

### Three-Tier Storage
- **Tier 1**: Cloudflare Vectorize index for semantic search
- **Tier 2**: `packages/design-tokens/static-color-cache.json` - Local cache
- **Tier 3**: `.rafters/tokens/*.json` - Project token files

### Bootstrap & API
- `scripts/bootstrap-colors.ts` - One-time intelligence generation
- `apps/api/src/routes/color-intel.ts` - Fallback API for unique colors
- `packages/color-utils/src/cache.ts` - Cache lookup and fallback system

### MCP Integration
- `apps/cli/src/mcp/` - 7 token intelligence tools already implemented
- AI agent access via TokenRegistry → Rich ColorValue objects

## Key Principles

### Single Source of Truth
Each color value is defined exactly once in Layer 1, referenced everywhere else.

### No Duplication
Color families are unique, semantic tokens reference them via CSS variables.

### States for Semantics Only
Raw color families don't have states, only semantic tokens do.

### Variable References
Layer 2 references Layer 1, Layer 3 references Layer 2 - never hardcoded values.

### Human Override Freedom
Users can reassign any color/shade to any semantic token, even across families.

### Offline-First Performance
95%+ of color intelligence served from static cache, zero runtime costs.

### Accessibility by Design
Pre-computed contrast matrices ensure WCAG compliance guidance is always available.

## Success Metrics

### Performance
- Sub-100ms color intelligence lookup
- Zero API calls for 95% of design system colors
- Instant accessibility validation

### Capability  
- Complete offline functionality
- Rich AI-powered color intelligence
- Sophisticated design system generation
- Professional-grade accessibility analysis

### Economics
- Zero runtime costs for cached colors
- One-time development investment (~$500)
- Unlimited scaling with no API dependencies