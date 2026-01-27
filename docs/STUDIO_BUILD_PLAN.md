# Studio Build Plan

Comprehensive implementation plan for all 49 issues across 11 phases.

**Key insight:** `packages/studio/` already has a working prototype with solid backend (API, write queue, token loader, CSS generation, HMR). The frontend is a traditional token editor - labels, sidebar lists, namespace tabs with counts - the exact opposite of the vision. This plan is a **transformation**, not a greenfield build.

## What We Keep

The entire backend/data layer is production-quality and stays:

| File | Status | Notes |
|------|--------|-------|
| `api/vite-plugin.ts` | **Keep** | Working middleware, add SSE endpoint |
| `api/token-loader.ts` | **Keep** | loadProjectTokens, updateSingleToken, CSS regen |
| `api/write-queue.ts` | **Keep** | Serialize writes, prevent corruption |
| `hooks/useTokens.ts` | **Keep** | Token fetching, adapt to TanStack Query |
| `hooks/useTokenSave.ts` | **Keep** | PATCH with reason, keep entirely |
| `hooks/useColorPicker.ts` | **Partial** | OKLCH logic stays, react-colorful dep removed |
| `utils/token-display.ts` | **Keep** | CSS value formatting |
| `utils/color-conversion.ts` | **Keep** | OKLCH/hex conversions via colorjs.io |
| `types.ts` | **Keep** | Namespace types, adapt for 6 circles |

## What Gets Replaced

Every visual component gets rewritten:

| File | Action | Reason |
|------|--------|--------|
| `App.tsx` | **Rewrite** | Sidebar+header layout -> canvas-first |
| `Header.tsx` | **Delete** | No chrome, logo floats during first run only |
| `Sidebar.tsx` | **Rewrite** | Token list -> 6 circles with retreat |
| `TokenEditor.tsx` | **Rewrite** | Form-based -> namespace workspace switcher |
| `TokenGrid.tsx` | **Rewrite** | Labeled grid -> visual-only swatches |
| `SpectrumPicker.tsx` | **Rewrite** | react-colorful -> custom OKLCH canvas |
| `SpacingEditor.tsx` | **Evolve** | Logic stays, visual redesigned |
| `MotionEditor.tsx` | **Keep** | Good foundation, defer to Phase 9 |
| `Preview.tsx` | **Remove** | Real-time self-consumption replaces static preview |

---

## Build Order

### Sprint 0: Foundation Reset (Issues #676, #680, #706, #707, #716, #724)

**Goal:** Strip existing prototype to its backend core, set up new architecture.

**Why first:** Everything depends on the state system, animation engine, and app shell.

#### Step 0.1: Remove react-colorful, add GSAP + TanStack Query (#676 partial)
```
pnpm --filter=@rafters/studio remove react-colorful
pnpm --filter=@rafters/studio add gsap @tanstack/react-query
```

