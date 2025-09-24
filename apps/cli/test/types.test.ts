/**
 * Test suite for CLI types
 * This file validates the type definitions and interfaces used throughout the CLI
 */

import { describe, expect, it } from 'vitest';
import type {
  CLIConfig,
  GenerateOptions,
  InitOptions,
  TokenFile,
  ValidateOptions,
  ValidationResult,
} from '../src/types.js';

describe('CLI types', () => {
  describe('CLIConfig interface', () => {
    it('should have required output property', () => {
      const config: CLIConfig = {
        output: './tokens',
        template: 'react',
        typescript: true,
      };

      expect(config.output).toBe('./tokens');
      expect(typeof config.output).toBe('string');
    });

    it('should have required template property', () => {
      const config: CLIConfig = {
        output: './tokens',
        template: 'vue',
        typescript: false,
      };

      expect(config.template).toBe('vue');
      expect(typeof config.template).toBe('string');
    });

    it('should have required typescript property', () => {
      const config: CLIConfig = {
        output: './tokens',
        template: 'react',
        typescript: true,
      };

      expect(config.typescript).toBe(true);
      expect(typeof config.typescript).toBe('boolean');
    });

    it('should allow optional colorApiUrl property', () => {
      const configWithUrl: CLIConfig = {
        output: './tokens',
        template: 'react',
        typescript: true,
        colorApiUrl: 'https://api.example.com',
      };

      const configWithoutUrl: CLIConfig = {
        output: './tokens',
        template: 'react',
        typescript: true,
      };

      expect(configWithUrl.colorApiUrl).toBe('https://api.example.com');
      expect(configWithoutUrl.colorApiUrl).toBeUndefined();
    });

    it('should work with all properties defined', () => {
      const fullConfig: CLIConfig = {
        output: './dist/tokens',
        colorApiUrl: 'https://colors.example.com/api',
        template: 'angular',
        typescript: false,
      };

      expect(fullConfig.output).toBe('./dist/tokens');
      expect(fullConfig.colorApiUrl).toBe('https://colors.example.com/api');
      expect(fullConfig.template).toBe('angular');
      expect(fullConfig.typescript).toBe(false);
    });
  });

  describe('GenerateOptions interface', () => {
    it('should have required output property', () => {
      const options: GenerateOptions = {
        output: './generated',
        config: './config.json',
      };

      expect(options.output).toBe('./generated');
      expect(typeof options.output).toBe('string');
    });

    it('should have required config property', () => {
      const options: GenerateOptions = {
        output: './tokens',
        config: './rafters.config.js',
      };

      expect(options.config).toBe('./rafters.config.js');
      expect(typeof options.config).toBe('string');
    });

    it('should allow optional colorApi property', () => {
      const withColorApi: GenerateOptions = {
        output: './tokens',
        config: './config.json',
        colorApi: 'https://color-api.com',
      };

      const withoutColorApi: GenerateOptions = {
        output: './tokens',
        config: './config.json',
      };

      expect(withColorApi.colorApi).toBe('https://color-api.com');
      expect(withoutColorApi.colorApi).toBeUndefined();
    });

    it('should work with minimal configuration', () => {
      const minimalOptions: GenerateOptions = {
        output: '.',
        config: 'config.json',
      };

      expect(minimalOptions.output).toBe('.');
      expect(minimalOptions.config).toBe('config.json');
      expect(minimalOptions.colorApi).toBeUndefined();
    });
  });

  describe('InitOptions interface', () => {
    it('should have required template property', () => {
      const options: InitOptions = {
        template: 'nextjs',
        typescript: true,
      };

      expect(options.template).toBe('nextjs');
      expect(typeof options.template).toBe('string');
    });

    it('should have required typescript property', () => {
      const options: InitOptions = {
        template: 'react',
        typescript: false,
      };

      expect(options.typescript).toBe(false);
      expect(typeof options.typescript).toBe('boolean');
    });

    it('should work with different template options', () => {
      const reactOptions: InitOptions = {
        template: 'react',
        typescript: true,
      };

      const vueOptions: InitOptions = {
        template: 'vue',
        typescript: false,
      };

      expect(reactOptions.template).toBe('react');
      expect(reactOptions.typescript).toBe(true);
      expect(vueOptions.template).toBe('vue');
      expect(vueOptions.typescript).toBe(false);
    });
  });

  describe('ValidateOptions interface', () => {
    it('should have required path property', () => {
      const options: ValidateOptions = {
        path: './tokens',
      };

      expect(options.path).toBe('./tokens');
      expect(typeof options.path).toBe('string');
    });

    it('should work with different path formats', () => {
      const absolutePath: ValidateOptions = {
        path: '/usr/local/tokens',
      };

      const relativePath: ValidateOptions = {
        path: '../tokens',
      };

      const currentPath: ValidateOptions = {
        path: '.',
      };

      expect(absolutePath.path).toBe('/usr/local/tokens');
      expect(relativePath.path).toBe('../tokens');
      expect(currentPath.path).toBe('.');
    });
  });

  describe('ValidationResult interface', () => {
    it('should have required valid property', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      };

      expect(result.valid).toBe(true);
      expect(typeof result.valid).toBe('boolean');
    });

    it('should have required errors array', () => {
      const result: ValidationResult = {
        valid: false,
        errors: ['Error 1', 'Error 2'],
        warnings: [],
      };

      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toBe('Error 1');
    });

    it('should have required warnings array', () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: ['Warning 1', 'Warning 2', 'Warning 3'],
      };

      expect(Array.isArray(result.warnings)).toBe(true);
      expect(result.warnings).toHaveLength(3);
      expect(result.warnings[0]).toBe('Warning 1');
    });

    it('should work with successful validation', () => {
      const successResult: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      };

      expect(successResult.valid).toBe(true);
      expect(successResult.errors).toHaveLength(0);
      expect(successResult.warnings).toHaveLength(0);
    });

    it('should work with failed validation', () => {
      const failedResult: ValidationResult = {
        valid: false,
        errors: ['Missing required property: name', 'Invalid token format'],
        warnings: ['Deprecated property used'],
      };

      expect(failedResult.valid).toBe(false);
      expect(failedResult.errors).toHaveLength(2);
      expect(failedResult.warnings).toHaveLength(1);
    });

    it('should work with warnings only', () => {
      const warningsOnlyResult: ValidationResult = {
        valid: true,
        errors: [],
        warnings: ['Consider using semantic naming', 'Missing intelligence metadata'],
      };

      expect(warningsOnlyResult.valid).toBe(true);
      expect(warningsOnlyResult.errors).toHaveLength(0);
      expect(warningsOnlyResult.warnings).toHaveLength(2);
    });
  });

  describe('TokenFile interface', () => {
    it('should have required name property', () => {
      const tokenFile: TokenFile = {
        name: 'colors',
        path: './colors.json',
        tokens: [],
        intelligence: {},
      };

      expect(tokenFile.name).toBe('colors');
      expect(typeof tokenFile.name).toBe('string');
    });

    it('should have required path property', () => {
      const tokenFile: TokenFile = {
        name: 'spacing',
        path: './tokens/spacing.json',
        tokens: [],
        intelligence: {},
      };

      expect(tokenFile.path).toBe('./tokens/spacing.json');
      expect(typeof tokenFile.path).toBe('string');
    });

    it('should have required tokens array', () => {
      const tokenFile: TokenFile = {
        name: 'typography',
        path: './typography.json',
        tokens: [
          { name: 'font-size-sm', value: '14px' },
          { name: 'font-size-lg', value: '18px' },
        ],
        intelligence: {},
      };

      expect(Array.isArray(tokenFile.tokens)).toBe(true);
      expect(tokenFile.tokens).toHaveLength(2);
    });

    it('should have required intelligence object', () => {
      const tokenFile: TokenFile = {
        name: 'colors',
        path: './colors.json',
        tokens: [],
        intelligence: {
          aiGenerated: true,
          cognitiveLoad: 2,
          semanticMeaning: 'Brand colors',
        },
      };

      expect(typeof tokenFile.intelligence).toBe('object');
      expect(tokenFile.intelligence.aiGenerated).toBe(true);
      expect(tokenFile.intelligence.cognitiveLoad).toBe(2);
    });

    it('should work with empty collections', () => {
      const emptyTokenFile: TokenFile = {
        name: 'empty',
        path: './empty.json',
        tokens: [],
        intelligence: {},
      };

      expect(emptyTokenFile.tokens).toHaveLength(0);
      expect(Object.keys(emptyTokenFile.intelligence)).toHaveLength(0);
    });

    it('should work with complex token data', () => {
      const complexTokenFile: TokenFile = {
        name: 'design-system',
        path: './design-system.json',
        tokens: [
          {
            name: 'primary-color',
            value: '#3b82f6',
            category: 'color',
            metadata: { ai: true },
          },
          {
            name: 'large-spacing',
            value: '2rem',
            category: 'spacing',
            metadata: { calculated: true },
          },
        ],
        intelligence: {
          totalTokens: 2,
          aiGenerated: true,
          categories: ['color', 'spacing'],
          version: '1.0.0',
        },
      };

      expect(complexTokenFile.tokens).toHaveLength(2);
      expect(complexTokenFile.intelligence.totalTokens).toBe(2);
      expect(Array.isArray(complexTokenFile.intelligence.categories)).toBe(true);
    });
  });

  describe('type compatibility and usage patterns', () => {
    it('should allow proper CLI workflow type flow', () => {
      // Simulate typical CLI usage flow
      const cliConfig: CLIConfig = {
        output: './tokens',
        template: 'react',
        typescript: true,
      };

      const initOptions: InitOptions = {
        template: cliConfig.template,
        typescript: cliConfig.typescript,
      };

      const generateOptions: GenerateOptions = {
        output: cliConfig.output,
        config: './rafters.config.json',
      };

      const validateOptions: ValidateOptions = {
        path: cliConfig.output,
      };

      expect(initOptions.template).toBe(cliConfig.template);
      expect(generateOptions.output).toBe(cliConfig.output);
      expect(validateOptions.path).toBe(cliConfig.output);
    });

    it('should support validation result processing', () => {
      const validationResult: ValidationResult = {
        valid: false,
        errors: ['Invalid token format'],
        warnings: ['Missing metadata'],
      };

      const hasErrors = validationResult.errors.length > 0;
      const hasWarnings = validationResult.warnings.length > 0;
      const isValid = validationResult.valid && !hasErrors;

      expect(hasErrors).toBe(true);
      expect(hasWarnings).toBe(true);
      expect(isValid).toBe(false);
    });

    it('should support token file processing', () => {
      const tokenFiles: TokenFile[] = [
        {
          name: 'colors',
          path: './colors.json',
          tokens: [{ name: 'primary', value: '#blue' }],
          intelligence: { category: 'color' },
        },
        {
          name: 'spacing',
          path: './spacing.json',
          tokens: [{ name: 'small', value: '8px' }],
          intelligence: { category: 'spacing' },
        },
      ];

      const totalTokens = tokenFiles.reduce((sum, file) => sum + file.tokens.length, 0);

      expect(totalTokens).toBe(2);
      expect(tokenFiles).toHaveLength(2);
    });
  });

  describe('type constraints and validation', () => {
    it('should enforce string types for paths and names', () => {
      const validatePath = (path: string) => typeof path === 'string';
      const validateName = (name: string) => typeof name === 'string';

      const options: ValidateOptions = { path: './tokens' };
      const tokenFile: TokenFile = {
        name: 'test',
        path: './test.json',
        tokens: [],
        intelligence: {},
      };

      expect(validatePath(options.path)).toBe(true);
      expect(validateName(tokenFile.name)).toBe(true);
    });

    it('should enforce boolean types where required', () => {
      const validateBoolean = (value: boolean) => typeof value === 'boolean';

      const cliConfig: CLIConfig = {
        output: './tokens',
        template: 'react',
        typescript: true,
      };

      const initOptions: InitOptions = {
        template: 'vue',
        typescript: false,
      };

      expect(validateBoolean(cliConfig.typescript)).toBe(true);
      expect(validateBoolean(initOptions.typescript)).toBe(true);
    });

    it('should enforce array types for collections', () => {
      const validateArray = (value: unknown[]) => Array.isArray(value);

      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: ['test'],
      };

      const tokenFile: TokenFile = {
        name: 'test',
        path: './test.json',
        tokens: [{ name: 'token1' }],
        intelligence: {},
      };

      expect(validateArray(result.errors)).toBe(true);
      expect(validateArray(result.warnings)).toBe(true);
      expect(validateArray(tokenFile.tokens)).toBe(true);
    });
  });
});
