import Sqids from 'sqids';
import { z } from 'zod';
import { type GrayscaleDesignSystem, defaultGrayscaleSystem } from './grayscale';

/**
 * @rafters/design-tokens
 *
 * Generated design systems and semantic tokens for the Rafters AI intelligence system.
 * This package manages design token generation and Tailwind CSS output.
 */

const TokenSchema = z.object({
  name: z.string().min(2).max(100),
  value: z.string().max(200), // Increased for complex values like rgba() and calc()
  description: z.string().max(500).optional(),
  category: z.enum([
    'color',
    'typography',
    'spacing',
    'state',
    'timing',
    'opacity',
    'scaling',
    'border',
    'shadow',
    'aspect',
  ]),
  type: z.enum(['static', 'dynamic']),
  // Semantic groupings for AI intelligence
  semanticGroup: z
    .enum([
      'core',
      'brand',
      'interactive',
      'semantic-state',
      'consequence',
      'sensitivity',
      'validation',
      'component',
      'golden-ratio',
    ])
    .optional(),
  // Accessibility and intelligence metadata
  aiIntelligence: z
    .object({
      cognitiveLoad: z.number().min(1).max(10).optional(),
      trustLevel: z.enum(['low', 'medium', 'high']).optional(),
      accessibilityLevel: z.enum(['aa', 'aaa']).optional(),
      consequence: z.enum(['reversible', 'significant', 'permanent', 'destructive']).optional(),
      sensitivity: z.enum(['public', 'personal', 'financial', 'critical']).optional(),
    })
    .optional(),
});

const DesignSystemSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  tokens: z.array(TokenSchema),
});

const DesignSystemIdSchema = z.string();

type GetIdFunction = () => z.infer<typeof DesignSystemIdSchema>;

const getId: GetIdFunction = (): z.infer<typeof DesignSystemIdSchema> => {
  const sqids = new Sqids();
  return sqids.encode([Date.now()]);
};

/**
 * Generate spacing tokens for Tailwind CSS --spacing-* variables
 */
const generateSpacingTokens = (config: {
  baseUnit?: number;
  scale: 'linear' | 'golden' | 'custom';
  customValues?: Record<string, number>;
}): z.infer<typeof TokenSchema>[] => {
  const { baseUnit = 16, scale, customValues } = config;
  const baseRem = baseUnit / 16; // Convert base unit to rem
  const spacingKeys = [
    '0',
    'px',
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '5',
    '6',
    '8',
    '10',
    '12',
    '16',
    '20',
    '24',
    '32',
    '40',
    '48',
    '56',
    '64',
  ];

  return spacingKeys.map((key) => {
    let value: string;

    if (key === '0') {
      value = '0';
    } else if (key === 'px') {
      value = '1px';
    } else {
      const numKey = Number.parseFloat(key);
      let remValue: number;

      switch (scale) {
        case 'linear':
          // Linear progression: consistent 0.25rem increments (4px steps)
          remValue = numKey * 0.25; // 0.25rem base unit (4px at 16px base)
          break;

        case 'golden': {
          // Golden ratio progression
          const phi = 1.618;
          remValue = phi ** (numKey - 4) * 1; // Base at key '4' = 1rem
          break;
        }

        case 'custom':
          // Use provided custom values or fallback to linear
          if (customValues && customValues[key] !== undefined) {
            remValue = customValues[key];
          } else {
            remValue = numKey * 0.25; // Fallback to linear
          }
          break;

        default:
          remValue = numKey * 0.25;
      }

      value = `${(remValue * baseRem).toFixed(3)}rem`;
    }

    return {
      name: `--spacing-${key}`,
      value,
      description: `Spacing scale ${key} using ${scale} progression`,
      category: 'spacing' as const,
      type: 'static' as const,
      semanticGroup: scale === 'golden' ? 'golden-ratio' : 'core',
    };
  });
};

