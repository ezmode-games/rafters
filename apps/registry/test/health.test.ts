/**
 * Tests for health check endpoint
 */

import { describe, expect, it } from 'vitest';
import app from '../src/index';

describe('Health Check API', () => {
  it('should return healthy status', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('healthy');
    expect(data.version).toBe('1.0.0');
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeDefined();
  });

  it('should return valid timestamp', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const data = await res.json();
    const timestamp = new Date(data.timestamp);

    expect(timestamp instanceof Date).toBe(true);
    expect(Number.isNaN(timestamp.getTime())).toBe(false);

    // Should be within the last minute
    const now = new Date();
    const timeDiff = now.getTime() - timestamp.getTime();
    expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
  });
});
