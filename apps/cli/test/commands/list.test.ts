import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listCommand } from '../../src/commands/list.js';

// Mock all external dependencies
vi.mock('node:fs');
vi.mock('node:path');
vi.mock('../../src/utils/config.js');
vi.mock('../../src/utils/logo.js');
vi.mock('../../src/utils/registry.js');

const mockExistsSync = vi.mocked(existsSync);
const mockReadFileSync = vi.mocked(readFileSync);
const mockJoin = vi.mocked(join);

describe('listCommand', () => {
  const mockConfig = {
    componentsDir: './src/components/ui',
    packageManager: 'npm',
  };

  const mockRegistry = {
    components: [
      {
        name: 'button',
        description: 'A clickable button component',
        version: '1.0.0',
        intelligence: {
          cognitiveLoad: 3,
        },
      },
      {
        name: 'input',
        description: 'Text input field component',
        version: '1.0.0',
        intelligence: {
          cognitiveLoad: 4,
        },
      },
      {
        name: 'card',
        description: 'Card container component',
        version: '1.0.0',
        intelligence: {
          cognitiveLoad: 2,
        },
      },
    ],
  };

  const mockInstalledComponents = {
    button: {
      name: 'button',
      path: './src/components/ui/button.tsx',
      installed: '2023-01-01T00:00:00Z',
      version: '1.0.0',
      intelligence: {
        cognitiveLoad: 3,
        attentionEconomics: 'high-attention: primary action element',
        accessibility: 'AAA',
        trustBuilding: 'high',
        semanticMeaning: 'Interactive button element',
      },
      dependencies: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/test/project');
    vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Setup default mocks
    mockJoin.mockImplementation((...paths) => paths.join('/'));
  });

  it('should show compact view by default', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue(mockRegistry);

    // Mock installed components
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ components: mockInstalledComponents }));

    await listCommand({});

    expect(console.log).toHaveBeenCalledWith('Installed Components:');
    expect(console.log).toHaveBeenCalledWith('✓ button       v1.0.0');
    expect(console.log).toHaveBeenCalledWith('Available Components:');
    expect(console.log).toHaveBeenCalledWith(
      '  input        - Text input field component (load: 4/10)'
    );
    expect(console.log).toHaveBeenCalledWith(
      '  card         - Card container component (load: 2/10)'
    );
    expect(console.log).toHaveBeenCalledWith('Summary: 1 installed, 2 available');
  });

  it('should show detailed view when details option is true', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue(mockRegistry);

    // Mock installed components
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(JSON.stringify({ components: mockInstalledComponents }));

    await listCommand({ details: true });

    expect(console.log).toHaveBeenCalledWith('Installed Components:');
    expect(console.log).toHaveBeenCalledWith('button (v1.0.0)');
    expect(console.log).toHaveBeenCalledWith('  Path: ./src/components/ui/button.tsx');
    expect(console.log).toHaveBeenCalledWith('  Intelligence: Cognitive load=3/10, high-attention');

    expect(console.log).toHaveBeenCalledWith('Available Components (2 remaining):');
    expect(console.log).toHaveBeenCalledWith('  input (v1.0.0)');
    expect(console.log).toHaveBeenCalledWith('    Text input field component');
  });

  it('should handle no installed components', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue(mockRegistry);

    // No manifest file exists
    mockExistsSync.mockReturnValue(false);

    await listCommand({});

    expect(console.log).toHaveBeenCalledWith('Available Components:');
    expect(console.log).toHaveBeenCalledWith(
      '  button       - A clickable button component (load: 3/10)'
    );
    expect(console.log).toHaveBeenCalledWith(
      '  input        - Text input field component (load: 4/10)'
    );
    expect(console.log).toHaveBeenCalledWith(
      '  card         - Card container component (load: 2/10)'
    );
    expect(console.log).toHaveBeenCalledWith('Summary: 0 installed, 3 available');
  });

  it('should handle malformed manifest file', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue(mockRegistry);

    // Manifest exists but is malformed
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockImplementation(() => {
      throw new Error('Invalid JSON');
    });

    await listCommand({});

    // Should fallback to empty installed components
    expect(console.log).toHaveBeenCalledWith('Summary: 0 installed, 3 available');
  });

  it('should work when not initialized (no config)', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockImplementation(() => {
      throw new Error('No config found');
    });
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue(mockRegistry);

    await listCommand({});

    expect(console.log).toHaveBeenCalledWith('Available Components:');
    expect(console.log).toHaveBeenCalledWith(
      '  button       - A clickable button component (load: 3/10)'
    );
    expect(console.log).toHaveBeenCalledWith('Summary: 0 installed, 3 available');
  });

  it('should limit available components display to 5 in detailed view', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    const registryWithManyComponents = {
      components: Array.from({ length: 10 }, (_, i) => ({
        name: `component${i}`,
        description: `Component ${i} description`,
        version: '1.0.0',
        intelligence: {
          cognitiveLoad: 0,
        },
      })),
    };

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue(registryWithManyComponents);

    // No installed components
    mockExistsSync.mockReturnValue(false);

    await listCommand({ details: true });

    expect(console.log).toHaveBeenCalledWith('Available Components (10 remaining):');
    expect(console.log).toHaveBeenCalledWith('  component0 (v1.0.0)');
    expect(console.log).toHaveBeenCalledWith('    Component 0 description');
    expect(console.log).toHaveBeenCalledWith(
      "  ... and 2 more (use 'rafters list' for compact view)"
    );
  });

  it('should handle registry fetch errors', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockRejectedValue(new Error('Registry fetch failed'));

    await expect(listCommand({})).rejects.toThrow('process.exit(1)');

    expect(console.error).toHaveBeenCalledWith('Error listing components:', expect.any(Error));
  });

  it('should handle empty registry', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fetchComponentRegistry } = await import('../../src/utils/registry.js');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(fetchComponentRegistry).mockResolvedValue({ components: [] });

    mockExistsSync.mockReturnValue(false);

    await listCommand({});

    expect(console.log).toHaveBeenCalledWith('Summary: 0 installed, 0 available');
  });
});
