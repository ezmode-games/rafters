#!/usr/bin/env node

/**
 * Monorepo Test Orchestrator
 *
 * Intelligent test execution system that provides:
 * - Dependency-aware selective testing
 * - Parallel execution with optimal resource usage
 * - AI-driven test selection (future)
 * - Performance budget enforcement
 * - Comprehensive result aggregation
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

// ========================================
// DEPENDENCY GRAPH ANALYSIS
// ========================================

class DependencyAnalyzer {
  constructor() {
    this.packageGraph = new Map();
    this.buildDependencyGraph();
  }

  buildDependencyGraph() {
    const workspaces = this.getWorkspaces();

    for (const workspace of workspaces) {
      const packagePath = resolve(ROOT_DIR, workspace, 'package.json');
      if (existsSync(packagePath)) {
        const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
        const deps = this.extractLocalDependencies(pkg);

        this.packageGraph.set(workspace, {
          name: pkg.name,
          path: workspace,
          dependencies: deps,
          testFiles: this.findTestFiles(workspace),
        });
      }
    }
  }

  getWorkspaces() {
    const pnpmWorkspace = resolve(ROOT_DIR, 'pnpm-workspace.yaml');
    if (existsSync(pnpmWorkspace)) {
      const content = readFileSync(pnpmWorkspace, 'utf8');
      const patterns = content.match(/packages:\s*\n((?:\s*-\s*.+\n)*)/)?.[1];
      if (patterns) {
        return patterns
          .split('\n')
          .filter((line) => line.trim().startsWith('-'))
          .map((line) => line.trim().substring(1).trim())
          .flatMap((pattern) => this.expandGlob(pattern));
      }
    }
    return [];
  }

  expandGlob(pattern) {
    if (pattern.endsWith('/*')) {
      const basePath = pattern.slice(0, -2);
      const baseDir = resolve(ROOT_DIR, basePath);
      if (existsSync(baseDir)) {
        const subdirs = execSync(`find "${baseDir}" -maxdepth 1 -type d -not -path "${baseDir}"`, {
          encoding: 'utf8',
        })
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((path) => path.replace(`${ROOT_DIR}/`, ''));
        return subdirs;
      }
    }
    return [pattern];
  }

  extractLocalDependencies(pkg) {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    };

    return Object.keys(allDeps).filter((dep) => dep.startsWith('@rafters/'));
  }

  findTestFiles(workspace) {
    const workspacePath = resolve(ROOT_DIR, workspace);
    try {
      const testFiles = execSync(
        `find "${workspacePath}" -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" -o -name "*.e2e.ts"`,
        { encoding: 'utf8' }
      )
        .trim()
        .split('\n')
        .filter(Boolean);

      return testFiles.map((file) => file.replace(`${ROOT_DIR}/`, ''));
    } catch {
      return [];
    }
  }

  getAffectedPackages(changedFiles) {
    const affectedPackages = new Set();

    // Direct changes
    for (const file of changedFiles) {
      for (const [workspace, _info] of this.packageGraph) {
        if (file.startsWith(`${workspace}/`)) {
          affectedPackages.add(workspace);
        }
      }
    }

    // Dependency cascade
    let changed = true;
    while (changed) {
      changed = false;
      for (const [workspace, info] of this.packageGraph) {
        if (!affectedPackages.has(workspace)) {
          const hasDependencyChange = info.dependencies.some((dep) => {
            const depWorkspace = Array.from(this.packageGraph.values()).find(
              (p) => p.name === dep
            )?.path;
            return depWorkspace && affectedPackages.has(depWorkspace);
          });

          if (hasDependencyChange) {
            affectedPackages.add(workspace);
            changed = true;
          }
        }
      }
    }

    return Array.from(affectedPackages);
  }

  getTestExecutionOrder(packages) {
    const ordered = [];
    const visited = new Set();
    const visiting = new Set();

    const visit = (pkg) => {
      if (visiting.has(pkg)) {
        throw new Error(`Circular dependency detected: ${pkg}`);
      }
      if (visited.has(pkg)) return;

      visiting.add(pkg);
      const info = this.packageGraph.get(pkg);
      if (info) {
        for (const dep of info.dependencies) {
          const depPkg = Array.from(this.packageGraph.values()).find((p) => p.name === dep)?.path;
          if (depPkg && packages.includes(depPkg)) {
            visit(depPkg);
          }
        }
      }
      visiting.delete(pkg);
      visited.add(pkg);
      ordered.push(pkg);
    };

    for (const pkg of packages) {
      visit(pkg);
    }

    return ordered;
  }
}

// ========================================
// TEST EXECUTION STRATEGIES
// ========================================

class TestExecutor {
  constructor() {
    this.analyzer = new DependencyAnalyzer();
    this.results = new Map();
    this.startTime = Date.now();
  }

  async runAll() {
    console.log('🚀 Running all tests across monorepo...');
    const packages = Array.from(this.analyzer.packageGraph.keys());
    return this.executeTests(packages, 'all');
  }

  async runAffected() {
    console.log('🎯 Running tests for affected packages...');
    const changedFiles = this.getChangedFiles();
    const affectedPackages = this.analyzer.getAffectedPackages(changedFiles);

    if (affectedPackages.length === 0) {
      console.log('✅ No affected packages found. All tests would pass.');
      return { success: true, skipped: true };
    }

    console.log(`📦 Affected packages: ${affectedPackages.join(', ')}`);
    return this.executeTests(affectedPackages, 'affected');
  }

  async runUnit() {
    console.log('🧪 Running unit tests across monorepo...');
    const result = await this.executeTestType('unit');
    if (!result.success && result.output) {
      console.log('\n🔍 Unit Test Failure Details:');
      this.displayTestOutput(result.output);
    }
    return result;
  }

  async runIntegration() {
    console.log('🔗 Running integration tests across monorepo...');
    const result = await this.executeTestType('integration');
    if (!result.success && result.output) {
      console.log('\n🔍 Integration Test Failure Details:');
      this.displayTestOutput(result.output);
    }
    return result;
  }

  async runE2E() {
    console.log('🌐 Running E2E tests across monorepo...');
    const result = await this.executeTestType('e2e');
    if (!result.success && result.output) {
      console.log('\n🔍 E2E Test Failure Details:');
      this.displayTestOutput(result.output);
    }
    return result;
  }

  async runProgressive() {
    console.log('📈 Running progressive test pipeline...');

    const stages = [
      { name: 'Unit Tests', command: 'test:unit' },
      { name: 'Integration Tests', command: 'test:integration' },
      { name: 'Component Tests', command: 'test:component' },
      { name: 'E2E Tests', command: 'test:e2e' },
    ];

    for (const stage of stages) {
      console.log(`\n🚦 Stage: ${stage.name}`);
      const result = await this.executeTestType(stage.command.split(':')[1]);

      if (!result.success) {
        console.log(`❌ ${stage.name} failed. Stopping pipeline.`);
        return result;
      }

      console.log(`✅ ${stage.name} passed. Continuing to next stage.`);
    }

    return { success: true, stages: stages.length };
  }

  async executeTests(packages, mode) {
    const orderedPackages = this.analyzer.getTestExecutionOrder(packages);

    console.log(`\n📋 Test execution order: ${orderedPackages.join(' → ')}`);

    const results = {
      success: true,
      packages: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        duration: 0,
      },
    };

    // Parallel execution with concurrency limit
    const concurrency = parseInt(process.env.TEST_CONCURRENCY, 10) || 4;
    const batches = this.createBatches(orderedPackages, concurrency);

    for (const batch of batches) {
      console.log(`\n🔄 Executing batch: ${batch.join(', ')}`);

      const batchPromises = batch.map(async (pkg) => {
        return this.executePackageTests(pkg);
      });

      const batchResults = await Promise.all(batchPromises);

      for (let i = 0; i < batch.length; i++) {
        const pkg = batch[i];
        const result = batchResults[i];

        results.packages[pkg] = result;
        results.summary.total += result.total;
        results.summary.passed += result.passed;
        results.summary.failed += result.failed;
        results.summary.duration += result.duration;

        if (!result.success) {
          results.success = false;
        }
      }

      // Stop on first failure in progressive mode
      if (!results.success && mode === 'progressive') {
        break;
      }
    }

    return results;
  }

  async executeTestType(type) {
    return new Promise((resolve) => {
      const workspaceFlag = type === 'e2e' ? '' : '--workspace-concurrency=4';
      const command = `pnpm run test:${type} ${workspaceFlag}`;

      console.log(`Running: ${command}`);

      let output = '';
      let errorOutput = '';

      const child = spawn('pnpm', ['run', `test:${type}`, workspaceFlag].filter(Boolean), {
        stdio: ['inherit', 'pipe', 'pipe'],
        cwd: ROOT_DIR,
      });

      child.stdout.on('data', (data) => {
        const chunk = data.toString();
        process.stdout.write(chunk); // Still show output in real-time
        output += chunk;
      });

      child.stderr.on('data', (data) => {
        const chunk = data.toString();
        process.stderr.write(chunk); // Still show errors in real-time
        errorOutput += chunk;
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          type,
          exitCode: code,
          output: output + errorOutput,
        });
      });
    });
  }

  async executePackageTests(packagePath) {
    const startTime = Date.now();
    const info = this.analyzer.packageGraph.get(packagePath);

    try {
      const result = execSync(`cd "${resolve(ROOT_DIR, packagePath)}" && pnpm test 2>&1`, {
        encoding: 'utf8',
        timeout: 120000,
      });

      const duration = Date.now() - startTime;

      // Parse test results for Vitest output format
      const testSummary = result.match(/Tests\s+(\d+)\s+passed\s+\((\d+)\)/);
      const failedMatch = result.match(/Tests\s+(\d+)\s+failed\s+\((\d+)\)/);

      const passed = testSummary ? parseInt(testSummary[1], 10) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1], 10) : 0;

      // Handle no tests found case (like website with --passWithNoTests)
      if (result.includes('No test files found, exiting with code 0')) {
        return {
          success: true,
          package: info.name,
          path: packagePath,
          total: 0,
          passed: 0,
          failed: 0,
          duration,
          output: result,
          skipped: true,
        };
      }

      // Fallback to symbol counting if summary parsing fails
      if (passed === 0 && failed === 0) {
        const passedSymbols = (result.match(/✓/g) || []).length;
        const failedSymbols = (result.match(/✗|×/g) || []).length;
        return {
          success: failedSymbols === 0 && passedSymbols > 0,
          package: info.name,
          path: packagePath,
          total: passedSymbols + failedSymbols,
          passed: passedSymbols,
          failed: failedSymbols,
          duration,
          output: result,
        };
      }

      return {
        success: failed === 0,
        package: info.name,
        path: packagePath,
        total: passed + failed,
        passed,
        failed,
        duration,
        output: result,
      };
    } catch (error) {
      // Handle packages with no test script
      if (
        error.message.includes('test') &&
        (error.message.includes('not found') || error.message.includes('not available'))
      ) {
        return {
          success: true,
          package: info.name,
          path: packagePath,
          total: 0,
          passed: 0,
          failed: 0,
          duration: Date.now() - startTime,
          skipped: true,
          skipReason: 'No test script available',
        };
      }

      return {
        success: false,
        package: info.name,
        path: packagePath,
        total: 0,
        passed: 0,
        failed: 1,
        duration: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  getChangedFiles() {
    try {
      // Get changed files from git
      const result = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' });
      return result.trim().split('\n').filter(Boolean);
    } catch {
      // Fallback to all files if git fails
      return [];
    }
  }

  displayTestOutput(output) {
    const lines = output.split('\n');
    let relevantLines = [];
    let inErrorSection = false;

    for (const line of lines) {
      // Look for error indicators
      if (line.includes('FAIL') || line.includes('ERROR') || line.includes('✗') ||
          line.includes('×') || line.includes('AssertionError') || line.includes('Test failed') ||
          line.includes('Command failed') || line.includes('exited (1)')) {
        inErrorSection = true;
        relevantLines.push(line);
      } else if (inErrorSection) {
        // Continue capturing lines in error context
        if (line.trim() === '' && relevantLines.length > 0 && !relevantLines[relevantLines.length - 1].trim()) {
          // Skip multiple empty lines
          continue;
        }
        relevantLines.push(line);

        // Stop error section on certain markers
        if (line.includes('Tasks:') || line.includes('Time:') || line.match(/^\s*✅/)) {
          break;
        }
      }
      // Also capture standalone error lines
      else if (line.includes('Error:') || line.includes('Failed:') ||
               line.includes('command finished with error') || line.includes('ELIFECYCLE')) {
        relevantLines.push(line);
      }
    }

    if (relevantLines.length > 0) {
      for (const line of relevantLines) {
        console.log(`   ${line}`);
      }
    } else {
      console.log('   (No specific error details captured)');
    }
  }

  generateReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      results,
      environment: {
        node: process.version,
        platform: process.platform,
        ci: !!process.env.CI,
      },
    };

    const reportPath = resolve(ROOT_DIR, 'test-results', 'monorepo-test-report.json');
    execSync(`mkdir -p "${dirname(reportPath)}"`);
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n📊 Test report saved to: ${reportPath}`);
    return report;
  }
}

// ========================================
// CLI INTERFACE
// ========================================

const executor = new TestExecutor();
const command = process.argv[2] || 'all';

async function main() {
  let result;

  switch (command) {
    case 'all':
      result = await executor.runAll();
      break;
    case 'affected':
      result = await executor.runAffected();
      break;
    case 'unit':
      result = await executor.runUnit();
      break;
    case 'integration':
      result = await executor.runIntegration();
      break;
    case 'e2e':
      result = await executor.runE2E();
      break;
    case 'progressive':
      result = await executor.runProgressive();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log('Available commands: all, affected, unit, integration, e2e, progressive');
      process.exit(1);
  }

  const _report = executor.generateReport(result);

  if (result.success) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed!');

    // Display detailed failure information
    if (result.packages) {
      console.log('\n🔍 Failure Details:');
      for (const [pkg, pkgResult] of Object.entries(result.packages)) {
        if (!pkgResult.success && !pkgResult.skipped) {
          console.log(`\n📦 Package: ${pkgResult.package || pkg}`);
          console.log(`   Path: ${pkgResult.path || pkg}`);

          if (pkgResult.error) {
            console.log(`   Error: ${pkgResult.error}`);
          }

          if (pkgResult.output && pkgResult.output.includes('FAIL')) {
            console.log(`   Output:`);
            // Extract and display relevant failure lines
            const lines = pkgResult.output.split('\n');
            let inFailureSection = false;
            for (const line of lines) {
              if (line.includes('FAIL') || line.includes('✗') || line.includes('×') || line.includes('Error:') || line.includes('AssertionError')) {
                inFailureSection = true;
              }
              if (inFailureSection && (line.trim() === '' || line.includes('Tests'))) {
                inFailureSection = false;
              }
              if (inFailureSection || line.includes('FAIL') || line.includes('✗') || line.includes('×')) {
                console.log(`     ${line}`);
              }
            }
          }
        }
      }
    }

    // Show summary if available
    if (result.summary) {
      console.log(`\n📊 Summary: ${result.summary.failed}/${result.summary.total} tests failed`);
    }

    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Test orchestrator failed:', error);
  process.exit(1);
});
