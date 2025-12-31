---
title: "The Day I Decided to Divorce Radix UI"
date: 2025-10-01
status: "completed"
impact: "major"
category: "architecture"
tags: ["web-components", "radix-ui", "primitives", "lit", "headless"]
authors: ["seansilvius"]
---

## The Problem That Wouldn't Go Away

I've been building Rafters as the design system for AI agents. Great idea, solid execution, but I kept hitting the same wall: React lock-in.

Every time someone asked "Can I use this with Vue?" or "What about Svelte support?" I had to give them the same disappointing answer: "Sorry, we're React-only because of Radix UI."

That's not the future I want to build. If AI agents are going to generate interfaces everywhere, they need components that work everywhere. Not just in React land.

The breaking point came three weeks ago when I was talking to a team building AI-generated interfaces for their Vue 3 app. They loved Rafters' design intelligence concept: the cognitive load ratings, the attention economics patterns, the embedded accessibility guidance. But they couldn't use any of it because we were married to Radix.

I realized I was building a design system for the future while being anchored to the limitations of today.

## Why Radix UI Had to Go

Don't get me wrong. Radix UI is excellent. The accessibility patterns are rock solid, the API design is thoughtful, and the community is fantastic. But it's React-only, and that became our ceiling.

Here's what I needed for Rafters to work:

1. **Framework agnostic**: Run in React, Vue, Svelte, vanilla JS, whatever AI agents generate
2. **Registry distribution**: Source code copying via CLI (no npm hell for AI workflows)
3. **AI-friendly intelligence**: Embedded guidance that helps agents make layout decisions
4. **WCAG AAA compliance**: Higher accessibility bar than most existing primitives
5. **Zero runtime dependencies**: Components that just work without framework gymnastics

Radix couldn't deliver #1, and without that, the whole vision falls apart.

## The Web Components Realization

Web Components have been "the future" for so long that everyone stopped believing in them. But here's the thing: they finally work everywhere. Safari fixed the last major bugs, browser support hit 96%, and the tooling got good.

More importantly, they're perfect for AI-generated interfaces. An AI agent doesn't care about your framework choice. It just needs components that work when it drops them into any codebase.

The decision became obvious: Build `@rafters/primitives` using Lit-based Web Components with a **100% headless architecture**.

## The Architecture That Actually Works

I learned something from building authentication systems: the simpler the foundation, the more complex you can make the layers above it. So I designed a three-layer system:

**Layer 1: The Primitives (`@rafters/primitives`)**

These are headless Web Components that handle the hard stuff. State management, ARIA patterns, keyboard navigation, event handling. Think `<r-container>`, `<r-grid>`, `<r-button>`, `<r-dialog>`.

Built with Lit because it's 5KB and 70% faster than vanilla Web Components. Distributed registry-only via CLI because AI agents need source code, not package management.

The key insight: **ZERO visual attributes**. Completely headless. If you don't provide CSS, they look broken. And that's by design.

**Layer 2: Registry Components**

This is where the full Rafters design intelligence lives. When users run `npx rafters add button`, they get complete React/Vue/Svelte components with:

- Full cognitive load styling applied (0-10 scale affects visual weight, spacing, typography)
- Attention economics built-in (primary buttons command focus, secondary recede)
- Trust building patterns (destructive actions get confirmation friction)
- WCAG AAA accessibility compliance automatically applied
- Mathematical design foundations (OKLCH colors, golden ratio spacing, musical typography scales)

Users get **complete design intelligence as source code**. No styling required.

**Layer 3: Future Framework Wrappers**

Vue, Svelte, Angular. Whatever comes next. Same complete design intelligence, different framework patterns.

## The Registry Distribution Model

Here's the key insight: users never import packages. They get **intelligently designed source code** via the CLI:

```bash
npx rafters add button
# Copies fully-designed Button component to src/components/ui/
# Includes all cognitive load styling, trust patterns, accessibility
# Ready to use immediately with embedded Rafters intelligence applied
```

The primitives (`<r-button>`) are pure behavior - state management, ARIA patterns, keyboard navigation. **Zero styling**.

The registry components are **complete design intelligence** that wraps those primitives. Users get finished, intelligent components, not raw materials to style themselves.

## The Animation Intelligence Decision

The hardest part was motion and animation. Every instinct told me to handle this in JavaScript. It's cleaner, more predictable, easier to coordinate.

But I realized: **Rafters needs to encode animation intelligence too.**

Here's how it works: Primitives emit events (`opening`, `closing`) for coordination, but **registry components include intelligent animation patterns** based on cognitive load and trust levels:

- High cognitive load components get gentler, slower animations
- Trust-building patterns include deliberate friction animations  
- Attention economics affects animation prominence and timing
- `prefers-reduced-motion` compliance is built into the intelligence

**Example: Dialog Intelligence**

The primitive handles pure behavior:

```typescript
// r-dialog.ts (primitive) - pure behavior, zero styling
export class RDialog extends RPrimitiveBase {
  @property({ type: Boolean }) open = false

  render() {
    return html`
      <div part="backdrop" ?hidden=${!this.open}>
        <div part="panel" role="dialog">
          <slot></slot>
        </div>
      </div>
    `
  }
}
```

The registry Dialog component includes **full design intelligence**:

