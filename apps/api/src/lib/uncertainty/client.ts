/**
 * Uncertainty Quantification Client Utilities
 *
 * Client utilities for integrating uncertainty quantification into intelligence services.
 * Provides simple functions for recording predictions, validating outcomes, and
 * calculating confidence scores.
 */

import { uuidv7 } from 'uuidv7';
import type { ConfidenceMethod, ServiceType } from '../schemas/uncertainty';

export interface UncertaintyPrediction {
  service: ServiceType;
  prediction: unknown;
  confidence: number;
  method?: ConfidenceMethod;
  context?: {
    sessionId?: string;
    userAgent?: string;
    requestId?: string;
    timestamp?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface UncertaintyOutcome {
  actualOutcome: unknown;
  userFeedback?: number; // 1-5 scale
  validatedAt?: string;
}

export interface UncertaintyClient {
  recordPrediction(prediction: UncertaintyPrediction): Promise<string>;
  updateOutcome(predictionId: string, outcome: UncertaintyOutcome): Promise<boolean>;
  calculateInputConfidence(input: unknown): number;
}

/**
 * Calculate input confidence based on input quality
 */
function calculateInputConfidenceInternal(oklch: { l: number; c: number; h: number }): number {
  let confidence = 0.5; // Base confidence

  // OKLCH validity increases confidence
  if (oklch.l >= 0 && oklch.l <= 1) confidence += 0.1;
  if (oklch.c >= 0) confidence += 0.1;
  if (oklch.h >= 0 && oklch.h <= 360) confidence += 0.1;

  // Well-formed values increase confidence
  if (oklch.l > 0.05 && oklch.l < 0.95) confidence += 0.05; // Not extreme lightness
  if (oklch.c > 0.01 && oklch.c < 0.4) confidence += 0.05; // Reasonable chroma
  if (oklch.h % 1 === 0) confidence += 0.02; // Integer hue (more precise input)

  // Perceptually reasonable ranges
  if (oklch.l > 0.1 && oklch.l < 0.9) confidence += 0.05;
  if (oklch.c < 0.3) confidence += 0.03; // Most real colors have chroma < 0.3

  return Math.min(confidence, 0.95); // Cap at 95% input confidence
}

// Export the function for external use
export const calculateInputConfidence = calculateInputConfidenceInternal;

/**
 * Score AI response quality for outcome validation
 */
export function scoreResponseQuality(intelligence: {
  suggestedName?: string;
  reasoning?: string;
  emotionalImpact?: string;
  culturalContext?: string;
  accessibilityNotes?: string;
  usageGuidance?: string;
}): number {
  let quality = 0;

  // Check completeness (each field worth 0.15 points)
  if (intelligence.suggestedName && intelligence.suggestedName.length > 3) quality += 0.15;
  if (intelligence.reasoning && intelligence.reasoning.length > 10) quality += 0.15;
  if (intelligence.emotionalImpact && intelligence.emotionalImpact.length > 10) quality += 0.15;
  if (intelligence.culturalContext && intelligence.culturalContext.length > 10) quality += 0.15;
  if (intelligence.accessibilityNotes && intelligence.accessibilityNotes.length > 10)
    quality += 0.15;
  if (intelligence.usageGuidance && intelligence.usageGuidance.length > 10) quality += 0.15;

  // Quality indicators (remaining 0.1 points)
  if (intelligence.reasoning?.includes('OKLCH')) quality += 0.02;
  if (intelligence.accessibilityNotes?.includes('WCAG')) quality += 0.02;
  if (intelligence.culturalContext?.includes('cultural')) quality += 0.02;
  if (intelligence.emotionalImpact && intelligence.emotionalImpact.length > 50) quality += 0.02;
  if (intelligence.usageGuidance?.includes('recommend')) quality += 0.02;

  return Math.min(quality, 1.0);
}

/**
 * Internal uncertainty client using D1 database directly
 */
export class D1UncertaintyClient implements UncertaintyClient {
  constructor(private db: D1Database) {}

  async recordPrediction(prediction: UncertaintyPrediction): Promise<string> {
    const id = uuidv7();
    const timestamp = new Date().toISOString();

    await this.db
      .prepare(`
      INSERT INTO confidence_predictions (
        id, timestamp, service, prediction_data, confidence, method,
        context_data, session_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        id,
        timestamp,
        prediction.service,
        JSON.stringify(prediction.prediction),
        prediction.confidence,
        prediction.method || 'bootstrap',
        prediction.context ? JSON.stringify(prediction.context) : null,
        prediction.context?.sessionId || null
      )
      .run();

    return id;
  }

  async updateOutcome(predictionId: string, outcome: UncertaintyOutcome): Promise<boolean> {
    const validatedAt = outcome.validatedAt || new Date().toISOString();

    const result = await this.db
      .prepare(`
      UPDATE confidence_predictions
      SET actual_outcome = ?, user_feedback = ?, validated_at = ?
      WHERE id = ?
    `)
      .bind(
        JSON.stringify(outcome.actualOutcome),
        outcome.userFeedback || null,
        validatedAt,
        predictionId
      )
      .run();

    return result.success && result.meta.changes > 0;
  }

  calculateInputConfidence(input: unknown): number {
    return calculateInputConfidenceInternal(input as { l: number; c: number; h: number });
  }
}
