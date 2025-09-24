/**
 * Test fixtures for token validation tests
 * These provide consistent, reusable test data
 */

import type { Token } from '@rafters/shared';

// Valid token samples
export const validColorToken: Token = {
  name: 'primary-500',
  value: '#3b82f6',
  category: 'color',
  namespace: 'color',
  semanticMeaning: 'Primary brand color for main actions',
  trustLevel: 'high',
  cognitiveLoad: 2,
  accessibilityLevel: 'AAA',
  contrastRatio: 7.2,
};

export const validSpacingToken: Token = {
  name: 'space-md',
  value: '1rem',
  category: 'spacing',
  namespace: 'spacing',
  semanticMeaning: 'Standard spacing for balanced layouts',
  cognitiveLoad: 1,
  trustLevel: 'medium',
};

export const validTypographyToken: Token = {
  name: 'text-base',
  value: '1rem',
  category: 'typography',
  namespace: 'typography',
  lineHeight: '1.5',
  semanticMeaning: 'Base body text size',
  cognitiveLoad: 1,
  accessibilityLevel: 'AAA',
};

// Token without intelligence metadata
export const tokenWithoutIntelligence: Omit<Token, 'cognitiveLoad' | 'semanticMeaning'> = {
  name: 'basic-color',
  value: '#ef4444',
  category: 'color',
  namespace: 'color',
};

// Low contrast token for warning tests
export const lowContrastToken: Token = {
  name: 'low-contrast-color',
  value: '#cccccc',
  category: 'color',
  namespace: 'color',
  cognitiveLoad: 2,
  accessibilityLevel: 'AA',
  contrastRatio: 3.0, // Below 4.5 threshold
  semanticMeaning: 'Low contrast color',
};

// Valid token file structure
export const validColorTokenFile = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [validColorToken],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

