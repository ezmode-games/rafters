# Tailwind CSS v4 Requirements Documentation

## Overview

This document outlines the exact specifications that Rafters token generators must follow to produce Tailwind CSS v4 compatible output. These requirements are enforced through comprehensive test suites.

## @theme Block Requirements

### Token Naming Convention

Tailwind CSS v4 expects specific CSS variable naming patterns within the `@theme` block:

```css
@theme {
  /* Spacing tokens */
  --spacing-0: 0rem;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  
  /* Color tokens */
  --color-primary: oklch(0.45 0.12 240);
  --color-background: oklch(1 0 0);
  
  /* Typography tokens */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  
  /* Border radius tokens */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  
  /* Motion tokens */
  --duration-fast: 150ms;
  --ease-smooth: ease-in-out;
}
```

### Automatic Utility Generation

Tailwind CSS v4 automatically generates utility classes from properly named tokens:

- `--spacing-4` → `p-4`, `m-4`, `gap-4`, etc.
- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`, etc.
- `--text-lg` → `text-lg`
- `--radius-md` → `rounded-md`

### What NOT to Include

**❌ Manual Responsive Variants**: Tailwind v4 generates these automatically
```css
/* DON'T generate these in @theme block */
--spacing-sm-4: 1rem;
--spacing-md-4: 1.25rem;
--color-primary-lg: oklch(...);
```

**❌ Complex Utility Classes**: Let Tailwind generate them
```css
/* DON'T generate manual utilities */
.px-4 { padding-left: 1rem; padding-right: 1rem; }
```

## Dark Mode Architecture

### Token Generation
Generate both light and dark tokens in the `@theme` block:

```css
@theme {
  /* Light tokens */
  --color-background: oklch(1 0 0);
  --color-primary: oklch(0.45 0.12 240);
  
  /* Dark variants */
  --color-background-dark: oklch(0.09 0 0);
  --color-primary-dark: oklch(0.8 0.05 240);
}
```

### Semantic Mapping
Map semantic tokens to appropriate variants using **only token references**:

```css
:root {
  --background: var(--color-background);
  --primary: var(--color-primary);

  @media (prefers-color-scheme: dark) {
    --background: var(--color-background-dark);  /* ✅ Token reference */
    --primary: var(--color-primary-dark);        /* ✅ Token reference */
    /* ❌ NEVER: --background: oklch(0.09 0 0); hardcoded values */
  }
}
```

### Custom Dark Mode Variant
Include the custom variant declaration:

```css
@custom-variant dark (@media (prefers-color-scheme: dark));
```

## Required CSS Structure

### 1. Imports and Variants
```css
@import "tailwindcss";
@custom-variant dark (@media (prefers-color-scheme: dark));
```

### 2. Main @theme Block
Contains all base tokens that Tailwind uses for utility generation.

### 3. Accessibility Features
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Base Styles
```css
@layer base {
  body {
    line-height: 1.5; /* WCAG AAA requirement */
  }
}
```

### 5. Custom Utilities (Optional)
```css
@layer utilities {
  /* Only utilities that don't exist in Tailwind */
  .z-modal { z-index: var(--z-modal); }
  .z-tooltip { z-index: var(--z-tooltip); }
}
```

## Token Categories

### Spacing Tokens
- **Format**: `--spacing-{name}: {value}`
- **Values**: Must use `rem` units
- **Names**: Numeric (`0`, `1`, `2`) or semantic (`xs`, `sm`, `md`)

### Color Tokens
- **Format**: `--color-{name}: oklch({l} {c} {h})`
- **Color Space**: OKLCH preferred for perceptual uniformity
- **Dark Variants**: `--color-{name}-dark: oklch(...)`

### Typography Tokens
- **Font Size**: `--text-{size}: {value}rem`
- **Line Height**: `--text-{size}--line-height: {ratio}`
- **Pairing**: Each font size should have corresponding line height

### Motion Tokens
- **Duration**: `--duration-{speed}: {value}ms`
- **Easing**: `--ease-{name}: {cubic-bezier or keyword}`

## Validation Checklist

### ✅ Token Generation
- [ ] Only base tokens generated (no responsive variants)
- [ ] Consistent naming convention followed
- [ ] Reasonable token count (50-150 base tokens)
- [ ] All tokens have proper namespace

### ✅ Dark Mode
- [ ] Dark tokens generated alongside light tokens
- [ ] Semantic mappings use token references only
- [ ] No hardcoded OKLCH values in media queries
- [ ] Custom dark variant declared

### ✅ CSS Structure
- [ ] Valid CSS syntax (balanced braces, semicolons)
- [ ] Proper @theme block structure
- [ ] Accessibility features included
- [ ] No external dependencies

### ✅ Utility Generation Support
- [ ] Tokens enable standard Tailwind utilities
- [ ] Custom utilities only for missing functionality
- [ ] Semantic z-index utilities included

## Test Suite Coverage

The comprehensive test suites validate:

1. **Generator Tests** (`generators.test.ts`):
   - Token object structure and metadata
   - Mathematical relationships in scaling systems
   - Format-agnostic token generation
   - Consistent naming patterns

2. **Tailwind Exporter Tests** (`tailwind-exporter.test.ts`):
   - @theme block structure and token naming
   - Dark mode architecture with token references
   - CSS syntax validity and structure
   - Utility class generation support
   - Accessibility compliance
   - Error handling for edge cases

## Implementation Notes

### Performance
- Base token count should be reasonable (50-150 tokens)
- Avoid generating thousands of responsive variants
- Let Tailwind handle utility generation

### Maintainability
- All OKLCH values centralized in @theme block
- Dark mode uses token references, not hardcoded values
- Semantic tokens provide stable API for components

### Extensibility
- Custom utilities for functionality not in Tailwind
- Semantic z-index system for layering
- Motion tokens with reduced motion support

This specification ensures that Rafters generates clean, performant, and maintainable Tailwind CSS v4 compatible stylesheets.