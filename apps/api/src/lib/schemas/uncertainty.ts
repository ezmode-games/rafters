/**
 * Zod Schemas for Uncertainty Quantification API
 *
 * Comprehensive validation schemas for prediction recording, outcome tracking,
 * and historical data queries. Follows JSON:API patterns with REST verbs.
 */

import { z } from 'zod';

/**
 * Service Types
 */
export const ServiceTypeSchema = z.enum([
  'dependency',
  'component',
  'vector',
  'integration',
  'business-context',
]);

/**
 * Confidence Method Types
 */
export const ConfidenceMethodSchema = z.enum([
  'bootstrap',
  'quantile',
  'ensemble',
  'bayesian',
  'conformal',
]);

/**
 * User Feedback Rating (1-5 scale)
 */
export const UserFeedbackSchema = z.number().int().min(1).max(5);

/**
 * Context data for predictions - flexible but typed
 */
export const PredictionContextSchema = z
  .object({
    userAgent: z.string().optional(),
    sessionId: z.string().optional(),
    requestId: z.string().optional(),
    timestamp: z.string().datetime().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

/**
 * POST /api/uncertainty/predictions
 * Schema for creating new prediction records
 */
export const CreatePredictionSchema = z
  .object({
    service: ServiceTypeSchema,
    prediction: z.unknown(), // Flexible - any JSON serializable data
    confidence: z.number().min(0).max(1),
    method: ConfidenceMethodSchema.default('bootstrap'),
    context: PredictionContextSchema.optional(),
  })
  .strict();

/**
 * PUT /api/uncertainty/predictions/:id
 * Schema for updating predictions with actual outcomes
 */
export const UpdatePredictionSchema = z
  .object({
    actualOutcome: z.unknown(), // Flexible - any JSON serializable data
    userFeedback: UserFeedbackSchema.optional(),
    validatedAt: z.string().datetime().optional(), // ISO 8601 string
  })
  .strict();

/**
 * GET /api/uncertainty/predictions (query parameters)
 * Schema for historical data queries
 */
export const QueryPredictionsSchema = z
  .object({
    // Time range filtering (using UUIDv7 properties)
    since: z.string().optional(), // UUIDv7 ID or ISO datetime
    until: z.string().optional(), // UUIDv7 ID or ISO datetime

    // Service filtering
    service: ServiceTypeSchema.optional(),

    // Confidence filtering
    minConfidence: z.coerce.number().min(0).max(1).optional(),
    maxConfidence: z.coerce.number().min(0).max(1).optional(),

    // Method filtering
    method: ConfidenceMethodSchema.optional(),

    // Validation status
    validated: z.coerce.boolean().optional(), // Only predictions with outcomes

    // Session filtering
    sessionId: z.string().optional(),

    // Pagination
    limit: z.coerce.number().int().min(1).max(1000).default(100),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

/**
 * Response schemas
 */

export const PredictionResponseSchema = z
  .object({
    predictionId: z.string(), // UUIDv7
    success: z.boolean(),
    message: z.string().optional(),
  })
  .strict();

export const ConfidencePredictionSchema = z
  .object({
    id: z.string(),
    timestamp: z.string().datetime(),
    service: ServiceTypeSchema,
    predictionData: z.unknown(),
    confidence: z.number().min(0).max(1),
    method: ConfidenceMethodSchema,
    contextData: z.unknown().optional(),
    sessionId: z.string().optional(),
    actualOutcome: z.unknown().optional(),
    userFeedback: UserFeedbackSchema.optional(),
    validatedAt: z.string().datetime().optional(),
  })
  .strict();

export const QueryResponseSchema = z
  .object({
    predictions: z.array(ConfidencePredictionSchema),
    pagination: z.object({
      limit: z.number(),
      offset: z.number(),
      total: z.number().optional(),
    }),
    filters: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

/**
 * Error response schema
 */
export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    message: z.string(),
    code: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

/**
 * Type exports for TypeScript
 */
export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type ConfidenceMethod = z.infer<typeof ConfidenceMethodSchema>;
export type CreatePrediction = z.infer<typeof CreatePredictionSchema>;
export type UpdatePrediction = z.infer<typeof UpdatePredictionSchema>;
export type QueryPredictions = z.infer<typeof QueryPredictionsSchema>;
export type PredictionResponse = z.infer<typeof PredictionResponseSchema>;
export type ConfidencePrediction = z.infer<typeof ConfidencePredictionSchema>;
export type QueryResponse = z.infer<typeof QueryResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
