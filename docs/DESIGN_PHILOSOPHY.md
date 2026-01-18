# Rafters Design Philosophy

This document captures the design principles that inform Rafters. It balances three perspectives: the obsessive craft of Jobs/Ive, the generative experimentation of Joshua Davis, and the empirical usability rigor of Jakob Nielsen.

---

## The Three Pillars

### 1. Craft: Jobs, Ive, and Dieter Rams

The foundation. Design is not decoration - it's the fundamental soul of a creation.

**Deep Simplicity**
> "Simplicity isn't just a visual style. It's not just minimalism or the absence of clutter. It involves digging through the depth of the complexity. To be truly simple, you have to go really deep."
> - Jony Ive

This means understanding every token, every spacing decision, every color relationship. Not simple because we removed things, but simple because we understood what was essential.

**Dieter Rams' 10 Principles**

1. Good design is **innovative** - Technology enables new possibilities
2. Good design makes a product **useful** - Functional, psychological, aesthetic
3. Good design is **aesthetic** - Products we use daily affect our wellbeing
4. Good design makes a product **understandable** - Self-explanatory at best
5. Good design is **unobtrusive** - Tools, not decorations
6. Good design is **honest** - No manipulation, no false promises
7. Good design is **long-lasting** - Avoids fashion, never appears antiquated
8. Good design is **thorough down to the last detail** - Nothing arbitrary
9. Good design is **environmentally friendly** - Conserves resources
10. Good design is **as little design as possible** - Less, but better

**Apple's Marketing Philosophy (Mike Markkula)**

- **Empathy**: Intimate connection with how users feel
- **Focus**: Eliminate unimportant opportunities to do important ones well
- **Impute**: People judge by signals. Every detail communicates.

---

### 2. Experimentation: Joshua Davis

The spark. Structured chaos that creates delight.

Joshua Davis pioneered "Dynamic Abstraction" - using code to generate art. His work at [Praystation](https://joshuadavis.com/) and Once Upon a Forest showed that creativity isn't about following rules, it's about exploring possibilities.

**Key Principles**

- **Structured Chaos**: Rules create the boundaries, randomness fills them with life
- **Open Source Spirit**: Share the source, let others build on it
- **Multi-disciplinary**: Designer, programmer, and critic in one process
- **Energy Flow**: "When the chi is right, it is done"

**What This Means for Rafters**

Design systems can feel sterile. Davis's approach reminds us that within constraints, there should be room for delight, surprise, and personality. The system provides the grammar; each implementation speaks with its own voice.

Components should feel alive, not stamped from a factory.

---

### 3. Usability: Jakob Nielsen

The check. Empirical validation that design actually works.

Nielsen's 10 Usability Heuristics (1994, refined 2020) remain the standard because they're based on how humans actually process information.

**The 10 Heuristics**

1. **Visibility of System Status**
   Keep users informed. Feedback within reasonable time.

2. **Match Between System and Real World**
   Speak user language, not system jargon. Natural mapping.

3. **User Control and Freedom**
   Clear emergency exits. Undo/redo. Users make mistakes.

4. **Consistency and Standards**
   Same words, same actions, same meanings. Follow conventions.

5. **Error Prevention**
   Prevent problems before they occur. Constraints and confirmations.

6. **Recognition Rather than Recall**
   Minimize memory load. Make options visible in context.

7. **Flexibility and Efficiency of Use**
   Shortcuts for experts. Customization. Accommodate all skill levels.

8. **Aesthetic and Minimalist Design**
   Every extra element competes with relevant ones. Focus on essentials.

9. **Help Users Recognize, Diagnose, and Recover from Errors**
   Plain language. Precise problem indication. Constructive solutions.

10. **Help and Documentation**
    Task-focused, searchable, contextual. Concrete steps.

---

## The Balance

These three perspectives create tension - and that tension produces good design:

| Perspective | Focus | Risk if Unchecked |
|-------------|-------|-------------------|
| **Craft (Jobs/Ive)** | Perfection in detail | Over-polish, losing the forest for trees |
| **Experimentation (Davis)** | Delight and surprise | Chaos without purpose, novelty over function |
| **Usability (Nielsen)** | User success | Sterile, checkbox-driven, no soul |

Rafters must be:
- **Crafted**: Every token relationship considered, every detail intentional
- **Alive**: Room for personality within the system, delight in the details
- **Usable**: Section 508 compliant, WCAG 2.2 AAA, genuinely helpful

Not "accessible but looks like ass."
Not "beautiful but confusing."
Not "functional but forgettable."

All three, together.

---

## What This Means in Practice

### For Components

- Every component has cognitive load ratings (Nielsen: recognition over recall)
- Every variant has semantic meaning (Rams: honest, understandable)
- Interactions provide immediate feedback (Nielsen: system status)
- Animations serve purpose, not decoration (Rams: unobtrusive)
- There's room for brand expression within the system (Davis: structured chaos)

### For Documentation

- Docs demonstrate the design system itself (Impute: every detail communicates)
- Content is task-focused and scannable (Nielsen: help and documentation)
- Examples show personality within constraints (Davis: energy flow)
- Nothing arbitrary (Rams: thorough to the last detail)

### For the AI Layer

- MCP tools capture the designer's intent, not just the API surface
- Do/Never guidance prevents misuse (Nielsen: error prevention)
- Cognitive load scores help AI make appropriate choices
- The AI learns the philosophy, not just the components

---

## Sources

### Jobs, Ive, and Craft
- [How Steve Jobs' Love of Simplicity Fueled A Design Revolution](https://www.smithsonianmag.com/arts-culture/how-steve-jobs-love-of-simplicity-fueled-a-design-revolution-23868877/)
- [Jonathan Ive: Principles and Philosophy of Powerful Design](https://www.playforthoughts.com/blog/jonathan-ive-power-of-great-design)
- [Dieter Rams: Good Design (Vitsoe)](https://www.vitsoe.com/us/about/good-design)

### Joshua Davis
- [Joshua Davis Studios](https://joshuadavis.com/)
- [Creative Coding: Programming Visuals with Joshua Davis](https://dribbble.com/overtime/2018/10/09/creative-coding-programming-visuals-with-joshua-davis)
- [Profile: Joshua Davis (Creative Bloq)](https://www.creativebloq.com/computer-arts/profile-joshua-davis-5079534)

### Jakob Nielsen
- [10 Usability Heuristics for User Interface Design (NN/g)](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [How I Developed the 10 Usability Heuristics](https://www.uxtigers.com/post/usability-heuristics-history)
