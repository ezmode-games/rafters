# Rafters V2 Test Strategy

## Overview

Comprehensive testing strategy for the refactored Rafters V2 monorepo with 4 new packages built on W3C DTCG spec compliance.

**Testing Principles:**
- Property-based testing with zocker for schema-driven validation
- Real fixtures over brittle hardcoded mocks
- Test behavior, not implementation details
- MANDATORY accessibility tests for UI components
- Critical path coverage before edge cases

---

## Package-by-Package Test Strategy

### 1. `@rafters/shared` - W3C DTCG Schemas & Types

**Purpose:** Foundation schemas, types, and React components used across all packages.

#### Test File Structure
```
packages/shared/
├── src/
│   ├── types.ts              # Zod schemas (W3C DTCG)
│   ├── components.tsx        # Logo component
│   └── index.ts
└── test/
    ├── types.test.ts         # Schema validation tests
    ├── components.test.tsx   # Component unit tests
    ├── components.a11y.tsx   # MANDATORY: Accessibility tests
    └── fixtures.ts           # Zocker-generated test data
```

#### Critical Test Cases

##### Priority 1: Schema Validation (zocker-driven)
```typescript
// test/types.test.ts
import { zocker } from 'zocker';
import {
  OKLCHSchema,
  TokenSchema,
  ColorValueSchema,
  DesignSystemSchema
} from '../src/types';

describe('OKLCH Schema', () => {
  it('accepts valid OKLCH colors', () => {
    const color = zocker(OKLCHSchema).generate();
    expect(OKLCHSchema.parse(color)).toBeDefined();
  });

  it('enforces lightness bounds [0-1]', () => {
    expect(() => OKLCHSchema.parse({ l: 1.5, c: 0.2, h: 240 }))
      .toThrow();
  });

  it('enforces hue bounds [0-360]', () => {
    expect(() => OKLCHSchema.parse({ l: 0.5, c: 0.2, h: 400 }))
      .toThrow();
  });
});

describe('Token Schema', () => {
  it('generates valid tokens from schema', () => {
    const tokens = zocker(z.array(TokenSchema).length(50)).generate();

    tokens.forEach(token => {
      expect(TokenSchema.parse(token)).toBeDefined();
    });
  });

  it('validates string values', () => {
    const token = { name: 'spacing-4', value: '16px', category: 'spacing', namespace: 'core' };
    expect(TokenSchema.parse(token)).toBeDefined();
  });

  it('validates ColorValue objects', () => {
    const colorValue = zocker(ColorValueSchema).generate();
    const token = {
      name: 'primary',
      value: colorValue,
      category: 'color',
      namespace: 'semantic'
    };
    expect(TokenSchema.parse(token)).toBeDefined();
  });

  it('validates ColorReference objects', () => {
    const token = {
      name: 'button-bg',
      value: { family: 'ocean-blue', position: '500' },
      category: 'color',
      namespace: 'component'
    };
    expect(TokenSchema.parse(token)).toBeDefined();
  });
});
```

##### Priority 2: Component Tests (React)
```typescript
// test/components.test.tsx
import { render, screen } from '@testing-library/react';
import { Logo } from '../src/components';

describe('Logo Component', () => {
  it('renders with default colors', () => {
    render(<Logo />);
    expect(screen.getByTitle('Rafters Logo')).toBeInTheDocument();
  });

  it('applies custom wordmark color', () => {
    const { container } = render(<Logo wordmarkColor="#ff0000" />);
    const wordmark = container.querySelector('.wordmark');
    expect(wordmark).toHaveStyle({ fill: '#ff0000' });
  });

  it('applies custom mark color', () => {
    const { container } = render(<Logo markColor="#0000ff" />);
    const mark = container.querySelector('.mark');
    expect(mark).toHaveStyle({ fill: '#0000ff' });
  });

  it('accepts SVG props', () => {
    render(<Logo aria-label="Custom label" className="custom-class" />);
    const svg = screen.getByLabelText('Custom label');
    expect(svg).toHaveClass('custom-class');
  });
});
```

##### Priority 3: Accessibility Tests (MANDATORY)
```typescript
// test/components.a11y.tsx
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Logo } from '../src/components';

describe('Logo - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Logo />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has accessible SVG title', async () => {
    const { container } = render(<Logo />);
    const title = container.querySelector('title');
    expect(title).toHaveTextContent('Rafters Logo');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains accessibility with custom aria-label', async () => {
    const { container } = render(<Logo aria-label="Company Brand" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Test Fixtures
```typescript
// test/fixtures.ts
import { zocker } from 'zocker';
import { z } from 'zod';
import { OKLCHSchema, TokenSchema, ColorValueSchema } from '../src/types';

export const createOKLCHFixture = () => zocker(OKLCHSchema).generate();

export const createTokenFixture = (overrides?: Partial<z.infer<typeof TokenSchema>>) => {
  const base = zocker(TokenSchema).generate();
  return { ...base, ...overrides };
};

export const createColorValueFixture = () => zocker(ColorValueSchema).generate();

