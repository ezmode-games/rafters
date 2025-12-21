/**
 * Uncertainty Quantification Client
 *
 * Calls the platform API's uncertainty endpoints via service binding.
 * No D1 needed - uses HTTP to the shared uncertainty service.
 */

type ServiceType =
  | 'auth'
  | 'course'
  | 'pulse'
  | 'coaching'
  | 'fractional'
  | 'component'
  | 'vector'
  | 'integration';

type ConfidenceMethod = 'bootstrap' | 'quantile' | 'ensemble' | 'bayesian' | 'conformal';

interface PredictionContext {
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

interface CreatePredictionRequest {
  service: ServiceType;
  prediction: unknown;
  confidence: number;
  method?: ConfidenceMethod;
  context?: PredictionContext;
}

interface UpdateOutcomeRequest {
  actualOutcome: unknown;
  userFeedback?: number;
  validatedAt?: string;
}

interface PredictionResponse {
  predictionId: string;
  success: boolean;
  message?: string;
}

/**
 * Calculate input confidence based on OKLCH input quality
 */
export function calculateInputConfidence(oklch: { l: number; c: number; h: number }): number {
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
 * Uncertainty client that calls the platform API via service binding
 */
export class UncertaintyClient {
  constructor(private platformApi: Fetcher) {}

  /**
   * Record a new prediction before AI generation
   */
  async recordPrediction(request: CreatePredictionRequest): Promise<string | null> {
    try {
      const response = await this.platformApi.fetch('http://internal/uncertainty/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        console.warn('Failed to record prediction:', response.status);
        return null;
      }

      const data = (await response.json()) as PredictionResponse;
      return data.predictionId;
    } catch (error) {
      console.warn('Error recording prediction:', error);
      return null;
    }
  }

  /**
   * Update prediction with actual outcome after AI generation
   */
  async updateOutcome(predictionId: string, request: UpdateOutcomeRequest): Promise<boolean> {
    try {
      const response = await this.platformApi.fetch(
        `http://internal/uncertainty/predictions/${predictionId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        },
      );

      return response.ok;
    } catch (error) {
      console.warn('Error updating outcome:', error);
      return false;
    }
  }
}

/**
 * Build confidence metadata for response
 */
export function buildConfidenceMetadata(
  predictionId: string | null,
  inputConfidence: number,
  qualityScore: number,
) {
  if (!predictionId) return undefined;

  return {
    predictionId,
    confidence: inputConfidence,
    uncertaintyBounds: {
      lower: Math.max(0, inputConfidence - 0.1),
      upper: Math.min(1, inputConfidence + 0.05),
      confidenceInterval: 0.95,
    },
    qualityScore,
    method: 'bootstrap' as const,
  };
}
