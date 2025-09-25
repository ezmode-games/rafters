#!/usr/bin/env node

/**
 * Environment Validation Script
 * Ensures consistent runtime environment across local, CI, and deployment
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import process from 'node:process';

const CONFIG_FILE = 'package.json';
const REQUIRED_ENV_VARS = {
  development: [],
  test: ['NODE_ENV', 'CI'],
  production: ['NODE_ENV', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'],
};

class EnvironmentValidator {
  constructor() {
    this.config = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    this.currentEnv = process.env.NODE_ENV || 'development';
    this.errors = [];
    this.warnings = [];
  }

  validateNodeVersion() {
    const expectedNode = this.config.engines.node;
    const currentNode = process.version;

    // Exact version matching for production environments
    if (process.env.CI || this.currentEnv === 'production') {
      if (currentNode !== `v${expectedNode}`) {
        this.errors.push(`Node.js version mismatch: expected v${expectedNode}, got ${currentNode}`);
      }
    } else if (!currentNode.startsWith(`v${expectedNode.split('.')[0]}`)) {
      this.warnings.push(
        `Node.js major version mismatch: expected v${expectedNode}, got ${currentNode}`
      );
    }
  }

  validatePnpmVersion() {
    try {
      const expectedPnpm = this.config.engines.pnpm;
      const currentPnpm = execSync('pnpm --version', { encoding: 'utf8' }).trim();

      if (currentPnpm !== expectedPnpm) {
        this.errors.push(`pnpm version mismatch: expected ${expectedPnpm}, got ${currentPnpm}`);
      }
    } catch (_error) {
      this.errors.push('pnpm not installed or not in PATH');
    }
  }

  validateTypeScriptVersion() {
    try {
      const expectedTS = this.config.devDependencies.typescript.replace('^', '');
      const currentTS = execSync('npx tsc --version', { encoding: 'utf8' })
        .replace('Version ', '')
        .trim();

      if (!currentTS.startsWith(expectedTS.split('.')[0])) {
        this.warnings.push(
          `TypeScript major version mismatch: expected ${expectedTS}, got ${currentTS}`
        );
      }
    } catch (_error) {
      this.warnings.push('Could not validate TypeScript version');
    }
  }

  validateEnvironmentVariables() {
    const requiredVars = REQUIRED_ENV_VARS[this.currentEnv] || [];

    for (const envVar of requiredVars) {
      if (!process.env[envVar]) {
        if (this.currentEnv === 'production') {
          this.errors.push(`Missing required environment variable: ${envVar}`);
        } else {
          this.warnings.push(`Missing environment variable: ${envVar}`);
        }
      }
    }
  }

  validateWorkspaceIntegrity() {
    try {
      // Check if pnpm-workspace.yaml exists and workspace is properly configured
      execSync('pnpm list --recursive --depth=0', {
        stdio: 'pipe',
        encoding: 'utf8',
      });
    } catch (_error) {
      this.errors.push('Workspace integrity check failed - run `pnpm install`');
    }
  }

  generateReport() {
    console.log('🔍 Environment Validation Report');
    console.log('================================\n');

    console.log(`Environment: ${this.currentEnv}`);
    console.log(`Node.js: ${process.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);
    console.log(`CI: ${process.env.CI ? 'Yes' : 'No'}\n`);

    if (this.errors.length > 0) {
      console.log('ERRORS (must fix):');
      this.errors.forEach((error) => {
        console.log(`  • ${error}`);
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('WARNINGS (should fix):');
      this.warnings.forEach((warning) => {
        console.log(`  • ${warning}`);
      });
      console.log('');
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('All environment checks passed!');
    }

    return this.errors.length === 0;
  }

  async validate() {
    this.validateNodeVersion();
    this.validatePnpmVersion();
    this.validateTypeScriptVersion();
    this.validateEnvironmentVariables();
    this.validateWorkspaceIntegrity();

    const success = this.generateReport();
    process.exit(success ? 0 : 1);
  }
}

const validator = new EnvironmentValidator();
validator.validate();
