# Headless Primitives - Documentation Index

**Status**: Navigation Guide
**Version**: 1.0.0
**Last Updated**: 2025-11-03

---

## Overview

This index provides a roadmap to the complete documentation for Rafters' 8 headless accessibility primitives. Read documents in the order listed below for best understanding.

---

## Documentation Architecture

```
Primitives Documentation
│
├── 1. REQUIREMENTS & ARCHITECTURE
│   ├── PRIMITIVES_REQUIREMENTS.md (45KB)
│   │   └── Original requirements specification
│   │       - WCAG 2.2 compliance
│   │       - Section 508 compliance
│   │       - GitHub issue templates
│   │
│   ├── HEADLESS_PRIMITIVES_A11Y_REQUIREMENTS.md (44KB)
│   │   └── Enhanced accessibility requirements
│   │       - WCAG 2.2 AA compliance for 8 primitives
│   │       - ARIA specifications
│   │       - Testing requirements
│   │
│   └── PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md (45KB)
│       └── Original TypeScript patterns
│           - Framework-agnostic design
│           - Stateless primitives
│           - Testing strategy
│
├── 2. CORE TYPESCRIPT ARCHITECTURE
│   └── HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md (35KB) ⭐ NEW
│       └── Definitive TypeScript architecture for 8 primitives
│           - Shared type patterns (CleanupFunction, BasePrimitiveOptions)
│           - Individual primitive specifications with full type signatures
│           - Critical architectural constraints (event handler merging IMPOSSIBLE)
│           - Edge cases TypeScript prevents
│           - SSR safety patterns
│           - Type safety requirements (strict mode, no any)
│
├── 3. FRAMEWORK INTEGRATION
│   ├── HEADLESS_PRIMITIVES_INTEGRATION_PATTERNS.md (44KB)
│   │   └── Framework adapter patterns
│   │       - React, Vue, Svelte integration
│   │       - Event handler merging strategies
│   │       - Common mistakes and anti-patterns
│   │
│   └── PRIMITIVES_REACT_INTEGRATION.md (23KB) ⭐ NEW
│       └── React 19 specific integration guide
│           - Hook wrappers for all 8 primitives
│           - Server component considerations
│           - Type-safe patterns with React
│           - Integration with React Router v7
│
└── 4. COMPONENT MAPPING
    └── SHADCN_PRIMITIVES_MAPPING.md (42KB)
        └── Mapping to shadcn/ui components
            - Which primitives build which components
            - Component composition patterns
            - Migration guide from shadcn
```

---

## Reading Guide

### For Implementation (Start Here)

**Goal**: Implement the 8 vanilla TypeScript primitives

1. **HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md** (35KB) ⭐ START HERE
   - Read this FIRST - it's the definitive architecture
   - Contains complete type signatures for all 8 primitives
   - Documents critical constraints (event handler merging impossible)
   - Provides edge case handling strategies

2. **HEADLESS_PRIMITIVES_A11Y_REQUIREMENTS.md** (44KB)
   - Read SECOND for accessibility requirements
   - WCAG 2.2 AA compliance criteria
   - ARIA specifications for each primitive
   - Testing acceptance criteria

3. **PRIMITIVES_REQUIREMENTS.md** (45KB)
   - Reference as needed for original requirements
   - GitHub issue templates
   - Phase prioritization

### For Framework Integration

**Goal**: Build React/Vue/Svelte wrappers

1. **PRIMITIVES_REACT_INTEGRATION.md** (23KB) ⭐ FOR REACT 19
   - Complete React hook wrappers for all 8 primitives
   - Server component patterns
   - React Router v7 integration

2. **HEADLESS_PRIMITIVES_INTEGRATION_PATTERNS.md** (44KB)
   - General framework patterns (React, Vue, Svelte)
   - Event handler merging strategies
   - Common integration mistakes

### For Component Building

**Goal**: Build shadcn-compatible components

1. **SHADCN_PRIMITIVES_MAPPING.md** (42KB)
   - Which primitives are needed for which components
   - Component composition patterns
   - Migration from shadcn/ui

2. **PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md** (45KB)
   - Original architecture patterns
   - Framework wrapper examples
   - Registry distribution

---

## The 8 Headless Primitives

