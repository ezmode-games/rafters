import { execa } from 'execa';
export async function installDependencies(dependencies, packageManager, cwd = process.cwd()) {
    if (dependencies.length === 0)
        return;
    const commands = {
        npm: ['install', ...dependencies],
        yarn: ['add', ...dependencies],
        pnpm: ['add', ...dependencies],
    };
    await execa(packageManager, commands[packageManager], { cwd });
}
export function getCoreDependencies() {
    return ['@radix-ui/react-slot', 'clsx', 'tailwind-merge'];
}
