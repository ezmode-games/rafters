/**
 * Rafters MCP (Model Context Protocol) Server
 *
 * Provides AI agents with direct access to design token intelligence,
 * component metadata, and design system reasoning.
 *
 * Based on shadcn's approach - embedded directly in CLI for single source of truth.
 */

// TODO: Fix MCP SDK import issues in separate PR
// Temporarily disabled to unblock shared package architecture PR

export function startMCPServer(): void {
  console.log('MCP server temporarily disabled - see issue for MCP SDK fixes');
}

export function createMCPTools(): void {
  // Implementation disabled until MCP SDK import issues are resolved
}

/*
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { createTokenRegistry } from '@rafters/design-tokens';
import type { ColorValue, Token } from '@rafters/shared';
import { fetchComponent } from '../utils/registry.js';

// [Original implementation commented out until MCP SDK is fixed]
*/
