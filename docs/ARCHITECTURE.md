# Rafters Architecture
## TokenRegistry-Based Design Intelligence System

*Components and tokens with embedded mathematical design reasoning powered by centralized registry*

---

## Core Approach

Rafters provides mathematical design intelligence through centralized token management:
- **TokenRegistry class** as single source of truth for all design tokens
- **Install components as source code** with embedded design reasoning (shadcn-compatible)
- **Automatic AI enrichment** for colors via Color Intelligence API
- **Mathematical dependency tracking** with topological sorting and cycle detection
- **MCP server integration** providing 7 design intelligence tools for AI agents
- **Cross-system intelligence** understanding relationships between colors, layout, accessibility

---

## TokenRegistry Architecture

### 1. TokenRegistry (Single Source of Truth)
The TokenRegistry class manages all tokens with embedded intelligence and dependency tracking:

```typescript
// TokenRegistry with O(1) operations and dependency management
const registry = new TokenRegistry();

// Set tokens with automatic metadata handling
registry.set('destructive', 'oklch(0.4 0.15 20)', {
  category: 'color',
  trustLevel: 'critical',
  cognitiveLoad: 7,
  usageContext: ['delete', 'permanent-action']
});

// Automatic AI enrichment via Color Intelligence API
await registry.enrichColorToken('destructive');
// Adds: colorIntelligence, accessibility data, psychological analysis

// Mathematical dependency tracking
registry.addDependency('destructive-hover', ['destructive'], 'state:hover');
registry.addDependency('spacing-lg', ['spacing-base'], 'calc({spacing-base} * 2)');

// Dependency validation with cycle detection
registry.wouldCreateCircularDependency('primary', ['primary-hover']); // false
```

### 2. Component Intelligence (JSDoc Metadata)
Components carry embedded design reasoning through JSDoc intelligence comments:

```tsx
/**
 * Button Intelligence: cognitiveLoad=3, trustLevel=medium
 * 
 * TokenRegistry Integration:
 * - Uses semantic tokens from registry: 'primary', 'destructive', 'secondary'
 * - Automatic dependency resolution for hover/focus states
 * - Color accessibility calculated with perceptual weight analysis
 * 
 * Usage Intelligence:
 * - Destructive variant REQUIRES confirmation UX patterns (trustLevel=critical)
 * - Primary buttons limited to 1 per view (attention economics)
 * - Touch targets: 44px minimum (WCAG AAA compliance)
 * 
 * Cross-System Relationships:
 * - Works with motion accessibility tokens for reduced-motion users
 * - Integrates with typography scale for consistent text sizing
 */
export const Button = ...
```

### 3. TokenDependencyGraph (Mathematical Relationships)
Dependency tracking with topological sorting prevents circular references:

```typescript
// Automatic dependency management with cycle detection
const graph = new TokenDependencyGraph();

// Add dependencies with generation rules
graph.addDependency('primary-hover', ['primary'], 'state:hover');
graph.addDependency('spacing-lg', ['spacing-base'], 'calc({spacing-base} * 2)');

// Topological sorting for update order (Kahn's algorithm)
const updateOrder = graph.topologicalSort();
// Returns: ['spacing-base', 'primary', 'spacing-lg', 'primary-hover']

// Circular dependency prevention
graph.wouldCreateCircularDependency('primary', ['primary-hover']); // false
graph.wouldCreateCircularDependency('primary-hover', ['primary']); // true
```

### 4. MCP Server (AI Agent Integration)
Model Context Protocol server provides 7 design intelligence tools:

```typescript
// MCP Server running on port 3001
const mcpServer = {
  tools: [
    'get_color_intelligence',      // Complete color analysis with AI metadata
    'get_token_dependencies',      // Dependency resolution and generation rules  
    'calculate_cognitive_load',    // 15-point cognitive load budget system
    'validate_color_combination',  // Accessibility and readability analysis
    'get_colors_by_trust_level',  // Trust-based color classification
    'get_component_metadata',      // Component intelligence and usage patterns
    'recommend_design_improvements' // AI-powered design optimization
  ]
};
```

---

## System Components

