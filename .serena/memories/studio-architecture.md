# Studio Architecture

## Overview
Studio is a local visual token editor launched via `pnpx rafters@latest studio`.

## Issue #443: Realtime CSS Output

### Architecture
```
Studio UI (React) <--WebSocket--> MCP Server <--Watch--> .rafters/tokens/
       |                              |
       v                              v
  Vite Dev Server              .rafters/output/theme.css
       |                              |
       +--------<-- HMR CSS ----------+
```

### Key Decisions
1. **CSS-only realtime regeneration** - tokens.ts and tokens.json not regenerated on every change
2. **Write queue** - Prevents race conditions when rapid edits happen
3. **Vite CSS HMR** - Smooth repaint without page refresh using native CSS module hot reload
4. **Designer-focused** - Designers don't need to know about TypeScript or JSON exports

### Implementation Notes
- TokenRegistry's `push` capability triggers CSS regeneration
- CSS changes propagate through Vite's HMR for instant visual feedback
- Full export (ts, json) only happens on explicit save or build

## Related Issues
- #565: Studio UI foundations
- #566: Token editing interface
- #567: Live preview system
- #568: Export and sync
- #569: Polish and UX
