/**
 * React Framework Adapter
 *
 * Handles loading React runtime and mounting React components
 * in the preview web component.
 */

import type { FrameworkAdapter } from './framework-adapter';

// Extend Window interface for runtime globals
// Runtime globals are dynamically loaded and typed, so we use `any` here
declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    React: any;
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    ReactDOM: any;
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    jsxRuntime: any;
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    jsxDevRuntime: any;
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    cva: any;
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    shared: any;
    // biome-ignore lint/suspicious/noExplicitAny: Runtime global
    ComponentPreview: Record<string, any>;
  }
}

export class ReactAdapter implements FrameworkAdapter {
  // biome-ignore lint/suspicious/noExplicitAny: React root type is complex and dynamically loaded
  private root: any = null;
  private blobURL: string | null = null;

  /**
   * Load React and ReactDOM from local dependencies
   */
  async loadRuntime(): Promise<void> {
    // Check if React is already loaded globally
    if (
      typeof window.React !== 'undefined' &&
      typeof window.ReactDOM !== 'undefined' &&
      typeof window.jsxDevRuntime !== 'undefined' &&
      typeof window.cva !== 'undefined' &&
      typeof window.shared !== 'undefined'
    ) {
      return;
    }

    // Import from node_modules via Vite's module resolution
    try {
      const ReactModule = await import('react');
      const ReactDOMModule = await import('react-dom/client');
      const jsxRuntime = await import('react/jsx-runtime');
      const jsxDevRuntime = await import('react/jsx-dev-runtime');
      const cvaModule = await import('class-variance-authority');
      const sharedModule = await import('@rafters/shared');

      // Expose as globals for compiled components
      // IIFE expects these exact global names
      window.React = ReactModule.default || ReactModule;
      window.ReactDOM = ReactDOMModule.default || ReactDOMModule;
      window.jsxRuntime = jsxRuntime;
      window.jsxDevRuntime = jsxDevRuntime;
      window.cva = cvaModule;
      window.shared = sharedModule;
    } catch (err) {
      throw new Error(`Failed to load React runtime from node_modules: ${err}`);
    }
  }

  /**
   * Mount React component in container
   */
  async mount(
    container: HTMLElement,
    compiledJs: string,
    props: Record<string, unknown>,
    children?: string | null
  ): Promise<void> {
    // Execute the IIFE compiled code by creating a script element
    const script = document.createElement('script');
    script.textContent = compiledJs;
    document.head.appendChild(script);

    // Get the component from the global ComponentPreview object
    const ComponentPreview = window.ComponentPreview;
    if (!ComponentPreview) {
      throw new Error('ComponentPreview global not found after script execution');
    }

    // Find the component export dynamically
    // The IIFE exports components as properties (e.g., {Button: ..., Input: ...})
    // biome-ignore lint/suspicious/noExplicitAny: Component type is dynamically determined at runtime
    const Component: any =
      ComponentPreview.default ||
      Object.values(ComponentPreview).find(
        (exp) => typeof exp === 'function' && exp !== Object && exp !== Symbol
      );

    if (!Component) {
      throw new Error(
        `No component found in ComponentPreview global. Available exports: ${Object.keys(ComponentPreview).join(', ')}`
      );
    }

    // Create React root and render component
    const React = window.React;
    const ReactDOM = window.ReactDOM;

    this.root = ReactDOM.createRoot(container);
    this.root.render(React.createElement(Component, props, children));

    // Clean up script element
    script.remove();
  }

  /**
   * Unmount React component and clean up resources
   */
  unmount(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }

    if (this.blobURL) {
      URL.revokeObjectURL(this.blobURL);
      this.blobURL = null;
    }
  }
}
