/**
 * Component Service Tests
 */

import { describe, expect, it } from 'vitest';
import {
  getComponent,
  getRegistryMetadata,
  loadComponents,
} from '../../../src/lib/registry/componentService';

describe('componentService', () => {
  describe('loadComponents', () => {
    it('should load components from UI package', async () => {
      const components = await loadComponents();

      expect(components).toBeDefined();
      expect(Array.isArray(components)).toBe(true);
      expect(components.length).toBeGreaterThan(0);
    });

    it('should parse Button component', async () => {
      const components = await loadComponents();
      const button = components.find((c) => c.name === 'button');

      expect(button).toBeDefined();
      expect(button?.name).toBe('button');
      expect(button?.type).toBe('registry:component');
      expect(button?.files).toBeDefined();
      expect(button?.files.length).toBeGreaterThan(0);
    });

    it('should include meta.rafters with intelligence', async () => {
      const components = await loadComponents();
      const button = components.find((c) => c.name === 'button');

      expect(button?.meta?.rafters).toBeDefined();
      expect(button?.meta?.rafters.intelligence).toBeDefined();
    });

    it('should include meta.rafters.previews', async () => {
      const components = await loadComponents();
      const button = components.find((c) => c.name === 'button');

      expect(button?.meta?.rafters?.previews).toBeDefined();
      expect(Array.isArray(button?.meta?.rafters?.previews)).toBe(true);
    });

    it('should extract CVA data for Button', async () => {
      const components = await loadComponents();
      const button = components.find((c) => c.name === 'button');

      expect(button?.meta?.rafters?.intelligence?.cva).toBeDefined();
      expect(button?.meta?.rafters?.intelligence?.cva?.baseClasses).toBeDefined();
      expect(button?.meta?.rafters?.intelligence?.cva?.baseClasses.length).toBeGreaterThan(0);
    });
  });

  describe('getComponent', () => {
    it('should get component by name', async () => {
      const button = await getComponent('button');

      expect(button).toBeDefined();
      expect(button?.name).toBe('button');
    });

    it('should return null for non-existent component', async () => {
      const component = await getComponent('nonexistent');

      expect(component).toBeNull();
    });
  });

  describe('getRegistryMetadata', () => {
    it('should return metadata with components', async () => {
      const metadata = await getRegistryMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.components).toBeDefined();
      expect(Array.isArray(metadata.components)).toBe(true);
    });
  });
});
