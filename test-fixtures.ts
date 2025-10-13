/**
 * Test file to validate zod-schema-faker with our schemas
 * Run: pnpm exec tsx test-fixtures.ts
 */

import { faker } from '@faker-js/faker';
import { setFaker, fake } from 'zod-schema-faker';
import { z } from 'zod/index.cjs';
import { ComponentManifestSchema, PreviewSchema } from './packages/shared/src/types.js';

// Configure faker instance
setFaker(faker);

// Test 1: Simple schema
console.log('Test 1: Simple Schema');
const SimpleSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const simpleData = fake(SimpleSchema);
console.log('✓ Simple schema:', JSON.stringify(simpleData, null, 2));

// Test 2: PreviewSchema
console.log('\nTest 2: PreviewSchema');
try {
  const previewData = fake(PreviewSchema);
  console.log('✓ PreviewSchema:', JSON.stringify(previewData, null, 2));
} catch (error) {
  console.error('✗ PreviewSchema failed:', error);
}

// Test 3: ComponentManifestSchema (complex nested schema)
console.log('\nTest 3: ComponentManifestSchema');
try {
  const manifestData = fake(ComponentManifestSchema);
  console.log('✓ ComponentManifestSchema:', JSON.stringify(manifestData, null, 2));

  // Validate the generated data
  const validated = ComponentManifestSchema.parse(manifestData);
  console.log('✓ Validation passed');
} catch (error) {
  console.error('✗ ComponentManifestSchema failed:', error);
}

console.log('\n✓ All tests completed');
