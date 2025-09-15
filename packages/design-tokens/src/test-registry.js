import { TokenRegistry } from './registry';
// Simple test script to verify color intelligence integration
async function testColorEnrichment() {
    console.log('Testing TokenRegistry color intelligence integration...\n');
    // Create a test color token
    const testToken = {
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
    if (beforeToken && typeof beforeToken.value === 'object') {
        console.log(`- Name: ${beforeToken.value.name}`);
        console.log(`- Has intelligence: ${!!beforeToken.value.intelligence}`);
        console.log(`- Has harmonies: ${!!beforeToken.value.harmonies}`);
        console.log(`- Has accessibility: ${!!beforeToken.value.accessibility}\n`);
    }
    // Enrich the color token
    console.log('Enriching token with AI intelligence...');
    try {
        await registry.enrichColorToken('primary');
        console.log('\nAfter enrichment:');
        const afterToken = registry.get('primary');
        if (afterToken && typeof afterToken.value === 'object') {
            console.log(`- Name: ${afterToken.value.name}`);
            console.log(`- Has intelligence: ${!!afterToken.value.intelligence}`);
            console.log(`- Has harmonies: ${!!afterToken.value.harmonies}`);
            console.log(`- Has accessibility: ${!!afterToken.value.accessibility}`);
            console.log(`- Token ID: ${afterToken.value.token}`);
            if (afterToken.value.intelligence) {
                console.log('\nAI Intelligence:');
                console.log(`- Reasoning: ${afterToken.value.intelligence.reasoning.substring(0, 100)}...`);
                console.log(`- Usage: ${afterToken.value.intelligence.usageGuidance.substring(0, 100)}...`);
            }
            if (afterToken.value.analysis) {
                console.log('\nColor Analysis:');
                console.log(`- Temperature: ${afterToken.value.analysis.temperature}`);
                console.log(`- Is Light: ${afterToken.value.analysis.isLight}`);
            }
        }
    }
    catch (error) {
        console.error('Enrichment failed:', error);
    }
}
// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testColorEnrichment();
}
//# sourceMappingURL=test-registry.js.map