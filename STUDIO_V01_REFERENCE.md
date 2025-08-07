# Studio v0.1 Reference (Archived)

This document preserves the conceptual patterns and implementation ideas from the deprecated `studio-v01` package so the code can be safely removed without losing design intelligence context.

## Purpose
Early exploratory UI for stepwise creation of a design system (colors → typography → spacing → depth). Provided progressive disclosure, contextual education, and Leonardo-informed color analysis.

## Flow Overview
1. Landing state prompting user to start with color selection.
2. Color picking of a primary color → generation of OKLCH scales & semantic palettes.
3. Sequential sections (color, typography, spacing, depth) each marking completion.
4. Final completion state once all sections marked complete.

## Key Components & Responsibilities
- ProgressiveSidebar: Left vertical navigation with section progress states and click-to-focus handling.
- StudioApp: Orchestrated state machine for currentSection, completion tracking, generated colors, and animations.
- ColorScaleDisplay / PaletteDisplay: Visual rendering of generated OKLCH scales and semantic combinations.
- TypographyDisplay / SpacingDisplay / DepthDisplay: Mock visualizations for future token-driven configuration.
- ErrorBoundary: Basic guard wrapping section UIs.

## State Model (simplified)
```
interface StudioState {
  currentSection: 'color' | 'typography' | 'spacing' | 'depth' | null;
  completed: Set<string>; // section ids
  selectedColor: string | null; // user-chosen base color (hex)
  allColors: Array<{ name: string; color: string; oklch: OKLCH }>; // generated scale entries
  showAnimation: boolean; // toggles detailed color scale view
}
```

## Color Generation Notes
- Invoked harmony utilities to derive five-color harmony and semantic suggestions.
- Generated OKLCH scales per semantic (danger/success/warning/info) then combinations for background/foreground.
- Primary color selection drove recomputation.

## Progressive Interaction Patterns
- Sections only become active post previous completion (linear guided flow).
- Visual emphasis transitions (simple boolean `showAnimation` gating between picker and full scale view).
- Sidebar reflects progress state via section metadata.

## Accessibility Considerations (Needed Improvements)
- Some interactive `div` elements required keyboard and role attributes (partially patched before archival).
- Needed focus management when transitioning sections.

## Design Intelligence Principles Demonstrated
- Empathize: Reduce overwhelm via progressive disclosure.
- Define: Clear sequential model of foundational design system layers.
- Ideate: Experimental presentation of Leonardo-inspired color analytics.
- Prototype: Lightweight React components using Tailwind utilities.
- Test: Manual exploration (no automated coverage yet).

## Reasons for Archival
- Large, mixed-content PR contamination risk.
- Lacked automated test & lint compliance vs current standards.
- Served as conceptual spike; now replaced by cleaner, incremental implementation strategy.

## Migration Forward
Future studio implementations should:
1. Isolate each domain (color, typography, spacing, depth) in modular feature folders.
2. Use explicit state machine (XState or hand-rolled) for progression logic.
3. Provide deterministic color generation with snapshot tests.
4. Enforce a11y: replace clickable divs with buttons or add role + key handlers.
5. Add analytics hooks (time-in-section, abandonment) for UX refinement.
6. Support persistent draft state (localStorage or backend sync) with schema validation (Zod).

## Salvageable Patterns
- ProgressiveSidebar structural pattern.
- Section completion pipeline & gating logic.
- OKLCH scale visualization grid.
- Harmony + semantic enhancement layering.

## Non-Essentials to Drop
- Ad hoc animation toggles (`showAnimation`).
- Inline style experimentation.
- Hard-coded mock tokens (replace with real token ingestion pipeline).

## Deletion Checklist
- [x] Document core concepts (this file)
- [ ] Remove `packages/studio-v01` directory
- [ ] Update any build/lint ignore patterns if necessary
- [ ] Verify no imports reference removed code
- [ ] Run preflight (lint, type, test, build)

After confirming preflight passes, commit deletion with message:
```
chore(studio): remove archived studio-v01 exploratory implementation
```

Retain this file for historical context. It can be removed once replacement reaches parity.
