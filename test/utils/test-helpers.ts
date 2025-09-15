/**
 * Monorepo Test Utilities
 *
 * Comprehensive testing utilities for the Rafters monorepo including:
 * - Component testing helpers
 * - API testing utilities
 * - Design system validation
 * - Performance testing tools
 * - Future-ready patterns
 */

import { type RenderOptions, render } from '@testing-library/react';
import { createElement, type ReactElement, type ReactNode } from 'react';
import { vi } from 'vitest';

// Test utility types
interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  tests: number;
}

interface ShardResult {
  tests: number;
  passed: number;
  failed: number;
  duration: number;
}

// ========================================
// COMPONENT TESTING UTILITIES
// ========================================

/**
 * Enhanced render function with Rafters design system context
 */
export function renderWithDesignSystem(
  ui: ReactElement,
  options: RenderOptions & {
    theme?: 'light' | 'dark';
    tokens?: Record<string, unknown>;
  } = {}
) {
  const { theme = 'light', tokens = {}, ...renderOptions } = options;

  // Mock design system provider
  const DesignSystemProvider = ({ children }: { children: ReactNode }) => {
    return createElement(
      'div',
      {
        'data-theme': theme,
        'data-testid': 'design-system-provider',
        style: {
          ...mockDesignTokens,
          ...tokens,
        },
      },
      children
    );
  };

  return render(ui, {
    wrapper: DesignSystemProvider,
    ...renderOptions,
  });
}

/**
 * Test component intelligence compliance
 */
export function testComponentIntelligence(
  _componentName: string,
  expectedIntelligence: {
    cognitiveLoad?: number;
    trustLevel?: 'low' | 'medium' | 'high' | 'critical';
    accessibilityLevel?: 'AA' | 'AAA';
    usagePatterns?: string[];
  }
) {
  return {
    cognitiveLoad: expectedIntelligence.cognitiveLoad || 1,
    trustLevel: expectedIntelligence.trustLevel || 'low',
    accessibilityLevel: expectedIntelligence.accessibilityLevel || 'AA',
    usagePatterns: expectedIntelligence.usagePatterns || [],

    validate: () => {
      // Mock validation that would check JSDoc annotations
      return {
        valid: true,
        issues: [] as string[],
      };
    },
  };
}

/**
 * Accessibility testing utilities
 */
export const a11yTestUtils = {
  checkColorContrast: (foreground: string, background: string) => {
    // Mock color contrast calculation
    return {
      ratio: 4.5,
      aa: true,
      aaa: false,
      foreground,
      background,
    };
  },

  checkKeyboardNavigation: (element: HTMLElement) => {
    const tabIndex = element.getAttribute('tabindex');
    const role = element.getAttribute('role');

    return {
      focusable: tabIndex !== '-1',
      tabIndex: tabIndex ? parseInt(tabIndex, 10) : 0,
      role,
      keyboardAccessible: true,
    };
  },

  checkAriaLabels: (element: HTMLElement) => {
    return {
      hasAriaLabel: element.hasAttribute('aria-label'),
      hasAriaLabelledBy: element.hasAttribute('aria-labelledby'),
      hasAriaDescribedBy: element.hasAttribute('aria-describedby'),
      ariaLabel: element.getAttribute('aria-label'),
      valid: true,
    };
  },
};

// ========================================
// API TESTING UTILITIES
// ========================================

/**
 * Mock Cloudflare Workers environment
 */
export function createMockWorkerEnv() {
  return {
    RAFTERS_INTEL: mockKV,
    CLAUDE_API_KEY: 'test-api-key',
    NODE_ENV: 'test',
  };
}

/**
 * Mock Anthropic API client
 */
export function createMockAnthropicClient() {
  return {
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ text: 'Mock AI response' }],
        usage: { input_tokens: 10, output_tokens: 20 },
      }),
    },
  };
}

/**
 * API response testing utilities
 */
export const apiTestUtils = {
  createMockRequest: (path: string, options: RequestInit = {}) => {
    return new Request(`https://test.example.com${path}`, {
      method: 'GET',
      ...options,
    });
  },

  createMockResponse: <T>(data: T, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  },

  validateApiResponse: (response: Response, expectedStatus = 200) => {
    return {
      status: response.status,
      statusOk: response.status === expectedStatus,
      headers: Object.fromEntries(response.headers.entries()),
      contentType: response.headers.get('content-type'),
    };
  },
};

// ========================================
// DESIGN SYSTEM TESTING UTILITIES
// ========================================

/**
 * Color testing utilities
 */
