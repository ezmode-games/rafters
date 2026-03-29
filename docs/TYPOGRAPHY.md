# Typography

Text is the interface. If the hierarchy isn't clear in the typography alone, no amount of color or spacing saves it.

## Components, Not Classes

Every text element uses a typography component. `H1` through `H4`, `P`, `Lead`, `Large`, `Small`, `Muted`, `Code`, `Blockquote`. The sizing, weight, tracking, line-height, and color are encoded in the component. The developer picks the semantic role, not the visual treatment.

This is deliberate. `text-sm text-muted-foreground font-medium tracking-wide` is five decisions an AI agent has no business making. `<Muted>` is one decision the designer already made.

<!-- VENEER: Show the full typography scale as a vertical specimen. Each component renders its actual output with the component name beside it. H1 at the top, Small at the bottom. The hierarchy should speak for itself -- no labels needed beyond the component names. -->

## The Scale

Typography uses the same minor-third progression as spacing. The sizes are mathematically related, not hand-picked. This creates visual harmony between text and space -- the same ratio that determines paragraph padding determines the size difference between H2 and H3.

<!-- VENEER: Show the progression curve with type samples at each position. Overlay the spacing scale on the same curve to show the shared ratio. The connection between text size and surrounding space should be visible. -->

## Why Not text-sm

`text-sm` is 14px. At default body size, that's below the threshold where sustained reading becomes strained for users over 40. `text-xs` is 12px -- below WCAG AAA recommendations for body text.

Small text has its place. Timestamps, footnotes, legal copy. But it's a conscious choice with accessibility implications, not a default. The `<Small>` component exists for these cases. `text-xs` in a className does not.

<!-- VENEER: Show a paragraph at text-base, text-sm, and text-xs side by side. Below each, show the WCAG compliance status. The point isn't that small text is forbidden -- it's that the component makes the tradeoff explicit. -->

## Each Component Has Intent

`<H1>` is the page. One per page. If you need two, your page has an architecture problem.

`<Lead>` is the first impression. The sentence under the title that tells you whether to keep reading.

`<P>` is the workhorse. Body text. Most of the words on screen.

`<Muted>` is the quiet context. Timestamps, metadata, secondary information the user can ignore.

`<Small>` is the footnote. Used sparingly, with awareness that some users will struggle with it.

`<Code>` is the literal. Monospaced, boxed, unmistakable.

`<Blockquote>` is the voice. Someone else's words, set apart.

<!-- VENEER: Show a realistic content page (blog post or product page) with each component labeled in the margin. The reader sees typography in context, not in isolation. -->