### TokenRegistry Class
- **Centralized token management**: Single source of truth for all design tokens
- **O(1) operations**: Efficient get/set operations with Map-based storage
- **AI enrichment**: Automatic color intelligence via https://rafters.realhandy.tech/api/color-intel
- **Dependency tracking**: Integration with TokenDependencyGraph for relationship management
- **JSON persistence**: Tokens stored in files but accessed only through registry
- **Output**: Enriched tokens with embedded mathematical intelligence

### TokenDependencyGraph Class  
- **Topological sorting**: Kahn's algorithm for dependency order resolution
- **Cycle detection**: Prevents circular dependencies in token relationships
- **Generation rules**: Support for calc(), state:hover, scale:500 patterns
- **Performance**: O(V + E) complexity for dependency operations
- **Output**: Sorted dependency lists and circular dependency validation

### Color Intelligence API
- **AI-powered analysis**: Psychological impact, semantic meaning, trust levels
- **OKLCH color space**: Perceptually uniform color calculations
- **Accessibility mathematics**: WCAG AA/AAA compliance with contrast ratios
- **Temperature analysis**: Warm/cool/neutral classification
- **Output**: Complete color intelligence metadata

### CLI Tool (Shadcn-Compatible)
```bash
npx rafters init        # Setup project with TokenRegistry system
npx rafters mcp         # Start MCP server with design intelligence tools
npx rafters add <component>  # Install component with JSDoc intelligence
```

### Project Structure After Init
```
project/
├── .rafters/
│   ├── config.json                    # CLI configuration  
│   ├── tokens/                        # JSON token storage (managed by TokenRegistry)
│   │   ├── colors.json                # Color tokens with AI intelligence
│   │   ├── spacing.json               # Spacing tokens with mathematical ratios
│   │   └── typography.json            # Typography tokens with musical harmony
│   └── intelligence-manifest.json     # Component & token intelligence registry
├── src/
│   ├── components/ui/                 # Components with JSDoc intelligence
│   ├── lib/design-tokens/             # TokenRegistry and dependency management
│   │   ├── registry.ts                # TokenRegistry class implementation
│   │   ├── dependencies.ts            # TokenDependencyGraph class
│   │   └── export.ts                  # CSS/Tailwind export functionality
│   └── styles/tokens.css              # Generated design tokens
└── tailwind.config.ts                 # Includes TokenRegistry-based token system
```

---

## CLI Commands

### `npx rafters init`
**Purpose**: Initialize Rafters TokenRegistry-based design intelligence system

**Flow**:
1. Detect package manager (pnpm/npm/yarn)
2. Check for existing Tailwind CSS installation
3. Ask: "Generate TokenRegistry system? (Y/n)"
4. If yes: "Token categories: colors, spacing, typography, motion? (all)"
5. Create `.rafters/` directory structure with token storage
6. Install required dependencies (Radix primitives, clsx, tailwind-merge, design-tokens)
7. Generate TokenRegistry configuration and JSDoc intelligence templates

**Creates**:
- `.rafters/config.json` - CLI configuration
- `.rafters/tokens/` - JSON token storage managed by TokenRegistry
- `.rafters/intelligence-manifest.json` - Component and token intelligence registry
- `src/lib/design-tokens/` - TokenRegistry and dependency management classes
- `src/components/ui/` - Component directory with JSDoc intelligence templates
- `src/styles/tokens.css` - Generated design tokens

### `npx rafters mcp`
**Purpose**: Start Model Context Protocol server for AI agent integration

**Flow**:
1. Initialize TokenRegistry from stored tokens
2. Load dependency graph and generation rules
3. Start MCP server on port 3001
4. Register 7 design intelligence tools
5. Enable AI agent access to token intelligence

**Provides**:
- Real-time token intelligence queries
- Cognitive load calculations with 15-point budget
- Color accessibility validation
- Design optimization recommendations

### `npx rafters add <component>`
**Purpose**: Install component with embedded JSDoc design intelligence

**Flow**:
1. Read `.rafters/config.json` and TokenRegistry configuration
2. Download component source from registry
3. Write to `src/components/ui/<component>.tsx` with JSDoc intelligence
4. Update `.rafters/intelligence-manifest.json`
5. Install any missing Radix dependencies
6. Generate related tokens via TokenRegistry if needed

