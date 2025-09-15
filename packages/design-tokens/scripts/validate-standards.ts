#!/usr/bin/env tsx

/**
 * AI-First Coding Standards Validator
 * Enforces system-level compliance before commits
 */

import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { glob } from 'glob';

interface ValidationResult {
  file: string;
  errors: string[];
  warnings: string[];
}

const EMOJI_REGEX =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{231A}-\u{23FF}✅❌🎉🚀]/gu;
const ANY_TYPE_REGEX = /:\s*any\b|<any\b|Array<any>|Promise<any>/g;
const THEN_CHAIN_REGEX = /\.then\s*\(/g;
const ARBITRARY_COLOR_REGEX = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(|rgba\(|hsl\(|hsla\(/g;
const CONSOLE_LOG_REGEX = /console\.(log|info|warn|error)\(/g;

async function validateFile(filePath: string): Promise<ValidationResult> {
  const content = readFileSync(filePath, 'utf-8');
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for emoji (absolute violation)
  if (EMOJI_REGEX.test(content)) {
    const matches = content.match(EMOJI_REGEX);
    errors.push(`Contains forbidden emoji: ${matches?.join(', ')}`);
  }

  // Check for any types (absolute violation)
  if (ANY_TYPE_REGEX.test(content)) {
    const matches = content.match(ANY_TYPE_REGEX);
    errors.push(`Contains forbidden 'any' types: ${matches?.join(', ')}`);
  }

  // Check for .then() chains (absolute violation)
  if (THEN_CHAIN_REGEX.test(content)) {
    errors.push('Contains forbidden .then() chains - use await instead');
  }

  // Check for arbitrary color values (design system violation)
  if (ARBITRARY_COLOR_REGEX.test(content)) {
    const matches = content.match(ARBITRARY_COLOR_REGEX);
    errors.push(`Contains arbitrary color values: ${matches?.join(', ')} - use semantic tokens`);
  }

  // Check for console.log in production code (warning)
  if (CONSOLE_LOG_REGEX.test(content) && !filePath.includes('test') && !filePath.includes('spec')) {
    warnings.push('Contains console.log statements - consider using proper logging');
  }

  // Check React component purity
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    if (content.includes('Math.random()') && !content.includes('useState(() => Math.random())')) {
      errors.push(
        'Component contains Math.random() outside useState initializer - violates React 19 purity'
      );
    }

    if (content.includes('Date.now()') && !content.includes('useState(() => Date.now())')) {
      errors.push(
        'Component contains Date.now() outside useState initializer - violates React 19 purity'
      );
    }
  }

  return { file: relative(process.cwd(), filePath), errors, warnings };
}

async function validateCommitMessage(): Promise<string[]> {
  // This would check git commit message in a real implementation
  // For now, just return guidance
  return [];
}

async function main() {
  console.log('AI-First Coding Standards Validation\n');

  const sourceFiles = await glob([
    'src/**/*.{ts,tsx,js,jsx}',
    'test/**/*.{ts,tsx,js,jsx}',
    '**/*.md',
    '!node_modules/**',
    '!dist/**',
    '!build/**',
  ]);

  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of sourceFiles) {
    try {
      const result = await validateFile(file);
      if (result.errors.length > 0 || result.warnings.length > 0) {
        results.push(result);
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
      }
    } catch (error) {
      console.error(`Failed to validate ${file}: ${error}`);
    }
  }

  // Report results
  if (results.length === 0) {
    console.log('All files pass AI-First Coding Standards');
    process.exit(0);
  }

  console.log(`Found ${totalErrors} errors and ${totalWarnings} warnings:\n`);

  for (const result of results) {
    console.log(`File: ${result.file}`);

    for (const error of result.errors) {
      console.log(`  ERROR: ${error}`);
    }

    for (const warning of result.warnings) {
      console.log(`  WARNING: ${warning}`);
    }

    console.log('');
  }

  console.log('Fix these violations before committing:');
  console.log('   1. Remove all emoji characters');
  console.log('   2. Replace any types with specific types');
  console.log('   3. Replace .then() chains with await');
  console.log('   4. Use semantic tokens instead of arbitrary colors');
  console.log('   5. Move side effects out of React component render');
  console.log('');
  console.log('Run `pnpm biome check --fix` to auto-fix some issues');

  process.exit(totalErrors > 0 ? 1 : 0);
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

export { validateFile, validateCommitMessage };
