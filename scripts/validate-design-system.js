#!/usr/bin/env node

/**
 * Design System Validation Script
 *
 * Enforces elegant minimalism principles:
 * - No emoji usage
 * - No arbitrary colors or spacing
 * - Professional language only
 * - Semantic tokens required
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation rules
const EMOJI_REGEX =
  /[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{E000}-\u{F8FF}]|[\u{2190}-\u{21FF}]|[\u{2B00}-\u{2BFF}]|[\u{3030}\u{303D}\u{3297}\u{3299}]|[\u{1F004}\u{1F0CF}]|[\u{1F170}-\u{1F251}]|[\u{00A9}\u{00AE}]|[\u{2122}\u{2139}]|[\u{23E9}-\u{23EC}]|[\u{23F0}\u{23F3}]|[\u{2600}-\u{2B55}]|[\u{25AA}-\u{25FE}]|[\u{2934}\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}\u{2B1C}]|[\u{2B50}\u{2B55}]|[\u{203C}\u{2049}]|[\u{25B6}\u{25C0}]|[\u{23CF}]|[\u{24C2}]|[\u{1F251}]|[\u{1F191}-\u{1F19A}]|[\u{1F201}\u{1F202}]|[\u{1F21A}\u{1F22F}]|[\u{1F232}-\u{1F23A}]|[\u{1F250}]|[\u{1F300}-\u{1F320}]|[\u{1F330}-\u{1F335}]|[\u{1F337}-\u{1F37C}]|[\u{1F380}-\u{1F393}]|[\u{1F3A0}-\u{1F3C4}]|[\u{1F3C6}-\u{1F3CA}]|[\u{1F3E0}-\u{1F3F0}]|[\u{1F400}-\u{1F43E}]|[\u{1F440}]|[\u{1F442}-\u{1F4F7}]|[\u{1F4F9}-\u{1F4FC}]|[\u{1F500}-\u{1F53C}]|[\u{1F540}-\u{1F543}]|[\u{1F550}-\u{1F567}]|[\u{1F5FB}-\u{1F5FF}]|[\u{1F600}-\u{1F62F}]|[\u{1F631}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|[\u{1F700}-\u{1F773}]|[\u{1F780}-\u{1F7D4}]|[\u{1F800}-\u{1F80B}]|[\u{1F810}-\u{1F847}]|[\u{1F850}-\u{1F859}]|[\u{1F860}-\u{1F887}]|[\u{1F890}-\u{1F8AD}]/gu;
const ARBITRARY_COLOR_REGEX =
  /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\s*\(|rgba\s*\(|hsl\s*\(|hsla\s*\(/g;
const ARBITRARY_SPACING_REGEX = /(?:margin|padding|gap):\s*\d+(?:px|rem|em)/g;
const CASUAL_LANGUAGE = [
  '✅',
  '❌',
  '🎉',
  '🚀',
  '✨',
  '📖',
  '🔍', // All emoji/symbols
  'pretty cool',
  'nice to have',
  'awesome',
  'sweet',
  'cool',
  'super',
  'really great',
  'amazing',
  'fantastic',
];

class DesignSystemValidator {
  constructor() {
    this.errors = [];
  }

  /**
   * Validate all relevant files in the project
   */
  async validateProject() {
    console.log('Validating design system compliance...');

    // Get all relevant files
    const files = await glob('src/**/*.{ts,tsx,mdx,css}');

    for (const file of files) {
      await this.validateFile(file);
    }

    return this.reportResults();
  }

  /**
   * Validate a single file
   */
  async validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath);

      // Check for emoji
      if (this.hasEmoji(content)) {
        this.addError(filePath, 'EMOJI_USAGE', 'Emoji violates elegant minimalism principle');
      }

      // Check for arbitrary colors
      if (this.hasArbitraryColors(content)) {
        this.addError(
          filePath,
          'ARBITRARY_COLORS',
          'Use semantic color tokens instead of arbitrary values'
        );
      }

      // Check for arbitrary spacing
      if (this.hasArbitrarySpacing(content)) {
        this.addError(
          filePath,
          'ARBITRARY_SPACING',
          'Use phi-based spacing instead of arbitrary values'
        );
      }

      // Check for casual language (MDX files only)
      if (filePath.endsWith('.mdx') && this.hasCasualLanguage(content)) {
        this.addError(filePath, 'CASUAL_LANGUAGE', 'Use professional language only');
      }
    } catch (error) {
      this.addError(filePath, 'READ_ERROR', `Failed to read file: ${error.message}`);
    }
  }

  /**
   * Check for emoji usage
   */
  hasEmoji(content) {
    // Allow mathematical symbols like φ (phi) for golden ratio
    const allowedMathSymbols = /[φπαβγδεζηθικλμνξοπρστυφχψω∞±×÷≤≥≠≈∑∏∆∇∫∂]/g;
    const contentWithoutMathSymbols = content.replace(allowedMathSymbols, '');
    return EMOJI_REGEX.test(contentWithoutMathSymbols);
  }

  /**
   * Check for arbitrary color values
   */
  hasArbitraryColors(content) {
    const matches = content.match(ARBITRARY_COLOR_REGEX);
    if (!matches) return false;

    // Allow colors in comments (for documentation)
    const lines = content.split('\n');
    return matches.some((match) => {
      const lineWithMatch = lines.find((line) => line.includes(match));
      if (!lineWithMatch) return false;

      // Skip HTML entities like &#123;
      if (lineWithMatch.includes('&#')) return false;

      // Skip comments
      if (lineWithMatch.trim().startsWith('//') || lineWithMatch.trim().startsWith('*'))
        return false;

      return true;
    });
  }

  /**
   * Check for arbitrary spacing values
   */
  hasArbitrarySpacing(content) {
    const matches = content.match(ARBITRARY_SPACING_REGEX);
    if (!matches) return false;

    // Allow spacing in comments (for documentation)
    const lines = content.split('\n');
    return matches.some((match) => {
      const lineWithMatch = lines.find((line) => line.includes(match));
      return (
        lineWithMatch &&
        !lineWithMatch.trim().startsWith('//') &&
        !lineWithMatch.trim().startsWith('*')
      );
    });
  }

  /**
   * Check for casual language
   */
  hasCasualLanguage(content) {
    const lowerContent = content.toLowerCase();
    return CASUAL_LANGUAGE.some((phrase) => lowerContent.includes(phrase.toLowerCase()));
  }

  /**
   * Add validation error
   */
  addError(filePath, code, message) {
    this.errors.push({
      file: filePath,
      code,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Report validation results
   */
  reportResults() {
    if (this.errors.length === 0) {
      console.log('Design system validation passed!');
      return true;
    }

    console.log('\nDesign system validation failed:');
    console.log(`Found ${this.errors.length} violation(s)\n`);

    // Group errors by type
    const errorsByType = this.errors.reduce((acc, error) => {
      if (!acc[error.code]) {
        acc[error.code] = [];
      }
      acc[error.code].push(error);
      return acc;
    }, {});

    // Report errors by type
    for (const [code, errors] of Object.entries(errorsByType)) {
      console.log(`\n${this.getErrorDescription(code)}:`);
      for (const error of errors) {
        console.log(`  • ${error.file}: ${error.message}`);
      }
    }

    console.log('\nDesign System Guidelines:');
    console.log('  - Use semantic color tokens (text-primary, bg-muted)');
    console.log('  - Use phi-based spacing (space-phi-2, gap-phi-1)');
    console.log('  - Professional language only (no emoji, casual phrases)');
    console.log('  - Mathematical harmony over arbitrary values');

    return false;
  }

  /**
   * Get human-readable error description
   */
  getErrorDescription(code) {
    const descriptions = {
      EMOJI_USAGE: 'Emoji violations',
      ARBITRARY_COLORS: 'Arbitrary color usage',
      ARBITRARY_SPACING: 'Arbitrary spacing usage',
      CASUAL_LANGUAGE: 'Casual language usage',
      READ_ERROR: 'File read errors',
    };
    return descriptions[code] || code;
  }
}

// Run validation if called directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].includes('validate-design-system.js') ||
  process.argv[1].endsWith('validate-design-system.js');

if (isMainModule) {
  const validator = new DesignSystemValidator();
  const success = await validator.validateProject();
  process.exit(success ? 0 : 1);
}

export { DesignSystemValidator };
