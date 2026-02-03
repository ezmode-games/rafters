# Rafters Overlay Component Patterns

## Dialog Usage

Dialog auto-includes Portal and Overlay when used shadcn-style:

```tsx
import { Dialog } from '@rafters/ui/components/ui/dialog';

<Dialog>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Header>
    
    {/* Form content */}
    
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

## Built-in Behaviors

Dialog primitives provide:
- **Focus trap** - Tab cycles within dialog
- **Body scroll lock** - Background doesn't scroll
- **Escape key** - Closes dialog
- **Outside click** - Closes dialog (when modal)
- **ARIA** - Proper dialog role, labelledby, describedby

## Interactive Card + Dialog Pattern

Use Card's `interactive` prop for clickable cards that open dialogs:

```tsx
<Dialog>
  <Dialog.Trigger asChild>
    <Card interactive>
      <CardHeader>
        <CardTitle>Token Name</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Muted>Current value</Muted>
      </CardContent>
    </Card>
  </Dialog.Trigger>
  
  <Dialog.Content>
    {/* Edit form */}
  </Dialog.Content>
</Dialog>
```

## Overlay Components in Rafters

| Component | Use Case |
|-----------|----------|
| Dialog | Full blocking modal, requires decision |
| Sheet | Slide-in panel, supplementary content |
| Drawer | Bottom slide-up, mobile-friendly actions |
| Popover | Contextual, anchored to trigger |
| Tooltip | Hover info, non-interactive |
| DropdownMenu | Action menu, anchored to trigger |

## Key Principles

1. **asChild everywhere** - Trigger passes behavior to child element
2. **Auto-portal** - Content auto-portals to document.body
3. **Close mechanisms** - Dialog.Close, Escape, outside click all work
4. **Controlled or uncontrolled** - `open` vs `defaultOpen`
5. **showCloseButton** - Defaults true for shadcn-style usage

## Z-Index Tokens

Dialogs use z-index tokens:
- `z-depth-overlay` - Background overlay
- `z-depth-modal` - Dialog content
