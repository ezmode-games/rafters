# Design Tokens Package Specification

## Purpose

The `@rafters/design-tokens` package is the transformation layer between design system values and output formats. It provides token structure, intelligence metadata, and format export capabilities.

## Architecture Principles

1. **Value-agnostic**: This package does not hardcode color/spacing values
2. **Deterministic**: Same inputs always produce same outputs
3. **Format-flexible**: Can export to CSS, Tailwind, JSON, etc.
4. **Intelligence-first**: Every token carries semantic meaning and usage metadata

## Core Functions

### `createRegistry(primary: string): TokenRegistry`

**Purpose**: Generate a complete design system from a single primary color seed.

**Implementation**:
- Takes primary color as hex string (e.g., `#6366f1`)
- Uses `@rafters/color-utils` to generate:
  - Complete lightness scale (50-950)
  - Semantic colors (success, warning, danger, info) 
  - Foreground/background pairs with proper contrast
  - All component-specific colors (card, popover, accent, etc.)
- Applies intelligence metadata to each token
- Returns `TokenRegistry` instance with smart getters/setters

**Example**:
```typescript
const registry = createRegistry('#6366f1');
console.log(registry.get('primary')); // Token with full metadata
registry.set('accent', '#ff6b6b'); // Regenerates dependent tokens
```

### Smart Token Registry API

### `TokenRegistry.get(tokenName: string): Token | undefined`

**Purpose**: Intelligent token retrieval with metadata.

**Features**:
- Returns token with full intelligence metadata
- Includes usage context and component associations
- Provides accessibility information (contrast ratios, etc.)
- Shows mathematical relationships to other tokens

**Example**:
```typescript
const primary = registry.get('primary');
console.log(primary.semanticMeaning); // "Primary brand color for main actions"
console.log(primary.applicableComponents); // ['button', 'link', 'badge']
console.log(primary.trustLevel); // 'high'
```

### `TokenRegistry.set(tokenName: string, value: string): void`

**Purpose**: Intelligent token modification with automatic dependency updates.

**Smart Behavior**:
- Setting primary color regenerates entire color scale
- Setting background automatically recalculates foreground for contrast
- Updates all dependent component tokens (card, popover inherit from background)
- Validates accessibility requirements before applying changes
- Triggers cascade updates through token relationships

**Example**:
```typescript
registry.set('primary', '#ff0000'); 
// Automatically regenerates:
// - primary-foreground (for contrast)
// - All primary scale variants (50-950)
// - Focus ring colors
// - Related semantic tokens
```

### `TokenRegistry.getScale(baseName: string): Record<number, Token>`

**Purpose**: Get complete scale for a color (50, 100, 200...950).

**Example**:
```typescript
const primaryScale = registry.getScale('primary');
console.log(primaryScale[500]); // Base primary token
console.log(primaryScale[50]);  // Lightest variant
```

### `TokenRegistry.validateAccessibility(): ValidationResult[]`

**Purpose**: Check all tokens against accessibility requirements.

**Returns**: Array of validation issues with suggested fixes.

### `TokenRegistry.getDependents(tokenName: string): string[]`

**Purpose**: Get all tokens that depend on the specified token.

**Example**:
```typescript
registry.getDependents('background'); 
// Returns: ['card', 'popover', 'background-foreground', ...]
```

### `exportTokens(registry: TokenRegistry, format: 'css' | 'tailwind' | 'json'): string`

**Purpose**: Transform registry to usable format.

**CSS Format**:
- Generates CSS custom properties
- Includes light/dark theme variants
- Optimized for design system usage

**Tailwind Format**: 
- Generates Tailwind CSS v4 `@theme` blocks
- Includes responsive variants where applicable
- Compatible with existing Tailwind workflows

**JSON Format**:
- Raw token data with full intelligence metadata
- For Studio and other tooling consumption

## Data Flow

```
Primary Color → color-utils (math) → Token Structure → Export Format
     ↓
  Studio UI ←→ .rafters/ folder ←→ CLI commands
     ↓
  CSS Output ← design-tokens (transform)
```

## Token Intelligence Schema

Every token includes:
- `semanticMeaning`: Human-readable purpose
- `trustLevel`: UI consequence level (low/medium/high/critical)
- `cognitiveLoad`: Mental processing cost (1-10)
- `applicableComponents`: Which components use this token
- `accessibilityLevel`: AA/AAA compliance
- Mathematical relationships and responsive behavior metadata

## Integration Points

### With CLI
```typescript
// rafters init
const registry = createRegistry('#6366f1'); // Default primary
await writeRegistryToProject(registry, '.rafters/');
```

### With Studio
```typescript
// Human changes primary color in Studio UI
const registry = loadRegistryFromProject('.rafters/');
registry.set('primary', humanChosenColor);

// Validate changes
const issues = registry.validateAccessibility();
if (issues.length === 0) {
  // Save to .rafters/ and regenerate CSS
  await writeRegistryToProject(registry, '.rafters/');
  const css = exportTokens(registry, 'css');
  await writeFile('src/styles/tokens.css', css);
}
```

### With AI Agents
```typescript
// Agent wants to understand token relationships
const registry = loadRegistryFromProject('.rafters/');
const primary = registry.get('primary');
console.log(`Use ${primary.name} for ${primary.applicableComponents.join(', ')}`);
console.log(`Trust level: ${primary.trustLevel}, Cognitive load: ${primary.cognitiveLoad}`);

// Agent wants to modify design system programmatically  
registry.set('accent', '#ff6b6b');
const dependents = registry.getDependents('accent');
console.log(`Changed accent, updated ${dependents.length} dependent tokens`);

// Export for immediate use
const css = exportTokens(registry, 'css');
```

### With Components
- Components use standard CSS classes (`bg-primary`, `text-card-foreground`)
- No direct package dependency needed
- Intelligence metadata available via registry queries

## Usage Patterns

### Studio Workflow
1. Human loads existing registry from `.rafters/`
2. Human modifies colors/settings through Studio UI
3. Registry automatically recalculates dependent tokens
4. Studio validates accessibility and shows warnings
5. Human saves → CSS file regenerated

### AI Agent Workflow  
1. Agent loads registry to understand current design system
2. Agent queries token metadata for usage guidance
3. Agent optionally modifies tokens programmatically
4. Agent exports updated CSS if changes made
5. Agent uses standard CSS classes in components

### CLI Workflow
1. `rafters init` creates registry with defaults
2. `rafters sync` updates CSS from `.rafters/` changes
3. `rafters validate` runs accessibility checks
4. `rafters export` generates CSS/JSON for deployment

## Compatibility

- **Shadcn/ui**: Direct token name compatibility
- **Tailwind CSS**: Native class generation
- **AI Agents**: Familiar API with enhanced intelligence
- **Accessibility**: WCAG AAA compliance built-in

## File Structure

```
src/
├── index.ts           # Main exports
├── registry.ts        # createRegistry implementation  
├── export.ts          # exportTokens implementation
├── intelligence.ts    # Token metadata definitions
└── types.ts           # TypeScript interfaces
```

## Non-Goals

- ❌ Hardcoded color values
- ❌ UI components (that's @rafters/ui)
- ❌ Color manipulation (that's @rafters/color-utils)
- ❌ Direct Studio UI integration