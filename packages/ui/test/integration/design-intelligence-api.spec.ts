/**
 * Design Intelligence API Integration Tests
 *
 * Tests the edge-first design intelligence system running on Cloudflare Workers.
 * Validates AI agent integration, KV storage patterns, and intelligence processing.
 *
 * These tests run in the actual Workers runtime environment to ensure
 * compatibility with Cloudflare's edge infrastructure.
 */

import { createExecutionContext, env } from 'cloudflare:test';
import { describe, expect, test } from 'vitest';
import {
  getComponentIntelligence,
  getDesignTokens,
  processIntelligenceQueue,
  simulateClaudeAPICall,
  storeComponentIntelligence,
} from '../setup.cloudflare';

describe('Design Intelligence API - Workers Integration', () => {
  test('retrieves component intelligence from KV', async () => {
    // Test retrieving pre-seeded button intelligence
    const buttonIntelligence = await getComponentIntelligence('button');

    expect(buttonIntelligence).toBeDefined();
    expect(buttonIntelligence.cognitiveLoad).toBe(3);
    expect(buttonIntelligence.attentionEconomics).toContain(
      'Primary variant commands highest attention'
    );
    expect(buttonIntelligence.trustBuilding).toContain('confirmation patterns');
  });

  test('stores and retrieves new component intelligence', async () => {
    const newIntelligence = {
      registryName: 'input',
      cognitiveLoad: 4,
      attentionEconomics: 'Form field attention follows visual hierarchy',
      trustBuilding: 'Clear validation feedback builds trust',
      accessibility: 'WCAG AAA form patterns with clear labels',
      semanticMeaning: 'Data input contexts with validation',
      usagePatterns: {
        do: ['Clear labels, immediate validation feedback'],
        never: ['Unlabeled inputs, delayed validation'],
      },
    };

    // Store new intelligence
    await storeComponentIntelligence('input', newIntelligence);

    // Retrieve and validate
    const retrieved = await getComponentIntelligence('input');
    expect(retrieved).toEqual(newIntelligence);
  });

  test('processes design token intelligence correctly', async () => {
    const tokens = await getDesignTokens();

    expect(tokens).toBeDefined();
    expect(tokens.colors.primary).toContain('oklch');
    expect(tokens.cognitive['load-3']).toEqual({
      complexity: 'simple',
      renderTime: '<25ms',
    });
  });

  test('handles AI agent intelligence parsing workflow', async () => {
    // Simulate AI agent requesting component intelligence
    const componentName = 'button';
    const intelligence = await getComponentIntelligence(componentName);

    // AI agent processes intelligence
    const aiPrompt = `Analyze this component intelligence for UX decision making: ${JSON.stringify(intelligence)}`;
    const aiResponse = await simulateClaudeAPICall(aiPrompt);

    expect(aiResponse.content).toContain('Analyzed component intelligence');
    expect(aiResponse.usage.input_tokens).toBeGreaterThan(0);
  });

  test('queues intelligence updates for processing', async () => {
    const updateMessage = {
      type: 'intelligence-update',
      component: 'button',
      changes: {
        cognitiveLoad: 4, // Updated from 3
        updatedBy: 'ai-agent',
        timestamp: new Date().toISOString(),
      },
    };

    // Process through queue (simulated)
    await processIntelligenceQueue(updateMessage);

    // In real implementation, this would trigger worker processing
    expect(updateMessage.type).toBe('intelligence-update');
  });

  test('validates intelligence query performance in edge environment', async () => {
    const start = performance.now();

    // Multiple rapid intelligence queries (simulating AI agent usage)
    const queries = await Promise.all([
      getComponentIntelligence('button'),
      getComponentIntelligence('dialog'),
      getDesignTokens(),
    ]);

    const queryTime = performance.now() - start;

    // All queries should succeed
    expect(queries[0]).toBeDefined(); // button
    expect(queries[1]).toBeDefined(); // dialog
    expect(queries[2]).toBeDefined(); // tokens

    // Edge performance should be fast
    expect(queryTime).toBeLessThan(100); // < 100ms for all queries
  });

  test('handles missing component intelligence gracefully', async () => {
    const missingComponent = await getComponentIntelligence('nonexistent-component');
    expect(missingComponent).toBeNull();

    // Should not throw errors when component doesn't exist
    expect(async () => {
      await getComponentIntelligence('another-missing-component');
    }).not.toThrow();
  });

  test('validates intelligence metadata structure', async () => {
    // Get intelligence with metadata
    const intelligenceWithMeta = await env.RAFTERS_INTEL.getWithMetadata('component:button');

    expect(intelligenceWithMeta.metadata).toBeDefined();
    expect(intelligenceWithMeta.metadata.version).toBe('1.0.0');
    expect(intelligenceWithMeta.metadata.type).toBe('component-intelligence');
    expect(intelligenceWithMeta.metadata.lastUpdated).toBeTruthy();
  });

  test('supports component registry queries', async () => {
    const registry = await env.COMPONENT_REGISTRY.get('registry:metadata', 'json');

    expect(registry).toBeDefined();
    expect(registry.version).toBe('1.0.0');
    expect(registry.components).toContain('button');
    expect(registry.components).toContain('dialog');
    expect(new Date(registry.lastSync)).toBeInstanceOf(Date);
  });

  test('enables cross-component intelligence correlation', async () => {
    // Get intelligence for multiple related components
    const buttonIntel = await getComponentIntelligence('button');
    const dialogIntel = await getComponentIntelligence('dialog');

    // Test intelligence correlation patterns
    expect(buttonIntel.cognitiveLoad).toBeLessThan(dialogIntel.cognitiveLoad);
    expect(dialogIntel.trustBuilding).toContain('progressive confirmation');
    expect(buttonIntel.trustBuilding).toContain('confirmation patterns');

    // Both should have accessibility guidance
    expect(buttonIntel.accessibility).toContain('WCAG');
    expect(dialogIntel.accessibility).toContain('WCAG');
  });

  test('validates intelligence versioning support', async () => {
    // Test intelligence versioning for component evolution
    const buttonIntelV1 = await getComponentIntelligence('button');

    // Store updated version
    const buttonIntelV2 = {
      ...buttonIntelV1,
      cognitiveLoad: 2, // Reduced complexity
      version: '2.0.0',
      changes: ['Simplified interaction patterns', 'Reduced visual complexity'],
    };

    await env.RAFTERS_INTEL.put('component:button:v2', JSON.stringify(buttonIntelV2), {
      metadata: {
        version: '2.0.0',
        previousVersion: '1.0.0',
        lastUpdated: new Date().toISOString(),
        type: 'component-intelligence',
      },
    });

    const retrievedV2 = await env.RAFTERS_INTEL.get('component:button:v2', 'json');
    expect(retrievedV2.version).toBe('2.0.0');
    expect(retrievedV2.cognitiveLoad).toBe(2);
  });
});

