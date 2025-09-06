# Rafters MCP Server - Implemented Features

**Live Design Intelligence for AI Agents via Model Context Protocol**

The Rafters MCP server provides instant, precise answers about design tokens and components, giving AI agents access to actual design intelligence instead of pattern matching.

**Status**: ✅ **IMPLEMENTED** - MCP server running on port 3001 with 7 design intelligence tools

---

## Implemented Capabilities

### 1. Color Intelligence (✅ LIVE)

#### get_color_intelligence
```typescript
// Complete color analysis with AI metadata
mcp.get_color_intelligence('destructive') 
// Returns: OKLCH values, accessibility data, psychological impact, trust level

// Example Response:
{
  name: 'destructive',
  value: 'oklch(0.4 0.15 20)',
  colorIntelligence: {
    semanticMeaning: 'Destructive actions - permanent consequences',
    psychologicalImpact: 'High urgency, requires confirmation',
    accessibility: {
      onWhite: { wcagAA: true, wcagAAA: false, contrastRatio: 4.8 },
      onBlack: { wcagAA: true, wcagAAA: true, contrastRatio: 12.3 }
    },
    analysis: {
      temperature: 'warm',
      isLight: false,
      name: 'Destructive Red'
    }
  },
  trustLevel: 'critical',
  cognitiveLoad: 7
}
```

#### get_colors_by_trust_level  
```typescript
// Get all colors requiring specific trust patterns
mcp.get_colors_by_trust_level('critical')
// Returns: All colors requiring confirmation UX patterns
```

#### validate_color_combination
```typescript  
// Validate color accessibility and readability
mcp.validate_color_combination(['primary', 'destructive'])
// Returns: Contrast analysis, accessibility compliance, readability scores
```

### 2. Token Dependencies (✅ LIVE)

#### get_token_dependencies
```typescript
// Get all tokens that depend on a base token
mcp.get_token_dependencies('primary')
// Returns: ['primary-foreground', 'primary-hover', 'primary-focus'] with generation rules
```

### 3. Cognitive Load Analysis (✅ LIVE)

#### calculate_cognitive_load
```typescript
// 15-point cognitive load budget system
mcp.calculate_cognitive_load(['Dialog', 'Form', 'Button-destructive'])
// Returns: "Cognitive load: 14/15 points, within budget"

// Detailed analysis with optimization suggestions
{
  totalLoad: 14,
  budget: 15,
  withinBudget: true,
  breakdown: [
    { component: 'Dialog', load: 5, reason: 'Modal interruption requires attention shift' },
    { component: 'Form', load: 4, reason: 'Multiple input fields increase mental effort' },
    { component: 'Button-destructive', load: 7, reason: 'High-stakes action requires careful consideration' }
  ],
  recommendations: ['Consider reducing form complexity', 'Add progressive disclosure']
}
```

### 4. Component Intelligence (✅ LIVE)

#### get_component_metadata
```typescript
// Component usage patterns and intelligence
mcp.get_component_metadata('Button')
// Returns: Cognitive load patterns, trust requirements, accessibility guidelines

// Example Response:
{
  name: 'Button',
  cognitiveLoad: {
    base: 2,
    destructive: 7,
    primary: 3,
    secondary: 1
  },
  trustPatterns: {
    destructive: 'requires_confirmation',
    primary: 'high_attention',
    secondary: 'low_friction'
  },
  accessibility: {
    minTouchTarget: '44px',
    requiredContrast: 'AA',
    keyboardNavigation: 'required'
  }
}
```

### 5. Design Optimization (✅ LIVE)

#### recommend_design_improvements  
```typescript
// AI-powered design optimization
mcp.recommend_design_improvements(['Dialog', 'Form-complex', 'Button-destructive'])
// Returns: Specific recommendations for reducing cognitive load and improving UX
```

---

## Implemented MCP Server Architecture

### 7 Live Tools Available:
1. **get_color_intelligence** - Complete color analysis with AI metadata
2. **get_token_dependencies** - Token relationship and dependency tracking  
3. **calculate_cognitive_load** - 15-point cognitive load budget analysis
4. **validate_color_combination** - Color accessibility and contrast validation
5. **get_colors_by_trust_level** - Trust-based color classification
6. **get_component_metadata** - Component intelligence and usage patterns  
7. **recommend_design_improvements** - AI-powered design optimization

### Technical Implementation:
- **Server**: Runs on port 3001 
- **Protocol**: Model Context Protocol (MCP) standard
- **Integration**: TokenRegistry and TokenDependencyGraph classes
- **AI API**: https://rafters.realhandy.tech/api/color-intel for color intelligence
- **Performance**: O(1) token lookups, <5ms response times

