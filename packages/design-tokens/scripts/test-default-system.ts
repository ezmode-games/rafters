#!/usr/bin/env tsx

/**
 * Test script for the default system generation
 * Validates that generateAllTokens() produces a complete design system
 */

import { generateAllTokens } from '../src/generators/index.js';

async function testDefaultSystem() {
  console.log('🎨 Testing Rafters Default System Generation');
  console.log('Primary Color: oklch(0.44 0.01 286) - Rafters Gray');
  console.log('');

  try {
    console.log('⏳ Generating complete token system...');
    const startTime = Date.now();

    const tokens = await generateAllTokens();

    const endTime = Date.now();
    console.log(`✅ Generated ${tokens.length} tokens in ${endTime - startTime}ms`);
    console.log('');

    // Analyze token distribution
    const categories = tokens.reduce(
      (acc, token) => {
        acc[token.category] = (acc[token.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log('📊 Token Distribution:');
    Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  ${category.padEnd(20)} ${count.toString().padStart(3)} tokens`);
      });
    console.log('');

    // Validate color tokens
    const colorTokens = tokens.filter(
      (t) => t.category === 'color' || t.category === 'color-family'
    );
    console.log(`🎨 Color System: ${colorTokens.length} tokens`);

    // Show sample of each category
    console.log('📝 Sample Tokens by Category:');
    Object.keys(categories).forEach((category) => {
      const samples = tokens.filter((t) => t.category === category).slice(0, 3);
      console.log(`  ${category}:`);
      samples.forEach((token) => {
        console.log(`    - ${token.name}`);
      });
    });
    console.log('');

    // Validation checks
    const validationResults = {
      'Has color tokens': colorTokens.length > 0,
      'Has 240+ total tokens': tokens.length >= 240,
      'All tokens have names': tokens.every((t) => t.name && t.name.length > 0),
      'All tokens have categories': tokens.every((t) => t.category && t.category.length > 0),
      'Has spacing tokens': tokens.some((t) => t.category === 'spacing'),
      'Has typography tokens': tokens.some((t) => t.category === 'font-size'),
      'Has motion tokens': tokens.some((t) => t.category === 'motion'),
    };

    console.log('✅ Validation Results:');
    Object.entries(validationResults).forEach(([check, passed]) => {
      const icon = passed ? '✅' : '❌';
      console.log(`  ${icon} ${check}`);
    });

    const allPassed = Object.values(validationResults).every(Boolean);

    console.log('');
    if (allPassed) {
      console.log('🎉 Default system generation SUCCESS!');
      console.log('✨ Ready for embedding in Rafters CLI');
    } else {
      console.log('⚠️  Some validation checks failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error generating default system:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDefaultSystem();
}
