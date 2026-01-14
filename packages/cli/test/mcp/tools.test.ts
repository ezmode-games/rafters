import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RaftersToolHandler, TOOL_DEFINITIONS } from '../../src/mcp/tools.js';
import { fixtures, serializeNamespaceFile } from '../fixtures/tokens.js';

describe('TOOL_DEFINITIONS', () => {
  it('should define 3 design-focused tools', () => {
    expect(TOOL_DEFINITIONS).toHaveLength(3);
  });

  it('should have correct tool names', () => {
    const names = TOOL_DEFINITIONS.map((t) => t.name);
    expect(names).toContain('rafters_vocabulary');
    expect(names).toContain('rafters_pattern');
    expect(names).toContain('rafters_component');
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

  describe('rafters_vocabulary', () => {
    it('should return vocabulary structure with empty tokens', async () => {
      const result = await handler.handleToolCall('rafters_vocabulary', {});

      expect(result.isError).toBeFalsy();
      expect(result.content).toHaveLength(1);

      const data = JSON.parse(result.content[0].text as string);
      expect(data.colors).toBeDefined();
      expect(data.spacing).toBeDefined();
      expect(data.typography).toBeDefined();
      expect(data.components).toBeDefined();
      expect(data.patterns).toBeDefined();
      expect(Array.isArray(data.patterns)).toBe(true);
    });

    it('should return color vocabulary when tokens exist', async () => {
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'color.rafters.json'),
        serializeNamespaceFile('color', [fixtures.primaryToken()]),
      );

      const result = await handler.handleToolCall('rafters_vocabulary', {});

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.colors.semantic).toContain('primary');
    });

    it('should return spacing vocabulary when tokens exist', async () => {
      await writeFile(
        join(testDir, '.rafters', 'tokens', 'spacing.rafters.json'),
        serializeNamespaceFile('spacing', [fixtures.spacing1Token()]),
      );

      const result = await handler.handleToolCall('rafters_vocabulary', {});

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.spacing.scale).toBeDefined();
      expect(data.spacing.scale['spacing-1']).toBe('0.25rem');
    });

    it('should include available patterns', async () => {
      const result = await handler.handleToolCall('rafters_vocabulary', {});

      const data = JSON.parse(result.content[0].text as string);
      expect(data.patterns).toContain('destructive-action');
      expect(data.patterns).toContain('form-validation');
      expect(data.patterns).toContain('empty-state');
    });
  });

  describe('rafters_pattern', () => {
    it('should return pattern details for valid pattern', async () => {
      const result = await handler.handleToolCall('rafters_pattern', {
        pattern: 'destructive-action',
      });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.name).toBe('Destructive Action');
      expect(data.intent).toBeDefined();
      expect(data.components).toContain('alert-dialog');
      expect(data.components).toContain('button');
      expect(data.tokens.colors).toContain('destructive');
      expect(data.accessibility).toBeDefined();
      expect(data.trustPattern).toBeDefined();
      expect(data.guidance.do).toBeDefined();
      expect(data.guidance.never).toBeDefined();
    });

    it('should return pattern with example code', async () => {
      const result = await handler.handleToolCall('rafters_pattern', {
        pattern: 'destructive-action',
      });

      const data = JSON.parse(result.content[0].text as string);
      expect(data.example).toContain('AlertDialog');
    });

    it('should return error for unknown pattern', async () => {
      const result = await handler.handleToolCall('rafters_pattern', {
        pattern: 'nonexistent-pattern',
      });

      expect(result.isError).toBe(true);

      const data = JSON.parse(result.content[0].text as string);
      expect(data.error).toContain('not found');
      expect(data.available).toContain('destructive-action');
    });

    it('should return form-validation pattern', async () => {
      const result = await handler.handleToolCall('rafters_pattern', {
        pattern: 'form-validation',
      });

      expect(result.isError).toBeFalsy();

      const data = JSON.parse(result.content[0].text as string);
      expect(data.name).toBe('Form Validation');
      expect(data.components).toContain('field');
      expect(data.components).toContain('input');
    });
  });

  describe('rafters_component', () => {
    it('should return error for non-existent component', async () => {
      const result = await handler.handleToolCall('rafters_component', {
        name: 'nonexistent',
      });

      expect(result.isError).toBe(true);

      const data = JSON.parse(result.content[0].text as string);
      expect(data.error).toContain('not found');
      expect(data.suggestion).toContain('rafters_vocabulary');
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
