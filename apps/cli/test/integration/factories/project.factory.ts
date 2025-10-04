/**
 * Project Factory for Real Integration Tests
 * Creates actual framework projects (Next.js, Vite, Remix, etc.) for testing the CLI
 */

import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type FrameworkType =
  | 'nextjs-app'
  | 'nextjs-pages'
  | 'vite-react'
  | 'react-router'
  | 'astro'
  | 'cra';
export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export interface ProjectOptions {
  framework: FrameworkType;
  packageManager?: PackageManager;
  withTailwind?: boolean;
  name?: string;
}

export class TestProject {
  constructor(
    public readonly path: string,
    public readonly framework: FrameworkType,
    public readonly packageManager: PackageManager
  ) {}

  /**
   * Read a file from the project
   */
  async readFile(relativePath: string): Promise<string> {
    const filePath = join(this.path, relativePath);
    return fs.readFile(filePath, 'utf-8');
  }

  /**
   * Write a file to the project
   */
  async writeFile(relativePath: string, content: string): Promise<void> {
    const filePath = join(this.path, relativePath);
    await fs.ensureDir(join(filePath, '..'));
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Check if a file exists
   */
  async fileExists(relativePath: string): Promise<boolean> {
    const filePath = join(this.path, relativePath);
    return fs.pathExists(filePath);
  }

  /**
   * List files in a directory
   */
  async listFiles(relativePath: string): Promise<string[]> {
    const dirPath = join(this.path, relativePath);
    if (!(await fs.pathExists(dirPath))) {
      return [];
    }
    return fs.readdir(dirPath);
  }

  /**
   * Read package.json
   */
  async readPackageJson(): Promise<Record<string, unknown>> {
    const content = await this.readFile('package.json');
    return JSON.parse(content);
  }

  /**
   * Write package.json
   */
  async writePackageJson(data: Record<string, unknown>): Promise<void> {
    await this.writeFile('package.json', JSON.stringify(data, null, 2));
  }

  /**
   * Clean up the project directory
   */
  async cleanup(): Promise<void> {
    await fs.remove(this.path);
  }

  /**
   * Run a command in the project directory
   */
  async run(command: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
    const result = await execa(command, args, {
      cwd: this.path,
      reject: false,
    });
    return {
      stdout: result.stdout,
      stderr: result.stderr,
    };
  }
}

// biome-ignore lint/complexity/noStaticOnlyClass: Factory pattern for test scaffolding
export class ProjectFactory {
  private static projectCounter = 0;

