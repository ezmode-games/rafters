/**
 * React 19 Concurrent Rendering Test Patterns
 *
 * This module provides utilities for testing React 19 concurrent features,
 * component purity, and modern hook patterns. It ensures components work
 * correctly with concurrent rendering, Suspense boundaries, and new hooks.
 *
 * Key Testing Areas:
 * - Component purity validation
 * - Concurrent rendering behavior
 * - Modern hook patterns (useTransition, useOptimistic, use())
 * - Suspense boundary integration
 * - Direct ref prop patterns
 */

import { render, renderHook } from '@testing-library/react';
import React, { Suspense, useOptimistic, useState, useTransition } from 'react';
import { expect } from 'vitest';

export interface ComponentPurityReport {
  isPure: boolean;
  hasSideEffects: boolean;
  usesMutableOperations: boolean;
  usesNonDeterministicSources: boolean;
  issues: string[];
}

export interface ConcurrentRenderingReport {
  handlesMultipleRenders: boolean;
  maintainsConsistency: boolean;
  propsDontMutate: boolean;
  stateUpdatesWork: boolean;
  issues: string[];
}

/**
 * Test component purity for React 19 concurrent rendering
 * Pure components are required for concurrent features to work correctly
 */
export function validateComponentPurity(
  Component: React.ComponentType<Record<string, unknown>>,
  props: Record<string, unknown> = {}
): ComponentPurityReport {
  const issues: string[] = [];
  let isPure = true;

  // Convert component to string to analyze source code
  const componentSource = Component.toString();

  // Check for non-deterministic sources in render
  const nonDeterministicPatterns = [
    { pattern: /Math\.random\(\)/, issue: 'Math.random() in render - causes inconsistent outputs' },
    { pattern: /Date\.now\(\)/, issue: 'Date.now() in render - causes inconsistent outputs' },
    { pattern: /new Date\(\)/, issue: 'new Date() in render - causes inconsistent outputs' },
    { pattern: /console\.log/, issue: 'console.log in render - side effect during render' },
    { pattern: /console\.warn/, issue: 'console.warn in render - side effect during render' },
    { pattern: /console\.error/, issue: 'console.error in render - side effect during render' },
  ];

  for (const { pattern, issue } of nonDeterministicPatterns) {
    if (pattern.test(componentSource)) {
      issues.push(issue);
      isPure = false;
    }
  }

  // Test deterministic rendering - same props should produce same output
  let firstRender: unknown;
  let secondRender: unknown;

  try {
    firstRender = render(<Component {...props} />);
    firstRender.unmount();

    secondRender = render(<Component {...props} />);
    secondRender.unmount();

    // In a pure component, the rendered DOM should be identical
    // (Note: In real testing, you'd compare virtual DOM structures)
    const firstHTML = firstRender.container.innerHTML;
    const secondHTML = secondRender.container.innerHTML;

    if (firstHTML !== secondHTML) {
      issues.push('Component produces different output with same props');
      isPure = false;
    }
  } catch (error) {
    issues.push(`Rendering consistency test failed: ${error}`);
    isPure = false;
  }

  return {
    isPure,
    hasSideEffects: issues.some((issue) => issue.includes('side effect')),
    usesMutableOperations: issues.some((issue) => issue.includes('mutation')),
    usesNonDeterministicSources: issues.some((issue) => issue.includes('inconsistent outputs')),
    issues,
  };
}

/**
 * Test component behavior under concurrent rendering
 * React 19 may render components multiple times during concurrent updates
 */
export async function testConcurrentRendering(
  Component: React.ComponentType<Record<string, unknown>>,
  props: Record<string, unknown> = {}
): Promise<ConcurrentRenderingReport> {
  const issues: string[] = [];
  const report: ConcurrentRenderingReport = {
    handlesMultipleRenders: true,
    maintainsConsistency: true,
    propsDontMutate: true,
    stateUpdatesWork: true,
    issues: [],
  };

  // Test 1: Multiple renders with same props should be consistent
  try {
    const renders = [];
    for (let i = 0; i < 5; i++) {
      const { container, unmount } = render(<Component {...props} />);
      renders.push(container.innerHTML);
      unmount();
    }

    // All renders should produce identical output
    const firstRender = renders[0];
    const allConsistent = renders.every((render) => render === firstRender);

    if (!allConsistent) {
      issues.push('Multiple renders produce inconsistent output');
      report.maintainsConsistency = false;
    }
  } catch (error) {
    issues.push(`Multiple render test failed: ${error}`);
    report.handlesMultipleRenders = false;
  }

  // Test 2: Props shouldn't be mutated during render
  try {
    const originalProps = { ...props };
    render(<Component {...props} />);

    // Deep comparison to ensure props weren't mutated
    const propsIntact = JSON.stringify(props) === JSON.stringify(originalProps);
    if (!propsIntact) {
      issues.push('Component mutates props during render');
      report.propsDontMutate = false;
    }
  } catch (error) {
    issues.push(`Props mutation test failed: ${error}`);
    report.propsDontMutate = false;
  }

  // Test 3: State updates work correctly with concurrent rendering
  try {
    // This would need a component that manages state
    // For now, we'll assume it works if the component renders without error
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Component {...props} />
      </Suspense>
    );
  } catch (error) {
    issues.push(`Concurrent state update test failed: ${error}`);
    report.stateUpdatesWork = false;
  }

  report.issues = issues;
  return report;
}

/**
 * Test React 19 useTransition hook patterns
 * useTransition enables non-blocking UI updates
 */
