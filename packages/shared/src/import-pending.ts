/**
 * Import Pending Schema
 *
 * Stores tokens detected during `rafters init --onboard` or `rafters import`
 * that are awaiting user review. Written to `.rafters/import-pending.json`
 * after detection, consumed by CLI prompts and Studio review UI.
 *
 * Each entry captures:
 *   - The original source variable (name, value, file location)
 *   - The proposed Rafters token after mapping
 *   - User decision (pending, accepted, rejected, modified)
 *   - Confidence and rationale so the user understands the mapping
 */

import { z } from 'zod';
import { TokenSchema } from './types';

/**
 * Decision state for a pending import token.
 * Defaults to "pending" until the user reviews.
 */
export const ImportDecisionSchema = z.enum(['pending', 'accepted', 'rejected', 'modified']);

/**
 * Original source variable as parsed from the user's project
 */
export const ImportOriginalSchema = z
  .object({
    /** Original variable name (e.g., "--color-primary") */
    name: z.string(),
    /** Original value as written in source (e.g., "oklch(0.7 0.15 250)") */
    value: z.string(),
    /** Source file path relative to project root */
    source: z.string(),
    /** Line number where the variable was declared */
    line: z.number().int().positive().optional(),
    /** Column number where the variable was declared */
    column: z.number().int().positive().optional(),
  })
  .strict();

/**
 * User modifications to a proposed token.
 * Must change at least one field -- empty modifications are rejected.
 */
export const ImportModificationsSchema = z
  .object({
    name: z.string().optional(),
    value: z.string().optional(),
    category: z.string().optional(),
    namespace: z.string().optional(),
  })
  .strict()
  .refine((m) => Object.values(m).some((v) => v !== undefined), {
    message: 'modifications must change at least one field',
  });

/**
 * A single token pending user review.
 *
 * Invariants enforced:
 *   - decision === 'modified' <=> modifications is present
 *   - modifications must change at least one field (see ImportModificationsSchema)
 */
export const PendingTokenSchema = z
  .object({
    /** Original token from source */
    original: ImportOriginalSchema,

    /** Proposed Rafters token (full Token schema) */
    proposed: TokenSchema,

    /** User decision -- pending until reviewed */
    decision: ImportDecisionSchema.default('pending'),

    /** User edits when decision is "modified" */
    modifications: ImportModificationsSchema.optional(),

    /** Detection confidence 0-1 */
    confidence: z.number().min(0).max(1),

    /** Why this mapping was proposed (e.g., "Tailwind --color-primary maps to primary-500") */
    rationale: z.string().optional(),
  })
  .strict()
  .superRefine((t, ctx) => {
    if (t.decision === 'modified' && !t.modifications) {
      ctx.addIssue({
        code: 'custom',
        message: "decision is 'modified' but modifications are missing",
        path: ['modifications'],
      });
    }
    if (t.decision !== 'modified' && t.modifications) {
      ctx.addIssue({
        code: 'custom',
        message: `modifications only allowed when decision is 'modified' (got '${t.decision}')`,
        path: ['modifications'],
      });
    }
  });

/**
 * A single step in a detected color palette.
 *
 * Each step carries both the original source variable (so the user can audit
 * where the value came from) and the proposed Rafters token (so accepting the
 * palette can materialize tokens directly). Position is the Tailwind scale
 * stop the variable occupies in its source CSS.
 */
export const PendingPaletteStepSchema = z
  .object({
    /** Tailwind scale position: "50", "100", ..., "900", "950" */
    position: z.string(),

    /** Original source variable */
    original: ImportOriginalSchema,

    /** Proposed Rafters token for this step */
    proposed: TokenSchema,
  })
  .strict();

/**
 * A color palette recovered by the ramp detector. Replaces what would
 * otherwise be N flat PendingTokens for the same family.
 *
 * Invariants enforced:
 *   - decision === 'modified' is not allowed at the palette level (#1402
 *     leaves per-step editing to the existing tokens[] flow)
 */
export const PendingPaletteSchema = z
  .object({
    /** Palette family name (e.g. "empire") -- the var-name prefix shared by every step */
    name: z.string(),

    /** Detected scale type. Only Tailwind is supported in #1402. */
    scale: z.literal('tailwind'),

    /** Source file path relative to project root */
    source: z.string(),

    /** Ramp steps ordered ascending by Tailwind position */
    steps: z.array(PendingPaletteStepSchema).min(2),

    /** User decision -- pending until reviewed. Applies to the whole palette. */
    decision: z.enum(['pending', 'accepted', 'rejected']).default('pending'),

    /** Detection confidence 0-1 */
    confidence: z.number().min(0).max(1),

    /** Optional rationale for why this was grouped as a palette */
    rationale: z.string().optional(),
  })
  .strict();

/**
 * Brand system signal emitted by the importer when source CSS encodes
 * multiple complete color palettes (#1403). Consumers (init, Studio) read
 * this to know whether to pause default semantic assignment and prompt
 * the user instead of silently letting the default neutral layer win.
 */
export const PendingBrandSystemSchema = z
  .object({
    /** True when the brand-system threshold (>= 2 palettes) was reached. */
    detected: z.boolean(),
    /** Palette family names participating in the brand system. */
    palettes: z.array(z.string()),
    /**
     * Token names matching the common semantic vocabulary (primary,
     * accent, background, etc.) found in the same import. Surfaces what
     * the user has the option to keep, edit, or replace.
     */
    semanticSlots: z.array(z.string()),
  })
  .strict();

/**
 * Import-pending document written to `.rafters/import-pending.json`
 */
export const ImportPendingSchema = z
  .object({
    /** Schema version for future migrations */
    version: z.literal('1.0'),

    /** ISO-8601 timestamp when the import was detected */
    createdAt: z.string().datetime(),

    /** Which importer produced this pending list (e.g., "tailwind-v4", "shadcn") */
    detectedSystem: z.string(),

    /** Confidence that the detected system is correct */
    systemConfidence: z.number().min(0).max(1),

    /** Primary source file path (relative to project root) */
    source: z.string(),

    /** Additional source paths if more than one file was imported */
    additionalSources: z.array(z.string()).optional(),

    /** Warnings from the import process (parse issues, dedup skips, etc.) */
    warnings: z
      .array(
        z
          .object({
            level: z.enum(['info', 'warning', 'error']),
            message: z.string(),
          })
          .strict(),
      )
      .optional(),

    /** Tokens awaiting review */
    tokens: z.array(PendingTokenSchema),

    /**
     * Color palettes recovered from CSS ramps (e.g. --empire-50 ... --empire-950).
     * Tokens emitted as part of a palette do NOT appear in `tokens` -- the
     * palette is the source of truth for the family.
     */
    palettes: z.array(PendingPaletteSchema).optional(),

    /**
     * Brand-system signal (#1403). Present when the importer ran the
     * classifier; `detected: true` means downstream consumers should
     * prompt the user before applying default semantics.
     */
    brandSystem: PendingBrandSystemSchema.optional(),
  })
  .strict();

export type ImportDecision = z.infer<typeof ImportDecisionSchema>;
export type ImportOriginal = z.infer<typeof ImportOriginalSchema>;
export type ImportModifications = z.infer<typeof ImportModificationsSchema>;
export type PendingToken = z.infer<typeof PendingTokenSchema>;
export type PendingPaletteStep = z.infer<typeof PendingPaletteStepSchema>;
export type PendingPalette = z.infer<typeof PendingPaletteSchema>;
export type PendingBrandSystem = z.infer<typeof PendingBrandSystemSchema>;
export type ImportPending = z.infer<typeof ImportPendingSchema>;
