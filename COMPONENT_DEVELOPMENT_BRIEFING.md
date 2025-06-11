# Component Development Briefing
## Quick Context for New AI Agent - Component Development Track

*This document gets a new AI agent up to speed instantly on our Design Master approach to component development*

---

## Current Mission

**Build Rafters components that embody world-class design intelligence**

We're not just creating components - we're proving that AI can think like design masters (Jony Ive, Nielsen Norman Group) by applying:
- **Semantic-First Intelligence**: Intent → Meaning → Form → Implementation  
- **Accessibility as Foundation**: WCAG AAA, cognitive load optimization
- **Systems Over Solutions**: Coherent design language, not isolated components

---

## Design Intelligence Principles (Apply to Every Component)

### 1. **Cognitive Load Assessment** 
- Rate every design decision on cognitive load (1-10 scale)
- Minimize unnecessary complexity
- Use familiar patterns when possible

### 2. **Attention Economics**
- Rate attention cost (1-10 scale) 
- Primary actions get high attention, secondary get low
- Visual hierarchy must match information hierarchy

### 3. **Accessibility First**
- WCAG AAA compliance minimum
- Consider motor, visual, cognitive, auditory needs
- Test with real accessibility scenarios

### 4. **Semantic Meaning**
- Every visual choice communicates meaning
- Colors carry emotional weight AND accessibility requirements
- Typography establishes hierarchy AND readability

---

## Current Rafters Component Status

### **Existing Components** (Ready for Intelligence Enhancement)
- `Button.tsx` - Basic variants, needs attention economics optimization
- `Card.tsx` - Layout structure, needs cognitive load assessment  
- `Input.tsx` - Form foundation, needs accessibility intelligence
- `Label.tsx` - Typography component, needs semantic meaning enhancement
- `Layout.tsx` - Spatial system, needs grid intelligence
- `Select.tsx` - Choice component, needs interaction intelligence
- `Slider.tsx` - Range input, needs motor accessibility focus
- `Tabs.tsx` - Navigation pattern, needs cognitive load optimization

### **Storybook Stories** (Intelligence Documentation)
- `ButtonAccessibility.stories.tsx` - Accessibility intelligence examples
- `ButtonProperties.stories.tsx` - Cognitive load variations
- `ButtonSemantic.stories.tsx` - Semantic meaning demonstrations
- `ButtonVariants.stories.tsx` - Attention economics showcase
- `Colors.mdx` - Color theory and psychology documentation
- `Typography.mdx` - Information architecture principles
- `LayoutSystem.mdx` - Spatial intelligence guidelines

---

## Design System Intelligence Database

### **Preserved Gold Nuggets** (From MCP Development)
1. **Design System Research**: 419 lines of curated intelligence from Material-UI, Chakra UI, Ant Design, Shadcn/ui, Radix UI, Primer
2. **Cognitive Load Scoring**: 1-10 scale for every design decision
3. **Attention Cost Analysis**: How much attention each pattern demands
4. **OKLCH Color Intelligence**: Perceptually uniform color systems
5. **Accessibility Patterns**: Proven WAI-ARIA implementations

### **Example Intelligence Applications**
```typescript
// Material-UI Button Intelligence
{
  cognitiveLoadScore: 3, // Low - familiar patterns
  attentionCost: 7, // High - designed to command attention
  semanticMeaning: 'Primary blue conveys trust and action',
  accessibilityNotes: ['WCAG AA contrast', 'Focus indicators visible']
}

// Chakra UI Spacing Intelligence  
{
  cognitiveLoadScore: 4, // Medium - requires learning scale
  attentionCost: 2, // Low - invisible but effective
  semanticMeaning: 'Mathematical spacing creates visual harmony',
  designPrinciples: ['Mathematical Harmony', 'Consistent Rhythm']
}
```

---

## Component Development Methodology

### **For Each New Component:**

1. **Intent Analysis**: What human need does this serve?
2. **Semantic Definition**: What meaning does this communicate?
3. **Cognitive Load Assessment**: Rate complexity and learning curve
4. **Attention Economics**: How much attention should this command?
5. **Accessibility Intelligence**: What barriers might this create?
6. **Implementation**: Code that embodies the intelligence

### **Quality Gates:**
- ✅ WCAG AAA compliance validated
- ✅ Cognitive load scored and optimized  
- ✅ Attention cost appropriate for function
- ✅ Semantic meaning clearly communicated
- ✅ Storybook story documents design reasoning

---

## Immediate Action Items

### **Priority Components to Build/Enhance:**

