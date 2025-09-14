/**
 * Integration test helpers for Rafters CLI
 *
 * Provides all utilities needed for comprehensive CLI integration testing
 * with real filesystem operations and actual project fixtures.
 */

// Re-export types for convenience
export type {
  CLIRunOptions,
  CLIRunResult,
  FrameworkDetectionResult,
  TestAppOptions,
  TestFixtureInfo,
} from '../types.js';

// CLI command execution
export {
  ensureCLIBuilt,
  getCLIVersion,
  runCLI,
  runCLIExpectingFailure,
  runCLISuccessfully,
} from './cliRunner.js';

// Framework detection and validation
export {
  detectFramework,
  getFrameworkPaths,
  validateFrameworkDetection,
} from './frameworkDetection.js';

// Mock registry for testing
export { MockRegistryServer } from './mockRegistry.js';
// Test app fixture management
export {
  cleanupAllTempApps,
  createTempTestApp,
  getAvailableFixtures,
  validateTestAppStructure,
} from './testApp.js';
