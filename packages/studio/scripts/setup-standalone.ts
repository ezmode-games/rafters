/**
 * Setup standalone Studio development
 *
 * Creates a minimal .rafters structure within the studio package
 * so Studio can run without the CLI or a real project.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildColorSystem, registryToTailwind } from '@rafters/design-tokens';

const STUDIO_ROOT = join(import.meta.dirname, '..');
const RAFTERS_ROOT = join(STUDIO_ROOT, '.rafters');
const TOKENS_DIR = join(RAFTERS_ROOT, 'tokens');
const OUTPUT_DIR = join(RAFTERS_ROOT, 'output');

async function main() {
  console.log('Setting up standalone Studio development...\n');

  // Create directories
  await mkdir(TOKENS_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Generate default token system
  const result = buildColorSystem({
    exports: {
      tailwind: { includeImport: true },
      typescript: { includeJSDoc: true },
      dtcg: true,
    },
  });

  const { registry } = result;
  console.log(`Generated ${registry.size()} tokens\n`);

  // Group tokens by namespace
  const tokensByNamespace = new Map<string, typeof result.system.allTokens>();

  for (const token of registry.list()) {
    if (!tokensByNamespace.has(token.namespace)) {
      tokensByNamespace.set(token.namespace, []);
    }
    tokensByNamespace.get(token.namespace)?.push(token);
  }

  // Save each namespace
  for (const [namespace, tokens] of tokensByNamespace) {
    const filePath = join(TOKENS_DIR, `${namespace}.rafters.json`);
    await writeFile(filePath, JSON.stringify(tokens, null, 2));
    console.log(`  Saved ${tokens.length} tokens to ${namespace}.rafters.json`);
  }

  // Generate CSS output
  // Studio expects two files:
  // - rafters.tailwind.css: static @theme with var() refs (processed by Tailwind)
  // - rafters.vars.css: pure CSS variables (instant HMR on token changes)
  const css = registryToTailwind(registry, { includeImport: true });
  await writeFile(join(OUTPUT_DIR, 'rafters.tailwind.css'), css);
  await writeFile(join(OUTPUT_DIR, 'rafters.vars.css'), css);
  console.log('\n  Generated rafters.tailwind.css and rafters.vars.css');

  // Create config
  const config = {
    framework: 'vite',
    componentsPath: 'src/components/ui',
    primitivesPath: 'src/lib/primitives',
    cssPath: null,
    shadcn: false,
    exports: {
      tailwind: true,
      typescript: false,
      dtcg: false,
      compiled: false,
    },
  };
  await writeFile(join(RAFTERS_ROOT, 'config.rafters.json'), JSON.stringify(config, null, 2));
  console.log('  Created config.rafters.json');

  console.log('\nStandalone setup complete!');
  console.log('Run: pnpm --filter=@rafters/studio dev:standalone');
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
