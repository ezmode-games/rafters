# Rafters Component Patterns

## Compound Components

Many components use the compound pattern with namespaced exports:

```tsx
// Provider wraps app/section
<Tooltip.Provider>
  {/* Root wraps each instance */}
  <Tooltip>
    {/* Trigger + Content are siblings */}
    <Tooltip.Trigger asChild>
      <Button>Hover me</Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      Help text
    </Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>
```

Components using this pattern:
- Tooltip (Provider, Trigger, Content)
- Dialog (Root, Trigger, Portal, Overlay, Content, Header, Footer, Title, Description, Close)
- Sidebar (Provider, Trigger, Rail, Inset, Header, Footer, Content, Group, Menu, MenuItem, etc.)
- Grid (Root, Item)

## asChild Pattern

Pass styling/behavior to a child element instead of creating a wrapper:

```tsx
// Without asChild - creates a button wrapper
<Tooltip.Trigger>
  Click me
</Tooltip.Trigger>

// With asChild - applies to the Button directly
<Tooltip.Trigger asChild>
  <Button variant="ghost">Click me</Button>
</Tooltip.Trigger>
```

The asChild pattern uses `React.cloneElement` to merge props onto the child.

## Button Variants

Semantic variants map to token classes:
- `default`/`primary` - main actions (bg-primary)
- `secondary` - supporting actions (bg-secondary)
- `destructive` - irreversible actions (bg-destructive)
- `success`, `warning`, `info` - status feedback
- `ghost` - minimal, transparent
- `outline` - bordered, transparent background

Size variants:
- `sm` - tertiary actions
- `default` - secondary interactions
- `lg` - primary CTAs
- `icon` - square icon buttons

## Separator

Simple divider using token colors:

```tsx
// Horizontal (default)
<Separator />

// Vertical (for toolbars)
<Separator orientation="vertical" />
```

Uses `bg-border` token for color.

## Container Props Recap

```tsx
<Container
  as="main"           // Semantic element
  size="6xl"          // Max-width constraint
  padding="4"         // Internal spacing
  background="muted"  // Background preset
  query={true}        // Enable container queries (default)
/>
```

## Typography Selection

Choose by semantic meaning, not visual appearance:
- H1 = page title
- H2 = section heading
- H3 = subsection
- Small = fine print, captions
- Muted = secondary info
- Lead = introductory paragraphs

## Token Classes in Components

All components use semantic token classes:
- `bg-primary`, `text-primary-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`
- `hover:bg-primary-hover`
- `focus-visible:ring-primary-ring`

Never raw colors like `bg-blue-500` or arbitrary values.
