/**
 * Playground - Watch registry changes cascade through JSON and CSS
 *
 * Run with: pnpm exec tsx test/playground.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { registryToTailwind } from '../src/exporters/tailwind.js';
import { NodePersistenceAdapter } from '../src/persistence/node-adapter.js';
import { TokenRegistry } from '../src/registry.js';

const PROJECT_ROOT = join(import.meta.dirname, '../../..');
const RAFTERS_DIR = join(PROJECT_ROOT, '.rafters');
const OUTPUT_DIR = join(RAFTERS_DIR, 'output');

async function main() {
  console.log('\n=== Registry Playground ===\n');

  // Load tokens
  const adapter = new NodePersistenceAdapter(PROJECT_ROOT);
  const tokens = await adapter.load();
  console.log(`Loaded ${tokens.length} tokens from .rafters/tokens/`);

  // Create registry with dependency graph populated
  const registry = new TokenRegistry(tokens);
  registry.setAdapter(adapter);

  // Show initial state
  const spacingBase = registry.get('spacing-base');
  const spacing4 = registry.get('spacing-4');
  const primary = registry.get('primary');

  console.log('\n--- Initial Token State ---');
  console.log(`spacing-base: ${spacingBase?.value}`);
  console.log(`spacing-4: ${spacing4?.value}`);
  console.log(`primary: ${JSON.stringify(primary?.value)}`);

  // Show dependency graph
  console.log('\n--- Dependency Graph ---');
  const spacingBaseDependents = registry.getDependents('spacing-base');
  console.log(`spacing-base has ${spacingBaseDependents.length} dependents:`);
  console.log(
    `  ${spacingBaseDependents.slice(0, 8).join(', ')}${spacingBaseDependents.length > 8 ? '...' : ''}`,
  );

  const spacing4Deps = registry.getDependencies('spacing-4');
  console.log(`spacing-4 depends on: ${spacing4Deps.join(', ') || 'nothing'}`);
  console.log(`spacing-4 rule: ${spacing4?.generationRule}`);

  // Set up change callback for CSS export
  let changeCount = 0;
  registry.setChangeCallback(async (event) => {
    changeCount++;
    if (event.type === 'token-changed') {
      console.log(`  [${changeCount}] ${event.tokenName}: ${event.oldValue} -> ${event.newValue}`);
    }
  });

  // Test cascade: change spacing-base
  console.log('\n--- Testing Cascade ---');
  console.log('Changing spacing-base from 0.25rem to 0.3rem...');
  const originalBase = spacingBase?.value;
  await registry.set('spacing-base', '0.3rem');

  // Show cascaded changes
  const newSpacing4 = registry.get('spacing-4');
  const newSpacing8 = registry.get('spacing-8');
  console.log(`\nAfter cascade:`);
  console.log(`  spacing-4: ${newSpacing4?.value}`);
  console.log(`  spacing-8: ${newSpacing8?.value}`);

  // Check persistence
  const spacingJson = await readFile(join(RAFTERS_DIR, 'tokens/spacing.rafters.json'), 'utf-8');
  const spacingData = JSON.parse(spacingJson);
  const savedBase = spacingData.tokens.find((t: { name: string }) => t.name === 'spacing-base');
  const savedS4 = spacingData.tokens.find((t: { name: string }) => t.name === 'spacing-4');
  console.log(`\nIn spacing.rafters.json:`);
  console.log(`  spacing-base: ${savedBase?.value}`);
  console.log(`  spacing-4: ${savedS4?.value}`);

  // Restore original value
  console.log('\n--- Restoring ---');
  console.log(`Restoring spacing-base to ${originalBase}...`);
  if (originalBase) {
    await registry.set('spacing-base', originalBase);
  }

  // Generate CSS to show the output format
  const css = registryToTailwind(registry, { includeImport: true });
  await writeFile(join(OUTPUT_DIR, 'playground.css'), css);
  console.log(`\nGenerated ${OUTPUT_DIR}/playground.css (${Math.round(css.length / 1024)}KB)`);

  // Show a snippet of the CSS
  const spacingVars = css.match(/--spacing-[^:]+:[^;]+;/g)?.slice(0, 5) || [];
  console.log('\nCSS snippet (spacing variables):');
  for (const v of spacingVars) {
    console.log(`  ${v}`);
  }

  console.log('\n=== Playground Complete ===\n');
}

main().catch(console.error);
