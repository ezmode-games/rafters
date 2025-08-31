/**
 * CLI command execution utilities for integration tests
 *
 * Provides utilities to run the actual CLI commands against real filesystems
 * with proper isolation and error handling.
 */

import { execSync, spawn } from 'node:child_process';
import { join } from 'node:path';
import type { CLIRunOptions, CLIRunResult } from '../types.js';

const CLI_ROOT = join(process.cwd());
const CLI_DIST = join(CLI_ROOT, 'dist', 'index.js');

// Get the absolute path to node executable
function getNodePath(): string {
  // Use process.execPath which is the most reliable
  return process.execPath;
}

/**
 * Run a CLI command and return the result
 */
export async function runCLI(args: string[], options: CLIRunOptions): Promise<CLIRunResult> {
  const { cwd, env = {}, input, timeout = 30000 } = options;
  const startTime = Date.now();

  // Build the command environment
  const commandEnv = {
    ...process.env,
    ...env,
    // Ensure Node.js can find the CLI
    NODE_PATH: join(CLI_ROOT, 'node_modules'),
    // Disable interactive prompts
    CI: 'true',
    // Set working directory in env for the CLI to use
    PWD: cwd,
  };

  return new Promise<CLIRunResult>((resolve, reject) => {
    // Run the CLI using Node.js to execute the built CLI
    const nodePath = getNodePath();
    const child = spawn(nodePath, [CLI_DIST, ...args], {
      cwd,
      env: commandEnv,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    // Collect output
    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Handle input if provided
    if (input) {
      child.stdin?.write(input);
      child.stdin?.end();
    } else {
      child.stdin?.end();
    }

    // Set up timeout
    const timeoutHandle = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`CLI command timed out after ${timeout}ms: rafters ${args.join(' ')}`));
    }, timeout);

    // Handle completion
    child.on('close', (code) => {
      clearTimeout(timeoutHandle);
      const duration = Date.now() - startTime;

      resolve({
        exitCode: code ?? 1,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        duration,
      });
    });

    // Handle errors
    child.on('error', (error) => {
      clearTimeout(timeoutHandle);
      reject(new Error(`Failed to execute CLI command: ${error.message}`));
    });
  });
}

/**
 * Run a CLI command and expect it to succeed (exit code 0)
 */
export async function runCLISuccessfully(
  args: string[],
  options: CLIRunOptions
): Promise<CLIRunResult> {
  const result = await runCLI(args, options);

  if (result.exitCode !== 0) {
    throw new Error(
      `CLI command failed with exit code ${result.exitCode}:\n` +
        `Command: rafters ${args.join(' ')}\n` +
        `STDOUT: ${result.stdout}\n` +
        `STDERR: ${result.stderr}`
    );
  }

  return result;
}

/**
 * Run a CLI command and expect it to fail with a specific exit code
 */
export async function runCLIExpectingFailure(
  args: string[],
  options: CLIRunOptions,
  expectedExitCode?: number
): Promise<CLIRunResult> {
  const result = await runCLI(args, options);

  if (result.exitCode === 0) {
    throw new Error(
      `CLI command unexpectedly succeeded:\nCommand: rafters ${args.join(' ')}\nSTDOUT: ${result.stdout}`
    );
  }

  if (expectedExitCode !== undefined && result.exitCode !== expectedExitCode) {
    throw new Error(
      `CLI command failed with exit code ${result.exitCode}, expected ${expectedExitCode}:\n` +
        `Command: rafters ${args.join(' ')}\n` +
        `STDOUT: ${result.stdout}\n` +
        `STDERR: ${result.stderr}`
    );
  }

  return result;
}

/**
 * Ensure the CLI is built and ready for testing
 */
export async function ensureCLIBuilt(): Promise<void> {
  const { existsSync } = await import('node:fs');

  if (!existsSync(CLI_DIST)) {
    const { execSync } = await import('node:child_process');

    console.log('Building CLI for integration tests...');
    try {
      execSync('pnpm build', {
        cwd: CLI_ROOT,
        stdio: 'inherit',
      });
    } catch (error) {
      throw new Error(`Failed to build CLI: ${error instanceof Error ? error.message : error}`);
    }
  }
}

/**
 * Get the version of the CLI being tested
 */
export async function getCLIVersion(): Promise<string> {
  const result = await runCLI(['--version'], { cwd: CLI_ROOT });

  if (result.exitCode !== 0) {
    throw new Error(`Failed to get CLI version: ${result.stderr}`);
  }

  return result.stdout.trim();
}