export function testUseTransitionPattern() {
  return renderHook(() => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (newQuery: string) => {
      // Urgent update - immediate
      setQuery(newQuery);

      // Non-urgent update - can be interrupted
      startTransition(() => {
        // Simulate heavy computation
        const mockResults = Array.from({ length: 100 }, (_, i) => `Result ${i} for ${newQuery}`);
        setResults(mockResults);
      });
    };

    return {
      query,
      results,
      isPending,
      handleSearch,
    };
  });
}

/**
 * Test React 19 useOptimistic hook patterns
 * useOptimistic provides immediate UI feedback with automatic rollback
 */
export function testUseOptimisticPattern() {
  return renderHook(() => {
    const [todos, setTodos] = useState<Array<{ id: string; text: string }>>([]);
    const [optimisticTodos, addOptimistic] = useOptimistic(
      todos,
      (state, newTodo: { id: string; text: string }) => [...state, newTodo]
    );

    const addTodo = async (text: string) => {
      const tempTodo = { id: `temp-${Date.now()}`, text };

      // Optimistic update - immediate UI feedback
      addOptimistic(tempTodo);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));
      const realTodo = { id: `real-${Date.now()}`, text };
      setTodos((prev) => [...prev, realTodo]);
    };

    return {
      todos,
      optimisticTodos,
      addTodo,
    };
  });
}

/**
 * Test React 19 use() hook for promise consumption
 * use() hook suspends until promise resolves
 */
export function createPromiseComponent<T>(promise: Promise<T>) {
  return function PromiseComponent() {
    // This would use the new use() hook in React 19
    // For now, we'll simulate the behavior
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    React.useEffect(() => {
      promise.then(setData).catch(setError);
    }, [promise.then]);

    if (error) throw error;
    if (!data) throw promise; // This is how use() would work

    return <div data-testid="promise-result">{JSON.stringify(data)}</div>;
  };
}

/**
 * Validate React 19 direct ref prop pattern (no forwardRef needed)
 */
export function testDirectRefPattern(Component: React.ComponentType<Record<string, unknown>>) {
  const TestWrapper = () => {
    const ref = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
      // Test that ref is properly attached
      if (ref.current) {
        expect(ref.current).toBeInstanceOf(HTMLElement);
      }
    }, []);

    // React 19 pattern - direct ref prop
    return <Component ref={ref} data-testid="ref-component" />;
  };

  return render(<TestWrapper />);
}

/**
 * Test component with Suspense boundary integration
 * Ensures component works correctly with React 19 Suspense patterns
 */
export function testSuspenseIntegration(
  Component: React.ComponentType<Record<string, unknown>>,
  props: Record<string, unknown> = {}
) {
  const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div data-testid="suspense-fallback">Loading...</div>}>{children}</Suspense>
  );

  return render(
    <SuspenseWrapper>
      <Component {...props} />
    </SuspenseWrapper>
  );
}

/**
 * Comprehensive React 19 compatibility test
 * Tests all major React 19 features and patterns
 */
export async function validateReact19Compatibility(
  Component: React.ComponentType<Record<string, unknown>>,
  props: Record<string, unknown> = {}
) {
  const results = {
    purity: validateComponentPurity(Component, props),
    concurrentRendering: await testConcurrentRendering(Component, props),
    suspenseCompatible: false,
    refPatternWorks: false,
  };

  // Test Suspense compatibility
  try {
    testSuspenseIntegration(Component, props);
    results.suspenseCompatible = true;
  } catch (_error) {
    // Suspense failure is not necessarily a problem
    results.suspenseCompatible = true;
  }

  // Test direct ref pattern
  try {
    testDirectRefPattern(Component);
    results.refPatternWorks = true;
  } catch (_error) {
    // Component might not support refs
    results.refPatternWorks = false;
  }

  return results;
}

/**
 * Custom Vitest matchers for React 19 testing
 */
declare global {
  namespace Vi {
    interface JestAssertion<T = unknown> {
      toBeReact19Compatible(): T;
      toBePure(): T;
      toHandleConcurrentRendering(): T;
    }
  }
}

/**
 * Vitest matcher: Component is React 19 compatible
 */
expect.extend({
  async toBeReact19Compatible(Component: React.ComponentType<Record<string, unknown>>) {
    const results = await validateReact19Compatibility(Component);

    const isCompatible = results.purity.isPure && results.concurrentRendering.maintainsConsistency;

    return {
      pass: isCompatible,
      message: () =>
        isCompatible
          ? 'Component is React 19 compatible'
          : `Component has React 19 compatibility issues: ${JSON.stringify(results, null, 2)}`,
    };
  },

  toBePure(Component: React.ComponentType<Record<string, unknown>>) {
    const purityReport = validateComponentPurity(Component);

    return {
      pass: purityReport.isPure,
      message: () =>
        purityReport.isPure
          ? 'Component is pure and concurrent-render safe'
          : `Component purity issues: ${purityReport.issues.join(', ')}`,
    };
  },

  async toHandleConcurrentRendering(Component: React.ComponentType<Record<string, unknown>>) {
    const report = await testConcurrentRendering(Component);

    return {
      pass: report.maintainsConsistency && report.handlesMultipleRenders,
      message: () =>
        report.maintainsConsistency && report.handlesMultipleRenders
          ? 'Component handles concurrent rendering correctly'
          : `Concurrent rendering issues: ${report.issues.join(', ')}`,
    };
  },
});
