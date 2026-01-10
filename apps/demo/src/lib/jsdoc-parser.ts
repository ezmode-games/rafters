/**
 * JSDoc Intelligence Parser
 * Extracts component intelligence metadata from JSDoc comments
 */

import type { ParsedIntelligence } from './types';

/**
 * Parse JSDoc intelligence metadata from component source
 */
export function parseJSDocIntelligence(source: string): ParsedIntelligence {
  // Find the main JSDoc block (first one in file)
  const jsdocMatch = source.match(/\/\*\*[\s\S]*?\*\//);
  if (!jsdocMatch) {
    return getDefaultIntelligence();
  }

  const jsdoc = jsdocMatch[0];

  return {
    cognitiveLoad: parseCognitiveLoad(jsdoc),
    attentionEconomics: parseTag(jsdoc, 'attention-economics'),
    trustBuilding: parseTag(jsdoc, 'trust-building'),
    accessibility: parseTag(jsdoc, 'accessibility'),
    semanticMeaning: parseTag(jsdoc, 'semantic-meaning'),
    usagePatterns: parseUsagePatterns(jsdoc),
    example: parseExample(jsdoc),
  };
}

/**
 * Parse cognitive load with score extraction
 * Format: @cognitive-load 3/10 - Description text
 */
function parseCognitiveLoad(jsdoc: string): { score: number; description: string } {
  const match = jsdoc.match(/@cognitive-load\s+(\d+)\/10\s*[-:]?\s*([\s\S]*?)(?=@[a-z]|\*\/)/i);

  if (!match) {
    return { score: 5, description: 'No cognitive load data available' };
  }

  const score = parseInt(match[1], 10);
  const description = cleanJSDocText(match[2]);

  return { score, description };
}

/**
 * Parse a single JSDoc tag
 * Handles multiline content until next tag or end of comment
 */
function parseTag(jsdoc: string, tagName: string): string {
  const regex = new RegExp(`@${tagName}\\s+([\\s\\S]*?)(?=@[a-z]|\\*\\/)`, 'i');
  const match = jsdoc.match(regex);

  if (!match) return '';

  return cleanJSDocText(match[1]);
}

/**
 * Parse usage patterns (DO/NEVER guidelines)
 * Format:
 * @usage-patterns
 * DO: Use for primary actions
 * NEVER: Use more than one per section
 */
function parseUsagePatterns(jsdoc: string): { dos: string[]; nevers: string[] } {
  const patternsMatch = jsdoc.match(/@usage-patterns\s*([\s\S]*?)(?=@example|@[a-z]|\*\/)/i);

  if (!patternsMatch) {
    return { dos: [], nevers: [] };
  }

  const content = patternsMatch[1];
  const dos: string[] = [];
  const nevers: string[] = [];

  // Match DO: patterns using matchAll
  const doMatches = [...content.matchAll(/DO:\s*([^\n*]+)/gi)];
  for (const match of doMatches) {
    const text = match[1].trim();
    if (text) dos.push(text);
  }

  // Match NEVER: patterns using matchAll
  const neverMatches = [...content.matchAll(/NEVER:\s*([^\n*]+)/gi)];
  for (const match of neverMatches) {
    const text = match[1].trim();
    if (text) nevers.push(text);
  }

  return { dos, nevers };
}

/**
 * Parse example code block
 * Format:
 * @example
 * ```tsx
 * <Button>Click me</Button>
 * ```
 */
function parseExample(jsdoc: string): string {
  // Match code block within @example
  const match = jsdoc.match(/@example\s*[\s\S]*?```(?:tsx?|jsx?)?\s*\n([\s\S]*?)```/i);

  if (!match) {
    // Try to find example without code fence
    const simpleMatch = jsdoc.match(/@example\s*\n([\s\S]*?)(?=@[a-z]|\*\/)/i);
    if (simpleMatch) {
      return cleanJSDocText(simpleMatch[1]);
    }
    return '';
  }

  // Clean up the code - remove JSDoc asterisks from each line
  return match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
}

/**
 * Clean JSDoc text by removing asterisks and normalizing whitespace
 */
function cleanJSDocText(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0)
    .join(' ')
    .trim();
}

/**
 * Extract the first line description from JSDoc
 */
export function parseDescription(source: string): string {
  const match = source.match(/\/\*\*\s*\n\s*\*\s*([^@\n]+)/);
  return match ? match[1].trim() : '';
}

/**
 * Default intelligence when no JSDoc is found
 */
function getDefaultIntelligence(): ParsedIntelligence {
  return {
    cognitiveLoad: { score: 5, description: 'No metadata available' },
    attentionEconomics: '',
    trustBuilding: '',
    accessibility: '',
    semanticMeaning: '',
    usagePatterns: { dos: [], nevers: [] },
    example: '',
  };
}

/**
 * Extract variants from component source
 * Looks for variant prop type definitions
 */
export function extractVariants(source: string): string[] {
  // Match variant type like: variant?: 'default' | 'secondary' | 'destructive'
  const match = source.match(/variant\??\s*:\s*(['"][^'"]+['"](?:\s*\|\s*['"][^'"]+['"])*)/);

  if (!match) return ['default'];

  const values: string[] = [];
  const allMatches = [...match[1].matchAll(/['"]([^'"]+)['"]/g)];

  for (const m of allMatches) {
    values.push(m[1]);
  }

  return values.length > 0 ? values : ['default'];
}

/**
 * Extract sizes from component source
 */
export function extractSizes(source: string): string[] {
  // Match size type like: size?: 'sm' | 'default' | 'lg'
  const match = source.match(/size\??\s*:\s*(['"][^'"]+['"](?:\s*\|\s*['"][^'"]+['"])*)/);

  if (!match) return ['default'];

  const values: string[] = [];
  const allMatches = [...match[1].matchAll(/['"]([^'"]+)['"]/g)];

  for (const m of allMatches) {
    values.push(m[1]);
  }

  return values.length > 0 ? values : ['default'];
}

/**
 * Extract dependencies from imports
 */
export function extractDependencies(source: string): string[] {
  const deps: string[] = [];
  const allMatches = [...source.matchAll(/import\s+.*?from\s+['"]([^'"]+)['"]/g)];

  for (const match of allMatches) {
    const pkg = match[1];
    // Only include external packages, not relative imports
    if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
      deps.push(pkg);
    }
  }

  return [...new Set(deps)];
}
