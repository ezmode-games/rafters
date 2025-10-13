/**
 * CDN Script Loader Utility
 *
 * Loads external JavaScript files from CDN with caching and error handling.
 */

const loadedScripts = new Set<string>();

/**
 * Load a script from CDN
 *
 * @param url - Script URL to load
 * @returns Promise that resolves when script is loaded
 */
export function loadScript(url: string): Promise<void> {
  // Return immediately if already loaded
  if (loadedScripts.has(url)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      loadedScripts.add(url);
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${url}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Load multiple scripts in sequence
 *
 * @param urls - Array of script URLs to load
 * @returns Promise that resolves when all scripts are loaded
 */
export async function loadScripts(urls: string[]): Promise<void> {
  for (const url of urls) {
    await loadScript(url);
  }
}
