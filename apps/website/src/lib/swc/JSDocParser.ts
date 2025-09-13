/**
 * JSDoc Intelligence Parser using Doctrine
 *
 * Extracts Rafters design intelligence metadata from component source code
 * using the proven Doctrine library for JSDoc parsing.
 */

import * as doctrine from 'doctrine';
import type { ComponentIntelligence } from './types';

export class JSDocIntelligenceParser {
  parseIntelligence(sourceCode: string): ComponentIntelligence | null {
    // Extract JSDoc comment block from source
    const jsDocComment = this.extractJSDocComment(sourceCode);
    if (!jsDocComment) {
      return null;
    }

    try {
      // Parse the comment content directly for custom tags
      return this.parseIntelligenceFromComment(jsDocComment);
    } catch (error) {
      // Handle malformed JSDoc gracefully without throwing
      console.warn('Failed to parse JSDoc intelligence:', error);
      return null;
    }
  }

  private extractJSDocComment(source: string): string | null {
    // Find /** ... */ comment block at top of file
    // Remove leading whitespace and find first JSDoc block
    const trimmedSource = source.trim();

    // Match /** followed by anything until */ (non-greedy)
    const jsDocMatch = trimmedSource.match(/\/\*\*\s*([\s\S]*?)\*\//);

    if (!jsDocMatch) {
      return null;
    }

    return jsDocMatch[0];
  }

  private parseIntelligenceFromComment(jsDocComment: string): ComponentIntelligence | null {
    // Parse with Doctrine first
    const parsed = doctrine.parse(jsDocComment, { unwrap: true });

    const intelligence: Partial<ComponentIntelligence> = {
      cognitiveLoad: 0,
      attentionEconomics: '',
      trustBuilding: '',
      accessibility: '',
      semanticMeaning: '',
      usagePatterns: { dos: [], nevers: [] },
      designGuides: [],
      examples: [],
    };

    let hasIntelligence = false;

    // Extract intelligence from Doctrine's parsed tags
    // Note: Doctrine treats @cognitive-load as @cognitive with description "-load ..."
    for (const tag of parsed.tags) {
      if (tag.title === 'cognitive' && tag.description?.startsWith('-load')) {
        // Handle @cognitive-load
        const cognitiveLoadMatch = tag.description.match(/-load\s+(\d+)(?:\/\d+)?\s*-?\s*(.*)/);
        if (cognitiveLoadMatch) {
          intelligence.cognitiveLoad = Number.parseInt(cognitiveLoadMatch[1], 10);
          hasIntelligence = true;
        }
      } else if (tag.title === 'attention' && tag.description?.startsWith('-economics')) {
        // Handle @attention-economics
        const match = tag.description.match(/-economics\s+(.*)/);
        if (match) {
          intelligence.attentionEconomics = match[1].trim();
          hasIntelligence = true;
        }
      } else if (tag.title === 'trust' && tag.description?.startsWith('-building')) {
        // Handle @trust-building
        const match = tag.description.match(/-building\s+(.*)/);
        if (match) {
          intelligence.trustBuilding = match[1].trim();
          hasIntelligence = true;
        }
      } else if (tag.title === 'semantic' && tag.description?.startsWith('-meaning')) {
        // Handle @semantic-meaning
        const match = tag.description.match(/-meaning\s+(.*)/);
        if (match) {
          intelligence.semanticMeaning = match[1].trim();
          hasIntelligence = true;
        }
      } else if (tag.title === 'usage' && tag.description?.startsWith('-patterns')) {
        // Handle @usage-patterns
        const match = tag.description.match(/-patterns\s+([\s\S]*)/);
        if (match) {
          const patterns = this.parseUsagePatternsFromDescription(match[1]);
          if (patterns.dos.length > 0 || patterns.nevers.length > 0) {
            intelligence.usagePatterns = patterns;
            hasIntelligence = true;
          }
        }
      } else if (tag.title === 'design' && tag.description?.startsWith('-guides')) {
        // Handle @design-guides
        const match = tag.description.match(/-guides\s+([\s\S]*)/);
        if (match) {
          const guides = this.parseDesignGuidesFromDescription(match[1]);
          if (guides.length > 0) {
            intelligence.designGuides = guides;
            hasIntelligence = true;
          }
        }
      } else if (tag.title === 'accessibility') {
        // Handle @accessibility (no hyphen)
        if (tag.description) {
          intelligence.accessibility = tag.description.trim();
          hasIntelligence = true;
        }
      } else if (tag.title === 'example') {
        // Handle @example (no hyphen)
        const examples = this.parseExampleFromDescription(tag.description || '');
        if (examples.length > 0) {
          intelligence.examples.push(...examples);
          hasIntelligence = true;
        }
      }
    }

    // Return null if no valid JSDoc intelligence found
    if (!hasIntelligence) {
      return null;
    }

    return intelligence as ComponentIntelligence;
  }

  private parseUsagePatternsFromDescription(description: string): {
    dos: string[];
    nevers: string[];
  } {
    // Parse multiline usage patterns from Doctrine tag description
    const patterns = { dos: [] as string[], nevers: [] as string[] };

    // Split by lines and process each line
    const lines = description.split('\n');

    for (const line of lines) {
      const cleanLine = line.trim();

      if (cleanLine.startsWith('DO:')) {
        const doPattern = cleanLine.substring(3).trim();
        if (doPattern) {
          patterns.dos.push(doPattern);
        }
      } else if (cleanLine.startsWith('NEVER:')) {
        const neverPattern = cleanLine.substring(6).trim();
        if (neverPattern) {
          patterns.nevers.push(neverPattern);
        }
      }
    }

    return patterns;
  }

  private parseDesignGuidesFromDescription(
    description: string
  ): Array<{ name: string; url: string }> {
    // Parse design guides from Doctrine tag description
    const guides: Array<{ name: string; url: string }> = [];

    // Split by lines and process each line
    const lines = description.split('\n');

    for (const line of lines) {
      const cleanLine = line.trim();

      // Match pattern: - Name: URL
      const guideMatch = cleanLine.match(/^-\s*(.+?):\s*(https?:\/\/.+)$/);
      if (guideMatch) {
        guides.push({
          name: guideMatch[1].trim(),
          url: guideMatch[2].trim(),
        });
      }
    }

    return guides;
  }

  private parseExampleFromDescription(description: string): Array<{ code: string }> {
    // Extract code blocks from Doctrine tag description
    const examples: Array<{ code: string }> = [];

    // Look for code blocks with ```tsx or ```
    const codeBlockRegex = /```(?:tsx|ts|javascript|js)?\s*([\s\S]*?)```/g;
    let codeMatch = codeBlockRegex.exec(description);

    while (codeMatch !== null) {
      let code = codeMatch[1];

      // Clean up any remaining formatting
      code = code.trim();

      if (code) {
        examples.push({ code });
      }

      codeMatch = codeBlockRegex.exec(description);
    }

    return examples;
  }
}
