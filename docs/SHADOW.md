# Shadow

Shadow tells the user how far something is from the surface beneath it. A card resting on the page has a whisper of shadow. A modal floating above the overlay has a pronounced shadow. The user reads elevation without thinking about it.

## Three Tiers

We don't need twelve shadow variants. We need three that mean something.

**shadow-sm** is resting. Cards, inputs, keyboard indicators. The element is on the page, barely lifted. The shadow says "I'm a distinct thing" without saying "look at me."

**shadow-md** is interactive. Dropdowns, popovers, hover cards. The element appeared in response to an action. The shadow says "I'm temporary and above the page."

**shadow-lg** is commanding. Modals, sheets, command palettes. The element demands attention and blocks the page beneath it. The shadow says "deal with me first."

<!-- VENEER: Three cards at each shadow tier. No labels. The user should be able to tell which is resting, which is interactive, and which is commanding just from the shadow. If they can't, the shadow values are wrong. -->

## Shadow Responds to Interaction

A card at rest has `shadow-sm`. On hover, it lifts to `shadow-md`. The shadow shift is the feedback -- the user sees the card respond to their cursor before they click.

This is why shadow is in the motion system. The transition from `shadow-sm` to `shadow-md` uses `duration-fast` (150ms) with the standard easing curve. The shadow grows smoothly, not instantly.

<!-- VENEER: An interactive card. Hover it and watch the shadow grow. The transition should feel physical -- like picking up a sheet of paper. -->

## Shadow Is Not Decoration

If an element has a shadow, it means something about its elevation. Shadows are not borders, not emphasis, not visual interest. If you want a visual boundary, use a border token. If you want emphasis, use color. Shadow is reserved for depth.

A flat design that uses zero shadows is fine. A design where everything has `shadow-lg` is broken -- if everything is elevated, nothing is.

<!-- VENEER: Two layouts. Left: shadows used correctly (card rests, dropdown floats, modal commands). Right: shadows everywhere (visual noise, no hierarchy). The user sees that restraint communicates. Excess obscures. -->
