/**
 * Studio Vite Plugin - WebSocket bridge to TokenRegistry
 *
 * Handles two-phase color selection:
 * 1. Instant: color-utils data saved immediately (CSS updates, user sees changes)
 * 2. Complete: API enrichment arrives, save complete ColorValue to disk
 *
 * Use `persist: false` for instant feedback without disk write.
 * Use `persist: true` (default) when enrichment is complete.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NodePersistenceAdapter, registryToVars, TokenRegistry } from '@rafters/design-tokens';
import { ColorReferenceSchema, ColorValueSchema, TokenSchema } from '@rafters/shared';
import type { Plugin, ViteDevServer } from 'vite';
import { z } from 'zod';

// Response schemas
const TokenResponseSchema = z.object({
  ok: z.literal(true),
  token: TokenSchema,
});

const TokensResponseSchema = z.object({
  tokens: z.array(TokenSchema),
  initialized: z.boolean(),
});

const ErrorResponseSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});

const projectPath = process.env.RAFTERS_PROJECT_PATH || process.cwd();
const outputPath = join(projectPath, '.rafters', 'output', 'rafters.vars.css');

// Zod schema for incoming WebSocket messages
const SetTokenMessageSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), ColorValueSchema, ColorReferenceSchema]),
  persist: z.boolean().optional(),
});

// Schema for POST /api/tokens/:name - partial token update
// Derived from TokenSchema: value required, patchable fields optional
export const TokenPatchSchema = TokenSchema.pick({
  value: true,
  trustLevel: true,
  elevationLevel: true,
  motionIntent: true,
  accessibilityLevel: true,
  userOverride: true,
  description: true,
});

// Helper to read request body as JSON with size limit
const MAX_BODY_SIZE = 1024 * 1024; // 1MB limit

function readJsonBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error('Request body too large'));
        return;
      }
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export function studioApiPlugin(): Plugin {
  let registry: TokenRegistry;
  let initialized = false;

  return {
    name: 'rafters-studio-api',

    async configureServer(server: ViteDevServer) {
      // Initialize registry from persistence
      try {
        const adapter = new NodePersistenceAdapter(projectPath);
        const tokens = await adapter.load();
        registry = new TokenRegistry(tokens);
        registry.setAdapter(adapter);
        initialized = true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`[rafters] Failed to initialize: ${message}`);
        if (message.includes('ENOENT')) {
          console.log(`[rafters] No project found at ${projectPath}. Run 'rafters init' first.`);
        }
        // Create empty registry as fallback
        registry = new TokenRegistry([]);
        initialized = false;
      }

      // Change callback: regenerate CSS for HMR
      registry.setChangeCallback(async () => {
        try {
          await writeFile(outputPath, registryToVars(registry));
          server.ws.send({ type: 'custom', event: 'rafters:css-updated' });
        } catch (error) {
          console.log(`[rafters] CSS regeneration failed: ${error}`);
        }
      });

      // Listen for token updates from client
      server.ws.on('rafters:set-token', async (rawData: unknown, client) => {
        // Validate incoming message
        const parsed = SetTokenMessageSchema.safeParse(rawData);
        if (!parsed.success) {
          client.send('rafters:token-updated', {
            ok: false,
            error: `Invalid message: ${parsed.error.message}`,
          });
          return;
        }

        const data = parsed.data;
        const shouldPersist = data.persist !== false;

        try {
          if (shouldPersist) {
            // Full save: update + cascade + persist (callback handles CSS)
            await registry.set(data.name, data.value);
          } else {
            // Instant feedback: update in-memory only (callback handles CSS)
            registry.updateToken(data.name, data.value);
          }
          client.send('rafters:token-updated', {
            ok: true,
            name: data.name,
            persisted: shouldPersist,
          });
        } catch (error) {
          console.log(`[rafters] Token update failed for "${data.name}": ${error}`);
          client.send('rafters:token-updated', { ok: false, error: String(error) });
        }
      });

      // REST endpoints for token queries
      server.middlewares.use((req, res, next) => {
        // Parse pathname only (ignore query strings)
        let pathname: string;
        try {
          pathname = new URL(req.url ?? '', 'http://localhost').pathname;
        } catch {
          next();
          return;
        }

        // /api/tokens/:name - GET or POST specific token
        const tokenMatch = pathname.match(/^\/api\/tokens\/(.+)$/);
        if (tokenMatch) {
          let name: string;
          try {
            name = decodeURIComponent(tokenMatch[1]);
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Invalid token name encoding' }));
            return;
          }

          res.setHeader('Content-Type', 'application/json');

          // Only allow GET and POST methods
          if (req.method !== 'GET' && req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Allow', 'GET, POST');
            res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
            return;
          }

          // POST /api/tokens/:name - Update token with partial data
          if (req.method === 'POST') {
            (async () => {
              // Token must exist for update
              const existingToken = registry.get(name);
              if (!existingToken) {
                res.statusCode = 404;
                res.end(JSON.stringify({ ok: false, error: `Token "${name}" not found` }));
                return;
              }

              // Parse request body
              let body: unknown;
              try {
                body = await readJsonBody(req);
              } catch (error) {
                res.statusCode = 400;
                const message = error instanceof Error ? error.message : 'Invalid JSON body';
                res.end(JSON.stringify({ ok: false, error: message }));
                return;
              }

              // Validate patch data
              const patchResult = TokenPatchSchema.safeParse(body);
              if (!patchResult.success) {
                res.statusCode = 400;
                const issues = patchResult.error.issues;
                const message = issues[0]
                  ? `${issues[0].path.join('.') || 'value'}: ${issues[0].message}`
                  : patchResult.error.message;
                res.end(JSON.stringify({ ok: false, error: message }));
                return;
              }

              // Merge patch with existing token
              const mergedToken = {
                ...existingToken,
                ...patchResult.data,
              };

              // Validate merged token against full schema
              const tokenResult = TokenSchema.safeParse(mergedToken);
              if (!tokenResult.success) {
                res.statusCode = 400;
                const issues = tokenResult.error.issues;
                const message = issues[0]
                  ? `${issues[0].path.join('.') || 'token'}: ${issues[0].message}`
                  : tokenResult.error.message;
                res.end(JSON.stringify({ ok: false, error: message }));
                return;
              }

              // Update full token via registry (handles cascade + persist)
              try {
                await registry.setToken(tokenResult.data);
                const updatedToken = registry.get(name);
                const response = TokenResponseSchema.parse({ ok: true, token: updatedToken });
                res.end(JSON.stringify(response));
              } catch (error) {
                console.log(`[rafters] Token update failed for "${name}": ${error}`);
                res.statusCode = 500;
                res.end(JSON.stringify({ ok: false, error: String(error) }));
              }
            })();
            return;
          }

          // GET /api/tokens/:name - Get specific token
          const token = registry.get(name);

          if (!token) {
            const errorResponse = ErrorResponseSchema.parse({
              ok: false,
              error: `Token "${name}" not found`,
            });
            res.statusCode = 404;
            res.end(JSON.stringify(errorResponse));
            return;
          }

          // Validate token against schema before returning
          const tokenResult = TokenSchema.safeParse(token);
          if (!tokenResult.success) {
            console.log(
              `[rafters] Token "${name}" failed validation: ${tokenResult.error.message}`,
            );
            const errorResponse = ErrorResponseSchema.parse({
              ok: false,
              error: `Token "${name}" has invalid structure`,
            });
            res.statusCode = 500;
            res.end(JSON.stringify(errorResponse));
            return;
          }

          const response = TokenResponseSchema.parse({ ok: true, token: tokenResult.data });
          res.end(JSON.stringify(response));
          return;
        }

        // GET /api/tokens - List all tokens
        if (pathname === '/api/tokens') {
          try {
            const tokens = registry.list();
            const tokensResult = z.array(TokenSchema).safeParse(tokens);
            if (!tokensResult.success) {
              console.log(`[rafters] Tokens list failed validation: ${tokensResult.error.message}`);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Token validation failed' }));
              return;
            }

            const response = TokensResponseSchema.parse({
              tokens: tokensResult.data,
              initialized,
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          } catch (error) {
            console.log(`[rafters] Failed to list tokens: ${error}`);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'Failed to retrieve tokens' }));
          }
          return;
        }

        next();
      });
    },
  };
}
