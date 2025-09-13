/**
 * Type definitions for JSDoc Intelligence Parser
 *
 * Defines the structure for component intelligence metadata
 * extracted from JSDoc comments in React components.
 */

export interface ComponentIntelligence {
  cognitiveLoad: number;
  attentionEconomics: string;
  trustBuilding: string;
  accessibility: string;
  semanticMeaning: string;
  usagePatterns: {
    dos: string[];
    nevers: string[];
  };
  designGuides: Array<{
    name: string;
    url: string;
  }>;
  examples: Array<{
    code: string;
  }>;
}
