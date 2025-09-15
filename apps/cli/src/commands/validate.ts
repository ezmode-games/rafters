/**
 * Validate command implementation
 *
 * Validates design tokens and component intelligence for
 * proper AI agent consumption and accessibility compliance.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { z } from 'zod';
import type { ValidateOptions, ValidationResult } from '../types';

const TokenSchema = z.object({
  name: z.string(),
  value: z.unknown(),
  category: z.string(),
  type: z.string(),
  intelligence: z
    .object({
      cognitiveLoad: z.number().min(1).max(10).optional(),
      trustLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      accessibility: z
        .object({
          wcagLevel: z.enum(['A', 'AA', 'AAA']).optional(),
          contrastRatio: z.number().optional(),
          screenReader: z.boolean().optional(),
        })
        .optional(),
      semanticMeaning: z.string().optional(),
    })
    .optional(),
});

const TokenFileSchema = z.object({
  category: z.string(),
  version: z.string(),
  generated: z.string(),
  tokens: z.array(TokenSchema),
  metadata: z.object({
    count: z.number(),
    aiIntelligence: z.boolean(),
    semanticTokens: z.boolean(),
  }),
});

export async function validateTokens(options: ValidateOptions): Promise<ValidationResult> {
  const { path } = options;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check if tokens directory exists
    const pathStat = await stat(path);
    if (!pathStat.isDirectory()) {
      errors.push(`Tokens path is not a directory: ${path}`);
      return { valid: false, errors, warnings };
    }

    // Read all token files
    const files = await readdir(path);
    const tokenFiles = files.filter((file) => extname(file) === '.json');

    if (tokenFiles.length === 0) {
      errors.push('No token files found in directory');
      return { valid: false, errors, warnings };
    }

    // Validate each token file
    for (const file of tokenFiles) {
      const filePath = join(path, file);
      await validateTokenFile(filePath, errors, warnings);
    }

    // Check for required token categories
    const requiredCategories = ['color', 'spacing', 'typography'];
    const foundCategories = new Set<string>();

    for (const file of tokenFiles) {
      const filePath = join(path, file);
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      foundCategories.add(data.category);
    }

    for (const category of requiredCategories) {
      if (!foundCategories.has(category)) {
        warnings.push(`Missing recommended token category: ${category}`);
      }
    }

    // Validate intelligence coverage
    await validateIntelligenceCoverage(path, tokenFiles, warnings);
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

async function validateTokenFile(
  filePath: string,
  errors: string[],
  warnings: string[]
): Promise<void> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Validate against schema
    const result = TokenFileSchema.safeParse(data);
    if (!result.success) {
      errors.push(`Invalid token file structure: ${filePath}`);
      result.error.issues.forEach((err) => {
        errors.push(`  - ${err.path.join('.')}: ${err.message}`);
      });
      return;
    }

    const tokenFile = result.data;

    // Validate individual tokens
    for (let i = 0; i < tokenFile.tokens.length; i++) {
      const token = tokenFile.tokens[i];
      const tokenResult = TokenSchema.safeParse(token);

      if (!tokenResult.success) {
        errors.push(`Invalid token at index ${i} in ${filePath}`);
        tokenResult.error.issues.forEach((err) => {
          errors.push(`  - ${err.path.join('.')}: ${err.message}`);
        });
      }

      // Check for AI intelligence metadata
      if (token && !token.intelligence) {
        warnings.push(`Token '${token.name}' missing AI intelligence metadata`);
      }

      // Validate color contrast for color tokens
      if (token && token.category === 'color' && token.intelligence?.accessibility?.contrastRatio) {
        const ratio = token.intelligence.accessibility.contrastRatio;
        if (ratio < 4.5) {
          warnings.push(`Color token '${token.name}' has low contrast ratio: ${ratio}`);
        }
      }
    }

    // Validate metadata consistency
    if (tokenFile.metadata.count !== tokenFile.tokens.length) {
      errors.push(
        `Token count mismatch in ${filePath}: metadata says ${tokenFile.metadata.count}, actual ${tokenFile.tokens.length}`
      );
    }
  } catch (error) {
    errors.push(
      `Failed to read/parse token file: ${filePath} - ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function validateIntelligenceCoverage(
  basePath: string,
  tokenFiles: string[],
  warnings: string[]
): Promise<void> {
  let totalTokens = 0;
  let tokensWithIntelligence = 0;

  for (const file of tokenFiles) {
    const filePath = join(basePath, file);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    for (const token of data.tokens) {
      totalTokens++;
      if (token.intelligence) {
        tokensWithIntelligence++;
      }
    }
  }

  const coverage = (tokensWithIntelligence / totalTokens) * 100;

  if (coverage < 50) {
    warnings.push(
      `Low AI intelligence coverage: ${coverage.toFixed(1)}% (${tokensWithIntelligence}/${totalTokens})`
    );
  } else if (coverage < 80) {
    warnings.push(
      `Moderate AI intelligence coverage: ${coverage.toFixed(1)}% - consider adding more intelligence metadata`
    );
  }
}