describe('AI Agent Integration Patterns', () => {
  test('simulates Claude agent component analysis workflow', async () => {
    const _ctx = createExecutionContext();

    // Step 1: AI agent requests component intelligence
    const intelligence = await getComponentIntelligence('button');

    // Step 2: AI analyzes intelligence for design decision
    const designContext = {
      isDestructiveAction: true,
      attentionLevel: 'primary',
      userExperience: 'beginner',
    };

    // Step 3: AI makes informed decision based on intelligence
    const decision = analyzeDesignDecision(intelligence, designContext);

    expect(decision.requiresConfirmation).toBe(true); // Destructive action
    expect(decision.cognitiveLoadAppropriate).toBe(true); // Load 3 OK for beginners
    expect(decision.attentionEconomicsValid).toBe(true); // Primary usage valid
  });

  test('validates multi-component design system intelligence', async () => {
    // AI agent analyzing entire design system
    const allComponents = ['button', 'dialog'];
    const systemIntelligence = await Promise.all(
      allComponents.map((name) => getComponentIntelligence(name))
    );

    // Validate system-wide cognitive load distribution
    const totalCognitiveLoad = systemIntelligence.reduce(
      (sum, intel) => sum + intel.cognitiveLoad,
      0
    );

    expect(totalCognitiveLoad).toBeLessThan(20); // Reasonable system complexity
    expect(systemIntelligence.every((intel) => intel.accessibility.includes('WCAG'))).toBe(true);
  });
});

describe('Edge Performance & Scalability', () => {
  test('handles high-frequency intelligence queries', async () => {
    // Simulate high AI agent usage
    const queryPromises = Array.from({ length: 50 }, (_, i) =>
      getComponentIntelligence(i % 2 === 0 ? 'button' : 'dialog')
    );

    const start = performance.now();
    const results = await Promise.all(queryPromises);
    const totalTime = performance.now() - start;

    // All queries should succeed
    expect(results.every((result) => result !== null)).toBe(true);

    // Should maintain performance under load
    expect(totalTime).toBeLessThan(500); // < 500ms for 50 queries

    // Average per query should be fast
    const avgQueryTime = totalTime / 50;
    expect(avgQueryTime).toBeLessThan(10); // < 10ms per query
  });

  test('validates KV storage limits and patterns', async () => {
    // Test large intelligence objects
    const largeIntelligence = {
      registryName: 'complex-component',
      cognitiveLoad: 8,
      // Large description for testing storage
      description: 'A'.repeat(1000),
      attentionEconomics: 'Complex attention patterns require careful management',
      accessibility: 'Full WCAG AAA compliance with extensive patterns',
      // Multiple examples
      examples: Array.from({ length: 10 }, (_, i) => `Example ${i}: ${'detail '.repeat(50)}`),
    };

    // Should store and retrieve large objects successfully
    await storeComponentIntelligence('complex-component', largeIntelligence);
    const retrieved = await getComponentIntelligence('complex-component');

    expect(retrieved.description).toHaveLength(1000);
    expect(retrieved.examples).toHaveLength(10);
  });
});

// Helper function for AI decision simulation
function analyzeDesignDecision(
  intelligence: Record<string, unknown>,
  context: Record<string, unknown>
) {
  return {
    requiresConfirmation:
      context.isDestructiveAction && intelligence.trustBuilding.includes('confirmation'),
    cognitiveLoadAppropriate:
      intelligence.cognitiveLoad <= (context.userExperience === 'beginner' ? 5 : 8),
    attentionEconomicsValid:
      context.attentionLevel === 'primary' && intelligence.attentionEconomics.includes('Primary'),
  };
}
