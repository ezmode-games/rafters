/**
 * AI-First Design Intelligence Validation Framework
 *
 * This module provides utilities to validate that AI agents can consume
 * component intelligence correctly. It ensures JSDoc annotations are
 * machine-readable and design patterns are accessible to AI systems.
 *
 * Key Principles:
 * - Components must export intelligence in parseable format
 * - Design decisions must be accessible to AI agents
 * - Intelligence annotations must match actual component behavior
 * - AI agents must be able to make informed UX decisions
 */

import { parse } from 'comment-parser';
import { expect } from 'vitest';

export interface ComponentIntelligence {
  registryName: string;
  registryVersion: string;
  registryStatus: 'draft' | 'published' | 'deprecated';
  cognitiveLoad: number;
  attentionEconomics: string;
  trustBuilding: string;
  accessibility: string;
  semanticMeaning: string;
  usagePatterns: {
    do: string[];
    never: string[];
  };
  designGuides: string[];
  dependencies: string[];
  examples: string[];
}

export interface AIConsumabilityTest {
  hasRequiredIntelligence: boolean;
  isParseable: boolean;
  hasValidCognitiveLoad: boolean;
  hasAccessibilityPatterns: boolean;
  hasUsageGuidance: boolean;
  hasDesignGuides: boolean;
  canMakeDesignDecisions: boolean;
}

/**
 * Extract design intelligence from a component's source code
 * AI agents use this pattern to understand component purpose and usage
 */
export function extractComponentIntelligence(componentSource: string): ComponentIntelligence {
  // Parse JSDoc comments using comment-parser (same as AI agents would)
  const comments = parse(componentSource);
  const mainComment = comments[0];

  if (!mainComment) {
    throw new Error(
      'Component missing JSDoc intelligence - AI agents cannot understand component purpose'
    );
  }

  const tags = mainComment.tags.reduce(
    (acc, tag) => {
      acc[tag.tag] = tag.description;
      return acc;
    },
    {} as Record<string, string>
  );

  // Extract cognitive load rating (1-10 scale)
  const cognitiveLoadMatch = tags['cognitive-load']?.match(/(\d+)\/10/);
  const cognitiveLoad = cognitiveLoadMatch ? parseInt(cognitiveLoadMatch[1], 10) : 0;

  // Parse usage patterns into structured format
  const usagePatterns = parseUsagePatterns(tags['usage-patterns'] || '');

  // Extract design guide URLs
  const designGuides = parseDesignGuides(tags['design-guides'] || '');

  // Extract examples for AI learning
  const examples = parseExamples(mainComment.description);

  return {
    registryName: tags['registry-name'] || '',
    registryVersion: tags['registry-version'] || '',
    registryStatus: (tags['registry-status'] as ComponentIntelligence['registryStatus']) || 'draft',
    cognitiveLoad,
    attentionEconomics: tags['attention-economics'] || '',
    trustBuilding: tags['trust-building'] || '',
    accessibility: tags.accessibility || '',
    semanticMeaning: tags['semantic-meaning'] || '',
    usagePatterns,
    designGuides,
    dependencies: tags.dependencies?.split(', ') || [],
    examples,
  };
}

/**
 * Parse usage patterns into DO/NEVER structure for AI decision making
 */
function parseUsagePatterns(patterns: string) {
  const lines = patterns
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const doPatterns: string[] = [];
  const neverPatterns: string[] = [];

  for (const line of lines) {
    if (line.startsWith('DO:')) {
      doPatterns.push(line.replace('DO:', '').trim());
    } else if (line.startsWith('NEVER:')) {
      neverPatterns.push(line.replace('NEVER:', '').trim());
    }
  }

  return {
    do: doPatterns,
    never: neverPatterns,
  };
}

/**
 * Extract design guide URLs for AI reference
 */
function parseDesignGuides(guides: string): string[] {
  // Extract URLs from the design guides section
  const urlRegex = /https?:\/\/[^\s]+/g;
  return guides.match(urlRegex) || [];
}

/**
 * Extract code examples for AI learning
 */
function parseExamples(description: string): string[] {
  // Extract code blocks from JSDoc description
  const codeBlockRegex = /```[\s\S]*?```/g;
  return description.match(codeBlockRegex) || [];
}

/**
 * Comprehensive AI consumability test for components
 * Validates that AI agents can understand and use component intelligence
 */
export function validateAIConsumability(componentSource: string): AIConsumabilityTest {
  try {
    const intelligence = extractComponentIntelligence(componentSource);

    return {
      hasRequiredIntelligence: hasRequiredIntelligenceFields(intelligence),
      isParseable: true,
      hasValidCognitiveLoad: isValidCognitiveLoad(intelligence.cognitiveLoad),
      hasAccessibilityPatterns: hasAccessibilityGuidance(intelligence),
      hasUsageGuidance: hasUsageGuidance(intelligence),
      hasDesignGuides: intelligence.designGuides.length > 0,
      canMakeDesignDecisions: canMakeDesignDecisions(intelligence),
    };
  } catch (_error) {
    return {
      hasRequiredIntelligence: false,
      isParseable: false,
      hasValidCognitiveLoad: false,
      hasAccessibilityPatterns: false,
      hasUsageGuidance: false,
      hasDesignGuides: false,
      canMakeDesignDecisions: false,
    };
  }
}

/**
 * Check if component has all required intelligence fields
 */
