# Rafters Design Philosophy & MCP Vision

*Documented from conversation on June 8, 2025*

## Core Vision

Rafters is exploring how to capture and share design taste - that ineffable "you know it when you see it" quality that makes something feel right. We're not trying to systematize taste itself (that would kill it), but rather to build tools that help preserve the **moments where taste gets expressed** and make that wisdom accessible to others.

The goal isn't "design decisions as data" but rather "design taste as conversation" - where the system can help you understand not just what to do, but how to develop your own sense of what feels right.

## The Problem

Traditional design systems provide "what" (components, tokens, patterns) but struggle with "why" (rationale, context, the gut feeling). This creates several issues:

- **Taste silos**: The "feel" for what's right stays locked in individual designers
- **Mechanical application**: Teams follow rules without developing design intuition
- **Lost wisdom**: The reasoning behind aesthetic choices gets forgotten
- **Taste development**: No way to help people develop their own design sense

But the bigger problem is that most design systems try to replace taste with rules, when what we really need is to help people develop their own taste.

## The Vision: Design Taste Mentor

We're building toward an MCP system that acts less like an oracle and more like a mentor - someone who can help you see what they're seeing, understand why something feels off, and develop your own aesthetic judgment.

### What Taste Actually Is
- **Intuitive assessment**: The immediate gut reaction to whether something feels right
- **Cultural fluency**: Understanding what resonates with people in context  
- **Aesthetic judgment**: Knowing when something is beautiful, awkward, or just... wrong
- **Pattern recognition**: Seeing the subtle relationships that make designs feel coherent

### Research Foundation (The Learnable Stuff)
- **Nielsen Norman Group**: Usability heuristics and evidence-based patterns
- **Stanford d.school**: Design thinking methodology
- **IDEO**: Human-centered design principles
- **Costco**: Large-scale operational design and user experience optimization
- **Microsoft**: Enterprise design systems and accessibility at scale
- **frog**: Strategic design and brand experience
- **IBM/Google/Apple**: Systematic approaches to consistency
- **W3C/Accessibility research**: Inclusive design patterns

*This research provides the foundation, but taste is what makes it sing.*

### Contextual Guidance
The system understands **who is asking** and meets them where they are:

- **Beginner**: "Try this pattern - here's why it usually works"
- **Developing**: "Notice how this creates visual weight? What does that communicate?"  
- **Experienced**: "This breaks consistency in an interesting way - does the break serve the content?"

The goal is to help people see what you're seeing, not to replace their judgment.

### Capturing Taste Moments
Each design decision becomes a **taste artifact** containing:
- The immediate context ("this felt too heavy")
- Alternative explorations ("we tried X but it felt wrong because...")
- The aesthetic reasoning ("this creates the right kind of tension")
- Usage boundaries ("works for primary actions, feels weird for navigation")

Not systematic rules, but preserved moments of aesthetic judgment that others can learn from.

## Key Taste Moments

### Buttons ≠ Links
**The feeling**: Link-styled buttons felt "off" - like they were pretending to be something they weren't
**The insight**: Buttons are for actions, links are for navigation. Users have different mental models and expectations for each.
**The taste**: Clarity of purpose feels better than versatility for its own sake

### Grayscale-First Semantic Tokens  
**The feeling**: Colorful state indicators felt too "busy" and broke the calm aesthetic
**The insight**: Success/warning/error can be communicated through grayscale values while maintaining visual coherence
**The taste**: Restraint often communicates more clearly than emphasis

## Technical Foundation

### Semantic Token System
- Components never reference base tokens directly
- All styling goes through semantic tokens
- Enables systematic theming and design evolution
- Foundation for encoding design decisions as data

### TokenManager Architecture
- Dynamic application of design tokens as CSS custom properties
- Enables real-time design system updates
- Foundation for MCP-driven design decisions

### Component Patterns
- Radix primitives for accessibility and consistency
- Slot-based composition for flexibility
- Semantic token integration for systematic styling

## MCP Integration Strategy

### Onboarding Through Questions
**Key question**: "What's your design experience?"
But also: "What does good design feel like to you?" This helps the system understand how someone sees and thinks about aesthetics.

### Taste Archaeology
Rather than "containerizing decisions," we preserve the artifacts of taste:
- Sketches and iterations that felt wrong
- Moments where something clicked
- The language people use to describe aesthetic feelings
- Cultural references and inspirations

### Conversational Interface
The MCP enables conversations like:
- "This layout feels cramped - what's creating that feeling?"
- "Show me examples where breaking this rule actually works"
- "What makes this feel more trustworthy than that?"
- "How would someone with more developed taste approach this?"

## Future Directions

### Taste Development Tools
- Help people notice what they're responding to aesthetically
- Provide language for describing design feelings
- Show how taste evolves with experience and cultural context

### Wisdom Preservation
- Capture the aesthetic reasoning behind design decisions
- Document what doesn't work and why it feels wrong
- Create learning pathways that develop design intuition

### Cultural Context
- Understand how aesthetic preferences vary across contexts
- Help teams develop their own coherent aesthetic voice
- Balance individual taste with collective design goals

## Implementation Status

**Phase 1 - Foundation** ✅
- Semantic token system that enables aesthetic evolution
- Component patterns that feel right (not just work correctly)
- Basic taste moment documentation

**Phase 2 - MCP Integration** 🔄
- Conversational interface for taste development
- Aesthetic preference assessment
- Taste artifact preservation system

**Phase 3 - Taste Mentorship** 📋
- Guidance that develops aesthetic judgment
- Cultural context integration
- Wisdom-sharing across teams and projects

---

*The goal isn't to replace taste with systems, but to build systems that help taste flourish.*
