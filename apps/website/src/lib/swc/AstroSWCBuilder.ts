/**
 * AstroSWCBuilder - Build-time orchestrator for SWC component pipeline
 *
 * Coordinates the complete pipeline at Astro build time:
 * 1. Fetch component from registry
 * 2. Compile TypeScript/JSX with SWC
 * 3. Execute with React SSR
 * 4. Generate static HTML for deployment
 *
 * This is REQUIRED for Cloudflare Workers deployment since the runtime
 * has no filesystem access (no node:fs or node:path).
 */

import type {
	ComponentIntelligence,
	ExecutionResult,
	RegistryComponent,
} from './types';
import { RegistryComponentFetcher } from './RegistryFetcher';
import { ReactSSRExecutor } from './ReactSSRExecutor';
import { SWCCompiler } from './SWCCompiler';

/**
 * Configuration for Astro build-time compilation
 */
export interface AstroBuildConfig {
	/** Component fetch timeout in milliseconds */
	componentTimeout: number;
	/** Enable source maps for debugging */
	enableSourceMaps: boolean;
}

/**
 * Complete build result with all metadata
 */
export interface BuildResult {
	/** Component name */
	componentName: string;
	/** Pre-rendered HTML ready for deployment */
	htmlOutput: string;
	/** Total build time in milliseconds */
	buildTime: number;
	/** Whether result came from cache */
	cacheHit: boolean;
	/** Component intelligence metadata */
	intelligence: ComponentIntelligence | null;
	/** Component props used for rendering */
	props: Record<string, unknown>;
}

/**
 * Error context for build failures
 */
export interface AstroSWCError extends Error {
	name: 'AstroSWCError';
	componentName: string;
	phase: 'fetch' | 'compile' | 'execute';
	originalError: Error;
}

/**
 * Orchestrates SWC pipeline at Astro build time
 *
 * Pre-renders components to static HTML during build so they can be
 * deployed to Cloudflare Workers without filesystem access.
 */
export class AstroSWCBuilder {
	private config: AstroBuildConfig;
	private fetcher: RegistryComponentFetcher;
	private compiler: SWCCompiler;
	private executor: ReactSSRExecutor;
	private initialized = false;

	constructor(config: Partial<AstroBuildConfig> = {}) {
		this.config = {
			componentTimeout: config.componentTimeout ?? 5000,
			enableSourceMaps: config.enableSourceMaps ?? false,
		};

		this.fetcher = new RegistryComponentFetcher({
			baseUrl: 'https://rafters.realhandy.tech',
			timeout: this.config.componentTimeout,
		});

		this.compiler = new SWCCompiler();
		this.executor = new ReactSSRExecutor();
	}

	/**
	 * Initialize compiler (must be called before building)
	 */
	async init(): Promise<void> {
		if (!this.initialized) {
			await this.compiler.init();
			this.initialized = true;
		}
	}

	/**
	 * Build a single component preview at build time
	 *
	 * @param componentName - Component to build
	 * @param props - Props to pass to component
	 * @returns Complete build result with pre-rendered HTML
	 */
	async buildComponentPreview(
		componentName: string,
		props: Record<string, unknown> = {},
	): Promise<BuildResult> {
		if (!this.initialized) {
			await this.init();
		}

		return this.executeFullPipeline(componentName, props);
	}

	/**
	 * Build multiple components in parallel
	 *
	 * @param components - Array of components to build
	 * @returns Map of component names to build results
	 */
	async buildMultipleComponents(
		components: Array<{ name: string; props?: Record<string, unknown> }>,
	): Promise<Map<string, BuildResult>> {
		if (!this.initialized) {
			await this.init();
		}

		const results = await Promise.allSettled(
			components.map(({ name, props = {} }) =>
				this.executeFullPipeline(name, props),
			),
		);

		const resultMap = new Map<string, BuildResult>();

		for (let i = 0; i < results.length; i++) {
			const result = results[i];
			const componentName = components[i].name;

			if (result.status === 'fulfilled') {
				resultMap.set(componentName, result.value);
			} else {
				// Log error but continue with other components
				console.error(
					`Failed to build ${componentName}:`,
					result.reason,
				);
			}
		}

		return resultMap;
	}

	/**
	 * Execute complete pipeline: Fetch → Compile → Execute
	 */
	private async executeFullPipeline(
		componentName: string,
		props: Record<string, unknown>,
	): Promise<BuildResult> {
		const startTime = Date.now();

		try {
			// Phase 1: Fetch component source from registry
			const fetchResult =
				await this.fetcher.fetchComponent(componentName);
			const component = fetchResult.component;
			const intelligence = this.extractIntelligence(component);

			// Get main component file
			const componentFile = component.files.find(
				(f) => f.type === 'registry:ui' || f.type === 'component',
			);

			if (!componentFile) {
				throw this.createError(
					componentName,
					'fetch',
					new Error(
						`No component file found in registry for ${componentName}`,
					),
				);
			}

			// Phase 2: Compile TypeScript/JSX with SWC
			const compileResult = await this.compiler.compile(
				componentFile.content,
				{
					filename: componentFile.path,
				},
			);

			// Phase 3: Execute component with React SSR
			const executeResult = await this.executor.execute(
				compileResult.code,
				props,
				{
					componentName,
				},
			);

			const buildTime = Date.now() - startTime;

			return {
				componentName,
				htmlOutput: executeResult.html,
				buildTime,
				cacheHit: fetchResult.fromCache && compileResult.cacheHit,
				intelligence,
				props: executeResult.props,
			};
		} catch (error) {
			if ((error as AstroSWCError).name === 'AstroSWCError') {
				throw error;
			}

			// Determine phase from error type
			const phase = this.determineErrorPhase(error);
			throw this.createError(componentName, phase, error as Error);
		}
	}

	/**
	 * Extract intelligence metadata from component
	 */
	private extractIntelligence(
		component: RegistryComponent,
	): ComponentIntelligence | null {
		return component.meta?.rafters?.intelligence ?? null;
	}

	/**
	 * Determine which pipeline phase failed based on error
	 */
	private determineErrorPhase(
		error: unknown,
	): 'fetch' | 'compile' | 'execute' {
		const errorName = (error as Error).name;

		if (errorName === 'RegistryError') {
			return 'fetch';
		}
		if (errorName === 'CompilationError') {
			return 'compile';
		}
		if (errorName === 'ExecutionError') {
			return 'execute';
		}

		// Default to execute phase for unknown errors
		return 'execute';
	}

	/**
	 * Create structured error with context
	 */
	private createError(
		componentName: string,
		phase: 'fetch' | 'compile' | 'execute',
		originalError: Error,
	): AstroSWCError {
		const error = new Error(
			`Build pipeline failed for ${componentName} during ${phase}: ${originalError.message}`,
		) as AstroSWCError;

		error.name = 'AstroSWCError';
		error.componentName = componentName;
		error.phase = phase;
		error.originalError = originalError;

		return error;
	}
}