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
import { ColorReferenceSchema, ColorValueSchema } from '@rafters/shared';
import type { Plugin, ViteDevServer } from 'vite';
import { z } from 'zod';

const projectPath = process.env.RAFTERS_PROJECT_PATH || process.cwd();
const outputPath = join(projectPath, '.rafters', 'output', 'rafters.vars.css');

// Zod schema for incoming WebSocket messages
const SetTokenMessageSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), ColorValueSchema, ColorReferenceSchema]),
  persist: z.boolean().optional(),
});

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

      // Endpoint to get current tokens (REST fallback)
      server.middlewares.use('/api/tokens', (_req, res) => {
        try {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ tokens: registry.list(), initialized }));
        } catch (error) {
          console.log(`[rafters] Failed to list tokens: ${error}`);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to retrieve tokens' }));
        }
      });
    },
  };
}
