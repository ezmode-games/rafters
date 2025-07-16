import fs from 'fs-extra';
const { ensureDirSync, writeFileSync, existsSync, readFileSync } = fs;
import { dirname, join } from 'path';
export function ensureDir(path) {
    ensureDirSync(dirname(path));
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
    return join(componentsDir, `${componentName.toLowerCase()}.tsx`);
}
export function createStoryPath(storiesDir, componentName) {
    return join(storiesDir, `${componentName.toLowerCase()}-intelligence.stories.tsx`);
}
