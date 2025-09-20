# @rafters/math-utils

Mathematical utilities for design token generation. Provides musical ratios, golden ratio, and sophisticated progression systems for creating harmonious design scales.

## Features

- 🎵 **Musical Intervals**: Minor second, major third, perfect fourth, golden ratio, etc.
- 📐 **Mathematical Progressions**: Linear, exponential, and ratio-based sequences
- 🧮 **Expression Evaluation**: Safe mathematical expression parsing with ratio substitution
- 📏 **Unit-Aware Operations**: CSS unit handling (px, rem, em, %, vw, vh)
- 🎯 **Modular Scales**: Typography and spacing scale generation

## Installation

```bash
pnpm add @rafters/math-utils
```

## Quick Start

```typescript
import {
  generateProgression,
  evaluateExpression,
  MUSICAL_RATIOS
} from '@rafters/math-utils';

// Generate golden ratio progression
const golden = generateProgression('golden', {
  baseValue: 16,
  steps: 5
});
// Result: [16, 25.89, 41.89, 67.77, 109.66]

// Evaluate mathematical expressions
const result = evaluateExpression('16 * golden + 4');
// Result: 29.89

// Create modular typography scale
const scale = generateModularScale('major-third', 16, 5);
// Result: { smaller: [8.19, 10.24, 12.8], base: 16, larger: [20, 25, 31.25, 39.06, 48.83] }
```

## Core Concepts

### Musical Ratios

Based on mathematical ratios from music theory that create harmonious visual progressions:

```typescript
import { MUSICAL_RATIOS } from '@rafters/math-utils';

// Available ratios:
// - minor-second: 1.067 (16:15) - tight, subtle
// - major-second: 1.125 (9:8) - gentle, natural
// - minor-third: 1.2 (6:5) - moderate, balanced
// - major-third: 1.25 (5:4) - strong, noticeable
// - perfect-fourth: 1.333 (4:3) - bold, architectural
// - perfect-fifth: 1.5 (3:2) - classical, powerful
```

### Mathematical Constants

```typescript
import { MATHEMATICAL_CONSTANTS } from '@rafters/math-utils';

// Available constants:
// - golden: 1.618 (φ) - most pleasing to human eye
// - sqrt2: 1.414 - A4 paper ratio, diagonal harmony
// - e: 2.718 - natural exponential
// - pi: 3.142 - circular proportions
```

## API Reference

### Progressions

#### `generateProgression(type, options)`

Generate mathematical sequences using different progression types.

```typescript
// Linear progression
generateProgression('linear', { baseValue: 4, steps: 5, includeZero: true });
// Result: [0, 4, 8, 12, 16]

// Golden ratio progression
generateProgression('golden', { baseValue: 1, steps: 4 });
// Result: [1, 1.618, 2.618, 4.236]

// Musical interval progression
generateProgression('minor-third', { baseValue: 16, steps: 4 });
// Result: [16, 19.2, 23.04, 27.65]
```

#### `generateModularScale(ratio, baseSize, steps)`

Create modular scales for typography and spacing.

```typescript
const scale = generateModularScale('major-third', 16, 3);
// Result: {
//   smaller: [10.24, 12.8, 16],
//   base: 16,
//   larger: [20, 25, 31.25]
// }
```

#### `generateMusicalScale(interval, baseValue, octaves)`

Generate harmonious scales using musical intervals.

```typescript
generateMusicalScale('perfect-fourth', 16, 1);
// Generates 12 steps (1 octave) using perfect fourth ratio
```

### Calculations

#### `evaluateExpression(expression, variables?)`

Safely evaluate mathematical expressions with ratio and variable substitution.

```typescript
// Simple ratio calculation
evaluateExpression('16 * golden'); // 25.888

// Complex expression with variables
evaluateExpression('base * minor-third + spacing', { base: 16, spacing: 4 }); // 23.2

// Nested calculations
evaluateExpression('(base * golden) / perfect-fourth', { base: 12 }); // 14.566
```

#### `calculateProgressionStep(baseValue, type, step, multiplier?)`

Calculate specific step in a progression.

```typescript
// Get 3rd step of golden ratio progression
calculateProgressionStep(16, 'golden', 2); // 41.887

// Get 5th step of linear progression
calculateProgressionStep(4, 'linear', 4); // 20
```

#### `interpolate(start, end, progress, easing?)`

Interpolate between values using mathematical easing.

```typescript
// Linear interpolation
interpolate(10, 20, 0.5, 'linear'); // 15

// Golden ratio easing
interpolate(10, 20, 0.5, 'golden'); // 16.18
```

### Units

#### `calculateWithUnits(left, operator, right)`

Perform mathematical operations while preserving CSS units.

```typescript
calculateWithUnits('16px', '*', 2); // '32px'
calculateWithUnits('1.5rem', '+', '8px'); // Error: Unit mismatch
calculateWithUnits('100%', '/', 2); // '50%'
```

#### `convertUnit(value, targetUnit, context?)`

Convert between CSS units (simplified - requires context for accurate conversion).

```typescript
convertUnit('16px', 'rem', { baseFontSize: 16 }); // '1rem'
convertUnit('50vw', 'px', { viewportWidth: 1920 }); // '960px'
```

## Design System Integration

Perfect for design token generation:

```typescript
// Spacing tokens
const spacing = generateProgression('minor-third', {
  baseValue: 4,
  steps: 12
});

// Typography scale
const typography = generateModularScale('golden', 16, 8);

// Custom calculations
const buttonPadding = evaluateExpression('base * minor-second', { base: 12 });
```

## Advanced Usage

### Custom Ratio Systems

```typescript
// Create Fibonacci-like sequences
const fibonacci = generateFibonacciLike('golden', 10);

// Find closest value in progression
const closest = findClosestProgressionStep(25, 16, 'golden', 10);
// Result: { value: 25.888, step: 1, difference: 0.888 }
```

### Unit-Aware Expressions

```typescript
// Handle complex unit calculations
const result = evaluateWithUnits('16px * 1.5'); // '24px'
const spacing = calculateWithUnits('1rem', '*', 1.618); // '1.618rem'
```

## License

MIT