#### Step 0.2: GSAP Animation System (#716)
Create `src/lib/animation.ts`:
- Export timeline factories: `createFadeIn()`, `createSlideLeft()`, `createStagger()`, `createCrossfade()`
- Export `useGSAP()` hook wrapping `gsap.context()` for React cleanup
- All factories return `gsap.core.Timeline` for composability
- Every factory checks `window.matchMedia('(prefers-reduced-motion: reduce)')` (#724)
- If reduced motion: instant set instead of animate

Dependencies: none.

#### Step 0.3: Prefers-Reduced-Motion (#724)
Create `src/lib/motion.ts`:
- `usePrefersReducedMotion()` hook (listens for media query changes)
- Export `MOTION_ENABLED` reactive signal consumed by GSAP factories
- When true: all GSAP calls become instant `gsap.set()` with duration 0

Dependencies: #716.

#### Step 0.4: React Context Stores (#680)
Create `src/context/`:
- `StudioContext.tsx` - useReducer for UI state:
  ```typescript
  type StudioState = {
    phase: 'first-run' | 'workspace';
    activeNamespace: Namespace | null;
    semanticsComplete: boolean;
    educationDismissed: Record<Namespace, boolean>;
    primarySet: boolean;
  };
  ```
- `TokenContext.tsx` - wraps token data from TanStack Query
- Actions: `SET_PRIMARY`, `COMPLETE_SEMANTIC`, `DISMISS_EDUCATION`, `SET_NAMESPACE`, `COMPLETE_FIRST_RUN`

Dependencies: none.

#### Step 0.5: TanStack Query Setup (#706)
Create `src/lib/query.ts`:
- QueryClient with defaults (staleTime, refetchOnWindowFocus)
- `useTokenQuery()` - wraps existing `fetchTokens` from useTokens
- `useTokenMutation()` - wraps existing save logic from useTokenSave
- `useSemanticSuggestions(baseColor)` - new query to fetch from API

Dependencies: none (wraps existing hooks).

#### Step 0.6: Main App Layout (#707)
Rewrite `src/App.tsx`:
```tsx
function App() {
  const { phase } = useStudioState();
  return (
    <QueryClientProvider>
      <StudioProvider>
        {phase === 'first-run' ? <FirstRun /> : <Workspace />}
        <SaveButton />  {/* ghost, top-right, always visible */}
      </StudioProvider>
    </QueryClientProvider>
  );
}
```
- No header bar, no chrome
- Logo only during first-run (inside `<FirstRun />`)
- Save button floats top-right always

Dependencies: #680, #706.

#### Step 0.7: First Run Detection (#709)
In StudioContext initialization:
- On mount, check token data for primary color
- If primary token has no value or is default -> `phase: 'first-run'`
- If primary exists with userOverride -> `phase: 'workspace'`

Dependencies: #680, #706.

#### Step 0.8: Namespace Workspace Switcher (#708)
Create `src/components/Workspace.tsx`:
- Reads `activeNamespace` from context
- Renders appropriate workspace component
- GSAP crossfade on namespace change
- Lazy loads workspace components

Dependencies: #707, #716.

**Sprint 0 delivers:** App boots, detects first-run vs workspace, GSAP ready, state management ready, TanStack Query ready. No visual features yet but the skeleton is solid.

---

### Sprint 1: First Run - Core Loop (Issues #681, #682, #683, #684, #685, #686, #710)

**Goal:** The snowstorm -> pick primary -> why -> scale animation. The emotional core of Studio.

**Why second:** This IS the product. Everything else is refinement.

#### Step 1.1: Snowstorm Background (#681)
Create `src/components/first-run/Snowstorm.tsx`:
- Canvas element, full viewport
- White page, falling snowflakes (CSS or canvas, ~50 particles)
- GSAP-driven (respects reduced motion)
- Receives `onFadeOut` callback - when primary committed, GSAP fades to 0 and calls back
- Never returns after first commit

Dependencies: #716.

#### Step 1.2: Bouncing Box (#682)
Create `src/components/first-run/BouncingBox.tsx`:
- Box ~1/4 viewport, bounces slowly in snowstorm
- Text "choose primary color..." fades in 500ms after mount
- On click: box stops, triggers `onSelect` callback
- GSAP for bounce + text fade

Dependencies: #716, #681 (visually composed together).

#### Step 1.3: Custom OKLCH Color Picker (#683)
Create `src/components/shared/OKLCHPicker.tsx`:
- Full-screen canvas picker (not a popover - takes over the bouncing box area)
- Two canvases:
  1. Hue strip (horizontal bar, 0-360)
  2. L/C plane (vertical = lightness 0-1, horizontal = chroma 0-0.4)
- Pointer events for selection
- Uses `@rafters/color-utils` for OKLCH <-> sRGB conversion
- Gamut boundary drawn on L/C plane (out-of-gamut regions dimmed)
- Returns `{ l, c, h }` on commit
- Existing `color-conversion.ts` utilities stay, `useColorPicker` hook adapted to remove react-colorful dependency

Dependencies: existing `color-utils`, `color-conversion.ts`.

#### Step 1.4: Why Textarea with Cycling Placeholder (#684, #722)
Create `src/components/shared/WhyTextarea.tsx`:
- Textarea with cycling placeholder text
- Placeholder rotates every ~3 seconds
- ~24 general prompts hardcoded:
  - "What does this color mean to your brand?"
  - "What feeling should someone get?"
  - "Is this color from your logo? Your history?"
  - "What's the emotional weight of this choice?"
  - (+ ~20 more)
- When `intelligenceHints` prop provided (from API): intersperse with general prompts
- GSAP fade for placeholder transitions
- Required: can't submit empty

Dependencies: #716.

#### Step 1.5: Color Intelligence Fetching (#710)
Create `src/hooks/useColorIntelligence.ts`:
- TanStack Query hook: `useColorIntelligence(oklch)`
- Fetches from Rafters API: color meaning, cultural associations, accessibility notes
- Returns array of insight strings for WhyTextarea cycling
- Graceful fallback: if API unavailable, general prompts only

Dependencies: #706.

#### Step 1.6: Why Gate Enforcement (#685)
Create `src/components/shared/WhyGate.tsx`:
- Wraps WhyTextarea + submit button
- If user tries to skip: shows message: "Rafters is not a token editor. It's a Design Intelligence System. Your reasoning is the product."
- Calls `onCommit(reason: string)` when valid reason submitted
- Auto-saves via token mutation after commit

Dependencies: #684.

#### Step 1.7: System Paint Animation (#686)
Create `src/components/first-run/ScalePaint.tsx`:
- After primary committed:
  1. Spectrum mutes (GSAP fade)
  2. 500 value as 128px box slides left
  3. Copy of 500 stays in center of scale
  4. 48px boxes grow outward from center, one at a time (GSAP stagger)
  5. gap-24 between the choice box and the scale
- The scale values come from the actual generated color scale
- Snowstorm fades simultaneously
- On complete: transitions to semantic choices

Dependencies: #716, #683, existing `design-tokens` scale generation.

#### Step 1.8: First Run Flow Orchestration (#713)
Create `src/components/first-run/FirstRun.tsx`:
- State machine:
  1. `snowstorm` - Snowstorm + BouncingBox
  2. `picking` - OKLCH Picker open
  3. `reasoning` - WhyGate visible
  4. `painting` - ScalePaint animation
  5. `semantics` - Semantic choices (Sprint 2)
  6. `complete` - Crossfade to workspace
- Each transition is a GSAP timeline
- Logo top-left during entire first-run flow

Dependencies: #681, #682, #683, #684, #685, #686, #710.

**Sprint 1 delivers:** The complete first-run primary color flow. Designer sees snowstorm, picks color, explains why, watches the system paint. The emotional core works.

---

### Sprint 2: Semantic Choices (Issues #691, #692, #693, #714, #715)

**Goal:** Complete the first-run by letting the designer pick all 9 semantic colors.

**Why third:** First run must be complete before workspace makes sense.

#### Step 2.1: Semantic Choice Computation (#715)
Create `src/lib/semantic-suggestions.ts`:
- For each of 9 semantics (destructive, success, warning, info, secondary, muted, accent, background, foreground):
  - Generate 3 color suggestions based on primary
  - For danger/success/warning/info: use existing `generateSemanticColorSuggestions()` from `@rafters/color-utils`
  - For secondary: rotate hue 30deg, adjust chroma
  - For muted: desaturate primary
  - For accent: complementary or triadic
  - For background: near-white in primary hue
  - For foreground: near-black in primary hue
- Each returns `[OKLCH, OKLCH, OKLCH]`

Dependencies: `@rafters/color-utils`, primary color value.

#### Step 2.2: Color Scale Preview Component (#714)
Create `src/components/shared/ColorScale.tsx`:
- Row of 48px boxes showing a color's generated scale (50-950)
- No labels by default
- Hover shows scale position as tooltip
- Reused across semantic choices and color workspace

Dependencies: existing scale generation in `design-tokens`.

#### Step 2.3: Semantic Choices Display (#691)
Create `src/components/first-run/SemanticChoices.tsx`:
- Fade in after ScalePaint completes
- Each semantic: 64px row showing 3 color options + custom button
- No labels - name appears centered on hover
- Picking opens WhyGate for that semantic
- Custom option opens OKLCH picker then WhyGate

Dependencies: #715, #714, #683, #684.

#### Step 2.4: Semantic Done State (#692)
Create transition in SemanticChoices:
- On choice: unchosen swatches burn out (instant remove, no fade)
- Chosen color's scale grows as 48px boxes (like primary)
- Row collapses to show: chosen color + scale + checkmark
- "done" state - no text label

Dependencies: #691, #716.

#### Step 2.5: Full Semantics Flow (#693)
Wire SemanticChoices into FirstRun:
- All 9 semantics must be decided
- After last semantic: crossfade to workspace
- Dispatch `COMPLETE_FIRST_RUN` to context
- Snowstorm gone forever (never re-renders)
- Sidebar circles unlock

Dependencies: #691, #692, #680.

**Sprint 2 delivers:** Complete first-run flow from snowstorm to workspace transition. Designer picks primary + 9 semantics, each with reasoning. System generates everything else from math + defaults.

---

### Sprint 3: Sidebar (Issues #687, #688, #689, #723)

**Goal:** The six-circle navigation that gets out of the way.

**Why fourth:** Workspace navigation needed before building namespace UIs.

#### Step 3.1: Six-Circle Sidebar (#687)
Create `src/components/sidebar/Sidebar.tsx`:
- 6 circles along left edge: Color, Spacing, Typography, Radius, Depth, Motion
- 44px default, 64px on hover (GSAP scale)
- Connected only by negative space
- No background, no divider, no chrome
- Grayed out + non-interactive until `semanticsComplete` in context
- Motion circle: disabled with "Coming soon" tooltip (Phase 9)

Dependencies: #680, #716.

#### Step 3.2: Namespace Icons (#688)
Map Lucide icons to namespaces:
- Color: `Palette`
- Spacing: `Space` or `MoveHorizontal`
- Typography: `Type`
- Radius: `CornerUpRight` or `CircleDot`
- Depth: `Layers`
- Motion: `Zap` or `Clock`

Dependencies: existing Lucide dependency.

#### Step 3.3: Workspace Focus Retreat (#689)
In Sidebar component:
- When workspace has focus: circles retreat to -33% left margin
- GSAP slide animation
- Mouse entering left ~60px zone restores sidebar
- Mouse leaving sidebar area (moving into workspace) triggers retreat after short delay (~300ms)
- CSS: sidebar is absolutely positioned, workspace takes full width

Dependencies: #687, #716.

#### Step 3.4: Sidebar Keyboard Navigation (#723)
Add to Sidebar:
- `role="tablist"`, circles are `role="tab"`
- Arrow Up/Down cycles through circles
- Enter/Space activates selected namespace
- Tab moves focus from sidebar to workspace
- When sidebar is retreated: removed from tab order
- Focus circle gets visible ring

Dependencies: #687.

**Sprint 3 delivers:** Working navigation. Designer clicks/keys through 6 namespaces. Sidebar retreats on focus, returns on hover.

---

### Sprint 4: Color Workspace (Issue #690)

**Goal:** The post-first-run color editing experience.

**Why fifth:** Color is the most complex namespace and the reference for all others.

#### Step 4.1: Color Workspace Container (#690)
Create `src/components/workspaces/ColorWorkspace.tsx`:
- Educational header (dismissible, localStorage persistence) explaining:
  - OKLCH color space
  - How scales are generated
  - Harmonic relationships
  - Perceptual uniformity
- After dismiss: visual color swatches only
- Shows all semantic colors with their scales
- Right-click opens color palette (Sprint 8)
- Click on semantic triggers WhyGate if changing

Dependencies: #711 (educational header), #714 (color scale).

**Sprint 4 delivers:** Color workspace shows all semantic colors visually. Educational content explains the math. Changes cascade in real-time.

---

### Sprint 5: Spacing Workspace (Issues #694, #695, #717)

**Goal:** Visual spacing blocks with ratio control.

#### Step 5.1: Educational Header Component (#711)
Create `src/components/shared/EducationalHeader.tsx`:
- Receives: `namespace`, `title`, `content` (React nodes)
- Dismissible: stores in localStorage per namespace
- Shows mathematical explanation + visual examples
- Smooth GSAP slide-out on dismiss

Dependencies: #716.

#### Step 5.2: Spacing Workspace (#694, #695)
Create `src/components/workspaces/SpacingWorkspace.tsx`:
- Educational header: perfect fourths, golden ratio, musical scales, how spacing derives from base unit
- After dismiss: side-by-side spacing blocks showing the full scale
- Blocks are unlabeled visual rectangles
- Height/width proportional to actual spacing value
- Currently selected ratio highlighted

Dependencies: #711.

#### Step 5.3: Spacing Ratio Combobox (#717)
Create `src/components/shared/RatioCombobox.tsx`:
- Combobox (not select) - type-ahead + dropdown
- Preset options from `@rafters/math-utils` ALL_RATIOS:
  - Minor second (1.067)
  - Major second (1.125)
  - Minor third (1.2)
  - Major third (1.25)
  - Perfect fourth (1.333)
  - Augmented fourth (1.414)
  - Perfect fifth (1.5)
  - Golden ratio (1.618)
- Custom: type any decimal (e.g., "1.55")
- Live preview: spacing blocks animate to new values as you hover options
- Select triggers WhyGate (deviation from default)
- Uses existing `generateModularScale()` from `@rafters/math-utils`

Dependencies: #694, existing `math-utils`.

**Sprint 5 delivers:** Spacing workspace with musical ratio control. Changing the ratio cascades through the entire system in real-time (tokens ARE Tailwind).

---

### Sprint 6: Typography Workspace (Issue #719)

**Goal:** Specimen sheet with scale and font controls.

#### Step 6.1: Typography Workspace (#719)
Create `src/components/workspaces/TypographyWorkspace.tsx`:
- Educational header: typographic scale history, how type derives from spacing
- Standard specimen sheet (every designer recognizes it):
  - Heading levels (h1-h6) with actual rendered text
  - Body text paragraph
  - Monospace code sample
  - Display text (hero headline)
- Default: type scale derived from spacing ratio
- Override toggle: use own scale (WhyGate if deviating)
- Font tokens: `font-display`, `font-sans`, `font-serif`, `font-mono`
  - These are the ONLY place Studio creates new tokens
  - Default: system fonts (IBM Plex family)
  - Right-click on text sample to access font picker (Sprint 8)
- Scale visualization shows all type sizes as visual blocks

Dependencies: #711, #717 (ratio combobox reused for type scale override).

**Sprint 6 delivers:** Typography workspace with specimen sheet. Defaults derive from spacing. Override creates independent type scale with WhyGate.

---

### Sprint 7: Radius + Depth Workspaces (Issues #720, #718)

**Goal:** Simple controls for radius and depth.

#### Step 7.1: Radius Workspace (#720)
Create `src/components/workspaces/RadiusWorkspace.tsx`:
- Educational header: border radius, how it derives from spacing
- Visual: grid of boxes with different radii applied
  - Boxes show actual token value visually
  - From sharp (0) to fully rounded
- Simple dial control (circular slider or arc)
  - Adjusts the radius scale factor
  - All boxes update in real-time
  - WhyGate if deviating from spacing-derived default

Dependencies: #711.

#### Step 7.2: Depth Workspace (#718)
Create `src/components/workspaces/DepthWorkspace.tsx`:
- Educational header: elevation levels, stacking contexts, z-index strategy
- Visual: 3D paper stack at 33-degree edge (CSS transform: perspective + rotateY)
  - 7 layers: base, dropdown, sticky, fixed, modal, popover, tooltip
  - Each layer is a card/paper shape with subtle shadow
  - On hover: layer slides out showing its name
  - Semantic levels, not a mathematical progression
- Currently read-only (depth derives from spacing - refactor TODO)
- Note: shadow tokens are NOT shown here (derived later)

Dependencies: #711, #716 (GSAP for hover animations).

**Sprint 7 delivers:** Radius with dial control, depth with 3D visualization. Both are simple, visual, no labels.

---

### Sprint 8: Right-Click Power (Issues #700, #701, #702, #721)

**Goal:** Power features hidden behind right-click.

**Why eighth:** All workspaces must exist before adding power controls.

#### Step 8.1: Context Menu System (#700)
Create `src/components/shared/ContextMenu.tsx`:
- Vanilla implementation: `contextmenu` event listener
- Positioned div with portal (appended to body)
- Click outside or Escape dismisses
- Each menu instance receives custom children
- No Radix, no library - browser primitives
- Animation: instant show (no GSAP needed for menus)

Dependencies: none.

#### Step 8.2: Color Palette (#701)
Create `src/components/context-menus/ColorPalette.tsx`:
- Three sliders: L, C, H (OKLCH components)
- Target swatch updates live as sliders move
- Current values displayed
- Neighbor warning: when dragging outside harmonic neighborhood, show warning text
- Apply button commits change through WhyGate

Dependencies: #700, existing `color-utils`.

#### Step 8.3: Cascade Preview (#702)
Create `src/components/context-menus/CascadePreview.tsx`:
- When a color change would affect dependents:
  - Show list of affected tokens
  - Preview before/after colors
  - Tokens with userOverride shown with lock icon + reason
- Buttons: [Update all] [Skip overrides] [Cancel]
- Uses existing override conflict flow from vite-plugin.ts

Dependencies: #700, #701.

#### Step 8.4: Why Editing (#721)
Add to context menus:
- Right-click any committed choice shows "Edit reasoning" option
- Opens WhyTextarea pre-filled with current reason
- Save updates the userOverride reason
- Available on all semantic colors, spacing, typography, radius changes

Dependencies: #700, #684.

**Sprint 8 delivers:** Power users get scoped controls per context. Color gets L/C/H sliders with cascade preview. All choices get editable reasoning.

---

### Sprint 9: Core Systems (Issues #677, #678, #679, #703, #704, #705)

**Goal:** Polish core infrastructure that was deferred.

**Note:** #677 (CLI command) and #678 (Vite middleware) already exist and work. These issues track any remaining polish.

#### Step 9.1: SSE for Live Token Updates (#679)
Add to `vite-plugin.ts`:
- `GET /api/events` SSE endpoint
- On `registry.setChangeCallback`: broadcast to connected clients
- Client hook `useTokenEvents()` invalidates TanStack Query cache
- Enables future multi-tab support

Dependencies: existing vite-plugin.ts.

#### Step 9.2: UserOverride Integration (#703)
Ensure all save paths:
- Always capture reason via WhyGate
- Store as `userOverride: { value, reason, timestamp }`
- Display override indicator in workspace views
- Respect overrides during cascade (existing `registry.set()` logic)

Dependencies: all workspaces.

#### Step 9.3: Save Button (#704)
Create `src/components/shared/SaveButton.tsx`:
- Ghost button, top-right
- Auto-save happens after every WhyGate commit
- Button triggers explicit save of all output files (rafters.css, rafters.ts, rafters.json)
- Visual feedback: subtle pulse on save
- For the 18% who need a save button

Dependencies: existing save infrastructure.

#### Step 9.4: CSS Output Regeneration (#705)
Verify existing flow works end-to-end:
- Token edit -> `registry.set()` -> `registryToVars()` -> write `rafters.vars.css` -> Vite HMR
- Explicit save -> `registryToTailwind()` -> write all output files
- Studio UI updates in real-time via CSS variable changes

Dependencies: existing infrastructure.

**Sprint 9 delivers:** SSE for live updates, robust save flow, override integration.

---

### Sprint 10: Motion Workspace (Issue #697)

**Goal:** Placeholder for the massive motion namespace.

#### Step 10.1: Motion Workspace (#697)
Create `src/components/workspaces/MotionWorkspace.tsx`:
- Educational header about animation principles
- Existing `MotionEditor.tsx` has good duration/easing editors - adapt these
- ~1500 tokens means this is as big as the rest combined
- For now: curated view of key motion tokens (duration, easing)
- Full design TBD - this is explicitly deferred

Dependencies: existing MotionEditor.tsx, #711.

**Sprint 10 delivers:** Basic motion workspace. Full design is a future effort.

---

## Critical Path

```
Sprint 0 (Foundation) ─┬─> Sprint 1 (First Run Core)
                        │         │
                        │         └─> Sprint 2 (Semantics) ─> Sprint 3 (Sidebar)
                        │                                           │
                        │              ┌────────────────────────────┘
                        │              │
                        │              ├─> Sprint 4 (Color Workspace)
                        │              ├─> Sprint 5 (Spacing Workspace)
                        │              ├─> Sprint 6 (Typography Workspace)
                        │              ├─> Sprint 7 (Radius + Depth)
                        │              └─> Sprint 10 (Motion - deferred)
                        │              │
                        │              └─> Sprint 8 (Right-Click Power)
                        │
                        └─> Sprint 9 (Core Systems - parallel with workspaces)
```

**Sprints 4-7 can run in parallel** after Sprint 3. Each workspace is independent.
**Sprint 8** needs all workspaces to exist (right-click contexts per namespace).
**Sprint 9** runs alongside workspaces (infrastructure polish).
**Sprint 10** is explicitly deferred.

## Issue-to-Sprint Mapping

| Issue | Title | Sprint | Step |
|-------|-------|--------|------|
| #676 | Scaffolding | 0 | 0.1 |
| #680 | React Context stores | 0 | 0.4 |
| #706 | TanStack Query setup | 0 | 0.5 |
| #707 | App layout | 0 | 0.6 |
| #708 | Workspace switcher | 0 | 0.8 |
| #709 | First run detection | 0 | 0.7 |
| #716 | GSAP animation system | 0 | 0.2 |
| #724 | prefers-reduced-motion | 0 | 0.3 |
| #681 | Snowstorm | 1 | 1.1 |
| #682 | Bouncing box | 1 | 1.2 |
| #683 | OKLCH picker | 1 | 1.3 |
| #684 | Why textarea | 1 | 1.4 |
| #685 | Why gate | 1 | 1.6 |
| #686 | System paint animation | 1 | 1.7 |
| #710 | Color intelligence | 1 | 1.5 |
| #713 | First run orchestration | 1 | 1.8 |
| #722 | Placeholder cycling | 1 | 1.4 |
| #691 | Semantic choices display | 2 | 2.3 |
| #692 | Semantic done state | 2 | 2.4 |
| #693 | Semantics flow | 2 | 2.5 |
| #714 | Color scale preview | 2 | 2.2 |
| #715 | Semantic computation | 2 | 2.1 |
| #687 | Six-circle sidebar | 3 | 3.1 |
| #688 | Namespace icons | 3 | 3.2 |
| #689 | Focus retreat | 3 | 3.3 |
| #723 | Sidebar keyboard nav | 3 | 3.4 |
| #690 | Color workspace | 4 | 4.1 |
| #694 | Spacing workspace | 5 | 5.2 |
| #695 | Spacing blocks | 5 | 5.2 |
| #711 | Educational header | 5 | 5.1 |
| #717 | Ratio combobox | 5 | 5.3 |
| #719 | Typography workspace | 6 | 6.1 |
| #718 | Depth workspace | 7 | 7.2 |
| #720 | Radius workspace | 7 | 7.1 |
| #700 | Context menu system | 8 | 8.1 |
| #701 | Color palette | 8 | 8.2 |
| #702 | Cascade preview | 8 | 8.3 |
| #721 | Why editing | 8 | 8.4 |
| #677 | CLI command | 9 | exists |
| #678 | Vite middleware | 9 | exists |
| #679 | SSE events | 9 | 9.1 |
| #703 | UserOverride integration | 9 | 9.2 |
| #704 | Save button | 9 | 9.3 |
| #705 | CSS output regen | 9 | 9.4 |
| #697 | Motion workspace | 10 | 10.1 |

## File Structure (Target)

```
packages/studio/src/
  main.tsx                          # Entry, split CSS imports
  App.tsx                           # Phase router (first-run | workspace)
  types.ts                          # Namespace types
  context/
    StudioContext.tsx                # UI state (phase, namespace, dismissed)
    TokenContext.tsx                 # Token data wrapper
  lib/
    animation.ts                    # GSAP factories
    motion.ts                       # prefers-reduced-motion
    query.ts                        # TanStack Query setup
    semantic-suggestions.ts         # 3 choices per semantic
  hooks/
    useTokens.ts                    # Keep (adapt to TanStack)
    useTokenSave.ts                 # Keep
    useColorPicker.ts               # Keep (remove react-colorful dep)
    useColorIntelligence.ts         # New: API intelligence
    useTokenEvents.ts               # New: SSE listener
  components/
    first-run/
      FirstRun.tsx                  # Orchestrator state machine
      Snowstorm.tsx                 # Canvas particles
      BouncingBox.tsx               # Bouncing "choose primary" box
      ScalePaint.tsx                # Scale growth animation
      SemanticChoices.tsx           # 9 semantic rows with 3 options
    sidebar/
      Sidebar.tsx                   # 6 circles with retreat
    workspaces/
      ColorWorkspace.tsx            # Semantic colors + scales
      SpacingWorkspace.tsx          # Blocks + ratio combobox
      TypographyWorkspace.tsx       # Specimen sheet + font tokens
      RadiusWorkspace.tsx           # Rounded boxes + dial
      DepthWorkspace.tsx            # 3D paper stack
      MotionWorkspace.tsx           # Duration/easing (deferred)
    shared/
      OKLCHPicker.tsx               # Custom canvas color picker
      WhyTextarea.tsx               # Cycling placeholder textarea
      WhyGate.tsx                   # Enforcement wrapper
      ColorScale.tsx                # 48px scale boxes
      RatioCombobox.tsx             # Musical presets + custom
      EducationalHeader.tsx         # Dismissible math explanation
      SaveButton.tsx                # Ghost comfort button
      ContextMenu.tsx               # Vanilla right-click menu
    context-menus/
      ColorPalette.tsx              # L/C/H sliders
      CascadePreview.tsx            # Affected tokens preview
  api/
    vite-plugin.ts                  # Keep + add SSE
    token-loader.ts                 # Keep entirely
    write-queue.ts                  # Keep entirely
  utils/
    token-display.ts                # Keep entirely
    color-conversion.ts             # Keep entirely
  styles/
    global.css                      # Minimal, no chrome variables
```

## Removed Files (from existing prototype)

```
src/components/Header.tsx           # No chrome
src/components/Preview.tsx          # Self-consumption replaces this
src/components/TokenGrid.tsx        # Replaced by workspace views
src/components/TokenEditor.tsx      # Replaced by workspace switcher
```

## Risks and Open Questions

1. **Semantic suggestions gap**: `generateSemanticColorSuggestions()` only handles 4 semantics (danger/success/warning/info). Need new computation for secondary/muted/accent/background/foreground. Sprint 2 Step 2.1 covers this.

2. **OKLCH canvas picker performance**: Drawing L/C plane with gamut boundary on every pointer move. May need requestAnimationFrame throttling or WebGL. Profile in Sprint 1.

3. **Motion namespace scale**: ~1500 tokens. Explicitly deferred (Sprint 10). The workspace design is a separate project.

4. **Depth derives from spacing**: Currently fixed values (0-60). Refactor to derive from spacing base unit is TODO. Sprint 7 workspace shows current values; refactor is separate issue.

5. **Font loading**: Typography workspace needs font previews. System fonts work immediately; Google Fonts or custom fonts need async loading. Right-click font picker design deferred to Sprint 8.

6. **GSAP bundle size**: Free core is ~30KB gzip. Acceptable for a dev tool. No tree-shaking concerns.
