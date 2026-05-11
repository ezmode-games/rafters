/**
 * Studio Flow Test - Simulates the two-phase color selection
 *
 * Run with: pnpm exec tsx test/studio-flow.ts
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ColorReference, Token } from '@rafters/shared';
import { registryToVars } from '../src/exporters/tailwind.js';
import { NodePersistenceAdapter } from '../src/persistence/node-adapter.js';
import { TokenRegistry } from '../src/registry.js';

const PROJECT_ROOT = join(import.meta.dirname, '../../..');
const RAFTERS_DIR = join(PROJECT_ROOT, '.rafters');
const OUTPUT_DIR = join(RAFTERS_DIR, 'output');

async function main() {
  console.log('\n=== Studio Flow Test ===\n');

  // 1. Initialize registry (what Vite plugin does on server start)
  console.log('1. Initializing registry from persistence...');
  const adapter = new NodePersistenceAdapter(PROJECT_ROOT);
  const tokens = await adapter.load();
  const registry = new TokenRegistry(tokens);
  registry.setAdapter(adapter);
  console.log(`   Loaded ${tokens.length} tokens`);

  // 2. Set up change callback (what Vite plugin does)
  let cssUpdateCount = 0;
  registry.setChangeCallback(async () => {
    cssUpdateCount++;
    const css = registryToVars(registry);
    await writeFile(join(OUTPUT_DIR, 'studio-flow.vars.css'), css);
    console.log(`   [CSS Updated #${cssUpdateCount}] Wrote ${Math.round(css.length / 1024)}KB`);
  });

  // 3. Get initial state
  const primary = registry.get('primary');
  const originalRef = primary?.value as ColorReference;
  console.log(`\n2. Initial state:`);
  console.log(`   primary = ${JSON.stringify(originalRef)}`);
  console.log(`   -> resolves to: ${originalRef.family}-${originalRef.position}`);

  // 4. Phase 1: Instant feedback (persist: false simulation)
  console.log('\n3. Phase 1: Instant feedback (no disk write)...');
  const newRef: ColorReference = { family: 'silver-true-sky', position: '600' };
  console.log(`   Changing primary to: ${JSON.stringify(newRef)}`);

  // This simulates persist: false - just update in memory
  registry.updateToken('primary', newRef);

  // Check in-memory state
  const afterPhase1 = registry.get('primary');
  console.log(`   In-memory: primary = ${JSON.stringify(afterPhase1?.value)}`);

  // Check disk state (should be unchanged)
  const jsonAfterPhase1 = await readFile(
    join(RAFTERS_DIR, 'tokens/semantic.rafters.json'),
    'utf-8',
  );
  const diskPrimary1 = JSON.parse(jsonAfterPhase1).tokens.find((t: Token) => t.name === 'primary');
  console.log(`   On disk:   primary = ${JSON.stringify(diskPrimary1?.value)}`);
  console.log(`   CSS was updated: ${cssUpdateCount > 0 ? 'YES' : 'NO'}`);

  // 5. Phase 2: Full save with enriched data (persist: true simulation)
  console.log('\n4. Phase 2: Full save with enriched data...');

  // Simulate API enrichment complete - now do full save
  await registry.set('primary', newRef);

  // Check disk state (should be updated)
  const jsonAfterPhase2 = await readFile(
    join(RAFTERS_DIR, 'tokens/semantic.rafters.json'),
    'utf-8',
  );
  const diskPrimary2 = JSON.parse(jsonAfterPhase2).tokens.find((t: Token) => t.name === 'primary');
  console.log(`   On disk:   primary = ${JSON.stringify(diskPrimary2?.value)}`);

  // 6. Verify CSS has correct reference
  const css = await readFile(join(OUTPUT_DIR, 'studio-flow.vars.css'), 'utf-8');
  const primaryCss = css.match(/--rafters-primary:[^;]+;/)?.[0];
  console.log(`   CSS:       ${primaryCss}`);

  // 7. Restore original
  console.log('\n5. Restoring original value...');
  await registry.set('primary', originalRef);
  console.log(`   Restored primary to: ${JSON.stringify(originalRef)}`);

  // Final verification
  const finalJson = await readFile(join(RAFTERS_DIR, 'tokens/semantic.rafters.json'), 'utf-8');
  const finalPrimary = JSON.parse(finalJson).tokens.find((t: Token) => t.name === 'primary');
  console.log(`   On disk:   primary = ${JSON.stringify(finalPrimary?.value)}`);

  console.log(`\n=== Test Complete (${cssUpdateCount} CSS updates) ===\n`);
}

main().catch(console.error);
