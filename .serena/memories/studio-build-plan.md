# Studio Build Plan Summary

See `docs/STUDIO_BUILD_PLAN.md` for the full plan with 49 issues across 10 sprints.

## Key Insight
packages/studio/ already has a working prototype with solid backend (API, write queue, token loader, CSS generation, HMR). The frontend is a traditional token editor - labels, sidebar lists, namespace tabs. This is a TRANSFORMATION, not a greenfield build.

## Keep Entirely
- api/ (vite-plugin.ts, token-loader.ts, write-queue.ts)
- hooks/ (useTokens, useTokenSave, useColorPicker logic)
- utils/ (token-display.ts, color-conversion.ts)
- types.ts

## Replace Entirely
- App.tsx, Header.tsx, Sidebar.tsx, TokenEditor.tsx, TokenGrid.tsx, Preview.tsx, SpectrumPicker.tsx

## Sprint Order
0. Foundation Reset (GSAP, Context, TanStack Query, App shell, first-run detection)
1. First Run Core (snowstorm, bouncing box, OKLCH picker, why textarea, scale paint, orchestration)
2. Semantic Choices (3 suggestions per semantic, scale preview, done state, flow)
3. Sidebar (6 circles, icons, retreat on focus, keyboard nav)
4. Color Workspace (post-first-run editing, educational header)
5. Spacing Workspace (blocks, ratio combobox with musical presets)
6. Typography Workspace (specimen sheet, font tokens, derives from spacing)
7. Radius + Depth (dial control, 3D paper stack at 33deg)
8. Right-Click Power (vanilla context menu, color L/C/H sliders, cascade preview, why editing)
9. Core Systems (SSE, userOverride integration, save button, CSS regen)
10. Motion Workspace (deferred - ~1500 tokens, design TBD)

## Critical Path
Sprints 0->1->2->3 are sequential (each depends on previous).
Sprints 4-7 can run in parallel after Sprint 3.
Sprint 8 needs all workspaces.
Sprint 9 runs alongside workspaces.
Sprint 10 is deferred.

## Risks
1. Semantic suggestions gap: only 4 of 9 semantics have existing computation
2. OKLCH canvas picker performance (may need rAF throttling)
3. Motion namespace massive scale (~1500 tokens)
4. Depth derives-from-spacing refactor is separate work