### Usage:
```bash
# Start MCP server
npx rafters mcp

# Server provides tools for AI agents to query design intelligence
# Accessible via MCP client libraries or direct protocol communication
```

---

### Enhanced Token Relationships (High Priority)
```typescript
// Token category and scale queries
mcp.getTokensByCategory('motion')  
// Returns: All motion tokens with timing/easing values and usage context

mcp.getTokenScale('spacing', 500)
// Returns: Specific spacing value from mathematical scale (e.g., '32px')

mcp.getRelatedTokens('spacing-lg')
// Returns: Tokens mathematically related (spacing-md, spacing-xl) with scale positions

mcp.getTokensByComponent('button')
// Returns: All tokens applicable to button components with usage patterns

// Cross-category token relationships  
mcp.getHarmonizingTokens('primary-600')
// Returns: Spacing, typography, motion tokens that harmonize with this color
```

### Enhanced Design Intelligence (High Priority)
```typescript
// Real-time dependency analysis during token changes
mcp.analyzeTokenChange('primary', 'oklch(0.7 0.18 250)')
// Returns: Impact analysis - which components affected, regeneration needed

// Design system consistency checking
mcp.validateDesignSystemConsistency()
// Returns: Gaps, conflicts, missing states across all tokens

// Automatic token generation suggestions
mcp.suggestMissingTokens('primary')
// Returns: Missing hover, focus, disabled states with generated values

// Context-aware token recommendations
mcp.recommendTokensForComponent('AlertDialog', { purpose: 'delete-account' })
// Returns: Optimal token combination for specific use case with trust patterns
```

### Advanced Cognitive Load Analysis (Medium Priority)
```typescript
// Real-time interface complexity analysis
mcp.analyzeCognitiveLoad(componentTree)
// Returns: Hot spots, overload warnings, simplification suggestions

// Progressive disclosure recommendations
mcp.recommendProgressiveDisclosure(complexInterface)
// Returns: Which elements to hide/show for cognitive load optimization

// Attention economy analysis
mcp.analyzeAttentionConflicts(['primary-button', 'error-alert', 'notification'])
// Returns: Attention competition warnings with prioritization suggestions
```

### Accessibility Intelligence (Medium Priority)
```typescript
// Comprehensive accessibility analysis
mcp.getAccessibilityRequirements('form-error')
// Returns: ARIA patterns, color requirements, timing, keyboard navigation

// Motor impairment considerations
mcp.getMotorAccessibilityGuidance('button-grid')
// Returns: Touch target sizing, spacing requirements, interaction patterns

// Cognitive accessibility analysis
mcp.analyzeCognitiveAccessibility(interface)
// Returns: Complexity warnings, plain language suggestions, icon recommendations
```

### Color Harmony & Theory (Medium Priority)
```typescript
// Advanced color relationships
mcp.getColorHarmonies('primary', ['complementary', 'triadic', 'analogous'])
// Returns: Mathematically harmonious colors with OKLCH relationships

// Brand color analysis
mcp.analyzeBrandColorCoherence(['primary', 'secondary', 'accent'])
// Returns: Brand consistency analysis, temperature conflicts, adjustments

// Context-sensitive color recommendations
mcp.recommendColorForContext({
  purpose: 'success-confirmation',
  environment: 'financial-dashboard', 
  trustLevel: 'high'
})
// Returns: Optimal color choice with psychological reasoning
```

### Advanced Component Intelligence (High Priority)
```typescript
// Component composition and relationship analysis
mcp.analyzeComponentCompatibility(['Dialog', 'Form', 'Button-destructive'])
// Returns: Interaction conflicts, cognitive load analysis, UX flow issues

// Component state management intelligence
mcp.getComponentStates('Button')
// Returns: All states (hover, focus, disabled, loading) with token requirements and UX patterns

// Component variant analysis
mcp.analyzeComponentVariants('Button', ['primary', 'destructive', 'ghost'])
// Returns: Use case appropriateness, trust level requirements, cognitive load differences

// Layout and spacing intelligence for components
mcp.getComponentLayoutRequirements('Card')
// Returns: Optimal spacing, hierarchy patterns, content density recommendations

// Component accessibility patterns
mcp.getComponentAccessibilityPattern('Select')
// Returns: Required ARIA, keyboard navigation, screen reader patterns, focus management
```

