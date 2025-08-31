# Rafters MCP (Model Context Protocol)

MCP server embedded in the Rafters CLI for AI agent integration.

## Usage

Start the MCP server:
```bash
rafters mcp
```

Or for development:
```bash
npx rafters mcp
```

## Available Tools

### Token Intelligence

#### `get_color_intelligence`
Get complete intelligence for a color token including scale, states, harmonies, and psychological impact.

```typescript
{
  tokenName: string // e.g., "primary", "destructive"
}
```

#### `get_token_by_category`
Get all tokens in a specific category.

```typescript
{
  category: string // e.g., "color", "spacing", "motion"
}
```

#### `get_tokens_by_trust_level`
Get all tokens with a specific trust level.

```typescript
{
  trustLevel: "low" | "medium" | "high" | "critical"
}
```

### Component Intelligence

#### `get_component_intelligence`
Get design intelligence for a component including cognitive load, trust patterns, and accessibility.

```typescript
{
  componentName: string // e.g., "Button", "Dialog"
}
```

#### `calculate_cognitive_load`
Calculate total cognitive load for a set of components.

```typescript
{
  components: string[] // Array of component names
}
```

### Validation

#### `validate_color_combination`
Validate if colors work together considering cognitive load and accessibility.

```typescript
{
  colors: string[] // Array of color token names
}
```

#### `get_accessible_colors`
Find colors that meet WCAG standards on a given background.

```typescript
{
  background: string // Background color token name
  level?: "AA" | "AAA" // WCAG compliance level
}
```

## Integration with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "rafters": {
      "command": "npx",
      "args": ["rafters", "mcp"]
    }
  }
}
```

## How It Works

1. **Token Registry** - Loads from `.rafters/tokens/` JSON files
2. **Component Registry** - Fetches from Rafters registry API
3. **Intelligence Queries** - Provides structured responses with reasoning
4. **Validation** - Checks cognitive load, trust levels, accessibility

## Response Format

All responses include:
- Direct answer
- Reasoning/explanation
- Warnings if applicable
- Recommendations

Example response:
```json
{
  "token": {
    "name": "primary",
    "value": { /* ColorValue object */ },
    "cognitiveLoad": 3,
    "trustLevel": "high"
  },
  "intelligence": {
    "reasoning": "Creates trust through blue hue...",
    "emotionalImpact": "Calming, reliable...",
    "culturalContext": "Universally positive...",
    "accessibilityNotes": "WCAG AAA on white...",
    "usageGuidance": "Use for primary actions..."
  },
  "harmonies": { /* complementary, triadic, etc. */ },
  "accessibility": { /* contrast ratios */ }
}
```

## Current Implementation Status

- ✅ **MCP Server Core**: Complete and functional
- ✅ **CLI Integration**: Embedded in `rafters mcp` command
- ✅ **Token Intelligence Tools**: 7 tools implemented for design queries
- ✅ **Component Intelligence**: Fetches from registry with fallback
- ✅ **Validation System**: Cognitive load and color combination validation
- ⚠️  **Token Registry**: Requires compatible token files (ColorValue schema)
- ⚠️  **Dependency Chain**: Needs design-tokens package with ColorValue migration

## Next Steps for Full Functionality

1. **Complete Schema Migration**: Update existing token files to use ColorValue objects instead of string values
2. **Fix Dependencies**: Resolve darkValue references in design-tokens package
3. **Registry Integration**: Connect with updated token generators that create ColorValue objects
4. **Testing**: Verify MCP tools work with real ColorValue token data

## Future Enhancements

- [ ] Real-time token file watching
- [ ] Caching for performance  
- [ ] Visual diagrams (ASCII/Unicode)
- [ ] Historical design decisions
- [ ] Predictive intelligence