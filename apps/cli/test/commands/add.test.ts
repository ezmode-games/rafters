import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addCommand } from '../../src/commands/add.js';

// Mock all external dependencies
vi.mock('node:fs');
vi.mock('node:path');
vi.mock('ora');
vi.mock('../../src/utils/config.js');
vi.mock('../../src/utils/dependencies.js');
vi.mock('../../src/utils/files.js');
vi.mock('../../src/utils/logo.js');
vi.mock('../../src/utils/registry.js');

const mockReadFileSync = vi.mocked(readFileSync);
const mockWriteFileSync = vi.mocked(writeFileSync);
const mockJoin = vi.mocked(join);

describe('addCommand', () => {
  const mockConfig = {
    componentsDir: './src/components/ui',
    packageManager: 'npm',
  };

  const mockComponentManifest = {
    name: 'button',
    version: '1.0.0',
    dependencies: ['react', 'lucide-react'],
    files: [
      {
        path: 'button.tsx',
        type: 'registry:component',
        content: 'export default function Button() { return <button>Click me</button>; }',
      },
    ],
    meta: {
      rafters: {
        intelligence: {
          cognitiveLoad: 3,
          trustLevel: 'high',
          accessibilityLevel: 'AAA',
        },
        version: '1.0.0',
      },
    },
  };

  const mockSpinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
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

  it('should exit when no component names provided', async () => {
    await expect(addCommand([], {})).rejects.toThrow('process.exit(1)');
    expect(console.log).toHaveBeenCalledWith('No component names provided');
  });

  it('should parse component names from comma-separated string', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { default: ora } = await import('ora');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(mockComponentManifest);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);

    // Mock file operations
    const { fileExists, writeFile, createComponentPath } = await import('../../src/utils/files.js');
    const { installDependencies } = await import('../../src/utils/dependencies.js');

    vi.mocked(fileExists).mockReturnValue(false);
    vi.mocked(createComponentPath).mockReturnValue('./src/components/ui/button.tsx');
    vi.mocked(installDependencies).mockResolvedValue();

    // Mock manifest operations
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await addCommand(['button,input'], {});

    expect(fetchComponent).toHaveBeenCalledWith('button');
    expect(fetchComponent).toHaveBeenCalledWith('input');
  });

  it('should install single component successfully', async () => {
    const { loadConfig, transformImports } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fileExists, writeFile, createComponentPath } = await import('../../src/utils/files.js');
    const { installDependencies } = await import('../../src/utils/dependencies.js');
    const { default: ora } = await import('ora');

    // Setup mocks
    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(mockComponentManifest);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fileExists).mockReturnValue(false);
    vi.mocked(createComponentPath).mockReturnValue('./src/components/ui/button.tsx');
    vi.mocked(installDependencies).mockResolvedValue();
    vi.mocked(transformImports).mockReturnValue(
      'export default function Button() { return <button>Click me</button>; }'
    );

    // Mock manifest file operations
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await addCommand(['button'], {});

    // Verify component was fetched
    expect(fetchComponent).toHaveBeenCalledWith('button');

    // Verify dependencies were installed
    expect(installDependencies).toHaveBeenCalledWith(
      ['react', 'lucide-react'],
      'npm',
      '/test/project'
    );

    // Verify component file was written
    expect(writeFile).toHaveBeenCalledWith(
      '/test/project/./src/components/ui/button.tsx',
      expect.stringContaining('export default function Button()')
    );

    // Verify manifest was updated
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      '/test/project/.rafters/component-manifest.json',
      expect.stringContaining('"button"')
    );
  });

  it('should skip existing component without force flag', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fileExists, createComponentPath } = await import('../../src/utils/files.js');
    const { default: ora } = await import('ora');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(mockComponentManifest);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fileExists).mockReturnValue(true); // Component already exists
    vi.mocked(createComponentPath).mockReturnValue('./src/components/ui/button.tsx');

    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await expect(addCommand(['button'], {})).rejects.toThrow('process.exit(1)');

    expect(console.log).toHaveBeenCalledWith(
      "Component 'button' already exists at ./src/components/ui/button.tsx"
    );
    expect(console.log).toHaveBeenCalledWith('Use --force to overwrite existing components');
  });

  it('should overwrite existing component with force flag', async () => {
    const { loadConfig, transformImports } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fileExists, writeFile, createComponentPath } = await import('../../src/utils/files.js');
    const { installDependencies } = await import('../../src/utils/dependencies.js');
    const { default: ora } = await import('ora');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(mockComponentManifest);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fileExists).mockReturnValue(true); // Component exists
    vi.mocked(createComponentPath).mockReturnValue('./src/components/ui/button.tsx');
    vi.mocked(installDependencies).mockResolvedValue();
    vi.mocked(transformImports).mockReturnValue(
      'export default function Button() { return <button>Click me</button>; }'
    );

    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await addCommand(['button'], { force: true });

    // Should still write the file when force is true
    expect(writeFile).toHaveBeenCalled();
    expect(mockSpinner.succeed).toHaveBeenCalledWith('Existing button will be overwritten');
  });

  it('should handle component not found in registry', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { default: ora } = await import('ora');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(null); // Component not found
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);

    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await expect(addCommand(['nonexistent'], {})).rejects.toThrow('process.exit(1)');

    expect(mockSpinner.fail).toHaveBeenCalledWith("Component 'nonexistent' not found in registry");
  });

  it('should handle dependency installation failure gracefully', async () => {
    const { loadConfig } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fileExists, writeFile, createComponentPath } = await import('../../src/utils/files.js');
    const { installDependencies } = await import('../../src/utils/dependencies.js');
    const { default: ora } = await import('ora');

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(mockComponentManifest);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fileExists).mockReturnValue(false);
    vi.mocked(createComponentPath).mockReturnValue('./src/components/ui/button.tsx');
    vi.mocked(installDependencies).mockRejectedValue(new Error('Install failed'));

    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await addCommand(['button'], {});

    expect(mockSpinner.warn).toHaveBeenCalledWith(
      'Failed to install dependencies for button automatically'
    );
    expect(console.log).toHaveBeenCalledWith(
      'Please install manually: npm install react lucide-react'
    );

    // Should still write the component file
    expect(writeFile).toHaveBeenCalled();
  });

  it('should handle component missing intelligence metadata', async () => {
    const { loadConfig, transformImports } = await import('../../src/utils/config.js');
    const { fetchComponent } = await import('../../src/utils/registry.js');
    const { getRaftersTitle } = await import('../../src/utils/logo.js');
    const { fileExists, writeFile, createComponentPath } = await import('../../src/utils/files.js');
    const { installDependencies } = await import('../../src/utils/dependencies.js');
    const { default: ora } = await import('ora');

    const componentWithoutIntelligence = {
      ...mockComponentManifest,
      meta: {}, // Missing rafters intelligence metadata
    };

    vi.mocked(loadConfig).mockReturnValue(mockConfig);
    vi.mocked(fetchComponent).mockResolvedValue(componentWithoutIntelligence);
    vi.mocked(getRaftersTitle).mockReturnValue('RAFTERS TITLE');
    vi.mocked(ora).mockReturnValue(mockSpinner as ReturnType<typeof ora>);
    vi.mocked(fileExists).mockReturnValue(false);
    vi.mocked(createComponentPath).mockReturnValue('./src/components/ui/button.tsx');
    vi.mocked(installDependencies).mockResolvedValue();
    vi.mocked(transformImports).mockReturnValue(
      'export default function Button() { return <button>Click me</button>; }'
    );

    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({ version: '1.0.0', initialized: '2023-01-01', components: {} })
    );

    await expect(addCommand(['button'], {})).rejects.toThrow('process.exit(1)');

    // Verify the error was logged to console.error
    expect(console.error).toHaveBeenCalledWith('Error adding components:', expect.any(Error));
  });
});
