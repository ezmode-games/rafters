import { createRoute, z } from '@hono/zod-openapi';
import { OKLCHSchema } from '@rafters/shared';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema } from 'stoker/openapi/schemas';

const addOneSchema = z.object({
  color: OKLCHSchema,
  token: z.string().optional(),
  name: z.string().optional(),
  requestId: z.string().optional(),
});

const batchSchema = z.object({
  colors: z.array(OKLCHSchema).min(1).max(1000),
  batchId: z.string().optional(),
});

const responseOneSchema = z.object({
  success: z.boolean().default(true),
  requestId: z.string(),
  queuedCount: z.number().min(1),
  message: z.string().optional(),
});

const responseBatchSchema = z.object({
  success: z.boolean().default(true),
  batchId: z.string(),
  queuedCount: z.number().min(1),
  message: z.string().optional(),
});

const spectrumRequestSchema = z.object({
  lightnessSteps: z.number().min(1).max(20).default(9),
  chromaSteps: z.number().min(1).max(20).default(5),
  hueSteps: z.number().min(1).max(36).default(12),
  baseName: z.string().optional().default('spectrum-seed'),
});

const spectrumResponseSchema = z.object({
  success: z.boolean().default(true),
  spectrumId: z.string(),
  queuedCount: z.number().min(1),
  config: spectrumRequestSchema,
  estimatedProcessingTime: z.number().optional(), // in seconds
});

const listResponseSchema = z.object({
  success: z.boolean(),
  backlogCount: z.number(),
  error: z.string().optional(),
});

export type AddOneRequest = z.infer<typeof addOneSchema>;
export type BatchRequest = z.infer<typeof batchSchema>;
export type ResponseOne = z.infer<typeof responseOneSchema>;
export type ResponseBatch = z.infer<typeof responseBatchSchema>;
export type SpectrumRequest = z.infer<typeof spectrumRequestSchema>;
export type SpectrumResponse = z.infer<typeof spectrumResponseSchema>;
export type ListResponse = z.infer<typeof listResponseSchema>;

const tags: string[] = ['Queue'];

export const queue = createRoute({
  path: '/queue',
  method: 'post',
  request: {
    body: jsonContentRequired(addOneSchema, 'Adds a single color to the queue'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(responseOneSchema, 'Successful queueing response'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(addOneSchema),
      'The validation error(s)',
    ),
  },
});

export const batch = createRoute({
  method: 'post',
  path: '/queue/batch',
  request: {
    body: jsonContentRequired(batchSchema, 'Adds a batch of colors to the queue'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(responseBatchSchema, 'Successful batch queueing response'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(batchSchema),
      'The validation error(s)',
    ),
  },
});

export const spectrum = createRoute({
  method: 'post',
  path: '/queue/spectrum',
  request: {
    body: jsonContentRequired(
      spectrumRequestSchema,
      'Queues a full color spectrum based on the provided configuration. Duplicates are ignored but still queued.',
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      spectrumResponseSchema,
      'Successful spectrum queueing response',
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(spectrumRequestSchema),
      'The validation error(s)',
    ),
  },
});

export const list = createRoute({
  method: 'get',
  path: '/queue/list',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(listResponseSchema, 'Queue backlog status'),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
      listResponseSchema,
      'Queue service unavailable or not configured',
    ),
  },
});

export type QueueRoute = typeof queue;
export type BatchRoute = typeof batch;
export type SpectrumRoute = typeof spectrum;
export type ListRoute = typeof list;
