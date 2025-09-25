/**
 * Uncertainty API Integration Tests
 * Tests with actual Cloudflare Workers runtime and D1 database
 */

import { env } from 'cloudflare:test';
import { uuidv7 } from 'uuidv7';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import worker from '@/index';

describe('Uncertainty API Integration', () => {
  const apiKey = env.SEED_QUEUE_API_KEY || 'test-api-key';
  const baseUrl = 'http://localhost/api/uncertainty/predictions';

  // Store created prediction IDs for cleanup
  const createdPredictions: string[] = [];

  beforeAll(async () => {
    // Ensure the table exists
    if (env.DB) {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS confidence_predictions (
          id TEXT PRIMARY KEY,
          timestamp TEXT NOT NULL,
          service TEXT NOT NULL,
          prediction_data TEXT NOT NULL,
          confidence REAL NOT NULL,
          method TEXT NOT NULL DEFAULT 'bootstrap',
          context_data TEXT,
          session_id TEXT,
          actual_outcome TEXT,
          user_feedback INTEGER,
          validated_at TEXT
        )
      `).run();
    }
  });

  afterEach(async () => {
    // Clean up test data
    if (env.DB && createdPredictions.length > 0) {
      for (const id of createdPredictions) {
        await env.DB.prepare('DELETE FROM confidence_predictions WHERE id = ?').bind(id).run();
      }
      createdPredictions.length = 0;
    }
  });

  describe('POST /api/uncertainty/predictions', () => {
    test('creates prediction and stores in D1', async () => {
      const prediction = {
        service: 'component' as const,
        prediction: {
          colorName: 'Ocean Blue',
          confidence: 0.85,
          alternatives: ['Sky Blue', 'Navy Blue'],
        },
        confidence: 0.85,
        method: 'bootstrap',
        context: {
          sessionId: `test-session-${Date.now()}`,
          userAgent: 'test-agent',
          timestamp: new Date().toISOString(),
        },
      };

      const res = await worker.fetch(
        new Request(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(prediction),
        }),
        env
      );

      expect(res.status).toBe(201);
      const body = (await res.json()) as { predictionId: string; success: boolean };
      expect(body.predictionId).toBeDefined();
      expect(body.success).toBe(true);

      // Store for cleanup
      createdPredictions.push(body.predictionId);

      // Verify it was actually stored
      if (env.DB) {
        const stored = await env.DB.prepare('SELECT * FROM confidence_predictions WHERE id = ?')
          .bind(body.predictionId)
          .first();

        expect(stored).toBeDefined();
        expect(stored?.service).toBe('component');
        expect(stored?.confidence).toBe(0.85);
      }
    });

    test('handles complex prediction data structures', async () => {
      const complexPrediction = {
        service: 'vector' as const,
        prediction: {
          patterns: [
            { type: 'geometric', confidence: 0.9 },
            { type: 'organic', confidence: 0.7 },
          ],
          dominantPattern: 'geometric',
          metadata: {
            processingTime: 150,
            modelVersion: '1.2.3',
          },
        },
        confidence: 0.88,
        method: 'conformal',
      };

      const res = await worker.fetch(
        new Request(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(complexPrediction),
        }),
        env
      );

      expect(res.status).toBe(201);
      const body = (await res.json()) as { predictionId: string };
      createdPredictions.push(body.predictionId);

      // Verify complex data was properly stored as JSON
      if (env.DB) {
        const stored = await env.DB.prepare(
          'SELECT prediction_data FROM confidence_predictions WHERE id = ?'
        )
          .bind(body.predictionId)
          .first();

        const parsedData = JSON.parse(stored?.prediction_data as string);
        expect(parsedData.patterns).toHaveLength(2);
        expect(parsedData.dominantPattern).toBe('geometric');
      }
    });
  });

  describe('PUT /api/uncertainty/predictions/:id', () => {
    test('updates prediction with validation data', async () => {
      // First create a prediction
      const predictionId = uuidv7();
      if (env.DB) {
        await env.DB.prepare(`
          INSERT INTO confidence_predictions (
            id, timestamp, service, prediction_data, confidence, method
          ) VALUES (?, ?, ?, ?, ?, ?)
        `)
          .bind(
            predictionId,
            new Date().toISOString(),
            'component',
            JSON.stringify({ test: 'data' }),
            0.75,
            'bootstrap'
          )
          .run();

        createdPredictions.push(predictionId);
      }

      // Now update it
      const update = {
        actualOutcome: {
          accepted: true,
          finalValue: 'Modified Blue',
          processingTime: 200,
        },
        userFeedback: 4,
      };

      const res = await worker.fetch(
        new Request(`${baseUrl}/${predictionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(update),
        }),
        env
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean };
      expect(body.success).toBe(true);

      // Verify update was applied
      if (env.DB) {
        const updated = await env.DB.prepare('SELECT * FROM confidence_predictions WHERE id = ?')
          .bind(predictionId)
          .first();

        expect(updated?.user_feedback).toBe(4);
        expect(updated?.validated_at).toBeDefined();
        const outcome = JSON.parse(updated?.actual_outcome as string);
        expect(outcome.accepted).toBe(true);
      }
    });

    test('returns 404 for non-existent prediction', async () => {
      const nonExistentId = uuidv7();
      const update = {
        actualOutcome: { result: 'test' },
      };

      const res = await worker.fetch(
        new Request(`${baseUrl}/${nonExistentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(update),
        }),
        env
      );

      expect(res.status).toBe(404);
      const body = (await res.json()) as { code: string };
      expect(body.code).toBe('PREDICTION_NOT_FOUND');
    });
  });

  describe('GET /api/uncertainty/predictions/:id', () => {
    test('retrieves complete prediction record', async () => {
      // Create a prediction with all fields
      const predictionId = uuidv7();
      const timestamp = new Date().toISOString();

      if (env.DB) {
        await env.DB.prepare(`
          INSERT INTO confidence_predictions (
            id, timestamp, service, prediction_data, confidence, method,
            context_data, session_id, actual_outcome, user_feedback, validated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .bind(
            predictionId,
            timestamp,
            'dependency',
            JSON.stringify({ prediction: 'full data' }),
            0.92,
            'conformal',
            JSON.stringify({ context: 'full context' }),
            'session-123',
            JSON.stringify({ outcome: 'validated' }),
            5,
            timestamp
          )
          .run();

        createdPredictions.push(predictionId);
      }

      const res = await worker.fetch(
        new Request(`${baseUrl}/${predictionId}`, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
          },
        }),
        env
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        id: string;
        service: string;
        confidence: number;
        method: string;
        sessionId: string;
        userFeedback: number;
        predictionData: unknown;
        contextData: unknown;
        actualOutcome: unknown;
      };

      expect(body.id).toBe(predictionId);
      expect(body.service).toBe('dependency');
      expect(body.confidence).toBe(0.92);
      expect(body.method).toBe('conformal');
      expect(body.sessionId).toBe('session-123');
      expect(body.userFeedback).toBe(5);
      expect(body.predictionData).toEqual({ prediction: 'full data' });
      expect(body.contextData).toEqual({ context: 'full context' });
      expect(body.actualOutcome).toEqual({ outcome: 'validated' });
    });
  });

  describe('GET /api/uncertainty/predictions', () => {
    test('queries with multiple filters', async () => {
      // Create test data
      const predictions = [
        {
          id: uuidv7(),
          service: 'component' as const,
          confidence: 0.85,
          method: 'bootstrap',
          sessionId: 'session-A',
        },
        {
          id: uuidv7(),
          service: 'vector' as const,
          confidence: 0.92,
          method: 'conformal',
          sessionId: 'session-B',
        },
        {
          id: uuidv7(),
          service: 'component' as const,
          confidence: 0.78,
          method: 'bootstrap',
          sessionId: 'session-A',
        },
      ];

      if (env.DB) {
        for (const pred of predictions) {
          await env.DB.prepare(`
            INSERT INTO confidence_predictions (
              id, timestamp, service, prediction_data, confidence, method, session_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
            .bind(
              pred.id,
              new Date().toISOString(),
              pred.service,
              JSON.stringify({ test: 'data' }),
              pred.confidence,
              pred.method,
              pred.sessionId
            )
            .run();

          createdPredictions.push(pred.id);
        }
      }

      // Query with filters
      const res = await worker.fetch(
        new Request(`${baseUrl}?service=component&minConfidence=0.8&limit=10`, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
          },
        }),
        env
      );

      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        predictions: Array<{
          service: string;
          confidence: number;
        }>;
      };

      // Should only return color-intel predictions with confidence >= 0.8
      const componentHighConfidence = body.predictions.filter(
        (p: { service: string; confidence: number }) =>
          p.service === 'component' && p.confidence >= 0.8
      );
      expect(componentHighConfidence.length).toBeGreaterThan(0);

      // Should not include low confidence predictions
      const lowConfidence = body.predictions.filter(
        (p: { confidence: number }) => p.confidence < 0.8
      );
      expect(lowConfidence).toHaveLength(0);
    });

    test('handles pagination correctly', async () => {
      // Create multiple predictions
      const predictionIds = [];
      if (env.DB) {
        for (let i = 0; i < 15; i++) {
          const id = uuidv7();
          await env.DB.prepare(`
            INSERT INTO confidence_predictions (
              id, timestamp, service, prediction_data, confidence, method
            ) VALUES (?, ?, ?, ?, ?, ?)
          `)
            .bind(
              id,
              new Date().toISOString(),
              'integration',
              JSON.stringify({ index: i }),
              0.5 + i * 0.03,
              'bootstrap'
            )
            .run();

          predictionIds.push(id);
          createdPredictions.push(id);
        }
      }

      // First page
      const res1 = await worker.fetch(
        new Request(`${baseUrl}?service=integration&limit=5&offset=0`, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
          },
        }),
        env
      );

      expect(res1.status).toBe(200);
      const body1 = (await res1.json()) as {
        predictions: Array<{ id: string }>;
        pagination: { limit: number; offset: number };
      };
      expect(body1.predictions.length).toBeLessThanOrEqual(5);
      expect(body1.pagination.limit).toBe(5);
      expect(body1.pagination.offset).toBe(0);

      // Second page
      const res2 = await worker.fetch(
        new Request(`${baseUrl}?service=integration&limit=5&offset=5`, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey,
          },
        }),
        env
      );

      expect(res2.status).toBe(200);
      const body2 = (await res2.json()) as {
        predictions: Array<{ id: string }>;
        pagination: { limit: number; offset: number };
      };
      expect(body2.predictions.length).toBeLessThanOrEqual(5);
      expect(body2.pagination.offset).toBe(5);

      // Ensure different results
      const firstPageIds = body1.predictions.map((p: { id: string }) => p.id);
      const secondPageIds = body2.predictions.map((p: { id: string }) => p.id);
      const overlap = firstPageIds.filter((id: string) => secondPageIds.includes(id));
      expect(overlap).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    test('handles malformed JSON gracefully', async () => {
      const res = await worker.fetch(
        new Request(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: 'not valid json {',
        }),
        env
      );

      expect(res.status).toBe(400);
    });

    test('validates required fields', async () => {
      const invalidPrediction = {
        service: 'component' as const,
        // Missing required 'prediction' and 'confidence' fields
      };

      const res = await worker.fetch(
        new Request(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(invalidPrediction),
        }),
        env
      );

      expect(res.status).toBe(400);
    });

    test('enforces confidence range validation', async () => {
      const invalidConfidence = {
        service: 'component' as const,
        prediction: { test: 'data' },
        confidence: 1.5, // Invalid: > 1.0
      };

      const res = await worker.fetch(
        new Request(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify(invalidConfidence),
        }),
        env
      );

      expect(res.status).toBe(400);
    });
  });
});
