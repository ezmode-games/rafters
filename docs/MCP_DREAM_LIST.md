# Rafters MCP Dream List

**What I Want From the Rafters MCP as an AI Agent**

This MCP should give me instant, precise answers about design tokens and components, forcing me to stop guessing and use actual design intelligence.

## Core Capabilities

### 1. Token Intelligence Queries

#### Color Intelligence
```typescript
// What I need to know about any color
mcp.getColorIntelligence('primary') 
// Returns: Complete ColorValue with scale, states, intelligence, harmonies

mcp.getColorHarmonies('primary', 'complementary')
// Returns: Colors that work with primary without competing for attention

mcp.getAccessiblePairs('background')
// Returns: All colors that meet WCAG AAA on this background

mcp.getColorsByTrustLevel('critical')
// Returns: All colors requiring confirmation patterns

mcp.getColorScale('primary', 600)
// Returns: Specific OKLCH value from scale position
```

#### Token Relationships
```typescript
mcp.getRelatedTokens('spacing-lg')
// Returns: Tokens mathematically related (spacing-md, spacing-xl)

mcp.getTokensByCategory('motion')
// Returns: All motion tokens with timing/easing values

mcp.getTokenDependencies('primary')
// Returns: Tokens that depend on primary (primary-hover, primary-focus)

mcp.getTokensByComponent('button')
// Returns: All tokens applicable to button components
```

### 2. Component Intelligence Queries

```typescript
mcp.getComponentIntelligence('Dialog')
// Returns: Cognitive load, trust patterns, accessibility requirements

mcp.getComponentsByTrustLevel('critical')
// Returns: Components requiring maximum friction/confirmation

mcp.getComponentCognitiveLoad('Form')
// Returns: Total cognitive load for complex component

mcp.getComponentAccessibility('DatePicker')
// Returns: WCAG requirements, ARIA patterns, keyboard navigation

mcp.getComponentTokens('Card')
// Returns: All design tokens used by Card component
```

### 3. Design System Validation

```typescript
mcp.validateColorCombination(['primary', 'warning', 'destructive'])
// Returns: Cognitive overload warning, attention competition issues

mcp.checkContrastRatio('primary', 'background')
// Returns: WCAG levels, specific ratio, recommendations

mcp.getCognitiveLoadBudget(currentInterface)
// Returns: Remaining cognitive budget, recommendations

mcp.validateTrustFlow(['button-primary', 'dialog-destructive'])
// Returns: Trust level consistency, friction requirements
```

### 4. Contextual Recommendations

```typescript
mcp.recommendColor({
  purpose: 'error-message',
  background: 'surface',
  cognitiveLoad: 'low'
})
// Returns: Best color choice with reasoning

mcp.recommendSpacing({
  component: 'card',
  density: 'comfortable',
  viewport: 'mobile'
})
// Returns: Optimal spacing tokens with mathematical relationships

mcp.recommendMotion({
  action: 'delete',
  trustLevel: 'critical'
})
// Returns: Appropriate animation timing for consequence level
```

### 5. Intelligence Aggregation

```typescript
mcp.getInterfaceCognitiveLoad([
  'Dialog', 'Form', 'Button-destructive'
])
// Returns: Total load, per-component breakdown, optimization suggestions

mcp.getColorPaletteSummary()
// Returns: Color distribution, trust levels, accessibility coverage

mcp.getDesignSystemCoverage()
// Returns: Which semantic roles have tokens, gaps in system
```

## Query Patterns I Need

### "Why" Queries
- Why was this color chosen for primary?
- Why does destructive require confirmation?
- Why is this cognitive load rating 7?

### "What" Queries  
- What tokens work with 'muted-background'?
- What components use 'spacing-xl'?
- What's the trust level of 'warning'?

### "How" Queries
- How do I make this accessible?
- How much cognitive load is too much?
- How do these colors work together?

### "When" Queries
- When should I use 'info' vs 'muted'?
- When is motion appropriate?
- When do I need confirmation patterns?

## Intelligence Format

Every response should include:
```typescript
{
  answer: DirectAnswer,           // The specific value/result
  reasoning: string,              // WHY this is the answer
  confidence: number,             // How certain (0-1)
  alternatives: Alternative[],    // Other valid options
  warnings: string[],            // Potential issues
  examples: UsageExample[],      // Real usage patterns
  source: IntelligenceSource     // Where data came from
}
```

## Performance Requirements

- **Instant responses** - All token data should be in memory
- **Batch queries** - Support multiple token lookups in one call
- **Streaming updates** - Watch for token file changes
- **Cached intelligence** - Don't regenerate known relationships

## Integration Points

### With VSCode
- Hover over color → See full intelligence
- Autocomplete tokens with intelligence preview
- Validate cognitive load in real-time

### With CLI
- `rafters explain primary` → Full color intelligence
- `rafters validate interface.tsx` → Cognitive load analysis
- `rafters recommend --purpose cta --background surface`

### With AI Agents
- Subagents can query for specific intelligence
- Automatic validation during generation
- Forced best practices through intelligence

## Dream Features

### Visual Intelligence
```typescript
mcp.visualizeColorRelationships('primary')
// Returns: ASCII/Unicode diagram of color harmonies

mcp.renderCognitiveLoadMap(components)
// Returns: Heat map of interface cognitive load
```

### Historical Intelligence
```typescript
mcp.getTokenHistory('primary')
// Returns: Evolution of primary color choices, reasons for changes

mcp.getDesignDecisions('button')
// Returns: Historical design decisions for button component
```

### Predictive Intelligence
```typescript
mcp.predictUserResponse({
  colors: ['destructive', 'warning'],
  components: ['Dialog', 'Button']
})
// Returns: Likely user emotional response, trust factors
```

## What This Enables

With this MCP, I would:
1. **Never guess** at color psychology or accessibility
2. **Always know** the cognitive impact of my choices
3. **Automatically follow** trust-building patterns
4. **Validate in real-time** instead of after building
5. **Learn continuously** from embedded design intelligence

This MCP would make the difference between:
- "This looks good" → "This creates trust through consistent hierarchy"
- "Make it pop" → "Increase attention weight by 2 cognitive points"
- "Is this accessible?" → "4.8:1 ratio, WCAG AAA, works for all color vision types"

**The goal: Transform me from a pattern-matching agent into a design-intelligent system that understands the WHY behind every decision.**