import { describe, expect, it } from 'vitest';
import { getComponentTemplate } from '../../src/utils/component-templates.js';
import type { ComponentManifest } from '../../src/utils/registry.js';

describe('component-templates', () => {
  const mockIntelligence = {
    cognitiveLoad: 3,
    attentionEconomics: 'Size hierarchy: sm=tertiary, md=secondary, lg=primary',
    accessibility: 'WCAG AAA compliant',
    trustBuilding: 'Destructive actions require confirmation',
    semanticMeaning: 'Primary=main actions',
  };

  describe('getComponentTemplate', () => {
    it('should prioritize registry content over generated templates', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [
          {
            path: 'ui/button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button>Registry Button</button>;',
          },
        ],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toBe('export const Button = () => <button>Registry Button</button>;');
    });

    it('should ignore empty registry content', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [
          {
            path: 'ui/button.tsx',
            type: 'registry:component',
            content: '',
          },
        ],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Button Intelligence: cognitiveLoad=3');
      expect(result).toContain('export const Button');
    });

    it('should ignore story files when finding component content', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [
          {
            path: 'ui/button.stories.tsx',
            type: 'registry:component',
            content: 'export default { title: "Button" };',
          },
          {
            path: 'ui/button.tsx',
            type: 'registry:component',
            content: 'export const Button = () => <button>Real Button</button>;',
          },
        ],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toBe('export const Button = () => <button>Real Button</button>;');
    });

    it('should generate button template when no registry content', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Button Intelligence: cognitiveLoad=3');
      expect(result).toContain('Size hierarchy: sm=tertiary, md=secondary, lg=primary');
      expect(result).toContain('WCAG AAA compliant');
      expect(result).toContain('Destructive actions require confirmation');
      expect(result).toContain('export const Button');
      expect(result).toContain('variant?:');
      expect(result).toContain('size?:');
    });

    it('should generate input template', () => {
      const manifest: ComponentManifest = {
        name: 'input',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Input Intelligence: cognitiveLoad=3');
      expect(result).toContain('export const Input');
      expect(result).toContain('variant?:');
      expect(result).toContain("aria-invalid={variant === 'error'}");
      expect(result).toContain(
        "aria-describedby={variant === 'error' ? 'error-message' : undefined}"
      );
    });

    it('should generate card template', () => {
      const manifest: ComponentManifest = {
        name: 'card',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Card Intelligence: cognitiveLoad=3');
      expect(result).toContain('export const Card');
      expect(result).toContain('export const CardHeader');
      expect(result).toContain('export const CardContent');
      expect(result).toContain('export const CardFooter');
    });

    it('should generate select template', () => {
      const manifest: ComponentManifest = {
        name: 'select',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Select Intelligence: cognitiveLoad=3');
      expect(result).toContain('export {');
      expect(result).toContain('Select,');
      expect(result).toContain('SelectContent,');
      expect(result).toContain('SelectItem,');
    });

    it('should generate dialog template', () => {
      const manifest: ComponentManifest = {
        name: 'dialog',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Dialog Intelligence: cognitiveLoad=3');
      expect(result).toContain('export {');
      expect(result).toContain('Dialog,');
      expect(result).toContain('DialogContent,');
      expect(result).toContain('DialogHeader,');
    });

    it('should generate label template', () => {
      const manifest: ComponentManifest = {
        name: 'label',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Label Intelligence: cognitiveLoad=3');
      expect(result).toContain('export { Label }');
      expect(result).toContain('variant?:');
    });

    it('should generate tabs template', () => {
      const manifest: ComponentManifest = {
        name: 'tabs',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Tabs Intelligence: cognitiveLoad=3');
      expect(result).toContain('export { Tabs, TabsList, TabsTrigger, TabsContent }');
    });

    it('should throw error for unsupported component', () => {
      const manifest: ComponentManifest = {
        name: 'unsupported',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      expect(() => getComponentTemplate(manifest)).toThrow(
        'No template available for component: unsupported'
      );
    });

    it('should throw error when intelligence metadata missing', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [],
        meta: undefined,
      };

      expect(() => getComponentTemplate(manifest)).toThrow(
        'Component manifest missing rafters intelligence metadata'
      );
    });

    it('should handle case-insensitive component names', () => {
      const manifest: ComponentManifest = {
        name: 'BUTTON',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('Button Intelligence: cognitiveLoad=3');
      expect(result).toContain('export const Button');
    });

    it('should include all accessibility features in button template', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('aria-busy={loading}');
      expect(result).toContain('disabled={isInteractionDisabled}');
      expect(result).toContain('destructiveConfirm');
      expect(result).toContain('shouldShowConfirmation');
    });

    it('should include semantic tokens in templates', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('bg-primary');
      expect(result).toContain('text-primary-foreground');
      expect(result).toContain('bg-destructive');
      expect(result).toContain('text-destructive-foreground');
    });

    it('should include trust-building features in destructive actions', () => {
      const manifest: ComponentManifest = {
        name: 'button',
        type: 'registry:component',
        files: [],
        meta: {
          rafters: {
            intelligence: mockIntelligence,
          },
        },
      };

      const result = getComponentTemplate(manifest);
      expect(result).toContain('isDestructiveAction');
      expect(result).toContain('shouldShowConfirmation');
      expect(result).toContain('Confirm to');
      expect(result).toContain('font-semibold shadow-sm');
    });
  });
});