### Component Interaction Intelligence (High Priority)
```typescript
// Multi-component interaction analysis
mcp.analyzeComponentFlow(['LoginForm', 'ErrorAlert', 'SuccessDialog'])
// Returns: UX flow analysis, trust building patterns, error recovery paths

// Component hierarchy and attention management
mcp.analyzeComponentHierarchy(componentTree)
// Returns: Visual hierarchy issues, attention conflicts, suggested z-index/priority changes

// Trust pattern validation across component interactions
mcp.validateTrustFlow(['Button-destructive', 'ConfirmationDialog', 'SuccessToast'])
// Returns: Trust consistency, friction appropriateness, confirmation pattern validation

// Component performance and cognitive load in context
mcp.analyzeInterfaceComplexity({
  components: ['NavigationMenu', 'SearchBar', 'FilterPanel', 'DataTable'],
  context: 'admin-dashboard'
})
// Returns: Complexity hot spots, simplification recommendations, progressive disclosure suggestions
```

### Component Design Pattern Intelligence (Medium Priority)
```typescript
// Pattern recognition and recommendations
mcp.identifyDesignPatterns(componentList)
// Returns: Detected patterns (master-detail, wizard, dashboard), consistency analysis

// Anti-pattern detection
mcp.detectAntiPatterns(['Button-primary', 'Button-primary', 'Button-secondary'])
// Returns: Multiple primary buttons warning, attention competition issues

// Component composition recommendations
mcp.recommendComponentComposition({
  purpose: 'account-deletion',
  userType: 'expert',
  context: 'settings-page'
})
// Returns: Optimal component sequence with trust building and confirmation patterns

// Responsive component behavior analysis
mcp.analyzeResponsiveComponentBehavior('NavigationMenu')
// Returns: Mobile adaptations, touch target requirements, interaction pattern changes
```

### Component Token Integration Intelligence (Medium Priority)
```typescript
// Component-specific token usage analysis
mcp.analyzeComponentTokenUsage('Card')
// Returns: All tokens used, unused token opportunities, token efficiency analysis

// Component token override patterns
mcp.getComponentTokenOverrides('Button', { context: 'financial-app' })
// Returns: Context-specific token modifications for trust/brand requirements

// Component theme variation analysis
mcp.analyzeComponentThemeCompatibility('Dialog', ['light', 'dark', 'high-contrast'])
// Returns: Theme-specific token requirements, accessibility considerations

// Cross-component token consistency
mcp.validateComponentTokenConsistency(['Button', 'Input', 'Select'])
// Returns: Token usage consistency, visual harmony analysis, unification opportunities
```

### Layout and Grid Intelligence (High Priority)
```typescript
// Container and grid system intelligence
mcp.analyzeLayoutContainer(containerConfig)
// Returns: Optimal container widths, breakpoint behavior, content flow analysis

// Grid system recommendations
mcp.recommendGridLayout({
  content: ['header', 'sidebar', 'main', 'footer'],
  viewport: 'desktop',
  density: 'comfortable'
})
// Returns: CSS Grid template, responsive behavior, spacing recommendations

// Container responsiveness analysis
mcp.analyzeContainerResponsiveness('max-width-container')
// Returns: Breakpoint behavior, content reflow, mobile adaptations

// Grid component placement intelligence
mcp.optimizeGridPlacement(componentList, gridConfig)
// Returns: Optimal component positioning, visual hierarchy, scan patterns

// Layout density and spacing intelligence
mcp.analyzeLayoutDensity({
  components: ['Card', 'Card', 'Card'],
  container: 'grid-3-col',
  context: 'dashboard'
})
// Returns: Spacing recommendations, density optimization, breathing room analysis
```

### Advanced Layout Intelligence (High Priority)
```typescript
// Responsive layout flow analysis
mcp.analyzeResponsiveLayoutFlow(layoutConfig)
// Returns: Mobile reflow patterns, stacking order, touch-friendly adaptations

// Layout accessibility patterns
mcp.getLayoutAccessibilityRequirements('sidebar-main-layout')
// Returns: Focus flow, skip links, landmark roles, screen reader navigation

// Visual hierarchy in layout context
mcp.analyzeLayoutHierarchy({
  layout: 'header-sidebar-main',
  components: componentTree
})
// Returns: Z-index recommendations, visual weight distribution, attention flow

// Layout performance implications
mcp.analyzeLayoutPerformance(gridConfig)
// Returns: CSS Grid vs Flexbox recommendations, rendering optimization, reflow costs

// Content-aware layout optimization
mcp.optimizeLayoutForContent({
  contentTypes: ['text-heavy', 'image-gallery', 'data-table'],
  layout: 'grid-system'
})
// Returns: Grid modifications, spacing adjustments, readability optimization
```

