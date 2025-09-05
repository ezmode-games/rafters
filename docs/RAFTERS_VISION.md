# Rafters: Human-AI Design Collaboration System

## Core Vision

**Rafters enables humans to make complex design decisions with minimal cognitive load, then gives AI agents the systematic language to execute those decisions with line, shape, and color.**

---

## The Human-AI Design Partnership

### Human Contribution
- **Aesthetic judgment** and creative intent
- **Brand vision** and emotional direction  
- **Strategic design decisions** and priorities
- **Cultural context** and audience understanding

### AI Contribution  
- **Mathematical precision** (OKLCH conversions, contrast calculations, harmonic relationships)
- **Systematic consistency** across all design applications
- **Technical implementation** (CSS generation, component logic, accessibility compliance)
- **Design reasoning documentation** for future reference and team communication

### The Bridge: Rafters System
**Rafters handles complex mathematical relationships systematically** so designers can focus on creative decisions:

- Designer chooses a color → TokenRegistry calculates perceptually uniform scales and relationships
- Designer selects semantic meaning → ComponentRegistry provides usage patterns and design intelligence  
- Designer defines hierarchy intent → System creates consistent typographic and spacing systems
- Designer makes aesthetic choices → System ensures accessibility and systematic consistency

**The embedded intelligence reduces cognitive load** by providing systematic guidance for both humans and AI agents.

---

## Design Intelligence as Systematic Language

### The Problem
Designers make hundreds of micro-decisions based on intuition, experience, and aesthetic judgment. AI agents need systematic rules to make consistent decisions that honor the designer's intent.

### The Rafters Solution
**Convert human design intuition into machine-readable intelligence through two registry systems:**

#### 1. Component Registry (WHAT & WHY)
Every component includes embedded design reasoning:
```jsx
/**
 * @cognitive-load 3/10 - Simple action trigger with clear visual hierarchy
 * @attention-economics Primary variant commands highest attention - use sparingly
 * @trust-building Destructive actions require confirmation patterns
 * @accessibility WCAG AAA compliant with 44px minimum touch targets
 * @semantic-meaning primary=main actions, destructive=irreversible actions
 */
<Button variant="primary">Complete Order</Button>
```

#### 2. Token Registry (HOW)
Mathematical relationships and implementation details:
```typescript
// Designer intent: Trust-building professional blue
// TokenRegistry provides mathematical implementation
const primary = {
  50: "oklch(0.95 0.02 250)",   // Calculated scale
  500: "oklch(0.6 0.15 250)",  // Designer's choice  
  900: "oklch(0.2 0.08 250)",  // Accessible variants
  // Dependency relationships managed automatically
}
```

#### 3. MCP Integration
AI agents access intelligence through multiple pathways:
```typescript
// MCP queries component registry for design reasoning
// MCP queries token registry for implementation values  
// AI makes informed decisions based on embedded intelligence
```

---

## Cognitive Load Reduction Strategy

### Complex Decisions Made Simple

**Traditional Process** (High Cognitive Load):
1. Choose base color
2. Calculate OKLCH conversions manually  
3. Generate accessibility-compliant variants
4. Test color vision simulations
5. Create harmonic palettes
6. Validate contrast ratios
7. Generate typography scales
8. Ensure systematic consistency

**Rafters Process** (Minimal Cognitive Load):
1. Choose design intent (color, spacing, typography)
2. TokenRegistry handles mathematical complexity automatically
3. ComponentRegistry provides usage patterns and design reasoning
4. AI agents access embedded intelligence through MCP
5. System ensures consistency and accessibility by default

### Registry-Based Intelligence Infrastructure

**Component Registry Intelligence:**
- **Design reasoning** embedded in JSDoc annotations  
- **Usage patterns** with clear DO/NEVER guidelines
- **Cognitive load** ratings for systematic decision-making
- **Trust-building** patterns for user confidence

**Token Registry Mathematics:**
- **OKLCH color space** for perceptual uniformity
- **Dependency graphs** for systematic relationships  
- **Accessibility calculations** built into every token
- **Mathematical precision** while preserving design intent

**The system handles complex relationships systematically** while preserving human design reasoning for AI consumption.

---

## AI Agent Intelligence Integration

### Dual Registry Architecture for AI Intelligence
AI agents access design intelligence through two complementary systems:

#### 1. Component Registry Access (Design Reasoning)
```jsx
/**
 * @cognitive-load 7/10 - Destructive actions require careful consideration  
 * @attention-economics High-priority, requires confirmation patterns
 * @trust-building Permanent consequences demand progressive confirmation
 * @accessibility 44px touch targets, high contrast, screen reader optimized
 * @usage-patterns NEVER: Multiple destructive actions without confirmation
 */
```

#### 2. Token Registry Access (Implementation Values)
```typescript
// AI queries TokenRegistry for mathematical implementation
const destructiveToken = {
  value: "oklch(0.6 0.2 15)",      // Base color
  foreground: "oklch(0.98 0.01 15)", // Accessible text
  hover: "oklch(0.55 0.2 15)",     // Interaction state
  dependencies: ["destructive-foreground", "ring"] // Required tokens
}
```

#### 3. MCP Integration Points
```typescript
// AI agent workflow:
// 1. Query ComponentRegistry: "What variant for account deletion?"
// 2. Response: "destructive variant, requires confirmation patterns"  
// 3. Query TokenRegistry: "Implementation for destructive?"
// 4. Response: Complete color values and dependency relationships
// 5. AI implements with embedded intelligence
```

---

## Success Metrics

### For Designers
- **Reduced decision fatigue** from complex mathematical relationships
- **Faster system creation** without sacrificing quality
- **Confidence in accessibility** without manual calculations
- **Beautiful results** that honor aesthetic intent

### for AI Agents  
- **Component intelligence** through structured JSDoc annotations
- **Token precision** through mathematical relationships and dependency graphs
- **MCP integration** for seamless intelligence access
- **Systematic decision-making** based on embedded design reasoning

### For Teams
- **Transferable design intelligence** that survives designer transitions
- **Documented decision rationale** for future reference
- **Consistent brand expression** across all touchpoints
- **Accessible-by-default** systems that meet compliance standards

---

**Rafters bridges human creativity and AI precision through dual registry architecture, enabling designers to embed their reasoning into systematic intelligence that AI agents can access and honor through MCP integration.**