```tsx
// Dialog.tsx (registry component) - complete Rafters intelligence applied
/**
 * @cognitiveLoad 6/10 - Interrupts user flow deliberately  
 * @attentionEconomics Commands maximum attention, blocks other interactions
 * @trustBuilding Critical actions require confirmation patterns
 */
export function Dialog({ children, variant = "default", ...props }) {
  return (
    <r-dialog 
      {...props}
      className={cn(
        // Rafters design intelligence applied automatically
        "rafters-dialog",
        `rafters-cognitive-6`, // Cognitive load affects backdrop opacity, timing
        `rafters-trust-${trustLevel}`, // Trust level affects confirmation patterns
        `rafters-attention-maximum`, // Animation prominence for interruption
        // Mathematical spacing, WCAG AAA contrast, golden ratio proportions
        "backdrop-blur-sm bg-black/50",
        "animate-in fade-in-0 duration-300",
        "[&[data-state=closed]]:animate-out [&[data-state=closed]]:fade-out-0"
      )}
    >
      {children}
    </r-dialog>
  )
}
```

Users run `npx rafters add dialog` and get the **complete intelligence applied**. No styling decisions required.

## The AI Agent Problem

Here's where I had to break my own rules. AI agents are terrible at layout decisions. They'll create reading content at full viewport width, or squeeze navigation into impossibly narrow containers.

So Container and Grid primitives include **semantic intelligence attributes**:

```typescript
// r-container.ts, Intelligence for AI decision-making
@property() size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
@property() as?: 'div' | 'main' | 'section' | 'article'
@property() padding?: '0' | '1' | '2' | '4' | '6' | '8' | '12' | '16'
@property() zIndex?: 'auto' | 'base' | 'raised' | 'overlay' | 'modal'

// Semantic defaults based on HTML element
private _getSemanticDefaults() {
  if (this.as === 'article') return { size: '4xl', padding: '6' } // Reading width
  if (this.as === 'main') return { size: 'full', padding: '8' }   // Full width
  // ...
}
```

These aren't visual styles. They're semantic guidance. The attributes map to user-provided CSS that implements the actual visual properties. But they give AI agents the scaffolding they need to make reasonable layout decisions.

This felt like cheating until I realized: the alternative is AI agents building interfaces that don't work for humans.

## What I'm Gaining (And Losing)

**The Wins:**
- Framework agnostic, works everywhere AI agents generate code
- Registry distribution, users get complete design intelligence as source code
- No user styling required, full Rafters intelligence applied automatically
- AI-friendly, embedded cognitive load and trust patterns guide agent decisions
- WCAG AAA compliance built into every component automatically
- No package management hell, source code with Git-tracked design decisions

**The Costs:**
- More implementation complexity, need to maintain both primitives and intelligent wrappers
- Learning curve, Web Components are less familiar than pure React components
- Registry distribution requires CLI workflow instead of simple npm install
- Framework-specific intelligence must be maintained separately

**The Risks I'm Mitigating:**
- Framework lock-in: ELIMINATED by universal Web Components primitives
- AI agent confusion: MITIGATED by embedded design intelligence in registry components
- Adoption friction: MITIGATED by CLI that delivers complete, working components with intelligence applied

## The Alternatives I Rejected

**Continue with Radix UI**

Radix is genuinely excellent. But it's React-only, and that became an insurmountable limitation. I needed framework agnostic, and there's no path from Radix to that goal.

**Styled Web Components**

This was tempting. Ship components with visual defaults and let users override. But visual defaults defeat the headless architecture. You end up with inline styles becoming a debugging nightmare, and animation/motion logic spread across JS and CSS creates boundary confusion.

**Multiple Framework-Specific Primitives**

Build separate primitive libraries for React, Vue, Svelte, Angular. The maintenance burden would be crushing, and behavior drift between implementations is inevitable. Web Components provide a single source of truth that works everywhere.

## How This Actually Gets Built

I'm not going to pretend this is easy. Here's the implementation sequence:

1. **Setup `@rafters/primitives` package**: Registry distribution only, no npm publishing
2. **Setup `@rafters/react` wrapper package**: React-friendly APIs with design intelligence
3. **Build layout primitives**: `<r-container>` and `<r-grid>` with AI-friendly semantic attributes
4. **Build interaction primitives**: `<r-button>` and `<r-dialog>` with ARIA patterns
5. **Build form primitives**: Input, select, checkbox, radio, switch with accessibility built-in
6. **Build UI primitives**: Tabs, tooltip, progress, badge for interface completion

Each primitive has to be bulletproof on accessibility, completely headless on styling, and intelligent enough for AI agents to use correctly.

The hardest part isn't the coding. It's resisting the urge to add "just a little bit of styling" to make demos look better.

## The Decision Point

This decision changes everything about how Rafters works. We're moving from React-with-escape-hatches to truly framework-agnostic. From styled-with-overrides to completely headless. From package-management to registry distribution.

It's a bigger architectural shift than switching databases or rewriting the API. But it's the only path to the vision: design systems that work everywhere AI agents generate interfaces.

I'm betting that truly headless, truly framework-agnostic primitives are worth the implementation complexity and user setup burden. Time will tell if I'm right.

## References

- [Lit documentation](https://lit.dev/docs/): The Web Components library that doesn't suck
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/): Accessibility standards we're targeting
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/): Interaction patterns Bible
- [Existing Container intelligence](../../packages/ui/src/components/Container.tsx): What we're migrating from
- [Registry infrastructure](../../apps/cli/src/registry/componentService.ts): How distribution actually works

