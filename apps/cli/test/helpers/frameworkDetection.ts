/**
 * Framework detection utilities for integration tests
 *
 * Provides utilities to detect and validate framework types in test fixtures
 * and real project structures.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { FrameworkDetectionResult } from '../types.js';

/**
 * Detect the framework type of a project directory
 */
export function detectFramework(projectPath: string): FrameworkDetectionResult {
  const evidence: string[] = [];
  let framework: FrameworkDetectionResult['framework'] = 'unknown';
  let confidence = 0;

  // Check for Next.js
  if (
    existsSync(join(projectPath, 'next.config.js')) ||
    existsSync(join(projectPath, 'next.config.mjs')) ||
    existsSync(join(projectPath, 'next.config.ts'))
  ) {
    evidence.push('next.config found');
    framework = 'nextjs';
    confidence += 0.5;
  }

  // Check for Next.js app directory (root or src)
  if (existsSync(join(projectPath, 'app')) || existsSync(join(projectPath, 'src', 'app'))) {
    const packageJsonPath = join(projectPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.dependencies?.next) {
          evidence.push('Next.js dependency found');
          framework = 'nextjs';
          confidence += 0.4;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  // Check for Vite
  if (
    existsSync(join(projectPath, 'vite.config.js')) ||
    existsSync(join(projectPath, 'vite.config.ts')) ||
    existsSync(join(projectPath, 'vite.config.mjs'))
  ) {
    evidence.push('vite config found');
    if (framework === 'unknown') {
      framework = 'vite';
    }
    confidence += 0.4;
  }

  if (existsSync(join(projectPath, 'index.html'))) {
    evidence.push('index.html found (Vite pattern)');
    if (framework === 'unknown') {
      framework = 'vite';
    }
    confidence += 0.2;
  }

  // Check for React Router (more complex as it can use Vite)
  const packageJsonPath = join(projectPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      if (
        packageJson.dependencies?.['@remix-run/react'] ||
        packageJson.dependencies?.['react-router'] ||
        packageJson.dependencies?.['react-router-dom']
      ) {
        evidence.push('React Router dependencies found');
        if (framework === 'vite') {
          framework = 'react-router';
          confidence += 0.3;
        }
      }

      // Check for Vite dependency
      if (packageJson.devDependencies?.vite || packageJson.dependencies?.vite) {
        evidence.push('vite dependency found');
        if (framework === 'unknown') {
          framework = 'vite';
          confidence += 0.3;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Confidence adjustments
  if (evidence.length === 0) {
    confidence = 0;
  } else if (framework !== 'unknown') {
    confidence = Math.min(confidence, 1.0);
  }

  return {
    framework,
    confidence,
    evidence,
  };
}

/**
 * Validate that a detected framework matches the expected type
 */
export function validateFrameworkDetection(
  projectPath: string,
  expectedFramework: 'nextjs' | 'vite' | 'react-router' | 'unknown'
): { valid: boolean; detected: FrameworkDetectionResult; errors: string[] } {
  const detected = detectFramework(projectPath);
  const errors: string[] = [];

  // Handle special case: react-router projects may be detected as vite
  if (expectedFramework === 'react-router' && detected.framework === 'vite') {
    // Check if it's actually React Router using Vite
    const hasReactRouter = detected.evidence.some(
      (e) => e.includes('React Router') || e.includes('remix-run')
    );

    if (hasReactRouter) {
      detected.framework = 'react-router';
    } else {
      errors.push(
        `Expected React Router but detected ${detected.framework} ` +
          `(confidence: ${detected.confidence})`
      );
    }
  } else if (detected.framework !== expectedFramework) {
    errors.push(
      `Expected ${expectedFramework} but detected ${detected.framework} ` +
        `(confidence: ${detected.confidence})`
    );
  }

  // Confidence threshold validation
  if (expectedFramework !== 'unknown' && detected.confidence < 0.5) {
    errors.push(
      `Low confidence in framework detection: ${detected.confidence} (minimum 0.5 required)`
    );
  }

  return {
    valid: errors.length === 0,
    detected,
    errors,
  };
}

/**
 * Get expected file paths for a framework type
 */
export function getFrameworkPaths(
  framework: string,
  projectPath: string
): {
  configFiles: string[];
  srcDir: string;
  componentDir: string;
} {
  const paths = {
    configFiles: [] as string[],
    srcDir: '',
    componentDir: '',
  };

  switch (framework) {
    case 'nextjs':
      paths.configFiles = [
        join(projectPath, 'next.config.js'),
        join(projectPath, 'next.config.mjs'),
        join(projectPath, 'next.config.ts'),
      ];
      paths.srcDir = join(projectPath, 'src');
      paths.componentDir = join(projectPath, 'src', 'components', 'ui');
      break;

    case 'vite':
    case 'react-router':
      paths.configFiles = [
        join(projectPath, 'vite.config.js'),
        join(projectPath, 'vite.config.ts'),
        join(projectPath, 'vite.config.mjs'),
      ];
      paths.srcDir = join(projectPath, 'src');
      paths.componentDir = join(projectPath, 'src', 'components', 'ui');
      break;

    default:
      // Default paths for unknown frameworks
      paths.srcDir = join(projectPath, 'src');
      paths.componentDir = join(projectPath, 'src', 'components');
  }

  return paths;
}
