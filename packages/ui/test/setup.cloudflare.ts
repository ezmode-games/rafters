/**
 * Cloudflare Workers Test Setup
 *
 * Global setup for Workers integration testing.
 * Configures KV, D1, R2, and Queue bindings for design intelligence testing.
 */

import { createExecutionContext, env } from 'cloudflare:test';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

// Mock component intelligence data for testing
const MOCK_INTELLIGENCE_DATA = {
  button: {
    registryName: 'button',
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
    registryName: 'dialog',
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

// Global test context
declare global {
  const testEnv: Env;
  const testCtx: ExecutionContext;
}

beforeAll(async () => {
  // Populate KV with mock intelligence data
  for (const [component, data] of Object.entries(MOCK_INTELLIGENCE_DATA)) {
    await env.RAFTERS_INTEL.put(`component:${component}`, JSON.stringify(data), {
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        type: 'component-intelligence',
      },
    });
  }

  // Set up design tokens in KV
  const designTokens = {
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

  await env.DESIGN_TOKENS.put('tokens:v1', JSON.stringify(designTokens));

  // Initialize component registry
  const registry = {
    version: '1.0.0',
    components: Object.keys(MOCK_INTELLIGENCE_DATA),
    lastSync: new Date().toISOString(),
  };

  await env.COMPONENT_REGISTRY.put('registry:metadata', JSON.stringify(registry));
});

beforeEach(async () => {
  // Each test gets a fresh execution context
  const ctx = createExecutionContext();

  // Make env and context available globally for tests
  // @ts-expect-error - global test setup
  globalThis.testEnv = env;
  // @ts-expect-error - global test setup
  globalThis.testCtx = ctx;
});

afterEach(async () => {
  // Clean up any test-specific data
  // (KV namespaces are isolated per test automatically)
});

afterAll(async () => {
  // Global cleanup if needed
  // Workers environment handles cleanup automatically
});

// Helper functions for Workers testing
export async function getComponentIntelligence(componentName: string) {
  return await env.RAFTERS_INTEL.get(`component:${componentName}`, 'json');
}

export async function storeComponentIntelligence(
  componentName: string,
  intelligence: Record<string, unknown>
) {
  return await env.RAFTERS_INTEL.put(`component:${componentName}`, JSON.stringify(intelligence), {
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      type: 'component-intelligence',
    },
  });
}

export async function getDesignTokens() {
  return await env.DESIGN_TOKENS.get('tokens:v1', 'json');
}

export async function simulateClaudeAPICall(prompt: string) {
  // Mock Claude API response for testing
  return {
    content: `Analyzed component intelligence: ${prompt}`,
    usage: { input_tokens: 100, output_tokens: 50 },
    model: 'claude-3.5-haiku',
  };
}

export async function processIntelligenceQueue(message: Record<string, unknown>) {
  // Mock queue processing for intelligence updates
  await env.INTELLIGENCE_QUEUE.send(message);
}

export interface Env {
  RAFTERS_INTEL: KVNamespace;
  DESIGN_TOKENS: KVNamespace;
  COMPONENT_REGISTRY: KVNamespace;
  DESIGN_DB: D1Database;
  DESIGN_ASSETS: R2Bucket;
  INTELLIGENCE_QUEUE: Queue;
  CLAUDE_API_KEY: string;
  INTELLIGENCE_VERSION: string;
}
