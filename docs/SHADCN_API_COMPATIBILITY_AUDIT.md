# shadcn/ui API Compatibility Audit

**Date:** January 2026
**Status:** COMPLETED
**Purpose:** Identify gaps between our components and shadcn's API to achieve drop-in compatibility

## Executive Summary

All overlay components now provide **drop-in shadcn compatibility**. Users can copy shadcn examples verbatim and they work.

### Components Fixed (January 2026):
- Select - Trigger includes chevron, Content portals internally
- DropdownMenu - Content portals internally
- Dialog - Content includes Portal/Overlay/Close button internally
- Tooltip - Content portals internally, updated colors
- Popover - Already correct (uses Float primitive)
- ContextMenu - Content portals internally
- HoverCard - Content portals internally
- Menubar - Content portals internally
- AlertDialog - Content includes Portal/Overlay internally (no close button by design)
- Sheet - Content includes Portal/Overlay/Close button internally

---

## Select Component

### shadcn Usage (what users expect):
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>
```

### Our Current Usage (what users have to write):
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
    <SelectIcon />  {/* Manual icon */}
  </SelectTrigger>
  <SelectPortal>  {/* Manual portal wrapper */}
    <SelectContent>
      <SelectViewport>  {/* Manual viewport wrapper */}
        <SelectItem value="a">Option A</SelectItem>
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</Select>
```

### Gaps Fixed (January 2026):

| Component | Issue | Status |
|-----------|-------|--------|
| `SelectTrigger` | Missing chevron icon | FIXED - Icon included internally |
| `SelectTrigger` | Missing `size` prop | FIXED - Added `size?: "sm" \| "default"` |
| `SelectContent` | Doesn't include Portal | WAS ALREADY CORRECT - Portal is internal |
| `SelectContent` | Doesn't include Viewport | WAS ALREADY CORRECT - Viewport wrapper is internal |
| `SelectScrollUpButton` | Missing component | FIXED - Added component |
| `SelectScrollDownButton` | Missing component | FIXED - Added component |
| `SelectIcon` | Redundant with trigger | DEPRECATED - Icon now in trigger |

### Props Comparison:

**SelectTrigger:**
| Prop | shadcn | Ours | Status |
|------|--------|------|--------|
| `className` | Yes | Yes | OK |
| `size` | `"sm" \| "default"` | Missing | NEEDS FIX |
| `asChild` | Yes | Yes | OK |

**SelectContent:**
| Prop | shadcn | Ours | Status |
|------|--------|------|--------|
| `position` | `"item-aligned" \| "popper"` | Yes | OK |
| `align` | Yes | Yes | OK |
| `className` | Yes | Yes | OK |
| Internal Portal | Yes | No | NEEDS FIX |
| Internal Viewport | Yes | No | NEEDS FIX |
| Internal Scroll Buttons | Yes | No | NEEDS FIX |

---

## DropdownMenu Component

### shadcn Usage:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Gaps to Verify:
- [ ] Portal included in Content
- [ ] Trigger includes icon
- [ ] All subcomponents exported individually
- [ ] `inset` prop on items
- [ ] `variant` prop for destructive items

---

## Popover Component

### shadcn Usage:
```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>Content here</PopoverContent>
</Popover>
```

### Gaps to Verify:
- [ ] Portal included in Content (or separate Portal component?)
- [ ] All props match Radix API

---

## Tooltip Component

### shadcn Usage:
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Hover</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Gaps to Verify:
- [ ] `TooltipProvider` with `delayDuration` prop
- [ ] Portal included in Content
- [ ] `sideOffset` default (shadcn uses 0)

---

## Dialog Component

### shadcn Usage:
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button>Cancel</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Required Exports:
- `Dialog`
- `DialogTrigger`
- `DialogContent`
- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`
- `DialogClose`
- `DialogPortal`
- `DialogOverlay`

### Gaps to Verify:
- [ ] All subcomponents exported
- [ ] Portal and Overlay included in Content (or separate?)
- [ ] Close button with X icon included
- [ ] `showCloseButton` prop on Content

---

## ContextMenu Component

### shadcn Usage:
```tsx
<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Item</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuCheckboxItem checked>Checkbox</ContextMenuCheckboxItem>
    <ContextMenuRadioGroup>
      <ContextMenuRadioItem value="a">Radio A</ContextMenuRadioItem>
    </ContextMenuRadioGroup>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Submenu</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Sub item</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
```

### Required Exports:
- `ContextMenu`
- `ContextMenuTrigger`
- `ContextMenuContent`
- `ContextMenuItem`
- `ContextMenuCheckboxItem`
- `ContextMenuRadioItem`
- `ContextMenuRadioGroup`
- `ContextMenuLabel`
- `ContextMenuSeparator`
- `ContextMenuShortcut`
- `ContextMenuGroup`
- `ContextMenuPortal`
- `ContextMenuSub`
- `ContextMenuSubTrigger`
- `ContextMenuSubContent`

---

## HoverCard Component

### shadcn Usage:
```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <Button>@username</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    Profile content
  </HoverCardContent>
</HoverCard>
```

### Required Exports:
- `HoverCard`
- `HoverCardTrigger`
- `HoverCardContent`

---

## Menubar Component

### shadcn Usage:
```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab</MenubarItem>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Share</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Email</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

### Required Exports:
- `Menubar`
- `MenubarMenu`
- `MenubarTrigger`
- `MenubarContent`
- `MenubarItem`
- `MenubarSeparator`
- `MenubarLabel`
- `MenubarCheckboxItem`
- `MenubarRadioGroup`
- `MenubarRadioItem`
- `MenubarPortal`
- `MenubarSub`
- `MenubarSubTrigger`
- `MenubarSubContent`
- `MenubarGroup`
- `MenubarShortcut`

---

## Priority Order for Fixes

### P0 - Critical (Block drop-in usage):
1. **Select** - Most commonly used overlay component
2. **Dialog** - Core modal pattern
3. **DropdownMenu** - Common for actions

### P1 - High (Common components):
4. **Popover** - Used for rich content
5. **Tooltip** - Used everywhere
6. **ContextMenu** - Desktop apps

### P2 - Medium:
7. **HoverCard** - Preview cards
8. **Menubar** - Desktop-style apps

---

## Fix Strategy

For each component, the fix involves:

1. **Make Content self-contained**: Include Portal, Viewport, scroll buttons internally
2. **Add missing props**: `size`, `inset`, `variant` etc.
3. **Include icons**: Chevrons in triggers, check marks in items
4. **Export all subcomponents**: Named exports matching shadcn

The goal is: **Users can copy shadcn examples verbatim and they work.**
