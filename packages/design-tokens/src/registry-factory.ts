/**
 * Registry Factory with Self-Initialization
 * 
 * Creates a complete TokenRegistry with archive unpacking, token loading,
 * and callback setup based on environment detection.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DesignSystemArchive } from './archive.js';
import { createLocalCSSCallback } from './callbacks/local-css-callback.js';
import { TokenRegistry } from './registry.js';

/**
 * Create a fully initialized TokenRegistry with automatic setup and event-driven capabilities
 */
export async function createEventDrivenTokenRegistry(
  tokensPath: string, 
  shortcode: string = '000000'
): Promise<TokenRegistry> {
  const registry = new TokenRegistry();
  
  try {
    // Check if tokens exist, if not unpack archive
    if (!tokensExist(tokensPath)) {
      await unpackArchive(shortcode, tokensPath);
    }
    
    // Load tokens from unpacked files using existing DesignSystemArchive
    const projectPath = getProjectRoot(tokensPath);
    const archive = new DesignSystemArchive(projectPath);
    const tokens = await archive.load();
    
    // Add tokens to registry
    for (const token of tokens) {
      registry.add(token);
    }
    
    // Set up callback based on environment
    if (process.env.RAFTERS_PLUS) {
      // Future: Queue-based callback - for now just log
      console.log('[Rafters] Queue callback not yet implemented, falling back to local CSS');
      const cssCallback = createLocalCSSCallback(registry, projectPath);
      registry.setChangeCallback(cssCallback);
    } else {
      // OSS: Local CSS callback
      const cssCallback = createLocalCSSCallback(registry, projectPath);
      registry.setChangeCallback(cssCallback);
    }
    
    // Fire initial registry event
    registry.initializeRegistry(tokens.length);
    
    return registry;
  } catch (error) {
    throw new Error(`Registry creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if tokens already exist at the given path
 */
function tokensExist(tokensPath: string): boolean {
  return existsSync(join(tokensPath, 'colors.json')) &&
         existsSync(join(tokensPath, 'spacing.json')) &&
         existsSync(join(tokensPath, 'manifest.json'));
}

/**
 * Unpack archive to target directory
 */
async function unpackArchive(shortcode: string, targetDir: string): Promise<void> {
  try {
    if (shortcode === '000000') {
      // Use embedded default archive by generating default tokens
      const { generateAllTokens } = await import('./generators/index.js');
      const tokens = await generateAllTokens();
      
      // Create archive instance and save tokens
      const projectPath = getProjectRoot(targetDir);
      const archive = new DesignSystemArchive(projectPath);
      await archive.save(tokens, shortcode);
    } else {
      // Future: Fetch custom archive from registry
      throw new Error(`Custom archives not yet implemented for shortcode: ${shortcode}`);
    }
  } catch (error) {
    throw new Error(`Archive unpacking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract project root from .rafters/tokens path
 */
function getProjectRoot(tokensPath: string): string {
  return tokensPath.replace('/.rafters/tokens', '');
}