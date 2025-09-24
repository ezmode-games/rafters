/**
 * Test suite for files utility
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';

// Type definitions for mocked functions
type MockedExistsSync = MockedFunction<typeof existsSync>;
type MockedMkdirSync = MockedFunction<typeof mkdirSync>;
type MockedReadFileSync = MockedFunction<typeof readFileSync>;
type MockedWriteFileSync = MockedFunction<typeof writeFileSync>;
type MockedDirname = MockedFunction<typeof dirname>;
type MockedJoin = MockedFunction<typeof join>;

import {
  createComponentPath,
  ensureDir,
  fileExists,
  readFile,
  writeFile,
} from '../../src/utils/files.js';

// Mock Node.js fs module
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

// Mock Node.js path module
vi.mock('node:path', () => ({
  dirname: vi.fn(),
  join: vi.fn(),
}));

describe('files utility', () => {
  let mockExistsSync: MockedExistsSync;
  let mockMkdirSync: MockedMkdirSync;
  let mockReadFileSync: MockedReadFileSync;
  let mockWriteFileSync: MockedWriteFileSync;
  let mockDirname: MockedDirname;
  let mockJoin: MockedJoin;

  beforeEach(() => {
    mockExistsSync = vi.mocked(existsSync);
    mockMkdirSync = vi.mocked(mkdirSync);
    mockReadFileSync = vi.mocked(readFileSync);
    mockWriteFileSync = vi.mocked(writeFileSync);
    mockDirname = vi.mocked(dirname);
    mockJoin = vi.mocked(join);

    // Reset all mocks
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ensureDir', () => {
    it('should create directory when it does not exist', () => {
      const filePath = '/path/to/file.txt';
      const dirPath = '/path/to';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(false);

      ensureDir(filePath);

      expect(mockDirname).toHaveBeenCalledWith(filePath);
      expect(mockExistsSync).toHaveBeenCalledWith(dirPath);
      expect(mockMkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
    });

    it('should not create directory when it already exists', () => {
      const filePath = '/path/to/file.txt';
      const dirPath = '/path/to';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(true);

      ensureDir(filePath);

      expect(mockDirname).toHaveBeenCalledWith(filePath);
      expect(mockExistsSync).toHaveBeenCalledWith(dirPath);
      expect(mockMkdirSync).not.toHaveBeenCalled();
    });

    it('should handle root directory paths', () => {
      const filePath = '/file.txt';
      const dirPath = '/';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(true);

      ensureDir(filePath);

      expect(mockDirname).toHaveBeenCalledWith(filePath);
      expect(mockExistsSync).toHaveBeenCalledWith(dirPath);
    });

    it('should handle deeply nested paths', () => {
      const filePath = '/very/deep/nested/path/file.txt';
      const dirPath = '/very/deep/nested/path';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(false);

      ensureDir(filePath);

      expect(mockMkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
    });
  });

  describe('writeFile', () => {
    it('should ensure directory exists and write file', () => {
      const filePath = '/path/to/file.txt';
      const content = 'Hello, World!';
      const dirPath = '/path/to';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(true); // Directory exists

      writeFile(filePath, content);

      expect(mockDirname).toHaveBeenCalledWith(filePath);
      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });

    it('should create directory and write file when directory does not exist', () => {
      const filePath = '/new/path/file.txt';
      const content = 'New file content';
      const dirPath = '/new/path';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(false); // Directory doesn't exist

      writeFile(filePath, content);

      expect(mockMkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });

    it('should handle empty content', () => {
      const filePath = '/path/empty.txt';
      const content = '';
      const dirPath = '/path';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(true);

      writeFile(filePath, content);

      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, '', 'utf-8');
    });

    it('should handle unicode content', () => {
      const filePath = '/path/unicode.txt';
      const content = '🚀 Hello, 世界! 🌍';
      const dirPath = '/path';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(true);

      writeFile(filePath, content);

      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', () => {
      const filePath = '/path/to/existing-file.txt';
      mockExistsSync.mockReturnValue(true);

      const result = fileExists(filePath);

      expect(result).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith(filePath);
    });

    it('should return false when file does not exist', () => {
      const filePath = '/path/to/non-existing-file.txt';
      mockExistsSync.mockReturnValue(false);

      const result = fileExists(filePath);

      expect(result).toBe(false);
      expect(mockExistsSync).toHaveBeenCalledWith(filePath);
    });

    it('should handle directory paths', () => {
      const dirPath = '/path/to/directory';
      mockExistsSync.mockReturnValue(true);

      const result = fileExists(dirPath);

      expect(result).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith(dirPath);
    });
  });

  describe('readFile', () => {
    it('should read file content with utf-8 encoding', () => {
      const filePath = '/path/to/file.txt';
      const expectedContent = 'File content here';

      mockReadFileSync.mockReturnValue(expectedContent);

      const result = readFile(filePath);

      expect(result).toBe(expectedContent);
      expect(mockReadFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should handle empty files', () => {
      const filePath = '/path/to/empty.txt';
      const expectedContent = '';

      mockReadFileSync.mockReturnValue(expectedContent);

      const result = readFile(filePath);

      expect(result).toBe(expectedContent);
      expect(mockReadFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should handle files with unicode content', () => {
      const filePath = '/path/to/unicode.txt';
      const expectedContent = '🎉 Unicode content! 中文 العربية';

      mockReadFileSync.mockReturnValue(expectedContent);

      const result = readFile(filePath);

      expect(result).toBe(expectedContent);
      expect(mockReadFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should handle large files', () => {
      const filePath = '/path/to/large.txt';
      const expectedContent = 'x'.repeat(10000); // Large content

      mockReadFileSync.mockReturnValue(expectedContent);

      const result = readFile(filePath);

      expect(result).toBe(expectedContent);
      expect(mockReadFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });
  });

  describe('createComponentPath', () => {
    it('should create correct component path', () => {
      const componentsDir = '/src/components/ui';
      const componentName = 'button';
      const expectedPath = '/src/components/ui/button.tsx';

      mockJoin.mockReturnValue(expectedPath);

      const result = createComponentPath(componentsDir, componentName);

      expect(result).toBe(expectedPath);
      expect(mockJoin).toHaveBeenCalledWith(componentsDir, 'button.tsx');
    });

    it('should handle component names with special characters', () => {
      const componentsDir = './components';
      const componentName = 'alert-dialog';
      const expectedPath = './components/alert-dialog.tsx';

      mockJoin.mockReturnValue(expectedPath);

      const result = createComponentPath(componentsDir, componentName);

      expect(result).toBe(expectedPath);
      expect(mockJoin).toHaveBeenCalledWith(componentsDir, 'alert-dialog.tsx');
    });

    it('should handle absolute component directory paths', () => {
      const componentsDir = '/absolute/path/components';
      const componentName = 'card';
      const expectedPath = '/absolute/path/components/card.tsx';

      mockJoin.mockReturnValue(expectedPath);

      const result = createComponentPath(componentsDir, componentName);

      expect(result).toBe(expectedPath);
      expect(mockJoin).toHaveBeenCalledWith(componentsDir, 'card.tsx');
    });

    it('should handle relative component directory paths', () => {
      const componentsDir = '../ui/components';
      const componentName = 'input';
      const expectedPath = '../ui/components/input.tsx';

      mockJoin.mockReturnValue(expectedPath);

      const result = createComponentPath(componentsDir, componentName);

      expect(result).toBe(expectedPath);
      expect(mockJoin).toHaveBeenCalledWith(componentsDir, 'input.tsx');
    });

    it('should always append .tsx extension', () => {
      const componentsDir = '/components';
      const componentName = 'some-component-name';
      const expectedPath = '/components/some-component-name.tsx';

      mockJoin.mockReturnValue(expectedPath);

      const result = createComponentPath(componentsDir, componentName);

      expect(result).toBe(expectedPath);
      expect(mockJoin).toHaveBeenCalledWith(componentsDir, 'some-component-name.tsx');
    });
  });

  describe('error handling', () => {
    it('should propagate mkdirSync errors', () => {
      const filePath = '/protected/file.txt';
      const dirPath = '/protected';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(false);
      mockMkdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      expect(() => ensureDir(filePath)).toThrow('Permission denied');
    });

    it('should propagate writeFileSync errors', () => {
      const filePath = '/readonly/file.txt';
      const content = 'test content';
      const dirPath = '/readonly';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(true);
      mockWriteFileSync.mockImplementation(() => {
        throw new Error('Read-only file system');
      });

      expect(() => writeFile(filePath, content)).toThrow('Read-only file system');
    });

    it('should propagate readFileSync errors', () => {
      const filePath = '/nonexistent/file.txt';

      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => readFile(filePath)).toThrow('File not found');
    });

    it('should propagate existsSync errors gracefully', () => {
      const filePath = '/invalid/file.txt';

      mockExistsSync.mockImplementation(() => {
        throw new Error('Invalid path');
      });

      expect(() => fileExists(filePath)).toThrow('Invalid path');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete file write workflow', () => {
      const filePath = '/new/project/component.tsx';
      const content = 'export const Component = () => <div />;';
      const dirPath = '/new/project';

      mockDirname.mockReturnValue(dirPath);
      mockExistsSync.mockReturnValue(false); // Directory doesn't exist
      mockJoin.mockReturnValue(filePath);

      // Write file (includes directory creation)
      writeFile(filePath, content);

      expect(mockMkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });

    it('should handle file existence check and read workflow', () => {
      const filePath = '/existing/file.txt';
      const fileContent = 'existing content';

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(fileContent);

      // Check if file exists
      const exists = fileExists(filePath);
      expect(exists).toBe(true);

      // Read file content
      const content = readFile(filePath);
      expect(content).toBe(fileContent);
    });
  });
});