  /**
   * Create a new test project from static fixtures
   * Copies from test/fixtures/apps/ to temp directory for testing
   */
  static async create(options: ProjectOptions): Promise<TestProject> {
    const { framework, packageManager = 'pnpm', withTailwind = true, name } = options;

    // Get fixture path from test/fixtures/apps/
    const fixtureName = `${framework}${withTailwind ? '-tw' : ''}`;
    const fixturePath = join(__dirname, '../../fixtures/apps', fixtureName);

    // Verify fixture exists
    if (!(await fs.pathExists(fixturePath))) {
      throw new Error(
        `Fixture not found: ${fixturePath}\nRun: pnpm test:generate-fixtures to create it`
      );
    }

    // Copy fixture to test directory
    const testName =
      name || `test-project-${framework}-${Date.now()}-${++ProjectFactory.projectCounter}`;
    const projectPath = join(tmpdir(), 'rafters-cli-tests', testName);

    // Ensure parent directory exists and remove any existing project
    await fs.ensureDir(join(projectPath, '..'));

    // Force remove with retry for race conditions
    if (await fs.pathExists(projectPath)) {
      await fs.remove(projectPath);
      // Wait a tick to ensure filesystem operations complete
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Copy fixture to test location, excluding node_modules, .next, dist, etc.
    await fs.copy(fixturePath, projectPath, {
      filter: (src) => {
        const relativePath = src.replace(fixturePath, '');
        return !/node_modules|\.next|dist|\.turbo|\.astro/.test(relativePath);
      },
    });

    return new TestProject(projectPath, framework, packageManager);
  }

  /**
   * Scaffold a framework project (used by fixture generator)
   * Public method for generating static fixtures
   */
  static async scaffoldFramework(
    framework: FrameworkType,
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    switch (framework) {
      case 'nextjs-app':
        await ProjectFactory.scaffoldNextJsApp(projectPath, packageManager, withTailwind);
        break;
      case 'nextjs-pages':
        await ProjectFactory.scaffoldNextJsPages(projectPath, packageManager, withTailwind);
        break;
      case 'vite-react':
        await ProjectFactory.scaffoldVite(projectPath, packageManager, withTailwind);
        break;
      case 'react-router':
        await ProjectFactory.scaffoldReactRouter(projectPath, packageManager, withTailwind);
        break;
      case 'astro':
        await ProjectFactory.scaffoldAstro(projectPath, packageManager, withTailwind);
        break;
      case 'cra':
        await ProjectFactory.scaffoldCRA(projectPath, packageManager, withTailwind);
        break;
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  /**
   * Scaffold Next.js App Router project
   */
  private static async scaffoldNextJsApp(
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    const projectName = projectPath.split('/').pop() || 'nextjs-app-project';
    const parentDir = projectPath.substring(0, projectPath.lastIndexOf('/'));

    const args = [
      '--yes',
      'create-next-app@latest',
      projectName,
      '--typescript',
      '--app',
      '--no-src-dir',
      '--import-alias',
      '@/*',
      `--${packageManager}`,
      '--no-turbopack',
    ];

    if (withTailwind) {
      args.push('--tailwind');
    } else {
      args.push('--no-tailwind');
    }

    args.push('--eslint');

    const result = await execa('npx', args, {
      cwd: parentDir,
      stdio: 'pipe',
      reject: false,
    });

    if (result.exitCode !== 0) {
      console.error('create-next-app STDOUT:', result.stdout);
      console.error('create-next-app STDERR:', result.stderr);
      throw new Error(`create-next-app failed with code ${result.exitCode}`);
    }

    await ProjectFactory.installDependencies(projectPath, packageManager);

    if (withTailwind) {
      await ProjectFactory.upgradeTailwindV4(projectPath, packageManager);
    }
  }

  /**
   * Scaffold Next.js Pages Router project
   */
  private static async scaffoldNextJsPages(
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    const projectName = projectPath.split('/').pop() || 'nextjs-pages-project';
    const parentDir = projectPath.substring(0, projectPath.lastIndexOf('/'));

    const args = [
      '--yes',
      'create-next-app@latest',
      projectName,
      '--typescript',
      '--no-app',
      '--no-src-dir',
      '--import-alias',
      '@/*',
      `--${packageManager}`,
      '--no-turbopack',
    ];

    if (withTailwind) {
      args.push('--tailwind');
    } else {
      args.push('--no-tailwind');
    }

    args.push('--eslint');

    await execa('npx', args, {
      cwd: parentDir,
      stdio: 'inherit',
    });

    await ProjectFactory.installDependencies(projectPath, packageManager);

    if (withTailwind) {
      await ProjectFactory.upgradeTailwindV4(projectPath, packageManager);
    }
  }

  /**
   * Scaffold Vite + React project
   */
  private static async scaffoldVite(
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    const projectName = projectPath.split('/').pop() || 'vite-project';
    const parentDir = projectPath.substring(0, projectPath.lastIndexOf('/'));

    await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react-ts'], {
      cwd: parentDir,
      stdio: 'pipe',
    });

    if (withTailwind) {
      await ProjectFactory.installDependencies(projectPath, packageManager);
      await ProjectFactory.addTailwindToVite(projectPath, packageManager);
    } else {
      await ProjectFactory.installDependencies(projectPath, packageManager);
    }
  }

  /**
   * Scaffold React Router v7 project
   */
  private static async scaffoldReactRouter(
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    const projectName = projectPath.split('/').pop() || 'react-router-project';
    const parentDir = projectPath.substring(0, projectPath.lastIndexOf('/'));

    await execa('npm', ['create', 'react-router@latest', projectName, '--', '--typescript'], {
      cwd: parentDir,
      stdio: 'pipe',
    });

    if (withTailwind) {
      await ProjectFactory.installDependencies(projectPath, packageManager);
      await ProjectFactory.addTailwindToReactRouter(projectPath, packageManager);
    } else {
      await ProjectFactory.installDependencies(projectPath, packageManager);
    }
  }

  /**
   * Scaffold Astro project
   */
  private static async scaffoldAstro(
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    const projectName = projectPath.split('/').pop() || 'astro-project';
    const parentDir = projectPath.substring(0, projectPath.lastIndexOf('/'));

    await execa(
      'npm',
      [
        'create',
        'astro@latest',
        projectName,
        '--',
        '--template',
        'minimal',
        '--typescript',
        'strict',
        '--no-install',
        '--no-git',
      ],
      {
        cwd: parentDir,
        stdio: 'pipe',
      }
    );

    await ProjectFactory.installDependencies(projectPath, packageManager);

    const addCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [addCmd, '@astrojs/react', 'react', 'react-dom'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    const astroConfig = `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});`;
    await fs.writeFile(join(projectPath, 'astro.config.mjs'), astroConfig);

    if (withTailwind) {
      await ProjectFactory.addTailwindToAstro(projectPath, packageManager);
    }
  }

  /**
   * Scaffold Create React App project
   */
  private static async scaffoldCRA(
    projectPath: string,
    packageManager: PackageManager,
    withTailwind: boolean
  ): Promise<void> {
    await execa('npx', ['create-react-app', projectPath, '--template', 'typescript'], {
      stdio: 'pipe',
    });

    if (withTailwind) {
      await ProjectFactory.addTailwindToCRA(projectPath, packageManager);
    }
  }

  /**
   * Install dependencies in a project
   */
  private static async installDependencies(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    const installCommand = packageManager === 'yarn' ? 'install' : 'install';

    // Create pnpm-workspace.yaml to isolate this project from parent workspace
    if (packageManager === 'pnpm') {
      const pnpmWorkspacePath = join(projectPath, 'pnpm-workspace.yaml');
      await fs.writeFile(pnpmWorkspacePath, 'packages: []\n');

      const npmrcPath = join(projectPath, '.npmrc');
      await fs.writeFile(npmrcPath, 'shamefully-hoist=true\nauto-install-peers=true\n');
    }

    await execa(packageManager, [installCommand], {
      cwd: projectPath,
      stdio: 'pipe',
    });
  }

  /**
   * Add Tailwind CSS to Vite project
   */
  private static async addTailwindToVite(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
    await fs.writeFile(join(projectPath, 'postcss.config.js'), postcssConfig);

    const cssPath = join(projectPath, 'src/index.css');
    const tailwindCss = `@import "tailwindcss";
`;
    await fs.writeFile(cssPath, tailwindCss);
  }

  /**
   * Add Tailwind CSS to CRA project
   */
  private static async addTailwindToCRA(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    await execa('npx', ['tailwindcss', 'init'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await fs.writeFile(join(projectPath, 'tailwind.config.js'), tailwindConfig);

    const cssPath = join(projectPath, 'src/index.css');
    const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
    const existingCss = await fs.readFile(cssPath, 'utf-8');
    await fs.writeFile(cssPath, tailwindDirectives + existingCss);
  }

  /**
   * Upgrade project to Tailwind CSS v4
   */
  private static async upgradeTailwindV4(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';

    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next'], {
      cwd: projectPath,
      stdio: 'pipe',
    });
  }

  /**
   * Add Tailwind CSS to React Router v7 project
   */
  private static async addTailwindToReactRouter(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
    await fs.writeFile(join(projectPath, 'postcss.config.js'), postcssConfig);

    const cssPath = join(projectPath, 'app/root.css');
    const tailwindCss = `@import "tailwindcss";
`;

    await fs.writeFile(cssPath, tailwindCss);
  }

  /**
   * Add Tailwind CSS to Astro project
   */
  private static async addTailwindToAstro(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next', '@tailwindcss/postcss'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
    await fs.writeFile(join(projectPath, 'postcss.config.js'), postcssConfig);

    const cssPath = join(projectPath, 'src/styles/global.css');
    await fs.ensureDir(join(projectPath, 'src/styles'));
    const tailwindCss = `@import "tailwindcss";
`;
    await fs.writeFile(cssPath, tailwindCss);

    const astroConfig = `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: {
    css: {
      postcss: './postcss.config.js',
    },
  },
});`;
    await fs.writeFile(join(projectPath, 'astro.config.mjs'), astroConfig);
  }
}
