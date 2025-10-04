#!/usr/bin/env tsx

/**
 * Generate static fixture projects for integration tests
 * Run with: pnpm tsx scripts/generate-fixtures.ts
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProjectFactory } from '../test/integration/factories/project.factory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURES_DIR = join(__dirname, '../test/fixtures/apps');

async function generateFixtures() {
  console.log('🔨 Generating fixture projects...\n');

  const fixtures = [
    { framework: 'nextjs-app' as const, withTailwind: true },
    { framework: 'vite-react' as const, withTailwind: true },
    { framework: 'react-router' as const, withTailwind: true },
    { framework: 'astro' as const, withTailwind: true },
  ];

  for (const { framework, withTailwind } of fixtures) {
    const fixtureName = `${framework}${withTailwind ? '-tw' : ''}`;
    const fixturePath = join(FIXTURES_DIR, fixtureName);

    console.log(`📦 Creating ${fixtureName}...`);

    // Use scaffolding methods directly
    await ProjectFactory.scaffoldFramework(framework, fixturePath, 'pnpm', withTailwind);

    console.log(`✅ Created ${fixtureName}\n`);
  }

  console.log('🎉 All fixtures generated successfully!');
  console.log(`📁 Location: ${FIXTURES_DIR}`);
}

generateFixtures().catch((error) => {
  console.error('❌ Error generating fixtures:', error);
  process.exit(1);
});
