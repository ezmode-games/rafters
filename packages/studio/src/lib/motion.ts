/**
 * Reduced Motion Support
 *
 * Provides a reactive signal for prefers-reduced-motion.
 * When enabled, ALL animation is killed - not reduced, killed.
 */

import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * React hook that tracks prefers-reduced-motion.
 * Returns true when the user prefers reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getReducedMotion);

  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/**
 * Check reduced motion preference synchronously (non-reactive).
 * Use in GSAP factories that run outside React lifecycle.
 */
export function isReducedMotion(): boolean {
  return getReducedMotion();
}
