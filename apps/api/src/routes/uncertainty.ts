/**
 * Uncertainty Quantification API Routes
 *
 * RESTful endpoints for recording predictions, updating outcomes, and querying
 * historical confidence data. Uses UUIDv7 for time-ordered operations.
 */

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { uuidv7 } from 'uuidv7';
import {
  type CreatePrediction,
  CreatePredictionSchema,
  type QueryPredictions,
  QueryPredictionsSchema,
  type UpdatePrediction,
  UpdatePredictionSchema,
} from '../lib/schemas/uncertainty';
import { requireApiKey } from '../middleware/auth';

const uncertainty = new Hono<{ Bindings: Env }>();

// Apply authentication to all uncertainty endpoints
uncertainty.use('*', requireApiKey());

/**
 * POST /api/uncertainty/predictions
 * Create a new confidence prediction record
 */
uncertainty.post('/', zValidator('json', CreatePredictionSchema), async (c) => {
  try {
    const prediction: CreatePrediction = c.req.valid('json');

    // Generate time-ordered UUID
    const id = uuidv7();
    const timestamp = new Date().toISOString();

    // Insert prediction record using native D1
    await c.env.DB.prepare(`
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
        prediction.method,
        prediction.context ? JSON.stringify(prediction.context) : null,
        prediction.context?.sessionId || null
      )
      .run();

    return c.json(
      {
        predictionId: id,
        success: true,
        message: 'Prediction recorded successfully',
      },
      201
    );
  } catch (error) {
    console.error('Failed to create prediction:', error);

    return c.json(
      {
        error: 'Prediction creation failed',
        message: 'Unable to record prediction data',
        code: 'PREDICTION_CREATE_ERROR',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      500
    );
  }
});

/**
 * PUT /api/uncertainty/predictions/:id
 * Update prediction with actual outcome and user feedback
 */
uncertainty.put('/:id', zValidator('json', UpdatePredictionSchema), async (c) => {
  try {
    const predictionId = c.req.param('id');
    const update: UpdatePrediction = c.req.valid('json');

    // Validate UUIDv7 format (basic check)
    if (!predictionId || predictionId.length !== 36) {
      return c.json(
        {
          error: 'Invalid prediction ID',
          message: 'Prediction ID must be a valid UUIDv7',
          code: 'INVALID_PREDICTION_ID',
        },
        400
      );
    }

    const validatedAt = update.validatedAt || new Date().toISOString();

    // Update the prediction record
    const result = await c.env.DB.prepare(`
        UPDATE confidence_predictions
        SET actual_outcome = ?, user_feedback = ?, validated_at = ?
        WHERE id = ?
      `)
      .bind(
        JSON.stringify(update.actualOutcome),
        update.userFeedback || null,
        validatedAt,
        predictionId
      )
      .run();

    // Check if record was found and updated
    if (!result.success || result.meta.changes === 0) {
      return c.json(
        {
          error: 'Prediction not found',
          message: `No prediction found with ID: ${predictionId}`,
          code: 'PREDICTION_NOT_FOUND',
        },
        404
      );
    }

    return c.json(
      {
        predictionId,
        success: true,
        message: 'Prediction updated with outcome',
      },
      200
    );
  } catch (error) {
    console.error('Failed to update prediction:', error);

    return c.json(
      {
        error: 'Prediction update failed',
        message: 'Unable to update prediction with outcome',
        code: 'PREDICTION_UPDATE_ERROR',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      500
    );
  }
});

/**
 * GET /api/uncertainty/predictions/:id
 * Retrieve specific prediction by ID
 */
uncertainty.get('/:id', async (c) => {
  try {
    const predictionId = c.req.param('id');

    if (!predictionId || predictionId.length !== 36) {
      return c.json(
        {
          error: 'Invalid prediction ID',
          message: 'Prediction ID must be a valid UUIDv7',
          code: 'INVALID_PREDICTION_ID',
        },
        400
      );
    }

    const result = await c.env.DB.prepare(`
      SELECT * FROM confidence_predictions WHERE id = ?
    `)
      .bind(predictionId)
      .first();

    if (!result) {
      return c.json(
        {
          error: 'Prediction not found',
          message: `No prediction found with ID: ${predictionId}`,
          code: 'PREDICTION_NOT_FOUND',
        },
        404
      );
    }

    return c.json(
      {
        id: result.id,
        timestamp: result.timestamp,
        service: result.service,
        predictionData: JSON.parse(result.prediction_data as string),
        confidence: result.confidence,
        method: result.method,
        contextData: result.context_data ? JSON.parse(result.context_data as string) : null,
        sessionId: result.session_id,
        actualOutcome: result.actual_outcome ? JSON.parse(result.actual_outcome as string) : null,
        userFeedback: result.user_feedback,
        validatedAt: result.validated_at,
      },
      200
    );
  } catch (error) {
    console.error('Failed to retrieve prediction:', error);

    return c.json(
      {
        error: 'Prediction retrieval failed',
        message: 'Unable to retrieve prediction data',
        code: 'PREDICTION_RETRIEVE_ERROR',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      500
    );
  }
});

/**
 * GET /api/uncertainty/predictions
 * Query historical predictions with filtering and pagination
 */
uncertainty.get('/', zValidator('query', QueryPredictionsSchema), async (c) => {
  try {
    const query: QueryPredictions = c.req.valid('query');

    // Build dynamic SQL query with filtering
    const conditions: string[] = [];
    const bindings: (string | number | boolean | null)[] = [];

    // Service filtering
    if (query.service) {
      conditions.push('service = ?');
      bindings.push(query.service);
    }

    // Confidence range filtering
    if (query.minConfidence !== undefined) {
      conditions.push('confidence >= ?');
      bindings.push(query.minConfidence);
    }
    if (query.maxConfidence !== undefined) {
      conditions.push('confidence <= ?');
      bindings.push(query.maxConfidence);
    }

    // Method filtering
    if (query.method) {
      conditions.push('method = ?');
      bindings.push(query.method);
    }

    // Validation status filtering
    if (query.validated !== undefined) {
      if (query.validated) {
        conditions.push('validated_at IS NOT NULL');
      } else {
        conditions.push('validated_at IS NULL');
      }
    }

    // Session filtering
    if (query.sessionId) {
      conditions.push('session_id = ?');
      bindings.push(query.sessionId);
    }

    // Time range filtering
    if (query.since) {
      if (query.since.length === 36) {
        // UUIDv7 ID
        conditions.push('id >= ?');
        bindings.push(query.since);
      } else {
        // ISO datetime
        conditions.push('timestamp >= ?');
        bindings.push(query.since);
      }
    }
    if (query.until) {
      if (query.until.length === 36) {
        conditions.push('id <= ?');
        bindings.push(query.until);
      } else {
        conditions.push('timestamp <= ?');
        bindings.push(query.until);
      }
    }

    // Build final query
    let sql = 'SELECT * FROM confidence_predictions';
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ' ORDER BY id DESC'; // UUIDv7 gives us time ordering
    sql += ' LIMIT ? OFFSET ?';
    bindings.push(query.limit, query.offset);

    const result = await c.env.DB.prepare(sql)
      .bind(...bindings)
      .all();

    if (!result.success) {
      throw new Error('Database query failed');
    }

    // Transform results
    const predictions = result.results.map((record: Record<string, unknown>) => ({
      id: record.id,
      timestamp: record.timestamp,
      service: record.service,
      predictionData: JSON.parse(record.prediction_data as string),
      confidence: record.confidence,
      method: record.method,
      contextData: record.context_data ? JSON.parse(record.context_data as string) : null,
      sessionId: record.session_id,
      actualOutcome: record.actual_outcome ? JSON.parse(record.actual_outcome as string) : null,
      userFeedback: record.user_feedback,
      validatedAt: record.validated_at,
    }));

    return c.json(
      {
        predictions,
        pagination: {
          limit: query.limit,
          offset: query.offset,
          total: undefined, // Could add COUNT query for total if needed
        },
        filters: Object.fromEntries(
          Object.entries(query).filter(([_, value]) => value !== undefined)
        ),
      },
      200
    );
  } catch (error) {
    console.error('Failed to query predictions:', error);

    return c.json(
      {
        error: 'Prediction query failed',
        message: 'Unable to retrieve prediction data',
        code: 'PREDICTION_QUERY_ERROR',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      500
    );
  }
});

export { uncertainty };
