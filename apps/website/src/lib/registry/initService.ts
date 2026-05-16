/**
 * Init Service
 * Generates the init payload for `rafters init`
 */

import {
  contrastPlugin,
  generateBaseSystem,
  invertPlugin,
  registryToTailwind,
  scalePlugin,
  statePlugin,
  TokenRegistry,
} from '@rafters/design-tokens';

export interface InitPayload {
  version: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

/**
 * Generate the init payload with theme.css and config
 */
export function generateInitPayload(): InitPayload {
  // Generate the complete token system + Tailwind export. Replaces
  // v1's buildColorSystem({exports: {tailwind: {...}}}) wrapper -- the
  // new package separates generation from export so the caller drives both.
  const system = generateBaseSystem();
  const registry = new TokenRegistry(system.allTokens, [
    scalePlugin,
    contrastPlugin,
    statePlugin,
    invertPlugin,
  ]);
  const themeCss = registryToTailwind(registry, { includeImport: true });

  const config = {
    $schema: 'https://rafters.studio/schema/config.json',
    version: '0.0.1',
    theme: {
      css: './theme.css',
    },
    components: {
      path: './components/ui',
    },
    primitives: {
      path: './lib/primitives',
    },
  };

  return {
    version: '0.0.1',
    files: [
      {
        path: 'theme.css',
        content: themeCss,
      },
      {
        path: 'rafters.json',
        content: JSON.stringify(config, null, 2),
      },
    ],
  };
}