export const createTokenArray = (length: number) =>
  zocker(z.array(TokenSchema).length(length)).generate();
```

#### Coverage Goals
- Schema validation: 100%
- Component rendering: 100%
- Accessibility: 100% (MANDATORY)

---

### 2. `@rafters/color-utils` - OKLCH Color Manipulation

**Purpose:** Pure color manipulation functions using OKLCH color space.

#### Test File Structure
```
packages/color-utils/
├── src/
│   ├── conversion.ts         # OKLCH ↔ Hex conversion
│   ├── manipulation.ts       # Lighten, darken, adjust
│   ├── accessibility.ts      # WCAG contrast calculations
│   ├── harmony.ts            # Color harmonies
│   ├── analysis.ts           # Perceptual analysis
│   ├── generator.ts          # Scale generation
│   └── index.ts
└── test/
    ├── conversion.test.ts    # Conversion accuracy tests
    ├── manipulation.test.ts  # Color manipulation logic
    ├── accessibility.test.ts # WCAG compliance
    ├── harmony.test.ts       # Harmony algorithms
    ├── analysis.test.ts      # Analysis accuracy
    ├── generator.test.ts     # Scale generation
    └── fixtures.ts           # Color test data
```

#### Critical Test Cases

##### Priority 1: Conversion Accuracy (Property-Based)
```typescript
// test/conversion.test.ts
import { describe, it, expect } from 'vitest';
import { zocker } from 'zocker';
import { OKLCHSchema } from '@rafters/shared';
import { oklchToHex, hexToOKLCH, roundOKLCH } from '../src/conversion';

describe('OKLCH ↔ Hex Conversion', () => {
  it('round-trips oklch → hex → oklch', () => {
    const originalColor = zocker(OKLCHSchema).generate();
    const hex = oklchToHex(originalColor);
    const converted = hexToOKLCH(hex);

    // Should be approximately equal (floating point precision)
    expect(roundOKLCH(converted)).toEqual(roundOKLCH(originalColor));
  });

  it('converts valid hex to OKLCH', () => {
    const hex = '#3b82f6'; // Tailwind blue-500
    const oklch = hexToOKLCH(hex);

    expect(oklch.l).toBeGreaterThanOrEqual(0);
    expect(oklch.l).toBeLessThanOrEqual(1);
    expect(oklch.c).toBeGreaterThanOrEqual(0);
    expect(oklch.h).toBeGreaterThanOrEqual(0);
    expect(oklch.h).toBeLessThanOrEqual(360);
  });

  it('handles edge cases', () => {
    // Pure black
    const black = hexToOKLCH('#000000');
    expect(black.l).toBeCloseTo(0);

    // Pure white
    const white = hexToOKLCH('#ffffff');
    expect(white.l).toBeCloseTo(1);

    // Pure gray (achromatic)
    const gray = hexToOKLCH('#808080');
    expect(gray.c).toBeCloseTo(0); // No chroma
  });

  it('throws on invalid hex', () => {
    expect(() => hexToOKLCH('not-a-color')).toThrow();
    expect(() => hexToOKLCH('#gg0000')).toThrow();
  });
});

describe('OKLCH Rounding', () => {
  it('rounds to 2 decimal places for l and c', () => {
    const color = { l: 0.123456, c: 0.234567, h: 123.456 };
    const rounded = roundOKLCH(color);

    expect(rounded.l).toBe(0.12);
    expect(rounded.c).toBe(0.23);
  });

  it('rounds hue to whole degrees', () => {
    const color = { l: 0.5, c: 0.2, h: 123.789 };
    const rounded = roundOKLCH(color);

    expect(rounded.h).toBe(124);
  });
});
```

##### Priority 2: WCAG Accessibility (Critical Path)
```typescript
// test/accessibility.test.ts
import { describe, it, expect } from 'vitest';
import { zocker } from 'zocker';
import { OKLCHSchema } from '@rafters/shared';
import {
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AAA,
  findAccessiblePairs
} from '../src/accessibility';

describe('WCAG Contrast Calculations', () => {
  it('calculates contrast ratio for black/white', () => {
    const black = { l: 0, c: 0, h: 0 };
    const white = { l: 1, c: 0, h: 0 };
    const contrast = getContrastRatio(black, white);

    expect(contrast).toBeCloseTo(21, 1); // 21:1 max contrast
  });

  it('validates AA compliance (4.5:1)', () => {
    const foreground = { l: 0.3, c: 0.1, h: 240 }; // Dark blue
    const background = { l: 0.95, c: 0.05, h: 0 }; // Light gray

    expect(meetsWCAG_AA(foreground, background, 'normal')).toBe(true);
  });

  it('validates AAA compliance (7:1)', () => {
    const foreground = { l: 0.2, c: 0.1, h: 240 };
    const background = { l: 0.98, c: 0.02, h: 0 };

    expect(meetsWCAG_AAA(foreground, background, 'normal')).toBe(true);
  });

  it('finds accessible pairs in scale', () => {
    const scale = Array.from({ length: 10 }, () =>
      zocker(OKLCHSchema).generate()
    );

    const pairs = findAccessiblePairs(scale, 'AA', 'normal');

    // All pairs should meet AA
    pairs.forEach(([indexA, indexB]) => {
      const contrast = getContrastRatio(scale[indexA], scale[indexB]);
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    });
  });
});
```

##### Priority 3: Color Harmony Algorithms
```typescript
// test/harmony.test.ts
import { describe, it, expect } from 'vitest';
import { zocker } from 'zocker';
import { OKLCHSchema } from '@rafters/shared';
import {
  getComplementary,
  getTriadic,
  getAnalogous,
  getTetradic
} from '../src/harmony';