**Example**:
```bash
npx rafters add button
✓ Installing Button component...
✓ Adding JSDoc intelligence patterns...
✓ Updating intelligence manifest...
✓ Installing Radix dependencies...
✓ Button installed with mathematical design intelligence
```

### `npx rafters tokens <color>` *(Future)*
**Purpose**: Generate mathematical color intelligence

**Flow**:
1. Analyze color using color theory mathematical functions
2. Calculate atmospheric weight and perceptual weight
3. Generate accessibility matrix for WCAG compliance
4. Output token with embedded intelligence metadata
5. Update design token registry with mathematical relationships

---

## Mathematical Token System

### Generated Mathematical Tokens
```css
/* Generated from mathematical design intelligence */
@import "tailwindcss";

@theme {
  /* Color Theory Intelligence */
  --color-primary: oklch(0.7 0.15 220); /* Cool atmospheric foreground */
  --color-primary-foreground: oklch(0.95 0.02 220); /* Calculated for AAA contrast */
  
  /* Golden Ratio Spacing System */
  --spacing-0: 0rem;          /* 0px - mathematical zero */
  --spacing-1: 0.25rem;       /* 4px - base unit */
  --spacing-2: 0.405rem;      /* 4px * 1.618^1 / 16 */
  --spacing-3: 0.655rem;      /* 4px * 1.618^2 / 16 */
  --spacing-4: 1.059rem;      /* 4px * 1.618^3 / 16 */
  
  /* Musical Typography Scale (Golden Ratio) */
  --font-size-xs: 0.618rem;   /* Base * φ^-2 - Small text */
  --font-size-sm: 0.764rem;   /* Base * φ^-1 - Small paragraphs */
  --font-size-base: 1rem;     /* Base - Body text (16px) */
  --font-size-lg: 1.618rem;   /* Base * φ^1 - Large text */
  --font-size-xl: 2.618rem;   /* Base * φ^2 - Headings */
  
  /* Motion Physics with Cognitive Load */
  --motion-duration-instant: 0ms;      /* Cognitive load >= 8 */
  --motion-duration-fast: 150ms;       /* Low cognitive load */
  --motion-duration-normal: 300ms;     /* Standard interactions */
  --motion-duration-slow: 500ms;       /* High attention required */
  
  /* Accessibility-First Border Radius */
  --radius-sm: 4px;    /* Touch-friendly minimum */
  --radius-md: 8px;    /* Standard UI elements */
  --radius-lg: 12px;   /* Card-level containers */
}
```

### Component Usage with JSDoc Intelligence
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, trustLevel=medium
 * 
 * Mathematical Intelligence:
 * - Size hierarchy follows golden ratio attention economics (sm=tertiary, lg=primary)
 * - Spacing uses systematic progression (--spacing-2, --spacing-3, --spacing-4)
 * - Color accessibility calculated with perceptual weight analysis
 * - Motion respects cognitive load (reduced for high-load interactions)
 * 
 * Usage Intelligence:
 * - Destructive variant REQUIRES confirmation UX patterns
 * - Primary buttons limited to 1 per view (attention economics)
 * - Touch targets: 44px minimum (WCAG AAA compliance)
 * 
 * Cross-System Relationships:
 * - Integrates with motion tokens for reduced-motion accessibility
 * - Typography scale maintains consistent text hierarchy
 * - Color theory ensures proper atmospheric weight distribution
 */
