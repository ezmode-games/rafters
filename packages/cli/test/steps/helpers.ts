/**
 * Helper functions for BDD step definitions
 *
 * Provides utilities for executing CLI commands and managing processes
 */

import { type ChildProcess, spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CLI_BIN = join(__dirname, '../../bin/rafters.js');

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

/**
 * Execute rafters CLI command and wait for completion
 */
export async function execRafters(cwd: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn('node', [CLI_BIN, ...args], {
      cwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
      });
    });

    child.on('error', (err) => {
      resolve({
        exitCode: 1,
        stdout,
        stderr: stderr + err.message,
      });
    });
  });
}

/**
 * Start rafters CLI command as background process (for servers)
 */
export async function startRafters(
  cwd: string,
  args: string[],
): Promise<{ process: ChildProcess; waitForReady: () => Promise<void>; stop: () => void }> {
  const child = spawn('node', [CLI_BIN, ...args], {
    cwd,
    env: { ...process.env, NODE_ENV: 'test' },
  });

  let stdout = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  const waitForReady = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server did not start within timeout'));
      }, 10000);

      const checkReady = (): void => {
        // Check for common server ready patterns
        if (
          stdout.includes('listening') ||
          stdout.includes('ready') ||
          stdout.includes('started')
        ) {
          clearTimeout(timeout);
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  };

  const stop = (): void => {
    child.kill('SIGTERM');
  };

  return { process: child, waitForReady, stop };
}

/**
 * Wait for a condition with timeout
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeoutMs = 5000,
  intervalMs = 100,
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Condition not met within ${timeoutMs}ms`);
}
