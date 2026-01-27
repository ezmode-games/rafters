# Studio Vision

This document captures the design vision for Rafters Studio. It is not a technical spec - it's the soul of what we're building.

---

## The Problem with Every Other Tool

Figma, Leonardo, Style Dictionary, every token editor: they're all giant sheets of knobs and sliders. They expose everything. Label everything. Assume the designer wants to control everything.

They capture **what** you chose. None of them capture **why**.

---

## What Studio Is

Studio is a visual decision recorder for the Design Intelligence System.

The designer sees colors, blocks, type samples. They pick. They say why. The system handles everything else - token names, generation rules, dependencies, exports.

No labels. No token names. No technical details. Visual + reasoning. That's it.

---

## First Run: The Snowstorm

A white page. Rafters logo top left. Ghost "save" button top right.

Snowflakes falling. The dreaded blank page made literal - the anxiety of starting is acknowledged, not hidden.

A box appears, mid-screen, about 1/4 the viewport. It bounces slowly, quietly, like in a snowstorm. Inside: "choose primary color..."

The user clicks. The box stops. A full-spectrum color picker opens (like react-colorful).

They pick a color. The spectrum mutes. A textarea appears: "why this color?"

The placeholder text cycles - between general prompts and the actual intelligence the system knows about that color. The AI-generated insights become suggestions, prompts, showing the designer what the machine sees.

They write their reasoning. If they don't, the system stops them. Explains itself. "Rafters is not a token editor. It's a Design Intelligence System. Your reasoning is the product."

They commit. The box fades. The snowstorm fades. Forever.

The color paints itself across the canvas. The scale generates. The entire design system emerges from that one decision + math + defaults.

---

## After Primary: The System Exists

The snowstorm never returns. You've broken through the blank page.

The workspace is now alive with a complete, working design system:
- Typography: IBM Plex (default)
- Spacing: Perfect fourths (default)
- Radius, depth, motion: All defaults

It's already beautiful. The designer isn't building from scratch - they're refining a working system.

---

## Semantics Flow

Semantic color assignments appear. Each one shows three computed choices based on the primary color + mathematical relationships:
- destructive
- success
- warning
- info
- secondary
- muted
- accent
- background
- foreground

For each semantic: pick one of the three suggestions OR add a custom color.

Then: "why this color for [semantic]?"

The choice box fades. Replaced by the chosen color, its generated scale, and "done."

When all semantics are decided, the color namespace is complete. Every choice documented with reasoning.

---

## The Sidebar: Six Circles

Six circles appear along the left edge:
- Color
- Spacing
- Typography
- Radius
- Depth
- Motion

Each is 44px, grows to 64px on hover. Icons representing each namespace.

They're connected to each other only by negative space. No background, no divider, no chrome. Separated from the workspace by negative space too.

**When the workspace has focus**: the circles retreat to -33% left margin. Half-visible. The designer is working - the UI gets out of the way.

---

## Namespace UIs

Click a circle. The entire workspace redraws to that namespace's UI.

**Top section (dismissible):**
- Educational content explaining the mathematical system
- What choices exist (ratios, scales, progressions)
- The current selection visualized
- Real examples showing how it applies (input groups, grids, type samples)

Once they understand, they dismiss it. It's gone.

**After dismiss:**
- Just the visual output (blocks, samples, previews)
- Just the control that affects it
- No labels. No token names. No numbers cluttering the view.

Change the control → visual animates to new values.

Deviate from default → "why?"

---

## The "Why" Gate

Any deviation from defaults requires reasoning. This is the core mechanic.

The defaults are mathematically derived and already beautiful. If a designer changes something, they have a reason. That reason is the product - the intelligence that makes Rafters different from every other design system.

The gate isn't punishment. It's recognition that designer reasoning is valuable and worth capturing.

---

## What Designers Never See

- Token names (`spacing-md`, `color-primary-500`)
- JSON
- Config files
- Technical details
- Forms with "name" and "value" fields

Those are for machines. The designer experience is purely visual.

---

## Power Features: Right-Click

Power users need more control. That control comes via **right-click context menus**.

Right-click shows the **right controls for that specific thing** - not every possible knob, just what matters.

### Color Swatch

Three sliders: L, C, H (may rename to common terms if people struggle).

- Target block updates live as sliders move
- Value box shows current values

**Neighbor warning:** When they drag outside the harmonic neighborhood of the original color, warn them: "This will regenerate harmonies across the system."

**Cascade behavior:** Change blue to green:
- Scale regenerates
- Harmonies regenerate
- Semantics that weren't overridden update
- Only values with a recorded "why" stay fixed

The dependency graph in action. Human decisions preserved. Computed values recompute.

### Other Items (to be designed)

Each context gets its own thoughtful palette:
- Spacing block: ratio adjustment, base unit
- Semantic: reference selector, override option
- Typography: font picker, scale ratio
- Etc.

Not "all the knobs" - "the knobs that matter for this thing."

**The default experience:** visual, one control, why.
**Right-click:** scoped power, thoughtfully designed per context.

---

## The Philosophy

This interface embodies Dieter Rams: "Good design is as little design as possible."

Not a token editor wearing a pretty dress. A fundamentally different approach:
- Defaults are beautiful
- Math handles relationships
- The designer only speaks when they have something to say
- When they speak, we capture why, not just what

One decision at a time. Visual feedback. Reasoning captured. System generated.

That's Studio.
