#!/usr/bin/env node

/**
 * Test Result Aggregation System
 *
 * Comprehensive test result analysis and reporting that provides:
 * - Cross-platform result aggregation
 * - Coverage analysis and trending
 * - Performance regression detection
 * - AI-driven insights and recommendations
 * - Historical data comparison
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

// ========================================
// TEST RESULT AGGREGATOR
// ========================================

class TestResultAggregator {
  constructor(artifactsPath) {
    this.artifactsPath = artifactsPath;
    this.results = {
      summary: {
        timestamp: new Date().toISOString(),
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        totalSkipped: 0,
        totalDuration: 0,
        overallSuccess: true,
      },
      unit: { passed: 0, failed: 0, total: 0, duration: 0, coverage: null },
      integration: { passed: 0, failed: 0, total: 0, duration: 0, coverage: null },
      component: { passed: 0, failed: 0, total: 0, duration: 0, coverage: null },
      e2e: { passed: 0, failed: 0, total: 0, duration: 0 },
      performance: { benchmarks: [], budgetViolations: [] },
      coverage: {
        overall: { percentage: 0, lines: 0, functions: 0, branches: 0 },
        byPackage: {},
        trends: [],
      },
      platforms: {},
      browsers: {},
      shards: {},
      flaky: [],
      slowTests: [],
      recommendations: [],
    };
  }

  async aggregate() {
    console.log('📊 Aggregating test results...');

    // Process all artifact directories
    if (existsSync(this.artifactsPath)) {
      const artifacts = readdirSync(this.artifactsPath);

      for (const artifact of artifacts) {
        const artifactPath = join(this.artifactsPath, artifact);
        if (statSync(artifactPath).isDirectory()) {
          await this.processArtifact(artifact, artifactPath);
        }
      }
    }

    // Calculate aggregated metrics
    this.calculateAggregatedMetrics();

    // Generate insights and recommendations
    this.generateInsights();

    // Save results
    await this.saveResults();

    // Generate reports
    await this.generateReports();

    console.log('✅ Test result aggregation complete');
    return this.results;
  }

  async processArtifact(name, path) {
    console.log(`Processing artifact: ${name}`);

    try {
      // Unit test results
      if (name.includes('unit')) {
        await this.processUnitResults(path);
      }

      // Integration test results
      if (name.includes('integration')) {
        await this.processIntegrationResults(path);
      }

      // Component test results
      if (name.includes('component')) {
        await this.processComponentResults(path);
      }

      // E2E test results
      if (name.includes('e2e')) {
        await this.processE2EResults(path);
      }

      // Performance results
      if (name.includes('performance')) {
        await this.processPerformanceResults(path);
      }

      // Coverage data
      if (name.includes('coverage')) {
        await this.processCoverageResults(path);
      }
    } catch (error) {
      console.warn(`Failed to process artifact ${name}:`, error.message);
    }
  }

  async processUnitResults(path) {
    const _junitFile = join(path, 'junit.xml');
    const jsonFile = join(path, 'results.json');

    if (existsSync(jsonFile)) {
      const results = JSON.parse(readFileSync(jsonFile, 'utf8'));
      this.results.unit.passed += results.numPassedTests || 0;
      this.results.unit.failed += results.numFailedTests || 0;
      this.results.unit.total += results.numTotalTests || 0;
      this.results.unit.duration +=
        results.testResults?.reduce((sum, test) => sum + (test.perfStats?.runtime || 0), 0) || 0;

      // Extract slow tests
      if (results.testResults) {
        for (const testFile of results.testResults) {
          for (const test of testFile.assertionResults || []) {
            if (test.duration && test.duration > 5000) {
              // 5s threshold
              this.results.slowTests.push({
                name: test.fullName,
                file: testFile.name,
                duration: test.duration,
                type: 'unit',
              });
            }
          }
        }
      }
    }
  }

  async processIntegrationResults(path) {
    const files = readdirSync(path).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      try {
        const results = JSON.parse(readFileSync(join(path, file), 'utf8'));
        this.results.integration.passed += results.passed || 0;
        this.results.integration.failed += results.failed || 0;
        this.results.integration.total += results.total || 0;
        this.results.integration.duration += results.duration || 0;

        // Track shard results
        if (file.includes('shard')) {
          const shardId = file.match(/shard-(\d+)/)?.[1];
          if (shardId) {
            this.results.shards[shardId] = {
              passed: results.passed || 0,
              failed: results.failed || 0,
              duration: results.duration || 0,
            };
          }
        }
      } catch (error) {
        console.warn(`Failed to parse ${file}:`, error.message);
      }
    }
  }

  async processComponentResults(path) {
    const reportDir = join(path, 'playwright-report-components');
    if (existsSync(reportDir)) {
      const reportFile = join(reportDir, 'report.json');
      if (existsSync(reportFile)) {
        const results = JSON.parse(readFileSync(reportFile, 'utf8'));

        // Extract browser-specific results
        for (const suite of results.suites || []) {
          const browser = suite.title;
          if (!this.results.browsers[browser]) {
            this.results.browsers[browser] = { passed: 0, failed: 0, total: 0 };
          }

          for (const test of suite.tests || []) {
            this.results.browsers[browser].total++;
            this.results.component.total++;

            if (test.outcome === 'expected') {
              this.results.browsers[browser].passed++;
              this.results.component.passed++;
            } else {
              this.results.browsers[browser].failed++;
              this.results.component.failed++;
            }

            this.results.component.duration += test.duration || 0;

            // Track flaky tests
            if (test.outcome === 'flaky') {
              this.results.flaky.push({
                name: test.title,
                browser,
                type: 'component',
              });
            }
          }
        }
      }
    }
  }

  async processE2EResults(path) {
    const reportFile = join(path, 'results.json');
    if (existsSync(reportFile)) {
      const results = JSON.parse(readFileSync(reportFile, 'utf8'));
      this.results.e2e.passed += results.passed || 0;
      this.results.e2e.failed += results.failed || 0;
      this.results.e2e.total += results.total || 0;
      this.results.e2e.duration += results.duration || 0;
    }
  }

  async processPerformanceResults(path) {
    const benchmarkFile = join(path, 'benchmark.json');
    if (existsSync(benchmarkFile)) {
      const benchmarks = JSON.parse(readFileSync(benchmarkFile, 'utf8'));
      this.results.performance.benchmarks.push(...benchmarks);

      // Check for performance budget violations
      for (const benchmark of benchmarks) {
        if (benchmark.duration > benchmark.budget) {
          this.results.performance.budgetViolations.push({
            name: benchmark.name,
            actual: benchmark.duration,
            budget: benchmark.budget,
            violation: benchmark.duration - benchmark.budget,
          });
        }
      }
    }
  }

  async processCoverageResults(path) {
    const coverageFile = join(path, 'coverage-summary.json');
    if (existsSync(coverageFile)) {
      const coverage = JSON.parse(readFileSync(coverageFile, 'utf8'));

      if (coverage.total) {
        this.results.coverage.overall = {
          percentage: coverage.total.lines.pct,
          lines: coverage.total.lines.pct,
          functions: coverage.total.functions.pct,
          branches: coverage.total.branches.pct,
          statements: coverage.total.statements.pct,
        };
      }

      // Process package-level coverage
      for (const [file, data] of Object.entries(coverage)) {
        if (file !== 'total' && file.includes('packages/')) {
          const packageName = file.split('/')[1];
          if (!this.results.coverage.byPackage[packageName]) {
            this.results.coverage.byPackage[packageName] = [];
          }
          this.results.coverage.byPackage[packageName].push(data);
        }
      }
    }
  }

  calculateAggregatedMetrics() {
    // Calculate totals
    this.results.summary.totalTests =
      this.results.unit.total +
      this.results.integration.total +
      this.results.component.total +
      this.results.e2e.total;

    this.results.summary.totalPassed =
      this.results.unit.passed +
      this.results.integration.passed +
      this.results.component.passed +
      this.results.e2e.passed;

    this.results.summary.totalFailed =
      this.results.unit.failed +
      this.results.integration.failed +
      this.results.component.failed +
      this.results.e2e.failed;

    this.results.summary.totalDuration =
      this.results.unit.duration +
      this.results.integration.duration +
      this.results.component.duration +
      this.results.e2e.duration;

    this.results.summary.overallSuccess = this.results.summary.totalFailed === 0;

    // Calculate success rates
    this.results.unit.successRate =
      this.results.unit.total > 0
        ? (this.results.unit.passed / this.results.unit.total) * 100
        : 100;
    this.results.integration.successRate =
      this.results.integration.total > 0
        ? (this.results.integration.passed / this.results.integration.total) * 100
        : 100;
    this.results.component.successRate =
      this.results.component.total > 0
        ? (this.results.component.passed / this.results.component.total) * 100
        : 100;
    this.results.e2e.successRate =
      this.results.e2e.total > 0 ? (this.results.e2e.passed / this.results.e2e.total) * 100 : 100;
  }

  generateInsights() {
    const recommendations = [];

    // Coverage recommendations
    if (this.results.coverage.overall.percentage < 80) {
      recommendations.push({
        type: 'coverage',
        priority: 'high',
        message: `Test coverage is ${this.results.coverage.overall.percentage}%. Target is 80%+`,
        suggestion: 'Add unit tests for uncovered code paths',
      });
    }

    // Performance recommendations
    if (this.results.performance.budgetViolations.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `${this.results.performance.budgetViolations.length} performance budget violations`,
        suggestion: 'Optimize slow test cases and consider parallelization',
      });
    }

    // Flaky test recommendations
    if (this.results.flaky.length > 0) {
      recommendations.push({
        type: 'reliability',
        priority: 'high',
        message: `${this.results.flaky.length} flaky tests detected`,
        suggestion: 'Investigate and fix flaky tests to improve CI reliability',
      });
    }

    // Test distribution recommendations
    const unitRatio = this.results.unit.total / this.results.summary.totalTests;
    if (unitRatio < 0.7) {
      recommendations.push({
        type: 'architecture',
        priority: 'medium',
        message: `Unit tests represent only ${(unitRatio * 100).toFixed(1)}% of total tests`,
        suggestion: 'Consider adding more unit tests for better test pyramid balance',
      });
    }

    this.results.recommendations = recommendations;
  }

  async saveResults() {
    const outputDir = join(ROOT_DIR, 'test-results', 'aggregated');
    execSync(`mkdir -p "${outputDir}"`);

    // Save detailed results
    writeFileSync(join(outputDir, 'detailed-results.json'), JSON.stringify(this.results, null, 2));

    // Save summary for GitHub Actions
    writeFileSync(
      join(outputDir, 'summary.json'),
      JSON.stringify(
        {
          success: this.results.summary.overallSuccess,
          unit: this.results.unit,
          integration: this.results.integration,
          component: this.results.component,
          e2e: this.results.e2e,
          coverage: this.results.coverage.overall,
          duration: this.results.summary.totalDuration,
          recommendations: this.results.recommendations.length,
        },
        null,
        2
      )
    );

    // Save trends data for historical analysis
    const trendsFile = join(outputDir, 'trends.json');
    let trends = [];
    if (existsSync(trendsFile)) {
      trends = JSON.parse(readFileSync(trendsFile, 'utf8'));
    }

    trends.push({
      timestamp: this.results.summary.timestamp,
      coverage: this.results.coverage.overall.percentage,
      totalTests: this.results.summary.totalTests,
      successRate: (this.results.summary.totalPassed / this.results.summary.totalTests) * 100,
      duration: this.results.summary.totalDuration,
      flaky: this.results.flaky.length,
    });

    // Keep only last 30 data points
    if (trends.length > 30) {
      trends = trends.slice(-30);
    }

    writeFileSync(trendsFile, JSON.stringify(trends, null, 2));
  }

  async generateReports() {
    const outputDir = join(ROOT_DIR, 'test-results', 'aggregated');

    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    writeFileSync(join(outputDir, 'report.html'), htmlReport);

    // Generate Markdown summary
    const markdownReport = this.generateMarkdownReport();
    writeFileSync(join(outputDir, 'summary.md'), markdownReport);

    console.log(`📄 Reports generated in ${outputDir}`);
  }

  generateHTMLReport() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Rafters Test Results</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .success { border-color: #22c55e; background: #f0fdf4; }
        .failure { border-color: #ef4444; background: #fef2f2; }
        .metric { font-size: 2em; font-weight: bold; }
        .recommendations { margin-top: 40px; }
        .recommendation { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .high { background: #fef2f2; border-left: 4px solid #ef4444; }
        .medium { background: #fffbeb; border-left: 4px solid #f59e0b; }
        .low { background: #f0fdf4; border-left: 4px solid #22c55e; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Rafters Test Results</h1>
        <p>Generated at ${this.results.summary.timestamp}</p>
    </div>

    <div class="summary">
        <div class="card ${this.results.summary.overallSuccess ? 'success' : 'failure'}">
            <h3>Overall Status</h3>
            <div class="metric">${this.results.summary.overallSuccess ? '✅ PASS' : '❌ FAIL'}</div>
        </div>

        <div class="card">
            <h3>Total Tests</h3>
            <div class="metric">${this.results.summary.totalTests}</div>
            <p>${this.results.summary.totalPassed} passed, ${this.results.summary.totalFailed} failed</p>
        </div>

        <div class="card">
            <h3>Coverage</h3>
            <div class="metric">${this.results.coverage.overall.percentage.toFixed(1)}%</div>
            <p>Lines: ${this.results.coverage.overall.lines.toFixed(1)}%</p>
        </div>

        <div class="card">
            <h3>Duration</h3>
            <div class="metric">${Math.round(this.results.summary.totalDuration / 1000)}s</div>
            <p>Total execution time</p>
        </div>
    </div>

    <h2>Test Breakdown</h2>
    <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
            <th>Type</th>
            <th>Total</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Success Rate</th>
            <th>Duration (s)</th>
        </tr>
        <tr>
            <td>Unit</td>
            <td>${this.results.unit.total}</td>
            <td>${this.results.unit.passed}</td>
            <td>${this.results.unit.failed}</td>
            <td>${this.results.unit.successRate?.toFixed(1)}%</td>
            <td>${Math.round(this.results.unit.duration / 1000)}</td>
        </tr>
        <tr>
            <td>Integration</td>
            <td>${this.results.integration.total}</td>
            <td>${this.results.integration.passed}</td>
            <td>${this.results.integration.failed}</td>
            <td>${this.results.integration.successRate?.toFixed(1)}%</td>
            <td>${Math.round(this.results.integration.duration / 1000)}</td>
        </tr>
        <tr>
            <td>Component</td>
            <td>${this.results.component.total}</td>
            <td>${this.results.component.passed}</td>
            <td>${this.results.component.failed}</td>
            <td>${this.results.component.successRate?.toFixed(1)}%</td>
            <td>${Math.round(this.results.component.duration / 1000)}</td>
        </tr>
        <tr>
            <td>E2E</td>
            <td>${this.results.e2e.total}</td>
            <td>${this.results.e2e.passed}</td>
            <td>${this.results.e2e.failed}</td>
            <td>${this.results.e2e.successRate?.toFixed(1)}%</td>
            <td>${Math.round(this.results.e2e.duration / 1000)}</td>
        </tr>
    </table>

    ${
      this.results.recommendations.length > 0
        ? `
    <div class="recommendations">
        <h2>Recommendations</h2>
        ${this.results.recommendations
          .map(
            (rec) => `
            <div class="recommendation ${rec.priority}">
                <strong>${rec.type.toUpperCase()}</strong> (${rec.priority} priority): ${rec.message}
                <br><em>Suggestion: ${rec.suggestion}</em>
            </div>
        `
          )
          .join('')}
    </div>
    `
        : ''
    }

</body>
</html>
    `.trim();
  }

  generateMarkdownReport() {
    return `
# 🧪 Rafters Test Results

**Generated:** ${this.results.summary.timestamp}
**Overall Status:** ${this.results.summary.overallSuccess ? '✅ PASS' : '❌ FAIL'}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${this.results.summary.totalTests} |
| Passed | ${this.results.summary.totalPassed} |
| Failed | ${this.results.summary.totalFailed} |
| Coverage | ${this.results.coverage.overall.percentage.toFixed(1)}% |
| Duration | ${Math.round(this.results.summary.totalDuration / 1000)}s |

## Test Breakdown

| Type | Total | Passed | Failed | Success Rate | Duration |
|------|-------|--------|--------|--------------|----------|
| Unit | ${this.results.unit.total} | ${this.results.unit.passed} | ${this.results.unit.failed} | ${this.results.unit.successRate?.toFixed(1)}% | ${Math.round(this.results.unit.duration / 1000)}s |
| Integration | ${this.results.integration.total} | ${this.results.integration.passed} | ${this.results.integration.failed} | ${this.results.integration.successRate?.toFixed(1)}% | ${Math.round(this.results.integration.duration / 1000)}s |
| Component | ${this.results.component.total} | ${this.results.component.passed} | ${this.results.component.failed} | ${this.results.component.successRate?.toFixed(1)}% | ${Math.round(this.results.component.duration / 1000)}s |
| E2E | ${this.results.e2e.total} | ${this.results.e2e.passed} | ${this.results.e2e.failed} | ${this.results.e2e.successRate?.toFixed(1)}% | ${Math.round(this.results.e2e.duration / 1000)}s |

${
  this.results.recommendations.length > 0
    ? `
## Recommendations

${this.results.recommendations
  .map(
    (rec) =>
      `- **${rec.type.toUpperCase()}** (${rec.priority}): ${rec.message}\n  *${rec.suggestion}*`
  )
  .join('\n')}
`
    : ''
}

${
  this.results.flaky.length > 0
    ? `
## Flaky Tests

${this.results.flaky.map((test) => `- ${test.name} (${test.type})`).join('\n')}
`
    : ''
}

${
  this.results.slowTests.length > 0
    ? `
## Slow Tests (>5s)

${this.results.slowTests.map((test) => `- ${test.name}: ${Math.round(test.duration / 1000)}s`).join('\n')}
`
    : ''
}
    `.trim();
  }
}

// ========================================
// CLI EXECUTION
// ========================================

async function main() {
  const artifactsPath = process.argv[2] || './artifacts';

  if (!existsSync(artifactsPath)) {
    console.error(`Artifacts path does not exist: ${artifactsPath}`);
    process.exit(1);
  }

  const aggregator = new TestResultAggregator(artifactsPath);
  const results = await aggregator.aggregate();

  console.log('\n📊 Aggregation Summary:');
  console.log(`Total Tests: ${results.summary.totalTests}`);
  console.log(
    `Success Rate: ${((results.summary.totalPassed / results.summary.totalTests) * 100).toFixed(1)}%`
  );
  console.log(`Coverage: ${results.coverage.overall.percentage.toFixed(1)}%`);
  console.log(`Duration: ${Math.round(results.summary.totalDuration / 1000)}s`);

  if (results.recommendations.length > 0) {
    console.log(`\n⚠️  ${results.recommendations.length} recommendations generated`);
  }

  if (!results.summary.overallSuccess) {
    console.log('\n❌ Some tests failed');
    process.exit(1);
  }

  console.log('\n✅ All tests passed');
}

main().catch((error) => {
  console.error('Aggregation failed:', error);
  process.exit(1);
});
