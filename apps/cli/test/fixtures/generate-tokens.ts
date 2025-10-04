/**
 * Test fixtures for generate command tests
 * These provide consistent, reusable test data for token generation
 */

import type { Token } from '@rafters/shared';

// Sample tokens for generation testing
export const sampleColorToken: Token = {
  name: 'primary-500',
  value: '#3b82f6',
  category: 'color',
  namespace: 'color',
  intelligence: {
    cognitiveLoad: 2,
    trustLevel: 'high',
    accessibility: {
      wcagLevel: 'AAA',
      contrastRatio: 7.2,
    },
    semanticMeaning: 'Primary brand color for main actions',
  },
};

export const sampleTypographyToken: Token = {
  name: 'text-base',
  value: '1rem',
  category: 'typography',
  namespace: 'typography',
  intelligence: {
    cognitiveLoad: 1,
    trustLevel: 'high',
    accessibility: {
      wcagLevel: 'AAA',
    },
    semanticMeaning: 'Base body text size',
  },
};

export const sampleSpacingToken: Token = {
  name: 'space-md',
  value: '1rem',
  category: 'spacing',
  namespace: 'spacing',
  intelligence: {
    cognitiveLoad: 1,
    trustLevel: 'medium',
    semanticMeaning: 'Standard spacing for balanced layouts',
  },
};

// Mixed token set for comprehensive testing
export const mixedTokenSet: Token[] = [sampleColorToken, sampleTypographyToken, sampleSpacingToken];

// Multiple tokens of same category for grouping tests
export const multipleColorTokens: Token[] = [
  {
    name: 'red-500',
    value: '#ef4444',
    category: 'color',
    namespace: 'color',
  },
  {
    name: 'blue-500',
    value: '#3b82f6',
    category: 'color',
    namespace: 'color',
  },
];

export const multipleSpacingTokens: Token[] = [
  {
    name: 'space-xs',
    value: '0.25rem',
    category: 'spacing',
    namespace: 'spacing',
  },
  {
    name: 'space-sm',
    value: '0.5rem',
    category: 'spacing',
    namespace: 'spacing',
  },
  {
    name: 'space-md',
    value: '1rem',
    category: 'spacing',
    namespace: 'spacing',
  },
];

// Large token set for performance/scale testing
export const largeColorTokenSet: Token[] = Array.from({ length: 50 }, (_, i) => ({
  name: `color-${i}`,
  value: `#${i.toString(16).padStart(6, '0')}`,
  category: 'color',
  namespace: 'color',
  intelligence: {
    cognitiveLoad: Math.floor(i / 10) + 1,
    semanticMeaning: `Color variant ${i}`,
  },
}));

// Token with comprehensive intelligence metadata
export const comprehensiveIntelligenceToken: Token = {
  name: 'primary-button',
  value: '#3b82f6',
  category: 'color',
  namespace: 'color',
  intelligence: {
    cognitiveLoad: 3,
    trustLevel: 'high',
    accessibility: {
      wcagLevel: 'AAA',
      contrastRatio: 8.5,
      screenReader: true,
    },
    semanticMeaning: 'Primary action color for main user goals',
  },
};

// Token without category (for misc category testing)
export const uncategorizedToken = {
  name: 'uncategorized-token',
  value: 'test',
  namespace: 'misc',
  // No category property
} as Token;

// Empty token set for edge case testing
export const emptyTokenSet: Token[] = [];

// Simple token for basic tests
export const simpleToken: Token = {
  name: 'test-token',
  value: 'test-value',
  category: 'test',
  namespace: 'test',
  intelligence: {
    cognitiveLoad: 1,
    semanticMeaning: 'Test token',
  },
};
