#!/usr/bin/env tsx

/**
 * Generate and display the complete globals.css output from Tailwind v4 exporter
 */

import { exportToTailwindV4Complete } from '../src/exporters/tailwind-v4.ts';
import { generateAllTokens } from '../src/generators/index.ts';
import { TokenRegistry } from '../src/registry.ts';

async function main() {
  const tokens = await generateAllTokens();
  const registry = new TokenRegistry(tokens);
  const css = exportToTailwindV4Complete(registry);

  console.log(css);
}

main().catch(console.error);
