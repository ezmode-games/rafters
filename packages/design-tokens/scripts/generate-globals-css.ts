#!/usr/bin/env tsx

/**
 * Generate and display the complete globals.css output from Tailwind v4 exporter
 */

import { exportToTailwindV4Complete } from '../src/exporters/tailwind-v4.ts';
import { generateAllTokens } from '../src/generators/index.ts';
import { TokenRegistry } from '../src/registry.ts';

async function main() {
  console.log('🎨 Generating complete globals.css from Tailwind v4 exporter...\n');

  // Generate all tokens
  console.log('📦 Generating design tokens...');
  const tokens = await generateAllTokens();
  console.log(`✅ Generated ${tokens.length} design tokens\n`);

  // Create registry
  console.log('🗂️  Building token registry...');
  const registry = new TokenRegistry(tokens);
  console.log('✅ Registry built with dependency tracking\n');

  // Export to Tailwind v4 CSS
  console.log('🎯 Exporting to Tailwind v4 CSS...');
  const css = exportToTailwindV4Complete(registry);
  console.log('✅ Export complete\n');

  // Display the CSS
  console.log('📄 Generated globals.css:');
  console.log('='.repeat(80));
  console.log(css);
  console.log('='.repeat(80));

  // Display summary stats
  const lines = css.split('\n').length;
  const cssVars = (css.match(/--[\w-]+:/g) || []).length;
  const colors = (css.match(/--color-[\w-]+:/g) || []).length;
  const keyframes = (css.match(/@keyframes/g) || []).length;

  console.log('\n📊 Summary:');
  console.log(`   Lines: ${lines}`);
  console.log(`   CSS Variables: ${cssVars}`);
  console.log(`   Color Variables: ${colors}`);
  console.log(`   Keyframes: ${keyframes}`);
  console.log(`   File size: ~${Math.round(css.length / 1024)}KB`);
}

main().catch(console.error);
