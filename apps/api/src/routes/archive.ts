import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

// SQID validation schema - 6-8 alphanumeric characters
const sqidSchema = z.object({
  sqid: z.string().regex(/^[A-Za-z0-9]{6,8}$/, 'Invalid SQID format: must be 6-8 alphanumeric characters'),
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
      const zipBuffer = await generateDefaultArchive();

      return c.body(zipBuffer, 200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="rafters-${sqid}.zip"`,
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
      });
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

/**
 * Generates the default design system archive (SQID 000000)
 * Uses the same generation logic as CLI embedded archive
 */
async function generateDefaultArchive(): Promise<ArrayBuffer> {
  // Import design-tokens package for archive generation
  const { generateAllTokens } = await import('@rafters/design-tokens');
  const JSZip = await import('jszip');

  // Generate default tokens
  const tokens = await generateAllTokens();

  // Create ZIP manually since DesignSystemArchive doesn't have generateZipBuffer
  const zip = new JSZip.default();

  // Group tokens by category for archive structure
  const tokensByCategory: Record<string, typeof tokens> = {};
  for (const token of tokens) {
    if (!tokensByCategory[token.category]) {
      tokensByCategory[token.category] = [];
    }
    tokensByCategory[token.category].push(token);
  }

  // Create manifest.json
  const manifest = {
    id: '000000',
    name: 'Default Rafters System',
    version: '1.0.0',
    description: 'Default design system with embedded AI intelligence',
    generatedAt: new Date().toISOString(),
    tokenCount: tokens.length,
    categories: Object.keys(tokensByCategory),
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Create required JSON files with tokens
  const requiredFiles = [
    'colors.json',
    'typography.json',
    'spacing.json',
    'motion.json',
    'shadows.json',
    'borders.json',
    'breakpoints.json',
    'layout.json',
    'fonts.json',
  ];

  for (const filename of requiredFiles) {
    const category = filename.replace('.json', '');
    const categoryTokens = tokensByCategory[category] || [];

    const fileData = {
      category,
      tokens: categoryTokens,
      generatedAt: new Date().toISOString(),
    };

    zip.file(filename, JSON.stringify(fileData, null, 2));
  }

  // Generate ZIP buffer
  const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  return zipBuffer;
}

export { app as archive };