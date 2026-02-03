# Studio UI Rules

## Core Principle
Studio is styled BY its own tokens. When the designer changes a token, Studio's UI updates instantly via HMR. This is the architecture, not a feature.

## Never Do
- Never use arbitrary Tailwind values (-[400px], -[#color])
- Never hardcode colors, spacing, sizes
- Never use raw HTML with manual classes when a Rafters component exists
- Never make design choices - the tokens encode the designer's decisions

## Always Do
- Use @rafters/ui components (Container, Typography, Button, etc.)
- Use classy() from @rafters/ui/primitives/classy for class management
- Use semantic token classes (bg-primary, text-foreground, etc.)
- Query rafters_* MCP tools before writing UI code
- Let Container handle spacing, Typography handle text sizes

## Component Hierarchy
1. Container - sections, layout with designer's padding/size
2. Typography - text with designer's type scale
3. Grid - layouts with designer's gap/columns
4. Button, Badge, etc. - interactions with designer's styles

## The Test
If you're picking a value (text-sm, gap-4, h-12), you're wrong.
The component or token should provide the value. You just use it.