### Container System Intelligence (Medium Priority)
```typescript
// Container sizing and constraints
mcp.analyzeContainerConstraints({
  maxWidth: '1200px',
  padding: 'responsive',
  content: 'mixed-density'
})
// Returns: Optimal constraints, content overflow handling, responsive scaling

// Multi-container coordination
mcp.analyzeContainerHierarchy(['page-container', 'section-container', 'card-container'])
// Returns: Nesting patterns, spacing relationships, visual containment

// Container component integration
mcp.getContainerComponentRequirements('data-visualization')
// Returns: Container specifications for optimal component display

// Breakpoint-specific container behavior
mcp.analyzeContainerBreakpoints(containerConfig)
// Returns: Breakpoint-specific sizing, content adaptation, layout shifts
```

### Grid System Patterns (Medium Priority)
```typescript
// Grid pattern recognition and optimization
mcp.identifyGridPatterns(layoutStructure)
// Returns: Detected patterns (12-column, CSS Grid areas, Flexbox), optimization opportunities

// Grid component fit analysis
mcp.analyzeComponentGridFit(componentList, gridSystem)
// Returns: Component sizing recommendations, grid span optimization, alignment patterns

// Responsive grid adaptation
mcp.getResponsiveGridBehavior('12-column-grid')
// Returns: Mobile stacking patterns, tablet adaptations, desktop optimizations

// Grid spacing and rhythm
mcp.analyzeGridSpacingRhythm(gridConfig)
// Returns: Consistent spacing patterns, mathematical relationships, visual rhythm
```
```typescript
// Component micro-interaction analysis
mcp.getComponentMicroInteractions('Button')
// Returns: Hover, click, loading states with timing, easing, and feedback patterns

// Component error state intelligence
mcp.getComponentErrorPatterns('Form')
// Returns: Error display patterns, recovery flows, user guidance strategies

// Component loading state intelligence
mcp.getComponentLoadingStates('DataTable')
// Returns: Loading patterns, skeleton states, progressive loading strategies

// Component animation and motion intelligence
mcp.getComponentMotionRequirements('Modal')
// Returns: Enter/exit animations, reduced motion alternatives, timing preferences
```

---

## Component Intelligence Gaps in Current Implementation

### What's Missing That AI Agents Desperately Need:

#### 1. **Component Interaction Intelligence**
- Current: Individual component metadata
- **Missing**: How components work together, interaction conflicts, UX flows
- **Impact**: AI creates components that fight each other for attention

#### 2. **State Management Intelligence** 
- Current: Basic component info
- **Missing**: All component states, transitions, token requirements per state
- **Impact**: AI misses hover, focus, disabled, loading states consistently

#### 3. **Trust Pattern Validation**
- Current: Individual trust levels
- **Missing**: Multi-component trust flows, confirmation patterns
- **Impact**: AI can't build proper confirmation flows for destructive actions

#### 4. **Layout and Hierarchy Intelligence**
- Current: Individual component cognitive load
- **Missing**: How components create visual hierarchy together
- **Impact**: AI creates visually flat, hard-to-scan interfaces

#### 5. **Accessibility Pattern Intelligence**
- Current: Basic accessibility metadata
- **Missing**: Complex ARIA patterns, keyboard navigation flows, screen reader paths
- **Impact**: AI creates components that work individually but fail as systems

### Highest Impact Component Additions:

1. **`analyzeComponentCompatibility()`** - Prevents conflicting component combinations
2. **`getComponentStates()`** - Ensures all states are properly designed
3. **`analyzeComponentFlow()`** - Validates UX flows and trust patterns
4. **`analyzeComponentHierarchy()`** - Prevents visual hierarchy disasters
5. **`detectAntiPatterns()`** - Catches common mistakes (multiple primary buttons, etc.)

### Why This Matters:

Right now AI agents can pick good individual components but fail at:
- **Component orchestration** - Making components work together harmoniously
- **State completeness** - Missing interactive states and transitions  
- **Trust building** - Not understanding multi-step confirmation flows
- **Visual hierarchy** - Creating interfaces that are hard to scan/navigate
- **Accessibility flows** - Components work alone but fail as complete user journeys

These additions would transform AI from "component picker" to "interaction designer" - understanding not just what components to use, but how they should work together to create exceptional user experiences.
```typescript
### Component Behavior Intelligence (Low Priority)
```typescript
// Component micro-interaction analysis
mcp.getComponentMicroInteractions('Button')
// Returns: Hover, click, loading states with timing, easing, and feedback patterns

