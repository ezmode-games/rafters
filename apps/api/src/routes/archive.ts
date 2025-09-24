import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import Sqids from 'sqids';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

// Initialize SQIDS decoder
const sqids = new Sqids();

// SQID validation schema - must be a valid SQID that can be decoded
const sqidSchema = z.object({
  sqid: z
    .string()
    .min(1, 'SQID cannot be empty')
    .refine(
      (value) => {
        try {
          const decoded = sqids.decode(value);
          return decoded.length > 0; // Valid SQID should decode to array of numbers
        } catch {
          return false;
        }
      },
      { message: 'Invalid SQID format: must be a valid SQID' }
    ),
});

/**
 * GET /api/archive/:sqid
 * Serves design system archives as ZIP files
 *
 * SQID "000000" is reserved for the default system (decodes to [844596300])
 * This serves as a backup for CLI embedded archives
 * Custom SQIDs return 404 (future: database lookup)
 */
app.get('/:sqid', zValidator('param', sqidSchema), async (c) => {
  const { sqid } = c.req.valid('param');

  try {
    // Handle default system - "000000" is a valid SQID that decodes to [844596300]
    // We use it as a reserved identifier for the default design system
    if (sqid === '000000') {
      return c.json(
        {
          error: 'Archive generation not available',
          message:
            'ZIP generation not supported in Workers runtime. Please host pre-generated archive files.',
          sqid: '000000',
          requiredFiles: [
            'manifest.json',
            'colors.json',
            'typography.json',
            'spacing.json',
            'motion.json',
            'shadows.json',
            'borders.json',
            'breakpoints.json',
            'layout.json',
            'fonts.json',
          ],
        },
        501 // Not Implemented
      );
    }

    // Custom SQIDs not implemented yet - return 404
    return c.json(
      {
        error: 'Archive not found',
        message: `Archive with SQID "${sqid}" not found. Only default system (000000) is currently available.`,
      },
      404
    );
  } catch (error) {
    return c.json(
      {
        error: 'Archive generation failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      500
    );
  }
});

export { app as archive };
