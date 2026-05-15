/**
 * rafters set
 *
 * Sets a token's value. Every change is a diary entry -- the previous value
 * and the reason are recorded as `userOverride`, and downstream cascade fires
 * via plugin bindings so dependents re-derive against the new value.
 *
 * userOverride is metadata describing the change. It is also the anchor that
 * blocks future upstream cascades from clobbering this node's value -- the
 * downstream subtree keeps re-deriving from the override as its new root.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { input } from '@inquirer/prompts';
import {
  contrastPlugin,
  invertPlugin,
  loadRegistryFromDir,
  saveRegistryToDir,
  scalePlugin,
  statePlugin,
} from '@rafters/design-tokens';
import { ColorReferenceSchema, ColorValueSchema } from '@rafters/shared';
import { z } from 'zod';
import { isAgentMode, log, setAgentMode } from '../utils/ui.js';

const TokenValueSchema = z.union([z.string(), ColorValueSchema, ColorReferenceSchema]);
type TokenValue = z.infer<typeof TokenValueSchema>;

export interface SetOptions {
  reason?: string;
  raftersDir?: string;
  agent?: boolean;
}

export async function set(name: string, value: string, options: SetOptions): Promise<void> {
  setAgentMode(options.agent ?? false);

  const dir = resolve(options.raftersDir ?? '.rafters/tokens');
  if (!existsSync(dir)) {
    throw new Error(`tokens directory not found: ${dir}`);
  }

  let reason = options.reason;
  if (!reason) {
    if (isAgentMode()) {
      throw new Error('rafters set requires --reason in agent mode');
    }
    reason = await input({
      message: 'Reason for this change (recorded with userOverride):',
      validate: (v) => (v.trim().length > 0 ? true : 'A reason is required'),
    });
  }

  const parsedValue = parseValue(value);
  const registry = loadRegistryFromDir(dir, [
    scalePlugin,
    contrastPlugin,
    invertPlugin,
    statePlugin,
  ]);
  if (!registry.has(name)) {
    throw new Error(`token "${name}" not found in ${dir}`);
  }

  const previous = registry.get(name)?.value;
  registry.set(name, parsedValue, { reason });
  saveRegistryToDir(dir, registry);

  log({
    event: 'token.set',
    name,
    previous,
    next: parsedValue,
    reason,
  });
}

function parseValue(raw: string): TokenValue {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const result = TokenValueSchema.safeParse(parsed);
      if (result.success) return result.data;
    } catch {
      // fall through to string
    }
  }
  return raw;
}
