/**
 * Example usage of the Dependency Intelligence Service
 *
 * Demonstrates how the service integrates with Rafters' TokenRegistry
 * and provides intelligent analysis for Claude's design reasoning.
 */

import {
  GenerationRuleExecutor,
  GenerationRuleParser,
  TokenRegistry,
} from '@rafters/design-tokens';
import type { Token } from '@rafters/shared';
import { DependencyIntelligenceService } from '../apps/cli/src/mcp/services/dependency-intelligence';

async function demonstrateDependencyIntelligence() {
  console.log('🎯 Dependency Intelligence Service Demo');
  console.log('=====================================\n');

  // 1. Create a token registry with sample design tokens
  const tokens: Token[] = [
    {
      name: 'brand-primary',
      value: 'oklch(0.5 0.2 240)',
      category: 'color',
      intelligence: {
        cognitiveLoad: 3,
        attentionEconomics: 'Primary brand color - maximum attention',
        accessibility: 'WCAG AAA compliant',
        trustBuilding: 'Consistent brand identity across all touchpoints',
        semanticMeaning: 'Primary action and brand color',
      },
    },
    {
      name: 'brand-primary-hover',
      value: 'oklch(0.4 0.2 240)',
      category: 'color',
      intelligence: {
        cognitiveLoad: 3,
        attentionEconomics: 'Interactive feedback for primary actions',
        accessibility: 'Clear hover indication',
        trustBuilding: 'Predictable interaction feedback',
        semanticMeaning: 'Primary hover state',
      },
    },
    {
      name: 'spacing-base',
      value: '1rem',
      category: 'spacing',
      intelligence: {
        cognitiveLoad: 1,
        attentionEconomics: 'Foundation spacing unit',
        accessibility: 'Touch-friendly baseline',
        trustBuilding: 'Consistent spacing system',
        semanticMeaning: 'Base spacing measurement',
      },
    },
    {
      name: 'spacing-large',
      value: '2rem',
      category: 'spacing',
      intelligence: {
        cognitiveLoad: 1,
        attentionEconomics: 'Generous spacing for important content',
        accessibility: 'Ample touch targets',
        trustBuilding: 'Consistent spacing progression',
        semanticMeaning: 'Large spacing measurement',
      },
    },
  ];

  const registry = new TokenRegistry(tokens);

  // 2. Set up intelligent dependencies with rules
  registry.dependencyGraph.addDependency('brand-primary-hover', ['brand-primary'], 'state:hover');
  registry.dependencyGraph.addDependency('spacing-large', ['spacing-base'], 'scale:2');

  // 3. Initialize the Dependency Intelligence Service
  const service = new DependencyIntelligenceService(registry);

  // 4. Demonstrate dependency analysis
  console.log('📊 Analyzing token dependencies:');
  const analysis = await service.analyzeDependencies('brand-primary');

  if (analysis.success) {
    console.log(`✅ Token: ${analysis.data.tokenName}`);
    console.log(`📈 Cascade Scope: ${analysis.data.cascadeScope.length} tokens affected`);
    console.log(`🔗 Dependents: ${analysis.data.dependents.join(', ')}`);
    console.log(`⚡ Complexity Score: ${analysis.data.performanceMetrics.complexity}/10`);
    console.log(`🎯 Analysis Confidence: ${Math.round(analysis.confidence * 100)}%`);
    console.log(`⏱️  Execution Time: ${Math.round(analysis.executionTime)}ms\n`);
  }

  // 5. Demonstrate rule execution
  console.log('⚙️  Executing generation rule:');
  const ruleExecution = await service.executeRule('state:hover', 'brand-primary-hover', {
    tokenName: 'brand-primary-hover',
    dependencies: ['brand-primary'],
  });

  if (ruleExecution.success && ruleExecution.data.success) {
    console.log(`✅ Rule Type: ${ruleExecution.data.metadata.ruleType}`);
    console.log(`🎨 Generated Value: ${ruleExecution.data.result}`);
    console.log(`🎯 Execution Confidence: ${Math.round(ruleExecution.data.confidence * 100)}%`);
    console.log(`💭 Reasoning: ${ruleExecution.data.metadata.reasoning}\n`);
  }

  // 6. Demonstrate cascade impact prediction
  console.log('🔮 Predicting cascade impact of color change:');
  const impact = await service.predictCascadeImpact('brand-primary', 'oklch(0.6 0.25 120)');

  if (impact.success) {
    console.log(`🎯 Affected Tokens: ${impact.data.affectedTokens.length}`);
    console.log(`📊 Total Impact Score: ${Math.round(impact.data.totalImpact)}/10`);
    console.log(
      `⚠️  Breaking Changes Risk: ${Math.round(impact.data.riskAssessment.breakingChanges)}/10`
    );
    console.log(`🎨 Visual Impact: ${Math.round(impact.data.riskAssessment.visualImpact)}/10`);
    console.log(
      `♿ Accessibility Impact: ${Math.round(impact.data.riskAssessment.accessibilityImpact)}/10`
    );
    console.log(`🎯 Prediction Confidence: ${Math.round(impact.confidence * 100)}%`);

    if (impact.data.recommendations.length > 0) {
      console.log(`💡 Recommendations:`);
      for (const rec of impact.data.recommendations) {
        console.log(`   • ${rec}`);
      }
    }
    console.log('');
  }

  // 7. Demonstrate validation of complex changes
  console.log('✅ Validating complex token changes:');
  const validation = await service.validateChanges([
    {
      tokenName: 'brand-secondary',
      newValue: 'oklch(0.7 0.15 60)',
      dependencies: ['brand-primary'],
      rule: 'contrast:medium',
    },
    {
      tokenName: 'spacing-xl',
      newValue: '3rem',
      dependencies: ['spacing-large'],
      rule: 'scale:1.5',
    },
  ]);

  if (validation.success) {
    console.log(`✅ Changes Valid: ${validation.data.isValid}`);
    console.log(
      `⚡ Complexity Score: ${Math.round(validation.data.performanceImpact.complexity)}/10`
    );
    console.log(
      `⏱️  Estimated Regeneration: ${validation.data.performanceImpact.estimatedRegenerationTime}ms`
    );
    console.log(`🎯 Validation Confidence: ${Math.round(validation.confidence * 100)}%`);

    if (validation.data.errors.length > 0) {
      console.log(`❌ Errors Found:`);
      for (const error of validation.data.errors) {
        console.log(`   • ${error.message}`);
      }
    }

    if (validation.data.warnings.length > 0) {
      console.log(`⚠️  Warnings:`);
      for (const warning of validation.data.warnings) {
        console.log(`   • ${warning.message}`);
      }
    }
    console.log('');
  }

  console.log('🎉 Dependency Intelligence Service demonstration complete!');
  console.log('This service provides Claude with deep token relationship understanding.');
}

// Run the demonstration
if (require.main === module) {
  demonstrateDependencyIntelligence().catch(console.error);
}

export { demonstrateDependencyIntelligence };
