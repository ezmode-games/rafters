/**
 * Test Fixtures Generator
 * Using zod-schema-faker for realistic test data generation
 *
 * This module provides factory functions for generating test fixtures
 * from our Zod schemas with sensible defaults and customization options.
 */

import { faker } from '@faker-js/faker';
import { fake, setFaker } from 'zod-schema-faker';
import type {
  ColorValue,
  ComponentManifest,
  CVAIntelligence,
  Intelligence,
  OKLCH,
  Preview,
  Token,
} from '../src/types.js';
import {
  ColorValueSchema,
  ComponentManifestSchema,
  CVAIntelligenceSchema,
  IntelligenceSchema,
  OKLCHSchema,
  PreviewSchema,
  TokenSchema,
} from '../src/types.js';

// Initialize faker with zod-schema-faker
setFaker(faker);

/**
 * Fixture Generation Options
 * Allows seeding for deterministic tests and partial overrides
 */
export interface FixtureOptions<T> {
  seed?: number;
  overrides?: Partial<T>;
}

/**
 * Base fixture generator
 * Wraps zod-schema-faker with seed support and override merging
 */
function generateFixture<T>(schema: import('zod').ZodType<T>, options: FixtureOptions<T> = {}): T {
  const { seed, overrides = {} } = options;

  // Set seed for deterministic generation
  if (seed !== undefined) {
    faker.seed(seed);
  }

  // Generate base fixture
  const baseFixture = fake(schema);

  // Deep merge overrides
  return {
    ...baseFixture,
    ...overrides,
  } as T;
}

/**
 * Generate OKLCH color fixture
 */
export function createOKLCHFixture(options: FixtureOptions<OKLCH> = {}): OKLCH {
  const defaults = {
    l: 0.7,
    c: 0.15,
    h: 250,
    alpha: 1,
  };

  return generateFixture(OKLCHSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate ColorValue fixture with realistic color data
 */
export function createColorValueFixture(options: FixtureOptions<ColorValue> = {}): ColorValue {
  const defaults = {
    name: 'ocean-blue',
    scale: [
      { l: 0.95, c: 0.05, h: 250 },
      { l: 0.9, c: 0.08, h: 250 },
      { l: 0.8, c: 0.12, h: 250 },
      { l: 0.7, c: 0.15, h: 250 },
      { l: 0.6, c: 0.18, h: 250 },
      { l: 0.5, c: 0.2, h: 250 },
      { l: 0.4, c: 0.18, h: 250 },
      { l: 0.3, c: 0.15, h: 250 },
      { l: 0.2, c: 0.12, h: 250 },
      { l: 0.1, c: 0.08, h: 250 },
    ],
    token: 'primary',
    value: '500',
  };

  return generateFixture(ColorValueSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate Token fixture
 */
export function createTokenFixture(options: FixtureOptions<Token> = {}): Token {
  const defaults = {
    name: 'color-primary',
    value: 'oklch(0.7 0.15 250)',
    category: 'color',
    namespace: 'semantic',
    semanticMeaning: 'Primary brand color for main actions',
    usageContext: ['buttons', 'links', 'primary-actions'],
    cognitiveLoad: 3,
    trustLevel: 'medium' as const,
  };

  return generateFixture(TokenSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate CVA Intelligence fixture
 */
export function createCVAIntelligenceFixture(
  options: FixtureOptions<CVAIntelligence> = {}
): CVAIntelligence {
  const defaults = {
    baseClasses: [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'transition-colors',
    ],
    propMappings: [
      {
        propName: 'variant',
        values: {
          default: ['bg-primary', 'text-primary-foreground', 'hover:bg-primary/90'],
          destructive: ['bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/90'],
          outline: ['border', 'border-input', 'hover:bg-accent'],
          ghost: ['hover:bg-accent', 'hover:text-accent-foreground'],
        },
      },
      {
        propName: 'size',
        values: {
          default: ['h-10', 'px-4', 'py-2'],
          sm: ['h-9', 'px-3', 'text-sm'],
          lg: ['h-11', 'px-8'],
          icon: ['h-10', 'w-10'],
        },
      },
    ],
    allClasses: [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'transition-colors',
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90',
      'bg-destructive',
      'text-destructive-foreground',
      'hover:bg-destructive/90',
      'border',
      'border-input',
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'h-10',
      'px-4',
      'py-2',
      'h-9',
      'px-3',
      'text-sm',
      'h-11',
      'px-8',
      'w-10',
    ],
  };

  return generateFixture(CVAIntelligenceSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate Intelligence fixture
 */
export function createIntelligenceFixture(
  options: FixtureOptions<Intelligence> = {}
): Intelligence {
  const defaults = {
    cognitiveLoad: 3,
    attentionEconomics: 'Medium attention required - standard interactive element',
    accessibility:
      'WCAG AA compliant, keyboard navigable, screen reader friendly with proper ARIA labels',
    trustBuilding:
      'Standard trust level - clear visual feedback on interaction, meets user expectations',
    semanticMeaning: 'Primary action trigger for user-initiated operations',
    cva: createCVAIntelligenceFixture(),
  };

  return generateFixture(IntelligenceSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate Preview fixture
 */
export function createPreviewFixture(options: FixtureOptions<Preview> = {}): Preview {
  const defaults = {
    framework: 'react' as const,
    variant: 'default',
    props: { children: 'Click me' },
    compiledJs: 'export default function Button() { return <button>Click me</button>; }',
    sizeBytes: 245,
    cva: {
      baseClasses: ['inline-flex', 'items-center', 'rounded-md'],
      propMappings: [],
      allClasses: ['inline-flex', 'items-center', 'rounded-md'],
    },
    css: '.button { display: inline-flex; }',
    dependencies: ['react', 'clsx'],
  };

  return generateFixture(PreviewSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate ComponentManifest fixture
 */
export function createComponentManifestFixture(
  options: FixtureOptions<ComponentManifest> = {}
): ComponentManifest {
  const defaults = {
    name: 'button',
    type: 'registry:component' as const,
    description: 'A customizable button component with multiple variants and sizes',
    dependencies: ['react', 'clsx', 'tailwind-merge'],
    registryDependencies: [],
    files: [
      {
        path: 'components/ui/button.tsx',
        content: 'export function Button() { return <button />; }',
        type: 'registry:component',
        target: 'components/ui/button.tsx',
      },
    ],
    meta: {
      rafters: {
        version: '1.0.0',
        intelligence: createIntelligenceFixture(),
        usagePatterns: {
          dos: [
            'Use for primary actions',
            'Provide clear, action-oriented labels',
            'Ensure adequate touch target size (44x44px minimum)',
          ],
          nevers: [
            'Never use for navigation (use links instead)',
            'Never disable without explanation',
            'Never use only color to convey state',
          ],
        },
        previews: [createPreviewFixture()],
      },
    },
  };

  return generateFixture(ComponentManifestSchema, {
    ...options,
    overrides: { ...defaults, ...options.overrides },
  });
}

/**
 * Generate multiple fixtures at once
 */
export function createFixtures<T>(
  generator: (options?: FixtureOptions<T>) => T,
  count: number,
  baseOptions: FixtureOptions<T> = {}
): T[] {
  return Array.from({ length: count }, (_, index) =>
    generator({
      ...baseOptions,
      seed: baseOptions.seed !== undefined ? baseOptions.seed + index : undefined,
    })
  );
}
