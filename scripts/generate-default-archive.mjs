import { generateAllTokens } from '../packages/design-tokens/src/index.ts';
import JSZip from 'jszip';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

async function createDefaultArchive() {
  try {
    console.log('Generating default tokens...');
    const tokens = await generateAllTokens();
    console.log(`Generated ${tokens.length} tokens`);

    const zip = new JSZip();

    // Group tokens by category
    const tokensByCategory = {};
    for (const token of tokens) {
      if (!tokensByCategory[token.category]) {
        tokensByCategory[token.category] = [];
      }
      tokensByCategory[token.category].push(token);
    }

    console.log(`Grouped into ${Object.keys(tokensByCategory).length} categories`);

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

    // Create required JSON files
    const requiredFiles = [
      'colors.json', 'typography.json', 'spacing.json', 'motion.json',
      'shadows.json', 'borders.json', 'breakpoints.json', 'layout.json', 'fonts.json'
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
      console.log(`Added ${filename} with ${categoryTokens.length} tokens`);
    }

    console.log('Generating ZIP file...');
    const content = await zip.generateAsync({type: 'nodebuffer'});

    const outputPath = join(process.cwd(), 'apps/api/src/assets/rafters-000000.zip');
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content);

    console.log(`✅ Created default archive: ${outputPath}`);
    console.log(`📦 Archive size: ${Math.round(content.length / 1024)}KB`);
  } catch (error) {
    console.error('❌ Failed to create archive:', error);
    process.exit(1);
  }
}

createDefaultArchive();