1. **LoginForm Component** (High Value)
   - **Intent**: Secure data collection requiring trust
   - **Semantic Focus**: Trust, security, clarity
   - **Intelligence**: Apply trust-building color psychology, reduce cognitive load, optimize for accessibility
   - **Success Metric**: Users feel confident entering sensitive data

2. **DashboardCard Component** (Medium Value)
   - **Intent**: Information display without overwhelming
   - **Semantic Focus**: Information hierarchy, scanability
   - **Intelligence**: Optimize cognitive load, apply gestalt principles
   - **Success Metric**: Users can quickly scan and understand data

3. **NavigationMenu Component** (Medium Value)
   - **Intent**: Wayfinding and mental model building
   - **Semantic Focus**: Clear paths, consistent patterns
   - **Intelligence**: Minimize cognitive overhead, ensure accessibility
   - **Success Metric**: Users never get lost or confused

### **Enhancement Targets for Existing Components:**

1. **Button.tsx Enhancement**
   - Add trust-building variants for sensitive actions
   - Implement attention economics in sizing/colors
   - Document cognitive load for each variant

2. **Input.tsx Enhancement**  
   - Add validation intelligence (prevent vs recover)
   - Implement cognitive load reduction patterns
   - Enhance accessibility beyond WCAG minimums

---

## Design Intelligence Quick Reference

### **Color Psychology Applications**
- **Blue**: Trust, security, action (primary buttons, secure forms)
- **Red**: Danger, attention, stop (destructive actions, errors)
- **Green**: Success, go, nature (confirmations, completed states)
- **Gray**: Neutral, secondary (optional actions, disabled states)

### **Cognitive Load Optimization**
- **Chunking**: Group related elements (7±2 rule)
- **Progressive Disclosure**: Show only what's needed now
- **Familiar Patterns**: Use established conventions
- **Clear Feedback**: Every action gets clear response

### **Attention Economics**
- **Primary Actions**: High contrast, larger size, prominent placement
- **Secondary Actions**: Lower contrast, smaller, less prominent
- **Tertiary Actions**: Minimal visual weight, text-only often
- **Destructive Actions**: Clear but not accidentally clickable

### **Accessibility Intelligence**
- **Motor**: 44px minimum touch targets, generous spacing
- **Visual**: 4.5:1 contrast minimum, scalable text
- **Cognitive**: Simple language, clear instructions, forgiving errors
- **Auditory**: Text alternatives, visual indicators

---

## Success Metrics for Components

### **Design Quality Metrics**
- WCAG AAA compliance rate: >95%
- User satisfaction scores: >4.5/5  
- Task completion rates: >90%
- Cognitive load scores: <5 average

### **Intelligence Application Metrics**
- Design decisions can be explained with reasoning
- Components reduce rather than increase cognitive overhead
- Accessibility improves usability for everyone
- Visual hierarchy matches functional hierarchy

---

## Context from Parallel MCP Development

### **MCP Server Architecture** (Being Built in Parallel)
The MCP server is building the intelligence engine that will eventually:
- Parse natural language design requests
- Apply design intelligence automatically
- Validate components against design principles
- Suggest improvements based on cognitive science

### **Commercial Vision**
- **Phase 1**: Prove design intelligence works locally with Rafters
- **Phase 2**: Commercial API with Cloudflare Workers + Hono
- **Phase 3**: AGI-resistant human context API

### **Key Insight**: 
We're building **human context systems** that remain valuable even as AI becomes more capable. The intelligence we embed in components today becomes the foundation for the design intelligence platform tomorrow.

---

## Getting Started Immediately

### **First 30 Minutes**:
1. Review existing Button stories to understand intelligence documentation style
2. Pick one component to enhance with design intelligence
3. Apply cognitive load assessment and attention economics
4. Create Storybook story that explains the design reasoning

### **Design Intelligence Questions to Ask**:
- What human psychological need does this component serve?
- How can we reduce cognitive load while maintaining functionality?
- What accessibility barriers might this create, and how do we prevent them?
- Does the visual hierarchy match the functional hierarchy?
- Can users predict what will happen when they interact with this?

### **Quality Validation**:
- Can you explain WHY each design decision was made?
- Does this component make the interface more intuitive or more complex?
- Would this work for users with different abilities and contexts?
- Does this embody the principles of a world-class design master?

---

**Remember**: We're not just building components. We're proving that AI can think like design masters and embedding that intelligence into every pixel and interaction.

**The Goal**: Every component should feel like it was designed by Jony Ive's attention to human psychology and Nielsen Norman Group's usability expertise.
