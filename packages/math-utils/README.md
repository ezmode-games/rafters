# @rafters/math-utils

> Mathematical utilities for design token generation used across Rafters.

Provides lightweight, well-documented helpers for expression evaluation,
progressions, musical/mathematical ratios, and simple unit-aware arithmetic.

## Install

This package is intended to be consumed via the monorepo workspace. From the
monorepo root you can import it as a workspace package:

```bash
pnpm install
```

Or import in another package:

```ts
import { evaluateExpression } from '@rafters/math-utils';
```

## Key Features

- Safe expression evaluation with ratio and variable substitution (`evaluateExpression`).
- Progression and scale generators (`generateProgression`, `generateModularScale`, `generateMusicalScale`).
- Helpers for interpolation, finding closest progression steps, and Fibonacci-like sequences.
- Unit-aware parsing and simple operations for CSS values (`parseUnit`, `formatUnit`, `calculateWithUnits`, `convertUnit`, `evaluateWithUnits`).

## Quick Examples

```ts
import {
  evaluateExpression,
  calculateProgressionStep,
  generateProgression,
  interpolate,
  parseUnit,
  calculateWithUnits,
  evaluateWithUnits,
} from '@rafters/math-utils';

// Evaluate a math expression using named ratios
evaluateExpression('16 * golden'); // ~25.888

// Get a progression step using golden ratio
calculateProgressionStep(16, 'golden', 2); // number

// Generate a linear progression
generateProgression('linear', { baseValue: 4, steps: 5, includeZero: true });

// Interpolate between two values with easing
interpolate(10, 20, 0.5, 'linear'); // 15

// Work with units
parseUnit('16px'); // { value: 16, unit: 'px' }
calculateWithUnits('16px', '*', 1.5); // '24px'
evaluateWithUnits('base * golden', { base: '16px' }); // '25.888px' (approx)
```

## API Reference (selected)

- `evaluateExpression(expression: string, variables?: Record<string, number>): number` — Evaluate numeric expressions with ratio and variable substitution.
- `calculateProgressionStep(baseValue: number, progressionType: string, step: number, multiplier?: number): number` — Compute a single step for a progression.
- `findClosestProgressionStep(targetValue: number, baseValue: number, progressionType: string, maxSteps?: number)` — Find the nearest progression value.
- `generateProgression(type: ProgressionType, options: ProgressionOptions): number[]` — Generate sequences.
- `generateModularScale(ratio: ProgressionType, baseSize: number, steps?: number)` — Modular typography scale.
- `parseUnit(cssValue: string): UnitValue` — Parse CSS value into numeric value + unit.
- `calculateWithUnits(left: string, operator: '+' | '-' | '*' | '/', right: string | number): string` — Unit-aware operations.
- `convertUnit(value: string, targetUnit: CSSUnit, context?): string` — Simplified unit conversion.
- `evaluateWithUnits(expression: string, variables?: Record<string, string>): string` — Evaluate simple unit expressions.

## Testing

Run tests from the monorepo root:

```bash
pnpm -w test:unit
```

## Notes

- The expression evaluator is intentionally conservative (no `eval`) and uses a
  recursive-descent parser for safety.
- Unit conversion is simplified and requires context for accurate conversions
  (e.g., `rem`/`em` conversions depend on font-size context).

---

Maintainers: Rafters core team