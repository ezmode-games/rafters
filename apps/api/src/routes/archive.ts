import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

// SQID validation schema - 6-8 alphanumeric characters
const sqidSchema = z.object({
  sqid: z
    .string()
    .regex(/^[A-Za-z0-9]{6,8}$/, 'Invalid SQID format: must be 6-8 alphanumeric characters'),
});

/**
 * GET /api/archive/:sqid
 * Serves design system archives as ZIP files
 *
 * SQID "000000" serves default system as backup for CLI embedded archive
 * Custom SQIDs return 404 (future: database lookup)
 */
app.get('/:sqid', zValidator('param', sqidSchema), async (c) => {
  const { sqid } = c.req.valid('param');

  try {
    // Handle default system (backup for CLI embedded archive)
    if (sqid === '000000') {
      return c.json(
        {
          error: 'Archive generation not available',
          message: 'ZIP generation not supported in Workers runtime. Please host pre-generated archive files.',
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
            'fonts.json'
          ]
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