### Quick Reference

| # | Primitive | Purpose | Key Constraint | Doc Section |
|---|-----------|---------|----------------|-------------|
| 1 | **slot** | Prop merging for composition | ⚠️ Event handler merging IMPOSSIBLE in vanilla JS | [TypeScript Arch §1](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#1-slot-primitive) |
| 2 | **modal** | Focus trap + dismissible layer | Combines focus + escape + outside click | [TypeScript Arch §2](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#2-modal-primitive) |
| 3 | **keyboard** | Type-safe keyboard events | Strict key matching with modifiers | [TypeScript Arch §3](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#3-keyboard-primitive) |
| 4 | **escape-handler** | Escape key coordination | Layer-aware event propagation | [TypeScript Arch §4](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#4-escape-handler-primitive) |
| 5 | **aria** | Type-safe ARIA attributes | Validated against ARIA spec | [TypeScript Arch §5](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#5-aria-primitive) |
| 6 | **sr-manager** | Screen reader announcements | Live region management | [TypeScript Arch §6](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#6-screen-reader-manager-primitive) |
| 7 | **resize** | Element resize observation | ResizeObserver wrapper | [TypeScript Arch §7](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#7-resize-primitive) |
| 8 | **focus** | Focus management utilities | Focus trap + roving focus | [TypeScript Arch §8](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#8-focus-primitive) |

---

## Key Architectural Decisions

### 1. Event Handler Merging is IMPOSSIBLE

**Critical Limitation**: Vanilla JavaScript has NO API to enumerate existing event listeners.

```typescript
// ❌ DOES NOT EXIST
const listeners = element.getEventListeners('click'); // Impossible!

// ❌ Only gets inline handler, not addEventListener
const handler = element.onclick; // Misses all addEventListener handlers
```

**Implications**:
- Vanilla primitives CANNOT merge event handlers
- Framework adapters (React, Vue) CAN merge because they track handlers
- Document this limitation in JSDoc

**Solution**: See [TypeScript Architecture §1](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#1-event-handler-merging-is-impossible-in-vanilla-js)

### 2. Truly Headless

**No Visual Properties**: Primitives NEVER touch:
- `className` (CSS classes)
- `style` (inline styles)
- Any visual rendering concerns

**Exception**: Internal styles for accessibility ONLY (e.g., visually-hidden pattern).

**Rationale**: Complete separation of accessibility logic from visual presentation.

### 3. Stateless Design

**All primitives**:
- Accept current state as input
- Return `CleanupFunction`
- Never manage internal state

**State management** is the consumer's responsibility (React useState, Vue ref, etc.).

### 4. SSR Safety

**All DOM access** must be deferred until function execution:

```typescript
// ✅ SAFE
export function primitive(element: HTMLElement): CleanupFunction {
  if (!isDOMAvailable()) {
    return () => {}; // No-op cleanup
  }
  // Safe to use DOM here
}
```

**Never** access DOM at module load time (crashes in Cloudflare Workers).

### 5. Type-Strict Mode

**All primitives** enforce:
- `strict: true` in tsconfig
- NO `any` types (ESLint rule)
- Branded types for domain constraints (`UniqueId`, `NonEmptyString`)
- Exhaustive type checking

---

## Implementation Phases

### Phase 1: Core Primitives (Priority: Critical)

Implement these first:

1. **focus** - Focus management utilities (needed by modal)
2. **keyboard** - Keyboard event handling (needed by all)
3. **escape-handler** - Escape key coordination (needed by modal)
4. **aria** - ARIA attribute management (needed by all)

### Phase 2: Modal Infrastructure (Priority: High)

Build on Phase 1:

5. **modal** - Combines focus trap + escape + outside click

### Phase 3: Advanced Patterns (Priority: Medium)

Complete remaining primitives:

6. **slot** - Prop merging (asChild pattern)
7. **sr-manager** - Screen reader announcements
8. **resize** - ResizeObserver wrapper

---

## Testing Strategy

### Test Coverage Requirements

- **Minimum**: 90% line coverage, 85% branch coverage
- **Critical paths**: 100% coverage (keyboard handling, ARIA management)
- **SSR safety**: All primitives tested in non-DOM environment

### Test File Organization

Each primitive requires **3 test files**:

1. **Unit Tests**: `test/primitives/[name].test.ts`
   - DOM manipulation
   - Event handling
   - Cleanup behavior
   - SSR safety

2. **Accessibility Tests**: `test/primitives/[name].a11y.ts`
   - WCAG compliance verification
   - ARIA attribute correctness
   - Screen reader compatibility
   - Keyboard navigation

3. **Integration Tests**: `test/integration/[name].spec.ts`
   - Interaction with other primitives
   - Real-world usage scenarios
   - Framework wrapper compatibility

---

## Quick Start for Developers

### 1. Implementing a Primitive

```bash
# Read the architecture
open docs/HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md

# Find your primitive section (e.g., §3 for keyboard)
# Implement following the type signature
# Create 3 test files (unit, a11y, integration)
```

### 2. Building React Wrapper

```bash
# Read React integration guide
open docs/PRIMITIVES_REACT_INTEGRATION.md

# Find your primitive's hook wrapper
# Implement following the pattern
# Test with React component
```

### 3. Creating Component

```bash
# Read shadcn mapping
open docs/SHADCN_PRIMITIVES_MAPPING.md

# Find which primitives you need
# Compose primitives into component
# Add visual styles (Tailwind CSS v4)
```

---

## Document Status

| Document | Status | Version | Last Updated |
|----------|--------|---------|--------------|
| PRIMITIVES_INDEX.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| PRIMITIVES_REACT_INTEGRATION.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| HEADLESS_PRIMITIVES_A11Y_REQUIREMENTS.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| HEADLESS_PRIMITIVES_INTEGRATION_PATTERNS.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| PRIMITIVES_REQUIREMENTS.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md | ✅ Complete | 1.0.0 | 2025-11-03 |
| SHADCN_PRIMITIVES_MAPPING.md | ✅ Complete | 1.0.0 | 2025-11-03 |

---

## Frequently Asked Questions

### Q: Why can't primitives merge event handlers?

**A**: JavaScript has no API to enumerate existing event listeners. See [TypeScript Architecture - Constraint §1](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#1-event-handler-merging-is-impossible-in-vanilla-js).

### Q: Can I use primitives in Vue/Svelte?

**A**: Yes! See [Integration Patterns](./HEADLESS_PRIMITIVES_INTEGRATION_PATTERNS.md) for Vue and Svelte patterns. React-specific patterns are in [React Integration](./PRIMITIVES_REACT_INTEGRATION.md).

### Q: Why are primitives stateless?

**A**: Stateless design ensures:
- Framework-agnostic implementation
- Predictable behavior
- Easy testing
- Consumer controls all state

### Q: How do I handle SSR?

**A**: All primitives check `isDOMAvailable()` before DOM access. See [TypeScript Architecture - SSR Safety](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#2-ssr-safety-no-dom-access-at-module-load).

### Q: What TypeScript version is required?

**A**: TypeScript 5.x with strict mode enabled. See [Type Safety Requirements](./HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md#type-safety-requirements).

---

## Next Steps

1. **Implement primitives**: Start with Phase 1 (focus, keyboard, escape-handler, aria)
2. **Create React hooks**: Build wrappers following React Integration guide
3. **Build components**: Use shadcn mapping to create UI components
4. **Test thoroughly**: Achieve 90%+ coverage with all 3 test types
5. **Document**: Update JSDoc with examples and WCAG links

---

## File Paths (Absolute)

All documentation located at:

```
/home/sean/projects/real-handy/rafters/docs/

├── PRIMITIVES_INDEX.md (this file)
├── HEADLESS_PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md ⭐ CORE
├── PRIMITIVES_REACT_INTEGRATION.md ⭐ REACT
├── HEADLESS_PRIMITIVES_A11Y_REQUIREMENTS.md
├── HEADLESS_PRIMITIVES_INTEGRATION_PATTERNS.md
├── PRIMITIVES_REQUIREMENTS.md
├── PRIMITIVES_TYPESCRIPT_ARCHITECTURE.md
└── SHADCN_PRIMITIVES_MAPPING.md
```

---

**Maintainer**: TypeScript Architecture Team
**Contact**: See project README for contribution guidelines
**License**: See LICENSE file in project root
