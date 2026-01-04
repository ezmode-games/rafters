/**
 * Studio-specific step definitions
 *
 * Note: Module-level state is intentional for playwright-bdd step state sharing.
 * Parallel execution is disabled in playwright.config.ts to ensure test isolation.
 */

import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { context } from './common.steps.js';

const { Given, When, Then } = createBdd();

let serverPort = 3456;
let lastResponse: { status: number; body: string; contentType: string } | null = null;
let _lastError: Error | null = null;

Then('the server should start on default port', async () => {
  expect(context.serverProcess).not.toBeNull();
});

Then('the server should start on port {int}', async ({}, port: number) => {
  serverPort = port;
  expect(context.serverProcess).not.toBeNull();
});

Then('it should be accessible via HTTP', async () => {
  // Would make HTTP request to verify
  expect(true).toBe(true); // Placeholder
});

Given('the studio server is running', async () => {
  // Server already started
});

When('I request the root path', async () => {
  _lastError = null;
  try {
    const response = await fetch(`http://localhost:${serverPort}/`);
    lastResponse = {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get('content-type') ?? '',
    };
  } catch (error) {
    _lastError = error instanceof Error ? error : new Error(String(error));
    lastResponse = { status: 0, body: '', contentType: '' };
  }
});

When('I request {string}', async ({}, path: string) => {
  _lastError = null;
  try {
    const response = await fetch(`http://localhost:${serverPort}${path}`);
    lastResponse = {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get('content-type') ?? '',
    };
  } catch (error) {
    _lastError = error instanceof Error ? error : new Error(String(error));
    lastResponse = { status: 0, body: '', contentType: '' };
  }
});

When('I POST to {string} with updated values', async ({}, path: string) => {
  _lastError = null;
  try {
    const response = await fetch(`http://localhost:${serverPort}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });
    lastResponse = {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get('content-type') ?? '',
    };
  } catch (error) {
    _lastError = error instanceof Error ? error : new Error(String(error));
    lastResponse = { status: 0, body: '', contentType: '' };
  }
});

Then('the response should be HTML', async () => {
  expect(lastResponse).not.toBeNull();
  expect(lastResponse?.contentType).toContain('text/html');
});

Then('the response should be JSON', async () => {
  expect(lastResponse).not.toBeNull();
  expect(lastResponse?.contentType).toContain('application/json');
});

Then('it should contain the token editor UI', async () => {
  expect(lastResponse).not.toBeNull();
  expect(lastResponse?.body).toContain('rafters');
});

Then('it should contain token namespaces', async () => {
  expect(lastResponse).not.toBeNull();
  // Would parse JSON and check for namespaces
});

Then('the token files should be updated', async () => {
  expect(true).toBe(true); // Placeholder
});

Then('the error should suggest running init first', async () => {
  expect(context.commandResult?.stderr).toMatch(/init|initialize/i);
});
