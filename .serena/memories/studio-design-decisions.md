# Studio Design Decisions (from planning session)

## Dependencies
- **GSAP** (free core) - Timeline choreography, stagger, easing for all animations
- **TanStack Query** - Server state (fetch/mutate tokens). Earned complexity.
- **React Context + useReducer** - Client state. NO zustand.
- **Vanilla context menu** - Native contextmenu event + positioned div. NO Radix.
- **Custom OKLCH picker** - Canvas + pointer events + @rafters/color-utils. NO react-colorful.

## First Run Flow Details
- First run detected by: primary token not set
- Snowstorm: CSS/canvas animation, fades forever after primary committed
- Bouncing box: text "choose primary color..." fades in 500ms after box appears
- Color picker: Custom OKLCH canvas picker (hue strip + L/C plane)
- Scale animation: 500 (128px box) slides left, copy of 500 stays in middle, scale grows outward as 48px boxes one at a time. gap-24 between choice and scale.
- Semantics: fade in as 64px rows after primary. 3 choices per semantic, no labels. Hover shows name centered in box.
- Unchosen swatches: instant remove, no fade ("burn out")
- Semantic scale boxes: 48px once chosen
- Auto-save after every "why" commit. Save button is comfort feature for 18% who need it.

## Why Textarea
- Placeholder cycles every ~3 seconds between:
  - ~24 general/existential prompts ("What does this color mean to your brand?", etc.)
  - Color intelligence from the API (not color-utils)
- Minimum input: meaningful (TBD what enforcement looks like)
- Why is editable later via right-click

## Sidebar
- 6 circles, Lucide icons (custom later)
- Mouse near left edge brings retreated sidebar back
- Other namespace circles grayed out until semantics complete
- Keyboard navigable (arrow keys through circles)
- Tab order: sidebar first, then workspace

## Namespace Workspaces
- GSAP smooth fades between namespaces
- Educational headers: permanently dismissed (localStorage), content from actual math
- Spacing: combobox with musical presets + custom ratio input
- Typography: derives from spacing by default, override to own scale. ONLY place new tokens created (font-display, font-sans, font-serif, font-mono)
- Radius: derives from spacing, simple dial control
- Depth: 3D paper stack at 33-degree edge, layers slide out on hover showing name. NOT a progression - semantic stacking levels. Should be refactored to derive from spacing.
- Motion: ~1500 tokens, massive namespace, not ready to design yet
- Changes cascade in real-time (tokens ARE tailwind)

## Right-Click Palettes
- One palette per context, designed individually as built
- Color: L/C/H sliders, neighbor warning, cascade preview
- Others: TBD as we build them

## App Chrome
- Logo top-left during first run ONLY, not after
- Save button top-right (ghost, comfort feature)
- No header bar, no chrome. Logo + save float over workspace.
- No undo - git versions handle history
- No toasts - alerts for real errors only (filesystem failure edge case)
- prefers-reduced-motion: kill ALL animation
- Sidebar hidden from tab when retreated, keyboard nav when visible

## Recovery / Error
- Filesystem is source of truth (.rafters/ directory)
- CLI init ensures .rafters/ exists before Studio launches
- No draft state, no crash recovery beyond what's saved
- localStorage for UI state (dismissed education, etc.)

## Derived Semantics
- First run: designer picks ~9 base semantics (destructive, success, warning, info, secondary, muted, accent, background, foreground)
- Foreground pairs: auto-computed via contrast
- Sidebar-*: derived from main semantics
- Chart-1 through chart-5: computed from palette
- border, input, ring: derived from neutral/primary
- card, popover, highlight: TBD (derived or picked later)
- Override any derived value via right-click + why gate
