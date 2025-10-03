/**
 * Project Factory for Real Integration Tests
 * Creates actual framework projects (Next.js, Vite, Remix, etc.) for testing the CLI
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execa } from 'execa';
import fs from 'fs-extra';

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
   * Create a new test project with the specified framework
   */
  static async create(options: ProjectOptions): Promise<TestProject> {
    const {
      framework,
      packageManager = 'pnpm',
      withTailwind = true,
      name = `test-project-${framework}-${Date.now()}-${++ProjectFactory.projectCounter}`,
    } = options;

    const projectPath = join(tmpdir(), 'rafters-cli-tests', name);

    // Ensure parent directory exists
    await fs.ensureDir(join(projectPath, '..'));

    // Remove if exists
    if (await fs.pathExists(projectPath)) {
      await fs.remove(projectPath);
    }

    // Scaffold the project based on framework
    await ProjectFactory.scaffoldFramework(framework, projectPath, packageManager, withTailwind);

    return new TestProject(projectPath, framework, packageManager);
  }

  /**
   * Scaffold a framework project
   */
  private static async scaffoldFramework(
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
    const args = [
      'create-next-app@latest',
      projectPath,
      '--typescript',
      '--app',
      '--no-src-dir',
      '--import-alias',
      '@/*',
      `--${packageManager}`,
    ];

    if (withTailwind) {
      args.push('--tailwind');
    } else {
      args.push('--no-tailwind');
    }

    args.push('--eslint'); // Always include ESLint

    await execa('npx', args, {
      stdio: 'pipe',
      env: {
        ...process.env,
        SKIP_INSTALL: 'true', // Skip npm install during creation
      },
    });

    // Manually install dependencies
    await ProjectFactory.installDependencies(projectPath, packageManager);

    // Upgrade to Tailwind v4 if needed
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
    const args = [
      'create-next-app@latest',
      projectPath,
      '--typescript',
      '--no-app',
      '--no-src-dir',
      '--import-alias',
      '@/*',
      `--${packageManager}`,
    ];

    if (withTailwind) {
      args.push('--tailwind');
    } else {
      args.push('--no-tailwind');
    }

    args.push('--eslint');

    await execa('npx', args, {
      stdio: 'pipe',
      env: {
        ...process.env,
        SKIP_INSTALL: 'true',
      },
    });

    await ProjectFactory.installDependencies(projectPath, packageManager);

    // Upgrade to Tailwind v4 if needed
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
    // Vite expects parent directory to exist, creates the project directory itself
    const projectName = projectPath.split('/').pop() || 'vite-project';
    const parentDir = projectPath.substring(0, projectPath.lastIndexOf('/'));

    await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react-ts'], {
      cwd: parentDir,
      stdio: 'pipe',
    });

    if (withTailwind) {
      // Add Tailwind to Vite project
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
    // React Router v7 uses create-react-router CLI
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

    // Create Astro project with React integration
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

    // Add React integration
    await ProjectFactory.installDependencies(projectPath, packageManager);

    // Add @astrojs/react integration
    const addCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [addCmd, '@astrojs/react', 'react', 'react-dom'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    // Update astro.config to include React
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
    // Install Tailwind dependencies (v4)
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    // Create basic postcss config for Tailwind v4
    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
    await fs.writeFile(join(projectPath, 'postcss.config.js'), postcssConfig);

    // Tailwind v4 uses CSS imports instead of config files
    // Replace existing CSS with Tailwind v4 imports
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
    // Similar to Vite, but for CRA structure
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

    // Install Tailwind v4 (currently in beta as @next)
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
    // Install Tailwind v4
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    // Create PostCSS config for Tailwind v4
    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
    await fs.writeFile(join(projectPath, 'postcss.config.js'), postcssConfig);

    // Add Tailwind v4 CSS import to app root
    const cssPath = join(projectPath, 'app/root.css');
    const tailwindCss = `@import "tailwindcss";
`;

    // Create or replace root.css
    await fs.writeFile(cssPath, tailwindCss);
  }

  /**
   * Add Tailwind CSS to Astro project
   */
  private static async addTailwindToAstro(
    projectPath: string,
    packageManager: PackageManager
  ): Promise<void> {
    // Install Tailwind v4
    const installCmd = packageManager === 'yarn' ? 'add' : 'add';
    await execa(packageManager, [installCmd, '-D', 'tailwindcss@next', '@tailwindcss/postcss'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    // Create PostCSS config for Tailwind v4
    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`;
    await fs.writeFile(join(projectPath, 'postcss.config.js'), postcssConfig);

    // Create global CSS file with Tailwind import
    const cssPath = join(projectPath, 'src/styles/global.css');
    await fs.ensureDir(join(projectPath, 'src/styles'));
    const tailwindCss = `@import "tailwindcss";
`;
    await fs.writeFile(cssPath, tailwindCss);

    // Update astro.config to include Tailwind integration
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
