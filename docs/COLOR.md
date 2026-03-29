# Color

Your AI doesn't know what blue means to your brand. It picks hex values that look plausible and moves on. Rafters doesn't guess. Every color is a decision with a reason attached.

## OKLCH, Not HSL

We build in OKLCH because it matches human vision. Two colors at the same lightness actually look the same brightness. In HSL they don't -- a blue at 50% lightness looks darker than a yellow at 50% lightness. This isn't a preference. It's physics.

This matters because we generate entire color families from a single input. One OKLCH value produces an 11-position scale, five harmony sets, accessibility metadata, and perceptual analysis. If the color space lies, everything downstream is wrong.

<!-- VENEER: Show a split comparison. Left: HSL scale with visible brightness jumps. Right: OKLCH scale with uniform perceptual steps. Same hue, same input. The difference should be obvious. -->

## One Color In, Complete Family Out

Give the system an OKLCH value. Get back:

**An 11-step scale** from near-white (50) through base (500) to near-black (950). Each step has uniform perceptual distance. The scale doesn't bunch up in the darks or flatten in the lights.

**Five harmony sets.** Complementary, triadic, analogous, tetradic, monochromatic. Computed from the hue angle, not picked from a palette.

**Pre-computed accessibility.** WCAG AAA and APCA contrast ratios against white and black, in both directions. The system knows which positions pair safely before any component uses them.

**Perceptual analysis.** Temperature, atmospheric weight, how visually heavy the color feels. The kind of information a senior designer carries in their head, encoded as data.

<!-- VENEER: Show a single color input (editable OKLCH picker) that generates the full family in real time. The scale, the harmonies, the accessibility pairs -- all visible, all updating as the user moves the picker. This is the hero of the color page. -->

## The 11 Families

Every project starts with 11 semantic families. These are roles, not colors.

**primary** is the brand. It's on the nav, the CTAs, the elements that say "this is us."

**secondary** supports the primary. It's the quieter actions, the less prominent UI.

**destructive** is irreversible. Deletions, errors, the things that can't be undone.

**success**, **warning**, **info** are status. They tell the user what happened without requiring them to read.

**neutral** is the structure. Backgrounds, borders, text. The chrome that holds everything else.

**accent**, **highlight**, **muted**, **tertiary** fill the gaps between the primary roles.

These families are the foundation, not the ceiling. A game adds faction colors. A bank adds tier colors. A retailer adds seasonal colors. Custom families get the same treatment: full scales, accessibility, dark mode, dependency graph.

<!-- VENEER: Show all 11 families as horizontal scale strips. Each strip is the full 50-950 range. Hovering a position shows its contrast ratio against adjacent positions. Clicking a family expands it to show harmonies and accessibility pairs. -->

## Dark Mode Is Math

Dark mode inverts the lightness scale. Position 50 becomes 950. Position 100 becomes 900. The hue stays. The chroma stays. The identity stays.

This means dark mode is not a second design. It's a transformation of the first one. Change your primary color and both modes update.

<!-- VENEER: Toggle between light and dark on the family strips. Show the scale positions swapping. The hue and chroma bands stay constant -- only lightness inverts. -->

## The Dependency Graph

Change primary and 20+ tokens cascade. Primary-foreground, primary-hover, primary-active, primary-ring, sidebar-primary, chart-primary -- they all reference the primary family at computed positions.

The semantic tokens don't store colors. They store references: "primary at position 500" not "oklch(0.5 0.15 240)." Swap your entire primary palette and every component updates without touching a single component file.

<!-- VENEER: Interactive dependency graph. Click a family node, see all tokens that cascade from it. Animate the cascade when the base color changes. -->

## The Why-Gate

Override a color and the system asks why. Not to be bureaucratic -- to build institutional memory. Six months from now, someone asks "why is destructive different from the default?" The answer is in the token, not in someone's head who quit in April.

<!-- VENEER: Show an override interaction. Before/after values, the reason field, the timestamp. Make it feel like a design decision, not a form. -->
