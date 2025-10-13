/**
 * Framework Adapter Interface
 *
 * Defines the contract for rendering framework components (React, Vue, Svelte)
 * in the r-component-preview web component.
 */

export interface FrameworkAdapter {
  /**
   * Load framework runtime from CDN
   * Should be idempotent - only load once
   */
  loadRuntime(): Promise<void>;

  /**
   * Mount compiled component in container
   *
   * @param container - DOM element to render into
   * @param compiledJs - Compiled component JavaScript module code
   * @param props - Component props
   * @param children - Slot content to pass as children
   */
  mount(
    container: HTMLElement,
    compiledJs: string,
    props: Record<string, unknown>,
    children?: string | null
  ): Promise<void>;

  /**
   * Unmount component and clean up resources
   */
  unmount(): void;
}
