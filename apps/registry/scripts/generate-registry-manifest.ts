import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const componentsDir = path.resolve(__dirname, '../../packages/ui/src/components');
const manifestPath = path.resolve(__dirname, '../registry-manifest.json');

const ComponentSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.string(),
  content: z.string(),
  version: z.string(),
  status: z.enum(['published', 'draft', 'depreciated']),
  dependencies: z.array(z.string()),
});

const ManifestSchema = z.object({
  components: z.array(ComponentSchema),
  total: z.number(),
  lastUpdated: z.string(),
});

function getStoriesFlags(name: string) {
  const baseName = name.replace('.tsx', '');
  const storiesDir = path.resolve(
    __dirname,
    `../../packages/ui/src/stories/components/${baseName}`
  );
  const storiesFiles = fs.existsSync(storiesDir)
    ? fs.readdirSync(storiesDir).filter((f) => f.endsWith('.stories.tsx'))
    : [];
  if (storiesFiles.length === 0) return { status: 'published', version: '0.1.0' };
  const mainStoriesFile = storiesFiles[0];
  const storiesPath = path.join(storiesDir, mainStoriesFile);
  if (!fs.existsSync(storiesPath)) return { status: 'published', version: '0.1.0' };
  const content = fs.readFileSync(storiesPath, 'utf8');
  const statusMatch = content.match(/\/\/\s*@componentStatus\s+(published|draft|depreciated)/);
  const versionMatch = content.match(/\/\/\s*@version\s+([\d.]+)/);
  return {
    status: statusMatch ? statusMatch[1] : 'published',
    version: versionMatch ? versionMatch[1] : '0.1.0',
  };
}

function extractDependencies(content: string): string[] {
  const dependencies = new Set<string>();

  // Match import statements for external packages
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const matches = content.match(importRegex) || [];

  for (const matchStr of matches) {
    // Extract the import path from the match string
    const pathMatch = matchStr.match(/from\s+['"]([^'"]+)['"]/);
    if (!pathMatch) continue;

    const importPath = pathMatch[1];

    // Only include external dependencies (not relative imports)
    if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      // Extract package name from scoped packages like @radix-ui/react-progress
      const packageName = importPath.startsWith('@')
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];

      dependencies.add(packageName);
    }
  }

  // Remove common dependencies that are usually already installed
  const commonDeps = new Set([
    'react',
    'react-dom',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ]);
  return Array.from(dependencies).filter((dep) => !commonDeps.has(dep));
}

function getComponentMeta(name: string) {
  const flags = getStoriesFlags(name);
  const content = fs.readFileSync(path.join(componentsDir, name), 'utf8');
  const dependencies = extractDependencies(content);

  return {
    name: name.replace('.tsx', '').toLowerCase(),
    path: `components/ui/${name}`,
    type: 'registry:component',
    content,
    version: flags.version,
    status: flags.status,
    dependencies,
  };
}

const components = fs.readdirSync(componentsDir).filter((file) => file.endsWith('.tsx'));

const publishedComponents = components
  .map(getComponentMeta)
  .filter((c) => c.status === 'published');

const manifest = {
  components: publishedComponents,
  total: publishedComponents.length,
  lastUpdated: new Date().toISOString(),
};

const validatedManifest = ManifestSchema.parse(manifest);
fs.writeFileSync(manifestPath, `${JSON.stringify(validatedManifest, null, 2)}\n`);
console.log('Registry manifest generated:', manifestPath);
