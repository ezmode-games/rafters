/**
 * Smoke: invoke detectProject on every fixture and print what it returns.
 * Not a test -- a real execution of the production function over real
 * fixture directories so we can read the records by eye.
 */

import { detectProject } from '../src/utils/detect.js';
import { ALL_FIXTURE_TYPES, cleanupFixture, createFixture } from '../test/fixtures/projects.js';

async function main(): Promise<void> {
  for (const type of ALL_FIXTURE_TYPES) {
    const path = await createFixture(type);
    try {
      const result = await detectProject(path);
      console.log(`\n=== ${type} ===`);
      console.log(`  path           ${path}`);
      console.log(`  framework      ${result.framework}`);
      console.log(`  tailwindVer    ${result.tailwindVersion}`);
      console.log(`  shadcn         ${result.shadcn ? JSON.stringify(result.shadcn) : 'null'}`);
      console.log(`  astroHasReact  ${result.astroHasReact}`);
      console.log(`  cssPath        ${result.cssPath}`);
    } finally {
      await cleanupFixture(path);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
