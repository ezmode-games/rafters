declare const _default: (
	| string
	| {
			plugins: Promise<import("vite").Plugin<any>[]>[];
			optimizeDeps: {
				include: string[];
			};
			test: {
				name: string;
				browser: {
					enabled: boolean;
					headless: boolean;
					provider: string;
					instances: {
						browser: string;
					}[];
					screenshotFailures: boolean;
					slowHijackESM: boolean;
				};
				setupFiles: string[];
				testTimeout: number;
				hookTimeout: number;
			};
	  }
)[];
export default _default;
//# sourceMappingURL=vitest.workspace.d.ts.map
