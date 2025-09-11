/**
 * LLMs.txt - AI Agent Intelligence for Rafters Design System
 *
 * This file provides AI agents with system understanding and component intelligence
 * for making informed UX decisions using Rafters components.
 */

import { getComponentRegistry } from '../lib/registry/componentService';

export async function GET() {
  const registry = await getComponentRegistry();

  // Sort components by cognitive load for logical presentation
  const sortedComponents = registry.components.sort((a, b) => {
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
