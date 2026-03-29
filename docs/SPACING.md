# Spacing

Spacing is the reason one interface feels calm and another feels claustrophobic. It's not padding values. It's rhythm.

## Two Numbers Control Everything

`baseSpacingUnit` is 4px. `progressionRatio` is minor-third (1.2). Change either one and every measurement in the system recalculates. The progression is musical -- the same ratio that creates harmonious intervals in a chord creates harmonious spacing in a layout.

We chose minor-third because it produces steps that feel connected without feeling repetitive. The jumps are large enough to create hierarchy, small enough to maintain cohesion. Perfect-fourth (1.333) would spread further. Major-second (1.125) would compress tighter. The ratio is a design decision, not a default.

<!-- VENEER: Interactive slider for baseSpacingUnit and progressionRatio. As you drag, show a layout (card with heading, paragraph, button) reflowing in real time. The user sees what 4px base feels like vs 5px vs 6px. Show the progression curve alongside -- how the ratio shapes the scale. -->

## Container and Grid. That's It.

Developers never write padding or margin. Container sets boundaries. Grid sets arrangement.

Container handles the page: max-width, horizontal padding, vertical rhythm, centering. Grid handles the content: sidebar-main, form, cards, row, stack, split.

<!-- VENEER: Side-by-side. Left: a page with raw padding/margin (messy, inconsistent gaps). Right: the same content in Container + Grid (uniform, rhythmic). No code. Just the visual difference. -->

## The Cascade Is Live

Every spacing token is a `calc()` expression referencing the base:

```
spacing-4 = base * 4
spacing-8 = base * 8
```

Override the base in a theme and every token updates through CSS custom property resolution. No rebuild. No regeneration. The math is live in the browser.

<!-- VENEER: An editable base value input. Below it, a stack of elements at different scale positions. Changing the base visually reflows everything. The user understands cascade by watching it happen. -->

## Why This Matters

Twenty developers making "looks right" spacing decisions produces twenty different values where there should be six. The system has opinions about which values exist. If the value you need isn't in the scale, the answer is usually that you need a different value, not a new token.

<!-- VENEER: Show a "before" layout with 14px, 18px, 22px, 11px scattered spacing values (highlighted in red). Then the "after" with everything snapped to the scale (highlighted in green). The visual noise disappears. -->
