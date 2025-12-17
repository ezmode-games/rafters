import * as HttpStatusCodes from 'stoker/http-status-codes';
import { ColorSeedPublisher } from '@/lib/queue/publisher';
import type { AppRouteHandler } from '@/lib/types';

import type { BatchRoute, QueueRoute, SpectrumRoute } from './queue.routes';

export const queue: AppRouteHandler<QueueRoute> = async (c) => {
  const { color, token, name } = c.req.valid('json');
  const publisher = new ColorSeedPublisher(c.env.COLOR_SEED_QUEUE);
  const result = await publisher.publishSingle(color, { token, name });
  return c.json(
    {
      success: result.success,
      requestId: result.requestId ?? crypto.randomUUID(),
      queuedCount: result.queuedCount ?? 1,
    },
    HttpStatusCodes.OK,
  );
};

export const batch: AppRouteHandler<BatchRoute> = async (c) => {
  const { colors, batchId } = c.req.valid('json');
  const publisher = new ColorSeedPublisher(c.env.COLOR_SEED_QUEUE);
  const payload = colors.map((oklch) => ({ oklch }));
  const result = await publisher.publishBatch(payload, { batchId });
  return c.json(
    {
      success: result.success,
      batchId: result.requestId ?? crypto.randomUUID(),
      queuedCount: result.queuedCount ?? colors.length,
    },
    HttpStatusCodes.OK,
  );
};

export const spectrum: AppRouteHandler<SpectrumRoute> = async (c) => {
  const config = c.req.valid('json');
  const publisher = new ColorSeedPublisher(c.env.COLOR_SEED_QUEUE);
  const result = await publisher.publishSpectrum(config);
  const totalColors = config.lightnessSteps * config.chromaSteps * config.hueSteps;
  return c.json(
    {
      success: result.success,
      spectrumId: result.requestId ?? crypto.randomUUID(),
      queuedCount: result.queuedCount ?? totalColors,
      config,
    },
    HttpStatusCodes.OK,
  );
};
