/**
 * LLMs.txt - AI Agent Intelligence for Rafters Design System
 *
 * This file provides AI agents with system understanding and component intelligence
 * for making informed UX decisions using Rafters components.
 */

import { getRegistryMetadata } from '../lib/registry/componentService';

export async function GET() {
  const registry = await getRegistryMetadata();

  // Sort components by cognitive load for logical presentation
  const _sortedComponents = registry.components.sort((a, b) => {
    const aLoad = a.meta?.rafters?.intelligence?.cognitiveLoad || 0;
    const bLoad = b.meta?.rafters?.intelligence?.cognitiveLoad || 0;
    return aLoad - bLoad;
  });

  const content = `# Rafters Design Intelligence System

## System Overview

Rafters is an AI-first design system that embeds human design reasoning directly into components. Each component contains intelligence about cognitive load, attention economics, trust building, and accessibility patterns that AI agents can read and apply systematically.

**Core Philosophy**: Components are not just UI elements - they are design knowledge artifacts that encode human UX expertise for AI consumption.

**Human-AI Collaboration Model**: Humans define design intelligence → System embeds reasoning → AI agents access intelligence → Better user experiences result.

## Core Design Principles

### Cognitive Load Management
Components are rated 0-10 based on mental effort required:
- 0-2: Invisible/structural elements that reduce complexity
- 3-5: Simple interactions with clear patterns  
- 6-8: Complex interactions requiring careful attention
- 9-10: High-risk interactions needing maximum care

### Attention Economics
Visual hierarchy system that respects human attention limits:
- Primary: Main user goals (max 1 per section)
- Secondary: Supporting actions and alternative paths
- Tertiary: Contextual/background information
- Each component encodes its attention weight and proper usage

### Trust Building Patterns
Components include built-in patterns for different consequence levels:
- Low Trust: Routine actions, minimal friction
- Medium Trust: Moderate consequences, balanced caution
- High Trust: Significant impact, deliberate friction  
- Critical Trust: Permanent consequences, maximum safety

### Accessibility Intelligence
Every component includes WCAG AAA patterns:
- Keyboard navigation requirements
- Screen reader optimization
- Touch target compliance (44px minimum)
- Multi-sensory communication (color + icon + text)

## Component Intelligence Summary

Components ordered by cognitive complexity (simplest to most complex):

### 1. Container (Cognitive Load: 0/10)
**Purpose**: Invisible layout structure that reduces visual complexity
**Attention**: Neutral structural element - controls content width without competing for attention
**Trust**: Predictable boundaries and consistent spacing patterns
**Usage**: Content width control, semantic structure (main/section/article), breathing room
**Key Intelligence**: Use padding (not margins), semantic HTML elements, predictable boundaries

### 2. Grid (Cognitive Load: 4/10)  
**Purpose**: Intelligent layout system with 4 semantic presets
**Attention**: Preset hierarchy - linear=democratic, golden=hierarchical, bento=complex patterns
**Trust**: Mathematical spacing (golden ratio), Miller's Law limits, consistent behavior
**Usage**: 
  - Linear: Product catalogs, equal-priority content
  - Golden: Editorial layouts, natural hierarchy
  - Bento: Content showcases, dashboards (use sparingly)
  - Custom: Specialized layouts
**Key Intelligence**: Never exceed 8 items on wide screens, semantic asymmetry only with meaning

### 3. Badge (Cognitive Load: 2/10)
**Purpose**: Status communication with multi-sensory patterns
**Attention**: Secondary/tertiary support, max 1 high-attention badge per section
**Trust**: Low trust informational display with optional interaction
**Usage**: Status indicators, navigation counts, category labels with semantic meaning
**Key Intelligence**: Color + Icon + Text prevents accessibility failure, semantic variants over arbitrary colors

### 4. Button (Cognitive Load: 3/10)
**Purpose**: Interactive actions with clear visual hierarchy
**Attention**: Size hierarchy (sm=tertiary, md=secondary, lg=primary), primary variant max 1 per section
**Trust**: Destructive actions require confirmation, loading states prevent double-submission
**Usage**: Primary=main goals, secondary=supporting actions, destructive=irreversible actions
**Key Intelligence**: Visual feedback reinforces actions, confirmation patterns for destructive operations

### 5. Input (Cognitive Load: 4/10)
**Purpose**: Data collection with validation and accessibility patterns
**Attention**: Focus management, clear labeling, error state hierarchy
**Trust**: Real-time validation, secure input patterns, clear success/error feedback
**Usage**: Form fields, search inputs, data entry with proper validation
**Key Intelligence**: Progressive validation, clear error messaging, accessibility labeling

### 6. Select (Cognitive Load: 5/10)
**Purpose**: Choice selection with cognitive load management
**Attention**: Collapsed state reduces complexity, clear option hierarchy
**Trust**: Predictable interaction patterns, clear selection feedback
**Usage**: Option selection, filtering, settings with manageable choice sets
**Key Intelligence**: Limit options for cognitive load, clear selected state, keyboard navigation

### 7. Dialog (Cognitive Load: 6/10)
**Purpose**: Modal interactions for critical user decisions
**Attention**: Commands highest attention, interrupts user flow deliberately
**Trust**: Critical trust level, requires clear escape routes and confirmation
**Usage**: Account deletion, data loss warnings, irreversible actions
**Key Intelligence**: Progressive confirmation, clear escape hatches, focus management

## Design Decision Framework

When using Rafters components, apply this decision process:

1. **Cognitive Load**: Choose components appropriate for user mental capacity
   - Start with lowest cognitive load components (Container, Badge)
   - Add complexity only when semantically necessary
   - Never exceed user attention limits (7±2 items)

2. **Attention Economics**: Respect visual hierarchy
   - Maximum 1 primary element per section
   - Use secondary elements for supporting actions
   - Background elements should not compete for attention

3. **Trust Building**: Match patterns to consequence level
   - Low consequence: Simple, fast interactions
   - High consequence: Deliberate friction, confirmation patterns
   - Irreversible actions: Maximum safety patterns

4. **Accessibility**: Apply multi-sensory communication
   - Never rely on color alone
   - Provide keyboard navigation
   - Include screen reader support
   - Ensure 44px minimum touch targets

## CLI Usage

The Rafters CLI enables AI agents to implement design intelligence through direct commands:

### Installation & Setup
\`\`\`bash
# Initialize design system with embedded intelligence
npx rafters init

# Add components with cognitive load metadata
npx rafters add button card dialog

# Query component status and intelligence
npx rafters list --details

# Start MCP server for AI agent integration
npx rafters mcp
\`\`\`

### AI Agent Integration via MCP
The CLI provides a Model Context Protocol server with 7 specialized tools for **real-time design token intelligence querying and searching**. All design token metadata, cognitive load ratings, trust levels, and semantic relationships are queryable through the MCP interface:

**1. get_color_intelligence** - **Search and analyze individual color tokens** including complete scale relationships, state variants, color harmonies, psychological impact data, and accessibility metadata

**2. get_token_by_category** - **Query and filter all tokens by category** (color, spacing, motion) with cognitive load and trust level filtering for semantic token discovery

**3. get_component_intelligence** - Access component design intelligence including cognitive load ratings, trust patterns, accessibility requirements, and usage guidelines

**4. validate_color_combination** - Validate color combinations for cognitive load balance, trust level hierarchy, and attention economics with specific warnings and recommendations

**5. get_accessible_colors** - Find WCAG AA/AAA compliant color combinations for given backgrounds with contrast validation

**6. get_tokens_by_trust_level** - **Search and filter all design tokens by trust level** (low/medium/high/critical) for appropriate consequence matching and semantic discovery

**7. calculate_cognitive_load** - Calculate total cognitive load for component combinations with budget management (15-point cognitive budget) and optimization recommendations

### Command Intelligence
- **init**: Detects project framework, configures intelligent defaults
- **add**: Installs components with embedded design reasoning
- **list**: Shows component intelligence metadata and usage patterns
- **mcp**: Enables direct AI agent access to design system intelligence

### MCP Integration Workflow
AI agents can query design intelligence in real-time:

1. **Design Decision Validation**: Use \`validate_color_combination\` and \`calculate_cognitive_load\` before implementing UI patterns
2. **Context-Aware Component Selection**: Query \`get_component_intelligence\` to understand when and how to use specific components
3. **Accessibility Compliance**: Use \`get_accessible_colors\` to ensure WCAG standards are met automatically
4. **Trust Level Matching**: Query \`get_tokens_by_trust_level\` to match visual hierarchy with interaction consequences
5. **Token Discovery & Search**: Use \`get_token_by_category\` and \`get_tokens_by_trust_level\` to search and discover semantically appropriate design tokens over arbitrary values

### Design Token Intelligence Querying
**CRITICAL CAPABILITY**: All design token intelligence is live-queryable through MCP. AI agents can search, filter, and analyze tokens by:
- **Semantic meaning** (e.g., find all "destructive" tokens)
- **Cognitive load ratings** (0-10 complexity scale)
- **Trust levels** (low/medium/high/critical consequence matching)
- **Category relationships** (color/spacing/motion token families)
- **Accessibility compliance** (WCAG AA/AAA compatibility)
- **Psychological impact** (color psychology and user perception data)

**Example Token Intelligence Queries**:
- "Find all high-trust color tokens" → \`get_tokens_by_trust_level("high")\`
- "Get complete primary color intelligence" → \`get_color_intelligence("primary")\`
- "Show all spacing tokens under cognitive load 3" → \`get_token_by_category("spacing")\` + filter
- "Validate red + green combination" → \`validate_color_combination(["destructive", "success"])\`

**Example MCP Query Flow**:
- Agent needs to design a delete button → Queries \`get_component_intelligence\` for "Button" → Gets cognitive load 3/10, requires destructive variant → Queries \`get_tokens_by_trust_level\` for "critical" → Gets destructive color tokens → Validates with \`validate_color_combination\` → Implements with proper confirmation patterns

## Registry Usage

All component implementation details, code examples, and complete intelligence are available via the registry API:

- Registry root: /registry/index.json
- All components: /registry/components/index.json
- Individual components: /registry/components/{name}.json

Each registry entry includes full JSDoc intelligence, usage patterns, design guides, and shadcn-compatible implementation details.

## Semantic Token System

Rafters uses semantic tokens over arbitrary values:
- bg-primary vs bg-blue-500 (carries meaning)
- text-destructive-foreground vs text-red-800 (contextual intent)
- space-comfortable vs p-4 (systematic relationships)

This enables AI agents to make contextually appropriate design decisions rather than arbitrary color/spacing choices.

---

This system enables AI agents to understand design reasoning and create better user experiences through embedded human design intelligence.`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
