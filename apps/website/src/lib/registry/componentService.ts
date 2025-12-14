/**
 * Component Service - Simple and Clean
 * Loads components from UI package and extracts intelligence
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ComponentManifest } from '@rafters/shared';
import { parse } from 'comment-parser';
import { extractBaseClasses, extractClassMappings } from './cvaExtractor';

/**
 * Get UI package path
 */
function getUIPath(): string {
  return join(process.cwd(), '../../packages/ui/src');
}

/**
 * Load all components
 */
export async function loadComponents(): Promise<ComponentManifest[]> {
  const componentsDir = join(getUIPath(), 'components');
  const files = readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'));

  const components: ComponentManifest[] = [];

  for (const file of files) {
    const filePath = join(componentsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const component = await parseComponent(content, file, filePath);

    if (component) {
      components.push(component);
    }
  }

  return components;
}

/**
 * Parse component from source
 */
async function parseComponent(
  content: string,
  filename: string,
  _filePath: string
): Promise<ComponentManifest | null> {
  const parsed = parse(content);
  if (!parsed || parsed.length === 0) return null;

  const comment = parsed[0];
  const name = findTag(comment.tags, 'registryName');

  if (!name) return null;

  // Extract CVA data
  const baseClasses = extractBaseClasses(content);
  const propMappings = extractClassMappings(content);
  const cva = {
    baseClasses,
    propMappings,
    allClasses: [...baseClasses, ...propMappings.flatMap((m) => Object.values(m.values).flat())],
  };

  // Build manifest with meta.rafters structure
  // Note: Previews are compiled in the preview endpoint getStaticPaths()
  return {
    name,
    type: 'registry:component',
    files: [
      {
        path: `components/${filename}`,
        content,
        type: 'registry:component',
      },
    ],
    dependencies: [],
    meta: {
      rafters: {
        version: findTag(comment.tags, 'registryVersion') || '0.1.0',
        intelligence: {
          cognitiveLoad: (() => {
            const tagValue = findTag(comment.tags, 'cognitiveLoad');
            const parsed = tagValue ? parseFloat(tagValue) : undefined;
            return typeof parsed === 'number' && !Number.isNaN(parsed) ? parsed : 0;
          })(),
          attentionEconomics: findTag(comment.tags, 'attentionEconomics') || '',
          trustBuilding: findTag(comment.tags, 'trustBuilding') || '',
          accessibility: findTag(comment.tags, 'accessibility') || '',
          semanticMeaning: findTag(comment.tags, 'semanticMeaning') || '',
          cva: {
            ...cva,
            css: '',
          },
        },
        previews: [],
      },
    },
  };
}

/**
 * Find tag value
 */
// biome-ignore lint/suspicious/noExplicitAny: Comment parser returns untyped tag arrays
function findTag(tags: any[], name: string): string | undefined {
  const tag = tags.find((t) => t.tag === name);
  return tag?.name || undefined;
}

/**
 * Get component by name
 */
export async function getComponent(name: string): Promise<ComponentManifest | null> {
  const components = await loadComponents();
  return components.find((c) => c.name === name) || null;
}

/**
 * Get registry metadata
 */
export async function getRegistryMetadata() {
  const components = await loadComponents();
  return { components };
}
