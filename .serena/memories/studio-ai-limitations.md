# Studio UI - AI Limitations (Critical)

## The Problem
AI (Claude) defaults to control-panel UIs. Every time Studio UI has been built, it converges on:
- Tabs, cards, form inputs, grids
- Labels, token names, numbers visible
- Settings pages and CRUD interfaces
- Range sliders for color picking

The Studio UI has been tossed multiple times because of this pattern.

## What Studio Actually Is
Read `studio-vision` memory. Key points:
- Snowstorm first-run (blank page anxiety made literal)
- 6 circles connected by negative space, not a labeled sidebar
- No labels, no token names, no numbers visible to designer
- "Why" gates that require reasoning before proceeding
- Designer sees colors and blocks, not forms
- More art installation than settings panel

## The Rule
When building Studio UI, every judgment call about "how should this feel" will be wrong if left to AI instinct. The vision docs contain explicit constraints that must be followed literally. When constraints don't cover something, ASK rather than defaulting to utilitarian patterns.

## Current State (2026-02-09)
- Backend (vite-plugin API + WebSocket HMR) is solid, 149 tests
- Frontend App.tsx is a control-panel scaffold -- proves components work but is NOT the real UI
- The real UI has never been successfully built by AI alone
