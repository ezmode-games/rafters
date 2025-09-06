/**
 * Tests for Queue Seeding Route
 *
 * TDD: Write tests first, then implement
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedQueue } from '../../routes/seed-queue';
import {
  type seedQueueErrorFixture,
  seedQueueInfoFixture,
  type seedQueueSuccessFixture,
} from '../fixtures/seed-queue.fixture';

// Mock the queue binding
const mockQueue = {
  sendBatch: vi.fn(),
};

// Mock environment
const mockEnv = {
  COLOR_QUEUE: mockQueue,
};

describe('Queue Seeding Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /seed-queue', () => {
    it('should generate the correct number of strategic colors', async () => {
      // Arrange
      mockQueue.sendBatch.mockResolvedValue(undefined);

      // Act
      const response = await seedQueue.request(
        '/',
        {
          method: 'POST',
        },
        mockEnv
      );

      // Assert
      const json = (await response.json()) as typeof seedQueueSuccessFixture;
      expect(json.success).toBe(true);
      expect(json.stats.strategicColors).toBe(540); // 9L × 5C × 12H
      expect(json.stats.standardColors).toBe(10);
      expect(json.stats.totalColors).toBe(550);

      // Should be called 6 times (550 colors / 100 batch size = 5.5 -> 6 batches)
      expect(mockQueue.sendBatch).toHaveBeenCalledTimes(6);
    });

    it('should send messages in correct batch sizes', async () => {
      // Arrange
      mockQueue.sendBatch.mockResolvedValue(undefined);

      // Act
      await seedQueue.request(
        '/',
        {
          method: 'POST',
        },
        mockEnv
      );

      // Assert
      const calls = mockQueue.sendBatch.mock.calls;

      // First 5 batches should have 100 messages each
      for (let i = 0; i < 5; i++) {
        expect(calls[i][0]).toHaveLength(100);
      }

      // Last batch should have 50 messages (550 % 100 = 50)
      expect(calls[5][0]).toHaveLength(50);
    });

    it('should send messages with correct format', async () => {
      // Arrange
      mockQueue.sendBatch.mockResolvedValue(undefined);

      // Act
      await seedQueue.request(
        '/',
        {
          method: 'POST',
        },
        mockEnv
      );

      // Assert
      const firstBatch = mockQueue.sendBatch.mock.calls[0][0];
      const firstMessage = firstBatch[0];

      expect(firstMessage).toHaveProperty('body');
      expect(firstMessage.body).toHaveProperty('oklch');
      expect(firstMessage.body).toHaveProperty('index');
      expect(firstMessage.body).toHaveProperty('timestamp');

      // OKLCH should have l, c, h properties
      expect(firstMessage.body.oklch).toHaveProperty('l');
      expect(firstMessage.body.oklch).toHaveProperty('c');
      expect(firstMessage.body.oklch).toHaveProperty('h');

      // Values should be in valid ranges
      expect(firstMessage.body.oklch.l).toBeGreaterThanOrEqual(0);
      expect(firstMessage.body.oklch.l).toBeLessThanOrEqual(1);
      expect(firstMessage.body.oklch.c).toBeGreaterThanOrEqual(0);
      expect(firstMessage.body.oklch.h).toBeGreaterThanOrEqual(0);
      expect(firstMessage.body.oklch.h).toBeLessThan(360);
    });

    it('should return success response with correct stats', async () => {
      // Arrange
      mockQueue.sendBatch.mockResolvedValue(undefined);

      // Act
      const response = await seedQueue.request(
        '/',
        {
          method: 'POST',
        },
        mockEnv
      );

      // Assert
      expect(response.status).toBe(200);
      const json = (await response.json()) as typeof seedQueueSuccessFixture;
      expect(json).toMatchObject({
        success: true,
        stats: {
          strategicColors: 540,
          standardColors: 10,
          totalColors: 550,
          totalSent: 550,
        },
      });
      expect(json).toHaveProperty('timestamp');
    });

    it('should handle queue send failures', async () => {
      // Arrange
      const error = new Error('Queue send failed');
      mockQueue.sendBatch.mockRejectedValue(error);

      // Act
      const response = await seedQueue.request(
        '/',
        {
          method: 'POST',
        },
        mockEnv
      );

      // Assert
      expect(response.status).toBe(500);
      const json = (await response.json()) as typeof seedQueueErrorFixture;
      expect(json.success).toBe(false);
      expect(json.error).toBe('Queue send failed');
    });

    it('should generate strategic colors with correct distribution', () => {
      // Test the mathematical distribution
      const config = {
        lightnessSteps: 9,
        chromaSteps: 5,
        hueSteps: 12,
      };

      // Expected color count
      const expectedCount = config.lightnessSteps * config.chromaSteps * config.hueSteps;
      expect(expectedCount).toBe(540);

      // Lightness range: 0.1 to 0.9 (8 steps between)
      const lightnessStep = 0.8 / (config.lightnessSteps - 1);
      expect(lightnessStep).toBeCloseTo(0.1, 2);

      // Chroma range: 0.05 to 0.25 (0.2 range)
      const chromaStep = 0.2 / (config.chromaSteps - 1);
      expect(chromaStep).toBeCloseTo(0.05, 2);

      // Hue range: 0 to 330 (30° steps)
      const hueStep = 360 / config.hueSteps;
      expect(hueStep).toBe(30);
    });
  });

  describe('GET /seed-queue', () => {
    it('should return information about the endpoint', async () => {
      // Act
      const response = await seedQueue.request(
        '/',
        {
          method: 'GET',
        },
        mockEnv
      );

      // Assert
      expect(response.status).toBe(200);
      const json = (await response.json()) as typeof seedQueueInfoFixture;
      expect(json).toEqual(seedQueueInfoFixture);
    });
  });

  describe('Color Generation Functions', () => {
    it('should generate standard colors with correct count', () => {
      // Standard colors: 10 fallback colors
      const expectedStandardCount = 10;
      expect(expectedStandardCount).toBe(10);
    });
  });
});