/**
 * Generate shadow tokens that match Tailwind's default shadow system
 */
const generateShadowTokens = (config: {
  baseUnit?: number;
  scale: 'linear' | 'golden' | 'custom';
  customValues?: Record<string, string>;
}): z.infer<typeof TokenSchema>[] => {
  const { scale, customValues } = config;

  // Tailwind's default shadow values as base
  const defaultShadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  };

  const shadowLevels = ['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'inner', 'none'];

  return shadowLevels.map((level) => {
    let shadowValue: string;

    if (scale === 'custom' && customValues?.[level]) {
      shadowValue = customValues[level];
    } else if (scale === 'linear' || scale === 'golden') {
      // Use default as base, could enhance this later with actual scaling
      shadowValue = defaultShadows[level as keyof typeof defaultShadows];
    } else {
      shadowValue = defaultShadows[level as keyof typeof defaultShadows];
    }

    return {
      name: level === 'DEFAULT' ? '--shadow' : `--shadow-${level}`,
      value: shadowValue,
      description: `Shadow depth level ${level}`,
      category: 'shadow' as const,
      type: 'static' as const,
      semanticGroup: 'core',
    };
  });
};

/**
 * Smart color that auto-generates states with AAA compliance
 */
const SmartColorSchema = z
  .object({
    value: z.string(),
    hover: z.string().optional(),
    dark: z.string().optional(),
  })
  .transform((data) => {
    // Use color-utils to generate missing states
    const hover = data.hover || `calc-hover(${data.value})`;
    const dark = data.dark || `calc-dark(${data.value})`;

    return {
      base: data.value,
      hover,
      dark,
      darkHover: `calc-dark(${hover})`,
    };
  });

/**
 * Convert grayscale system to tokens
 */
const getGrayscaleTokens = (): z.infer<typeof TokenSchema>[] => {
  // Use the strongly-typed grayscale system
  const gs = defaultGrayscaleSystem;

  return [
    // Extract all tokens from the design system
    ...Object.values(gs.colors),
    ...Object.values(gs.typography),
    ...Object.values(gs.spacing),
    ...Object.values(gs.state),
  ] as z.infer<typeof TokenSchema>[];
};

/**
 * Get a design system by its ID. Returns grayscale (000000) by default.
 * I expect this to be overloaded on the service website with one that fetches from the database.
 * @param id string - The ID of the design system. Defaults to '000000' (grayscale).
 * @returns The rich design system object with all intelligence.
 */
const getDesignSystem = (id = '000000'): GrayscaleDesignSystem => {
  if (id === '000000') {
    return defaultGrayscaleSystem;
  }

  // TODO: Fetch from database for other IDs
  throw new Error(`Design system ${id} not found`);
};

/**
 * Export tokens as Tailwind CSS v4 @theme format
 */
export const exportToTailwindTheme = (designSystem: z.infer<typeof DesignSystemSchema>): string => {
  const lines: string[] = ['@theme {'];

  // Group tokens by category
  const tokensByCategory = designSystem.tokens.reduce(
    (acc, token) => {
      if (!acc[token.category]) {
        acc[token.category] = [];
      }
      acc[token.category].push(token);
      return acc;
    },
    {} as Record<string, z.infer<typeof TokenSchema>[]>
  );

  // Output each category
  for (const [category, tokens] of Object.entries(tokensByCategory)) {
    lines.push(`  /* ${category.charAt(0).toUpperCase() + category.slice(1)} tokens */`);
    for (const token of tokens) {
      lines.push(`  ${token.name}: ${token.value};`);
    }
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
};

// Export the schemas and functions
export {
  TokenSchema,
  DesignSystemSchema,
  getDesignSystem,
  generateSpacingTokens,
  generateShadowTokens,
};

// Export from other modules
export * from './grayscale';
export * from './color-tool';
export { designSystemsAPI } from './api';
export * from './cli';
