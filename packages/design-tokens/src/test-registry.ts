import type { ColorValue, Token } from '@rafters/shared';
import { TokenRegistry } from './registry';

// Simple test script to verify color intelligence integration
async function testColorEnrichment() {
  console.log('Testing TokenRegistry color intelligence integration...\n');

  // Create a test color token
  const testToken: Token = {
    name: 'primary',
    value: {
      name: 'test-blue',
      scale: [
        { l: 0.5, c: 0.1, h: 240 }, // Medium blue
      ],
      value: '0', // First position in scale
      use: 'Primary brand color',
    },
    category: 'color',
    namespace: 'design-system',
    semanticMeaning: 'Primary brand color for CTAs',
    cognitiveLoad: 3,
    trustLevel: 'high',
  };

  // Create registry and add token
  const registry = new TokenRegistry([testToken]);

  console.log('Before enrichment:');
  const beforeToken = registry.get('primary');
  if (beforeToken && typeof beforeToken.value === 'object' && 'name' in beforeToken.value) {
    const colorValue = beforeToken.value as ColorValue;
    console.log(`- Name: ${colorValue.name}`);
    console.log(`- Has intelligence: ${!!colorValue.intelligence}`);
    console.log(`- Has harmonies: ${!!colorValue.harmonies}`);
    console.log(`- Has accessibility: ${!!colorValue.accessibility}\n`);
  }

  // Enrich the color token
  console.log('Enriching token with AI intelligence...');
  try {
    // await registry.enrichColorToken('primary'); // Method removed

    console.log('\nAfter enrichment:');
    const afterToken = registry.get('primary');
    if (afterToken && typeof afterToken.value === 'object' && 'name' in afterToken.value) {
      const colorValue = afterToken.value as ColorValue;
      console.log(`- Name: ${colorValue.name}`);
      console.log(`- Has intelligence: ${!!colorValue.intelligence}`);
      console.log(`- Has harmonies: ${!!colorValue.harmonies}`);
      console.log(`- Has accessibility: ${!!colorValue.accessibility}`);
      console.log(`- Token ID: ${colorValue.token}`);

      if (colorValue.intelligence) {
        console.log('\nAI Intelligence:');
        console.log(`- Reasoning: ${colorValue.intelligence.reasoning.substring(0, 100)}...`);
        console.log(`- Usage: ${colorValue.intelligence.usageGuidance.substring(0, 100)}...`);
      }

      if (colorValue.analysis) {
        console.log('\nColor Analysis:');
        console.log(`- Temperature: ${colorValue.analysis.temperature}`);
        console.log(`- Is Light: ${colorValue.analysis.isLight}`);
      }
    }
  } catch (error) {
    console.error('Enrichment failed:', error);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testColorEnrichment();
}
