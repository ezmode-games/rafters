import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createComponentPath,
  createStoryPath,
  ensureDir,
  fileExists,
  writeFile,
} from '../../src/utils/files.js';

// Mock file system operations
vi.mock('node:fs');
const mockExistsSync = vi.mocked(existsSync);
const mockMkdirSync = vi.mocked(mkdirSync);
const mockWriteFileSync = vi.mocked(writeFileSync);

describe('files', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createComponentPath', () => {
    it('should create correct component path', () => {
      const result = createComponentPath('src/components', 'button');
      expect(result).toBe(join('src/components', 'button.tsx'));
    });

    it('should handle different component names', () => {
      expect(createComponentPath('components', 'input')).toBe(join('components', 'input.tsx'));
      expect(createComponentPath('./lib', 'card')).toBe(join('./lib', 'card.tsx'));
    });

    it('should normalize paths correctly', () => {
      expect(createComponentPath('src/components/', 'button')).toBe(
        join('src/components', 'button.tsx')
      );
      expect(createComponentPath('src\\components', 'button')).toBe(
        join('src\\components', 'button.tsx')
      );
    });
  });

  describe('createStoryPath', () => {
    it('should create correct story path', () => {
      const result = createStoryPath('src/stories', 'Button');
      expect(result).toBe(join('src/stories', 'button-intelligence.stories.tsx'));
    });

    it('should handle lowercase component names', () => {
      expect(createStoryPath('./stories', 'input')).toBe(
        join('./stories', 'input-intelligence.stories.tsx')
      );
    });
  });

  describe('ensureDir', () => {
    it('should not create directory if parent exists', () => {
      mockExistsSync.mockReturnValue(true);

      ensureDir('/existing/dir/file.txt');

      expect(mockExistsSync).toHaveBeenCalledWith('/existing/dir');
      expect(mockMkdirSync).not.toHaveBeenCalled();
    });

    it('should create directory if parent does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      ensureDir('/new/dir/file.txt');

      expect(mockExistsSync).toHaveBeenCalledWith('/new/dir');
      expect(mockMkdirSync).toHaveBeenCalledWith('/new/dir', {
        recursive: true,
      });
    });

    it('should handle nested directory creation', () => {
      mockExistsSync.mockReturnValue(false);

      ensureDir('/very/deep/nested/dir/file.txt');

      expect(mockMkdirSync).toHaveBeenCalledWith('/very/deep/nested/dir', {
        recursive: true,
      });
    });
  });

  describe('writeFile', () => {
    it('should write file with ensured directory', () => {
      const filePath = '/components/ui/button.tsx';
      const content = 'export const Button = () => <button>Click</button>;';
      mockExistsSync.mockReturnValue(true); // Directory exists

      writeFile(filePath, content);

      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });

    it('should create directory if it does not exist', () => {
      const filePath = '/new/components/ui/button.tsx';
      const content = 'export const Button = () => <button>Click</button>;';
      mockExistsSync.mockReturnValue(false); // Directory doesn't exist

      writeFile(filePath, content);

      expect(mockMkdirSync).toHaveBeenCalledWith(dirname(filePath), {
        recursive: true,
      });
      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });

    it('should handle Windows-style paths', () => {
      const filePath = 'C:\\components\\ui\\button.tsx';
      const content = 'export const Button = () => <button>Click</button>;';
      mockExistsSync.mockReturnValue(true);

      writeFile(filePath, content);

      expect(mockWriteFileSync).toHaveBeenCalledWith(filePath, content, 'utf-8');
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', () => {
      mockExistsSync.mockReturnValue(true);

      const result = fileExists('/path/to/file.txt');

      expect(result).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith('/path/to/file.txt');
    });

    it('should return false when file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const result = fileExists('/path/to/missing.txt');

      expect(result).toBe(false);
      expect(mockExistsSync).toHaveBeenCalledWith('/path/to/missing.txt');
    });
  });
});
