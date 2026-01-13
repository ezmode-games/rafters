import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RaftersToolHandler, TOOL_DEFINITIONS } from '../../src/mcp/tools.js';
import { fixtures, serializeNamespaceFile } from '../fixtures/tokens.js';

describe('TOOL_DEFINITIONS', () => {
  it('should define 9 tools', () => {
    expect(TOOL_DEFINITIONS).toHaveLength(9);
  });

  it('should have correct tool names', () => {
    const names = TOOL_DEFINITIONS.map((t) => t.name);
    // Token tools
    expect(names).toContain('rafters_list_namespaces');
    expect(names).toContain('rafters_get_tokens');
    expect(names).toContain('rafters_get_token');
    expect(names).toContain('rafters_search_tokens');
    expect(names).toContain('rafters_get_config');
    // Component intelligence tools
    expect(names).toContain('rafters_list_components');
    expect(names).toContain('rafters_get_component');
    expect(names).toContain('rafters_search_components');
    // Design decision tools
    expect(names).toContain('rafters_get_design_decisions');
  });

  it('should have descriptions for all tools', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.description).toBeDefined();
      expect(tool.description.length).toBeGreaterThan(10);
    }
  });

  it('should have input schemas for all tools', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }
  });
});

describe('RaftersToolHandler', () => {
  const testDir = join(tmpdir(), 'rafters-test-mcp-tools');
  let handler: RaftersToolHandler;

  beforeEach(async () => {
    await mkdir(join(testDir, '.rafters', 'tokens'), { recursive: true });
    handler = new RaftersToolHandler(testDir);
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe('rafters_list_namespaces', () => {
    it('should return empty array when no namespaces exist', async () => {
      const result = await handler.handleToolCall('rafters_list_namespaces', {});

      expect(result.isError).toBeFalsy();
      expect(result.content).toHaveLength(1);

      const data = JSON.parse(result.content[0].text as string);
      expect(data.namespaces).toEqual([]);
      expect(data.count).toBe(0);
    });

    it('should return list of namespaces when tokens exist', async () => {
      // Create some namespace files using fixtures
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'color.rafters.json'),
        serializeNamespaceFile('color', [fixtures.primaryToken()]),
      );
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'spacing.rafters.json'),
        serializeNamespaceFile('spacing', [fixtures.spacing1Token()]),
      );

      const result = await handler.handleToolCall('rafters_list_namespaces', {});

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.namespaces).toContain('color');
      expect(data.namespaces).toContain('spacing');
      expect(data.count).toBe(2);
    });
  });

  describe('rafters_get_tokens', () => {
    beforeEach(async () => {
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'color.rafters.json'),
        serializeNamespaceFile('color', [fixtures.primaryToken(), fixtures.secondaryToken()]),
      );
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'spacing.rafters.json'),
        serializeNamespaceFile('spacing', [fixtures.spacing1Token()]),
      );
    });

    it('should return all tokens when no namespace filter', async () => {
      const result = await handler.handleToolCall('rafters_get_tokens', {});

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.count).toBe(3);
      expect(data.namespace).toBe('all');
    });

    it('should return filtered tokens when namespace provided', async () => {
      const result = await handler.handleToolCall('rafters_get_tokens', { namespace: 'color' });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.count).toBe(2);
      expect(data.namespace).toBe('color');
      expect(data.tokens.every((t: { namespace: string }) => t.namespace === 'color')).toBe(true);
    });
  });

  describe('rafters_get_token', () => {
    const primaryToken = fixtures.primaryToken();

    beforeEach(async () => {
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'color.rafters.json'),
        serializeNamespaceFile('color', [primaryToken]),
      );
    });

    it('should return token with full metadata', async () => {
      const result = await handler.handleToolCall('rafters_get_token', { name: 'primary' });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.name).toBe('primary');
      expect(data.value).toEqual(primaryToken.value); // ColorReference object
      expect(data.semanticMeaning).toBe(primaryToken.semanticMeaning);
      expect(data.usageContext).toEqual(primaryToken.usageContext);
    });

    it('should return error for non-existent token', async () => {
      const result = await handler.handleToolCall('rafters_get_token', { name: 'nonexistent' });

      expect(result.isError).toBe(true);

      const data = JSON.parse(result.content[0].text as string);
      expect(data.error).toContain('not found');
    });
  });

  describe('rafters_search_tokens', () => {
    beforeEach(async () => {
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'color.rafters.json'),
        serializeNamespaceFile('color', [
          fixtures.primaryToken(),
          fixtures.primaryHoverToken(),
          fixtures.destructiveToken(),
        ]),
      );
    });

    it('should search by name', async () => {
      const result = await handler.handleToolCall('rafters_search_tokens', { query: 'primary' });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.count).toBe(2);
      expect(data.results.some((t: { name: string }) => t.name === 'primary')).toBe(true);
      expect(data.results.some((t: { name: string }) => t.name === 'primary-hover')).toBe(true);
    });

    it('should search by semantic meaning', async () => {
      const result = await handler.handleToolCall('rafters_search_tokens', { query: 'error' });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.count).toBe(1);
      expect(data.results[0].name).toBe('destructive');
    });

    it('should respect limit parameter', async () => {
      const result = await handler.handleToolCall('rafters_search_tokens', {
        query: 'a',
        limit: 1,
      });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.count).toBe(1);
    });
  });

  describe('rafters_get_config', () => {
    it('should return paths even without config file', async () => {
      const result = await handler.handleToolCall('rafters_get_config', {});

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.projectRoot).toBe(testDir);
      expect(data.paths).toBeDefined();
      expect(data.paths.raftersDir).toContain('.rafters');
    });

    it('should return config when file exists', async () => {
      const config = { framework: 'next', shadcn: true };
      await writeFile(join(testDir, '.rafters', 'config.rafters.json'), JSON.stringify(config));

      const result = await handler.handleToolCall('rafters_get_config', {});

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.config).toEqual(config);
    });
  });

  describe('unknown tool', () => {
    it('should return error for unknown tool', async () => {
      const result = await handler.handleToolCall('unknown_tool', {});

      expect(result.isError).toBe(true);

      const data = result.content[0].text as string;
      expect(data).toContain('Unknown tool');
    });
  });
});
