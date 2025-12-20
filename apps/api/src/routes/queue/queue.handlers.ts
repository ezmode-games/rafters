import * as HttpStatusCodes from 'stoker/http-status-codes';
import { fetchQueueStatus, getQueueId } from '@/lib/queue/list';
import { ColorSeedPublisher } from '@/lib/queue/publisher';
import type { AppRouteHandler } from '@/lib/types';

import type { BatchRoute, ListRoute, QueueRoute, SpectrumRoute } from './queue.routes';

const QUEUE_NAME = 'color-processing-queue';

export const queue: AppRouteHandler<QueueRoute> = async (c) => {
  const { color, token, name } = c.req.valid('json');
  const publisher = new ColorSeedPublisher(c.env.COLOR_QUEUE);
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
  const publisher = new ColorSeedPublisher(c.env.COLOR_QUEUE);
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
  const publisher = new ColorSeedPublisher(c.env.COLOR_QUEUE);
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

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const accountId = c.env.CF_ACCOUNT_ID;
  const apiToken = c.env.CF_API_TOKEN;

  if (!accountId || !apiToken) {
    return c.json(
      {
        success: false,
        backlogCount: 0,
        error: 'Queue list not configured: missing CF_ACCOUNT_ID or CF_API_TOKEN',
      },
      HttpStatusCodes.SERVICE_UNAVAILABLE,
    );
  }

  const queueId = await getQueueId(accountId, apiToken, QUEUE_NAME);

  if (!queueId) {
    return c.json(
      {
        success: false,
        backlogCount: 0,
        error: `Queue "${QUEUE_NAME}" not found`,
      },
      HttpStatusCodes.SERVICE_UNAVAILABLE,
    );
  }

  const status = await fetchQueueStatus({ accountId, apiToken, queueId });

  if (status.error) {
    return c.json(
      {
        success: false,
        backlogCount: status.backlogCount,
        error: status.error,
      },
      HttpStatusCodes.SERVICE_UNAVAILABLE,
    );
  }

  return c.json(
    {
      success: true,
      backlogCount: status.backlogCount,
    },
    HttpStatusCodes.OK,
  );
};
