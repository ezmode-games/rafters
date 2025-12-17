import { SELF } from 'cloudflare:test';
import { OKLCHSchema } from '@rafters/shared';
import { describe, expect, it } from 'vitest';
import { zocker } from 'zocker';

describe('Queue Routes', () => {
  describe('POST /queue', () => {
    it('queues a single color', async () => {
      const color = zocker(OKLCHSchema).setSeed(1).generate();

      const res = await SELF.fetch('http://localhost/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.queuedCount).toBe(1);
      expect(json.requestId).toBeDefined();
    });

    it('accepts optional token and name', async () => {
      const color = zocker(OKLCHSchema).setSeed(2).generate();

      const res = await SELF.fetch('http://localhost/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          color,
          token: 'primary',
          name: 'ocean-blue',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it('validates color schema', async () => {
      const res = await SELF.fetch('http://localhost/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: { l: 2, c: -1, h: 500 } }),
      });

      expect(res.status).toBe(422);
    });

    it('requires color field', async () => {
      const res = await SELF.fetch('http://localhost/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(422);
    });
  });

  describe('POST /queue/batch', () => {
    it('queues multiple colors', async () => {
      const colors = Array.from({ length: 5 }, (_, i) =>
        zocker(OKLCHSchema)
          .setSeed(i + 10)
          .generate(),
      );

      const res = await SELF.fetch('http://localhost/queue/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.queuedCount).toBe(5);
      expect(json.batchId).toBeDefined();
    });

    it('accepts optional batchId', async () => {
      const colors = [zocker(OKLCHSchema).setSeed(20).generate()];

      const res = await SELF.fetch('http://localhost/queue/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors, batchId: 'custom-batch-123' }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it('requires at least one color', async () => {
      const res = await SELF.fetch('http://localhost/queue/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: [] }),
      });

      expect(res.status).toBe(422);
    });

    it('limits batch to 1000 colors', async () => {
      const colors = Array.from({ length: 1001 }, (_, i) =>
        zocker(OKLCHSchema)
          .setSeed(i + 100)
          .generate(),
      );

      const res = await SELF.fetch('http://localhost/queue/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors }),
      });

      expect(res.status).toBe(422);
    });
  });

  describe('POST /queue/spectrum', () => {
    it('queues a spectrum with default config', async () => {
      const res = await SELF.fetch('http://localhost/queue/spectrum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.spectrumId).toBeDefined();
      // Default: 9 * 5 * 12 = 540 colors
      expect(json.queuedCount).toBe(540);
      expect(json.config).toEqual({
        lightnessSteps: 9,
        chromaSteps: 5,
        hueSteps: 12,
        baseName: 'spectrum-seed',
      });
    });

    it('accepts custom spectrum config', async () => {
      const res = await SELF.fetch('http://localhost/queue/spectrum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lightnessSteps: 5,
          chromaSteps: 3,
          hueSteps: 6,
          baseName: 'custom-spectrum',
        }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      // 5 * 3 * 6 = 90 colors
      expect(json.queuedCount).toBe(90);
      expect(json.config.baseName).toBe('custom-spectrum');
    });

    it('validates step ranges', async () => {
      const res = await SELF.fetch('http://localhost/queue/spectrum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lightnessSteps: 50 }), // Max is 20
      });

      expect(res.status).toBe(422);
    });

    it('validates hue steps maximum', async () => {
      const res = await SELF.fetch('http://localhost/queue/spectrum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hueSteps: 40 }), // Max is 36
      });

      expect(res.status).toBe(422);
    });
  });
});
