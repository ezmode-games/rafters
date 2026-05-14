/**
 * rafters set
 *
 * Sets a token value in the registry. By default, cascades to dependent tokens.
 * With --no-cascade, records the value as a userOverride anchor — the token is
 * marked as a designer deviation and is skipped by future cascades.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { input } from '@inquirer/prompts';
import { loadRegistryFromDir, saveRegistryToDir } from '@rafters/design-tokens';
import { ColorReferenceSchema, ColorValueSchema } from '@rafters/shared';
import { z } from 'zod';
import { isAgentMode, log, setAgentMode } from '../utils/ui.js';

const TokenValueSchema = z.union([z.string(), ColorValueSchema, ColorReferenceSchema]);
type TokenValue = z.infer<typeof TokenValueSchema>;

export interface SetOptions {
  noCascade?: boolean;
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

  const cascade = !options.noCascade;
  let reason = options.reason;
  if (!cascade && !reason) {
    if (isAgentMode()) {
      throw new Error('--no-cascade requires --reason in agent mode');
    }
    reason = await input({
      message: 'Reason for this override (recorded with the userOverride):',
      validate: (v) => (v.trim().length > 0 ? true : 'A reason is required'),
    });
  }

  const parsedValue = parseValue(value);
  const registry = loadRegistryFromDir(dir);
  if (!registry.has(name)) {
    throw new Error(`token "${name}" not found in ${dir}`);
  }

  const previous = registry.get(name)?.value;
  if (cascade) {
    registry.set(name, parsedValue);
  } else if (reason) {
    registry.set(name, parsedValue, { cascade: false, reason });
  }
  saveRegistryToDir(dir, registry);

  log({
    event: cascade ? 'token.set' : 'token.override',
    name,
    previous,
    next: parsedValue,
    cascade,
    ...(reason ? { reason } : {}),
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
