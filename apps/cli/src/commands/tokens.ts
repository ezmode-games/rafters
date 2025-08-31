/**
 * Token registry commands for Rafters CLI
 *
 * Provides direct access to design token intelligence,
 * used by both CLI users and MCP server.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { createTokenRegistry } from '@rafters/design-tokens';
import type { ColorValue, Token } from '@rafters/shared';
import chalk from 'chalk';

/**
 * Get token registry from .rafters/tokens
 */
function getRegistry() {
  const tokensDir = join(process.cwd(), '.rafters', 'tokens');
  if (!existsSync(tokensDir)) {
    console.error(chalk.red('✗ No .rafters/tokens directory found. Run "rafters init" first.'));
    process.exit(1);
  }
  return createTokenRegistry(tokensDir);
}

/**
 * Get a specific token by name
 */
export function getToken(tokenName: string): Token | undefined {
  const registry = getRegistry();
  return registry.get(tokenName);
}

/**
 * Get all tokens in a category
 */
export function getTokensByCategory(category: string): Token[] {
  const registry = getRegistry();
  return registry.list().filter((t: Token) => t.category === category);
}

/**
 * Get all tokens with a specific trust level
 */
export function getTokensByTrustLevel(trustLevel: string): Token[] {
  const registry = getRegistry();
  return registry.list().filter((t: Token) => t.trustLevel === trustLevel);
}

/**
 * Get color intelligence including scale, states, harmonies
 */
export function getColorIntelligence(tokenName: string) {
  const token = getToken(tokenName);

  if (!token || token.category !== 'color') {
    return null;
  }

  // Extract ColorValue if it exists
  const colorValue = typeof token.value === 'object' ? (token.value as ColorValue) : null;

  return {
    token,
    scale: colorValue?.scale || [],
    states: colorValue?.states || {},
    use: colorValue?.use || token.semanticMeaning,
    intelligence: colorValue?.intelligence || null,
    harmonies: colorValue?.harmonies || null,
    accessibility: colorValue?.accessibility || null,
    analysis: colorValue?.analysis || null,
  };
}

/**
 * Calculate total cognitive load for tokens
 */
export function calculateCognitiveLoad(tokenNames: string[]): number {
  const tokens = tokenNames.map((name) => getToken(name)).filter(Boolean) as Token[];
  return tokens.reduce((sum, t) => sum + (t.cognitiveLoad || 0), 0);
}

/**
 * Validate color combination
 */
export function validateColorCombination(colorNames: string[]) {
  const colors = colorNames
    .map((name) => getToken(name))
    .filter((t) => t?.category === 'color') as Token[];

  const totalCognitiveLoad = calculateCognitiveLoad(colorNames);
  const criticalCount = colors.filter((t) => t.trustLevel === 'critical').length;
  const highCount = colors.filter((t) => t.trustLevel === 'high').length;

  const warnings = [];
  if (totalCognitiveLoad > 15) {
    warnings.push(`High cognitive load (${totalCognitiveLoad}/15) - may overwhelm users`);
  }
  if (criticalCount > 1) {
    warnings.push(
      `Multiple critical trust levels (${criticalCount}) - avoid competing for attention`
    );
  }
  if (highCount > 2) {
    warnings.push(`Many high trust elements (${highCount}) - consider hierarchy`);
  }

  return {
    valid: warnings.length === 0,
    totalCognitiveLoad,
    trustLevels: {
      critical: criticalCount,
      high: highCount,
      medium: colors.filter((t) => t.trustLevel === 'medium').length,
      low: colors.filter((t) => t.trustLevel === 'low').length,
    },
    warnings,
    recommendation:
      warnings.length === 0
        ? 'Color combination is well-balanced'
        : 'Consider simplifying or reorganizing color hierarchy',
  };
}

/**
 * CLI command for token operations
 */