export const validSpacingTokenFile = {
  category: 'spacing',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [validSpacingToken],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

export const validTypographyTokenFile = {
  category: 'typography',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [validTypographyToken],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

// Invalid token file structures for error testing
export const invalidTokenFileStructure = {
  // Missing required fields
  tokens: [],
};

export const tokenFileWithInvalidToken = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [
    validColorToken,
    {
      // Missing required name field
      value: '#ef4444',
      category: 'color',
      namespace: 'color',
    }
  ],
  metadata: {
    count: 2,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

export const tokenFileWithInconsistentMetadata = {
  category: 'spacing',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [
    { name: 'space-sm', value: '0.5rem', category: 'spacing', namespace: 'spacing' },
    { name: 'space-md', value: '1rem', category: 'spacing', namespace: 'spacing' },
  ],
  metadata: {
    count: 1, // Should be 2
    aiIntelligence: true,
    semanticTokens: true,
  },
};

// Intelligence coverage test fixtures
export const tokenFileWithLowIntelligenceCoverage = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [
    // Only 1 out of 4 tokens has intelligence (25%)
    {
      name: 'intelligent-color',
      value: '#3b82f6',
      category: 'color',
      namespace: 'color',
      cognitiveLoad: 2,
      semanticMeaning: 'Intelligent token'
    },
    {
      name: 'basic-color-1',
      value: '#ef4444',
      category: 'color',
      namespace: 'color',
    },
    {
      name: 'basic-color-2',
      value: '#10b981',
      category: 'color',
      namespace: 'color',
    },
    {
      name: 'basic-color-3',
      value: '#f59e0b',
      category: 'color',
      namespace: 'color',
    }
  ] as Token[],
  metadata: {
    count: 4,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

export const tokenFileWithModerateIntelligenceCoverage = {
  category: 'spacing',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [
    // 6 out of 10 tokens with intelligence = 60%
    { name: 'space-1', value: '1rem', category: 'spacing', namespace: 'spacing', cognitiveLoad: 1 },
    { name: 'space-2', value: '2rem', category: 'spacing', namespace: 'spacing', cognitiveLoad: 1 },
    { name: 'space-3', value: '3rem', category: 'spacing', namespace: 'spacing', cognitiveLoad: 1 },
    { name: 'space-4', value: '4rem', category: 'spacing', namespace: 'spacing', cognitiveLoad: 1 },
    { name: 'space-5', value: '5rem', category: 'spacing', namespace: 'spacing', cognitiveLoad: 1 },
    { name: 'space-6', value: '6rem', category: 'spacing', namespace: 'spacing', cognitiveLoad: 1 },
    { name: 'space-7', value: '7rem', category: 'spacing', namespace: 'spacing' },
    { name: 'space-8', value: '8rem', category: 'spacing', namespace: 'spacing' },
    { name: 'space-9', value: '9rem', category: 'spacing', namespace: 'spacing' },
    { name: 'space-10', value: '10rem', category: 'spacing', namespace: 'spacing' },
  ] as Token[],
  metadata: {
    count: 10,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

export const tokenFileWithHighIntelligenceCoverage = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [
    // 4 out of 5 tokens with intelligence = 80%
    { name: 'color-1', value: '#1', category: 'color', namespace: 'color', cognitiveLoad: 1 },
    { name: 'color-2', value: '#2', category: 'color', namespace: 'color', cognitiveLoad: 1 },
    { name: 'color-3', value: '#3', category: 'color', namespace: 'color', cognitiveLoad: 1 },
    { name: 'color-4', value: '#4', category: 'color', namespace: 'color', cognitiveLoad: 1 },
    { name: 'color-5', value: '#5', category: 'color', namespace: 'color' },
  ] as Token[],
  metadata: {
    count: 5,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

// Token with invalid cognitive load
export const tokenWithInvalidCognitiveLoad = {
  name: 'text-invalid',
  value: '1rem',
  category: 'typography',
  namespace: 'typography',
  cognitiveLoad: 15, // Invalid: should be 1-10
  trustLevel: 'high',
  semanticMeaning: 'Invalid cognitive load'
} as any;

export const tokenFileWithInvalidCognitiveLoad = {
  category: 'typography',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [tokenWithInvalidCognitiveLoad],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

// Token with invalid trust level
export const tokenWithInvalidTrustLevel = {
  name: 'color-invalid',
  value: '#3b82f6',
  category: 'color',
  namespace: 'color',
  cognitiveLoad: 2,
  trustLevel: 'invalid-level', // Invalid enum value
  semanticMeaning: 'Invalid trust level'
} as any;

export const tokenFileWithInvalidTrustLevel = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [tokenWithInvalidTrustLevel],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

// Token with invalid accessibility level
export const tokenWithInvalidAccessibilityLevel = {
  name: 'color-invalid-wcag',
  value: '#3b82f6',
  category: 'color',
  namespace: 'color',
  cognitiveLoad: 2,
  trustLevel: 'high',
  accessibilityLevel: 'AAAA', // Invalid: should be AA or AAA
  contrastRatio: 7.0,
  semanticMeaning: 'Invalid accessibility level'
} as any;

export const tokenFileWithInvalidAccessibilityLevel = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [tokenWithInvalidAccessibilityLevel],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};

// Token file without intelligence for warning test
export const tokenFileWithoutIntelligence = {
  category: 'spacing',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [
    {
      name: 'space-md',
      value: '1rem',
      category: 'spacing',
      namespace: 'spacing',
      // No intelligence metadata
    }
  ],
  metadata: {
    count: 1,
    aiIntelligence: false,
    semanticTokens: true,
  },
};

// Low contrast token file for warning test
export const lowContrastTokenFile = {
  category: 'color',
  version: '1.0.0',
  generated: '2024-01-01T00:00:00.000Z',
  tokens: [lowContrastToken],
  metadata: {
    count: 1,
    aiIntelligence: true,
    semanticTokens: true,
  },
};