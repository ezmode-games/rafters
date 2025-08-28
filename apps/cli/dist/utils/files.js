import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
export function ensureDir(path) {
    const dir = dirname(path);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}
export function writeFile(path, content) {
    ensureDir(path);
    writeFileSync(path, content, 'utf-8');
}
export function fileExists(path) {
    return existsSync(path);
}
export function readFile(path) {
    return readFileSync(path, 'utf-8');
}
export function createComponentPath(componentsDir, componentName) {
    return join(componentsDir, `${componentName}.tsx`);
}
export function createStoryPath(storiesDir, componentName) {
    return join(storiesDir, `${componentName.toLowerCase()}-intelligence.stories.tsx`);
}