export async function tokensCommand(action: string, args: string[], options: { json?: boolean }) {
  switch (action) {
    case 'get': {
      const [tokenName] = args;
      if (!tokenName) {
        console.error(chalk.red('✗ Token name required'));
        process.exit(1);
      }

      const token = getToken(tokenName);
      if (!token) {
        console.error(chalk.red(`✗ Token "${tokenName}" not found`));
        process.exit(1);
      }

      console.log(chalk.cyan('Token:'), tokenName);
      console.log(chalk.gray('─'.repeat(40)));
      console.log('Category:', token.category);
      console.log('Value:', typeof token.value === 'string' ? token.value : 'ColorValue object');
      console.log('Semantic:', token.semanticMeaning || 'N/A');
      console.log('Cognitive Load:', token.cognitiveLoad || 0);
      console.log('Trust Level:', token.trustLevel || 'N/A');

      if (options.json) {
        console.log(`\n${JSON.stringify(token, null, 2)}`);
      }
      break;
    }

    case 'list': {
      const [category] = args;
      const registry = getRegistry();
      const tokens = category ? getTokensByCategory(category) : registry.list();

      console.log(chalk.cyan(`Tokens${category ? ` in ${category}` : ''}:`));
      console.log(chalk.gray('─'.repeat(40)));

      const grouped = tokens.reduce(
        (acc: Record<string, Token[]>, token: Token) => {
          if (!acc[token.category]) acc[token.category] = [];
          acc[token.category].push(token);
          return acc;
        },
        {} as Record<string, Token[]>
      );

      for (const [cat, catTokens] of Object.entries(grouped)) {
        const tokens = catTokens as Token[];
        console.log(`\n${chalk.yellow(cat)} (${tokens.length}):`);
        for (const token of tokens) {
          const value = typeof token.value === 'string' ? token.value : chalk.gray('[ColorValue]');
          console.log(`  ${token.name}: ${value}`);
        }
      }

      console.log(chalk.gray(`\nTotal: ${tokens.length} tokens`));
      break;
    }

    case 'color': {
      const [tokenName] = args;
      if (!tokenName) {
        console.error(chalk.red('✗ Color token name required'));
        process.exit(1);
      }

      const intelligence = getColorIntelligence(tokenName);
      if (!intelligence) {
        console.error(chalk.red(`✗ Color token "${tokenName}" not found`));
        process.exit(1);
      }

      console.log(chalk.cyan('Color Intelligence:'), tokenName);
      console.log(chalk.gray('─'.repeat(40)));
      console.log('Use:', intelligence.use);
      console.log('Scale positions:', intelligence.scale.length);
      console.log('States:', Object.keys(intelligence.states).join(', ') || 'none');

      if (intelligence.intelligence) {
        console.log(`\n${chalk.yellow('AI Intelligence:')}`);
        console.log('Reasoning:', intelligence.intelligence.reasoning);
        console.log('Emotional:', intelligence.intelligence.emotionalImpact);
      }

      if (options.json) {
        console.log(`\n${JSON.stringify(intelligence, null, 2)}`);
      }
      break;
    }

    case 'validate': {
      const colors = args;
      if (colors.length === 0) {
        console.error(chalk.red('✗ At least one color required'));
        process.exit(1);
      }

      const validation = validateColorCombination(colors);

      console.log(chalk.cyan('Color Validation:'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log('Colors:', colors.join(', '));
      console.log('Valid:', validation.valid ? chalk.green('✓ Yes') : chalk.red('✗ No'));
      console.log('Cognitive Load:', `${validation.totalCognitiveLoad}/15`);

      if (validation.warnings.length > 0) {
        console.log(`\n${chalk.yellow('Warnings:')}`);
        for (const w of validation.warnings) {
          console.log(`  - ${w}`);
        }
      }

      console.log(`\n${chalk.gray('Recommendation:')}`);
      console.log(validation.recommendation);
      break;
    }

    default:
      console.error(chalk.red(`✗ Unknown action: ${action}`));
      console.log('Available actions: get, list, color, validate');
      process.exit(1);
  }
}
