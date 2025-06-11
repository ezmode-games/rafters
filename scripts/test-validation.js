#!/usr/bin/env node

/**
 * Test the design system validation
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DesignSystemValidator } from './validate-design-system.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create test files
const testDir = path.join(__dirname, 'test-validation');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// Test file with violations
const violationFile = path.join(testDir, 'violations.tsx');
fs.writeFileSync(
  violationFile,
  `
// This file has violations
const MyComponent = () => {
  return (
    <div style={{ color: '#ff0000', margin: '20px' }}>
      <h1>✅ This is awesome!</h1>
      <p>This is pretty cool stuff</p>
    </div>
  );
};
`
);

// Test file without violations
const cleanFile = path.join(testDir, 'clean.tsx');
fs.writeFileSync(
  cleanFile,
  `
// This file is clean
const MyComponent = () => {
  return (
    <div className="text-primary space-phi-2">
      <h1 className="heading-section">Professional Design</h1>
      <p className="text-body">This follows design system principles</p>
    </div>
  );
};
`
);

console.log('Testing design system validation...');

// Test individual file validation
const validator = new DesignSystemValidator();

console.log('\n1. Testing violation detection:');
await validator.validateFile(violationFile);
console.log(`Found ${validator.errors.length} violations (expected: 4)`);

// Reset for clean file test
validator.errors = [];

console.log('\n2. Testing clean file:');
await validator.validateFile(cleanFile);
console.log(`Found ${validator.errors.length} violations (expected: 0)`);

// Clean up
fs.rmSync(testDir, { recursive: true, force: true });

console.log('\nValidation script test completed!');
