/**
 * Vector Intelligence Service
 *
 * Provides 384-dimensional vector analysis for design intelligence
 */

import type { ColorIntelligence, OKLCH } from '@rafters/shared';

export interface VectorIntelligenceConfig {
  dimensions: number;
  confidenceThreshold: number;
  maxSimilarityResults: number;
}

export interface VectorSimilarityResult {
  tokenName: string;
  similarity: number;
  confidence: number;
  vector: number[];
}

export class VectorIntelligenceService {
  private config: VectorIntelligenceConfig;

  constructor(config: Partial<VectorIntelligenceConfig> = {}) {
    this.config = {
      dimensions: 384,
      confidenceThreshold: 0.7,
      maxSimilarityResults: 10,
      ...config,
    };
  }

  /**
   * Convert OKLCH color to 384-dimensional vector
   */
  colorToVector(oklch: OKLCH): number[] {
    const vector = new Array(this.config.dimensions).fill(0);

    // Simple implementation - real version would use trained embeddings
    vector[0] = oklch.l; // Lightness
    vector[1] = oklch.c; // Chroma
    vector[2] = oklch.h / 360; // Hue normalized
    vector[3] = oklch.alpha || 1; // Alpha

    // Fill remaining dimensions with derived features
    for (let i = 4; i < this.config.dimensions; i++) {
      vector[i] = Math.sin((oklch.h * Math.PI) / 180 + i) * oklch.c * oklch.l;
    }

    return this.normalizeVector(vector);
  }

  /**
   * Calculate vector similarity using various metrics
   */
  calculateSimilarity(
    vector1: number[],
    vector2: number[],
    metric: 'euclidean' | 'manhattan' | 'cosine' = 'euclidean'
  ): number {
    switch (metric) {
      case 'euclidean':
        return this.euclideanSimilarity(vector1, vector2);
      case 'manhattan':
        return this.manhattanSimilarity(vector1, vector2);
      case 'cosine':
        return this.cosineSimilarity(vector1, vector2);
      default:
        throw new Error(`Unknown metric: ${metric}`);
    }
  }

  /**
   * Generate confidence score for vector analysis
   */
  calculateConfidenceScore(
    analysis: ColorIntelligence,
    vectorMagnitude: number,
    similarityScore: number
  ): number {
    let confidence = 0.5; // Base confidence

    // Factor in vector magnitude (more distinct colors have higher confidence)
    confidence += Math.min(vectorMagnitude / 10, 0.2);

    // Factor in similarity to known patterns
    confidence += Math.min(similarityScore, 0.2);

    // Factor in completeness of analysis
    const fields = [
      analysis.suggestedName,
      analysis.reasoning,
      analysis.emotionalImpact,
      analysis.culturalContext,
      analysis.accessibilityNotes,
      analysis.usageGuidance,
    ];
    const completeness = fields.filter(Boolean).length / fields.length;
    confidence += completeness * 0.1;

    return Math.min(Math.max(confidence, 0), 1);
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map((val) => val / magnitude) : vector;
  }

  private euclideanSimilarity(v1: number[], v2: number[]): number {
    const distance = Math.sqrt(v1.reduce((sum, val, i) => sum + (val - v2[i]) ** 2, 0));
    return 1 / (1 + distance); // Convert distance to similarity
  }

  private manhattanSimilarity(v1: number[], v2: number[]): number {
    const distance = v1.reduce((sum, val, i) => sum + Math.abs(val - v2[i]), 0);
    return 1 / (1 + distance);
  }

  private cosineSimilarity(v1: number[], v2: number[]): number {
    const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
    const magnitude1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }
}