export const Button = ({ size = 'md', variant = 'primary', ...props }) => {
  return (
    <button
      className={cn(
        // Base styles using mathematical tokens
        'inline-flex items-center justify-center rounded-[var(--radius-md)]',
        'font-medium focus-visible:outline-none',
        'transition-colors duration-[var(--motion-duration-fast)]',
        
        // Golden ratio size hierarchy
        {
          'h-8 px-[var(--spacing-2)] text-[var(--font-size-sm)]': size === 'sm',  // Tertiary
          'h-10 px-[var(--spacing-3)] text-[var(--font-size-base)]': size === 'md', // Secondary  
          'h-12 px-[var(--spacing-4)] text-[var(--font-size-lg)]': size === 'lg',  // Primary
        },
        
        // Color theory variants with accessibility intelligence
        {
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]': variant === 'primary',
          'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]': variant === 'secondary',
          // Destructive requires confirmation patterns (see JSDoc intelligence)
          'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]': variant === 'destructive',
        }
      )}
      {...props}
    />
  )
}
```

---

## Mathematical Intelligence Distribution

### Why This Approach Works for AI Agents

**1. Mathematical Foundation**
- Color theory calculations provide consistent, predictable intelligence
- Golden ratio spacing ensures systematic proportional relationships
- Musical typography ratios create naturally harmonious text scales
- All intelligence derived from mathematical principles, not arbitrary decisions

**2. Cross-System Intelligence**
- **JSDoc Comments**: Mathematical relationships and usage intelligence embedded in code
- **Token Registry**: Complete mathematical derivation and accessibility calculations
- **Component Registry**: Design reasoning with cross-system relationships

**3. MCP Integration for AI Agents**
- Components and tokens become part of local AI agent context
- Mathematical intelligence enables principled design decisions
- Cross-system relationships prevent design inconsistencies
- AI agents understand WHY decisions were made, not just WHAT they are

**4. Systematic Design Education**
- Teams learn mathematical design principles through embedded intelligence
- Design reasoning transfers across all components and tokens
- Mathematical foundations enable consistent decision-making
- Intelligence accumulates and compounds across the design system

### Benefits Over Traditional Design Libraries

**Traditional Approach**:
```tsx
import { Button } from 'some-library'
// AI knows: "it's a button component with these props"
```

**Rafters Mathematical Intelligence Approach**:
```tsx
/**
 * Button Intelligence: cognitiveLoad=3, trustLevel=medium
 * Mathematical Intelligence: Golden ratio hierarchy, color theory accessibility
 * Cross-System Relationships: Motion, typography, spacing integration
 * Usage Patterns: Destructive requires confirmation, primary limited per view
 */
export const Button = ({ variant, size, ...props }) => {
  // Implementation using mathematical token system
}
// AI knows: Mathematical relationships + design reasoning + cross-system intelligence + accessibility compliance
```

---

## Future Enhancements

### Version 1.0 (Current)
- Mathematical token generation system (colors, spacing, typography, motion)
- CLI for component installation with JSDoc intelligence
- Core component library with embedded design reasoning
- MCP integration for AI agent access

### Version 2.0
- Rafters Studio for design intent capture and mathematical intelligence generation
- Advanced mathematical functions for layout proportions and negative space
- Community component registry with intelligence validation
- Cross-system intelligence optimization and conflict detection

### Version 3.0
- Complete design intelligence preservation platform
- AI agent training on mathematical design principles
- Automated accessibility compliance validation across all systems
- Design reasoning evolution and pattern learning

---

## Technical Constraints

### Requirements
- **Tailwind CSS v4+** (CSS-first configuration with mathematical tokens)
- **React 18+** (React 19 patterns preferred for purity requirements)
- **Radix UI primitives** (accessibility foundation for WCAG AAA compliance)
- **Mathematical token generators** (golden ratio, musical harmony, color theory)

### Non-Requirements
- No AI inference costs (mathematical intelligence is pre-calculated)
- No config file syncing (mathematical tokens via CSS custom properties)
- No version management (source code ownership with intelligence preservation)
- No runtime dependencies (mathematical calculations happen at design time)

### Philosophy
- **Mathematical foundations** - intelligence derived from design theory, not arbitrary decisions
- **Source code ownership** - your code with embedded mathematical intelligence
- **Cross-system intelligence** - colors, spacing, typography, motion work together systematically
- **Accessibility-first** - WCAG AAA compliance mathematically built into all systems
- **AI-agent friendly** - JSDoc intelligence enables principled AI decision-making

This architecture provides mathematical design intelligence (like structural rafters) that enables both human designers and AI agents to make principled, systematic design decisions based on centuries of design theory rather than guesswork.