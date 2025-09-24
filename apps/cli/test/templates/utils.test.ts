/**
 * Test suite for template utils
 */

import type { clsx } from 'clsx';
import type { twMerge } from 'tailwind-merge';
import { describe, expect, it, type MockedFunction, vi } from 'vitest';
import { cn } from '../../src/templates/utils.js';

// Mock dependencies
vi.mock('clsx', () => ({
  clsx: vi.fn(),
}));

vi.mock('tailwind-merge', () => ({
  twMerge: vi.fn(),
}));

// Type definitions for mocked functions
type MockedClsx = MockedFunction<typeof clsx>;
type MockedTwMerge = MockedFunction<typeof twMerge>;

describe('template utils', () => {
  let mockClsx: MockedClsx;
  let mockTwMerge: MockedTwMerge;

  beforeEach(async () => {
    const { clsx } = await import('clsx');
    const { twMerge } = await import('tailwind-merge');
    mockClsx = vi.mocked(clsx);
    mockTwMerge = vi.mocked(twMerge);

    // Reset mocks
    vi.resetAllMocks();
  });

  describe('cn function', () => {
    it('should call clsx with provided inputs and pass result to twMerge', () => {
      const inputs = ['class1', 'class2', { class3: true }];
      const clsxResult = 'class1 class2 class3';
      const mergedResult = 'class1 class2 class3';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle empty input', () => {
      const clsxResult = '';
      const mergedResult = '';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn();

      expect(mockClsx).toHaveBeenCalledWith([]);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle single string input', () => {
      const input = 'single-class';
      const clsxResult = 'single-class';
      const mergedResult = 'single-class';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(input);

      expect(mockClsx).toHaveBeenCalledWith([input]);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle multiple string inputs', () => {
      const inputs = ['class1', 'class2', 'class3'];
      const clsxResult = 'class1 class2 class3';
      const mergedResult = 'class1 class2 class3';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle conditional object inputs', () => {
      const inputs = [
        'base-class',
        { 'conditional-class': true, 'disabled-class': false },
        'another-class',
      ];
      const clsxResult = 'base-class conditional-class another-class';
      const mergedResult = 'base-class conditional-class another-class';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle array inputs', () => {
      const inputs = [['class1', 'class2'], 'class3'];
      const clsxResult = 'class1 class2 class3';
      const mergedResult = 'class1 class2 class3';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle null and undefined inputs', () => {
      const inputs = ['class1', null, undefined, 'class2'];
      const clsxResult = 'class1 class2';
      const mergedResult = 'class1 class2';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should handle Tailwind class conflicts with twMerge', () => {
      const inputs = ['p-4', 'p-2']; // Conflicting padding classes
      const clsxResult = 'p-4 p-2';
      const mergedResult = 'p-2'; // twMerge should resolve conflicts

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should preserve function parameter spreading', () => {
      // Test that the function properly spreads parameters to clsx
      const input1 = 'class1';
      const input2 = { class2: true };
      const input3 = ['class3', 'class4'];

      const clsxResult = 'class1 class2 class3 class4';
      const mergedResult = 'class1 class2 class3 class4';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(input1, input2, input3);

      expect(mockClsx).toHaveBeenCalledWith([input1, input2, input3]);
      expect(result).toBe(mergedResult);
    });

    it('should handle large number of inputs', () => {
      const inputs = Array.from({ length: 100 }, (_, i) => `class${i}`);
      const clsxResult = inputs.join(' ');
      const mergedResult = clsxResult;

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(mockTwMerge).toHaveBeenCalledWith(clsxResult);
      expect(result).toBe(mergedResult);
    });

    it('should maintain proper call order (clsx before twMerge)', () => {
      const callOrder: string[] = [];

      mockClsx.mockImplementation((_inputs) => {
        callOrder.push('clsx');
        return 'clsx-result';
      });

      mockTwMerge.mockImplementation((_classes) => {
        callOrder.push('twMerge');
        return 'merged-result';
      });

      cn('test-class');

      expect(callOrder).toEqual(['clsx', 'twMerge']);
    });

    it('should handle special characters in class names', () => {
      const inputs = ['class-with-dashes', 'class_with_underscores', 'class:with:colons'];
      const clsxResult = inputs.join(' ');
      const mergedResult = clsxResult;

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(...inputs);

      expect(mockClsx).toHaveBeenCalledWith(inputs);
      expect(result).toBe(mergedResult);
    });
  });

  describe('error handling', () => {
    it('should propagate clsx errors', () => {
      mockClsx.mockImplementation(() => {
        throw new Error('clsx error');
      });

      expect(() => cn('test')).toThrow('clsx error');
    });

    it('should propagate twMerge errors', () => {
      mockClsx.mockReturnValue('test-class');
      mockTwMerge.mockImplementation(() => {
        throw new Error('twMerge error');
      });

      expect(() => cn('test')).toThrow('twMerge error');
    });
  });

  describe('integration patterns', () => {
    it('should work with typical component className patterns', () => {
      // Simulate typical React component usage
      const baseClasses = 'flex items-center justify-center';
      const conditionalClasses = { 'bg-blue-500': true, 'text-white': false };
      const propsClasses = 'hover:bg-blue-600';

      const clsxResult = 'flex items-center justify-center bg-blue-500 hover:bg-blue-600';
      const mergedResult = 'flex items-center justify-center bg-blue-500 hover:bg-blue-600';

      mockClsx.mockReturnValue(clsxResult);
      mockTwMerge.mockReturnValue(mergedResult);

      const result = cn(baseClasses, conditionalClasses, propsClasses);

      expect(result).toBe(mergedResult);
    });

    it('should handle variant-based styling patterns', () => {
      // Simulate component variant patterns
      const baseStyles = 'px-4 py-2 rounded';
      const variantStyles = { 'bg-primary text-primary-foreground': true };
      const sizeStyles = 'h-10 px-6';

      mockClsx.mockReturnValue('px-4 py-2 rounded bg-primary text-primary-foreground h-10 px-6');
      mockTwMerge.mockReturnValue('py-2 rounded bg-primary text-primary-foreground h-10 px-6'); // Merged conflicts

      const _result = cn(baseStyles, variantStyles, sizeStyles);

      expect(mockTwMerge).toHaveBeenCalled();
    });
  });
});
