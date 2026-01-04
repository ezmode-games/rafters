/**
 * Registry fixtures generated from Zod schemas using zocker
 */

import { zocker } from 'zocker';
import {
  RegistryFileSchema,
  RegistryIndexSchema,
  RegistryItemSchema,
} from '../../src/registry/types.js';

// Create base generators with seed for reproducibility
const registryFileGenerator = zocker(RegistryFileSchema).setSeed(42);
const registryItemGenerator = zocker(RegistryItemSchema).setSeed(42);
const registryIndexGenerator = zocker(RegistryIndexSchema).setSeed(42);

/**
 * Generate a registry file fixture
 */
export function createRegistryFile(
  overrides: Partial<ReturnType<typeof registryFileGenerator.generate>> = {},
) {
  return {
    ...registryFileGenerator.generate(),
    ...overrides,
  };
}

/**
 * Generate a registry item fixture
 */
export function createRegistryItem(
  overrides: Partial<ReturnType<typeof registryItemGenerator.generate>> = {},
) {
  const generated = registryItemGenerator.generate();
  return {
    ...generated,
    // Ensure files array is present if not overridden
    files: generated.files || [],
    dependencies: generated.dependencies || [],
    ...overrides,
  };
}

/**
 * Generate a registry index fixture
 */
export function createRegistryIndex(
  overrides: Partial<ReturnType<typeof registryIndexGenerator.generate>> = {},
) {
  return {
    ...registryIndexGenerator.generate(),
    ...overrides,
  };
}

// Pre-defined component fixtures for common test cases
export const registryFixtures = {
  /**
   * Button component with classy primitive dependency
   */
  buttonComponent: () =>
    createRegistryItem({
      name: 'button',
      type: 'registry:ui',
      dependencies: ['react'],
      registryDependencies: ['classy'],
      files: [
        createRegistryFile({
          path: 'components/ui/button.tsx',
          content: `import classy from '../../primitives/classy';
export const Button = () => <button>Click me</button>;`,
          type: 'registry:ui',
        }),
      ],
    }),

  /**
   * Classy primitive (class name utility)
   */
  classyPrimitive: () =>
    createRegistryItem({
      name: 'classy',
      type: 'registry:primitive',
      dependencies: [],
      files: [
        createRegistryFile({
          path: 'lib/primitives/classy.ts',
          content: `export default function classy(...classes: string[]) { return classes.filter(Boolean).join(' '); }`,
          type: 'registry:primitive',
        }),
      ],
    }),

  /**
   * Card component (no dependencies)
   */
  cardComponent: () =>
    createRegistryItem({
      name: 'card',
      type: 'registry:ui',
      dependencies: ['react'],
      files: [
        createRegistryFile({
          path: 'components/ui/card.tsx',
          content: `export const Card = () => <div>Card</div>;`,
          type: 'registry:ui',
        }),
      ],
    }),

  /**
   * Dialog component with external npm dependency
   */
  dialogComponent: () =>
    createRegistryItem({
      name: 'dialog',
      type: 'registry:ui',
      dependencies: ['react', '@radix-ui/react-dialog'],
      registryDependencies: ['classy'],
      files: [
        createRegistryFile({
          path: 'components/ui/dialog.tsx',
          content: `import * as DialogPrimitive from '@radix-ui/react-dialog';
export const Dialog = DialogPrimitive.Root;`,
          type: 'registry:ui',
        }),
      ],
    }),

  /**
   * Registry index for testing
   */
  registryIndex: () =>
    createRegistryIndex({
      name: 'rafters',
      homepage: 'https://rafters.studio',
      components: ['button', 'card', 'dialog'],
      primitives: ['classy'],
    }),
};
