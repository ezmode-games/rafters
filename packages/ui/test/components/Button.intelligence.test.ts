/**
 * Button Intelligence Validation Tests
 *
 * Tests that validate AI agent consumption of Button component intelligence.
 * Ensures design intelligence is accessible and actionable for AI systems.
 */

import { describe, expect, test } from 'vitest';
import { Button } from '../../src/components/Button';
import { analyzeSemanticTokenUsage } from '../utils/design-assertions';
import {
  extractComponentIntelligence,
  MockAIAgent,
  validateAIConsumability,
} from '../utils/intelligence-validators';
import { validateComponentPurity, validateReact19Compatibility } from '../utils/react19-helpers';

describe('Button Intelligence Validation', () => {
  const buttonSource = Button.toString();

  test('has comprehensive AI-consumable intelligence', () => {
    expect(buttonSource).toHaveValidIntelligence();
    expect(buttonSource).toBeAIConsumable();
  });

  test('intelligence contains all required fields for AI decision making', () => {
    const intelligence = extractComponentIntelligence(buttonSource);

    // Core intelligence fields
    expect(intelligence.cognitiveLoad).toBe(3);
    expect(intelligence.attentionEconomics).toContain('Primary variant commands highest attention');
    expect(intelligence.trustBuilding).toContain('confirmation patterns');
    expect(intelligence.accessibility).toContain('WCAG AAA');
    expect(intelligence.semanticMeaning).toContain('primary=main actions');

    // Usage guidance for AI agents
    expect(intelligence.usagePatterns.do).toContain(
      'Primary: Main user goal, maximum 1 per section'
    );
    expect(intelligence.usagePatterns.never).toContain(
      'Multiple primary buttons competing for attention'
    );

    // Design reference links
    expect(intelligence.designGuides.length).toBeGreaterThan(0);
    expect(intelligence.designGuides.some((url) => url.includes('attention-economics'))).toBe(true);

    // Code examples for AI learning
    expect(intelligence.examples.length).toBeGreaterThan(0);
  });

  test('passes comprehensive AI consumability validation', () => {
    const consumability = validateAIConsumability(buttonSource);

    expect(consumability.hasRequiredIntelligence).toBe(true);
    expect(consumability.isParseable).toBe(true);
    expect(consumability.hasValidCognitiveLoad).toBe(true);
    expect(consumability.hasAccessibilityPatterns).toBe(true);
    expect(consumability.hasUsageGuidance).toBe(true);
    expect(consumability.hasDesignGuides).toBe(true);
    expect(consumability.canMakeDesignDecisions).toBe(true);
  });

  test('matches expected design patterns for AI guidance', () => {
    expect(buttonSource).toMatchDesignPatterns(['primary', 'confirmation', 'attention']);
  });

  test('uses only semantic tokens for AI understanding', () => {
    const tokenUsage = analyzeSemanticTokenUsage([buttonSource]);

    expect(tokenUsage).toUseSemanticTokensOnly();
    expect(tokenUsage.semanticTokensUsed).toContain('bg-primary');
    expect(tokenUsage.semanticTokensUsed).toContain('text-primary-foreground');
    expect(tokenUsage.semanticTokensUsed).toContain('bg-destructive');
    expect(tokenUsage.arbitraryValuesFound).toHaveLength(0);
  });
});

describe('Button AI Agent Decision Making', () => {
  const mockAI = new MockAIAgent();

  test('AI agent parses intelligence correctly', async () => {
    const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

    expect(intelligence.cognitiveLoad).toBe(3);
    expect(intelligence.usagePatterns.do).toContain(
      'Primary: Main user goal, maximum 1 per section'
    );
  });

  test('AI makes correct decisions for destructive actions', async () => {
    const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

    const decision = await mockAI.makeDesignDecision(intelligence, {
      isDestructiveAction: true,
      consequenceLevel: 'high',
    });

    expect(decision.recommendation).toBe('require-confirmation');
    expect(decision.reasoning).toContain('confirmation patterns');
    expect(decision.confidence).toBeGreaterThan(0.9);
  });

  test('AI respects attention economics for primary buttons', async () => {
    const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

    const decision = await mockAI.makeDesignDecision(intelligence, {
      attentionLevel: 'primary',
      sectionComplexity: 'moderate',
    });

    expect(decision.recommendation).toBe('limit-primary-usage');
    expect(decision.reasoning).toContain('maximum 1 primary action per section');
    expect(decision.confidence).toBeGreaterThan(0.85);
  });

  test('AI considers cognitive load for user experience levels', async () => {
    const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

    // Test beginner user context
    const beginnerDecision = await mockAI.makeDesignDecision(intelligence, {
      userExperience: 'beginner',
      sectionComplexity: 'simple',
    });

    expect(beginnerDecision.recommendation).toBe('proceed');
    expect(beginnerDecision.reasoning).toContain('cognitive load component');
    expect(intelligence.cognitiveLoad <= 5).toBe(true); // Good for beginners

    // Test with higher cognitive load component (hypothetical)
    const highLoadIntelligence = { ...intelligence, cognitiveLoad: 9 };

    const highLoadDecision = await mockAI.makeDesignDecision(highLoadIntelligence, {
      userExperience: 'beginner',
    });

    expect(highLoadDecision.recommendation).toBe('simplify-interaction');
    expect(highLoadDecision.reasoning).toContain('may overwhelm beginner users');
  });

  test('AI validates accessibility compliance', async () => {
    const intelligence = await mockAI.parseComponentIntelligence(Button.toString());

    const isAccessible = await mockAI.validateAccessibility(intelligence);

    expect(isAccessible).toBe(true);
    expect(intelligence.accessibility).toContain('WCAG');
    expect(intelligence.accessibility).toContain('screen reader');
    expect(intelligence.cognitiveLoad).toBeLessThanOrEqual(8); // Reasonable cognitive load
  });
});

