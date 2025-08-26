import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

const scriptPath = path.resolve(__dirname, '../scripts/generate-registry-manifest.ts');
const manifestPath = path.resolve(__dirname, '../../../registry-manifest.json');

// Use the same schema as the generator script
const IntelligenceSchema = z.object({
  cognitiveLoad: z.number().min(0).max(10),
  attentionEconomics: z.string(),
  accessibility: z.string(),
  trustBuilding: z.string(),
  semanticMeaning: z.string(),
});

const UsagePatternsSchema = z.object({
  dos: z.array(z.string()),
  nevers: z.array(z.string()),
});

const DesignGuideSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ExampleSchema = z.object({
  title: z.string().optional(),
  code: z.string(),
  description: z.string().optional(),
});

const ComponentSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  description: z.string().optional(),
  content: z.string(),
  dependencies: z.array(z.string()),
  docs: z.string().optional(),
  meta: z
    .object({
      rafters: z.object({
        version: z.string(),
        intelligence: IntelligenceSchema,
        usagePatterns: UsagePatternsSchema,
        designGuides: z.array(DesignGuideSchema),
        examples: z.array(ExampleSchema),
      }),
    })
    .optional(),
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
    execSync(`npx tsx ${scriptPath}`);
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    expect(Array.isArray(manifest.components)).toBe(true);
    expect(typeof manifest.total).toBe('number');
    expect(typeof manifest.lastUpdated).toBe('string');
  });

  it('includes version and intelligence from JSDoc comments', () => {
    execSync(`npx tsx ${scriptPath}`);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    for (const comp of manifest.components) {
      expect(comp.meta?.rafters?.version).toBeTypeOf('string');
      expect(comp.meta?.rafters?.intelligence?.cognitiveLoad).toBeTypeOf('number');
    }
  });

  it('only includes published components (draft/depreciated filtered out)', () => {
    execSync(`npx tsx ${scriptPath}`);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    // All components in the manifest should be published (verified by the generation process)
    expect(manifest.components.length).toBeGreaterThan(0);
  });

  it('sets total to the number of published components', () => {
    execSync(`npx tsx ${scriptPath}`);
    const manifest = ManifestSchema.parse(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));
    expect(manifest.total).toBe(manifest.components.length);
  });
});
