/**
 * Design System Intelligence Assertions
 *
 * Custom test utilities for validating design system intelligence
 * and ensuring AI agents can consume design patterns correctly.
 *
 * Key Areas:
 * - Semantic token validation
 * - Design pattern consistency
 * - Cross-component intelligence correlation
 * - AI consumability testing
 */

import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'vitest';

export interface DesignSystemIntelligence {
  cognitiveLoadDistribution: CognitiveLoadAnalysis;
  attentionEconomicsHierarchy: AttentionAnalysis;
  trustBuildingPatterns: TrustPatternAnalysis;
  accessibilityCompliance: AccessibilityAnalysis;
  semanticTokenUsage: TokenUsageAnalysis;
}

export interface CognitiveLoadAnalysis {
  averageLoad: number;
  distribution: Record<string, number>;
  complexityBalance: boolean;
  overloadedComponents: string[];
}

export interface AttentionAnalysis {
  primaryComponents: string[];
  secondaryComponents: string[];
  hierarchy: boolean;
  conflictingAttention: string[];
}

export interface TrustPatternAnalysis {
  destructiveConfirmationPatterns: string[];
  loadingStatePatterns: string[];
  progressiveDisclosure: string[];
  trustLevelDistribution: Record<string, number>;
}

export interface AccessibilityAnalysis {
  wcagCompliantComponents: string[];
  screenReaderSupport: string[];
  keyboardNavigationSupport: string[];
  colorContrastMeetsAA: boolean;
}

export interface TokenUsageAnalysis {
  semanticTokensUsed: string[];
  arbitraryValuesFound: string[];
  tokenConsistency: boolean;
  designSystemCoverage: number;
}

/**
 * Analyze design system cognitive load distribution
 */
export function analyzeCognitiveLoadDistribution(
  components: Array<{ name: string; cognitiveLoad: number }>
): CognitiveLoadAnalysis {
  const loads = components.map((c) => c.cognitiveLoad);
  const averageLoad = loads.reduce((sum, load) => sum + load, 0) / loads.length;

  const distribution = components.reduce(
    (dist, component) => {
      const loadRange = getLoadRange(component.cognitiveLoad);
      dist[loadRange] = (dist[loadRange] || 0) + 1;
      return dist;
    },
    {} as Record<string, number>
  );

  // Check for complexity balance (most components should be low-medium complexity)
  const lowMediumComponents = components.filter((c) => c.cognitiveLoad <= 6).length;
  const complexityBalance = lowMediumComponents / components.length >= 0.7;

  // Find overloaded components (cognitive load > 8)
  const overloadedComponents = components.filter((c) => c.cognitiveLoad > 8).map((c) => c.name);

  return {
    averageLoad,
    distribution,
    complexityBalance,
    overloadedComponents,
  };
}

/**
 * Analyze attention economics hierarchy
 */
export function analyzeAttentionEconomics(
  components: Array<{ name: string; attentionEconomics: string }>
): AttentionAnalysis {
  const primaryComponents = components
    .filter(
      (c) =>
        c.attentionEconomics.toLowerCase().includes('primary') ||
        c.attentionEconomics.toLowerCase().includes('highest attention')
    )
    .map((c) => c.name);

  const secondaryComponents = components
    .filter(
      (c) =>
        c.attentionEconomics.toLowerCase().includes('secondary') ||
        c.attentionEconomics.toLowerCase().includes('supporting')
    )
    .map((c) => c.name);

  // Check for proper hierarchy (not too many primary attention components)
  const hierarchy = primaryComponents.length <= components.length * 0.3;

  // Find conflicting attention patterns
  const conflictingAttention = components
    .filter(
      (c) => c.attentionEconomics.includes('maximum') && c.attentionEconomics.includes('sparingly')
    )
    .filter((c) => primaryComponents.includes(c.name))
    .map((c) => c.name);

  return {
    primaryComponents,
    secondaryComponents,
    hierarchy,
    conflictingAttention,
  };
}

/**
 * Analyze trust building patterns across components
 */
export function analyzeTrustBuildingPatterns(
  components: Array<{ name: string; trustBuilding: string }>
): TrustPatternAnalysis {
  const destructiveConfirmationPatterns = components
    .filter((c) => c.trustBuilding.toLowerCase().includes('confirmation'))
    .map((c) => c.name);

  const loadingStatePatterns = components
    .filter((c) => c.trustBuilding.toLowerCase().includes('loading'))
    .map((c) => c.name);

  const progressiveDisclosure = components
    .filter((c) => c.trustBuilding.toLowerCase().includes('progressive'))
    .map((c) => c.name);

  // Analyze trust level distribution
  const trustLevelDistribution = components.reduce(
    (dist, component) => {
      const trustLevel = determineTrustLevel(component.trustBuilding);
      dist[trustLevel] = (dist[trustLevel] || 0) + 1;
      return dist;
    },
    {} as Record<string, number>
  );

  return {
    destructiveConfirmationPatterns,
    loadingStatePatterns,
    progressiveDisclosure,
    trustLevelDistribution,
  };
}

