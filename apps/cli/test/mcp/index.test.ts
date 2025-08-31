import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock all external dependencies before importing
vi.mock('fs');
vi.mock('path');

// Mock MCP SDK
const mockServer = {
  setRequestHandler: vi.fn(),
  connect: vi.fn(),
};

const mockTransport = {};

vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: vi.fn(() => mockServer),
}));

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn(() => mockTransport),
}));

vi.mock('@modelcontextprotocol/sdk/types.js', () => ({
  CallToolRequestSchema: 'CallToolRequestSchema',
  ListToolsRequestSchema: 'ListToolsRequestSchema',
}));

// Mock token registry
const mockTokenRegistry = {
  get: vi.fn(),
  list: vi.fn(),
};

vi.mock('@rafters/design-tokens', () => ({
  createTokenRegistry: vi.fn(() => mockTokenRegistry),
}));

// Mock registry utils - create functions directly in mock
vi.mock('../../src/utils/registry.js', () => ({
  fetchComponent: vi.fn(),
  fetchComponentRegistry: vi.fn(),
}));

// Import after mocks are set up
import { startMCPServer } from '../../src/mcp/index.js';

describe('MCP Server', () => {
  const mockConsoleError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(join).mockReturnValue('/mock/.rafters/tokens');
    vi.spyOn(process, 'cwd').mockReturnValue('/mock');
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);

    // Reset mock functions
    mockTokenRegistry.get.mockReset();
    mockTokenRegistry.list.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('server initialization', () => {
    it('should start MCP server successfully', async () => {
      await startMCPServer();

      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2);
      expect(mockServer.connect).toHaveBeenCalledWith(mockTransport);
      expect(mockConsoleError).toHaveBeenCalledWith('Rafters MCP server started');
    });

    it('should set up both request handlers', async () => {
      await startMCPServer();

      const calls = mockServer.setRequestHandler.mock.calls;
      expect(calls[0][0]).toBe('ListToolsRequestSchema');
      expect(calls[1][0]).toBe('CallToolRequestSchema');
      expect(typeof calls[0][1]).toBe('function');
      expect(typeof calls[1][1]).toBe('function');
    });

    it('should handle missing token registry gracefully', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      await startMCPServer();

      // Should still start server even without token registry
      expect(mockServer.connect).toHaveBeenCalled();
    });
  });

  describe('list tools handler', () => {
    let listToolsHandler: () => Promise<{ tools: unknown[] }>;

    beforeEach(async () => {
      await startMCPServer();
      listToolsHandler = mockServer.setRequestHandler.mock.calls[0][1];
    });

    it('should return all available tools', async () => {
      const result = await listToolsHandler();

      expect(result).toBeDefined();
      expect(result.tools).toBeDefined();
      expect(result.tools).toHaveLength(7);

      // Check that all expected tools are present
      const toolNames = result.tools.map((tool) => tool.name);
      expect(toolNames).toContain('get_color_intelligence');
      expect(toolNames).toContain('get_token_by_category');
      expect(toolNames).toContain('get_component_intelligence');
      expect(toolNames).toContain('validate_color_combination');
      expect(toolNames).toContain('get_accessible_colors');
      expect(toolNames).toContain('get_tokens_by_trust_level');
      expect(toolNames).toContain('calculate_cognitive_load');

      // Check that the first tool has the expected structure
      const colorIntelTool = result.tools.find((tool) => tool.name === 'get_color_intelligence');
      expect(colorIntelTool).toBeDefined();
      expect(colorIntelTool.description).toContain('complete intelligence for a color token');
      expect(colorIntelTool.inputSchema).toBeDefined();
      expect(colorIntelTool.inputSchema.type).toBe('object');
      expect(colorIntelTool.inputSchema.required).toContain('tokenName');
    });

    it('should return exactly 7 tools', async () => {
      const result = await listToolsHandler();

      expect(result.tools).toHaveLength(7);
    });
  });

  describe('tool execution handler', () => {
    let toolHandler: (request: { params: { name: string; arguments: unknown } }) => Promise<{
      content: { type: string; text: string }[];
    }>;

    beforeEach(async () => {
      await startMCPServer();
      toolHandler = mockServer.setRequestHandler.mock.calls[1][1];
    });

    describe('get_color_intelligence tool', () => {
      it('should return color intelligence for ColorValue token', async () => {
        const mockColorToken = {
          name: 'primary',
          category: 'color',
          value: {
            scale: [{ l: 0.45, c: 0.12, h: 240 }],
            states: { hover: 'oklch(0.4 0.12 240)' },
            intelligence: { reasoning: 'Blue creates trust' },
            harmonies: { complementary: ['orange'] },
            accessibility: { contrast: { white: 4.5 } },
          },
          semanticMeaning: 'Primary brand color',
        };

        mockTokenRegistry.get.mockReturnValue(mockColorToken);

        const request = {
          params: {
            name: 'get_color_intelligence',
            arguments: { tokenName: 'primary' },
          },
        };

        const result = await toolHandler(request);

        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('text');

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.token).toEqual(mockColorToken);
        expect(parsedText.intelligence).toEqual({ reasoning: 'Blue creates trust' });
        expect(parsedText.harmonies).toEqual({ complementary: ['orange'] });
        expect(parsedText.accessibility).toEqual({ contrast: { white: 4.5 } });
      });

      it('should handle string value tokens with fallbacks', async () => {
        const mockColorToken = {
          name: 'primary',
          category: 'color',
          value: 'oklch(0.45 0.12 240)',
          semanticMeaning: 'Primary brand color',
        };

        mockTokenRegistry.get.mockReturnValue(mockColorToken);

        const request = {
          params: {
            name: 'get_color_intelligence',
            arguments: { tokenName: 'primary' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.token).toEqual(mockColorToken);
        expect(parsedText.intelligence).toBe('Not yet populated from API');
        expect(parsedText.harmonies).toEqual({});
        expect(parsedText.accessibility).toEqual({});
        expect(parsedText.scale).toEqual([]);
        expect(parsedText.states).toEqual({});
        expect(parsedText.use).toBe('Primary brand color');
      });

      it('should return error for non-color token', async () => {
        const mockSpacingToken = {
          name: 'lg',
          category: 'spacing',
          value: '16px',
        };

        mockTokenRegistry.get.mockReturnValue(mockSpacingToken);

        const request = {
          params: {
            name: 'get_color_intelligence',
            arguments: { tokenName: 'lg' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toContain('Color token "lg" not found');
      });

      it('should return error when token not found', async () => {
        mockTokenRegistry.get.mockReturnValue(undefined);

        const request = {
          params: {
            name: 'get_color_intelligence',
            arguments: { tokenName: 'nonexistent' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toContain('Color token "nonexistent" not found');
      });

      it('should return error when token registry not available', async () => {
        // This test is tricky because the token registry is created at server startup
        // Let's just verify the error handling when existsSync returns false at startup
        const originalExistsSync = vi.mocked(existsSync);
        originalExistsSync.mockReturnValue(false);

        // Clear previous mocks and start fresh server
        mockServer.setRequestHandler.mockClear();
        await startMCPServer();

        const newToolHandler = mockServer.setRequestHandler.mock.calls.find(
          (call) => call[0] === 'CallToolRequestSchema'
        )?.[1];

        const request = {
          params: {
            name: 'get_color_intelligence',
            arguments: { tokenName: 'primary' },
          },
        };

        const result = await newToolHandler(request);
        const parsedText = JSON.parse(result.content[0].text);

        // Should get an error about token registry not found
        expect(parsedText.error).toContain('Token registry not found');

        // Restore the mock for other tests
        originalExistsSync.mockReturnValue(true);
      });
    });

    describe('get_token_by_category tool', () => {
      it('should return tokens filtered by category', async () => {
        const mockTokens = [
          {
            name: 'primary',
            category: 'color',
            cognitiveLoad: 3,
            semanticMeaning: 'Primary brand color',
          },
          {
            name: 'success',
            category: 'color',
            cognitiveLoad: 2,
            semanticMeaning: 'Success state',
          },
          { name: 'lg', category: 'spacing', cognitiveLoad: 1, semanticMeaning: 'Large spacing' },
        ];

        mockTokenRegistry.list.mockReturnValue(mockTokens);

        const request = {
          params: {
            name: 'get_token_by_category',
            arguments: { category: 'color' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.category).toBe('color');
        expect(parsedText.count).toBe(2);
        expect(parsedText.tokens).toHaveLength(2);
        expect(parsedText.tokens[0].name).toBe('primary');
        expect(parsedText.tokens[1].name).toBe('success');
      });

      it('should handle ColorValue objects in token list', async () => {
        const mockTokens = [
          {
            name: 'primary',
            category: 'color',
            value: { name: 'primary', scale: [] },
            cognitiveLoad: 3,
            semanticMeaning: 'Primary brand color',
            trustLevel: 'high',
          },
        ];

        mockTokenRegistry.list.mockReturnValue(mockTokens);

        const request = {
          params: {
            name: 'get_token_by_category',
            arguments: { category: 'color' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.tokens[0].value).toBe('ColorValue object');
      });

      it('should return empty result when no tokens in category', async () => {
        mockTokenRegistry.list.mockReturnValue([]);

        const request = {
          params: {
            name: 'get_token_by_category',
            arguments: { category: 'nonexistent' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.category).toBe('nonexistent');
        expect(parsedText.count).toBe(0);
        expect(parsedText.tokens).toHaveLength(0);
      });
    });

    describe('get_component_intelligence tool', () => {
      it('should return component intelligence', async () => {
        const mockComponent = {
          name: 'Button',
          description: 'Interactive button component',
          meta: {
            rafters: {
              intelligence: {
                cognitiveLoad: 3,
                trustLevel: 'high',
                reasoning: 'Primary action element',
              },
            },
          },
          dependencies: ['react'],
        };

        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent).mockResolvedValue(mockComponent);

        const request = {
          params: {
            name: 'get_component_intelligence',
            arguments: { componentName: 'Button' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.name).toBe('Button');
        expect(parsedText.intelligence).toEqual(mockComponent.meta.rafters.intelligence);
        expect(parsedText.description).toBe('Interactive button component');
        expect(parsedText.dependencies).toEqual(['react']);
      });

      it('should return error when component not found', async () => {
        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent).mockResolvedValue(null);

        const request = {
          params: {
            name: 'get_component_intelligence',
            arguments: { componentName: 'NonExistent' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toContain('Component "NonExistent" not found');
      });

      it('should handle fetch component errors', async () => {
        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent).mockRejectedValue(new Error('Network error'));

        const request = {
          params: {
            name: 'get_component_intelligence',
            arguments: { componentName: 'Button' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toContain('Failed to fetch component: Error: Network error');
      });
    });

    describe('validate_color_combination tool', () => {
      it('should validate color combination successfully', async () => {
        const mockTokens = [
          { name: 'primary', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
          { name: 'success', category: 'color', cognitiveLoad: 2, trustLevel: 'low' },
        ];

        mockTokenRegistry.get.mockReturnValueOnce(mockTokens[0]).mockReturnValueOnce(mockTokens[1]);

        const request = {
          params: {
            name: 'validate_color_combination',
            arguments: { colors: ['primary', 'success'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.valid).toBe(true);
        expect(parsedText.totalCognitiveLoad).toBe(5);
        expect(parsedText.trustLevels.high).toBe(1);
        expect(parsedText.trustLevels.low).toBe(1);
        expect(parsedText.warnings).toHaveLength(0);
        expect(parsedText.recommendation).toBe('Color combination is well-balanced');
      });

      it('should detect cognitive overload', async () => {
        const mockTokens = [
          { name: 'heavy1', category: 'color', cognitiveLoad: 10, trustLevel: 'high' },
          { name: 'heavy2', category: 'color', cognitiveLoad: 8, trustLevel: 'medium' },
        ];

        mockTokenRegistry.get.mockReturnValueOnce(mockTokens[0]).mockReturnValueOnce(mockTokens[1]);

        const request = {
          params: {
            name: 'validate_color_combination',
            arguments: { colors: ['heavy1', 'heavy2'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.valid).toBe(false);
        expect(parsedText.totalCognitiveLoad).toBe(18);
        expect(parsedText.warnings).toContain('High cognitive load (18/15) - may overwhelm users');
      });

      it('should detect multiple critical trust levels', async () => {
        const mockTokens = [
          { name: 'critical1', category: 'color', cognitiveLoad: 5, trustLevel: 'critical' },
          { name: 'critical2', category: 'color', cognitiveLoad: 3, trustLevel: 'critical' },
        ];

        mockTokenRegistry.get.mockReturnValueOnce(mockTokens[0]).mockReturnValueOnce(mockTokens[1]);

        const request = {
          params: {
            name: 'validate_color_combination',
            arguments: { colors: ['critical1', 'critical2'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.valid).toBe(false);
        expect(parsedText.warnings).toContain(
          'Multiple critical trust levels (2) - avoid competing for attention'
        );
      });

      it('should detect too many high trust elements', async () => {
        const mockTokens = [
          { name: 'high1', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
          { name: 'high2', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
          { name: 'high3', category: 'color', cognitiveLoad: 3, trustLevel: 'high' },
        ];

        mockTokenRegistry.get
          .mockReturnValueOnce(mockTokens[0])
          .mockReturnValueOnce(mockTokens[1])
          .mockReturnValueOnce(mockTokens[2]);

        const request = {
          params: {
            name: 'validate_color_combination',
            arguments: { colors: ['high1', 'high2', 'high3'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.valid).toBe(false);
        expect(parsedText.warnings).toContain('Many high trust elements (3) - consider hierarchy');
      });

      it('should handle missing tokens gracefully', async () => {
        mockTokenRegistry.get
          .mockReturnValueOnce({
            name: 'primary',
            category: 'color',
            cognitiveLoad: 3,
            trustLevel: 'high',
          })
          .mockReturnValueOnce(undefined); // missing token

        const request = {
          params: {
            name: 'validate_color_combination',
            arguments: { colors: ['primary', 'missing'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.totalCognitiveLoad).toBe(3); // Only counting found token
        expect(parsedText.trustLevels.high).toBe(1);
      });
    });

    describe('get_accessible_colors tool', () => {
      it('should return accessible colors information', async () => {
        const mockBgToken = {
          name: 'background',
          category: 'color',
          value: 'oklch(0.95 0 0)',
        };

        mockTokenRegistry.get.mockReturnValue(mockBgToken);

        const request = {
          params: {
            name: 'get_accessible_colors',
            arguments: { background: 'background', level: 'AA' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.background).toBe('background');
        expect(parsedText.level).toBe('AA');
        expect(parsedText.placeholder).toBe(true);
        expect(parsedText.message).toContain(
          'Contrast calculation requires color-utils integration'
        );
      });

      it('should default to AA level when not specified', async () => {
        const mockBgToken = {
          name: 'background',
          category: 'color',
          value: 'oklch(0.95 0 0)',
        };

        mockTokenRegistry.get.mockReturnValue(mockBgToken);

        const request = {
          params: {
            name: 'get_accessible_colors',
            arguments: { background: 'background' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.level).toBe('AA');
      });

      it('should return error when background token not found', async () => {
        mockTokenRegistry.get.mockReturnValue(undefined);

        const request = {
          params: {
            name: 'get_accessible_colors',
            arguments: { background: 'nonexistent' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toContain('Background token "nonexistent" not found');
      });
    });

    describe('get_tokens_by_trust_level tool', () => {
      it('should return tokens filtered by trust level', async () => {
        const mockTokens = [
          {
            name: 'primary',
            category: 'color',
            trustLevel: 'high',
            cognitiveLoad: 3,
            semanticMeaning: 'Primary',
          },
          {
            name: 'secondary',
            category: 'color',
            trustLevel: 'medium',
            cognitiveLoad: 2,
            semanticMeaning: 'Secondary',
          },
          {
            name: 'tertiary',
            category: 'color',
            trustLevel: 'high',
            cognitiveLoad: 1,
            semanticMeaning: 'Tertiary',
          },
        ];

        mockTokenRegistry.list.mockReturnValue(mockTokens);

        const request = {
          params: {
            name: 'get_tokens_by_trust_level',
            arguments: { trustLevel: 'high' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.trustLevel).toBe('high');
        expect(parsedText.count).toBe(2);
        expect(parsedText.tokens).toHaveLength(2);
        expect(parsedText.tokens.map((t) => t.name)).toEqual(['primary', 'tertiary']);
      });

      it('should return empty result when no tokens at trust level', async () => {
        const mockTokens = [
          { name: 'primary', category: 'color', trustLevel: 'high', cognitiveLoad: 3 },
        ];

        mockTokenRegistry.list.mockReturnValue(mockTokens);

        const request = {
          params: {
            name: 'get_tokens_by_trust_level',
            arguments: { trustLevel: 'critical' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.trustLevel).toBe('critical');
        expect(parsedText.count).toBe(0);
        expect(parsedText.tokens).toHaveLength(0);
      });
    });

    describe('calculate_cognitive_load tool', () => {
      it('should calculate total cognitive load for components', async () => {
        const mockComponents = [
          {
            name: 'Button',
            meta: { rafters: { intelligence: { cognitiveLoad: 3 } } },
          },
          {
            name: 'Dialog',
            meta: { rafters: { intelligence: { cognitiveLoad: 7 } } },
          },
        ];

        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent)
          .mockResolvedValueOnce(mockComponents[0])
          .mockResolvedValueOnce(mockComponents[1]);

        const request = {
          params: {
            name: 'calculate_cognitive_load',
            arguments: { components: ['Button', 'Dialog'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.components).toHaveLength(2);
        expect(parsedText.totalLoad).toBe(10);
        expect(parsedText.budget).toBe(15);
        expect(parsedText.remaining).toBe(5);
        expect(parsedText.status).toBe('within-budget');
        expect(parsedText.recommendation).toBe('Cognitive load is manageable');
      });

      it('should detect over-budget scenarios', async () => {
        const mockComponents = [
          {
            name: 'HeavyComponent',
            meta: { rafters: { intelligence: { cognitiveLoad: 10 } } },
          },
          {
            name: 'AnotherHeavy',
            meta: { rafters: { intelligence: { cognitiveLoad: 8 } } },
          },
        ];

        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent)
          .mockResolvedValueOnce(mockComponents[0])
          .mockResolvedValueOnce(mockComponents[1]);

        const request = {
          params: {
            name: 'calculate_cognitive_load',
            arguments: { components: ['HeavyComponent', 'AnotherHeavy'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.totalLoad).toBe(18);
        expect(parsedText.remaining).toBe(-3);
        expect(parsedText.status).toBe('over-budget');
        expect(parsedText.recommendation).toBe('Reduce complexity by 3 points');
      });

      it('should handle components with missing intelligence', async () => {
        const mockComponents = [
          {
            name: 'Button',
            meta: { rafters: { intelligence: { cognitiveLoad: 3 } } },
          },
          {
            name: 'SimpleDiv',
            meta: { rafters: {} }, // No intelligence
          },
        ];

        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent)
          .mockResolvedValueOnce(mockComponents[0])
          .mockResolvedValueOnce(mockComponents[1]);

        const request = {
          params: {
            name: 'calculate_cognitive_load',
            arguments: { components: ['Button', 'SimpleDiv'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.components[1].cognitiveLoad).toBe(0);
        expect(parsedText.totalLoad).toBe(3);
      });

      it('should handle component fetch failures', async () => {
        const { fetchComponent } = await import('../../src/utils/registry.js');
        vi.mocked(fetchComponent)
          .mockResolvedValueOnce({
            name: 'Button',
            meta: { rafters: { intelligence: { cognitiveLoad: 3 } } },
          })
          .mockResolvedValueOnce(null); // Failed to fetch

        const request = {
          params: {
            name: 'calculate_cognitive_load',
            arguments: { components: ['Button', 'Missing'] },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.components[1].cognitiveLoad).toBe(0);
        expect(parsedText.totalLoad).toBe(3);
      });
    });

    describe('error handling', () => {
      it('should handle unknown tool names', async () => {
        const request = {
          params: {
            name: 'unknown_tool',
            arguments: {},
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toBe('Unknown tool: unknown_tool');
      });

      it('should handle general errors gracefully', async () => {
        // Simulate an error in token registry
        mockTokenRegistry.get.mockImplementation(() => {
          throw new Error('Registry failure');
        });

        const request = {
          params: {
            name: 'get_color_intelligence',
            arguments: { tokenName: 'primary' },
          },
        };

        const result = await toolHandler(request);

        const parsedText = JSON.parse(result.content[0].text);
        expect(parsedText.error).toContain('Registry failure');
      });

      it('should handle token registry not found for all token-dependent tools', async () => {
        // Since the token registry is null when existsSync returns false at startup,
        // let's test error handling by simulating registry failure
        const originalExistsSync = vi.mocked(existsSync);
        originalExistsSync.mockReturnValue(false);

        // Clear and restart server
        mockServer.setRequestHandler.mockClear();
        await startMCPServer();

        const newToolHandler = mockServer.setRequestHandler.mock.calls.find(
          (call) => call[0] === 'CallToolRequestSchema'
        )?.[1];

        const tokenTools = [
          { name: 'get_token_by_category', args: { category: 'color' } },
          { name: 'validate_color_combination', args: { colors: ['primary'] } },
          { name: 'get_accessible_colors', args: { background: 'bg' } },
          { name: 'get_tokens_by_trust_level', args: { trustLevel: 'high' } },
        ];

        for (const tool of tokenTools) {
          const request = {
            params: {
              name: tool.name,
              arguments: tool.args,
            },
          };

          const result = await newToolHandler(request);
          const parsedText = JSON.parse(result.content[0].text);
          expect(parsedText.error).toContain('Token registry not found');
        }

        // Restore for other tests
        originalExistsSync.mockReturnValue(true);
      });
    });
  });
});
