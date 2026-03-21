/**
 * Integration test helpers
 *
 * Provides utilities for executing CLI commands against fixture projects
 * and creating pre-initialized project fixtures.
 */

import { type ChildProcess, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFixture, type FixtureType } from '../fixtures/projects.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CLI_BIN = join(__dirname, '../../dist/index.js');

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

/**
 * Execute rafters CLI command and wait for completion
 */
export async function execCli(cwd: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn('node', [CLI_BIN, ...args], {
      cwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({ exitCode: code ?? 1, stdout, stderr });
    });

    child.on('error', (err) => {
      resolve({ exitCode: 1, stdout, stderr: stderr + err.message });
    });
  });
}

/**
 * Start CLI as a background process (for MCP server)
 */
export function spawnCli(
  cwd: string,
  args: string[],
): { process: ChildProcess; kill: () => void } {
  const child = spawn('node', [CLI_BIN, ...args], {
    cwd,
    env: { ...process.env, NODE_ENV: 'test' },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  return {
    process: child,
    kill: () => {
      child.kill('SIGTERM');
    },
  };
}

/**
 * Create a fixture project and run `rafters init` on it.
 * Returns the fixture path with a fully initialized .rafters/ directory.
 */
export async function createInitializedFixture(
  type: FixtureType = 'nextjs-shadcn-v4',
): Promise<string> {
  const fixturePath = await createFixture(type);
  const result = await execCli(fixturePath, ['init']);

  if (result.exitCode !== 0) {
    throw new Error(
      `Failed to initialize fixture ${type}: ${result.stderr}\n${result.stdout}`,
    );
  }

  return fixturePath;
}

/**
 * Read and parse the rafters config from a fixture
 */
export async function readConfig(fixturePath: string): Promise<Record<string, unknown>> {
  const configPath = join(fixturePath, '.rafters', 'config.rafters.json');
  const content = await readFile(configPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Check if a file exists relative to a fixture path
 */
export function fixtureFileExists(fixturePath: string, relativePath: string): boolean {
  return existsSync(join(fixturePath, relativePath));
}

/**
 * Read a file relative to a fixture path
 */
export async function readFixtureFile(
  fixturePath: string,
  relativePath: string,
): Promise<string> {
  return readFile(join(fixturePath, relativePath), 'utf-8');
}

/**
 * Write a file relative to a fixture path
 */
export async function writeFixtureFile(
  fixturePath: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const fullPath = join(fixturePath, relativePath);
  await mkdir(join(fullPath, '..'), { recursive: true });
  await writeFile(fullPath, content);
}

/**
 * Send a JSON-RPC message to an MCP server process via stdin
 * and read the response from stdout.
 */
export function sendJsonRpc(
  child: ChildProcess,
  method: string,
  params: Record<string, unknown> = {},
  id: number = 1,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const message = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    const header = `Content-Length: ${Buffer.byteLength(message)}\r\n\r\n`;

    let buffer = '';
    const timeout = setTimeout(() => {
      reject(new Error(`JSON-RPC timeout for method: ${method}`));
    }, 10000);

    const onData = (data: Buffer): void => {
      buffer += data.toString();

      // Parse LSP-style content-length header
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) return;

      const headerPart = buffer.slice(0, headerEnd);
      const contentLengthMatch = headerPart.match(/Content-Length:\s*(\d+)/i);
      if (!contentLengthMatch) return;

      const contentLength = Number.parseInt(contentLengthMatch[1], 10);
      const bodyStart = headerEnd + 4;
      const body = buffer.slice(bodyStart);

      if (Buffer.byteLength(body) >= contentLength) {
        clearTimeout(timeout);
        child.stdout?.off('data', onData);
        try {
          resolve(JSON.parse(body.slice(0, contentLength)));
        } catch (err) {
          reject(new Error(`Failed to parse JSON-RPC response: ${body.slice(0, contentLength)}`));
        }
      }
    };

    child.stdout?.on('data', onData);
    child.stdin?.write(header + message);
  });
}
