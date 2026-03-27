import { createRoute, z } from '@hono/zod-openapi';
import { TokenSchema } from '@rafters/shared';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

// =============================================================================
// Response schemas
// =============================================================================

const SystemResponseSchema = z.object({
  namespaces: z.array(z.string()),
  tokenCount: z.number(),
  generatedAt: z.string().optional(),
});

const NamespaceResponseSchema = z.object({
  namespace: z.string(),
  tokens: z.array(TokenSchema),
  count: z.number(),
});

const TokenDetailResponseSchema = z.object({
  token: TokenSchema,
  dependsOn: z.array(z.string()),
  dependents: z.array(z.string()),
  generationRule: z.string().optional(),
  hasOverride: z.boolean(),
});

const AllTokensResponseSchema = z.object({
  namespaces: z.array(z.string()),
  tokenCount: z.number(),
  tokens: z.record(z.string(), z.array(TokenSchema)),
});

const SetTokenRequestSchema = z.object({
  value: z.union([z.string(), z.record(z.string(), z.unknown())]),
  reason: z.string().min(1, 'Reason is required. Every change needs a why.'),
  context: z.string().optional(),
});

const SetTokenResponseSchema = z.object({
  token: TokenSchema,
  affected: z.array(z.string()),
});

const BatchSetRequestSchema = z.object({
  updates: z.array(
    z.object({
      namespace: z.string(),
      name: z.string(),
      value: z.union([z.string(), z.record(z.string(), z.unknown())]),
      reason: z.string().min(1),
    }),
  ),
});

const BatchSetResponseSchema = z.object({
  updated: z.number(),
  affected: z.array(z.string()),
});

const ClearOverrideResponseSchema = z.object({
  token: TokenSchema,
  restoredValue: z.union([z.string(), z.record(z.string(), z.unknown())]),
});

const ResetNamespaceRequestSchema = z.object({
  config: z.record(z.string(), z.unknown()).optional(),
});

const ResetNamespaceResponseSchema = z.object({
  namespace: z.string(),
  tokenCount: z.number(),
  affected: z.array(z.string()),
});

const ErrorResponseSchema = z.object({
  message: z.string(),
});

// =============================================================================
// Getters
// =============================================================================

export const getSystem = createRoute({
  tags: ['Tokens'],
  method: 'get',
  path: '/tokens/system',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(SystemResponseSchema, 'System metadata'),
  },
});

export const getAllTokens = createRoute({
  tags: ['Tokens'],
  method: 'get',
  path: '/tokens',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(AllTokensResponseSchema, 'All tokens by namespace'),
  },
});

export const getNamespace = createRoute({
  tags: ['Tokens'],
  method: 'get',
  path: '/tokens/{namespace}',
  request: {
    params: z.object({ namespace: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(NamespaceResponseSchema, 'Namespace tokens'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(ErrorResponseSchema, 'Namespace not found'),
  },
});

export const getToken = createRoute({
  tags: ['Tokens'],
  method: 'get',
  path: '/tokens/{namespace}/{name}',
  request: {
    params: z.object({ namespace: z.string(), name: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(TokenDetailResponseSchema, 'Token detail with dependencies'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(ErrorResponseSchema, 'Token not found'),
  },
});

// =============================================================================
// Setters
// =============================================================================

export const setToken = createRoute({
  tags: ['Tokens'],
  method: 'put',
  path: '/tokens/{namespace}/{name}',
  request: {
    params: z.object({ namespace: z.string(), name: z.string() }),
    body: jsonContent(SetTokenRequestSchema, 'Token value + reason'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(SetTokenResponseSchema, 'Updated token + affected list'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      ErrorResponseSchema,
      'Missing reason or invalid value',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(ErrorResponseSchema, 'Token not found'),
  },
});

export const batchSetTokens = createRoute({
  tags: ['Tokens'],
  method: 'put',
  path: '/tokens',
  request: {
    body: jsonContent(BatchSetRequestSchema, 'Batch token updates'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(BatchSetResponseSchema, 'Batch update result'),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(ErrorResponseSchema, 'Validation error'),
  },
});

export const clearOverride = createRoute({
  tags: ['Tokens'],
  method: 'delete',
  path: '/tokens/{namespace}/{name}/override',
  request: {
    params: z.object({ namespace: z.string(), name: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ClearOverrideResponseSchema, 'Override cleared'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(ErrorResponseSchema, 'Token not found or no override'),
  },
});

// =============================================================================
// Reset
// =============================================================================

export const resetNamespace = createRoute({
  tags: ['Tokens'],
  method: 'post',
  path: '/tokens/{namespace}/reset',
  request: {
    params: z.object({ namespace: z.string() }),
    body: jsonContent(ResetNamespaceRequestSchema, 'Optional config overrides'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(ResetNamespaceResponseSchema, 'Namespace regenerated'),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(ErrorResponseSchema, 'Invalid namespace'),
  },
});
