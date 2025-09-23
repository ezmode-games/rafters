/**
 * Local CSS Callback Implementation
 * 
 * Generates CSS files locally for OSS deployments when registry changes occur
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { exportTokensFromRegistry } from '../export.js';
import type { RegistryChangeCallback, RegistryEvent } from '../types/events.js';
import type { TokenRegistry } from '../registry.js';

export function createLocalCSSCallback(
  registry: TokenRegistry,
  projectPath: string
): RegistryChangeCallback {
  return function(event: RegistryEvent): void {
    try {
      // Generate Tailwind CSS format by default
      const css = exportTokensFromRegistry(registry, 'tailwind');
      const cssPath = join(projectPath, '.rafters', 'tokens.css');
      
      writeFileSync(cssPath, css);
      
      // Log the regeneration for development feedback
      console.log(`[Rafters] CSS regenerated: ${event.type} at ${new Date(event.timestamp).toISOString()}`);
    } catch (error) {
      throw new Error(`CSS regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
}