function hasRequiredIntelligenceFields(intelligence: ComponentIntelligence): boolean {
  return !!(
    intelligence.cognitiveLoad &&
    intelligence.attentionEconomics &&
    intelligence.trustBuilding &&
    intelligence.accessibility &&
    intelligence.semanticMeaning &&
    intelligence.usagePatterns
  );
}

/**
 * Validate cognitive load rating is within acceptable range
 */
function isValidCognitiveLoad(cognitiveLoad: number): boolean {
  return cognitiveLoad >= 1 && cognitiveLoad <= 10;
}

/**
 * Check if component provides accessibility guidance for AI agents
 */
function hasAccessibilityGuidance(intelligence: ComponentIntelligence): boolean {
  const accessibility = intelligence.accessibility.toLowerCase();
  return (
    accessibility.includes('wcag') ||
    accessibility.includes('aria') ||
    accessibility.includes('accessibility') ||
    accessibility.includes('screen reader')
  );
}

/**
 * Validate component provides clear usage guidance
 */
function hasUsageGuidance(intelligence: ComponentIntelligence): boolean {
  return intelligence.usagePatterns.do.length > 0 && intelligence.usagePatterns.never.length > 0;
}

/**
 * Determine if AI agent can make informed design decisions
 */
function canMakeDesignDecisions(intelligence: ComponentIntelligence): boolean {
  // AI needs: cognitive load, usage patterns, semantic meaning, and examples
  return (
    intelligence.cognitiveLoad > 0 &&
    intelligence.usagePatterns.do.length > 0 &&
    intelligence.semanticMeaning.length > 0 &&
    intelligence.examples.length > 0
  );
}

/**
 * Mock AI agent for testing component intelligence consumption
 */
export class MockAIAgent {
  /**
   * Simulate AI agent parsing component intelligence
   */
  async parseComponentIntelligence(componentSource: string): Promise<ComponentIntelligence> {
    return extractComponentIntelligence(componentSource);
  }

  /**
   * Simulate AI agent making design decision based on intelligence
   */
  async makeDesignDecision(
    intelligence: ComponentIntelligence,
    context: DesignContext
  ): Promise<DesignDecision> {
    // Simulate AI reasoning based on component intelligence
    if (context.isDestructiveAction && intelligence.trustBuilding.includes('confirmation')) {
      return {
        recommendation: 'require-confirmation',
        reasoning:
          'Component intelligence indicates destructive actions need confirmation patterns',
        confidence: 0.95,
      };
    }

    if (
      context.attentionLevel === 'primary' &&
      intelligence.attentionEconomics.includes('maximum 1')
    ) {
      return {
        recommendation: 'limit-primary-usage',
        reasoning: 'Attention economics indicate maximum 1 primary action per section',
        confidence: 0.9,
      };
    }

    if (intelligence.cognitiveLoad > 7 && context.userExperience === 'beginner') {
      return {
        recommendation: 'simplify-interaction',
        reasoning: 'High cognitive load component may overwhelm beginner users',
        confidence: 0.85,
      };
    }

    return {
      recommendation: 'proceed',
      reasoning: 'Component intelligence supports this usage pattern',
      confidence: 0.8,
    };
  }

  /**
   * Validate component meets accessibility requirements
   */
  async validateAccessibility(intelligence: ComponentIntelligence): Promise<boolean> {
    return (
      intelligence.accessibility.includes('WCAG') &&
      intelligence.accessibility.includes('screen reader') &&
      intelligence.cognitiveLoad <= 8 // Reasonable cognitive load
    );
  }
}

export interface DesignContext {
  isDestructiveAction?: boolean;
  attentionLevel?: 'primary' | 'secondary' | 'tertiary';
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  sectionComplexity?: 'simple' | 'moderate' | 'complex';
  consequenceLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface DesignDecision {
  recommendation: string;
  reasoning: string;
  confidence: number;
}

/**
 * Custom Vitest matchers for AI intelligence testing
 */
declare global {
  namespace Vi {
    interface JestAssertion<T = unknown> {
      toHaveValidIntelligence(): T;
      toBeAIConsumable(): T;
      toMatchDesignPatterns(): T;
    }
  }
}

/**
 * Vitest matcher: Component has valid AI-consumable intelligence
 */
expect.extend({
  toHaveValidIntelligence(componentSource: string) {
    try {
      const intelligence = extractComponentIntelligence(componentSource);
      const isValid = hasRequiredIntelligenceFields(intelligence);

      return {
        pass: isValid,
        message: () =>
          isValid
            ? 'Component has valid intelligence annotations'
            : 'Component missing required intelligence fields for AI consumption',
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Component intelligence parsing failed: ${error}`,
      };
    }
  },

  toBeAIConsumable(componentSource: string) {
    const consumability = validateAIConsumability(componentSource);
    const isConsumable = Object.values(consumability).every(Boolean);

    return {
      pass: isConsumable,
      message: () =>
        isConsumable
          ? 'Component is fully AI-consumable'
          : `Component fails AI consumability: ${JSON.stringify(consumability, null, 2)}`,
    };
  },

  toMatchDesignPatterns(componentSource: string, expectedPatterns: string[]) {
    const intelligence = extractComponentIntelligence(componentSource);
    const hasPatterns = expectedPatterns.every((pattern) =>
      intelligence.usagePatterns.do.some((doPattern) =>
        doPattern.toLowerCase().includes(pattern.toLowerCase())
      )
    );

    return {
      pass: hasPatterns,
      message: () =>
        hasPatterns
          ? 'Component matches expected design patterns'
          : `Component missing expected patterns: ${expectedPatterns.join(', ')}`,
    };
  },
});
