/**
 * Escape key handling primitive
 * Client-only, returns cleanup function
 */

export type EscapeKeyHandler = (event: KeyboardEvent) => void;
export type CleanupFunction = () => void;

/**
 * Listen for Escape key and call handler
 * Returns cleanup function
 */
export function onEscapeKeyDown(handler: EscapeKeyHandler): CleanupFunction {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handler(event);
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
