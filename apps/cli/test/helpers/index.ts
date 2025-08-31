/**
 * Integration test helpers for Rafters CLI
 *
 * Provides all utilities needed for comprehensive CLI integration testing
 * with real filesystem operations and actual project fixtures.
 */

// Test app fixture management
export {
  createTempTestApp,
  cleanupAllTempApps,
  getAvailableFixtures,
  validateTestAppStructure,
} from './testApp.js';

// CLI command execution
export {
  runCLI,
  runCLISuccessfully,
  runCLIExpectingFailure,
  ensureCLIBuilt,
  getCLIVersion,
} from './cliRunner.js';

// Framework detection and validation
export {
  detectFramework,
  validateFrameworkDetection,
  getFrameworkPaths,
} from './frameworkDetection.js';

// Re-export types for convenience
export type {
  TestAppOptions,
  TestFixtureInfo,
  CLIRunResult,
  CLIRunOptions,
  FrameworkDetectionResult,
} from '../types.js';
