# Studio Vision

Read `docs/STUDIO_VISION.md` for the full narrative. This is a quick reference.

## Core Concept

Studio is a visual decision recorder, not a token editor. Designers see colors/blocks/samples, pick, say why. System handles naming/rules/exports.

## First Run Flow

1. White page, snowstorm (blank page anxiety literal)
2. Bouncing box: "choose primary color..."
3. Click → color picker → pick → "why this color?" (placeholder cycles with color intelligence)
4. If no why → system explains DIS philosophy, gates progress
5. Commit → snowstorm fades forever → system paints from defaults

## After Primary

- System exists: IBM Plex, 4ths spacing, default radius/depth/motion
- Semantics appear with 3 computed choices each
- Pick or custom → why → fades to "done" with scale

## Sidebar

- 6 circles: Color, Spacing, Typography, Radius, Depth, Motion
- 44px default, 64px hover
- Icons only, connected by negative space
- No chrome, no background, no divider
- Retreat to -33% left margin when workspace has focus

## Namespace UIs

- Click circle → full workspace redraw
- Top: educational (dismissible) - explains math, shows choices, real examples
- After dismiss: just visual output + control
- No labels, no token names, no numbers
- Change from default → "why" gate

## Key Principles

- No giant sheet of knobs and sliders
- Defaults are beautiful (math-derived)
- Designer only speaks when they have something to say
- Every deviation captured with reasoning
- Technical details invisible (for machines)

## Power Features: Right-Click

Not "all the knobs" - "the right knobs for this thing."

### Color swatch right-click:
- L, C, H sliders (names may change based on user feedback)
- Target block updates live
- Value box shows current values
- Neighbor warning when leaving harmonic relationships
- Cascade: non-overridden values regenerate, "why" values preserved

### Other contexts (to design):
- Spacing: ratio, base unit
- Semantic: reference selector, override
- Typography: font picker, scale ratio

Default: visual + control + why
Right-click: scoped power, thoughtfully designed per context

## Files

- `docs/STUDIO_VISION.md` - Full narrative
- `docs/STUDIO_ARCHITECTURE.md` - Technical implementation (needs updating)

## Self-Consumption (Dogfooding)
Studio uses Tailwind token classes for ALL styling. When the designer changes a token,
the entire Studio UI reflects the change instantly via CSS HMR. This is not a feature -
it's the architecture. The tokens ARE Tailwind. See `rafters-self-consumption` memory.