import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getOutputFilePath, getRaftersPaths, getTokenFilePath } from '../../src/utils/paths.js';

describe('getRaftersPaths', () => {
  it('should return correct paths for project root', () => {
    const projectRoot = '/home/user/my-project';
    const paths = getRaftersPaths(projectRoot);

    expect(paths.root).toBe(join(projectRoot, '.rafters'));
    expect(paths.config).toBe(join(projectRoot, '.rafters', 'config.rafters.json'));
    expect(paths.tokens).toBe(join(projectRoot, '.rafters', 'tokens'));
    expect(paths.output).toBe(join(projectRoot, '.rafters', 'output'));
  });

  it('should handle paths with trailing slash', () => {
    const projectRoot = '/home/user/my-project/';
    const paths = getRaftersPaths(projectRoot);

    expect(paths.root).toBe(join(projectRoot, '.rafters'));
  });

  it('should handle relative paths', () => {
    const projectRoot = './my-project';
    const paths = getRaftersPaths(projectRoot);

    expect(paths.root).toBe(join(projectRoot, '.rafters'));
    expect(paths.tokens).toBe(join(projectRoot, '.rafters', 'tokens'));
  });
});

describe('getTokenFilePath', () => {
  it('should return correct token file path for namespace', () => {
    const projectRoot = '/home/user/my-project';

    expect(getTokenFilePath(projectRoot, 'color')).toBe(
      join(projectRoot, '.rafters', 'tokens', 'color.rafters.json'),
    );
    expect(getTokenFilePath(projectRoot, 'spacing')).toBe(
      join(projectRoot, '.rafters', 'tokens', 'spacing.rafters.json'),
    );
    expect(getTokenFilePath(projectRoot, 'typography')).toBe(
      join(projectRoot, '.rafters', 'tokens', 'typography.rafters.json'),
    );
  });
});

describe('getOutputFilePath', () => {
  it('should return correct output file paths', () => {
    const projectRoot = '/home/user/my-project';

    expect(getOutputFilePath(projectRoot, 'theme.css')).toBe(
      join(projectRoot, '.rafters', 'output', 'theme.css'),
    );
    expect(getOutputFilePath(projectRoot, 'tokens.json')).toBe(
      join(projectRoot, '.rafters', 'output', 'tokens.json'),
    );
    expect(getOutputFilePath(projectRoot, 'tokens.ts')).toBe(
      join(projectRoot, '.rafters', 'output', 'tokens.ts'),
    );
  });
});
