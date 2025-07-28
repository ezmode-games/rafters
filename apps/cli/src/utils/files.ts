import fs from 'fs-extra';
const { ensureDirSync, writeFileSync, existsSync, readFileSync } = fs;
import { dirname, join } from 'node:path';

export function ensureDir(path: string): void {
  ensureDirSync(dirname(path));
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
  return join(componentsDir, `${componentName.toLowerCase()}.tsx`);
}

export function createStoryPath(storiesDir: string, componentName: string): string {
  return join(storiesDir, `${componentName.toLowerCase()}-intelligence.stories.tsx`);
}