describe('Button React 19 Compatibility', () => {
  test('is React 19 compatible', async () => {
    expect(Button).toBeReact19Compatible();
  });

  test('maintains purity for concurrent rendering', () => {
    expect(Button).toBePure();

    const purityReport = validateComponentPurity(Button);

    expect(purityReport.isPure).toBe(true);
    expect(purityReport.hasSideEffects).toBe(false);
    expect(purityReport.usesNonDeterministicSources).toBe(false);
    expect(purityReport.issues).toHaveLength(0);
  });

  test('handles concurrent rendering correctly', async () => {
    expect(Button).toHandleConcurrentRendering();

    const compatibility = await validateReact19Compatibility(Button);

    expect(compatibility.purity.isPure).toBe(true);
    expect(compatibility.concurrentRendering.maintainsConsistency).toBe(true);
    expect(compatibility.suspenseCompatible).toBe(true);
  });

  test('supports direct ref prop pattern', async () => {
    const compatibility = await validateReact19Compatibility(Button);

    expect(compatibility.refPatternWorks).toBe(true);
  });
});

describe('Button Intelligence-Performance Correlation', () => {
  test('cognitive load correlates with actual complexity', () => {
    const intelligence = extractComponentIntelligence(Button.toString());

    // Cognitive load 3/10 should indicate simple component
    expect(intelligence.cognitiveLoad).toBe(3);

    // Component source should be relatively simple (not overly complex)
    const componentComplexity = buttonSource.split('\n').length;
    expect(componentComplexity).toBeLessThan(200); // Reasonable LOC for cognitive load 3

    // Number of props should be reasonable for cognitive load
    const propsMatch = buttonSource.match(/(\w+)\??: /g) || [];
    const numberOfProps = propsMatch.length;
    expect(numberOfProps).toBeLessThan(15); // Reasonable prop count for load 3
  });

  test('trust building patterns match implementation', () => {
    const intelligence = extractComponentIntelligence(Button.toString());

    // Intelligence mentions confirmation patterns
    expect(intelligence.trustBuilding).toContain('confirmation patterns');

    // Implementation should include destructiveConfirm prop
    expect(buttonSource).toContain('destructiveConfirm');
    expect(buttonSource).toContain('shouldShowConfirmation');

    // Loading state for trust building
    expect(intelligence.trustBuilding).toContain('Loading');
    expect(buttonSource).toContain('loading');
    expect(buttonSource).toContain('aria-busy');
  });

  test('attention economics match visual implementation', () => {
    const intelligence = extractComponentIntelligence(Button.toString());

    // Intelligence mentions primary attention command
    expect(intelligence.attentionEconomics).toContain('Primary variant commands highest attention');

    // Implementation should have primary variant with distinct styling
    expect(buttonSource).toContain("variant === 'primary'");
    expect(buttonSource).toContain('bg-primary');
    expect(buttonSource).toContain('text-primary-foreground');

    // Size hierarchy mentioned in attention economics
    expect(intelligence.attentionEconomics).toContain('Size hierarchy');
    expect(buttonSource).toContain('size === ');
    expect(buttonSource).toContain("'sm'");
    expect(buttonSource).toContain("'lg'");
  });

  test('accessibility intelligence matches ARIA implementation', () => {
    const intelligence = extractComponentIntelligence(Button.toString());

    // Intelligence claims WCAG AAA compliance
    expect(intelligence.accessibility).toContain('WCAG AAA');

    // Implementation should include proper ARIA attributes
    expect(buttonSource).toContain('aria-busy');
    expect(buttonSource).toContain('aria-label');

    // Touch target requirements mentioned
    expect(intelligence.accessibility).toContain('44px minimum touch targets');

    // Implementation should have reasonable sizing
    expect(buttonSource).toContain('h-10'); // Medium size meets requirements
    expect(buttonSource).toContain('h-12'); // Large size definitely meets requirements
  });
});
