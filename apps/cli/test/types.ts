/**
 * Integration test types for CLI testing infrastructure
 */

export interface TestAppOptions {
  /** Type of test fixture to create */
  type: 'nextjs-app' | 'rr7-app' | 'vite-react' | 'empty-project';
  /** Custom temporary directory name */
  name?: string;
  /** Whether to preserve the test app after cleanup (for debugging) */
  preserve?: boolean;
}

export interface CLIRunResult {
  /** Exit code from the CLI command */
  exitCode: number;
  /** Standard output from the command */
  stdout: string;
  /** Standard error output from the command */
  stderr: string;
  /** Execution time in milliseconds */
  duration: number;
}

export interface CLIRunOptions {
  /** Working directory for command execution */
  cwd: string;
  /** Environment variables for the command */
  env?: Record<string, string>;
  /** Input to pipe to the command */
  input?: string;
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
}

export interface TestFixtureInfo {
  /** Path to the test fixture directory */
  path: string;
  /** Type of fixture */
  type: TestAppOptions['type'];
  /** Whether this is a temporary fixture */
  isTemporary: boolean;
  /** Cleanup function to remove the fixture */
  cleanup: () => Promise<void>;
}

export interface FrameworkDetectionResult {
  /** Detected framework type */
  framework: 'nextjs' | 'vite' | 'react-router' | 'unknown';
  /** Confidence level of detection (0-1) */
  confidence: number;
  /** Evidence used for detection */
  evidence: string[];
}
