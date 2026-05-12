/**
 * Init Service
 * Generates the init payload for `rafters init`
 */

import { buildColorSystem } from '@rafters/design-tokens';

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
  // Generate the complete token system with Tailwind export
  const result = buildColorSystem({
    exports: {
      tailwind: { includeImport: true },
    },
  });

  const themeCss = result.exports.tailwind || '';

  // Default config
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