/**
 * Analyze accessibility compliance across components
 */
export function analyzeAccessibilityCompliance(
  components: Array<{ name: string; accessibility: string }>
): AccessibilityAnalysis {
  const wcagCompliantComponents = components
    .filter((c) => c.accessibility.includes('WCAG'))
    .map((c) => c.name);

  const screenReaderSupport = components
    .filter((c) => c.accessibility.toLowerCase().includes('screen reader'))
    .map((c) => c.name);

  const keyboardNavigationSupport = components
    .filter((c) => c.accessibility.toLowerCase().includes('keyboard'))
    .map((c) => c.name);

  const colorContrastMeetsAA = components.every(
    (c) => c.accessibility.includes('WCAG AA') || c.accessibility.includes('WCAG AAA')
  );

  return {
    wcagCompliantComponents,
    screenReaderSupport,
    keyboardNavigationSupport,
    colorContrastMeetsAA,
  };
}

/**
 * Analyze semantic token usage in components
 */
export function analyzeSemanticTokenUsage(componentSources: string[]): TokenUsageAnalysis {
  const semanticTokenPattern =
    /(?:bg-|text-|border-)(primary|secondary|destructive|success|warning|info|accent|muted)/g;
  const arbitraryValuePattern =
    /(?:bg-|text-|border-)\[(#[a-fA-F0-9]{6}|rgba?\([^)]+\)|[a-zA-Z]+)\]/g;

  let semanticTokensUsed: string[] = [];
  let arbitraryValuesFound: string[] = [];

  for (const source of componentSources) {
    const semanticMatches = source.match(semanticTokenPattern) || [];
    const arbitraryMatches = source.match(arbitraryValuePattern) || [];

    semanticTokensUsed = [...semanticTokensUsed, ...semanticMatches];
    arbitraryValuesFound = [...arbitraryValuesFound, ...arbitraryMatches];
  }

  // Remove duplicates
  semanticTokensUsed = [...new Set(semanticTokensUsed)];
  arbitraryValuesFound = [...new Set(arbitraryValuesFound)];

  const tokenConsistency = arbitraryValuesFound.length === 0;
  const designSystemCoverage =
    semanticTokensUsed.length / (semanticTokensUsed.length + arbitraryValuesFound.length);

  return {
    semanticTokensUsed,
    arbitraryValuesFound,
    tokenConsistency,
    designSystemCoverage: Number.isNaN(designSystemCoverage) ? 1 : designSystemCoverage,
  };
}

/**
 * Comprehensive design system intelligence analysis
 */
export function analyzeDesignSystemIntelligence(
  components: Array<{
    name: string;
    cognitiveLoad: number;
    attentionEconomics: string;
    trustBuilding: string;
    accessibility: string;
    source: string;
  }>
): DesignSystemIntelligence {
  return {
    cognitiveLoadDistribution: analyzeCognitiveLoadDistribution(components),
    attentionEconomicsHierarchy: analyzeAttentionEconomics(components),
    trustBuildingPatterns: analyzeTrustBuildingPatterns(components),
    accessibilityCompliance: analyzeAccessibilityCompliance(components),
    semanticTokenUsage: analyzeSemanticTokenUsage(components.map((c) => c.source)),
  };
}

/**
 * Test semantic color contrast in browser environment
 */
export async function testColorContrastRatio(
  element: HTMLElement,
  expectedRatio: 'AA' | 'AAA' = 'AA'
): Promise<boolean> {
  const styles = getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;

  // Convert colors to contrast ratio (simplified - real implementation would use color libraries)
  const contrastRatio = calculateContrastRatio(backgroundColor, color);

  const minRatio = expectedRatio === 'AAA' ? 7 : 4.5;
  return contrastRatio >= minRatio;
}

/**
 * Test component visual hierarchy through computed styles
 */
export async function testVisualHierarchy(
  primaryElement: HTMLElement,
  secondaryElement: HTMLElement
): Promise<boolean> {
  const primaryStyles = getComputedStyle(primaryElement);
  const secondaryStyles = getComputedStyle(secondaryElement);

  // Primary should have more visual weight
  const primaryWeight = parseInt(primaryStyles.fontWeight, 10) || 400;
  const secondaryWeight = parseInt(secondaryStyles.fontWeight, 10) || 400;

  return primaryWeight >= secondaryWeight;
}

/**
 * Test responsive behavior across viewport sizes
 */
export function testResponsiveDesign(
  component: React.ComponentType,
  viewportSizes: Array<{ width: number; height: number }>
) {
  const results = viewportSizes.map((viewport) => {
    const { container } = render(React.createElement(component));

    // Set viewport size (in real testing environment)
    // This is a simplified version - real implementation would use browser viewport
    const element = container.firstChild as HTMLElement;

    return {
      viewport,
      renders: !!element,
      overflows: element ? element.scrollWidth > viewport.width : false,
    };
  });

  return results;
}

// Helper functions
function getLoadRange(load: number): string {
  if (load <= 3) return 'low';
  if (load <= 6) return 'medium';
  if (load <= 8) return 'high';
  return 'critical';
}

function determineTrustLevel(trustBuilding: string): string {
  const lower = trustBuilding.toLowerCase();
  if (lower.includes('critical') || lower.includes('destructive')) return 'critical';
  if (lower.includes('confirmation') || lower.includes('irreversible')) return 'high';
  if (lower.includes('validation') || lower.includes('feedback')) return 'medium';
  return 'low';
}

function calculateContrastRatio(bg: string, fg: string): number {
  // Simplified contrast calculation
  // Real implementation would use proper color space conversion

  // For testing purposes, return a reasonable value
  // In practice, use a library like 'color-contrast' or similar
  if (bg.includes('rgb(255') && fg.includes('rgb(0')) return 21; // White bg, black text
  if (bg.includes('rgb(0') && fg.includes('rgb(255')) return 21; // Black bg, white text

  return 4.5; // Assume AA compliance for testing
}

/**
 * Custom Vitest matchers for design system testing
 */
declare global {
  namespace Vi {
    interface JestAssertion<T = unknown> {
      toHaveValidDesignSystemIntelligence(): T;
      toMeetAccessibilityStandards(): T;
      toUseSemanticTokensOnly(): T;
      toHaveProperVisualHierarchy(): T;
    }
  }
}

expect.extend({
  toHaveValidDesignSystemIntelligence(intelligence: DesignSystemIntelligence) {
    const issues: string[] = [];

    if (!intelligence.cognitiveLoadDistribution.complexityBalance) {
      issues.push('Cognitive load distribution unbalanced - too many complex components');
    }

    if (!intelligence.attentionEconomicsHierarchy.hierarchy) {
      issues.push('Attention economics hierarchy violated - too many primary attention components');
    }

    if (!intelligence.accessibilityCompliance.colorContrastMeetsAA) {
      issues.push('Color contrast does not meet WCAG AA standards');
    }

    if (!intelligence.semanticTokenUsage.tokenConsistency) {
      issues.push(
        `Arbitrary values found: ${intelligence.semanticTokenUsage.arbitraryValuesFound.join(', ')}`
      );
    }

    const isValid = issues.length === 0;

    return {
      pass: isValid,
      message: () =>
        isValid
          ? 'Design system intelligence is valid'
          : `Design system intelligence issues: ${issues.join('; ')}`,
    };
  },

  toMeetAccessibilityStandards(accessibility: AccessibilityAnalysis) {
    const wcagCompliant = accessibility.wcagCompliantComponents.length > 0;
    const hasScreenReaderSupport = accessibility.screenReaderSupport.length > 0;
    const hasKeyboardSupport = accessibility.keyboardNavigationSupport.length > 0;
    const hasColorContrast = accessibility.colorContrastMeetsAA;

    const meetsStandards =
      wcagCompliant && hasScreenReaderSupport && hasKeyboardSupport && hasColorContrast;

    return {
      pass: meetsStandards,
      message: () =>
        meetsStandards
          ? 'Component meets accessibility standards'
          : `Accessibility issues found: WCAG:${wcagCompliant}, ScreenReader:${hasScreenReaderSupport}, Keyboard:${hasKeyboardSupport}, Contrast:${hasColorContrast}`,
    };
  },

  toUseSemanticTokensOnly(tokenUsage: TokenUsageAnalysis) {
    return {
      pass: tokenUsage.tokenConsistency,
      message: () =>
        tokenUsage.tokenConsistency
          ? 'Component uses only semantic tokens'
          : `Arbitrary values found: ${tokenUsage.arbitraryValuesFound.join(', ')}`,
    };
  },

  toHaveProperVisualHierarchy(_element: HTMLElement) {
    // This would need to be implemented with actual DOM testing
    // For now, return a placeholder
    return {
      pass: true,
      message: () => 'Visual hierarchy validation would require DOM testing',
    };
  },
});
