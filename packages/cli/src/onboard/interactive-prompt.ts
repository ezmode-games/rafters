/**
 * Brand Import Interactive Prompt
 *
 * When the importer's brand-system classifier flags a multi-palette CSS
 * file (#1403), this module walks the user through three decisions before
 * the import lands:
 *
 *   1. Which palette family is PRIMARY?
 *   2. Are the others mutually-exclusive themes, or coexisting families?
 *   3. Should the default neutral semantic layer still apply on top?
 *
 * In non-interactive (agent) mode without a pre-baked decision, the
 * caller emits a structured `needsDecision` block describing what would
 * be asked, so the agent can re-run with `--assume-brand=...` after
 * deciding. This module exposes both the prompt walk and the
 * pre-baked-decision constructor so init and import share the same flow.
 */

import { confirm, select } from '@inquirer/prompts';
import type { PendingBrandSystem } from '@rafters/shared';

export type BrandMode = 'themes' | 'coexisting';

export interface BrandImportDecision {
  primary: string;
  mode: BrandMode;
  keepDefaultSemantics: boolean;
}

export interface BrandNeedsDecision {
  type: 'brand-needs-decision';
  message: string;
  palettes: string[];
  semanticSlots: string[];
  questions: Array<{
    key: 'primary' | 'mode' | 'keepDefaultSemantics';
    prompt: string;
    options: string[];
  }>;
}

/**
 * Build the agent-mode payload describing what would be asked. The agent
 * uses this to re-run with the appropriate `--assume-brand=...` flag.
 */
export function buildNeedsDecision(brandSystem: PendingBrandSystem): BrandNeedsDecision {
  return {
    type: 'brand-needs-decision',
    message: `Detected ${brandSystem.palettes.length} color palettes -- this is a brand system, not a token override. Re-run with --assume-brand=flat to skip, or --assume-brand=primary:<name> to pick a primary.`,
    palettes: brandSystem.palettes,
    semanticSlots: brandSystem.semanticSlots,
    questions: [
      {
        key: 'primary',
        prompt: 'Which palette is your primary brand color?',
        options: brandSystem.palettes,
      },
      {
        key: 'mode',
        prompt: 'Are the others mutually-exclusive themes or coexisting families?',
        options: ['themes', 'coexisting'],
      },
      {
        key: 'keepDefaultSemantics',
        prompt: 'Apply the default neutral semantic layer on top of your palettes?',
        options: ['yes', 'no'],
      },
    ],
  };
}

/**
 * Parse the `--assume-brand=...` flag. Returns a partial decision the
 * caller can merge with defaults; null when the flag is absent.
 *
 * Supported forms:
 *   --assume-brand=flat
 *       -> treat the palettes as flat colour families; no prompt, no
 *          primary selection, default semantics still apply.
 *   --assume-brand=primary:<name>
 *       -> pre-select the primary palette; everything else defaults
 *          (mode: coexisting, keepDefaultSemantics: true).
 */
export function parseAssumeBrand(value: string | undefined): BrandImportDecision | 'flat' | null {
  if (!value) return null;
  if (value === 'flat') return 'flat';

  const match = value.match(/^primary:([\w-]+)$/);
  if (!match || !match[1]) {
    throw new Error(
      `Unrecognised --assume-brand value "${value}". Expected "flat" or "primary:<palette-name>".`,
    );
  }
  return {
    primary: match[1],
    mode: 'coexisting',
    keepDefaultSemantics: true,
  };
}

/**
 * Walk the user through the three brand questions interactively.
 * Throws on Ctrl-C / Esc (`ExitPromptError` from @inquirer/prompts) so
 * the caller can map that to "declined" and exit cleanly.
 */
export async function promptBrandImport(
  brandSystem: PendingBrandSystem,
): Promise<BrandImportDecision> {
  if (brandSystem.palettes.length === 0) {
    throw new Error(
      'promptBrandImport requires at least one detected palette; got an empty brandSystem.',
    );
  }

  const primary = await select({
    message: `Detected ${brandSystem.palettes.length} color palettes. Which is your PRIMARY brand color?`,
    choices: brandSystem.palettes.map((name) => ({ name, value: name })),
  });

  const mode = await select<BrandMode>({
    message:
      'Are the other palettes (a) themes -- mutually exclusive at runtime, designer picks one -- or (b) coexisting -- all available, semantic tokens may reference any?',
    choices: [
      { name: 'themes (mutually exclusive)', value: 'themes' },
      { name: 'coexisting (all available)', value: 'coexisting' },
    ],
  });

  const keepDefaultSemantics = await confirm({
    message:
      'Apply the default neutral semantic layer (background, foreground, muted, ...) on top of your palettes?',
    default: true,
  });

  return { primary, mode, keepDefaultSemantics };
}