describe('Color Harmonies', () => {
  it('generates complementary color (180° hue shift)', () => {
    const base = { l: 0.5, c: 0.2, h: 240 }; // Blue
    const complement = getComplementary(base);

    expect(complement.h).toBeCloseTo((240 + 180) % 360); // Yellow
    expect(complement.l).toBe(base.l); // Same lightness
    expect(complement.c).toBe(base.c); // Same chroma
  });

  it('generates triadic colors (120° spacing)', () => {
    const base = { l: 0.5, c: 0.2, h: 0 }; // Red
    const triadic = getTriadic(base);

    expect(triadic).toHaveLength(2);
    expect(triadic[0].h).toBeCloseTo(120); // Green
    expect(triadic[1].h).toBeCloseTo(240); // Blue
  });

  it('generates analogous colors (30° spacing)', () => {
    const base = { l: 0.5, c: 0.2, h: 180 };
    const analogous = getAnalogous(base);

    expect(analogous).toHaveLength(2);
    expect(Math.abs(analogous[0].h - base.h)).toBeCloseTo(30, 0);
    expect(Math.abs(analogous[1].h - base.h)).toBeCloseTo(30, 0);
  });
});
```

##### Priority 4: Scale Generation
```typescript
// test/generator.test.ts
import { describe, it, expect } from 'vitest';
import { zocker } from 'zocker';
import { OKLCHSchema } from '@rafters/shared';
import { generateColorScale } from '../src/generator';

describe('Color Scale Generation', () => {
  it('generates 10-step scale with consistent spacing', () => {
    const baseColor = zocker(OKLCHSchema).generate();
    const scale = generateColorScale(baseColor, { steps: 10 });

    expect(scale).toHaveLength(10);

    // Verify lightness progression
    for (let i = 0; i < scale.length - 1; i++) {
      expect(scale[i].l).toBeGreaterThan(scale[i + 1].l);
    }
  });

  it('preserves hue and chroma', () => {
    const baseColor = { l: 0.5, c: 0.2, h: 240 };
    const scale = generateColorScale(baseColor, { steps: 10 });

    scale.forEach(color => {
      expect(color.h).toBeCloseTo(baseColor.h, 1);
      expect(color.c).toBeCloseTo(baseColor.c, 1);
    });
  });

  it('generates scale from lightest to darkest', () => {
    const baseColor = { l: 0.5, c: 0.2, h: 180 };
    const scale = generateColorScale(baseColor, { steps: 10 });

    // First should be lightest
    expect(scale[0].l).toBeGreaterThan(0.9);

    // Last should be darkest
    expect(scale[9].l).toBeLessThan(0.2);
  });
});
```

#### Test Fixtures
```typescript
// test/fixtures.ts
import { zocker } from 'zocker';
import { OKLCHSchema } from '@rafters/shared';

export const createColorFixture = () => zocker(OKLCHSchema).generate();

export const createColorScale = (length = 10) =>
  Array.from({ length }, () => zocker(OKLCHSchema).generate());

export const STANDARD_COLORS = {
  black: { l: 0, c: 0, h: 0 },
  white: { l: 1, c: 0, h: 0 },
  gray: { l: 0.5, c: 0, h: 0 },
  blue: { l: 0.5, c: 0.2, h: 240 },
  red: { l: 0.5, c: 0.2, h: 0 },
  green: { l: 0.5, c: 0.2, h: 120 },
};
```

#### Coverage Goals
- Conversion functions: 100%
- WCAG calculations: 100%
- Harmony algorithms: 100%
- Scale generation: 95%

---

### 3. `@rafters/math-utils` - Mathematical Progressions

**Purpose:** Pure mathematical functions for generating design scales.

#### Test File Structure
```
packages/math-utils/
├── src/
│   ├── constants.ts          # Golden ratio, musical ratios
│   ├── progressions.ts       # Progression generators
│   ├── calculations.ts       # Math operations
│   ├── units.ts              # Unit conversions
│   └── index.ts
└── test/
    ├── progressions.test.ts  # Progression accuracy
    ├── calculations.test.ts  # Math operation tests
    ├── units.test.ts         # Unit conversion tests
    └── fixtures.ts           # Math test data
```

#### Critical Test Cases

##### Priority 1: Progression Accuracy (Property-Based)
```typescript
// test/progressions.test.ts
import { describe, it, expect } from 'vitest';
import { generateProgression, generateModularScale } from '../src/progressions';

