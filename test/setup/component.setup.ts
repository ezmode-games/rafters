/**
 * Component Testing Setup Configuration
 *
 * Specialized setup for React component testing with:
 * - React 19 testing utilities
 * - Rafters design system context
 * - Accessibility testing integration
 * - Visual regression testing preparation
 */

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// ========================================
// REACT TESTING SETUP
// ========================================

// Auto-cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});

beforeEach(() => {
  // Mock IntersectionObserver for component tests
  global.IntersectionObserver = vi.fn().mockImplementation((_callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }));

  // Mock ResizeObserver for responsive component tests
  global.ResizeObserver = vi.fn().mockImplementation((_callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock matchMedia for responsive testing
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock CSS custom properties for design token testing
  Object.defineProperty(document.documentElement, 'style', {
    value: {
      setProperty: vi.fn(),
      getPropertyValue: vi.fn().mockReturnValue(''),
      removeProperty: vi.fn(),
    },
  });
});

// ========================================
// RAFTERS DESIGN SYSTEM MOCKS
// ========================================

// Mock design tokens for consistent testing
global.mockDesignTokens = {
  colors: {
    primary: '#0066cc',
    'primary-foreground': '#ffffff',
    destructive: '#dc2626',
    'destructive-foreground': '#ffffff',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    'text-sm': '0.875rem',
    'text-base': '1rem',
    'text-lg': '1.125rem',
  },
};

// Mock Tailwind CSS classes for component testing
global.mockTailwindClasses = {
  'bg-primary': 'background-color: #0066cc',
  'text-primary-foreground': 'color: #ffffff',
  'p-4': 'padding: 1rem',
  'rounded-md': 'border-radius: 0.375rem',
};

// ========================================
// ACCESSIBILITY TESTING SETUP
// ========================================

// Enhanced accessibility testing utilities
global.accessibilityUtils = {
  // Check ARIA attributes
  checkAriaAttributes: (element: HTMLElement) => {
    const ariaAttributes = Array.from(element.attributes).filter((attr) =>
      attr.name.startsWith('aria-')
    );
    return ariaAttributes.map((attr) => ({
      name: attr.name,
      value: attr.value,
    }));
  },

  // Check color contrast (mock for unit tests)
  checkColorContrast: vi.fn().mockReturnValue({
    ratio: 4.5,
    aa: true,
    aaa: false,
  }),

  // Check keyboard navigation
  checkKeyboardNavigation: vi.fn().mockReturnValue({
    tabIndex: 0,
    focusable: true,
    keyHandlers: ['Enter', 'Space'],
  }),
};

// ========================================
// VISUAL REGRESSION TESTING SETUP
// ========================================

// Mock for visual regression testing (preparation for future Playwright integration)
global.visualRegressionUtils = {
  captureScreenshot: vi.fn().mockResolvedValue('mock-screenshot-data'),
  compareScreenshots: vi.fn().mockResolvedValue({
    passed: true,
    difference: 0,
  }),
  updateBaseline: vi.fn().mockResolvedValue(true),
};

// ========================================
// COMPONENT INTELLIGENCE TESTING
// ========================================

// Utilities for testing component intelligence annotations
global.componentIntelligenceUtils = {
  // Extract JSDoc intelligence from component
  extractComponentIntelligence: (componentSource: string) => {
    const jsdocPattern = /\/\*\*([\s\S]*?)\*\//;
    const match = componentSource.match(jsdocPattern);
    if (!match) return null;

    return {
      cognitiveLoad: extractAnnotation(match[1], '@cognitive-load'),
      trustLevel: extractAnnotation(match[1], '@trust-building'),
      accessibilityLevel: extractAnnotation(match[1], '@accessibility'),
      usagePatterns: extractAnnotation(match[1], '@usage-patterns'),
    };
  },

  // Validate component follows intelligence guidelines
  validateIntelligenceCompliance: vi.fn().mockReturnValue({
    cognitiveLoadCompliant: true,
    trustPatternsValid: true,
    accessibilityCompliant: true,
    usageGuidelinesFollowed: true,
  }),
};

function extractAnnotation(jsdoc: string, annotation: string): string | null {
  const pattern = new RegExp(`${annotation}\\s+(.+)`);
  const match = jsdoc.match(pattern);
  return match ? match[1].trim() : null;
}

// ========================================
// REACT 19 SPECIFIC TESTING UTILITIES
// ========================================

// Mock React 19 hooks for testing
global.react19TestUtils = {
  // Mock useActionState
  mockUseActionState: vi
    .fn()
    .mockReturnValue([{ pending: false, data: null, error: null }, vi.fn()]),

  // Mock useOptimistic
  mockUseOptimistic: vi.fn().mockReturnValue([[], vi.fn()]),

  // Mock useTransition
  mockUseTransition: vi.fn().mockReturnValue([false, vi.fn()]),

  // Mock use() hook
  mockUse: vi.fn().mockImplementation((promise) => {
    if (promise instanceof Promise) {
      throw promise; // Simulate suspense
    }
    return promise;
  }),
};

// ========================================
// PERFORMANCE TESTING UTILITIES
// ========================================

// Component performance monitoring
global.performanceTestUtils = {
  measureRenderTime: vi.fn().mockReturnValue(16), // 60fps = 16ms
  measureMemoryUsage: vi.fn().mockReturnValue(1024), // KB
  checkForMemoryLeaks: vi.fn().mockReturnValue(false),
  measureBundleSize: vi.fn().mockReturnValue(50), // KB
};
