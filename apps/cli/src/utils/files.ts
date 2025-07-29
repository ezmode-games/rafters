import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function ensureDir(path: string): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function writeFile(path: string, content: string): void {
  ensureDir(path);
  writeFileSync(path, content, 'utf-8');
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function readFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

export function createComponentPath(componentsDir: string, componentName: string): string {
  return join(componentsDir, 'ui', `${componentName}.tsx`);
}

export function createStoryPath(storiesDir: string, componentName: string): string {
  return join(storiesDir, `${componentName.toLowerCase()}-intelligence.stories.tsx`);
}