describe('Linear Progression', () => {
  it('generates correct linear sequence', () => {
    const progression = generateProgression('linear', {
      baseValue: 4,
      steps: 5
    });

    expect(progression).toEqual([4, 8, 12, 16, 20]);
  });

  it('includes zero when requested', () => {
    const progression = generateProgression('linear', {
      baseValue: 4,
      steps: 5,
      includeZero: true
    });

    expect(progression[0]).toBe(0);
  });
});

describe('Golden Ratio Progression', () => {
  it('generates golden ratio sequence', () => {
    const progression = generateProgression('golden', {
      baseValue: 16,
      steps: 5
    });

    // Each step should be previous * 1.618
    for (let i = 1; i < progression.length; i++) {
      const ratio = progression[i] / progression[i - 1];
      expect(ratio).toBeCloseTo(1.618, 2);
    }
  });
});

describe('Musical Ratio Progressions', () => {
  it('generates major third progression', () => {
    const progression = generateProgression('major-third', {
      baseValue: 16,
      steps: 5
    });

    // Major third = 1.25 ratio
    for (let i = 1; i < progression.length; i++) {
      const ratio = progression[i] / progression[i - 1];
      expect(ratio).toBeCloseTo(1.25, 2);
    }
  });

  it('generates perfect fourth progression', () => {
    const progression = generateProgression('perfect-fourth', {
      baseValue: 16,
      steps: 5
    });

    // Perfect fourth = 1.333 ratio
    for (let i = 1; i < progression.length; i++) {
      const ratio = progression[i] / progression[i - 1];
      expect(ratio).toBeCloseTo(1.333, 2);
    }
  });
});

describe('Modular Scale', () => {
  it('generates bidirectional scale', () => {
    const scale = generateModularScale('major-third', 16, 3);

    expect(scale.base).toBe(16);
    expect(scale.smaller).toHaveLength(3);
    expect(scale.larger).toHaveLength(3);

    // Smaller values should be less than base
    scale.smaller.forEach(value => {
      expect(value).toBeLessThan(scale.base);
    });

    // Larger values should be greater than base
    scale.larger.forEach(value => {
      expect(value).toBeGreaterThan(scale.base);
    });
  });

  it('maintains ratio in both directions', () => {
    const scale = generateModularScale('golden', 16, 5);

    // Check larger progression
    for (let i = 1; i < scale.larger.length; i++) {
      const ratio = scale.larger[i] / scale.larger[i - 1];
      expect(ratio).toBeCloseTo(1.618, 2);
    }

    // Check smaller progression (inverse ratio)
    for (let i = 1; i < scale.smaller.length; i++) {
      const ratio = scale.smaller[i - 1] / scale.smaller[i];
      expect(ratio).toBeCloseTo(1.618, 2);
    }
  });
});
```

##### Priority 2: Unit Conversions
```typescript
// test/units.test.ts
import { describe, it, expect } from 'vitest';
import { pxToRem, remToPx, convertUnit } from '../src/units';

describe('Unit Conversions', () => {
  it('converts px to rem (base 16)', () => {
    expect(pxToRem(16)).toBe(1);
    expect(pxToRem(32)).toBe(2);
    expect(pxToRem(24)).toBe(1.5);
  });

  it('converts rem to px (base 16)', () => {
    expect(remToPx(1)).toBe(16);
    expect(remToPx(2)).toBe(32);
    expect(remToPx(1.5)).toBe(24);
  });

  it('handles custom base sizes', () => {
    expect(pxToRem(20, 20)).toBe(1);
    expect(remToPx(1, 20)).toBe(20);
  });
});
```

##### Priority 3: Mathematical Operations
```typescript
// test/calculations.test.ts
import { describe, it, expect } from 'vitest';
import { clamp, normalize, interpolate } from '../src/calculations';

describe('Mathematical Operations', () => {
  it('clamps values to range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('normalizes values to 0-1 range', () => {
    expect(normalize(50, 0, 100)).toBe(0.5);
    expect(normalize(0, 0, 100)).toBe(0);
    expect(normalize(100, 0, 100)).toBe(1);
  });

  it('interpolates between values', () => {
    expect(interpolate(0, 100, 0.5)).toBe(50);
    expect(interpolate(0, 100, 0)).toBe(0);
    expect(interpolate(0, 100, 1)).toBe(100);
  });
});
```

#### Coverage Goals
- Progression generators: 100%
- Unit conversions: 100%
- Mathematical operations: 100%

---

### 4. `@rafters/design-tokens` - Token Registry & Dependency Graph

**Purpose:** Core token management with intelligent dependency tracking and rule execution.

#### Test File Structure
```
packages/design-tokens/
├── src/
│   ├── registry.ts           # TokenRegistry class
│   ├── dependencies.ts       # Dependency graph
│   ├── generation-rules.ts   # Rule parser/executor
│   ├── rule-engine.ts        # Rule execution engine
│   ├── archive.ts            # SQID archive system
│   ├── export.ts             # Token export
│   ├── plugins/              # Rule type plugins
│   ├── generators/           # Token generators
│   ├── exporters/            # Export formatters
│   └── index.ts
└── test/
    ├── registry.test.ts      # Registry core functionality
    ├── dependencies.test.ts  # Dependency graph tests
    ├── rules.test.ts         # Rule parsing/execution
    ├── plugins/              # Plugin tests
    ├── generators/           # Generator tests
    ├── integration.spec.ts   # End-to-end token system
    └── fixtures.ts           # Token test data
