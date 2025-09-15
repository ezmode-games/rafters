/**
 * Global Test Setup for Rafters UI Package
 *
 * Configures testing environment for:
 * - React 19 compatibility
 * - Design intelligence validation
 * - Accessibility testing
 * - Component testing utilities
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// React 19 compatibility setup
beforeAll(() => {
  // Enable React 19 concurrent features for testing
  if (typeof window !== 'undefined') {
    // @ts-expect-error - React 19 internal flag
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      isDisabled: true,
      supportsFiber: true,
      inject: () => {},
      onCommitFiberRoot: () => {},
      onCommitFiberUnmount: () => {},
    };
  }

  // Mock ResizeObserver for component testing
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver for component testing
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
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
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock getComputedStyle for design token testing
  global.getComputedStyle = vi.fn().mockImplementation(() => ({
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(0, 0, 0)',
    fontSize: '16px',
    fontWeight: '400',
    padding: '8px 16px',
    margin: '0px',
    border: 'none',
    borderRadius: '6px',
    boxShadow: 'none',
    outline: 'none',
    getPropertyValue: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = unknown> {
      toHaveValidIntelligence(): T;
      toBeAIConsumable(): T;
      toMatchDesignPatterns(): T;
      toBeReact19Compatible(): T;
      toBePure(): T;
      toHandleConcurrentRendering(): T;
      toHaveValidDesignSystemIntelligence(): T;
      toMeetAccessibilityStandards(): T;
      toUseSemanticTokensOnly(): T;
      toHaveProperVisualHierarchy(): T;
    }
  }
}

// Import custom matchers
import './utils/intelligence-validators';
import './utils/react19-helpers';
import './utils/design-assertions';

// Test environment configuration
export const TEST_CONFIG = {
  // React 19 features
  concurrentFeatures: true,
  suspenseEnabled: true,
  useTransition: true,
  useOptimistic: true,

  // Design intelligence testing
  intelligenceValidation: true,
  aiConsumabilityTesting: true,
  designPatternValidation: true,

  // Accessibility testing
  wcagCompliance: 'AAA',
  screenReaderTesting: true,
  keyboardNavigationTesting: true,
  colorContrastTesting: true,

  // Performance testing
  cognitiveLoadValidation: true,
  renderPerformanceTesting: true,
  edgePerformanceTesting: true,

  // Browser compatibility
  crossBrowserTesting: true,
  mobileResponsiveTesting: true,
  darkModeTesting: true,
  reducedMotionTesting: true,
};

// Mock AI agent for testing
export const mockAIAgent = {
  parseIntelligence: vi.fn(),
  makeDesignDecision: vi.fn(),
  validateAccessibility: vi.fn(),
};

// Test data fixtures
export const TEST_COMPONENTS = {
  button: {
    name: 'Button',
    cognitiveLoad: 3,
    attentionEconomics: 'Primary variant commands highest attention - use sparingly',
    trustBuilding: 'Destructive actions require confirmation patterns',
    accessibility: 'WCAG AAA compliant with 44px minimum touch targets',
    semanticMeaning: 'primary=main actions, destructive=irreversible actions',
    usagePatterns: {
      do: ['Primary: Main user goal, maximum 1 per section'],
      never: ['Multiple primary buttons competing for attention'],
    },
  },
  dialog: {
    name: 'Dialog',
    cognitiveLoad: 7,
    attentionEconomics: 'Modal interruption requires careful attention management',
    trustBuilding: 'Critical actions need progressive confirmation patterns',
    accessibility: 'WCAG AAA modal patterns with focus management',
    semanticMeaning: 'Modal contexts for important user decisions',
    usagePatterns: {
      do: ['Account deletion, data loss warnings, critical confirmations'],
      never: ['Simple notifications, low-stakes decisions'],
    },
  },
};

// Design token test values
export const TEST_DESIGN_TOKENS = {
  colors: {
    primary: 'oklch(0.5 0.12 264)',
    secondary: 'oklch(0.7 0.08 264)',
    destructive: 'oklch(0.6 0.15 30)',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
  cognitive: {
    'load-1': { complexity: 'minimal', renderTime: '<10ms' },
    'load-3': { complexity: 'simple', renderTime: '<25ms' },
    'load-7': { complexity: 'moderate', renderTime: '<50ms' },
    'load-10': { complexity: 'complex', renderTime: '<100ms' },
  },
};

// Viewport sizes for responsive testing
export const VIEWPORT_SIZES = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'wide', width: 1920, height: 1080 },
];

// Accessibility testing configurations
export const ACCESSIBILITY_CONFIGS = {
  reducedMotion: true,
  highContrast: true,
  screenReaderSimulation: true,
  keyboardOnlyNavigation: true,
};

console.log('🧪 Rafters UI Test Environment Initialized');
console.log('✅ React 19 compatibility enabled');
console.log('🤖 AI intelligence validation ready');
console.log('♿ Accessibility testing configured');
console.log('🎨 Design system validation enabled');
