/**
 * ID generation primitive for ARIA relationships
 * SSR-safe with deterministic IDs
 */

let idCounter = 0;

/**
 * Generate unique ID for component instance
 * SSR-safe: deterministic IDs across server/client
 */
export function generateId(prefix = 'ui'): string {
  // In SSR, we want deterministic IDs
  if (typeof window === 'undefined') {
    return `${prefix}-ssr-${idCounter++}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Reset ID counter (useful for testing)
 */
export function resetIdCounter(): void {
  idCounter = 0;
}