// Component error state intelligence
mcp.getComponentErrorPatterns('Form')
// Returns: Error display patterns, recovery flows, user guidance strategies

// Component loading state intelligence
mcp.getComponentLoadingStates('DataTable')
// Returns: Loading patterns, skeleton states, progressive loading strategies

// Component animation and motion intelligence
mcp.getComponentMotionRequirements('Modal')
// Returns: Enter/exit animations, reduced motion alternatives, timing preferences
```

### Mathematical Token Generation (Low Priority)
```typescript
// Systematic token generation with mathematical relationships
mcp.generateTokenScale({
  base: 'spacing-base',
  method: 'golden-ratio',
  steps: 7
})
// Returns: Complete scale with mathematical relationships preserved

// Typography scale generation
mcp.generateTypographyScale({
  base: '16px',
  ratio: 'major-third',
  steps: 8
})
// Returns: Musical harmony-based typography scale

// Motion timing generation
mcp.generateMotionTokens({
  purpose: 'confirmation-flow',
  cognitiveLoad: 'high'
})
// Returns: Physics-based timing appropriate for trust level
```

---
```

---

## Why These Features Matter for AI Agents

### Current Implementation Strengths:
- ✅ Color intelligence with psychological analysis
- ✅ Cognitive load calculation (15-point system)
- ✅ Token dependency tracking
- ✅ Trust level classification

### Missing Capabilities That Would Transform AI Design:

#### Token Intelligence:
1. **Real-time Impact Analysis** - When changing tokens, AI needs to understand ripple effects
2. **Cross-Category Harmonization** - Colors, spacing, typography should work together mathematically
3. **Context-Aware Recommendations** - Different contexts (financial app vs. social media) need different approaches
4. **Progressive Disclosure Intelligence** - AI should know how to reduce cognitive load through smart hiding/showing
5. **Attention Economy Management** - Multiple competing elements need systematic prioritization
6. **Mathematical Token Generation** - AI should be able to create complete, harmonious token systems

#### Component Intelligence:
1. **Component Interaction Intelligence** - How components work together, interaction conflicts, UX flows
2. **State Management Intelligence** - All component states, transitions, token requirements per state  
3. **Trust Pattern Validation** - Multi-component trust flows, confirmation patterns
4. **Layout and Hierarchy Intelligence** - How components create visual hierarchy together
5. **Accessibility Pattern Intelligence** - Complex ARIA patterns, keyboard navigation flows, screen reader paths
6. **Anti-Pattern Detection** - Common mistakes like multiple primary buttons, attention conflicts

#### Layout Intelligence:
1. **Container and Grid System Intelligence** - Optimal container sizing, responsive behavior, grid optimization
2. **Responsive Layout Flow** - Mobile reflow patterns, stacking order, breakpoint behavior
3. **Layout Accessibility** - Focus flow, landmark roles, screen reader navigation patterns
4. **Visual Hierarchy in Layout** - Z-index management, attention flow, content organization
5. **Performance-Aware Layout** - CSS Grid vs Flexbox optimization, rendering performance
6. **Content-Layout Harmony** - Layout optimization based on content types and density

### Highest Impact Additions:

#### Token Level:
1. **analyzeTokenChange()** - Prevents breaking changes, shows impact
2. **getHarmonizingTokens()** - Ensures visual harmony across token categories  
3. **recommendTokensForComponent()** - Context-aware, purpose-driven token selection
4. **validateDesignSystemConsistency()** - Catches gaps and conflicts automatically

#### Component Level:
1. **analyzeComponentCompatibility()** - Prevents conflicting component combinations
2. **getComponentStates()** - Ensures all states are properly designed
3. **analyzeComponentFlow()** - Validates UX flows and trust patterns
4. **analyzeComponentHierarchy()** - Prevents visual hierarchy disasters
5. **detectAntiPatterns()** - Catches common mistakes automatically

#### Layout Level:
1. **recommendGridLayout()** - Optimal grid configurations for content and context
2. **analyzeLayoutHierarchy()** - Visual hierarchy and attention flow in layouts
3. **analyzeResponsiveLayoutFlow()** - Mobile-first responsive behavior optimization
4. **optimizeGridPlacement()** - Component positioning for optimal scan patterns
5. **analyzeContainerConstraints()** - Container sizing and responsive behavior optimization

These would transform AI agents from "applying existing tokens" to "understanding design systems holistically and making intelligent modifications."

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