```

#### Critical Test Cases

##### Priority 1: TokenRegistry Core (Integration Tests)
```typescript
// test/registry.test.ts
import { describe, it, expect } from 'vitest';
import { zocker } from 'zocker';
import { TokenSchema } from '@rafters/shared';
import { TokenRegistry } from '../src/registry';

describe('TokenRegistry', () => {
  it('initializes with empty registry', () => {
    const registry = new TokenRegistry();
    expect(registry.size()).toBe(0);
  });

  it('initializes with tokens', () => {
    const tokens = zocker(z.array(TokenSchema).length(10)).generate();
    const registry = new TokenRegistry(tokens);

    expect(registry.size()).toBe(10);
    tokens.forEach(token => {
      expect(registry.get(token.name)).toEqual(token);
    });
  });

  it('adds tokens', () => {
    const registry = new TokenRegistry();
    const token = zocker(TokenSchema).generate();

    registry.add(token);
    expect(registry.get(token.name)).toEqual(token);
  });

  it('updates token values', () => {
    const registry = new TokenRegistry();
    const token = { name: 'spacing-4', value: '16px', category: 'spacing', namespace: 'core' };

    registry.add(token);
    registry.updateToken('spacing-4', '20px');

    expect(registry.get('spacing-4')?.value).toBe('20px');
  });

  it('removes tokens', () => {
    const registry = new TokenRegistry();
    const token = zocker(TokenSchema).generate();

    registry.add(token);
    expect(registry.has(token.name)).toBe(true);

    registry.remove(token.name);
    expect(registry.has(token.name)).toBe(false);
  });

  it('lists tokens with filters', () => {
    const registry = new TokenRegistry();
    const spacingToken = {
      name: 'spacing-4',
      value: '16px',
      category: 'spacing',
      namespace: 'core'
    };
    const colorToken = {
      name: 'primary',
      value: '#3b82f6',
      category: 'color',
      namespace: 'semantic'
    };

    registry.add(spacingToken);
    registry.add(colorToken);

    const spacingTokens = registry.list({ category: 'spacing' });
    expect(spacingTokens).toHaveLength(1);
    expect(spacingTokens[0].name).toBe('spacing-4');

    const semanticTokens = registry.list({ namespace: 'semantic' });
    expect(semanticTokens).toHaveLength(1);
    expect(semanticTokens[0].name).toBe('primary');
  });
});
```

##### Priority 2: Dependency Graph (Critical Path)
```typescript
// test/dependencies.test.ts
import { describe, it, expect } from 'vitest';
import { TokenDependencyGraph } from '../src/dependencies';

