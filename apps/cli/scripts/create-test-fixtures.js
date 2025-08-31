#!/usr/bin/env node

/**
 * Creates test fixture apps using real-world generators
 *
 * This script generates actual Next.js, React Router 7, and Vite apps
 * that people would create in the wild, so our integration tests
 * run against realistic project structures.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FIXTURES_DIR = join(process.cwd(), 'test', 'fixtures');

console.log('🏗️  Creating CLI integration test fixtures...\n');

// Clean and recreate fixtures directory
if (existsSync(FIXTURES_DIR)) {
  console.log('🧹 Cleaning existing fixtures...');
  rmSync(FIXTURES_DIR, { recursive: true, force: true });
}
mkdirSync(FIXTURES_DIR, { recursive: true });

/**
 * Create Next.js app using create-next-app (what users actually run)
 */
function createNextjsApp() {
  console.log('📦 Creating Next.js app fixture...');

  const appPath = join(FIXTURES_DIR, 'nextjs-app');

  // Use exact command users run, with TypeScript + Tailwind (most common setup)
  execSync(
    'npx create-next-app@latest nextjs-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"',
    {
      cwd: FIXTURES_DIR,
      stdio: 'inherit',
    }
  );

  // Add a gitignore for .rafters (integration test artifacts)
  const gitignorePath = join(appPath, '.gitignore');
  const gitignoreContent = `
# Rafters CLI test artifacts
.rafters/
`;
  execSync(`echo "${gitignoreContent}" >> ${gitignorePath}`);

  console.log('✅ Next.js fixture created\n');
}

/**
 * Create React Router 7 app using their official generator
 */
function createReactRouter7App() {
  console.log('🛣️  Creating React Router 7 app fixture...');

  // React Router 7 is the latest - use their official generator
  execSync('npx create-react-router@latest rr7-app --template basic --typescript', {
    cwd: FIXTURES_DIR,
    stdio: 'inherit',
  });

  const appPath = join(FIXTURES_DIR, 'rr7-app');

  // Add Tailwind since that's what most people add
  execSync('npm install -D tailwindcss postcss autoprefixer', {
    cwd: appPath,
    stdio: 'inherit',
  });

  execSync('npx tailwindcss init -p', {
    cwd: appPath,
    stdio: 'inherit',
  });

  console.log('✅ React Router 7 fixture created\n');
}

/**
 * Create Vite + React app using create-vite (super popular)
 */
function createViteReactApp() {
  console.log('⚡ Creating Vite + React app fixture...');

  // Use create-vite with React + TypeScript template (most common)
  execSync('npm create vite@latest vite-react -- --template react-ts', {
    cwd: FIXTURES_DIR,
    stdio: 'inherit',
  });

  const appPath = join(FIXTURES_DIR, 'vite-react');

  // Install dependencies
  execSync('npm install', {
    cwd: appPath,
    stdio: 'inherit',
  });

  // Add Tailwind (very common with Vite)
  execSync('npm install -D tailwindcss postcss autoprefixer', {
    cwd: appPath,
    stdio: 'inherit',
  });

  execSync('npx tailwindcss init -p', {
    cwd: appPath,
    stdio: 'inherit',
  });

  console.log('✅ Vite + React fixture created\n');
}

/**
 * Create minimal package.json only project (edge case testing)
 */
function createEmptyProject() {
  console.log('📄 Creating empty project fixture...');

  const appPath = join(FIXTURES_DIR, 'empty-project');
  mkdirSync(appPath);

  // Just a basic package.json - tests edge cases
  const packageJson = {
    name: 'empty-test-project',
    version: '1.0.0',
    private: true,
    type: 'module',
  };

  writeFileSync(join(appPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  console.log('✅ Empty project fixture created\n');
}

/**
 * Create all fixtures
 */
async function createAllFixtures() {
  try {
    createNextjsApp();
    createReactRouter7App();
    createViteReactApp();
    createEmptyProject();

    console.log('🎉 All test fixtures created successfully!');
    console.log(`📁 Fixtures location: ${FIXTURES_DIR}`);
    console.log('\n💡 Run integration tests with: pnpm test:integration');
  } catch (error) {
    console.error('❌ Failed to create fixtures:', error.message);
    process.exit(1);
  }
}

// Run it
createAllFixtures();