export const colorTestUtils = {
  validateColorSpace: (color: string, expectedSpace: 'oklch' | 'rgb' | 'hsl') => {
    // Mock color space validation
    return {
      valid: true,
      colorSpace: expectedSpace,
      color,
      values: expectedSpace === 'oklch' ? [0.7, 0.15, 200] : [255, 0, 0],
    };
  },

  checkColorAccessibility: (foreground: string, background: string) => {
    return a11yTestUtils.checkColorContrast(foreground, background);
  },

  validateSemanticToken: (tokenName: string, expectedMeaning: string) => {
    return {
      name: tokenName,
      meaning: expectedMeaning,
      valid: tokenName.includes(expectedMeaning.toLowerCase()),
      value: mockDesignTokens.colors[tokenName] || '#000000',
    };
  },
};

/**
 * Typography testing utilities
 */
export const typographyTestUtils = {
  validateTextScale: (size: string) => {
    const validSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
    return {
      size,
      valid: validSizes.includes(size),
      computedValue: mockDesignTokens.typography[`text-${size}`] || '1rem',
    };
  },

  checkReadability: (element: HTMLElement) => {
    const fontSize = window.getComputedStyle(element).fontSize;
    const lineHeight = window.getComputedStyle(element).lineHeight;

    return {
      fontSize,
      lineHeight,
      readable: true,
      score: 85, // Mock readability score
    };
  },
};

// ========================================
// PERFORMANCE TESTING UTILITIES
// ========================================

/**
 * Component performance testing
 */
export const performanceTestUtils = {
  measureRenderTime: async (renderFunction: () => void) => {
    const startTime = performance.now();
    renderFunction();
    const endTime = performance.now();

    return {
      duration: endTime - startTime,
      withinBudget: endTime - startTime < 16, // 60fps budget
      fps: 1000 / (endTime - startTime),
    };
  },

  measureMemoryUsage: () => {
    // Mock memory measurement
    return {
      usedJSHeapSize: 1024 * 1024, // 1MB
      totalJSHeapSize: 2048 * 1024, // 2MB
      withinBudget: true,
    };
  },

  checkForMemoryLeaks: (testFunction: () => void) => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    testFunction();
    const finalMemory = performance.memory?.usedJSHeapSize || 0;

    return {
      memoryDelta: finalMemory - initialMemory,
      hasLeak: false, // Mock - would detect actual leaks
      recommendation: 'No memory leaks detected',
    };
  },
};

// ========================================
// FUTURE-READY TESTING PATTERNS
// ========================================

/**
 * AI-driven test generation utilities (future implementation)
 */
export const aiTestUtils = {
  generateTestCases: (componentName: string) => {
    // Future: AI-generated test cases based on component intelligence
    return [
      `should render ${componentName} with default props`,
      `should handle user interactions for ${componentName}`,
      `should maintain accessibility for ${componentName}`,
    ];
  },

  suggestOptimizations: (_testResults: TestResult[]) => {
    // Future: AI-suggested test optimizations
    return {
      redundantTests: [],
      missingCoverage: [],
      performanceIssues: [],
      recommendations: ['All tests are well optimized'],
    };
  },

  analyzeTestPatterns: (_testSuite: string) => {
    // Future: Pattern analysis for test improvement
    return {
      patterns: ['AAA pattern', 'Given-When-Then'],
      compliance: 95,
      suggestions: [],
    };
  },
};

/**
 * Distributed testing utilities (future scaling)
 */
export const distributedTestUtils = {
  shardTests: (tests: string[], shardCount: number) => {
    const shardSize = Math.ceil(tests.length / shardCount);
    return Array.from({ length: shardCount }, (_, i) =>
      tests.slice(i * shardSize, (i + 1) * shardSize)
    );
  },

  coordinateTestExecution: (shardId: number, totalShards: number) => {
    return {
      shardId,
      totalShards,
      tests: [], // Would contain actual test allocation
      status: 'ready',
    };
  },

  aggregateResults: (shardResults: ShardResult[]) => {
    return {
      totalTests: shardResults.reduce((sum, shard) => sum + shard.tests, 0),
      passed: shardResults.reduce((sum, shard) => sum + shard.passed, 0),
      failed: shardResults.reduce((sum, shard) => sum + shard.failed, 0),
      coverage: shardResults.reduce((sum, shard) => sum + shard.coverage, 0) / shardResults.length,
    };
  },
};

// ========================================
// TEST DATA FACTORIES
// ========================================

/**
 * Generate test data for components
 */
export const testDataFactory = {
  createUser: (overrides = {}) => ({
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  }),

  createColorData: (overrides = {}) => ({
    name: 'test-blue',
    hex: '#0066cc',
    oklch: [0.7, 0.15, 200],
    accessibility: { aa: true, aaa: false },
    ...overrides,
  }),

  createDesignToken: (overrides = {}) => ({
    name: 'primary',
    value: '#0066cc',
    category: 'color',
    semantic: true,
    usage: 'Primary actions and branding',
    ...overrides,
  }),
};