describe('TokenDependencyGraph', () => {
  it('tracks simple dependency', () => {
    const graph = new TokenDependencyGraph();

    graph.addDependency('hover-color', ['base-color'], 'state:hover');

    expect(graph.getDependencies('hover-color')).toEqual(['base-color']);
    expect(graph.getDependents('base-color')).toEqual(['hover-color']);
  });

  it('tracks multiple dependencies', () => {
    const graph = new TokenDependencyGraph();

    graph.addDependency('result', ['token-a', 'token-b'], 'calc(token-a + token-b)');

    expect(graph.getDependencies('result')).toEqual(['token-a', 'token-b']);
    expect(graph.getDependents('token-a')).toContain('result');
    expect(graph.getDependents('token-b')).toContain('result');
  });

  it('prevents circular dependencies', () => {
    const graph = new TokenDependencyGraph();

    graph.addDependency('token-a', ['token-b'], 'state:hover');

    expect(() => {
      graph.addDependency('token-b', ['token-a'], 'scale:500');
    }).toThrow('Circular dependency detected');
  });

  it('topological sort orders dependencies correctly', () => {
    const graph = new TokenDependencyGraph();

    // Create chain: base → derived1 → derived2
    graph.addDependency('derived1', ['base'], 'state:hover');
    graph.addDependency('derived2', ['derived1'], 'scale:600');

    const sorted = graph.topologicalSort();

    // Base must come before derived1
    expect(sorted.indexOf('base')).toBeLessThan(sorted.indexOf('derived1'));
    // derived1 must come before derived2
    expect(sorted.indexOf('derived1')).toBeLessThan(sorted.indexOf('derived2'));
  });

  it('removes tokens and cleans up relationships', () => {
    const graph = new TokenDependencyGraph();

    graph.addDependency('derived', ['base'], 'state:hover');
    expect(graph.getDependents('base')).toEqual(['derived']);

    graph.removeToken('derived');
    expect(graph.getDependents('base')).toEqual([]);
  });

  it('validates graph integrity', () => {
    const graph = new TokenDependencyGraph();

    graph.addDependency('valid-a', ['valid-b'], 'calc(valid-b * 2)');
    graph.addDependency('valid-b', [], '');

    const validation = graph.validate();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('handles bulk dependency additions', () => {
    const graph = new TokenDependencyGraph();

    const dependencies = [
      { tokenName: 'derived1', dependsOn: ['base'], rule: 'state:hover' },
      { tokenName: 'derived2', dependsOn: ['base'], rule: 'scale:600' },
      { tokenName: 'derived3', dependsOn: ['derived1'], rule: 'contrast:auto' },
    ];

    graph.addDependencies(dependencies);

    expect(graph.getDependents('base')).toContain('derived1');
    expect(graph.getDependents('base')).toContain('derived2');
    expect(graph.getDependents('derived1')).toContain('derived3');
  });
});
```

##### Priority 3: Rule Execution Engine
```typescript
// test/rules.test.ts
import { describe, it, expect } from 'vitest';
import { TokenRegistry } from '../src/registry';
import { GenerationRuleParser, GenerationRuleExecutor } from '../src/generation-rules';

describe('Generation Rules', () => {
  describe('calc() rule', () => {
    it('parses calc rule', () => {
      const parser = new GenerationRuleParser();
      const rule = parser.parse('calc(spacing-4 * 2)');

      expect(rule.type).toBe('calc');
      expect(rule.expression).toBe('spacing-4 * 2');
      expect(rule.tokens).toContain('spacing-4');
    });

    it('executes calc rule', () => {
      const registry = new TokenRegistry([
        { name: 'spacing-4', value: '16px', category: 'spacing', namespace: 'core' }
      ]);

      const executor = new GenerationRuleExecutor(registry);
      const parser = new GenerationRuleParser();
      const rule = parser.parse('calc(spacing-4 * 2)');

      const result = executor.execute(rule, 'spacing-8');
      expect(result).toBe('32px');
    });
  });

  describe('state:hover rule', () => {
    it('parses state rule', () => {
      const parser = new GenerationRuleParser();
      const rule = parser.parse('state:hover');

      expect(rule.type).toBe('state');
      expect(rule.state).toBe('hover');
    });

    it('executes state rule (darkens color)', () => {
      const registry = new TokenRegistry([
        {
          name: 'button-bg',
          value: { l: 0.5, c: 0.2, h: 240 },
          category: 'color',
          namespace: 'component'
        }
      ]);

      const executor = new GenerationRuleExecutor(registry);
      const parser = new GenerationRuleParser();
      const rule = parser.parse('state:hover');

      const result = executor.execute(rule, 'button-bg-hover', 'button-bg');

      // Should darken the color (reduce lightness)
      expect(result).toHaveProperty('l');
      expect(result.l).toBeLessThan(0.5);
    });
  });

  describe('scale:600 rule', () => {
    it('parses scale rule', () => {
      const parser = new GenerationRuleParser();
      const rule = parser.parse('scale:600');

      expect(rule.type).toBe('scale');
      expect(rule.position).toBe('600');
    });

    it('executes scale rule (extracts from scale)', () => {
      const colorValue = {
        name: 'ocean-blue',
        scale: [
          { l: 0.95, c: 0.1, h: 240 }, // 50
          { l: 0.85, c: 0.12, h: 240 }, // 100
          // ... more scale positions
          { l: 0.5, c: 0.2, h: 240 },  // 600 (index 6)
        ],
        token: 'primary',
        value: '600'
      };

      const registry = new TokenRegistry([
        { name: 'primary', value: colorValue, category: 'color', namespace: 'semantic' }
      ]);

      const executor = new GenerationRuleExecutor(registry);
      const parser = new GenerationRuleParser();
      const rule = parser.parse('scale:600');

      const result = executor.execute(rule, 'primary-600', 'primary');

      expect(result).toEqual({ l: 0.5, c: 0.2, h: 240 });
    });
  });

  describe('contrast:auto rule', () => {
    it('parses contrast rule', () => {
      const parser = new GenerationRuleParser();
      const rule = parser.parse('contrast:auto');

      expect(rule.type).toBe('contrast');
      expect(rule.level).toBe('auto');
    });

    it('executes contrast rule (generates readable foreground)', () => {
      const registry = new TokenRegistry([
        {
          name: 'bg',
          value: { l: 0.9, c: 0.05, h: 0 }, // Light background
          category: 'color',
          namespace: 'component'
        }
      ]);

      const executor = new GenerationRuleExecutor(registry);
      const parser = new GenerationRuleParser();
      const rule = parser.parse('contrast:auto');

      const result = executor.execute(rule, 'fg', 'bg');

      // Should generate dark foreground for light background
      expect(result).toHaveProperty('l');
      expect(result.l).toBeLessThan(0.5);
    });
  });
});
```

##### Priority 4: Integration Tests (End-to-End)
```typescript
// test/integration.spec.ts
import { describe, it, expect } from 'vitest';
import { TokenRegistry } from '../src/registry';

describe('Token System Integration', () => {
  it('regenerates dependent tokens on base token change', async () => {
    const registry = new TokenRegistry([
      { name: 'base', value: '16px', category: 'spacing', namespace: 'core' },
      { name: 'derived', value: '32px', category: 'spacing', namespace: 'core' },
    ]);

    // Add dependency: derived = base * 2
    registry.addDependency('derived', ['base'], 'calc(base * 2)');

    // Change base token
    await registry.set('base', '20px');

    // Derived should auto-update
    expect(registry.get('derived')?.value).toBe('40px');
  });

  it('cascades updates through dependency chain', async () => {
    const registry = new TokenRegistry([
      { name: 'base', value: '16px', category: 'spacing', namespace: 'core' },
      { name: 'level1', value: '32px', category: 'spacing', namespace: 'core' },
      { name: 'level2', value: '64px', category: 'spacing', namespace: 'core' },
    ]);

    registry.addDependency('level1', ['base'], 'calc(base * 2)');
    registry.addDependency('level2', ['level1'], 'calc(level1 * 2)');

    // Change base
    await registry.set('base', '10px');

    // Both levels should cascade
    expect(registry.get('level1')?.value).toBe('20px');
    expect(registry.get('level2')?.value).toBe('40px');
  });

  it('generates complete design system', () => {
    const registry = new TokenRegistry();

    // Add base color
    registry.add({
      name: 'primary',
      value: { l: 0.5, c: 0.2, h: 240 },
      category: 'color',
      namespace: 'semantic'
    });

    // Add derived tokens
    registry.add({
      name: 'primary-hover',
      value: { l: 0.4, c: 0.2, h: 240 },
      category: 'color',
      namespace: 'semantic'
    });

    registry.addDependency('primary-hover', ['primary'], 'state:hover');

    // Validate complete system
    const validation = registry.validateComplete();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
    expect(validation.ruleErrors).toHaveLength(0);
  });
});
```

#### Test Fixtures
```typescript
// test/fixtures.ts
import { zocker } from 'zocker';
import { TokenSchema } from '@rafters/shared';

export const createMinimalRegistry = () => {
  return new TokenRegistry([
    { name: 'spacing-1', value: '4px', category: 'spacing', namespace: 'core' },
    { name: 'spacing-2', value: '8px', category: 'spacing', namespace: 'core' },
    { name: 'spacing-4', value: '16px', category: 'spacing', namespace: 'core' },
    { name: 'primary', value: '#3b82f6', category: 'color', namespace: 'semantic' },
  ]);
};

export const createFullRegistry = () => {
  const tokens = zocker(z.array(TokenSchema).length(100)).generate();
  return new TokenRegistry(tokens);
};
```

#### Coverage Goals
- Registry operations: 100%
- Dependency tracking: 100%
- Rule execution: 95%
- Integration paths: 90%

---

## Test Infrastructure Setup

### Shared Test Utilities

Create `/test/utils/index.ts` at workspace root:

```typescript
import { zocker } from 'zocker';
import type { z } from 'zod';

/**
 * Generate single test data instance from Zod schema
 */
export function generateTestData<T extends z.ZodTypeAny>(
  schema: T,
  seed?: number
): z.infer<T> {
  return zocker(schema, seed ? { seed } : undefined).generate();
}

/**
 * Generate array of test data from Zod schema
 */
export function generateTestArray<T extends z.ZodTypeAny>(
  schema: T,
  length: number,
  seed?: number
): z.infer<T>[] {
  return zocker(z.array(schema).length(length), seed ? { seed } : undefined).generate();
}

/**
 * Create fixture factory with override support
 */
export function createFixtureFactory<T extends z.ZodTypeAny>(
  schema: T,
  baseSeed?: number
) {
  let counter = baseSeed ?? 0;

  return {
    generate(overrides?: Partial<z.infer<T>>): z.infer<T> {
      const base = zocker(schema, { seed: counter++ }).generate();
      return { ...base, ...overrides };
    },
    generateMany(count: number): z.infer<T>[] {
      return Array.from({ length: count }, () => this.generate());
    },
    reset(newSeed: number = 0) {
      counter = newSeed;
    }
  };
}
```

### Vitest Configuration Per Package

Each package should have its own `vitest.config.ts`:

```typescript
// packages/*/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Use 'happy-dom' for React components
    setupFiles: ['../../test/setup.ts'], // Shared setup
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['test/**/*.e2e.{ts,tsx}', 'test/**/*.a11y.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

---

## Testing Order & Priorities

### Phase 1: Foundation (Week 1)
1. **@rafters/shared** - Schema validation tests
   - OKLCH schema validation
   - Token schema validation
   - Component rendering tests
   - **MANDATORY: Accessibility tests**

2. **@rafters/math-utils** - Pure math functions
   - Progression generators (property-based with zocker)
   - Unit conversions
   - Mathematical operations

### Phase 2: Core Functionality (Week 2)
3. **@rafters/color-utils** - Color manipulation
   - Conversion accuracy (property-based)
   - WCAG accessibility (critical path)
   - Color harmonies
   - Scale generation

4. **@rafters/design-tokens** - Token registry (Part 1)
   - Registry CRUD operations
   - Dependency graph basics
   - Rule parsing

### Phase 3: Advanced Features (Week 3)
5. **@rafters/design-tokens** - Token registry (Part 2)
   - Rule execution engine
   - Plugin tests (calc, state, scale, contrast)
   - Generator tests
   - Integration tests (end-to-end)

---

## Property-Based Testing with Zocker

### Why Property-Based Testing?

1. **Schema-driven validation** - Tests work with ANY valid data shape
2. **Auto-generates edge cases** - No need to manually think of all scenarios
3. **Brittle-free tests** - Schema changes automatically propagate
4. **Property guarantees** - "For all valid inputs, these properties hold"

### Example: Color Conversion Properties

```typescript
import { zocker } from 'zocker';
import { OKLCHSchema } from '@rafters/shared';
import { oklchToHex, hexToOKLCH, roundOKLCH } from '@rafters/color-utils';

describe('Color Conversion Properties', () => {
  it('PROPERTY: oklch → hex → oklch preserves color (within precision)', () => {
    // Generate 100 random valid OKLCH colors
    const colors = zocker(z.array(OKLCHSchema).length(100)).generate();

    colors.forEach(originalColor => {
      const hex = oklchToHex(originalColor);
      const converted = hexToOKLCH(hex);

      // Property: Round-trip should preserve color
      expect(roundOKLCH(converted)).toEqual(roundOKLCH(originalColor));
    });
  });

  it('PROPERTY: OKLCH lightness always affects brightness', () => {
    const colors = zocker(z.array(OKLCHSchema).length(50)).generate();

    colors.forEach(color => {
      const darker = { ...color, l: Math.max(0, color.l - 0.1) };
      const lighter = { ...color, l: Math.min(1, color.l + 0.1) };

      const darkerHex = oklchToHex(darker);
      const lighterHex = oklchToHex(lighter);

      // Property: Lower lightness = darker hex value
      expect(parseInt(darkerHex.slice(1), 16))
        .toBeLessThan(parseInt(lighterHex.slice(1), 16));
    });
  });
});
```

---

## Accessibility Testing Requirements

### MANDATORY for All UI Components

Every component in `@rafters/shared` and `@rafters/ui` MUST have:

1. **Unit tests** (`.test.tsx`) - Rendering and behavior
2. **Accessibility tests** (`.a11y.tsx`) - **MANDATORY**

### Vitest-Axe Setup

```bash
pnpm add -D vitest-axe
```

```typescript
// test/setup.ts
import { configureAxe } from 'vitest-axe';

configureAxe({
  rules: {
    region: { enabled: false } // Disable for unit tests
  }
});
```

### Component Accessibility Checklist

- [ ] No axe violations
- [ ] Keyboard navigation works
- [ ] ARIA attributes present
- [ ] Color contrast meets WCAG AA minimum
- [ ] Focus indicators visible
- [ ] Screen reader announcements tested

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [shared, color-utils, math-utils, design-tokens]

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm --filter=@rafters/${{ matrix.package }} test

      - name: Run accessibility tests
        run: pnpm --filter=@rafters/${{ matrix.package }} test:a11y

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./packages/${{ matrix.package }}/coverage/coverage-final.json
```

---

## Success Metrics

### Coverage Targets
- **Shared package**: 95% overall, 100% schemas
- **Color utils**: 95% overall, 100% WCAG functions
- **Math utils**: 100% (pure functions)
- **Design tokens**: 90% overall, 100% registry core

### Quality Gates
- [ ] All tests passing
- [ ] No skipped tests (without documented reason)
- [ ] Coverage thresholds met
- [ ] MANDATORY accessibility tests present for all components
- [ ] Property-based tests for critical algorithms
- [ ] Integration tests for end-to-end flows

---

## Next Steps

1. **Review this strategy** with team
2. **Set up test infrastructure** (vitest.config.ts, test utilities)
3. **Start with Phase 1** (@rafters/shared schemas)
4. **Iterate based on refactoring progress**
5. **Maintain test-first mindset** as W3C DTCG refactoring proceeds

---

## Questions & Decisions Needed

1. **Coverage thresholds** - Are 80-95% targets acceptable?
2. **Test data seeds** - Should we use deterministic seeds for repeatability?
3. **Integration test scope** - How much end-to-end testing vs unit testing?
4. **Performance benchmarks** - Should we add performance regression tests?
5. **Visual regression** - Explicitly excluded per agent prompt - confirm?

---

## Appendix: Example Test Commands

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter=@rafters/design-tokens test

# Watch mode during development
pnpm --filter=@rafters/color-utils test:watch

# Coverage report
pnpm --filter=@rafters/shared test:coverage

# Run only accessibility tests
pnpm test:a11y

# Run integration tests
pnpm test:integration
```

---

**Document Status:** Draft for Review
**Last Updated:** 2025-11-03
**Next Review:** After Phase 1 completion
