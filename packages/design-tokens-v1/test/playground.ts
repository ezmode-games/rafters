/**
 * Playground - Explore rich token values (ColorReference, ColorValue)
 *
 * Run with: pnpm exec tsx test/playground.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ColorReference, Token } from '@rafters/shared';
import { registryToTailwind } from '../src/exporters/tailwind.js';
import { NodePersistenceAdapter } from '../src/persistence/node-adapter.js';
import { TokenRegistry } from '../src/registry.js';

const PROJECT_ROOT = join(import.meta.dirname, '../../..');
const RAFTERS_DIR = join(PROJECT_ROOT, '.rafters');
const OUTPUT_DIR = join(RAFTERS_DIR, 'output');

async function main() {
  console.log('\n=== Registry Playground - Rich Token Values ===\n');

  // Load tokens
  const adapter = new NodePersistenceAdapter(PROJECT_ROOT);
  const tokens = await adapter.load();
  console.log(`Loaded ${tokens.length} tokens`);

  const registry = new TokenRegistry(tokens);
  registry.setAdapter(adapter);

  // --- Explore different value types ---

  console.log('\n--- Token Value Types ---');

  // 1. String value (spacing, simple colors)
  const spacingBase = registry.get('spacing-base');
  console.log(`\nspacing-base (string):`);
  console.log(`  value: ${spacingBase?.value}`);
  console.log(`  type: ${typeof spacingBase?.value}`);

  // 2. ColorReference value (semantic tokens)
  const primary = registry.get('primary');
  console.log(`\nprimary (ColorReference):`);
  console.log(`  value: ${JSON.stringify(primary?.value)}`);
  if (primary?.value && typeof primary.value === 'object' && 'family' in primary.value) {
    const ref = primary.value as ColorReference;
    console.log(`  family: ${ref.family}`);
    console.log(`  position: ${ref.position}`);
    console.log(`  -> resolves to: ${ref.family}-${ref.position}`);
  }

  // 3. Check destructive (another semantic)
  const destructive = registry.get('destructive');
  console.log(`\ndestructive (ColorReference):`);
  console.log(`  value: ${JSON.stringify(destructive?.value)}`);

  // --- Test setting a ColorReference ---

  console.log('\n--- Setting ColorReference ---');
  const originalPrimary = primary?.value;

  // Change primary to point to a different color family/position
  const newPrimaryRef: ColorReference = { family: 'neutral', position: '700' };
  console.log(
    `Changing primary from ${JSON.stringify(originalPrimary)} to ${JSON.stringify(newPrimaryRef)}`,
  );

  await registry.set('primary', newPrimaryRef);

  // Verify the change
  const updatedPrimary = registry.get('primary');
  console.log(`\nAfter set():`);
  console.log(`  primary.value: ${JSON.stringify(updatedPrimary?.value)}`);

  // Check persistence
  const semanticJson = await readFile(join(RAFTERS_DIR, 'tokens/semantic.rafters.json'), 'utf-8');
  const semanticData = JSON.parse(semanticJson);
  const savedPrimary = semanticData.tokens.find((t: Token) => t.name === 'primary');
  console.log(`\nIn semantic.rafters.json:`);
  console.log(`  primary.value: ${JSON.stringify(savedPrimary?.value)}`);

  // --- Restore ---
  console.log('\n--- Restoring ---');
  if (originalPrimary) {
    await registry.set('primary', originalPrimary);
    console.log(`Restored primary to: ${JSON.stringify(originalPrimary)}`);
  }

  // --- Generate CSS to see how ColorReferences resolve ---
  console.log('\n--- CSS Output ---');
  const css = registryToTailwind(registry, { includeImport: true });
  await writeFile(join(OUTPUT_DIR, 'playground.css'), css);

  // Find primary-related CSS
  const primaryCss = css.match(/--primary[^;]*;/g)?.slice(0, 3) || [];
  console.log('Primary CSS variables:');
  for (const v of primaryCss) {
    console.log(`  ${v}`);
  }

  console.log('\n=== Playground Complete ===\n');
}

main().catch(console.error);
