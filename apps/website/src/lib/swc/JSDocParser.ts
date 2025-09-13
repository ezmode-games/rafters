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

    // Parse @cognitive-load
    const cognitiveLoadMatch = jsDocComment.match(/@cognitive-load\s+(\d+)(?:\/\d+)?\s*-?\s*(.*)/);
    if (cognitiveLoadMatch) {
      intelligence.cognitiveLoad = Number.parseInt(cognitiveLoadMatch[1], 10);
      hasIntelligence = true;
    }

    // Parse @attention-economics
    const attentionMatch = jsDocComment.match(
      /@attention-economics\s+([\s\S]*?)(?=\n\s*\*\s*@|\*\/|$)/
    );
    if (attentionMatch) {
      intelligence.attentionEconomics = attentionMatch[1].replace(/\n\s*\*/g, ' ').trim();
      hasIntelligence = true;
    }

    // Parse @trust-building
    const trustMatch = jsDocComment.match(/@trust-building\s+([\s\S]*?)(?=\n\s*\*\s*@|\*\/|$)/);
    if (trustMatch) {
      intelligence.trustBuilding = trustMatch[1].replace(/\n\s*\*/g, ' ').trim();
      hasIntelligence = true;
    }

    // Parse @accessibility
    const accessibilityMatch = jsDocComment.match(
      /@accessibility\s+([\s\S]*?)(?=\n\s*\*\s*@|\*\/|$)/
    );
    if (accessibilityMatch) {
      intelligence.accessibility = accessibilityMatch[1].replace(/\n\s*\*/g, ' ').trim();
      hasIntelligence = true;
    }

    // Parse @semantic-meaning
    const semanticMatch = jsDocComment.match(
      /@semantic-meaning\s+([\s\S]*?)(?=\n\s*\*\s*@|\*\/|$)/
    );
    if (semanticMatch) {
      intelligence.semanticMeaning = semanticMatch[1].replace(/\n\s*\*/g, ' ').trim();
      hasIntelligence = true;
    }

    // Parse multiline sections
    const patterns = this.parseUsagePatterns(jsDocComment);
    if (patterns.dos.length > 0 || patterns.nevers.length > 0) {
      intelligence.usagePatterns = patterns;
      hasIntelligence = true;
    }

    const guides = this.parseDesignGuides(jsDocComment);
    if (guides.length > 0) {
      intelligence.designGuides = guides;
      hasIntelligence = true;
    }

    const examples = this.parseExamples(jsDocComment);
    if (examples.length > 0) {
      intelligence.examples = examples;
      hasIntelligence = true;
    }

    // Return null if no valid JSDoc intelligence found
    if (!hasIntelligence) {
      return null;
    }

    return intelligence as ComponentIntelligence;
  }

  private parseUsagePatterns(content: string): { dos: string[]; nevers: string[] } {
    // Parse multiline @usage-patterns section
    const patterns = { dos: [] as string[], nevers: [] as string[] };

    // Find the @usage-patterns section
    const usagePatternsMatch = content.match(/@usage-patterns\s*([\s\S]*?)(?=@\w+|$|\*\/)/);
    if (!usagePatternsMatch) {
      return patterns;
    }

    const usagePatternsContent = usagePatternsMatch[1];

    // Split by lines and process each line
    const lines = usagePatternsContent.split('\n');

    for (const line of lines) {
      // Remove leading * and whitespace from JSDoc lines
      const cleanLine = line.replace(/^\s*\*?\s*/, '').trim();

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

  private parseDesignGuides(content: string): Array<{ name: string; url: string }> {
    // Parse @design-guides with name:url format
    const guides: Array<{ name: string; url: string }> = [];

    // Find the @design-guides section
    const designGuidesMatch = content.match(/@design-guides\s*([\s\S]*?)(?=@\w+|$|\*\/)/);
    if (!designGuidesMatch) {
      return guides;
    }

    const designGuidesContent = designGuidesMatch[1];

    // Split by lines and process each line
    const lines = designGuidesContent.split('\n');

    for (const line of lines) {
      // Remove leading * and whitespace from JSDoc lines
      const cleanLine = line.replace(/^\s*\*?\s*/, '').trim();

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

  private parseExamples(content: string): Array<{ code: string }> {
    // Extract @example code blocks
    const examples: Array<{ code: string }> = [];

    // Find all @example sections using exec to avoid iterator issues
    const exampleRegex = /@example\s*([\s\S]*?)(?=@\w+|$|\*\/)/g;
    let match: RegExpExecArray | null;
    
    while ((match = exampleRegex.exec(content)) !== null) {
      const exampleContent = match[1];
      
      // Look for code blocks with ```tsx or ``` 
      const codeBlockRegex = /```(?:tsx|ts|javascript|js)?\s*([\s\S]*?)```/g;
      let codeMatch: RegExpExecArray | null;
      
      while ((codeMatch = codeBlockRegex.exec(exampleContent)) !== null) {
        let code = codeMatch[1];
        
        // Clean up JSDoc formatting - remove leading * and whitespace
        code = code.replace(/^\s*\*\s?/gm, '').trim();
        
        if (code) {
          examples.push({ code });
        }
      }
    }

    return examples;
  }
}
