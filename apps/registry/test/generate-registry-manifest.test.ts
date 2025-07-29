import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

const scriptPath = path.resolve(__dirname, '../scripts/generate-registry-manifest.js');
const manifestPath = path.resolve(__dirname, '../registry-manifest.json');

const ComponentSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  content: z.string(),
  version: z.string(),
  status: z.enum(['published', 'draft', 'depreciated']),
});

const ManifestSchema = z.object({
  components: z.array(ComponentSchema),
  total: z.number(),
  lastUpdated: z.string(),
});

describe('generate-registry-manifest.js', () => {
  beforeEach(() => {
    if (fs.existsSync(manifestPath)) fs.unlinkSync(manifestPath);
  });

  it('generates a manifest file with published components only', () => {
    execSync(`node ${scriptPath}`);
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    expect(Array.isArray(manifest.components)).toBe(true);
    expect(
      manifest.components.every((c: z.infer<typeof ComponentSchema>) => c.status === 'published')
    ).toBe(true);
    expect(typeof manifest.total).toBe('number');
    expect(typeof manifest.lastUpdated).toBe('string');
  });

  it('includes status and version from story comments', () => {
    execSync(`node ${scriptPath}`);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    for (const comp of manifest.components) {
      expect(['published', 'draft', 'depreciated']).toContain(comp.status);
      expect(typeof comp.version).toBe('string');
    }
  });

  it('does not include draft or depreciated components', () => {
    execSync(`node ${scriptPath}`);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    expect(
      manifest.components.every((c: z.infer<typeof ComponentSchema>) => c.status === 'published')
    ).toBe(true);
  });

  it('sets total to the number of published components', () => {
    execSync(`node ${scriptPath}`);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    expect(manifest.total).toBe(manifest.components.length);
  });
});
